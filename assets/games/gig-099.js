/* GoofGig — Gig #099 Rhythm Chef */
registerGame({
  n: 99, title: "Rhythm Chef",
  desc: "Veggies slide down the cutting board. Chop them exactly on the line.",
  hint: 'Veggie markers <b>fall down the lane</b>. <b>Tap exactly when each one crosses the chopping line</b>. <b>12 notes</b> — timing is everything, chef.',
  grades: [
    ["Rhythm Chef Supreme", "Every chop on the beat. The veggies never stood a chance."],
    ["Sous-Chef of Timing", "Crisp, musical chopping. Dinner is saved."],
    ["Line Cook", "Mostly on beat. A few carrots escaped rhythmically."],
    ["Chaotic Chopper", "The beat was there. You were… elsewhere. Chopping anyway."],
    ["Salad Hazard", "You chopped the air, the pauses, everything but the moment."]
  ],
  thumb: function (g) {
    g.fillStyle = "#d9b98a"; rr(g, 128, 10, 44, 72, 6); g.fill();
    g.fillStyle = "#ff8c42"; g.beginPath(); g.arc(150, 30, 9, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#7fb069"; g.beginPath(); g.arc(150, 58, 8, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#e3352b"; g.fillRect(112, 62, 76, 4);
  },
  create: function (api) {
    var LINE = 372, SPEED = 235, TOTAL = 12;
    var notes = [], spawned = 0, spawnT = 0.6, started = false, done = false;
    var perfect = 0, good = 0, missed = 0, whiffs = 0, chopFlash = 0, judge = "", judgeT = 0;
    var VEG = ["#ff8c42", "#7fb069", "#e3352b", "#ffd23f", "#9b7ebd"];
    function finishRound() {
      done = true;
      var score = clamp(Math.round((perfect * 10 + good * 6) / 1.2), 1, 100);
      if (perfect >= 8) sndGood(); else sndBad();
      api.finish({ score: score, rows: [
        { label: "Perfect chops", value: perfect / TOTAL * 100, text: perfect + " / " + TOTAL, good: perfect >= 7 },
        { label: "Good chops", value: good / TOTAL * 100, text: good + " / " + TOTAL },
        { label: "Missed / whiffed", value: clamp(100 - (missed + whiffs) * 9, 0, 100), text: (missed + whiffs) + "" }
      ] });
    }
    return {
      status: function () {
        if (done) return "Service! Dinner is… chopped.";
        return "Chopped: " + (perfect + good) + " / " + TOTAL + (judgeT > 0 ? " — " + judge : "");
      },
      down: function () {
        if (done) return;
        if (!started) { started = true; audio(); return; }
        chopFlash = 0.14;
        var best = -1, bestD = 1e9;
        for (var i = 0; i < notes.length; i++) {
          var d = Math.abs(notes[i].y - LINE);
          if (d < bestD) { bestD = d; best = i; }
        }
        if (best >= 0 && bestD < 58) {
          if (bestD < 26) { perfect++; judge = "PERFECT!"; blip(760, .07, "sine", .08); }
          else { good++; judge = "Good"; blip(520, .07, "sine", .06); }
          notes.splice(best, 1);
        } else { whiffs++; judge = "Whiff!"; blip(170, .08, "sawtooth", .05); }
        judgeT = 0.7;
      },
      move: function () {}, up: function () {},
      draw: function (g, dt) {
        var dark = isDark();
        if (started && !done) {
          spawnT -= dt;
          if (spawnT <= 0 && spawned < TOTAL) { spawned++; spawnT = 0.92; notes.push({ y: -30, c: VEG[spawned % VEG.length] }); }
          for (var i = notes.length - 1; i >= 0; i--) {
            notes[i].y += SPEED * dt;
            if (notes[i].y > LINE + 74) { notes.splice(i, 1); missed++; judge = "Missed…"; judgeT = 0.7; blip(140, .08, "sawtooth", .04); }
          }
          if (spawned >= TOTAL && notes.length === 0) finishRound();
        }
        if (chopFlash > 0) chopFlash -= dt;
        if (judgeT > 0) judgeT -= dt;
        // cutting board lane
        g.fillStyle = dark ? "#4a3423" : "#d9b98a"; rr(g, W / 2 - 90, 30, 180, 400, 14); g.fill();
        g.strokeStyle = dark ? "#7a5f4d" : "#b8935a"; g.lineWidth = 3; rr(g, W / 2 - 90, 30, 180, 400, 14); g.stroke();
        // side counters
        txt(g, "PERFECT", 130, 150, 15, "#35c4a0"); txt(g, "" + perfect, 130, 182, 30, dark ? "#f7e8d8" : "#33241a");
        txt(g, "GOOD", 130, 240, 15, "#57b7dd"); txt(g, "" + good, 130, 272, 30, dark ? "#f7e8d8" : "#33241a");
        txt(g, "MISSED", 590, 150, 15, "#e3352b"); txt(g, "" + missed, 590, 182, 30, dark ? "#f7e8d8" : "#33241a");
        txt(g, "LEFT", 590, 240, 15, dark ? "#c4a68d" : "#7a5f4d"); txt(g, "" + (TOTAL - spawned + notes.length), 590, 272, 30, dark ? "#f7e8d8" : "#33241a");
        // chopping line + sweet zone
        g.fillStyle = "rgba(53,196,160,.35)"; g.fillRect(W / 2 - 90, LINE - 26, 180, 52);
        g.fillStyle = "#e3352b"; g.fillRect(W / 2 - 96, LINE - 2, 192, 5);
        txt(g, "CHOP LINE", W / 2 + 128, LINE + 5, 14, "#e3352b");
        // notes (veggies)
        notes.forEach(function (n) {
          g.fillStyle = n.c; g.beginPath(); g.arc(W / 2, n.y, 21, 0, Math.PI * 2); g.fill();
          g.fillStyle = "rgba(255,255,255,.5)"; g.beginPath(); g.arc(W / 2 - 7, n.y - 7, 6, 0, Math.PI * 2); g.fill();
          g.strokeStyle = "#7fb069"; g.lineWidth = 3; g.beginPath(); g.moveTo(W / 2, n.y - 20); g.lineTo(W / 2 + 5, n.y - 28); g.stroke();
        });
        // knife flash on chop
        if (chopFlash > 0) {
          g.save(); g.translate(W / 2 + 108, LINE - 30); g.rotate(0.45);
          g.fillStyle = "#aeb9c4"; g.beginPath(); g.moveTo(-8, -58); g.lineTo(10, -58); g.lineTo(10, 6); g.quadraticCurveTo(0, 15, -8, 6); g.closePath(); g.fill();
          g.fillStyle = "#8a4b21"; rr(g, -7, -88, 15, 32, 6); g.fill();
          g.restore();
        }
        if (judgeT > 0) txt(g, judge, W / 2, 84, 26, judge === "PERFECT!" ? "#35c4a0" : (judge === "Good" ? "#57b7dd" : "#e3352b"));
        if (!started) txt(g, "Tap anywhere to start — then tap ON the line!", W / 2, 448, 18, "#0e9594");
      }
    };
  }
});
