// 프리미엄 리포트 생성: 전통 명리(사주) 계산 결과를 바탕으로 한 참고용 해석
const S = require("./saju");
const { STEMS, BRANCHES, ELEMS, STEM_EL, BRANCH_EL, ANIMALS, HOURS, pillars, label, dayPillar, tenGod, elementCount, godGroups, rel, goodAnimals, BRANCH_MAIN_STEM, mod } = S;

const DM = [
  ["큰 나무", "곧게 뻗는 성향으로 시작과 추진력이 강하고, 어디서든 중심에서 이끄는 역할을 맡기 쉽습니다.", "리더십, 정직함, 성장 욕구", "고집이 세져 조언을 놓치거나 유연성이 부족해질 수 있습니다."],
  ["풀과 덩굴", "부드럽고 적응력이 좋아 사람과 환경에 맞춰 길을 찾아내는 힘이 있습니다.", "친화력, 생존력, 섬세함", "눈치를 보다 결정을 미루거나 의지하려는 마음이 커질 수 있습니다."],
  ["태양", "밝고 뜨거운 에너지로 주변을 환하게 하며, 표현력과 열정이 두드러집니다.", "낙천성, 표현력, 공정함", "급하게 달아오르거나 마무리가 약해질 수 있습니다."],
  ["촛불", "겉은 차분해도 속은 따뜻하고 집중력이 깊어 한 분야를 섬세하게 밝힙니다.", "배려심, 집중력, 예술적 감각", "감정 기복과 예민함이 쌓이기 쉽습니다."],
  ["큰 산", "묵직하고 듬직해 신뢰를 주며, 한번 맡은 일은 끝까지 지켜내는 사람입니다.", "신뢰, 안정감, 포용력", "변화에 느리고 속마음을 잘 드러내지 않을 수 있습니다."],
  ["논밭", "모든 것을 품어 키우는 땅처럼 현실적이고 실속 있게 사람과 일을 챙깁니다.", "실용성, 인내, 조율 능력", "걱정이 많아져 스스로를 소모하기 쉽습니다."],
  ["바위·쇠", "결단력과 의리가 강하고 원칙을 중시하며, 위기에서 힘을 발휘합니다.", "추진력, 의리, 결단", "직설적인 말로 상대에게 상처를 주거나 타협이 어려울 수 있습니다."],
  ["보석", "섬세하고 감각이 예리하며 자신만의 기준과 품격을 지키려는 성향입니다.", "완성도, 심미안, 자존감", "예민하고 비판적으로 굳어질 수 있어 스스로에게 여유가 필요합니다."],
  ["큰 강·바다", "넓은 시야와 지혜로 흐름을 읽고, 자유롭게 움직이며 새로운 곳으로 뻗어 갑니다.", "통찰력, 포용력, 적응력", "생각이 많아지거나 방향이 자주 바뀔 수 있습니다."],
  ["비·이슬", "직관과 감수성이 풍부하고 조용히 스며들어 일을 이뤄내는 인내심이 있습니다.", "직관, 공감 능력, 끈기", "소극적이 되거나 혼자 걱정을 키울 수 있습니다."]
];

