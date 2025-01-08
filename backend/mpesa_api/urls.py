from django.contrib import admin
from django.urls import path
from . import views

"""
This are the urls for the mpesa api
"""
urlpatterns = [
    path('submit/', views.SubmitView.as_view(), name='submit'),
    path('confirm/', views.ConfirmView.as_view(), name='confirm'),
    path('check-online/', views.CheckTransactionOnline.as_view(), name='confirm-online'),
    path('check-transaction/', views.CheckTransaction.as_view(), name='check_transaction')
]