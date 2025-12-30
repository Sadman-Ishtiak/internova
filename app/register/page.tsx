"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  
  // State for the form steps (1 = Email, 2 = Details + OTP)
  const [step, setStep] = useState(1);
  
  // Form Data
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
      } else {
        setStep(2); // Move to next step
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        // Success! Redirect to login
        router.push("/login?registered=true");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md space-y-8">
        <h2 className="text-center text-3xl font-bold">Create an Account</h2>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

        {step === 1 ? (
          /* STEP 1 FORM */
          <form className="mt-8 space-y-6" onSubmit={handleSendOtp}>
            <div>
              <label className="block text-sm font-medium text-foreground">Email Address</label>
              <input
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-border bg-background text-foreground rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:opacity-90 disabled:bg-muted disabled:text-muted-foreground"
            >
              {loading ? "Sending Code..." : "Send Verification Code"}
            </button>
          </form>
        ) : (
          /* STEP 2 FORM */
          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <div className="text-sm text-muted-foreground text-center">
              Code sent to {email}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground">Full Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-border bg-background text-foreground rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Password</label>
              <input
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-border bg-background text-foreground rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Enter OTP Code</label>
              <input
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-border bg-background text-foreground rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? "Creating Account..." : "Verify & Register"}
            </button>
          </form>
        )}

        <div className="text-center">
          <Link href="/login" className="font-medium text-primary hover:underline">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}