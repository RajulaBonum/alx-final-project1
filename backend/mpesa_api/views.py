# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json
from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import View
from .daraja import sendSTK, check_payment_status
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView
from rest_framework.status import HTTP_200_OK #HTTP_400_BAD_REQUEST
from rest_framework.response import Response
from .models import PaymentTransaction
from django.http import JsonResponse
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import PaymentTransaction
from .utils.email_utils import send_payment_receipt


# Create your views here.


class PaymentTranactionView(ListCreateAPIView):
    def post(self, request):
        return HttpResponse("OK", status=200)


"""
View to recieve data from the frontend and call submitSTK() to initiate payment
"""

class SubmitView(APIView):
    permission_classes = [AllowAny, ]

    def post(self, request):
        """
        Here we are getting the amount and phone number from the frontend
        """

        data = request.data
        phone_number = data['mobileNumber']
        amount = data['cartTotal']

        cart_code = 0
        if data.get('cart_code'):
            cart_code = data.get('cart_code')

        paybill_account_number = None
        if data.get('paybill_account_number'):
            paybill_account_number = data.get('paybill_account_number')
            

        """
        Calling the sendSTK() function to initiate payment
        """

        transaction_id = sendSTK(phone_number, amount, cart_code, account_number=paybill_account_number)
        # b2c()
        message = {"status": "ok", "transaction_id": transaction_id}
        return Response(message, status=HTTP_200_OK)


"""
This will be used to check for the transaction in the frontend
"""
class CheckTransactionOnline(APIView):
    permission_classes = [AllowAny, ]


    def post(self, request):
        trans_id = request.data['transaction_id']
        user_email = request.data['user_email']
        user_name = request.data['user_name']
        total_amount = request.data['total_amount']

        transaction = PaymentTransaction.objects.filter(id=trans_id).get()
        try:
            if transaction.checkout_request_id:
                status_response = check_payment_status(transaction.checkout_request_id)
                print(status_response)

                # Send the payment receipt
                send_payment_receipt(
                    recipient_email=user_email,
                    user_name=user_name,
                    transaction_id=trans_id,
                    total_amount=total_amount,
                )
                return JsonResponse(
                    status_response, status=200)
            else:
                return JsonResponse({
                    "message": "Server Error. Transaction not found",
                    "status": False
                }, status=400)
        except PaymentTransaction.DoesNotExist:
            return JsonResponse({
                "message": "Server Error. Transaction not found",
                "status": False
            },
                status=400)

"""
"""
class CheckTransaction(APIView):
    permission_classes = [AllowAny, ]

    def post(self, request):
        data = request.data
        trans_id = data['transaction_id']
        try:
            transaction = PaymentTransaction.objects.filter(id=trans_id).get()
            if transaction:
                return JsonResponse({
                    "message": "ok",
                    "finished": transaction.is_finished,
                    "successful": transaction.is_successful
                },
                    status=200)
            else:
                # TODO : Edit order if no transaction is found
                return JsonResponse({
                    "message": "Error. Transaction not found",
                    "status": False
                },
                    status=400)
        except PaymentTransaction.DoesNotExist:
            return JsonResponse({
                "message": "Server Error. Transaction not found",
                "status": False
            },
                status=400)

"""
This view links with the mpesa api callback
"""
class ConfirmView(APIView):
    permission_classes = [AllowAny, ]

    def post(self, request):
        # save the data
        request_data = json.dumps(request.data)
        request_data = json.loads(request_data)
        body = request_data.get('Body')
        resultcode = body.get('stkCallback').get('ResultCode')
        # Perform your processing here e.g. print it out...
        print(body)
        if resultcode == 0:
            print('Payment successful')
            requestId = body.get('stkCallback').get('CheckoutRequestID')
            metadata = body.get('stkCallback').get('CallbackMetadata').get('Item')
            for data in metadata:
                if data.get('Name') == "MpesaReceiptNumber":
                    receipt_number = data.get('Value')
            transaction = PaymentTransaction.objects.get(
                checkout_request_id=requestId)
            if transaction:
                transaction.trans_id = receipt_number
                transaction.is_finished = True
                transaction.is_successful = True
                transaction.save()

        else:
            print('unsuccessfull')
            requestId = body.get('stkCallback').get('CheckoutRequestID')
            transaction = PaymentTransaction.objects.get(
                checkout_request_id=requestId)
            if transaction:
                transaction.is_finished = True
                transaction.is_successful = False
                transaction.save()

        # Prepare the response, assuming no errors have occurred. Any response
        # other than a 0 (zero) for the 'ResultCode' during Validation only means
        # an error occurred and the transaction is cancelled
        message = {
            "ResultCode": 0,
            "ResultDesc": "The service was accepted successfully",
            "ThirdPartyTransID": "1237867865"
        }

        # Send the response back to the server
        return Response(message, status=HTTP_200_OK)

    def get(self, request):
        return Response("Confirm callback", status=HTTP_200_OK)
