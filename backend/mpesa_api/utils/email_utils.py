from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings

def send_payment_receipt(recipient_email, user_name, transaction_id, total_amount):
    """
    Sends a payment receipt email to the user.
    """
    try:
        subject = f"Payment Receipt - Transaction {transaction_id}"
        context = {
            'user_name': user_name,
            'transaction_id': transaction_id,
            'total_amount': total_amount,
        }
        html_message = render_to_string('emails/payment_receipt.html', context)
        plain_message = render_to_string('emails/payment_receipt.txt', context)
        email = EmailMultiAlternatives(
            subject=subject,
            body=plain_message, #plain text
            from_email = settings.DEFAULT_FROM_EMAIL,
            to = [recipient_email],
        )

        email.attach_alternative(html_message, "text/html")
        email.send()
        print("Email sent succesfully!")

    except Exception as e:
        print(f"Error sending email: {str(e)}")
