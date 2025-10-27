"use client";
import { AuthProvider } from "@/context/authProvider";
import "./globals.css";
import { Toaster } from "sonner";
import { Provider } from 'react-redux';
import store from "@/redux/store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <AuthProvider>{children}</AuthProvider>
          <Toaster position="top-center" richColors />
        </Provider>
      </body>
    </html>
  );
}
