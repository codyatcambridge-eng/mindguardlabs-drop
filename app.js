/* MindGuardLabs contractor drop — demo interactions */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function qs(sel, el) { return (el || document).querySelector(sel); }
  function qsa(sel, el) { return Array.from((el || document).querySelectorAll(sel)); }

  /* Before/After toggles */
  qsa(".demo-card").forEach((card) => {
    const beforeBtn = qs('[data-view="before"]', card);
    const afterBtn = qs('[data-view="after"]', card);
    const beforePanel = qs(".panel.before", card);
    const afterPanel = qs(".panel.after", card);
    if (!beforeBtn || !afterBtn || !beforePanel || !afterPanel) return;

    function show(view) {
      const isAfter = view === "after";
      beforePanel.hidden = isAfter;
      afterPanel.hidden = !isAfter;
      beforeBtn.classList.toggle("active", !isAfter);
      afterBtn.classList.toggle("active", isAfter);
    }
    beforeBtn.addEventListener("click", () => show("before"));
    afterBtn.addEventListener("click", () => show("after"));
    show("before");
  });

  /* Generic staged reveal helper */
  function runStages(card, stages, finalExtra) {
    const afterPanel = qs(".panel.after", card);
    const beforeBtn = qs('[data-view="before"]', card);
    const afterBtn = qs('[data-view="after"]', card);
    if (!afterPanel) return;

    afterPanel.hidden = false;
    qs(".panel.before", card).hidden = true;
    if (beforeBtn && afterBtn) {
      beforeBtn.classList.toggle("active", false);
      afterBtn.classList.toggle("active", true);
    }

    const stageRoot = qs("[data-stage]", afterPanel) || afterPanel;
    const items = qsa("[data-step]", stageRoot);
    items.forEach((el) => {
      el.classList.remove("show-anim", "pulse");
      el.classList.add("hidden-anim");
      el.hidden = false;
    });

    let i = 0;
    function next() {
      if (i >= items.length) {
        if (typeof finalExtra === "function") finalExtra(card);
        return;
      }
      const el = items[i++];
      el.classList.remove("hidden-anim");
      el.classList.add("show-anim", "pulse");
      if (reduce) next();
      else setTimeout(next, 380);
    }
    next();
  }

  /* Demo A — missed call */
  const demoA = qs('#demo-a');
  if (demoA) {
    qs('[data-run="a"]', demoA)?.addEventListener("click", () => {
      runStages(demoA);
    });
  }

  /* Demo B */
  qs('[data-run="b"]')?.addEventListener("click", () => {
    runStages(qs("#demo-b"));
  });

  /* Demo C */
  qs('[data-run="c"]')?.addEventListener("click", () => {
    runStages(qs("#demo-c"));
  });

  /* Demo D — Social Engine */
  qs('[data-run="d"]')?.addEventListener("click", () => {
    const card = qs("#demo-d");
    runStages(card, null, (c) => {
      qsa(".cal-chips span", c).forEach((chip, idx) => {
        setTimeout(() => chip.classList.add("filled"), reduce ? 0 : 120 * idx);
      });
    });
  });

  /* Demo E */
  qs('[data-run="e"]')?.addEventListener("click", () => {
    runStages(qs("#demo-e"));
  });

  /* Demo F */
  qs('[data-run="f"]')?.addEventListener("click", () => {
    runStages(qs("#demo-f"));
  });

  /* Demo G — Grok desk */
  qs('[data-run="g"]')?.addEventListener("click", () => {
    runStages(qs("#demo-g"));
  });

  /* Demo H — Hermes kanban */
  qs('[data-run="h"]')?.addEventListener("click", () => {
    const card = qs("#demo-h");
    runStages(card, null, (c) => {
      qsa(".kanban .ticket", c).forEach((t, idx) => {
        setTimeout(() => t.classList.add("done"), reduce ? 0 : 200 * (idx + 1));
      });
    });
  });

  /* Hero mini demo */
  const heroRun = qs("#hero-run");
  if (heroRun) {
    heroRun.addEventListener("click", () => {
      const steps = qsa("#hero-demo [data-step]");
      steps.forEach((el) => {
        el.classList.add("hidden-anim");
        el.classList.remove("show-anim");
      });
      let i = 0;
      function next() {
        if (i >= steps.length) return;
        const el = steps[i++];
        el.classList.remove("hidden-anim");
        el.classList.add("show-anim");
        if (reduce) next();
        else setTimeout(next, 420);
      }
      next();
    });
  }

  /* Platform toggle visual only */
  qsa(".platform-toggles label").forEach((label) => {
    label.addEventListener("click", () => {
      /* checkbox handled by browser; CSS :has styles active state */
    });
  });
})();
