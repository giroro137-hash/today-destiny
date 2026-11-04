// 코드로 그리는 벡터 캐릭터(성인, 일상복 코트 스타일). 실제 일러스트로 교체 가능한 임시 이미지입니다.
const W = 400, H = 500;
const f1 = n => (+n).toFixed(1);
function sp(p, closed = true) { // Catmull-Rom → Bezier
  const n = p.length, g = i => closed ? p[(i + n) % n] : p[Math.max(0, Math.min(n - 1, i))];
  let d = `M${f1(p[0][0])},${f1(p[0][1])}`;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const a = g(i - 1), b = g(i), c = g(i + 1), e = g(i + 2);
    d += `C${f1(b[0] + (c[0] - a[0]) / 6)},${f1(b[1] + (c[1] - a[1]) / 6)} ${f1(c[0] - (e[0] - b[0]) / 6)},${f1(c[1] - (e[1] - b[1]) / 6)} ${f1(c[0])},${f1(c[1])}`;
  }
  return d + (closed ? "Z" : "");
}
const pl = p => "M" + p.map(q => f1(q[0]) + "," + f1(q[1])).join("L") + "Z";
const mir = p => p.map(([x, y]) => [400 - x, y]);

const SKIN = ["#f8dfcc", "#f3d3bb", "#efc9ad"];
const PAL = {
  f: {
    dodo: { bg: ["#e4eaf1", "#9fb0c4"], coat: ["#b98a5a", "#8d8f98", "#cdb89f"], inner: "#20232b", hair: ["#17151a", "#2a1e1b", "#3b3036"], lip: "#b86f78" },
    sexy: { bg: ["#7a2a43", "#2b1020"], coat: ["#1c1c22", "#3a2a2e", "#2a2430"], inner: "#e9d3b8", hair: ["#2a1717", "#1a1216", "#4a2a22"], lip: "#b3202f" },
    cute: { bg: ["#fff0f4", "#ffc4d6"], coat: ["#e8d5bd", "#f1e4d4", "#d9c2a6"], inner: "#f4a3b5", hair: ["#6a4330", "#4b3226", "#8a5a3c"], lip: "#e8837f" },
    pretty: { bg: ["#f1e8fb", "#f6cfe0"], coat: ["#b9aed1", "#efe7de", "#cbb7c2"], inner: "#fbf4ee", hair: ["#7a5238", "#5a3a2a", "#a07a5a"], lip: "#d97a8f" },
    charisma: { bg: ["#2c3d66", "#0d1426"], coat: ["#15161b", "#23252e", "#1b1d22"], inner: "#f2f2f4", hair: ["#121216", "#1d1517", "#2a2228"], lip: "#8f3a3f" }
  },
  m: {
    dodo: { bg: ["#e4eaf1", "#8fa1b6"], coat: ["#3a3f48", "#5a5f66", "#2c3038"], inner: "#16181d", hair: ["#15141a", "#241c1a", "#32282a"], lip: "#b27a76" },
    sexy: { bg: ["#7a2a43", "#2b1020"], coat: ["#1a1a20", "#2e2a2e", "#26222a"], inner: "#f3ece4", hair: ["#1f1614", "#2e1f1a", "#15131a"], lip: "#a8625e" },
    cute: { bg: ["#fff6d9", "#ffd9a0"], coat: ["#d9c2a0", "#e8d9c1", "#c8b08c"], inner: "#f6efe2", hair: ["#6a4a34", "#4b362a", "#8a6446"], lip: "#d98a80" },
    pretty: { bg: ["#e2f0fb", "#c7dcf5"], coat: ["#b89a74", "#2f3a52", "#8a9aa6"], inner: "#f7f7f9", hair: ["#3a2a22", "#241c1a", "#5a4030"], lip: "#c77b78" },
    charisma: { bg: ["#2c3d66", "#0d1426"], coat: ["#121318", "#20222a", "#191b20"], inner: "#e9e9ee", hair: ["#101015", "#1b1416", "#241d22"], lip: "#8a4a48" }
  }
};
const FEAT = { // 눈 스타일 / 눈썹 / 입
  f: { dodo: { eye: "sharp", brow: "thin", mouth: "smirk", blush: .1 }, sexy: { eye: "half", brow: "arch", mouth: "red", blush: .12 }, cute: { eye: "round", brow: "soft", mouth: "open", blush: .5 }, pretty: { eye: "gentle", brow: "soft", mouth: "smile", blush: .3 }, charisma: { eye: "sharp2", brow: "thick", mouth: "firm", blush: 0 } },
  m: { dodo: { eye: "sharp", brow: "thick", mouth: "smirk", blush: 0 }, sexy: { eye: "half", brow: "thick", mouth: "smirk", blush: 0 }, cute: { eye: "round", brow: "soft", mouth: "open", blush: .3 }, pretty: { eye: "gentle", brow: "soft", mouth: "smile", blush: .1 }, charisma: { eye: "sharp2", brow: "thick", mouth: "firm", blush: 0 } }
};
const EYE = {
  round: { rx: 11, ry: 12, tilt: 0, lid: 0, lash: 3, iris: 8.5 }, gentle: { rx: 11, ry: 10, tilt: 2, lid: .05, lash: 3, iris: 7.5 },
  sharp: { rx: 12, ry: 7.5, tilt: 7, lid: .12, lash: 4, iris: 6.5, wing: 1 }, sharp2: { rx: 12.5, ry: 7, tilt: 9, lid: .15, lash: 4.5, iris: 6.3, wing: 1 },
  half: { rx: 12, ry: 8, tilt: 4, lid: .38, lash: 4.5, iris: 7, wing: 1 }
};