// 오늘의 일진 십성별 해석: [한줄, 요약, 연애, 재물, 직장, 행동, 인연, 점수(연애,재물,직장)]
const SIP = {
  비견: ["나와 같은 기운이 모이는 날", "비슷한 성향의 사람, 동료와 힘을 합치기 좋은 날입니다. 독립심이 강해지므로 협력하면 시너지가 나지만 경쟁심도 올라옵니다.", "솔로라면 친구 소개나 모임에서 편한 사람을 만나기 쉽습니다. 연인과는 주도권 다툼만 조심하면 편안합니다.", "수입은 안정적이나 지인과의 돈거래·공동 지출이 새기 쉬운 흐름입니다. 각자 계산을 분명히 하세요.", "동료·파트너와의 협업이 잘 풀립니다. 다만 같은 목표를 두고 부딪히지 않도록 역할을 나눠 두세요.", "혼자 끌고 가지 말고 믿을 만한 사람 한 명에게 도움을 요청해 보기", "나와 비슷한 취향과 말투를 가진 동갑·동료 같은 사람", [72, 66, 78]],
  겁재: ["경쟁과 도전이 올라오는 날", "승부욕과 추진력이 커지는 날입니다. 과감한 시도가 통하지만 충동과 지출도 함께 커지므로 속도 조절이 필요합니다.", "끌림이 강해지는 날이지만 질투나 경쟁 구도가 생길 수 있습니다. 서두르지 않는 쪽이 유리합니다.", "새는 돈, 충동구매, 보증·대여 요청에 주의하세요. 지키는 것이 버는 것입니다.", "경쟁 프로젝트나 발표에서 투지가 빛납니다. 다만 동료와의 성과 다툼은 피하세요.", "큰 지출과 보증, 돈거래는 오늘 결정하지 않기", "당당하고 승부욕 있는 사람, 라이벌처럼 시작되는 인연", [66, 55, 74]],
  식신: ["여유와 표현이 즐거운 날", "마음이 편안하고 재능이 자연스럽게 드러나는 날입니다. 먹고 즐기고 만드는 일에서 만족을 얻기 쉽습니다.", "분위기가 부드러워 호감을 얻기 좋습니다. 맛집, 취미 데이트처럼 편안한 만남이 잘 맞습니다.", "작은 즐거움에 쓰는 돈이 늘 수 있지만 재능이 수입으로 이어질 씨앗도 보입니다.", "아이디어 기획, 콘텐츠, 요리·창작 같은 일에서 능률이 오릅니다. 학생은 암기보다 정리에 유리합니다.", "하고 싶었던 취미나 창작을 30분이라도 해 보기", "말이 부드럽고 유머가 있어 같이 있으면 편안한 사람", [84, 76, 80]],
  상관: ["표현이 강해지고 틀을 깨는 날", "재치와 말솜씨가 살아나지만 직설과 반항심도 함께 올라옵니다. 창의적인 일에는 좋고 윗사람과의 대화는 조심해야 합니다.", "매력적으로 보이는 날이지만 말이 날카로워지면 다툼이 생깁니다. 솔직하되 부드럽게 전하세요.", "재능을 돈으로 바꾸는 아이디어가 나옵니다. 다만 감정적인 소비를 조심하세요.", "발표·창작에는 강하지만 상사나 규정과 충돌하기 쉽습니다. 이견은 서면으로 정리해 전하세요.", "화가 나는 말은 보내기 전에 한 번 더 읽고 다듬기", "개성이 강하고 말솜씨가 좋은 재치 있는 사람", [74, 70, 62]],
  편재: ["기회와 활동량이 커지는 날", "움직이는 만큼 기회가 따라오는 날입니다. 영업, 거래, 인맥 확장에 유리하고 큰 흐름의 돈이 오갑니다.", "사교 활동이 활발해 새로운 만남이 생기기 쉽습니다. 가볍게 시작하되 진심은 천천히 확인하세요.", "수입 기회와 지출이 동시에 커집니다. 투자·사업 제안은 검토하되 당일 결정은 피하세요.", "외부 활동, 거래처, 협상에서 성과가 납니다. 몸이 바쁜 만큼 일정 관리가 중요합니다.", "만날 사람 한 명에게 먼저 연락하고 제안 하나 정리하기", "활동적이고 씀씀이가 크며 사교적인 사람", [82, 88, 82]],
  정재: ["꾸준히 모으는 안정의 날", "성실함이 보상받는 날입니다. 계획대로 처리하면 안정적인 결과가 나오고 금전 관리에 좋습니다.", "믿음직한 만남이 이어집니다. 연인과는 현실적인 약속과 계획을 나누기 좋은 날입니다.", "월급·정기 수입·저축 같은 안정적인 돈의 흐름이 좋습니다. 가계 점검과 계약 정리에 알맞습니다.", "꼼꼼한 마무리와 정산, 문서 업무에서 인정받습니다. 학생은 계획한 분량을 채우기 좋습니다.", "이번 달 고정지출과 저축 목표를 한 번 점검하기", "성실하고 약속을 잘 지키는 안정적인 사람", [80, 90, 84]],
  편관: ["압박 속에서 성장하는 날", "책임과 긴장이 커지는 날입니다. 부담스러운 요구가 오지만 침착히 대응하면 실력을 인정받을 기회입니다.", "강한 끌림 또는 긴장감 있는 만남이 생길 수 있습니다. 감정이 앞서면 부담이 커지니 천천히 가세요.", "예상 밖의 지출이나 벌금·수리비 같은 부담이 생길 수 있습니다. 여유 자금을 남겨 두세요.", "마감과 평가, 상사의 요구가 몰립니다. 우선순위를 정해 하나씩 처리하면 오히려 돋보입니다.", "급한 일부터 줄을 세우고 무리한 약속은 정중히 미루기", "카리스마 있고 직설적이며 추진력이 강한 사람", [66, 60, 72]],
  정관: ["질서와 신뢰를 얻는 날", "규칙과 예의가 힘이 되는 날입니다. 공식적인 자리, 면접, 승진·평가에서 바른 태도가 좋은 평가를 만듭니다.", "단정하고 예의 바른 만남에 유리합니다. 진지한 관계로 이어질 인연을 알아보기 좋은 날입니다.", "큰 수입보다 신용과 평판이 돈으로 이어지는 날입니다. 계약·서류는 꼼꼼히 확인하세요.", "공식 업무, 보고, 시험 등에서 안정적인 성과가 납니다. 조직 안에서의 신뢰가 쌓입니다.", "약속 시간과 마감 지키기, 공손한 말투 유지하기", "예의 바르고 책임감 있으며 안정된 직업을 가진 사람", [88, 78, 90]],
  편인: ["생각이 깊어지고 직관이 오는 날", "독특한 아이디어와 직관이 살아나는 날입니다. 혼자 연구하고 구상하기엔 좋지만 생각이 많아져 결정이 늦어질 수 있습니다.", "마음을 열기까지 시간이 걸립니다. 깊은 대화를 나눌 수 있는 한 사람에게 집중하세요.", "큰 변동보다 공부와 자격에 투자하는 흐름이 낫습니다. 즉흥적인 소비는 줄이세요.", "분석, 기획, 연구, 학습에 유리합니다. 반복 업무에는 지루함을 느낄 수 있습니다.", "생각을 글로 적어 정리하고 결정은 한 단계 미루기", "조용하고 독특한 취향이 있으며 깊이 있는 사람", [62, 62, 76]],
  정인: ["도움과 배움을 받는 날", "귀인과 도움이 따르고 마음이 안정되는 날입니다. 배우고 쉬며 충전하기에 좋고 어른·선배의 조언이 힘이 됩니다.", "보살핌을 주고받는 따뜻한 관계가 편안합니다. 오래된 인연과의 깊은 대화가 도움이 됩니다.", "돈보다 문서·자격·지원 같은 혜택이 들어오는 날입니다. 지원금·환급 확인에 좋습니다.", "시험, 자격, 학습, 문서 작업이 잘 풀립니다. 선배나 상사의 도움을 청하면 길이 열립니다.", "배우고 싶은 것 하나를 정해 30분 투자하고 일찍 쉬기", "다정하고 배려 깊으며 가르침을 주는 따뜻한 사람", [76, 72, 88]]
};
const AVOID = { 비견: "혼자 모든 걸 떠안으려는 태도", 겁재: "충동 지출, 보증·돈거래", 식신: "과식과 미루기", 상관: "날 선 말과 감정적인 SNS 글", 편재: "과한 투자와 무리한 일정", 정재: "사소한 지출을 방치하는 것", 편관: "참다가 한꺼번에 폭발하기", 정관: "눈치 보느라 의견을 숨기는 것", 편인: "걱정만 하다 결정을 미루는 것", 정인: "남에게만 기대고 직접 움직이지 않는 것" };
const TODAY_REL = {
  hap: ["일진과 나의 일지가 합을 이루어 분위기가 부드럽습니다. 협력과 약속, 만남이 잘 풀리는 날로 점수가 올라갑니다.", 6],
  samhap: ["일진과 나의 일지가 삼합 관계로 서로 돕는 기운이 있습니다. 사람을 통한 기회가 생기기 쉽습니다.", 4],
  chung: ["일진과 나의 일지가 충을 이루어 마음이 흔들리고 변동이 생기기 쉽습니다. 이동·약속 변경에 여유를 두고 감정적인 결정은 미루세요.", -8],
  none: ["일진과 나의 일지는 특별한 충돌이나 합이 없어 무난한 흐름입니다.", 0]
};
const EL = [
  { c: "초록·청록", dir: "동쪽", habit: "식물을 가까이 두고 가벼운 산책이나 스트레칭", lack: "시작하고 성장하는 힘이 약해질 수 있어 새로운 배움이 도움이 됩니다.", over: "추진력이 과해져 고집으로 번지지 않게 쉬어 가세요.", organ: "간·눈·근육" },
  { c: "빨강·주황", dir: "남쪽", habit: "햇볕 쬐기와 활기찬 대화, 따뜻한 음식", lack: "열정과 표현이 약해질 수 있어 사람들과 어울리는 시간이 도움이 됩니다.", over: "감정이 달아오르지 않게 호흡을 가다듬으세요.", organ: "심장·혈압·눈의 피로" },
  { c: "노랑·베이지", dir: "중앙(집 안 중심)", habit: "규칙적인 식사와 정리정돈", lack: "중심과 안정감이 약해질 수 있어 생활 리듬을 고정하는 것이 좋습니다.", over: "생각이 무거워지고 움직임이 느려지지 않게 하세요.", organ: "소화기·위장" },
  { c: "흰색·은색", dir: "서쪽", habit: "정리, 환기, 호흡 운동", lack: "결단과 마무리가 약해질 수 있어 작은 결정을 빨리 내려 보세요.", over: "날카로운 말과 완벽주의에 주의하세요.", organ: "호흡기·피부·대장" },
  { c: "검정·짙은 파랑", dir: "북쪽", habit: "충분한 수분 섭취와 숙면", lack: "유연함과 휴식이 부족해질 수 있어 잠과 쉼을 우선하세요.", over: "걱정과 생각이 넘치지 않게 몸을 움직이세요.", organ: "신장·방광·수면" }
];
const GROUP = [
  { n: "비겁(나·동료)", t: "자기 주관과 독립심이 강하고 경쟁 속에서 힘을 냅니다.", job: "독립적으로 일하거나 팀을 이끄는 일, 자영업과 영업, 스포츠·전문직", week: "자기 중심을 세우는" },
  { n: "식상(표현·재능)", t: "말과 재능, 창의력으로 세상과 소통합니다.", job: "기획·창작·교육·서비스·요리·콘텐츠처럼 표현이 곧 일이 되는 분야", week: "표현과 창작이 살아나는" },
  { n: "재성(현실·재물)", t: "현실 감각과 실행력이 좋아 돈과 성과를 다루는 데 강합니다.", job: "금융·유통·사업·영업·관리처럼 성과가 수치로 보이는 일", week: "현실 성과를 챙기는" },
  { n: "관성(책임·조직)", t: "책임감과 규율이 있어 조직과 사회 안에서 인정받는 힘이 있습니다.", job: "공무·대기업·법률·행정·관리직처럼 체계가 있는 조직", week: "책임과 평가가 따르는" },
  { n: "인성(학습·보호)", t: "배움과 사고가 깊고 도움을 받는 복이 있습니다.", job: "연구·교육·전문 자격·상담·출판처럼 지식을 쌓는 일", week: "배우고 충전하는" }
];
const SPOUSE = {
  비견: "대등하고 친구 같은 파트너를 원하며, 서로 간섭하지 않는 관계에서 편안함을 느낍니다.",
  겁재: "자극과 승부욕이 있는 관계에 끌리며, 주도권과 질투를 다루는 법이 중요합니다.",
  식신: "편안하고 즐거운 관계를 중시하며, 함께 먹고 웃는 일상이 사랑의 바탕입니다.",
  상관: "개성 있고 대화가 통하는 상대에게 끌리며, 말의 온도를 조절하면 관계가 오래갑니다.",
  편재: "활동적이고 변화가 있는 관계를 좋아하며, 자유와 책임의 균형이 숙제입니다.",
  정재: "성실하고 현실적인 관계를 바라며, 신뢰가 쌓일수록 깊어지는 타입입니다.",
  편관: "강한 매력과 긴장감에 끌리기 쉬우니 존중받는 관계인지 살피는 것이 좋습니다.",
  정관: "예의와 신뢰를 중시하는 안정적인 인연을 바라며, 진지한 만남에서 빛납니다.",
  편인: "정서적 깊이와 독립적인 거리를 함께 원하며, 마음을 여는 데 시간이 필요합니다.",
  정인: "서로 돌보고 의지하는 따뜻한 관계를 바라며, 정서적 안정감이 가장 중요합니다."
};
const YEARGOD = {
  비견: "독립과 경쟁의 해. 동료·친구와의 관계가 바뀌고 자기 사업이나 주도권에 눈을 뜹니다.",
  겁재: "도전과 지출의 해. 승부수는 힘이 되지만 보증·투자·인간관계의 돈거래는 조심하세요.",
  식신: "여유와 결실의 해. 재능이 알려지고 생활이 풍요로워지며 건강과 취미가 좋아집니다.",
  상관: "변화와 표현의 해. 새로운 시도와 이직·창작에 좋지만 구설과 윗사람과의 마찰을 조심하세요.",
  편재: "기회와 활동의 해. 수입처가 늘고 인맥이 넓어지지만 지출도 커지니 관리가 필요합니다.",
  정재: "안정과 축적의 해. 수입이 꾸준하고 저축·결혼·내 집 마련 같은 안정 계획에 유리합니다.",
  편관: "압박과 성장의 해. 책임이 늘고 시험대에 서지만 버티면 실력과 지위가 올라갑니다.",
  정관: "인정과 승진의 해. 조직 안에서 신뢰가 쌓이고 직위·자격·결혼 운이 따릅니다.",
  편인: "공부와 전환의 해. 새로운 분야를 배우고 방향을 다시 잡기에 좋으며 고민이 깊어질 수 있습니다.",
  정인: "도움과 학습의 해. 귀인과 문서운이 따르고 시험·자격·이사에 유리하며 마음이 안정됩니다."
};
const GUIN = { 0: [1, 7], 4: [1, 7], 6: [1, 7], 1: [0, 8], 5: [0, 8], 2: [11, 9], 3: [11, 9], 8: [3, 5], 9: [3, 5], 7: [2, 6] };

