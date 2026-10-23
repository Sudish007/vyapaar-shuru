// Source registry for the Updates feed. Adding a source = adding one entry.
// kind: official (regulator feed) | news (publisher RSS) | gnews (Google News RSS query).
// Google News links open through news.google.com and land on the publisher; titles carry
// "Headline - Publisher", which the parser splits. Every source is health-tracked in data/meta.json.

const gnews = (id, name, query, topicHint) => ({
  id,
  name,
  kind: 'gnews',
  url: `https://news.google.com/rss/search?q=${encodeURIComponent(query + ' when:21d')}&hl=en-IN&gl=IN&ceid=IN:en`,
  homepage: 'https://news.google.com/?hl=en-IN&gl=IN&ceid=IN:en',
  topicHint,
});

// RBI publishes a lot of bank-prudential material; keep only what touches a business owner.
const RBI_FOUNDER_TERMS = /\b(fema|foreign exchange|export|import|remittance|lrs|liberali[sz]ed|overseas|fdi|odi|payment|upi|aggregator|gateway|msme|small business|startup|kyc|current account|loan|credit|lending|compounding|ecb|nbfc|p2p|prepaid|card|tokeni|fintech|sandbox|rupee|invoic|trade|merchant|settlement|cross-?border|customer|complaint|ombudsman|digital)\b/i;

// Personal-finance feeds: keep only business/compliance angles.
const BUSINESS_TERMS = /\b(business(es)?|startups?|msme|gst|tds|tcs|freelanc\w*|self-?employed|proprietor\w*|compan(y|ies)|llp|audit|itr-?[34]|presumptive|export\w*|import\w*|professional|employers?|payroll|epfo|esic|invoice|udyam|trademark|fema|remittance|form \d+|section \d+|tax year|income-tax act|notification|circular|deadline|due date)\b/i;
// Startup-ecosystem feeds: keep policy/regulatory items, not funding rounds and product launches.
const REGULATORY_TERMS = /\b(gst|tax|dpiit|startup india|policy|regulat\w*|rbi|sebi|mca|government|govt|ministry|minister|scheme|rules?|compliance|fema|fdi|esops?|angel tax|fund of funds|seed fund|budget|law|court|ban|licen[cs]e|dpdp|data protection|labour|epfo|customs|dgft|export|import|cert-in|meity|ccpa|consumer|notification|circular)\b/i;

