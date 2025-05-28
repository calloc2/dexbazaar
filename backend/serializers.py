from rest_framework import serializers
from .models import Product, Category

class ProductSerializer(serializers.ModelSerializer):
    categoryName = serializers.CharField(source='category.name', read_only=True)
    user = serializers.ReadOnlyField(source='user.id')

    class Meta:
        model = Product
        fields = ['id', 'title', 'description', 'price', 'category', 'categoryName', 'created_at', 'user']