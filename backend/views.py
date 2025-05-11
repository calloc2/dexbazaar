from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .blockchain import Blockchain

class RegisterUserView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        first_name = request.data.get('firstName') 
        last_name = request.data.get('lastName')

        if not username or not password or not email or not first_name or not last_name:
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            first_name=first_name,
            last_name=last_name
        )
        return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)

class BlockchainBalanceView(APIView):
    def get(self, request):
        address = request.query_params.get('address')
        if not address:
            return Response({"error": "Address is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            blockchain = Blockchain()
            balance = blockchain.get_balance(address)
            return Response({"address": address, "balance": balance}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BlockchainTransactionView(APIView):
    def post(self, request):
        private_key = request.data.get('private_key')
        to_address = request.data.get('to_address')
        amount = request.data.get('amount')

        if not private_key or not to_address or not amount:
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            blockchain = Blockchain()
            tx_hash = blockchain.send_transaction(private_key, to_address, float(amount))
            return Response({"message": "Transaction successful.", "transaction_hash": tx_hash}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)