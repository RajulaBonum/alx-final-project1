# Generated by Django 5.1.4 on 2024-12-27 13:15

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='Wallet',
            fields=[
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False)),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(blank=True, default=True)),
                ('is_deleted', models.BooleanField(blank=True, default=False)),
                ('phone_number', models.CharField(max_length=30)),
                ('available_balance', models.DecimalField(decimal_places=2, default=0, max_digits=6, verbose_name='available_balance')),
                ('actual_balance', models.DecimalField(decimal_places=2, default=0, max_digits=6, verbose_name='actual_balance')),
                ('date_modified', models.DateTimeField(auto_now=True, null=True)),
                ('date_created', models.DateTimeField(auto_now_add=True, null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PaymentTransaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('phone_number', models.CharField(max_length=30)),
                ('amount', models.DecimalField(decimal_places=2, default=0, max_digits=14)),
                ('is_finished', models.BooleanField(default=False)),
                ('is_successful', models.BooleanField(default=False)),
                ('trans_id', models.CharField(max_length=30)),
                ('order_id', models.CharField(max_length=200)),
                ('checkout_request_id', models.CharField(max_length=100)),
                ('date_modified', models.DateTimeField(auto_now=True)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('object_id', models.PositiveIntegerField(default=0)),
                ('content_type', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='contenttypes.contenttype')),
            ],
        ),
    ]
