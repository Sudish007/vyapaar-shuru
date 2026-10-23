// Deterministic keyword tagging. Every tag shown in the UI is labelled "keyword-tagged";
// there is no model-written text anywhere in the feed.

export const TOPICS = [
  { id: 'gst', label: 'GST', re: /\b(gst|gstr|gstn|gstin|input tax credit|e-?invoic|e-?way bill|gst council|cgst|igst|sgst|composition scheme|hsn|reverse charge|rule 14[ab])\b/i },
  { id: 'income-tax', label: 'Income tax', re: /\b(income[- ]tax|cbdt|itr|tds|tcs|tax audit|presumptive|advance tax|form 16|form 26as|ais|tax year|section 80|surcharge|cess|capital gains|pan card|pan-aadhaar)\b/i },
  { id: 'companies', label: 'Companies & LLP', re: /\b(mca|ministry of corporate affairs|companies act|roc|registrar of companies|llp|limited liability partnership|incorporat\w*|spice\+?|din|director kyc|dir-3|aoc-4|mgt-7|one person company|opc|small compan(y|ies)|annual return|board meeting|nclt|ibc|insolvency|striking off|dematerialis)\b/i },
  { id: 'startup-india', label: 'Startup India', re: /\b(startup india|dpiit|80-?iac|seed fund|fund of funds|startup recognition|recogni[sz]ed startups?|startup (policy|scheme|ecosystem|tax|founders?)|deep ?tech|incubators?|accelerators?|venture capital|angel (tax|investors?)|alternative investment fund|aif|esops?)\b/i },
  { id: 'msme', label: 'MSME', re: /\b(msme|udyam|micro,? small|small business(es)?|cgtmse|mudra|pmegp|treds|delayed payment|khadi|nsic|sidbi|champions portal|cluster)\b/i },
  { id: 'trade', label: 'Import & export', re: /\b(dgft|iec|import(s|er|ers|ing)?|export(s|er|ers|ing)?|customs|cbic|icegate|foreign trade policy|ftp|rodtep|duty drawback|epcg|advance authori[sz]ation|shipping bill|bill of entry|e-?brc|courier export|fta|free trade agreement|cepa|tariff|anti-?dumping|hs code|itc-hs|sez|eou|ecgc|fieo|export promotion)\b/i },
  { id: 'rbi-fema', label: 'RBI & FEMA', re: /\b(rbi|reserve bank|fema|odi|fdi|foreign direct investment|overseas investment|lrs|liberali[sz]ed remittance|remittance|forex|foreign exchange|payment aggregator|payment gateway|upi|current account|kyc|nbfc|fc-gpr|firms portal|external commercial borrowing|ecb)\b/i },
  { id: 'labour', label: 'Labour & payroll', re: /\b(labour code|labor code|wage code|social security code|epf|epfo|provident fund|esi|esic|gratuity|minimum wage|shram suvidha|posh|maternity benefit|fixed[- ]term|contract labour|shops? and establishment|professional tax|bonus act|payroll)\b/i },
  { id: 'consumer-ecommerce', label: 'E-commerce & consumer', re: /\b(e-?commerce|ecommerce|marketplace|consumer protection|ccpa|dark pattern|legal metrology|packaged commodit|mrp|country of origin|ondc|amazon|flipkart|meesho|myntra|quick commerce|sellers?|d2c|online retail|unfair trade)\b/i },
  { id: 'data-digital', label: 'Data & digital', re: /\b(dpdp|data protection|personal data|meity|it rules|intermediar(y|ies)|cert-in|cyber ?security|digital india|consent manager|data fiduciary|ai governance|deepfake|online gaming)\b/i },
  { id: 'food-fssai', label: 'Food & FSSAI', re: /\b(fssai|food safety|foscos|food business(es)?|food licen[cs]e|packaged food|food label\w*|restaurants?|cloud kitchens?|eating house)\b/i },
  { id: 'ip', label: 'IP & trademarks', re: /\b(trademark|trade mark|patent|copyright|intellectual property|ip india|design registration|geographical indication|gi tag|brand registry)\b/i },
  { id: 'budget-policy', label: 'Budget & policy', re: /\b(union budget|finance bill|finance act|economic survey|niti aayog|ease of doing business|single window|nsws|jan vishwas|decriminali[sz]|invest india|pli scheme|production linked)\b/i },
  { id: 'state', label: 'States', re: /\b(startup policy|industrial policy|trade licen[cs]e|shops? and establishment|professional tax|single[- ]window|state gst|sgst department|investment summit|ease of doing business|industries department|udyog|state msme|msme policy|it policy|ev policy|textile policy|food processing policy)\b/i },
];

