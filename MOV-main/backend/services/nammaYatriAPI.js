/**
 * Namma Yatri API Integration Service
 * Complete implementation for ride booking via Namma Yatri
 * Includes a Simulation Fallback for stable demo performance
 */

import axios from 'axios';

class NammaYatriAPI {
  constructor() {
    this.baseURL = 'https://api.nammayatri.in';
    this.token = null;
    this.simulationMode = false; // Will auto-activate on DNS/connection failure
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Simulated database for demo stability
    this.simData = {
      sessions: new Map(), // searchID -> data
      bookings: new Map(), // bookingID -> data
    };
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
   */
  async sendOTP(mobileNumber, countryCode = '+91') {
    try {
      const response = await this.axiosInstance.post(
        '/v2/auth/get-token',
        { mobileNumber, mobileCountryCode: countryCode },
        { headers: this._getHeaders() }
      );
      return { success: true, data: response.data };
    } catch (error) {
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNABORTED' || !error.response) {
        console.warn('⚠️ Namma Yatri API unreachable. Using Simulation Mode for Demo.');
        this.simulationMode = true;
        return {
          success: true,
          simulated: true,
          data: { authId: `sim_auth_${Date.now()}`, attempts: 3 }
        };
      }
      return { success: false, error: error.response?.data || error.message };
    }
  }

