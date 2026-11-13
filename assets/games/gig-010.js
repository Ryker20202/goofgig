/* ================================================================
   GoofGig — Gig #010 (independent game module)
   ----------------------------------------------------------------
   This file is ONE game. It registers itself with the shell via
   registerGame(). To add a new game later (e.g. Gig #021):
     1. Copy this file (or gig-template.js) to gig-021.js
     2. Change its number/title/gameplay
     3. Add ONE line for it in manifest.js
   The shell (index.html) and every other gig file stay untouched.
   ================================================================ */
/* ================================================================
         GIG #010 — Peel the Orange
         One continuous spiral drag peels the orange.
         ================================================================ */
      registerGame({
        n: 10, title: "Peel the Orange",
        desc: "One unbroken spiral peel. Lift off and it counts against you.",
        hint: '<b>Drag in a spiral</b> around the orange, one unbroken stroke — about <b>2½ turns</b> peels it. Lifting off breaks the peel.',
        grades: [
          ["One-Peel Wonder", "A single perfect spiral. Fruit stylists are jealous."],
          ["Citrus Sculptor", "Nearly seamless. The orange feels fancy now."],
          ["Honest Peeler", "A few breaks, but lunch is saved."],
          ["Segment Smasher", "The peel came off in interpretive chunks."],
          ["Juice Incident", "More juice outside the orange than inside it."]
        ],
        thumb: function (g) {
          g.fillStyle = "#f28c28"; g.beginPath(); g.arc(150, 46, 34, 0, Math.PI * 2); g.fill();
          g.strokeStyle = "#fdf0dc"; g.lineWidth = 5;
          g.beginPath(); g.arc(150, 46, 20, 0.4, 4.6); g.stroke();
          g.beginPath(); g.arc(150, 46, 9, 2.4, 7.2); g.stroke();
        },
        create: function (api) {
          var CX = W / 2, CY = 224, R = 118;
          var swept = 0, breaks = 0, lastAng = null, drawing = false, done = false;
          var NEED = Math.PI * 5; // 2.5 turns
          function finishRound() {
            done = true;
            var cov = clamp(swept / NEED, 0, 1);
            var score = clamp(Math.round(cov * 100 - breaks * 6), 1, 100);
            api.finish({ score: score, rows: [
              { label: "Peeled", value: cov * 100, text: Math.round(cov * 100) + "%", good: cov >= 0.85 },
              { label: "Peel breaks", value: clamp(100 - breaks * 20, 0, 100), text: breaks + "" }
            ] });
          }
          return {
            status: function () { return done ? "Peeled!" : "Peeled " + Math.round(clamp(swept / NEED, 0, 1) * 100) + "% · breaks " + breaks; },
            down: function (p) {
              if (done) return;
              var d = dist(p.x, p.y, CX, CY);
              drawing = d > 34 && d < R + 62;
              lastAng = Math.atan2(p.y - CY, p.x - CX);
              audio();
            },
            move: function (p) {
              if (!drawing || done) return;
              var d = dist(p.x, p.y, CX, CY);
              if (d < 30 || d > R + 78) { drawing = false; breaks++; sndBad(); lastAng = null; return; }
              var a = Math.atan2(p.y - CY, p.x - CX);
              var da = a - lastAng;
              while (da > Math.PI) da -= Math.PI * 2;
              while (da < -Math.PI) da += Math.PI * 2;
              swept += Math.abs(da); lastAng = a;
              if (swept >= NEED) finishRound();
            },
            up: function () {
              if (done) return;
              if (drawing && swept > 0.4) { breaks++; sndBad(); }
              drawing = false; lastAng = null;
              if (swept / NEED > 0.45) finishRound();
            },
            draw: function (g) {
              var dark = isDark();
              // plate
              g.fillStyle = dark ? "#4c4238" : "#fdfaf3"; g.beginPath(); g.ellipse(CX, CY + 128, 190, 26, 0, 0, Math.PI * 2); g.fill();
              // orange body — peeled part turns pale as the spiral grows
              var cov = clamp(swept / NEED, 0, 1);
              var grad = g.createRadialGradient(CX - 40, CY - 48, 20, CX, CY, R);
              grad.addColorStop(0, "#ffa53d"); grad.addColorStop(1, "#e87f14");
              g.fillStyle = grad; g.beginPath(); g.arc(CX, CY, R, 0, Math.PI * 2); g.fill();
              // the spiral peel track (drawn as a shrinking spiral)
              g.strokeStyle = "#fbe7bd"; g.lineWidth = 17; g.lineCap = "round";
              g.beginPath();
              var total = cov * NEED, steps = Math.max(2, Math.floor(total / 0.12));
              for (var i = 0; i <= steps; i++) {
                var a = i * 0.12, rad = R - 8 - (a / NEED) * (R - 34);
                var x = CX + Math.cos(a) * rad, y = CY + Math.sin(a) * rad;
                if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
              }
              if (cov > 0.01) g.stroke();
              // peel curl hanging off
              if (cov > 0.06) {
                var ea = total, er = R - 8 - (ea / NEED) * (R - 34);
                var ex = CX + Math.cos(ea) * er, ey = CY + Math.sin(ea) * er;
                g.strokeStyle = "#e87f14"; g.lineWidth = 13;
                g.beginPath(); g.moveTo(ex, ey); g.quadraticCurveTo(ex + 26, ey + 30, ex + 8, ey + 58); g.stroke();
              }
              // leaf
              g.fillStyle = "#57a639"; g.beginPath(); g.ellipse(CX + 16, CY - R - 2, 20, 9, -0.5, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#8a5a22"; rr(g, CX - 4, CY - R - 8, 8, 14, 3); g.fill();
              txt(g, drawing ? "Keep spiralling… don't lift!" : "Drag around the orange in a spiral", W / 2, 428, 19, dark ? "rgba(247,232,216,.8)" : "rgba(93,58,22,.7)");
            }
          };
        }
      });
