import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'models.dart';

class PrintService {
  static Future<void> printAsset(Asset asset) async {
    final pdf = pw.Document();

    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        build: (pw.Context context) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              pw.Header(level: 0, child: pw.Text('Asset Details')),
              pw.Divider(),
              pw.Row(
                children: [
                  pw.Text('Asset Code: ', style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
                  pw.Text(asset.assetCode),
                ],
              ),
              pw.SizedBox(height: 10),
              pw.Row(
                children: [
                  pw.Text('Asset Name: ', style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
                  pw.Text(asset.assetName),
                ],
              ),
              pw.SizedBox(height: 10),
              pw.Row(
                children: [
                  pw.Text('Category: ', style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
                  pw.Text(asset.category),
                ],
              ),
              pw.SizedBox(height: 10),
              pw.Row(
                children: [
                  pw.Text('Brand: ', style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
                  pw.Text(asset.brand),
                ],
              ),
              pw.SizedBox(height: 10),
              pw.Row(
                children: [
                  pw.Text('Model: ', style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
                  pw.Text(asset.model),
                ],
              ),
              pw.SizedBox(height: 10),
              pw.Row(
                children: [
                  pw.Text('Serial Number: ', style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
                  pw.Text(asset.serialNumber),
                ],
              ),
              pw.SizedBox(height: 10),
              pw.Row(
                children: [
                  pw.Text('Status: ', style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
                  pw.Text(asset.status),
                ],
              ),
              pw.SizedBox(height: 10),
              pw.Row(
                children: [
                  pw.Text('Location: ', style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
                  pw.Text(asset.location),
                ],
              ),
              pw.SizedBox(height: 20),
              pw.Text('Created At: ${asset.createdAt}'),
            ],
          );
        },
      ),
    );

    await Printing.layoutPdf(
      onLayout: (PdfPageFormat format) async => pdf.save(),
    );
  }

  static Future<void> printAssetList(List<Asset> assets) async {
    final pdf = pw.Document();

    pdf.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4,
        build: (pw.Context context) {
          return [
            pw.Header(level: 0, child: pw.Text('Asset Inventory Report')),
            pw.Divider(),
            pw.SizedBox(height: 20),
            pw.Table(
              border: pw.TableBorder.all(),
              children: [
                pw.TableRow(
                  children: [
                    pw.Padding(padding: const pw.EdgeInsets.all(8), child: pw.Text('Asset Code', style: pw.TextStyle(fontWeight: pw.FontWeight.bold))),
                    pw.Padding(padding: const pw.EdgeInsets.all(8), child: pw.Text('Asset Name', style: pw.TextStyle(fontWeight: pw.FontWeight.bold))),
                    pw.Padding(padding: const pw.EdgeInsets.all(8), child: pw.Text('Category', style: pw.TextStyle(fontWeight: pw.FontWeight.bold))),
                    pw.Padding(padding: const pw.EdgeInsets.all(8), child: pw.Text('Status', style: pw.TextStyle(fontWeight: pw.FontWeight.bold))),
                  ],
                ),
                ...assets.map((asset) => pw.TableRow(
                  children: [
                    pw.Padding(padding: const pw.EdgeInsets.all(8), child: pw.Text(asset.assetCode)),
                    pw.Padding(padding: const pw.EdgeInsets.all(8), child: pw.Text(asset.assetName)),
                    pw.Padding(padding: const pw.EdgeInsets.all(8), child: pw.Text(asset.category)),
                    pw.Padding(padding: const pw.EdgeInsets.all(8), child: pw.Text(asset.status)),
                  ],
                )),
              ],
            ),
            pw.SizedBox(height: 20),
            pw.Text('Total Assets: ${assets.length}'),
          ];
        },
      ),
    );

    await Printing.layoutPdf(
      onLayout: (PdfPageFormat format) async => pdf.save(),
    );
  }
}
