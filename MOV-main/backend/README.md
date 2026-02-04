# 🚗 MOVZZ Backend - Namma Yatri Integration

Complete backend implementation for MOVZZ ride reliability platform with Namma Yatri API integration.

## ✅ What's Been Integrated

Your MOVZZ backend now has:

- ✅ **Full Namma Yatri API Integration** - Complete ride booking functionality
- ✅ **Authentication System** - OTP-based user authentication
- ✅ **Ride Search & Booking** - Search, estimate, and book rides
- ✅ **Real-time Tracking** - Track ride status and driver location
- ✅ **RESTful API** - Clean, documented endpoints
- ✅ **Test Suite** - Interactive test script
- ✅ **Frontend Example** - HTML demo for testing

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start Server
```bash
npm start
```

Server runs on `http://localhost:3000`

### 3. Test Integration
```bash
# Interactive test
node test-namma-yatri.js

# Or open in browser
open examples/frontend-integration.html
```

## 📁 Project Structure

```
backend/
├── index.js                          # Main server (✅ Updated)
├── package.json                      # Dependencies (✅ Updated)
├── .env                             # Environment variables
│
├── services/
│   └── nammaYatriAPI.js            # ✅ NEW: Namma Yatri API client
│
├── routes/
│   └── rides.js                    # ✅ NEW: Ride booking routes
│
├── examples/
│   └── frontend-integration.html   # ✅ NEW: Test frontend
│
├── test-namma-yatri.js             # ✅ NEW: Test script
├── SETUP.md                        # ✅ NEW: Setup guide
├── NAMMA_YATRI_INTEGRATION.md      # ✅ NEW: Full API docs
└── README.md                       # This file
```

## 🎯 API Endpoints

### Authentication
- `POST /api/rides/auth/send-otp` - Send OTP to mobile
- `POST /api/rides/auth/verify-otp` - Verify OTP and authenticate

### Ride Booking
- `POST /api/rides/search` - Search for available rides
- `GET /api/rides/estimates/:searchId` - Get ride estimates
- `POST /api/rides/book` - Book a ride
- `GET /api/rides/status/:bookingId` - Get ride status
- `POST /api/rides/cancel` - Cancel a booking

### Convenience
- `POST /api/rides/book-complete` - Complete booking flow
- `GET /api/rides/poll-status/:bookingId` - Auto-poll status

### Payment (Existing)
- `POST /api/create-order` - Create Razorpay order
- `POST /api/verify-payment` - Verify payment
- `GET /api/status` - Check payment status

## 📖 Documentation

- **[SETUP.md](SETUP.md)** - Quick setup guide
- **[NAMMA_YATRI_INTEGRATION.md](NAMMA_YATRI_INTEGRATION.md)** - Complete API documentation
- **[examples/frontend-integration.html](examples/frontend-integration.html)** - Working frontend example

## 🧪 Testing

### Option 1: Interactive Test Script
```bash
node test-namma-yatri.js
```

Follow the prompts to:
1. Authenticate with your mobile number
2. Search for rides (Airport → MG Road)
3. View available estimates
4. Book a ride
5. Track the ride

### Option 2: Frontend Demo
```bash
# Start server
npm start

# Open in browser
open examples/frontend-integration.html
```

### Option 3: cURL
```bash
# Send OTP
curl -X POST http://localhost:3000/api/rides/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"mobileNumber": "+919876543210", "userId": "test"}'

# Verify OTP
curl -X POST http://localhost:3000/api/rides/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"otp": "1234", "userId": "test"}'
```

## 🔧 Configuration

### Environment Variables (.env)
```env
PORT=3000
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### Dependencies
```json
{
  "axios": "^1.6.2",        // ✅ NEW: For Namma Yatri API
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "nodemailer": "^7.0.13",
  "razorpay": "^2.9.2",
  "twilio": "^4.19.0"
}
```

## 💡 Usage Example

### JavaScript/React
```javascript
// 1. Send OTP
const sendOTP = async (mobile) => {
  const res = await fetch('http://localhost:3000/api/rides/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobileNumber: mobile, userId: 'user123' })
  });
  return await res.json();
};

// 2. Verify OTP
const verifyOTP = async (otp) => {
  const res = await fetch('http://localhost:3000/api/rides/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ otp, userId: 'user123' })
  });
  return await res.json();
};

// 3. Search rides
const searchRides = async (pickup, dropoff) => {
  const res = await fetch('http://localhost:3000/api/rides/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 'user123', pickup, dropoff })
  });
  return await res.json();
};

// 4. Book ride
const bookRide = async (estimateId) => {
  const res = await fetch('http://localhost:3000/api/rides/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 'user123', estimateId })
  });
  return await res.json();
};
```

## 🎨 Features

### ✅ Implemented
- [x] Namma Yatri API integration
- [x] OTP authentication
- [x] Ride search and booking
- [x] Real-time tracking
- [x] Cancellation support
- [x] Location autocomplete
- [x] Multiple vehicle types
- [x] Fare estimation
- [x] Driver details
- [x] Payment integration (Razorpay)

### 🚧 Coming Soon
- [ ] MongoDB/Redis for session storage
- [ ] Uber API integration
- [ ] Ola API integration
- [ ] Rapido API integration
- [ ] WebSocket for real-time updates
- [ ] MOVZZ reliability engine
- [ ] Multi-provider comparison
- [ ] Automatic fallback system

## 📊 Coverage

### Namma Yatri Cities
- ✅ Bangalore
- ✅ Kochi
- ✅ Chennai
- ✅ Delhi
- ✅ Kolkata

### Vehicle Types
- ✅ Auto Rickshaw
- ✅ Sedan
- ✅ Bike Taxi
- ✅ Cab

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port is in use
lsof -i :3000

# Install dependencies
npm install
```

### "Cannot find module 'axios'"
```bash
npm install axios
```

### "Invalid token" error
Token expired. Re-authenticate:
1. Send OTP again
2. Verify OTP
3. New token will be set

### No rides available
- Check if you're in a supported city
- Try different pickup/dropoff locations
- Wait a bit longer for estimates (3-5 seconds)

## 📝 Next Steps

1. **Connect Frontend**: Use the API endpoints in your React/Vue/Angular app
2. **Add Database**: Replace in-memory storage with MongoDB/Redis
3. **Add More Providers**: Integrate Uber, Ola, Rapido when you get API access
4. **Build Reliability Engine**: Implement MOVZZ's core reliability logic
5. **Deploy**: Deploy to production (Heroku, AWS, DigitalOcean)

## 🤝 Contributing

This is your MOVZZ backend. To add features:

1. Create new service in `services/`
2. Add routes in `routes/`
3. Update `index.js` to mount routes
4. Test with `test-*.js` scripts
5. Document in markdown files

## 📄 License

ISC

## 🎉 Success!

Your MOVZZ backend is now fully integrated with Namma Yatri! 

**What you can do now:**
- ✅ Book real rides via API
- ✅ Track rides in real-time
- ✅ Test with interactive script
- ✅ Connect your frontend
- ✅ Deploy to production

**Start building the future of reliable urban mobility! 🚀**

---

For detailed API documentation, see [NAMMA_YATRI_INTEGRATION.md](NAMMA_YATRI_INTEGRATION.md)
