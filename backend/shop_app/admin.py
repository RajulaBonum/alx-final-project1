from django.contrib import admin
from .models import Product, Cart, CartItem, Order, ShippingLocation

# Register your models here.
admin.site.register([Product, Cart, CartItem, ShippingLocation])

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_code', 'transaction_id', 'user', 'status', 'total_amount', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('order_code', 'transaction_id', 'user__username')
