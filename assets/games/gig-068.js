/* ================================================================
   GoofGig — Gig #068 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #068 — Feed the Fish
         Drop the flake as the open mouth passes under it.
         ================================================================ */
      registerGame({
        n: 68, title: "Feed the Fish",
        desc: "One picky fish. Eight flakes. Timing is everything.",
        hint: '<b>Tap</b> to drop a flake at that spot. It only counts if it lands while the fish\'s <b>mouth is open</b> and passing underneath. Feed it <b>8 times</b> in <b>25 seconds</b>.',
        grades: [
          ["Fish Sommelier", "Eight perfect drops. The fish is writing you a thank-you bubble."],
          ["Aquarium Ace", "Every flake landed like it had a reservation."],
          ["Dependable Feeder", "The fish is fed, full, and mildly impressed."],
          ["Flake Scatterer", "Some flakes fed the fish. The rest fed the gravel's dreams."],
          ["Gravel Caterer", "The fish is still hungry. The tank floor is stuffed."]
        ],
        thumb: function (g) {
          g.fillStyle = "#bfe3f2"; rr(g, 100, 8, 100, 76, 8); g.fill();
          g.fillStyle = "#7ec8e3"; rr(g, 100, 44, 100, 40, 8); g.fill();
          g.fillStyle = "#e88a3d"; g.beginPath(); g.ellipse(146, 58, 20, 11, 0, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#e88a3d"; g.beginPath(); g.moveTo(166, 58); g.lineTo(182, 48); g.lineTo(182, 68); g.closePath(); g.fill();
          g.fillStyle = "#f5c542"; g.fillRect(146, 14, 4, 4);
        },
        create: function (api) {
          var fed = 0, wasted = 0, flakes = [], timeLeft = 25, started = false, done = false;
          function fishX(now) { return W / 2 + Math.sin(now / 900) * 235; }
          function mouthOpen(now) { return Math.sin(now / 260) > 0.25; }
          function finishRound() {
            done = true;
            var s = fed >= 8 ? clamp(Math.round(76 + timeLeft / 25 * 24), 76, 100) : clamp(Math.round(fed / 8 * 75), 1, 75);
            if (fed >= 7) sndGood(); else sndBad();
            api.finish({ score: s, rows: [
              { label: "Fish fed", value: fed / 8 * 100, text: fed + " / 8 flakes", good: fed >= 8 },
              { label: "Flakes wasted", value: clamp(wasted / 8 * 100, 0, 100), text: wasted + " fed the gravel" }
            ] });
          }
          return {
            status: function () { return done ? "Feeding over!" : (started ? "Fed " + fed + " / 8 · " + timeLeft.toFixed(0) + "s" : "Tap to drop a flake!"); },
            down: function (p, now) {
              started = true; audio();
              if (done) return;
              flakes.push({ x: clamp(p.x, 16, W - 16), y: 66, open: null });
            },
            move: function () {},
            up: function () {},
            draw: function (g, dt, now) {
              var dark = isDark();
              if (started && !done) {
                timeLeft -= dt;
                if (timeLeft <= 0) finishRound();
              }
              var fx = fishX(now), open = mouthOpen(now), FY = 306;
              // tank
              g.fillStyle = dark ? "#1f3442" : "#bfe3f2"; rr(g, 40, 40, 640, 380, 14); g.fill();
              g.fillStyle = dark ? "#2b4a5e" : "#7ec8e3"; rr(g, 40, 130, 640, 290, 14); g.fill();
              g.fillStyle = "rgba(255,255,255,.35)"; rr(g, 56, 52, 14, 340, 7); g.fill();
              // plants + gravel
              g.fillStyle = "#c9b088"; g.fillRect(40, 392, 640, 28);
              g.strokeStyle = "#3f9e63"; g.lineWidth = 5;
              [110, 620].forEach(function (px) {
                g.beginPath(); g.moveTo(px, 394); g.quadraticCurveTo(px + 10, 350, px - 4, 322); g.stroke();
                g.beginPath(); g.moveTo(px + 12, 394); g.quadraticCurveTo(px + 2, 356, px + 18, 330); g.stroke();
              });
              // flakes in flight
              for (var i = flakes.length - 1; i >= 0; i--) {
                var f = flakes[i];
                if (started && !done) f.y += 240 * dt;
                if (f.y >= FY - 6) {
                  if (Math.abs(f.x - fx) < 48 && open) { fed++; blip(820, .06, "sine", .06); if (fed >= 8) { flakes.splice(i, 1); finishRound(); break; } }
                  else { wasted++; blip(220, .05, "square", .04); }
                  flakes.splice(i, 1); continue;
                }
                if (f.y > 396) { flakes.splice(i, 1); continue; }
                g.fillStyle = "#f5c542"; g.fillRect(f.x - 4, f.y - 4, 8, 8);
              }
              // fish (faces travel direction)
              var dir = Math.cos(now / 900) >= 0 ? 1 : -1;
              g.save(); g.translate(fx, FY); g.scale(dir, 1);
              g.fillStyle = "#e88a3d"; g.beginPath(); g.ellipse(0, 0, 46, 24, 0, 0, Math.PI * 2); g.fill();
              g.beginPath(); g.moveTo(-42, 0); g.lineTo(-66, -18); g.lineTo(-66, 18); g.closePath(); g.fill();
              g.fillStyle = "#f7b267"; g.beginPath(); g.ellipse(6, 6, 30, 14, 0, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#fff"; g.beginPath(); g.arc(28, -8, 7, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#33241a"; g.beginPath(); g.arc(30, -8, 3.4, 0, Math.PI * 2); g.fill();
              // mouth: open wedge or closed line at front (+x after scale)
              if (open) { g.fillStyle = "#7a2d12"; g.beginPath(); g.moveTo(44, -2); g.lineTo(28, -10); g.lineTo(28, 8); g.closePath(); g.fill(); }
              else { g.strokeStyle = "#7a2d12"; g.lineWidth = 3; g.beginPath(); g.moveTo(34, 2); g.lineTo(45, 2); g.stroke(); }
              g.restore();
              txt(g, open ? "MOUTH OPEN!" : "mouth shut…", fx, FY - 52, 16, open ? "#1d7a4f" : (dark ? "#c4a68d" : "#7a5f4d"));
              // food jar at top
              txt(g, started ? timeLeft.toFixed(0) + "s" : "25s", 640, 92, 28, dark ? "#f7e8d8" : "#33241a");
              txt(g, "FED " + fed + " / 8", 88, 92, 20, "#1d7a8c");
              if (!started) txt(g, "Tap to drop — land it in the open mouth!", W / 2, 108, 20, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
