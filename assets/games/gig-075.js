/* ================================================================
   GoofGig — Gig #075 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #075 — Picture Level
         A picture frame swings and slowly settles. Tap once to
         nail it — score is how close to perfectly level it was.
         ================================================================ */
      registerGame({
        n: 75, title: "Picture Level",
        desc: "One nail. One swinging frame. Zero degrees or disgrace.",
        hint: 'The frame <b>swings and slowly settles</b>. <b>Tap once</b> to nail it — you are scored on how close to <b>perfectly level (0°)</b> it was at that moment.',
        grades: [
          ["Laser Level", "Zero degrees. Surveyors are taking notes."],
          ["Gallery Grade", "So level the museum wants your number."],
          ["Close Enough Carl", "A guest might notice. A picky guest."],
          ["Drunk Shelf Energy", "The photo inside is sliding to one corner."],
          ["Earthquake Decor", "That is not hung, that is falling in slow motion."]
        ],
        thumb: function (g) {
          g.save(); g.translate(150, 46); g.rotate(0.1);
          g.fillStyle = "#8a5a28"; rr(g, -42, -26, 84, 52, 4); g.fill();
          g.fillStyle = "#bfe3f2"; rr(g, -34, -18, 68, 36, 2); g.fill();
          g.fillStyle = "#e88ca0"; g.beginPath(); g.arc(0, 0, 9, 0, Math.PI * 2); g.fill();
          g.restore();
          g.fillStyle = "#555"; g.beginPath(); g.arc(150, 12, 4, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var t = 0, done = false, nailedAngle = 0, nailFlash = 0;
          function angleAt(time) {
            var amp = 10 + 28 * Math.exp(-time * 0.16); // degrees, settles over time
            return amp * Math.sin(time * 3.4);
          }
          function finishRound() {
            done = true; nailFlash = 0.5;
            var err = Math.abs(nailedAngle);
            var s = clamp(Math.round(100 - err * 2.3), 2, 100);
            if (s >= 70) sndGood(); else sndBad();
            api.finish({ score: s, rows: [
              { label: "Nailed at", value: clamp(100 - err * 2.3, 0, 100), text: nailedAngle.toFixed(1) + "°", good: err <= 6 },
              { label: "Perfection", value: 100, text: "0.0° — dead level" }
            ] });
          }
          return {
            status: function () {
              if (done) return "Nailed at " + nailedAngle.toFixed(1) + "°!";
              return "It is settling… tap to nail it level!";
            },
            down: function () {
              if (done) return;
              audio();
              nailedAngle = angleAt(t);
              blip(220, .07, "square", .07);
              finishRound();
            },
            move: function () {}, up: function () {},
            draw: function (g, dt) {
              var dark = isDark();
              if (!done) t += dt;
              if (nailFlash > 0) nailFlash -= dt;
              var ang = done ? nailedAngle : angleAt(t);
              var rad = ang * Math.PI / 180;
              var PX = W / 2, PY = 92;
              // wall
              g.fillStyle = dark ? "#2c2119" : "#f3e2c7"; g.fillRect(90, 50, W - 180, 330);
              g.strokeStyle = dark ? "#574433" : "#d9bd8f"; g.lineWidth = 3; g.strokeRect(90, 50, W - 180, 330);
              // level guide (dashed horizontal through pivot)
              g.strokeStyle = "rgba(53,196,160,.65)"; g.lineWidth = 2; g.setLineDash([8, 7]);
              g.beginPath(); g.moveTo(PX - 210, PY + 108); g.lineTo(PX + 210, PY + 108); g.stroke(); g.setLineDash([]);
              txt(g, "LEVEL", PX + 238, PY + 113, 14, "#0e9594");
              // swinging frame hung from nail
              g.save(); g.translate(PX, PY); g.rotate(rad);
              g.strokeStyle = "#777"; g.lineWidth = 2;
              g.beginPath(); g.moveTo(0, 0); g.lineTo(-120, 62); g.stroke();
              g.beginPath(); g.moveTo(0, 0); g.lineTo(120, 62); g.stroke();
              g.fillStyle = "#8a5a28"; rr(g, -128, 58, 256, 168, 8); g.fill();
              g.fillStyle = "#a5713a"; rr(g, -116, 70, 232, 144, 5); g.fill();
              g.fillStyle = "#fdf6ec"; rr(g, -104, 82, 208, 120, 3); g.fill();
              // little landscape inside
              g.fillStyle = "#bfe3f2"; g.fillRect(-104, 82, 208, 62);
              g.fillStyle = "#ffd94d"; g.beginPath(); g.arc(58, 106, 15, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#7ec850"; g.beginPath(); g.moveTo(-104, 202); g.lineTo(-30, 150); g.lineTo(28, 202); g.closePath(); g.fill();
              g.beginPath(); g.moveTo(0, 202); g.lineTo(62, 158); g.lineTo(104, 202); g.closePath(); g.fill();
              g.restore();
              // nail
              g.fillStyle = nailFlash > 0 ? "#ff5a3c" : "#555";
              g.beginPath(); g.arc(PX, PY, 7, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#999"; g.beginPath(); g.arc(PX - 2, PY - 2, 2.6, 0, Math.PI * 2); g.fill();
              // live angle readout
              txt(g, Math.abs(ang).toFixed(1) + "°", PX, 428, 26, Math.abs(ang) <= 4 ? "#0e9594" : (dark ? "#f7e8d8" : "#33241a"));
              if (!done) txt(g, "Wait for the settle… strike near 0°", PX, 44, 19, dark ? "rgba(247,232,216,.8)" : "rgba(93,58,22,.7)");
            }
          };
        }
      });
