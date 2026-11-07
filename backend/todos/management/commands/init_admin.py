import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = 'Idempotently creates or updates the Django Admin superuser.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--username',
            type=str,
            default=os.getenv('DJANGO_SUPERUSER_USERNAME', 'admin'),
            help='Admin username (defaults to DJANGO_SUPERUSER_USERNAME or "admin")'
        )
        parser.add_argument(
            '--email',
            type=str,
            default=os.getenv('DJANGO_SUPERUSER_EMAIL', 'admin@example.com'),
            help='Admin email (defaults to DJANGO_SUPERUSER_EMAIL or "admin@example.com")'
        )
        parser.add_argument(
            '--password',
            type=str,
            default=os.getenv('DJANGO_SUPERUSER_PASSWORD', 'Admin@12345'),
            help='Admin password (defaults to DJANGO_SUPERUSER_PASSWORD or "Admin@12345")'
        )

    def handle(self, *args, **options):
        username = options['username']
        email = options['email']
        password = options['password']

        User = get_user_model()

        if not username or not password:
            self.stderr.write(self.style.ERROR('Username and password must not be empty.'))
            return

        user = User.objects.filter(username=username).first()

        if user:
            user.set_password(password)
            user.email = email
            user.is_superuser = True
            user.is_staff = True
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Superuser '{username}' updated successfully."))
        else:
            User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            self.stdout.write(self.style.SUCCESS(f"Superuser '{username}' created successfully."))
