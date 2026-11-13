/* ================================================================
   GoofGig — Gig #053 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #053 — Sort the Mail
         20 letters slide in. Red stamp goes left, blue goes
         right. Drag each one home before the next arrives.
         ================================================================ */
      registerGame({
        n: 53, title: "Sort the Mail",
        desc: "Twenty letters. Red stamp left, blue stamp right. No pressure.",
        hint: '<b>Drag each letter</b> to the box matching its <b>stamp colour</b>: <b>red goes left, blue goes right</b>. Twenty letters, score is your hit rate.',
        grades: [
          ["Postal Legend", "Every letter home. The mail fears and loves you."],
          ["Sorting Machine", "The post office wants your home address. For hiring."],
          ["Reliable Postie", "A route well walked. A stamp well judged."],
          ["Chaos Courier", "Several letters are now in the wrong county."],
          ["Return to Sender", "The sender is you. It still got lost."]
        ],
        thumb: function (g) {
          g.fillStyle = "#faf3e0"; rr(g, 108, 22, 84, 52, 4); g.fill();
          g.fillStyle = "#e3352b"; rr(g, 168, 28, 16, 16, 2); g.fill();
          g.fillStyle = "#e3352b"; rr(g, 66, 30, 34, 42, 4); g.fill();
          g.fillStyle = "#2b6fe3"; rr(g, 200, 30, 34, 42, 4); g.fill();
        },
        create: function (api) {
          var TOTAL = 20, seq = [], i;
          for (i = 0; i < TOTAL; i++) seq.push(Math.random() < 0.5 ? "red" : "blue");
          var idx = 0, correct = 0, streak = 0, bestStreak = 0, done = false, started = false;
          var lx = W / 2, ly = 218, dragging = false, spawnT = 0, judged = false;
          function finishRound() {
            done = true;
            var s = Math.round(correct / TOTAL * 100);
            api.finish({ score: clamp(s, 1, 100), rows: [
              { label: "Correct sorts", value: correct / TOTAL * 100, text: correct + " / " + TOTAL, good: correct >= 16 },
              { label: "Best streak", value: bestStreak / TOTAL * 100, text: "" + bestStreak }
            ] });
          }
          function next() {
            idx++;
            if (idx >= TOTAL) { sndGood(); finishRound(); return; }
            lx = W / 2; ly = 218; spawnT = 0; judged = false;
          }
          function judge(box) {
            if (judged || done) return;
            judged = true;
            if (box === seq[idx]) { correct++; streak++; if (streak > bestStreak) bestStreak = streak; blip(620, .06, "sine", .06); }
            else { streak = 0; blip(150, .09, "square", .06); }
            next();
          }
          return {
            status: function () { return done ? "Route complete!" : "Letter " + Math.min(idx + 1, TOTAL) + " / " + TOTAL + " · correct " + correct; },
            down: function (p) {
              if (done) return;
              started = true; audio();
              if (Math.abs(p.x - lx) <= 84 && Math.abs(p.y - ly) <= 56) dragging = true;
            },
            move: function (p) {
              if (!dragging || done) return;
              lx = clamp(p.x, 60, W - 60); ly = clamp(p.y, 90, 420);
              if (lx <= 196) { dragging = false; judge("red"); }
              else if (lx >= W - 196) { dragging = false; judge("blue"); }
            },
            up: function () {
              if (!dragging || done) return;
              dragging = false; lx = W / 2; ly = 218;
            },
            draw: function (g, dt) {
              var dark = isDark();
              spawnT += dt;
              // sorting boxes
              g.fillStyle = "#e3352b"; rr(g, 36, 140, 130, 190, 12); g.fill();
              g.fillStyle = "#2b6fe3"; rr(g, W - 166, 140, 130, 190, 12); g.fill();
              txt(g, "RED", 101, 128, 20, "#e3352b");
              txt(g, "BLUE", W - 101, 128, 20, "#2b6fe3");
              g.fillStyle = "rgba(0,0,0,.22)"; rr(g, 52, 168, 98, 14, 6); g.fill(); rr(g, W - 150, 168, 98, 14, 6); g.fill();
              // conveyor strip
              g.fillStyle = dark ? "#4a3423" : "#e8cfa8"; rr(g, 186, 356, 348, 20, 10); g.fill();
              if (!done) {
                // current letter (pops in)
                var sc = clamp(spawnT / 0.18, 0, 1);
                g.save(); g.translate(lx, ly); g.scale(sc, sc);
                g.fillStyle = "#faf3e0"; rr(g, -78, -50, 156, 100, 5); g.fill();
                g.strokeStyle = "#c9b995"; g.lineWidth = 2; rr(g, -78, -50, 156, 100, 5); g.stroke();
                g.beginPath(); g.moveTo(-78, -50); g.lineTo(0, 6); g.lineTo(78, -50); g.stroke();
                g.fillStyle = seq[idx] === "red" ? "#e3352b" : "#2b6fe3";
                rr(g, 44, -38, 24, 28, 3); g.fill();
                txt(g, seq[idx] === "red" ? "R" : "B", 56, -19, 17, "#fff");
                g.fillStyle = "#b7a67e"; g.fillRect(-64, 18, 74, 6); g.fillRect(-64, 32, 52, 6);
                g.restore();
                txt(g, "Letter " + (idx + 1) + " of " + TOTAL, W / 2, 416, 17, dark ? "#c4a68d" : "#7a5f4d");
              }
              if (!started) txt(g, "Drag it to the matching box!", W / 2, 66, 20, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
