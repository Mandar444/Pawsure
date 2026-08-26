"use client";
// /ngo/login — NGO enters their registered phone to access their dashboard.
// Stores ngo_id + name in localStorage as a simple session. No OTP yet.
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NgoLogin() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/ngo/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed");
      localStorage.setItem("pawsure_ngo", JSON.stringify({ id: data.ngo_id, name: data.name }));
      router.push("/ngo");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fafaf9] flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm p-8">
        <p className="font-['Space_Grotesk',sans-serif] font-bold text-[#ed176a] mb-1">Pawsure Watch</p>
        <h1 className="font-['Space_Grotesk',sans-serif] text-2xl font-bold mb-2">NGO Login</h1>
        <p className="text-[#0a0a0a]/50 text-sm mb-6">
          Enter the phone number registered with Pawsure to see rescue cases near you.
        </p>

        <label className="block text-sm font-medium mb-2">Registered phone number</label>
        <div className="flex items-center rounded-full border border-[#0a0a0a]/10 focus-within:border-[#ed176a] overflow-hidden mb-1">
          <span className="pl-5 pr-2 text-sm text-[#0a0a0a]/50">+91</span>
          <input
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="98XXX XXXXX"
            className="flex-1 py-3.5 pr-5 text-sm focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-[#dc2626] mt-3">{error}</p>}

        <button
          onClick={login}
          disabled={loading || !phone.trim()}
          className="w-full mt-5 py-3.5 bg-[#ed176a] hover:bg-[#d1145d] text-white font-semibold rounded-full transition-colors disabled:opacity-60"
        >
          {loading ? "Checking…" : "Enter dashboard"}
        </button>
      </div>
    </main>
  );
}