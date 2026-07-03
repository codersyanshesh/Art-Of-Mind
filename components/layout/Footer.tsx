import React from "react";
import Link from "next/link";
import { BrainCircuit, MessageSquare, Shield, HelpCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5 py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Pitch */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <BrainCircuit className="w-6 h-6 text-electric-violet group-hover:text-cyan-accent transition-colors duration-300" />
              <span className="font-bold text-lg tracking-wider text-white">
                ART OF <span className="text-electric-violet">MIND</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400">
              The next-generation creative entertainment platform. Empowering authors, directors, animators, and designers to create immersive Story Universes together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/discover" className="text-slate-400 hover:text-white transition-colors">
                  Discover Feed
                </Link>
              </li>
              <li>
                <Link href="/trending" className="text-slate-400 hover:text-white transition-colors">
                  Trending Stories
                </Link>
              </li>
              <li>
                <Link href="/universe/u_crimson_kingdom" className="text-slate-400 hover:text-white transition-colors">
                  Crimson Kingdom
                </Link>
              </li>
            </ul>
          </div>

          {/* Creator Hub Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Creators</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/studio" className="text-slate-400 hover:text-white transition-colors">
                  Creator Studio
                </Link>
              </li>
              <li>
                <Link href="/monetization" className="text-slate-400 hover:text-white transition-colors">
                  Earnings & Tips
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="text-slate-400 hover:text-white transition-colors">
                  Community Rules
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Social */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Connect</h4>
            <div className="flex gap-4 mb-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Discord">
                <MessageSquare className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="GitHub">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </a>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors">
                <Shield className="w-4 h-4" />
                <Link href="/privacy">Privacy & Terms</Link>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors">
                <HelpCircle className="w-4 h-4" />
                <Link href="/support">Help Center</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Art of Mind. All rights reserved.</p>
          <p className="bg-gradient-to-r from-electric-violet to-cyan-accent bg-clip-text text-transparent font-medium">
            Designed for the future of interactive narrative
          </p>
        </div>
      </div>
    </footer>
  );
}
