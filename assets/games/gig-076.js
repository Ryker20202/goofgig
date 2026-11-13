/* ================================================================
   GoofGig — Gig #076 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #076 — Seed Spit
         Hold to charge the spit meter, release to fire a
         watermelon seed at the plate. Three seeds, three hopes.
         ================================================================ */
      registerGame({
        n: 76, title: "Seed Spit",
        desc: "Three watermelon seeds. One plate. Olympic-level spitting.",
        hint: '<b>Hold</b> to charge the power meter, <b>release</b> to spit. Land each of your <b>3 seeds</b> on the <b>plate</b> across the yard.',
        grades: [
          ["Seed Sniper", "Three for three. The plate never stood a chance."],
          ["Porch Champion", "Your spitting form belongs in a museum of summer."],
          ["Decent Distance", "The seeds traveled. Mostly in the right direction."],
          ["Drool Range", "Those seeds landed closer to your shoes than the plate."],
          ["Swallowed Them All", "Zero seeds out. An impressive digestive decision."]
        ],
        thumb: function (g) {
          g.fillStyle = "#7ec850"; g.beginPath(); g.ellipse(118, 62, 34, 22, -0.3, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#e88ca0"; g.beginPath(); g.ellipse(118, 62, 26, 15, -0.3, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#33241a"; g.beginPath(); g.arc(160, 34, 4, 0, Math.PI * 2); g.arc(196, 26, 4, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#ddd"; g.beginPath(); g.ellipse(232, 66, 26, 8, 0, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var seeds = 3, pts = 0, landed = [], done = false;
          var charging = false, power = 0, pdir = 1, flying = null, restTimer = 0;
          var MX = 96, MY = 342, PLATE_X = 560, GROUND = 402;
          function launch() {
            var speed = 300 + power * 3.2, a = 38 * Math.PI / 180;
            flying = { x: MX + 18, y: MY - 6, vx: Math.cos(a) * speed, vy: -Math.sin(a) * speed };
            blip(300 + power * 4, .08, "sawtooth", .05);
          }
          function resolveFlight() {
            var d = Math.abs(flying.x - PLATE_X);
            var p = clamp(Math.round(34 - Math.max(0, d - 35) * 0.32), 0, 34);
            pts += p;
            landed.push({ x: flying.x, good: d <= 35 });
            if (d <= 35) sndGood(); else if (p > 8) blip(500, .07, "sine", .06); else sndBad();
            flying = null; seeds--;
            restTimer = 0.7;
          }
          function finishRound() {
            done = true;
            var hits = landed.filter(function (l) { return l.good; }).length;
            api.finish({ score: clamp(pts, 0, 100), rows: [
              { label: "Seeds on the plate", value: hits / 3 * 100, text: hits + " / 3", good: hits >= 2 },
              { label: "Total spit points", value: clamp(pts, 0, 100), text: pts + " / 100" }
            ] });
          }
          return {
            status: function () {
              if (done) return "Spitting judged!";
              if (flying) return "Away she goes…";
              return "Seeds left: " + seeds + " — hold to charge!";
            },
            down: function () {
              if (done || flying || seeds <= 0 || charging) return;
              audio(); charging = true; power = 0; pdir = 1;
            },
            move: function () {},
            up: function () {
              if (done || !charging) return;
              charging = false;
              launch();
            },
            draw: function (g, dt) {
              var dark = isDark();
              if (charging && !done) {
                power += pdir * dt * 95;
                if (power >= 100) { power = 100; pdir = -1; }
                if (power <= 0) { power = 0; pdir = 1; }
              }
              if (flying) {
                flying.vy += 620 * dt;
                flying.x += flying.vx * dt;
                flying.y += flying.vy * dt;
                if (flying.y >= GROUND) { flying.y = GROUND; resolveFlight(); }
              }
              if (restTimer > 0 && !done) {
                restTimer -= dt;
                if (restTimer <= 0 && seeds <= 0) finishRound();
              }
              // yard
              g.fillStyle = dark ? "#274a22" : "#9ed07a"; g.fillRect(0, GROUND, W, 58);
              g.fillStyle = dark ? "#33241a" : "#caa26b"; g.fillRect(0, GROUND - 4, W, 5);
              // watermelon slice + spitter
              g.fillStyle = "#7ec850"; g.beginPath(); g.ellipse(MX, MY + 26, 52, 30, 0, 0, Math.PI); g.fill();
              g.fillStyle = "#e88ca0"; g.beginPath(); g.ellipse(MX, MY + 26, 42, 22, 0, 0, Math.PI); g.fill();
              g.fillStyle = "#ffd9a0"; g.beginPath(); g.arc(MX, MY - 22, 26, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#33241a"; g.beginPath(); g.arc(MX + 8, MY - 28, 3.4, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#c0392b"; g.beginPath(); g.ellipse(MX + 20, MY - 12, 7, 4.5, 0, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#5b8c3e"; g.beginPath(); g.arc(MX - 4, MY - 48, 9, 0, Math.PI * 2); g.fill();
              // plate target
              g.fillStyle = "#e8e8e8"; g.beginPath(); g.ellipse(PLATE_X, GROUND + 4, 52, 11, 0, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#c9c9c9"; g.beginPath(); g.ellipse(PLATE_X, GROUND + 3, 34, 7, 0, 0, Math.PI * 2); g.fill();
              txt(g, "PLATE", PLATE_X, GROUND + 34, 14, dark ? "#cfe8c9" : "#4a7a38");
              // distance marker
              g.strokeStyle = dark ? "rgba(247,232,216,.35)" : "rgba(93,58,22,.3)"; g.lineWidth = 2; g.setLineDash([5, 7]);
              g.beginPath(); g.moveTo(MX + 20, GROUND - 26); g.lineTo(PLATE_X, GROUND - 26); g.stroke(); g.setLineDash([]);
              // landed seeds
              landed.forEach(function (l) {
                g.fillStyle = "#33241a"; g.beginPath(); g.ellipse(l.x, GROUND - 2, 5, 3.4, 0.4, 0, Math.PI * 2); g.fill();
              });
              // flying seed
              if (flying) {
                g.fillStyle = "#33241a"; g.beginPath(); g.ellipse(flying.x, flying.y, 6, 4, 0.6, 0, Math.PI * 2); g.fill();
              }
              // seed in mouth when ready
              if (!flying && !done && seeds > 0) {
                g.fillStyle = "#33241a"; g.beginPath(); g.ellipse(MX + 18, MY - 8, 5, 3.4, 0.4, 0, Math.PI * 2); g.fill();
              }
              // power meter
              var PW = 380, PX = (W - PW) / 2, PY = 56;
              txt(g, "SPIT POWER", W / 2, PY - 14, 15, dark ? "#c4a68d" : "#7a5f4d");
              g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, PX, PY, PW, 20, 10); g.fill();
              g.fillStyle = "rgba(53,196,160,.55)"; g.fillRect(PX + PW * 0.52, PY, PW * 0.3, 20);
              if (charging || flying) { g.fillStyle = "#e88ca0"; rr(g, PX, PY, PW * power / 100, 20, 10); g.fill(); }
              txt(g, "Seeds: " + "●".repeat(Math.max(0, seeds)) + "○".repeat(Math.max(0, 3 - seeds)), 84, 120, 17, dark ? "#f7e8d8" : "#33241a");
              if (!charging && !flying && !done) txt(g, "Hold… aim for the green… release!", W / 2, 130, 19, dark ? "rgba(247,232,216,.8)" : "rgba(93,58,22,.7)");
            }
          };
        }
      });