  /**
   * Verify OTP
   */
  async verifyOTP(otp, deviceToken = 'movzz-device') {
    if (this.simulationMode) {
      this.setToken('sim_token_xyz_123');
      return {
        success: true,
        simulated: true,
        token: 'sim_token_xyz_123',
        data: {
          person: { id: 'sim_user_1', firstName: 'Demo User', mobileNumber: '+918420099237' }
        }
      };
    }

    try {
      const response = await this.axiosInstance.post(
        '/v2/auth/verify-token',
        { otp, deviceToken, whatsappNotificationEnroll: 'OPT_IN' },
        { headers: this._getHeaders() }
      );
      if (response.data.token) this.setToken(response.data.token);
      return { success: true, data: response.data, token: response.data.token };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  // ==================== RIDE BOOKING ====================

  /**
   * Search for available rides
   */
  async searchRides(pickup, dropoff) {
    if (this.simulationMode || pickup.address.includes('Demo')) {
      const searchId = `sim_search_${Math.random().toString(36).substring(7)}`;
      this.simData.sessions.set(searchId, { pickup, dropoff, timestamp: Date.now() });
      return { success: true, simulated: true, searchId };
    }

    try {
      const response = await this.axiosInstance.post(
        '/v2/rideSearch',
        {
          startLocation: { gps: { lat: pickup.lat, lon: pickup.lon }, address: pickup.address },
          endLocation: { gps: { lat: dropoff.lat, lon: dropoff.lon }, address: dropoff.address },
        },
        { headers: this._getHeaders() }
      );
      return { success: true, data: response.data, searchId: response.data.searchId };
    } catch (error) {
      if (error.code === 'ENOTFOUND' || !error.response) {
        this.simulationMode = true;
        return this.searchRides(pickup, dropoff);
      }
      return { success: false, error: error.response?.data || error.message };
    }
  }

  /**
   * Get ride estimates
   */
  async getEstimates(searchId) {
    if (this.simulationMode || searchId.startsWith('sim_')) {
      const session = this.simData.sessions.get(searchId);
      const baseFare = 150 + Math.floor(Math.random() * 100);

      const estimates = [
        {
          estimateId: `sim_est_auto_${searchId}`,
          vehicleVariant: 'AUTO_RICKSHAW',
          estimatedFare: baseFare,
          estimatedDuration: 900 + Math.floor(Math.random() * 300),
          estimatedDistance: 5400,
          totalFareRange: { minFare: baseFare - 5, maxFare: baseFare + 10 }
        },
        {
          estimateId: `sim_est_sedan_${searchId}`,
          vehicleVariant: 'SEDAN',
          estimatedFare: baseFare * 1.8,
          estimatedDuration: 850,
          estimatedDistance: 5400
        }
      ];
      return { success: true, simulated: true, estimates };
    }

    try {
      const response = await this.axiosInstance.get(
        `/v2/rideSearch/${searchId}/results`,
        { headers: this._getHeaders() }
      );
      return { success: true, data: response.data, estimates: response.data.estimates || [] };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  /**
   * Select an estimate and book
   */
  async selectEstimate(estimateId, extraFee = 0) {
    if (this.simulationMode || estimateId.startsWith('sim_')) {
      const bookingId = `sim_book_${Math.random().toString(36).substring(7)}`;
      this.simData.bookings.set(bookingId, {
        id: bookingId,
        status: 'SEARCHING',
        createdAt: Date.now(),
        driverAssignedAt: Date.now() + 8000, // Assigned after 8 seconds
        vehicleVariant: estimateId.includes('auto') ? 'AUTO_RICKSHAW' : 'SEDAN'
      });
      return { success: true, simulated: true, bookingId };
    }

    try {
      const response = await this.axiosInstance.post(
        `/v2/estimate/${estimateId}/select2`,
        { customerExtraFee: extraFee, autoAssignEnabled: true },
        { headers: this._getHeaders() }
      );
      return { success: true, data: response.data, bookingId: response.data.bookingId };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  /**
   * Get booking status (Real-time Simulation)
   */
  async getBookingStatus(bookingId) {
    if (this.simulationMode || bookingId.startsWith('sim_')) {
      const booking = this.simData.bookings.get(bookingId);
      if (!booking) return { success: false, error: 'Booking not found' };

      const now = Date.now();
      let status = 'SEARCHING';
      let data = { status: 'SEARCHING' };

      if (now > booking.driverAssignedAt) {
        status = 'TRIP_ASSIGNED';
        data = {
          status: 'TRIP_ASSIGNED',
          driver: { name: 'Ravi Kumar', mobileNumber: '+919876543211', rating: 4.8 },
          vehicle: { model: 'Bajaj RE', variant: booking.vehicleVariant, color: 'Yellow', number: 'KA01AB1234' },
          driverLocation: { lat: 12.9720, lon: 77.5950 }
        };
      }

      return { success: true, simulated: true, status, data };
    }

    try {
      const response = await this.axiosInstance.get(
        `/v2/booking/${bookingId}/fetch_status`,
        { headers: this._getHeaders() }
      );
      return { success: true, data: response.data, status: response.data.status };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  /**
   * Cancel booking
   */
  async cancelBooking(bookingId, reason = 'Customer cancelled') {
    if (this.simulationMode || bookingId.startsWith('sim_')) {
      this.simData.bookings.delete(bookingId);
      return { success: true, simulated: true };
    }

    try {
      const response = await this.axiosInstance.post(
        `/v2/booking/${bookingId}/cancel`,
        { reasonCode: 'CUSTOMER_CANCELLED', additionalInfo: reason },
        { headers: this._getHeaders() }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  // Helper methods remain the same but will use the enhanced simulated methods
  async bookRideComplete(pickup, dropoff, waitTime = 3000) {
    const searchResult = await this.searchRides(pickup, dropoff);
    if (!searchResult.success) return searchResult;
    await new Promise((resolve) => setTimeout(resolve, waitTime));
    const estimatesResult = await this.getEstimates(searchResult.searchId);
    if (!estimatesResult.success || estimatesResult.estimates.length === 0) {
      return { success: false, error: 'No rides available' };
    }
    return this.selectEstimate(estimatesResult.estimates[0].estimateId);
  }

  async pollBookingStatus(bookingId, maxAttempts = 20, interval = 2000) {
    for (let i = 0; i < maxAttempts; i++) {
      const statusResult = await this.getBookingStatus(bookingId);
      if (!statusResult.success) return statusResult;
      const status = statusResult.status;
      if (['TRIP_ASSIGNED', 'INPROGRESS', 'COMPLETED', 'CANCELLED'].includes(status)) {
        return statusResult;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return { success: false, error: 'Timeout waiting for driver assignment' };
  }
}

export default NammaYatriAPI;