const hourRange = i => `${(i * 2 + 23) % 24}시~${(i * 2 + 1) % 24}시(${HOURS[i]})`;
const p2 = n => String(n).padStart(2, "0");
const ymd = d => `${d.getUTCFullYear()}-${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())}`;
const addDays = (str, n) => { const [y, m, d] = str.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d + n)); };
const clamp = (v, a = 40, b = 98) => Math.max(a, Math.min(b, v));
const relOf = (a, b) => rel.chung(a, b) ? "chung" : rel.hap(a, b) ? "hap" : rel.samhap(a, b) ? "samhap" : "none";
const relKo = { hap: "합", samhap: "삼합", chung: "충", none: "무난" };
const stars = s => "★".repeat(Math.round(s / 20)) + "☆".repeat(5 - Math.round(s / 20));

function pillarTable(p) {
  const cols = [["시주", p.hour], ["일주", p.day], ["월주", p.month], ["연주", p.year]];
  return { head: ["", ...cols.map(c => c[0])], rows: [
    ["천간", ...cols.map(([, x]) => x ? `${STEMS[x.s]} (${ELEMS[STEM_EL[x.s]]})` : "모름")],
    ["지지", ...cols.map(([, x]) => x ? `${BRANCHES[x.b]} (${ELEMS[BRANCH_EL[x.b]]})` : "모름")]
  ] };
}
function elementSummary(p) {
  const c = elementCount(p), lack = c.map((v, i) => [v, i]).filter(x => x[0] === 0).map(x => x[1]);
  const max = c.indexOf(Math.max(...c));
  const text = c.map((v, i) => `${ELEMS[i]} ${v}`).join(" · ");
  return { c, lack, max, text };
}
function baseCore(person) {
  const p = pillars(person), dm = p.day.s, es = elementSummary(p);
  return { p, dm, es };
}
function dayInfo(dm, myDayBranch, dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number), T = dayPillar(y, m, d);
  const god = tenGod(dm, T.s), r = relOf(T.b, myDayBranch), info = SIP[god];
  const mod_ = TODAY_REL[r][1];
  const sc = info[7].map(v => clamp(v + mod_));
  return { T, god, r, info, sc, avg: Math.round(sc.reduce((a, b) => a + b, 0) / 3) };
}

// 인연의 만남 접점은 단정적 예언이 아니라 성향별로 제안하는 현실적인 활동 아이디어입니다.
const MEET_PROFILE = {
  비견: { place: "친구의 생일 모임, 동료와의 식사, 지인 중심의 소규모 모임", scene: "공통 지인이 대화를 연결해 주거나 같은 관심사를 가진 사람끼리 자연스럽게 이야기를 나누는 상황", action: "소개를 받으면 부담스러운 기대보다 가벼운 대화부터 시작하고, 공통 관심사를 찾아보세요." },
  겁재: { place: "운동 모임, 러닝 크루, 보드게임·스포츠 모임, 활기 있는 네트워킹 자리", scene: "함께 활동하거나 작은 경쟁·협동을 하면서 서로의 성격을 알게 되는 상황", action: "승부보다 응원과 협력을 보여 주세요. 상대를 이기려 하기보다 함께 즐기는 태도가 좋습니다." },
  식신: { place: "브런치 카페, 맛집 모임, 베이킹·요리 클래스, 취미 원데이 클래스", scene: "음식이나 취미 취향을 나누다가 자연스럽게 다음 약속으로 이어지는 상황", action: "좋았던 메뉴나 수업 이야기를 건네고, 다음에 함께 가볼 만한 곳을 가볍게 제안해 보세요." },
  상관: { place: "독립서점, 전시회, 영화·공연, 사진·디자인 관련 행사", scene: "작품이나 취향에 대한 의견을 주고받으며 서로의 개성을 발견하는 상황", action: "상대의 취향을 평가하기보다 무엇이 좋았는지 질문해 보세요. 대화의 여지를 남기는 것이 포인트입니다." },
  편재: { place: "축제, 팝업스토어, 여행·야외 행사, 친구가 초대한 저녁 모임", scene: "평소 생활 반경을 벗어난 장소에서 새로운 사람들과 어울리다 연결되는 상황", action: "일정에 여유를 두고 새로운 모임 한 곳에 참여해 보세요. 연락처 교환은 서로 편할 때만 하세요." },
  정재: { place: "직장·학교 주변, 스터디, 자격증·언어 수업, 지인 소개 자리", scene: "반복해서 마주치며 약속을 지키는 모습과 생활 태도를 천천히 알아가는 상황", action: "작은 약속을 지키고 대화를 꾸준히 이어가세요. 처음부터 관계를 서두르지 않는 편이 좋습니다." },
  편관: { place: "프로젝트 협업, 업무 관련 세미나, 봉사활동, 목표가 분명한 모임", scene: "함께 문제를 해결하거나 책임을 나누는 과정에서 신뢰가 생기는 상황", action: "상대의 추진력을 존중하되 내 기준도 분명히 표현하세요. 일과 사생활의 경계도 확인하세요." },
  정관: { place: "공식적인 모임, 동문·동료 소개, 전문 세미나, 예의를 갖춘 소규모 자리", scene: "서로의 기본 정보와 가치관을 확인할 수 있는 차분한 자리에서 대화가 시작되는 상황", action: "시간 약속과 기본적인 예의를 지키고, 서로 중요하게 여기는 생활 기준을 자연스럽게 나눠 보세요." },
  편인: { place: "독립서점, 북토크, 전시·강연, 조용한 취미 클래스", scene: "관심 분야가 겹쳐 깊은 대화를 나누며 천천히 친밀해지는 상황", action: "처음부터 많은 이야기를 하기보다 관심 주제 하나를 중심으로 대화를 이어가세요." },
  정인: { place: "배움 모임, 문화센터, 봉사활동, 지인의 따뜻한 소개 자리", scene: "서로 배려하거나 도움을 주고받는 과정에서 편안함과 신뢰가 쌓이는 상황", action: "고마움을 표현하고 상대의 속도를 존중하세요. 배려가 일방적이지 않은지도 살펴보세요." }
};

