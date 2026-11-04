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
    // 얼굴 영역만 모자이크합니다. 헤어·얼굴 윤곽·의상·배경은 남겨 캐릭터의 분위기를 알아볼 수 있게 합니다.
    const face = await sharp(full).extract({ left: 110, top: 118, width: 180, height: 190 })
      .resize(42, 44, { fit: "fill", kernel: "cubic" }).resize(180, 190, { kernel: "nearest" }).png().toBuffer();
    await sharp(full).composite([{ input: face, left: 110, top: 118 }])
      .png().toFile(path.join(mos, mosaicName(key) + ".png"));
  }
  console.log(`원본 생성 ${made}개, 기존 파일 유지 ${kept}개, 모자이크 30개 완료`);
})();
