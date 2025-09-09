from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("core.urls")),          # <- swot, tasks, streak
    path("api/auth/", include("core.auth_urls")),  # <- authentication endpoints
]
