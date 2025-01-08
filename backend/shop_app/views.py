from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from .models import Product, Cart, CartItem, Order, ShippingLocation
from .serializer import ProductSerializer, DetailedProductSerializer, CartItemSerializer, SimpleCartSerializer, CartSerializer, UserSerializer, OrderSerializer, ShippingLocationSerializer
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model #for custom user model
from django.contrib.auth.hashers import make_password
from rest_framework.parsers import MultiPartParser, FormParser
from .credetials import Credentials, Mpesa_access_token, Mpesa_password
import requests

User = get_user_model()

# Get all products
@api_view(['GET'])
def products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

# Get details of a specific product
@api_view(['GET'])
def product_detail(request, slug):
    try:
        product = Product.objects.get(slug=slug)
        serializer = DetailedProductSerializer(product)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)

# Add an item to the cart
from rest_framework.parsers import MultiPartParser, FormParser

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def add_item(request):
    try:
        cart_code = request.data.get('cart_code')
        product_id = request.data.get('product_id')
        size = request.data.get('size')
        color = request.data.get('color')
        custom_design = request.FILES.get('custom_design')  # Optional custom design file

        if not cart_code or not product_id:
            return Response({'error': 'cart_code and product_id are required'}, status=400)

        # Fetch the product
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=404)

        # Validate size and color based on category
        if product.category in ["T-shirts", "Hoodies"]:
            if not size or not color:
                return Response(
                    {'error': 'Size and color are required for T-shirts and Hoodies.'},
                    status=400
                )
        else:
            if not color:
                return Response(
                    {'error': 'Color is required for this product.'},
                    status=400
                )

        # Fetch or create the cart
        cart, created = Cart.objects.get_or_create(cart_code=cart_code)

        # Check for an existing cart item with the same attributes
        cartitem, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            size=size if product.category in ["T-shirts", "Hoodies"] else None,
            color=color,
            defaults={'quantity': 1}
        )

        if not created:  # If the item already exists, increment the quantity
            cartitem.quantity += 1
            if custom_design:  # Update custom design if a new one is provided
                cartitem.custom_design = custom_design
            cartitem.save()

        serializer = CartItemSerializer(cartitem)
        return Response({"data": serializer.data, "message": "CartItem created/updated successfully"}, status=201)

    except Exception as e:
        return Response({'error': str(e)}, status=400)


# Check if a product is in the cart
@api_view(['GET'])
def product_in_cart(request):
    try:
        cart_code = request.query_params.get('cart_code')
        product_id = request.query_params.get('product_id')

        if not cart_code or not product_id:
            return Response({'error': 'cart_code and product_id are required'}, status=400)

        cart = Cart.objects.get(cart_code=cart_code)
        product = Product.objects.get(id=product_id)

        product_exists_in_cart = CartItem.objects.filter(cart=cart, product=product).exists()

        return Response({'product_in_cart': product_exists_in_cart})

    except Cart.DoesNotExist:
        return Response({'error': 'Cart not found'}, status=404)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['GET'])
def get_cart_stat(request):
    cart_code = request.query_params.get("cart_code")
    cart = Cart.objects.get(cart_code=cart_code, paid=False)
    serializer = SimpleCartSerializer(cart)
    return Response(serializer.data)

@api_view(['GET'])
def get_cart(request):
    cart_code = request.query_params.get('cart_code')
    cart = Cart.objects.get(cart_code=cart_code)
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['PATCH']) #This is an update request
def update_quantity(request):
    try:
        cartitem_id = request.data.get("item_id")
        quantity = request.data.get("quantity")
        quantity = int(quantity)
        cartitem = CartItem.objects.get(id=cartitem_id)
        cartitem.quantity = quantity
        cartitem.save()
        serializer = CartItemSerializer(cartitem)
        return Response({"data": serializer.data, "message": "Cartitem updated successfully!"})
    
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
def delete_cartitem(request):
    cartitem_id = request.data.get('item_id')
    cartitem = CartItem.objects.get(id=cartitem_id)
    cartitem.delete()
    return Response({"message":"Cartitem deleted successfully!"}, status=status.HTTP_204_NO_CONTENT)