// ---------------------------------------------------------------- 오늘의 프리미엄 운세
function buildDaily(person, today) {
  const { p, dm, es } = baseCore(person), di = dayInfo(dm, p.day.b, today), info = di.info, T = di.T;
  const todayEl = ELEMS[STEM_EL[T.s]], elInfo = EL[STEM_EL[T.s]];
  const needEl = es.lack.length ? es.lack[0] : (es.c.indexOf(Math.min(...es.c)));
  const need = EL[needEl];
  const guin = GUIN[dm].map(hourRange), chungHour = hourRange((T.b + 6) % 12);
  const yearAnimal = ANIMALS[p.year.b], good = goodAnimals(p.year.b);
  const s = [];
  s.push({ h: "1. 나의 사주 구성", table: pillarTable(p),
    p: [`나의 일간은 ${STEMS[dm]}(${ELEMS[STEM_EL[dm]]}), '${DM[dm][0]}'에 비유되는 기운입니다. ${DM[dm][1]}`, `오행 분포: ${es.text}. ${es.lack.length ? `${es.lack.map(i => ELEMS[i]).join("·")} 기운이 비어 있어 ${need.lack}` : `${ELEMS[es.max]} 기운이 가장 두드러집니다. ${EL[es.max].over}`}`,
      person.birthTime === "unknown" || !p.hour ? "태어난 시간을 입력하지 않아 시주는 제외하고 해석했습니다. 시간을 알면 더 정밀해집니다." : "태어난 시간을 반영해 해석했습니다."] });
  s.push({ h: `2. 오늘의 일진 ${label(T)}일 — 나에게는 '${di.god}'의 날`,
    p: [`오늘의 한마디: ${info[0]}`, info[1], TODAY_REL[di.r][0], `오늘 점수: 연애 ${di.sc[0]} · 재물 ${di.sc[1]} · 직장·학업 ${di.sc[2]}`] });
  s.push({ h: "3. 연애운 · 오늘 만날 인연", p: [info[2], `오늘 마주칠 가능성이 높은 인연의 특징: ${info[6]}.`, `띠로 보면 ${yearAnimal}띠인 당신과 ${good.join("·")}띠가 기운이 잘 맞는 편입니다.`] });
  const spouseGod = tenGod(dm, BRANCH_MAIN_STEM[p.day.b]), meet = MEET_PROFILE[spouseGod];
  s.push({ h: "4. 인연을 만날 수 있는 장소와 상황", p: [`사주에서 읽는 관계 성향(${spouseGod})을 일상적인 만남의 접점으로 풀어보면, ${meet.place}처럼 공통 관심사나 지인이 있는 곳을 살펴볼 만합니다.`, `만남의 계기: ${meet.scene}.`, `먼저 해볼 행동: ${meet.action}`, "이는 실제 만남 장소나 시기를 예언하는 내용이 아니라, 새로운 사람을 만날 기회를 넓히기 위한 참고 아이디어입니다."] });
  s.push({ h: "5. 재물 흐름", p: [info[3], `오늘의 오행은 ${todayEl}입니다. 흐름을 안정시키는 습관: ${elInfo.habit}.`] });
  s.push({ h: "6. 직장 · 사업 · 학업", p: [info[4]] });
  s.push({ h: "7. 건강 관리", p: [`오늘의 ${todayEl} 기운은 ${elInfo.organ}과 연관됩니다. ${elInfo.over}`, `내게 부족한 ${ELEMS[needEl]} 기운을 채우는 습관: ${need.habit}.`] });
  s.push({ h: "8. 시간대별 핵심", list: [`좋은 시간: ${guin.join(", ")} — 도움과 귀인운이 비교적 좋은 시간대입니다.`, `조심할 시간: ${chungHour} — 오늘 일진과 충을 이루는 시간으로 말·결정·이동에 여유를 두세요.`] });
  s.push({ h: "9. 오늘의 행동 지침 · 기회 분석", list: [info[5], `행운 색 ${need.c}, 행운 방향 ${need.dir} — 부족한 기운을 보완하는 색과 방향입니다.`, `오늘의 기회: ${info[0]} — ${info[1].split('. ')[0].replace(/\.$/, '')}.`, `오늘 피할 것: ${AVOID[di.god]}.`] });
  const nx = [1, 2].map(k => { const ds = ymd(addDays(today, k)), x = dayInfo(dm, p.day.b, ds); return `${ds.slice(5).replace("-", "/")} ${label(x.T)}일 — '${x.god}'의 날, ${x.info[0]} (${x.avg}점)`; });
  s.push({ h: "10. 내일 · 모레 미리보기", list: nx });
  return { title: "오늘의 프리미엄 운세", subtitle: `${today} · ${label(T)}일`, sections: s, note: NOTE };
}

// ---------------------------------------------------------------- 월간 운세(30일)
function buildMonthly(person, start) {
  const { p, dm, es } = baseCore(person), rows = [], days = [];
  for (let i = 0; i < 30; i++) {
    const ds = ymd(addDays(start, i)), di = dayInfo(dm, p.day.b, ds), dt = new Date(ds + "T00:00:00Z");
    days.push({ ds, di, dt });
    rows.push([`${dt.getUTCMonth() + 1}/${dt.getUTCDate()}`, label(di.T), `${di.god}${di.r === "chung" ? "·충" : di.r === "hap" ? "·합" : ""}`, di.info[0] + (di.r === "chung" ? " (변동 주의)" : di.r === "hap" ? " (협력 좋음)" : ""), stars(di.avg)]);
  }
  const fmtD = x => x.ds.slice(5).replace("-", "/");
  const used = new Set();
  const top = (k, n = 3, asc = false) => {
    const pool = [...days].sort((a, b) => asc ? a.di.avg - b.di.avg : (k === "avg" ? b.di.avg - a.di.avg : b.di.sc[k] - a.di.sc[k]));
    const pick = pool.filter(x => !used.has(x.ds)).slice(0, n); pick.forEach(x => used.add(x.ds)); return pick.map(fmtD);
  };
  const GODS = ["비견", "겁재", "식신", "상관", "편재", "정재", "편관", "정관", "편인", "정인"];
  const weeks = [];
  for (let w = 0; w < 5; w++) {
    const part = days.slice(w * 7, w * 7 + 7); if (!part.length) break;
    const g = [0, 0, 0, 0, 0]; part.forEach(x => g[Math.floor(GODS.indexOf(x.di.god) / 2)]++);
    const mx = Math.max(...g), avg = Math.round(part.reduce((a, b) => a + b.di.avg, 0) / part.length);
    const best = [...part].sort((a, b) => b.di.avg - a.di.avg)[0], worst = [...part].sort((a, b) => a.di.avg - b.di.avg)[0];
    const bestG = Math.floor(GODS.indexOf(best.di.god) / 2);
    const gi = g[bestG] === mx ? bestG : g.indexOf(mx); // 동률이면 가장 좋은 날의 기운을 중심으로
    const mood = avg >= 77 ? "활기 있는" : avg <= 73 ? "차분히 점검하는" : "무난하게 흐르는";
    const tone = `${mood} 한 주입니다. 주된 기운은 ${GROUP[gi].n}입니다. ${GROUP[gi].t}`;
    weeks.push(`${w + 1}주차(${fmtD(part[0])}~${fmtD(part[part.length - 1])}, 평균 ${avg}점): ${tone} 좋은 날 ${fmtD(best)}(${best.di.god}), 주의할 날 ${fmtD(worst)}(${worst.di.god}).`);
  }
  return { title: "월간 운세", subtitle: `${start} 부터 30일`, sections: [
    { h: "1. 나의 기본 기운", table: pillarTable(p), p: [`일간 ${STEMS[dm]}(${ELEMS[STEM_EL[dm]]}) '${DM[dm][0]}' — ${DM[dm][1]}`, `오행 분포: ${es.text}`] },
    { h: "2. 이번 달 한눈에 보기", list: [`가장 좋은 날: ${top("avg").join(", ")}`, `재물이 움직이는 날: ${top(1).join(", ")}`, `인연·애정이 좋은 날: ${top(0).join(", ")}`, `직장·학업에 힘이 실리는 날: ${top(2).join(", ")}`, `조심할 날: ${top("avg", 3, true).join(", ")} — 큰 결정과 약속은 여유 있게 잡으세요.`] },
    { h: "3. 주차별 흐름", list: weeks },
    { h: "4. 날짜별 일진 달력", table: { head: ["날짜", "일진", "나에게는", "흐름", "운세"], rows } },
    { h: "5. 이번 달 활용법", list: [`좋은 날에는 중요한 만남·계약·발표를 배치하고, 조심할 날에는 휴식과 점검 위주로 일정을 짜 보세요.`, `부족한 기운 보완: ${es.lack.length ? es.lack.map(i => `${ELEMS[i]}(${EL[i].c}, ${EL[i].dir})`).join(" / ") : `${ELEMS[es.c.indexOf(Math.min(...es.c))]}(${EL[es.c.indexOf(Math.min(...es.c))].habit})`}`] }
  ], note: NOTE };
}

