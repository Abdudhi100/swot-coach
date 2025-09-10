"""
Django settings for swot-coach project (optimized for Next.js dev).
"""

import os
from pathlib import Path

# ----------------------
# BASE
# ----------------------
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "dev-secret-key")
DEBUG = os.environ.get("DJANGO_DEBUG", "1") == "1"
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "*").split(",")

# ----------------------
# INSTALLED APPS
# ----------------------
INSTALLED_APPS = [
    "corsheaders",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # 3rd party
    "rest_framework",
    "rest_framework.authtoken",
    
    "django_rest_passwordreset",
    "django_extensions",
    "django_q",

    # local apps
    "core",
]

# ----------------------
# MIDDLEWARE
# ----------------------
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# ----------------------
# DATABASE
# ----------------------
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("POSTGRES_DB", "swot_db"),
        "USER": os.environ.get("POSTGRES_USER", "postgres"),
        "PASSWORD": os.environ.get("POSTGRES_PASSWORD", "08068166679Aa."),
        "HOST": os.environ.get("POSTGRES_HOST", "localhost"),
        "PORT": os.environ.get("POSTGRES_PORT", "5432"),
    }
}

# ----------------------
# AUTH / PASSWORD
# ----------------------
AUTH_USER_MODEL = "core.User"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.BasicAuthentication",  # optional
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",  # or AllowAny if you’re testing
    ],
}

# ----------------------
# INTERNATIONALIZATION
# ----------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# ----------------------
# STATIC FILES
# ----------------------
STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ----------------------
# EMAIL (DEV)
# ----------------------
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
DEFAULT_FROM_EMAIL = "no-reply@swotcoach.com"

# ----------------------
# CORS & CSRF for Next.js dev
# ----------------------



# Cookie settings for dev (Next.js can read CSRF token)
SESSION_COOKIE_SAMESITE = None
CSRF_COOKIE_SAMESITE = None

SESSION_COOKIE_SECURE = False


# ----------------------
# Django Q
# ----------------------
Q_CLUSTER = {
    "name": "swotcoach",
    "workers": 4,
    "timeout": 90,
    "retry": 120,
    "queue_limit": 500,
    "bulk": 10,
    "compress": True,
    "catch_up": False,
    "redis": {
        "host": os.environ.get("REDIS_HOST", "127.0.0.1"),
        "port": int(os.environ.get("REDIS_PORT", 6379)),
        "db": int(os.environ.get("REDIS_DB", 0)),
        "password": os.environ.get("REDIS_PASSWORD", None),
    },
}
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CSRF_COOKIE_HTTPONLY = False   # frontend JS (axios) needs access
CSRF_COOKIE_SECURE = False     # set to True only in production with HTTPS
CSRF_TRUSTED_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]
CORS_ALLOW_CREDENTIALS = True
# o+xk3cf8xve-k++)%6g@bxdcd12qhjn+)517gkv=0p%#avk+wh