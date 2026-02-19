import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, QrCode } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodeGeneratorProps {
  url: string;
  title?: string;
  description?: string;
}

export function QRCodeGenerator({ 
  url, 
  title = 'Admin Access QR Code',
  description = 'Scan this QR code to access the admin portal directly'
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrLoaded, setQrLoaded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Load QRCode library from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js';
    script.async = true;
    script.onload = () => {
      setQrLoaded(true);
      generateQRCode();
    };
    script.onerror = () => {
      toast.error('Failed to load QR code library');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (qrLoaded) {
      generateQRCode();
    }
  }, [url, qrLoaded]);

  const generateQRCode = () => {
    if (!canvasRef.current || !qrLoaded) return;

    setIsGenerating(true);
    
    // @ts-ignore - QRCode is loaded from CDN
    if (typeof window.QRCode !== 'undefined') {
      // @ts-ignore
      window.QRCode.toCanvas(
        canvasRef.current,
        url,
        {
          width: 300,
          margin: 2,
          color: {
            dark: '#14b8a6', // Teal color
            light: '#ffffff'
          },
          errorCorrectionLevel: 'H'
        },
        (error: Error) => {
          setIsGenerating(false);
          if (error) {
            console.error('QR Code generation error:', error);
            toast.error('Failed to generate QR code');
          }
        }
      );
    }
  };

  const downloadQRCode = () => {
    if (!canvasRef.current) {
      toast.error('QR code not ready');
      return;
    }

    try {
      const canvas = canvasRef.current;
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'vitals-ai-admin-qr-code.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success('QR code downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download QR code');
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <QrCode className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-lg border-2 border-primary/10">
            {isGenerating && !qrLoaded ? (
              <div className="w-[300px] h-[300px] flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground">Generating QR code...</p>
                </div>
              </div>
            ) : (
              <canvas 
                ref={canvasRef} 
                className="max-w-full h-auto"
              />
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={downloadQRCode}
            disabled={!qrLoaded || isGenerating}
            className="flex-1 h-12 text-base"
            size="lg"
          >
            <Download className="mr-2 h-5 w-5" />
            Download QR Code
          </Button>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Note:</span> This QR code contains the admin authentication token. 
            Share it only with authorized administrators.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
