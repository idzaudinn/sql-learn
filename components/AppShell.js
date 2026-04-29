"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const USER_REGEX = /^[A-Za-z0-9_]{1,24}$/;
export const SESSION_KEY = "sqllearn_session_v1";

function getSessionUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return "";
    const parsed = JSON.parse(raw);
    if (parsed && USER_REGEX.test(parsed.user || "")) return parsed.user;
  } catch {
    return "";
  }
  return "";
}

function initialsFromUser(user) {
  if (!user || user.length < 2) return "AZ";
  return user.slice(0, 2).toUpperCase();
}

function displayNameFromUser(user) {
  if (!user) return "Learner";
  if (user === "admin") return "Ahmad Zainal";
  return user.charAt(0).toUpperCase() + user.slice(1);
}

/**
 * @param {{ children: import('react').ReactNode, activeNav?: 'dashboard' | 'sandbox' }} props
 */
export default function AppShell({ children, activeNav = "dashboard" }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState("");

  useEffect(() => {
    const sessionUser = getSessionUser();
    if (!sessionUser) {
      router.replace("/login");
      return;
    }
    setUser(sessionUser);
  }, [router, pathname]);

  function onLogout() {
    localStorage.removeItem(SESSION_KEY);
    router.replace("/login");
  }

  return (
    <div className="flex min-h-screen w-full max-w-full flex-col bg-[#2c2c2c] md:flex-row">
      <aside
        className="flex w-full min-w-0 flex-col border-b border-white/[0.08] bg-[#1a1f2e] md:w-[220px] md:min-w-[220px] md:border-b-0 md:border-r"
        aria-label="Main navigation"
      >
        <div className="border-b border-white/[0.08] px-4 pb-3 pt-[18px]">
          <div className="text-[15px] font-bold leading-tight tracking-tight text-white">SQL-Learn</div>
          <div className="mt-1 text-[11px] text-white/40">Practice sandbox</div>
        </div>

        <nav className="sidebar-nav flex-1 overflow-y-auto px-2 py-2.5">
          <div className="mb-[18px]">
            <div className="px-2 pb-1.5 text-[10px] uppercase tracking-wide text-white/30">Learn</div>
            <Link
              href="/dashboard"
              className={`mb-px flex w-full items-center gap-2 rounded-md py-[7px] pl-2.5 pr-2.5 text-left text-[13px] no-underline ${
                activeNav === "dashboard"
                  ? "bg-[rgba(99,153,34,0.18)] text-[#97c459]"
                  : "text-white/55 hover:bg-white/[0.06] hover:text-white/85"
              }`}
              aria-current={activeNav === "dashboard" ? "page" : undefined}
            >
              <svg
                className={`h-3.5 w-3.5 shrink-0 ${activeNav === "dashboard" ? "opacity-100" : "opacity-70"}`}
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
                <path
                  d="M5 8h6M5 5.5h4M5 10.5h3"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              SQL course
              <span className="ml-auto rounded-[10px] bg-[rgba(99,153,34,0.2)] px-1.5 py-0.5 text-[10px] text-[#97c459]">35%</span>
            </Link>
            <button
              type="button"
              className="mb-px flex w-full cursor-pointer items-center gap-2 rounded-md border-0 bg-transparent py-[7px] pl-2.5 pr-2.5 text-left text-[13px] text-white/55 hover:bg-white/[0.06] hover:text-white/85"
            >
              <svg className="h-3.5 w-3.5 shrink-0 opacity-70" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
                <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              My progress
            </button>
          </div>

          <div className="mb-[18px]">
            <div className="px-2 pb-1.5 text-[10px] uppercase tracking-wide text-white/30">Practice</div>
            <button
              type="button"
              className="mb-px flex w-full cursor-pointer items-center gap-2 rounded-md border-0 bg-transparent py-[7px] pl-2.5 pr-2.5 text-left text-[13px] text-white/55 hover:bg-white/[0.06] hover:text-white/85"
            >
              <svg className="h-3.5 w-3.5 shrink-0 opacity-70" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                <path
                  d="M5 7l2 2 4-3"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Exercises
            </button>
            <Link
              href="/sandbox"
              className={`mb-px flex w-full items-center gap-2 rounded-md py-[7px] pl-2.5 pr-2.5 text-left text-[13px] no-underline ${
                activeNav === "sandbox"
                  ? "bg-[rgba(99,153,34,0.18)] text-[#97c459]"
                  : "text-white/55 hover:bg-white/[0.06] hover:text-white/85"
              }`}
              aria-current={activeNav === "sandbox" ? "page" : undefined}
            >
              <svg
                className={`h-3.5 w-3.5 shrink-0 ${activeNav === "sandbox" ? "opacity-100" : "opacity-70"}`}
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <ellipse cx="8" cy="6" rx="5" ry="2.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M3 6v4c0 1.38 2.24 2.5 5 2.5s5-1.12 5-2.5V6" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              Sandbox DB
            </Link>
          </div>

          <div>
            <div className="px-2 pb-1.5 text-[10px] uppercase tracking-wide text-white/30">Account</div>
            <button
              type="button"
              className="mb-px flex w-full cursor-pointer items-center gap-2 rounded-md border-0 bg-transparent py-[7px] pl-2.5 pr-2.5 text-left text-[13px] text-white/55 hover:bg-white/[0.06] hover:text-white/85"
            >
              <svg className="h-3.5 w-3.5 shrink-0 opacity-70" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="3" y="2" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M6 5h4M6 8h4M6 11h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              Billing
              <span className="ml-auto rounded-[10px] bg-[rgba(239,159,39,0.15)] px-1.5 py-0.5 text-[10px] text-[#ef9f27]">Free</span>
            </button>
            <button
              type="button"
              className="mb-px flex w-full cursor-pointer items-center gap-2 rounded-md border-0 bg-transparent py-[7px] pl-2.5 pr-2.5 text-left text-[13px] text-white/55 hover:bg-white/[0.06] hover:text-white/85"
            >
              <svg className="h-3.5 w-3.5 shrink-0 opacity-70" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
                <path
                  d="M3 13c0-2.76 2.24-5 5-5s5 2.24 5 5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              Profile
            </button>
          </div>
        </nav>

        <div className="mt-auto flex items-center gap-2.5 border-t border-white/[0.08] px-3.5 py-3">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#185fa5] text-[11px] font-semibold text-[#b5d4f4]"
            aria-hidden="true"
          >
            {initialsFromUser(user)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-white/[0.88]">{displayNameFromUser(user)}</div>
            <div className="text-[10px] text-white/35">Free plan</div>
          </div>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden">
        <header className="flex flex-shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#4a4a4a] bg-[#2c2c2c] px-3 py-3 sm:px-5">
          <div className="min-w-0 text-[13px] text-[#c4cad3]">
            Logged in as <strong className="text-[#f4f6fa]">{user || "…"}</strong>
          </div>
          <div className="actions flex shrink-0 flex-wrap gap-2">
            <Link className="btn" href="/">
              Home
            </Link>
            <Link
              className="btn"
              href="/dashboard"
            >
              Dashboard
            </Link>
            <button className="btn" type="button" onClick={onLogout}>
              Log out
            </button>
          </div>
        </header>

        <div className="min-h-0 w-full min-w-0 flex-1 overflow-y-auto overflow-x-hidden">{children}</div>
      </div>
    </div>
  );
}
