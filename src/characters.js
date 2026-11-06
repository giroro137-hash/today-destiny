// 인연 캐릭터: 사주(일지·월지 십성)로 유형을 정하고, 무료에는 모자이크, 결제 후에는 원본을 공개합니다.
const crypto = require("crypto");
const S = require("./saju");

const TYPES = ["dodo", "sexy", "cute", "pretty", "charisma"];
const TYPE_BY_GOD = { 비견: "pretty", 정재: "pretty", 편인: "pretty", 식신: "cute", 정인: "cute", 상관: "dodo", 정관: "dodo", 편재: "sexy", 겁재: "sexy", 편관: "charisma" };
const LABEL = {
  m: { dodo: "도도한 차도남형", sexy: "섹시한 분위기형", cute: "귀여운 강아지상", pretty: "훈훈한 호감형", charisma: "카리스마 리더형" },
  f: { dodo: "도도한 매력형", sexy: "섹시한 분위기형", cute: "귀여운 매력형", pretty: "이쁜 호감형", charisma: "카리스마 있는 매력형" }
};
const INFO = {
  dodo: { kw: ["도도함", "세련됨", "신중함"], look: "깔끔한 롱코트에 터틀넥을 즐겨 입는 정돈된 스타일", first: "처음엔 거리감이 있어 보이지만 알고 보면 속이 깊은 사람", love: "마음을 쉽게 주지 않지만 한번 마음을 열면 한결같이 지켜 주는 연애", meet: "취미 클래스, 전시·서점처럼 조용히 몰입하는 장소", approach: "가볍게 친한 척하기보다 취향을 존중하며 천천히 대화를 이어 가세요.", care: "차가워 보이는 표정에 지레 포기하지 마세요." },
  sexy: { kw: ["매력", "자신감", "분위기"], look: "블랙 트렌치코트와 단정한 이너로 분위기를 연출하는 스타일", first: "눈길을 끄는 분위기와 여유로운 태도를 가진 사람", love: "끌림이 빠르고 표현이 솔직한 연애. 자극과 설렘을 중요하게 여깁니다.", meet: "저녁 모임, 와인바·라이브 공연 같은 분위기 있는 자리", approach: "솔직한 호감 표현이 통하지만 서두르지 말고 진심을 보여 주세요.", care: "겉모습의 매력에만 끌리지 말고 가치관을 확인하세요." },
  cute: { kw: ["다정함", "밝음", "순수함"], look: "포근한 더플코트와 니트 목도리가 어울리는 스타일", first: "웃음이 많고 같이 있으면 마음이 편해지는 사람", love: "애정 표현이 풍부하고 작은 기념일도 챙기는 따뜻한 연애", meet: "카페, 동네 모임, 친구의 친구 같은 편안한 자리", approach: "안부와 작은 배려를 꾸준히 건네면 마음이 빠르게 가까워집니다.", care: "밝은 성격 뒤의 고민을 놓치지 마세요." },
  pretty: { kw: ["호감", "단정함", "따뜻함"], look: "파스텔 톤 롱코트나 트렌치코트를 단정하게 입는 스타일", first: "누구에게나 호감을 주는 단정하고 부드러운 인상의 사람", love: "신뢰와 안정감을 바탕으로 천천히 깊어지는 연애", meet: "소개팅, 직장·학교 주변, 공통 지인이 있는 모임", approach: "진솔한 대화와 약속을 지키는 모습이 가장 큰 호감 포인트입니다.", care: "너무 편한 사이로만 굳어지지 않게 마음을 표현하세요." },
  charisma: { kw: ["리더십", "추진력", "단호함"], look: "블랙 롱코트에 하이넥 이너를 입는 강한 인상의 스타일", first: "말과 행동에 힘이 있고 주변을 이끄는 사람", love: "확신이 서면 직진하는 연애. 서로의 목표를 응원하는 관계를 원합니다.", meet: "업무·프로젝트, 스터디, 운동 모임처럼 목표가 있는 자리", approach: "당당하고 솔직하게 다가가고 의견은 존중하며 전달하세요.", care: "강한 말투에 상처받기보다 의도를 물어보세요." }
};
const NOTICE = "인연 이미지는 AI로 제작한 가상의 성인 캐릭터이며 실제 인물이나 미래 배우자의 외모를 예측·보장하지 않습니다.";
const mosaicName = key => crypto.createHash("sha1").update(key + "|mosaic-v1").digest("hex").slice(0, 14);
const KEY_RE = /^[mf]_(dodo|sexy|cute|pretty|charisma)_[0-2]$/;

function pick(person) {
  const p = S.pillars(person), dm = p.day.s;
  const t = (stemOrBranch) => TYPE_BY_GOD[S.tenGod(dm, S.BRANCH_MAIN_STEM[stemOrBranch])];
  const userGender = person.gender === "female" ? "female" : "male";
  const opposite = userGender === "male" ? "f" : "m";
  const guideGender = opposite;
  const mk = (role, gender, type, v) => ({ role, gender, type, key: `${gender}_${type}_${v % 3}` });
  const tA = t(p.day.b); let tB = t(p.month.b);
  if (tB === tA) tB = TYPES[(TYPES.indexOf(tA) + 1 + (p.year.b % 4)) % 5];
  return [
    mk(userGender === "male" ? "풀이 선녀" : "풀이 도령", guideGender, tA, p.year.s + p.year.b),
    mk("나의 인연", opposite, tB, p.month.s + p.month.b)
  ];
}
const teaser = person => pick(person).slice(1).map(c => ({ role: c.role, mosaic: `/mosaic/${mosaicName(c.key)}.png` }));
function reveal(person, orderId) {
  const list = pick(person);
  return {
    keys: list.map(c => c.key),
    cards: list.map(c => ({ role: c.role, label: LABEL[c.gender][c.type], keywords: INFO[c.type].kw, look: INFO[c.type].look, first: INFO[c.type].first, love: INFO[c.type].love, meet: INFO[c.type].meet, approach: INFO[c.type].approach, care: INFO[c.type].care, image: `/api/orders/${orderId}/character/${c.key}.png` })),
    notice: NOTICE
  };
}
module.exports = { pick, teaser, reveal, mosaicName, KEY_RE, TYPES, NOTICE };
