/* GoofGig — Gig #097 Find the Cat */
registerGame({
  n: 97, title: "Find the Cat",
  desc: "A cat. Five boxes. Pure betrayal at increasing speed.",
  hint: 'The cat hides under <b>one of 5 boxes</b>. The boxes <b>shuffle</b> — track yours with your eyes. <b>Tap the box</b> you believe in. <b>3 rounds</b>, faster each time.',
  grades: [
    ["Cat Tracker Elite", "Three for three. The cat respects the hustle."],
    ["Box Detective", "You followed that cat like it owed you rent."],
    ["Decent Watcher", "Mostly tracked. The cat slipped you once."],
    ["Easily Distracted", "The boxes moved and your soul left your body."],
    ["Cat's Favorite Toy", "The cat watched YOU the whole time. From another box."]
  ],
  thumb: function (g) {
    g.fillStyle = "#e0aa5e"; rr(g, 100, 34, 44, 36, 5); g.fill();
    g.fillStyle = "#c98f3d"; rr(g, 160, 34, 44, 36, 5); g.fill();
    g.fillStyle = "#ffcf4d"; g.beginPath(); g.arc(238, 40, 13, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.moveTo(228, 32); g.lineTo(230, 18); g.lineTo(238, 27); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(248, 32); g.lineTo(246, 18); g.lineTo(238, 27); g.closePath(); g.fill();
  },
  create: function (api) {
    var SLOTX = [110, 235, 360, 485, 610];
    var boxes = [], catBox = 0, round = 1, phase = "peek", timer = 0, swapsLeft = 0, swapA = -1, swapB = -1, swapT = 0, found = 0, done = false, picked = -1;
    function resetBoxes() {
      boxes = [0, 1, 2, 3, 4].map(function (id) { return { id: id, x: SLOTX[id] }; });
      catBox = Math.floor(Math.random() * 5);
    }
    resetBoxes();
    function swapDur() { return Math.max(0.22, 0.5 - round * 0.07); }
    function startSwap() {
      swapA = Math.floor(Math.random() * 5);
      do { swapB = Math.floor(Math.random() * 5); } while (swapB === swapA);
      swapT = 0;
    }
    function finishRound() {
      done = true;
      var score = clamp(found * 30 + (found === 3 ? 10 : 0), 2, 100);
      if (found >= 2) sndGood(); else sndBad();
      api.finish({ score: score, rows: [
        { label: "Cats found", value: Math.round(found / 3 * 100), text: found + " / 3", good: found >= 2 },
        { label: "Final shuffle speed", value: 90, text: "Rude" }
      ] });
    }
    function nextRound() {
      if (round >= 3) { finishRound(); return; }
      round++; resetBoxes(); phase = "peek"; timer = 0; picked = -1;
    }
    function drawCat(g, x, y, s) {
      g.save(); g.translate(x, y); g.scale(s, s);
      g.fillStyle = "#ffcf4d";
      g.beginPath(); g.moveTo(-16, -8); g.lineTo(-13, -24); g.lineTo(-3, -14); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(16, -8); g.lineTo(13, -24); g.lineTo(3, -14); g.closePath(); g.fill();
      g.beginPath(); g.arc(0, 0, 19, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#33241a"; g.beginPath(); g.arc(-7, -2, 2.4, 0, Math.PI * 2); g.arc(7, -2, 2.4, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#e88ca0"; g.beginPath(); g.moveTo(-3, 3); g.lineTo(3, 3); g.lineTo(0, 7); g.closePath(); g.fill();
      g.restore();
    }
    return {
      status: function () {
        if (done) return "The cat has left the building.";
        if (phase === "peek") return "Round " + round + " — the cat is under THIS one…";
        if (phase === "shuffle") return "Track your box…";
        if (phase === "pick") return "Which box? Tap it!";
        return picked === catBox ? "FOUND IT!" : "Nope — it was box " + (catBox + 1) + "!";
      },
      down: function (p) {
        if (done || phase !== "pick") return;
        audio();
        for (var i = 0; i < 5; i++) {
          if (Math.abs(p.x - boxes[i].x) < 56 && p.y > 190 && p.y < 330) {
            picked = boxes[i].id;
            if (picked === catBox) { found++; sndGood(); } else blip(160, .12, "sawtooth", .06);
            phase = "reveal"; timer = 0;
            return;
          }
        }
      },
      move: function () {}, up: function () {},
      draw: function (g, dt) {
        var dark = isDark();
        if (phase === "peek") { timer += dt; if (timer > 1.1) { phase = "shuffle"; swapsLeft = 5; startSwap(); } }
        else if (phase === "shuffle") {
          swapT += dt / swapDur();
          var a = boxes[swapA], b = boxes[swapB];
          var ax = SLOTX[swapA], bx = SLOTX[swapB];
          var k = Math.min(1, swapT), ease = k * k * (3 - 2 * k);
          a.x = ax + (bx - ax) * ease; b.x = bx + (ax - bx) * ease;
          a.y = -Math.sin(ease * Math.PI) * 26; b.y = Math.sin(ease * Math.PI) * 0;
          if (swapT >= 1) {
            a.x = bx; b.x = ax; a.y = 0; b.y = 0;
            var tmp = boxes[swapA]; boxes[swapA] = boxes[swapB]; boxes[swapB] = tmp;
            swapsLeft--;
            if (swapsLeft <= 0) phase = "pick"; else startSwap();
          }
        }
        else if (phase === "reveal") { timer += dt; if (timer > 1.3) nextRound(); }
        // table
        g.fillStyle = dark ? "#4a3423" : "#d9b98a"; g.fillRect(0, 322, W, 12);
        txt(g, "FIND THE CAT — ROUND " + round + " / 3", W / 2, 60, 20, dark ? "#f7e8d8" : "#33241a");
        boxes.forEach(function (box, i) {
          var y = 258 + (box.y || 0);
          var isCat = box.id === catBox;
          var lift = (phase === "peek" && isCat) || (phase === "reveal" && isCat);
          if (lift) drawCat(g, box.x, y + 6, 1.15);
          g.fillStyle = phase === "reveal" && picked === box.id ? (picked === catBox ? "#35c4a0" : "#e3352b") : "#e0aa5e";
          var topY = lift ? y - 62 : y - 34;
          rr(g, box.x - 54, topY, 108, 66, 8); g.fill();
          g.fillStyle = "rgba(0,0,0,.15)"; rr(g, box.x - 54, topY + 26, 108, 10, 4); g.fill();
          txt(g, "" + (i + 1), box.x, topY + 24, 19, "#5d3a16");
        });
        if (phase === "pick") txt(g, "The cat is under one of these. Choose wisely.", W / 2, 420, 18, "#0e9594");
        if (phase === "shuffle") txt(g, "Eyes on your box…", W / 2, 420, 18, dark ? "rgba(247,232,216,.8)" : "rgba(93,58,22,.7)");
      }
    };
  }
});