function eye(cx, cy, flip, s, skin, irisC) {
  const id = "c" + Math.round(cx);
  return `<g transform="translate(${cx},${cy}) scale(${flip ? -1.22 : 1.22},1.22) rotate(${-s.tilt})"><clipPath id="${id}"><ellipse rx="${s.rx}" ry="${s.ry}"/></clipPath>
<ellipse rx="${s.rx}" ry="${s.ry}" fill="#fff"/><g clip-path="url(#${id})"><circle cx="1.5" cy="1" r="${s.iris}" fill="${irisC}"/><circle cx="1.5" cy="1" r="${s.iris * .5}" fill="#120c0e"/><circle cx="-2" cy="-3" r="2.5" fill="#fff"/><circle cx="4" cy="3.5" r="1.2" fill="#fff" opacity=".7"/>
${s.lid ? `<rect x="-20" y="${-s.ry - 1}" width="40" height="${s.ry * 2 * s.lid + 1}" fill="${skin}"/>` : ""}</g>
<path d="M${-s.rx - 2},1Q0,${-s.ry * 1.5} ${s.rx + 3},-1" stroke="#18101a" stroke-width="${s.lash}" fill="none" stroke-linecap="round"/>${s.wing ? `<path d="M${s.rx + 2},-1l8,-5" stroke="#18101a" stroke-width="3" stroke-linecap="round"/>` : ""}</g>`;
}
function brow(cx, cy, flip, kind, col) {
  const w = { thin: 2.4, soft: 3.4, arch: 3.2, thick: 5.5 }[kind], a = { thin: -6, soft: -2, arch: -9, thick: -8 }[kind];
  const s = flip ? -1 : 1;
  return `<path d="M${cx - 15 * s},${cy + 3}Q${cx},${cy + a} ${cx + 17 * s},${cy + 2}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
}
function mouth(kind, lip) {
  if (kind === "open") return `<path d="M181,262Q200,290 219,262Z" fill="#8d3b44"/><path d="M185,263Q200,271 215,263Q200,266 185,263Z" fill="#fff"/><path d="M181,262Q200,268 219,262" stroke="${lip}" stroke-width="2" fill="none"/>`;
  if (kind === "red") return `<path d="M179,264Q190,254 200,259Q210,254 221,264Q200,284 179,264Z" fill="${lip}"/><path d="M181,264Q200,270 219,264" stroke="#7a1420" stroke-width="1.5" fill="none"/>`;
  if (kind === "smile") return `<path d="M182,263Q200,277 218,263" stroke="${lip}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  if (kind === "smirk") return `<path d="M184,267Q200,271 219,263" stroke="${lip}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  return `<path d="M186,267L214,267" stroke="${lip}" stroke-width="3.4" stroke-linecap="round"/>`;
}

