import requests
from requests.auth import HTTPBasicAuth
import json
import base64
from datetime import datetime

class Credentials:
    consumer_key = "79nWsOPn3yDLNam7aa6ygYfAZjA5vbqx6nQN3LMXykjMMKFZ"
    consumer_secret = "SV3jhnrjAm1QiI44WisSeAbH5S43FbeLPQKvBMcaY3WlNyRpBbb20WbDEX0An7ZH"
    pass_key = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
    api_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"

# Getting the access token
class Mpesa_access_token:
    token = requests.get(Credentials.api_url, auth=HTTPBasicAuth(Credentials.consumer_key, Credentials.consumer_secret))
    access_token = json.loads(token.text)["access_token"]

# Generating a pass key
class Mpesa_password:
    time_stamp = datetime.now().strftime("%Y%m%d%H%M%S")
    short_code = "174379"
    encode_string = short_code + Credentials.pass_key + time_stamp
    encoded = base64.b64encode(encode_string.encode())
    decoded_password = encoded.decode("utf-8")