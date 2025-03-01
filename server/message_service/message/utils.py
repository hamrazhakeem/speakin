import base64
import json
import os
import requests
import logging
from rest_framework.exceptions import PermissionDenied
from .custom_user import CustomUser

# Get logger for the message app
logger = logging.getLogger("message")

USER_SERVICE_URL = os.getenv("USER_SERVICE_URL")


def decode_jwt(token):
    """Decodes the JWT and returns the payload."""
    parts = token.split(".")
    if len(parts) != 3:
        logger.error("Invalid JWT format: token does not have three parts")
        return None

    payload_base64 = parts[1]
    # Add padding if necessary
    padding = len(payload_base64) % 4
    if padding:
        payload_base64 += "=" * (4 - padding)

    payload_json = base64.urlsafe_b64decode(payload_base64)
    payload = json.loads(payload_json)
    logger.debug("JWT decoded successfully")
    return payload


def get_user_by_id(user_id):
    try:
        # Construct the URL to get the user by ID
        url = f"{USER_SERVICE_URL}/users/{user_id}/"
        logger.info(f"Fetching user data for ID {user_id}")

        response = requests.get(url)

        # Check if the request was successful
        if response.status_code == 200:
            user_data = response.json()  # Return the user data as a dictionary
            logger.info(f"Successfully retrieved user data for ID {user_id}")
            return CustomUser(user_data)
        else:
            logger.error(
                f"User service returned error {response.status_code} for user ID {user_id}"
            )
            raise PermissionDenied("User not found in user service or invalid ID")
    except requests.exceptions.RequestException as e:
        logger.error(
            f"Failed to connect to user service for user ID {user_id}: {str(e)}"
        )
        raise PermissionDenied(f"Error occurred while fetching user: {str(e)}")
