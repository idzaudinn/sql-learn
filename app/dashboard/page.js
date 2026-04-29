"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const USER_REGEX = /^[A-Za-z0-9_]{1,24}$/;
const SESSION_KEY = "sqllearn_session_v1";

function getSessionUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return "";
    const parsed = JSON.parse(raw);
    if (parsed && USER_REGEX.test(parsed.user || "")) return parsed.user;
  } catch (_err) {
    return "";
  }
  return "";
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState("");

  useEffect(() => {
    const sessionUser = getSessionUser();
    if (!sessionUser) {
      router.replace("/login");
      return;
    }
    setUser(sessionUser);
  }, [router]);

  function onLogout() {
    localStorage.removeItem(SESSION_KEY);
    router.replace("/login");
  }

  return (
    <main className="shell">
      <div className="topbar">
        <div className="user">Logged in as: <strong>{user || "..."}</strong></div>
        <div className="actions">
          <Link className="btn" href="/">Home</Link>
          <button className="btn green" type="button" onClick={onLogout}>Log out</button>
        </div>
      </div>
      <section className="card">
        <div className="head">
          <h1 className="title">Welcome to SQL-Learn</h1>
          <p className="desc">
            This dashboard is your protected area after login. It shows what your website offers:
            guided SQL lessons, practical sandbox exercises, and progress-based learning for both
            free and full-access users.
          </p>
        </div>
        <div className="content">
          <article className="panel">
            <h3>Learning path overview</h3>
            <ul>
              <li>Module 1: SQL foundations</li>
              <li>Module 2: Intermediate SQL</li>
              <li>Module 3: Advanced SQL (full access)</li>
              <li>Module 4: Real-world SQL projects (full access)</li>
            </ul>
          </article>
          <article className="panel">
            <h3>Platform capabilities</h3>
            <p>
              Users can practice queries directly in browser, learn from examples, and continue
              based on saved progress. Upgraded users can also unlock advanced lessons and work
              with their own datasets.
            </p>
          </article>
        </div>
      </section>

      <style jsx>{`
        .shell { min-height: 100vh; padding: 24px; max-width: 1080px; margin: 0 auto; }
        .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .user { font-size: 13px; color: #d5d8de; }
        .actions { display: flex; gap: 8px; }
        .btn {
          border: 1px solid #4f545c;
          background: #2f3236;
          color: #fff;
          border-radius: 14px;
          padding: 10px 20px;
          font-size: 13px;
          cursor: pointer;
          text-decoration: none;
          font-weight: 700;
          letter-spacing: 0.1px;
        }
        .btn.green {
          border: 1px solid #4f545c;
          background: #2f3236;
          color: #fff;
        }
        .card { background: #333333; border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); }
        .head { padding: 18px 20px; border-bottom: 0.5px solid var(--color-border-tertiary); }
        .title { font-size: 20px; margin-bottom: 8px; }
        .desc { font-size: 13px; color: var(--color-text-secondary); line-height: 1.7; max-width: 820px; }
        .content { padding: 20px; display: grid; gap: 14px; grid-template-columns: 1fr 1fr; }
        .panel { border: 0.5px solid var(--color-border-tertiary); border-radius: 10px; background: var(--color-background-secondary); padding: 14px; }
        .panel h3 { font-size: 14px; margin-bottom: 8px; }
        .panel p, .panel li { font-size: 12px; color: var(--color-text-secondary); line-height: 1.7; }
        .panel ul { padding-left: 16px; }
        @media (max-width: 900px) {
          .shell { padding: 12px; }
          .content { grid-template-columns: 1fr; }
          .topbar { flex-direction: column; align-items: flex-start; gap: 10px; }
        }
      `}</style>
    </main>
  );
}