function hair(g, t, c, hl) {
  const back = [], front = [];
  const wavy = (y0, y1, base, amp, left) => { const pts = []; for (let y = y0; y <= y1; y += 28) pts.push([base + (left ? -1 : 1) * amp * Math.sin(y / 34) + (left ? -1 : 1) * (y - y0) * .02, y]); return pts; };
  if (g === "f") {
    if (t === "dodo") {
      back.push(sp([[200, 76], [252, 90], [279, 140], [283, 215], [288, 300], [292, 385], [286, 442], [114, 442], [108, 385], [112, 300], [117, 215], [121, 140], [148, 90]]));
      front.push(sp([[203, 88], [150, 100], [130, 160], [128, 240], [133, 318], [150, 320], [152, 245], [160, 190], [180, 142], [203, 114]]), sp(mir([[203, 88], [150, 100], [130, 160], [128, 240], [133, 318], [150, 320], [152, 245], [160, 190], [180, 142], [203, 114]])));
    } else if (t === "sexy") {
      const L = wavy(160, 440, 118, 11, true), R = wavy(160, 440, 282, 11, false);
      back.push(sp([[200, 74], [255, 88], [280, 140], ...R, ...L.reverse(), [120, 140], [146, 88]]));
      front.push(sp([[236, 90], [170, 94], [134, 140], [128, 230], [134, 320], [150, 322], [154, 235], [166, 188], [196, 150], [238, 120]]), sp([[236, 90], [266, 112], [276, 175], [276, 270], [270, 350], [252, 350], [254, 265], [252, 195], [244, 140]]));
    } else if (t === "cute") {
      back.push(sp([[200, 80], [256, 92], [284, 150], [288, 250], [276, 312], [236, 326], [200, 328], [164, 326], [124, 312], [112, 250], [116, 150], [144, 92]]));
      front.push(sp([[138, 205], [133, 140], [158, 96], [200, 86], [242, 96], [267, 140], [262, 205], [252, 166], [226, 152], [200, 150], [174, 152], [148, 166]]));
    } else if (t === "pretty") {
      const L = wavy(170, 420, 120, 14, true), R = wavy(170, 420, 280, 14, false);
      back.push(sp([[200, 76], [254, 90], [280, 140], ...R, ...L.reverse(), [120, 140], [146, 90]]));
      front.push(sp([[200, 88], [150, 98], [130, 160], [128, 235], [138, 300], [150, 296], [152, 230], [162, 182], [184, 144], [200, 124]]), sp([[200, 88], [250, 98], [270, 160], [274, 235], [264, 300], [250, 296], [250, 235], [240, 180], [222, 142], [200, 124]]));
    } else { // charisma: 포니테일
      back.push(sp([[262, 122], [310, 130], [350, 190], [356, 280], [338, 350], [322, 300], [300, 230], [276, 170]]), sp([[200, 80], [254, 92], [276, 140], [272, 210], [128, 210], [124, 140], [146, 92]]));
      front.push(sp([[138, 205], [133, 140], [158, 96], [200, 84], [244, 94], [268, 140], [264, 205], [250, 160], [222, 130], [186, 128], [158, 152], [146, 182]]));
    }
  } else {
    if (t === "dodo") front.push(sp([[138, 208], [131, 140], [156, 96], [200, 82], [248, 94], [272, 140], [267, 208], [258, 166], [236, 132], [200, 124], [168, 134], [148, 168]]));
    else if (t === "sexy") front.push(sp([[138, 200], [133, 140], [158, 98], [200, 84], [244, 96], [268, 140], [264, 200], [256, 150], [230, 120], [200, 114], [170, 120], [146, 150]]));
    else if (t === "cute") { const pts = []; for (let a = 190; a <= 350; a += 12) { const r = 82 + 8 * Math.sin(a / 9); pts.push([200 + r * 1.05 * Math.cos(a * Math.PI / 180), 190 + r * 1.05 * Math.sin(a * Math.PI / 180)]); } front.push(sp([...pts, [262, 195], [252, 168], [236, 158], [222, 168], [200, 152], [180, 166], [162, 156], [146, 170], [138, 195]])); }
    else if (t === "pretty") front.push(sp([[200, 86], [150, 98], [130, 160], [128, 240], [140, 262], [150, 238], [156, 190], [176, 148], [200, 128]]), sp([[200, 86], [250, 98], [270, 160], [272, 240], [260, 262], [250, 238], [244, 190], [224, 148], [200, 128]]));
    else front.push(pl([[138, 206], [130, 150], [145, 92], [168, 70], [186, 90], [206, 62], [226, 90], [250, 72], [262, 100], [272, 150], [266, 206], [258, 150], [236, 128], [200, 122], [168, 130], [148, 160]]));
  }
  const hi = `<path d="M160,110Q200,90 245,112" stroke="${hl}" stroke-width="4" fill="none" opacity=".35" stroke-linecap="round"/>`;
  return { back: back.map(d => `<path d="${d}" fill="${c}"/>`).join(""), front: front.map(d => `<path d="${d}" fill="${c}"/>`).join("") };
}

