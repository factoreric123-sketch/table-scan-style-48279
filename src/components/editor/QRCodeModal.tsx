import { useState } from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface QRCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantSlug: string;
  restaurantName: string;
}

export const QRCodeModal = ({
  open,
  onOpenChange,
  restaurantSlug,
  restaurantName,
}: QRCodeModalProps) => {
  const [size, setSize] = useState<number>(250);
  const url = `${window.location.origin}/${restaurantSlug}`;

  const handleDownloadPNG = () => {
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
          <div className="text-sm text-muted-foreground">
            Scan this QR code to view your menu at:
            <br />
            <code className="text-xs bg-muted px-2 py-1 rounded mt-1 inline-block">
              {url}
            </code>
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
              <Button onClick={handleDownloadPNG} variant="outline" className="flex-1 gap-2">
                <Download className="h-4 w-4" />
                Download PNG
              </Button>
              <Button onClick={handleDownloadSVG} variant="outline" className="flex-1 gap-2">
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
