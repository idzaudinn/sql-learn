"use client";

import dynamic from "next/dynamic";
import AppShell from "@/components/AppShell";

const SqlSandbox = dynamic(() => import("@/components/SqlSandboxClient"), {
  ssr: false,
  loading: () => (
    <p className="text-sm text-[#c4cad3]">Loading the SQL sandbox (WebAssembly)…</p>
  ),
});

export default function SandboxPage() {
  return (
    <AppShell activeNav="sandbox">
      <main className="main-body flex-1 p-5">
        <div className="max-w-5xl rounded-[14px] border border-[#4a4a4a] bg-[#333]">
          <div className="border-b border-[#4a4a4a] p-5">
            <h1 className="text-xl font-semibold text-[#f4f6fa]">Sandbox database</h1>
            <p className="mt-2 text-[13px] leading-relaxed text-[#c4cad3]">
              A local SQLite in your browser (sql.js). No server: your queries stay on this device. Try
              the quick examples, write your own SQL, or import a CSV as a new table.
            </p>
          </div>
          <div className="p-5">
            <SqlSandbox />
          </div>
        </div>
      </main>
    </AppShell>
  );
}
