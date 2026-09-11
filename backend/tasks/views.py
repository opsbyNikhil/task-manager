import hashlib

from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.db import transaction
from django.utils import timezone

from rest_framework import viewsets, generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Task, OTPVerification, UserProfile
from .serializers import TaskSerializer, RegistrationSerializer,VerifyRegistrationOTPSerializer, LoginOTPSerializer, VerifyLoginOTPSerializer
from .services.email_service import send_email
from .services.otp_service import (
    generate_otp,
    hash_otp,
    get_otp_expiry,
    verify_otp
)




class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(
            user=self.request.user
        ).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# =========================
# REGISTRATION - SEND OTP
# =========================
class RegisterView(generics.CreateAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        email = data["email"]
        first_name = data["first_name"]
        last_name = data["last_name"]
        mobile = data["mobile"]

        # Generate OTP
        otp = generate_otp()

        # Store hashed OTP
        OTPVerification.objects.filter(
            email=email,
            purpose="registration",
            is_verified=False,
        ).update(
            is_verified=True
        )

        OTPVerification.objects.create(
            email=email,
            otp_hash=hash_otp(otp),
            purpose="registration",
            first_name=first_name,
            last_name=last_name,
            mobile=mobile,
            expires_at=get_otp_expiry(),
        )

        # Send OTP
        send_email(
            to_email=email,
            subject="Task Manager - Registration OTP",
            html=f"""
                <h2>Task Manager</h2>

                <p>Hello {first_name},</p>

                <p>Your registration OTP is:</p>

                <h1>{otp}</h1>

                <p>This OTP is valid for 5 minutes.</p>

                <p>If you did not request this OTP,
                please ignore this email.</p>
            """,
        )

        return Response(
            {
                "message": "OTP sent successfully to your email."
            },
            status=status.HTTP_200_OK,
        )


# =========================
# TEST EMAIL
# =========================
from rest_framework.decorators import api_view


@api_view(["POST"])
def test_email(request):
    email = request.data.get("email")

    if not email:
        return Response(
            {"error": "Email is required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        send_email(
            to_email=email,
            subject="Task Manager - Resend Test",
            html="""
                <h2>Resend Email Test</h2>
                <p>Congratulations!</p>
                <p>Your Django Task Manager backend
                successfully sent an email using Resend.</p>
            """,
        )

        return Response({
            "message": "Test email sent successfully"
        })

    except Exception as e:
        return Response(
            {
                "error": "Failed to send email",
                "details": str(e),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

# =========================
# VERIFY REGISTRATION OTP
# =========================
class VerifyRegistrationOTPView(generics.GenericAPIView):
    serializer_class = VerifyRegistrationOTPSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"].lower().strip()
        otp = serializer.validated_data["otp"]

        # Get latest unverified registration OTP
        otp_record = (
            OTPVerification.objects
            .filter(
                email=email,
                purpose="registration",
                is_verified=False,
            )
            .order_by("-created_at")
            .first()
        )

        if not otp_record:
            return Response(
                {
                    "error": "No active OTP found. Please request a new OTP."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check expiration
        if timezone.now() > otp_record.expires_at:
            return Response(
                {
                    "error": "OTP has expired. Please request a new OTP."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check maximum attempts
        if otp_record.attempts >= 5:
            return Response(
                {
                    "error": "Too many incorrect attempts. Please request a new OTP."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verify OTP
        if not verify_otp(
            otp,
            otp_record.otp_hash,
        ):
            otp_record.attempts += 1
            otp_record.save(update_fields=["attempts"])

            return Response(
                {
                    "error": "Invalid OTP."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create user and profile
        with transaction.atomic():

            username = email

            user = User.objects.create_user(
                username=username,
                email=email,
                first_name=otp_record.first_name,
                last_name=otp_record.last_name,
            )

            UserProfile.objects.create(
                user=user,
                mobile=otp_record.mobile,
            )

            otp_record.is_verified = True
            otp_record.save(update_fields=["is_verified"])

        return Response(
            {
                "message": "Registration completed successfully.",
            },
            status=status.HTTP_201_CREATED,
        )


# =========================
# SEND LOGIN OTP
# =========================
class LoginOTPView(generics.GenericAPIView):
    serializer_class = LoginOTPSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        # Check whether user exists
        user = User.objects.filter(
            email__iexact=email
        ).first()

        if not user:
            return Response(
                {
                    "error": "No account found with this email."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # Generate OTP
        otp = generate_otp()

        # Invalidate previous login OTPs
        OTPVerification.objects.filter(
            email=email,
            purpose="login",
            is_verified=False,
        ).update(is_verified=True)

        # Store new OTP
        OTPVerification.objects.create(
            email=email,
            otp_hash=hash_otp(otp),
            purpose="login",
            expires_at=get_otp_expiry(),
        )

        # Send OTP
        send_email(
            to_email=email,
            subject="Task Manager - Login OTP",
            html=f"""
                <h2>Task Manager</h2>

                <p>Hello {user.first_name or 'User'},</p>

                <p>Your login OTP is:</p>

                <h1>{otp}</h1>

                <p>This OTP is valid for 5 minutes.</p>

                <p>If you did not request this OTP,
                please ignore this email.</p>
            """,
        )

        return Response(
            {
                "message": "Login OTP sent successfully."
            },
            status=status.HTTP_200_OK,
        )


# =========================
# VERIFY LOGIN OTP
# =========================
class VerifyLoginOTPView(generics.GenericAPIView):
    serializer_class = VerifyLoginOTPSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        otp = serializer.validated_data["otp"]

        # Find latest unverified login OTP
        otp_record = (
            OTPVerification.objects
            .filter(
                email=email,
                purpose="login",
                is_verified=False,
            )
            .order_by("-created_at")
            .first()
        )

        if not otp_record:
            return Response(
                {
                    "error": "No active OTP found. Please request a new OTP."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check expiration
        if timezone.now() > otp_record.expires_at:
            return Response(
                {
                    "error": "OTP has expired. Please request a new OTP."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check maximum attempts
        if otp_record.attempts >= 5:
            return Response(
                {
                    "error": "Too many incorrect attempts. Please request a new OTP."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verify OTP
        if not verify_otp(
            otp,
            otp_record.otp_hash,
        ):
            otp_record.attempts += 1
            otp_record.save(update_fields=["attempts"])

            return Response(
                {
                    "error": "Invalid OTP."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Find user
        user = User.objects.filter(
            email__iexact=email
        ).first()

        if not user:
            return Response(
                {
                    "error": "User account not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)

        # Mark OTP as used
        otp_record.is_verified = True
        otp_record.save(update_fields=["is_verified"])

        return Response(
            {
                "message": "Login successful.",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_200_OK,
        )

@api_view(["GET"])
def health_check(request):
    return Response(
        {
            "status": "healthy",
            "service": "task-manager-backend"
        },
        status=status.HTTP_200_OK
    )