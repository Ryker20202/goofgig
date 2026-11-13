/* ================================================================
   GoofGig — Gig #072 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #072 — Popcorn Catch
         Kernels pop in wild arcs. Bowl underneath, please.
         ================================================================ */
      registerGame({
        n: 72, title: "Popcorn Catch",
        desc: "The pan pops where it wants. Your bowl has opinions too.",
        hint: '<b>Move the pointer</b> to slide the bowl. Catch the <b>popcorn mid-air</b> as it arcs out of the pan. <b>20 seconds.</b>',
        grades: [
          ["Cinema Legend", "You caught popcorn like the movie depends on it. It does now."],
          ["Snack Sommelier", "A buttery haul with minimal floor seasoning."],
          ["Bowl Professional", "Solid catching. The floor got only a tasting menu."],
          ["Kernel Chaser", "You caught some. The rest achieved escape velocity."],
          ["Floor Buffet Host", "The floor is fully catered. The bowl is a decoration."]
        ],
        thumb: function (g) {
          g.fillStyle = "#fdf6ec"; g.beginPath(); g.arc(128, 26, 9, 0, Math.PI * 2); g.arc(150, 18, 10, 0, Math.PI * 2); g.arc(170, 28, 8, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#d93e22"; g.beginPath(); g.moveTo(112, 52); g.lineTo(188, 52); g.lineTo(176, 84); g.lineTo(124, 84); g.closePath(); g.fill();
          g.fillStyle = "#fff"; rr(g, 124, 60, 52, 8, 3); g.fill();
        },
        create: function (api) {
          var bx = W / 2, tx = W / 2, kernels = [], caught = 0, floored = 0, timeLeft = 20, started = false, done = false, popT = 0.3;
          var PAN = { x: W / 2, y: 428 };
          function finishRound() {
            done = true;
            var s = clamp(Math.round(caught * 3.1 - floored * 0.7 + 8), 1, 100);
            if (caught >= 24) sndGood(); else sndBad();
            api.finish({ score: s, rows: [
              { label: "Popcorn caught", value: clamp(caught / 30 * 100, 0, 100), text: caught + " in the bowl", good: caught >= 22 },
              { label: "Hit the floor", value: clamp(floored / 20 * 100, 0, 100), text: floored + " lost to gravity" }
            ] });
          }
          return {
            status: function () { return done ? "Movie time!" : (started ? "Caught " + caught + " · " + timeLeft.toFixed(0) + "s left" : "Move to ready the bowl!"); },
            down: function (p) { started = true; tx = p.x; audio(); },
            move: function (p) { started = true; tx = p.x; },
            up: function () {},
            draw: function (g, dt) {
              var dark = isDark();
              if (started && !done) {
                timeLeft -= dt;
                popT -= dt;
                if (popT <= 0) {
                  popT = 0.34 + Math.random() * 0.2;
                  kernels.push({ x: PAN.x + (Math.random() * 30 - 15), y: PAN.y - 14, vx: (Math.random() * 2 - 1) * 230, vy: -(540 + Math.random() * 170), popped: false });
                  blip(300 + Math.random() * 200, .03, "square", .03);
                }
                if (timeLeft <= 0) finishRound();
              }
              bx += (clamp(tx, 54, W - 54) - bx) * Math.min(1, dt * 14);
              // counter + floor
              g.fillStyle = dark ? "#3a2c1c" : "#d9b98a"; g.fillRect(0, 442, W, 18);
              // kernels
              for (var i = kernels.length - 1; i >= 0; i--) {
                var k = kernels[i];
                if (started && !done) {
                  k.x += k.vx * dt; k.y += k.vy * dt; k.vy += 920 * dt;
                  if (k.vy > 60) k.popped = true;
                }
                if (k.popped && k.vy > 0 && k.y >= 372 && k.y <= 398 && Math.abs(k.x - bx) < 54) {
                  caught++; kernels.splice(i, 1); blip(880, .04, "sine", .05); continue;
                }
                if (k.y > 440) { floored++; kernels.splice(i, 1); continue; }
                if (k.x < 8 || k.x > W - 8) { kernels.splice(i, 1); continue; }
                g.fillStyle = k.popped ? "#fdf6ec" : "#f5c542";
                if (k.popped) {
                  g.beginPath(); g.arc(k.x - 5, k.y, 7, 0, Math.PI * 2); g.arc(k.x + 5, k.y - 3, 8, 0, Math.PI * 2); g.arc(k.x, k.y + 4, 7, 0, Math.PI * 2); g.fill();
                  g.fillStyle = "#e8c98a"; g.beginPath(); g.arc(k.x, k.y, 3, 0, Math.PI * 2); g.fill();
                } else { g.beginPath(); g.ellipse(k.x, k.y, 5, 7, 0.5, 0, Math.PI * 2); g.fill(); }
              }
              // bowl (catch zone) with caught pile
              g.fillStyle = "#d93e22";
              g.beginPath(); g.moveTo(bx - 58, 380); g.lineTo(bx + 58, 380); g.lineTo(bx + 44, 424); g.lineTo(bx - 44, 424); g.closePath(); g.fill();
              g.fillStyle = "#ffffff"; rr(g, bx - 58, 388, 116, 10, 4); g.fill();
              g.fillStyle = "#fdf6ec";
              for (var m = 0; m < Math.min(caught, 8); m++) { g.beginPath(); g.arc(bx - 35 + (m * 31) % 70, 372 - Math.floor(m / 4) * 9, 8, 0, Math.PI * 2); g.fill(); }
              // pan
              g.fillStyle = "#39424a"; rr(g, PAN.x - 62, PAN.y, 124, 16, 7); g.fill();
              g.fillStyle = "#f5c542";
              for (var u = 0; u < 6; u++) { g.beginPath(); g.ellipse(PAN.x - 40 + u * 16, PAN.y - 2, 5, 4, 0, 0, Math.PI * 2); g.fill(); }
              txt(g, started ? timeLeft.toFixed(0) + "s" : "20s", 640, 60, 28, dark ? "#f7e8d8" : "#33241a");
              txt(g, "CAUGHT " + caught, 84, 60, 20, "#b32e18");
              if (!started) txt(g, "Catch them on the way down!", W / 2, 130, 21, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
