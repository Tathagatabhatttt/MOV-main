import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useWaitlistStore } from "../store/waitlistStore";

export default function Search() {
  const navigate = useNavigate();
  const user = useWaitlistStore(s => s.user);

  useEffect(() => {
    if (!user) {
      navigate("/register");
    }
  }, [user, navigate]);

  if (!user) {
    // while redirecting
    return null;
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>MOVZZ App Entry</h1>
      <p>Logged in as: {user.email}</p>
    </div>
  );
}
