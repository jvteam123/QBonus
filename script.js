// ═══════════════════════════════════════════════════════════════
// DEFAULT MODIFIER TABLES  (from PDF + script.js)
// ═══════════════════════════════════════════════════════════════
const PDF_DEFAULTS = {
  // ── Bonus tiers (from script.js DEFAULT_BONUS_TIERS) ────────
  bonusTiers: [
    {quality:100,bonus:1.20},{quality:99.5,bonus:1.18},{quality:99,bonus:1.16},{quality:98.5,bonus:1.14},{quality:98,bonus:1.12},
    {quality:97.5,bonus:1.10},{quality:97,bonus:1.08},{quality:96.5,bonus:1.06},{quality:96,bonus:1.04},{quality:95.5,bonus:1.02},
    {quality:95,bonus:1.00},{quality:94.5,bonus:0.99},{quality:94,bonus:0.98},{quality:93.5,bonus:0.97},{quality:93,bonus:0.96},
    {quality:92.5,bonus:0.95},{quality:92,bonus:0.94},{quality:91.5,bonus:0.93},{quality:91,bonus:0.91},{quality:90.5,bonus:0.90},
    {quality:90,bonus:0.88},{quality:89.5,bonus:0.87},{quality:89,bonus:0.85},{quality:88.5,bonus:0.83},{quality:88,bonus:0.80},
    {quality:87.5,bonus:0.78},{quality:87,bonus:0.75},{quality:86.5,bonus:0.73},{quality:86,bonus:0.70},{quality:85.5,bonus:0.68},
    {quality:85,bonus:0.66},{quality:84.5,bonus:0.64},{quality:84,bonus:0.62},{quality:83.5,bonus:0.60},{quality:83,bonus:0.57},
    {quality:82.5,bonus:0.55},{quality:82,bonus:0.50},{quality:81.5,bonus:0.45},{quality:81,bonus:0.40},{quality:80.5,bonus:0.35},
    {quality:80,bonus:0.30},{quality:79.5,bonus:0.25},{quality:79,bonus:0.20},{quality:78.5,bonus:0.15},{quality:78,bonus:0.10},
    {quality:77.5,bonus:0.05},
  ],

  // ── Calculation settings (from script.js DEFAULT_CALCULATION_SETTINGS) ──
  calcSettings: {
    irModifierValue: 1.5,
    points: { qc:0.125, i3qa:0.08333333333333333, rv1:0.2, rv1_combo:0.25, rv2:0.5 },
    categoryValues: {
      1:{  "3in":2.19,"4in":2.19,"6in":2.19,"9in":0.99},
      2:{  "3in":5.86,"4in":5.86,"6in":5.86,"9in":2.07},
      3:{  "3in":7.44,"4in":7.44,"6in":7.44,"9in":2.78},
      4:{  "3in":2.29,"4in":2.29,"6in":2.29,"9in":1.57},
      5:{  "3in":1.55,"4in":1.55,"6in":1.55,"9in":0.60},
      6:{  "3in":1.84,"4in":1.84,"6in":1.84,"9in":0.78},
      7:{  "3in":1.00,"4in":1.00,"6in":1.00,"9in":1.00},
      8:{  "3in":3.74,"4in":3.74,"6in":3.74,"9in":3.74},
      9:{  "3in":1.73,"4in":1.73,"6in":1.73,"9in":1.73},
    },
  },

  // ── SQM / Density / Bonus multiplier tables (from PDF) ──────
  sqmMultipliers: [
    {lo:1,    hi:1999,  val:244.00},{lo:2000,hi:2499,val:10.00},{lo:2500,hi:2999,val:10.50},
    {lo:3000, hi:3499,  val:11.00},{lo:3500,hi:3999,val:11.50},{lo:4000,hi:4499,val:12.00},
    {lo:4500, hi:4999,  val:12.50},{lo:5000,hi:5499,val:13.00},{lo:5500,hi:5999,val:13.50},
    {lo:6000, hi:6499,  val:14.00},{lo:6500,hi:6999,val:14.50},{lo:7000,hi:7499,val:15.00},
    {lo:7500, hi:7999,  val:15.50},{lo:8000,hi:999999,val:16.00},
  ],
  densityModifiers: [
    {lo:0,   hi:99,    val:-1.5},{lo:100, hi:249,  val:-1.0},{lo:250, hi:499,  val:-0.5},
    {lo:500, hi:749,   val:0},   {lo:750, hi:999,  val:0.5}, {lo:1000,hi:1499, val:1.0},
    {lo:1500,hi:999999,val:1.5},
  ],
  bonusFloor: 9.5,

  // ── Bonus Thresholds (overrides per-tech if quality % met) ──
  bonusThresholds: [
    { quality: 100,  bonus: 120 },
    { quality: 99.5, bonus: 118 },
  ],

  // ── Detection rules (from script.js DEFAULT_COUNTING_SETTINGS) ──
  detect: {
    taskColumns: { qc:['qc_id'], i3qa:['i3qa_id'], rv1:['rv1_id'], rv2:['rv2_id'] },
    triggers: {
      refix:     { labels:['i','s'],                   columns:['rv1_label','rv2_label','rv3_label'] },
      miss:      { labels:['m','d'],                   columns:['i3qa_label','rv1_label','rv2_label','rv3_label'] },
      warning:   { labels:['b','c','d','e','f','g','i'],columns:['r1_warn','r2_warn','r3_warn','r4_warn'] },
      qcPenalty: { labels:['m','e'],                   columns:['i3qa_label'] },
    },
    // Shorthand aliases used by countRefixes / hasLabel helpers
    get refixLabels(){ return this.triggers.refix.labels; },
    get refixCols(){   return this.triggers.refix.columns.map(c=>c.toUpperCase()); },
    get missLabels(){  return this.triggers.miss.labels; },
    get warnLabels(){  return this.triggers.warning.labels; },
    get warnCols(){    return this.triggers.warning.columns.map(c=>c.toUpperCase()); },
    get qcPenLabels(){ return this.triggers.qcPenalty.labels; },
    get qcPenCols(){   return this.triggers.qcPenalty.columns.map(c=>c.toUpperCase()); },
  },
};

// Live settings (copies of defaults, user-editable)
// Safe clone: deep-copies plain data from PDF_DEFAULTS and re-attaches
// the computed getter aliases that JSON.parse/stringify would silently drop.
function cloneDefaults() {
  const base = JSON.parse(JSON.stringify({
    bonusTiers:       PDF_DEFAULTS.bonusTiers,
    calcSettings:     PDF_DEFAULTS.calcSettings,
    sqmMultipliers:   PDF_DEFAULTS.sqmMultipliers,
    densityModifiers: PDF_DEFAULTS.densityModifiers,
    bonusFloor:       PDF_DEFAULTS.bonusFloor,
    bonusThresholds:  PDF_DEFAULTS.bonusThresholds,
    detect: {
      taskColumns: PDF_DEFAULTS.detect.taskColumns,
      triggers:    PDF_DEFAULTS.detect.triggers,
    },
  }));
  // Re-attach getter aliases that JSON strips out
  Object.defineProperties(base.detect, {
    refixLabels: { get(){ return this.triggers.refix.labels; },    configurable:true },
    refixCols:   { get(){ return this.triggers.refix.columns.map(c=>c.toUpperCase()); }, configurable:true },
    missLabels:  { get(){ return this.triggers.miss.labels; },     configurable:true },
    warnLabels:  { get(){ return this.triggers.warning.labels; },  configurable:true },
    warnCols:    { get(){ return this.triggers.warning.columns.map(c=>c.toUpperCase()); }, configurable:true },
    qcPenLabels: { get(){ return this.triggers.qcPenalty.labels; },configurable:true },
    qcPenCols:   { get(){ return this.triggers.qcPenalty.columns.map(c=>c.toUpperCase()); }, configurable:true },
  });
  return base;
}
let S = cloneDefaults();

// Restore user-saved settings from localStorage (survives page refresh)
(function restorePersistedSettings() {
  try {
    const raw = localStorage.getItem('fp-settings-v2');
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved.bonusTiers)      S.bonusTiers      = saved.bonusTiers;
    if (saved.calcSettings)    S.calcSettings    = saved.calcSettings;
    if (saved.bonusFloor != null) S.bonusFloor   = saved.bonusFloor;
    if (saved.bonusThresholds) S.bonusThresholds = saved.bonusThresholds;
    if (saved.sqmMultipliers)  S.sqmMultipliers  = saved.sqmMultipliers;
    if (saved.densityModifiers)S.densityModifiers= saved.densityModifiers;
    if (saved.detect) {
      if (saved.detect.taskColumns) S.detect.taskColumns = saved.detect.taskColumns;
      if (saved.detect.triggers)    S.detect.triggers    = saved.detect.triggers;
      // Re-attach getters after restoring triggers (they read from this.triggers live)
      Object.defineProperties(S.detect, {
        refixLabels: { get(){ return this.triggers.refix.labels; },    configurable:true },
        refixCols:   { get(){ return this.triggers.refix.columns.map(c=>c.toUpperCase()); }, configurable:true },
        missLabels:  { get(){ return this.triggers.miss.labels; },     configurable:true },
        warnLabels:  { get(){ return this.triggers.warning.labels; },  configurable:true },
        warnCols:    { get(){ return this.triggers.warning.columns.map(c=>c.toUpperCase()); }, configurable:true },
        qcPenLabels: { get(){ return this.triggers.qcPenalty.labels; },configurable:true },
        qcPenCols:   { get(){ return this.triggers.qcPenalty.columns.map(c=>c.toUpperCase()); }, configurable:true },
      });
    }
  } catch(e) { console.warn('Settings restore failed:', e); }
})();

// ═══════════════════════════════════════════════════════════════
// TECH ROSTER
// ═══════════════════════════════════════════════════════════════
let TECH_ROSTER = {
  // ── Added batch (Barbie / Cherrie / Noel) ──
  '7800MM':{name:'Michlyden Mamhot',team:'Team Barbie',teamNum:'T_115'},
  '7782SA':{name:'Stella Marie Arnoza',team:'Team Barbie',teamNum:'T_115'},
  '7786HC':{name:'Hanamel Congson',team:'Team Barbie',teamNum:'T_115'},
  '7785TB':{name:'Troy Elvinne Brizo',team:'Team Barbie',teamNum:'T_115'},
  '7784JB':{name:'Jemuel Blanco',team:'Team Barbie',teamNum:'T_115'},
  '7798RM':{name:'Raymund Macapas',team:'Team Cherrie',teamNum:'T_63'},
  '7793NI':{name:'Nova Lizzette Invento',team:'Team Cherrie',teamNum:'T_63'},
  '7792MH':{name:'May Anne Hotohot',team:'Team Cherrie',teamNum:'T_63'},
  '7811MY':{name:'Michol Yap',team:'Team Cherrie',teamNum:'T_63'},
  '7781FA':{name:'Froilan Alferez',team:'Team Noel',teamNum:'T_57'},
  '7788LD':{name:'Lindon Bench Dulfo',team:'Team Noel',teamNum:'T_57'},
  '7797CL':{name:'Cheryl Leyson',team:'Team Noel',teamNum:'T_57'},
  '7790GE':{name:'Gabriel Estrella',team:'Team Noel',teamNum:'T_57'},
  '7092RN':{name:'Romiel Nuevo',team:'Team Cherrie',teamNum:'T_63'},
  '7037HP':{name:'Henry Patoc',team:'Team Cherrie',teamNum:'T_63'},
  '7089RR':{name:'Ravin Louis Relador',team:'Team Cherrie',teamNum:'T_63'},
  '7102JD':{name:'John Kenneth Dueñas',team:'Team Cherrie',teamNum:'T_63'},
  '7170WS':{name:'Warren Salogaol',team:'Team Cherrie',teamNum:'T_63'},
  '7040JP':{name:'Jose Poro III',team:'Team Cherrie',teamNum:'T_63'},
  '7159MC':{name:'Ma. Angelica Cagigas',team:'Team Cherrie',teamNum:'T_63'},
  '7161KA':{name:'Kent C. Agraviador',team:'Team Cherrie',teamNum:'T_63'},
  '7168JS':{name:'Jennifer S. Solayao',team:'Team Cherrie',teamNum:'T_63'},
  '7158JD':{name:'Junie S. Dadol',team:'Team Cherrie',teamNum:'T_63'},
  '7167AD':{name:'Almer B. Dela Cruz',team:'Team Cherrie',teamNum:'T_63'},
  '7178MD':{name:'Mary Mae Dagwayan',team:'Team Cherrie',teamNum:'T_63'},
  '4297RQ':{name:'Ralph B. Quinto',team:'Team Barbie',teamNum:'T_115'},
  '7086LP':{name:'Lemuel Presbitero',team:'Team Barbie',teamNum:'T_115'},
  '7087LA':{name:'Lorie Mae Año',team:'Team Barbie',teamNum:'T_115'},
  '7088MA':{name:'Michelle Marie D. Alburo',team:'Team Barbie',teamNum:'T_115'},
  '7091HA':{name:'Harvy Acevedo',team:'Team Barbie',teamNum:'T_115'},
  '7179KB':{name:'King Nino Barba',team:'Team Barbie',teamNum:'T_115'},
  '7099SS':{name:'Sallemie Solon',team:'Team Barbie',teamNum:'T_115'},
  '7171AL':{name:'Alfe Marie G. Latras',team:'Team Barbie',teamNum:'T_115'},
  '7311JT':{name:'Joseph M. Tabada',team:'Team Barbie',teamNum:'T_115'},
  '7173ES':{name:'Earl Ryan Y. Santiago',team:'Team Barbie',teamNum:'T_115'},
  '7175JP':{name:'Jumbo S. Paanod Jr.',team:'Team Barbie',teamNum:'T_115'},
  '7084LQ':{name:'Lowel K. Quilinguen',team:'Team Barbie',teamNum:'T_115'},
  '4044AM':{name:'Anna Mae Mencho A. Macaraya',team:'Team Barbie',teamNum:'T_115'},
  '4488MD':{name:'Maricris de Gracia',team:'Team Noel',teamNum:'T_57'},
  '7096AV':{name:'Ale-June Villacencio',team:'Team Noel',teamNum:'T_57'},
  '1173RR':{name:'Reuel Andrew Roque',team:'Team Noel',teamNum:'T_57'},
  '4489EA':{name:'Everly Apurado',team:'Team Noel',teamNum:'T_57'},
  '7103RE':{name:'Roberto Ebarita Jr.',team:'Team Noel',teamNum:'T_57'},
  '7043RP':{name:'Randolf Potot',team:'Team Noel',teamNum:'T_57'},
  '7093MG':{name:'Michael Allien Getigan',team:'Team Noel',teamNum:'T_57'},
  '7166CR':{name:'Carl Anthony Riñen',team:'Team Noel',teamNum:'T_57'},
  '7174MC':{name:'Michael A. Catadman',team:'Team Noel',teamNum:'T_57'},
  '7090JA':{name:'John Russian Arches',team:'Team Noel',teamNum:'T_57'},
  '7165GR':{name:'Ghee Ram N. Racaza',team:'Team Noel',teamNum:'T_57'},
  '7176CC':{name:'Clarfen D. Campilanan',team:'Team Noel',teamNum:'T_57'},
  '7095KA':{name:'Kirby L. Adobas',team:'Team Noel',teamNum:'T_57'},
  '7105JH':{name:'Joel Himatay',team:'Team David',teamNum:'T_116'},
  '7107RA':{name:'Reymon Alipin',team:'Team David',teamNum:'T_116'},
  '7108RS':{name:'Ryan Sevilla',team:'Team David',teamNum:'T_116'},
  '7109JB':{name:'John Anderson Balmori',team:'Team David',teamNum:'T_116'},
  '7110RC':{name:'Robeneil Cabunilas',team:'Team David',teamNum:'T_116'},
  '7111OE':{name:'Orlando Jr. Enriquez',team:'Team David',teamNum:'T_116'},
  '7112RL':{name:'Reymark Laranjo',team:'Team David',teamNum:'T_116'},
  '7113SR':{name:'Sherwin Rupal',team:'Team David',teamNum:'T_116'},
  '7114AR':{name:'Albrenz Rosalejos',team:'Team David',teamNum:'T_116'},
  '7254LD':{name:'Laurence Damole',team:'Team David',teamNum:'T_116'},
  '7185JG':{name:'John Mel Gino',team:'Team David',teamNum:'T_116'},
  '7181RL':{name:'Reynaldo, Jr. Laranjo',team:'Team David',teamNum:'T_116'},
  '7180JR':{name:'Jerico Rago',team:'Team David',teamNum:'T_116'},
  '7186JS':{name:'Jumel Seno',team:'Team David',teamNum:'T_116'},
  '7249SS':{name:'Serg Sembrano',team:'Team Jeave',teamNum:'T_123'},
  '7236LE':{name:'Lorens Christopher Ebrado',team:'Team Jeave',teamNum:'T_123'},
  '4426KV':{name:'Kenneth Lester Villajos',team:'Team Jeave',teamNum:'T_123'},
  '4472JS':{name:'Sison, John Vincent Estopito',team:'Team Jeave',teamNum:'T_123'},
  '4475JT':{name:'Joana May Taboada',team:'Team Jeave',teamNum:'T_123'},
  '7240HH':{name:'Hyacint Hortelano',team:'Team Jeave',teamNum:'T_123'},
  '7039NO':{name:'Nazareno Oppus',team:'Team Jeave',teamNum:'T_123'},
  '7231NR':{name:'Negel Roloma',team:'Team Jeave',teamNum:'T_123'},
  '7244AA':{name:'Arjohn Abapo',team:'Team Jeave',teamNum:'T_123'},
  '7247JA':{name:'Jayson Aliser',team:'Team Jeave',teamNum:'T_123'},
  '7248AA':{name:'Allan Paul Alforque',team:'Team Jeave',teamNum:'T_123'},
  '7251JD':{name:'Jan Dominic Dela Cruz',team:'Team Nikki',teamNum:'T_114'},
  '7314VP':{name:'Vince April Pitogo',team:'Team Jeave',teamNum:'T_123'},
  '7042NB':{name:'Nikki Carlos Booc',team:'Team Nikki',teamNum:'T_114'},
  '4283JP':{name:'Janriel Paanod',team:'Team Nikki',teamNum:'T_114'},
  '7234CS':{name:'Christian Suico',team:'Team Nikki',teamNum:'T_114'},
  '7313MB':{name:'Mark Kg Barong',team:'Team Nikki',teamNum:'T_114'},
  '7036RB':{name:'Rodrigo Basnillo',team:'Team Nikki',teamNum:'T_114'},
  '4478JV':{name:'Jervin Villocino',team:'Team Nikki',teamNum:'T_114'},
  '7310DR':{name:'Dan Niel Rapas',team:'Team Nikki',teamNum:'T_114'},
  '7239EO':{name:'Eric Jason Omega',team:'Team Nikki',teamNum:'T_114'},
  '4477PT':{name:'Pacifico Tejam',team:'Team Nikki',teamNum:'T_114'},
  '7251DJ':{name:'Jan Dominic Dela Cruz (Nikki)',team:'Team Nikki',teamNum:'T_114'},
  '7233JP':{name:'Jeobenail li Parame',team:'Team Jack',teamNum:'T_64'},
  '4135RC':{name:'Cantiveros, Ritche Bayo',team:'Team Nikki',teamNum:'T_114'},
  '7315CR':{name:'Christiane Repunte',team:'Team Nikki',teamNum:'T_114'},
  '7243JC':{name:'John Cañete',team:'Team Nikki',teamNum:'T_114'},
  '4474HS':{name:'Soroño, Humfrey Dave Viaña',team:'Team Jack',teamNum:'T_64'},
  '4492CP':{name:'Christian Pontiano',team:'Team Jack',teamNum:'T_64'},
  '4421AT':{name:'Anthony Talledo',team:'Team Jack',teamNum:'T_64'},
  '7237ML':{name:'Michael Bryan Lambo',team:'Team Jack',teamNum:'T_64'},
  '4481JV':{name:'Jasmin Villocino',team:'Team Jack',teamNum:'T_64'},
  '7316NT':{name:'Niel Fred Tabar',team:'Team Jack',teamNum:'T_64'},
  '7245SC':{name:'Sergio Cuizon Jr.',team:'Team Jack',teamNum:'T_64'},
  '4476JR':{name:'Rico, Jefrey Labajo',team:'Team Jack',teamNum:'T_64'},
  '7246AJ':{name:'Arvin Jasmin',team:'Team Jack',teamNum:'T_64'},
  '7241DM':{name:'Dejie Monterde',team:'Team Jack',teamNum:'T_64'},
  '4435AC':{name:'Allan Codina',team:'Team Jack',teamNum:'T_64'},
  '7242FV':{name:'Francis Anthony Villarin',team:'Team Jack',teamNum:'T_64'},
  '2274JD':{name:'Jacky Dimla',team:'Team Jack',teamNum:'T_64'},
  '7182RP':{name:'Ronaldo Plasabas',team:'Team Angelico',teamNum:'T_122'},
  '7183EE':{name:'Eduardo Jr Espina',team:'Team Angelico',teamNum:'T_122'},
  '7184WG':{name:'Winston Garcia',team:'Team Angelico',teamNum:'T_122'},
  '7187CN':{name:'Camela Nuñeza',team:'Team Angelico',teamNum:'T_122'},
  '7188AA':{name:'Angelica Abella',team:'Team Angelico',teamNum:'T_122'},
  '7189CF':{name:'Cynthia Fernandez',team:'Team Angelico',teamNum:'T_122'},
  '7255AL':{name:'Abel Lacida',team:'Team Angelico',teamNum:'T_122'},
  '7256VR':{name:'Von Kristofer Recilla',team:'Team Angelico',teamNum:'T_122'},
  '7257AJ':{name:'Jabagat Allan',team:'Team Angelico',teamNum:'T_122'},
  '7258AM':{name:'Angelo Montaño',team:'Team Angelico',teamNum:'T_122'},
  '7259MA':{name:'Mark Adrian Asis',team:'Team Angelico',teamNum:'T_122'},
  '7260HP':{name:'Harold James Paduga',team:'Team Angelico',teamNum:'T_122'},
  '7261PA':{name:'Patrick Aplicador',team:'Team Angelico',teamNum:'T_122'},
  '7262AP':{name:'Arnold Louie Pegoro',team:'Team Angelico',teamNum:'T_122'},
  '7253NR':{name:'Niño Yuson Ramil',team:'Team Angelico',teamNum:'T_122'},
  '7809RR':{name:'Rodriguez, Raquel Alegre M.',team:'Team Jeave',teamNum:'T_123'},
  '7794JJ':{name:'Jaralve, Josh C.',team:'Team Jack',teamNum:'T_64'},
  '7802NM':{name:'Nikki Eleazar M. Morales',team:'Team Jack',teamNum:'T_64'},
  '7804GP':{name:'Parame, Gian Carlo',team:'Team Nikki',teamNum:'T_114'},
  '7783AB':{name:'Beatingo, Angielyn Angel B.',team:'Team Jeave',teamNum:'T_123'},
  '7796GL':{name:'Laput, Gemar Del Mar',team:'Team Jeave',teamNum:'T_123'},
  '7787TC':{name:'Cuizon Jr., Timotio',team:'Team Jack',teamNum:'T_64'},
  '7779AA':{name:'Abella, Abegail D.',team:'Team Nikki',teamNum:'T_114'},
  '7780NA':{name:'Aguhar, Niña Mae E.',team:'Team Jeave',teamNum:'T_123'},
  '7795AJ':{name:'Adrian O. Jasmin',team:'Team Nikki',teamNum:'T_114'},
  '7789ME':{name:'Edoloverio, Marjhon O.',team:'Team Jack',teamNum:'T_64'},
  '7799JM':{name:'Malinas I Jr',team:'Team Nikki',teamNum:'T_114'},
  '7810JS':{name:'Siodina, Jason Kim P.',team:'Team Nikki',teamNum:'T_114'},
};

// ═══════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════
let allRows=[], filtered=[], techRows=[], filteredTech=[];
let sortKey='total_points', sortDir=-1;
let techSortKey='points', techSortDir=-1;
let currentPage=1, currentView='tasks';
let colFilters={};
let currentProjectName='';
let currentRawFile=null;
let currentBonusMultiplier=9.5;
let PAGE_SIZE=100;

// Import settings state
let importSettings = {
  site: 'Cebu', gsd: '6in', blocktype: 'auto',
  month: new Date().toLocaleString('en-US',{month:'long'}), year: new Date().getFullYear(), sqm: 1332, name: ''
};
let pendingFile = null; // held while import modal is open

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
function getCatGsdValue(cat, gsd) {
  return S.calcSettings.categoryValues[Number(cat)]?.[gsd] || 0;
}
function getSqmMultiplier(sqm) {
  const s = Number(sqm)||0;
  for (const r of S.sqmMultipliers) if (s>=r.lo && s<=r.hi) return r.val;
  return S.bonusFloor;
}
function getDensityMod(density) {
  for (const r of S.densityModifiers) if (density>=r.lo && density<=r.hi) return r.val;
  return 0;
}
function getQualityPct(qp) {
  // Use bonus tiers from script.js (returns bonus as fraction, e.g. 1.0 = 100%)
  return (calculateQualityModifier(qp) * 100);
}

// ═══════════════════════════════════════════════════════════════
// DETECTION HELPERS  (settings-driven)
// ═══════════════════════════════════════════════════════════════
function splitLabels(str){ return str.split(',').map(s=>s.trim().toLowerCase()).filter(Boolean); }
function hasLabel(raw, cols, labels){
  const lset = new Set(labels.map(l=>l.toLowerCase()));
  return cols.some(col=>{
    const v=(raw[col]||raw[col.toUpperCase()]||'').trim().toLowerCase();
    return v && lset.has(v);
  });
}

