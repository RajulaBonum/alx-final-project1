from django.urls import path
from . import views

urlpatterns = [
    path('products', views.products, name='products'),
    path('product_detail/<slug:slug>', views.product_detail, name='product_detail'),
    path('add_item/', views.add_item, name='add_item'),
    path('product_in_cart', views.product_in_cart, name='product_in_cart'),
    path('get_cart_stat', views.get_cart_stat, name='get_cart_stat'),
    path('get_cart', views.get_cart, name='get_cart'),
    path('update_quantity/', views.update_quantity, name='update_quantity'),
    path('delete_cartitem/', views.delete_cartitem, name='delete_cartitem'),
    path('get_username', views.get_username, name='get_username'),
    path('get_user_profile', views.get_user_profile, name='get_user_profile'),
    path('clear_cart/', views.clear_cart, name='clear_cart'),
    path('register_user/', views.register_user, name='register_user'),
    path('stk_push/', views.stk_push, name='stk_push'),
    path('get_orders', views.get_orders, name='get_orders'),
    path('get_shipping_locations', views.get_shipping_locations, name='get_shipping_locations'),
    path('create_order/', views.create_order, name='create_order'),
    path('update_user_profile/', views.update_user_profile,  name='update_user_profile')
]