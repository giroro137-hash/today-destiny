require("dotenv").config();
const express = require("express"), helmet = require("helmet"), rateLimit = require("express-rate-limit");
const Database = require("better-sqlite3"), crypto = require("crypto"), path = require("path");
const { makeReading } = require("./reading");
const { createOrders, validYMD } = require("./orders");
const characters = require("./characters");

const app = express();
const db = new Database(path.join(__dirname, "..", "destiny.db"));
db.exec(`CREATE TABLE IF NOT EXISTS free_claims(visitor TEXT PRIMARY KEY, created_at TEXT DEFAULT CURRENT_TIMESTAMP);`);
const orders = createOrders({ db });

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/api", rateLimit({ windowMs: 60000, limit: 30 }));

const secret = process.env.APP_SECRET || "dev-secret-change-me";
const visitor = req => crypto.createHmac("sha256", secret)
  .update((req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString().split(",")[0])
  .digest("hex");
const send = (res, r) => res.status(r.status).json(r.json);
const safe = fn => async (req, res) => { try { await fn(req, res); } catch (e) { console.error(e); res.status(500).json({ error: "일시적인 오류가 발생했습니다." }); } };

app.get("/api/products", (req, res) => res.json(orders.products));

app.post("/api/free-reading", (req, res) => {
  const { birthDate, calendar, birthTime, consent } = req.body || {};
  if (consent !== true) return res.status(400).json({ error: "개인정보 수집·이용 및 만 14세 이상 확인에 동의해 주세요." });
  if (!["solar", "lunar"].includes(calendar) || !validYMD(birthDate, calendar) || typeof birthTime !== "string")
    return res.status(400).json({ error: "입력값을 확인해 주세요." });
  if (new Date(birthDate) > new Date()) return res.status(400).json({ error: "미래 날짜는 입력할 수 없습니다." });
  try {
    db.prepare("INSERT INTO free_claims(visitor) VALUES(?)").run(visitor(req));
  } catch (e) {
    if (String(e.code).includes("CONSTRAINT"))
      return res.status(409).json({ error: "무료 체험을 이미 사용하셨습니다. 아래에서 프리미엄 리포트를 선택해 주세요." });
    throw e;
  }
  let teaser = null;
  try { teaser = characters.teaser({ birthDate, calendar, birthTime }); } catch (_) {}
  res.json({ reading: makeReading({ birthDate, calendar, birthTime }), teaser, demo: true,
    disclaimer: "현재는 흐름 확인용 예시 풀이이며 정통 사주(만세력) 계산 결과가 아닙니다." });
});

app.post("/api/orders", safe((req, res) => send(res, orders.createOrder(req.body, visitor(req)))));
app.post("/api/orders/:id/complete", safe(async (req, res) => send(res, await orders.completeOrder(req.params.id))));
app.post("/api/orders/:id/report", safe((req, res) => send(res, orders.getReport(req.params.id, req.body))));
app.get("/api/orders/:id/character/:file", safe((req, res) => {
  const r = orders.getCharacter(req.params.id, req.params.file);
  if (r.file) { res.set("Cache-Control", "private, max-age=3600"); return res.sendFile(r.file); }
  send(res, r);
}));
app.post("/api/dev/report", safe((req, res) => send(res, orders.devReport(req.body))));

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.listen(process.env.PORT || 3000, () => console.log("http://localhost:" + (process.env.PORT || 3000)));
