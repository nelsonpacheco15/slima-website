/* Slima — interactive marketing-page mockups.
   Vanilla, no deps. Page-detected via wrapper presence.
   Respects prefers-reduced-motion. */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── helpers ───────────────────────────────────────────
  function setActive(siblings, target, cls) {
    siblings.forEach(el => el.classList.remove(cls));
    if (target) target.classList.add(cls);
  }
  function whenVisible(el, fn) {
    let done = false;
    const fire = () => { if (done) return; done = true; fn(); cleanup(); };
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.top < vh * 0.85 && r.bottom > vh * 0.15) fire();
    };
    let io = null;
    function cleanup() {
      window.removeEventListener('scroll', onScroll);
      if (io) io.disconnect();
    }
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(es => {
        es.forEach(e => { if (e.isIntersecting) fire(); });
      }, { threshold: 0.2 });
      io.observe(el);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();  // check immediately in case already in view
  }

  // ══════════════════════════════════════════════════════
  // WRITING STUDIO
  // ══════════════════════════════════════════════════════
  function initWritingStudio() {
    // Desktop editor — chapter rail swaps tab + body
    const wsMock = document.querySelector('.ws-mock');
    if (wsMock) {
      const sideRows = wsMock.querySelectorAll('.side .row.indent');
      const tab = wsMock.querySelector('.main .tabbar .tab.active');
      const body = wsMock.querySelector('.main .body');
      const wc = wsMock.querySelector('.main .toolbar .wc');
      if (body && sideRows.length) {
        const initialBody = body.innerHTML;
        const initialTab = tab ? tab.textContent : '';
        const initialWc = wc ? wc.textContent : '';
        const swaps = {
          'Prologue': {
            body: '<p>The lighthouse keeper kept a daughter, and the daughter kept the night. Three generations of Halberg women had counted the boats; only Eleanor counted them out loud.</p><p>This is a story about how the counting became a habit, and the habit became a vocation, and the vocation became a small, unfinished argument between Eleanor and the sea.</p>',
            wc: '820 WORDS'
          },
          'I. Salt & Iron': {
            body: '<p>The salt got into everything. Eleanor learned this the way you learn the names of the bones in your own hand: slowly, and then all at once, by waking with one of them swollen.</p><p>Mr. Halberg pretended to be patient about it. Patience, she would later understand, was the only weather he had.</p>',
            wc: '2,144 WORDS'
          },
          'VII. A Lamp…': { body: initialBody, wc: initialWc },
          'VIII. (drafted)': {
            body: '<p>(Draft.) The boat returned at the hour Eleanor had stopped expecting it. She did not write down the names of the men who came back. She wrote down the names of the men who did not.</p><p>Mr. Halberg lit the lamp anyway, because the lamp was a thing you lit whether anyone was coming home or not. <em>That,</em> he said, <em>is the whole job.</em></p>',
            wc: '412 WORDS'
          }
        };
        sideRows.forEach(row => {
          row.style.cursor = 'pointer';
          row.addEventListener('click', () => {
            setActive(sideRows, row, 'active');
            const txt = row.textContent.replace(/^[^A-Za-zÀ-ÿ0-9]+/, '').trim();
            const key = Object.keys(swaps).find(k => txt.startsWith(k));
            if (!key) return;
            body.innerHTML = swaps[key].body;
            if (tab) tab.textContent = key + ' ×';
            if (wc) wc.textContent = swaps[key].wc;
          });
        });
      }
    }

    // Dual-pane tour — bottom-nav tab toggles
    document.querySelectorAll('.dual-mock .slima-app').forEach(app => {
      const items = app.querySelectorAll('.sa-nav .item');
      items.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => setActive(items, item, 'is-active'));
      });
    });

    // Mobile fallback nav highlighting
    document.querySelectorAll('.slima-mobile-only .sa-nav').forEach(nav => {
      const items = nav.querySelectorAll('.item');
      items.forEach(it => {
        it.style.cursor = 'pointer';
        it.addEventListener('click', () => setActive(items, it, 'is-active'));
      });
    });

    // Chat mock — scripted message reveal on view
    const chat = document.querySelector('.chat-mock');
    if (chat) {
      const msgs = chat.querySelectorAll('.chat-msg');
      if (!reduceMotion && msgs.length) {
        msgs.forEach(m => m.classList.add('cm-pending'));
        whenVisible(chat, () => {
          let delay = 200;
          msgs.forEach((m, i) => {
            setTimeout(() => m.classList.add('cm-shown'), delay);
            delay += (m.classList.contains('coach') ? 900 : 600);
          });
        });
      }
    }
  }

  // ══════════════════════════════════════════════════════
  // SCRIPT STUDIO
  // ══════════════════════════════════════════════════════
  function initScriptStudio() {
    // Desktop scene editor — click scene head to focus
    const ssMock = document.querySelector('.ss-mock');
    if (ssMock) {
      const scenes = ssMock.querySelectorAll('.scenes .scene');
      const titleEl = ssMock.querySelector('.topbar .title');
      const initialTitle = titleEl ? titleEl.textContent : '';
      scenes.forEach(s => {
        const head = s.querySelector('.head');
        if (!head) return;
        head.style.cursor = 'pointer';
        head.addEventListener('click', () => {
          if (s.classList.contains('is-focused')) {
            scenes.forEach(x => x.classList.remove('is-focused'));
            if (titleEl) titleEl.textContent = initialTitle;
            return;
          }
          setActive(scenes, s, 'is-focused');
          const loc = s.querySelector('.head .loc');
          const day = s.querySelector('.head .day');
          if (titleEl && loc) {
            titleEl.textContent = `The Last Ferry · ${loc.textContent}${day ? ' ' + day.textContent : ''}`;
          }
        });
      });
    }

    // Writers' Room
    const ssRoom = document.querySelector('.ss-room');
    if (ssRoom) {
      // Episode list
      const eps = ssRoom.querySelectorAll('.ss-room-season ul li');
      eps.forEach(li => {
        li.style.cursor = 'pointer';
        li.addEventListener('click', () => setActive(eps, li, 'active'));
      });

      // Filter pills → dim non-matching storylines
      const filters = ssRoom.querySelectorAll('.ss-room-toolbar .filter');
      const lines = ssRoom.querySelectorAll('.ss-line');
      filters.forEach(f => {
        f.style.cursor = 'pointer';
        f.addEventListener('click', () => {
          setActive(filters, f, 'active');
          const tag = f.textContent.trim().toLowerCase();
          lines.forEach(line => {
            if (tag === 'all') { line.classList.remove('is-dim'); return; }
            const t = line.querySelector('.ss-line-tag');
            const matches = t && t.textContent.trim().toLowerCase() === tag;
            line.classList.toggle('is-dim', !matches);
          });
        });
      });

      // Storyline click → focus highlight
      lines.forEach(line => {
        const head = line.querySelector('.ss-line-head');
        if (!head) return;
        head.style.cursor = 'pointer';
        head.addEventListener('click', () => {
          line.classList.toggle('is-pop');
        });
      });

      // Cast cards swap the bible detail
      const cards = ssRoom.querySelectorAll('.ss-cast-card');
      const detail = ssRoom.querySelector('.ss-cast-detail');
      const detailHead = detail ? detail.querySelector('.ss-room-eyebrow') : null;
      const detailRows = detail ? Array.from(detail.querySelectorAll('.bible-row .v')) : [];
      const bible = {
        'Maya Chen':   { head: 'MAYA · BIBLE',    fields: ['Stay invisible until the harbor closes.', 'To stop running from her own past.', 'Spare. Dry. Says half what she means.', 'Boats. Tides. The way David takes coffee.', '14 · across all 6 episodes'] },
        'David Reyes': { head: 'DAVID · BIBLE',   fields: ['Make Maya look at him.', 'To stop performing forgiveness he doesn\'t feel.', 'Long, deliberate sentences. Lawyer-clean.', 'Maya\'s tells. The night the lights went out.', '9 · ep 1, 2, 4, 5'] },
        'Pia Chen':    { head: 'PIA · BIBLE',     fields: ['Be the one who fixes it this time.', 'To stop apologising for her own life.', 'Quick. Em-dashes. Hides feeling under jokes.', 'Family secrets. Restaurant rosters.', '7 · ep 1, 3, 5, 6'] },
        'Mr. Halberg': { head: 'HALBERG · BIBLE', fields: ['Keep the harbor open one more season.', 'To name his successor before winter.', 'Coastal. Plain. One sentence at a time.', 'Tides. People who lie about tides.', '6 · ep 1, 2, 3, 5, 6'] }
      };
      cards.forEach(c => {
        c.style.cursor = 'pointer';
        c.addEventListener('click', () => {
          setActive(cards, c, 'selected');
          const name = (c.querySelector('.name') || {}).textContent;
          if (!name) return;
          const data = bible[name.trim()];
          if (data && detailHead && detailRows.length === data.fields.length) {
            detailHead.textContent = data.head;
            detailRows.forEach((row, i) => { row.textContent = data.fields[i]; });
          }
        });
      });
    }
  }

  // ══════════════════════════════════════════════════════
  // BETA READER
  // ══════════════════════════════════════════════════════
  function initBetaReader() {
    // Desktop report — history items + report tabs
    const brMock = document.querySelector('.br-mock');
    if (brMock) {
      const items = brMock.querySelectorAll('.history .item');
      const reportTitle = brMock.querySelector('.report .head .title');
      items.forEach(it => {
        it.style.cursor = 'pointer';
        it.addEventListener('click', () => {
          setActive(items, it, 'is-active');
          const top = it.querySelector('.top');
          if (reportTitle && top) {
            const label = top.firstChild ? top.firstChild.textContent.trim() : 'Reading Report';
            reportTitle.innerHTML = '<span class="back">‹</span> ' + label;
          }
        });
      });

      const tabs = brMock.querySelectorAll('.reptabs span');
      tabs.forEach(t => {
        t.style.cursor = 'pointer';
        t.addEventListener('click', () => setActive(tabs, t, 'active'));
      });

      // History tabs (Select Content / Reading History)
      const htabs = brMock.querySelectorAll('.history .tabs span');
      htabs.forEach(t => {
        t.style.cursor = 'pointer';
        t.addEventListener('click', () => setActive(htabs, t, 'active'));
      });
    }

    // Tour mockup — section focus + scripted entrance flash
    document.querySelectorAll('.report-mock').forEach(rm => {
      const sections = rm.querySelectorAll('.rm-section');
      sections.forEach(s => {
        s.style.cursor = 'pointer';
        s.addEventListener('click', () => {
          if (s.classList.contains('is-focused')) {
            sections.forEach(x => x.classList.remove('is-focused', 'is-dim'));
          } else {
            sections.forEach(x => { x.classList.add('is-dim'); x.classList.remove('is-focused'); });
            s.classList.remove('is-dim');
            s.classList.add('is-focused');
          }
        });
      });

      if (!reduceMotion) {
        whenVisible(rm, () => {
          sections.forEach((s, i) => {
            setTimeout(() => {
              s.classList.add('is-flash');
              setTimeout(() => s.classList.remove('is-flash'), 700);
            }, 220 * i);
          });
        });
      }
    });

    // Reader gallery — click tile to "pick" (toggle)
    document.querySelectorAll('.reader-gallery').forEach(gal => {
      const tiles = gal.querySelectorAll('.reader-tile:not(.build)');
      tiles.forEach(t => {
        t.style.cursor = 'pointer';
        t.setAttribute('role', 'button');
        t.setAttribute('tabindex', '0');
        const toggle = () => t.classList.toggle('is-picked');
        t.addEventListener('click', toggle);
        t.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
        });
      });
    });
  }

  // ══════════════════════════════════════════════════════
  // BOOT
  // ══════════════════════════════════════════════════════
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(() => {
    initWritingStudio();
    initScriptStudio();
    initBetaReader();
  });
})();
