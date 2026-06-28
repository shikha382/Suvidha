interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  className?: string;
}

const QRCodeGenerator = ({ value, size = 150, className = "" }: QRCodeGeneratorProps) => {
  // Using a simple QR code generator API (no external library needed)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&bgcolor=ffffff&color=1e3a5f`;

  return (
    <div className={`inline-block ${className}`}>
      <img 
        src={qrCodeUrl} 
        alt={`QR Code for ${value}`}
        width={size}
        height={size}
        className="rounded-lg border border-gray-200"
      />
      <p className="text-xs text-center text-gray-500 mt-2">
        Scan to track complaint
      </p>
    </div>
  );
};

export default QRCodeGenerator;
