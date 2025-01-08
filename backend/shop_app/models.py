from django.db import models
from django.utils.timezone import now
from django.utils.text import slugify
from django.conf import settings

# Define module-level functions for default values
def default_sizes():
    return ["large", "medium", "small"]

def default_colors():
    return ["red", "white", "black", "blue"]

class Product(models.Model):
    CATEGORY = (
        ('T-shirts', 'T-SHIRTS'),
        ('Hoodies', 'HOODIES'),
        ('Banners', 'BANNERS'),
        ('Cups', 'CUPS'),
        ('Others', 'OTHERS'),
    )

    name = models.CharField(max_length=100)
    title = models.CharField(max_length=150, default="About the product")
    slug = models.CharField(max_length=200, blank=True, null=True)
    image = models.ImageField(upload_to="media")
    sizes = models.JSONField(default=default_sizes)
    colors = models.JSONField(default=default_colors)
    custom_design = models.FileField(upload_to='custom_designs/', null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=15, choices=CATEGORY, blank=True, null=True)

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        # Ensure the slug is unique
        if not self.slug:
            self.slug = slugify(self.name)
            unique_slug = self.slug
            counter = 1
            while Product.objects.filter(slug=unique_slug).exists():
                unique_slug = f'{self.slug}-{counter}'
                counter += 1
            self.slug = unique_slug
        
        super().save(*args, **kwargs)

class Cart(models.Model):
    cart_code = models.CharField(max_length=11, unique=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True)
    paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.cart_code
    
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    size = models.CharField(max_length=20, null=True, blank=True)
    color = models.CharField(max_length=20, null=True, blank=True)
    custom_design = models.FileField(upload_to='custom_designs/', null=True, blank=True)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in cart {self.cart.id}"
    
class ShippingLocation(models.Model):
    county_name = models.CharField(max_length=100)
    shipping_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.county_name

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_transit', 'In Transit'),
        ('completed', 'Completed'),
    ]

    order_code = models.CharField(max_length=255, unique=True, editable=False)
    cart = models.ForeignKey(Cart, related_name='cart', on_delete=models.CASCADE, null=True, blank=True)
    transaction_id = models.CharField(max_length=255, null=False, blank=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_location = models.ForeignKey(ShippingLocation, related_name='location', on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Optionally log or extend with additional fields such as user_details if needed.

    def save(self, *args, **kwargs):
        if not self.order_code:
            timestamp = now().strftime("%Y%m%d%H%M%S")
            self.order_code = f"{self.cart.cart_code}_{timestamp}"
        super(Order, self).save(*args, **kwargs)

    def __str__(self):
        return f"Order {self.order_code} - {self.get_status_display()}"
