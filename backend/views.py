from django.contrib.auth.models import User
from users.models import UserProfile
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class RegisterUserView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        first_name = request.data.get('firstName')
        last_name = request.data.get('lastName')
        phone_number = request.data.get('phoneNumber')

        if not username or not password or not email or not first_name or not last_name or not phone_number:
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)

        if UserProfile.objects.filter(phone_number=phone_number).exists():
            return Response({"error": "Phone number already exists."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            first_name=first_name,
            last_name=last_name
        )
        user.profile.phone_number = phone_number
        user.profile.save()

        return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)