from django.urls import path, include
from .views import SignupView, LoginView, logout_view, csrf_view, me_view

urlpatterns = [
    path("signup/", SignupView.as_view()),          # POST /api/auth/signup/
    path("login/", LoginView.as_view()),            # POST /api/auth/login/
    path("logout/", logout_view),                   # POST /api/auth/logout/
    path("csrf/", csrf_view),                       # GET /api/auth/csrf/
    path("me/", me_view),                           # GET /api/auth/me/
    path(
        "password_reset/", 
        include("django_rest_passwordreset.urls", namespace="password_reset"),
    ),
]
