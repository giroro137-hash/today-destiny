const assert = require('node:assert/strict');
const { build } = require('../src/premium');
const { makeReading } = require('../src/reading');
const characters = require('../src/characters');
const { products: orderProducts } = require('../src/orders');
const person = { birthDate: '1995-06-15', calendar: 'solar', birthTime: 'unknown' };
const today = '2026-11-04';
const products = ['daily', 'monthly', 'lifetime', 'marriage', 'career', 'love', 'wealth', 'future_1', 'future_2', 'future_3', 'future_5', 'future_10', 'future_15', 'future_20', 'future_all'];
for (const id of products) {
  const report = build(id, person, { today });
  assert.ok(report.title, `${id}: title missing`);
  assert.ok(Array.isArray(report.sections) && report.sections.length >= 4, `${id}: sections missing`);
  assert.ok(report.note, `${id}: disclaimer missing`);
  if (['daily','marriage','love'].includes(id)) assert.ok(report.sections.some(x => /장소|접점/.test(x.h)), `${id}: meeting-place guidance missing`);
  if (id.startsWith('future_')) { assert.ok(report.title.includes('미래 연대기'), `${id}: future title missing`); assert.ok(report.sections.some(x => /연애/.test(x.h)), `${id}: love analysis missing`); assert.ok(report.sections.some(x => /재물/.test(x.h)), `${id}: wealth analysis missing`); assert.ok(orderProducts[id], `${id}: checkout product missing`); }
}
const reading = makeReading(person);
for (const key of ['message', 'scores', 'lucky', 'flow', 'love', 'wealth', 'work', 'health', 'actions']) assert.ok(reading[key], `free reading ${key} missing`);
const female = characters.teaser(person, 'f')[0];
const male = characters.teaser(person, 'm')[0];
assert.ok(female.mosaic && female.meet && female.approach, 'female teaser fields missing');
assert.ok(male.mosaic && male.meet && male.approach, 'male teaser fields missing');
assert.notEqual(female.mosaic, male.mosaic, 'gender-specific character preview should differ');
assert.ok(characters.reveal(person, 'test-order', 'f').cards[0].image.includes('f_'), 'female reveal should select female character');
assert.ok(characters.reveal(person, 'test-order', 'm').cards[0].image.includes('m_'), 'male reveal should select male character');
assert.equal(orderProducts.future_all.amount, 29900, 'future bundle price missing');
console.log(`Smoke test passed: ${products.length} premium reports + 20-year future timeline + free reading + meeting guidance + gender-specific character previews.`);
