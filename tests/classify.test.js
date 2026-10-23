import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classify, isRelevant, TOPICS, AFFECTS } from '../src/feed/classify.js';

test('tags GST and e-commerce topics and the online-seller audience', () => {
  const { topics, affects } = classify('GST Rule 14B: Interstate E-Commerce Sales Without Physical Office');
  assert.ok(topics.includes('gst'));
  assert.ok(topics.includes('consumer-ecommerce'));
  assert.ok(affects.includes('ecommerce'));
});

test('tags labour, companies, trade and data topics', () => {
  assert.ok(classify('EPFO ECR deadline October 31 for employers').topics.includes('labour'));
  assert.ok(classify('MCA amends Companies (Accounts) Rules').topics.includes('companies'));
  assert.ok(classify('DGFT notifies RoDTEP rates for exporters').topics.includes('trade'));
  assert.ok(classify('MeitY issues DPDP consent manager guidelines').topics.includes('data-digital'));
});

test('keeps actionable items and drops noise', () => {
  const keep = (t, pub = 'Business Standard', kind = 'news') => isRelevant(t, '', classify(t).topics, pub, kind);
  assert.equal(keep('CBDT notifies new Form 141 for TDS'), true);
  assert.equal(keep('Sensex jumps 500 points as GST collections rise'), false, 'market noise');
  assert.equal(keep('Section 54F Addition Deleted by ITAT Rajkot'), false, 'case law');
  assert.equal(keep('Income Tax: ₹26 Lakh Loan Addition Deleted as Repayment Proved Genuine: ITAT'), false, 'case-law tail');
  assert.equal(keep('GST Council clarifies ITC rules: notification issued after tribunal ruling'), true, 'actionable despite court word');
  assert.equal(keep('Swiggy shares plunge 17% after Q2 results'), false, 'company stock news');
  assert.equal(keep('Startup raises $15 Mn Series A to expand'), false, 'funding round');
  assert.equal(keep('Carney budget to help small businesses', 'National Post', 'gnews'), false, 'foreign publisher');
  assert.equal(keep('MSME loans to bridge N13trn funding gap', 'The Sun Nigeria', 'gnews'), false, 'foreign publisher with Indian keyword');
  assert.equal(keep('Government to bear certification cost for MSME exporters: Goyal', 'Mid-Day', 'gnews'), true, 'Indian publisher');
  assert.equal(keep('Small businesses need to know they matter', 'The Leadville Herald', 'gnews'), false, 'unknown foreign publisher without India marker');
  assert.equal(keep('India-New Zealand FTA takes effect for Indian exporters', 'RNZ', 'gnews'), true, 'India named in title');
});

test('state-only matches are not enough', () => {
  const t = 'Industrial policy announced';
  const topics = classify(t).topics;
  assert.deepEqual(topics, ['state']);
  assert.equal(isRelevant(t, '', topics), false);
});

test('every topic and audience has a label and a regex', () => {
  for (const t of TOPICS) { assert.ok(t.label && t.re instanceof RegExp, t.id); }
  for (const a of AFFECTS) { assert.ok(a.label && a.re instanceof RegExp, a.id); }
});
