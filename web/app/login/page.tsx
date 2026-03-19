"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0d0a] flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="text-[#e0a548] text-xl">≋</span>
          <span className="font-semibold tracking-wide text-[#ede8d8]">Wavelength</span>
        </div>
        <Link
          href="/register"
          className="text-sm px-4 py-2 rounded-full border border-[#e0a548] text-[#e0a548] hover:bg-[#e0a548] hover:text-[#0f0d0a] transition-all"
        >
          Sign up
        </Link>
      </nav>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-md">
          <h1 className="font-display text-4xl text-[#ede8d8] italic text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-[#9a8870] text-sm text-center mb-10">
            Sign in to your account
          </p>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-[#1a1208] border border-[#2d1f1a] rounded-2xl p-8 space-y-5"
            noValidate
          >
            {/* Email */}
            <div>
              <label className="block text-sm text-[#9a8870] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                placeholder="name@example.com"
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full bg-[#0f0d0a] border border-[#2d1f1a] rounded-lg px-4 py-3 text-[#ede8d8] placeholder-[#4a3828] focus:outline-none focus:border-[#e0a548] transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-[#9a8870]">Password</label>
                <span className="text-xs text-[#e0a548] cursor-pointer hover:underline">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  placeholder="••••••••"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  className="w-full bg-[#0f0d0a] border border-[#2d1f1a] rounded-lg px-4 py-3 pr-12 text-[#ede8d8] placeholder-[#4a3828] focus:outline-none focus:border-[#e0a548] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a3828] hover:text-[#9a8870] transition-colors text-sm"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "◡" : "◉"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#e0a548] text-[#0f0d0a] font-semibold rounded-lg hover:bg-[#c8923a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-[#9a8870] text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#e0a548] hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
