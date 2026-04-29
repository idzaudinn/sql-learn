"use client";

import AppShell from "@/components/AppShell";

export default function DashboardPage() {
  return (
    <AppShell activeNav="dashboard">
      <main className="main-body flex-1 p-5">
        <section className="card max-w-[900px] overflow-hidden rounded-[14px] border border-[#4a4a4a] bg-[#333]">
          <div className="head border-b border-[#4a4a4a] p-[18px_20px]">
            <h1 className="title text-xl text-[#f4f6fa]">Welcome to SQL-Learn</h1>
            <p className="desc mt-2 text-[13px] leading-relaxed text-[#c4cad3]">
              This dashboard is your protected area after login. It shows what your website offers: guided
              SQL lessons, practical sandbox exercises, and progress-based learning for free and
              full-access users.
            </p>
          </div>
          <div className="content grid max-w-full gap-[14px] p-5 sm:grid-cols-2">
            <article className="panel rounded-[10px] border border-[#4a4a4a] bg-[#383838] p-3.5">
              <h3 className="mb-2 text-sm text-[#f4f6fa]">Learning path overview</h3>
              <ul className="list-outside pl-4 text-xs leading-relaxed text-[#c4cad3]">
                <li>Module 1: SQL foundations</li>
                <li>Module 2: Intermediate SQL</li>
                <li>Module 3: Advanced SQL (full access)</li>
                <li>Module 4: Real-world SQL projects (full access)</li>
              </ul>
            </article>
            <article className="panel rounded-[10px] border border-[#4a4a4a] bg-[#383838] p-3.5">
              <h3 className="mb-2 text-sm text-[#f4f6fa]">Platform capabilities</h3>
              <p className="text-xs leading-relaxed text-[#c4cad3]">
                Users can practice queries directly in the browser, learn from examples, and continue based
                on saved progress. Upgraded users can also unlock advanced lessons and work with their own
                datasets.
              </p>
            </article>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
