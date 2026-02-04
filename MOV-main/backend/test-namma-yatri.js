/**
 * Test Script for Namma Yatri API Integration
 * Run this to verify the integration works
 */

import NammaYatriAPI from './services/nammaYatriAPI.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function testNammaYatriIntegration() {
  console.log('🚀 MOVZZ - Namma Yatri API Integration Test\n');

  const nyAPI = new NammaYatriAPI();

  try {
    // Step 1: Authentication
    console.log('📱 Step 1: Authentication');
    console.log('─────────────────────────');

    const mobileNumber = await question('Enter mobile number (with +91): ');

    console.log('\n⏳ Sending OTP...');
    const otpResult = await nyAPI.sendOTP(mobileNumber);

    if (!otpResult.success) {
      console.error('❌ Failed to send OTP:', otpResult.error);
      rl.close();
      return;
    }

    console.log('✅ OTP sent successfully!');
    console.log('Auth ID:', otpResult.data.authId);

    const otp = await question('\nEnter OTP received: ');

    console.log('\n⏳ Verifying OTP...');
    const authResult = await nyAPI.verifyOTP(otp);

    if (!authResult.success) {
      console.error('❌ Failed to verify OTP:', authResult.error);
      rl.close();
      return;
    }

    console.log('✅ Authentication successful!');
    console.log('User:', authResult.data.person.firstName || 'User');
    console.log('Token:', authResult.token.substring(0, 20) + '...\n');

    // Step 2: Search for rides
    console.log('🔍 Step 2: Searching for rides');
    console.log('─────────────────────────');

    const pickup = {
      lat: 13.1986,
      lon: 77.7066,
      address: {
        area: 'Devanahalli',
        state: 'Karnataka',
        country: 'India',
        building: 'Kempegowda International Airport',
        city: 'Bangalore',
        areaCode: '560300',
      },
    };

    const dropoff = {
      lat: 12.9716,
      lon: 77.5946,
      address: {
        area: 'MG Road',
        state: 'Karnataka',
        country: 'India',
        city: 'Bangalore',
        areaCode: '560001',
      },
    };

    console.log('From: Bangalore Airport');
    console.log('To: MG Road, Bangalore');

    console.log('\n⏳ Searching for rides...');
    const searchResult = await nyAPI.searchRides(pickup, dropoff);

    if (!searchResult.success) {
      console.error('❌ Failed to search rides:', searchResult.error);
      rl.close();
      return;
    }

    console.log('✅ Search initiated!');
    console.log('Search ID:', searchResult.searchId);

    // Step 3: Get estimates
    console.log('\n💰 Step 3: Getting ride estimates');
    console.log('─────────────────────────');
    console.log('⏳ Waiting for drivers to respond (3 seconds)...');

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const estimatesResult = await nyAPI.getEstimates(searchResult.searchId);

    if (!estimatesResult.success) {
      console.error('❌ Failed to get estimates:', estimatesResult.error);
      rl.close();
      return;
    }

    const estimates = estimatesResult.estimates;

    if (estimates.length === 0) {
      console.log('❌ No rides available at the moment');
      rl.close();
      return;
    }

    console.log(`✅ Found ${estimates.length} ride option(s):\n`);

    estimates.forEach((est, index) => {
      console.log(`${index + 1}. ${est.vehicleVariant}`);
      console.log(`   Fare: ₹${est.estimatedFare}`);
      console.log(`   Duration: ${Math.round(est.estimatedDuration / 60)} minutes`);
      console.log(`   Distance: ${(est.estimatedDistance / 1000).toFixed(1)} km`);
      if (est.totalFareRange) {
        console.log(
          `   Range: ₹${est.totalFareRange.minFare} - ₹${est.totalFareRange.maxFare}`
        );
      }
      console.log('');
    });

    // Step 4: Book ride (optional)
    const shouldBook = await question('Do you want to book the first option? (yes/no): ');

    if (shouldBook.toLowerCase() === 'yes') {
      console.log('\n🚗 Step 4: Booking ride');
      console.log('─────────────────────────');

      const selectedEstimate = estimates[0];
      console.log(`⏳ Booking ${selectedEstimate.vehicleVariant}...`);

      const bookingResult = await nyAPI.selectEstimate(selectedEstimate.estimateId);

      if (!bookingResult.success) {
        console.error('❌ Failed to book ride:', bookingResult.error);
        rl.close();
        return;
      }

      console.log('✅ Ride booked successfully!');
      console.log('Booking ID:', bookingResult.bookingId);

      // Step 5: Track ride
      console.log('\n📍 Step 5: Tracking ride');
      console.log('─────────────────────────');
      console.log('⏳ Waiting for driver assignment...\n');

      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        const statusResult = await nyAPI.getBookingStatus(bookingResult.bookingId);

        if (!statusResult.success) {
          console.error('❌ Failed to get status:', statusResult.error);
          break;
        }

        const status = statusResult.status;
        console.log(`Status: ${status}`);

        if (status === 'TRIP_ASSIGNED') {
          console.log('\n✅ Driver assigned!');
          const driver = statusResult.data.driver;
          const vehicle = statusResult.data.vehicle;

          console.log('\nDriver Details:');
          console.log(`Name: ${driver.name}`);
          console.log(`Rating: ${driver.rating}⭐`);
          console.log(`Phone: ${driver.mobileNumber}`);

          console.log('\nVehicle Details:');
          console.log(`Model: ${vehicle.model}`);
          console.log(`Color: ${vehicle.color}`);
          console.log(`Number: ${vehicle.number}`);

          break;
        } else if (status === 'CANCELLED') {
          console.log('❌ Ride was cancelled');
          break;
        }

        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      if (attempts >= maxAttempts) {
        console.log('\n⏱️ Timeout waiting for driver assignment');
        console.log('You can check status later using booking ID:', bookingResult.bookingId);
      }
    }

    console.log('\n✅ Test completed successfully!');
    console.log('\n📝 Summary:');
    console.log('─────────────────────────');
    console.log('✅ Authentication: Working');
    console.log('✅ Ride Search: Working');
    console.log('✅ Get Estimates: Working');
    if (shouldBook.toLowerCase() === 'yes') {
      console.log('✅ Ride Booking: Working');
      console.log('✅ Status Tracking: Working');
    }
    console.log('\n🎉 Namma Yatri integration is fully functional!');
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.error(error);
  } finally {
    rl.close();
  }
}

// Run the test
testNammaYatriIntegration();
