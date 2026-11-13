/* ================================================================
   GoofGig — Gig #057 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #057 — Draw the Smile
         Free-draw a mustard smile along the dashed arc on the
         hot dog. Score is how close your line hugs the target.
         ================================================================ */
      registerGame({
        n: 57, title: "Draw the Smile",
        desc: "One hot dog, one dashed arc, one wobbly mustard hand.",
        hint: '<b>Draw along the dashed arc</b> to give the hot dog its mustard smile. The closer your line hugs the dashes, the higher the score.',
        grades: [
          ["Mustard Michelangelo", "That smile belongs in a museum. A delicious museum."],
          ["Condiment Artist", "Smooth, confident, suspiciously professional."],
          ["Decent Squeezer", "A smile is a smile. The hot dog approves."],
          ["Wobbly Bottle", "It is… an expression. Of some kind."],
          ["Abstract Mustard", "The hot dog is now modern art. Unintentionally."]
        ],
        thumb: function (g) {
          g.fillStyle = "#f2c078"; rr(g, 96, 34, 108, 26, 13); g.fill();
          g.fillStyle = "#c25e3a"; rr(g, 104, 40, 92, 14, 7); g.fill();
          g.strokeStyle = "#f2b705"; g.lineWidth = 4;
          g.beginPath(); g.arc(150, 38, 30, Math.PI * 0.2, Math.PI * 0.8); g.stroke();
        },
        create: function (api) {
          var CX = W / 2, CY = 208, RX = 148, RY = 54;
          var target = [], i;
          for (i = 0; i <= 24; i++) {
            var a = Math.PI * (0.14 + 0.72 * (i / 24));
            target.push({ x: CX + Math.cos(a) * RX, y: CY + Math.sin(a) * RY });
          }
          var pts = [], drawing = false, started = false, done = false;
          function finishRound() {
            done = true;
            var sum = 0, covered = 0;
            for (var j = 0; j < target.length; j++) {
              var bd = 1e9;
              for (var k = 0; k < pts.length; k++) { var d = dist(target[j].x, target[j].y, pts[k].x, pts[k].y); if (d < bd) bd = d; }
              sum += bd; if (bd < 26) covered++;
            }
            var avg = sum / target.length, cov = covered / target.length;
            var s = clamp(Math.round((104 - avg * 2.0) * (0.55 + 0.45 * cov)), 2, 100);
            if (cov >= 0.85 && avg < 12) sndGood(); else if (s < 45) sndBad();
            api.finish({ score: s, rows: [
              { label: "Line accuracy", value: clamp(100 - avg * 2, 0, 100), text: "off by " + Math.round(avg) + " px avg", good: avg < 14 },
              { label: "Arc covered", value: Math.round(cov * 100), text: Math.round(cov * 100) + "%" }
            ] });
          }
          return {
            status: function () { return done ? "Smile delivered!" : (started ? "Keep hugging those dashes…" : "Draw the smile!"); },
            down: function (p) {
              if (done) return;
              started = true; drawing = true; audio();
              pts.push({ x: p.x, y: p.y });
            },
            move: function (p) {
              if (!drawing || done) return;
              var last = pts[pts.length - 1];
              if (!last || dist(p.x, p.y, last.x, last.y) >= 6) pts.push({ x: p.x, y: p.y });
            },
            up: function () {
              if (done) return;
              drawing = false;
              if (pts.length >= 25) finishRound();
            },
            draw: function (g) {
              var dark = isDark();
              // plate
              g.fillStyle = dark ? "#3c4a56" : "#e8eef2"; g.beginPath(); g.ellipse(W / 2, 268, 268, 118, 0, 0, Math.PI * 2); g.fill();
              // bun + sausage
              g.fillStyle = "#f2c078"; g.beginPath(); g.ellipse(W / 2, 240, 218, 62, 0, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#c25e3a"; rr(g, W / 2 - 196, 214, 392, 44, 22); g.fill();
              g.fillStyle = "rgba(255,255,255,.22)"; rr(g, W / 2 - 196, 214, 392, 15, 7); g.fill();
              // dashed target arc
              g.strokeStyle = dark ? "rgba(255,255,255,.55)" : "rgba(90,60,20,.45)";
              g.lineWidth = 3; g.setLineDash([8, 8]);
              g.beginPath();
              for (i = 0; i < target.length; i++) { if (i === 0) g.moveTo(target[i].x, target[i].y); else g.lineTo(target[i].x, target[i].y); }
              g.stroke(); g.setLineDash([]);
              // player's mustard line
              if (pts.length > 1) {
                g.strokeStyle = "#f2b705"; g.lineWidth = 10; g.lineCap = "round"; g.lineJoin = "round";
                g.beginPath();
                for (i = 0; i < pts.length; i++) { if (i === 0) g.moveTo(pts[i].x, pts[i].y); else g.lineTo(pts[i].x, pts[i].y); }
                g.stroke();
              }
              // mustard bottle follows nothing — static prop at side
              g.fillStyle = "#f2b705"; rr(g, 596, 330, 34, 58, 8); g.fill();
              g.fillStyle = "#e3352b"; rr(g, 604, 314, 18, 18, 4); g.fill();
              txt(g, "MUSTARD", 613, 406, 11, dark ? "#c4a68d" : "#7a5f4d");
              if (!started) txt(g, "Trace the dashed smile in mustard!", W / 2, 108, 20, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
              else if (!done && pts.length > 0 && pts.length < 25) txt(g, "Longer line… cover the whole arc!", W / 2, 108, 17, dark ? "rgba(247,232,216,.7)" : "rgba(93,58,22,.6)");
            }
          };
        }
      });