function outfit(g, t, coat, inner, accent) {
  const shade = "rgba(0,0,0,.18)";
  const body = `<path d="${sp([[40, 500], [62, 420], [128, 352], [176, 338], [224, 338], [272, 352], [338, 420], [360, 500]])}" fill="${coat}"/>`;
  let o = body;
  const turtle = (t === "dodo" || t === "charisma" && g === "f");
  if (t === "cute") { // 목도리
    o += `<path d="M168,330Q200,350 232,330L246,352Q200,380 154,352Z" fill="${accent}"/><path d="M164,336Q200,372 236,336" stroke="rgba(255,255,255,.5)" stroke-width="3" fill="none"/><path d="M208,356L226,420L204,424L196,362Z" fill="${accent}"/>`;
    o += `<path d="${pl([[162, 345], [124, 360], [150, 392], [176, 372]])}" fill="${shade}"/><path d="${pl([[238, 345], [276, 360], [250, 392], [224, 372]])}" fill="${shade}"/>`;
  } else {
    o += `<path d="${pl([[176, 336], [224, 336], [236, 500], [164, 500]])}" fill="${inner}"/>`;
    if (turtle) o += `<path d="${sp([[172, 318], [200, 326], [228, 318], [230, 346], [200, 354], [170, 346]])}" fill="${inner}"/>`;
    else o += `<path d="${pl([[176, 336], [200, 392], [224, 336]])}" fill="${t === "sexy" && g === "f" ? "#d9bfa0" : "rgba(0,0,0,.1)"}"/>`;
    o += `<path d="${pl([[172, 338], [128, 354], [112, 400], [150, 440], [166, 500], [150, 500], [96, 430], [120, 372]])}" fill="${shade}"/><path d="${pl([[228, 338], [272, 354], [288, 400], [250, 440], [234, 500], [250, 500], [304, 430], [280, 372]])}" fill="${shade}"/>`;
    o += `<path d="${pl([[172, 338], [146, 346], [150, 378], [176, 360]])}" fill="${coat}"/><path d="${pl([[228, 338], [254, 346], [250, 378], [224, 360]])}" fill="${coat}"/>`;
    if (t === "charisma") o += `<path d="${pl([[170, 332], [140, 340], [148, 372], [178, 352]])}" fill="${coat}" stroke="rgba(255,255,255,.12)"/><path d="${pl([[230, 332], [260, 340], [252, 372], [222, 352]])}" fill="${coat}" stroke="rgba(255,255,255,.12)"/>`;
  }
  o += `<circle cx="228" cy="440" r="5" fill="rgba(255,255,255,.25)"/>`;
  return o;
}