export const SOURCES = [
  // Official regulator feeds
  { id: 'rbi-press', name: 'RBI press releases', kind: 'official', url: 'https://www.rbi.org.in/pressreleases_rss.xml', homepage: 'https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx', topicHint: 'rbi-fema', include: RBI_FOUNDER_TERMS },
  { id: 'rbi-notifications', name: 'RBI notifications', kind: 'official', url: 'https://www.rbi.org.in/notifications_rss.xml', homepage: 'https://www.rbi.org.in/Scripts/NotificationUser.aspx', topicHint: 'rbi-fema', include: RBI_FOUNDER_TERMS },

  // Publisher feeds (free RSS)
  { id: 'et-smallbiz', name: 'Economic Times · Small Biz', kind: 'news', url: 'https://economictimes.indiatimes.com/small-biz/rssfeeds/5575607.cms', homepage: 'https://economictimes.indiatimes.com/small-biz' },
  { id: 'et-policy', name: 'Economic Times · Policy', kind: 'news', url: 'https://economictimes.indiatimes.com/news/economy/policy/rssfeeds/1286551815.cms', homepage: 'https://economictimes.indiatimes.com/news/economy/policy' },
  { id: 'et-wealth', name: 'Economic Times · Wealth & tax', kind: 'news', url: 'https://economictimes.indiatimes.com/wealth/rssfeeds/837555174.cms', homepage: 'https://economictimes.indiatimes.com/wealth', include: BUSINESS_TERMS },
  { id: 'et-startups', name: 'Economic Times · Startups', kind: 'news', url: 'https://economictimes.indiatimes.com/tech/startups/rssfeeds/78570561.cms', homepage: 'https://economictimes.indiatimes.com/tech/startups', include: REGULATORY_TERMS },
  { id: 'bs-economy', name: 'Business Standard · Economy & policy', kind: 'news', url: 'https://www.business-standard.com/rss/economy-policy-10201.rss', homepage: 'https://www.business-standard.com/economy' },
  { id: 'mint-money', name: 'Mint · Money', kind: 'news', url: 'https://www.livemint.com/rss/money', homepage: 'https://www.livemint.com/money', include: BUSINESS_TERMS },
  { id: 'inc42', name: 'Inc42', kind: 'news', url: 'https://inc42.com/feed/', homepage: 'https://inc42.com/', include: REGULATORY_TERMS },
  { id: 'yourstory', name: 'YourStory', kind: 'news', url: 'https://yourstory.com/feed', homepage: 'https://yourstory.com/', include: REGULATORY_TERMS },
  { id: 'bl-economy', name: 'BusinessLine · Economy', kind: 'news', url: 'https://www.thehindubusinessline.com/economy/feeder/default.rss', homepage: 'https://www.thehindubusinessline.com/economy/', note: 'Cloudflare-served; may fail from GitHub runners' },
  { id: 'taxguru', name: 'TaxGuru', kind: 'news', url: 'https://taxguru.in/feed/', homepage: 'https://taxguru.in/', note: 'Cloudflare-served; may fail from GitHub runners' },

  // Google News queries (cover portals with no machine-readable feed: GST portal, CBIC, MCA, DGFT, Startup India, FSSAI, MeitY)
  gnews('gnews-gst', 'Google News · GST', '"GST" (notification OR circular OR council OR CBIC OR GSTN OR "input tax credit" OR "e-invoice")', 'gst'),
  gnews('gnews-income-tax', 'Google News · Income tax', '("income tax" OR CBDT OR "Income-tax Act") (notification OR circular OR TDS OR ITR OR "tax audit" OR startups OR business)', 'income-tax'),
  gnews('gnews-mca', 'Google News · MCA & companies', '("Ministry of Corporate Affairs" OR MCA OR "Companies Act" OR LLP) (notification OR amendment OR rules OR circular OR compliance)', 'companies'),
  gnews('gnews-startup', 'Google News · Startup India', '("Startup India" OR DPIIT OR "recognised startups" OR "Fund of Funds" OR "seed fund scheme")', 'startup-india'),
  gnews('gnews-msme', 'Google News · MSME', '(MSME OR Udyam OR CGTMSE OR Mudra OR PMEGP OR "small businesses") (scheme OR government OR ministry OR loan OR notification)', 'msme'),
  gnews('gnews-trade', 'Google News · Trade & customs', '(DGFT OR "foreign trade policy" OR exporters OR "customs duty" OR CBIC OR "free trade agreement" OR RoDTEP OR "import policy")', 'trade'),
  gnews('gnews-ecommerce', 'Google News · E-commerce rules', '("e-commerce" OR ecommerce OR ONDC OR "quick commerce") (rules OR sellers OR "consumer affairs" OR "legal metrology" OR CCPA OR "dark patterns" OR GST)', 'consumer-ecommerce'),
  gnews('gnews-labour', 'Google News · Labour & payroll', '("labour codes" OR EPFO OR ESIC OR gratuity OR "minimum wage" OR "provident fund") (employers OR notification OR rules OR ministry)', 'labour'),
  gnews('gnews-fema', 'Google News · RBI, FEMA & payments', '(RBI OR FEMA) (startups OR exporters OR remittance OR "payment aggregator" OR "overseas investment" OR FDI OR "current account")', 'rbi-fema'),
  gnews('gnews-data', 'Google News · Data protection', '(DPDP OR "data protection" OR MeitY OR "IT Rules") (rules OR compliance OR startups OR businesses OR notification)', 'data-digital'),
  gnews('gnews-fssai', 'Google News · FSSAI & food', '(FSSAI OR FoSCoS OR "food business") (licence OR license OR registration OR notification OR rules)', 'food-fssai'),
];

export const TOPIC_LABELS = {
  gst: 'GST',
  'income-tax': 'Income tax',
  companies: 'Companies & LLP',
  'startup-india': 'Startup India',
  msme: 'MSME',
  trade: 'Import & export',
  'rbi-fema': 'RBI & FEMA',
  labour: 'Labour & payroll',
  'consumer-ecommerce': 'E-commerce & consumer',
  'data-digital': 'Data & digital',
  'food-fssai': 'Food & FSSAI',
  ip: 'IP & trademarks',
  'budget-policy': 'Budget & policy',
  state: 'States',
};