// Who does this matter to? Mapped to the path slugs used across the site.
export const AFFECTS = [
  { id: 'ecommerce', label: 'Online sellers', re: /\b(e-?commerce|ecommerce|marketplace|online sellers?|amazon|flipkart|meesho|myntra|ondc|quick commerce|d2c|tcs|194-?o|rule 14[ab]|dark pattern|legal metrology|packaged commodit)\b/i },
  { id: 'exporter', label: 'Exporters', re: /\b(export(s|er|ers|ing)?|dgft|rodtep|duty drawback|e-?brc|shipping bill|fieo|ecgc|softex|lut|zero-?rated|fema|realisation|remittance|fta|free trade agreement|cepa)\b/i },
  { id: 'importer', label: 'Importers', re: /\b(import(s|er|ers|ing)?|customs duty|bill of entry|bis|tariff|anti-?dumping|icegate|country of origin|hs code)\b/i },
  { id: 'saas', label: 'SaaS & digital', re: /\b(saas|software|digital services|oidar|it services|ites|data protection|dpdp|export of services|softex|intermediar(y|ies)|ai|platform)\b/i },
  { id: 'freelancer', label: 'Freelancers & consultants', re: /\b(freelanc\w*|consultant|professional|presumptive|44ada|section 58|gig|self-?employed|proprietor)\b/i },
  { id: 'food', label: 'Food businesses', re: /\b(fssai|food|restaurant|cloud kitchen|swiggy|zomato|packaged food)\b/i },
  { id: 'manufacturer', label: 'Manufacturers', re: /\b(manufactur\w*|factory|factories|pli|production linked|industrial|pollution|bis|quality control order|qco|msme|udyam)\b/i },
  { id: 'employer', label: 'Employers', re: /\b(labour code|labor code|epf|epfo|esi|esic|gratuity|minimum wage|payroll|employees?|hiring|posh|maternity|wage)\b/i },
  { id: 'company', label: 'Companies & LLPs', re: /\b(mca|companies act|roc|llp|incorporat\w*|director|aoc-4|mgt-7|dir-3|small compan(y|ies)|statutory audit|board|startup india|dpiit|80-?iac|fund of funds|angel|venture|fdi|fc-gpr)\b/i },
];

export function classify(title, summary = '') {
  const hay = `${title} ${summary}`.slice(0, 2000);
  const topics = TOPICS.filter((t) => t.re.test(hay)).map((t) => t.id);
  const affects = AFFECTS.filter((a) => a.re.test(hay)).map((a) => a.id);
  return { topics, affects };
}

/** Relevance gate for noisy news queries: at least one topic must match the TITLE or summary.
 *  Titles that are clearly about markets/celebrity/sports are dropped even when a keyword fires. */
const NOISE = /\b(sensex|nifty|stock(s)? to (buy|watch)|share price|ipo (opens|subscription|gmp)|cricket|bollywood|box office|horoscope|match|t20|ipl|celebrit|actor|actress|film|movie|recipe|weather|election result|auction|treasury bills?|money supply|bulletin|statistical supplement|forex reserves|government securities|government stock|open market operation|repo rate|reverse repo|variable rate|monetary policy|inflation|gdp|cyclone|rainfall|monsoon|farmers?|crop|mandi|msp|kharif|rabi|wheat|rice|sugar|tea auction|el nino|fd interest|fixed deposit|gold price|silver price|mutual fund|sip|lok adalat|home loan rate|leverage ratio|capital adequacy|prudential norms|basel|forthcoming instructions|liquidity (infusion|coverage)|crude oil|bank holiday|ifsc code|net banking|credit card (offers?|rewards?)|bonds?|yields?|losing streak|rupee (falls|slides|gains|hits|closes|ends)|dollar index|bond market)\b/i;