// ---------------------------------------------------------------- 평생 사주 리포트
function buildLifetime(person, year) {
  const { p, dm, es } = baseCore(person), g = godGroups(p), gi = g.indexOf(Math.max(...g)), lowG = g.indexOf(Math.min(...g));
  const spouseGod = tenGod(dm, BRANCH_MAIN_STEM[p.day.b]);
  const yrs = [];
  for (let i = 0; i < 10; i++) { const y = year + i, s = mod(y - 4, 10), b = mod(y - 4, 12); yrs.push([`${y}`, `${STEMS[s]}${BRANCHES[b]}년(${ANIMALS[b]}띠)`, tenGod(dm, s), YEARGOD[tenGod(dm, s)]]); }
  const wealthN = g[2];
  return { title: "평생 사주 리포트", subtitle: `${label(p.year)}년 ${label(p.month)}월 ${label(p.day)}일${p.hour ? " " + label(p.hour) + "시" : ""}`, sections: [
    { h: "1. 사주팔자 구성", table: pillarTable(p), p: [`양력 환산 생일: ${p.solar.join("-")}. 오행 분포: ${es.text}`] },
    { h: `2. 타고난 성향 — 일간 ${STEMS[dm]} '${DM[dm][0]}'`, p: [DM[dm][1], `강점: ${DM[dm][2]}`, `주의할 점: ${DM[dm][3]}`] },
    { h: "3. 오행의 균형", p: [es.lack.length ? `비어 있는 기운: ${es.lack.map(i => ELEMS[i]).join("·")}. ${es.lack.map(i => EL[i].lack).join(" ")}` : "다섯 기운이 고루 있어 균형이 좋은 편입니다.", `가장 강한 ${ELEMS[es.max]} 기운: ${EL[es.max].over}`, `생활 속 보완: 색 ${EL[es.lack.length ? es.lack[0] : es.c.indexOf(Math.min(...es.c))].c}, 방향 ${EL[es.lack.length ? es.lack[0] : es.c.indexOf(Math.min(...es.c))].dir}`] },
    { h: "4. 십성으로 보는 삶의 방식", p: [`십성 분포: 비겁 ${g[0]} · 식상 ${g[1]} · 재성 ${g[2]} · 관성 ${g[3]} · 인성 ${g[4]}`, `가장 두드러진 영역은 ${GROUP[gi].n}입니다. ${GROUP[gi].t}`, `상대적으로 약한 영역은 ${GROUP[lowG].n}입니다. 이 부분은 의식적으로 키울수록 균형이 잡힙니다.`] },
    { h: "5. 연애 · 결혼운", p: [`배우자 자리(일지 ${BRANCHES[p.day.b]})는 '${spouseGod}'의 기운입니다. ${SPOUSE[spouseGod]}`, `띠 기운으로 ${ANIMALS[p.year.b]}띠인 당신과 ${goodAnimals(p.year.b).join("·")}띠가 잘 맞는 편입니다.`] },
    { h: "6. 재물운", p: [wealthN === 0 ? "재성이 약해 돈을 직접 쫓기보다 재능·전문성으로 신뢰를 쌓아 수입으로 연결하는 방식이 맞습니다. 지출 구조를 단순하게 만드세요." : wealthN >= 3 ? "재성이 강해 돈의 흐름에 민감하고 기회도 많습니다. 벌 기회가 많은 만큼 지키는 규칙을 정해 두는 것이 중요합니다." : "재성이 적당해 노력한 만큼 꾸준히 쌓이는 재물운입니다. 큰 한 방보다 습관이 재물을 만듭니다."] },
    { h: "7. 직업 · 적성", p: [`${GROUP[gi].n} 중심의 사주로, ${GROUP[gi].job}에서 능력이 잘 발휘됩니다.`] },
    { h: `8. 앞으로 10년 세운 (${year}~${year + 9})`, table: { head: ["연도", "간지", "나에게는", "흐름"], rows: yrs } },
    { h: "9. 인생 조언", list: [`강점을 믿으세요: ${DM[dm][2]}.`, `주의: ${DM[dm][3]}`, "큰 결정은 컨디션이 좋은 날, 혼자 결정하지 말고 신뢰하는 사람과 한 번 점검하세요."] }
  ], note: NOTE + " 대운(10년 단위 큰 흐름)은 성별과 절입 시각 계산이 필요해 이 리포트에 포함하지 않았습니다." };
}


