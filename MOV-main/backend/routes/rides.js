/**
 * Ride Booking Routes
 * API endpoints for MOVZZ ride booking functionality
 */

import express from 'express';
import NammaYatriAPI from '../services/nammaYatriAPI.js';

const router = express.Router();

// Store user sessions (replace with Redis/MongoDB in production)
const userSessions = new Map();

/**
 * Get or create Namma Yatri API instance for user
 */
function getNammaYatriInstance(userId) {
  if (!userSessions.has(userId)) {
    userSessions.set(userId, new NammaYatriAPI());
  }
  return userSessions.get(userId);
}

// ==================== AUTHENTICATION ROUTES ====================

/**
 * POST /api/rides/auth/send-otp
 * Send OTP to user's mobile number
 */
router.post('/auth/send-otp', async (req, res) => {
  try {
    const { mobileNumber, userId } = req.body;

    if (!mobileNumber || !userId) {
      return res.status(400).json({
        success: false,
        error: 'mobileNumber and userId are required',
      });
    }

    const nyAPI = getNammaYatriInstance(userId);
    const result = await nyAPI.sendOTP(mobileNumber);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/rides/auth/verify-otp
 * Verify OTP and authenticate user
 */
router.post('/auth/verify-otp', async (req, res) => {
  try {
    const { otp, userId, deviceToken } = req.body;

    if (!otp || !userId) {
      return res.status(400).json({
        success: false,
        error: 'otp and userId are required',
      });
    }

    const nyAPI = getNammaYatriInstance(userId);
    const result = await nyAPI.verifyOTP(otp, deviceToken);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ==================== LOCATION ROUTES ====================

/**
 * POST /api/rides/location/autocomplete
 * Search for locations
 */
router.post('/location/autocomplete', async (req, res) => {
  try {
    const { searchText, lat, lon, userId } = req.body;

    if (!searchText || !userId) {
      return res.status(400).json({
        success: false,
        error: 'searchText and userId are required',
      });
    }

    const nyAPI = getNammaYatriInstance(userId);
    const result = await nyAPI.autocompleteLocation(
      searchText,
      lat || 12.9716,
      lon || 77.5946
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ==================== RIDE BOOKING ROUTES ====================

/**
 * POST /api/rides/search
 * Search for available rides
 */
router.post('/search', async (req, res) => {
  try {
    const { pickup, dropoff, userId } = req.body;

    if (!pickup || !dropoff || !userId) {
      return res.status(400).json({
        success: false,
        error: 'pickup, dropoff, and userId are required',
      });
    }

    const nyAPI = getNammaYatriInstance(userId);
    const result = await nyAPI.searchRides(pickup, dropoff);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/rides/estimates/:searchId
 * Get ride estimates for a search
 */
router.get('/estimates/:searchId', async (req, res) => {
  try {
    const { searchId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required',
      });
    }

    const nyAPI = getNammaYatriInstance(userId);
    const result = await nyAPI.getEstimates(searchId);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/rides/book
 * Book a ride by selecting an estimate
 */
router.post('/book', async (req, res) => {
  try {
    const { estimateId, extraFee, userId } = req.body;

    if (!estimateId || !userId) {
      return res.status(400).json({
        success: false,
        error: 'estimateId and userId are required',
      });
    }

    const nyAPI = getNammaYatriInstance(userId);
    const result = await nyAPI.selectEstimate(estimateId, extraFee || 0);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/rides/status/:bookingId
 * Get booking status
 */
router.get('/status/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required',
      });
    }

    const nyAPI = getNammaYatriInstance(userId);
    const result = await nyAPI.getBookingStatus(bookingId);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/rides/cancel
 * Cancel a booking
 */
router.post('/cancel', async (req, res) => {
  try {
    const { bookingId, reason, userId } = req.body;

    if (!bookingId || !userId) {
      return res.status(400).json({
        success: false,
        error: 'bookingId and userId are required',
      });
    }

    const nyAPI = getNammaYatriInstance(userId);
    const result = await nyAPI.cancelBooking(bookingId, reason);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ==================== CONVENIENCE ROUTES ====================

/**
 * POST /api/rides/book-complete
 * Complete ride booking flow (search + wait + book)
 */
router.post('/book-complete', async (req, res) => {
  try {
    const { pickup, dropoff, userId, waitTime } = req.body;

    if (!pickup || !dropoff || !userId) {
      return res.status(400).json({
        success: false,
        error: 'pickup, dropoff, and userId are required',
      });
    }

    const nyAPI = getNammaYatriInstance(userId);
    const result = await nyAPI.bookRideComplete(pickup, dropoff, waitTime);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/rides/poll-status/:bookingId
 * Poll booking status until driver assigned
 */
router.get('/poll-status/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { userId, maxAttempts, interval } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required',
      });
    }

    const nyAPI = getNammaYatriInstance(userId);
    const result = await nyAPI.pollBookingStatus(
      bookingId,
      parseInt(maxAttempts) || 20,
      parseInt(interval) || 5000
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
