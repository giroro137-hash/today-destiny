// src/reading.js

/**
 * 생년월일시를 받아 만세력 기준 간지(연, 월, 일, 시)를 계산하는 함수
 */
function calculateSaju(birthDateTime) {
  const date = new Date(birthDateTime);
  
  // 실제 사주 계산 엔진 (MVP 단계 예시 데이터)
  return {
    year: "경오 (庚午)",
    month: "무자 (戊子)",
    day: "갑자 (甲子)",
    time: "병인 (丙寅)",
    solarDate: birthDateTime
  };
}

/**
 * 4종 프리미엄 리포트 텍스트 생성기
 */
function generatePremiumReports(sajuResult) {
  return {
    totalFortune: `${sajuResult.year}년생 기반 총운 리포트 내용입니다. 올 한해 뜻하는 바를 이루는 운기입니다.`,
    wealthFortune: `${sajuResult.day} 일간을 중심으로 한 재물운 리포트입니다. 금전 흐름이 안정적입니다.`,
    loveFortune: `애정운 및 대인관계 리포트입니다. 주변 사람들과의 소통이 중요합니다.`,
    careerFortune: `직장 및 사업운 리포트입니다. 새로운 도전에 유리한 시기입니다.`
  };
}

module.exports = {
  calculateSaju,
  generatePremiumReports
};

