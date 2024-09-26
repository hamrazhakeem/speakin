import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework import status

# Create your views here.

@csrf_exempt
@api_view(['POST'])
def sign_up(request):
    try:
        response = requests.post( 
            'http://host.docker.internal:8000/users/sign_up/',
            json=request.data
        )
        if response.status_code == 201:
            return JsonResponse(response.json(), status=status.HTTP_201_CREATED)
        return JsonResponse(response.json(), status=response.status_code)
    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': 'Failed to connect to user_service', 'details': str(e)}, status=500)