import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { Printer } from 'lucide-react';

interface BarcodeViewProps {
  value: string;
  assetName?: string;
  category?: string;
  className?: string;
  showText?: boolean;
}

export const BarcodeView: React.FC<BarcodeViewProps> = ({ 
  value, 
  assetName, 
  category, 
  className = "",
  showText = true
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      try {
        JsBarcode(svgRef.current, value, {
          format: "CODE128",
          lineColor: "#111827", // tailwind gray-900
          width: 1.8,
          height: 45,
          displayValue: false, // We'll render our own beautiful typography below
          margin: 0
        });
      } catch (err) {
        console.error("Failed to generate barcode with JsBarcode", err);
      }
    }
  }, [value]);

  const handlePrint = () => {
    // Elegant label printer simulation (standard 3x1 inch or 4x2 inch label format)
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to print barcode labels.");
      return;
    }

    const svgHtml = svgRef.current?.outerHTML || '';

    printWindow.document.write(`
      <html>
        <head>
          <title>Asset Tag - ${value}</title>
          <style>
            @page {
              size: auto;
              margin: 0mm;
            }
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              margin: 0;
              padding: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              text-align: center;
              color: #111827;
              background-color: #fff;
            }
            .label-card {
              border: 2px dashed #9ca3af;
              padding: 24px;
              border-radius: 8px;
              width: 320px;
              background-color: #fff;
              display: flex;
              flex-direction: column;
              align-items: center;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            }
            .company-name {
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.15em;
              text-transform: uppercase;
              color: #4b5563;
              margin-bottom: 4px;
            }
            .asset-name {
              font-size: 14px;
              font-weight: 600;
              color: #111827;
              margin-bottom: 12px;
              max-width: 280px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .barcode-svg {
              margin: 8px 0;
              max-width: 100%;
            }
            .asset-code {
              font-family: 'Courier New', Courier, monospace;
              font-size: 14px;
              font-weight: 700;
              letter-spacing: 0.1em;
              color: #000;
              margin-top: 6px;
            }
            .category-tag {
              font-size: 10px;
              font-weight: 500;
              background-color: #f3f4f6;
              color: #4b5563;
              padding: 2px 8px;
              border-radius: 9999px;
              margin-top: 8px;
              text-transform: uppercase;
            }
            .print-btn {
              margin-top: 24px;
              padding: 10px 20px;
              background-color: #111827;
              color: #fff;
              border: none;
              border-radius: 6px;
              font-size: 13px;
              font-weight: 600;
              cursor: pointer;
            }
            @media print {
              .print-btn {
                display: none;
              }
              body {
                padding: 0;
                height: auto;
              }
              .label-card {
                border: none;
                box-shadow: none;
                padding: 10px;
                width: 100%;
              }
            }
          </style>
        </head>
        <body>
          <div class="label-card">
            <div class="company-name">COMPANY PROPERTY</div>
            ${assetName ? `<div class="asset-name">${assetName}</div>` : ''}
            <div class="barcode-svg">${svgHtml}</div>
            <div class="asset-code">${value}</div>
            ${category ? `<div class="category-tag">${category}</div>` : ''}
          </div>
          <button class="print-btn" onclick="window.print()">Print Asset Label</button>
          <script>
            // Auto trigger print dialog
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className={`flex flex-col items-center bg-white p-3 rounded-lg border border-gray-200 select-none ${className}`}>
      <div className="w-full flex justify-center py-2 bg-gray-50/50 rounded border border-dashed border-gray-100">
        <svg ref={svgRef} className="max-w-full h-auto" />
      </div>
      
      {showText && (
        <div className="mt-2 text-center">
          <span className="font-mono text-xs font-bold tracking-widest text-gray-900 block bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
            {value}
          </span>
          {assetName && (
            <span className="text-[11px] text-gray-500 font-medium truncate block max-w-[200px] mt-1">
              {assetName}
            </span>
          )}
        </div>
      )}

      <button
        onClick={handlePrint}
        id={`print-barcode-btn-${value}`}
        className="mt-3 flex items-center justify-center gap-1.5 w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
      >
        <Printer className="w-3.5 h-3.5" />
        Print Label
      </button>
    </div>
  );
};
