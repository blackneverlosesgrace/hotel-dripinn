# Hotel Dripinn - Setup Instructions

## Environment Variables Setup

Before running the application, you need to configure your environment variables:

### Backend Setup

1. Navigate to the `server` folder:
   ```bash
   cd server
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit `server/.env` and add your actual API keys:

   - **GOOGLE_MAPS_API_KEY**: Get from [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
   - **ADMIN_SECRET_KEY**: Create a strong, random secret key for admin registration
   - **INSTAGRAM_ACCESS_TOKEN** (Optional): For Instagram feed feature
   - **INSTAGRAM_USER_ID** (Optional): Your Instagram user ID

### Running the Application

1. Install backend dependencies:
   ```bash
   cd server
   npm install
   npm start
   ```

2. Install frontend dependencies (in a new terminal):
   ```bash
   cd hotel-app
   npm install
   npm run dev
   ```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## Security Notes

- **Never commit `.env` files** to version control
- Change the `ADMIN_SECRET_KEY` to a strong, unique value
- Keep all API keys private and secure
- Consider using environment-specific configs for production

## WhatsApp Integration

The booking system sends WhatsApp messages to: **917706978533**

To change this number, update it in:
- `src/components/bookings/PaymentMethod.jsx`
- `src/components/bookings/UPIPayment.jsx`

## Payment Setup

Current implementation uses manual UPI/QR code verification. For production:
- Consider integrating [Razorpay](https://razorpay.com/) for automated payment processing
- Update the QR code image at `src/assets/payment-qr.png`
