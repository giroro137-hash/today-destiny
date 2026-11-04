// 캐릭터 원본(PNG)과 모자이크를 만듭니다.  사용: npm i -D sharp && npm run build:characters
// · private/characters/<키>.png 가 이미 있으면(직접 만든 일러스트 등) 그대로 쓰고, 없으면 내장 벡터 캐릭터를 생성합니다.
// · public/mosaic/ 에는 해상도를 크게 낮춘 모자이크만 저장합니다(원본은 절대 public에 두지 마세요).
const fs = require("fs"), path = require("path"), sharp = require("sharp");
const { render, TYPES } = require("./characters_svg");
const { mosaicName } = require("../src/characters");
const root = path.join(__dirname, "..");
const priv = path.join(root, "private", "characters"), mos = path.join(root, "public", "mosaic");
fs.mkdirSync(priv, { recursive: true }); fs.mkdirSync(mos, { recursive: true });
(async () => {
  let made = 0, kept = 0;
  for (const g of ["m", "f"]) for (const t of TYPES) for (let v = 0; v < 3; v++) {
    const key = `${g}_${t}_${v}`, full = path.join(priv, key + ".png");
    if (fs.existsSync(full)) kept++; else { await sharp(Buffer.from(render(g, t, v))).png().toFile(full); made++; }
    const tiny = await sharp(full).resize(20, 25, { fit: "cover", kernel: "cubic" }).toBuffer();
    await sharp(tiny).resize(400, 500, { kernel: "nearest" }).png().toFile(path.join(mos, mosaicName(key) + ".png"));
  }
  console.log(`원본 생성 ${made}개, 기존 파일 유지 ${kept}개, 모자이크 30개 완료`);
})();
