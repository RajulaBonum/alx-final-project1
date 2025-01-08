from django.contrib import admin
from django.urls import path
from . import views

#Reset password endpoints
urlpatterns = [
    path('send-reset-email/', views.SendPasswordResetEmail.as_view(), name='send-reset-email'),
    path('reset-password/<str:uidb64>/<str:token>/', views.ResetPassword.as_view(), name='reset-password'),
    path('change-password/', views.change_password, name='change-password')
]