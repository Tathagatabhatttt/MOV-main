# 🚀 MOVZZ Backend - Quick Setup Guide

## Installation & Testing

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install:
- ✅ axios (for Namma Yatri API calls)
- ✅ express (web server)
- ✅ cors (cross-origin requests)
- ✅ dotenv (environment variables)
- ✅ razorpay (payments)

### 2. Start the Server

```bash
npm start
```

You should see:
```
🚀 MOVZZ Backend running on port 3000
```

### 3. Test the Integration

Open a new terminal and run:

```bash
node test-namma-yatri.js
```

Follow the prompts:
1. Enter your mobile number (with +91)
2. Enter the OTP you receive
3. See available rides from Airport to MG Road
4. Optionally book a ride and track it

### 4. Test with cURL

```bash
# Health check
curl http://localhost:3000/

# Send OTP
curl -X POST http://localhost:3000/api/rides/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"mobileNumber": "+919876543210", "userId": "test"}'
```

## 📁 File Structure

```
backend/
├── index.js                          # Main server file
├── package.json                      # Dependencies
├── .env                             # Environment variables
├── services/
│   └── nammaYatriAPI.js            # Namma Yatri API client
├── routes/
│   └── rides.js                    # Ride booking routes
├── test-namma-yatri.js             # Test script
├── SETUP.md                        # This file
└── NAMMA_YATRI_INTEGRATION.md      # Full documentation
```

## 🎯 Available Endpoints

### Authentication
- `POST /api/rides/auth/send-otp` - Send OTP
- `POST /api/rides/auth/verify-otp` - Verify OTP

### Ride Booking
- `POST /api/rides/search` - Search for rides
- `GET /api/rides/estimates/:searchId` - Get estimates
- `POST /api/rides/book` - Book a ride
- `GET /api/rides/status/:bookingId` - Track ride
- `POST /api/rides/cancel` - Cancel ride

### Convenience
- `POST /api/rides/book-complete` - One-shot booking
- `GET /api/rides/poll-status/:bookingId` - Auto-poll status

## 🔧 Environment Variables

Your `.env` file should have:

```env
PORT=3000
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

## ✅ Verification Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Server starts without errors (`npm start`)
- [ ] Health check works (`curl http://localhost:3000/`)
- [ ] Test script runs (`node test-namma-yatri.js`)
- [ ] Can send OTP
- [ ] Can verify OTP
- [ ] Can search for rides
- [ ] Can get estimates

## 🐛 Common Issues

### "Cannot find module 'axios'"
```bash
npm install axios
```

### "Port 3000 already in use"
Change PORT in `.env` or kill the process:
```bash
# Find process
lsof -i :3000

# Kill it
kill -9 <PID>
```

### "Module not found: ./routes/rides.js"
Make sure you have the correct file structure. All files should be in `backend/` directory.

## 📚 Next Steps

1. ✅ Read `NAMMA_YATRI_INTEGRATION.md` for full API documentation
2. ✅ Connect your frontend to these endpoints
3. ✅ Add database (MongoDB/Redis) for production
4. ✅ Add more ride providers (Uber, Ola, Rapido)
5. ✅ Implement MOVZZ reliability engine

## 🎉 You're Ready!

Your MOVZZ backend now has full Namma Yatri integration. Start building your frontend and connect to these APIs!

For detailed API documentation, see `NAMMA_YATRI_INTEGRATION.md`.
