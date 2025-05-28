from django.contrib.auth.models import User
from users.models import UserProfile
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from .blockchain import Blockchain
from .models import Product, ProductImage
from .serializers import ProductSerializer, ProductImageSerializer, UserSerializer
from rest_framework.generics import RetrieveAPIView

class RegisterUserView(APIView):
    permission_classes = [AllowAny]
    
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

class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        images = self.request.FILES.getlist('images')
        for image in images:
            ProductImage.objects.create(product=serializer.instance, image=image)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        images = request.FILES.getlist('images')
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        for image in images:
            ProductImage.objects.create(product=product, image=image)
        return Response(self.get_serializer(product).data, status=status.HTTP_201_CREATED)

class UserProfileDetailView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'
    permission_classes = [AllowAny]
