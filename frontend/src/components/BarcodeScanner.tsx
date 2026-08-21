'use client';

import { useEffect, useRef, useState } from 'react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onError: (error: string) => void;
}

export default function BarcodeScanner({ onScan, onError }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const readerRef = useRef<any>(null);

  const startScanner = async () => {
    try {
      const { BrowserMultiFormatReader } = await import('@zxing/browser');

      const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
      if (videoInputDevices.length === 0) {
        onError('ไม่พบกล้อง กรุณาใช้อุปกรณ์ที่มีกล้อง');
        return;
      }

      // Prefer back camera
      const backCamera = videoInputDevices.find(
        (device: MediaDeviceInfo) => device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('rear')
      );
      const deviceId = backCamera?.deviceId || videoInputDevices[0].deviceId;

      setIsScanning(true);
      setHasPermission(true);

      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      const controls = await reader.decodeFromVideoDevice(
        deviceId,
        videoRef.current!,
        (result, error) => {
          if (result) {
            const barcode = result.getText();
            stopScanner();
            onScan(barcode);
          }
        }
      );

      // Store stream for cleanup
      if (videoRef.current?.srcObject) {
        streamRef.current = videoRef.current.srcObject as MediaStream;
      }
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setHasPermission(false);
        onError('ไม่สามารถใช้งานกล้องได้ กรุณาอนุญาตการเข้าถึงกล้อง หรือกรอก Barcode ด้วยตัวเอง');
      } else {
        onError('เกิดข้อผิดพลาดในการเปิดกล้อง: ' + err.message);
      }
      setIsScanning(false);
    }
  };

  const stopScanner = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="w-full">
      {!isScanning ? (
        <button
          onClick={startScanner}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-3 text-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9V5a2 2 0 012-2h4M3 15v4a2 2 0 002 2h4m8-18h4a2 2 0 012 2v4m0 6v4a2 2 0 01-2 2h-4" />
          </svg>
          เปิดกล้องสแกน
        </button>
      ) : (
        <div className="relative">
          <div className="relative rounded-xl overflow-hidden border-4 border-primary-500 scanner-overlay">
            <video
              ref={videoRef}
              className="w-full aspect-[4/3] object-cover bg-black"
              playsInline
              autoPlay
              muted
            />
            {/* Corner markers */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg" />
          </div>
          <button
            onClick={stopScanner}
            className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            ปิดกล้อง
          </button>
          <p className="text-center text-sm text-gray-500 mt-2">
            นำ Barcode เข้าไปในกรอบเพื่อสแกน
          </p>
        </div>
      )}

      {hasPermission === false && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 text-sm">
            ไม่สามารถใช้งานกล้องได้ กรุณาอนุญาตการเข้าถึงกล้อง หรือกรอก Barcode ด้วยตัวเอง
          </p>
        </div>
      )}
    </div>
  );
}
