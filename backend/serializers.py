from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Product, ProductImage, Reputation
from rest_framework.generics import RetrieveUpdateDestroyAPIView
import os
from django.conf import settings

class UserSerializer(serializers.ModelSerializer):
    # Permite upload e leitura
    profile_image = serializers.ImageField(source='profile.profile_image', required=False, allow_null=True, write_only=True)
    profile_image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'profile_image', 'profile_image_url']

    def get_profile_image_url(self, obj):
        if hasattr(obj, 'profile') and hasattr(obj.profile, 'profile_image') and obj.profile.profile_image:
            profile_image = obj.profile.profile_image
            # Só retorna URL se existir o atributo 'url'
            if hasattr(profile_image, 'url'):
                request = self.context.get('request')
                url = profile_image.url
                return request.build_absolute_uri(url) if request else url
        return None

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Atualiza imagem de perfil se enviada
        profile = instance.profile
        profile_image = profile_data.get('profile_image', None)
        if profile_image is not None:
            # Deleta a imagem antiga se existir
            if profile.profile_image and profile.profile_image.name:
                old_path = profile.profile_image.path
                if os.path.isfile(old_path):
                    try:
                        os.remove(old_path)
                    except Exception:
                        pass
            profile.profile_image = profile_image
            profile.save()
        return instance

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

class ReputationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reputation
        fields = ['id', 'from_user', 'to_user', 'score', 'created_at']
        read_only_fields = ['from_user', 'created_at']

class UserProfileDetailView(RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context