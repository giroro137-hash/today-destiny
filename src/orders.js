// 주문·결제 검증·리포트 열람 로직 (express와 분리되어 단독 테스트 가능)
const crypto = require("crypto");
const { build } = require("./premium");
const { HOURS } = require("./saju");
const chars = require("./characters");
const path = require("path"), fs = require("fs");
const PRIVATE_DIR = path.join(__dirname, "..", "private", "characters");

const products = {
  daily:    { name: "오늘의 프리미엄 운세", amount: 2900 },
  monthly:  { name: "월간 운세",           amount: 9900 },
  lifetime: { name: "평생 사주 리포트",     amount: 19900 },
  compat:   { name: "궁합 분석",           amount: 22900 },
  marriage: { name: "결혼운 · 배우자 인연 리포트", amount: 12900 },
  career:   { name: "직업 · 이직 · 사업운 리포트", amount: 9900 },
  love:     { name: "연애 집중 리포트", amount: 7900 },
  wealth:   { name: "재물 · 사업 전략 리포트", amount: 9900 },
  future_1:  { name: "1년 뒤 나의 미래 연대기", amount: 3900 },
  future_2:  { name: "2년 뒤 나의 미래 연대기", amount: 4900 },
  future_3:  { name: "3년 뒤 나의 미래 연대기", amount: 5900 },
  future_5:  { name: "5년 뒤 나의 미래 연대기", amount: 7900 },
  future_10: { name: "10년 뒤 나의 미래 연대기", amount: 9900 },
  future_15: { name: "15년 뒤 나의 미래 연대기", amount: 12900 },
  future_20: { name: "20년 뒤 나의 미래 연대기", amount: 14900 },
  future_all:{ name: "20년 미래 연대기 전체 패키지", amount: 29900 }
};
const MAX_VIEWS = 10; // 주문 1건당 리포트 조회 상한(링크 공유 남용 방지)
const kstToday = () => new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
const R = (status, json) => ({ status, json });

