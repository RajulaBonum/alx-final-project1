import os, socket, json, requests, datetime

import requests
from requests.auth import HTTPBasicAuth
from base64 import b64encode
from .models import PaymentTransaction
from .settings import api_settings
from rest_framework.response import Response

# Read variables from settings file - This are the credentials

consumer_key = api_settings.CONSUMER_KEY
consumer_secret = api_settings.CONSUMER_SECRET

HOST_NAME = api_settings.HOST_NAME
PASS_KEY = api_settings.PASS_KEY
SHORT_CODE = api_settings.SHORT_CODE
#TILL_NUMBER = api_settings.TILL_NUMBER
TILL_NUMBER = "174379"
SAFARICOM_API = api_settings.SAFARICOM_API
TRANSACTION_TYPE = api_settings.TRANSACTION_TYPE
AUTH_URL = api_settings.AUTH_URL


# Applies for LipaNaMpesaOnline Payment method
class GenerateKey:
    time_now = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    pass_string = SHORT_CODE + PASS_KEY + time_now
    encoded_pass_string = b64encode(pass_string.encode('utf-8'))
    decoded_pass_string = encoded_pass_string.decode('utf-8')


# Here we are generating the access token

def get_token():
    api_url = "{}{}".format(SAFARICOM_API, AUTH_URL)

    """
    Here we are requesting and getting an access token from safaricom API
    We are sending a GET request to the url - api_url
    Our credetials are the consumer_key and the consumer_secret
    """

    token = requests.get(api_url, auth=HTTPBasicAuth(consumer_key, consumer_secret))
    if token.status_code == 200:
        jonresponse = json.loads(token.content) #converting json string to python objects
        access_token = jonresponse['access_token']
        return access_token
    elif token.status_code == 400:
        print('Invalid credentials.')
        return False

""""
Here we can now send the stk push to the potential registered Mpesa user
"""

def sendSTK(phone_number, amount, orderId=0, transaction_id=None, shortcode=None, account_number=None):
    try:
        code = shortcode or SHORT_CODE
        party_b = TILL_NUMBER or code
        access_token = get_token() #This function returns the access token
        if access_token is False:
            raise Exception("Invalid Consumer key or secret or both")

        time_now = datetime.datetime.now().strftime("%Y%m%d%H%I%S")

        s = code + PASS_KEY + time_now
        encoded = b64encode(s.encode('utf-8')).decode('utf-8')

        api_url = "{}/mpesa/stkpush/v1/processrequest".format(SAFARICOM_API) #SAFARICOM API is the base url
        headers = {
            "Authorization": "Bearer %s" % access_token,
            "Content-Type": "application/json",
        }

        transaction_type = TRANSACTION_TYPE or "CustomerBuyGoodsOnline"
        # If account number is set, change transaction type to paybill
        if account_number:
            transaction_type = "CustomerPayBillOnline"
        elif transaction_type == "CustomerPayBillOnline" and account_number == None:
            account_number = phone_number

        request_body = {
            "BusinessShortCode": int(code),
            "Password": GenerateKey.decoded_pass_string,
            "Timestamp": GenerateKey.time_now,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": str(int(amount)),
            "PartyA": phone_number,
            "PartyB": party_b,
            "PhoneNumber": phone_number,
            "CallBackURL": "https://mydomain.com/pat",
            #"CallBackURL": "{}/mpesa/confirm/".format(HOST_NAME), #URL for the client or host to recieve response from mpesa API
            "AccountReference": 'Test', #account_number or code,
            "TransactionDesc": 'Test' #"{}".format(phone_number)
        }

        # Debugging: Log the request body
        print(request_body)

        # Send POST request to Safaricom API
        response = requests.post(api_url, json=request_body, headers=headers)
        print(json.loads(response.text))

        # Handle the API response
        json_response = json.loads(response.text)
        if json_response.get('ResponseCode'):
            if json_response["ResponseCode"] == "0": #0 indicates successful submission any other digit implies failure or error
                checkout_id = json_response["CheckoutRequestID"]
                if transaction_id:
                    transaction = PaymentTransaction.objects.filter(id=transaction_id)
                    transaction.checkout_request_id = checkout_id
                    transaction.save()
                    return transaction.id
                else:
                    transaction = PaymentTransaction.objects.create(phone_number=phone_number,
                                                                    checkout_request_id=checkout_id,
                                                                    amount=amount, order_id=orderId)
                    transaction.save()
                    return transaction.id
        else:
            raise Exception("Error sending MPesa stk push", json_response)
     

    except Exception as e:
        # Handle and log unexpected exceptions
        return {
            "error": f"An exception occurred: {str(e)}"
        }

    

"""
Here we are checking the payment status
"""


def check_payment_status(checkout_request_id, shortcode=None):
    code = shortcode or SHORT_CODE
    access_token = get_token()
    time_now = datetime.datetime.now().strftime("%Y%m%d%H%I%S")

    s = code + PASS_KEY + time_now
    encoded = b64encode(s.encode('utf-8')).decode('utf-8')

    api_url = "{}/mpesa/stkpushquery/v1/query".format(SAFARICOM_API)
    headers = {
        "Authorization": "Bearer %s" % access_token,
        "Content-Type": "application/json",
    }
    request = {
        "BusinessShortCode": code,
        "Password": encoded,
        "Timestamp": time_now,
        "CheckoutRequestID": checkout_request_id
    }
    response = requests.post(api_url, json=request, headers=headers) #Sending another request to the mpesa api server
    json_response = json.loads(response.text)
    if 'ResponseCode' in json_response and json_response["ResponseCode"] == "0":
        requestId = json_response.get('CheckoutRequestID')
        transaction = PaymentTransaction.objects.get(
            checkout_request_id=requestId)
        if transaction:
            transaction.is_finished = True
            transaction.is_successful = True
            transaction.save()

        result_code = json_response['ResultCode']
        response_message = json_response['ResultDesc']
        return {
            "result_code": result_code,
            "status": result_code == "0",
            "finished": transaction.is_finished,
            "successful": transaction.is_successful,
            "message": response_message
        }
    else:
        raise Exception("Error checking transaction status", json_response)