// ═══════════════════════════════════════════════════════════════
// CALCULATOR  — ported from script.js Calculator.parseRawData
// Handles: fix point awards, refix transfers, AFP tasks,
//          miss-conditional awarding, QC penalty transfer to i3QA,
//          per-category breakdowns, warning detection
// ═══════════════════════════════════════════════════════════════
function buildTechStats(rawRecords) {
  const isFixTaskIR = importSettings.blocktype === 'IR';
  const gsd = importSettings.gsd || '6in';
  const cs  = S.calcSettings;   // calculation settings (points, categoryValues, irModifierValue)
  const det = S.detect;

  const techStats = {};
  const TECH_REGEX = /^\d{4}[a-zA-Z]{2}$/;

  // ── 1. Discover all techs in the data ───────────────────────
  rawRecords.forEach(r => {
    Object.keys(r).forEach(k => {
      if (k.toUpperCase().endsWith('_ID')) {
        const tid = (r[k]||'').trim().toUpperCase();
        if (tid && TECH_REGEX.test(tid) && !techStats[tid]) {
          const info = TECH_ROSTER[tid] || {};
          const categoryCounts = {};
          for (let i=1;i<=9;i++) categoryCounts[i]={primary:0,i3qa:0,afp:0,rv:0};
          techStats[tid] = {
            id: tid,
            name: info.name || tid,
            team: info.team || 'Unknown Team',
            teamNum: info.teamNum || '—',
            month: `${importSettings.month} ${importSettings.year} – ${importSettings.site}`,
            points: 0, fixTasks: 0, afpTasks: 0, refixTasks: 0, missedTasks: 0,
            qcTasks: 0, i3qaTasks: 0, rvTasks: 0, warnings: [],
            categoryCounts,
            pointsBreakdown: { fix:0, qc:0, i3qa:0, rv:0, qcTransfer:0 },
            _src: { initial:[], i3qa:[], rv:[], fix:[], missed:[], refix:[], warn:[] },
          };
        }
      }
    });
  });

  // ── 2. Process each fixpoint row ────────────────────────────
  rawRecords.forEach(r => {
    const get = col => (r[col] || r[col.toUpperCase()] || '');
    const isComboIR = importSettings.blocktype === 'IR';

    const fixIds = [1,2,3,4,5].map(i => get(`FIX${i}_ID`).trim().toUpperCase()).map(id => TECH_REGEX.test(id) ? id : null);

    // Helper: award fix category points to a tech
    const processFixTech = (techId, catSources) => {
      if (!techId || !techStats[techId]) return;
      catSources.forEach(source => {
        if (source.isRQA && source.sourceType === 'afp') techStats[techId].afpTasks++;
        const labelValue = source.label ? get(source.label).trim().toUpperCase() : null;
        if (source.condition && !source.condition(labelValue)) return;
        const catValue = parseInt(get(source.cat));
        if (!isNaN(catValue) && catValue >= 1 && catValue <= 9) {
          techStats[techId].fixTasks++;
          techStats[techId]._src.fix.push(r);
          const pointValue = (cs.categoryValues[catValue]?.[gsd]) || 0;
          const pts = pointValue * (isComboIR ? cs.irModifierValue : 1);
          techStats[techId].points += pts;
          techStats[techId].pointsBreakdown.fix += pts;
          if (techStats[techId].categoryCounts[catValue])
            techStats[techId].categoryCounts[catValue][source.sourceType]++;
        }
      });
    };

    // Helper: add non-fix task points
    const addPoints = (techId, pts, field, taskType) => {
      if (!techId || !techStats[techId]) return;
      techStats[techId].points += pts;
      techStats[techId].pointsBreakdown[field] += pts;
      if (taskType) {
        techStats[techId][`${taskType}Tasks`]++;
        const srcKey = taskType==='qc'?'initial': taskType==='i3qa'?'i3qa': taskType==='rv'?'rv': null;
        if (srcKey) techStats[techId]._src[srcKey].push(r);
      }
    };

    // Helper: refix trigger check
    const isRefixTriggered = (reviewLabelCol, fixIndex) => {
      const label = get(reviewLabelCol).trim().toLowerCase();
      return label && det.refixLabels.some(l => label.includes(l)) && !!fixIds[fixIndex];
    };

    // Fix point map: mirrors script.js fixPointMap
    const fixPointMap = [
      { cat:'CATEGORY',  review:'RV1_LABEL', refixTechIndex:1, afpStat:'AFP1_STAT', afpCat:'AFP1_CAT', i3qaCat:'I3QA_CAT', isPrimary:true },
      { cat:'RV1_CAT',   review:'RV2_LABEL', refixTechIndex:2, afpStat:'AFP2_STAT', afpCat:'AFP2_CAT' },
      { cat:'RV2_CAT',   review:'RV3_LABEL', refixTechIndex:3, afpStat:'AFP3_STAT', afpCat:'AFP3_CAT' },
      { cat:'RV3_CAT',   review:null,        refixTechIndex:null },
    ];

    fixPointMap.forEach((fix, i) => {
      const fixTechId = fixIds[i];
      if (!fixTechId) return;

      const refixTriggered = fix.review && isRefixTriggered(fix.review, i);

      if (!refixTriggered) {
        // ── Award points to fixer ──
        const catSources = [];
        // AFP (RQA-approved)
        if (fix.afpStat && get(fix.afpStat).trim().toUpperCase() === 'AA')
          catSources.push({ cat:fix.afpCat, isRQA:true, sourceType:'afp' });

        if (fix.isPrimary) {
          catSources.push({ cat:fix.cat, sourceType:'primary' });
          // i3QA points only if miss/correct label
          catSources.push({ cat:fix.i3qaCat, label:'I3QA_LABEL',
            condition: v => v && det.missLabels.some(l => v.includes(l.toUpperCase())),
            sourceType:'i3qa' });
        } else if (fix.cat) {
          const reviewCol = i===1?'RV1_LABEL': i===2?'RV2_LABEL':'RV3_LABEL';
          catSources.push({ cat:fix.cat, label:reviewCol,
            condition: v => v && det.missLabels.some(l => v.includes(l.toUpperCase())),
            sourceType:'rv' });
        }
        processFixTech(fixTechId, catSources);

      } else {
        // ── Refix: penalise original, transfer points to refix tech ──
        if (techStats[fixTechId]) { techStats[fixTechId].refixTasks++; techStats[fixTechId]._src.refix.push(r); }

        const refixTechId = fixIds[fix.refixTechIndex];
        const catValue = parseInt(get(fix.cat));
        if (refixTechId && techStats[refixTechId] && !isNaN(catValue) && catValue>=1 && catValue<=9) {
          const pointValue = (cs.categoryValues[catValue]?.[gsd]) || 0;
          const pts = pointValue * (isComboIR ? cs.irModifierValue : 1);
          techStats[refixTechId].points += pts;
          techStats[refixTechId].pointsBreakdown.fix += pts;
          techStats[refixTechId].fixTasks++;
          if (techStats[refixTechId].categoryCounts[catValue])
            techStats[refixTechId].categoryCounts[catValue]['primary']++;
        }
      }
    });

    // ── QC task (initial tagging) ─────────────────────────────
    // Points go to the QC_ID tech — det.taskColumns.qc lists the column(s) holding that ID
    {
      const qcId = det.taskColumns.qc.map(c => get(c.toUpperCase()).trim().toUpperCase()).find(Boolean);
      if (qcId) addPoints(qcId, cs.points.qc, 'qc', 'qc');
    }

    // ── I3 Missed/Rework — attributed to QC tech when I3QA_LABEL is a miss label ──
    {
      const i3qaLabel = get('I3QA_LABEL').trim().toUpperCase();
      const isMiss = det.missLabels.some(l => i3qaLabel.includes(l.toUpperCase()));
      if (isMiss) {
        const qcId = get('QC_ID').trim().toUpperCase();
        if (qcId && techStats[qcId]) {
          techStats[qcId].missedTasks++;
          techStats[qcId]._src.missed.push(r);
        }
      }
    }

    // ── i3QA task ────────────────────────────────────────────
    {
      const i3qaId = det.taskColumns.i3qa.map(c => get(c.toUpperCase()).trim().toUpperCase()).find(Boolean);
      if (i3qaId) addPoints(i3qaId, cs.points.i3qa, 'i3qa', 'i3qa');
    }

    // ── RV tasks ─────────────────────────────────────────────
    // RV1: award RV1 points to RV1_ID tech
    {
      const rv1Id = det.taskColumns.rv1.map(c => get(c.toUpperCase()).trim().toUpperCase()).find(Boolean);
      if (rv1Id) addPoints(rv1Id, isComboIR ? cs.points.rv1_combo : cs.points.rv1, 'rv', 'rv');
    }
    // RV2+: award RV2 points to RV2_ID (and beyond) techs
    det.taskColumns.rv2.forEach(c => {
      const rvId = get(c.toUpperCase()).trim().toUpperCase();
      if (rvId && techStats[rvId]) addPoints(rvId, cs.points.rv2, 'rv', 'rv');
    });

    // ── QC Penalty — deduct from QC tech, transfer to i3QA tech ─────────────
    {
      const penCols = det.triggers.qcPenalty.columns;
      const penLabels = det.triggers.qcPenalty.labels;
      const isPenalty = penCols.some(c => {
        const v = get(c.toUpperCase()).trim().toLowerCase();
        return v && penLabels.includes(v);
      });
      if (isPenalty) {
        const qcId = get('QC_ID').trim().toUpperCase();
        const i3qaId = get('I3QA_ID').trim().toUpperCase();
        // Deduct 1/8 from QC tech
        if (qcId && techStats[qcId]) {
          techStats[qcId].points -= cs.points.qc;
          techStats[qcId].pointsBreakdown.qc -= cs.points.qc;
        }
        // Transfer those points to i3QA tech
        if (i3qaId && techStats[i3qaId]) {
          techStats[i3qaId].points += cs.points.qc;
          techStats[i3qaId].pointsBreakdown.qcTransfer += cs.points.qc;
        }
      }
    }

    // ── Warning detection ─────────────────────────────────────
    det.triggers.warning.columns.forEach((c, i) => {
      if (det.triggers.warning.labels.includes(get(c.toUpperCase()).trim().toLowerCase())) {
        const fixTechId = fixIds[i];
        if (fixTechId && techStats[fixTechId]) { techStats[fixTechId].warnings.push({}); techStats[fixTechId]._src.warn.push(r); }
      }
    });
  });

  return Object.values(techStats).map(t => {
    const denom = t.fixTasks + t.refixTasks + t.warnings.length;
    // Default to 100% (perfect quality) when tech has no fix/refix/warn tasks
    const qp    = denom > 0 ? (t.fixTasks / denom) * 100 : 100;
    const qualityMod = calculateQualityModifier(qp);
    const thresholdBonus = getThresholdBonus(qp);

    // ── DR / DRQ deductions ────────────────────────────────────
    // DR  = deducted from QC tech (initial tagger) based on total egregious missed rows
    // DRQ = deducted from i3QA tech based on egregious rows where FIXED1?=N or AFP1_STAT=AA
    const EGREGIOUS_CATS = [1, 2, 3];
    const I3_DR_TABLE = [
      { min:200, level:'DR5', deduct:-500 },
      { min:100, level:'DR4', deduct:-200 },
      { min: 70, level:'DR3', deduct:-100 },
      { min: 50, level:'DR2', deduct: -50 },
      { min: 30, level:'DR1', deduct: -30 },
    ];
    const I3QA_DRQ_TABLE = [
      { min:200, level:'DRQ5', deduct:-500 },
      { min:100, level:'DRQ4', deduct:-200 },
      { min: 50, level:'DRQ3', deduct:-100 },
      { min: 20, level:'DRQ2', deduct: -50 },
      { min: 10, level:'DRQ1', deduct: -30 },
    ];

    // QC tech: DR based on egregious rows among their missed rows
    const missedSrc = t._src.missed || [];
    const egregiousMissed = missedSrc.filter(r => {
      // r is a raw DBF record (flat keys) — no _raw wrapper
      const cat = parseInt(r.I3QA_CAT || r.CATEGORY || r._raw?.I3QA_CAT || r._raw?.CATEGORY || r.category || 0);
      const i3qaLbl = (r.I3QA_LABEL || r._raw?.I3QA_LABEL || r.i3qa_label || '').toString().trim().toUpperCase();
      if (i3qaLbl === 'D') return false; // ignore rows where I3QA_LABEL = D
      return EGREGIOUS_CATS.includes(cat);
    });
    const drRule = I3_DR_TABLE.find(d => egregiousMissed.length >= d.min) || null;
    const drDeduct = drRule ? drRule.deduct : 0;

    // i3QA tech: DRQ based on egregious rows they reviewed where FIXED1?=N or AFP1_STAT=AA
    const i3qaSrc = t._src.i3qa || [];
    const missLabelsList = (det?.triggers?.miss?.labels || S.detect.triggers.miss.labels).map(l=>l.toUpperCase());
    const egregiousDrq = i3qaSrc.filter(r => {
      // r is a raw DBF record (flat keys) — no _raw wrapper
      const cat   = parseInt(r.I3QA_CAT || r.CATEGORY || r._raw?.I3QA_CAT || r._raw?.CATEGORY || r.category || 0);
      const label = (r.I3QA_LABEL || r._raw?.I3QA_LABEL || r.i3qa_label || '').toString().trim().toUpperCase();
      if (label === 'D') return false; // ignore rows where I3QA_LABEL = D
      const isMiss = missLabelsList.includes(label);
      const f    = (r['FIXED1?'] || r.FIXED1 || r._raw?.['FIXED1?'] || r._raw?.FIXED1 || '').toString().trim().toUpperCase();
      const afp1 = (r.AFP1_STAT || r._raw?.AFP1_STAT || '').toString().trim().toUpperCase();
      return EGREGIOUS_CATS.includes(cat) && isMiss && (f === 'N' || afp1 === 'AA');
    });
    const drqRule   = I3QA_DRQ_TABLE.find(d => egregiousDrq.length >= d.min) || null;
    const drqDeduct = drqRule ? drqRule.deduct : 0;

    // Store metadata for use in detail modal and drilldown
    t.drRule         = drRule;
    t.drDeduct       = drDeduct;
    t.drqRule        = drqRule;
    t.drqDeduct      = drqDeduct;
    t.egregiousMissedCount = egregiousMissed.length;
    t.egregiousDrqCount    = egregiousDrq.length;

    // Apply deductions to points BEFORE computing bonuses
    t.pointsRaw  = t.points;                      // pre-deduction total, for transparency
    t.points     = t.points + drDeduct + drqDeduct; // deductions are negative numbers
    t.points     = Math.round(t.points * 10000) / 10000;

    // Alias to match existing renderTechTable column names
    t.initial       = t.qcTasks;
    t.i3qa          = t.i3qaTasks;
    t.rv            = t.rvTasks;
    t.fix           = t.fixTasks;
    t.refix         = t.refixTasks;
    t.warn          = t.warnings.length;
    t.missed        = t.missedTasks;
    t.qp            = qp;
    t.qualityPctMod = Math.round(qualityMod * 100 * 100) / 100;
    t.bonusMultiplier = currentBonusMultiplier;
    t.thresholdApplied = thresholdBonus !== null;
    if (thresholdBonus !== null) {
      t.baseBonus = t.points * (thresholdBonus / 100);
      t.totalBonus = t.points * currentBonusMultiplier * (thresholdBonus / 100);
    } else {
      t.baseBonus = t.points * qualityMod;
      t.totalBonus = t.points * currentBonusMultiplier * qualityMod;
    }
    return t;
  });
}

// Quality modifier lookup from bonus tiers
function calculateQualityModifier(qualityRate) {
  return S.bonusTiers.find(tier => qualityRate >= tier.quality)?.bonus || 0;
}

// Bonus threshold lookup — returns override PHP multiplier if tech meets threshold, else null
function getThresholdBonus(qualityRate) {
  if (!S.bonusThresholds || !S.bonusThresholds.length) return null;
  const sorted = [...S.bonusThresholds].sort((a,b) => b.quality - a.quality);
  for (const t of sorted) if (qualityRate >= t.quality) return t.bonus;
  return null;
}

// Legacy per-row helpers (still used for tasks table display columns)
function countRefixes(rec){
  let n=0;
  for(let i=1;i<=5;i++) if(rec[`ZFIX${i}_ID`]) n++;
  S.detect.refixCols.forEach(col=>{
    const techIdCol=col.replace(/_LABEL$/i,'_ID');
    if(rec[techIdCol] && hasLabel(rec,[col],S.detect.refixLabels)) n++;
  });
  return n;
}
function countWarnings(rec){
  let n=0;
  S.detect.warnCols.forEach((col,idx)=>{
    const rvCol=`RV${idx+1}_ID`;
    if(rec[rvCol] && hasLabel(rec,[col],S.detect.warnLabels)) n++;
  });
  return n;
}
function countRVTasks(rec){let n=0;for(let i=1;i<=4;i++)if(rec[`RV${i}_ID`])n++;return n;}
function countFixTasks(rec){let n=0;for(let i=1;i<=5;i++)if(rec[`FIX${i}_ID`])n++;return n;}

// Legacy per-row point estimate (for tasks table total_points column only)
function calcPoints(rec){
  const cs = S.calcSettings;
  const cat = parseInt(rec['CATEGORY']||0);
  const isIR = importSettings.blocktype==='IR';
  const gsdVal = (cs.categoryValues[cat]?.[importSettings.gsd]) || 0;
  const irM = isIR ? cs.irModifierValue : 1.0;
  let pts = 0;
  if (rec['QC_ID']) pts += cs.points.qc;
  if (rec['I3QA_ID']) pts += cs.points.i3qa;
  for(let i=1;i<=5;i++) if(rec[`FIX${i}_ID`]) pts += gsdVal * irM;
  if (rec['RV1_ID']) pts += isIR ? cs.points.rv1_combo : cs.points.rv1;
  for(let i=2;i<=4;i++) if(rec[`RV${i}_ID`]) pts += cs.points.rv2;
  return Math.round(pts*10000)/10000;
}

function processRecords(raw) {
  return raw.map(r=>({
    uid:r['UID']||'',
    category:r['CATEGORY']||'',
    ir: importSettings.blocktype==='IR'?'IR':(r['COMBO?']==='Y'?'COMBO':'N'),
    qc_id:r['QC_ID']||'',
    i3qa_id:r['I3QA_ID']||'',
    i3qa_label:r['I3QA_LABEL']||'',
    fix1_id:r['FIX1_ID']||'',
    fix1_date:r['FIX1_DATE']||'',
    fixed1:r['FIXED1?']||r['FIXED1']||'',
    rv1_id:r['RV1_ID']||'',
    rv1_label:r['RV1_LABEL']||'',
    qa1_id:r['QA1_ID']||'',
    qa1_label:r['QA1_LABEL']||'',
    zfix_count:countRefixes(r),
    warn_count:countWarnings(r),
    total_points:calcPoints(r),
    rv_count:countRVTasks(r),
    fix_count:countFixTasks(r),
    _raw:r
  }));
}

// ═══════════════════════════════════════════════════════════════
// TECH SUMMARY  — points attributed to the tech who did THAT task
// ═══════════════════════════════════════════════════════════════
function buildTechSummary(rows) {
  const D = S.detect;
  const map={};
  const ensure=id=>{
    if(!map[id]){
      const info=TECH_ROSTER[id]||{};
      map[id]={id,name:info.name||id,team:info.team||'Unknown Team',
        teamNum:info.teamNum||'—',month:`${importSettings.month} ${importSettings.year} – ${importSettings.site}`,
        initial:0,i3qa:0,rv:0,fix:0,missed:0,refix:0,warn:0,points:0,
        _src:{initial:[],i3qa:[],rv:[],fix:[],missed:[],refix:[],warn:[]}};
    }
  };

  rows.forEach(r=>{
    const raw = r._raw;
    const cat = raw['CATEGORY']||'';
    let isIR;
    if(importSettings.blocktype==='IR') isIR=true;
    else isIR=false;
    const gsdVal = getCatGsdValue(cat, importSettings.gsd);
    const irM = isIR ? S.calcSettings.irModifierValue : 1.0;

    // ── QC / initial tagging ──────────────────────────────────
    // Points for QC task always go to the QC tech
    if(r.qc_id){
      ensure(r.qc_id);
      map[r.qc_id].initial++;
      map[r.qc_id]._src.initial.push(r);
      map[r.qc_id].points += S.calcSettings.points.qc;
    }

    // ── i3QA ─────────────────────────────────────────────────
    // Points for i3QA task go only to the i3QA tech
    if(r.i3qa_id){
      ensure(r.i3qa_id);
      map[r.i3qa_id].i3qa++;
      map[r.i3qa_id]._src.i3qa.push(r);
      map[r.i3qa_id].points += S.calcSettings.points.i3qa;
    }

    // ── Fix tasks ─────────────────────────────────────────────
    // Each fix round's points go to that round's fix tech.
    // Round 1 uses CATEGORY; rounds 2-4 use RV(n-1)_CAT; round 5 falls back to CATEGORY.
    const fixCatCols = [null, 'CATEGORY', 'RV1_CAT', 'RV2_CAT', 'RV3_CAT', 'CATEGORY'];
    for(let i=1;i<=5;i++){
      const f=raw[`FIX${i}_ID`];
      if(f){
        ensure(f);
        const catCol = fixCatCols[i];
        const catForRound = raw[catCol] || raw['CATEGORY'] || '';
        const roundGsdVal = getCatGsdValue(catForRound, importSettings.gsd);
        map[f].fix++;
        map[f]._src.fix.push(r);
        map[f].points += roundGsdVal * irM;
      }
    }

    // ── Missed / Rework ───────────────────────────────────────
    // A row is missed/rework when I3QA_LABEL = 'M' (case-insensitive).
    // The miss is attributed to the QC tech (QC_ID), not the Fix tech.
    {
      const i3qaLabel = (raw['I3QA_LABEL'] || '').trim().toUpperCase();
      const missLabelsUC = S.detect.triggers.miss.labels.map(l => l.toUpperCase());
      if (missLabelsUC.includes(i3qaLabel) && r.qc_id) {
        ensure(r.qc_id);
        map[r.qc_id].missed++;
        map[r.qc_id]._src.missed.push(r);
      }
    }

    // ── RV tasks ──────────────────────────────────────────────
    // RV1 points go to RV1 tech, RV2+ go to their respective techs
    const rv1=raw['RV1_ID'];
    if(rv1){
      ensure(rv1); map[rv1].rv++;
      map[rv1]._src.rv.push(r);
      map[rv1].points += isIR ? S.calcSettings.points.rv1_combo : S.calcSettings.points.rv1;
    }
    for(let i=2;i<=4;i++){
      const rvi=raw[`RV${i}_ID`];
      if(rvi){ ensure(rvi); map[rvi].rv++; map[rvi]._src.rv.push(r); map[rvi].points += S.calcSettings.points.rv2; }
    }

    // ── Refix ─────────────────────────────────────────────────
    // Use the pre-computed zfix_count from processRecords (reliable on all paths)
    // Attribute refixes to FIX techs (round-by-round ZFIX) + RV label-based
    // Label-based refixes → attributed to the RV tech for that round
    D.refixCols.forEach(col=>{
      const techIdCol = col.replace(/_LABEL$/i,'_ID');
      const techId = (raw[techIdCol]||'').trim();
      if(techId && hasLabel(raw,[col],D.refixLabels)){
        ensure(techId); map[techId].refix++; map[techId]._src.refix.push(r);
      }
    });
    // ZFIX markers → attributed to the ZFIX tech
    for(let i=1;i<=5;i++){
      const z=raw[`ZFIX${i}_ID`];
      if(z){ ensure(z); map[z].refix++; map[z]._src.refix.push(r); }
    }
    // Fallback: if _raw is empty (project reload strips _raw) but zfix_count>0,
    // attribute all refixes to the QC tech so the total still matches the tasks table
    if(!Object.keys(raw).length && r.zfix_count > 0 && r.qc_id){
      ensure(r.qc_id); map[r.qc_id].refix += r.zfix_count;
    }

    // ── Warnings (configurable cols) ─────────────────────────
    D.warnCols.forEach((col,idx)=>{
      const rvCol = `RV${idx+1}_ID`;
      const techId = (raw[rvCol]||'').trim();
      if(techId && hasLabel(raw,[col],D.warnLabels)){
        ensure(techId); map[techId].warn++; map[techId]._src.warn.push(r);
      }
    });
    // Fallback: _raw empty (project reload) but warn_count>0 → attribute to QC tech
    if(!Object.keys(raw).length && r.warn_count > 0 && r.qc_id){
      ensure(r.qc_id); map[r.qc_id].warn += r.warn_count;
    }
  });

  return Object.values(map).map(t=>{
    t.points = Math.round(t.points*10000)/10000;
    const denom=t.fix+t.refix+t.warn;
    t.qp=denom>0?(t.fix/denom*100):100;
    t.qualityPctMod=getQualityPct(t.qp);
    const threshBonus = getThresholdBonus(t.qp);

    // ── DR / DRQ deductions ────────────────────────────────────
    const EGREGIOUS_CATS = [1,2,3];
    const I3_DR_TABLE = [
      {min:200,level:'DR5',deduct:-500},{min:100,level:'DR4',deduct:-200},
      {min:70, level:'DR3',deduct:-100},{min:50, level:'DR2',deduct:-50},
      {min:30, level:'DR1',deduct:-30},
    ];
    const I3QA_DRQ_TABLE = [
      {min:200,level:'DRQ5',deduct:-500},{min:100,level:'DRQ4',deduct:-200},
      {min:50, level:'DRQ3',deduct:-100},{min:20, level:'DRQ2',deduct:-50},
      {min:10, level:'DRQ1',deduct:-30},
    ];
    const missLbls = S.detect.triggers.miss.labels.map(l=>l.toUpperCase());

    const missedSrc = t._src?.missed || [];
    const egregiousMissed = missedSrc.filter(r=>{
      const cat=parseInt(r._raw?.I3QA_CAT||r._raw?.CATEGORY||r.category||0);
      const i3qaLbl=(r._raw?.I3QA_LABEL||r.i3qa_label||'').toString().trim().toUpperCase();
      if(i3qaLbl==='D') return false; // ignore rows where I3QA_LABEL = D
      return EGREGIOUS_CATS.includes(cat);
    });
    const drRule   = I3_DR_TABLE.find(d=>egregiousMissed.length>=d.min)||null;

    const i3qaSrc = t._src?.i3qa || [];
    const egregiousDrq = i3qaSrc.filter(r=>{
      const cat  =parseInt(r._raw?.I3QA_CAT||r._raw?.CATEGORY||r.category||0);
      const label=(r._raw?.I3QA_LABEL||r.i3qa_label||'').toString().trim().toUpperCase();
      if(label==='D') return false; // ignore rows where I3QA_LABEL = D
      const f    =(r._raw?.['FIXED1?']||r._raw?.FIXED1||'').toString().trim().toUpperCase();
      const afp1 =(r._raw?.AFP1_STAT||'').toString().trim().toUpperCase();
      return EGREGIOUS_CATS.includes(cat)&&missLbls.includes(label)&&(f==='N'||afp1==='AA');
    });
    const drqRule  = I3QA_DRQ_TABLE.find(d=>egregiousDrq.length>=d.min)||null;

    t.drRule             = drRule;
    t.drDeduct           = drRule  ? drRule.deduct  : 0;
    t.drqRule            = drqRule;
    t.drqDeduct          = drqRule ? drqRule.deduct : 0;
    t.egregiousMissedCount = egregiousMissed.length;
    t.egregiousDrqCount    = egregiousDrq.length;

    t.pointsRaw = t.points;
    t.points    = Math.round((t.points + t.drDeduct + t.drqDeduct)*10000)/10000;

    t.bonusMultiplier = currentBonusMultiplier;
    if (threshBonus !== null) {
      t.thresholdApplied = true;
      t.baseBonus = t.points * (threshBonus / 100);
      t.totalBonus = t.points * currentBonusMultiplier * (threshBonus / 100);
    } else {
      t.thresholdApplied = false;
      t.baseBonus = t.points * (t.qualityPctMod/100);
      t.totalBonus = t.points * currentBonusMultiplier * (t.qualityPctMod/100);
    }
    return t;
  });
}

// ═══════════════════════════════════════════════════════════════
// STATS
// ═══════════════════════════════════════════════════════════════
function updateStats(rows){
  document.getElementById('s-total').textContent=rows.length.toLocaleString();
  document.getElementById('s-points').textContent=rows.reduce((s,r)=>s+r.total_points,0).toFixed(3);
  document.getElementById('s-qc').textContent=new Set(rows.map(r=>r.qc_id).filter(Boolean)).size;
  const fs=new Set();rows.forEach(r=>{for(let i=1;i<=5;i++){const id=r._raw[`FIX${i}_ID`];if(id)fs.add(id);}});
  document.getElementById('s-fix').textContent=fs.size;
  document.getElementById('s-ir').textContent=rows.filter(r=>r.ir==='IR'||r.ir==='COMBO').length;
  document.getElementById('s-ref').textContent=rows.reduce((s,r)=>s+r.zfix_count,0);
  document.getElementById('s-gsd').textContent=importSettings.gsd;
  document.getElementById('s-site').textContent=importSettings.site;
}

// ═══════════════════════════════════════════════════════════════
// RENDER TASKS TABLE
// ═══════════════════════════════════════════════════════════════
function renderTable(){
  const start=(currentPage-1)*PAGE_SIZE;
  const page=filtered.slice(start,start+PAGE_SIZE);
  const tbody=document.getElementById('table-body');
  if(!page.length){tbody.innerHTML=`<tr><td colspan="15" class="empty-state"><div class="es-icon">🔍</div><p>No records match.</p></td></tr>`;renderFoot([]);updatePagination();return;}
  tbody.innerHTML=page.map(r=>{
    const irTag=r.ir==='IR'?'<span style="color:var(--amber);font-weight:700;font-size:0.7rem;background:var(--amber-bg);padding:1px 5px;border-radius:3px;">IR</span>':r.ir==='COMBO'?'<span style="color:var(--purple);font-weight:700;font-size:0.7rem;background:var(--purple-bg);padding:1px 5px;border-radius:3px;">COMBO</span>':'—';
    const uidShort=r.uid.length>32?r.uid.slice(0,30)+'…':r.uid;
    return `<tr>
      <td><button class="eye-btn" title="Row Detail" onclick="openRowDetail('${r.uid}')">👁</button></td>
      <td><span class="cell-mono" title="${r.uid}">${uidShort}</span></td>
      <td style="text-align:center;font-weight:700">${r.category||'—'}</td>
      <td style="text-align:center">${irTag}</td>
      <td><span class="cell-link">${r.qc_id||'—'}</span></td>
      <td><span class="cell-link">${r.i3qa_id||'—'}</span></td>
      <td style="text-align:center">${r.i3qa_label||'—'}</td>
      <td><span class="cell-link">${r.fix1_id||'—'}</span></td>
      <td>${r.fix1_date||'—'}</td>
      <td style="text-align:center;color:${r.fixed1?'var(--green)':'var(--text-muted)'}">${r.fixed1?'✓':'—'}</td>
      <td><span class="cell-link">${r.rv1_id||'—'}</span></td>
      <td style="text-align:center">${r.rv1_label||'—'}</td>
      <td><span class="cell-link">${r.qa1_id||'—'}</span></td>
      <td class="cell-num" style="color:${r.zfix_count>0?'var(--red)':'inherit'}">${r.zfix_count||0}</td>
      <td class="cell-points">${r.total_points.toFixed(4)}</td>
    </tr>`;
  }).join('');
  renderFoot(filtered);updatePagination();
}

function renderFoot(rows){
  const foot=document.getElementById('table-foot');
  if(!rows.length){foot.innerHTML='';return;}
  foot.innerHTML=`<tr><td colspan="13"><strong>TOT</strong></td>
    <td class="cell-num"><strong>${rows.reduce((s,r)=>s+r.zfix_count,0)}</strong></td>
    <td class="cell-points"><strong>${rows.reduce((s,r)=>s+r.total_points,0).toFixed(4)}</strong></td></tr>`;
}

// ═══════════════════════════════════════════════════════════════
// RENDER TECH TABLE
// ═══════════════════════════════════════════════════════════════

function renderTechTable(){
  const isDark=document.documentElement.getAttribute('data-theme')==='dark';
  const TEAM_COLORS=isDark?{'T_63':'rgba(14,165,233,0.12)','T_115':'rgba(245,158,11,0.12)','T_57':'rgba(16,185,129,0.12)','T_116':'rgba(236,72,153,0.12)','T_123':'rgba(139,92,246,0.12)','T_114':'rgba(239,68,68,0.12)','T_64':'rgba(5,150,105,0.12)','T_122':'rgba(251,146,60,0.12)'}:{'T_63':'#e8f4fd','T_115':'#fef3c7','T_57':'#d1fae5','T_116':'#fce7f3','T_123':'#ede9fe','T_114':'#fff1f2','T_64':'#ecfdf5','T_122':'#fff7ed'};
  const tbody=document.getElementById('tech-body');
  if(!filteredTech.length){tbody.innerHTML=`<tr><td colspan="19" class="empty-state"><p>No tech data.</p></td></tr>`;renderTechFoot([]);return;}
  tbody.innerHTML=filteredTech.map(t=>{
    const qpColor=t.qp>=95?'var(--green)':t.qp>=85?'var(--amber)':'var(--red)';
    const bonusColor=t.totalBonus>0?'var(--green)':'var(--text-muted)';
    const ns='class="cell-num cell-num-blue"';
    const bg=TEAM_COLORS[t.teamNum]||'transparent';
    const dd=(stat,val)=>val>0?`<span class="cell-link" style="cursor:pointer;font-weight:700;" onclick="openDrillDown('${t.id}','${stat}')">${val}</span>`:`<span style="color:var(--text-light)">0</span>`;
    return `<tr>
      <td><button class="eye-btn" onclick="openTechDetail('${t.id}')">👁</button></td>
      <td><span class="cell-link" style="font-size:0.72rem">${t.month}</span></td>
      <td><span class="cell-link cell-mono">${t.id}</span></td>
      <td>${t.name}</td>
      <td style="background:${bg};font-weight:600;color:var(--text)">${t.team}</td>
      <td style="text-align:center;background:${bg};font-size:0.68rem;color:var(--text);font-weight:600">${t.teamNum}</td>
      <td class="cell-num cell-num-blue">${dd('initial',t.initial)}</td>
      <td class="cell-num cell-num-blue">${dd('i3qa',t.i3qa)}</td>
      <td class="cell-num cell-num-blue">${dd('rv',t.rv)}</td>
      <td class="cell-num cell-num-blue">${dd('fix',t.fix)}</td>
      <td class="cell-num cell-num-blue">${dd('missed',t.missed)}</td>
      <td class="cell-num cell-num-blue">${dd('refix',t.refix)}</td>
      <td class="cell-num cell-num-blue">${dd('warn',t.warn)}</td>
      <td class="cell-points" style="${(t.drDeduct||0)+(t.drqDeduct||0)<0?'color:var(--red);background:rgba(220,38,38,0.05);':''}" title="${(t.drDeduct||0)+(t.drqDeduct||0)<0?`Before deductions: ${(t.pointsRaw||t.points).toFixed(4)} pts | DR: ${t.drDeduct||0} | DRQ: ${t.drqDeduct||0}`:'Net points (no deductions)'}">
        ${t.points.toFixed(4)}
        ${(t.drDeduct||0)+(t.drqDeduct||0)<0?`<div style="font-size:0.59rem;color:var(--red);font-weight:700;line-height:1.2;margin-top:1px;white-space:nowrap;">${[(t.drDeduct||0)<0?`DR${t.drDeduct}`:'',(t.drqDeduct||0)<0?`DRQ${t.drqDeduct}`:''].filter(Boolean).join(' ')}</div>`:''}
      </td>
      <td class="cell-qp" style="color:${qpColor};font-weight:700">${t.qp.toFixed(2)}%</td>
      <td class="cell-num" style="color:${t.thresholdApplied?'var(--green)':'var(--accent)'};font-weight:${t.thresholdApplied?'700':'400'}">${t.qualityPctMod}%${t.thresholdApplied?'<span style="font-size:0.6rem;background:var(--green);color:#fff;border-radius:3px;padding:0 4px;margin-left:3px;">★</span>':''}</td>
      <td class="cell-points" style="color:var(--accent);background:rgba(14,165,233,0.05)">${(t.baseBonus||0).toFixed(4)}</td>
      <td class="cell-num" style="color:var(--text-muted)">${t.bonusMultiplier.toFixed(2)}</td>
      <td class="cell-points" style="color:${bonusColor};background:rgba(5,150,105,0.12);font-weight:700;font-size:0.85rem;">₱ ${t.totalBonus.toFixed(4)}</td>
    </tr>`;
  }).join('');
  renderTechFoot(filteredTech);
}

function renderTechFoot(rows){
  const foot=document.getElementById('tech-foot');
  if(!rows.length){foot.innerHTML='';return;}
  const sum=k=>rows.reduce((s,r)=>s+r[k],0);
  foot.innerHTML=`<tr>
    <td colspan="6"><strong>TOT</strong></td>
    <td class="cell-num"><strong>${sum('initial')}</strong></td>
    <td class="cell-num"><strong>${sum('i3qa')}</strong></td>
    <td class="cell-num"><strong>${sum('rv')}</strong></td>
    <td class="cell-num"><strong>${sum('fix')}</strong></td>
    <td class="cell-num"><strong>${sum('missed')}</strong></td>
    <td class="cell-num"><strong>${sum('refix')}</strong></td>
    <td class="cell-num"><strong>${sum('warn')}</strong></td>
    <td class="cell-points"><strong>${sum('points').toFixed(4)}</strong></td>
    <td colspan="2"></td>
    <td class="cell-points" style="color:var(--accent);background:rgba(14,165,233,0.05)"><strong>${sum('baseBonus').toFixed(4)}</strong></td>
    <td></td>
    <td class="cell-points" style="color:var(--green);background:rgba(5,150,105,0.12);font-weight:700;font-size:0.85rem;"><strong>₱ ${sum('totalBonus').toFixed(4)}</strong></td>
  </tr>`;
}

// ═══════════════════════════════════════════════════════════════
// BONUS CALC
// ═══════════════════════════════════════════════════════════════
function recalcBonus(){
  const bonusMult=Number(document.getElementById('bp-manual-mult').value)||0;
  currentBonusMultiplier=bonusMult;
  const applyToTech = t => {
    const threshBonus = getThresholdBonus(t.qp);
    const qualityFrac = t.qualityPctMod / 100; // qualityPctMod is stored as 0-120 scale (bonus tier %)
    // bonusMultiplier (PHP) is always the same input value regardless of threshold
    t.bonusMultiplier = bonusMult;
    if (threshBonus !== null) {
      t.thresholdApplied = true;
      t.baseBonus = t.points * (threshBonus / 100);
      t.totalBonus = t.points * bonusMult * (threshBonus / 100);
    } else {
      t.thresholdApplied = false;
      t.baseBonus = t.points * qualityFrac;
      t.totalBonus = t.points * bonusMult * qualityFrac;
    }
  };
  // Apply only to techRows (single source of truth).
  // filteredTech holds references to the same objects, so they update automatically.
  techRows.forEach(applyToTech);
  // Rebuild filteredTech from updated techRows (preserves current search/team filter + sort)
  applyTechFilter();
}

// ═══════════════════════════════════════════════════════════════
// SORT / FILTER
// ═══════════════════════════════════════════════════════════════
function applyFilters(){
  const q=document.getElementById('search-input').value.toLowerCase();
  const cat=document.getElementById('cat-filter').value;
  const ir=document.getElementById('ir-filter').value;
  filtered=allRows.filter(r=>{
    if(cat&&r.category!==cat)return false;
    if(ir&&r.ir!==ir)return false;
    if(q&&!(r.uid.toLowerCase().includes(q)||r.qc_id.toLowerCase().includes(q)||r.fix1_id.toLowerCase().includes(q)||r.i3qa_id.toLowerCase().includes(q)))return false;
    for(const[idx,val]of Object.entries(colFilters)){
      if(!val)continue;
      const cols=['uid','category','ir','qc_id','i3qa_id','i3qa_label','fix1_id','fix1_date','fixed1','rv1_id','rv1_label','qa1_id'];
      const colKey=cols[idx-1]||'';
      if(colKey&&!(r[colKey]||'').toString().toLowerCase().includes(val))return false;
    }
    return true;
  });
  filtered.sort((a,b)=>{let av=a[sortKey],bv=b[sortKey];if(typeof av==='string')av=av.toLowerCase();if(typeof bv==='string')bv=bv.toLowerCase();return av<bv?sortDir:av>bv?-sortDir:0;});
  currentPage=1;renderTable();
  applyTechFilter();
}
function colFilter(input,colIdx){colFilters[colIdx]=input.value.toLowerCase();applyFilters();}
function sortBy(key){if(sortKey===key)sortDir*=-1;else{sortKey=key;sortDir=-1;}document.querySelectorAll('#main-table thead tr:first-child th').forEach(th=>th.classList.remove('sort-asc','sort-desc'));const ths=document.querySelectorAll('#main-table thead tr:first-child th');const km=['','uid','category','ir','qc_id','i3qa_id','i3qa_label','fix1_id','fix1_date','fixed1','rv1_id','rv1_label','qa1_id','zfix_count','total_points'];const idx=km.indexOf(key);if(idx>=0&&ths[idx])ths[idx].classList.add(sortDir===-1?'sort-desc':'sort-asc');applyFilters();}
function sortTech(key){if(techSortKey===key)techSortDir*=-1;else{techSortKey=key;techSortDir=-1;}applyTechFilter();}