function migrate(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS orders(id TEXT PRIMARY KEY, visitor TEXT, product TEXT, amount INTEGER, status TEXT DEFAULT 'pending', created_at TEXT DEFAULT CURRENT_TIMESTAMP);`);
  const cols = db.prepare("PRAGMA table_info(orders)").all().map(c => c.name);
  for (const [n, t] of [["paid_at", "TEXT"], ["report_date", "TEXT"], ["report_views", "INTEGER DEFAULT 0"], ["char_keys", "TEXT"]])
    if (!cols.includes(n)) db.exec(`ALTER TABLE orders ADD COLUMN ${n} ${t}`);
}

// 실제로 존재하는 날짜인지 엄격히 검증 (JS Date는 1995-02-30을 3월 2일로 바꿔 받아들임)
function validYMD(str, calendar) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str || ""); if (!m) return false;
  const [y, mo, d] = [+m[1], +m[2], +m[3]];
  if (calendar === "lunar") return mo >= 1 && mo <= 12 && d >= 1 && d <= 30;
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d;
}
function parsePerson(b) {
  if (!b || !["solar", "lunar"].includes(b.calendar) || !validYMD(b.birthDate, b.calendar)) return null;
  if (b.birthTime !== "unknown" && !HOURS.includes(b.birthTime)) return null;
  if (b.birthDate > kstToday() || b.birthDate < "1900-01-01") return null;
  return { birthDate: b.birthDate, calendar: b.calendar, birthTime: b.birthTime };
}

function createOrders({ db, env = process.env, fetchFn = fetch }) {
  migrate(db);

  async function portoneVerify(paymentId, expectedAmount) {
    let res;
    try {
      res = await fetchFn(`https://api.portone.io/payments/${encodeURIComponent(paymentId)}`, { headers: { Authorization: `PortOne ${env.PORTONE_API_SECRET}` } });
    } catch (e) { return { ok: false, code: 502, msg: "결제사 확인에 실패했습니다. 잠시 후 다시 시도해 주세요." }; }
    if (!res.ok) return { ok: false, code: 402, msg: "결제 내역을 확인할 수 없습니다." };
    const pay = await res.json();
    if (pay.status !== "PAID") return { ok: false, code: 402, msg: "결제가 완료되지 않았습니다." };
    if (pay.amount?.total !== expectedAmount) return { ok: false, code: 402, msg: "결제 금액이 일치하지 않습니다. 결제 취소·환불을 위해 문의해 주세요." };
    return { ok: true };
  }

  return {
    products,

    createOrder(body, visitor) {
      const p = products[body?.productId];
      if (!p) return R(400, { error: "상품을 찾을 수 없습니다." });
      if (body?.agreed !== true) return R(400, { error: "구매 조건(청약철회 안내)에 동의해 주세요." });
      if (env.PAYMENTS_ENABLED !== "true") return R(501, { error: "결제 기능은 현재 오픈 준비 중입니다. 오픈 후 이용해 주세요." });
      if (!env.PORTONE_STORE_ID || !env.PORTONE_CHANNEL_KEY || !env.PORTONE_API_SECRET) {
        console.error("PortOne 환경변수가 설정되지 않았습니다.");
        return R(503, { error: "결제 설정이 완료되지 않았습니다. 잠시 후 이용해 주세요." });
      }
      const id = "ord_" + crypto.randomBytes(12).toString("hex");
      db.prepare("INSERT INTO orders(id,visitor,product,amount) VALUES(?,?,?,?)").run(id, visitor, body.productId, p.amount);
      return R(200, { orderId: id, orderName: p.name, amount: p.amount, storeId: env.PORTONE_STORE_ID, channelKey: env.PORTONE_CHANNEL_KEY });
    },

    async completeOrder(orderId) {
      const o = db.prepare("SELECT * FROM orders WHERE id=?").get(String(orderId));
      if (!o) return R(404, { error: "주문을 찾을 수 없습니다." });
      if (o.status === "paid") return R(200, { ok: true, product: o.product });
      const v = await portoneVerify(o.id, o.amount);
      if (!v.ok) return R(v.code, { error: v.msg });
      db.prepare("UPDATE orders SET status='paid', paid_at=CURRENT_TIMESTAMP, report_date=? WHERE id=? AND status='pending'").run(kstToday(), o.id);
      return R(200, { ok: true, product: o.product });
    },

    getReport(orderId, body) {
      const o = db.prepare("SELECT * FROM orders WHERE id=?").get(String(orderId));
      if (!o) return R(404, { error: "주문을 찾을 수 없습니다." });
      if (o.status !== "paid") return R(402, { error: "결제가 확인된 주문만 열람할 수 있습니다." });
      if ((o.report_views || 0) >= MAX_VIEWS) return R(429, { error: "조회 가능 횟수를 초과했습니다. 문의해 주세요." });
      const person = parsePerson(body);
      if (!person) return R(400, { error: "생년월일 입력값을 확인해 주세요." });
      let partner = null;
      if (o.product === "compat") { partner = parsePerson(body?.partner); if (!partner) return R(400, { error: "상대방 생년월일을 확인해 주세요." }); }
      try {
        const report = build(o.product, person, { today: o.report_date, partner });
        let characters = null;
        if (o.product !== "compat") { characters = chars.reveal(person, o.id, body?.preferredGender === "m" ? "m" : "f"); db.prepare("UPDATE orders SET char_keys=? WHERE id=?").run(characters.keys.join(","), o.id); }
        db.prepare("UPDATE orders SET report_views=report_views+1 WHERE id=?").run(o.id);
        return R(200, { report, characters });
      } catch (e) { return R(400, { error: e.message || "리포트를 만들 수 없습니다." }); }
    },

    // 결제 확인된 주문에 배정된 인연 캐릭터 원본만 내려줍니다(다른 캐릭터·미결제는 불가).
    getCharacter(orderId, file) {
      const key = String(file || "").replace(/\.png$/, "");
      if (!chars.KEY_RE.test(key)) return R(404, { error: "not found" });
      const o = db.prepare("SELECT status, char_keys FROM orders WHERE id=?").get(String(orderId));
      if (!o) return R(404, { error: "not found" });
      if (o.status !== "paid") return R(402, { error: "결제가 확인된 주문만 볼 수 있습니다." });
      if (!(o.char_keys || "").split(",").includes(key)) return R(403, { error: "열람 권한이 없습니다." });
      const f = path.join(PRIVATE_DIR, key + ".png");
      if (!fs.existsSync(f)) return R(404, { error: "not found" });
      return { status: 200, file: f };
    },

    // QA 전용: 결제 없이 리포트 품질을 확인합니다. 운영 서버에서는 반드시 꺼 두세요.
    devReport(body) {
      if (env.DEV_REPORT_PREVIEW !== "true") return R(404, { error: "not found" });
      if (!products[body?.productId]) return R(400, { error: "상품을 찾을 수 없습니다." });
      const person = parsePerson(body), partner = parsePerson(body?.partner);
      if (!person || (body.productId === "compat" && !partner)) return R(400, { error: "생년월일 입력값을 확인해 주세요." });
      try { return R(200, { report: build(body.productId, person, { today: kstToday(), partner }), dev: true }); }
      catch (e) { return R(400, { error: e.message }); }
    }
  };
}
module.exports = { createOrders, products, kstToday, validYMD };