@api_view(["POST"])
def clear_cart(request):
    cart_code = request.data.get("cart_code")
    if not cart_code:
        return Response({"error": "Cart code is required."}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        cart = Cart.objects.get(cart_code=cart_code)
        cart.items.all().delete()
        return Response({"message": "Cart cleared successfully."}, status=status.HTTP_200_OK)
    except Cart.DoesNotExist:
        return Response({"error": "Cart not found."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_username(request):
    user = request.user
    return Response({"username": user.username})

#Use this to get profile/ user info
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)

@api_view(['PATCH', 'PUT'])  # Allow both PATCH and PUT
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    try:
        # Use request.data for POST/PUT/PATCH requests
        user_name = request.data.get('username')
        user_email = request.data.get('email')
        user_address = request.data.get('address')

        user = request.user
        user.username = user_name
        user.email = user_email
        user.address = user_address
        user.save()

        return Response({"message": "Profile updated successfully!"})
    except Exception as e:
        return Response({'error': str(e)}, status=400)


@api_view(['POST'])
def register_user(request):
    """
    View to handle user registration
    """
    user_data = request.data

    #Validate required fields
    required_fields = [
        'username',
        'email',
        'password1',
        'password2'
    ]

    for field in required_fields:
        if field not in user_data or not user_data[field].strip():
            return Response({"error": f"{field} is required!"}, status=status.HTTP_400_BAD_REQUEST)
        
        username = user_data['username']
        email = user_data['email']
        password1 = user_data['password1']
        password2 = user_data['password2']

        # Check if passwords match
        if password1 != password2:
            return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if username or email already exists
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exist!"}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Creating a user
        try:
            user = User.objects.create(
                username = username,
                email = email,
                password = make_password(password1) #Hashes the password
            )

            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_451_UNAVAILABLE_FOR_LEGAL_REASONS)
            

# Get orders
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_orders(request):
    user = request.user
    orders = Order.objects.filter(user=user).order_by('-created_at')  # Fetch all orders for the user
    serializer = OrderSerializer(orders, many=True)  # Serialize the queryset
    return Response({'orders': serializer.data})  # Return the serialized orders

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_shipping_locations(request):
    locations = ShippingLocation.objects.all()
    serializer = ShippingLocationSerializer(locations, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    """
    Handle order creation from the frontend.
    """
    user = request.user
    data = request.data

    transaction_id = data.get("transaction_id")
    cart_code = data.get("cart_code")
    shipping_location_id = data.get("shipping_location")
    total_amount = data.get("total_amount")
    user_details = data.get("user_details")  # Optional for backend storage/logging

    if not all([transaction_id, cart_code, shipping_location_id, total_amount]):
        return Response(
            {"error": "Missing required fields: transaction_id, cart_code, shipping_location, or total_amount."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Validate shipping location
        shipping_location = ShippingLocation.objects.get(id=shipping_location_id)
        # Validate cart
        cart = Cart.objects.get(cart_code=cart_code, paid=False)

        # Create the order
        order = Order.objects.create(
            transaction_id=transaction_id,
            user=user,
            cart=cart,
            shipping_location=shipping_location,
            total_amount=total_amount,
        )

        # Optional: Log user details for additional tracking
        if user_details:
            print(f"User Details: {user_details}")

        return Response(
            {
                "message": "Order created successfully",
                "order_code": order.order_code,
                "status": order.get_status_display(),
                "created_at": order.created_at,
            },
            status=status.HTTP_201_CREATED
        )
    except ShippingLocation.DoesNotExist:
        return Response(
            {"error": "Invalid shipping location."},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Cart.DoesNotExist:
        return Response(
            {"error": "Invalid or already paid cart."},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {"error": f"An error occurred while creating the order: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def stk_push(request):
    try:
        phone_no = request.data.get("mobileNumber")
        amount = request.data.get("cartTotal")

        # Validate inputs
        if not phone_no or not amount:
            return Response({"error": "mobileNumber and cartTotal are required."}, status=400)

        access_token = Mpesa_access_token.access_token
        api_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        headers = {"Authorization": f"Bearer {access_token}"}
        
        # Prepare the request payload
        request_body = {    
            "BusinessShortCode": Mpesa_password.short_code,    
            "Password": Mpesa_password.decoded_password,    
            "Timestamp": Mpesa_password.time_stamp,    
            "TransactionType": "CustomerPayBillOnline",    
            "Amount": amount,    
            "PartyA": phone_no,    
            "PartyB": "174379",    
            "PhoneNumber": phone_no,    
            "CallBackURL": "https://mydomain.com/pat",    
            "AccountReference": "Test",    
            "TransactionDesc": "Test"
        }
        

        # Make the API request
        response = requests.post(api_url, json=request_body, headers=headers)

        # Handle the API response
        if response.status_code == 200:
            return Response({
                "message": "STK push request sent successfully.",
                "response": response.json()
            }, status=200)
        else:
            return Response({
                "error": "Failed to send STK push request.",
                "details": response.json()
            }, status=response.status_code)

    except Exception as e:
        return Response({"error": str(e)}, status=500)

