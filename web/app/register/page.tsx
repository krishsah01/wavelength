"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";
import api from "@/lib/api";

interface FormErrors {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address.";
    if (form.username.length < 3)
      e.username = "Username must be at least 3 characters.";
    if (!/^[a-zA-Z0-9_]+$/.test(form.username))
      e.username = "Username can only contain letters, numbers, and underscores.";
    if (form.password.length < 10)
      e.password = "Password must be at least 10 characters.";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match.";
    return e;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      // 1. Register the user — server sets the HTTP-only auth cookie
      await api.post("/api/auth/register", {
        email: form.email,
        username: form.username,
        password: form.password,
      });

      // 2. Establish a NextAuth session (calls /api/auth/login internally)
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setErrors({ form: "Account created but sign-in failed. Please log in." });
        router.push("/login");
        return;
      }

      // 3. Send to onboarding to write their bio
      router.push("/onboarding");
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number; data?: { message?: string } } })
        ?.response?.status;
      const message = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;

      if (status === 409) {
        // Duplicate email or username — surface the specific message
        if (message?.toLowerCase().includes("email")) {
          setErrors({ email: "An account with this email already exists." });
        } else {
          setErrors({ username: "This username is already taken." });
        }
      } else {
        setErrors({ form: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  }

  function field(key: keyof typeof form, label: string, type = "text", placeholder = "") {
    return (
      <div>
        <label className="block text-sm text-[#9a8870] mb-1">{label}</label>
        <input
          type={type}
          value={form[key]}
          placeholder={placeholder}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className={`w-full bg-[#1a1208] border rounded-lg px-4 py-3 text-[#ede8d8] placeholder-[#4a3828] focus:outline-none focus:border-[#e0a548] transition-colors ${
            errors[key] ? "border-red-500/60" : "border-[#2d1f1a]"
          }`}
        />
        {errors[key] && (
          <p className="text-red-400 text-xs mt-1">{errors[key]}</p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0d0a] grid md:grid-cols-2">
      {/* Left: branding copy */}
      <div className="hidden md:flex flex-col justify-center px-16 bg-[#0d0b09] border-r border-[#2d1f1a]">
        <div className="flex items-center gap-2 mb-12">
          <span className="text-[#e0a548] text-xl">≋</span>
          <span className="font-semibold tracking-wide text-[#ede8d8]">Wavelength</span>
        </div>
        <p className="text-[#e0a548] text-xs tracking-widest uppercase mb-3">Dusk Glow Theme</p>
        <h2 className="font-display text-4xl text-[#ede8d8] italic leading-tight mb-6">
          Begin your{" "}
          <em className="text-[#e0a548] not-italic italic font-display">
            journey
          </em>{" "}
          with us.
        </h2>
        <p className="text-[#9a8870] leading-relaxed mb-10">
          Experience the rhythm of connectivity. Join the Wavelength community
          and find the people most likely to click with you.
        </p>
        <ul className="space-y-3">
          {[
            "Hyper-specific interest matching",
            "AI-generated conversation starters",
            "Secure, privacy-first design",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-[#9a8870] text-sm">
              <span className="w-5 h-5 rounded-full bg-[#e0a548]/20 flex items-center justify-center text-[#e0a548] text-xs">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 md:hidden">
            <span className="text-[#e0a548] text-xl">≋</span>
            <span className="font-semibold tracking-wide text-[#ede8d8]">Wavelength</span>
          </div>

          <h1 className="text-2xl font-semibold text-[#ede8d8] mb-1">Create Account</h1>
          <p className="text-[#9a8870] text-sm mb-8">Fill in your details to get started.</p>

          {errors.form && (
            <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {field("name", "Full Name", "text", "Enter your name")}
            {field("email", "Email Address", "email", "name@example.com")}
            {field("username", "Username", "text", "your_handle")}
            {field("password", "Password", "password", "Min. 10 characters")}
            {field("confirmPassword", "Confirm Password", "password", "Repeat your password")}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-[#e0a548] text-[#0f0d0a] font-semibold rounded-lg hover:bg-[#c8923a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account…" : "Create My Account"}
            </button>
          </form>

          <p className="text-center text-[#9a8870] text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#e0a548] hover:underline">
              Login
            </Link>
          </p>

          <p className="text-center text-[#4a3828] text-xs mt-6">
            By signing up, you agree to our{" "}
            <span className="text-[#9a8870] hover:text-[#ede8d8] cursor-pointer transition-colors">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-[#9a8870] hover:text-[#ede8d8] cursor-pointer transition-colors">
              Privacy Policy
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