// ---------------------------------------------------------------- 결혼운·배우자 인연 프로젝트
function buildMarriage(person, year) {
  const { p, dm, es } = baseCore(person);
  const spouseGod = tenGod(dm, BRANCH_MAIN_STEM[p.day.b]);
  const years = [];
  for (let i = 0; i < 5; i++) {
    const y = year + i, stem = mod(y - 4, 10), branch = mod(y - 4, 12);
    const god = tenGod(dm, stem), relation = relOf(p.day.b, branch);
    const tone = relation === "hap" || relation === "samhap" ? "관계 확장·소개·약속을 돌아보기 좋은 테마" : relation === "chung" ? "관계의 기준과 생활 리듬을 점검하는 테마" : "관계의 기반과 자기 생활을 다지는 테마";
    years.push([String(y), `${STEMS[stem]}${BRANCHES[branch]}년`, god, tone]);
  }
  return { title: "결혼운 · 배우자 인연 리포트", subtitle: `${year}년부터 5년간의 관계 흐름 참고`, sections: [
    { h: "1. 내가 관계에서 중요하게 여기는 것", p: [`일간 ${STEMS[dm]}(${DM[dm][0]})의 기질은 ${DM[dm][1]}`, `강점은 ${DM[dm][2]}, 조심할 점은 ${DM[dm][3]}`] },
    { h: "2. 배우자 자리와 인연의 결", p: [`일지 ${BRANCHES[p.day.b]}의 본기 십성은 ${spouseGod}입니다. ${SPOUSE[spouseGod]}`, `오행 분포: ${es.text}. 관계에서 서로 다른 생활 방식과 속도를 존중하는 것이 중요합니다.`] },
    { h: "3. 인연을 만날 가능성을 넓히는 장소와 활동", p: [`관계 성향(${spouseGod})에 어울리는 접점은 ${MEET_PROFILE[spouseGod].place}입니다.`, `자연스러운 연결 장면은 ${MEET_PROFILE[spouseGod].scene}.`, `실천 팁: ${MEET_PROFILE[spouseGod].action}`], list: ["관심 있는 활동을 일정에 실제로 넣고, 한 번으로 끝내지 말고 반복해서 참여하기", "친구에게 소개를 부탁할 때 원하는 관계의 기준을 간단히 설명하기", "새로운 만남은 서로의 동의·안전·생활 조건을 확인하며 천천히 진행하기"] },
    { h: "4. 앞으로 5년의 관계 테마", table: { head: ["연도", "세운", "십성", "살펴볼 주제"], rows: years } },
    { h: "5. 결혼을 준비할 때 확인할 현실 조건", list: ["돈 관리 방식과 부채·저축 계획을 투명하게 이야기하기", "자녀·주거·가족 돌봄에 대한 생각을 미리 나누기", "갈등이 생겼을 때 대화하고 회복하는 방식을 확인하기", "결혼 시기를 운세만으로 정하지 말고 두 사람의 합의와 현실 여건을 우선하기"] },
    { h: "6. 나에게 맞는 인연을 알아보는 질문", list: ["함께 있을 때 나답게 말하고 행동할 수 있는가?", "말보다 행동으로 신뢰를 쌓는 사람인가?", "서로의 일·친구·취미와 개인 시간을 존중하는가?"] }
  ], note: NOTE + " 결혼 시점이나 배우자의 외모·신원을 확정적으로 예언하지 않습니다. 이 콘텐츠는 관계를 돌아보는 참고 자료입니다." };
}

// ---------------------------------------------------------------- 직업·이직·사업 프로젝트
function buildCareer(person, year) {
  const { p, dm } = baseCore(person), g = godGroups(p);
  const names = ["비겁", "식상", "재성", "관성", "인성"];
  const strongest = g.indexOf(Math.max(...g)), weakest = g.indexOf(Math.min(...g));
  const options = GROUP[strongest], rows = [];
  for (let i = 0; i < 5; i++) {
    const y = year + i, stem = mod(y - 4, 10), god = tenGod(dm, stem);
    const focus = ["협업·독립성", "기술·표현·포트폴리오", "성과·수익 구조", "책임·직책·평가", "학습·자격·전문성"][["비견","겁재"].includes(god) ? 0 : ["식신","상관"].includes(god) ? 1 : ["편재","정재"].includes(god) ? 2 : ["편관","정관"].includes(god) ? 3 : 4];
    rows.push([String(y), god, focus]);
  }
  return { title: "직업 · 이직 · 사업운 리포트", subtitle: `${year}년 기준 5년 커리어 테마`, sections: [
    { h: "1. 타고난 일하는 방식", p: [`일간 ${STEMS[dm]}(${DM[dm][0]}): ${DM[dm][1]}`, `강점: ${DM[dm][2]}`, `주의점: ${DM[dm][3]}`] },
    { h: "2. 강점이 살아나는 업무 환경", p: [`십성 그룹 분포: ${names.map((n,i)=>`${n} ${g[i]}`).join(" · ")}`, `${options.n} 기운이 상대적으로 두드러집니다. ${options.t}`, `어울리는 업무 방향: ${options.job}`] },
    { h: "3. 보완하면 좋은 역량", p: [`상대적으로 적은 영역은 ${names[weakest]}입니다. ${GROUP[weakest].t}`, "약점을 단정하기보다 체크리스트·협업 파트너·교육으로 보완할 수 있는 기술을 찾아보세요."] },
    { h: "4. 앞으로 5년의 커리어 테마", table: { head: ["연도", "세운 십성", "점검할 주제"], rows } },
    { h: "5. 이직·창업 전 현실 점검", list: ["최소 3~6개월 생활비와 비상자금 확인", "현재 직무에서 쌓은 성과를 수치와 사례로 정리", "새 조직·시장·고객에 대한 정보와 계약 조건 검토", "운세 결과만으로 퇴사·투자·대출을 결정하지 않기"] }
  ], note: NOTE + " 취업·이직·투자 결과를 보장하지 않습니다. 중요한 결정은 실제 조건과 전문가 조언을 함께 검토하세요." };
}


// ---------------------------------------------------------------- 연애 집중 리포트
function buildLove(person, year) {
  const { p, dm, es } = baseCore(person), spouseGod = tenGod(dm, BRANCH_MAIN_STEM[p.day.b]);
  const themes = [];
  for (let i = 0; i < 6; i++) {
    const y = year + i, stem = mod(y - 4, 10), branch = mod(y - 4, 12), reln = relOf(p.day.b, branch);
    themes.push([`${y}년`, tenGod(dm, stem), reln === "hap" || reln === "samhap" ? "관계 확장·새로운 만남을 돌아보는 해" : reln === "chung" ? "관계의 경계와 기대를 점검하는 해" : "나의 기준과 생활 리듬을 다지는 해"]);
  }
  return { title: "연애 집중 리포트", subtitle: "나의 관계 패턴과 건강한 인연 만들기", sections: [
    { h: "1. 사랑할 때 드러나는 나의 기질", p: [`일간 ${STEMS[dm]}(${DM[dm][0]}): ${DM[dm][1]}`, `관계에서 발휘되는 강점: ${DM[dm][2]}`, `반복되기 쉬운 주의점: ${DM[dm][3]}`] },
    { h: "2. 배우자 자리로 보는 관계의 테마", p: [`일지 ${BRANCHES[p.day.b]}의 본기 십성은 ${spouseGod}입니다. ${SPOUSE[spouseGod]}`, `오행 분포는 ${es.text}입니다. 서로 다른 표현 방식을 존중하고 확인하는 대화가 중요합니다.`] },
    { h: "3. 솔로라면 살펴볼 만남의 접점", list: ["친구·동료의 소개처럼 서로의 기본 정보를 확인할 수 있는 자리", "취미·운동·배움처럼 공통 관심사가 자연스럽게 생기는 모임", "온라인에서는 속도보다 신뢰와 안전을 우선하고 개인정보를 서두르지 않기"] },
    { h: "4. 나에게 잘 맞는 만남 장소와 장면", p: [`배우자 자리의 관계 테마(${spouseGod})를 생활 속 접점으로 바꾸면 ${MEET_PROFILE[spouseGod].place}를 우선 살펴볼 만합니다.`, `예상해 볼 수 있는 만남의 장면: ${MEET_PROFILE[spouseGod].scene}.`, `첫 대화를 여는 방법: ${MEET_PROFILE[spouseGod].action}`], list: ["한 번 방문하고 결과를 기대하기보다 관심 있는 모임을 3~4회 꾸준히 참여해 보세요.", "소개를 받을 때는 상대의 동의와 기본 정보를 존중하고, 첫 만남은 사람이 많은 공공장소에서 진행하세요.", "상대의 외모·직업·나이·실제 신원을 사주만으로 특정할 수는 없습니다."] },
    { h: "5. 연애 중이라면 점검할 대화", list: ["서운함을 평가나 비난 대신 구체적인 상황과 감정으로 말하기", "연락 빈도·개인 시간·돈 관리 등 생활 기준을 서로 확인하기", "갈등이 생겼을 때 잠시 쉬고 다시 이야기할 약속을 정하기"] },
    { h: "6. 앞으로 6년의 관계 테마", table: { head: ["연도", "십성", "관계에서 살펴볼 주제"], rows: themes } },
    { h: "7. 나에게 던지는 세 가지 질문", list: ["나는 어떤 순간에 존중받는다고 느끼는가?", "상대에게 바라는 것을 나도 행동으로 보여주고 있는가?", "설렘과 별개로 안전하고 편안한 관계인가?"] }
  ], note: NOTE + " 특정 인물과의 만남, 상대의 외모·신원 또는 연애 성사를 예언하지 않습니다." };
}