// ═══════════════════════════════════════════════════════════════
// PAGINATION
// ═══════════════════════════════════════════════════════════════
function updatePagination(){
  const total=Math.ceil(filtered.length/PAGE_SIZE);const cp=currentPage;
  document.getElementById('page-info').textContent=`Showing ${Math.min((cp-1)*PAGE_SIZE+1,filtered.length)}–${Math.min(cp*PAGE_SIZE,filtered.length)} of ${filtered.length.toLocaleString()}`;
  document.getElementById('prev-btn').disabled=cp<=1;document.getElementById('next-btn').disabled=cp>=total;
  const mid=document.getElementById('page-mid');const pages=[];
  if(total<=7){for(let i=1;i<=total;i++)pages.push(i);}
  else{pages.push(1);if(cp>3)pages.push('…');for(let i=Math.max(2,cp-1);i<=Math.min(total-1,cp+1);i++)pages.push(i);if(cp<total-2)pages.push('…');pages.push(total);}
  mid.innerHTML=pages.map(p=>p==='…'?`<span style="padding:4px;color:var(--text-muted)">…</span>`:`<button class="page-btn${p===cp?' active':''}" onclick="gotoPage(${p})">${p}</button>`).join('');
}
function changePage(dir){const total=Math.ceil(filtered.length/PAGE_SIZE);currentPage=Math.max(1,Math.min(total,currentPage+dir));renderTable();document.querySelector('.table-wrap').scrollTop=0;}
function gotoPage(p){currentPage=p;renderTable();document.querySelector('.table-wrap').scrollTop=0;}
function changePageSize(){PAGE_SIZE=+document.getElementById('rows-per-page').value;currentPage=1;renderTable();}

// ═══════════════════════════════════════════════════════════════
// VIEWS
// ═══════════════════════════════════════════════════════════════
function switchView(v,opts){
  opts=opts||{};
  currentView=v;
  document.getElementById('nav-tasks').classList.toggle('active',v==='tasks');
  document.getElementById('nav-tech').classList.toggle('active',v==='tech');
  document.getElementById('nav-calcall').classList.toggle('active',v==='calcall');
  // Calc All: always show content-area and hide dropzone so the view is reachable
  // even when no single project is loaded in the current session (e.g. after refresh)
  if(v==='calcall'){
    document.getElementById('dropzone-wrap').style.display='none';
    document.getElementById('content-area').style.display='flex';
  } else {
    // Switching back to tasks/tech: restore normal dropzone vs content state
    const hasProject = allRows.length > 0;
    document.getElementById('dropzone-wrap').style.display = hasProject ? 'none' : '';
    document.getElementById('content-area').style.display = hasProject ? 'flex' : 'none';
  }
  document.getElementById('view-tasks').style.display=v==='tasks'?'block':'none';
  document.getElementById('view-tech').style.display=v==='tech'?'block':'none';
  document.getElementById('view-calcall').style.display=v==='calcall'?'flex':'none';
  document.querySelector('.pagination-bar').style.display=v==='tasks'?'flex':'none';
  document.getElementById('bonus-panel-wrap').style.display=v==='tech'?'block':'none';
  document.getElementById('team-filter-bar').style.display=v==='tech'?'flex':'none';
  // Hide the single-project stats bar and search toolbar when viewing Calc All
  document.querySelector('.stats-bar').style.display=v==='calcall'?'none':'';
  document.getElementById('main-toolbar').style.display=v==='calcall'?'none':'';
  // Dim/disable project list items when in Calc All (they all feed the calc, none should load)
  document.getElementById('project-list').classList.toggle('calcall-mode', v==='calcall');
  document.getElementById('project-list-hint').classList.toggle('show', v==='calcall');
  if(v==='tech'){buildTeamChips();recalcBonus();}
  // Skip the auto Calculate-All recompute when we're navigating in specifically
  // to view one "Load Full Data" project (see openFullDataProject) — that
  // recompute only covers raw-row saved projects and would otherwise silently
  // discard the loaded full-data snapshot and reset the project filter we
  // just set, which is why Fixpoint Tasks/Tech Summary → a "(loaded)" project
  // appeared broken.
  if(v==='calcall' && !opts.skipRecalc){initCalcAllView();}
}

// ═══════════════════════════════════════════════════════════════
// IMPORT MODAL
// ═══════════════════════════════════════════════════════════════
function selectChip(el){
  const group=el.dataset.group;
  document.querySelectorAll(`.chip[data-group="${group}"]`).forEach(c=>{
    c.classList.remove('selected','green','amber','red','gray');
  });
  el.classList.add('selected');
  if(group==='gsd'){
    if(el.dataset.val==='3in')el.classList.add('amber');
    else if(el.dataset.val==='9in')el.classList.add('red');
    else el.classList.add('green');
  } else if(group==='site') {
    // default blue accent
  } else if(group==='blocktype'){
    if(el.dataset.val==='IR')el.classList.add('amber');
    else if(el.dataset.val==='NON')el.classList.add('red');
    else el.classList.add('gray');
  }
}

function impBlocktypeChange() {
  const isIR = document.getElementById('imp-bt-ir').checked;
  const notice = document.getElementById('imp-ir-notice');
  notice.style.display = isIR ? 'block' : 'none';
  notice.style.borderColor = 'var(--amber)'; notice.style.background = '#fef3c7'; notice.style.color = '#92400e';
  notice.innerHTML = '⚡ <strong>IR Project:</strong> All fix task points will be multiplied by ×1.5. SQM bonus multiplier does not apply.';
}

function openImportModal(file){
  pendingFile=file;
  const fn=file.name.replace(/\.(zip|dbf)$/i,'');
  document.getElementById('imp-name').value=fn;
  document.getElementById('imp-bt-non').checked=true;
  document.getElementById('imp-ir-notice').style.display='none';
  document.getElementById('import-modal').classList.add('show');
}

function cancelImport(){
  pendingFile=null;
  document.getElementById('import-modal').classList.remove('show');
}

async function confirmImport(){
  const site = document.querySelector('.chip[data-group="site"].selected')?.dataset.val || 'Cebu';
  const gsd  = document.querySelector('.chip[data-group="gsd"].selected')?.dataset.val || '6in';
  const blocktype = document.getElementById('imp-bt-ir').checked ? 'IR' : 'NON';
  const month = document.getElementById('imp-month').value;
  const year  = Number(document.getElementById('imp-year').value);
  const name  = document.getElementById('imp-name').value.trim() ||
                pendingFile.name.replace(/\.(zip|dbf)$/i,'');

  importSettings = {site, gsd, blocktype, month, year, sqm: 0, name};
  document.getElementById('import-modal').classList.remove('show');

  if(pendingFile){
    await doLoad(pendingFile);
    pendingFile=null;
  }
}

// ═══════════════════════════════════════════════════════════════
// LOAD DATA
// ═══════════════════════════════════════════════════════════════
async function doLoad(file){
  currentProjectName=importSettings.name||file.name.replace(/\.(zip|dbf)$/i,'');
  if(file.name.toLowerCase().endsWith('.zip')){
    showLoading('Extracting ZIP…');
    const zip=await JSZip.loadAsync(file);
    const entry=Object.values(zip.files).find(f=>f.name.toLowerCase().endsWith('.dbf'));
    if(!entry){hideLoading();toast('❌ No .dbf found in ZIP');return;}
    const buf=await entry.async('arraybuffer');
    await loadBuffer(buf,currentProjectName);
  } else if(file.name.toLowerCase().endsWith('.dbf')){
    const buf=await file.arrayBuffer();
    await loadBuffer(buf,currentProjectName);
  } else {
    toast('❌ Please use .zip or .dbf');
  }
}

async function handleFile(file){
  openImportModal(file);
}

// Parse a CSV file into the same record shape as parseDBF: an array of plain
// objects keyed by UPPERCASE column headers (matching raw DBF field names like
// UID, CATEGORY, QC_ID, I3QA_ID, I3QA_CAT, FIX1_ID, FIXED1?, AFP1_STAT, etc.)
// Handles quoted fields, escaped quotes (""), commas/newlines inside quotes, and a BOM.
function parseCSV(text) {
  if (!text) return [];
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1); // strip BOM
  const rows = [];
  let i = 0, field = '', row = [], inQuotes = false;
  const pushField = () => { row.push(field); field = ''; };
  const pushRow = () => { rows.push(row); row = []; };
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i+1] === '"') { field += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      field += c; i++; continue;
    } else {
      if (c === '"') { inQuotes = true; i++; continue; }
      if (c === ',') { pushField(); i++; continue; }
      if (c === '\r') { i++; continue; }
      if (c === '\n') { pushField(); pushRow(); i++; continue; }
      field += c; i++; continue;
    }
  }
  if (field.length || row.length) { pushField(); pushRow(); }
  while (rows.length && rows[rows.length-1].length === 1 && rows[rows.length-1][0] === '') rows.pop();
  if (!rows.length) return [];
  const headers = rows[0].map(h => h.trim().toUpperCase());
  const records = [];
  for (let r = 1; r < rows.length; r++) {
    const cols = rows[r];
    if (cols.length === 1 && cols[0] === '') continue; // skip blank line
    const rec = {};
    headers.forEach((h, idx) => { rec[h] = (cols[idx] !== undefined ? cols[idx] : '').toString().trim(); });
    records.push(rec);
  }
  return records;
}

function parseDBF(buffer){
  if (!buffer || buffer.byteLength < 32) return [];
  const view=new DataView(buffer);
  const numRecords=view.getUint32(4,true);
  const headerBytes=view.getUint16(8,true);
  const recordBytes=view.getUint16(10,true);
  if (headerBytes > buffer.byteLength) return [];
  const fields=[];let offset=32;
  while(offset+32<=headerBytes&&offset<buffer.byteLength&&view.getUint8(offset)!==0x0D){
    const nameBytes=new Uint8Array(buffer,offset,11);let name='';
    for(let i=0;i<11;i++){if(nameBytes[i]===0)break;name+=String.fromCharCode(nameBytes[i]);}
    const length=view.getUint8(offset+16);
    if(length>0) fields.push({name,length});
    offset+=32;
  }
  // Normalise all field names to uppercase so lookups always work (e.g. i3QA_ID → I3QA_ID)
  fields.forEach(f=>{ f.name = f.name.toUpperCase(); });
  const dec=new TextDecoder('latin1');const records=[];let recOff=headerBytes;
  for(let r=0;r<numRecords;r++){
    if(recOff>=buffer.byteLength) break;
    const del=view.getUint8(recOff++);
    if(del===0x2A){recOff+=recordBytes-1;continue;}
    const rec={};
    for(const f of fields){
      if(recOff+f.length>buffer.byteLength) break;
      rec[f.name]=dec.decode(new Uint8Array(buffer,recOff,f.length)).trim();
      recOff+=f.length;
    }
    records.push(rec);
  }
  return records;
}

async function loadBuffer(buffer,name){
  showLoading('Parsing fixpoint records…');
  await new Promise(r=>setTimeout(r,30));
  const raw=parseDBF(buffer);
  currentRawRecords = raw; // store for saving
  allRows=processRecords(raw);
  filtered=[...allRows];
  currentBonusMultiplier=getSqmMultiplier(importSettings.sqm);
  techRows=buildTechStats(allRows.map(r=>r._raw||r));
  filteredTech=[...techRows];
  activeTeamFilter='';
  if(name)currentProjectName=name;
  updateStats(allRows);
  sortBy('total_points');
  buildTeamChips();
  renderTechTable();
  document.getElementById('dropzone-wrap').style.display='none';
  document.getElementById('content-area').style.display='flex';
  document.getElementById('main-toolbar').style.display='';
  document.querySelector('.stats-bar').style.display='';
  document.getElementById('btn-save-project').style.display='';
  currentRawFile=buffer;
  updateProjectBadge();
  if(currentView==='calcall') switchView('tasks');
  hideLoading();
  toast(`✓ Loaded ${allRows.length.toLocaleString()} records · ${importSettings.gsd} · ${importSettings.site}`);
}

// Alias for use in multi-file merge (same as parseDBF)
function parseDbf(buffer) { return parseDBF(buffer); }

// Load pre-parsed raw rows (used when merging multiple DBF files)
// Global to hold the last-loaded raw DBF records (used for reliable project saving)
let currentRawRecords = [];

async function loadParsedRows(rawRecords, name, fileCount, preserveTeamFilter) {
  await new Promise(r => setTimeout(r, 30));
  currentRawRecords = rawRecords; // store for saving
  allRows = processRecords(rawRecords);
  filtered = [...allRows];
  colFilters = {};
  currentBonusMultiplier = getSqmMultiplier(importSettings.sqm);
  techRows = buildTechStats(allRows.map(r => r._raw || r));
  filteredTech = [...techRows];
  if (!preserveTeamFilter) activeTeamFilter = '';
  else if (activeTeamFilter) {
    // If the previously selected team doesn't exist in this project, fall back to All Teams
    const teamsHere = new Set(techRows.map(t => t.team).filter(Boolean));
    if (!teamsHere.has(activeTeamFilter)) activeTeamFilter = '';
  }
  sortKey = 'total_points'; sortDir = -1;
  if (name) currentProjectName = name;
  filtered.sort((a,b) => b.total_points - a.total_points);
  currentPage = 1;
  updateStats(allRows);
  buildTeamChips();
  renderTable();
  if (activeTeamFilter) applyTechFilter(); else renderTechTable();
  document.getElementById('dropzone-wrap').style.display = 'none';
  document.getElementById('content-area').style.display = 'flex';
  document.getElementById('main-toolbar').style.display = '';
  document.querySelector('.stats-bar').style.display = '';
  document.getElementById('btn-save-project').style.display = '';
  updateProjectBadge();
  if(currentView==='calcall') switchView('tasks');
  hideLoading();
  const src = fileCount > 1 ? ` from ${fileCount} files` : '';
  toast(`✓ Loaded ${allRows.length.toLocaleString()} records${src} · ${importSettings.gsd} · ${importSettings.site}`);
}


function updateProjectBadge(){
  const badge=document.getElementById('project-badge');
  badge.style.display='flex';
  document.getElementById('pb-site').textContent=importSettings.site;
  document.getElementById('pb-gsd').textContent=importSettings.gsd;
  const typeEl=document.getElementById('pb-type');
  if(importSettings.blocktype==='IR'){typeEl.textContent='All IR';typeEl.className='pb-type ir';}
  else{typeEl.textContent='Non-IR';typeEl.className='pb-type non';}
  document.getElementById('pb-name').textContent=currentProjectName;
}

// ═══════════════════════════════════════════════════════════════
// SETTINGS MODAL
// ═══════════════════════════════════════════════════════════════
function openSettings(){
  renderSettingsTables();
  renderRosterTable();
  document.getElementById('settings-modal').classList.add('show');
}
function closeSettings(){document.getElementById('settings-modal').classList.remove('show');}

function switchTab(name){
  document.querySelectorAll('.stab').forEach((t,i)=>{
    const tabs=['cat','quality','ir','detect','bonus','roster','teams'];
    t.classList.toggle('active',tabs[i]===name);
  });
  document.querySelectorAll('.stab-content').forEach(c=>c.classList.remove('active'));
  document.getElementById(`tab-${name}`).classList.add('active');
  if(name==='roster') renderRosterTable();
  if(name==='teams') renderTeamsTable();
}

function renderSettingsTables(){
  // Category values
  // Build catValues array from S.calcSettings.categoryValues for the settings table
  const catValuesArr = Object.entries(S.calcSettings.categoryValues).map(([cat,vals])=>({
    cat:Number(cat), v3:vals['3in'], v4:vals['4in'], v6:vals['6in'], v9:vals['9in']
  }));
  document.getElementById('cat-table-body').innerHTML=catValuesArr.map((row,i)=>`
    <tr>
      <td><strong>${row.cat}</strong></td>
      <td><input class="mod-input" data-table="cat" data-idx="${i}" data-field="v3" value="${row.v3}" /></td>
      <td><input class="mod-input" data-table="cat" data-idx="${i}" data-field="v4" value="${row.v4}" /></td>
      <td><input class="mod-input" data-table="cat" data-idx="${i}" data-field="v6" value="${row.v6}" /></td>
      <td><input class="mod-input" data-table="cat" data-idx="${i}" data-field="v9" value="${row.v9}" /></td>
    </tr>`).join('');

  // Quality Modifiers — now driven by bonusTiers (from script.js)
  document.getElementById('quality-table-body').innerHTML=S.bonusTiers.map((row,i)=>`
    <tr>
      <td>${row.quality}%</td>
      <td>${(row.bonus*100).toFixed(0)}%</td>
      <td><input class="mod-input" data-table="bonus-tier" data-idx="${i}" data-field="bonus" value="${(row.bonus*100).toFixed(0)}" style="width:70px;" /></td>
    </tr>`).join('');

  // IR / Points tab
  document.getElementById('ir-mod-input').value   = S.calcSettings.irModifierValue;
  document.getElementById('bonus-floor-input').value = S.bonusFloor;
  document.getElementById('rv1-non-ir-input').value  = S.calcSettings.points.rv1;
  document.getElementById('rv1-ir-input').value       = S.calcSettings.points.rv1_combo;
  document.getElementById('rv2-input').value          = S.calcSettings.points.rv2;
  document.getElementById('qc-pts-input').value       = S.calcSettings.points.qc;
  document.getElementById('i3qa-pts-input').value     = S.calcSettings.points.i3qa;

  // Bonus thresholds tab
  const bt = S.bonusThresholds || [];
  const top = bt.find(t=>t.quality===100) || {quality:100, bonus:120};
  const mid = bt.find(t=>t.quality<100 && t.quality>=99) || bt[1] || {quality:99.5, bonus:118};
  document.getElementById('bonus-top-quality').value = top.quality;
  document.getElementById('bonus-top-mult').value = top.bonus;
  document.getElementById('bonus-mid-quality').value = mid.quality;
  document.getElementById('bonus-mid-mult').value = mid.bonus;

  // Detection rules tab
  const D = S.detect;
  document.getElementById('det-qc-col').value   = (D.taskColumns.qc||[]).join(', ')   || 'qc_id';
  document.getElementById('det-i3qa-col').value  = (D.taskColumns.i3qa||[]).join(', ') || 'i3qa_id';
  document.getElementById('det-rv1-col').value   = (D.taskColumns.rv1||[]).join(', ')  || 'rv1_id';
  document.getElementById('det-rv2-col').value   = (D.taskColumns.rv2||[]).join(', ')  || 'rv2_id';
  document.getElementById('det-refix-labels').value  = (D.triggers.refix.labels     ||[]).join(', ');
  document.getElementById('det-refix-cols').value    = (D.triggers.refix.columns    ||[]).join(', ');
  document.getElementById('det-miss-labels').value   = (D.triggers.miss.labels      ||[]).join(', ');
  document.getElementById('det-miss-cols').value     = (D.triggers.miss.columns     ||[]).join(', ');
  document.getElementById('det-warn-labels').value   = (D.triggers.warning.labels   ||[]).join(', ');
  document.getElementById('det-warn-cols').value     = (D.triggers.warning.columns  ||[]).join(', ');
  document.getElementById('det-qcpen-labels').value  = (D.triggers.qcPenalty.labels ||[]).join(', ');
  document.getElementById('det-qcpen-cols').value    = (D.triggers.qcPenalty.columns||[]).join(', ');
}

function saveSettings(){
  // Read all editable inputs
  document.querySelectorAll('.mod-input[data-table]').forEach(inp=>{
    const tbl=inp.dataset.table;const idx=Number(inp.dataset.idx);const field=inp.dataset.field;
    const val=Number(inp.value);
    if(tbl==='cat'){
      // map old field names v3/v4/v6/v9 → gsd keys
      const gsdMap={v3:'3in',v4:'4in',v6:'6in',v9:'9in'};
      // derive the actual category number from the rendered catValuesArr order
      const catValuesArr = Object.entries(S.calcSettings.categoryValues).map(([cat,vals])=>({cat:Number(cat)}));
      const cat = catValuesArr[idx] ? catValuesArr[idx].cat : idx+1;
      const gKey=gsdMap[field]||field;
      if(S.calcSettings.categoryValues[cat]) S.calcSettings.categoryValues[cat][gKey]=val;
    } else if(tbl==='bonus-tier'){
      // Save edited bonus % back to the tier (stored as fraction, input shows as %)
      if(S.bonusTiers[idx] && field==='bonus') S.bonusTiers[idx].bonus = val / 100;
    }
  });
  S.calcSettings.irModifierValue = Number(document.getElementById('ir-mod-input').value)||1.5;
  S.bonusFloor = Number(document.getElementById('bonus-floor-input').value)||9.5;
  S.calcSettings.points.rv1       = Number(document.getElementById('rv1-non-ir-input').value)||0.2;
  S.calcSettings.points.rv1_combo = Number(document.getElementById('rv1-ir-input').value)||0.25;
  S.calcSettings.points.rv2       = Number(document.getElementById('rv2-input').value)||0.5;
  S.calcSettings.points.qc        = Number(document.getElementById('qc-pts-input').value)||0.125;
  S.calcSettings.points.i3qa      = Number(document.getElementById('i3qa-pts-input').value)||1/12;

  // Save bonus thresholds
  S.bonusThresholds = [
    { quality: Number(document.getElementById('bonus-top-quality').value)||100, bonus: Number(document.getElementById('bonus-top-mult').value)||120 },
    { quality: Number(document.getElementById('bonus-mid-quality').value)||99.5, bonus: Number(document.getElementById('bonus-mid-mult').value)||118 },
  ].sort((a,b)=>b.quality-a.quality);

  // Save detection rules into the triggers/taskColumns structure
  S.detect.taskColumns.qc   = splitLabels(document.getElementById('det-qc-col').value)  .map(s=>s.toLowerCase());
  S.detect.taskColumns.i3qa = splitLabels(document.getElementById('det-i3qa-col').value) .map(s=>s.toLowerCase());
  S.detect.taskColumns.rv1  = splitLabels(document.getElementById('det-rv1-col').value)  .map(s=>s.toLowerCase());
  S.detect.taskColumns.rv2  = splitLabels(document.getElementById('det-rv2-col').value)  .map(s=>s.toLowerCase());
  S.detect.triggers.refix.labels     = splitLabels(document.getElementById('det-refix-labels').value);
  S.detect.triggers.refix.columns    = splitLabels(document.getElementById('det-refix-cols').value);
  S.detect.triggers.miss.labels      = splitLabels(document.getElementById('det-miss-labels').value);
  S.detect.triggers.miss.columns     = splitLabels(document.getElementById('det-miss-cols').value);
  S.detect.triggers.warning.labels   = splitLabels(document.getElementById('det-warn-labels').value);
  S.detect.triggers.warning.columns  = splitLabels(document.getElementById('det-warn-cols').value);
  S.detect.triggers.qcPenalty.labels = splitLabels(document.getElementById('det-qcpen-labels').value);
  S.detect.triggers.qcPenalty.columns= splitLabels(document.getElementById('det-qcpen-cols').value);
  closeSettings();
  // Recalculate everything — use currentRawRecords (works for both drag-drop and loaded projects)
  if(allRows.length>0 && currentRawRecords.length){
    showLoading('Recalculating with new settings…');
    setTimeout(()=>{
      allRows=processRecords(currentRawRecords);
      filtered=[...allRows];
      techRows=buildTechStats(currentRawRecords);
      filteredTech=[...techRows];
      activeTeamFilter='';
      updateStats(allRows);
      applyFilters();
      buildTeamChips();
      renderTechTable();
      if(currentView==='tech')recalcBonus();
      hideLoading();
      toast('✓ Settings saved & points recalculated');
    },30);
  } else {
    toast('✓ Settings saved');
  }
  // Persist settings to localStorage so they survive page refresh
  try {
    const toSave = {
      bonusTiers: S.bonusTiers, calcSettings: S.calcSettings,
      bonusFloor: S.bonusFloor, bonusThresholds: S.bonusThresholds,
      sqmMultipliers: S.sqmMultipliers, densityModifiers: S.densityModifiers,
      detect: { taskColumns: S.detect.taskColumns, triggers: S.detect.triggers },
    };
    localStorage.setItem('fp-settings-v2', JSON.stringify(toSave));
  } catch(e) { console.warn('Settings persist failed:', e); }
}

function resetSettings(){
  if(!confirm('Reset all modifier tables to PDF defaults?'))return;
  S=cloneDefaults();
  try { localStorage.removeItem('fp-settings-v2'); } catch(e) {}
  renderSettingsTables();
  toast('↺ Reset to PDF defaults');
}

// ═══════════════════════════════════════════════════════════════
// TECH ROSTER MANAGEMENT
// ═══════════════════════════════════════════════════════════════
let _editingTechId = null; // null = adding new, string = editing existing

function renderRosterTable(filterVal) {
  const q = (filterVal || document.getElementById('roster-search')?.value || '').toLowerCase();
  const entries = Object.entries(TECH_ROSTER)
    .filter(([id, info]) => !q || id.toLowerCase().includes(q) || (info.name||'').toLowerCase().includes(q) || (info.team||'').toLowerCase().includes(q))
    .sort((a,b) => a[0].localeCompare(b[0]));
  const tbody = document.getElementById('roster-table-body');
  if (!tbody) return;
  tbody.innerHTML = entries.map(([id, info]) => `
    <tr>
      <td><span class="cell-mono" style="font-size:0.78rem;font-weight:700">${id}</span></td>
      <td>${info.name||'—'}</td>
      <td>${info.team||'—'}</td>
      <td style="color:var(--text-muted);font-size:0.72rem">${info.teamNum||'—'}</td>
      <td style="text-align:center;white-space:nowrap;">
        <button class="btn btn-ghost" style="padding:3px 8px;font-size:0.72rem;" onclick="openEditTechModal('${id.replace(/'/g,"\\'")}')" title="Edit">✏</button>
        <button class="btn btn-danger" style="padding:3px 8px;font-size:0.72rem;" onclick="deleteTechEntry('${id.replace(/'/g,"\\'")}')" title="Delete">🗑</button>
      </td>
    </tr>`).join('');
  const countEl = document.getElementById('roster-count');
  if (countEl) countEl.textContent = `${entries.length} of ${Object.keys(TECH_ROSTER).length} technicians`;
}

function filterRosterTable() {
  renderRosterTable(document.getElementById('roster-search').value);
}

function openAddTechModal() {
  _editingTechId = null;
  document.getElementById('add-tech-title').textContent = '➕ Add Tech';
  document.getElementById('tech-id-input').value = '';
  document.getElementById('tech-name-input').value = '';
  document.getElementById('tech-team-input').value = '';
  document.getElementById('tech-teamnum-input').value = '';
  document.getElementById('tech-id-input').readOnly = false;
  document.getElementById('tech-modal-err').style.display = 'none';
  populateTeamDatalist();
  document.getElementById('tech-team-select').value = '';
  document.getElementById('add-tech-modal').classList.add('show');
  setTimeout(() => document.getElementById('tech-id-input').focus(), 100);
}

function openEditTechModal(id) {
  const info = TECH_ROSTER[id];
  if (!info) return;
  _editingTechId = id;
  document.getElementById('add-tech-title').textContent = `✏ Edit Tech — ${id}`;
  document.getElementById('tech-id-input').value = id;
  document.getElementById('tech-id-input').readOnly = true;
  document.getElementById('tech-name-input').value = info.name || '';
  document.getElementById('tech-team-input').value = info.team || '';
  document.getElementById('tech-teamnum-input').value = info.teamNum || '';
  document.getElementById('tech-modal-err').style.display = 'none';
  populateTeamDatalist();
  // Select the matching option in the dropdown
  const sel = document.getElementById('tech-team-select');
  sel.value = info.team || '';
  document.getElementById('add-tech-modal').classList.add('show');
  setTimeout(() => document.getElementById('tech-name-input').focus(), 100);
}

function saveTechEntry() {
  const id = document.getElementById('tech-id-input').value.trim().toUpperCase();
  const name = document.getElementById('tech-name-input').value.trim();
  const team = document.getElementById('tech-team-input').value.trim();
  const teamNum = document.getElementById('tech-teamnum-input').value.trim();
  const errEl = document.getElementById('tech-modal-err');
  if (!id) { errEl.textContent='Tech ID is required.'; errEl.style.display='block'; return; }
  if (!name) { errEl.textContent='Full Name is required.'; errEl.style.display='block'; return; }
  if (!_editingTechId && TECH_ROSTER[id]) { errEl.textContent=`Tech ID "${id}" already exists.`; errEl.style.display='block'; return; }
  TECH_ROSTER[id] = { name, team, teamNum };
  closeModal('add-tech-modal');
  renderRosterTable();
  toast(`✓ ${_editingTechId ? 'Updated' : 'Added'} tech ${id}`);
}

function deleteTechEntry(id) {
  if (!confirm(`Delete tech "${id} — ${TECH_ROSTER[id]?.name || ''}"? This cannot be undone.`)) return;
  delete TECH_ROSTER[id];
  renderRosterTable();
  toast(`🗑 Deleted tech ${id}`);
}

function exportRosterCSV() {
  const lines = ['Tech ID,Full Name,Team,Team #'];
  Object.entries(TECH_ROSTER).sort((a,b)=>a[0].localeCompare(b[0]))
    .forEach(([id,info]) => lines.push(`"${id}","${info.name||''}","${info.team||''}","${info.teamNum||''}"`));
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([lines.join('\n')], {type:'text/csv'}));
  a.download = 'tech_roster.csv';
  a.click();
}

// ═══════════════════════════════════════════════════════════════
// TEAM MANAGEMENT
// ═══════════════════════════════════════════════════════════════
let _editingTeamName = null; // null = adding, string = editing

function getTeams() {
  // Derive unique teams from TECH_ROSTER
  const map = {};
  Object.values(TECH_ROSTER).forEach(info => {
    if (info.team) {
      if (!map[info.team]) map[info.team] = { name: info.team, teamNum: info.teamNum || '—', count: 0 };
      map[info.team].count++;
    }
  });
  return Object.values(map).sort((a,b) => a.name.localeCompare(b.name));
}

function renderTeamsTable() {
  const teams = getTeams();
  const tbody = document.getElementById('teams-table-body');
  if (!tbody) return;
  if (!teams.length) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:20px;">No teams found. Add techs with team names first.</td></tr>';
    document.getElementById('teams-count').textContent = '0 teams';
    return;
  }
  tbody.innerHTML = teams.map(t => `
    <tr>
      <td style="font-weight:600">${t.name}</td>
      <td style="color:var(--text-muted);font-size:0.72rem">${t.teamNum}</td>
      <td style="text-align:right;color:var(--text-muted)">${t.count}</td>
      <td style="text-align:center;white-space:nowrap;">
        <button class="btn btn-ghost" style="padding:3px 8px;font-size:0.72rem;" onclick="openEditTeamModal('${t.name.replace(/'/g,"\\'")}')" title="Edit">✏</button>
        <button class="btn btn-danger" style="padding:3px 8px;font-size:0.72rem;" onclick="deleteTeam('${t.name.replace(/'/g,"\\'")}')">🗑</button>
      </td>
    </tr>`).join('');
  document.getElementById('teams-count').textContent = `${teams.length} team${teams.length!==1?'s':''}`;
}

function openAddTeamModal() {
  _editingTeamName = null;
  document.getElementById('add-team-title').textContent = '➕ Add Team';
  document.getElementById('team-name-input').value = '';
  document.getElementById('team-num-input').value = '';
  document.getElementById('team-modal-err').style.display = 'none';
  document.getElementById('add-team-modal').classList.add('show');
  setTimeout(() => document.getElementById('team-name-input').focus(), 100);
}

function openEditTeamModal(teamName) {
  const teams = getTeams();
  const t = teams.find(x => x.name === teamName);
  if (!t) return;
  _editingTeamName = teamName;
  document.getElementById('add-team-title').textContent = `✏ Edit Team`;
  document.getElementById('team-name-input').value = t.name;
  document.getElementById('team-num-input').value = t.teamNum !== '—' ? t.teamNum : '';
  document.getElementById('team-modal-err').style.display = 'none';
  document.getElementById('add-team-modal').classList.add('show');
  setTimeout(() => document.getElementById('team-name-input').focus(), 100);
}

