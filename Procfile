release: python manage.py makemigrations
release: python manage.py migrate

web: gunicorn tribune.wsgi --log-file -