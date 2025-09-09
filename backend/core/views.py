# core/views.py
from datetime import datetime
from django.utils import timezone
from django.contrib.auth import login, logout
from django.views.decorators.csrf import ensure_csrf_cookie

from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from .serializers import (
    SignupSerializer, LoginSerializer,
    SWOTItemSerializer, TaskSerializer, StreakSerializer
)
from .models import SWOTItem, Task, Streak
from .services import (
    generate_tasks_for_date,
    generate_tasks_for_swot_item,
    update_streak_for_user,
)


# -------------------
# Auth Endpoints
# -------------------

class SignupView(generics.CreateAPIView):
    serializer_class = SignupSerializer
    permission_classes = [AllowAny]


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        login(request, user)
        return Response({"id": user.id, "email": user.email})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response(status=status.HTTP_204_NO_CONTENT)


@ensure_csrf_cookie
@api_view(["GET"])
@permission_classes([AllowAny])
def csrf_view(_request):
    """Set CSRF cookie; Next.js should call this once on app load."""
    return Response({"detail": "CSRF cookie set"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me_view(request):
    """Return the currently logged-in user."""
    user = request.user
    return Response({
        "id": user.id,
        "email": user.email,
        "created_at": user.date_joined,
    })


# -------------------
# Mixins
# -------------------

class IsOwnerQuerysetMixin:
    """Filter queryset by the current user (owner)."""
    def get_queryset(self):
        return super().get_queryset().filter(owner=self.request.user)


# -------------------
# SWOT Items
# -------------------

class SWOTItemViewSet(IsOwnerQuerysetMixin, viewsets.ModelViewSet):
    queryset = SWOTItem.objects.all()
    serializer_class = SWOTItemSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        swot = serializer.save()  # owner is set in serializer.create()

        # Generate today's task(s) immediately for this new SWOT
        today = timezone.localdate()
        generate_tasks_for_swot_item(swot, today)


# -------------------
# Tasks
# -------------------

class TaskViewSet(IsOwnerQuerysetMixin, viewsets.ModelViewSet):
    queryset = Task.objects.select_related("swot_item").all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "patch", "put", "head", "options"]  # no delete for MVP

    def list(self, request, *args, **kwargs):
        # /api/tasks/?date=YYYY-MM-DD  (default = today)
        date_param = request.query_params.get("date")
        if date_param:
            try:
                target_date = datetime.strptime(date_param, "%Y-%m-%d").date()
            except ValueError:
                return Response({"detail": "Invalid date format YYYY-MM-DD."}, status=400)
        else:
            target_date = timezone.localdate()

        qs = self.get_queryset().filter(date=target_date).order_by("created_at")
        page = self.paginate_queryset(qs)
        if page is not None:
            return self.get_paginated_response(self.get_serializer(page, many=True).data)
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=True, methods=["post"])
    def done(self, request, pk=None):
        task: Task = self.get_object()
        today = timezone.localdate()

        if task.date < today:
            return Response({"detail": "Past tasks are immutable."}, status=status.HTTP_400_BAD_REQUEST)
        if task.status == "done":
            return Response({"detail": "Already done."}, status=status.HTTP_200_OK)

        task.status = "done"
        task.completed_at = timezone.now()

        # Optional: accept a metric value
        value = request.data.get("value")
        if value is not None:
            try:
                val = float(value)
            except (TypeError, ValueError):
                return Response({"detail": "Invalid value"}, status=400)
            if val < 0:
                return Response({"detail": "value must be >= 0"}, status=400)
            task.value = val

        task.save()

        # Update streak when first done task today is marked
        update_streak_for_user(request.user)

        return Response(self.get_serializer(task).data, status=status.HTTP_200_OK)


# -------------------
# Streaks
# -------------------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def streak_view(request):
    """Return current consecutive-day streak, computed from Streak record."""
    streak, _ = Streak.objects.get_or_create(owner=request.user)
    return Response(StreakSerializer(streak).data)
