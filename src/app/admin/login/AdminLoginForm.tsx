"use client";

import React, { useState } from "react";
import { LockKeyhole, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

export const AdminLoginForm: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "No se pudo iniciar sesión.");
      }

      router.replace("/admin");
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "No se pudo iniciar sesión.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-cream px-5 py-10 text-brand-cacao">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-brand-cacao/8 bg-white p-6 shadow-[0_24px_60px_rgba(42,27,20,0.12)] md:p-8"
      >
        <div className="mb-7 flex flex-col gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-pink text-brand-cacao">
            <LockKeyhole className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-hazelnut">
              Administración
            </p>
            <h1 className="mt-2 font-serif text-4xl font-black leading-none">
              Central Donuts
            </h1>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-brand-cacao/45">
              Usuario
            </span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="rounded-xl border border-brand-cacao/10 bg-brand-cream/50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-brand-hazelnut"
              autoComplete="username"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-brand-cacao/45">
              Clave
            </span>
            <input
              value={password}
              type="password"
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-xl border border-brand-cacao/10 bg-brand-cream/50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-brand-hazelnut"
              autoComplete="current-password"
              required
            />
          </label>
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-cacao px-5 py-3 text-sm font-black text-brand-cream transition hover:bg-brand-chocolate disabled:opacity-60"
        >
          <LogIn className="h-4 w-4" />
          {isSubmitting ? "Ingresando" : "Ingresar"}
        </button>
      </form>
    </main>
  );
};
