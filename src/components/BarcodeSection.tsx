import { useEffect, useRef, useState } from "react";

interface BarcodeSectionProps {
  value: string;
  error: string | null;
  isScannerOpen: boolean;
  cameraError: string | null;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  onOpenScanner: () => void;
  onCloseScanner: () => void;
  onDetected: (barcode: string) => void;
  onCameraError: (error: string | null) => void;
}

export function BarcodeSection({
  value,
  error,
  isScannerOpen,
  cameraError,
  onValueChange,
  onSubmit,
  onOpenScanner,
  onCloseScanner,
  onDetected,
  onCameraError
}: BarcodeSectionProps) {
  return (
    <section className="panel">
      <h2>Barcode</h2>
      <div className="barcode-box">
        <input
          placeholder="Enter barcode manually"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSubmit();
            }
          }}
        />
        <button onClick={onSubmit}>Add by Barcode</button>
        <button className="secondary" onClick={onOpenScanner}>
          Open Camera Scanner
        </button>
      </div>
      {error ? <p className="error-text">{error}</p> : null}

      {isScannerOpen ? (
        <CameraScannerModal
          cameraError={cameraError}
          onClose={onCloseScanner}
          onDetected={onDetected}
          onCameraError={onCameraError}
        />
      ) : null}
    </section>
  );
}

interface CameraScannerModalProps {
  cameraError: string | null;
  onClose: () => void;
  onDetected: (barcode: string) => void;
  onCameraError: (error: string | null) => void;
}

function CameraScannerModal({ cameraError, onClose, onDetected, onCameraError }: CameraScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let timer: number | null = null;

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });

        if (!videoRef.current) {
          return;
        }

        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsReady(true);

        const DetectorCtor = (window as unknown as { BarcodeDetector?: new () => { detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue?: string }>> } }).BarcodeDetector;

        if (!DetectorCtor) {
          onCameraError("BarcodeDetector is not supported in this browser. Use manual barcode input.");
          return;
        }

        const detector = new DetectorCtor();

        timer = window.setInterval(async () => {
          if (!videoRef.current) {
            return;
          }

          try {
            const results = await detector.detect(videoRef.current);
            const first = results[0]?.rawValue;
            if (first) {
              onDetected(first);
              onClose();
            }
          } catch {
            // Ignore detect loop transient failures.
          }
        }, 400);
      } catch {
        onCameraError("Camera permission denied or unavailable. Please use manual barcode input.");
      }
    };

    void start();

    return () => {
      if (timer) {
        window.clearInterval(timer);
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onClose, onDetected, onCameraError]);

  return (
    <div className="scanner-modal" role="dialog" aria-modal="true">
      <div className="scanner-body">
        <div className="scanner-head">
          <h3>Camera Scanner</h3>
          <button onClick={onClose}>Close</button>
        </div>
        <video ref={videoRef} muted playsInline className="scanner-video" />
        {!isReady ? <p>Starting camera...</p> : null}
        {cameraError ? <p className="error-text">{cameraError}</p> : <p>Point camera at product barcode.</p>}
      </div>
    </div>
  );
}
