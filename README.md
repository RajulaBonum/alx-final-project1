# E-Commerce Website with React Frontend and Django Backend  

## Project Overview  
This project entails an e-commerce platform designed to deliver a seamless shopping experience. The website integrates a modern **React.js frontend** powered by **React Vite** and styled with tools like **React Bootstrap** and **CSS**, while leveraging **Django** and **Django Rest Framework (DRF)** to handle backend operations and APIs. Additionally, the application includes **M-PESA payment integration**, making it suitable for users especially here in Kenya where M-PESA is widely used.

The platform was designed with a user-first approach, focusing on speed, responsiveness, and an intuitive interface. The structured architecture ensures scalability, maintainability, and robust functionality, aligning with industry best practices.  

---

## Key Features  

### **Frontend Features (React.js)**  
The React frontend provides users with a responsive and visually appealing interface:  
- **Homepage**: Showcases featured products, why choose the company and FAQS.  
- **Products Page**: Displays a grid of all available products which will only include clothing and branded products. 
- **Product Details Page**: Provides detailed information about selected products, including images, descriptions, prices and also related products.  
- **Cart Page**: Allows users to view, update, and remove items from their shopping cart.  
- **Login & Sign-Up Pages**: Secure user authentication and registration.  
- **Profile Page**: Displays user information and order history.  
- **Checkout Page**: Guides users through the order confirmation process.  
- **Order Summary Page**: Summarizes the items in the order and calculates totals. It also shows the status of the order: ***Pending, In transit, Completed***
- **Payment Summary Page**: Allows users to complete their purchase using M-PESA or other payment methods.  Currently only mpesa is available.

### **Technologies Used (Frontend)**  
- **React Vite**: For creating and bundling the application.  
- **React Bootstrap**: For styling and responsive design.  
- **CSS**: For custom styles and UI enhancements.  
- **Toastify**: For notifications and alerts.  
- **Axios**: For making API calls to the backend.  
- **React-Router-Dom**: For implementing navigation and routing between pages.  

---

### **Backend Features (Django and DRF)**  
The Django backend powers the business logic and API endpoints for the platform:  

- **Backend App**: Handles project configuration and settings (e.g., `settings.py`).  
- **Core App**:  
  - Implements custom user models.  
  - Provides secure API endpoints for password reset and password change.  
- **Shop App**:  
  - Manages product-related APIs, including fetching product details, user information, and cart data.  
  - Facilitates order management and checkout processes.  
- **M-PESA App**:  
  - Integrates the M-PESA payment system.  
  - Provides APIs for processing payments securely and efficiently.  

### **Technologies Used (Backend)**  
- **Django**: Web framework for the backend.  
- **Django Rest Framework (DRF)**: For building and managing APIs.  
- **M-PESA API**: For mobile payment integration.  

---

## Project Structure  

### **Frontend Directory**  
```plaintext
Frontend/
├── src/
│   ├── apis/
│   ├── assets/
│   │   ├── styles/
│   │   └── images/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── routes/
│   ├── ui/
│   ├── App.jsx
│   └── Main.jsx
```

### ** Backend Directory**
```plaintext
Backend/
├── backend/
├── core/
├── mpesa_api/
├── shop_app/
└── templates/
    └── emails/
```

---

## Installation and Setup  

### **Prerequisites**  
Ensure you have the following installed:  
- Node.js (for React frontend)  
- Python and pip (for Django backend)  
- MySQL (recommended database)  

### **Frontend Setup**  
1. Clone the repository:  
   ```bash
   git clone https://github.com/your-repo.git
   cd frontend
   ```  
2. Install dependencies:  
   ```bash
   npm install
   ```  
3. Start the development server:  
   ```bash
   npm run dev
   ```  

### **Backend Setup**  
1. Navigate to the backend directory:  
   ```bash
   cd backend
   ```  
2. Create a virtual environment and activate it:  
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```  
3. Install dependencies:  
   ```bash
   pip install -r requirements.txt
   ```  
4. Apply database migrations:  
   ```bash
   python manage.py migrate
   ```  
5. Start the backend server:  
   ```bash
   python manage.py runserver
   ```  

---

## Usage  

1. Run both the frontend and backend servers.  
2. Open the frontend in your browser (e.g., `http://localhost:5173`).  
3. Interact with the application: browse products, add items to the cart, and complete checkout using M-PESA or other payment methods.  

---

## Future Enhancements  
- Add more payment options such as PayPal and Stripe.  
- Introduce product filtering and search functionalities.  
- Implement advanced user analytics and reporting tools.  
- Add support for internationalization and localization.  

---

## License  
This project is licensed under the Apache License. See the LICENSE file for details.  

---

## Contact  
For inquiries or contributions, please reach out via [rajulabonum@gmail.com] or create an issue in the repository.  

---

