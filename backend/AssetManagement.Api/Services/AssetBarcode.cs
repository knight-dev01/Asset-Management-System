using System.Text;

namespace AssetManagement.Api.Services;

public static class AssetBarcode
{
    public static string GenerateBarcodeValue(string assetCode)
    {
        return assetCode;
    }

    public static string GenerateSvg(string assetCode)
    {
        // Minimal inline SVG representation for barcode preview.
        // This is a placeholder; in production, use a barcode library like BarcodeLib or SkiaSharp.
        var escaped = System.Net.WebUtility.HtmlEncode(assetCode);
        var lines = new StringBuilder();
        lines.AppendLine("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"320\" height=\"120\" viewBox=\"0 0 320 120\">" );
        lines.AppendLine("  <rect width=\"100%\" height=\"100%\" fill=\"#ffffff\"/>" );
        lines.AppendLine("  <text x=\"50%\" y=\"45%\" dominant-baseline=\"middle\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=16 fill=\"#111\">" + escaped + "</text>");
        lines.AppendLine("  <text x=\"50%\" y=\"70%\" dominant-baseline=\"middle\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=10 fill=\"#555\">Generated Barcode Preview</text>");
        lines.AppendLine("</svg>");
        return lines.ToString();
    }
}
