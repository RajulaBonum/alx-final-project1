from rest_framework import serializers
from .models import PaymentTransaction, Wallet


class PaymentTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentTransaction
        fields = [
            'id',
            'phone_number',
            'amount',
            'is_finished',
            'is_successful',
            'trans_id',
            'order_id',
            'checkout_request_id',
            'date_created',
            'date_modified',
            'content_type',
            'object_id',
        ]
        read_only_fields = ['date_created', 'date_modified']


class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = [
            'id',
            'uuid',
            'phone_number',
            'available_balance',
            'actual_balance',
            'is_active',
            'is_deleted',
            'date_created',
            'date_modified',
        ]
        read_only_fields = ['date_created', 'date_modified']
