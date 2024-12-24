import base64
import json

def decode_jwt(token):
    """Decodes the JWT and returns the payload."""
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None  # Invalid JWT format

        payload_base64 = parts[1]
        payload_json = base64.urlsafe_b64decode(payload_base64 + '==')
        payload = json.loads(payload_json)
        return payload
    except Exception:
        return None