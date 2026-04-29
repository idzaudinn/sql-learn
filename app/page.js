 "use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page">
      <nav className="nav">
        <Link href="/" className="nav-logo">SQL-Learn</Link>
        <div className="nav-links">
          <span className="nav-link">Course</span>
          <span className="nav-link">Sandbox</span>
          <span className="nav-link">Pricing</span>
        </div>
        <div className="nav-right">
          <Link href="/login" className="btn-ghost">
            Log in
          </Link>
          <Link href="/login?mode=register" className="btn-green">
            Get started free
          </Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-left">
          <p className="hero-eyebrow">Simple, practical SQL learning</p>
          <h1 className="hero-title">Start free. Go further when you&apos;re ready.</h1>
          <p className="hero-sub">
            SQL-Learn helps beginners and working professionals practice SQL with guided
            lessons, live sandbox queries, and real datasets. Learn at your own pace with a
            clean, focused learning experience.
          </p>
          <div className="trust-row">
            <div className="trust-item">
              <div className="trust-dot" />
              No credit card to start
            </div>
            <div className="trust-item">
              <div className="trust-dot" />
              One-time payment option
            </div>
            <div className="trust-item">
              <div className="trust-dot" />
              Free core modules
            </div>
            <div className="trust-item">
              <div className="trust-dot" />
              Future updates included
            </div>
          </div>
        </div>
        <div className="hero-sql-wrap" aria-label="SQL example query">
          <div className="sql-fade sql-fade-top" aria-hidden="true" />
          <pre className="hero-sql-code">
            <code>
              <span className="sql-kw">SELECT DISTINCT</span>
              {"\n    "}<span className="sql-col">c.customer_id</span>,
              {"\n    "}<span className="sql-col">c.first_name</span>,
              {"\n    "}<span className="sql-col">c.last_name</span>,
              {"\n    "}<span className="sql-col">c.email</span>,
              {"\n    "}<span className="sql-col">s.store_id</span>
              {"\n"}<span className="sql-kw">FROM</span>
              {"\n    "}<span className="sql-tbl">rental</span> <span className="sql-alias">r</span>
              {"\n    "}<span className="sql-kw">INNER JOIN</span> <span className="sql-tbl">staff</span> <span className="sql-alias">st</span>
              {"\n        "}<span className="sql-kw">ON</span> <span className="sql-col">st.staff_id</span> <span className="sql-op">=</span> <span className="sql-col">r.staff_id</span>
              {"\n    "}<span className="sql-kw">INNER JOIN</span> <span className="sql-tbl">store</span> <span className="sql-alias">s</span>
              {"\n        "}<span className="sql-kw">ON</span> <span className="sql-col">s.manager_staff_id</span> <span className="sql-op">=</span> <span className="sql-col">st.staff_id</span> <span className="sql-kw">AND</span>
              {"\n            "}<span className="sql-col">s.store_id</span> <span className="sql-op">=</span> <span className="sql-col">st.store_id</span>
              {"\n    "}<span className="sql-kw">INNER JOIN</span> <span className="sql-tbl">customer</span> <span className="sql-alias">c</span>
              {"\n        "}<span className="sql-kw">ON</span> <span className="sql-col">r.customer_id</span> <span className="sql-op">=</span> <span className="sql-col">c.customer_id</span> <span className="sql-kw">AND</span>
              {"\n            "}<span className="sql-col">s.store_id</span> <span className="sql-op">=</span> <span className="sql-col">c.store_id</span>
              {"\n    "}<span className="sql-kw">INNER JOIN</span> <span className="sql-tbl">address</span> <span className="sql-alias">a</span>
              {"\n        "}<span className="sql-kw">ON</span> <span className="sql-col">s.address_id</span> <span className="sql-op">=</span> <span className="sql-col">a.address_id</span>
              {"\n    "}<span className="sql-kw">INNER JOIN</span> <span className="sql-tbl">city</span> <span className="sql-alias">ci</span>
              {"\n        "}<span className="sql-kw">ON</span> <span className="sql-col">ci.city_id</span> <span className="sql-op">=</span> <span className="sql-col">a.city_id</span>
              {"\n"}<span className="sql-kw">WHERE</span>
              {"\n    "}<span className="sql-col">ci.city</span> <span className="sql-op">=</span> <span className="sql-str">'Kuala Lumpur'</span>;
            </code>
          </pre>
          <div className="sql-fade sql-fade-bottom" aria-hidden="true" />
        </div>
      </section>

      <section className="cards-section">
        <div className="cards-grid">
          <article className="plan-card">
            <div className="plan-name">Free</div>
            <div className="plan-desc">Everything you need to get started with SQL.</div>
            <div className="plan-price">
              <span className="price-currency">RM</span>
              <span className="price-amount">0</span>
            </div>
            <div className="price-note">Always free, no expiry</div>
            <Link href="/login?mode=register" className="plan-btn outline">
              Start learning free <span aria-hidden="true">↗</span>
            </Link>
            <hr className="divider" />
            <div className="feature-group-label">Included</div>
            <div className="feature-item"><div className="dot" />Module 1 and 2 lessons</div>
            <div className="feature-item"><div className="dot" />Sandbox DB with sample datasets</div>
            <div className="feature-item"><div className="dot" />Live SQL editor in browser</div>
            <div className="feature-item"><div className="dot" />Exercises and quizzes</div>
          </article>

          <article className="plan-card featured">
            <div className="featured-badge">Most popular</div>
            <div className="plan-name">Full Access</div>
            <div className="plan-desc">
              Every lesson, exercise, and future update. Pay once, own forever.
            </div>
            <div className="plan-price">
              <span className="price-currency">RM</span>
              <span className="price-amount">50</span>
              <span className="price-period">/ year</span>
            </div>
            <div className="price-note green">All future updates included</div>
            <Link href="/login" className="plan-btn solid">
              Get full access <span aria-hidden="true">↗</span>
            </Link>
            <hr className="divider" />
            <div className="feature-group-label">Everything in free, plus</div>
            <div className="feature-item"><div className="dot" />Advanced and real-world modules</div>
            <div className="feature-item"><div className="dot" />Upload your own datasets</div>
            <div className="feature-item"><div className="dot" />Progress dashboard and certificate</div>
            <div className="feature-item"><div className="dot" />Priority support</div>
          </article>
        </div>
      </section>

      <section className="faq-section">
        <div className="faq-inner">
          <div className="faq-title">Frequently asked questions</div>
          <div className="faq-item">
            <div className="faq-q">What is SQL-Learn?</div>
            <div className="faq-a">
              SQL-Learn is an online learning platform that teaches SQL through short
              lessons, practical exercises, and a built-in query sandbox.
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-q">Do I need an account?</div>
            <div className="faq-a">
              You can browse public info without an account. To access the protected
              dashboard, use the login page.
            </div>
          </div>
        </div>
      </section>

      <section className="cta-strip">
        <div className="cta-text">
          <div className="cta-title">Ready to get serious about SQL?</div>
          <div className="cta-sub">Create your account and start practicing now.</div>
        </div>
        <Link href="/login" className="cta-btn">Log in</Link>
        <Link href="/login?mode=register" className="cta-btn cta-light">Create account</Link>
      </section>

      <style jsx>{`
        .page { background: var(--color-background-primary); min-height: 100vh; max-width: 1240px; margin: 0 auto; }
        .nav { display: flex; align-items: center; padding: 14px 32px; border-bottom: 0.5px solid var(--color-border-tertiary); background: var(--color-background-primary); position: sticky; top: 0; z-index: 10; }
        .nav-logo {
          font-size: 20px;
          font-weight: 800;
          color: #97c459;
          text-decoration: none;
          letter-spacing: 0.2px;
        }
        .nav-links { display: flex; gap: 24px; margin-left: 32px; }
        .nav-link { font-size: 13px; color: var(--color-text-secondary); }
        .nav-right { margin-left: auto; display: flex; gap: 10px; align-items: center; }
        .btn-ghost,
        .btn-green {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          color: #ffffff;
          cursor: pointer;
          padding: 11px 20px;
          border-radius: 14px;
          border: 1px solid #4f545c;
          background: #2f3236;
          text-decoration: none;
          font-weight: 700;
          letter-spacing: 0.1px;
          line-height: 1;
          min-width: 126px;
          transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }
        .btn-ghost:hover,
        .btn-green:hover {
          background: #383c42;
          border-color: #639922;
          transform: translateY(-1px);
        }
        .hero {
          display: grid;
          grid-template-columns: 1fr 480px;
          align-items: center;
          gap: 22px;
          padding: 40px 32px 36px;
          border-bottom: 0.5px solid var(--color-border-tertiary);
        }
        .hero-left { text-align: left; }
        .hero-eyebrow { font-size: 12px; color: #97c459; font-weight: 500; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px; }
        .hero-title { font-size: 42px; font-weight: 600; color: var(--color-text-primary); line-height: 1.25; margin-bottom: 12px; }
        .hero-sub { font-size: 16px; color: var(--color-text-secondary); max-width: 680px; margin: 0 0 24px; line-height: 1.7; }
        .trust-row { display: flex; justify-content: flex-start; gap: 24px; flex-wrap: wrap; }
        .trust-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--color-text-secondary); }
        .trust-dot { width: 6px; height: 6px; border-radius: 50%; background: #639922; }
        .hero-sql-wrap {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          min-height: 360px;
          max-height: 360px;
        }
        .hero-sql-code {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 360px;
          overflow: hidden;
          display: block;
          margin: 0;
          padding: 20px 18px;
          font-size: 12.5px;
          line-height: 1.75;
          color: #d7dde7;
          font-family: "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", monospace;
          white-space: pre;
        }
        .sql-kw { color: #7f77dd; font-weight: 700; }
        .sql-col { color: #d7dde7; }
        .sql-tbl { color: #5dcaa5; }
        .sql-alias { color: #8dd0ff; }
        .sql-op { color: #97c459; }
        .sql-str { color: #ef9f27; }
        .sql-fade {
          position: absolute;
          left: 0;
          width: 100%;
          height: 44px;
          z-index: 2;
          pointer-events: none;
        }
        .sql-fade-top {
          top: 0;
          background: linear-gradient(to bottom, rgba(44,44,44,1), rgba(44,44,44,0));
        }
        .sql-fade-bottom {
          bottom: 0;
          background: linear-gradient(to top, rgba(44,44,44,1), rgba(44,44,44,0));
        }
        .cards-section { padding: 40px 32px; }
        .cards-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; max-width: 860px; margin: 0 auto; }
        .plan-card { background: #333; border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); padding: 24px; }
        .plan-card.featured { border: 2px solid #639922; }
        .featured-badge { display: inline-block; font-size: 11px; padding: 3px 10px; border-radius: 10px; background: #EAF3DE; color: #3B6D11; font-weight: 500; margin-bottom: 14px; }
        .plan-name { font-size: 24px; font-weight: 600; color: var(--color-text-primary); margin-bottom: 4px; }
        .plan-desc { font-size: 14px; color: var(--color-text-secondary); margin-bottom: 18px; line-height: 1.6; }
        .plan-price { display: flex; align-items: baseline; gap: 4px; margin-bottom: 6px; }
        .price-currency { font-size: 14px; font-weight: 500; color: var(--color-text-primary); }
        .price-amount { font-size: 52px; font-weight: 600; color: var(--color-text-primary); line-height: 1; }
        .price-period { font-size: 12px; color: var(--color-text-secondary); }
        .price-note { font-size: 11px; color: var(--color-text-secondary); margin-bottom: 20px; }
        .price-note.green { color: #97c459; font-weight: 500; }
        .plan-btn {
          width: 100%;
          padding: 13px 16px;
          border-radius: 14px;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          text-align: center;
          text-decoration: none;
          letter-spacing: 0.2px;
          line-height: 1;
          transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }
        .plan-btn.outline {
          border: 1px solid #4f545c;
          background: #2f3236;
          color: #ffffff;
        }
        .plan-btn.solid {
          border: 1px solid #4f545c;
          background: #2f3236;
          color: #ffffff;
        }
        .plan-btn:hover {
          background: #383c42;
          border-color: #639922;
          transform: translateY(-1px);
        }
        .divider { border: none; border-top: 0.5px solid var(--color-border-tertiary); margin-bottom: 16px; }
        .feature-group-label { font-size: 10px; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 10px; }
        .feature-item { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 9px; font-size: 13px; color: var(--color-text-primary); }
        .dot { width: 14px; height: 14px; border-radius: 50%; background: #EAF3DE; margin-top: 2px; flex-shrink: 0; }
        .faq-section { padding: 0 32px 48px; }
        .faq-inner { max-width: 860px; margin: 0 auto; }
        .faq-title { font-size: 24px; font-weight: 600; color: var(--color-text-primary); margin-bottom: 16px; }
        .faq-item { border-bottom: 0.5px solid var(--color-border-tertiary); padding: 14px 0; }
        .faq-q { font-size: 18px; font-weight: 600; color: var(--color-text-primary); margin-bottom: 6px; }
        .faq-a { font-size: 15px; color: var(--color-text-secondary); line-height: 1.65; }
        .cta-strip { background: #1a1f2e; margin: 0 32px 40px; border-radius: var(--border-radius-lg); padding: 28px 32px; display: flex; align-items: center; gap: 24px; }
        .cta-text { flex: 1; }
        .cta-title { font-size: 16px; font-weight: 500; color: #fff; margin-bottom: 4px; }
        .cta-sub { font-size: 13px; color: rgba(255,255,255,0.5); }
        .cta-btn { font-size: 13px; font-weight: 500; padding: 10px 24px; border-radius: 8px; background: #639922; color: #fff; text-decoration: none; }
        .cta-light { background: #EAF3DE; color: #27500A; }
        @media (max-width: 960px) {
          .nav { padding: 12px 16px; flex-wrap: wrap; gap: 10px; }
          .nav-links { margin-left: 0; width: 100%; }
          .hero { grid-template-columns: 1fr; }
          .hero-left { text-align: center; }
          .hero-sub { margin: 0 auto 24px; }
          .trust-row { justify-content: center; }
          .hero-sql-wrap { max-width: 700px; margin: 0 auto; }
          .cards-grid { grid-template-columns: 1fr; }
          .cta-strip { margin: 0 16px 20px; padding: 20px; flex-direction: column; align-items: flex-start; }
          .faq-section, .cards-section, .hero { padding-left: 16px; padding-right: 16px; }
          .page { max-width: 100%; }
          .hero-title { font-size: 34px; }
          .faq-title { font-size: 20px; }
          .faq-q { font-size: 16px; }
        }
      `}</style>
    </main>
  );
}