// Case-law digests (tribunal/court orders on one assessee's facts) are not actionable for a founder.
const CASELAW = /\b(itat|cestat|nclat|nclt|aar|aaar|safema|high court|supreme court|tribunal|writ|assessee|quash\w*|set aside|upheld|dismiss\w*|reassessment|reopening|remand\w*|additions?|deleted|disallow\w*|unexplained|on-money|cross-examination|appeal|penalty (deleted|quashed|cancelled|reduced)|reduces penalt\w*|fails? to prove|not sustainable|sustain\w*)\b/i;
const CASELAW_TAIL = /:\s*(itat|cestat|nclat|nclt|aar|aaar|sc|hc|[a-z]+ hc|supreme court|[a-z&\s]*high court|[a-z]+ tribunal)[^:]*$/i;
const ACTIONABLE = /\b(notification|circular|amend\w*|rules?|advisory|scheme|portal|guidelines?|clarif\w*|faq)\b/i;

// Market, personal-finance, event and funding-round stories are not "requirements and updates".
const MARKET = /\b(sovereign gold bond|sgb|redemption|pension|retire\w*|calculator|festive (offer|campaign|demand|season|sales)|car loan|home loan|debit card|term deposit|deposit rates?|52-week|shares? (plunge|crash|jump|fall|rise|surge|tank|slump|soar|drop)|q[1-4] (results?|report|profit|loss|revenue|earnings)|brokerages?|price target|profit (jumps|falls|rises|surges|dips)|net loss|revenue (grows|rises|falls|jumps)|ipo-?bound|daily roundup|roundup|raises \$|raised \$|secures \$|nets \$|bags \$|funding round|series [a-f]\b|valuation|pmi|private sector growth|panellists?|panel discussion|conclave|awareness programme|workshop|webinar|felicitat\w*|summit|imports? (jump|rise|fall|surge|wane|decline|rebound)|exports? (jump|rise|fall|surge|wane|decline|likely)|inflows|outflows|tonnes|forays?|to watch|caught our eye|pay commission|opens (its )?\w+ (factory|store|outlet)|margin boost|profitable growth|inventory model|chart(s)? (different )?paths?)\b/i;

// Google News with gl=IN still returns foreign stories; keep them only when India is in frame.
const FOREIGN = /\b(malaysia|canada|carney|britain|uk|australia|u\.s\.|usa|america|pakistan|bangladesh|sri lanka|nigeria|nigerian|kenya|singapore|dubai|uae|saudi|europe|european|eu|china|chinese|japan|germany|france|hong kong|philippines|vietnam|indonesia|nepal|new zealand|south africa|ghana|lithuania\w*|baltic|rm[0-9]|n[0-9]+trn)\b/i;
const FOREIGN_MONEY = /[$£€]\s?[0-9]/;
const FOREIGN_PUBLISHER = /nigeria|malaysia|baltic|national post|businesscloud|the sun |guardian|bbc|cnn|bloomberg|straits times|gulf news|khaleej|arab news|dawn|daily star|ghana|kenya|australia|canada|zawya|the national|reuters|financial times|wall street|new york times|cnbc\.com|techcrunch|forbes|business insider|yahoo finance|motley fool|the register|the verge|wired|\.co\.nz|\.co\.uk|\.com\.au|stuff|the edge|herald(?! ?(deccan|india))|leadville|the star|new straits|bernama|jakarta|philstar|the citizen|punch|vanguard|premium times|businessday|the standard|news24|iol|citizen|zambia|uganda|tanzania|bangkok post|the nation thailand|the hindu(?! ?business)|$^/i;
const INDIA = /\b(india|indian|₹|rs\.?|rupee|crore|lakh|dgft|gst|cbdt|cbic|rbi|mca|dpiit|sebi|fssai|meity|epfo|esic|udyam|delhi|mumbai|bengaluru|bangalore|hyderabad|chennai|kolkata|pune|modi|sitharaman|goyal|piyush|nirmala|bharat)\b/i;

