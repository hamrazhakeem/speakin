import base64
import json
from hashlib import sha256
from django.utils.crypto import get_random_string

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

def get_room_name(booking_id, tutor_id, student_id):
    random_string = get_random_string(12)  # Generate a random 12-character string
    room_name_hash = sha256(f"{booking_id}-{tutor_id}-{student_id}-{random_string}".encode()).hexdigest()
    room_name = f"room_{room_name_hash[:16]}"   # Use a shorter part of the hash if needed
    return room_name