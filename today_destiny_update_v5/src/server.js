require("dotenv").config();
const express = require("express"), helmet = require("helmet"), rateLimit = require("express-rate-limit");
const Database = require("better-sqlite3"), crypto = require("crypto"), path = require("path");
const { makeReading } = require("./reading");

const app = express();
const db = new Database(path.join(__dirname, "..", "destiny.db"));
db.exec(`
CREATE TABLE IF NOT EXISTS free_claims(visitor TEXT PRIMARY KEY, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS orders(id TEXT PRIMARY KEY, visitor TEXT, product TEXT, amount INTEGER, status TEXT DEFAULT 'pending', created_at TEXT DEFAULT CURRENT_TIMESTAMP);
`);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/api", rateLimit({ windowMs: 60000, limit: 30 }));

const secret = process.env.APP_SECRET || "dev-secret-change-me";
const visitor = req => crypto.createHmac("sha256", secret)
  .update((req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString().split(",")[0])
  .digest("hex");

// 가격은 서버가 기준입니다 (화면의 가격은 표시용)
const products = {
  daily:    { name: "오늘의 프리미엄 운세", amount: 2900 },
  monthly:  { name: "월간 운세",           amount: 9900 },
  lifetime: { name: "평생 사주 리포트",     amount: 19900 },
  compat:   { name: "궁합 분석",           amount: 22900 }
};

app.get("/api/products", (req, res) => res.json(products));

app.post("/api/free-reading", (req, res) => {
  const { birthDate, calendar, birthTime, consent } = req.body || {};
  if (consent !== true) return res.status(400).json({ error: "개인정보 수집·이용 및 만 14세 이상 확인에 동의해 주세요." });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate || "") || isNaN(new Date(birthDate)) ||
      !["solar", "lunar"].includes(calendar) || typeof birthTime !== "string")
    return res.status(400).json({ error: "입력값을 확인해 주세요." });
  if (new Date(birthDate) > new Date())
    return res.status(400).json({ error: "미래 날짜는 입력할 수 없습니다." });

  try {
    db.prepare("INSERT INTO free_claims(visitor) VALUES(?)").run(visitor(req));
  } catch (e) {
    if (String(e.code).includes("CONSTRAINT"))
      return res.status(409).json({ error: "무료 체험을 이미 사용하셨습니다. 아래에서 프리미엄 리포트를 선택해 주세요." });
    throw e;
  }
  res.json({
    reading: makeReading({ birthDate, calendar, birthTime }),
    demo: true,
    disclaimer: "현재는 흐름 확인용 예시 풀이이며 정통 사주(만세력) 계산 결과가 아닙니다."
  });
});

app.post("/api/orders", (req, res) => {
  const p = products[req.body?.productId];
  if (!p) return res.status(400).json({ error: "상품을 찾을 수 없습니다." });
  if (req.body?.agreed !== true) return res.status(400).json({ error: "구매 조건(청약철회 안내)에 동의해 주세요." });
  // 결제가 열리기 전에는 주문 기록을 남기지 않습니다(개인정보 최소 수집).
  if (process.env.PAYMENTS_ENABLED !== "true")
    return res.status(501).json({ error: "결제 기능은 현재 오픈 준비 중입니다. 오픈 후 이용해 주세요." });
  const id = "ord_" + crypto.randomBytes(12).toString("hex");
  db.prepare("INSERT INTO orders(id,visitor,product,amount) VALUES(?,?,?,?)").run(id, visitor(req), req.body.productId, p.amount);
  res.status(501).json({ error: "결제 연동이 완료되지 않았습니다.", orderId: id, amount: p.amount });
});

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.listen(process.env.PORT || 3000, () => console.log("http://localhost:" + (process.env.PORT || 3000)));