function saveTeamEntry() {
  const newName = document.getElementById('team-name-input').value.trim();
  const newNum  = document.getElementById('team-num-input').value.trim();
  const errEl = document.getElementById('team-modal-err');
  if (!newName) { errEl.textContent='Team Name is required.'; errEl.style.display='block'; return; }
  if (!newNum)  { errEl.textContent='Team # is required.'; errEl.style.display='block'; return; }

  if (_editingTeamName) {
    // Rename: update all techs that had the old team name
    Object.values(TECH_ROSTER).forEach(info => {
      if (info.team === _editingTeamName) {
        info.team = newName;
        info.teamNum = newNum;
      }
    });
    toast(`✓ Updated team "${_editingTeamName}" → "${newName}"`);
  } else {
    // Adding a new team is done by creating a placeholder entry? No — teams exist via techs.
    // Just notify the user and pre-populate the team name in the roster datalist.
    toast(`✓ Team "${newName}" ready — add techs to it via the Tech Roster tab`);
  }
  closeModal('add-team-modal');
  renderTeamsTable();
  renderRosterTable();
  // Also rebuild team chips on the main view
  if (techRows.length) buildTeamChips();
}

function deleteTeam(teamName) {
  const teams = getTeams();
  const t = teams.find(x => x.name === teamName);
  const count = t ? t.count : 0;
  if (!confirm(`Delete team "${teamName}"? This will remove the team assignment from ${count} tech(s). Techs will remain in the roster as "Unknown Team".`)) return;
  Object.values(TECH_ROSTER).forEach(info => {
    if (info.team === teamName) { info.team = ''; info.teamNum = ''; }
  });
  renderTeamsTable();
  renderRosterTable();
  if (techRows.length) buildTeamChips();
  toast(`🗑 Deleted team "${teamName}"`);
}

// Populate team dropdown in Add/Edit Tech modal
function populateTeamDatalist() {
  const sel = document.getElementById('tech-team-select');
  if (!sel) return;
  const teams = getTeams();
  const currentTeam = document.getElementById('tech-team-input').value;
  sel.innerHTML = '<option value="">— Select a team —</option>' +
    teams.map(t => {
      const label = t.teamNum && t.teamNum !== '—' ? `${t.name} (${t.teamNum})` : t.name;
      const isSelected = currentTeam === t.name ? ' selected' : '';
      return `<option value="${t.name.replace(/"/g,'&quot;')}" data-num="${(t.teamNum||'').replace(/"/g,'&quot;')}"${isSelected}>${label}</option>`;
    }).join('');
}

// Sync hidden inputs when the dropdown selection changes
function onTeamSelectChange() {
  const sel = document.getElementById('tech-team-select');
  const opt = sel.options[sel.selectedIndex];
  document.getElementById('tech-team-input').value = sel.value;
  document.getElementById('tech-teamnum-input').value = (opt && opt.dataset.num) ? opt.dataset.num : '';
}

// Legacy no-op kept for any stray references
function autoFillTeamNum() {}

// ═══════════════════════════════════════════════════════════════
// PROJECT SAVE / LOAD (IndexedDB)
// ═══════════════════════════════════════════════════════════════
const DB_NAME='FixpointsDB',DB_VER=2,STORE='projects';
let db=null;

function openDB(){
  return new Promise((res,rej)=>{
    const req=indexedDB.open(DB_NAME,DB_VER);
    req.onupgradeneeded=e=>{
      const d=e.target.result;
      if(!d.objectStoreNames.contains(STORE)){
        const s=d.createObjectStore(STORE,{keyPath:'name'});
        s.createIndex('createdAt','createdAt');
      }
    };
    req.onsuccess=e=>{db=e.target.result;res(db);};
    req.onerror=e=>rej(e);
  });
}
async function getDb(){if(!db) await openDB(); return db;}
async function dbSave(p){const d=await getDb();return new Promise((res,rej)=>{const tx=d.transaction(STORE,'readwrite');tx.objectStore(STORE).put(p).onsuccess=()=>res();tx.onerror=e=>rej(e);});}
async function dbGetAll(){const d=await getDb();return new Promise((res,rej)=>{const tx=d.transaction(STORE,'readonly');tx.objectStore(STORE).getAll().onsuccess=e=>res(e.target.result);tx.onerror=e=>rej(e);});}
async function dbDelete(name){const d=await getDb();return new Promise((res,rej)=>{const tx=d.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(name).onsuccess=()=>res();tx.onerror=e=>rej(e);});}
async function dbGet(name){const d=await getDb();return new Promise((res,rej)=>{const tx=d.transaction(STORE,'readonly');tx.objectStore(STORE).get(name).onsuccess=e=>res(e.target.result);tx.onerror=e=>rej(e);});}

function openSaveModal(){
  document.getElementById('project-name-input').value=currentProjectName||'';
  document.getElementById('save-modal').classList.add('show');
  setTimeout(()=>document.getElementById('project-name-input').focus(),100);
}
function closeModal(id){document.getElementById(id||'save-modal').classList.remove('show');}

async function saveProject(){
  const name=document.getElementById('project-name-input').value.trim().replace(/\s+/g,' ');
  if(!name){alert('Enter a project name.');return;}
  // Warn if a project with this name already exists
  const existing = await dbGet(name);
  if(existing && !confirm(`A project named "${name}" already exists. Overwrite it?`)) return;
  showLoading('Saving…');closeModal('save-modal');
  const project={
    name, createdAt:Date.now(), rowCount:allRows.length,
    rawRecords: currentRawRecords.length ? currentRawRecords : allRows.map(r=>r._raw||{}),
    importSettings:{...importSettings}
  };
  try{await dbSave(project);currentProjectName=name;toast(`✓ Saved "${name}"`);await refreshProjectList();}
  catch(e){console.error(e);toast('Error saving: '+e.message);}
  hideLoading();
}

async function loadProject(name){
  if(currentView==='calcall'){toast('Switch to Fixpoint Tasks or Tech Summary to load a project');return;}
  showLoading('Loading…');
  const proj=await dbGet(name);
  if(!proj){hideLoading();toast('Project not found');return;}
  if(proj.fromFullData){
    hideLoading();
    toast('📄 This project was loaded from a Calculate-All full-data file — it has no raw rows to open individually, but it\'s already included in the Calculate All totals.');
    return;
  }
  if(proj.importSettings)importSettings={...proj.importSettings};
  currentProjectName=proj.name;

  let rawRecords = null;

  // Priority 1: rawRecords (new format — plain JSON objects, most reliable)
  if(proj.rawRecords && proj.rawRecords.length){
    rawRecords = proj.rawRecords;
  }
  // Priority 2: rawBuffer (old single-file format — re-parse the ArrayBuffer)
  else if(proj.rawBuffer){
    try { rawRecords = parseDBF(proj.rawBuffer); } catch(e){ console.warn('rawBuffer parse failed',e); }
  }
  // Priority 3: processed rows fallback (old format, degraded _raw)
  if(rawRecords && rawRecords.length){
    currentRawRecords = rawRecords;
    await loadParsedRows(rawRecords, proj.name, 1, true);
  } else if(proj.rows && proj.rows.length){
    // Last resort: use processed rows (drill-down won't work but table will)
    currentRawRecords = proj.rows.map(r=>r._raw||{});
    allRows = proj.rows.map(r=>({...r,_raw:r._raw||{}}));
    filtered=[...allRows];
    techRows=buildTechStats(allRows.map(r=>r._raw||r));
    filteredTech=[...techRows];
    updateStats(allRows);sortBy('total_points');buildTeamChips();renderTechTable();
    document.getElementById('dropzone-wrap').style.display='none';
    document.getElementById('content-area').style.display='flex';
    document.getElementById('btn-save-project').style.display='';
    updateProjectBadge();hideLoading();
    toast(`✓ Loaded "${name}" (legacy format — re-save to upgrade)`);
  } else {
    hideLoading();toast('❌ Project data missing — please re-import');return;
  }
  document.querySelectorAll('.project-item').forEach(el=>el.classList.toggle('active',el.dataset.name===name));
}

async function deleteProject(name){
  if(!confirm(`Delete "${name}"?`))return;
  await dbDelete(name);
  toast(`Deleted "${name}"`);
  // If the project on screen right now is the one just deleted, its data is
  // now orphaned (still showing in the table, but gone from storage) — reset
  // back to the empty state instead of leaving stale data displayed.
  if(currentProjectName===name){
    currentProjectName=null;
    allRows=[];filtered=[];techRows=[];filteredTech=[];currentRawRecords=[];
    document.getElementById('btn-save-project').style.display='none';
    document.getElementById('project-badge').style.display='none';
    if(currentView!=='calcall') switchView(currentView);
  }
  if(calcAllProjectFilter===name) clearCalcAllProjectFilter();
  await refreshProjectList();
}

async function deleteAllProjects(){
  const projects = await dbGetAll();
  if(!projects || !projects.length){ toast('No saved projects to delete'); return; }
  if(!confirm(`Delete ALL ${projects.length} saved project${projects.length!==1?'s':''}? This cannot be undone.`)) return;
  showLoading('Deleting all projects…');
  try{
    for(const p of projects){ await dbDelete(p.name); }
    // Reset all in-memory state so the app doesn't keep showing data for
    // projects that no longer exist in storage.
    currentProjectName = null;
    allRows = []; filtered = []; techRows = []; filteredTech = [];
    currentRawRecords = [];
    calcAllData = []; calcAllFiltered = []; calcAllProjectFilter = ''; calcAllFromFullData = false;
    document.getElementById('btn-save-project').style.display = 'none';
    updateProjectBadge();
    await refreshProjectList();
    if(currentView==='calcall'){ updateCalcAllStatsAndRender(); }
    else { switchView(currentView); }
    toast(`✓ Deleted all ${projects.length} project${projects.length!==1?'s':''}`);
  } catch(e){ console.error(e); toast('Error deleting projects: '+e.message); }
  hideLoading();
}

async function refreshProjectList(){
  const list=document.getElementById('project-list');
  list.innerHTML=''; // always clear first before re-rendering
  let projects=await dbGetAll();
  if(!projects||!projects.length){list.innerHTML='<div style="padding:8px 16px;font-size:0.72rem;color:rgba(255,255,255,0.25)">No saved projects yet</div>';return;}
  // Deduplicate by name (case-insensitive) — keep the one with the latest createdAt
  const seen=new Map();
  projects.forEach(p=>{
    const key=p.name.trim().toLowerCase();
    if(!seen.has(key)||p.createdAt>seen.get(key).createdAt) seen.set(key,p);
  });
  // Purge any stale duplicates from IndexedDB silently
  const keepNames=new Set([...seen.values()].map(p=>p.name));
  projects.forEach(p=>{ if(!keepNames.has(p.name)) dbDelete(p.name).catch(()=>{}); });
  projects=[...seen.values()].sort((a,b)=>b.createdAt-a.createdAt);
  list.innerHTML=projects.map(p=>`
    <div class="project-item${p.fromFullData?' from-full-data':''}${(p.fromFullData ? p.name===(currentView==='calcall'?calcAllProjectFilter:currentProjectName) : p.name===currentProjectName) ? ' active':''}" data-name="${p.name}" title="${p.fromFullData ? 'Loaded from a Calculate-All full-data file — click to view its Tech Summary (or, while in Calc All, to filter to just this project). No raw rows, so row-level drill-down is limited to what the file captured.' : p.name}" onclick="${p.fromFullData ? `openFullDataProject('${p.name.replace(/'/g,"\\'")}')` : `loadProject('${p.name.replace(/'/g,"\\'")}')`}">
      <span style="font-size:12px">${p.fromFullData ? '📄' : '📁'}</span>
      <span class="pi-name" title="${p.name}">${p.name}${p.fromFullData ? ' <span style=\"opacity:.55;font-weight:400;\">(loaded)</span>' : ''}</span>
      <span class="pi-count">${(p.rowCount||'?').toLocaleString()}</span>
      <span class="pi-del" onclick="event.stopPropagation();deleteProject('${p.name.replace(/'/g,"\\'")}')">✕</span>
    </div>`).join('');
}

// ═══════════════════════════════════════════════════════════════
// CSV EXPORT
// ═══════════════════════════════════════════════════════════════
function downloadCSV(){
  // Export the ORIGINAL raw fields (r._raw), not just the small set of derived
  // display columns. The raw fields (I3QA_CAT, FIXED1?, AFP1_STAT, COMBO?,
  // rv2_id, warn/refix columns, etc.) are what processRecords()/parseCSV()
  // expect on import - exporting only the friendly subset silently dropped
  // those fields, so re-importing an exported CSV produced blank/zeroed
  // values (e.g. fixed1 always read empty because the friendly column was
  // named "fixed1" but the importer looks for "FIXED1?"). Exporting the raw
  // record keeps export to import round-trips lossless.
  const colSet=new Set();
  filtered.forEach(r=>Object.keys(r._raw||{}).forEach(k=>colSet.add(k)));
  // Keep a stable, readable ordering: known important fields first, then
  // whatever else was present in the raw record, alphabetically.
  const preferredOrder=['UID','CATEGORY','I3QA_CAT','QC_ID','I3QA_ID','I3QA_LABEL',
    'FIX1_ID','FIX1_DATE','FIXED1?','RV1_ID','RV1_LABEL','QA1_ID','QA1_LABEL',
    'AFP1_STAT','AFP1_CAT','COMBO?'];
  const cols=[...preferredOrder.filter(c=>colSet.has(c)),
    ...[...colSet].filter(c=>!preferredOrder.includes(c)).sort()];
  if(!cols.length){ toast('Nothing to export'); return; }
  const lines=[cols.map(c=>`"${c.replace(/"/g,'""')}"`).join(',')];
  filtered.forEach(r=>lines.push(cols.map(c=>{
    const v=(r._raw||{})[c];
    return `"${String(v??'').replace(/"/g,'""')}"`;
  }).join(',')));
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/csv'}));
  a.download=`${currentProjectName||'fixpoints'}_export.csv`;a.click();
}

// ═══════════════════════════════════════════════════════════════
// THEME TOGGLE
// ═══════════════════════════════════════════════════════════════
function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme==='dark'?'dark':'');
  const btn = document.getElementById('theme-btn');
  if(btn){ btn.textContent = theme==='dark' ? '☀ Light' : '🌙 Dark'; }
  try{ localStorage.setItem('fp-theme', theme); } catch(e){}
  // Re-render tech table so Team/Team# column colors reflect the new theme
  if(typeof renderTechTable === 'function' && document.getElementById('tech-body')) renderTechTable();
}
function toggleTheme(){
  const isDark = document.documentElement.getAttribute('data-theme')==='dark';
  applyTheme(isDark ? 'light' : 'dark');
}
(function initTheme(){
  try{ const t=localStorage.getItem('fp-theme'); if(t) applyTheme(t); } catch(e){}
})();

// ═══════════════════════════════════════════════════════════════
// TEAM FILTER (Tech Summary view)
// ═══════════════════════════════════════════════════════════════
let activeTeamFilter = '';

function buildTeamChips(){
  const teams = [...new Set(techRows.map(t=>t.team).filter(Boolean))].sort();
  const wrap = document.getElementById('team-chips');
  wrap.innerHTML = `<span class="team-chip active" data-team="" onclick="selectTeamChip(this)">All Teams</span>`
    + teams.map(t=>`<span class="team-chip" data-team="${t.replace(/"/g,'&quot;')}" onclick="selectTeamChip(this)">${t}</span>`).join('');
  // restore selection
  wrap.querySelectorAll('.team-chip').forEach(c=>{
    if(c.dataset.team===activeTeamFilter) c.classList.add('active');
    else c.classList.remove('active');
  });
}

