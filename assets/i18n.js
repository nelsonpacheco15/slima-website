/* Slima — minimal client-side i18n.
   Toggle EN ↔ Traditional Chinese (zh-Hant) for elements with [data-i18n].
   Persists in localStorage.slimaLang. */
(function () {
  'use strict';

  const dict = {
    en: {
      // Nav
      'nav.writing': 'Writing Studio',
      'nav.beta':    'Beta Readers',
      'nav.script':  'Script Studio',
      'nav.plans':   'Plans',
      'nav.login':   'Log in',
      'nav.cta':     'Try Slima',

      // Promo
      'promo.text':  'New: Beta Reader feedback engine — get structured edits on every chapter.',
      'promo.cta':   'Try it free →',

      // Hero (homepage)
      'home.hero.h1.line1': 'Where books',
      'home.hero.h1.line2': 'get finished.',
      'home.hero.cta':      'Get Started',

      // Genre carousel
      'home.genre.eyebrow': 'For every kind of book',
      'home.genre.h2':      'Start where your story lives.',

      // Features
      'home.features.eyebrow': 'The Slima Ecosystem',
      'home.features.h2':      'Everything you need to finish your book.',
      'home.features.lead':    'A writing environment that keeps your full manuscript in memory. Every note, draft, and fragment stays connected.',

      // Testimonials section header
      'home.t.eyebrow':  'From writers using Slima',
      'home.t.h2.a':     'Writers who didn’t',
      'home.t.h2.b':     'start over.',

      // Real testimonials — every quote is from Weston, the only verified
      // Slima reviewer. One distinct quote per page; same person never
      // duplicated on the same page.
      't.weston.name':       'Weston',
      't.weston.role':       'Writer · ACE',
      // Homepage / Plan — universal Slima compliment
      't.weston1':           '"This piece had been bothering me for ages — but once Slima understood what I was trying to say, the suggested edits never veered off. Superb."',
      't.weston.bothering':  '"This piece had been bothering me for ages — but once Slima understood what I was trying to say, the suggested edits never veered off. Superb."',
      // Writing Studio — about the writing experience
      't.weston.today':      '"Today’s experience was really great — I went back and revised a whole batch of recently-published pieces. My ability as an author may be limited, but my readers’ taste is on point. ✌"',
      // Beta Reader — about the reader-feedback reports
      't.weston.reports':    '"The reader-feedback reports are fascinating — I’m still working up the nerve to swallow them whole. As a writing newbie, the Kindle data makes me want to chase a perfect score. The editor’s notes feel honest — readers can be brutal."',
      // Script Studio — early-Notion-AI compliment
      't.weston.notion':     '"Love this — reminds me of the early Notion AI days. But the suggestions actually keep my voice."',

      // CTA strip
      'cta.h2.a':   'Stop starting over.',
      'cta.h2.b':   'Start finishing.',
      'cta.lead':   'Join writers using Slima to keep their manuscripts moving — across sessions, across drafts, across years.',
      'cta.btn':    'Start writing free',
      'cta.timer':  'Free forever plan · No credit card required',

      // Writing Studio page
      'ws.hero.eyebrow':    'The Writing Studio',
      'ws.hero.h1.a':       'The studio',
      'ws.hero.h1.b':       'writers',
      'ws.hero.h1.c':       'come back to.',
      'ws.tour.h2.a':       'Your manuscript, on a page',
      'ws.tour.h2.b':       'that knows what to do.',
      'ws.trio.h2.a':       'Three things that change',
      'ws.trio.h2.b':       'how writing feels.',
      'ws.trio.card1.h':    'Your project.',
      'ws.trio.card2.h':    'Memory that travels with you.',
      'ws.trio.card2.p':    'Open Slima on any device — your manuscript, notes, and the AI’s understanding of your story are already there. No re-uploading. No re-explaining.',
      'ws.trio.card3.h':    'Every save is a checkpoint.',
      'ws.memory.h2':       'Slima sees and understands your whole book.',
      'ws.mosaic.h2.a':     'The studio for you to',
      'ws.mosaic.h2.b':     'get work done.',

      // Beta Reader page
      'br.hero.eyebrow':    'AI Beta Readers',
      'br.tour.h2.a':       'Scores. Quotes. A heatmap.',
      'br.tour.h2.b':       'Things you can fix.',
      'br.stats.eyebrow':   '~3 min',
      'br.stats.lbl':       'From submit to delivered',
      'br.stats.sub':       'Most reports finish in three minutes or less.',

      // Script Studio page
      'ss.hero.eyebrow':    'Script Studio',
      'ss.hero.h1.a':       'Screenplay',
      'ss.hero.h1.b':       'made easy.',
      'ss.features.h2.a':   'The studio to',
      'ss.features.h2.b':   'get work done.',

      // Plans page
      'pl.hero.eyebrow':    'Plans & Pricing',
    },

    zh: {
      'nav.writing': '寫作工作室',
      'nav.beta':    'Beta 讀者',
      'nav.script':  '劇本工作室',
      'nav.plans':   '方案',
      'nav.login':   '登入',
      'nav.cta':     '試用 Slima',

      'promo.text':  '全新 Beta 讀者回饋引擎 — 每一章都能獲得結構化修訂建議。',
      'promo.cta':   '免費試用 →',

      'home.hero.h1.line1': '書本',
      'home.hero.h1.line2': '在這裡完成。',
      'home.hero.cta':      '開始使用',

      'home.genre.eyebrow': '為每一種書而生',
      'home.genre.h2':      '從你故事所在的地方開始。',

      'home.features.eyebrow': 'Slima 生態系',
      'home.features.h2':      '完成你的書，所需的一切。',
      'home.features.lead':    '一個能完整記住你手稿的寫作環境。每一則筆記、每一份草稿、每一段片段，都緊緊相連。',

      'home.t.eyebrow':  '正在使用 Slima 的作者',
      'home.t.h2.a':     '不再從頭開始的',
      'home.t.h2.b':     '作者們。',

      // 真實使用者 Weston 的原始留言。每頁只放一句，不重複同一頁。
      't.weston.name':       '魏斯頓',
      't.weston.role':       '作者 · ACE',
      't.weston1':           '「這篇真的困擾我很久了～但是史萊姆了解我的想法後給出的修正都不會歪掉～超棒」',
      't.weston.bothering':  '「這篇真的困擾我很久了～但是史萊姆了解我的想法後給出的修正都不會歪掉～超棒」',
      't.weston.today':      '「今天使用上的體感真的好棒，我把近期發表的文章改了一輪～顯示我身為作者能力有限，但讀者的審美在線。✌」',
      't.weston.reports':    '「讀者回饋的報告很有趣，但我還在努力說服自己吞下去 XDD。Kindle 數據表現也好好玩（身為寫作小白，會有種想挑戰滿分的衝動）。編輯來信給的回饋蠻中肯的～不像讀者都很賤。」',
      't.weston.notion':     '「好喜歡這個，想到之前的 Notion AI — 但 Slima 的建議真的不會把我的語氣帶偏。」',

      'cta.h2.a':   '別再從頭開始。',
      'cta.h2.b':   '開始完成它。',
      'cta.lead':   '加入正使用 Slima 推進手稿的作者們 — 跨越每一次寫作、每一份草稿、每一年。',
      'cta.btn':    '免費開始寫作',
      'cta.timer':  '永久免費方案 · 不需信用卡',

      'ws.hero.eyebrow':    '寫作工作室',
      'ws.hero.h1.a':       '作者們',
      'ws.hero.h1.b':       '一再回來的',
      'ws.hero.h1.c':       '工作室。',
      'ws.tour.h2.a':       '你的手稿，在一頁',
      'ws.tour.h2.b':       '懂得該怎麼做的紙上。',
      'ws.trio.h2.a':       '改變寫作感受的',
      'ws.trio.h2.b':       '三件事。',
      'ws.trio.card1.h':    '你的專案。',
      'ws.trio.card2.h':    '隨身攜帶的記憶。',
      'ws.trio.card2.p':    '在任何裝置打開 Slima — 你的手稿、筆記，以及 AI 對故事的理解都已經在裡面。不必重新上傳，也不必再解釋一次。',
      'ws.trio.card3.h':    '每一次存檔，都是一個檢查點。',
      'ws.memory.h2':       'Slima 看見並理解你的整本書。',
      'ws.mosaic.h2.a':     '為你打造的工作室，',
      'ws.mosaic.h2.b':     '專心完成作品。',

      'br.hero.eyebrow':    'AI Beta 讀者',
      'br.tour.h2.a':       '評分、引述、熱區圖。',
      'br.tour.h2.b':       '你可以修正的事。',
      'br.stats.eyebrow':   '約 3 分鐘',
      'br.stats.lbl':       '從送出到完成',
      'br.stats.sub':       '多數報告在三分鐘內完成。',

      'ss.hero.eyebrow':    '劇本工作室',
      'ss.hero.h1.a':       '寫劇本',
      'ss.hero.h1.b':       '輕鬆上手。',
      'ss.features.h2.a':   '為你打造的工作室，',
      'ss.features.h2.b':   '專心完成作品。',

      'pl.hero.eyebrow':    '方案與價格',
    }
  };

  const KEY = 'slimaLang';

  function getLang() {
    const saved = localStorage.getItem(KEY);
    if (saved === 'en' || saved === 'zh') return saved;
    return 'en';
  }

  function setLang(lang) {
    if (lang !== 'en' && lang !== 'zh') return;
    localStorage.setItem(KEY, lang);
    apply(lang);
  }

  function apply(lang) {
    const d = dict[lang] || dict.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (d[key] != null) el.textContent = d[key];
    });
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-Hant' : 'en');
    // Update toggle UI
    document.querySelectorAll('.lang-toggle').forEach(t => {
      const en = t.querySelector('.lang-en');
      const zh = t.querySelector('.lang-zh');
      if (en) en.classList.toggle('is-active', lang === 'en');
      if (zh) zh.classList.toggle('is-active', lang === 'zh');
    });
  }

  function init() {
    apply(getLang());
    document.querySelectorAll('.lang-toggle').forEach(t => {
      t.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target.closest('.lang');
        if (target && target.classList.contains('lang-en')) {
          setLang('en');
        } else if (target && target.classList.contains('lang-zh')) {
          setLang('zh');
        } else {
          setLang(getLang() === 'en' ? 'zh' : 'en');
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for debugging
  window.SlimaI18n = { setLang, getLang, dict };
})();
