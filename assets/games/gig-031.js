/* ================================================================
   GoofGig — Gig #031 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #031 — Cuckoo Catch
         Seven appearances. The bird is rude and getting faster.
         Tap it while it's out — reflexes only.
         ================================================================ */
      registerGame({
        n: 31, title: "Cuckoo Catch",
        desc: "The cuckoo pops out 7 times, faster each time. Catch it mid-taunt.",
        hint: 'The cuckoo bursts out at <b>random moments</b>, <b>7 times</b>. <b>Tap it</b> while it is out. Your score is your <b>average reaction time</b> — misses count as very, very slow.',
        grades: [
          ["Certified Bird Nemesis", "The clock has requested a transfer."],
          ["Quick-Draw Grandma Energy", "Seven taunts, seven consequences."],
          ["Respectable Reflexes", "The bird respects you. A little."],
          ["Mostly Decorative Hands", "You waved at it several times. Politely."],
          ["The Bird Sends Postcards", "It lives in your clock and pays no rent."]
        ],
        thumb: function (g) {
          g.fillStyle = "#8a5a28"; rr(g, 122, 26, 56, 60, 6); g.fill();
          g.fillStyle = "#ffd93e"; g.beginPath(); g.arc(150, 26, 13, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#e8873a"; g.beginPath(); g.moveTo(161, 24); g.lineTo(172, 28); g.lineTo(161, 32); g.closePath(); g.fill();
          g.fillStyle = "#333"; g.beginPath(); g.arc(146, 23, 2.2, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var TOTAL = 7, round = 0, phase = "wait", waitT = 0, outT = 0, nextWait = 1.0, outStart = 0;
          var started = false, done = false, reactions = [], popAnim = 0, caughtFlash = 0;
          function stayTime() { return Math.max(0.55, 0.95 - round * 0.055); }
          function finishRound() {
            done = true;
            var sum = 0; for (var i = 0; i < TOTAL; i++) sum += (i < reactions.length ? reactions[i] : 900);
            var avg = sum / TOTAL;
            var s = clamp(Math.round(112 - avg * 0.14), 2, 100);
            api.finish({ score: s, rows: [
              { label: "Average reaction", value: clamp((700 - avg) / 6.2, 0, 100), text: Math.round(avg) + " ms", good: avg < 260 },
              { label: "Cuckoos caught", value: reactions.length / TOTAL * 100, text: reactions.length + " / " + TOTAL, good: reactions.length >= 5 }
            ] });
          }
          return {
            status: function () {
              if (done) return "The clock is silent. Suspiciously silent.";
              if (!started) return "Tap to wind the clock…";
              return "Appearance " + Math.min(round + 1, TOTAL) + " / " + TOTAL + (phase === "out" ? " — NOW!" : " — wait for it…");
            },
            down: function (p, now) {
              if (done) return;
              if (!started) { started = true; audio(); waitT = 0; return; }
              if (phase === "out" && dist(p.x, p.y, W / 2, 196) < 58) {
                reactions.push(now - outStart);
                round++; phase = "wait"; waitT = 0; nextWait = 0.8 + Math.random() * 1.1; caughtFlash = 0.4;
                if (reactions[reactions.length - 1] < 250) sndGood(); else blip(700, .07, "sine", .06);
                if (round >= TOTAL) finishRound();
              }
            },
            move: function () {}, up: function () {},
            draw: function (g, dt, now) {
              var dark = isDark();
              if (started && !done) {
                if (phase === "wait") {
                  waitT += dt;
                  if (waitT >= nextWait) { phase = "out"; outT = 0; outStart = now; popAnim = 0; blip(1050, .07, "square", .06); }
                } else {
                  outT += dt; popAnim = Math.min(1, popAnim + dt * 7);
                  if (outT >= stayTime()) { phase = "wait"; waitT = 0; nextWait = 0.8 + Math.random() * 1.1; round++; blip(200, .08, "sawtooth", .05); if (round >= TOTAL) finishRound(); }
                }
              }
              if (caughtFlash > 0) caughtFlash -= dt;
              var CX = W / 2;
              // clock house
              g.fillStyle = "#8a5a28"; rr(g, CX - 105, 250, 210, 150, 10); g.fill();
              g.fillStyle = "#6e451d";
              g.beginPath(); g.moveTo(CX - 122, 256); g.lineTo(CX, 168); g.lineTo(CX + 122, 256); g.closePath(); g.fill();
              g.fillStyle = "#fdf6ec"; g.beginPath(); g.arc(CX, 330, 40, 0, Math.PI * 2); g.fill();
              g.strokeStyle = "#55483a"; g.lineWidth = 3.5; g.lineCap = "round";
              var sw = Math.sin(now / 500) * 0.5;
              g.beginPath(); g.moveTo(CX, 330); g.lineTo(CX + Math.cos(sw - 1.57) * 26, 330 + Math.sin(sw - 1.57) * 26); g.stroke();
              g.beginPath(); g.moveTo(CX, 330); g.lineTo(CX + 30, 330 + 12); g.stroke();
              // pendulum
              g.strokeStyle = "#c9a227"; g.lineWidth = 3;
              g.beginPath(); g.moveTo(CX, 356); g.lineTo(CX + Math.sin(now / 500) * 22, 396); g.stroke();
              g.fillStyle = "#e8c33d"; g.beginPath(); g.arc(CX + Math.sin(now / 500) * 22, 398, 9, 0, Math.PI * 2); g.fill();
              // doors
              g.fillStyle = "#5e3a12"; rr(g, CX - 52, 128, 46, 84, 6); g.fill(); rr(g, CX + 6, 128, 46, 84, 6); g.fill();
              // cuckoo (pops up from behind doors)
              if (phase === "out" || caughtFlash > 0) {
                var sc = phase === "out" ? popAnim : 0.4;
                g.save(); g.translate(CX, 218); g.scale(sc, sc);
                g.fillStyle = "#57b7dd"; rr(g, -8, -6, 16, 26, 6); g.fill();
                g.fillStyle = "#ffd93e"; g.beginPath(); g.arc(0, -22, 21, 0, Math.PI * 2); g.fill();
                g.fillStyle = "#f4a940"; g.beginPath(); g.ellipse(-16, -26, 9, 5, -0.5, 0, Math.PI * 2); g.fill();
                g.beginPath(); g.ellipse(16, -26, 9, 5, 0.5, 0, Math.PI * 2); g.fill();
                g.fillStyle = "#e8873a"; g.beginPath(); g.moveTo(19, -24); g.lineTo(33, -19); g.lineTo(19, -14); g.closePath(); g.fill();
                g.fillStyle = "#263238"; g.beginPath(); g.arc(-7, -26, 3, 0, Math.PI * 2); g.fill();
                g.restore();
                if (phase === "out") txt(g, "CUCKOO!", CX, 96, 26, "#e8873a");
              }
              if (caughtFlash > 0) txt(g, "GOT IT!", CX + 120, 170, 20, "#0e9594");
              // appearance pips
              for (var i = 0; i < TOTAL; i++) {
                g.fillStyle = i < reactions.length ? "#35c4a0" : (i < round ? "#d93e22" : (dark ? "#546e7a" : "#c3ced4"));
                g.beginPath(); g.arc(CX - 90 + i * 30, 432, 8, 0, Math.PI * 2); g.fill();
              }
              if (!started) txt(g, "Tap to wind the clock!", CX, 60, 21, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
