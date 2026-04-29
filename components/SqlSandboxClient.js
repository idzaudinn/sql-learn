"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_QUERY = `SELECT * FROM users
LIMIT 10;`;

const SAMPLE_MIN_USERS = 5;
const SAMPLE_MAX_USERS = 150;
const DEFAULT_SAMPLE_USERS = 12;
const DEFAULT_RANDOMNESS = 20;

const FIRST_NAMES = [
  "Aina",
  "Budi",
  "Chloe",
  "Denis",
  "Eva",
  "Farid",
  "Grace",
  "Hakim",
  "Ivy",
  "Jasmine",
  "Kamal",
  "Lily",
  "Marcus",
  "Nurul",
  "Omar",
  "Priya",
  "Ravi",
  "Siti",
  "Tariq",
  "Wei",
  "Yana",
  "Zaki",
];
const LAST_NAMES = [
  "Rahman",
  "Santoso",
  "Tan",
  "Lee",
  "Kumar",
  "Hassan",
  "Ng",
  "Idris",
  "Chong",
  "Woo",
  "Devi",
  "Azman",
  "Lim",
  "Ibrahim",
  "Patel",
  "Fernandez",
  "Ahmad",
  "Goh",
  "Ismail",
  "Yong",
  "Bakar",
  "Gopal",
];
const CITIES = [
  "Kuala Lumpur",
  "Petaling Jaya",
  "Penang",
  "Johor Bahru",
  "Ipoh",
  "Shah Alam",
  "Melaka",
  "Kuching",
  "Kota Kinabalu",
  "Seremban",
  "Klang",
  "Miri",
  "Alor Setar",
  "Kuantan",
];
const PRODUCTS = [
  "Laptop stand",
  "SQL course bundle",
  "USB-C hub",
  "Bluetooth keyboard",
  "Monitor 27\"",
  "Webcam HD",
  "Desk lamp",
  "Mouse pad",
  "Noise-cancelling headphones",
  "Laptop bag",
  "External SSD 1TB",
  "SQL cheat sheet print",
  "Standing desk",
  "Notebook set",
  "API course add-on",
  "Book: SQL in Practice",
  "Yoga mat",
  "Phone case",
  "Charger 65W",
  "DisplayPort cable",
];

function mulberry32(a) {
  return function r() {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function escapeSqlString(s) {
  return `'${String(s).replace(/'/g, "''")}'`;
}

/**
 * @param {number} userCount
 * @param {number} randomness 0–100 (0 = same order/structure each time, 100 = more variation)
 * @param {number} dataSeed any integer; same seed + params → same data
 */
