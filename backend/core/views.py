from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

# Send Password Reset Email
class SendPasswordResetEmail(APIView):
    def post(self, request):
        email = request.data.get("email")
        User = get_user_model()
        user = User.objects.filter(email=email).first()
        if user:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"
            send_mail(
                subject="Password Reset",
                message=f"Click the link to reset your password: {reset_url}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
            )
            return Response({"message": "Password reset email sent!"}, status=status.HTTP_200_OK)
        return Response({"error": "Email not found"}, status=status.HTTP_404_NOT_FOUND)

# Reset Password
class ResetPassword(APIView):
    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            User = get_user_model()
            user = User.objects.get(pk=uid)
            if default_token_generator.check_token(user, token):
                new_password = request.data.get("password")
                user.set_password(new_password)
                user.save()
                return Response({"message": "Password reset successful!"}, status=status.HTTP_200_OK)
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    current_password = request.data.get("current_password")
    new_password = request.data.get("new_password")
    if user.check_password(current_password):
        user.set_password(new_password)
        user.save()
        return Response({"message": "Password updated successfully!"}, status=status.HTTP_200_OK)
    return Response({"error": "Current password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)

