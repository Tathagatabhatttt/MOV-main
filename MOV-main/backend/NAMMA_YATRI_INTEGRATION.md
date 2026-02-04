# Namma Yatri API Integration - MOVZZ Backend

Complete integration of Namma Yatri ride booking API into MOVZZ platform.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Start Server

```bash
npm start
# or for development with auto-reload
npm run dev
```

Server will run on `http://localhost:3000` (or PORT from .env)

---

## 📋 API Endpoints

### Authentication

#### Send OTP
```http
POST /api/rides/auth/send-otp
Content-Type: application/json

{
  "mobileNumber": "+919876543210",
  "userId": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "authId": "auth_abc123",
    "attempts": 3
  }
}
```

#### Verify OTP
```http
POST /api/rides/auth/verify-otp
Content-Type: application/json

{
  "otp": "1234",
  "userId": "user123",
  "deviceToken": "movzz-device-token"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "person": {
      "id": "person_123",
      "firstName": "John",
      "mobileNumber": "+919876543210"
    }
  }
}
```

---

### Location Services

#### Autocomplete Location
```http
POST /api/rides/location/autocomplete
Content-Type: application/json

{
  "searchText": "Bangalore Airport",
  "lat": 12.9716,
  "lon": 77.5946,
  "userId": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "predictions": [
      {
        "placeId": "place_123",
        "description": "Kempegowda International Airport",
        "distance": 100
      }
    ]
  }
}
```

---

### Ride Booking

#### Search for Rides
```http
POST /api/rides/search
Content-Type: application/json

{
  "userId": "user123",
  "pickup": {
    "lat": 13.1986,
    "lon": 77.7066,
    "address": {
      "area": "Devanahalli",
      "state": "Karnataka",
      "country": "India",
      "building": "Kempegowda International Airport",
      "city": "Bangalore",
      "areaCode": "560300"
    }
  },
  "dropoff": {
    "lat": 12.9716,
    "lon": 77.5946,
    "address": {
      "area": "MG Road",
      "state": "Karnataka",
      "country": "India",
      "city": "Bangalore",
      "areaCode": "560001"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "searchId": "search_abc123",
  "data": {
    "searchId": "search_abc123",
    "searchRequestId": "req_xyz789"
  }
}
```

#### Get Ride Estimates
```http
GET /api/rides/estimates/search_abc123?userId=user123
```

**Response:**
```json
{
  "success": true,
  "estimates": [
    {
      "estimateId": "estimate_123",
      "vehicleVariant": "AUTO_RICKSHAW",
      "estimatedFare": 250,
      "estimatedDuration": 1800,
      "estimatedDistance": 25000,
      "totalFareRange": {
        "minFare": 240,
        "maxFare": 260
      }
    },
    {
      "estimateId": "estimate_456",
      "vehicleVariant": "SEDAN",
      "estimatedFare": 450,
      "estimatedDuration": 1800,
      "estimatedDistance": 25000
    }
  ]
}
```

#### Book a Ride
```http
POST /api/rides/book
Content-Type: application/json

{
  "userId": "user123",
  "estimateId": "estimate_123",
  "extraFee": 0
}
```

**Response:**
```json
{
  "success": true,
  "bookingId": "booking_abc123",
  "data": {
    "bookingId": "booking_abc123",
    "searchRequestId": "req_xyz789"
  }
}
```

#### Get Booking Status
```http
GET /api/rides/status/booking_abc123?userId=user123
```

**Response (Driver Assigned):**
```json
{
  "success": true,
  "status": "TRIP_ASSIGNED",
  "data": {
    "bookingId": "booking_abc123",
    "status": "TRIP_ASSIGNED",
    "driver": {
      "name": "Ravi Kumar",
      "mobileNumber": "+919876543211",
      "rating": 4.8
    },
    "vehicle": {
      "model": "Bajaj RE",
      "variant": "AUTO_RICKSHAW",
      "color": "Yellow",
      "number": "KA01AB1234"
    },
    "estimatedFare": 250,
    "driverLocation": {
      "lat": 13.1995,
      "lon": 77.7075
    }
  }
}
```

#### Cancel Booking
```http
POST /api/rides/cancel
Content-Type: application/json

{
  "userId": "user123",
  "bookingId": "booking_abc123",
  "reason": "Changed plans"
}
```

---

### Convenience Endpoints

#### Complete Booking Flow
One-shot API that searches, waits, and books automatically:

```http
POST /api/rides/book-complete
Content-Type: application/json

{
  "userId": "user123",
  "pickup": { /* same as search */ },
  "dropoff": { /* same as search */ },
  "waitTime": 3000
}
```

#### Poll Booking Status
Automatically polls until driver assigned:

```http
GET /api/rides/poll-status/booking_abc123?userId=user123&maxAttempts=20&interval=5000
```

---

## 💻 Frontend Integration Examples

### React/JavaScript Example

```javascript
// 1. Send OTP
async function sendOTP(mobileNumber) {
  const response = await fetch('http://localhost:3000/api/rides/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mobileNumber: mobileNumber,
      userId: 'user123' // Use actual user ID
    })
  });
  return await response.json();
}

// 2. Verify OTP
async function verifyOTP(otp) {
  const response = await fetch('http://localhost:3000/api/rides/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      otp: otp,
      userId: 'user123'
    })
  });
  return await response.json();
}

// 3. Search for rides
async function searchRides(pickup, dropoff) {
  const response = await fetch('http://localhost:3000/api/rides/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 'user123',
      pickup: pickup,
      dropoff: dropoff
    })
  });
  return await response.json();
}

// 4. Get estimates
async function getEstimates(searchId) {
  const response = await fetch(
    `http://localhost:3000/api/rides/estimates/${searchId}?userId=user123`
  );
  return await response.json();
}

