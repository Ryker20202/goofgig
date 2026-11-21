// GoofGig #615 — Catch the Bus
// A tiny everyday gig: The bus leaves in 20 seconds. Dodge bins, puddles and pigeons, grab tickets on the run.
registerGame({
  n: 615,
  title: "Catch the Bus",
  desc: "The bus leaves in 20 seconds. Dodge bins, puddles and pigeons, grab your tickets on the run.",
  hint: "Move your pointer up and down to steer the runner. Grab <b>gold tickets</b> and coins — bins, puddles and pigeons only slow you down!",
  grades: [
    ["Bus Boarded in Style", "Tickets in hand, hair perfect, not a drop of sweat. The driver nods in respect."],
    ["Frequent Flyer", "You made it with time to spare and change in your pocket. Regulars take notes."],
    ["Just Made It", "You boarded as the doors sighed shut. The bus waited. Barely."],
    ["Missed It by a Pigeon", "So close — one pigeon too many and the bus pulled away without you."],
    ["Still at the Stop", "The bus left, the tickets stayed on the ground, and so did you."]
  ],
  thumb: function (g) {
    g.fillStyle = "#bfdbfe"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#facc15"; rr(g, 200, 8, 62, 34, 6); g.fill();
    g.fillStyle = "#1e40af"; g.fillRect(208, 16, 46, 18);
    g.fillStyle = "#64748b"; g.fillRect(0, 66, 300, 26);
    g.fillStyle = "#f59e0b"; g.beginPath(); g.arc(90, 58, 9, 0, 7); g.fill();
    g.fillStyle = "#fbbf24"; g.beginPath(); g.arc(140, 62, 7, 0, 7); g.fill();
    g.fillStyle = "#fbbf24"; g.beginPath(); g.arc(120, 74, 7, 0, 7); g.fill();
    g.fillStyle = "#334155"; g.beginPath(); g.arc(60, 48, 8, 0, 7); g.fill();
  },
  create: function (api) {
    var LIMIT = 20;
    var t0 = -1, done = false;
    var PX = 150;
    var py = 260, targetY = 260;
    var tickets = 0, coins = 0, hits = 0;
    var items = [];
    var spawnT = 0, invuln = 0, runPhase = 0;
    var flash = 0, flashTxt = "";
    var TICKET_GOAL = 6;
    function el(now) { if (!isFinite(now)) now = 0; if (t0 < 0) t0 = now; return Math.max(0, now - t0); }
    function fin(score, rows) {
      if (done) return; done = true;
      score = clamp(Math.round(score), 0, 100); if (!isFinite(score)) score = 0;
      api.finish({ score: score, rows: rows });
    }
    function finishAll(now) {
      var score = tickets * 10 + coins * 4 - hits * 8 + (tickets >= 4 ? 10 : 0);
      fin(score, [
        { label: "Tickets grabbed", value: Math.round(tickets / TICKET_GOAL * 100), text: tickets + " / " + TICKET_GOAL, good: tickets >= 4 },
        { label: "Coins collected", value: Math.round(clamp(coins / 8, 0, 1) * 100), text: coins + " coins", good: coins >= 4 },
        { label: "Stumbles", value: Math.round(clamp(1 - hits / 5, 0, 1) * 100), text: hits + (hits === 1 ? " stumble" : " stumbles"), good: hits === 0 }
      ]);
    }
    function spawn(t) {
      var r = Math.random();
      var y = 140 + Math.random() * 240;
      var kind;
      if (r < 0.22) kind = "ticket";
      else if (r < 0.52) kind = "coin";
      else if (r < 0.68) kind = "bin";
      else if (r < 0.84) kind = "puddle";
      else kind = "pigeon";
      items.push({ kind: kind, x: 750, y: y, got: false, bob: Math.random() * 6 });
    }
    function steer(p) {
      if (!p) return;
      targetY = clamp(p.y, 140, 380);
    }
    return {
      status: function () {
        return done ? "The bus has gone — did you catch it?" : "Tickets: " + tickets + " / " + TICKET_GOAL + " — steer up and down, dodge the mess!";
      },
      down: function (p, now) { el(now); steer(p); },
      move: function (p, now) { steer(p); },
      up: function (p, now) { steer(p); },
      draw: function (g, dt, now) {
        var dark = isDark();
        var t = el(now);
        if (!done && t >= LIMIT) finishAll(now);
        if (done) t = Math.min(t, LIMIT);
        runPhase += dt * 11;
        if (invuln > 0) invuln -= dt;
        // steer
        py += (targetY - py) * Math.min(1, dt * 10);
        py = clamp(py, 140, 380);
        // spawn + move items
        if (!done) {
          spawnT -= dt;
          if (spawnT <= 0) { spawn(t); spawnT = Math.max(0.45, 0.95 - t * 0.02); }
        }
        var speed = 190 + t * 9;
        for (var i = items.length - 1; i >= 0; i--) {
          var it = items[i];
          it.x -= speed * dt;
          if (it.x < -60) { items.splice(i, 1); continue; }
          if (!done && !it.got && Math.abs(it.x - PX) < 34 && Math.abs(it.y - py) < 34) {
            if (it.kind === "ticket") { it.got = true; tickets++; flash = 0.7; flashTxt = "Ticket! " + tickets + " / " + TICKET_GOAL; blip(880, 0.06); }
            else if (it.kind === "coin") { it.got = true; coins++; flash = 0.5; flashTxt = "Coin! +" + coins; blip(660, 0.04); }
            else if (invuln <= 0) {
              it.got = true; hits++; invuln = 1;
              flash = 0.8; flashTxt = it.kind === "pigeon" ? "Pigeon attack!" : it.kind === "puddle" ? "Splash! Soaked shoes." : "Ouch! Bin collision.";
              sndBad();
            }
          }
          if (it.got) items.splice(i, 1);
        }
        // sky + street
        g.fillStyle = dark ? "#0c1a2e" : "#bfdbfe"; g.fillRect(0, 0, W, H);
        g.fillStyle = dark ? "#1c2b3a" : "#e2e8f0"; g.fillRect(0, 96, W, 8);
        g.fillStyle = dark ? "#334155" : "#94a3b8"; g.fillRect(0, 104, W, 300);
        g.fillStyle = dark ? "#475569" : "#cbd5e1";
        for (var d = 0; d < 8; d++) g.fillRect(((d * 110 - t * speed * 0.4) % 880 + 880) % 880 - 40, 250, 60, 6);
        g.fillStyle = dark ? "#14532d" : "#86efac"; g.fillRect(0, 404, W, 36);
        // bus stop sign (left) + bus ahead (right, distance bar shows approach)
        g.fillStyle = "#dc2626"; g.beginPath(); g.arc(52, 130, 20, 0, 7); g.fill();
        g.fillStyle = "#ffffff"; g.beginPath(); g.arc(52, 130, 13, 0, 7); g.fill();
        g.fillStyle = "#dc2626"; txt(g, "BUS", 52, 130, 11, "#dc2626");
        // bus at the far right, waiting
        var busX = 640;
        g.fillStyle = "#facc15"; rr(g, busX, 150, 90, 130, 12); g.fill();
        g.fillStyle = "#1e40af"; rr(g, busX + 10, 165, 70, 34, 4); g.fill();
        g.fillStyle = "#0f172a"; g.beginPath(); g.arc(busX + 22, 286, 12, 0, 7); g.fill();
        g.beginPath(); g.arc(busX + 68, 286, 12, 0, 7); g.fill();
        g.fillStyle = "#ffffff"; g.beginPath(); g.arc(busX + 22, 286, 5, 0, 7); g.fill();
        g.beginPath(); g.arc(busX + 68, 286, 5, 0, 7); g.fill();
        g.fillStyle = "#92400e"; txt(g, "BUS", busX + 45, 225, 18, "#92400e");
        // items
        for (var j = 0; j < items.length; j++) {
          var m = items[j];
          if (m.kind === "ticket") {
            g.fillStyle = "#f59e0b"; rr(g, m.x - 16, m.y - 11, 32, 22, 4); g.fill();
            g.fillStyle = "#fde68a"; rr(g, m.x - 11, m.y - 6, 22, 12, 3); g.fill();
            g.fillStyle = "#92400e"; txt(g, "T", m.x, m.y + 1, 12, "#92400e");
          } else if (m.kind === "coin") {
            g.fillStyle = "#facc15"; g.beginPath(); g.arc(m.x, m.y, 11, 0, 7); g.fill();
            g.fillStyle = "#fef3c7"; g.beginPath(); g.arc(m.x, m.y, 6, 0, 7); g.fill();
          } else if (m.kind === "bin") {
            g.fillStyle = "#475569"; rr(g, m.x - 16, m.y - 20, 32, 40, 4); g.fill();
            g.fillStyle = "#334155"; rr(g, m.x - 19, m.y - 26, 38, 8, 3); g.fill();
            g.fillStyle = "#94a3b8"; g.fillRect(m.x - 10, m.y - 8, 20, 3);
          } else if (m.kind === "puddle") {
            g.fillStyle = "#38bdf8"; g.beginPath(); g.ellipse(m.x, m.y, 30, 10, 0, 0, 7); g.fill();
            g.fillStyle = "#bae6fd"; g.beginPath(); g.ellipse(m.x - 8, m.y - 2, 12, 4, 0, 0, 7); g.fill();
          } else {
            var bob = Math.sin(t * 6 + m.bob) * 3;
            g.fillStyle = "#64748b";
            g.beginPath(); g.ellipse(m.x, m.y + bob, 16, 10, 0, 0, 7); g.fill();
            g.beginPath(); g.arc(m.x - 13, m.y - 8 + bob, 7, 0, 7); g.fill();
            g.fillStyle = "#f59e0b"; g.beginPath(); g.moveTo(m.x - 20, m.y - 8 + bob); g.lineTo(m.x - 26, m.y - 5 + bob); g.lineTo(m.x - 20, m.y - 4 + bob); g.closePath(); g.fill();
          }
        }
        // runner (commuter with briefcase), blinks while invulnerable
        if (!(invuln > 0 && Math.floor(t * 12) % 2 === 0)) {
          var bobY = Math.abs(Math.sin(runPhase)) * 5;
          var legSwing = Math.sin(runPhase) * 9;
          g.strokeStyle = "#1e293b"; g.lineWidth = 5;
          g.beginPath(); g.moveTo(PX, py + 8 - bobY); g.lineTo(PX - 8 + legSwing, py + 26); g.stroke();
          g.beginPath(); g.moveTo(PX, py + 8 - bobY); g.lineTo(PX + 8 - legSwing, py + 26); g.stroke();
          g.fillStyle = "#2563eb"; rr(g, PX - 11, py - 14 - bobY, 22, 24, 7); g.fill();
          g.fillStyle = "#dc2626"; g.fillRect(PX - 11, py - 14 - bobY, 22, 5);
          g.fillStyle = "#fbbf24"; g.beginPath(); g.arc(PX, py - 24 - bobY, 10, 0, 7); g.fill();
          g.fillStyle = "#1e293b"; g.beginPath(); g.arc(PX + 4, py - 26 - bobY, 2, 0, 7); g.fill();
          g.strokeStyle = "#1e293b"; g.lineWidth = 4;
          g.beginPath(); g.moveTo(PX + 8, py - 8 - bobY); g.lineTo(PX + 20, py + 2 - bobY); g.stroke();
          g.fillStyle = "#92400e"; rr(g, PX + 16, py - 2 - bobY, 18, 13, 3); g.fill();
        }
        if (flash > 0) { flash -= dt; txt(g, flashTxt, 360, 52, 26, dark ? "#fde68a" : "#b45309"); }
        txt(g, "Tickets " + tickets + " / " + TICKET_GOAL + "    Coins " + coins + "    Stumbles " + hits, 360, 420, 16, dark ? "#e2e8f0" : "#1e293b");
        var tl = clamp(1 - t / LIMIT, 0, 1);
        g.fillStyle = dark ? "#223140" : "#e0f2fe"; rr(g, 160, H - 26, 400, 9, 4); g.fill();
        g.fillStyle = tl > 0.3 ? "#16a34a" : "#dc2626"; rr(g, 160, H - 26, 400 * tl, 9, 4); g.fill();
        txt(g, "Bus leaves in " + Math.max(0, Math.ceil(LIMIT - t)) + "s", 360, H - 34, 13, dark ? "#e2e8f0" : "#1e293b");
      }
    };
  }
});
