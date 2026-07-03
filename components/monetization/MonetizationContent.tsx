"use client";

import React, { useState } from "react";
import {
  DollarSign, Wallet, Heart, Award, ArrowUpRight, ShieldCheck,
  History, TrendingUp, Download, CreditCard, ArrowDownLeft
} from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

type MonetizationTab = "support" | "transactions" | "revenue";

interface MonetizationContentProps {
  initialBalance: number;
  transactions: any[];
}

export default function MonetizationContent({
  initialBalance,
  transactions: dbTransactions,
}: MonetizationContentProps) {
  const [activeTab, setActiveTab] = useState<MonetizationTab>("support");
  const [balance, setBalance] = useState(initialBalance);
  const [donated, setDonated] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState("PayPal");

  const plans = [
    { name: "Fan Tier", price: "$4.99/mo", description: "Unlock early access to novels + member badge", points: "+50 pts" },
    { name: "VIP Elite", price: "$9.99/mo", description: "Unlocks all vertical drama episodes + early audio stories", points: "+120 pts" },
  ];

  const handleDonate = (val: number) => {
    if (balance < val) {
      alert("Insufficient points balance. Claim daily check-ins or buy points first.");
      return;
    }
    setBalance((prev) => prev - val);
    setDonated(true);
    confetti({ particleCount: 80, spread: 60, colors: ["#7c3aed", "#fbbf24"] });
    setTimeout(() => setDonated(false), 3000);
  };

  const tabs = [
    { id: "support" as MonetizationTab, label: "Support & Plans", icon: Heart },
    { id: "transactions" as MonetizationTab, label: "Transaction History", icon: History },
    { id: "revenue" as MonetizationTab, label: "Revenue Reports", icon: TrendingUp },
  ];

  // Revenue mock mapping (based on transactions count)
  const monthlyRevenue = [
    { month: "Jan", amount: 120 },
    { month: "Feb", amount: 180 },
    { month: "Mar", amount: 145 },
    { month: "Apr", amount: 210 },
    { month: "May", amount: 290 },
    { month: "Jun", amount: 380 },
    { month: "Jul", amount: 160 },
  ];
  const maxRevenue = Math.max(...monthlyRevenue.map((r) => r.amount));

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
          <DollarSign className="w-7 h-7 text-gold-accent" />
          Monetization & Wallet
        </h1>
        <p className="text-xs text-slate-400">
          Support creators, manage memberships, track earnings, and view transaction history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Nav */}
        <div className="space-y-1 lg:col-span-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl text-left transition-colors cursor-pointer",
                  activeTab === tab.id
                    ? "bg-gold-accent/15 text-gold-accent border border-gold-accent/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}

          {/* Wallet Balance Card */}
          <div className="mt-4 p-5 rounded-2xl glass-panel-neon border border-white/10 space-y-3 text-center">
            <div className="w-10 h-10 rounded-xl bg-electric-violet/10 border border-electric-violet/20 flex items-center justify-center text-electric-violet mx-auto">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Available Balance</p>
              <h2 className="text-3xl font-black text-white tracking-tight">{balance.toFixed(2)} pts</h2>
            </div>
            <button
              onClick={() => {
                setBalance(prev => prev + 100);
                confetti({ particleCount: 30, spread: 40 });
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-electric-violet to-cyan-accent text-xs font-bold text-white shadow-lg cursor-pointer"
            >
              Buy Points (+100)
            </button>
          </div>
        </div>

        {/* Right Content Panels */}
        <div className="lg:col-span-3 min-h-[400px]">
          {activeTab === "support" && (
            <div className="space-y-6">
              {/* Tip Jar */}
              <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500/10" />
                  Support Creators (Tip Jar)
                </h3>
                <p className="text-xs text-slate-400">
                  Tip your favorite artists and writers directly to help them unlock new episodes and chapters.
                </p>

                {donated && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-4 py-2 rounded-xl text-center font-bold">
                    Thank you! Your support fuels the universe.
                  </div>
                )}

                <div className="grid grid-cols-4 gap-4">
                  {[10, 20, 50, 100].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleDonate(val)}
                      className="py-3 rounded-xl bg-white/5 border border-white/10 hover:border-gold-accent hover:text-gold-accent text-xs font-bold text-white transition-all cursor-pointer"
                    >
                      {val} pts
                    </button>
                  ))}
                </div>
              </div>

              {/* Memberships */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-electric-violet" />
                  Membership Plans
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {plans.map((p, idx) => (
                    <div key={idx} className="p-6 rounded-2xl glass-panel border border-white/5 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-sm text-white">{p.name}</h4>
                          <span className="text-xs font-bold text-cyan-accent">{p.points}</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>
                      </div>
                      <div className="flex justify-between items-center border-t border-white/5 pt-3">
                        <span className="font-bold text-white text-base">{p.price}</span>
                        <button
                          onClick={() => {
                            alert(`Subscribed to ${p.name}!`);
                            confetti({ particleCount: 50 });
                          }}
                          className="px-4 py-2 rounded-lg bg-electric-violet hover:bg-purple-700 text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          Join Plan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-cyan-accent" />
                Ledger Logs
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="py-3">Date</th>
                      <th className="py-3">Type</th>
                      <th className="py-3">Details</th>
                      <th className="py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dbTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400">
                          No transactions found.
                        </td>
                      </tr>
                    ) : (
                      dbTransactions.map((t) => {
                        const isPositive = t.amount > 0;
                        return (
                          <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                            <td className="py-4 text-slate-400">{new Date(t.createdAt).toLocaleDateString()}</td>
                            <td className="py-4 font-bold text-white">{t.type}</td>
                            <td className="py-4 text-slate-400">
                              {t.story ? `Story: ${t.story.title}` : "System Wallet Log"}
                            </td>
                            <td className={cn(
                              "py-4 text-right font-bold text-sm",
                              isPositive ? "text-emerald-400" : "text-rose-400"
                            )}>
                              {isPositive ? "+" : ""}{t.amount} pts
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "revenue" && (
            <div className="space-y-6">
              {/* Monthly Revenue Chart */}
              <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-gold-accent" />
                    Year-To-Date Revenue
                  </h3>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300 hover:text-white transition-colors cursor-pointer">
                    <Download className="w-3.5 h-3.5" /> PDF Statement
                  </button>
                </div>

                {/* SVG Bar Chart */}
                <div className="h-48 flex items-end gap-3 pt-6 select-none">
                  {monthlyRevenue.map((r, idx) => {
                    const heightPercent = (r.amount / maxRevenue) * 100;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                        <div className="w-full relative rounded-t-lg bg-gold-accent/20 border border-gold-accent/30 group-hover:bg-gold-accent/40 group-hover:border-gold-accent transition-all cursor-pointer flex justify-center" style={{ height: `${heightPercent}%` }}>
                          <span className="absolute -top-6 bg-slate-950 border border-white/5 rounded px-1.5 py-0.5 text-[9px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            ${r.amount}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500">{r.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Withdrawals */}
              <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-cyan-accent" />
                  Request Earnings Payout
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Transfer your earned tokens to bank accounts or payment gateways. Minimum withdrawal limit is $100.00.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Payout Method</label>
                    <select
                      value={withdrawMethod}
                      onChange={(e) => setWithdrawMethod(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:border-electric-violet cursor-pointer"
                    >
                      <option>PayPal</option>
                      <option>Bank Transfer</option>
                      <option>Stripe Connect</option>
                    </select>
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount ($)</label>
                    <input
                      type="number"
                      placeholder="e.g. 250"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:border-electric-violet"
                    />
                  </div>
                </div>

                <button
                  onClick={() => alert(`Requested payout via ${withdrawMethod}!`)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-electric-violet to-cyan-accent text-xs font-bold text-white shadow-lg cursor-pointer"
                >
                  Request Payout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
