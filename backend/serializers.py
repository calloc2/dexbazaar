from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Product, ProductImage

class UserSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'profile_image']

    def get_profile_image(self, obj):
        if hasattr(obj, 'profile') and hasattr(obj.profile, 'profile_image') and obj.profile.profile_image:
            request = self.context.get('request')
            url = obj.profile.profile_image.url
            return request.build_absolute_uri(url) if request else url
        if hasattr(obj, 'profile_image') and obj.profile_image:
            request = self.context.get('request')
            url = obj.profile_image.url
            return request.build_absolute_uri(url) if request else url
        return None

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image']

    def get_image(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True) 

    class Meta:
        model = Product
        fields = ['id', 'title', 'description', 'price', 'category', 'cep', 'city', 'state', 'images', 'created_at', 'user']