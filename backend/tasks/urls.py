from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    TaskViewSet,
    RegisterView,
    VerifyRegistrationOTPView,
    LoginOTPView,
    VerifyLoginOTPView,
    test_email,health_check
)


router = DefaultRouter()

router.register(
    "tasks",
    TaskViewSet,
    basename="tasks",
)


urlpatterns = [
    path(
        "auth/register/",
        RegisterView.as_view(),
        name="register",
    ),

    path(
        "test-email/",
        test_email,
    ),

    path(
        "auth/verify-registration-otp/",
        VerifyRegistrationOTPView.as_view(),
        name="verify-registration-otp",
    ),

    path(
        "auth/login/",
        LoginOTPView.as_view(),
        name="login",
    ),

    path(
        "auth/verify-login-otp/",
        VerifyLoginOTPView.as_view(),
        name="verify-login-otp",
    ),

    path("health/", health_check, name="health"),

]

urlpatterns += router.urls