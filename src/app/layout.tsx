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
let persister = persistStore(store);
const queryClient = new QueryClient();
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
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
