/* ================================================================
   GoofGig — Gig #065 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #065 — Egg Catch
         Three hens, zero warning. Catch 12, splat at most 2.
         ================================================================ */
      registerGame({
        n: 65, title: "Egg Catch",
        desc: "The hens drop when they feel like it. Be under them.",
        hint: '<b>Move the pointer</b> to slide the basket. Catch <b>12 eggs</b> to finish — but <b>3 splats</b> ends the round early.',
        grades: [
          ["Egg Guardian", "Twelve eggs, zero omelettes. The hens respect you now."],
          ["Basket Whisperer", "Caught the dozen with barely a crack in your composure."],
          ["Shell Shocked (Mildly)", "Most eggs survived. The floor ate the rest."],
          ["Omelette Adjacent", "The basket caught some. Gravity caught the others."],
          ["Breakfast Supplier", "You didn't catch eggs. You catered the floor's brunch."]
        ],
        thumb: function (g) {
          g.fillStyle = "#fdf6ec"; g.beginPath(); g.ellipse(150, 30, 13, 17, 0, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#b85f14"; g.beginPath(); g.moveTo(112, 56); g.lineTo(188, 56); g.lineTo(178, 86); g.lineTo(122, 86); g.closePath(); g.fill();
          g.fillStyle = "#e3352b"; g.beginPath(); g.arc(120, 10, 5, 0, Math.PI * 2); g.arc(182, 8, 5, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var bx = W / 2, tx = W / 2, eggs = [], caught = 0, splats = 0, started = false, done = false, dropT = 0.6;
          var HENS = [150, 360, 570];
          function finishRound(won) {
            done = true;
            var s = won ? clamp(70 + (2 - splats) * 15, 70, 100) : clamp(Math.round(caught / 12 * 62), 1, 62);
            if (won) sndGood(); else sndBad();
            api.finish({ score: s, rows: [
              { label: "Eggs caught", value: caught / 12 * 100, text: caught + " / 12", good: caught >= 12 },
              { label: "Splats", value: splats / 3 * 100, text: splats + " on the floor" }
            ] });
          }
          return {
            status: function () { return done ? "Egg run over!" : (started ? "Caught " + caught + " / 12 · splats " + splats + " / 3" : "Move to ready the basket!"); },
            down: function (p) { started = true; tx = p.x; audio(); },
            move: function (p) { started = true; tx = p.x; },
            up: function () {},
            draw: function (g, dt, now) {
              var dark = isDark();
              if (started && !done) {
                dropT -= dt;
                if (dropT <= 0) { dropT = 0.7 + Math.random() * 0.55; eggs.push({ x: HENS[Math.floor(Math.random() * 3)], y: 118, v: 215 + Math.random() * 80 }); }
              }
              bx += (clamp(tx, 52, W - 52) - bx) * Math.min(1, dt * 13);
              // perch + hens
              g.fillStyle = "#8a5a28"; rr(g, 60, 96, 600, 12, 6); g.fill();
              HENS.forEach(function (hx, hi) {
                var bob = Math.sin(now / 300 + hi * 2) * 2;
                g.fillStyle = "#fdf6ec"; g.beginPath(); g.ellipse(hx, 74 + bob, 30, 24, 0, 0, Math.PI * 2); g.fill();
                g.beginPath(); g.arc(hx + 26, 58 + bob, 13, 0, Math.PI * 2); g.fill();
                g.fillStyle = "#e3352b"; g.beginPath(); g.arc(hx + 26, 43 + bob, 6, 0, Math.PI * 2); g.fill();
                g.fillStyle = "#e8a33d"; g.beginPath(); g.moveTo(hx + 38, 58 + bob); g.lineTo(hx + 48, 62 + bob); g.lineTo(hx + 38, 66 + bob); g.closePath(); g.fill();
                g.fillStyle = "#33241a"; g.beginPath(); g.arc(hx + 29, 56 + bob, 2.4, 0, Math.PI * 2); g.fill();
              });
              // ground + old splats
              g.fillStyle = dark ? "#3a2c1c" : "#d9b98a"; g.fillRect(0, 440, W, 20);
              // eggs
              for (var i = eggs.length - 1; i >= 0; i--) {
                var e = eggs[i];
                if (started && !done) e.y += e.v * dt;
                if (e.y >= 392 && e.y <= 412 && Math.abs(e.x - bx) < 50) {
                  caught++; eggs.splice(i, 1); blip(700, .05, "sine", .05);
                  if (caught >= 12) { finishRound(true); break; }
                  continue;
                }
                if (e.y > 438) {
                  splats++; eggs.splice(i, 1); sndBad();
                  // splat mark
                  eggs.push({ splat: true, x: e.x, y: 446, t: 99 });
                  if (splats >= 3) { finishRound(false); break; }
                  continue;
                }
                if (e.splat) continue;
                g.fillStyle = "#fdf6ec"; g.beginPath(); g.ellipse(e.x, e.y, 12, 16, 0, 0, Math.PI * 2); g.fill();
                g.strokeStyle = "rgba(120,90,40,.35)"; g.lineWidth = 2; g.stroke();
              }
              // splat marks (static, drawn from leftover markers)
              eggs.forEach(function (e) { if (e.splat) { g.fillStyle = "#f5c542"; g.beginPath(); g.ellipse(e.x, 446, 16, 5, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = "#fdf6ec"; g.beginPath(); g.ellipse(e.x, 445, 20, 3.4, 0, 0, Math.PI * 2); g.fill(); } });
              for (var k = eggs.length - 1; k >= 0; k--) if (eggs[k].splat) eggs.splice(k, 1);
              // basket
              g.fillStyle = "#b85f14";
              g.beginPath(); g.moveTo(bx - 56, 396); g.lineTo(bx + 56, 396); g.lineTo(bx + 44, 440); g.lineTo(bx - 44, 440); g.closePath(); g.fill();
              g.fillStyle = "#fdf6ec";
              for (var m = 0; m < Math.min(caught, 6); m++) { g.beginPath(); g.ellipse(bx - 30 + m * 12, 392, 8, 10, 0, 0, Math.PI * 2); g.fill(); }
              txt(g, "EGGS " + caught + " / 12", 96, 140, 20, "#b85f14");
              txt(g, "SPLATS " + splats + " / 3", 610, 140, 20, splats >= 2 ? "#d93e22" : (dark ? "#c4a68d" : "#7a5f4d"));
              if (!started) txt(g, "Under the hen. Before the egg lands.", W / 2, 240, 21, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
