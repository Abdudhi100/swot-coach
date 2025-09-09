from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SWOTItemViewSet, TaskViewSet, streak_view

router = DefaultRouter()
router.register(r"swot", SWOTItemViewSet, basename="swot")
router.register(r"tasks", TaskViewSet, basename="tasks")

urlpatterns = [
    path("", include(router.urls)),          # /api/swot/, /api/tasks/
    path("streak/", streak_view, name="streak"),  # /api/streak/
]
