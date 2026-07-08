import 'package:barcode_widget/barcode_widget.dart';

class BarcodeGenerator {
  static Barcode generateCode128(String code) {
    return Barcode.code128();
  }

  static Barcode generateQRCode(String code) {
    return Barcode.qrCode();
  }

  static String generateBarcodeSvg(String code, {bool isQR = false}) {
    final barcode = isQR ? generateQRCode(code) : generateCode128(code);
    return barcode.toSvg(code, width: 200, height: 100);
  }
}
