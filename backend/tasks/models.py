from django.db import models
from django.contrib.auth.models import User


# =========================
# USER PROFILE
# =========================
class UserProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    mobile = models.CharField(
        max_length=15,
        unique=True,
    )

    def __str__(self):
        return self.user.email


# =========================
# OTP VERIFICATION
# =========================
class OTPVerification(models.Model):

    PURPOSE_CHOICES = [
        ("registration", "Registration"),
        ("login", "Login"),
    ]

    email = models.EmailField()
    otp_hash = models.CharField(max_length=128)

    purpose = models.CharField(
        max_length=20,
        choices=PURPOSE_CHOICES,
    )

    first_name = models.CharField(
        max_length=150,
        blank=True,
    )

    last_name = models.CharField(
        max_length=150,
        blank=True,
    )

    mobile = models.CharField(
        max_length=15,
        blank=True,
    )

    expires_at = models.DateTimeField()

    attempts = models.PositiveIntegerField(
        default=0,
    )

    is_verified = models.BooleanField(
        default=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return f"{self.email} - {self.purpose}"


# =========================
# TASK
# =========================
class Task(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="tasks",
        null=True,
        blank=True,
    )

    title = models.CharField(
        max_length=200,
    )

    description = models.TextField(
        blank=True,
    )

    completed = models.BooleanField(
        default=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return self.title