// main.dart
import 'package:flutter/material.dart';
import 'login_screen.dart';
import 'pixel_colors.dart';

void main() {
  runApp(const PixelMessengerApp());
}

class PixelMessengerApp extends StatelessWidget {
  const PixelMessengerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Pixel Messenger',
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: PixelColors.darkBackground,
        fontFamily: 'monospace',
      ),
      home: const LoginScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}
