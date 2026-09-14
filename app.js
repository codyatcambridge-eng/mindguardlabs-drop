/* MindGuardLabs drop v3 — interactions */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const delay = (ms) =>
    new Promise((r) => setTimeout(r, reduceMotion ? Math.min(ms, 50) : ms));

  /* —— Nav —— */
  const navToggle = document.getElementById("nav-toggle");
  const navPanel = document.getElementById("nav-panel");
  if (navToggle && navPanel) {
    navToggle.addEventListener("click", () => {
      const open = navPanel.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    navPanel.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        navPanel.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* —— Shared phone SMS runner —— */
  async function runMissedCallDemo({
    screen,
    thread,
    chip,
    button,
  }) {
    if (!screen || !thread) return;
    if (button) button.disabled = true;

    const callEl = screen.querySelector(".call-screen");
    const miss = screen.querySelector(".miss-banner");
    const sms = screen.querySelector(".sms-app");

    thread.innerHTML = "";
    if (chip) chip.hidden = true;
    if (miss) miss.hidden = true;
    if (sms) sms.hidden = true;
    if (callEl) callEl.hidden = false;
    screen.dataset.state = "ringing";

    await delay(550);
    if (callEl) callEl.hidden = true;
    if (miss) {
      miss.hidden = false;
      miss.textContent = "Missed · SMS firing";
    }
    screen.dataset.state = "missed";
    await delay(500);

    if (miss) miss.hidden = true;
    if (sms) sms.hidden = false;
    screen.dataset.state = "sms";

    const messages = [
      { who: "shop", text: "Hey — sorry we missed you. Still need help today or this week?" },
      { who: "home", text: "Yes — AC not cooling. Can someone come Thu?" },
      { who: "shop", text: "Got it. We can do Thursday 2pm for an estimate. Sound good?" },
      { who: "home", text: "Perfect — see you then." },
    ];

    for (let i = 0; i < messages.length; i++) {
      await delay(i === 0 ? 400 : 550);
      const b = document.createElement("div");
      b.className = "bubble " + messages[i].who;
      b.textContent = messages[i].text;
      thread.appendChild(b);
      thread.scrollTop = thread.scrollHeight;
    }

    await delay(450);
    if (chip) {
      chip.hidden = false;
      chip.textContent = "Estimate Thu 2:00 PM ✓";
    }
    screen.dataset.state = "booked";
    if (button) button.disabled = false;
  }

  /* Hero Run */
  const heroRun = document.getElementById("hero-run");
  if (heroRun) {
    heroRun.addEventListener("click", () =>
      runMissedCallDemo({
        screen: document.getElementById("hero-screen"),
        thread: document.getElementById("hero-thread"),
        chip: document.getElementById("hero-chip"),
        button: heroRun,
      })
    );
  }

  /* Demo A Run */
  const demoARun = document.getElementById("demo-a-run");
  if (demoARun) {
    demoARun.addEventListener("click", () =>
      runMissedCallDemo({
        screen: document.getElementById("demo-a-screen"),
        thread: document.getElementById("demo-a-thread"),
        chip: document.getElementById("demo-a-chip"),
        button: demoARun,
      })
    );
  }

  /* —— Social Engine —— */
  const toggles = document.querySelectorAll(".platform-toggles .toggle");
  toggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const on = btn.classList.toggle("on");
      btn.setAttribute("aria-pressed", String(on));
    });
  });

  const socialApprove = document.getElementById("social-approve");
  const socialToast = document.getElementById("social-toast");
  const calendarChips = document.getElementById("calendar-chips");

  if (socialApprove && calendarChips) {
    socialApprove.addEventListener("click", async () => {
      const active = [...document.querySelectorAll(".platform-toggles .toggle.on")].map(
        (t) => t.dataset.platform
      );
      if (active.length === 0) {
        if (socialToast) {
          socialToast.hidden = false;
          socialToast.textContent = "Pick at least one platform.";
          socialToast.style.color = "var(--danger)";
          socialToast.style.borderColor = "rgba(240,113,120,0.35)";
          socialToast.style.background = "rgba(240,113,120,0.12)";
        }
        return;
      }

      socialApprove.disabled = true;
      calendarChips.innerHTML = "";
      if (socialToast) {
        socialToast.hidden = false;
        socialToast.style.color = "";
        socialToast.style.borderColor = "";
        socialToast.style.background = "";
        socialToast.textContent = "Scheduling…";
      }

      await delay(500);
      const labels = { ig: "IG · Wed 10am", fb: "FB · Wed 10am", google: "Google · Wed 11am" };
      for (const p of active) {
        await delay(350);
        const chip = document.createElement("span");
        chip.className = "cal-chip";
        chip.textContent = labels[p] || p;
        calendarChips.appendChild(chip);
      }

      if (socialToast) {
        socialToast.textContent =
          "Approved → " + active.length + " platform" + (active.length > 1 ? "s" : "") + " scheduled.";
      }
      socialApprove.disabled = false;
    });
  }

  /* —— Grok desk —— */
  const drafts = {
    summarize:
      "Leads this week (3):\n• Thu 2pm estimate — AC not cooling (Newnan)\n• Sat AM — duct inspect (Coweta)\n• Waiting reply — furnace quote sent Day 3\n\nPriority: confirm Thu window; nudge furnace lead.",
    followup:
      "Hi — following up on the estimate we sent. Still good for you this week, or want a different window? Reply YES and we’ll lock it. — Shop",
    crew:
      "Crew 7am: Newnan AC swap. Bring nitrogen + 3/8 fittings. Customer gate code on Jobber. Text when en route.",
  };

  const draftPanel = document.getElementById("draft-panel");
  document.querySelectorAll(".grok-chips .chip").forEach((chip) => {
    chip.addEventListener("click", async () => {
      document.querySelectorAll(".grok-chips .chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      if (!draftPanel) return;
      draftPanel.innerHTML = "<p class=\"draft-placeholder\">Drafting…</p>";
      await delay(450);
      const key = chip.dataset.draft;
      draftPanel.textContent = drafts[key] || "";
    });
  });

  /* —— Hermes kanban —— */
  const hermesRun = document.getElementById("hermes-run");
  const hermesCard = document.getElementById("hermes-card");
  const hermesWork = document.getElementById("hermes-work");
  const hermesDone = document.getElementById("hermes-done");
  const hermesAudit = document.getElementById("hermes-audit");

  if (hermesRun && hermesCard) {
    hermesRun.addEventListener("click", async () => {
      hermesRun.disabled = true;
      if (hermesWork) hermesWork.innerHTML = "";
      if (hermesDone) hermesDone.innerHTML = "";
      if (hermesAudit) hermesAudit.hidden = true;

      hermesCard.textContent = "Orchestrator";
      hermesCard.dataset.stage = "active";
      await delay(550);

      hermesCard.textContent = "Handed off";
      hermesCard.dataset.stage = "idle";
      if (hermesWork) {
        const w = document.createElement("div");
        w.className = "card";
        w.dataset.stage = "active";
        w.textContent = "Research";
        hermesWork.appendChild(w);
      }
      await delay(500);
      if (hermesWork) {
        hermesWork.querySelector(".card").textContent = "Draft";
      }
      await delay(500);
      if (hermesWork) {
        hermesWork.querySelector(".card").textContent = "Review";
      }
      await delay(500);

      if (hermesWork) hermesWork.innerHTML = "";
      if (hermesDone) {
        const d = document.createElement("div");
        d.className = "card";
        d.dataset.stage = "done";
        d.textContent = "Done";
        hermesDone.appendChild(d);
      }
      if (hermesAudit) {
        hermesAudit.hidden = false;
        hermesAudit.textContent =
          "Audit: Orchestrator → Research → Draft → Review → Done. Handoff logged.";
      }
      hermesRun.disabled = false;
    });
  }
})();
