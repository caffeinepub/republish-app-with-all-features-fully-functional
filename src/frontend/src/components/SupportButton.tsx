import { useState } from 'react';
import { Headset, Mail, Copy, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { toast } from 'sonner';

export function SupportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const supportEmail = 'satyamjha2553@gmail.com';

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(supportEmail);
      setCopied(true);
      toast.success('Email copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy email');
    }
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${supportEmail}`;
  };

  return (
    <>
      {/* Floating Support Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 md:bottom-5 md:right-5 z-[9999] w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Customer Support"
      >
        <Headset className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      </button>

      {/* Support Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Customer Support
            </DialogTitle>
            <DialogDescription className="text-base">
              Need help? Reach out to our support team via email.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Email Display */}
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg border-2 border-primary/20">
              <Mail className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-sm font-medium flex-1 break-all">{supportEmail}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleCopyEmail}
                variant="outline"
                className="flex-1 gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Email
                  </>
                )}
              </Button>
              <Button
                onClick={handleEmailClick}
                className="flex-1 gap-2"
              >
                <Mail className="w-4 h-4" />
                Send Email
              </Button>
            </div>

            {/* Additional Info */}
            <p className="text-xs text-muted-foreground text-center pt-2">
              We typically respond within 24 hours
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
