#!/bin/sh

set -e

echo "Running database migrations....."
python manage.py migrate --noinput

echo "Creating superuser if it does not exist....."

python manage.py shell <<EOF
from django.contrib.auth import get_user_model

User = get_user_model()

username = "admin"
email = "admin@gmail.com"
password = "admin@12345"

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(
        username=username,
        email=email,
        password=password
    )
    print("Superuser created successfully.")
else:
    print("Superuser already exists.")
EOF

echo "Collecting static files....."
python manage.py collectstatic --noinput

echo "Running Django Server....."
exec python manage.py runserver 0.0.0.0:8000