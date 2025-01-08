from rest_framework import serializers
from .models import Product, Cart, CartItem, Order, ShippingLocation
from django.contrib.auth import get_user_model

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'title', 'slug', 'image', 'description', 'category', 'price']

class DetailedProductSerializer(serializers.ModelSerializer):
    similar_products = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'title', 'slug', 'image', 'description', 'price', 'similar_products', 'category']
        
    def get_similar_products(self, product):
        products = Product.objects.filter(category=product.category).exclude(id=product.id)
        serializer = ProductSerializer(products, many=True)
        return serializer.data
    
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total = serializers.SerializerMethodField()
    class Meta:
        model = CartItem
        fields = ['id', 'quantity', 'product', 'total']

    def get_total(self, cartitem):
        price = cartitem.product.price * cartitem.quantity
        return price
    
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(read_only=True, many=True)
    sum_total = serializers.SerializerMethodField()
    num_of_items = serializers.SerializerMethodField()
    class Meta:
        model = Cart
        fields = ['id', 'cart_code', 'items', 'sum_total', 'num_of_items', 'paid', 'created_at', 'updated_at']

    def get_sum_total(self, cart):
        items = cart.items.all()
        total = sum([item.product.price * item.quantity for item in items])
        return total
    
    def get_num_of_items(self, cart):
        items = cart.items.all()
        total = sum([item.quantity for item in items])
        return total
        

class SimpleCartSerializer(serializers.ModelSerializer):
    num_of_items = serializers.SerializerMethodField()
    class Meta:
        model = Cart
        fields = ["id", "cart_code", "num_of_items"]

    def get_num_of_items(self, cart):
        num_of_items = sum([item.quantity for item in cart.items.all()])
        return num_of_items
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ["id", "username", "first_name", "last_name", "email", "city", "state", "address", "phone"]



class OrderSerializer(serializers.ModelSerializer):
    cart = CartSerializer(read_only=True)
    class Meta:
        model = Order
        fields = [
            'id', 
            'order_code',
            'cart',
            'transaction_id', 
            'user',  
            'total_amount', 
            'status', 
            'created_at', 
            'updated_at'
        ]
        read_only_fields = ['id', 'order_code', 'created_at', 'updated_at']

class ShippingLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingLocation
        fields = ['id', 'county_name', 'shipping_price']
