# Generated by Django 5.1.4 on 2024-12-12 21:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shop_app', '0003_alter_cart_user'),
    ]

    operations = [
        migrations.RenameField(
            model_name='cartitem',
            old_name='quanitiy',
            new_name='quantity',
        ),
    ]