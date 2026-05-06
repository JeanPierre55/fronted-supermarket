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
      <h2>🔖 Código de Barras</h2>

      <div className="barcode-box" style={{ marginTop: "0.75rem" }}>
        <input
          placeholder="Ingresar código manualmente..."
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onSubmit(); }}
        />
        <button onClick={onSubmit}>Agregar</button>
        <button className="secondary" onClick={onOpenScanner} title="Abrir cámara">
          📷
        </button>
      </div>

      {error ? <p className="error-text">⚠ {error}</p> : null}

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
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsReady(true);

        const DetectorCtor = (window as unknown as {
          BarcodeDetector?: new () => { detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue?: string }>> };
        }).BarcodeDetector;

        if (!DetectorCtor) {
          onCameraError("BarcodeDetector no está disponible en este navegador. Usa la entrada manual.");
          return;
        }

        const detector = new DetectorCtor();
        timer = window.setInterval(async () => {
          if (!videoRef.current) return;
          try {
            const results = await detector.detect(videoRef.current);
            const first = results[0]?.rawValue;
            if (first) { onDetected(first); onClose(); }
          } catch { /* ignore */ }
        }, 400);
      } catch {
        onCameraError("Permiso de cámara denegado. Usa la entrada manual.");
      }
    };

    void start();

    return () => {
      if (timer) window.clearInterval(timer);
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [onClose, onDetected, onCameraError]);

  return (
    <div className="scanner-modal" role="dialog" aria-modal="true">
      <div className="scanner-body">
        <div className="scanner-head">
          <h3>📷 Escáner de Cámara</h3>
          <button className="secondary" onClick={onClose}>✕ Cerrar</button>
        </div>
        <video ref={videoRef} muted playsInline className="scanner-video" />
        {!isReady && !cameraError ? (
          <p style={{ color: "var(--text-muted)", marginTop: "0.75rem", fontSize: "0.85rem" }}>
            Iniciando cámara...
          </p>
        ) : null}
        {cameraError ? (
          <p className="error-text" style={{ marginTop: "0.75rem" }}>⚠ {cameraError}</p>
        ) : isReady ? (
          <p style={{ color: "var(--text-muted)", marginTop: "0.75rem", fontSize: "0.85rem" }}>
            Apunta la cámara al código de barras del producto.
          </p>
        ) : null}
      </div>
    </div>
  );
}
