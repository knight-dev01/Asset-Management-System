import 'print_helper_stub.dart'
    if (dart.library.html) 'print_helper_web.dart'
    if (dart.library.io) 'print_helper_desktop.dart';

void printHtml(String htmlContent) => printHtmlImpl(htmlContent);
