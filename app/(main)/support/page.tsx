"use client";

import React, { useState } from "react";
import { HelpCircle, Mail, MessageSquare, Plus, Minus, Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const faqs = [
    {
      q: "How does the Story Universe system work?",
      a: "A Story Universe is an interconnected franchise hub. Rather than writing unrelated pieces, you define a single Universe. You can then publish novels, vertical series, comics, character bios, and interactive maps that all exist within that universe, making it easy for fans to discover and explore your lore."
    },
    {
      q: "What is the OTP verification code for demo sign-in?",
      a: "For demonstration purposes, you can use the code '123456' on the MFA/OTP screen. This will pass the security check and successfully initialize your session."
    },
    {
      q: "How do creators earn revenue on Art of Mind?",
      a: "Creators can monetize their universes in five ways: paid episodes, tip jars, subscription tiers, premium merchandise shop listings, and regional affiliate sponsorship programs."
    },
    {
      q: "Can I collaborate with other writers or artists?",
      a: "Yes! The Collaboration tool in Creator Studio allows you to invite voice actors, artists, co-authors, and translators, and assign specific permissions and automated revenue shares."
    }
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    setSent(true);
    setSubject("");
    setMessage("");
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
          <HelpCircle className="w-7 h-7 text-electric-violet" />
          Help & Support Center
        </h1>
        <p className="text-xs text-slate-400">
          Find answers to frequently asked questions or submit a support ticket to our team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* FAQs */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-electric-violet" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="rounded-xl glass-panel border border-white/5 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 flex justify-between items-center text-left text-xs font-bold text-white hover:bg-white/2 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <Minus className="w-4 h-4 text-electric-violet" /> : <Plus className="w-4 h-4 text-electric-violet" />}
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-slate-400 leading-relaxed border-t border-white/2 bg-slate-950/20">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact form */}
        <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-cyan-accent" />
            Submit a Ticket
          </h2>

          {sent && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5 animate-pulse-glow">
              <CheckCircle2 className="w-4 h-4" /> Support ticket sent. We will respond within 24 hours.
            </div>
          )}

          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Subject</label>
              <input
                type="text"
                required
                placeholder="e.g. Creator monetization payout query"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 text-xs rounded-xl glass-input border border-white/10"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Message Details</label>
              <textarea
                required
                placeholder="How can we help you?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 text-xs rounded-xl glass-input border border-white/10 h-28 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-electric-violet hover:bg-purple-700 text-xs font-bold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Send Support Ticket
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
