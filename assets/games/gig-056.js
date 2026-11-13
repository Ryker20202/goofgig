/* ================================================================
   GoofGig — Gig #056 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #056 — Wind the Clock
         Drag in circles around the key to wind the spring.
         Stop in the zone — over-wind and it sproings.
         ================================================================ */
      registerGame({
        n: 56, title: "Wind the Clock",
        desc: "Wind the spring into the green zone. Greed makes it sproing.",
        hint: '<b>Drag in circles</b> around the winding key to fill the <b>wind meter</b>. <b>Let go</b> inside the <b>green zone (70–85%)</b>. Hit 100% and the spring <b>sproings</b>.',
        grades: [
          ["Horologist Supreme", "Wound to perfection. Time itself is impressed."],
          ["Clockwork Artist", "That spring is purring like a tiny metal cat."],
          ["Reliable Winder", "Ticking nicely. Grandpa would approve."],
          ["Underwound", "That clock will nap through every appointment."],
          ["Spring Sproinger", "BOING. The spring has left the building."]
        ],
        thumb: function (g) {
          g.fillStyle = "#f7e8d8"; g.beginPath(); g.arc(138, 46, 34, 0, Math.PI * 2); g.fill();
          g.strokeStyle = "#8a5a28"; g.lineWidth = 4; g.stroke();
          g.strokeStyle = "#33241a"; g.lineWidth = 3;
          g.beginPath(); g.moveTo(138, 46); g.lineTo(138, 24); g.moveTo(138, 46); g.lineTo(154, 54); g.stroke();
          g.fillStyle = "#ffb627"; g.beginPath(); g.arc(196, 46, 12, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var K = { x: W / 2 + 168, y: 216 };
          var ZONE = { lo: 70, hi: 85 };
          var wind = 0, keyAng = 0, holding = false, lastAng = 0, hasAng = false;
          var started = false, done = false, sproinged = false, handAng = 0;
          function finishRound() {
            done = true;
            var s;
            if (sproinged) s = clamp(Math.round(wind * 0.28), 2, 30);
            else if (wind >= ZONE.lo && wind <= ZONE.hi) s = clamp(Math.round(100 - Math.abs(wind - 77.5) * 1.6), 60, 100);
            else if (wind < ZONE.lo) s = clamp(Math.round(88 - (ZONE.lo - wind) * 1.1), 2, 87);
            else s = clamp(Math.round(88 - (wind - ZONE.hi) * 2.4), 30, 87);
            api.finish({ score: s, rows: [
              { label: "Your wind", value: Math.round(wind), text: Math.round(wind) + "%" + (sproinged ? " — SPROING!" : "") },
              { label: "Sweet zone", value: 77, text: ZONE.lo + "–" + ZONE.hi + "%", good: !sproinged && wind >= ZONE.lo && wind <= ZONE.hi }
            ] });
          }
          return {
            status: function () {
              if (done) return sproinged ? "SPROING!" : "Wound and judged!";
              return started ? "Wind " + Math.round(wind) + "% — let go in the green!" : "Circle the key to wind!";
            },
            down: function (p) {
              if (done) return;
              started = true; holding = true; audio();
              lastAng = Math.atan2(p.y - K.y, p.x - K.x); hasAng = true;
            },
            move: function (p) {
              if (!holding || done) return;
              var a = Math.atan2(p.y - K.y, p.x - K.x);
              if (hasAng) {
                var d = a - lastAng;
                while (d > Math.PI) d -= Math.PI * 2;
                while (d < -Math.PI) d += Math.PI * 2;
                var ad = Math.abs(d);
                keyAng += d;
                wind = clamp(wind + ad / (Math.PI * 2) * 22, 0, 100);
                if (wind >= 100) { sproinged = true; sndBad(); finishRound(); }
              }
              lastAng = a; hasAng = true;
            },
            up: function () {
              if (done || !started || !holding) { holding = false; return; }
              holding = false; hasAng = false;
              if (wind > 0) {
                if (wind >= ZONE.lo && wind <= ZONE.hi) sndGood(); else sndBad();
                finishRound();
              }
            },
            draw: function (g, dt, now) {
              var dark = isDark();
              handAng += dt * (0.4 + wind * 0.09);
              // clock body
              g.fillStyle = dark ? "#6e4f30" : "#8a5a28"; g.beginPath(); g.arc(W / 2 - 40, 216, 122, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#f7e8d8"; g.beginPath(); g.arc(W / 2 - 40, 216, 108, 0, Math.PI * 2); g.fill();
              // tick marks
              g.strokeStyle = "#8a5a28"; g.lineWidth = 3;
              for (var i = 0; i < 12; i++) {
                var a = i / 12 * Math.PI * 2;
                g.beginPath();
                g.moveTo(W / 2 - 40 + Math.cos(a) * 94, 216 + Math.sin(a) * 94);
                g.lineTo(W / 2 - 40 + Math.cos(a) * 104, 216 + Math.sin(a) * 104);
                g.stroke();
              }
              // hands (spin faster the more it's wound)
              g.strokeStyle = "#33241a"; g.lineWidth = 6; g.lineCap = "round";
              g.beginPath(); g.moveTo(W / 2 - 40, 216);
              g.lineTo(W / 2 - 40 + Math.cos(handAng) * 62, 216 + Math.sin(handAng) * 62); g.stroke();
              g.lineWidth = 4;
              g.beginPath(); g.moveTo(W / 2 - 40, 216);
              g.lineTo(W / 2 - 40 + Math.cos(handAng * 0.13 - 2) * 84, 216 + Math.sin(handAng * 0.13 - 2) * 84); g.stroke();
              g.fillStyle = "#e8546d"; g.beginPath(); g.arc(W / 2 - 40, 216, 8, 0, Math.PI * 2); g.fill();
              // stem + key
              g.fillStyle = "#8a8a92"; g.fillRect(W / 2 + 78, 208, 34, 16);
              g.save(); g.translate(K.x, K.y); g.rotate(keyAng);
              g.fillStyle = "#ffb627";
              g.beginPath(); g.ellipse(-20, 0, 16, 24, 0, 0, Math.PI * 2); g.fill();
              g.beginPath(); g.ellipse(20, 0, 16, 24, 0, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#8a5a28"; g.beginPath(); g.arc(0, 0, 9, 0, Math.PI * 2); g.fill();
              g.restore();
              if (sproinged) {
                g.strokeStyle = "#ff5a3c"; g.lineWidth = 3;
                g.beginPath();
                for (var t = 0; t < 5; t++) { var sx = K.x - 60 + t * 26, sy = 120 + Math.sin(t * 2.4 + now / 90) * 16; if (t === 0) g.moveTo(sx, sy); else g.lineTo(sx, sy); }
                g.stroke();
                txt(g, "SPROING!", K.x - 10, 84, 24, "#ff5a3c");
              }
              // wind meter (right side)
              var MX = 636, MY = 110, MH = 230;
              txt(g, "WIND", MX + 15, MY - 16, 15, dark ? "#c4a68d" : "#7a5f4d");
              g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, MX, MY, 30, MH, 10); g.fill();
              g.fillStyle = "rgba(53,196,160,.55)"; g.fillRect(MX, MY + MH * (1 - ZONE.hi / 100), 30, MH * (ZONE.hi - ZONE.lo) / 100);
              g.fillStyle = wind > ZONE.hi ? "#d93e22" : "#ffb627"; rr(g, MX, MY + MH * (1 - wind / 100), 30, MH * wind / 100, 10); g.fill();
              if (!started) txt(g, "Drag in circles around the gold key!", W / 2 - 40, 386, 19, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