function selectTeamChip(el){
  document.querySelectorAll('#team-chips .team-chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  activeTeamFilter = el.dataset.team;
  applyTechFilter();
}

function applyTechFilter(){
  const q = (document.getElementById('tech-search-input')?.value||'').toLowerCase();
  filteredTech = techRows.filter(t=>{
    if(activeTeamFilter && t.team !== activeTeamFilter) return false;
    if(q && !(t.id.toLowerCase().includes(q)||t.name.toLowerCase().includes(q)||t.team.toLowerCase().includes(q))) return false;
    return true;
  }).sort((a,b)=>{
    let av=a[techSortKey],bv=b[techSortKey];
    if(typeof av==='string')av=av.toLowerCase();
    if(typeof bv==='string')bv=bv.toLowerCase();
    return av<bv?techSortDir:av>bv?-techSortDir:0;
  });
  renderTechTable();
}

// ═══════════════════════════════════════════════════════════════
// CALCULATE ALL PROJECTS  (full-page view)
// ═══════════════════════════════════════════════════════════════
let calcAllData = [];        // full dataset after calculate
let calcAllFiltered = [];    // after search+team filter
let calcAllSortKey = 'points';
let calcAllSortDir = -1;
let calcAllTeamFilter = '';
let calcAllProjectFilter = ''; // set by clicking a "loaded from full data" project in the sidebar
let calcAllFromFullData = false; // true when calcAllData came from "Load Full Data" (no raw rows behind it)

async function initCalcAllView(){
  try {
    const projects = await dbGetAll();
    const realCount = projects.filter(p=>!p.fromFullData).length;
    const el = document.getElementById('ca-project-count');
    if(el) el.textContent = `${projects.length} project${projects.length!==1?'s':''} in storage`;
    // Only auto re-run a fresh calculation if there are real (raw-row) saved
    // projects. Placeholder entries created by "Load Full Data" have no raw
    // rows, so running a fresh Calculate All against them would just skip
    // them and could wipe out a calc-all view that was restored from a file.
    if(realCount){
      await runCalcAll();
    }
  } catch(e){ console.warn('initCalcAllView error', e); }
}

async function runCalcAll(){
  const mult = Number(document.getElementById('ca-mult').value) || 9.5;
  // Update the multiplier label in the header
  const multLabel = document.getElementById('ca-mult-label');
  if (multLabel) multLabel.textContent = mult.toFixed(2);
  const allStored = await dbGetAll();
  // "fromFullData" entries are lightweight placeholders created by "Load Full
  // Data" so the project shows up in the sidebar — they have no raw rows, so
  // they can't be fed through buildTechStats() below.
  const projects = allStored.filter(p=>!p.fromFullData);

  if(!projects.length){
    // Nothing with raw rows to recompute from. If we currently have data
    // that was restored via "Load Full Data", just re-apply the new
    // multiplier to it in place instead of failing.
    if(calcAllFromFullData && calcAllData.length){
      recalcCalcAllMultiplier(mult);
      return;
    }
    toast('No saved projects found'); return;
  }

  // A fresh calculation from raw rows supersedes any "Load Full Data" snapshot.
  calcAllFromFullData = false;
  calcAllProjectFilter = '';

  const progWrap = document.getElementById('ca-progress-wrap');
  const progLabel = document.getElementById('ca-progress-label');
  const progBar = document.getElementById('ca-bar');
  progWrap.style.display = 'block';

  const combined = {};

  for(let i=0; i<projects.length; i++){
    const proj = projects[i];
    progLabel.textContent = `Processing ${proj.name} (${i+1}/${projects.length})…`;
    progBar.style.width = `${Math.round((i/projects.length)*100)}%`;
    await new Promise(r=>setTimeout(r,10));

    let rawRecords = [];
    try{
      if(proj.rawRecords && proj.rawRecords.length){
        rawRecords = proj.rawRecords;                        // new format (plain JSON)
      } else if(proj.rawBuffer){
        rawRecords = parseDBF(proj.rawBuffer);               // old single-file format
      } else if(proj.rows && proj.rows.length){
        rawRecords = proj.rows.map(r=>r._raw||r);            // legacy fallback
      }
    } catch(e){ console.warn('Failed to parse project', proj.name, e); continue; }
    if(!rawRecords.length){ console.warn('No records for project', proj.name); continue; }

    const savedSettings = {...importSettings};
    if(proj.importSettings) Object.assign(importSettings, proj.importSettings);
    const techStats = buildTechStats(rawRecords);
    techStats.forEach(t=>{
      const key = t.id;
      if(!combined[key]){
        combined[key] = {
          id:t.id, name:t.name, team:t.team, teamNum:t.teamNum,
          initial:0, i3qa:0, rv:0, fix:0, missed:0, refix:0, warn:0,
          points:0, projects:[], projectBreakdown:[],
          // Raw rows behind the i3qa/missed/refix/warn counts, tagged with
          // their originating project, for the drill-down modal.
          srcI3qa:[], srcMissed:[], srcRefix:[], srcWarn:[],
          // Actual DR/DRQ penalties as applied per-project (each project's
          // threshold is evaluated on its own data, same as single-project
          // calculation) plus which project/level triggered them, for the
          // penalty breakdown panel in the drill-down modal.
          totalDrDeduct:0, totalDrqDeduct:0,
          totalEgregiousMissed:0, totalEgregiousDrq:0,
          drTriggers:[], drqTriggers:[]
        };
      }
      const c = combined[key];
      c.initial += t.initial||0; c.i3qa += t.i3qa||0; c.rv += t.rv||0;
      c.fix += t.fix||0; c.missed += t.missed||0; c.refix += t.refix||0;
      c.warn += t.warn||0; c.points += t.points||0;
      if(!c.projects.includes(proj.name)) c.projects.push(proj.name);
      (t._src?.i3qa||[]).forEach(r=>c.srcI3qa.push({project:proj.name, row:r}));
      (t._src?.missed||[]).forEach(r=>c.srcMissed.push({project:proj.name, row:r}));
      (t._src?.refix||[]).forEach(r=>c.srcRefix.push({project:proj.name, row:r}));
      (t._src?.warn||[]).forEach(r=>c.srcWarn.push({project:proj.name, row:r}));
      c.totalDrDeduct += t.drDeduct||0;
      c.totalDrqDeduct += t.drqDeduct||0;
      c.totalEgregiousMissed += t.egregiousMissedCount||0;
      c.totalEgregiousDrq += t.egregiousDrqCount||0;
      if(t.drRule) c.drTriggers.push({project:proj.name, level:t.drRule.level, deduct:t.drRule.deduct, count:t.egregiousMissedCount||0});
      if(t.drqRule) c.drqTriggers.push({project:proj.name, level:t.drqRule.level, deduct:t.drqRule.deduct, count:t.egregiousDrqCount||0});
      // Store per-project breakdown for drill-down
      const denom = (t.fix||0) + (t.refix||0) + (t.warn||0);
      const projQp = denom > 0 ? ((t.fix||0)/denom*100) : 100;
      const projQualMod = calculateQualityModifier(projQp);
      const projThresh = getThresholdBonus(projQp);
      const projMult = mult;
      const projBase = projThresh !== null ? (t.points||0)*(projThresh/100) : (t.points||0)*projQualMod;
      const projTotal = projThresh !== null ? (t.points||0)*projMult*(projThresh/100) : (t.points||0)*projMult*projQualMod;
      c.projectBreakdown.push({
        project: proj.name,
        gsd: proj.importSettings?.gsd || importSettings.gsd,
        blocktype: proj.importSettings?.blocktype || importSettings.blocktype,
        initial: t.initial||0, i3qa: t.i3qa||0, rv: t.rv||0,
        fix: t.fix||0, missed: t.missed||0, refix: t.refix||0, warn: t.warn||0,
        points: Math.round((t.points||0)*10000)/10000,
        qp: projQp, qualityPctMod: Math.round(projQualMod*100*100)/100,
        thresholdApplied: projThresh !== null,
        baseBonus: projBase, totalBonus: projTotal,
        mult: projMult
      });
    });
    Object.assign(importSettings, savedSettings);
  }

  progBar.style.width = '100%';
  progLabel.textContent = `Done — ${Object.keys(combined).length} techs across ${projects.length} projects`;
  await new Promise(r=>setTimeout(r,200));
  progWrap.style.display = 'none';

  calcAllData = Object.values(combined).map(c=>{
    c.points = Math.round(c.points*10000)/10000;
    const denom = c.fix + c.refix + c.warn;
    c.qp = denom>0 ? (c.fix/denom*100) : 100;
    const qualMod = calculateQualityModifier(c.qp);
    const threshBonus = getThresholdBonus(c.qp);
    c.qualityPctMod = Math.round(qualMod*100*100)/100;
    c.thresholdApplied = threshBonus !== null;
    c.bonusMult = mult;
    // Grand total bonus = sum of per-project bonuses (each project uses per-project QP)
    c.baseBonus = (c.projectBreakdown||[]).reduce((s,p)=>s+p.baseBonus,0);
    c.totalBonus = (c.projectBreakdown||[]).reduce((s,p)=>s+p.totalBonus,0);
    return c;
  });

  updateCalcAllStatsAndRender();
}

// Shared by runCalcAll(), importCalcAllFullData(), and recalcCalcAllMultiplier()
// so the stats bar / team chips / table always refresh the same way regardless
// of where calcAllData came from.
function updateCalcAllStatsAndRender(){
  const allProjects = [...new Set(calcAllData.flatMap(t=>t.projects||[]))];
  document.getElementById('cas-techs').textContent = calcAllData.length;
  document.getElementById('cas-points').textContent = calcAllData.reduce((s,t)=>s+(t.points||0),0).toFixed(2);
  document.getElementById('cas-initial').textContent = calcAllData.reduce((s,t)=>s+(t.initial||0),0);
  document.getElementById('cas-i3qa').textContent = calcAllData.reduce((s,t)=>s+(t.i3qa||0),0);
  document.getElementById('cas-rv').textContent = calcAllData.reduce((s,t)=>s+(t.rv||0),0);
  document.getElementById('cas-fix').textContent = calcAllData.reduce((s,t)=>s+(t.fix||0),0);
  document.getElementById('cas-missed').textContent = calcAllData.reduce((s,t)=>s+(t.missed||0),0);
  document.getElementById('cas-refix').textContent = calcAllData.reduce((s,t)=>s+(t.refix||0),0);
  document.getElementById('cas-bonus').textContent = calcAllData.reduce((s,t)=>s+(t.totalBonus||0),0).toFixed(4);
  document.getElementById('cas-projects').textContent = allProjects.length;
  document.getElementById('ca-stats-bar').style.display = '';

  buildCalcAllTeamChips();
  applyCalcAllFilter();
}

// Re-applies a new PHP Multiplier to whatever is currently in calcAllData
// without needing raw rows. This works because every tech's per-project
// breakdown already stores points + Fix Quality % (qp) + the resulting
// Quality % Mod / threshold bonus — the multiplier is just the last factor
// in Payout = Points × Multiplier × (Bonus% ÷ 100), so it can be re-applied
// on top of numbers that were restored via "Load Full Data".
function recalcCalcAllMultiplier(mult){
  if(!calcAllData.length){ toast('Nothing to recalculate — load or calculate data first'); return; }
  calcAllData.forEach(t=>{
    t.bonusMult = mult;
    // baseBonus (Payout w/o Mult) never changes with the multiplier — only
    // totalBonus (Payout w/ Mult) does. totalBonus = baseBonus × mult, which
    // is algebraically identical to the original Points × Mult × Bonus%
    // formula since baseBonus = Points × Bonus%.
    (t.projectBreakdown||[]).forEach(p=>{
      p.mult = mult;
      p.totalBonus = (p.baseBonus||0) * mult;
    });
    t.baseBonus = (t.projectBreakdown||[]).reduce((s,p)=>s+(p.baseBonus||0),0);
    t.totalBonus = (t.projectBreakdown||[]).reduce((s,p)=>s+(p.totalBonus||0),0);
  });
  updateCalcAllStatsAndRender();
  toast(`✓ Recalculated ${calcAllData.length} techs with multiplier ${mult.toFixed(2)}`);
}

// When calcAllProjectFilter is set, returns one row per tech reshaped to
// that single project's numbers (pulled from projectBreakdown), instead of
// the tech's combined totals across every project. This is what makes
// "load individually" possible for a project restored via Load Full Data —
// no raw rows are needed since the per-project breakdown already has
// everything (points, Fix Quality %, base/total bonus) for that project.
function getCalcAllProjectScopedData(projectName){
  return calcAllData
    .filter(t=>(t.projects||[]).includes(projectName))
    .map(t=>{
      const p = (t.projectBreakdown||[]).find(pb=>pb.project===projectName);
      if(!p) return null;
      return {
        ...t,
        initial:p.initial, i3qa:p.i3qa, rv:p.rv, fix:p.fix, missed:p.missed,
        refix:p.refix, warn:p.warn, points:p.points, qp:p.qp,
        qualityPctMod:p.qualityPctMod, thresholdApplied:p.thresholdApplied,
        baseBonus:p.baseBonus, totalBonus:p.totalBonus, bonusMult:p.mult,
        projects:[projectName],
        // Drill-down rows should only show what happened on this project.
        srcI3qa:(t.srcI3qa||[]).filter(e=>e.project===projectName),
        srcMissed:(t.srcMissed||[]).filter(e=>e.project===projectName),
        srcRefix:(t.srcRefix||[]).filter(e=>e.project===projectName),
        srcWarn:(t.srcWarn||[]).filter(e=>e.project===projectName)
      };
    })
    .filter(Boolean);
}

// Called when clicking a "loaded from full data" (📄) project in the
// sidebar. These placeholders have no raw rows — only the aggregated
// per-project breakdown captured in calcAllData — so a true row-level
// Fixpoint Tasks table can't be reconstructed. Tech Summary numbers CAN be
// reconstructed (they're tech-level, exactly what the breakdown stores), so
// that's what both the Fixpoint Tasks and Tech Summary nav items render.
function openFullDataProject(name){
  document.querySelectorAll('.project-item').forEach(el=>el.classList.toggle('active', el.dataset.name===name));

  // Already in Calc All → keep the existing per-project filter behavior there.
  if(currentView==='calcall'){
    calcAllProjectFilter = name;
    buildCalcAllTeamChips();
    if(!calcAllData.some(t=>(t.projects||[]).includes(name))){
      toast(`📄 "${name}" isn't loaded into this session yet — use "Load Full Data" (top bar) to load its saved snapshot.`);
    }
    applyCalcAllFilter();
    return;
  }

  const scoped = getCalcAllProjectScopedData(name);
  if(!scoped.length){
    toast(`📄 "${name}" isn't loaded into this session yet — use "Load Full Data" (top bar) to load its saved snapshot first.`);
    return;
  }

  // Reuse the multiplier Calc All used for this data, so the numbers shown
  // here match "Calc All Projects" for the same project.
  const mult = scoped[0].bonusMult;
  const multInput = document.getElementById('bp-manual-mult');
  if(mult!=null && multInput) multInput.value = Number(mult).toFixed(2);

  techRows = scoped.map(t=>({
    ...t,
    bonusMultiplier: t.bonusMult!=null ? t.bonusMult : currentBonusMultiplier,
    drDeduct: t.drDeduct||0,
    drqDeduct: t.drqDeduct||0,
    month: t.month||'',
    _src: null // no raw rows — drill-down icons show "no source data" instead of breaking
  }));
  currentProjectName = name;
  allRows = []; filtered = []; currentRawRecords = [];
  updateStats([]); // row-level stat tiles don't apply here — zero them instead of leaving stale numbers

  if(currentView!=='tech'){
    switchView('tech');
    toast(`📄 "${name}" has no raw task rows (loaded from Full Data) — showing its Tech Summary instead.`);
  } else {
    buildTeamChips();
    recalcBonus();
    toast(`✓ Showing "${name}" (loaded from Full Data)`);
  }

  // Lightweight badge — full import settings (site/GSD/type) aren't captured
  // in a Full Data snapshot, so just surface the project name.
  const badge=document.getElementById('project-badge');
  if(badge){
    badge.style.display='flex';
    document.getElementById('pb-site').textContent='—';
    document.getElementById('pb-gsd').textContent='—';
    const typeEl=document.getElementById('pb-type');
    typeEl.textContent='Loaded'; typeEl.className='pb-type non';
    document.getElementById('pb-name').textContent=name;
  }
  document.getElementById('btn-save-project').style.display='none';
  document.getElementById('dropzone-wrap').style.display='none';
  document.getElementById('content-area').style.display='flex';
}

function clearCalcAllProjectFilter(){
  calcAllProjectFilter = '';
  document.querySelectorAll('.project-item.from-full-data').forEach(el=>el.classList.remove('active'));
  applyCalcAllFilter();
}

function applyCalcAllFilter(){
  const q = (document.getElementById('ca-search-input')?.value||'').toLowerCase();
  const banner = document.getElementById('ca-project-filter-banner');
  if(banner){
    banner.style.display = calcAllProjectFilter ? 'flex' : 'none';
    const nameEl = document.getElementById('ca-project-filter-name');
    if(nameEl) nameEl.textContent = calcAllProjectFilter;
  }
  const sourceData = calcAllProjectFilter ? getCalcAllProjectScopedData(calcAllProjectFilter) : calcAllData;
  calcAllFiltered = sourceData.filter(t=>{
    if(calcAllTeamFilter && t.team !== calcAllTeamFilter) return false;
    if(q && !(t.id.toLowerCase().includes(q)||t.name.toLowerCase().includes(q)||t.team.toLowerCase().includes(q))) return false;
    return true;
  }).sort((a,b)=>{
    let av=a[calcAllSortKey], bv=b[calcAllSortKey];
    if(typeof av==='string') av=av.toLowerCase();
    if(typeof bv==='string') bv=bv.toLowerCase();
    return av<bv?calcAllSortDir:av>bv?-calcAllSortDir:0;
  });
  renderCalcAllTable(calcAllFiltered);
}

function sortCalcAll(key){
  if(calcAllSortKey===key) calcAllSortDir*=-1; else { calcAllSortKey=key; calcAllSortDir=-1; }
  document.querySelectorAll('#ca-header-row th').forEach(th=>th.classList.remove('sort-asc','sort-desc'));
  const keys=['','id','name','team','teamNum','initial','i3qa','rv','fix','missed','refix','warn','points','qp','qualityPctMod','baseBonus','totalBonus','projects'];
  const idx=keys.indexOf(key);
  const ths=document.querySelectorAll('#ca-header-row th');
  if(idx>=0&&ths[idx]) ths[idx].classList.add(calcAllSortDir===-1?'sort-desc':'sort-asc');
  applyCalcAllFilter();
}

function buildCalcAllTeamChips(){
  const teams = [...new Set(calcAllData.map(t=>t.team).filter(Boolean))].sort();
  const wrap = document.getElementById('ca-team-chips');
  wrap.innerHTML = `<span class="team-chip active" data-team="" onclick="selectCalcAllTeamChip(this)">All Teams</span>`
    + teams.map(t=>`<span class="team-chip" data-team="${t.replace(/"/g,'&quot;')}" onclick="selectCalcAllTeamChip(this)">${t}</span>`).join('');
}

function selectCalcAllTeamChip(el){
  document.querySelectorAll('#ca-team-chips .team-chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  calcAllTeamFilter = el.dataset.team;
  applyCalcAllFilter();
}

function renderCalcAllTable(data){
  const tbl = document.getElementById('ca-main-table');
  const empty = document.getElementById('ca-empty-state');
  if(!data.length && !calcAllData.length){
    tbl.style.display='none'; empty.style.display='';
    return;
  }
  if(!data.length){
    tbl.style.display='none';
    empty.style.display='';
    empty.innerHTML='<p style="font-size:0.9rem;">No techs match your search.</p>';
    return;
  }
  empty.innerHTML='<p style="font-size:0.9rem;">Run <b>Calculate All Projects</b> to see combined tech totals.</p>';
  tbl.style.display=''; empty.style.display='none';

  const isDark=document.documentElement.getAttribute('data-theme')==='dark';const TEAM_COLORS=isDark?{'T_63':'rgba(14,165,233,0.12)','T_115':'rgba(245,158,11,0.12)','T_57':'rgba(16,185,129,0.12)','T_116':'rgba(236,72,153,0.12)','T_123':'rgba(139,92,246,0.12)','T_114':'rgba(239,68,68,0.12)','T_64':'rgba(5,150,105,0.12)','T_122':'rgba(251,146,60,0.12)'}:{'T_63':'#e8f4fd','T_115':'#fef3c7','T_57':'#d1fae5','T_116':'#fce7f3','T_123':'#ede9fe','T_114':'#fff1f2','T_64':'#ecfdf5','T_122':'#fff7ed'};
  const ns='class="cell-num cell-num-blue"';

  document.getElementById('ca-body').innerHTML = data.map(t=>{
    const qpColor=t.qp>=95?'var(--green)':t.qp>=85?'var(--amber)':'var(--red)';
    const bonusColor=t.totalBonus>0?'var(--green)':'var(--text-muted)';
    const bg=TEAM_COLORS[t.teamNum]||'transparent';
    const num=(v)=>v>0?`<span style="font-weight:700;color:var(--accent)">${v}</span>`:`<span style="color:var(--text-light)">0</span>`;
    const numClick=(v,type)=>v>0?`<span class="cell-link" title="Click to see the ${v} row${v!==1?'s':''} behind this number" onclick="openCalcAllDrilldown('${t.id.replace(/'/g,"\\'")}','${type}')" style="font-weight:700;color:var(--accent);cursor:pointer;text-decoration:underline;text-underline-offset:2px;">${v}</span>`:`<span style="color:var(--text-light)">0</span>`;
    const projList = (t.projects||[]).join(', ');
    return `<tr>
      <td style="text-align:center;padding:4px 8px;"><button class="eye-btn" title="View per-project breakdown" onclick="openCalcAllProjectBreakdown('${t.id.replace(/'/g,"\\'")}')">👁</button></td>
      <td><span class="cell-link cell-mono" style="font-size:0.72rem;font-weight:700">${t.id}</span></td>
      <td>${t.name}</td>
      <td style="background:${bg};font-weight:600;color:var(--text)">${t.team}</td>
      <td style="text-align:center;background:${bg};font-size:0.68rem;color:var(--text);font-weight:600">${t.teamNum}</td>
      <td ${ns}>${num(t.initial)}</td>
      <td ${ns}>${numClick(t.i3qa,'i3qa')}</td>
      <td ${ns}>${num(t.rv)}</td>
      <td ${ns}>${num(t.fix)}</td>
      <td ${ns}>${numClick(t.missed,'missed')}</td>
      <td ${ns}>${numClick(t.refix,'refix')}</td>
      <td ${ns}>${numClick(t.warn,'warn')}</td>
      <td class="cell-points">${t.points.toFixed(4)}</td>
      <td class="cell-qp" style="color:${qpColor};font-weight:700">${t.qp.toFixed(2)}%</td>
      <td class="cell-num" style="color:${t.thresholdApplied?'var(--green)':'var(--accent)'};font-weight:${t.thresholdApplied?'700':'400'}">${t.qualityPctMod}%${t.thresholdApplied?'<span style="font-size:0.6rem;background:var(--green);color:#fff;border-radius:3px;padding:0 4px;margin-left:3px;">★</span>':''}</td>
      <td class="cell-points" style="color:var(--accent);background:rgba(14,165,233,0.06);font-weight:600">${(t.baseBonus||0).toFixed(4)}</td>
      <td class="cell-points" style="color:${bonusColor};background:rgba(5,150,105,0.12);font-weight:700;font-size:0.85rem;">₱ ${t.totalBonus.toFixed(4)}</td>
      <td style="font-size:0.68rem;color:var(--text-muted);max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${projList}">${(t.projects||[]).length} project${(t.projects||[]).length!==1?'s':''}</td>
    </tr>`;
  }).join('');

  // Foot totals
  const sum=k=>data.reduce((s,t)=>s+(t[k]||0),0);
  document.getElementById('ca-foot').innerHTML = `<tr>
    <td colspan="5"><strong>TOTAL (${data.length} techs)</strong></td>
    <td class="cell-num"><strong>${sum('initial')}</strong></td>
    <td class="cell-num"><strong>${sum('i3qa')}</strong></td>
    <td class="cell-num"><strong>${sum('rv')}</strong></td>
    <td class="cell-num"><strong>${sum('fix')}</strong></td>
    <td class="cell-num"><strong>${sum('missed')}</strong></td>
    <td class="cell-num"><strong>${sum('refix')}</strong></td>
    <td class="cell-num"><strong>${sum('warn')}</strong></td>
    <td class="cell-points"><strong>${sum('points').toFixed(4)}</strong></td>
    <td colspan="2"></td>
    <td class="cell-points" style="color:var(--accent);background:rgba(14,165,233,0.06);font-weight:700"><strong>${sum('baseBonus').toFixed(4)}</strong></td>
    <td class="cell-points" style="color:var(--green);background:rgba(5,150,105,0.12);font-weight:700;font-size:0.85rem;"><strong>₱ ${sum('totalBonus').toFixed(4)}</strong></td>
    <td></td>
  </tr>`;
}

function exportCalcAllCSV(){
  if(!calcAllData.length){ toast('Run Calculate first'); return; }
  // Always export the FULL merged dataset (all techs across all projects),
  // regardless of any search box / team-chip filter currently applied to
  // the on-screen table — the export is meant to be the complete combined
  // report, not just what's currently visible.
  const cols=['id','name','team','teamNum','initial','i3qa','rv','fix','missed','refix','warn','points','qp','qualityPctMod','baseBonus','totalBonus'];
  const lines=[cols.join(',')];
  const numCols = new Set(['initial','i3qa','rv','fix','missed','refix','warn','points','qp','qualityPctMod','baseBonus','totalBonus']);
  const floatCols = new Set(['points','qp','baseBonus','totalBonus']);
  calcAllData.forEach(t=>lines.push(cols.map(c=>{
    const v=t[c];
    if(numCols.has(c)){
      const n=Number(v)||0;
      return floatCols.has(c)?n.toFixed(4):String(n);
    }
    return `"${String(v??'').replace(/"/g,'""')}"`;
  }).join(',')));
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/csv'}));
  a.download=`calcall_${new Date().toISOString().slice(0,10)}.csv`;a.click();
  toast(`✓ Exported ${calcAllData.length} techs across all projects`);
}

// ═══════════════════════════════════════════════════════════════
// CALC-ALL FULL DATA (JSON) — a complete, drill-down-capable snapshot
// ═══════════════════════════════════════════════════════════════
// Unlike exportCalcAllCSV() (a flat summary report, one row per tech,
// with no per-fixpoint detail), this exports the ENTIRE calcAllData
// structure: every project's raw source rows behind the i3qa/missed/
// refix/warn counts (srcI3qa/srcMissed/srcRefix/srcWarn), the full
// per-project breakdown, and the DR/DRQ trigger history. Re-loading this
// file with importCalcAllFullData() restores the calculation exactly —
// the "View per-project breakdown" (👁) and row-level drill-down modals
// keep working, with no need to re-run Calculate All against saved
// projects.
function exportCalcAllFullData(){
  if(!calcAllData.length){ toast('Run Calculate first'); return; }
  const payload = {
    type: 'fixpoints-calcall-full-data',
    version: 1,
    exportedAt: new Date().toISOString(),
    multiplier: Number(document.getElementById('ca-mult').value) || 9.5,
    techCount: calcAllData.length,
    data: calcAllData
  };
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([JSON.stringify(payload)],{type:'application/json'}));
  a.download=`calcall_full_${new Date().toISOString().slice(0,10)}.json`;a.click();
  toast(`✓ Saved full data for ${calcAllData.length} techs (with drill-down) across all projects`);
}

async function importCalcAllFullData(input){
  const file = input.files && input.files[0];
  input.value = '';
  if(!file) return;
  showLoading('Loading full calc-all data…');
  try{
    const text = await file.text();
    const payload = JSON.parse(text);
    const data = Array.isArray(payload) ? payload : payload.data; // tolerate a bare array too
    if(!Array.isArray(data) || !data.length){
      hideLoading();
      toast('❌ That file doesn\'t look like a "Save Full Data" export from Calculate All.');
      return;
    }
    calcAllData = data;
    calcAllFromFullData = true;
    calcAllProjectFilter = '';
    if(payload.multiplier) document.getElementById('ca-mult').value = Number(payload.multiplier).toFixed(2);

    const allProjects = [...new Set(calcAllData.flatMap(t=>t.projects||[]))];

    // Add each project behind this file into the Saved Projects sidebar (as
    // lightweight placeholders — there are no raw rows in a full-data
    // export, only the aggregated per-project breakdown) so it's visible
    // which projects the loaded numbers cover, and so ca-project-count /
    // "Saved Projects" stay consistent with what's on screen.
    try{
      const existing = await dbGetAll();
      const existingNames = new Set(existing.map(p=>p.name));
      for(const pname of allProjects){
        if(existingNames.has(pname)) continue; // don't clobber a real saved project with the same name
        const rowCount = calcAllData.reduce((s,t)=>s+((t.projects||[]).includes(pname) ? 1 : 0),0);
        await dbSave({
          name: pname, createdAt: Date.now(), rowCount,
          fromFullData: true, sourceFile: file.name
        });
      }
      await refreshProjectList();
    } catch(e){ console.warn('Could not add loaded projects to Saved Projects list', e); }

    const el = document.getElementById('ca-project-count');
    if(el) el.textContent = `${allProjects.length} project${allProjects.length!==1?'s':''} in storage (loaded from file)`;

    updateCalcAllStatsAndRender();
    hideLoading();
    toast(`✓ Loaded full data — ${calcAllData.length} techs across ${allProjects.length} projects. Adjust the Multiplier and click Calculate All to recalculate.`);
  } catch(ex){
    hideLoading();
    toast('❌ Failed to load file: ' + ex.message);
    console.error(ex);
  }
}

// ═══════════════════════════════════════════════════════════════
// CALC-ALL PER-PROJECT BREAKDOWN MODAL
// ═══════════════════════════════════════════════════════════════
function openCalcAllProjectBreakdown(techId) {
  const tech = calcAllData.find(t => t.id === techId);
  if (!tech) { toast('Tech not found in calc-all data'); return; }

  const breakdown = tech.projectBreakdown || [];
  document.getElementById('capj-title').textContent = `📊 Per-Project Breakdown — ${tech.name||techId} (${techId})`;
  document.getElementById('capj-subtitle').textContent =
    `${tech.team||'—'}  ·  ${breakdown.length} project${breakdown.length!==1?'s':''}  ·  All values calculated individually per project`;

  // Grand total banner
  const grandPts = breakdown.reduce((s,p)=>s+p.points,0);
  const grandBase = breakdown.reduce((s,p)=>s+p.baseBonus,0);
  const grandTotal = breakdown.reduce((s,p)=>s+p.totalBonus,0);
  document.getElementById('capj-grand').innerHTML = `
    <div>
      <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--green);margin-bottom:4px;">📊 Grand Total Across All Projects</div>
      <div style="font-size:0.76rem;color:var(--text-muted);line-height:1.6;font-family:'JetBrains Mono',monospace;">
        ${grandPts.toFixed(4)} pts total
        &nbsp;·&nbsp; Payout w/o Mult: <b style="color:var(--accent);">${grandBase.toFixed(4)}</b>
        &nbsp;·&nbsp; Payout w/ Mult: <b style="color:var(--green);">₱ ${grandTotal.toFixed(4)}</b>
      </div>
      <div style="font-size:0.66rem;color:var(--text-light);margin-top:3px;">Each project calculated independently with its own QP%/bonus tier</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:0.68rem;color:var(--text-muted);margin-bottom:2px;">Total Payout w/ Mult</div>
      <div style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:2rem;color:var(--green);line-height:1;">₱ ${grandTotal.toFixed(4)}</div>
      <div style="font-size:0.64rem;color:var(--text-muted);margin-top:2px;">${breakdown.length} project${breakdown.length!==1?'s':''} combined</div>
    </div>`;

  // Table header
  document.getElementById('capj-head').innerHTML = `
    <th style="min-width:180px;">Project</th>
    <th style="text-align:center;">GSD</th>
    <th style="text-align:center;">Type</th>
    <th class="cell-num">Initial</th>
    <th class="cell-num">i3QA</th>
    <th class="cell-num">RV</th>
    <th class="cell-num">Fix</th>
    <th class="cell-num">Missed</th>
    <th class="cell-num">Refix</th>
    <th class="cell-num">Warn</th>
    <th class="cell-points">Points</th>
    <th class="cell-qp">Fix QP%</th>
    <th class="cell-num">Qual% Mod</th>
    <th class="cell-points" style="background:rgba(14,165,233,0.1);">Payout w/o Mult</th>
    <th class="cell-points" style="background:rgba(5,150,105,0.18);color:var(--green);font-weight:700;">Payout w/ Mult ₱</th>`;

  // Table body
  const num=(v)=>v>0?`<span style="font-weight:700;color:var(--accent)">${v}</span>`:`<span style="color:var(--text-light)">0</span>`;
  document.getElementById('capj-body').innerHTML = breakdown.map((p,i)=>{
    const qpColor = p.qp>=95?'var(--green)':p.qp>=85?'var(--amber)':'var(--red)';
    const bonusColor = p.totalBonus>0?'var(--green)':'var(--text-muted)';
    const typeBg = p.blocktype==='IR' ? 'var(--amber)' : '#6b7a8d';
    return `<tr style="background:${i%2===0?'var(--surface)':'var(--surface2)'}">
      <td><span style="font-size:0.75rem;font-weight:600;color:var(--text)">${p.project}</span></td>
      <td style="text-align:center;"><span style="font-size:0.7rem;padding:2px 7px;border-radius:4px;background:var(--blue-light);color:var(--accent);font-weight:700;">${p.gsd||'—'}</span></td>
      <td style="text-align:center;"><span style="font-size:0.7rem;padding:2px 7px;border-radius:4px;background:${typeBg};color:#fff;font-weight:700;">${p.blocktype||'—'}</span></td>
      <td class="cell-num">${num(p.initial)}</td>
      <td class="cell-num">${num(p.i3qa)}</td>
      <td class="cell-num">${num(p.rv)}</td>
      <td class="cell-num">${num(p.fix)}</td>
      <td class="cell-num">${num(p.missed)}</td>
      <td class="cell-num">${num(p.refix)}</td>
      <td class="cell-num">${num(p.warn)}</td>
      <td class="cell-points">${p.points.toFixed(4)}</td>
      <td class="cell-qp" style="color:${qpColor};font-weight:700">${p.qp.toFixed(2)}%</td>
      <td class="cell-num" style="color:${p.thresholdApplied?'var(--green)':'var(--accent)'};">${p.qualityPctMod}%${p.thresholdApplied?'<span style="font-size:0.6rem;background:var(--green);color:#fff;border-radius:3px;padding:0 4px;margin-left:3px;">★</span>':''}</td>
      <td class="cell-points" style="color:var(--accent);background:rgba(14,165,233,0.06)">${p.baseBonus.toFixed(4)}</td>
      <td class="cell-points" style="color:${bonusColor};background:rgba(5,150,105,0.08);font-weight:700">₱ ${p.totalBonus.toFixed(4)}</td>
    </tr>`;
  }).join('');

  // Footer totals
  const sum=k=>breakdown.reduce((s,p)=>s+(p[k]||0),0);
  document.getElementById('capj-foot').innerHTML = `<tr style="background:var(--surface2);border-top:2px solid var(--border);">
    <td colspan="3"><strong>TOTAL (${breakdown.length} projects)</strong></td>
    <td class="cell-num"><strong>${sum('initial')}</strong></td>
    <td class="cell-num"><strong>${sum('i3qa')}</strong></td>
    <td class="cell-num"><strong>${sum('rv')}</strong></td>
    <td class="cell-num"><strong>${sum('fix')}</strong></td>
    <td class="cell-num"><strong>${sum('missed')}</strong></td>
    <td class="cell-num"><strong>${sum('refix')}</strong></td>
    <td class="cell-num"><strong>${sum('warn')}</strong></td>
    <td class="cell-points"><strong>${sum('points').toFixed(4)}</strong></td>
    <td colspan="2"></td>
    <td class="cell-points" style="color:var(--accent);font-weight:700;background:rgba(14,165,233,0.08)"><strong>${sum('baseBonus').toFixed(4)}</strong></td>
    <td class="cell-points" style="color:var(--green);font-weight:700;background:rgba(5,150,105,0.18);font-size:0.9rem;"><strong>₱ ${sum('totalBonus').toFixed(4)}</strong></td>
  </tr>`;

  document.getElementById('ca-proj-modal').classList.add('show');
}

// ═══════════════════════════════════════════════════════════════
// CALC-ALL ROW-LEVEL DRILLDOWN MODAL
// Click the # I3QA / # I3 Missed/Rework / # Refix / # Warn number
// for a tech to see exactly which rows (across all projects) make up
// that count.
// ═══════════════════════════════════════════════════════════════
const CALC_DRILL_META = {
  i3qa:    { icon:'🔍', label:'i3QA',                title:'i3QA Task Rows',
             desc:'Rows where this tech performed the i3QA review task.' },
  missed:  { icon:'⚠️', label:'I3 Missed/Rework',    title:'I3 Missed / Rework Rows',
             desc:'Rows where this tech\u2019s initial tagging was flagged as a miss by i3QA.' },
  refix:   { icon:'🔁', label:'Refix',                title:'Refix Rows',
             desc:'Rows where this tech\u2019s original fix was sent back for a refix (points transferred to the refix tech).' },
  warn:    { icon:'🚩', label:'Warn',                 title:'Warning Rows',
             desc:'Rows where a warning label was triggered against this tech\u2019s fix.' },
};

// Case-tolerant raw-row field getter (raw rows are plain objects keyed by
// uppercase DBF/CSV field names, but be defensive either way).
function rg(row, col){
  if(!row) return '';
  const v = row[col] !== undefined ? row[col] : row[col.toUpperCase()];
  return (v===undefined||v===null) ? '' : String(v).trim();
}

function openCalcAllDrilldown(techId, type){
  const tech = calcAllData.find(t => t.id === techId);
  if (!tech) { toast('Tech not found in calc-all data'); return; }
  const meta = CALC_DRILL_META[type];
  if (!meta) return;
  const srcKey = 'src' + type.charAt(0).toUpperCase() + type.slice(1);
  let entries = tech[srcKey] || [];
  // When viewing a single project (via the sidebar), scope everything —
  // rows, points, and DR/DRQ triggers — down to just that project instead
  // of this tech's totals across every project.
  let summaryTech = tech;
  if(calcAllProjectFilter){
    entries = entries.filter(e=>e.project===calcAllProjectFilter);
    const pb = (tech.projectBreakdown||[]).find(p=>p.project===calcAllProjectFilter);
    const drTriggers = (tech.drTriggers||[]).filter(t=>t.project===calcAllProjectFilter);
    const drqTriggers = (tech.drqTriggers||[]).filter(t=>t.project===calcAllProjectFilter);
    summaryTech = {
      ...tech,
      points: pb ? pb.points : tech.points,
      totalDrDeduct: drTriggers.reduce((s,t)=>s+(t.deduct||0),0),
      totalDrqDeduct: drqTriggers.reduce((s,t)=>s+(t.deduct||0),0),
      drTriggers, drqTriggers
    };
  }

  document.getElementById('cad-title').textContent = `${meta.icon} ${meta.title} — ${tech.name||techId} (${techId})`;
  document.getElementById('cad-subtitle').innerHTML =
    `${meta.desc}<br>${entries.length} row${entries.length!==1?'s':''} across ${new Set(entries.map(e=>e.project)).size} project${new Set(entries.map(e=>e.project)).size!==1?'s':''}`;

  document.getElementById('cad-body').innerHTML = entries.length ? entries.map((e,i)=>{
    const r = e.row;
    const fixed1 = rg(r,'FIXED1?') || rg(r,'FIXED1');
    const afp1   = rg(r,'AFP1_STAT');
    return `<tr style="background:${i%2===0?'var(--surface)':'var(--surface2)'}">
      <td><span style="font-size:0.72rem;font-weight:600;color:var(--text)">${e.project}</span></td>
      <td><span class="cell-mono" style="font-size:0.72rem;" title="${rg(r,'UID')}">${rg(r,'UID')||'—'}</span></td>
      <td style="text-align:center;">${rg(r,'CATEGORY')||'—'}</td>
      <td style="text-align:center;">${rg(r,'I3QA_CAT')||'—'}</td>
      <td class="cell-mono" style="font-size:0.72rem;">${rg(r,'QC_ID')||'—'}</td>
      <td class="cell-mono" style="font-size:0.72rem;">${rg(r,'I3QA_ID')||'—'}</td>
      <td>${rg(r,'I3QA_LABEL')||'—'}</td>
      <td class="cell-mono" style="font-size:0.72rem;">${rg(r,'FIX1_ID')||'—'}</td>
      <td>${rg(r,'RV1_LABEL')||'—'}</td>
      <td style="text-align:center;font-weight:${fixed1==='N'?'700':'400'};color:${fixed1==='N'?'var(--red)':'var(--text)'}">${fixed1||'—'}</td>
      <td style="text-align:center;font-weight:${afp1==='AA'?'700':'400'};color:${afp1==='AA'?'var(--red)':'var(--text)'}">${afp1||'—'}</td>
    </tr>`;
  }).join('') : `<tr><td colspan="11" style="text-align:center;padding:20px;color:var(--text-muted);">No rows found.</td></tr>`;

  document.getElementById('cad-summary').innerHTML = buildCalcAllDrillSummary(summaryTech, type, entries);
  document.getElementById('ca-drill-modal').classList.add('show');
}

// Builds the Miss Breakdown / Penalty Level / Points Impact style panel
// (matching the single-project drill-down) but aggregated across every
// project this tech appears in. DR/DRQ thresholds are still evaluated
// per-project (same as the real calculation) — this panel totals up the
// egregious-row counts for context and the ACTUAL deductions that were
// applied project-by-project, rather than re-evaluating a fake combined
// threshold that wouldn't match the real payout.
function buildCalcAllDrillSummary(tech, type, entries){
  if (type !== 'missed' && type !== 'i3qa'){
    if (!entries.length) return '';
    return `<div style="margin-bottom:14px;padding:10px 14px;background:var(--red-bg);border-left:3px solid var(--red);border-radius:0 8px 8px 0;font-size:0.78rem;color:var(--red);font-weight:600;">
      ⚠ These ${entries.length} row${entries.length!==1?'s':''} reduce Fix Quality % across the affected project${new Set(entries.map(e=>e.project)).size!==1?'s':''} → hurts bonus payout
    </div>`;
  }

  const EGREGIOUS_CATS = [1,2,3];
  const rows = entries.map(e=>e.row);
  const egregiousRows = rows.filter(r=>{
    const lbl = rg(r,'I3QA_LABEL').toUpperCase();
    if (lbl === 'D') return false;
    const cat = parseInt(rg(r,'I3QA_CAT') || rg(r,'CATEGORY') || 0);
    return EGREGIOUS_CATS.includes(cat);
  });
  const eCount = egregiousRows.length;
  const totalCount = rows.length;
  const nonEgCount = totalCount - eCount;
  const drqRows = egregiousRows.filter(r=>{
    const f = (rg(r,'FIXED1?') || rg(r,'FIXED1')).toUpperCase();
    const afp1 = rg(r,'AFP1_STAT').toUpperCase();
    return f==='N' || afp1==='AA';
  });
  const drqECount = drqRows.length;
  const drqExcluded = eCount - drqECount;

  const techPts = tech.points || 0;
  const drDeduct  = type==='missed' ? (tech.totalDrDeduct||0)  : 0;
  const drqDeduct = tech.totalDrqDeduct||0;
  const totalDeduct = drDeduct + drqDeduct;
  const basePts = techPts - totalDeduct; // pre-deduction total across all projects
  const drTriggers  = tech.drTriggers||[];
  const drqTriggers = tech.drqTriggers||[];

  const triggerList = (triggers, color) => triggers.length
    ? triggers.map(tr=>`<div style="display:flex;justify-content:space-between;gap:14px;font-size:0.72rem;">
        <span style="color:var(--text-muted);">${tr.project} (${tr.count} rows):</span>
        <span style="font-weight:700;color:${color};">${tr.level} <span style="font-family:'JetBrains Mono',monospace;">${tr.deduct}</span></span>
      </div>`).join('')
    : '';

  const countsPanel = `
    <div style="min-width:170px;">
      <div style="font-weight:700;color:var(--text-muted);font-size:0.68rem;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">${type==='missed'?'Miss Breakdown':'i3QA Review Breakdown'}</div>
      <div style="display:flex;flex-direction:column;gap:4px;">
        <div><span style="color:var(--text-muted);">Total ${type==='missed'?'missed':'i3QA'} rows:</span> <b style="color:var(--text)">${totalCount}</b></div>
        <div><span style="color:${type==='missed'?'var(--red)':'var(--amber)'};font-weight:600;">Egregious (Cat 1,2,3):</span> <b style="color:${type==='missed'?'var(--red)':'var(--amber)'};font-size:1rem;">${eCount}</b></div>
        <div style="margin-left:10px;display:flex;flex-direction:column;gap:2px;">
          <div><span style="color:var(--text-muted);font-size:0.72rem;">↳ FIXED1=N or AFP1=AA:</span> <b style="color:var(--red);font-size:0.82rem;">${drqECount}</b> <span style="color:var(--text-muted);font-size:0.68rem;">← used for DRQ</span></div>
          ${drqExcluded > 0 ? `<div><span style="color:var(--text-muted);font-size:0.72rem;">↳ Neither (excluded):</span> <b style="color:var(--green);font-size:0.82rem;">${drqExcluded}</b> <span style="color:var(--text-muted);font-size:0.68rem;">← excluded from DRQ</span></div>` : ''}
        </div>
        <div><span style="color:var(--text-muted);">Non-egregious:</span> <b style="color:var(--text-muted)">${nonEgCount}</b></div>
      </div>
    </div>`;

  const penaltyPanel = `
    <div style="min-width:230px;">
      <div style="font-weight:700;color:var(--text-muted);font-size:0.68rem;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Penalty Level <span style="font-weight:400;font-size:0.62rem;text-transform:none;">(per project)</span></div>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${type==='missed' ? `
        <div>
          <div style="color:var(--text-muted);font-size:0.74rem;margin-bottom:2px;">i3 Penalty (QC Tech):</div>
          ${drTriggers.length ? triggerList(drTriggers,'var(--red)') : `<span style="color:var(--green);font-size:0.74rem;">None</span>`}
        </div>` : ''}
        <div>
          <div style="color:var(--text-muted);font-size:0.74rem;margin-bottom:2px;">i3QA Penalty (i3QA Tech):</div>
          ${drqTriggers.length ? triggerList(drqTriggers,'var(--amber)') : drqExcluded > 0
            ? `<span style="color:var(--green);font-size:0.74rem;">None — ${drqExcluded} row${drqExcluded!==1?'s':''} excluded (fixed)</span>`
            : `<span style="color:var(--green);font-size:0.74rem;">None</span>`}
        </div>
      </div>
    </div>`;

  const pointsPanel = `
    <div style="min-width:220px;border-left:2px solid var(--border);padding-left:16px;">
      <div style="font-weight:700;color:var(--text-muted);font-size:0.68rem;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Points Impact</div>
      <div style="display:flex;flex-direction:column;gap:4px;font-family:'JetBrains Mono',monospace;font-size:0.8rem;">
        <div style="display:flex;justify-content:space-between;gap:24px;"><span style="color:var(--text-muted);">Base points:</span><span style="font-weight:600;color:var(--accent);">${basePts.toFixed(4)}</span></div>
        ${drDeduct  ? `<div style="display:flex;justify-content:space-between;gap:24px;"><span style="color:var(--red);font-size:0.74rem;">i3 Penalty (QC Tech):</span><span style="font-weight:700;color:var(--red);">${drDeduct} pts</span></div>` : ''}
        ${drqDeduct ? `<div style="display:flex;justify-content:space-between;gap:24px;"><span style="color:var(--red);font-size:0.74rem;">i3QA Penalty (i3QA Tech):</span><span style="font-weight:700;color:var(--red);">${drqDeduct} pts</span></div>` : ''}
        <div style="display:flex;justify-content:space-between;gap:24px;border-top:2px solid var(--border);padding-top:5px;margin-top:3px;"><span style="color:var(--text);font-weight:700;">Final points (all projects):</span><span style="font-weight:700;font-size:0.9rem;color:${techPts >= basePts ? 'var(--green)' : 'var(--red)'};">${techPts.toFixed(4)}</span></div>
      </div>
    </div>`;

  return `<div style="margin-bottom:16px;padding:14px 16px;background:var(--surface2);border-radius:10px;border:1px solid var(--border);">
    <div style="display:flex;flex-wrap:wrap;gap:20px;align-items:flex-start;font-size:0.78rem;">
      ${countsPanel}${penaltyPanel}${pointsPanel}
    </div>
  </div>`;
}

// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
function showLoading(msg){document.getElementById('loading-msg').textContent=msg||'Loading…';document.getElementById('loading-overlay').classList.add('show');}
function hideLoading(){document.getElementById('loading-overlay').classList.remove('show');}
let toastTimer;
function toast(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3000);}
function triggerFileInput(){document.getElementById('file-input-hidden').click();}

// Open New Project modal pre-loaded with dropped/selected files
function openNewProjectWithFiles(files) {
  const dbfFiles = Array.from(files).filter(f => /\.(dbf|zip|csv)$/i.test(f.name));
  if (!dbfFiles.length) { toast('Please drop .dbf, .csv, or .zip files'); return; }
  openNewProjectModal();
  dbfFiles.forEach(npAddFile);
}

// ═══════════════════════════════════════════════════════════════
// EVENTS
// ═══════════════════════════════════════════════════════════════
const dz=document.getElementById('dropzone');
dz.addEventListener('dragover',e=>{e.preventDefault();dz.classList.add('drag-over');});
dz.addEventListener('dragleave',()=>dz.classList.remove('drag-over'));
dz.addEventListener('drop',e=>{e.preventDefault();dz.classList.remove('drag-over');if(e.dataTransfer.files.length)openNewProjectWithFiles(e.dataTransfer.files);});
document.getElementById('file-input-dz').addEventListener('change',e=>{if(e.target.files.length){openNewProjectWithFiles(e.target.files);e.target.value='';}});
document.getElementById('file-input-hidden').addEventListener('change',e=>{if(e.target.files.length){openNewProjectWithFiles(e.target.files);e.target.value='';}});
document.getElementById('save-modal').addEventListener('click',e=>{if(e.target===e.currentTarget)closeModal('save-modal');});
document.getElementById('import-modal').addEventListener('click',e=>{if(e.target===e.currentTarget)cancelImport();});
document.getElementById('settings-modal').addEventListener('click',e=>{if(e.target===e.currentTarget)closeSettings();});
document.getElementById('add-tech-modal').addEventListener('click',e=>{if(e.target===e.currentTarget)closeModal('add-tech-modal');});
document.getElementById('project-name-input').addEventListener('keydown',e=>{if(e.key==='Enter')saveProject();});