// 5. Book ride
async function bookRide(estimateId) {
  const response = await fetch('http://localhost:3000/api/rides/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 'user123',
      estimateId: estimateId
    })
  });
  return await response.json();
}

// 6. Track ride
async function trackRide(bookingId) {
  const response = await fetch(
    `http://localhost:3000/api/rides/status/${bookingId}?userId=user123`
  );
  return await response.json();
}

// Complete flow example
async function completeBookingFlow() {
  // 1. Authenticate
  await sendOTP('+919876543210');
  const otp = prompt('Enter OTP:');
  await verifyOTP(otp);

  // 2. Search
  const pickup = {
    lat: 13.1986,
    lon: 77.7066,
    address: {
      area: "Devanahalli",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      areaCode: "560300"
    }
  };

  const dropoff = {
    lat: 12.9716,
    lon: 77.5946,
    address: {
      area: "MG Road",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      areaCode: "560001"
    }
  };

  const searchResult = await searchRides(pickup, dropoff);
  
  // 3. Wait and get estimates
  await new Promise(resolve => setTimeout(resolve, 3000));
  const estimates = await getEstimates(searchResult.searchId);

  // 4. Book first estimate
  const booking = await bookRide(estimates.estimates[0].estimateId);

  // 5. Track ride
  const status = await trackRide(booking.bookingId);
  console.log('Ride status:', status);
}
```

---

## 🔧 Testing with cURL

### Complete Test Flow

```bash
# 1. Send OTP
curl -X POST http://localhost:3000/api/rides/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "mobileNumber": "+919876543210",
    "userId": "test-user"
  }'

# 2. Verify OTP (replace with actual OTP)
curl -X POST http://localhost:3000/api/rides/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "otp": "1234",
    "userId": "test-user"
  }'

# 3. Search rides
curl -X POST http://localhost:3000/api/rides/search \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "pickup": {
      "lat": 13.1986,
      "lon": 77.7066,
      "address": {
        "area": "Devanahalli",
        "city": "Bangalore",
        "state": "Karnataka",
        "country": "India",
        "areaCode": "560300"
      }
    },
    "dropoff": {
      "lat": 12.9716,
      "lon": 77.5946,
      "address": {
        "area": "MG Road",
        "city": "Bangalore",
        "state": "Karnataka",
        "country": "India",
        "areaCode": "560001"
      }
    }
  }'

# 4. Get estimates (replace SEARCH_ID)
curl http://localhost:3000/api/rides/estimates/SEARCH_ID?userId=test-user

# 5. Book ride (replace ESTIMATE_ID)
curl -X POST http://localhost:3000/api/rides/book \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "estimateId": "ESTIMATE_ID"
  }'

# 6. Check status (replace BOOKING_ID)
curl http://localhost:3000/api/rides/status/BOOKING_ID?userId=test-user
```

---

## 🎯 Next Steps

### 1. Add Database
Replace in-memory `userSessions` Map with Redis or MongoDB:

```javascript
// Example with Redis
import Redis from 'ioredis';
const redis = new Redis();

// Store token
await redis.set(`user:${userId}:token`, token, 'EX', 3600);

// Retrieve token
const token = await redis.get(`user:${userId}:token`);
```

### 2. Add More Providers
Extend with Uber/Ola/Rapido when you get API access:

```javascript
// services/movzzReliabilityEngine.js
class MovzzReliabilityEngine {
  async getAvailableRides(pickup, dropoff) {
    const rides = [];
    
    // Namma Yatri
    const nyRides = await this.nammaYatri.searchRides(pickup, dropoff);
    rides.push(...nyRides);
    
    // TODO: Add Uber
    // const uberRides = await this.uber.searchRides(pickup, dropoff);
    
    // TODO: Add Ola
    // const olaRides = await this.ola.searchRides(pickup, dropoff);
    
    return rides.sort((a, b) => a.reliabilityScore - b.reliabilityScore);
  }
}
```

### 3. Add WebSocket for Real-time Updates

```javascript
import { Server } from 'socket.io';

const io = new Server(server);

io.on('connection', (socket) => {
  socket.on('track-ride', async (bookingId) => {
    // Poll and emit updates
    const interval = setInterval(async () => {
      const status = await nyAPI.getBookingStatus(bookingId);
      socket.emit('ride-update', status);
      
      if (status.status === 'COMPLETED') {
        clearInterval(interval);
      }
    }, 5000);
  });
});
```

---

## 📝 Notes

- **User Sessions**: Currently stored in memory. Use Redis/MongoDB for production.
- **Rate Limiting**: Add rate limiting to prevent abuse.
- **Error Handling**: All endpoints have try-catch, but add more specific error codes.
- **Authentication**: Add proper JWT authentication for production.
- **Logging**: Add Winston or similar for production logging.

---

## 🐛 Troubleshooting

### "Module not found: axios"
```bash
npm install axios
```

### "Cannot find module './routes/rides.js'"
Make sure the file structure is:
```
backend/
├── index.js
├── routes/
│   └── rides.js
└── services/
    └── nammaYatriAPI.js
```

### "Invalid token" error
Token might have expired. Re-authenticate:
1. Send OTP again
2. Verify OTP
3. New token will be set automatically

---

## ✅ Integration Complete!

Your MOVZZ backend now has full Namma Yatri integration. You can:
- ✅ Authenticate users
- ✅ Search for rides
- ✅ Get estimates
- ✅ Book rides
- ✅ Track rides in real-time
- ✅ Cancel bookings

**Next**: Connect your frontend to these endpoints and start testing! 🚀
