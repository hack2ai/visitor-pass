import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface ScannerCameraProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
  onPermissionDenied?: () => void;
}

const SCANNER_ID = "qr-reader";

const ScannerCamera = ({
  onScanSuccess,
  onScanError,
  onPermissionDenied,
}: ScannerCameraProps) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    let mounted = true;

    const scanner = new Html5Qrcode(SCANNER_ID);

    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        await scanner.start(
          {
            facingMode: "environment",
          },
          {
            fps: 10,
            qrbox: {
              width: 280,
              height: 280,
            },
            aspectRatio: 1,
          },
          async (decodedText) => {
            if (!mounted) return;

            try {
              await scanner.pause();
              onScanSuccess(decodedText);
            } catch (error) {
              console.error("Scan Error:", error);
            }
          },
          () => {
            // Ignore scan errors while searching
          }
        );
      } catch (error) {
        console.error("Camera Error:", error);

        onPermissionDenied?.();

        onScanError?.(
          "Unable to access camera. Please allow camera permission."
        );
      }
    };

    void startScanner();

    return () => {
      mounted = false;

      const stopScanner = async () => {
        try {
          if (
            scannerRef.current &&
            scannerRef.current.isScanning
          ) {
            await scannerRef.current.stop();
          }

          await scannerRef.current?.clear();
        } catch (error) {
          console.error(
            "Scanner Cleanup Error:",
            error
          );
        }
      };

      void stopScanner();
    };
  }, [
    onScanSuccess,
    onScanError,
    onPermissionDenied,
  ]);

  return (
    <div
      id={SCANNER_ID}
      className="
        h-[500px]
        w-full
        overflow-hidden
        rounded-2xl
        bg-black
      "
    />
  );
};

export default ScannerCamera;