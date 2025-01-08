from pathlib import Path
from datetime import timedelta
import os
from decouple import config


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
#SECRET_KEY = 'django-insecure-n)6b+&8-hry$97lq(e_7ah8r!q8om)g+9!87d(j-u_s3n&eb%i'
SECRET_KEY = config('DJANGO_SECRET_KEY', default='unsafe-secret-key')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DJANGO_DEBUG', default=True, cast=bool)

ALLOWED_HOSTS = config('DJANGO_ALLOWED_HOST', default='*').split(',')



# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'core',
    'shop_app',
    'rest_framework',
    'corsheaders',
    'mpesa_api',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Added this for the mpesa api
MPESA_CONFIG = {
    'CONSUMER_KEY': config('MPESA_CONSUMER_KEY'),
    'CONSUMER_SECRET': config('MPESA_CONSUMER_SECRET'),
    'CERTIFICATE_FILE': None,
    'HOST_NAME': config('MPESA_HOST_NAME'),
    'PASS_KEY': config('MPESA_PASS_KEY'),
    'SAFARICOM_API': 'https://sandbox.safaricom.co.ke', #This is the base url for safaricom apis
    'AUTH_URL': '/oauth/v1/generate?grant_type=client_credentials',
    'SHORT_CODE': config('MPESA_SHORT_CODE'),
    'TILL_NUMBER': None,
    'TRANSACTION_TYPE': config('MPESA_TRANSACTION_TYPE'),
}

CORS_ALLOWED_ORIGINS = [
"http://localhost:5173",
"http://localhost:5174",
"http://localhost:5175",
]

FRONTEND_URL = "http://localhost:5173"

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
}

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR / "templates",
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

"""
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
"""

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': config('DB_NAME', default='your_database_name'),
        'USER': config('DB_USER', default='your_username'),
        'PASSWORD': config('DB_PASSWORD', default='your_password'),
        'HOST': config('DB_HOST', default='localhost'),  # Usually '127.0.0.1' or your DB server's IP
        'PORT': config('DB_PORT', default='3306'),  # Default MySQL port
    }
}


EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = config('HOST_EMAIL', default='email@gmail.com')
EMAIL_HOST_PASSWORD = config('HOST_EMAIL_PASSWORD', default='your_password')
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER



# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

# Added this recently - TO check
#USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'
MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR/"media"

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'core.CustomUser'