// ---------------------------------------------------------------- 재물·사업 리포트
function buildWealth(person, year) {
  const { p, dm, es } = baseCore(person), g = godGroups(p), wealth = g[2], rows = [];
  for (let i = 0; i < 6; i++) {
    const y = year + i, stem = mod(y - 4, 10), god = tenGod(dm, stem);
    rows.push([`${y}년`, god, ["비용 구조와 협업 방식 점검", "성과를 수익으로 연결하는 방법 찾기", "현금흐름과 계약 조건 점검", "책임·규정·세금 관련 기본 확인", "기술·자격·전문성에 투자"][(["비견","겁재"].includes(god)?0:["식신","상관"].includes(god)?1:["편재","정재"].includes(god)?2:["편관","정관"].includes(god)?3:4)]]);
  }
  const wealthText = wealth >= 3 ? "재성 기운이 상대적으로 두드러집니다. 수입 기회뿐 아니라 지출·위험 관리 규칙을 함께 세우는 것이 좋습니다." : wealth === 0 ? "재성 기운이 상대적으로 적게 나타납니다. 전문성·기술·신뢰를 쌓아 수익으로 연결하는 구조를 고민해 보세요." : "재성 기운이 중간 정도입니다. 단기 성과보다 꾸준한 현금흐름과 저축 습관을 점검해 보세요.";
  return { title: "재물 · 사업 전략 리포트", subtitle: `${year}년 기준 재정 습관과 일의 방향`, sections: [
    { h: "1. 나의 재물 테마", p: [`십성 분포 중 재성은 ${wealth}입니다. ${wealthText}`, `오행 분포: ${es.text}`, `일간 ${STEMS[dm]}(${DM[dm][0]}): ${DM[dm][1]}`] },
    { h: "2. 수입을 만드는 나의 강점", p: [`강점: ${DM[dm][2]}`, `일하는 방식: ${GROUP[g.indexOf(Math.max(...g))].n} 기운이 상대적으로 두드러집니다. ${GROUP[g.indexOf(Math.max(...g))].job}`] },
    { h: "3. 지출·저축 점검 루틴", list: ["고정비·변동비·비정기 지출을 구분해 기록하기", "비상자금과 단기 목표 자금을 분리하기", "고금리 부채와 자동결제를 정기적으로 점검하기", "큰 지출은 하루 이상 숙려하고 비교 견적을 확인하기"] },
    { h: "4. 사업·부업을 고민한다면", list: ["고객이 실제로 비용을 지불할 문제인지 먼저 검증하기", "초기 고정비를 낮추고 작은 실험으로 수요 확인하기", "동업·외주·납품은 역할과 정산 조건을 문서로 남기기", "세금·인허가·개인정보 등 업종별 의무를 확인하기"] },
    { h: "5. 앞으로 6년의 재정·커리어 테마", table: { head: ["연도", "십성", "점검 주제"], rows } },
    { h: "6. 현실적인 실행 계획", list: ["이번 주: 최근 한 달 지출 내역을 분류하기", "이번 달: 줄일 수 있는 고정비 한 가지 정하기", "3개월: 수입을 높일 기술·고객·상품 실험 하나 실행하기"] }
  ], note: NOTE + " 수익·투자 성과를 보장하지 않습니다. 투자·대출·세무 결정은 객관적 자료와 자격 있는 전문가의 조언을 우선하세요." };
}

// ---------------------------------------------------------------- 궁합
function buildCompat(a, b, start) {
  const A = pillars(a), B = pillars(b), da = A.day.s, db = B.day.s;
  const ea = elementSummary(A), eb = elementSummary(B);
  const stemR = rel.stemHap(da, db) ? "천간합" : STEM_EL[da] === STEM_EL[db] ? "같은 오행" : mod(STEM_EL[db] - STEM_EL[da], 5) === 1 || mod(STEM_EL[da] - STEM_EL[db], 5) === 1 ? "상생" : "상극";
  const brR = relOf(A.day.b, B.day.b), yrR = relOf(A.year.b, B.year.b);
  let score = 62 + ({ 천간합: 10, "같은 오행": 4, 상생: 6, 상극: -3 })[stemR] + ({ hap: 12, samhap: 8, chung: -10, none: 0 })[brR] + ({ hap: 5, samhap: 4, chung: -5, none: 0 })[yrR];
  const comp = ea.lack.filter(i => eb.c[i] > 0).length + eb.lack.filter(i => ea.c[i] > 0).length;
  score = clamp(score + comp * 3);
  const STEMTXT = { 천간합: "두 일간이 합을 이루어 자연스럽게 끌리고 서로의 부족한 면을 채워 줍니다.", "같은 오행": "비슷한 기질이라 말이 잘 통하고 편하지만 같은 약점이 겹칠 수 있습니다.", 상생: "한쪽이 다른 쪽을 북돋는 관계로 서로 성장에 도움이 됩니다.", 상극: "서로 다른 방식이 부딪힐 수 있지만 자극이 되어 보완이 되기도 합니다. 존중이 핵심입니다." };
  const BRTXT = { hap: "일지(배우자 자리)가 합을 이루어 정서적으로 편안하고 오래 이어지기 쉬운 궁합입니다.", samhap: "일지가 삼합 관계로 목표를 함께 세우면 큰 힘이 되는 조합입니다.", chung: "일지가 충을 이루어 감정의 파도가 큰 편입니다. 다툼이 생겨도 시간을 두고 대화하는 규칙이 중요합니다.", none: "일지에 특별한 충돌이나 합이 없어 노력하는 만큼 만들어 가는 관계입니다." };
  const months = []; for (let i = 0; i < 6; i++) { const d = addDays(start, i * 30); const mp = pillars({ birthDate: ymd(d), calendar: "solar", birthTime: "unknown" }); const mb = mp.month.b; let v = 0; [A.day.b, B.day.b].forEach(x => { if (rel.hap(mb, x) || rel.samhap(mb, x)) v++; if (rel.chung(mb, x)) v--; }); months.push([`${d.getUTCFullYear()}년 ${d.getUTCMonth() + 1}월경`, v > 0 ? "함께하면 좋은 시기" : v < 0 ? "조심할 시기" : "무난한 시기"]); }
  const advice = [];
  if (brR === "chung" || stemR === "상극") advice.push("서운함은 쌓지 말고 그날 안에 짧게라도 말하세요. 해결보다 먼저 '들었다'는 표현이 필요합니다.");
  advice.push(`${DM[da][0]} 성향의 첫째 분은 ${DM[da][3]} 둘째 분은 ${DM[db][3]}`);
  advice.push(`서로의 부족한 오행을 채우는 활동이 좋습니다: 첫째 ${ea.lack.length ? ea.lack.map(i => ELEMS[i]).join("·") : "고름"}, 둘째 ${eb.lack.length ? eb.lack.map(i => ELEMS[i]).join("·") : "고름"}.`);
  return { title: "궁합 분석", subtitle: `궁합 점수 ${score}점`, sections: [
    { h: "1. 두 사람의 사주 요약", table: { head: ["", "나", "상대"], rows: [["일주", label(A.day), label(B.day)], ["띠", ANIMALS[A.year.b], ANIMALS[B.year.b]], ["일간 성향", `${STEMS[da]} ${DM[da][0]}`, `${STEMS[db]} ${DM[db][0]}`], ["오행 분포", ea.text, eb.text]] } },
    { h: "2. 성향 비교", p: [`나: ${DM[da][1]} (강점 ${DM[da][2]})`, `상대: ${DM[db][1]} (강점 ${DM[db][2]})`, `일간 관계(${stemR}): ${STEMTXT[stemR]}`] },
    { h: "3. 애정 궁합", p: [BRTXT[brR], `띠 관계: ${ANIMALS[A.year.b]}띠와 ${ANIMALS[B.year.b]}띠는 ${relKo[yrR]} 관계입니다.`, `오행 보완도: 서로의 빈 기운을 채워 주는 항목 ${comp}개`] },
    { h: "4. 갈등 요인과 관계 조언", list: advice },
    { h: "5. 함께하면 좋은 시기", table: { head: ["시기", "흐름"], rows: months } }
  ], note: NOTE + " 상대방의 정보는 본인 동의를 받은 경우에만 입력해야 합니다." };
}


