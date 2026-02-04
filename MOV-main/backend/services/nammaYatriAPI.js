/**
 * Namma Yatri API Integration Service
 * Complete implementation for ride booking via Namma Yatri
 */

import axios from 'axios';

class NammaYatriAPI {
  constructor() {
    this.baseURL = 'https://api.nammayatri.in';
    this.token = null;
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get headers with authentication token
   */
  _getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['token'] = this.token;
    }
    return headers;
  }

  /**
   * Set authentication token
   */
  setToken(token) {
    this.token = token;
  }

  // ==================== AUTHENTICATION ====================

  /**
   * Send OTP to mobile number
   * @param {string} mobileNumber - Mobile number with country code (e.g., "+919876543210")
   * @param {string} countryCode - Country code (default: "+91")
   */
  async sendOTP(mobileNumber, countryCode = '+91') {
    try {
      const response = await this.axiosInstance.post(
        '/v2/auth/get-token',
        {
          mobileNumber,
          mobileCountryCode: countryCode,
        },
        { headers: this._getHeaders() }
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  /**
   * Verify OTP and get authentication token
   * @param {string} otp - OTP received on mobile
   * @param {string} deviceToken - Unique device identifier
   */
  async verifyOTP(otp, deviceToken = 'movzz-device') {
    try {
      const response = await this.axiosInstance.post(
        '/v2/auth/verify-token',
        {
          otp,
          deviceToken,
          whatsappNotificationEnroll: 'OPT_IN',
        },
        { headers: this._getHeaders() }
      );

      // Save token for future requests
      if (response.data.token) {
        this.setToken(response.data.token);
      }

      return {
        success: true,
        data: response.data,
        token: response.data.token,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  // ==================== LOCATION SERVICES ====================

  /**
   * Autocomplete location search
   * @param {string} searchText - Search query
   * @param {number} lat - Current latitude
   * @param {number} lon - Current longitude
   */
  async autocompleteLocation(searchText, lat, lon) {
    try {
      const response = await this.axiosInstance.post(
        '/v2/maps/autoComplete',
        {
          input: searchText,
          location: { lat, lon },
        },
        { headers: this._getHeaders() }
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  // ==================== RIDE BOOKING ====================

  /**
   * Search for available rides
   * @param {object} pickup - Pickup location { lat, lon, address }
   * @param {object} dropoff - Dropoff location { lat, lon, address }
   */
  async searchRides(pickup, dropoff) {
    try {
      const response = await this.axiosInstance.post(
        '/v2/rideSearch',
        {
          startLocation: {
            gps: { lat: pickup.lat, lon: pickup.lon },
            address: pickup.address,
          },
          endLocation: {
            gps: { lat: dropoff.lat, lon: dropoff.lon },
            address: dropoff.address,
          },
        },
        { headers: this._getHeaders() }
      );
      return {
        success: true,
        data: response.data,
        searchId: response.data.searchId,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  /**
   * Get ride estimates for a search
   * @param {string} searchId - Search ID from searchRides
   */
  async getEstimates(searchId) {
    try {
      const response = await this.axiosInstance.get(
        `/v2/rideSearch/${searchId}/results`,
        { headers: this._getHeaders() }
      );
      return {
        success: true,
        data: response.data,
        estimates: response.data.estimates || [],
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  /**
   * Select an estimate and book ride
   * @param {string} estimateId - Estimate ID to book
   * @param {number} extraFee - Additional fee (default: 0)
   */
  async selectEstimate(estimateId, extraFee = 0) {
    try {
      const response = await this.axiosInstance.post(
        `/v2/estimate/${estimateId}/select2`,
        {
          customerExtraFee: extraFee,
          autoAssignEnabled: true,
        },
        { headers: this._getHeaders() }
      );
      return {
        success: true,
        data: response.data,
        bookingId: response.data.bookingId,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  /**
   * Get booking status
   * @param {string} bookingId - Booking ID
   */
  async getBookingStatus(bookingId) {
    try {
      const response = await this.axiosInstance.get(
        `/v2/booking/${bookingId}/fetch_status`,
        { headers: this._getHeaders() }
      );
      return {
        success: true,
        data: response.data,
        status: response.data.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  /**
   * Cancel a booking
   * @param {string} bookingId - Booking ID to cancel
   * @param {string} reason - Cancellation reason
   */
  async cancelBooking(bookingId, reason = 'Customer cancelled') {
    try {
      const response = await this.axiosInstance.post(
        `/v2/booking/${bookingId}/cancel`,
        {
          reasonCode: 'CUSTOMER_CANCELLED',
          additionalInfo: reason,
        },
        { headers: this._getHeaders() }
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  // ==================== HELPER METHODS ====================

  /**
   * Complete ride booking flow with polling
   * @param {object} pickup - Pickup location
   * @param {object} dropoff - Dropoff location
   * @param {number} waitTime - Time to wait for estimates (ms)
   */
  async bookRideComplete(pickup, dropoff, waitTime = 3000) {
    // Step 1: Search for rides
    const searchResult = await this.searchRides(pickup, dropoff);
    if (!searchResult.success) {
      return searchResult;
    }

    const searchId = searchResult.searchId;

    // Step 2: Wait for drivers to respond
    await new Promise((resolve) => setTimeout(resolve, waitTime));

    // Step 3: Get estimates
    const estimatesResult = await this.getEstimates(searchId);
    if (!estimatesResult.success || estimatesResult.estimates.length === 0) {
      return {
        success: false,
        error: 'No rides available',
      };
    }

    // Step 4: Select first estimate (or implement logic to choose best)
    const selectedEstimate = estimatesResult.estimates[0];
    const bookingResult = await this.selectEstimate(selectedEstimate.estimateId);

    return bookingResult;
  }

  /**
   * Poll booking status until driver assigned or timeout
   * @param {string} bookingId - Booking ID
   * @param {number} maxAttempts - Maximum polling attempts
   * @param {number} interval - Polling interval (ms)
   */
  async pollBookingStatus(bookingId, maxAttempts = 20, interval = 5000) {
    for (let i = 0; i < maxAttempts; i++) {
      const statusResult = await this.getBookingStatus(bookingId);

      if (!statusResult.success) {
        return statusResult;
      }

      const status = statusResult.status;

      // Terminal states
      if (
        status === 'TRIP_ASSIGNED' ||
        status === 'INPROGRESS' ||
        status === 'COMPLETED' ||
        status === 'CANCELLED'
      ) {
        return statusResult;
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    return {
      success: false,
      error: 'Timeout waiting for driver assignment',
    };
  }
}

export default NammaYatriAPI;
