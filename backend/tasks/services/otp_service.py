import hashlib
import secrets

from datetime import timedelta

from django.utils import timezone


OTP_EXPIRY_MINUTES = 5


def generate_otp():
    """
    Generate a secure 6-digit OTP.
    """
    return f"{secrets.randbelow(1_000_000):06d}"


def hash_otp(otp):
    """
    Hash OTP before storing it in the database.
    """
    return hashlib.sha256(
        otp.encode("utf-8")
    ).hexdigest()


def get_otp_expiry():
    """
    Return OTP expiration time.
    """
    return timezone.now() + timedelta(
        minutes=OTP_EXPIRY_MINUTES
    )


def verify_otp(otp, otp_hash):
    """
    Compare entered OTP with stored hash.
    """
    return hash_otp(otp) == otp_hash