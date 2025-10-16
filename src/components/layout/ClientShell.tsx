'use client';
import Link from "next/link";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { AuthButtons } from "@/components/auth/AuthButtons";

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
          <nav className="container py-3">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-lg font-extrabold brand">Products</Link>
              <div className="hidden md:flex items-center gap-3 text-sm">
                <Link href="/" className="btn-outline">Home</Link>
                <Link href="/products/new" className="btn-accent">Add Product</Link>
                <Link href="/cart" className="btn-outline">Cart</Link>
                <Link href="/orders" className="btn-outline">Orders</Link>
                <AuthButtons />
              </div>
              <div className="md:hidden">
                <AuthButtons />
              </div>
            </div>
            <div className="md:hidden mt-3 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-2 text-sm">
                <Link href="/" className="btn-outline text-xs">Home</Link>
                <Link href="/products/new" className="btn-accent text-xs">Add Product</Link>
                <Link href="/cart" className="btn-outline text-xs">Cart</Link>
                <Link href="/orders" className="btn-outline text-xs">Orders</Link>
              </div>
            </div>
          </nav>
        </header>
        <main className="flex-1 container py-6">
          {children}
        </main>
        <footer className="mt-auto border-t bg-white">
          <div className="container py-6 text-sm text-gray-600 flex flex-col md:flex-row items-center justify-between gap-3">
            <span>
              <span className="font-semibold">Products</span> · All rights reserved
            </span>
            <div className="flex items-center gap-3">
              <Link href="/" className="hover:underline">Home</Link>
              <Link href="/orders" className="hover:underline">Orders</Link>
              <Link href="/cart" className="hover:underline">Cart</Link>
            </div>
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
}


