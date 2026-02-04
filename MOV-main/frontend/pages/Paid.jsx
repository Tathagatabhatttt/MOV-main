export default function Paid() {
  if (!localStorage.getItem("movzz_paid")) {
    window.location.href = "/";
    return null;
  }

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-white/10 backdrop-blur-xl p-10 rounded-2xl text-center">
        <h1 className="text-2xl font-semibold">Payment received ✅</h1>
        <p className="mt-2 text-gray-300">
          You’re now part of MOVZZ early access.
        </p>

        <button
          onClick={() => (window.location.href = "/waitlist")}
          className="mt-6 w-full bg-blue-600 py-3 rounded-xl"
        >
          Continue to waitlist
        </button>
      </div>
    </div>
  );
}