// ---------------------------------------------------------------- 미래 연대기: 선택한 미래 시점의 세운을 생활 영역별로 풀어보는 리포트
function buildFuture(person, year, horizon, fullPackage = false) {
  const { p, dm, es } = baseCore(person);
  const targetYear = year + horizon;
  const points = fullPackage ? Array.from({length:20}, (_,i)=>i+1)
    : horizon <= 3 ? Array.from({length:horizon}, (_,i)=>i+1)
    : horizon <= 5 ? [1,2,3,4,5] : [1,2,3,5,10,15,20].filter((v,i,a)=>v<=horizon&&a.indexOf(v)===i);
  const rows = points.map(n => {
    const y = year + n, stem = mod(y - 4, 10), branch = mod(y - 4, 12);
    const god = tenGod(dm, stem), relation = relOf(p.day.b, branch);
    const relationText = relation === "hap" || relation === "samhap" ? "관계와 협력의 접점을 살펴볼 시기"
      : relation === "chung" ? "변화에 대비하고 생활의 균형을 점검할 시기"
      : "기반을 다지고 꾸준함을 쌓을 시기";
    return [String(y), `${STEMS[stem]}${BRANCHES[branch]}년`, god, YEARGOD[god], relationText];
  });
  const stem = mod(targetYear - 4, 10), branch = mod(targetYear - 4, 12);
  const god = tenGod(dm, stem), relation = relOf(p.day.b, branch);
  const tone = YEARGOD[god];
  const relationTone = relation === "hap" || relation === "samhap"
    ? "사람과 협력, 소개, 관계 확장을 주제로 삼아볼 만한 해입니다."
    : relation === "chung"
      ? "변화가 생겼을 때 무리하게 버티기보다 우선순위와 생활 리듬을 재정비하는 해로 해석할 수 있습니다."
      : "눈에 띄는 변화보다 기본기를 다지고 꾸준히 쌓아가는 태도가 도움이 되는 해입니다.";
  const spouseGod = tenGod(dm, BRANCH_MAIN_STEM[p.day.b]);
  const meet = MEET_PROFILE[spouseGod];
  const sections = [
    { h: "1. 나의 사주 기본 구성", table: pillarTable(p), p: [`일간 ${STEMS[dm]}(${ELEMS[STEM_EL[dm]]}) '${DM[dm][0]}'의 기질을 바탕으로 ${horizon}년 뒤의 흐름을 살펴봅니다.`, `오행 분포: ${es.text}. ${es.lack.length ? `생활에서 ${es.lack.map(i=>ELEMS[i]).join("·")} 기운을 보완하는 습관을 참고하세요.` : "균형을 유지하는 생활 리듬이 중요합니다."}`] },
    { h: `2. ${targetYear}년의 핵심 테마`, p: [`해의 십성은 ${god}입니다. ${tone}`, relationTone, "사주 해석은 가능성과 주제를 살펴보는 전통적 관점이며 특정 사건이나 결과를 보장하지 않습니다."] },
    { h: "3. 연애 · 인연의 흐름", p: [`배우자 자리의 관계 성향은 ${spouseGod}입니다. ${SPOUSE[spouseGod]}`, `새로운 관계의 접점을 넓히고 싶다면 ${meet.place}처럼 관심사를 공유할 수 있는 환경을 고려해 보세요.`, `실천 팁: ${meet.action}`, "현재 관계가 있다면 상대를 운세에 맞추기보다 실제 대화와 상호 존중을 기준으로 관계를 살펴보세요."] },
    { h: "4. 재물 · 자산 관리", p: [god === "정재" || god === "편재" ? "재성의 관점에서는 수입 기회뿐 아니라 지출과 위험 관리의 균형을 함께 살펴볼 시기입니다." : "재물은 운세만으로 판단하지 말고 전문성과 소득 구조, 저축 습관을 함께 키우는 방향이 좋습니다.", "큰 투자·대출·계약은 운세 결과만으로 결정하지 말고 객관적인 자료와 전문가 조언을 확인하세요.", "장기 목표를 세우고 비상자금, 부채, 고정지출을 주기적으로 점검해 보세요."] },
    { h: "5. 직업 · 사업 · 성장", p: [`${GROUP[god === "정관" || god === "편관" ? 3 : god === "식신" || god === "상관" ? 1 : god === "정재" || god === "편재" ? 2 : god === "정인" || god === "편인" ? 4 : 0].job} 같은 분야에서 자신의 강점을 어떻게 활용할지 생각해 볼 수 있습니다.`, "이직·창업·진학 등 큰 선택은 준비 기간과 현실적인 조건을 먼저 점검하고 작은 실험으로 검증하세요."] },
    { h: "6. 인간관계 · 귀인", p: [`${relationTone} 특히 서로의 역할과 기대를 분명히 하는 대화가 관계를 안정시키는 데 도움이 됩니다.`, "도움이 되는 사람을 기다리기보다 관심 분야의 모임, 배움, 협업에 참여해 연결의 폭을 넓혀 보세요."] },
    { h: "7. 그 시기를 준비하는 행동", list: ["1년 단위 목표를 작게 나누고 분기마다 점검하기", "건강·재정·관계 중 한 가지를 우선순위로 정해 꾸준히 관리하기", "중요한 선택은 운세 외에 실제 정보와 신뢰할 수 있는 사람의 의견을 함께 확인하기"] },
    { h: `8. ${year}년부터 ${targetYear}년까지의 미래 흐름`, table: { head: ["연도", "간지", "핵심 십성", "연간 테마", "관계 흐름"], rows } }
  ];
  return { title: fullPackage ? "20년 전체 미래 연대기 종합판" : `${horizon}년 뒤 나의 미래 연대기`, subtitle: fullPackage ? `${year}년부터 ${targetYear}년까지 20년의 연도별 흐름` : `${year}년을 기준으로 살펴보는 ${targetYear}년의 장기 흐름`, sections, note: NOTE + " 장기 미래 해석은 전통 명리의 연도별 상징을 바탕으로 한 참고 콘텐츠입니다. 실제 사건·재산·결혼·건강 상태를 예측하거나 보장하지 않습니다." };
}

const NOTE = "이 리포트는 전통 명리(사주) 이론을 바탕으로 한 참고·오락용 해석입니다. 미래를 확정하거나 보장하지 않으며 의료·법률·투자 등 전문적 판단을 대체하지 않습니다. 절기 경계 생일은 계산 오차가 있을 수 있고, 음력은 평달만 지원합니다.";

function build(productId, person, opts = {}) {
  const today = opts.today;
  if (productId === "daily") return buildDaily(person, today);
  if (productId === "monthly") return buildMonthly(person, today);
  if (productId === "lifetime") return buildLifetime(person, Number(today.slice(0, 4)));
  if (productId === "compat") return buildCompat(person, opts.partner, today);
  if (productId === "marriage") return buildMarriage(person, Number(today.slice(0, 4)));
  if (productId === "career") return buildCareer(person, Number(today.slice(0, 4)));
  if (productId === "love") return buildLove(person, Number(today.slice(0, 4)));
  if (productId === "wealth") return buildWealth(person, Number(today.slice(0, 4)));
  const futureMatch = /^future_(1|2|3|5|10|15|20|all)$/.exec(productId);
  if (futureMatch) return buildFuture(person, Number(today.slice(0, 4)), futureMatch[1] === "all" ? 20 : Number(futureMatch[1]), futureMatch[1] === "all");
  throw new Error("unknown product");
}
module.exports = { build };
