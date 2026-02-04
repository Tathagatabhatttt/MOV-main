import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Waitlist from "./pages/Waitlist";
import Demo from "./pages/Demo";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/waitlist" element={<Waitlist />} />
      <Route path="/demo" element={<Demo />} />
    </Routes>
  );
}
