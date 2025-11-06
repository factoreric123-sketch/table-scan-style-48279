import { useState } from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Copy, ExternalLink, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface QRCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantSlug: string;
  restaurantName: string;
  isPublished?: boolean;
}

export const QRCodeModal = ({
  open,
  onOpenChange,
  restaurantSlug,
  restaurantName,
  isPublished = true,
}: QRCodeModalProps) => {
  const [size, setSize] = useState<number>(250);
  const [copied, setCopied] = useState(false);
  
  // Use canonical URL with /menu/ prefix
  const baseUrl = import.meta.env.VITE_PUBLIC_SITE_URL || window.location.origin;
  const url = `${baseUrl}/menu/${restaurantSlug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleOpenLive = () => {
    window.open(url, "_blank");
  };

  const handleDownloadPNG = () => {
    if (!isPublished) {
      toast.error("Publish your menu first to download QR code");
      return;
    }
    
    const canvas = document.getElementById("qr-canvas") as HTMLCanvasElement;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${restaurantSlug}-qr-code.png`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("QR Code downloaded as PNG");
    });
  };

  const handleDownloadSVG = () => {
    if (!isPublished) {
      toast.error("Publish your menu first to download QR code");
      return;
    }

    const svg = document.getElementById("qr-svg") as unknown as SVGElement;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${restaurantSlug}-qr-code.svg`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("QR Code downloaded as SVG");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code for {restaurantName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!isPublished && (
            <Alert variant="destructive">
              <AlertDescription>
                This menu isn't published yet. Publish it first to make the QR code work for customers.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Scan this QR code or share the link to view your menu:
            </div>
            <code className="text-xs bg-muted px-2 py-1 rounded block overflow-x-auto">
              {url}
            </code>
            <div className="flex gap-2">
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="sm"
                className="flex-1 gap-2"
              >
                {copied ? (
                  <>
                    <CheckCheck className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </>
                )}
              </Button>
              <Button
                onClick={handleOpenLive}
                variant="outline"
                size="sm"
                className="flex-1 gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Open Live
              </Button>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeCanvas
                id="qr-canvas"
                value={url}
                size={size}
                level="H"
                includeMargin
              />
            </div>
          </div>

          <div className="hidden">
            <QRCodeSVG
              id="qr-svg"
              value={url}
              size={size}
              level="H"
              includeMargin
            />
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Size</label>
              <div className="flex gap-2">
                <Button
                  variant={size === 150 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSize(150)}
                  className="flex-1"
                >
                  Small
                </Button>
                <Button
                  variant={size === 250 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSize(250)}
                  className="flex-1"
                >
                  Medium
                </Button>
                <Button
                  variant={size === 400 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSize(400)}
                  className="flex-1"
                >
                  Large
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleDownloadPNG} 
                variant="outline" 
                className="flex-1 gap-2"
                disabled={!isPublished}
              >
                <Download className="h-4 w-4" />
                Download PNG
              </Button>
              <Button 
                onClick={handleDownloadSVG} 
                variant="outline" 
                className="flex-1 gap-2"
                disabled={!isPublished}
              >
                <Download className="h-4 w-4" />
                Download SVG
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
