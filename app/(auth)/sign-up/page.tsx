import React from "react";
import Link from "next/link";
import SignUpForm from "@/components/auth/SignUpForm";
import ParticleField from "@/components/3d/ParticleField";
import { BrainCircuit } from "lucide-react";

export const metadata = {
  title: "Create Account — Art of Mind",
  description: "Register for Art of Mind to start reading and creating stories.",
};

export default function SignUpPage() {
  return (
    <main className="relative min-h-screen flex flex-col justify-center items-center px-4 bg-slate-950">
      {/* 3D background particles */}
      <ParticleField />

      {/* Glow lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-violet/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-accent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header logo */}
      <div className="relative z-10 mb-8 flex flex-col items-center gap-3">
        <Link href="/" className="flex items-center gap-2 group">
          <BrainCircuit className="w-10 h-10 text-electric-violet group-hover:text-cyan-accent transition-colors duration-300" />
          <span className="font-bold text-2xl tracking-wider text-white">
            ART OF <span className="text-electric-violet text-glow-violet">MIND</span>
          </span>
        </Link>
      </div>

      {/* Glassmorphic Form Wrapper */}
      <div className="relative z-10 w-full max-w-md">
        <SignUpForm />
      </div>
    </main>
  );
}
