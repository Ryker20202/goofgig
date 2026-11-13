/* ================================================================
   GoofGig — Gig #016 (independent game module)
   ----------------------------------------------------------------
   This file is ONE game. It registers itself with the shell via
   registerGame(). To add a new game later (e.g. Gig #021):
     1. Copy this file (or gig-template.js) to gig-021.js
     2. Change its number/title/gameplay
     3. Add ONE line for it in manifest.js
   The shell (index.html) and every other gig file stay untouched.
   ================================================================ */
/* ================================================================
         GIG #016 — Thread the Needle
         Guide the thread tip through a drifting needle's eye, 3 times.
         ================================================================ */
      registerGame({
        n: 16, title: "Thread the Needle",
        desc: "A tiny eye, a drifting needle, a thread with trust issues.",
        hint: '<b>Drag the thread tip</b> through the <b>eye of the needle</b>. The needle drifts — thread it <b>3 times</b>, fast and clean.',
        grades: [
          ["Needle Ninja", "Three clean threads. Sewing circles are gossiping."],
          ["Steady Stitcher", "In, in, in. The needle barely felt a thing."],
          ["Patient Pusher", "It took a moment, but the thread believes in you now."],
          ["Eye Poker", "The needle has been poked in places it didn't know it had."],
          ["Thread Tangler", "That is now a knot with a needle stuck in it."]
        ],
        thumb: function (g) {
          g.strokeStyle = "#8fa3ad"; g.lineWidth = 6; g.lineCap = "round";
          g.beginPath(); g.moveTo(96, 70); g.lineTo(196, 22); g.stroke();
          g.strokeStyle = "#ff5a3c"; g.lineWidth = 3;
          g.beginPath(); g.moveTo(96, 70); g.quadraticCurveTo(150, 30, 186, 28); g.stroke();
        },
        create: function (api) {
          var threaded = 0, misses = 0, time = 0, started = false, done = false, tip = null, inside = false, flash = 0;
          function eyePos(now) { return { x: W / 2 + Math.sin(now * 0.55) * 130, y: 196 + Math.cos(now * 0.8) * 42 }; }
          function finishRound() {
            done = true;
            var score = clamp(Math.round(100 - time * 1.1 - misses * 6), 3, 100);
            api.finish({ score: score, rows: [
              { label: "Threaded", value: 100, text: "3 / 3", good: true },
              { label: "Time", value: clamp(100 - time * 2, 0, 100), text: time.toFixed(1) + "s" },
              { label: "Needle pokes", value: clamp(100 - misses * 14, 0, 100), text: misses + "" }
            ] });
          }
          return {
            status: function () { return done ? "All threaded!" : "Threaded " + threaded + " / 3 · pokes " + misses + (started ? " · " + time.toFixed(0) + "s" : ""); },
            down: function (p) { started = true; tip = { x: p.x, y: p.y }; audio(); },
            move: function (p, now) {
              if (done || !tip) return;
              tip = { x: p.x, y: p.y };
              var e = eyePos(now);
              var inEye = Math.abs(p.x - e.x) < 17 && Math.abs(p.y - e.y) < 12;
              // needle body zone (poking the metal, not the eye)
              var onBody = !inEye && dist(p.x, p.y, e.x - 62, e.y + 26) < 66 && dist(p.x, p.y, e.x, e.y) < 96;
              if (inEye && !inside) {
                inside = true; threaded++; flash = 0.6; sndGood();
                if (threaded >= 3) finishRound();
              } else if (!inEye) {
                if (inside) inside = false;
                if (onBody && !tip.counted) { tip.counted = true; misses++; sndBad(); }
                if (!onBody) tip.counted = false;
              }
            },
            up: function () { tip = null; },
            draw: function (g, dt, now) {
              var dark = isDark();
              if (started && !done) time += dt;
              if (flash > 0) flash -= dt;
              var e = eyePos(now);
              // fabric backdrop patch
              g.fillStyle = dark ? "rgba(255,255,255,.05)" : "rgba(255,255,255,.55)";
              rr(g, 130, 84, 460, 250, 16); g.fill();
              g.strokeStyle = "rgba(227,53,43,.4)"; g.lineWidth = 3; g.setLineDash([9, 8]);
              rr(g, 130, 84, 460, 250, 16); g.stroke(); g.setLineDash([]);
              // needle: long body from lower-left of eye
              g.save(); g.translate(e.x, e.y); g.rotate(0.42);
              var grad = g.createLinearGradient(-190, 0, 20, 0);
              grad.addColorStop(0, "#aeb9c4"); grad.addColorStop(1, "#e8edf2");
              g.fillStyle = grad;
              g.beginPath(); g.moveTo(-196, -6); g.lineTo(-16, -9); g.quadraticCurveTo(14, 0, -16, 9); g.lineTo(-196, 6); g.quadraticCurveTo(-208, 0, -196, -6); g.closePath(); g.fill();
              // the eye
              g.fillStyle = dark ? "#3a2a1c" : "#fdf0dc";
              g.beginPath(); g.ellipse(0, 0, 15, 8.5, 0, 0, Math.PI * 2); g.fill();
              g.strokeStyle = "#8fa3ad"; g.lineWidth = 3; g.stroke();
              if (flash > 0) { g.strokeStyle = "#ffb627"; g.lineWidth = 5; g.beginPath(); g.ellipse(0, 0, 21, 13, 0, 0, Math.PI * 2); g.stroke(); }
              g.restore();
              // thread: from spool bottom-left to the tip
              var tp = tip || { x: 150, y: 356 };
              g.strokeStyle = "#e3352b"; g.lineWidth = 4; g.lineCap = "round";
              g.beginPath(); g.moveTo(96, 392);
              g.quadraticCurveTo(200, 300, tp.x, tp.y); g.stroke();
              g.fillStyle = "#e3352b"; g.beginPath(); g.arc(tp.x, tp.y, 6, 0, Math.PI * 2); g.fill();
              // spool
              g.fillStyle = "#b9834e"; rr(g, 74, 380, 46, 34, 5); g.fill();
              g.fillStyle = "#e3352b"; g.fillRect(80, 388, 34, 18);
              if (flash > 0) txt(g, "THREADED!", W / 2, 52, 24, "#0e9594");
              else if (!started) txt(g, "Drag the red thread tip through the eye", W / 2, 52, 20, dark ? "rgba(247,232,216,.8)" : "rgba(93,58,22,.7)");
            }
          };
        }
      });
