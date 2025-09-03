from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import login, logout
from django.middleware.csrf import get_token
from .serializers import SignupSerializer, LoginSerializer
from django_rest_passwordreset.views import reset_password_request_token, reset_password_confirm

class SignupView(generics.CreateAPIView):
    serializer_class = SignupSerializer
    permission_classes = [permissions.AllowAny]

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        login(request, user)
        return Response({"id": user.id, "email": user.email})

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(["GET"])
def csrf_view(request):
    return Response({"csrfToken": get_token(request)})

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def me_view(request):
    user = request.user
    return Response({
        "id": user.id,
        "email": user.email,
        "created_at": user.date_joined
    })
