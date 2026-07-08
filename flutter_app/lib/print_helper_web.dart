import 'dart:html' as html;

void printHtmlImpl(String htmlContent) {
  final newWindow = html.window.open('', 'printWindow');
  if (newWindow != null) {
    final dynamic window = newWindow;
    window.document.open();
    window.document.write('<html><head><title>Print Barcode</title></head><body>$htmlContent</body></html>');
    window.document.close();
    window.focus();
    window.print();
    window.close();
  }
}
