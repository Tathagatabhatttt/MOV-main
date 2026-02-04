import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const razorpayLink = "https://razorpay.me/@tathagatabhattacherjee";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentClicked, setPaymentClicked] = useState(false);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);

  const sendWhatsAppMessage = async (userName, userPhone) => {
    setSendingWhatsApp(true);
    try {
      const response = await fetch('http://localhost:3001/api/send-welcome', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userName,
          phone: userPhone
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ WhatsApp message sent successfully!');
      } else {
        console.error('❌ Failed to send WhatsApp message');
      }
    } catch (error) {
      console.error('❌ Error sending WhatsApp:', error);
    } finally {
      setSendingWhatsApp(false);
    }
  };

  const continueAfterPay = async () => {
    if (!name || !email || !phone) {
      alert("Please fill all fields");
      return;
    }

    if (phone.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }

    // Store user details
    localStorage.setItem(
      "movzz_user",
      JSON.stringify({ name, email, phone })
    );

    // Send WhatsApp message
    await sendWhatsAppMessage(name, phone);

    // Navigate to waitlist
    navigate("/waitlist");
  };

  const handlePayClick = () => {
    if (!name || !email || !phone) {
      alert("Please fill all fields first");
      return;
    }

    if (phone.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }

    setPaymentClicked(true);

    setTimeout(() => {
      continueAfterPay();
    }, 15000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden py-8">
      {/* Animated blue gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="relative z-10 bg-gray-900/90 backdrop-blur-xl rounded-3xl p-10 w-full max-w-md shadow-2xl border border-blue-500/30">
        {/* Logo/Brand */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
            MOVZZ
          </h1>
          <p className="text-gray-400 text-sm">Compare. Choose. Move.</p>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          Join Early Access
        </h2>

        <p className="text-gray-300 mb-6">
          Pay ₹1 to join the waitlist and get instant updates on WhatsApp.
        </p>

        {/* Form */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-black/50 border border-blue-500/30 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-800 disabled:cursor-not-allowed"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={paymentClicked}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-black/50 border border-blue-500/30 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-800 disabled:cursor-not-allowed"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={paymentClicked}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              WhatsApp Number
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                +91
              </div>
              <input
                type="tel"
                placeholder="9876543210"
                maxLength="10"
                className="w-full pl-14 pr-4 py-3 bg-black/50 border border-blue-500/30 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-800 disabled:cursor-not-allowed"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                disabled={paymentClicked}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              You'll receive a welcome message from MOVZZ instantly
            </p>
          </div>

          {/* Payment Button */}
          {!paymentClicked ? (
            <a
              href={razorpayLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handlePayClick}
              className="block w-full bg-blue-600 text-white py-4 rounded-xl text-center font-semibold hover:bg-blue-700 transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/50"
            >
              Pay ₹1 & Join Waitlist
            </a>
          ) : (
            <div className="w-full bg-blue-950 border-2 border-blue-500 py-4 rounded-xl">
              <div className="flex items-center justify-center gap-3">
                <div className="relative">
                  <div className="w-6 h-6 border-3 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="text-left">
                  <p className="text-blue-300 font-semibold">
                    {sendingWhatsApp ? 'Sending WhatsApp...' : 'Processing payment...'}
                  </p>
                  <p className="text-blue-400 text-xs">Redirecting in a moment</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Success message */}
        {paymentClicked && (
          <div className="mt-4 p-4 bg-blue-950 border border-blue-500 rounded-xl">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-300">Payment window opened</p>
                <p className="text-xs text-blue-400 mt-1">Check your WhatsApp for our welcome message!</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Secure payment powered by Razorpay
        </p>
      </div>
    </div>
  );
}