function buildSeedSql(userCount, randomness, dataSeed) {
  const mix = Math.min(100, Math.max(0, randomness)) / 100;
  const n = Math.min(SAMPLE_MAX_USERS, Math.max(SAMPLE_MIN_USERS, userCount | 0));
  const rand = mulberry32(dataSeed >>> 0);

  function pick(orderedIndex, len) {
    const o = orderedIndex % len;
    if (mix < 0.001) return o;
    const rnd = rand() * len;
    return Math.min(len - 1, Math.max(0, Math.floor((1 - mix) * o + mix * rnd)));
  }

  const users = [];
  for (let i = 1; i <= n; i += 1) {
    const fn = FIRST_NAMES[pick(i - 1, FIRST_NAMES.length)];
    const ln = LAST_NAMES[pick(i * 3, LAST_NAMES.length)];
    const name = `${fn} ${ln}`;
    const age = 18 + (Math.floor((1 - mix) * ((i * 7) % 45) + mix * rand() * 47) % 45);
    const city = CITIES[pick(i * 5, CITIES.length)];
    const em = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@email.com`.replace(/[^a-z0-9.@]+/g, ".");
    users.push([i, name, age, em, city]);
  }

  const orderCount = Math.min(400, Math.max(n, Math.round(n * 1.35)));
  const orders = [];
  for (let oid = 1; oid <= orderCount; oid += 1) {
    const userId = 1 + (Math.floor((1 - mix) * ((oid * 11) % n) + mix * rand() * n) % n);
    const product = PRODUCTS[pick(oid * 7, PRODUCTS.length)];
    const amount = Math.round((8 + (mix * rand() * 800 + (1 - mix) * ((oid * 13) % 100))) * 100) / 100;
    const day = 1 + (oid * 3) % 28;
    const m = 1 + (oid * 2) % 12;
    const y = 2024 + (oid % 2);
    const date = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    orders.push([oid, userId, product, amount, date]);
  }

  const uRows = users.map(
    (r) =>
      `INSERT INTO users (id, name, age, email, city) VALUES (${r[0]}, ${escapeSqlString(
        r[1]
      )}, ${r[2]}, ${escapeSqlString(r[3])}, ${escapeSqlString(r[4])});`
  );
  const oRows = orders.map(
    (r) =>
      `INSERT INTO orders (id, user_id, product, amount, date) VALUES (${r[0]}, ${r[1]}, ${escapeSqlString(
        r[2]
      )}, ${r[3]}, ${escapeSqlString(r[4])});`
  );
  return `
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS users;
    CREATE TABLE users (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER,
      email TEXT,
      city TEXT
    );
    CREATE TABLE orders (
      id INTEGER PRIMARY KEY,
      user_id INTEGER,
      product TEXT,
      amount REAL,
      date TEXT
    );
    ${uRows.join("\n    ")}
    ${oRows.join("\n    ")}
  `;
}

const QUICK = [
  { label: "All users", sql: "SELECT * FROM users;" },
  { label: "All orders", sql: "SELECT * FROM orders;" },
  {
    label: "JOIN users & orders",
    sql: `SELECT u.name, u.city, o.product, o.amount, o.date
FROM users u
INNER JOIN orders o ON o.user_id = u.id
ORDER BY o.date DESC;`,
  },
  {
    label: "WHERE filter",
    sql: `SELECT name, email, city FROM users
WHERE city = 'Kuala Lumpur'
ORDER BY age;`,
  },
];

function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQ = false;
  for (let j = 0; j < line.length; j += 1) {
    const c = line[j];
    if (inQ) {
      if (c === '"') {
        if (line[j + 1] === '"') {
          cur += '"';
          j += 1;
        } else inQ = false;
      } else cur += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out;
}

function parseCsvText(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length < 2) {
    throw new Error("CSV needs a header row and at least one data row.");
  }
  return {
    headers: parseCsvLine(lines[0]),
    data: lines.slice(1).map((l) => parseCsvLine(l)),
  };
}

function sanitizeColumnName(raw, used) {
  let s = String(raw || "col")
    .trim()
    .replace(/[^a-zA-Z0-9_]+/g, "_")
    .replace(/^([0-9])/, "_$1");
  if (!/^[a-zA-Z_]/.test(s)) s = `c_${s}`;
  let name = s.slice(0, 48) || "col";
  let n = name;
  let i = 1;
  while (used.has(n)) {
    n = `${name}_${i}`;
    i += 1;
  }
  used.add(n);
  return n;
}

function baseTableNameFromFile(filename) {
  const base = filename.replace(/\.[^.]+$/, "");
  let s = base.replace(/[^a-zA-Z0-9_]+/g, "_").replace(/^([0-9])/, "t_$1");
  if (!/^[a-zA-Z_]/.test(s) || s.length === 0) s = "imported";
  return `csv_${s}`.slice(0, 48);
}

function getTableList(db) {
  const r = db.exec(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
  );
  if (!r.length) return [];
  return r[0].values.map((row) => String(row[0]));
}

/** @param {string} name from our allowlist only */
function quoteTableIdent(name) {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    throw new Error("Invalid table name.");
  }
  return `"${name.replace(/"/g, '""')}"`;
}

/** Full URL to public/sql-wasm.wasm (supports Next.js basePath). */
function getSqlWasmUrl() {
  if (typeof window === "undefined") {
    return "/sql-wasm.wasm";
  }
  const basePath =
    (typeof window.__NEXT_DATA__ === "object" && window.__NEXT_DATA__?.config?.basePath) || "";
  const path = `${basePath}/sql-wasm.wasm`.replace(/\/\/+/g, "/");
  return new URL(path, window.location.origin).toString();
}

/**
 * Load sql.js so Emscripten's Oa() path is satisfied: it must see the same
 * `locateFile` return value as the fetch path, AND wasmBinary set, or it throws
 * "both async and sync fetching of the wasm failed" (see sql.js dist sql-wasm.js Oa).
 */