// ═══════════════════════════════════════════════════════════════
// DRILL-DOWN: click a stat number → see source rows
// ═══════════════════════════════════════════════════════════════
const DD_STAT_LABELS = {
  initial: '# Initial Tagging', i3qa: '# i3QA', rv: '# RV',
  fix: '# Fix', missed: '# I3 Missed/Rework', refix: '# Refix', warn: '# Warn'
};

function openDrillDown(techId, stat) {
  const tech = techRows.find(t => t.id === techId);
  if (!tech || !tech._src) { toast('No source data available (project may need re-import)'); return; }
  const rows = tech._src[stat] || [];
  const cs = S.calcSettings;
  const gsd = importSettings.gsd || '6in';
  const isIR = importSettings.blocktype === 'IR';

  // ── Title & subtitle ────────────────────────────────────────
  document.getElementById('dd-title').textContent =
    `${DD_STAT_LABELS[stat] || stat} — ${tech.name || techId} (${techId})`;
  document.getElementById('dd-subtitle').textContent =
    `${tech.team || ''}  ·  ${tech.month}  ·  GSD: ${gsd}  ·  Type: ${isIR?'IR':'Non-IR'}`;

  // ── Formula card ─────────────────────────────────────────────
  const formulaCard = document.getElementById('dd-formula-card');
  const formulaBody = document.getElementById('dd-formula-body');
  const ptPerFix = (getCatGsdValue('?', gsd) || '—');
  const irTag = isIR ? ` × ${cs.irModifierValue} (IR)` : '';

  const formulas = {
    initial: [
      [`Points per QC tag`, `${cs.points.qc} pts flat`],
      [`Attribution`, `Goes to the QC_ID tech on each row`],
      [`Total here`, `${rows.length} rows × ${cs.points.qc} = ${(rows.length * cs.points.qc).toFixed(4)} pts`],
    ],
    i3qa: [
      [`Points per i3QA task`, `${cs.points.i3qa.toFixed(6)} pts flat (~1/12)`],
      [`Attribution`, `Goes to the I3QA_ID tech`],
      [`i3QA DRQ Penalty`, `Egregious (Cat 1,2,3) rows this tech reviewed as I3QA_ID, where FIXED1? = "N" or AFP1_STAT = "AA", count toward the DRQ threshold`],
      [`Trigger`, `feedback by RV's and US — deducted from this i3QA Tech's fixpoints (see i3QA Penalty Structure)`],
      [`Total here`, `${rows.length} rows × ${cs.points.i3qa.toFixed(6)} = ${(rows.length * cs.points.i3qa).toFixed(4)} pts — see footer for full DRQ breakdown`],
    ],
    fix: [
      [`Points per fix round`, `catValue[cat][${gsd}]${irTag}`],
      [`Example (Cat 3, ${gsd})`, `${getCatGsdValue(3,gsd)}${isIR?' × '+cs.irModifierValue+' = '+(getCatGsdValue(3,gsd)*cs.irModifierValue).toFixed(4):' pts'}`],
      [`Attribution`, `FIX1_ID … FIX5_ID — each round to its own tech`],
      [`Note`, `Points vary by category — see column ➜`],
    ],
    rv: [
      [`RV1 Non-IR`, `${cs.points.rv1} pts`],
      [`RV1 IR/COMBO`, `${cs.points.rv1_combo} pts`],
      [`RV2+ each`, `${cs.points.rv2} pts`],
      [`Active rule`, isIR ? `IR mode → RV1 = ${cs.points.rv1_combo}` : `Non-IR mode → RV1 = ${cs.points.rv1}`],
    ],
    missed: [
      [`Definition`, `I3QA_LABEL matches: ${S.detect.triggers.miss.labels.join(', ')} (cols: ${S.detect.triggers.miss.columns.join(', ')})`],
      [`Attribution`, `Attributed to QC_ID tech — not the fix tech`],
      [`Quality % effect`, `Each miss adds to denominator → lowers Fix Quality % → hurts payout multiplier`],
      [`QC Penalty`, `Each miss row deducts −${cs.points.qc} pts from QC Tech fixpoints total`],
      [`QC Transfer`, `Those −${cs.points.qc} pts are given to i3QA Tech (I3QA_ID) as a bonus`],
      [`i3 DR Penalty`, `If egregious (Cat 1,2,3) count hits threshold → additional DR-level deduction from QC Tech`],
      [`i3QA DRQ Penalty`, `DRQ counts egregious rows where FIXED1? = "N" or AFP1_STAT = "AA"`],
      [`Total here`, `${rows.length} missed row${rows.length!==1?'s':''} — see footer for full penalty breakdown`],
    ],
    refix: [
      [`Definition`, `RV label matches refix labels: ${S.detect.triggers.refix.labels.join(', ')}`],
      [`Also`, `Any ZFIX${1}–5 ID columns present`],
      [`Attribution`, `To the RV tech (label-based) or ZFIX tech`],
      [`Effect`, `Adds to denominator of Quality % → lowers quality rate`],
    ],
    warn: [
      [`Definition`, `RV warn column matches: ${S.detect.triggers.warning.labels.join(', ')}`],
      [`Columns checked`, `${S.detect.triggers.warning.columns.join(', ')}`],
      [`Attribution`, `Goes to the corresponding RV tech`],
      [`Effect`, `Adds to denominator of Quality % → lowers quality rate`],
    ],
  };
  const fItems = formulas[stat] || [[`Stat`, stat]];
  formulaBody.innerHTML = fItems.map(([k,v]) =>
    `<div><span style="font-weight:600;color:var(--text-muted)">${k}:</span></div><div>${v}</div>`
  ).join('');
  formulaCard.style.display = 'block';

  // ── Table columns ─────────────────────────────────────────────
  // Show point column only for tasks that actually earn points
  const showPts = ['initial','i3qa','fix','rv'].includes(stat);
  // For missed stat: add I3QA_LABEL column to make the M flag visible
  const COLS = stat === 'missed'
    ? ['UID','I3QA_CAT','QC_ID','I3QA_ID','I3QA_LABEL','FIX1_ID','RV1_ID','COMBO?']
    : stat === 'i3qa'
    ? ['UID','I3QA_CAT','QC_ID','I3QA_ID','I3QA_LABEL','FIXED1?','AFP1_STAT','RV1_ID','COMBO?']
    : ['UID','CATEGORY','QC_ID','I3QA_ID','FIX1_ID','FIX1_DATE','RV1_ID','RV1_LABEL','COMBO?'];
  const LABELS = {UID:'UID',CATEGORY:'Cat',I3QA_CAT:'i3QA Cat','QC_ID':'QC Tech','I3QA_ID':'i3QA Tech',
    I3QA_LABEL:'i3QA Label',FIX1_ID:'Fix1 Tech',FIX1_DATE:'Fix1 Date','FIXED1?':'Fixed1?',AFP1_STAT:'AFP1 Stat',
    RV1_ID:'RV1 Tech',RV1_LABEL:'RV1 Label','COMBO?':'COMBO'};

  // header
  document.getElementById('dd-head').innerHTML =
    COLS.map(c=>`<th style="white-space:nowrap">${LABELS[c]||c}</th>`).join('')
    + (showPts ? `<th style="text-align:right;background:#1e3a52;white-space:nowrap">Pts (this row)</th>` : '');

  if (!rows.length) {
    document.getElementById('dd-body').innerHTML =
      `<tr><td colspan="${COLS.length + (showPts?1:0)}" style="text-align:center;padding:24px;color:var(--text-muted)">No source rows found</td></tr>`;
    document.getElementById('dd-foot').innerHTML = '';
    document.getElementById('dd-count').textContent = '0 rows';
    document.getElementById('dd-formula-card').style.display = 'none';
    document.getElementById('dd-jump-btn').style.display = 'none';
    document.getElementById('drilldown-modal').classList.add('show');
    return;
  }

  // normalize
  const normalize = row => {
    if (row.uid !== undefined) {
      return { UID:row.uid, CATEGORY:row.category, QC_ID:row.qc_id,
        I3QA_ID:row.i3qa_id, I3QA_LABEL:row.i3qa_label,
        I3QA_CAT:row._raw?.I3QA_CAT || row._raw?.i3qa_cat || '—',
        FIX1_ID:row.fix1_id, FIX1_DATE:row.fix1_date,
        'FIXED1?': row.fixed1 || row._raw?.['FIXED1?'] || row._raw?.FIXED1 || '',
        AFP1_STAT: row._raw?.AFP1_STAT || row._raw?.afp1_stat || row.afp1_stat || '',
        RV1_ID:row.rv1_id, RV1_LABEL:row.rv1_label, 'COMBO?':row.ir,
        _processed:true, _allFix: [row.fix1_id, row._raw?.FIX2_ID, row._raw?.FIX3_ID, row._raw?.FIX4_ID, row._raw?.FIX5_ID].filter(Boolean)
      };
    }
    return { ...row,
      _allFix: [1,2,3,4,5].map(i=>row[`FIX${i}_ID`]).filter(Boolean)
    };
  };

  // deduplicate
  const seen = new Set(); const unique = [];
  rows.forEach(r => {
    const n = normalize(r);
    const uid = n.UID||'';
    if (!seen.has(uid)) { seen.add(uid); unique.push(n); }
  });

  // compute per-row point contribution for this stat
  function rowPts(r) {
    const cat = parseInt(r.CATEGORY) || 0;
    const catVal = getCatGsdValue(cat, gsd);
    const irM = isIR ? cs.irModifierValue : 1.0;
    if (stat === 'initial') return cs.points.qc;
    if (stat === 'i3qa')    return cs.points.i3qa;
    if (stat === 'fix')     return catVal * irM;
    if (stat === 'rv') {
      // If this tech is RV1, award RV1 pts; else RV2+ pts — best approximation without round info
      return isIR ? cs.points.rv1_combo : cs.points.rv1;
    }
    return 0;
  }

  let grandPts = 0;
  document.getElementById('dd-body').innerHTML = unique.map(r => {
    const uid = r.UID || '';
    const irVal = r['COMBO?'];
    const isAllIR = irVal === 'IR';
    const isCombo = irVal === 'COMBO' || irVal === 'Y';
    const irTag = isAllIR
      ? '<span style="color:var(--amber);font-weight:700;font-size:0.68rem;background:var(--amber-bg);padding:1px 4px;border-radius:3px;">IR</span>'
      : isCombo
      ? '<span style="color:var(--purple);font-weight:700;font-size:0.68rem;background:var(--purple-bg);padding:1px 4px;border-radius:3px;">COMBO</span>'
      : '—';
    const pts = showPts ? rowPts(r) : 0;
    grandPts += pts;
    const cat = parseInt(r.CATEGORY)||0;
    const catVal = showPts && stat==='fix' ? getCatGsdValue(cat, gsd) : null;
    const ptsCellTitle = stat==='fix' && catVal!=null
      ? `Cat ${cat} × ${gsd} = ${catVal}${isIR?' × '+cs.irModifierValue+' (IR)':''}`
      : '';
    // For missed rows: detect the miss label on this specific row
    const missLabels = S.detect.triggers.miss.labels.map(l => l.toLowerCase());
    const rowI3qaLabel = (r['I3QA_LABEL'] || r.i3qa_label || '').trim().toLowerCase();
    const isMissRow = stat === 'missed' && missLabels.includes(rowI3qaLabel);
    // For i3qa rows: flag egregious rows and those that qualify toward the DRQ count
    const EGREGIOUS_CATS_ROW = [1,2,3];
    const rowCatForEgr = parseInt(r['I3QA_CAT'] || r['CATEGORY'] || 0);
    const rowLabelUC = (r['I3QA_LABEL'] || r.i3qa_label || '').toString().trim().toUpperCase();
    const isEgregiousI3qaRow = stat === 'i3qa' && rowLabelUC !== 'D' && EGREGIOUS_CATS_ROW.includes(rowCatForEgr);
    const rowFixed1 = (r['FIXED1?'] || r['FIXED1'] || '').toString().trim().toUpperCase();
    const rowAfp1   = (r['AFP1_STAT'] || '').toString().trim().toUpperCase();
    const isDrqEligibleRow = isEgregiousI3qaRow && (rowFixed1 === 'N' || rowAfp1 === 'AA');
    const rowBg = isMissRow ? 'background:var(--red-bg);'
      : isDrqEligibleRow ? 'background:var(--red-bg);'
      : isEgregiousI3qaRow ? 'background:var(--amber-bg);'
      : '';
    return `<tr style="cursor:pointer;${rowBg}" onclick="jumpToRow('${uid}')" title="Click to jump to this record in Tasks view">
      ${COLS.map(c => {
        if (c==='COMBO?') return `<td style="text-align:center">${irTag}</td>`;
        if (c==='CATEGORY') return `<td><span class="cell-mono" style="font-size:0.7rem;font-weight:600;color:var(--accent)">${r[c]||'—'}</span></td>`;
        // I3QA_LABEL in missed view: highlight the M label in red
        if (c==='I3QA_LABEL') {
          const lv = (r[c] || r.i3qa_label || '—').toString();
          const isMissLabel = missLabels.includes(lv.trim().toLowerCase());
          return `<td style="text-align:center"><span style="font-size:0.72rem;font-weight:700;padding:2px 6px;border-radius:4px;${isMissLabel?'background:var(--red-border);color:var(--red);':'color:var(--text-muted)'}">${lv}</span></td>`;
        }
        // FIXED1? / AFP1_STAT in i3qa view: highlight the values that qualify a row for DRQ
        if ((c==='FIXED1?' || c==='AFP1_STAT') && stat === 'i3qa') {
          const lv = (r[c] || '—').toString();
          const qualifies = (c==='FIXED1?' && lv.trim().toUpperCase()==='N') || (c==='AFP1_STAT' && lv.trim().toUpperCase()==='AA');
          return `<td style="text-align:center"><span style="font-size:0.72rem;font-weight:700;padding:2px 6px;border-radius:4px;${qualifies?'background:var(--red-border);color:var(--red);':'color:var(--text-muted)'}">${lv}</span></td>`;
        }
        // QC_ID in missed view: highlight because this tech owns the penalty
        if (c==='QC_ID' && stat === 'missed') {
          const v = (r[c] || r.qc_id || '—').toString();
          const isThisTech = v === techId;
          return `<td><span class="cell-mono" title="${v}" style="font-size:0.7rem;font-weight:700;color:var(--red)">${v}</span></td>`;
        }
        const v = (r[c]||'—').toString();
        const short = v.length>26 ? v.slice(0,24)+'…' : v;
        // Highlight if this cell is the tech being drilled
        const isThisTech = v === techId;
        return `<td><span class="cell-mono" title="${v}" style="font-size:0.7rem${isThisTech?';font-weight:700;color:var(--green)':''}">${short}</span></td>`;
      }).join('')}
      ${showPts ? `<td style="text-align:right;font-family:'JetBrains Mono',monospace;font-weight:600;font-size:0.72rem;color:var(--accent);background:rgba(45,140,240,0.05);" title="${ptsCellTitle}">${pts.toFixed(4)}</td>` : ''}
    </tr>`;
  }).join('');

  // totals footer
  if (showPts) {
    // ── Initial Tagging: transparent points breakdown ─────────
    if (stat === 'initial') {
      const rawEarned = grandPts;
      const qcPtVal   = cs.points.qc;
      // Count penalty rows (I3QA_LABEL = M or E) among this tech's initial rows
      const penLabelsUC = (S.detect.triggers.qcPenalty.labels || ['m','e']).map(l=>l.toUpperCase());
      const penRows = unique.filter(r => {
        const lbl = (r['I3QA_LABEL'] || r.i3qa_label || '').trim().toUpperCase();
        return penLabelsUC.includes(lbl);
      });
      const penCount  = penRows.length;
      const penDeduct = penCount * qcPtVal;
      const netPts    = rawEarned - penDeduct;

      document.getElementById('dd-foot').innerHTML = `
        <tr style="background:var(--surface2);">
          <td colspan="${COLS.length + 1}" style="padding:12px 14px;">
            <div style="display:flex;flex-wrap:wrap;gap:20px;align-items:flex-start;font-size:0.78rem;">

              <!-- Earned breakdown -->
              <div style="min-width:190px;">
                <div style="font-weight:700;color:var(--text-muted);font-size:0.68rem;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Points Earned</div>
                <div style="display:flex;flex-direction:column;gap:4px;font-family:'JetBrains Mono',monospace;font-size:0.78rem;">
                  <div style="display:flex;justify-content:space-between;gap:20px;">
                    <span style="color:var(--text-muted);">Tagged rows:</span>
                    <span style="font-weight:600;">${unique.length} × ${qcPtVal} pts</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;gap:20px;border-top:1px dashed var(--border);padding-top:3px;margin-top:2px;">
                    <span style="color:var(--text-muted);">Gross earned:</span>
                    <span style="font-weight:700;color:var(--accent);">+${rawEarned.toFixed(4)} pts</span>
                  </div>
                </div>
              </div>

              <!-- Penalty breakdown -->
              <div style="min-width:230px;">
                <div style="font-weight:700;color:var(--text-muted);font-size:0.68rem;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">QC Penalty (i3 Miss Deduction)</div>
                <div style="display:flex;flex-direction:column;gap:4px;font-family:'JetBrains Mono',monospace;font-size:0.78rem;">
                  <div style="display:flex;justify-content:space-between;gap:20px;">
                    <span style="color:var(--text-muted);">Miss/Egregious rows:</span>
                    <span style="font-weight:600;color:${penCount>0?'var(--red)':'var(--green)'};">${penCount}</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;gap:20px;">
                    <span style="color:var(--text-muted);">Per-row deduction:</span>
                    <span style="font-weight:600;">${penCount>0?'−'+qcPtVal+' pts each':'—'}</span>
                  </div>
                  ${penCount > 0 ? `<div style="display:flex;justify-content:space-between;gap:20px;border-top:1px dashed var(--border);padding-top:3px;margin-top:2px;"><span style="color:var(--red);">Total deducted:</span><span style="font-weight:700;color:var(--red);">−${penDeduct.toFixed(4)} pts</span></div>` : `<div style="color:var(--green);font-size:0.74rem;">✓ No penalty rows — full earnings kept</div>`}
                  ${penCount > 0 ? `<div style="margin-top:4px;padding:4px 8px;background:rgba(220,38,38,0.08);border-left:3px solid var(--red);border-radius:0 4px 4px 0;font-size:0.7rem;color:var(--text-muted);font-family:'Inter',sans-serif;">Points transferred to i3QA tech as QC Transfer bonus</div>` : ''}
                </div>
              </div>

              <!-- Net final -->
              <div style="min-width:190px;border-left:2px solid var(--border);padding-left:16px;">
                <div style="font-weight:700;color:var(--text-muted);font-size:0.68rem;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Net Points (Initial Tagging)</div>
                <div style="display:flex;flex-direction:column;gap:4px;font-family:'JetBrains Mono',monospace;font-size:0.78rem;">
                  <div style="display:flex;justify-content:space-between;gap:20px;">
                    <span style="color:var(--text-muted);">Gross earned:</span>
                    <span style="color:var(--accent);">+${rawEarned.toFixed(4)}</span>
                  </div>
                  ${penCount > 0 ? `<div style="display:flex;justify-content:space-between;gap:20px;"><span style="color:var(--red);">QC penalty deduct:</span><span style="color:var(--red);">−${penDeduct.toFixed(4)}</span></div>` : ''}
                  <div style="display:flex;justify-content:space-between;gap:20px;border-top:2px solid var(--border);padding-top:5px;margin-top:3px;">
                    <span style="font-weight:700;color:var(--text);">Net from Initial:</span>
                    <span style="font-weight:700;font-size:0.92rem;color:${netPts < rawEarned ? 'var(--amber)' : 'var(--green)'};">${netPts.toFixed(4)} pts</span>
                  </div>
                  <div style="font-size:0.68rem;color:var(--text-light);margin-top:2px;font-family:'Inter',sans-serif;">Formula: (${unique.length} × ${qcPtVal}) − (${penCount} × ${qcPtVal}) = ${netPts.toFixed(4)}</div>
                </div>
              </div>

            </div>
          </td>
        </tr>`;
    } else if (stat !== 'i3qa') {
    document.getElementById('dd-foot').innerHTML = `<tr style="background:var(--blue-light);">
      <td colspan="${COLS.length}" style="padding:8px 12px;font-size:0.75rem;font-weight:700;color:var(--text);">
        Total contribution from these ${unique.length} row${unique.length!==1?'s':''}
      </td>
      <td style="text-align:right;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:0.82rem;color:var(--accent);padding:8px 12px;">
        ${grandPts.toFixed(4)} pts
      </td>
    </tr>`;
    } else {
    // ── DRQ penalty calculation (i3QA Tech penalty — feedback by RV's and US) ──
    const EGREGIOUS_CATS = [1, 2, 3];
    const I3QA_DRQ = [
      { min:200, level:'DRQ5', deduct:-500 },
      { min:100, level:'DRQ4', deduct:-200 },
      { min: 50, level:'DRQ3', deduct:-100 },
      { min: 20, level:'DRQ2', deduct: -50 },
      { min: 10, level:'DRQ1', deduct: -30 },
    ];

    const egregiousRows = unique.filter(r => {
      const lbl = (r['I3QA_LABEL'] || r.i3qa_label || '').toString().trim().toUpperCase();
      if (lbl === 'D') return false; // ignore rows where I3QA_LABEL = D
      return EGREGIOUS_CATS.includes(parseInt(r['I3QA_CAT'] || r['CATEGORY'] || 0));
    });
    const eCount = egregiousRows.length;
    const totalCount = unique.length;
    const nonEgCount = totalCount - eCount;

    // DRQ counts egregious rows where FIXED1? = "N" OR AFP1_STAT = "AA"
    const drqEgregiousRows = egregiousRows.filter(r => {
      const f    = (r['FIXED1?']   || r['FIXED1']   || '').toString().trim().toUpperCase();
      const afp1 = (r['AFP1_STAT'] || '').toString().trim().toUpperCase();
      return f === 'N' || afp1 === 'AA';
    });
    const drqECount = drqEgregiousRows.length;
    const drqFixedExcluded = eCount - drqECount;

    const drqRule = I3QA_DRQ.find(d => drqECount >= d.min) || null;

    const techPts   = tech.points || 0;
    const drqDeduct = drqRule ? drqRule.deduct : 0;
    const finalPts  = techPts + drqDeduct;

    const drqBadge = drqRule ? `<span style="background:var(--amber);color:#fff;border-radius:3px;padding:1px 7px;font-weight:700;font-size:0.72rem;margin-right:4px;">${drqRule.level}</span>` : '';

    document.getElementById('dd-foot').innerHTML = `
      <tr style="background:var(--surface2);">
        <td colspan="${COLS.length + 1}" style="padding:10px 12px;">
          <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start;font-size:0.78rem;">

            <!-- Counts -->
            <div style="min-width:170px;">
              <div style="font-weight:700;color:var(--text-muted);font-size:0.68rem;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">i3QA Review Breakdown</div>
              <div style="display:flex;flex-direction:column;gap:4px;">
                <div><span style="color:var(--text-muted);">Total i3QA rows:</span> <b style="color:var(--text)">${totalCount}</b></div>
                <div><span style="color:var(--amber);font-weight:600;">Egregious (Cat 1,2,3):</span> <b style="color:var(--amber);font-size:1rem;">${eCount}</b></div>
                <div style="margin-left:10px;display:flex;flex-direction:column;gap:2px;">
                  <div><span style="color:var(--text-muted);font-size:0.72rem;">↳ FIXED1=N or AFP1=AA:</span> <b style="color:var(--red);font-size:0.82rem;">${drqECount}</b> <span style="color:var(--text-muted);font-size:0.68rem;">← used for DRQ</span></div>
                  ${drqFixedExcluded > 0 ? `<div><span style="color:var(--text-muted);font-size:0.72rem;">↳ Neither (excluded):</span> <b style="color:var(--green);font-size:0.82rem;">${drqFixedExcluded}</b> <span style="color:var(--text-muted);font-size:0.68rem;">← excluded from DRQ</span></div>` : ""}
                </div>
                <div><span style="color:var(--text-muted);">Non-egregious:</span> <b style="color:var(--text-muted)">${nonEgCount}</b></div>
              </div>
            </div>

            <!-- DRQ Level -->
            <div style="min-width:210px;">
              <div style="font-weight:700;color:var(--text-muted);font-size:0.68rem;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Penalty Level</div>
              <div style="display:flex;flex-direction:column;gap:3px;">
                <div style="display:flex;align-items:center;gap:6px;">
                  <span style="color:var(--text-muted);font-size:0.74rem;min-width:80px;">i3QA Penalty:</span>
                  ${drqRule
                    ? `${drqBadge}<span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--red);">${drqRule.deduct} pts</span>`
                    : drqFixedExcluded > 0
                      ? `<span style="color:var(--green);font-size:0.74rem;">None — ${drqFixedExcluded} row${drqFixedExcluded!==1?'s':''} excluded (fixed)</span>`
                      : `<span style="color:var(--green);font-size:0.74rem;">None</span>`}
                </div>
                ${drqRule
                  ? `<div style="margin-left:86px;display:flex;flex-direction:column;gap:2px;"><span style="font-size:0.67rem;background:#78350f;color:#fcd34d;border-radius:3px;padding:2px 7px;font-weight:700;letter-spacing:0.04em;">⚠ DEDUCTED FROM i3QA TECH</span><span style="font-size:0.67rem;color:var(--text-muted);margin-top:1px;">Based on ${drqECount} egregious rows (FIXED1=N or AFP1=AA)</span></div>`
                  : `<div style="margin-left:86px;font-size:0.68rem;color:var(--text-muted);">Threshold is 10+ qualifying egregious rows (DRQ1)</div>`}
              </div>
            </div>

            <!-- Points summary -->
            <div style="min-width:250px;border-left:2px solid var(--border);padding-left:16px;">
              <div style="font-weight:700;color:var(--text-muted);font-size:0.68rem;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Points Impact</div>
              <div style="display:flex;flex-direction:column;gap:4px;font-family:'JetBrains Mono',monospace;font-size:0.8rem;">
                <div style="display:flex;justify-content:space-between;gap:24px;"><span style="color:var(--text-muted);">i3QA task points (${totalCount} × ${cs.points.i3qa.toFixed(6)}):</span><span style="font-weight:600;color:#8b5cf6;">+${grandPts.toFixed(4)}</span></div>
                <div style="display:flex;justify-content:space-between;gap:24px;"><span style="color:var(--text-muted);">Base total points (all tasks):</span><span style="font-weight:600;color:var(--accent);">${techPts.toFixed(4)}</span></div>
                ${drqRule ? `<div style="display:flex;justify-content:space-between;gap:24px;" title="${drqECount} egregious rows (FIXED1=N or AFP1=AA) → ${drqRule.level}"><span style="color:var(--red);font-size:0.74rem;">i3QA Penalty (DRQ):</span><span style="font-weight:700;color:var(--red);">${drqRule.deduct} pts</span></div>` : ''}
                <div style="display:flex;justify-content:space-between;gap:24px;border-top:2px solid var(--border);padding-top:5px;margin-top:3px;"><span style="color:var(--text);font-weight:700;">Final points:</span><span style="font-weight:700;font-size:0.9rem;color:${finalPts >= techPts ? 'var(--green)' : 'var(--red)'};">${finalPts.toFixed(4)}</span></div>
              </div>
            </div>

          </div>

          <div style="margin-top:12px;background:var(--blue-light);border-radius:7px;border-left:3px solid var(--accent);padding:10px 14px;font-size:0.72rem;color:var(--text);line-height:1.9;">
            <div style="font-weight:700;color:var(--text-muted);font-size:0.68rem;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Calculation Breakdown</div>
            <div style="font-family:'JetBrains Mono',monospace;">
              <div><span style="color:var(--text-muted);">1. i3QA task points</span> = ${totalCount} rows × ${cs.points.i3qa.toFixed(6)} = <b style="color:#8b5cf6;">${grandPts.toFixed(4)} pts</b></div>
              <div><span style="color:var(--text-muted);">2. Egregious rows</span> (Cat 1,2,3, excl. label "D") = <b>${eCount}</b> of ${totalCount} total</div>
              <div><span style="color:var(--text-muted);">3. DRQ-qualifying rows</span> (FIXED1="N" or AFP1_STAT="AA") = <b>${drqECount}</b> of ${eCount} egregious</div>
              <div><span style="color:var(--text-muted);">4. Threshold check</span> = ${drqECount} ${drqRule?`≥ ${drqRule.min}`:'< 10'} → ${drqRule?`<b style="color:var(--red);">${drqRule.level} triggered</b>`:'<b style="color:var(--green);">no DRQ level reached</b>'}</div>
              <div><span style="color:var(--text-muted);">5. Deduction applied</span> = ${drqRule?`<b style="color:var(--red);">${drqRule.deduct} pts</b>`:'<b>0 pts</b>'}</div>
              <div style="border-top:1px dashed var(--border);margin-top:6px;padding-top:6px;"><span style="color:var(--text-muted);">6. Final points</span> = ${techPts.toFixed(4)} ${drqDeduct!==0?(drqDeduct<0?'−':'+')+' '+Math.abs(drqDeduct):''} = <b style="color:${finalPts>=techPts?'var(--green)':'var(--red)'};">${finalPts.toFixed(4)} pts</b></div>
            </div>
          </div>

        </td>
      </tr>`;
    }
  } else if (stat === 'missed') {
    // ── Egregious penalty calculation ────────────────────────────
    const EGREGIOUS_CATS = [1, 2, 3];
    const I3_DR = [
      { min:200, level:'DR5', deduct:-500 },
      { min:100, level:'DR4', deduct:-200 },
      { min: 70, level:'DR3', deduct:-100 },
      { min: 50, level:'DR2', deduct: -50 },
      { min: 30, level:'DR1', deduct: -30 },
    ];
    const I3QA_DRQ = [
      { min:200, level:'DRQ5', deduct:-500 },
      { min:100, level:'DRQ4', deduct:-200 },
      { min: 50, level:'DRQ3', deduct:-100 },
      { min: 20, level:'DRQ2', deduct: -50 },
      { min: 10, level:'DRQ1', deduct: -30 },
    ];

    const egregiousRows = unique.filter(r => {
      const i3qaLbl = (r['I3QA_LABEL'] || r.i3qa_label || '').toString().trim().toUpperCase();
      if (i3qaLbl === 'D') return false; // ignore rows where I3QA_LABEL = D
      return EGREGIOUS_CATS.includes(parseInt(r['I3QA_CAT'] || r['CATEGORY'] || 0));
    });
    const eCount = egregiousRows.length;
    const totalCount = unique.length;
    const nonEgCount = totalCount - eCount;

    // DRQ counts egregious rows where FIXED1? = "N" OR AFP1_STAT = "AA"
    const drqEgregiousRows = egregiousRows.filter(r => {
      const f    = (r['FIXED1?']   || r['FIXED1']   || '').toString().trim().toUpperCase();
      const afp1 = (r['AFP1_STAT'] || r['afp1_stat'] || '').toString().trim().toUpperCase();
      return f === 'N' || afp1 === 'AA';
    });
    const drqECount = drqEgregiousRows.length;
    const drqFixedExcluded = eCount - drqECount;

    const drRule   = I3_DR.find(d => eCount >= d.min)     || null;
    const drqRule  = I3QA_DRQ.find(d => drqECount >= d.min) || null;

    const techPts  = tech.points || 0;
    const drDeduct  = drRule  ? drRule.deduct  : 0;
    const drqDeduct = drqRule ? drqRule.deduct : 0;
    const totalDeduct = drDeduct + drqDeduct;
    const finalPts = techPts + totalDeduct; // deductions are negative

    const drBadge  = drRule  ? `<span style="background:#dc2626;color:#fff;border-radius:3px;padding:1px 7px;font-weight:700;font-size:0.72rem;margin-right:4px;">${drRule.level}</span>` : '';
    const drqBadge = drqRule ? `<span style="background:var(--amber);color:#fff;border-radius:3px;padding:1px 7px;font-weight:700;font-size:0.72rem;margin-right:4px;">${drqRule.level}</span>` : '';
    const noBadge  = !drRule && !drqRule ? `<span style="color:var(--green);font-weight:700;">✓ No DR/DRQ triggered</span>` : '';

    document.getElementById('dd-foot').innerHTML = `
      <tr style="background:var(--surface2);">
        <td colspan="${COLS.length}" style="padding:10px 12px;">
          <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start;font-size:0.78rem;">

            <!-- Counts -->
            <div style="min-width:160px;">
              <div style="font-weight:700;color:var(--text-muted);font-size:0.68rem;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Miss Breakdown</div>
              <div style="display:flex;flex-direction:column;gap:4px;">
                <div><span style="color:var(--text-muted);">Total missed rows:</span> <b style="color:var(--text)">${totalCount}</b></div>
                <div><span style="color:var(--red);font-weight:600;">Egregious (Cat 1,2,3):</span> <b style="color:var(--red);font-size:1rem;">${eCount}</b></div>
                <div style="margin-left:10px;display:flex;flex-direction:column;gap:2px;">
                  <div><span style="color:var(--text-muted);font-size:0.72rem;">↳ FIXED1=N or AFP1=AA:</span> <b style="color:var(--red);font-size:0.82rem;">${drqECount}</b> <span style="color:var(--text-muted);font-size:0.68rem;">← used for DRQ</span></div>
                  ${drqFixedExcluded > 0 ? `<div><span style="color:var(--text-muted);font-size:0.72rem;">↳ Neither (excluded):</span> <b style="color:var(--green);font-size:0.82rem;">${drqFixedExcluded}</b> <span style="color:var(--text-muted);font-size:0.68rem;">← excluded from DRQ</span></div>` : ""}
                </div>
                <div><span style="color:var(--text-muted);">Non-egregious:</span> <b style="color:var(--text-muted)">${nonEgCount}</b></div>
              </div>
            </div>

            <!-- DR Level -->
            <div style="min-width:220px;">
              <div style="font-weight:700;color:var(--text-muted);font-size:0.68rem;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Penalty Level</div>
              <div style="display:flex;flex-direction:column;gap:8px;">
                <div style="display:flex;flex-direction:column;gap:3px;">
                  <div style="display:flex;align-items:center;gap:6px;">
                    <span style="color:var(--text-muted);font-size:0.74rem;min-width:80px;">i3 Penalty:</span>
                    ${drBadge || '<span style="color:var(--green);font-size:0.74rem;">None</span>'}
                    ${drRule ? `<span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--red);">${drRule.deduct} pts</span>` : ''}
                  </div>
                  ${drRule ? `<div style="margin-left:86px;"><span style="font-size:0.67rem;background:#7f1d1d;color:#fca5a5;border-radius:3px;padding:2px 7px;font-weight:700;letter-spacing:0.04em;">⚠ DEDUCTED FROM QC TECH</span></div>` : ''}
                </div>
                <div style="display:flex;flex-direction:column;gap:3px;">
                  <div style="display:flex;align-items:center;gap:6px;">
                    <span style="color:var(--text-muted);font-size:0.74rem;min-width:80px;">i3QA Penalty:</span>
                    ${drqRule
                      ? `${drqBadge}<span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--red);">${drqRule.deduct} pts</span>`
                      : drqFixedExcluded > 0
                        ? `<span style="color:var(--green);font-size:0.74rem;">None — ${drqFixedExcluded} row${drqFixedExcluded!==1?'s':''} excluded (fixed)</span>`
                        : `<span style="color:var(--green);font-size:0.74rem;">None</span>`}
                  </div>
                  ${drqRule ? `<div style="margin-left:86px;display:flex;flex-direction:column;gap:2px;"><span style="font-size:0.67rem;background:#78350f;color:#fcd34d;border-radius:3px;padding:2px 7px;font-weight:700;letter-spacing:0.04em;">⚠ DEDUCTED FROM i3QA TECH</span><span style="font-size:0.67rem;color:var(--text-muted);margin-top:1px;">Based on ${drqECount} egregious rows (FIXED1=N or AFP1=AA)</span></div>` : ''}
                </div>
              </div>
            </div>

            <!-- Points summary -->
            <div style="min-width:260px;border-left:2px solid var(--border);padding-left:16px;">
              <div style="font-weight:700;color:var(--text-muted);font-size:0.68rem;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Points Impact</div>
              <div style="display:flex;flex-direction:column;gap:4px;font-family:'JetBrains Mono',monospace;font-size:0.8rem;">
                <div style="display:flex;justify-content:space-between;gap:24px;"><span style="color:var(--text-muted);">Base points:</span><span style="font-weight:600;color:var(--accent);">${techPts.toFixed(4)}</span></div>
                ${drRule ? `<div style="display:flex;justify-content:space-between;gap:24px;"><span style="color:var(--red);font-size:0.74rem;">i3 Penalty (QC Tech):</span><span style="font-weight:700;color:var(--red);">${drRule.deduct} pts</span></div>` : ''}
                ${drqRule ? `<div style="display:flex;justify-content:space-between;gap:24px;" title="${drqECount} egregious rows (FIXED1=N or AFP1=AA) → ${drqRule.level}"><span style="color:var(--red);font-size:0.74rem;">i3QA Penalty (${drqECount} rows):</span><span style="font-weight:700;color:var(--red);">${drqRule.deduct} pts</span></div>` : ''}
                ${totalDeduct < 0 ? `<div style="display:flex;justify-content:space-between;gap:24px;background:rgba(220,38,38,0.07);padding:3px 6px;border-radius:4px;margin-top:2px;"><span style="color:var(--red);font-weight:700;">Total deduction:</span><span style="font-weight:700;color:var(--red);">${totalDeduct} pts</span></div>` : ''}
                <div style="display:flex;justify-content:space-between;gap:24px;border-top:2px solid var(--border);padding-top:5px;margin-top:3px;"><span style="color:var(--text);font-weight:700;">Final points:</span><span style="font-weight:700;font-size:0.9rem;color:${finalPts >= techPts ? 'var(--green)' : 'var(--red)'};">${finalPts.toFixed(4)}</span></div>
              </div>
            </div>

          </div>
        </td>
      </tr>`;
  } else {
    document.getElementById('dd-foot').innerHTML = `<tr style="background:var(--red-bg);">
          <td colspan="${COLS.length}" style="padding:8px 12px;font-size:0.75rem;color:var(--red);font-weight:600;">
            ⚠ These ${unique.length} row${unique.length!==1?'s':''} reduce Quality % → hurts bonus payout
          </td>
        </tr>`;
  }

  document.getElementById('dd-count').textContent =
    `${unique.length} unique row${unique.length!==1?'s':''}` +
    (unique.length < rows.length ? ` (${rows.length} total, ${rows.length-unique.length} dupes hidden)` : '') +
    (showPts ? ` · ${grandPts.toFixed(4)} pts total` : '');

  document.getElementById('dd-jump-btn').style.display = unique.length === 1 ? 'inline-flex' : 'none';
  if (unique.length === 1) {
    document.getElementById('dd-jump-btn').onclick = () => jumpToRow(unique[0].UID||'');
  }

  document.getElementById('drilldown-modal').classList.add('show');
}

let _ddLastJumpUid = '';
function jumpToRowFromDrilldown() {
  closeModal('drilldown-modal');
}


function jumpToRow(uid) {
  closeModal('drilldown-modal');
  switchView('tasks');
  const searchInput = document.getElementById('search-input');
  searchInput.value = uid;
  applyFilters();
  setTimeout(()=>{
    const match = document.querySelector('#table-body tr');
    if(match) match.scrollIntoView({behavior:'smooth',block:'center'});
  }, 120);
}

// ═══════════════════════════════════════════════════════════════
// ABOUT / FORMULA MODAL
// ═══════════════════════════════════════════════════════════════
function openAboutModal() {
  const cs = S.calcSettings;
  const gsd = importSettings.gsd || '6in';
  const isIR = importSettings.blocktype === 'IR';
  const det = S.detect;

  // ① Point sources table
  const sources = [
    ['QC Tech (QC_ID)', 'Present on row — Initial Tagging', cs.points.qc, `${cs.points.qc} pts flat per tagged row`],
    ['QC Tech (QC_ID)', `Penalty: I3QA_LABEL = ${det.triggers.qcPenalty.labels.join('/')} in ${det.triggers.qcPenalty.columns.join(', ')}`, `−${cs.points.qc}`, `−${cs.points.qc} pts per miss row → deducted from QC Tech`],
    ['i3QA Tech (I3QA_ID)', 'QC Transfer: receives deducted pts from QC penalty rows', `+${cs.points.qc}`, `+${cs.points.qc} pts per QC miss row → transferred to i3QA Tech`],
    ['i3QA Tech (I3QA_ID)', 'i3QA task — Present on row', cs.points.i3qa.toFixed(6), `~1/12 pts per row (~${cs.points.i3qa.toFixed(4)})`],
    ['Fix Tech (FIX1–5_ID)', `Cat × ${gsd}${isIR?' × '+cs.irModifierValue+' IR':''}`, '(varies)', `catValue[cat][${gsd}]${isIR?' × '+cs.irModifierValue:''} per round`],
    ['RV1 Tech (RV1_ID)', isIR?'IR mode active':'Non-IR mode', isIR?cs.points.rv1_combo:cs.points.rv1, `RV1 = ${isIR?cs.points.rv1_combo+' (IR)':cs.points.rv1+' (non-IR)'}`],
    ['RV2+ Tech (RV2–4_ID)', 'Each additional RV', cs.points.rv2, `${cs.points.rv2} pts each`],
  ];
  // Style penalty/transfer rows differently
  const sourceRowColors = ['var(--bg)','var(--red-bg)','rgba(5,150,105,0.07)','var(--bg)','var(--surface)','var(--bg)','var(--surface)'];
  const sourceRowTextColors = ['','var(--red)','var(--green)','','','',''];
  document.getElementById('about-sources-body').innerHTML = sources.map(([role, cond, pts, formula], i) => {
    const bg = sourceRowColors[i] || (i%2===0?'var(--bg)':'var(--surface)');
    const tc = sourceRowTextColors[i] || '';
    const ptsColor = tc || (String(pts).startsWith('-') ? 'var(--red)' : 'var(--accent)');
    return `<tr style="background:${bg}">
      <td style="padding:8px 12px;font-weight:600;color:${tc||'var(--text)'}">${role}</td>
      <td style="padding:8px 12px;color:${tc||'var(--text-muted)'}">${cond}</td>
      <td style="padding:8px 12px;text-align:right;font-family:'JetBrains Mono',monospace;font-weight:700;color:${ptsColor}">${pts}</td>
      <td style="padding:8px 12px;color:${tc||'var(--text-muted)'}">${formula}</td>
    </tr>`;
  }).join('');

  // ② Category × GSD table — highlight active GSD column
  const GSDS = ['3in','4in','6in','9in'];
  const GSD_EL = document.getElementById('about-gsd-highlight');
  GSDS.forEach((g, gi) => {
    const ths = document.querySelectorAll('#about-modal thead th');
    // update headers to show active GSD
  });
  // Simpler: just rebuild header highlight
  const irVal = cs.irModifierValue;
  document.getElementById('about-ir-val').textContent = irVal;
  document.getElementById('about-cat-body').innerHTML = Object.entries(cs.categoryValues).map(([cat, vals], i) => {
    return `<tr style="background:${i%2===0?'var(--bg)':'var(--surface)'}">
      <td style="padding:7px 14px;font-weight:700;color:var(--accent)">Cat ${cat}</td>
      ${GSDS.map(g => {
        const v = vals[g] || 0;
        const isActive = g === gsd;
        return `<td style="padding:7px 14px;text-align:right;font-family:'JetBrains Mono',monospace;${isActive?'font-weight:700;color:var(--accent);background:rgba(45,140,240,0.08)':''}">${v}</td>`;
      }).join('')}
      <td style="padding:7px 14px;text-align:right;font-family:'JetBrains Mono',monospace;color:var(--amber);font-weight:600;">${(vals[gsd]||0)*irVal}</td>
    </tr>`;
  }).join('');

  // ③ Detection labels
  document.getElementById('about-detect-labels').innerHTML = [
    [`Refix labels`, det.triggers.refix.labels.join(', '), `in cols: ${det.triggers.refix.columns.join(', ')}`],
    [`Miss labels`, det.triggers.miss.labels.join(', '), `in cols: ${det.triggers.miss.columns.join(', ')}`],
    [`Warning labels`, det.triggers.warning.labels.join(', '), `in cols: ${det.triggers.warning.columns.join(', ')}`],
    [`QC Penalty`, det.triggers.qcPenalty.labels.join(', '), `in cols: ${det.triggers.qcPenalty.columns.join(', ')}`],
  ].map(([k,v,c]) => `<div><b>${k}:</b> <code style="background:var(--surface);padding:1px 5px;border-radius:3px;">${v}</code> <span style="color:var(--text-light);font-size:0.72rem">${c}</span></div>`).join('');

  // ④ Threshold bonus
  const thresholds = S.bonusThresholds || [];
  document.getElementById('about-threshold-text').innerHTML = thresholds.length
    ? `If quality % ≥ threshold, bonus uses the threshold's fixed % instead of the lookup table:<br>`
      + thresholds.map(t => `Quality ≥ <b>${t.quality}%</b> → flat <b>${t.bonus}%</b> of (Points × Multiplier)`).join('<br>')
    : 'No thresholds configured.';

  // ⑤ Quality modifier table (first 20 entries)
  const tiers = S.bonusTiers || [];
  document.getElementById('about-quality-body').innerHTML = tiers.slice(0, 20).map((tier, i) => {
    const next = tiers[i+1];
    const lower = next ? next.quality : 0;
    const effPct = Math.round(tier.bonus * 100);
    const color = tier.bonus >= 1 ? 'var(--green)' : tier.bonus >= 0.8 ? 'var(--accent)' : tier.bonus >= 0.5 ? 'var(--amber)' : 'var(--red)';
    return `<tr style="background:${i%2===0?'var(--bg)':'var(--surface)'}">
      <td style="padding:6px 14px;font-family:'JetBrains Mono',monospace;font-weight:600">${tier.quality}%</td>
      <td style="padding:6px 14px;text-align:right;font-family:'JetBrains Mono',monospace;color:${color};font-weight:700">${tier.bonus.toFixed(2)}</td>
      <td style="padding:6px 14px;text-align:right;font-family:'JetBrains Mono',monospace;color:${color};font-weight:700">${effPct}%</td>
      <td style="padding:6px 14px;color:var(--text-muted);font-size:0.74rem">Points × Multiplier × ${tier.bonus.toFixed(2)} = ${effPct}% payout</td>
    </tr>`;
  }).join('') + (tiers.length > 20 ? `<tr><td colspan="4" style="padding:8px 14px;color:var(--text-muted);font-size:0.72rem;text-align:center;">… ${tiers.length-20} more tiers — see ⚙ Settings &gt; Quality % Modifiers</td></tr>` : '');

  // ⑥ Miss attribution text
  document.getElementById('about-miss-text').innerHTML =
    `<b>Miss detection:</b> When I3QA_LABEL matches <code style="background:var(--red-bg);color:var(--red);padding:1px 5px;border-radius:3px;">${det.triggers.miss.labels.join(', ')}</code> `
    + `(cols: ${det.triggers.miss.columns.join(', ')}), the miss is attributed to the <b>QC_ID tech</b> — not the fix tech.<br>`
    + `<b>Effect on Quality %:</b> The QC tech's missed count increases, which hurts their Fix Quality % and therefore their payout multiplier.<br>`
    + `<b>QC Penalty (point deduction):</b> Additionally, when I3QA_LABEL matches <code style="background:var(--red-bg);color:var(--red);padding:1px 5px;border-radius:3px;">${det.triggers.qcPenalty.labels.join(', ')}</code> `
    + `(cols: ${det.triggers.qcPenalty.columns.join(', ')}), the QC Tech loses <b>${cs.points.qc} pts</b> from their fixpoints total per row.<br>`
    + `<b>QC Transfer:</b> Those deducted points are <b>transferred to the i3QA Tech (I3QA_ID)</b> on the same row as a bonus — rewarding the reviewer who caught the miss.`;

  document.getElementById('about-modal').classList.add('show');
}


