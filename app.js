/* MindGuardLabs drop v5 — interactions */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const delay = (ms) =>
    new Promise((r) => setTimeout(r, reduceMotion ? Math.min(ms, 50) : ms));
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

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

  /* —— Social Engine (3 variants) —— */
  const socialTabs = qsa("[data-social-tab]");
  const socialPanels = qsa("[data-social-panel]");

  function showSocialVariant(id) {
    socialTabs.forEach((tab) => {
      const on = tab.dataset.socialTab === id;
      tab.classList.toggle("active", on);
      tab.setAttribute("aria-selected", String(on));
      tab.setAttribute("tabindex", on ? "0" : "-1");
    });
    socialPanels.forEach((panel) => {
      const on = panel.dataset.socialPanel === id;
      panel.hidden = !on;
      panel.classList.toggle("active", on);
    });
  }

  socialTabs.forEach((tab) => {
    tab.addEventListener("click", () => showSocialVariant(tab.dataset.socialTab));
  });

  const socialTablist = document.getElementById("social-variant-tabs");
  if (socialTablist) {
    socialTablist.addEventListener("keydown", (e) => {
      const tabs = socialTabs;
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      let next = i;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % tabs.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = tabs.length - 1;
      else return;
      e.preventDefault();
      tabs[next].focus();
      showSocialVariant(tabs[next].dataset.socialTab);
    });
  }

  /* Shared exclusive / multi toggles inside Social Engine */
  function wireExclusiveToggles(root, selector) {
    const group = root ? root.querySelector(selector) : null;
    if (!group) return;
    qsa(".toggle", group).forEach((btn) => {
      btn.addEventListener("click", () => {
        qsa(".toggle", group).forEach((b) => {
          const on = b === btn;
          b.classList.toggle("on", on);
          b.setAttribute("aria-pressed", String(on));
        });
      });
    });
  }

  function wireMultiToggles(root, selector) {
    const group = root ? root.querySelector(selector) : null;
    if (!group) return;
    qsa(".toggle", group).forEach((btn) => {
      btn.addEventListener("click", () => {
        const on = btn.classList.toggle("on");
        btn.setAttribute("aria-pressed", String(on));
      });
    });
  }

  const variantA = document.getElementById("social-variant-a");
  wireExclusiveToggles(variantA, "#set-cadence");
  wireMultiToggles(variantA, "#set-destinations");
  wireExclusiveToggles(document.getElementById("social-variant-c"), "#note-path");

  /* Variant 1 — Set-and-done auto posts */
  const socialSetDone = document.getElementById("social-set-done");
  const socialToast = document.getElementById("social-toast");
  const calendarChips = document.getElementById("calendar-chips");
  const setDoneStatus = document.getElementById("set-done-status");

  if (socialSetDone && calendarChips) {
    socialSetDone.addEventListener("click", async () => {
      const cadenceBtn = document.querySelector("#set-cadence .toggle.on");
      const cadence = cadenceBtn ? Number(cadenceBtn.dataset.cadence) : 5;
      const dests = qsa("#set-destinations .toggle.on").map((t) => t.dataset.dest);
      if (dests.length === 0) {
        if (socialToast) {
          socialToast.hidden = false;
          socialToast.textContent = "Pick at least one destination.";
          socialToast.style.color = "var(--danger)";
          socialToast.style.borderColor = "rgba(240,113,120,0.35)";
          socialToast.style.background = "rgba(240,113,120,0.12)";
        }
        return;
      }

      socialSetDone.disabled = true;
      calendarChips.innerHTML = "";
      if (socialToast) {
        socialToast.hidden = false;
        socialToast.style.color = "";
        socialToast.style.borderColor = "";
        socialToast.style.background = "";
        socialToast.textContent = "Ghostwriter locking cadence…";
      }

      await delay(450);
      const destLabels = {
        feed: "Feed",
        stories: "Stories",
        google: "Google Business",
      };
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const slots = days.slice(0, cadence);
      for (let i = 0; i < slots.length; i++) {
        await delay(220);
        const dest = destLabels[dests[i % dests.length]] || dests[i % dests.length];
        const chip = document.createElement("span");
        chip.className = "cal-chip";
        chip.textContent = slots[i] + " · " + dest + " · " + cadence + "×/wk";
        calendarChips.appendChild(chip);
      }

      if (setDoneStatus) {
        setDoneStatus.innerHTML =
          "Status: <strong>set &amp; done</strong> · " +
          cadence +
          "×/week · ghostwriter on · " +
          dests.map((d) => destLabels[d] || d).join(" / ");
      }
      if (socialToast) {
        socialToast.textContent =
          "Set & done — auto-posting " + cadence + "× per week to " + dests.length + " destination" + (dests.length > 1 ? "s" : "") + ".";
      }
      socialSetDone.disabled = false;
    });
  }

  /* Variant 2 — Gmail photo dump → 3 posts that week */
  const dumpRun = document.getElementById("dump-run");

  if (dumpRun) {
    dumpRun.addEventListener("click", async () => {
      dumpRun.disabled = true;
      const gmail = document.getElementById("dump-gmail");
      const queue = document.getElementById("dump-queue");
      const chips = document.getElementById("dump-chips");
      const status = document.getElementById("dump-status");
      if (gmail) gmail.hidden = true;
      if (queue) queue.hidden = true;
      if (chips) chips.innerHTML = "";
      if (status) {
        status.hidden = false;
        status.textContent = "Routing camera roll → Gmail photo dump…";
      }
      await delay(450);
      if (gmail) gmail.hidden = false;
      if (status) status.textContent = "Gmail photo dump · 4 job shots landed.";
      await delay(500);
      if (queue) queue.hidden = false;
      if (status) status.textContent = "Ghostwriter drafting 3 posts for the week…";
      await delay(450);
      const schedule = [
        "Mon 9am · Post 1 · ghostwriter",
        "Wed 12pm · Post 2 · ghostwriter",
        "Fri 4pm · Post 3 · ghostwriter",
      ];
      if (chips) {
        for (const label of schedule) {
          await delay(280);
          const chip = document.createElement("span");
          chip.className = "cal-chip";
          chip.textContent = label;
          chips.appendChild(chip);
        }
      }
      if (status) {
        status.textContent = "3 scheduled posts that week from Gmail photo dump · ghostwriter on.";
      }
      dumpRun.disabled = false;
    });
  }

  /* Variant 3 — Photo/voice note → AI → Gmail → post */
  const voiceRun = document.getElementById("voice-run");
  const voiceSteps = qsa("[data-voice-step]");

  function setVoiceStep(n) {
    voiceSteps.forEach((el) => {
      const step = Number(el.dataset.voiceStep);
      el.classList.toggle("done", step < n);
      el.classList.toggle("active", step === n);
      el.setAttribute("aria-current", step === n ? "step" : "false");
    });
  }

  function currentNotePath() {
    const on = document.querySelector("#note-path .toggle.on");
    return on && on.dataset.path === "reel" ? "reel" : "photo";
  }

  if (voiceRun) {
    voiceRun.addEventListener("click", async () => {
      voiceRun.disabled = true;
      const toast = document.getElementById("voice-toast");
      const preview = document.getElementById("voice-preview");
      const pathTag = document.getElementById("voice-path-tag");
      const attachName = document.getElementById("voice-attach-name");
      const attachMeta = document.getElementById("voice-attach-meta");
      const path = currentNotePath();
      if (toast) {
        toast.hidden = false;
        toast.textContent = "Saving photo/voice note…";
      }
      if (preview) preview.hidden = true;
      setVoiceStep(1);
      await delay(550);
      setVoiceStep(2);
      if (toast) toast.textContent = "Ghostwriter polishing caption…";
      await delay(550);
      setVoiceStep(3);
      if (toast) toast.textContent = "Packaging Gmail delivery…";
      await delay(550);
      setVoiceStep(4);
      if (pathTag) {
        pathTag.textContent =
          path === "reel" ? "Reel gen · 2–10 min" : "Photo post · ~20s";
      }
      if (attachName) {
        attachName.textContent = path === "reel" ? "job-reel.mp4" : "job-photo.jpg";
      }
      if (attachMeta) {
        attachMeta.textContent =
          path === "reel"
            ? "Reel package · ghostwriter script · 2–10 minutes"
            : "Image attachment · ready to post (~20 seconds)";
      }
      if (preview) preview.hidden = false;
      if (toast) {
        toast.textContent =
          path === "reel"
            ? "Gmail delivered — image + ghostwriter script · reel gen path (2–10 min)."
            : "Gmail delivered — image + ghostwriter script · photo post (~20 seconds).";
      }
      voiceRun.disabled = false;
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

  /* System step accordion */
  qsa(".system-step-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const wasOpen = btn.getAttribute("aria-expanded") === "true";
      qsa(".system-step-toggle").forEach((b) => {
        b.setAttribute("aria-expanded", "false");
        const p = document.getElementById(b.getAttribute("aria-controls"));
        if (p) p.hidden = true;
      });
      if (!wasOpen) {
        btn.setAttribute("aria-expanded", "true");
        const panel = document.getElementById(btn.getAttribute("aria-controls"));
        if (panel) panel.hidden = false;
      }
    });
  });

})();