function render(gender, type, variant = 0) {
  const g = gender, v = variant % 3, P = PAL[g][type], F = FEAT[g][type];
  const skin = SKIN[v % 3], hc = P.hair[v], coat = P.coat[v], bg = P.bg;
  const hr = hair(g, type, hc, "#fff");
  const male = g === "m";
  const face = male ? [[200, 124], [243, 133], [263, 172], [263, 222], [254, 262], [229, 291], [200, 299], [171, 291], [146, 262], [137, 222], [137, 172], [157, 133]]
    : [[200, 124], [240, 133], [259, 172], [258, 214], [246, 252], [224, 284], [200, 294], [176, 284], [154, 252], [142, 214], [141, 172], [160, 133]];
  const e = EYE[F.eye], browC = hc;
  const accent = type === "cute" ? (male ? "#c97b5a" : "#f4a3b5") : "#c9a24d";
  const deco = type === "pretty" ? [..."0123456789"].map(i => `<circle cx="${(i * 97 + 30) % 400}" cy="${(i * 53 + 20) % 300}" r="${3 + i % 4}" fill="#fff" opacity=".5"/>`).join("") : [..."01234567"].map(i => `<circle cx="${(i * 131 + 40) % 400}" cy="${(i * 71 + 30) % 330}" r="${2 + i % 3}" fill="#fff" opacity=".35"/>`).join("");
  const earr = !male && (type === "sexy" || type === "dodo") ? `<circle cx="141" cy="238" r="4.5" fill="#d8b45a"/><circle cx="259" cy="238" r="4.5" fill="#d8b45a"/>` : "";
  const mole = type === "sexy" ? `<circle cx="226" cy="274" r="2" fill="#4a2a2a"/>` : "";
  const stubble = male && type === "sexy" ? `<path d="${sp([[146, 240], [160, 280], [200, 298], [240, 280], [254, 240], [236, 262], [200, 272], [164, 262]])}" fill="#3a2a26" opacity=".09"/>` : "";
  const glasses = male && type === "pretty" && v === 2 ? `<g stroke="#2a2a30" stroke-width="3" fill="rgba(255,255,255,.12)"><circle cx="171" cy="206" r="19"/><circle cx="229" cy="206" r="19"/><path d="M190,204L210,204"/></g>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="46 52 308 385" width="616" height="770">
<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></linearGradient></defs>
<rect x="0" y="0" width="400" height="500" fill="url(#bg)"/>${deco}
${hr.back}
<rect x="178" y="270" width="44" height="76" rx="14" fill="${skin}"/><ellipse cx="200" cy="303" rx="22" ry="9" fill="rgba(0,0,0,.09)"/>
${outfit(g, type, coat, P.inner, accent)}
<ellipse cx="138" cy="206" rx="9" ry="14" fill="${skin}"/><ellipse cx="262" cy="206" rx="9" ry="14" fill="${skin}"/>
<path d="${sp(face)}" fill="${skin}"/>${stubble}
<ellipse cx="164" cy="240" rx="16" ry="9" fill="#ff8da1" opacity="${F.blush}"/><ellipse cx="236" cy="240" rx="16" ry="9" fill="#ff8da1" opacity="${F.blush}"/>
${hr.front}
${brow(171, 178, true, F.brow, browC)}${brow(229, 178, false, F.brow, browC)}
${eye(171, 208, true, e, skin, male ? "#3a2418" : "#4a2c20")}${eye(229, 208, false, e, skin, male ? "#3a2418" : "#4a2c20")}${glasses}
<path d="M198,236Q201,243 205,239" stroke="rgba(120,70,60,.55)" stroke-width="2.2" fill="none" stroke-linecap="round"/>
${mouth(F.mouth, P.lip)}${mole}${earr}
</svg>`;
}
module.exports = { render, TYPES: ["dodo", "sexy", "cute", "pretty", "charisma"] };
