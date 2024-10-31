import requests
import urllib
import jwt
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def get_id_token(code):
    token_endpoint = 'https://oauth2.googleapis.com/token'
    
    # Load client_id and client_secret from environment variables
    client_id = os.getenv('GOOGLE_CLIENT_ID')
    client_secret = os.getenv('GOOGLE_CLIENT_SECRET')

    payload = {
        'code': code,
        'client_id': client_id,
        'client_secret': client_secret,
        'redirect_uri': 'postmessage',
        'grant_type': 'authorization_code'
    }

    body = urllib.parse.urlencode(payload)
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.post(token_endpoint, data=body, headers=headers)

    if response.ok:
        id_token = response.json()['id_token']
        return jwt.decode(id_token, options={"verify_signature": False})