// ═══════════════════════════════════════════════════════════════
// NEW PROJECT MODAL
// ═══════════════════════════════════════════════════════════════
let npPendingFiles = []; // array of File objects

function openNewProjectModal() {
  // Reset form
  document.getElementById('np-name').value = '';
  document.getElementById('np-non-ir').checked = true;
  document.getElementById('np-ir-notice').style.display = 'none';
  npClearFiles();
  document.getElementById('np-error').style.display = 'none';
  // Reset chips to defaults
  document.querySelectorAll('[data-group="np-site"]').forEach(c => {
    c.classList.toggle('selected', c.dataset.val === 'Cebu');
    c.classList.remove('green','amber','red','gray');
  });
  document.querySelectorAll('[data-group="np-gsd"]').forEach(c => {
    c.classList.remove('selected','green','amber','red','gray');
    if (c.dataset.val === '6in') { c.classList.add('selected','green'); }
  });
  document.getElementById('new-project-modal').classList.add('show');
  setTimeout(() => document.getElementById('np-name').focus(), 100);

  // Wire drag-and-drop on the dropzone
  const dz = document.getElementById('np-dropzone');
  dz.ondragover = e => { e.preventDefault(); dz.style.borderColor='var(--accent)'; dz.style.background='#e8f4fd'; };
  dz.ondragleave = () => { npResetDropzone(); };
  dz.ondrop = e => {
    e.preventDefault();
    npResetDropzone();
    const files = Array.from(e.dataTransfer.files).filter(f => /\.(dbf|zip|csv)$/i.test(f.name));
    if (files.length) files.forEach(npAddFile);
    else toast('Drop .dbf, .csv, or .zip files only');
  };
}

function npResetDropzone() {
  document.getElementById('np-dz-icon').textContent = '📂';
  document.getElementById('np-dz-text').textContent = 'Drop .dbf / .zip / .csv files here';
  document.getElementById('np-dz-sub').textContent  = 'or click to browse — multiple files supported';
  const dz = document.getElementById('np-dropzone');
  dz.style.borderColor = 'var(--border)';
  dz.style.background  = '#f7f9fc';
}

function npClearFiles() {
  npPendingFiles = [];
  npResetDropzone();
  document.getElementById('np-file-list').style.display = 'none';
  document.getElementById('np-file-items').innerHTML = '';
  document.getElementById('np-file-count').textContent = '0 files';
  // reset the file input so same files can be re-selected
  const inp = document.getElementById('np-file-input');
  if (inp) inp.value = '';
}

function npAddFile(file) {
  // Avoid exact duplicates (same name + size)
  if (npPendingFiles.some(f => f.name === file.name && f.size === file.size)) return;
  npPendingFiles.push(file);
  npUpdateFileList();
}

function npUpdateFileList() {
  const list = document.getElementById('np-file-list');
  const items = document.getElementById('np-file-items');
  const count = npPendingFiles.length;

  document.getElementById('np-file-count').textContent = `${count} file${count !== 1 ? 's' : ''}`;
  list.style.display = count > 0 ? 'block' : 'none';

  items.innerHTML = npPendingFiles.map((f, i) => `
    <li style="display:flex;align-items:center;gap:8px;padding:5px 10px;font-size:0.78rem;border-bottom:1px solid var(--border-light);">
      <span style="font-size:1rem;">📄</span>
      <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text);">${f.name}</span>
      <span style="color:var(--text-muted);font-size:0.72rem;white-space:nowrap;">${(f.size/1024).toFixed(1)} KB</span>
      <button onclick="npRemoveFile(${i})" style="background:none;border:none;cursor:pointer;color:var(--red);font-size:0.78rem;padding:0 2px;line-height:1;" title="Remove">✕</button>
    </li>`).join('');

  // Update the dropzone indicator
  if (count > 0) {
    document.getElementById('np-dz-icon').textContent = '✅';
    document.getElementById('np-dz-text').textContent = `${count} file${count !== 1 ? 's' : ''} selected`;
    document.getElementById('np-dz-sub').textContent = 'Drop more or click to add more files';
    document.getElementById('np-dropzone').style.borderColor = 'var(--green)';
    document.getElementById('np-dropzone').style.background  = '#f0fdf4';
    // Auto-fill project name from first filename if blank
    const nameInput = document.getElementById('np-name');
    if (!nameInput.value.trim()) nameInput.value = npPendingFiles[0].name.replace(/\.(zip|dbf|csv)$/i,'');
  } else {
    npResetDropzone();
  }
}

function npRemoveFile(index) {
  npPendingFiles.splice(index, 1);
  npUpdateFileList();
}

function npFileChosen(input) {
  Array.from(input.files).forEach(npAddFile);
  // Reset input so the same file can be added again if needed after clearing
  input.value = '';
}

function npBlocktypeChange() {
  const isIR = document.getElementById('np-ir').checked;
  const notice = document.getElementById('np-ir-notice');
  notice.style.display = isIR ? 'block' : 'none';
  notice.style.borderColor = 'var(--amber)'; notice.style.background = '#fef3c7'; notice.style.color = '#92400e';
  notice.innerHTML = '⚡ <strong>IR Project:</strong> All fix task points will be multiplied by ×1.5. SQM is not used for IR projects.';
}

async function confirmNewProject() {
  const name = document.getElementById('np-name').value.trim().replace(/\s+/g,' ');
  const errEl = document.getElementById('np-error');
  errEl.style.display = 'none';

  if (!name) { errEl.textContent = 'Please enter a project name.'; errEl.style.display = 'block'; return; }
  if (!npPendingFiles.length) { errEl.textContent = 'Please choose at least one DBF, CSV, or ZIP file.'; errEl.style.display = 'block'; return; }

  const blocktype = document.getElementById('np-ir').checked ? 'IR' : 'NON';
  const site = document.querySelector('[data-group="np-site"].selected')?.dataset.val || 'Cebu';
  const gsd  = document.querySelector('[data-group="np-gsd"].selected')?.dataset.val  || '6in';
  const month = document.getElementById('np-month').value;
  const year  = parseInt(document.getElementById('np-year').value) || new Date().getFullYear();

  // Apply settings
  importSettings = { site, gsd, blocktype, month, year, sqm: 0, name };
  currentProjectName = name;

  closeModal('new-project-modal');
  showLoading(`Parsing ${npPendingFiles.length} file${npPendingFiles.length > 1 ? 's' : ''}…`);

  try {
    // Parse all files and collect dbfBuffers
    const dbfBuffers = [];
    for (const file of npPendingFiles) {
      const buf = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = e => res(e.target.result);
        r.onerror = () => rej(new Error('Failed to read ' + file.name));
        r.readAsArrayBuffer(file);
      });

      if (file.name.toLowerCase().endsWith('.zip')) {
        const zip = await JSZip.loadAsync(buf);
        const dataEntries = Object.values(zip.files).filter(f => /\.(dbf|csv)$/i.test(f.name));
        if (!dataEntries.length) { toast(`No .dbf or .csv found in ${file.name}`); continue; }
        for (const entry of dataEntries) {
          const ext = entry.name.toLowerCase().endsWith('.csv') ? 'csv' : 'dbf';
          dbfBuffers.push({ buffer: await entry.async('arraybuffer'), label: entry.name, ext });
        }
      } else {
        const ext = file.name.toLowerCase().endsWith('.csv') ? 'csv' : 'dbf';
        dbfBuffers.push({ buffer: buf, label: file.name, ext });
      }
    }

    if (!dbfBuffers.length) { hideLoading(); toast('No valid DBF/CSV data found in the selected files.'); return; }

    // Parse each buffer and merge rows
    let mergedRows = [];
    for (const { buffer, label, ext } of dbfBuffers) {
      document.getElementById('loading-msg').textContent = `Parsing ${label}…`;
      await new Promise(r => setTimeout(r, 20));
      const rows = ext === 'csv' ? parseCSV(new TextDecoder('utf-8').decode(buffer)) : parseDbf(buffer);
      mergedRows = mergedRows.concat(rows);
    }

    document.getElementById('loading-msg').textContent = `Merging ${mergedRows.length.toLocaleString()} records…`;
    await new Promise(r => setTimeout(r, 20));

    // Guard against accidentally re-importing a REPORT csv (e.g. the
    // "Calculate All" export, which is one row per tech with columns like
    // id/name/points, not one row per fixpoint with a UID) — importing that
    // shape here silently produces a project where every row looks empty.
    const firstKeys = mergedRows.length ? Object.keys(mergedRows[0]) : [];
    const looksLikeRowData = firstKeys.includes('UID');
    const looksLikeCalcAllReport = !looksLikeRowData &&
      (firstKeys.includes('ID') && firstKeys.includes('NAME') && (firstKeys.includes('TOTALBONUS') || firstKeys.includes('QUALITYPCTMOD')));
    if (mergedRows.length && !looksLikeRowData) {
      hideLoading();
      const msg = looksLikeCalcAllReport
        ? '❌ That looks like a "Calculate All" summary export (one row per tech), not fixpoint row data — it can\'t be re-imported as a project. Use the CSV exported from the Tasks view instead (or the original .dbf/.zip).'
        : '❌ That CSV doesn\'t have a UID column, so it isn\'t fixpoint row data. Only re-import CSVs exported via "Export CSV" from the Tasks view (or the original .dbf/.zip).';
      toast(msg);
      document.getElementById('new-project-modal').classList.add('show');
      return;
    }

    // Load the merged rows (loadParsedRows handles hideLoading + toast)
    await loadParsedRows(mergedRows, name, dbfBuffers.length);

    // Save to IndexedDB — store all merged raw records for reliable reload
    const project = {
      name, createdAt: Date.now(), rowCount: allRows.length,
      rawRecords: mergedRows,
      importSettings: {...importSettings},
      sourceFiles: npPendingFiles.map(f => f.name)
    };
    try {
      await dbSave(project);
      await refreshProjectList();
    } catch(ex) { console.error(ex); toast('Save error: '+ex.message); }

  } catch(ex) {
    hideLoading();
    toast('Error: ' + ex.message);
    console.error(ex);
  }
}


// ═══════════════════════════════════════════════════════════════
// AUTO-DETECT CURRENT MONTH / YEAR ON LOAD
// ═══════════════════════════════════════════════════════════════
(function initDateDefaults() {
  const now = new Date();
  const yr  = now.getFullYear();
  const mo  = now.toLocaleString('en-US', { month: 'long' }); // e.g. "June"
  // Import modal
  const impMonth = document.getElementById('imp-month');
  const impYear  = document.getElementById('imp-year');
  if (impMonth) { for (let o of impMonth.options) o.selected = (o.value === mo); }
  if (impYear)  { impYear.value = yr; }
  // New Project modal
  const npMonth = document.getElementById('np-month');
  const npYear  = document.getElementById('np-year');
  if (npMonth) { for (let o of npMonth.options) o.selected = (o.value === mo || o.text === mo); }
  if (npYear)  { npYear.value = yr; }
})();

// ═══════════════════════════════════════════════════════════════
// ROW DETAIL MODAL  — eye icon on Tasks table
// ═══════════════════════════════════════════════════════════════
// ─────────────────────────────────────────────────────────────────────────────
//  SHARED DETAIL HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function _detailSection(icon, title, color, hint, content) {
  return `
  <div style="background:var(--surface2);border-radius:10px;border:1px solid var(--border);margin-bottom:14px;overflow:hidden;">
    <div style="display:flex;align-items:center;gap:8px;padding:11px 16px;border-bottom:1px solid var(--border);background:rgba(0,0,0,0.06);">
      <span style="font-size:1rem;">${icon}</span>
      <span style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:${color};">${title}</span>
      ${hint ? `<span style="font-size:0.68rem;color:var(--text-muted);margin-left:auto;font-style:italic;">${hint}</span>` : ''}
    </div>
    <div style="padding:12px 16px;">${content}</div>
  </div>`;
}

function _kv(label, val, valColor, explain, mono) {
  return `
  <div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:5px 0;border-bottom:1px solid var(--border-light);">
    <div>
      <span style="font-size:0.76rem;color:var(--text-muted);">${label}</span>
      ${explain ? `<div style="font-size:0.66rem;color:var(--text-muted);margin-top:1px;line-height:1.4;">${explain}</div>` : ''}
    </div>
    <span style="${mono!==false?'font-family:\'JetBrains Mono\',monospace;':''}font-weight:700;color:${valColor||'var(--text)'};font-size:0.82rem;white-space:nowrap;">${val}</span>
  </div>`;
}

function _formulaBox(expr) {
  return `<div style="margin-top:10px;background:var(--blue-light);border-radius:7px;border-left:3px solid var(--accent);padding:8px 12px;font-family:'JetBrains Mono',monospace;font-size:0.72rem;color:var(--accent);">${expr}</div>`;
}

function _badge(text, bg, fg) {
  return `<span style="background:${bg};color:${fg||'#fff'};border-radius:4px;padding:1px 7px;font-size:0.68rem;font-weight:700;white-space:nowrap;">${text}</span>`;
}

