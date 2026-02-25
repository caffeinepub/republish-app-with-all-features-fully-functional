import React, { useState } from 'react';
import { Headphones, Mail, X } from 'lucide-react';

export default function SupportButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Popover card */}
      {open && (
        <div className="bg-card border border-border rounded-2xl shadow-xl p-4 w-64 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Headphones className="w-4 h-4 text-primary" />
              </div>
              <span className="font-semibold text-sm text-foreground">Customer Support</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close support panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Need help? Reach out to our support team via email.
          </p>
          <a
            href="mailto:satyamjha2553@gmail.com"
            className="flex items-center gap-2 w-full bg-primary text-primary-foreground rounded-lg px-3 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
            aria-label="Send email to support"
          >
            <Mail className="w-4 h-4" />
            satyamjha2553@gmail.com
          </a>
        </div>
      )}

      {/* Floating circle button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Customer Support"
        title="Customer Support"
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {open ? <X className="w-6 h-6" /> : <Headphones className="w-6 h-6" />}
      </button>
    </div>
  );
}
