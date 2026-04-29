"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const USER_REGEX = /^[A-Za-z0-9_]{1,24}$/;
const PASS_REGEX = /^[A-Za-z0-9_]{1,24}$/;
const TEST_USER = "admin";
const TEST_PASS = "admin";
const SESSION_KEY = "sqllearn_session_v1";
const ACCOUNT_KEY = "sqllearn_test_account_v1";

function normalizeInput(value) {
  return String(value || "").trim();
}

function validateCredential(username, password) {
  if (!USER_REGEX.test(username) || !PASS_REGEX.test(password)) {
    return "Use only letters, numbers, or underscore (max 24 chars).";
  }
  return "";
}

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

function getRegisteredAccount() {
  try {
    const raw = localStorage.getItem(ACCOUNT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed) return null;
    if (!USER_REGEX.test(parsed.user || "") || !PASS_REGEX.test(parsed.pass || "")) return null;
    return parsed;
  } catch (_err) {
    return null;
  }
}

function canLogin(username, password) {
  if (username === TEST_USER && password === TEST_PASS) return true;
  const account = getRegisteredAccount();
  return !!(account && account.user === username && account.pass === password);
}

export default function LoginPage() {
  const router = useRouter();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [registerUser, setRegisterUser] = useState("");
  const [registerPass, setRegisterPass] = useState("");
  const [loginMsg, setLoginMsg] = useState({ text: "", error: false });
  const [registerMsg, setRegisterMsg] = useState({ text: "", error: false });

  useEffect(() => {
    if (getSessionUser()) {
      router.replace("/dashboard");
    }
    const params = new URLSearchParams(window.location.search);
    setIsRegisterMode(params.get("mode") === "register");
  }, [router]);

  function setSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ user }));
  }

  function onLogin(event) {
    event.preventDefault();
    const username = normalizeInput(loginUser);
    const password = normalizeInput(loginPass);
    const invalid = validateCredential(username, password);
    if (invalid) {
      setLoginMsg({ text: invalid, error: true });
      return;
    }
    if (!canLogin(username, password)) {
      setLoginMsg({ text: "Invalid login. For testing, use admin/admin.", error: true });
      return;
    }
    setSession(username);
    router.replace("/dashboard");
  }

  function onRegister(event) {
    event.preventDefault();
    const username = normalizeInput(registerUser);
    const password = normalizeInput(registerPass);
    const invalid = validateCredential(username, password);
    if (invalid) {
      setRegisterMsg({ text: invalid, error: true });
      return;
    }
    if (username !== TEST_USER || password !== TEST_PASS) {
      setRegisterMsg({ text: "For this test version, create account with admin/admin.", error: true });
      return;
    }
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify({ user: username, pass: password }));
    setSession(username);
    router.replace("/dashboard");
  }

  return (
    <main className="auth-body-wrap">
      <section className="auth-shell">
        <div className="auth-head">
          <Link className="brand" href="/">
            SQL-Learn
          </Link>
          <Link className="back-link" href="/">
            Back to home
          </Link>
        </div>
        <div className="auth-body">
          <section className={`col ${!isRegisterMode ? "active-col" : ""}`}>
            <h1 className="title">Log in</h1>
            <p className="sub">Sign in to access your SQL-Learn dashboard.</p>
            <form onSubmit={onLogin} noValidate>
              <div className="field">
                <label className="label" htmlFor="login-username">Username</label>
                <input
                  id="login-username"
                  className="input"
                  type="text"
                  maxLength={24}
                  autoComplete="username"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label className="label" htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  className="input"
                  type="password"
                  maxLength={24}
                  autoComplete="current-password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  required
                />
              </div>
              <button className="btn" type="submit">Log in</button>
              <p className={`msg ${loginMsg.text ? (loginMsg.error ? "error" : "success") : ""}`}>{loginMsg.text}</p>
            </form>
          </section>
          <section className={`col ${isRegisterMode ? "active-col" : ""}`}>
            <h2 className="title">Create new account</h2>
            <p className="sub">For this testing build, create account with admin/admin.</p>
            <form onSubmit={onRegister} noValidate>
              <div className="field">
                <label className="label" htmlFor="register-username">Username</label>
                <input
                  id="register-username"
                  className="input"
                  type="text"
                  maxLength={24}
                  autoComplete="username"
                  value={registerUser}
                  onChange={(e) => setRegisterUser(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label className="label" htmlFor="register-password">Password</label>
                <input
                  id="register-password"
                  className="input"
                  type="password"
                  maxLength={24}
                  autoComplete="new-password"
                  value={registerPass}
                  onChange={(e) => setRegisterPass(e.target.value)}
                  required
                />
              </div>
              <button className="btn" type="submit">Create account</button>
              <p className={`msg ${registerMsg.text ? (registerMsg.error ? "error" : "success") : ""}`}>{registerMsg.text}</p>
            </form>
            <p className="hint">Testing credential: username <strong>admin</strong>, password <strong>admin</strong>.</p>
          </section>
        </div>
      </section>

      <style jsx>{`
        .auth-body-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .auth-shell { width: 100%; max-width: 860px; background: #333333; border-radius: var(--border-radius-lg); border: 0.5px solid var(--color-border-tertiary); overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); }
        .auth-head { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 0.5px solid var(--color-border-tertiary); background: var(--color-background-secondary); }
        .auth-body { display: grid; grid-template-columns: 1fr 1fr; }
        .col { padding: 20px; }
        .col + .col { border-left: 0.5px solid var(--color-border-tertiary); }
        .title { font-size: 17px; margin-bottom: 8px; color: var(--color-text-primary); }
        .sub { font-size: 12px; color: var(--color-text-secondary); margin-bottom: 14px; line-height: 1.7; }
        .field { margin-bottom: 10px; }
        .label { display: block; font-size: 12px; color: var(--color-text-secondary); margin-bottom: 6px; }
        .input { width: 100%; border: 0.5px solid var(--color-border-secondary); border-radius: 8px; padding: 10px; font-size: 13px; color: var(--color-text-primary); background: #242424; outline: none; }
        .input:focus { border-color: #639922; box-shadow: 0 0 0 2px rgba(99, 153, 34, 0.15); }
        .btn {
          width: 100%;
          border: 1px solid #4f545c;
          background: #2f3236;
          color: #fff;
          border-radius: 14px;
          padding: 12px 20px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.1px;
        }
        .msg { min-height: 18px; font-size: 12px; margin-top: 8px; color: var(--color-text-secondary); }
        .msg.error { color: #ff9f9f; }
        .msg.success { color: #97c459; }
        .hint { margin-top: 12px; font-size: 12px; border-radius: 8px; padding: 9px 10px; background: #EAF3DE; color: #3B6D11; }
        .active-col { box-shadow: inset 0 0 0 2px rgba(99, 153, 34, 0.2); border-radius: 8px; }
        @media (max-width: 860px) {
          .auth-body { grid-template-columns: 1fr; }
          .col + .col { border-left: none; border-top: 0.5px solid var(--color-border-tertiary); }
        }
      `}</style>
    </main>
  );
}