// ─────────────────────────────────────────────────────────────────────────────
//  ROW DETAIL MODAL  — 👁 on Tasks table
// ─────────────────────────────────────────────────────────────────────────────
function openRowDetail(uid) {
  const row = allRows.find(r => r.uid === uid);
  if (!row) { toast('Row not found'); return; }
  const raw  = row._raw || {};
  const cs   = S.calcSettings;
  const isIR = importSettings.blocktype === 'IR';
  const gsd  = importSettings.gsd || '6in';
  const irM  = isIR ? cs.irModifierValue : 1.0;
  const cat  = parseInt(row.category || 0);
  const catVal = getCatGsdValue(cat, gsd);

  // ── per-task attribution lines ─────────────────────────────
  const lines = [];
  let totalPts = 0;
  const tag = (label, techId, pts, formulaHtml, type) => {
    const info = techId ? (TECH_ROSTER[techId] || {}) : {};
    lines.push({ label, techId: techId||'—', name: info.name||techId||'—', team: info.team||'', formulaHtml, pts, type });
    totalPts += pts;
  };

  if (row.qc_id)   tag('Initial Tag', row.qc_id,   cs.points.qc,
    `<b>${cs.points.qc}</b> pts flat rate (every tagged fixpoint earns this for the QC tech)`, 'qc');

  if (row.i3qa_id) tag('i3QA Review', row.i3qa_id, cs.points.i3qa,
    `<b>1 ÷ 12 = ${cs.points.i3qa.toFixed(6)}</b> pts (one-twelfth of a fix point per i3QA pass)`, 'i3qa');

  const fixCatCols = [null,'CATEGORY','RV1_CAT','RV2_CAT','RV3_CAT','CATEGORY'];
  for (let i = 1; i <= 5; i++) {
    const fid = (raw[`FIX${i}_ID`]||'').trim().toUpperCase();
    if (!fid) continue;
    const rCat  = parseInt(raw[fixCatCols[i]] || raw['CATEGORY'] || 0);
    const rVal  = getCatGsdValue(rCat, gsd);
    const pts   = rVal * irM;
    const irPart = isIR ? ` × <b>${cs.irModifierValue}</b> IR modifier` : '';
    tag(`Fix Round ${i}`, fid, pts,
      `Cat <b>${rCat}</b> @ GSD <b>${gsd}</b> = <b>${rVal}</b>${irPart} = <b>${pts.toFixed(4)}</b> pts`, 'fix');
  }

  const rv1id = (raw['RV1_ID']||'').trim().toUpperCase();
  if (rv1id) {
    const pts = isIR ? cs.points.rv1_combo : cs.points.rv1;
    tag('RV1 Review', rv1id, pts,
      isIR ? `IR/COMBO block → flat <b>${pts}</b> pts for first reviewer`
           : `Non-IR block → flat <b>${pts}</b> pts for first reviewer`, 'rv');
  }
  for (let i = 2; i <= 4; i++) {
    const rid = (raw[`RV${i}_ID`]||'').trim().toUpperCase();
    if (rid) tag(`RV${i} Review`, rid, cs.points.rv2,
      `RV round ≥ 2 → flat <b>${cs.points.rv2}</b> pts (secondary reviewer rate)`, 'rv');
  }

  // QC penalty / transfer
  const i3qaLabel    = (raw['I3QA_LABEL']||'').trim().toUpperCase();
  const missLabelsUC = S.detect.triggers.miss.labels.map(l=>l.toUpperCase());
  const isMiss       = missLabelsUC.includes(i3qaLabel);
  const penCols      = S.detect.triggers.qcPenalty?.columns || [];
  const penLabels    = S.detect.triggers.qcPenalty?.labels  || [];
  const isPenalty    = penCols.some(c => {
    const v = (raw[c.toUpperCase()]||'').trim().toLowerCase();
    return v && penLabels.includes(v);
  });
  if (isPenalty && row.qc_id) {
    tag('QC Penalty', row.qc_id, -cs.points.qc,
      `QC tech initially tagged this wrong → <b>−${cs.points.qc}</b> pts deducted from QC`, 'penalty');
    if (row.i3qa_id) tag('QC→i3QA Transfer', row.i3qa_id, cs.points.qc,
      `Those points are transferred to the i3QA tech who caught the error → <b>+${cs.points.qc}</b>`, 'transfer');
  }

  // ── miss / egregious flags ────────────────────────────────
  const fixed1val = (raw['FIXED1?']||raw['FIXED1']||'').toString().trim().toUpperCase();
  const afp1val   = (raw['AFP1_STAT']||'').toString().trim().toUpperCase();
  const isEgregious = [1,2,3].includes(cat);
  const isDrq     = isEgregious && (fixed1val==='N' || afp1val==='AA');

  // ── render ─────────────────────────────────────────────────
  const irBadge = row.ir==='IR'   ? _badge('IR','var(--amber)')
                : row.ir==='COMBO'? _badge('COMBO','var(--purple)')
                :                   _badge('Non-IR','var(--border)','var(--text-muted)');

  const totalColor = totalPts>0?'var(--green)':totalPts<0?'var(--red)':'var(--text-muted)';
  const typeColors = { qc:'var(--accent)', i3qa:'#8b5cf6', fix:'var(--green)', rv:'var(--amber)', penalty:'var(--red)', transfer:'var(--purple)' };

  // Attribution table
  const attrRows = lines.map((l,i)=>{
    const bg = i%2===0?'':'background:rgba(0,0,0,0.03);';
    const pc = l.pts<0?'var(--red)':l.pts>0?'var(--green)':'var(--text-muted)';
    const tc = typeColors[l.type]||'var(--text-muted)';
    return `<tr style="${bg}">
      <td style="padding:8px 10px;white-space:nowrap;">
        <span style="display:inline-block;background:${tc};opacity:0.9;color:#fff;border-radius:4px;padding:1px 7px;font-size:0.65rem;font-weight:700;">${l.label}</span>
      </td>
      <td style="padding:8px 10px;font-family:'JetBrains Mono',monospace;font-size:0.72rem;font-weight:700;color:var(--accent);">${l.techId}</td>
      <td style="padding:8px 10px;font-size:0.76rem;">${l.name}${l.team?` <span style="color:var(--text-muted);font-size:0.68rem;">(${l.team})</span>`:''}</td>
      <td style="padding:8px 10px;font-size:0.71rem;color:var(--text-muted);line-height:1.5;">${l.formulaHtml}</td>
      <td style="padding:8px 10px;text-align:right;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:0.84rem;color:${pc};">${l.pts>=0?'+':''}${l.pts.toFixed(4)}</td>
    </tr>`;
  }).join('');

  // Category value reference table
  const catTable = `
    <table style="width:100%;border-collapse:collapse;font-size:0.73rem;">
      <thead><tr style="background:var(--header-bg);color:var(--header-text);">
        <th style="padding:5px 8px;text-align:left;">Cat</th>
        <th style="padding:5px 8px;text-align:right;">Value @ ${gsd}</th>
        ${isIR?`<th style="padding:5px 8px;text-align:right;">After IR ×${cs.irModifierValue}</th>`:''}
        <th style="padding:5px 8px;text-align:left;">Meaning</th>
      </tr></thead>
      <tbody>
        ${[1,2,3,4,5,6,7,8,9].map(c=>{
          const v = getCatGsdValue(c, gsd);
          const active = c===cat;
          const bg = active ? 'background:rgba(14,165,233,0.1);' : (c%2===0?'background:rgba(0,0,0,0.02);':'');
          const fw = active ? 'font-weight:700;' : '';
          return `<tr style="${bg}${fw}">
            <td style="padding:5px 8px;">Cat ${c}${active?` <span style="background:var(--accent);color:#fff;border-radius:3px;padding:0 5px;font-size:0.63rem;">THIS ROW</span>`:''}</td>
            <td style="padding:5px 8px;text-align:right;font-family:'JetBrains Mono',monospace;color:${active?'var(--accent)':''};">${v}</td>
            ${isIR?`<td style="padding:5px 8px;text-align:right;font-family:'JetBrains Mono',monospace;color:${active?'var(--amber)':'var(--text-muted)'};">${(v*irM).toFixed(4)}</td>`:''}
            <td style="padding:5px 8px;font-size:0.69rem;color:var(--text-muted);">${['','Egregious A','Egregious B','Egregious C','Minor A','Minor B','Minor C','Advisory A','Advisory B','Advisory C'][c]||''}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;

  // Flag pills
  const flagsHtml = `
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">
      ${isMiss    ? _badge(`⚠ Missed/Rework (${i3qaLabel})`,'var(--red)') : _badge('✓ Not Missed','var(--border)','var(--text-muted)')}
      ${isEgregious ? _badge(`Cat ${cat} = Egregious`,'#7c3aed') : _badge(`Cat ${cat} = Non-Egregious`,'var(--border)','var(--text-muted)')}
      ${fixed1val==='N' ? _badge('FIXED1? = N → counts for DRQ','var(--red)') : afp1val==='AA' ? _badge('AFP1_STAT = AA → counts for DRQ','var(--red)') : _badge('Not DRQ-eligible','var(--border)','var(--text-muted)')}
      ${isPenalty ? _badge('QC Penalty applied','var(--red)') : ''}
    </div>`;

  // ── SECTION 0: Quick identity ─────────────────────────────
  const sec0 = _detailSection('🪪','Record Identity','var(--text-muted)','raw field values from DBF', `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 24px;">
      ${_kv('Category', `<b style="color:var(--accent)">Cat ${row.category||'—'}</b>`,   'var(--text)', 'Determines point value per fix')}
      ${_kv('Block Type', irBadge,  'var(--text)', 'IR = higher RV1 rate, combo eligible')}
      ${_kv('GSD Setting', `<b>${gsd}</b>`, 'var(--text)', 'Ground Sample Distance — used to look up cat value')}
      ${_kv('Site', importSettings.site||'—', 'var(--text-muted)')}
      ${_kv('Fix Date', row.fix1_date||'—', 'var(--text-muted)')}
      ${_kv('FIXED1?', `<b style="color:${fixed1val==='N'?'var(--red)':'var(--green)'}">${fixed1val||'—'}</b>`, 'var(--text)',
        fixed1val==='N'?'Not yet fixed → counts for DRQ':'Fixed or blank → excluded from DRQ')}
      ${_kv('AFP1_STAT', `<b style="color:${afp1val==='AA'?'var(--red)':'var(--text)'}">${afp1val||'—'}</b>`, 'var(--text)',
        afp1val==='AA'?'RQA-approved → counts for DRQ':'')}
      ${_kv('i3QA Label', `<b style="color:${isMiss?'var(--red)':'var(--green)'}">${row.i3qa_label||'—'}</b>`, 'var(--text)',
        isMiss?`Matches miss label (${missLabelsUC.join(',')}) → Missed flag`:'Does not match miss labels')}
      ${_kv('RV1 Label', row.rv1_label||'—', 'var(--text-muted)')}
      ${_kv('Refixes (Z-Fix)', row.zfix_count, row.zfix_count>0?'var(--red)':'var(--text-muted)',
        row.zfix_count>0?'Each refix lowers that tech\'s Fix Quality %':'')}
    </div>
    <div style="margin-top:10px;border-top:1px solid var(--border-light);padding-top:8px;">
      <div style="font-size:0.68rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:5px;">Status Flags</div>
      ${flagsHtml}
    </div>`);

  // ── SECTION 1: Category value reference ──────────────────
  const sec1 = _detailSection('🗂️','Category Point Values','var(--accent)',
    `Fix pts = Cat value × GSD × IR modifier`,
    catTable + _formulaBox(`Cat ${cat} @ ${gsd} = ${catVal}${isIR?` × ${cs.irModifierValue} (IR) = ${(catVal*irM).toFixed(4)}`:''}`));

  // ── SECTION 2: Point attribution table ───────────────────
  const sec2 = _detailSection('💰','Point Attribution — Who Earns What From This Row','var(--green)',
    'Each task type has its own tech and formula', `
    <div style="font-size:0.71rem;color:var(--text-muted);margin-bottom:10px;line-height:1.5;">
      A single fixpoint row can generate points for multiple techs simultaneously — the QC tech who tagged it, the i3QA tech who reviewed it,
      the fix tech(s) who fixed it across rounds, and the RV tech(s) who verified it. Each is shown below with the exact formula used.
    </div>
    <div style="overflow-x:auto;border-radius:8px;border:1px solid var(--border);">
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:var(--header-bg);color:var(--header-text);">
            <th style="padding:8px 10px;text-align:left;font-size:0.67rem;text-transform:uppercase;letter-spacing:0.05em;">Task Type</th>
            <th style="padding:8px 10px;text-align:left;font-size:0.67rem;text-transform:uppercase;letter-spacing:0.05em;">Tech ID</th>
            <th style="padding:8px 10px;text-align:left;font-size:0.67rem;text-transform:uppercase;letter-spacing:0.05em;">Tech Name</th>
            <th style="padding:8px 10px;text-align:left;font-size:0.67rem;text-transform:uppercase;letter-spacing:0.05em;">Formula / Reason</th>
            <th style="padding:8px 10px;text-align:right;font-size:0.67rem;text-transform:uppercase;letter-spacing:0.05em;">Points</th>
          </tr>
        </thead>
        <tbody>${attrRows}</tbody>
        <tfoot>
          <tr style="background:var(--surface2);border-top:2px solid var(--border);">
            <td colspan="4" style="padding:9px 12px;font-weight:700;font-size:0.78rem;">Total points distributed from this one row</td>
            <td style="padding:9px 12px;text-align:right;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:0.92rem;color:${totalColor};">${totalPts.toFixed(4)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div style="margin-top:8px;font-size:0.69rem;color:var(--text-muted);line-height:1.5;">
      ℹ <b>Why the total can exceed the cat value:</b> QC flat pts + i3QA flat pts + Fix pts (cat×gsd) + RV flat pts are all <i>additive</i> —
      they each go to different techs, so the same row contributes to multiple people's totals.
    </div>`);

  document.getElementById('rd-uid').textContent = `UID: ${uid}`;
  document.getElementById('rd-body').innerHTML = sec0 + sec1 + sec2;
  document.getElementById('row-detail-modal').classList.add('show');
}

// ─────────────────────────────────────────────────────────────────────────────
//  TECH DETAIL MODAL  — 👁 on Tech Summary table
// ─────────────────────────────────────────────────────────────────────────────
function openTechDetail(techId) {
  const tech = techRows.find(t => t.id === techId);
  if (!tech) { toast('Tech not found'); return; }

  const cs   = S.calcSettings;
  const isIR = importSettings.blocktype === 'IR';
  const gsd  = importSettings.gsd || '6in';
  const mult = tech.bonusMultiplier || currentBonusMultiplier;
  const qp   = tech.qp    || 0;
  const qualMod    = tech.qualityPctMod || 0;
  const threshApplied = tech.thresholdApplied || false;
  const baseBonus  = tech.baseBonus  || 0;
  const totalBonus = tech.totalBonus || 0;
  const qpColor = qp>=95?'var(--green)':qp>=85?'var(--amber)':'var(--red)';

  // ── Derived numbers ────────────────────────────────────────
  const qcPts   = tech.initial * cs.points.qc;
  const i3qaPts = tech.i3qa * cs.points.i3qa;
  const denom   = tech.fix + tech.refix + tech.warn;

  // Fix points broken down by category using _src records
  const fixSrc  = (tech._src?.fix || []);
  const catMap  = {};   // cat → { count, totalPts }
  const fixCatCols = [null,'CATEGORY','RV1_CAT','RV2_CAT','RV3_CAT','CATEGORY'];
  fixSrc.forEach(r => {
    // find which fix round this record corresponds to for this tech
    let rCat = parseInt(r.category || r.CATEGORY || 0);
    for (let i=1;i<=5;i++){
      const fid=(r._raw?.[`FIX${i}_ID`]||'').trim().toUpperCase();
      if(fid===techId){ rCat=parseInt(r._raw?.[fixCatCols[i]]||r._raw?.['CATEGORY']||r.category||0); break; }
    }
    const rVal = getCatGsdValue(rCat, gsd);
    const pts  = rVal * (isIR ? cs.irModifierValue : 1);
    if (!catMap[rCat]) catMap[rCat] = { count:0, totalPts:0, unitVal:rVal };
    catMap[rCat].count++;
    catMap[rCat].totalPts += pts;
  });
  const fixPtsTotal = Object.values(catMap).reduce((s,v)=>s+v.totalPts,0);

  // RV points broken down RV1 vs RV2+
  const rvSrc = (tech._src?.rv || []);
  let rv1count=0, rv2count=0, rv1pts=0, rv2pts=0;
  rvSrc.forEach(r => {
    const rid = (r._raw?.RV1_ID||'').trim().toUpperCase();
    if (rid===techId) { rv1count++; rv1pts += isIR?cs.points.rv1_combo:cs.points.rv1; }
    else              { rv2count++; rv2pts += cs.points.rv2; }
  });
  const rvPtsTotal = rv1pts + rv2pts;

  // Bonus tier table — show only active tier ±3 context rows (no endless scrolling)
  const activeTierIdx = S.bonusTiers.findIndex(t => qp >= t.quality);
  const CONTEXT = 3; // rows above and below active
  const lo = Math.max(0, activeTierIdx - CONTEXT);
  const hi = Math.min(S.bonusTiers.length - 1, activeTierIdx + CONTEXT);
  const tierRows = S.bonusTiers.slice(lo, hi + 1).map((tier, sliceI) => {
    const i = lo + sliceI;
    const active = i === activeTierIdx;
    const bg = active ? 'background:rgba(5,150,105,0.12);' : (sliceI%2===0?'':'background:rgba(0,0,0,0.02);');
    const fw = active ? 'font-weight:700;' : 'color:var(--text-muted);';
    return `<tr style="${bg}${fw}">
      <td style="padding:5px 8px;">≥ ${tier.quality}%</td>
      <td style="padding:5px 8px;font-family:'JetBrains Mono',monospace;color:${active?'var(--green)':''};">${(tier.bonus*100).toFixed(0)}%</td>
      <td style="padding:5px 8px;">${active?`<b style="color:var(--green);">← your QP ${qp.toFixed(2)}% lands here</b>`:''}</td>
    </tr>`;
  }).join('');
  // Ellipsis hints if there are hidden rows
  const topEllipsis = lo > 0
    ? `<tr><td colspan="3" style="padding:3px 8px;font-size:0.68rem;color:var(--text-light);text-align:center;">… ${lo} higher tier${lo>1?'s':''} above …</td></tr>` : '';
  const botEllipsis = hi < S.bonusTiers.length - 1
    ? `<tr><td colspan="3" style="padding:3px 8px;font-size:0.68rem;color:var(--text-light);text-align:center;">… ${S.bonusTiers.length-1-hi} lower tier${S.bonusTiers.length-1-hi>1?'s':''} below …</td></tr>` : '';

  // ── SECTION 0: Identity ───────────────────────────────────
  const sec0 = _detailSection('🪪','Tech Identity','var(--text-muted)','', `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 24px;">
      ${_kv('Tech ID',   `<b style="font-family:'JetBrains Mono',monospace;color:var(--accent)">${techId}</b>`, 'var(--text)')}
      ${_kv('Full Name', tech.name||'—',  'var(--text)')}
      ${_kv('Team',      tech.team||'—',  'var(--text-muted)')}
      ${_kv('Team #',    tech.teamNum||'—','var(--text-muted)')}
      ${_kv('Month',     tech.month||'—', 'var(--text-muted)')}
      ${_kv('GSD',       gsd,             'var(--text-muted)', 'Used for all fix point lookups')}
      ${_kv('Block Type',isIR?_badge('IR','var(--amber)'):_badge('Non-IR','var(--border)','var(--text-muted)'), 'var(--text)', isIR?'RV1 rate and IR modifier apply':'')}
    </div>`);

  // ── SECTION 1: Task counts summary ───────────────────────
  const sec1 = _detailSection('📋','Task Counts — What This Tech Did','var(--accent)',
    'Each task type earns points at different rates', `
    <div style="font-size:0.71rem;color:var(--text-muted);margin-bottom:10px;line-height:1.5;">
      A tech can earn from multiple task types in the same project period. The counts below come directly from the DBF records where this tech ID appears in the corresponding column.
    </div>
    ${_kv('Initial Tags (QC_ID)',   `${tech.initial} tasks`,  'var(--accent)',
      `This tech appears as QC_ID on ${tech.initial} rows. Each earns ${cs.points.qc} pts flat.`)}
    ${_kv('  → Points',            `${tech.initial} × ${cs.points.qc} = <b>${qcPts.toFixed(4)}</b>`, 'var(--accent)', '', false)}
    ${_kv('i3QA Reviews (I3QA_ID)',`${tech.i3qa} tasks`,     '#8b5cf6',
      `Appears as I3QA_ID on ${tech.i3qa} rows. Each earns 1/12 of a point.`)}
    ${_kv('  → Points',            `${tech.i3qa} × ${cs.points.i3qa.toFixed(6)} = <b>${i3qaPts.toFixed(4)}</b>`, '#8b5cf6', '', false)}
    ${_kv('Fix Tasks (FIX1–5_ID)', `${tech.fix} tasks`,      'var(--green)',
      `Appears as a fix tech on ${tech.fix} rows across rounds 1–5. Value depends on category + GSD${isIR?' + IR modifier':''}.`)}
    ${_kv('  → Points (see cat breakdown below)', `<b>${fixPtsTotal.toFixed(4)}</b>`, 'var(--green)', '', false)}
    ${_kv('RV Tasks (RV1–4_ID)',   `${tech.rv} tasks`,       'var(--amber)',
      `RV1: ${rv1count} tasks × ${isIR?cs.points.rv1_combo:cs.points.rv1} = ${rv1pts.toFixed(4)} | RV2+: ${rv2count} tasks × ${cs.points.rv2} = ${rv2pts.toFixed(4)}`)}
    ${_kv('  → Points',            `<b>${rvPtsTotal.toFixed(4)}</b>`, 'var(--amber)', '', false)}
    <div style="border-top:2px solid var(--border);margin-top:8px;padding-top:8px;">
      ${_kv('Missed / Rework (as QC_ID)', `${tech.missed}`, tech.missed>0?'var(--red)':'var(--text-muted)',
        `Times this tech\'s initial tag was later marked as a miss. Does NOT deduct points directly — but raises quality concern.`)}
      ${_kv('Refix tasks', tech.refix, tech.refix>0?'var(--red)':'var(--text-muted)',
        `Records where this tech\'s fix was sent back. Counted in the Fix Quality % denominator (lowers QP%).`)}
      ${_kv('Warnings', tech.warn, tech.warn>0?'var(--amber)':'var(--text-muted)',
        `RV label matched a warning pattern on this tech\'s fix. Also counted in denominator.`)}
    </div>
    ${_formulaBox(`Sub-total (before deductions) = ${qcPts.toFixed(4)} + ${i3qaPts.toFixed(4)} + ${fixPtsTotal.toFixed(4)} + ${rvPtsTotal.toFixed(4)} = ${(tech.pointsRaw||tech.points).toFixed(4)}`)}
    ${(tech.drDeduct||0)+(tech.drqDeduct||0) < 0 ? `
    <div style="margin-top:10px;background:rgba(220,38,38,0.07);border:1px solid var(--red);border-radius:8px;padding:12px 14px;">
      <div style="font-size:0.72rem;font-weight:700;color:var(--red);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;">⚠ Penalty Deductions Applied</div>
      ${(tech.drDeduct||0)<0?`<div style="display:flex;justify-content:space-between;font-size:0.76rem;padding:3px 0;border-bottom:1px solid rgba(220,38,38,0.15);">
        <span style="color:var(--text-muted);">i3 DR Penalty (QC tech) — ${tech.drRule?.level||''} — ${tech.egregiousMissedCount} egregious missed rows ≥ ${tech.drRule?.min} threshold</span>
        <span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--red);">${tech.drDeduct} pts</span>
      </div>`:''}
      ${(tech.drqDeduct||0)<0?`<div style="display:flex;justify-content:space-between;font-size:0.76rem;padding:3px 0;border-bottom:1px solid rgba(220,38,38,0.15);">
        <span style="color:var(--text-muted);">i3QA DRQ Penalty (i3QA tech) — ${tech.drqRule?.level||''} — ${tech.egregiousDrqCount} egregious DRQ rows ≥ ${tech.drqRule?.min} threshold</span>
        <span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--red);">${tech.drqDeduct} pts</span>
      </div>`:''}
      <div style="display:flex;justify-content:space-between;font-size:0.78rem;padding:5px 0;margin-top:2px;">
        <span style="font-weight:700;">Total deduction:</span>
        <span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--red);">${((tech.drDeduct||0)+(tech.drqDeduct||0))} pts</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:0.82rem;padding:5px 0;border-top:2px solid rgba(220,38,38,0.3);margin-top:2px;">
        <span style="font-weight:700;">Net Total Points (after deductions):</span>
        <span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--red);font-size:0.9rem;">${tech.points.toFixed(4)}</span>
      </div>
    </div>` : _formulaBox(`Net Total Points = ${tech.points.toFixed(4)} (no deductions applied ✓)`)}`);

  // ── SECTION 2: Fix breakdown by category ─────────────────
  const fixCatRows = Object.keys(catMap).sort((a,b)=>+a-+b).map((c,i)=>{
    const d=catMap[c];
    const bg = i%2===0?'':'background:rgba(0,0,0,0.02);';
    return `<tr style="${bg}">
      <td style="padding:6px 10px;">Cat ${c}</td>
      <td style="padding:6px 10px;font-family:'JetBrains Mono',monospace;">${d.unitVal}</td>
      ${isIR?`<td style="padding:6px 10px;font-family:'JetBrains Mono',monospace;color:var(--amber);">${(d.unitVal*(cs.irModifierValue)).toFixed(4)}</td>`:''}
      <td style="padding:6px 10px;text-align:center;">${d.count}</td>
      <td style="padding:6px 10px;text-align:right;font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--green);">${d.totalPts.toFixed(4)}</td>
    </tr>`;
  }).join('');

  const sec2 = _detailSection('🗂️','Fix Points by Category','var(--green)',
    `GSD: ${gsd}${isIR?` · IR ×${cs.irModifierValue}`:''}`, fixCatRows.length ? `
    <div style="font-size:0.71rem;color:var(--text-muted);margin-bottom:10px;">
      Fix point value = <b>Cat lookup value @ ${gsd}</b>${isIR?` × <b>${cs.irModifierValue}</b> IR modifier`:''}.
      Higher-numbered categories represent less severe errors and earn fewer points.
      This table shows exactly how many fixes this tech did in each category and what each was worth.
    </div>
    <div style="overflow-x:auto;border-radius:8px;border:1px solid var(--border);">
      <table style="width:100%;border-collapse:collapse;font-size:0.75rem;">
        <thead><tr style="background:var(--header-bg);color:var(--header-text);">
          <th style="padding:7px 10px;text-align:left;">Category</th>
          <th style="padding:7px 10px;text-align:left;">Unit Value @ ${gsd}</th>
          ${isIR?`<th style="padding:7px 10px;text-align:left;">After IR Mod</th>`:''}
          <th style="padding:7px 10px;text-align:center;">Count</th>
          <th style="padding:7px 10px;text-align:right;">Subtotal pts</th>
        </tr></thead>
        <tbody>${fixCatRows}</tbody>
        <tfoot>
          <tr style="background:var(--surface2);border-top:2px solid var(--border);font-weight:700;">
            <td colspan="${isIR?3:2}" style="padding:7px 10px;">Total Fix Points</td>
            <td style="padding:7px 10px;text-align:center;">${tech.fix}</td>
            <td style="padding:7px 10px;text-align:right;font-family:'JetBrains Mono',monospace;color:var(--green);">${fixPtsTotal.toFixed(4)}</td>
          </tr>
        </tfoot>
      </table>
    </div>` : `<div style="color:var(--text-muted);font-size:0.76rem;">No fix source records found — fix point detail unavailable.</div>`);

  // ── SECTION 3: Fix Quality % ──────────────────────────────
  const sec3 = _detailSection('📊','Fix Quality % Calculation',qpColor,
    'Determines which bonus tier you land in', `
    <div style="font-size:0.71rem;color:var(--text-muted);margin-bottom:10px;line-height:1.5;">
      Fix Quality % measures how "clean" the tech's fix work was. Every refix (a fix that had to be redone)
      and every warning from the reviewer hurts this percentage. <b>100% = zero refixes and zero warnings.</b>
    </div>
    ${_kv('✅ Clean Fix count',    tech.fix,   'var(--green)',  'Rows where this tech fixed without issue')}
    ${_kv('🔁 + Refix count',     tech.refix, tech.refix>0?'var(--red)':'var(--text-muted)', 'Fix was rejected and had to be redone → added to denominator')}
    ${_kv('⚠ + Warning count',    tech.warn,  tech.warn>0?'var(--amber)':'var(--text-muted)', 'Reviewer flagged a problem → added to denominator')}
    ${_kv('= Denominator',        denom,      'var(--text)',   'Total of all fix-related events')}
    ${_formulaBox(`Fix Quality % = ${tech.fix} ÷ ${denom} = <b>${qp.toFixed(4)}%</b>`)}
    <div style="margin-top:12px;border-top:1px solid var(--border-light);padding-top:10px;">
      <div style="font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-muted);margin-bottom:8px;">Bonus Tier — where does ${qp.toFixed(2)}% land? <span style="font-weight:400;color:var(--text-light);">(showing ±3 tiers around your position)</span></div>
      <table style="width:100%;border-collapse:collapse;font-size:0.74rem;border-radius:7px;overflow:hidden;border:1px solid var(--border);">
        <thead><tr style="background:var(--header-bg);color:var(--header-text);">
          <th style="padding:6px 10px;text-align:left;">QP % Threshold</th>
          <th style="padding:6px 10px;text-align:left;">Bonus Earned %</th>
          <th style="padding:6px 10px;text-align:left;">Status</th>
        </tr></thead>
        <tbody>${topEllipsis}${tierRows}${botEllipsis}</tbody>
      </table>
      ${threshApplied ? `<div style="margin-top:6px;padding:6px 10px;background:rgba(5,150,105,0.1);border-radius:6px;border-left:3px solid var(--green);font-size:0.71rem;color:var(--green);">
        ★ <b>Threshold Override Active:</b> a minimum threshold bonus was applied instead of the tier value.
      </div>` : ''}
    </div>`);

  // ── SECTION 4: Bonus payout ───────────────────────────────
  // Always read the live multiplier from the tech object (updated by recalcBonus())
  // so the modal matches exactly what the table shows
  const liveMult      = tech.bonusMultiplier ?? tech.bonusMult ?? currentBonusMultiplier;
  const liveBaseBonus = tech.baseBonus  || 0;
  const liveTotalBonus= tech.totalBonus || 0;

  // Recompute from scratch to verify they match (catches any stale snapshot)
  const recomputedBase  = threshApplied
    ? tech.points * (getThresholdBonus(qp) / 100)
    : tech.points * (qualMod / 100);
  const recomputedTotal = recomputedBase * liveMult;
  const drift = Math.abs(recomputedTotal - liveTotalBonus) > 0.0001;

  const sec4 = _detailSection('💵','Bonus Payout Calculation','var(--green)',
    'Step-by-step from raw points to PHP bonus', `
    <div style="font-size:0.71rem;color:var(--text-muted);margin-bottom:12px;line-height:1.5;">
      The bonus is calculated in <b>three steps</b>:<br>
      ① Sum all raw task points → ② multiply by the Bonus Earned % (from Fix Quality tier) → ③ multiply by the PHP payout multiplier.<br>
      The breakdown below is <b>live</b> — it matches exactly what the Payout w/ Mult column shows in the table.
    </div>

    ${_kv('Step 1 — Total Raw Points', tech.points.toFixed(4), 'var(--accent)',
      `QC ${qcPts.toFixed(4)} + i3QA ${i3qaPts.toFixed(4)} + Fix ${fixPtsTotal.toFixed(4)} + RV ${rvPtsTotal.toFixed(4)}`)}

    ${_kv('Step 2 — Bonus Earned %',
      `${qualMod}%&nbsp;${threshApplied ? _badge('★ Threshold override','var(--green)') : _badge('from tier table','var(--border)','var(--text-muted)')}`,
      threshApplied ? 'var(--green)' : 'var(--accent)',
      threshApplied
        ? `Threshold floor active — your QP of ${qp.toFixed(2)}% triggered a guaranteed minimum bonus % instead of the standard tier`
        : `QP ${qp.toFixed(2)}% falls into the ≥${S.bonusTiers.find(t=>qp>=t.quality)?.quality??'?'}% tier → ${qualMod}% bonus earned`, false)}

    ${_kv('  → Base Bonus  (Points × Bonus% ÷ 100)',
      `${tech.points.toFixed(4)} × ${qualMod} ÷ 100 = <b>${liveBaseBonus.toFixed(4)}</b>`,
      'var(--accent)', 'This is "Payout w/o Mult" column in the table', false)}

    <div style="margin:10px 0;padding:10px 14px;background:var(--blue-light);border-radius:8px;border:1px solid var(--border);">
      <div style="font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-muted);margin-bottom:6px;">Step 3 — PHP Payout Multiplier</div>
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
        <div style="font-size:0.76rem;color:var(--text-muted);line-height:1.5;">
          Set from the <b>SQM bracket table</b> (loaded when project is imported) or overridden manually in the
          <b>Payout Calculator</b> panel. This value multiplies the base bonus to convert points into PHP payout.
          <br><span style="color:var(--accent);font-size:0.69rem;">Current multiplier shown here = the one applied to the table right now.</span>
        </div>
        <div style="text-align:center;min-width:80px;">
          <div style="font-size:0.68rem;color:var(--text-muted);margin-bottom:2px;">Multiplier</div>
          <div style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:1.3rem;color:var(--accent);">×${liveMult.toFixed(2)}</div>
          <div style="font-size:0.66rem;color:var(--text-muted);margin-top:1px;">SQM: ${importSettings.sqm||'—'}</div>
        </div>
      </div>
    </div>

    <div style="background:${drift?'rgba(239,68,68,0.08)':'rgba(5,150,105,0.08)'};border:2px solid ${drift?'var(--red)':'var(--green)'};border-radius:10px;padding:14px 16px;margin-top:4px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;">
        <div>
          <div style="font-weight:700;font-size:0.9rem;color:${drift?'var(--red)':'var(--green)'};">
            ${drift ? '⚠ Calculation mismatch detected' : '✅ Verified — matches table exactly'}
          </div>
          <div style="font-size:0.7rem;color:var(--text-muted);margin-top:3px;line-height:1.5;">
            Points × Multiplier × (Bonus% ÷ 100)<br>
            <span style="font-family:'JetBrains Mono',monospace;color:var(--text);">
              ${tech.points.toFixed(4)} × ${liveMult.toFixed(2)} × (${qualMod} ÷ 100)
            </span>
          </div>
          ${drift ? `<div style="font-size:0.68rem;color:var(--red);margin-top:4px;">
            Table shows ${liveTotalBonus.toFixed(4)} but formula gives ${recomputedTotal.toFixed(4)} — try recalculating.
          </div>` : ''}
        </div>
        <div style="text-align:right;min-width:120px;">
          <div style="font-size:0.68rem;color:var(--text-muted);margin-bottom:3px;">Final Payout (PHP)</div>
          <div style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:1.5rem;color:${drift?'var(--red)':'var(--green)'};">${liveTotalBonus.toFixed(4)}</div>
          <div style="font-size:0.64rem;color:var(--text-muted);margin-top:2px;">"Payout w/ Mult" column</div>
        </div>
      </div>
    </div>

    <div style="margin-top:10px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center;">
      <div style="background:var(--surface2);border-radius:8px;padding:8px;border:1px solid var(--border);">
        <div style="font-size:0.63rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;">Raw Points</div>
        <div style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:0.9rem;color:var(--accent);margin-top:2px;">${tech.points.toFixed(4)}</div>
      </div>
      <div style="background:var(--surface2);border-radius:8px;padding:8px;border:1px solid var(--border);">
        <div style="font-size:0.63rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;">Base Bonus (no mult)</div>
        <div style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:0.9rem;color:var(--accent);margin-top:2px;">${liveBaseBonus.toFixed(4)}</div>
      </div>
      <div style="background:rgba(5,150,105,0.1);border-radius:8px;padding:8px;border:2px solid var(--green);">
        <div style="font-size:0.63rem;color:var(--green);text-transform:uppercase;letter-spacing:0.05em;font-weight:700;">✅ Final PHP Payout</div>
        <div style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:1.1rem;color:var(--green);margin-top:2px;">₱ ${liveTotalBonus.toFixed(4)}</div>
        <div style="font-size:0.6rem;color:var(--text-light);margin-top:1px;">Points × ${liveMult.toFixed(2)} × ${qualMod}%</div>
      </div>
    </div>`);

  // Add a prominent final calculation banner below all sections
  const secFinal = `<div style="margin-top:14px;padding:16px 20px;background:linear-gradient(135deg,rgba(5,150,105,0.12),rgba(14,165,233,0.08));border:2px solid var(--green);border-radius:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
    <div>
      <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--green);margin-bottom:4px;">📊 Final Calculation Summary</div>
      <div style="font-size:0.76rem;color:var(--text-muted);line-height:1.6;font-family:'JetBrains Mono',monospace;">
        ${tech.points.toFixed(4)} pts
        &nbsp;×&nbsp;${liveMult.toFixed(2)} (mult)
        &nbsp;×&nbsp;(${qualMod}% ÷ 100)
        &nbsp;=&nbsp;<b style="color:var(--green);">₱ ${liveTotalBonus.toFixed(4)}</b>
      </div>
      <div style="font-size:0.66rem;color:var(--text-light);margin-top:3px;">
        Multiplier from Payout Calculator panel · Quality% from Fix Quality tier table
      </div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:0.68rem;color:var(--text-muted);margin-bottom:2px;">Payout w/ Mult</div>
      <div style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:2rem;color:var(--green);line-height:1;">₱ ${liveTotalBonus.toFixed(4)}</div>
      <div style="font-size:0.64rem;color:var(--text-muted);margin-top:2px;">PHP</div>
    </div>
  </div>`;

  document.getElementById('td-title').textContent = `${tech.name || techId}  (${techId})`;
  document.getElementById('td-subtitle').textContent =
    `${tech.team||'—'}  ·  Team ${tech.teamNum||'—'}  ·  ${tech.month||''}  ·  GSD: ${gsd}  ·  ${isIR?'IR':'Non-IR'}`;
  document.getElementById('td-body').innerHTML = sec0 + sec1 + sec2 + sec3 + sec4 + secFinal;
  document.getElementById('tech-detail-modal').classList.add('show');
}

// ── Startup: open IndexedDB and populate the project list ──────
openDB().then(refreshProjectList).catch(console.error);