async function initSqlWithWasm() {
  const initSqlJs = (await import("sql.js")).default;
  const wasmUrl = getSqlWasmUrl();
  const res = await fetch(wasmUrl, { credentials: "same-origin" });
  if (!res.ok) {
    throw new Error(
      `Could not load sql-wasm.wasm at ${wasmUrl} (${res.status}). Copy node_modules/sql.js/dist/sql-wasm.wasm to public/ or run npm install.`
    );
  }
  const wasmArrayBuffer = await res.arrayBuffer();
  const wasmBinary = new Uint8Array(wasmArrayBuffer);
  return initSqlJs({
    wasmBinary,
    // Must match the fetch URL so Emscripten’s Oa() can use wasmBinary (see sql.js dist, function Oa).
    locateFile: (file) => {
      if (file && file.endsWith(".wasm")) return wasmUrl;
      const basePath = window.__NEXT_DATA__?.config?.basePath || "";
      return new URL(`${basePath}/${file}`.replace(/\/\/+/g, "/"), window.location.origin).toString();
    },
  });
}

export default function SqlSandboxClient() {
  const sqlRef = useRef(null);
  const dbRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [queryText, setQueryText] = useState(DEFAULT_QUERY);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [queryError, setQueryError] = useState(null);
  const [okMessage, setOkMessage] = useState(null);
  const [tables, setTables] = useState([]);

  const [sampleUserCount, setSampleUserCount] = useState(DEFAULT_SAMPLE_USERS);
  const [sampleRandomness, setSampleRandomness] = useState(DEFAULT_RANDOMNESS);
  const [dataSeed, setDataSeed] = useState(42);

  const [exploreTable, setExploreTable] = useState("users");
  const [exploreColumns, setExploreColumns] = useState([]);
  const [exploreRows, setExploreRows] = useState([]);
  const [exploreView, setExploreView] = useState("table");

  const refreshTables = useCallback(() => {
    const db = dbRef.current;
    if (!db) return;
    setTables(getTableList(db));
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!tables.length) {
      setExploreColumns([]);
      setExploreRows([]);
      return;
    }
    if (!tables.includes(exploreTable)) {
      setExploreTable(tables.includes("users") ? "users" : tables[0]);
    }
  }, [ready, tables, exploreTable]);

  useEffect(() => {
    if (!ready) return;
    const db = dbRef.current;
    if (!db || !exploreTable) return;
    if (!tables.includes(exploreTable)) return;
    try {
      const id = quoteTableIdent(exploreTable);
      const r = db.exec(`SELECT * FROM ${id}`);
      if (r[0] && r[0].columns) {
        setExploreColumns(r[0].columns.map(String));
        setExploreRows(
          (r[0].values || []).map((row) => row.map((c) => (c === null ? null : c)))
        );
      } else {
        setExploreColumns([]);
        setExploreRows([]);
      }
    } catch {
      setExploreColumns([]);
      setExploreRows([]);
    }
  }, [ready, exploreTable, tables]);

  const exploreRawTsv = useMemo(() => {
    if (!exploreColumns.length) return "";
    const head = exploreColumns.join("\t");
    const body = exploreRows
      .map((row) =>
        row.map((c) => (c === null || c === undefined ? "" : String(c))).join("\t")
      )
      .join("\n");
    return `${head}\n${body}`;
  }, [exploreColumns, exploreRows]);

  const exploreRawJson = useMemo(() => {
    if (!exploreColumns.length) return "[]";
    const rows = exploreRows.map((row) => {
      const o = {};
      exploreColumns.forEach((col, i) => {
        o[col] = row[i];
      });
      return o;
    });
    return JSON.stringify(rows, null, 2);
  }, [exploreColumns, exploreRows]);

  const runQuery = useCallback(() => {
    setOkMessage(null);
    setQueryError(null);
    const db = dbRef.current;
    if (!db) return;
    const text = queryText.trim();
    if (!text) {
      setQueryError("Enter a SQL query.");
      setColumns([]);
      setRows([]);
      return;
    }
    try {
      const results = db.exec(text);
      refreshTables();
      const lastWithRows = [...results].reverse().find(
        (r) => r.columns && r.columns.length
      );
      if (lastWithRows) {
        setColumns(lastWithRows.columns.map(String));
        setRows((lastWithRows.values || []).map((row) => row.map((c) => (c === null ? null : c))));
        setOkMessage(null);
      } else {
        setColumns([]);
        setRows([]);
        setOkMessage("Query executed successfully.");
      }
    } catch (e) {
      setQueryError(e?.message || "The query could not be executed.");
      setColumns([]);
      setRows([]);
    }
  }, [queryText, refreshTables]);

  const applyRegeneratedData = useCallback(
    (nextUsers, nextRand, nextSeed, successMessage) => {
      const SQL = sqlRef.current;
      if (!SQL) return;
      try {
        if (dbRef.current) {
          try {
            dbRef.current.close();
          } catch {
            /* ignore */
          }
        }
        const db = new SQL.Database();
        db.exec(buildSeedSql(nextUsers, nextRand, nextSeed));
        dbRef.current = db;
        setTables(getTableList(db));
        setQueryError(null);
        setOkMessage(
          successMessage || "Sample data rebuilt. Re-ran your current query in the result panel."
        );
        const results = db.exec(queryText.trim() || DEFAULT_QUERY);
        const lastWithRows = [...results].reverse().find(
          (r) => r.columns && r.columns.length
        );
        if (lastWithRows) {
          setColumns(lastWithRows.columns.map(String));
          setRows((lastWithRows.values || []).map((row) => row.map((c) => (c === null ? null : c))));
        } else {
          setColumns([]);
          setRows([]);
        }
      } catch (e) {
        setQueryError(e?.message || "Could not rebuild sample data.");
      }
    },
    [queryText]
  );

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const SQL = await initSqlWithWasm();
        if (cancelled) return;
        sqlRef.current = SQL;
        const db = new SQL.Database();
        db.exec(buildSeedSql(DEFAULT_SAMPLE_USERS, DEFAULT_RANDOMNESS, 42));
        dbRef.current = db;
        setLoadError(null);
        setTables(getTableList(db));
        const firstResults = db.exec(DEFAULT_QUERY.trim());
        const lastWithRows = [...firstResults]
          .reverse()
          .find((r) => r.columns && r.columns.length);
        if (lastWithRows) {
          setColumns(lastWithRows.columns.map(String));
          setRows(
            (lastWithRows.values || []).map((row) => row.map((c) => (c === null ? null : c)))
          );
        }
        setReady(true);
      } catch (e) {
        if (!cancelled) {
          setLoadError(e?.message || "Failed to start SQLite in the browser.");
        }
      }
    }

    init();
    return () => {
      cancelled = true;
      sqlRef.current = null;
      if (dbRef.current) {
        try {
          dbRef.current.close();
        } catch {
          /* ignore */
        }
        dbRef.current = null;
      }
    };
  }, []);

  const onCsv = useCallback(
    (ev) => {
      const f = ev.target?.files?.[0];
      ev.target.value = "";
      if (!f) return;
      setQueryError(null);
      setOkMessage(null);
      const db = dbRef.current;
      if (!db) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const text = String(reader.result || "");
          const { headers, data } = parseCsvText(text);
          if (!headers.length) throw new Error("No columns found in CSV.");
          const used = new Set();
          const colNames = headers.map((h) => sanitizeColumnName(h, used));
          let tname = baseTableNameFromFile(f.name);
          const existing = new Set(getTableList(db));
          if (existing.has(tname)) {
            let n = 2;
            while (existing.has(`${tname}_${n}`)) n += 1;
            tname = `${tname}_${n}`;
          }
          const colSql = colNames.map((c) => `"${c.replace(/"/g, '""')}" TEXT`).join(", ");
          db.run(`CREATE TABLE "${tname.replace(/"/g, '""')}" (${colSql})`);
          const placeholders = colNames.map(() => "?").join(", ");
          const ins = db.prepare(
            `INSERT INTO "${tname.replace(/"/g, '""')}" (${colNames
              .map((c) => `"${c.replace(/"/g, '""')}"`)
              .join(", ")}) VALUES (${placeholders})`
          );
          for (const row of data) {
            const padded = colNames.map((_, i) =>
              row[i] !== undefined && row[i] !== null ? String(row[i]) : null
            );
            ins.run(padded);
          }
          ins.free();
          refreshTables();
          setExploreTable(tname);
          setExploreView("table");
          setQueryText(`SELECT * FROM "${tname.replace(/"/g, '""')}" LIMIT 100;`);
          setOkMessage(`Table "${tname}" created with ${data.length} row(s). Run the query to view it.`);
          setColumns([]);
          setRows([]);
        } catch (e) {
          setQueryError(e?.message || "Could not import this CSV file.");
        }
      };
      reader.onerror = () => setQueryError("Could not read the file.");
      reader.readAsText(f);
    },
    [refreshTables]
  );

  if (loadError) {
    return (
      <p className="text-sm text-red-400" role="alert">
        {loadError}
      </p>
    );
  }

  if (!ready) {
    return <p className="text-sm text-[#c4cad3]">Loading SQLite in your browser…</p>;
  }

  function onRebuildSample() {
    const n = Math.min(
      SAMPLE_MAX_USERS,
      Math.max(SAMPLE_MIN_USERS, Number.parseInt(String(sampleUserCount), 10) || DEFAULT_SAMPLE_USERS)
    );
    setSampleUserCount(n);
    const r = Math.min(100, Math.max(0, Number.parseInt(String(sampleRandomness), 10) || 0));
    setSampleRandomness(r);
    let seed = Number.parseInt(String(dataSeed), 10);
    if (!Number.isFinite(seed)) seed = 42;
    seed = (seed >>> 0) % 0x7fffffff;
    setDataSeed(seed);
    applyRegeneratedData(n, r, seed);
  }

  return (
    <div className="box-border flex w-full min-w-0 max-w-full min-h-0 flex-1 flex-col gap-4 text-[#c4cad3]">
      <div className="w-full min-w-0 overflow-hidden rounded-[10px] border border-[#4a4a4a] bg-[#2f2f2f]">
        <div className="flex flex-col gap-2 border-b border-[#4a4a4a] px-3 py-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-[#97c459]">Browse data</div>
            <p className="text-[11px] text-white/45">
              Full table snapshot — use it to see every row. Pick a table below. Switch to Raw to copy TSV or JSON.
            </p>
          </div>
          <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
            <label className="sr-only" htmlFor="explore-table-pick">
              Table
            </label>
            {tables.length > 0 ? (
              <select
                id="explore-table-pick"
                value={tables.includes(exploreTable) ? exploreTable : tables[0]}
                onChange={(e) => {
                  setExploreTable(e.target.value);
                  setExploreView("table");
                }}
                className="min-w-[8rem] rounded border border-[#4a4a4a] bg-[#2a2a2a] px-2.5 py-1.5 text-sm text-[#e8eaed] focus:border-[#639922] focus:outline-none focus:ring-1 focus:ring-[#639922]"
              >
                {tables.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-xs text-white/40">No tables</span>
            )}
            <div className="flex gap-0.5 rounded border border-[#4a4a4a] bg-[#1e1e1e] p-0.5">
              {["table", "tsv", "json"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setExploreView(m)}
                  className={`rounded px-2.5 py-1 text-xs font-medium capitalize ${
                    exploreView === m
                      ? "bg-[#639922]/30 text-[#97c459]"
                      : "text-white/50 hover:text-white/90"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="border-b border-[#4a4a4a] px-3 py-1 text-[11px] text-white/40">
          {exploreTable}
          {exploreColumns.length > 0
            ? ` — ${exploreRows.length} row(s), ${exploreColumns.length} column(s)`
            : " — no rows"}
        </div>
        {exploreView === "table" && (
          <div className="h-64 min-h-[10rem] max-h-[50vh] w-full min-w-0 overflow-x-auto overflow-y-auto p-3">
            {exploreColumns.length > 0 ? (
              <div className="w-full min-w-0 max-w-full">
                <table className="w-max min-w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#4a4a4a] text-[#97c459]">
                      {exploreColumns.map((c) => (
                        <th key={c} className="sticky top-0 z-[1] bg-[#1f1f1f] px-2.5 py-1.5 font-semibold">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {exploreRows.length === 0 ? (
                      <tr>
                        <td colSpan={exploreColumns.length} className="px-2.5 py-2 text-white/50">
                          Empty
                        </td>
                      </tr>
                    ) : (
                      exploreRows.map((row, i) => (
                        <tr
                          key={i}
                          className="border-b border-[#4a4a4a]/50 odd:bg-[#2a2a2a] even:bg-[#252525]"
                        >
                          {row.map((cell, j) => (
                            <td key={j} className="max-w-[28rem] break-words px-2.5 py-1 font-mono text-[12px] text-[#e0e0e0]">
                              {cell === null || cell === undefined ? (
                                <span className="text-white/30">NULL</span>
                              ) : (
                                String(cell)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-white/45">No data.</p>
            )}
          </div>
        )}
        {exploreView === "tsv" && (
          <div className="h-64 min-h-[10rem] max-h-[50vh] w-full min-w-0 overflow-auto p-3">
            <pre className="whitespace-pre text-xs text-[#d0d0d0]">
              {exploreRawTsv || "(empty)"}
            </pre>
          </div>
        )}
        {exploreView === "json" && (
          <div className="h-64 min-h-[10rem] max-h-[50vh] w-full min-w-0 overflow-auto p-3">
            <pre className="whitespace-pre-wrap break-all font-mono text-[11px] text-[#d0d0d0]">
              {exploreRawJson}
            </pre>
          </div>
        )}
      </div>

      <div className="w-full min-w-0 rounded-[10px] border border-[#4a4a4a] bg-[#2f2f2f] px-3 py-3">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#97c459]">Sample data</div>
        <p className="mb-3 text-xs leading-relaxed text-white/50">
          Sets how many <span className="text-white/70">users</span> are generated; orders scale (~1.35×). 
          <span className="text-white/70"> Randomness</span> mixes names and amounts (0 = more predictable, 100 = more varied). 
          <span className="text-white/70"> Seed</span> — same number + same settings = same data.
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-white/40" htmlFor="sample-users">
              User rows ({SAMPLE_MIN_USERS}–{SAMPLE_MAX_USERS})
            </label>
            <input
              id="sample-users"
              type="number"
              min={SAMPLE_MIN_USERS}
              max={SAMPLE_MAX_USERS}
              value={sampleUserCount}
              onChange={(e) => {
                const v = e.target.valueAsNumber;
                setSampleUserCount(Number.isFinite(v) ? v : DEFAULT_SAMPLE_USERS);
              }}
              className="w-24 rounded border border-[#4a4a4a] bg-[#2a2a2a] px-2 py-1.5 font-mono text-sm text-[#e8eaed] focus:border-[#639922] focus:outline-none focus:ring-1 focus:ring-[#639922]"
            />
          </div>
          <div className="min-w-0 flex-1 sm:max-w-xs">
            <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-white/40" htmlFor="sample-rand">
              Randomness: {sampleRandomness}%
            </label>
            <input
              id="sample-rand"
              type="range"
              min={0}
              max={100}
              value={sampleRandomness}
              onChange={(e) => setSampleRandomness(Number(e.target.value))}
              className="w-full accent-[#97c459]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-white/40" htmlFor="sample-seed">
              Data seed
            </label>
            <input
              id="sample-seed"
              type="number"
              value={dataSeed}
              onChange={(e) => {
                const v = Number.parseInt(e.target.value, 10);
                setDataSeed(Number.isFinite(v) ? v : 0);
              }}
              className="w-32 rounded border border-[#4a4a4a] bg-[#2a2a2a] px-2 py-1.5 font-mono text-sm text-[#e8eaed] focus:border-[#639922] focus:outline-none focus:ring-1 focus:ring-[#639922]"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onRebuildSample}
              className="rounded-lg border border-[#639922] bg-[#639922]/20 px-3 py-2 text-xs font-semibold text-[#97c459] transition hover:bg-[#639922]/30"
            >
              Rebuild sample
            </button>
            <button
              type="button"
              onClick={() => {
                const s = (Math.random() * 0x7fffffff) >>> 0;
                setDataSeed(s);
                const n = Math.min(
                  SAMPLE_MAX_USERS,
                  Math.max(
                    SAMPLE_MIN_USERS,
                    Number.parseInt(String(sampleUserCount), 10) || DEFAULT_SAMPLE_USERS
                  )
                );
                const r = Math.min(100, Math.max(0, Number(sampleRandomness) || 0));
                applyRegeneratedData(
                  n,
                  r,
                  s,
                  "New random seed. Sample data rebuilt; your query was re-run above."
                );
              }}
              className="rounded-lg border border-[#4a4a4a] bg-[#383838] px-3 py-2 text-xs text-[#c4cad3] transition hover:border-[#639922] hover:text-white"
            >
              New seed + rebuild
            </button>
          </div>
        </div>
      </div>

      <div className="grid min-h-0 w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-[1fr,200px]">
        <div className="flex min-h-0 min-w-0 max-w-full flex-col">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40" htmlFor="sql-input">
            SQL
          </label>
          <textarea
            id="sql-input"
            className="min-h-[200px] w-full max-w-full min-w-0 flex-1 resize-y rounded-lg border border-[#4a4a4a] bg-[#2a2a2a] p-3 font-mono text-[13px] text-[#e8eaed] shadow-inner outline-none ring-[#97c459] focus:border-[#639922] focus:ring-1"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div className="flex min-h-0 min-w-0 max-w-full flex-col gap-3 sm:max-w-[220px] sm:shrink-0">
          <div>
            <div className="mb-1.5 text-xs font-medium uppercase tracking-wide text-white/40">Actions</div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={runQuery}
                className="rounded-lg border border-[#639922] bg-[#639922]/25 px-4 py-2.5 text-sm font-semibold text-[#97c459] transition hover:bg-[#639922]/35"
              >
                Run
              </button>
              <label className="flex cursor-pointer items-center justify-center rounded-lg border border-[#4a4a4a] bg-[#2f3236] px-3 py-2.5 text-center text-sm font-medium text-[#c4cad3] transition hover:border-[#639922] hover:text-white">
                Upload CSV
                <input type="file" accept=".csv,text/csv" className="sr-only" onChange={onCsv} />
              </label>
            </div>
          </div>
          <div>
            <div className="mb-1.5 text-xs font-medium uppercase tracking-wide text-white/40">Quick queries</div>
            <div className="flex flex-col gap-1.5">
              {QUICK.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setQueryText(item.sql);
                    setQueryError(null);
                    setOkMessage(null);
                  }}
                  className="text-left text-xs text-[#97c459] underline decoration-[#97c459]/50 underline-offset-2 hover:text-[#b8e078]"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-72 min-h-[200px] max-h-[50vh] w-full min-w-0 max-w-full flex-col overflow-hidden rounded-[10px] border border-[#4a4a4a] bg-[#383838]">
        <div className="shrink-0 border-b border-[#4a4a4a] px-3 py-1.5 text-xs font-medium text-[#97c459]">
          Result
        </div>
        {queryError && (
          <div
            className="shrink-0 border-b border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
            role="alert"
          >
            {queryError}
          </div>
        )}
        {okMessage && !queryError && (
          <div
            className="shrink-0 border-b border-[#639922]/40 bg-[#639922]/10 px-3 py-2 text-sm text-[#97c459]"
            role="status"
          >
            {okMessage}
          </div>
        )}
        <div className="min-h-0 w-full min-w-0 flex-1 overflow-x-auto overflow-y-auto p-3">
          {columns.length > 0 ? (
            <div className="w-full min-w-0 max-w-full">
              <table className="w-max min-w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-[#4a4a4a] text-[#97c459]">
                    {columns.map((c) => (
                      <th key={c} className="sticky top-0 z-[1] bg-[#2f2f2f] px-2.5 py-2 font-semibold">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="px-2.5 py-3 text-white/50">
                        No rows returned
                      </td>
                    </tr>
                  ) : (
                    rows.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-[#4a4a4a]/60 odd:bg-[#3a3a3a] even:bg-[#383838]"
                      >
                        {row.map((cell, j) => (
                          <td key={j} className="px-2.5 py-1.5 font-mono text-[#e8eaed]">
                            {cell === null || cell === undefined ? (
                              <span className="text-white/30">NULL</span>
                            ) : (
                              String(cell)
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-white/45">
              Run a query to see result rows here (scrolls when there are many rows).
            </p>
          )}
        </div>
      </div>

      <div className="w-full min-w-0 max-w-full rounded-lg border border-[#4a4a4a] bg-[#2f2f2f] px-3 py-2.5 text-xs text-[#c4cad3]">
        <div className="mb-1 font-semibold text-[#97c459]">Tables in this database</div>
        {tables.length === 0 ? (
          <p className="text-white/45">No user tables</p>
        ) : (
          <ul className="list-inside list-disc space-y-0.5 text-white/80">
            {tables.map((t) => (
              <li key={t} className="font-mono">
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
