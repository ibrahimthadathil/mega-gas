"use client";
import { AuthProvider } from "@/context/authProvider";
import "./globals.css";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import Loading from "@/loading";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const persister = persistStore(store);
const queryClient = new QueryClient();
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <PersistGate loading={<Loading />} persistor={persister}>
              <AuthProvider>{children}</AuthProvider>
              <Toaster position="top-center" richColors />
            </PersistGate>
          </Provider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
