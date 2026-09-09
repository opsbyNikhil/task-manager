import resend

from django.conf import settings


# Configure Resend
resend.api_key = settings.RESEND_API_KEY


def send_email(to_email, subject, html):
    """
    Send an email using Resend.
    """

    params = {
        "from": settings.RESEND_FROM_EMAIL,
        "to": [to_email],
        "subject": subject,
        "html": html,
    }

    try:
        response = resend.Emails.send(params)
        return response

    except Exception as e:
        print(f"Resend email error: {e}")
        raise