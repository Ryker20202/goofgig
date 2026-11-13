/* ================================================================
   GoofGig — Gig #038 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #038 — Water the Sprouts
         Hold to water the seedling. Moisture climbs;
         release in the zone; over = puddle swamp.
         ================================================================ */
      registerGame({
        n: 38, title: "Water the Sprouts",
        desc: "Hold to water. A happy sprout or a tiny swamp.",
        hint: '<b>Press and hold</b> to water the seedling. Let go when the soil moisture is inside the <b>zone (55–85%)</b>. Hold to 100% and you get a <b>puddle swamp</b>.',
        grades: [
          ["Botanical Whisperer", "Perfectly watered. The sprout is writing poetry."],
          ["Green Thumb Captain", "Moist, happy soil. That sprout trusts you."],
          ["Decent Gardener", "It will grow. Probably. Eventually. Fine."],
          ["Desert Landscaper", "A light mist of water. The sprout is parched."],
          ["Swamp Architect", "You have invented a pond with one (1) plant in it."]
        ],
        thumb: function (g) {
          g.fillStyle = "#8a5a28"; rr(g, 118, 62, 64, 22, 6); g.fill();
          g.strokeStyle = "#35c4a0"; g.lineWidth = 4;
          g.beginPath(); g.moveTo(150, 62); g.quadraticCurveTo(150, 40, 150, 30); g.stroke();
          g.fillStyle = "#35c4a0";
          g.beginPath(); g.ellipse(138, 32, 11, 6, -0.6, 0, Math.PI * 2); g.fill();
          g.beginPath(); g.ellipse(162, 26, 11, 6, 0.6, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#57b7dd"; g.beginPath(); g.ellipse(196, 40, 4, 7, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(210, 52, 4, 7, 0, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var moist = 0, holding = false, started = false, done = false, swamp = false, drops = [];
          var ZONE = { lo: 55, hi: 85 };
          function finishRound() {
            done = true;
            var s;
            if (swamp) s = clamp(Math.round(8 + moist * 0.06), 4, 18);
            else if (moist >= ZONE.lo && moist <= ZONE.hi) s = clamp(Math.round(100 - Math.abs(moist - 70) * 1.8), 62, 100);
            else if (moist < ZONE.lo) s = clamp(Math.round(88 - (ZONE.lo - moist) * 1.5), 2, 87);
            else s = clamp(Math.round(88 - (moist - ZONE.hi) * 2.2), 30, 87);
            api.finish({ score: s, rows: [
              { label: "Soil moisture", value: moist, text: Math.round(moist) + "%" + (swamp ? " — it's a swamp!" : "") },
              { label: "Happy zone", value: 70, text: ZONE.lo + "–" + ZONE.hi + "%", good: !swamp && moist >= ZONE.lo && moist <= ZONE.hi }
            ] });
          }
          return {
            status: function () {
              if (done) return swamp ? "Swamp achieved." : "Sprout judged!";
              return started ? "Moisture " + Math.round(moist) + "% — release in the zone!" : "Press and HOLD to water!";
            },
            down: function () { if (done) return; started = true; holding = true; audio(); },
            move: function () {},
            up: function () {
              if (done || !started || !holding) return;
              holding = false;
              if (moist >= ZONE.lo && moist <= ZONE.hi) sndGood(); else sndBad();
              finishRound();
            },
            draw: function (g, dt, now) {
              var dark = isDark();
              if (holding && !done) {
                moist = clamp(moist + dt * 34, 0, 100);
                if (Math.random() < dt * 22) drops.push({ x: W / 2 - 130 + Math.random() * 30, y: 190, v: 300 + Math.random() * 140 });
                if (moist >= 100) { swamp = true; holding = false; sndBad(); finishRound(); }
              }
              for (var i = drops.length - 1; i >= 0; i--) { drops[i].y += drops[i].v * dt; if (drops[i].y > 322) drops.splice(i, 1); }
              var CX = W / 2;
              // ground
              g.fillStyle = dark ? "#3d2c1c" : "#cdeac0"; g.fillRect(0, 356, W, 104);
              // pot
              g.fillStyle = "#c96f3b";
              g.beginPath(); g.moveTo(CX - 78, 300); g.lineTo(CX + 78, 300); g.lineTo(CX + 60, 392); g.lineTo(CX - 60, 392); g.closePath(); g.fill();
              g.fillStyle = "#b25a2a"; rr(g, CX - 86, 286, 172, 20, 8); g.fill();
              // soil darkens with moisture
              var soilDark = Math.round(moist / 100 * 40);
              g.fillStyle = "rgb(" + (122 - soilDark) + "," + (82 - soilDark / 2) + ",40)";
              g.beginPath(); g.ellipse(CX, 300, 72, 12, 0, 0, Math.PI * 2); g.fill();
              // puddle when swamp
              if (swamp) {
                g.fillStyle = "rgba(87,183,221,.65)";
                g.beginPath(); g.ellipse(CX, 402, 190, 22, 0, 0, Math.PI * 2); g.fill();
                g.beginPath(); g.ellipse(CX - 210, 420, 90, 13, 0, 0, Math.PI * 2); g.fill();
              }
              // sprout grows a little with moisture
              var grow = 0.6 + moist / 100 * 0.7, lean = swamp ? 0.5 : Math.sin(now / 700) * 0.04;
              g.save(); g.translate(CX, 298); g.rotate(lean);
              g.strokeStyle = "#2ea87e"; g.lineWidth = 6;
              g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(4, -40 * grow, 0, -64 * grow); g.stroke();
              g.fillStyle = "#35c4a0";
              g.beginPath(); g.ellipse(-17 * grow, -56 * grow, 17 * grow, 9 * grow, -0.6, 0, Math.PI * 2); g.fill();
              g.beginPath(); g.ellipse(17 * grow, -66 * grow, 17 * grow, 9 * grow, 0.6, 0, Math.PI * 2); g.fill();
              g.restore();
              // watering can top-left, tilted, spout over the pot
              g.save(); g.translate(CX - 168, 150); g.rotate(holding ? 0.42 : 0.18);
              g.fillStyle = "#57b7dd"; rr(g, -52, -34, 104, 68, 12); g.fill();
              g.fillStyle = "#3f8fb5"; g.beginPath(); g.moveTo(46, 6); g.lineTo(96, 34); g.lineTo(88, 46); g.lineTo(42, 22); g.closePath(); g.fill();
              g.fillStyle = "#2f6e8c"; g.beginPath(); g.ellipse(94, 42, 10, 6, 0.7, 0, Math.PI * 2); g.fill();
              g.strokeStyle = "#3f8fb5"; g.lineWidth = 8;
              g.beginPath(); g.arc(0, -44, 24, Math.PI, Math.PI * 2); g.stroke();
              g.restore();
              // falling drops
              g.fillStyle = "#57b7dd";
              drops.forEach(function (d) { g.beginPath(); g.ellipse(d.x, d.y, 3.6, 6.5, 0, 0, Math.PI * 2); g.fill(); });
              // moisture meter
              var MX = 140, MY = 424, MW = 440;
              txt(g, "MOIST", 92, MY + 6, 15, dark ? "#c4a68d" : "#7a5f4d");
              g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, MX, MY - 9, MW, 18, 9); g.fill();
              g.fillStyle = "rgba(53,196,160,.55)"; g.fillRect(MX + MW * ZONE.lo / 100, MY - 9, MW * (ZONE.hi - ZONE.lo) / 100, 18);
              g.fillStyle = moist > ZONE.hi ? "#d93e22" : "#57b7dd"; rr(g, MX, MY - 9, MW * moist / 100, 18, 9); g.fill();
              if (!started) txt(g, "Press & HOLD — stop in the green!", CX, 44, 21, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