// Publishers that are Indian or cover India as their beat. Google News items from unknown
// publishers are kept only when the headline itself names India.
const INDIAN_PUBLISHER = /economic times|times of india|hindustan times|\bmint\b|livemint|business standard|businessline|the hindu|indian express|moneycontrol|inc42|yourstory|ndtv|news18|india today|zee|financial express|taxguru|taxscan|caclubindia|cleartax|taxcorp|knn india|\bpib\b|press information bureau|dd news|news on air|dt next|deccan|telangana today|the print|the quint|scroll\.in|the wire|firstpost|outlook|business today|et now|cnbc-?tv18|bqprime|ndtv profit|mid-day|free press journal|tribune|statesman|pioneer|millennium ?post|bureaucrats india|fibre2fashion|maritime gateway|exim|the week|swarajya|republic|abp|news9|lokmat|sakal|jagran|patrika|amar ujala|verdictum|bar and bench|live ?law|scc online|taxo|gstplus|studycafe|saginfotech|ebizfiling|indiafilings|vakilsearch|razorpay|cashfree|skydo|treelife|tax2win|taxbuddy|urban acres|agency reporter|rs web solutions|business news this week|curlytales|medianama|entrackr|the ken|morning context|vccircle|techcircle|startup|sme (futures|street|times)|khabar|india|bharat|hindu|desh|mumbai|delhi|kolkata|chennai|bengaluru|bangalore|hyderabad|pune|kerala|gujarat|tamil|telugu|kannada|odisha|assam|punjab|bihar|rajasthan|goa|babushahi|bw |businessworld india|cxotoday|dataquest|express computer|et (cfo|retail|hr|legal|government|telecom|auto|energy|health|brand|manufacturing|infra|realty|travel|edu)|hr ?katha|people ?matters|legal era|legally india|mondaq|lexology|ipleaders|nyaaya|vidhi|taxmann|icai|icsi|icmai|wisemonk|karbon|xflow|winvesta|dodo|setindiabiz|legalwiz|vjm|commenda|jurishour|juris hour|india briefing|gonukkad|themunim|gimbooks|mybillbook|vyapar|tally|zoho|munim|eztax|quicko|wint|groww|et money|paisabazaar|bankbazaar|angel one|5paisa|upstox|dhan|kotak|hdfc|icici|sbi|axis|iifl|bajaj|godrej|tata|oxyzo|dmi|lendingkart|flexiloans|indifi|neogrowth|the leaflet|the federal|south first|news minute|east mojo|north ?east|arunachal|manipur|meghalaya|mizoram|nagaland|tripura|sikkim|jammu|kashmir|ladakh|himachal|uttarakhand|chhattisgarh|jharkhand|haryana|uttar pradesh|madhya pradesh|andhra|karnataka|maharashtra|west bengal|construction world|taiyang|mercom|saur|pv ?magazine india|autocar india|rushlane|gaadiwaadi|zigwheels|motoroids|team-bhp/i;

export function isRelevant(title, summary, topics, publisher = '', kind = 'news') {
  if (!topics.length) return false;
  if (topics.length === 1 && topics[0] === 'state') return false;
  if (NOISE.test(title) || MARKET.test(title)) return false;
  if (CASELAW_TAIL.test(title)) return false;
  if (CASELAW.test(title) && !ACTIONABLE.test(title)) return false;
  if (publisher && FOREIGN_PUBLISHER.test(publisher) && !/the hindu businessline/i.test(publisher)) return false;
  if ((FOREIGN.test(title) || FOREIGN_MONEY.test(title)) && !INDIA.test(title)) return false;
  if (kind === 'gnews' && !INDIA.test(title) && !(publisher && INDIAN_PUBLISHER.test(publisher))) return false;
  return true;
}
