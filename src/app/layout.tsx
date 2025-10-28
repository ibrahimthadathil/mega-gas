"use client";
import { AuthProvider } from "@/context/authProvider";
import "./globals.css";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let persister = persistStore(store)
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <PersistGate persistor={persister}>
            <AuthProvider>{children}</AuthProvider>
            <Toaster position="top-center" richColors />
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
