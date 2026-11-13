/* ================================================================
   GoofGig — Gig #047 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #047 — Fill the Balloon Animal
         Hold to inflate a long balloon for a balloon dog.
         Release in the zone to twist it. Over = pop.
         ================================================================ */
      registerGame({
        n: 47, title: "Balloon Animal",
        desc: "Hold to inflate. Twist a dog, or pop a sausage.",
        hint: '<b>Press and hold</b> to inflate the long balloon. Let go inside the <b>zone (55–85%)</b> and it gets twisted into a dog. Inflate to 100% and it <b>pops</b>.',
        grades: [
          ["Balloon Twister Supreme", "A perfect balloon dog. Party legend status."],
          ["Party Clown Professional", "Great length, clean twist. The kids cheer."],
          ["Balloon Apprentice", "It is… dog-adjacent. Four legs. Probably."],
          ["Deflated Dreamer", "That is a balloon noodle. It twists into nothing."],
          ["Pop Specialist", "BANG. The dog is a memory and a loud noise."]
        ],
        thumb: function (g) {
          g.fillStyle = "#f78fb3";
          g.beginPath(); g.ellipse(128, 48, 26, 13, 0, 0, Math.PI * 2); g.fill();
          g.beginPath(); g.ellipse(168, 48, 30, 13, 0, 0, Math.PI * 2); g.fill();
          g.beginPath(); g.arc(104, 38, 13, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#e56b9c"; rr(g, 96, 58, 6, 18, 3); g.fill(); rr(g, 150, 58, 6, 18, 3); g.fill();
          g.fillStyle = "#33241a"; g.beginPath(); g.arc(99, 35, 2.4, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var len = 0, holding = false, started = false, done = false, popped = false, twisted = false, air = [];
          var ZONE = { lo: 55, hi: 85 };
          function finishRound() {
            done = true;
            twisted = !popped && len >= 30;
            var s;
            if (popped) s = clamp(Math.round(6 + len * 0.05), 3, 15);
            else if (len >= ZONE.lo && len <= ZONE.hi) s = clamp(Math.round(100 - Math.abs(len - 70) * 1.8), 62, 100);
            else if (len < ZONE.lo) s = clamp(Math.round(88 - (ZONE.lo - len) * 1.5), 2, 87);
            else s = clamp(Math.round(88 - (len - ZONE.hi) * 2.4), 28, 87);
            api.finish({ score: s, rows: [
              { label: "Balloon length", value: len, text: Math.round(len) + "%" + (popped ? " — POP!" : "") },
              { label: "Twist zone", value: 70, text: ZONE.lo + "–" + ZONE.hi + "%", good: !popped && len >= ZONE.lo && len <= ZONE.hi }
            ] });
          }
          return {
            status: function () {
              if (done) return popped ? "POP! Dog cancelled." : "One balloon dog, twisted!";
              return started ? "Length " + Math.round(len) + "% — release in the zone!" : "Press and HOLD to inflate!";
            },
            down: function () { if (done) return; started = true; holding = true; audio(); },
            move: function () {},
            up: function () {
              if (done || !started || !holding) return;
              holding = false;
              if (len >= ZONE.lo && len <= ZONE.hi) sndGood(); else sndBad();
              finishRound();
            },
            draw: function (g, dt, now) {
              var dark = isDark();
              if (holding && !done) {
                len = clamp(len + dt * 33, 0, 100);
                if (Math.random() < dt * 16) air.push({ x: 128, y: 236 + (Math.random() * 26 - 13), v: 200 + Math.random() * 90 });
                if (len >= 100) { popped = true; holding = false; sndBad(); finishRound(); }
              }
              for (var i = air.length - 1; i >= 0; i--) { air[i].x += air[i].v * dt; if (air[i].x > 210) air.splice(i, 1); }
              var CX = W / 2, BY = 238;
              // table
              g.fillStyle = dark ? "#4a3423" : "#e8cfa8"; g.fillRect(0, 340, W, 120);
              // pump nozzle at left
              g.fillStyle = "#aeb9c4"; rr(g, 66, BY - 14, 62, 28, 8); g.fill();
              g.fillStyle = "#7d8894"; rr(g, 118, BY - 8, 22, 16, 5); g.fill();
              // rushing air dots
              g.fillStyle = "rgba(87,183,221,.7)";
              air.forEach(function (a) { g.beginPath(); g.arc(a.x, a.y, 3.4, 0, Math.PI * 2); g.fill(); });
              if (!popped && twisted) {
                // the finished balloon dog: body, head, ears, legs, tail
                var bob = Math.sin(now / 400) * 3;
                g.fillStyle = "#f78fb3";
                g.beginPath(); g.ellipse(CX + 30, BY + bob, 92, 30, 0, 0, Math.PI * 2); g.fill();
                g.beginPath(); g.ellipse(CX - 84, BY - 24 + bob, 34, 24, -0.4, 0, Math.PI * 2); g.fill();
                g.beginPath(); g.ellipse(CX - 104, BY - 2 + bob, 13, 26, 0.3, 0, Math.PI * 2); g.fill();
                g.beginPath(); g.ellipse(CX + 128, BY - 16 + bob, 12, 30, -0.7, 0, Math.PI * 2); g.fill();
                g.fillStyle = "#e56b9c";
                rr(g, CX - 44, BY + 22 + bob, 15, 44, 7); g.fill();
                rr(g, CX + 66, BY + 22 + bob, 15, 44, 7); g.fill();
                // segment twist rings
                g.strokeStyle = "rgba(200,70,120,.65)"; g.lineWidth = 4;
                [-30, 26, 78].forEach(function (off) { g.beginPath(); g.moveTo(CX + off, BY - 28 + bob); g.lineTo(CX + off, BY + 28 + bob); g.stroke(); });
                g.fillStyle = "#33241a"; g.beginPath(); g.arc(CX - 92, BY - 30 + bob, 4, 0, Math.PI * 2); g.fill();
                g.beginPath(); g.arc(CX - 122, BY - 18 + bob, 5, 0, Math.PI * 2); g.fill();
              } else if (!popped) {
                // the long balloon grows rightward, wobbling more as it fills
                var bl = 60 + len / 100 * 400, wob2 = Math.sin(now / 120) * (1 + len / 100 * 3.4);
                var grad = g.createLinearGradient(150, BY - 30, 150, BY + 30);
                grad.addColorStop(0, "#ffb1cd"); grad.addColorStop(0.5, "#f78fb3"); grad.addColorStop(1, "#e56b9c");
                g.fillStyle = grad;
                g.beginPath(); g.ellipse(150 + bl / 2, BY + wob2, bl / 2, 21 + len * 0.05, 0, 0, Math.PI * 2); g.fill();
                g.fillStyle = "rgba(255,255,255,.5)";
                g.beginPath(); g.ellipse(150 + bl * 0.3, BY - 9 + wob2, bl * 0.2, 5, 0, 0, Math.PI * 2); g.fill();
                // knot at the nozzle
                g.fillStyle = "#e56b9c"; g.beginPath(); g.moveTo(140, BY - 8); g.lineTo(152, BY); g.lineTo(140, BY + 8); g.closePath(); g.fill();
                // strain cracks near pop territory
                if (len > 84) {
                  g.strokeStyle = "rgba(255,255,255,.85)"; g.lineWidth = 2.5;
                  g.beginPath(); g.moveTo(150 + bl * 0.62, BY - 12 + wob2); g.lineTo(150 + bl * 0.68, BY + 2 + wob2); g.lineTo(150 + bl * 0.63, BY + 12 + wob2); g.stroke();
                }
              } else {
                // popped: shreds + burst star
                g.strokeStyle = "#ffb627"; g.lineWidth = 5;
                for (var s2 = 0; s2 < 8; s2++) {
                  var a2 = s2 / 8 * Math.PI * 2;
                  g.beginPath(); g.moveTo(CX + Math.cos(a2) * 40, BY + Math.sin(a2) * 30); g.lineTo(CX + Math.cos(a2) * 74, BY + Math.sin(a2) * 54); g.stroke();
                }
                g.fillStyle = "#f78fb3";
                g.beginPath(); g.ellipse(CX - 60, BY + 52, 34, 10, 0.4, 0, Math.PI * 2); g.fill();
                g.beginPath(); g.ellipse(CX + 66, BY + 60, 28, 9, -0.3, 0, Math.PI * 2); g.fill();
              }
              // length meter
              var MX = 140, MY = 424, MW = 440;
              txt(g, "LENGTH", 88, MY + 6, 15, dark ? "#c4a68d" : "#7a5f4d");
              g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, MX, MY - 9, MW, 18, 9); g.fill();
              g.fillStyle = "rgba(53,196,160,.55)"; g.fillRect(MX + MW * ZONE.lo / 100, MY - 9, MW * (ZONE.hi - ZONE.lo) / 100, 18);
              g.fillStyle = len > ZONE.hi ? "#d93e22" : "#f78fb3"; rr(g, MX, MY - 9, MW * len / 100, 18, 9); g.fill();
              if (!started) txt(g, "Press & HOLD — release in the green!", CX, 44, 21, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
