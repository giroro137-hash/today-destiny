// 사주(만세력) 계산 엔진: 연·월·일·시 기둥, 오행, 십성, 합·충
// 일주: 율리우스일 기반(정확) / 월주·연주: 태양 황경으로 절기 계산(근사, 절입일 경계에서 오차 가능)
const STEMS = "갑을병정무기경신임계".split("");
const BRANCHES = "자축인묘진사오미신유술해".split("");
const ELEMS = ["목", "화", "토", "금", "수"];
const STEM_EL = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4];
const BRANCH_EL = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4];
const BRANCH_MAIN_STEM = [9, 5, 0, 1, 4, 2, 3, 5, 6, 7, 4, 8]; // 지지 본기
const TEN = [["비견", "겁재"], ["식신", "상관"], ["편재", "정재"], ["편관", "정관"], ["편인", "정인"]];
const ANIMALS = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];
const HAP6 = { 0: 1, 1: 0, 2: 11, 11: 2, 3: 10, 10: 3, 4: 9, 9: 4, 5: 8, 8: 5, 6: 7, 7: 6 };

const mod = (a, n) => ((a % n) + n) % n;
function jdn(y, m, d) {
  const a = Math.floor((14 - m) / 12), yy = y + 4800 - a, mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}
function sunLon(y, m, d, hourKST) {
  const n = jdn(y, m, d) - 0.5 + (hourKST - 9) / 24 - 2451545.0, r = Math.PI / 180;
  const L = mod(280.460 + 0.9856474 * n, 360), g = mod(357.528 + 0.9856003 * n, 360) * r;
  return mod(L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g), 360);
}
function dayPillar(y, m, d) { const i = mod(jdn(y, m, d) - 2415021 + 10, 60); return { s: i % 10, b: i % 12 }; }

// 음력 → 양력 (평달만 지원; Intl 중국력 사용)
const fmt = new Intl.DateTimeFormat("en-u-ca-chinese", { timeZone: "UTC", year: "numeric", month: "numeric", day: "numeric" });
function lunarToSolar(ly, lm, ld) {
  for (let t = Date.UTC(ly, 0, 15, 12); t < Date.UTC(ly + 1, 2, 15, 12); t += 864e5) {
    const p = Object.fromEntries(fmt.formatToParts(t).map(x => [x.type, x.value]));
    if (String(p.relatedYear) === String(ly) && p.month === String(lm) && Number(p.day) === ld) {
      const dt = new Date(t); return [dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate()];
    }
  }
  return null;
}

const HOURS = ["자시", "축시", "인시", "묘시", "진시", "사시", "오시", "미시", "신시", "유시", "술시", "해시"];
function pillars({ birthDate, calendar, birthTime }) {
  let [y, m, d] = birthDate.split("-").map(Number);
  if (calendar === "lunar") { const s = lunarToSolar(y, m, d); if (!s) throw new Error("음력 날짜를 확인해 주세요."); [y, m, d] = s; }
  const hb = HOURS.indexOf(birthTime);
  const lon = sunLon(y, m, d, hb >= 0 ? hb * 2 : 12);
  const yearAdj = (m <= 2 && lon < 315 && lon > 200) ? y - 1 : y;
  const ys = mod(yearAdj - 4, 10), yb = mod(yearAdj - 4, 12);
  const mi = Math.floor(mod(lon - 315, 360) / 30);
  const ms = (({ 0: 2, 5: 2, 1: 4, 6: 4, 2: 6, 7: 6, 3: 8, 8: 8, 4: 0, 9: 0 })[ys] + mi) % 10, mb = (2 + mi) % 12;
  const day = dayPillar(y, m, d);
  const out = { solar: [y, m, d], year: { s: ys, b: yb }, month: { s: ms, b: mb }, day, hour: null };
  if (hb >= 0) out.hour = { s: (({ 0: 0, 5: 0, 1: 2, 6: 2, 2: 4, 7: 4, 3: 6, 8: 6, 4: 8, 9: 8 })[day.s] + hb) % 10, b: hb };
  return out;
}
const label = p => STEMS[p.s] + BRANCHES[p.b];

// d: 일간(0-9), t: 대상 천간 → 십성 이름
function tenGod(d, t) {
  const rel = mod(STEM_EL[t] - STEM_EL[d], 5), same = (d % 2) === (t % 2);
  return TEN[rel][same ? 0 : 1];
}
function elementCount(p) {
  const c = [0, 0, 0, 0, 0];
  for (const k of ["year", "month", "day", "hour"]) if (p[k]) { c[STEM_EL[p[k].s]]++; c[BRANCH_EL[p[k].b]]++; }
  return c;
}
function godGroups(p) { // 비겁/식상/재성/관성/인성 개수
  const g = [0, 0, 0, 0, 0], d = p.day.s;
  const add = t => { g[mod(STEM_EL[t] - STEM_EL[d], 5)]++; };
  for (const k of ["year", "month", "day", "hour"]) if (p[k]) {
    if (k !== "day") add(p[k].s);
    add(BRANCH_MAIN_STEM[p[k].b]);
  }
  return g;
}
const rel = {
  hap: (a, b) => HAP6[a] === b,
  chung: (a, b) => mod(a - b, 12) === 6,
  samhap: (a, b) => a !== b && a % 4 === b % 4,
  stemHap: (a, b) => mod(a - b, 10) === 5
};
const goodAnimals = b => [ANIMALS[HAP6[b]], ...[4, 8].map(k => ANIMALS[(b + k) % 12])];

module.exports = { BRANCH_MAIN_STEM, STEMS, BRANCHES, ELEMS, STEM_EL, BRANCH_EL, ANIMALS, HOURS, pillars, label, dayPillar, tenGod, elementCount, godGroups, rel, goodAnimals, lunarToSolar, jdn, mod };
