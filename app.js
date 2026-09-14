/* MindGuardLabs drop v2 — product-feeling demos */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));

  function qs(sel, el) { return (el || document).querySelector(sel); }
  function qsa(sel, el) { return Array.from((el || document).querySelectorAll(sel)); }

  /* —— Nav hamburger —— */
  const toggle = qs("#nav-toggle");
  const panel = qs("#nav-panel");
  if (toggle && panel) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      panel.classList.toggle("open", !open);
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
    });
    qsa("a", panel).forEach((a) => {
      a.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        panel.classList.remove("open");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* —— SMS missed-call simulator —— */
  async function runMissedCall(root) {
    if (!root || root.dataset.busy === "1") return;
    root.dataset.busy = "1";

    const call = qs(".call-screen", root);
    const miss = qs(".miss-banner", root);
    const sms = qs(".sms-app", root);
    const thread = qs(".sms-thread", root);
    const chip = qs(".estimate-chip", root);

    // reset
    if (call) {
      call.hidden = false;
      call.classList.remove("is-leaving");
    }
    if (miss) miss.hidden = true;
    if (sms) sms.hidden = true;
    if (thread) thread.innerHTML = "";
    if (chip) {
      chip.hidden = true;
      chip.classList.remove("show");
    }

    await wait(500);
    if (call) call.classList.add("is-leaving");
    await wait(420);
    if (call) call.hidden = true;
    if (miss) {
      miss.hidden = false;
      miss.style.opacity = reduce ? "1" : "0";
      if (!reduce) {
        miss.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, fill: "forwards" });
      }
    }
    await wait(700);
    if (miss) miss.hidden = true;
    if (sms) sms.hidden = false;

    const bubbles = [
      { who: "us", text: "Hey, it’s Apex HVAC — stuck on a job. Text me what you need and I’ll get you on the board." },
      { who: "them", text: "AC died. Can someone look tomorrow?" },
      { who: "us", text: "Got it. I can do an estimate Thu 2pm — want that window?" },
      { who: "them", text: "Yes please." },
    ];

    for (const b of bubbles) {
      const el = document.createElement("div");
      el.className = `bubble ${b.who}`;
      el.textContent = b.text;
      thread.appendChild(el);
      // force reflow then show
      void el.offsetWidth;
      el.classList.add("show");
      await wait(550);
    }

    if (chip) {
      chip.hidden = false;
      void chip.offsetWidth;
      chip.classList.add("show");
    }

    root.dataset.busy = "0";
  }

  qs("#hero-run")?.addEventListener("click", () => {
    runMissedCall(qs("#hero-screen"));
  });
  qs('[data-run="missed"]')?.addEventListener("click", () => {
    runMissedCall(qs("#demo-phone-screen"));
  });

  /* —— Social Engine —— */
  const cal = qs("#cal-chips");
  const approveBtn = qs("#social-approve");

  function selectedPlatforms() {
    const map = [
      { id: "plat-ig", label: "Instagram", when: "Wed 5:30 PM" },
      { id: "plat-fb", label: "Facebook", when: "Wed 5:30 PM" },
      { id: "plat-gmb", label: "Google Business", when: "Thu 9:00 AM" },
    ];
    return map.filter((p) => qs("#" + p.id)?.checked);
  }

  approveBtn?.addEventListener("click", async () => {
    if (!cal) return;
    const plats = selectedPlatforms();
    cal.innerHTML = "";
    if (!plats.length) {
      cal.innerHTML = '<p class="cal-empty">Turn on at least one platform</p>';
      return;
    }
    for (let i = 0; i < plats.length; i++) {
      const p = plats[i];
      const chip = document.createElement("div");
      chip.className = "cal-chip";
      chip.style.animationDelay = reduce ? "0ms" : `${i * 140}ms`;
      chip.innerHTML = `<span>${p.label}</span><span>Scheduled · ${p.when}</span>`;
      cal.appendChild(chip);
      await wait(reduce ? 0 : 160);
    }
    approveBtn.textContent = "Approved ✓";
    await wait(1600);
    approveBtn.textContent = "Approve & schedule";
  });

  // live toggle: if chips already shown, refresh on change
  ["plat-ig", "plat-fb", "plat-gmb"].forEach((id) => {
    qs("#" + id)?.addEventListener("change", () => {
      if (cal && !qs(".cal-empty", cal) && qsa(".cal-chip", cal).length) {
        approveBtn?.click();
      }
    });
  });

  /* —— Grok desk —— */
  const replies = {
    leads: {
      title: "Lead digest",
      body: "3 new leads today · 1 hot (AC emergency, Coweta) · 2 estimate follow-ups waiting on Day-3 nudge.",
    },
    followup: {
      title: "Draft SMS",
      body: "“Hi Sam — checking in on the attic quote from Tuesday. Still good for Thu 2pm estimate, or want a different window?”",
    },
    crew: {
      title: "Crew run-of-show",
      body: "Tomorrow: Unit A — attic AC (Coweta 9am) · Unit B — filter route (Newnan 1pm). Parts staged on truck 2.",
    },
  };

  qsa("[data-chip]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      qsa("[data-chip]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const key = btn.getAttribute("data-chip");
      const out = qs("#grok-out");
      const data = replies[key];
      if (!out || !data) return;
      out.innerHTML = "";
      await wait(reduce ? 0 : 280);
      out.innerHTML = `<strong>${data.title}</strong>${data.body}`;
    });
  });

  /* —— Hermes kanban —— */
  const lanes = {
    inbox: qs("#lane-inbox"),
    specialists: qs("#lane-specialists"),
    done: qs("#lane-done"),
  };

  function makeCard(title, meta) {
    const el = document.createElement("div");
    el.className = "k-card";
    el.innerHTML = `${title}<span class="meta">${meta}</span>`;
    return el;
  }

  function resetBoard() {
    if (!lanes.inbox) return;
    lanes.inbox.innerHTML = "";
    lanes.specialists.innerHTML = "";
    lanes.done.innerHTML = "";
    const c1 = makeCard("Orchestrate: follow-up pack", "owner request");
    const c2 = makeCard("Photo → caption draft", "social lane");
    lanes.inbox.appendChild(c1);
    lanes.inbox.appendChild(c2);
    return [c1, c2];
  }

  async function moveCard(card, toLane, audit) {
    if (!card || !toLane) return;
    card.classList.add("moving");
    await wait(420);
    toLane.appendChild(card);
    if (audit) {
      const meta = card.querySelector(".meta");
      if (meta) meta.textContent = audit;
    }
    await wait(200);
    card.classList.remove("moving");
  }

  let hermesBusy = false;
  qs("#hermes-run")?.addEventListener("click", async () => {
    if (hermesBusy) return;
    hermesBusy = true;
    const cards = resetBoard();
    await wait(500);
    // handoff 1 → specialists
    await moveCard(cards[0], lanes.specialists, "→ content specialist");
    await wait(450);
    await moveCard(cards[1], lanes.specialists, "→ follow-up specialist");
    await wait(500);
    await moveCard(cards[0], lanes.done, "audit: caption approved");
    await wait(400);
    await moveCard(cards[1], lanes.done, "audit: SMS queued");
    hermesBusy = false;
  });

  // seed empty board state
  resetBoard();
})();
