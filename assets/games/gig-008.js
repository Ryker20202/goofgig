/* ================================================================
   GoofGig — Gig #008 (independent game module)
   ----------------------------------------------------------------
   This file is ONE game. It registers itself with the shell via
   registerGame(). To add a new game later (e.g. Gig #021):
     1. Copy this file (or gig-template.js) to gig-021.js
     2. Change its number/title/gameplay
     3. Add ONE line for it in manifest.js
   The shell (index.html) and every other gig file stay untouched.
   ================================================================ */
/* ================================================================
         GIG #008 — Sauce Heart
         Trace the heart outline with the sauce bottle.
         ================================================================ */
      registerGame({
        n: 8, title: "Sauce Heart",
        desc: "One plate, one bottle, one wobbly romantic gesture.",
        hint: '<b>Drag</b> the sauce along the <b>heart outline</b> on the plate. Lift your finger when you have traced most of it.',
        grades: [
          ["Sauce Romantic", "A heart so clean it belongs in a gallery of snacks."],
          ["Plate Poet", "Slightly wobbly, entirely charming."],
          ["Condiment Dabbler", "It reads as a heart from most angles."],
          ["Abstract Saucier", "Modern art? Maybe. A heart? Debatable."],
          ["Sauce Scribbler", "That is a red scribble with ambitions."]
        ],
        thumb: function (g) {
          g.strokeStyle = "#e3352b"; g.lineWidth = 6; g.lineCap = "round";
          g.beginPath();
          g.moveTo(150, 74); g.bezierCurveTo(96, 44, 108, 8, 150, 30); g.bezierCurveTo(192, 8, 204, 44, 150, 74);
          g.stroke();
        },
        create: function (api) {
          var CX = W / 2, CY = 222, S = 10.5, path = [], drawing = false, done = false;
          function heartPt(t) {
            var x = 16 * Math.pow(Math.sin(t), 3);
            var y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
            return { x: CX + x * S, y: CY - y * S + 12 };
          }
          var samples = [];
          for (var i = 0; i < 72; i++) samples.push(heartPt(i / 72 * Math.PI * 2));
          function coverage() {
            var hit = 0;
            samples.forEach(function (s) {
              for (var j = 0; j < path.length; j++) if (dist(s.x, s.y, path[j].x, path[j].y) < 27) { hit++; return; }
            });
            return hit / samples.length;
          }
          function accuracy() {
            if (!path.length) return 0;
            var ok = 0;
            path.forEach(function (p) {
              var best = 1e9;
              samples.forEach(function (s) { best = Math.min(best, dist(p.x, p.y, s.x, s.y)); });
              if (best < 30) ok++;
            });
            return ok / path.length;
          }
          return {
            status: function () { return done ? "Sauced!" : "Heart traced: " + Math.round(coverage() * 100) + "%"; },
            down: function (p) { if (!done) { drawing = true; path.push({ x: p.x, y: p.y }); audio(); } },
            move: function (p) { if (drawing && !done) { var last = path[path.length - 1]; if (!last || dist(last.x, last.y, p.x, p.y) > 7) path.push({ x: p.x, y: p.y }); } },
            up: function () {
              drawing = false;
              if (done || path.length < 25) return;
              done = true;
              var cov = coverage(), acc = accuracy();
              var score = clamp(Math.round(cov * 78 + acc * 22), 1, 100);
              blip(520, .12, "triangle", .12);
              api.finish({ score: score, rows: [
                { label: "Heart traced", value: cov * 100, text: Math.round(cov * 100) + "%", good: cov >= 0.8 },
                { label: "On the line", value: acc * 100, text: Math.round(acc * 100) + "%", good: acc >= 0.8 }
              ] });
            },
            draw: function (g) {
              var dark = isDark();
              // plate
              g.fillStyle = dark ? "#4c4238" : "#fdfaf3"; g.beginPath(); g.arc(CX, CY, 178, 0, Math.PI * 2); g.fill();
              g.strokeStyle = dark ? "#6b5b49" : "#e4d9c6"; g.lineWidth = 4; g.stroke();
              g.beginPath(); g.arc(CX, CY, 148, 0, Math.PI * 2); g.stroke();
              // guide heart
              g.strokeStyle = "rgba(227,53,43,.35)"; g.lineWidth = 5; g.setLineDash([3, 11]); g.lineCap = "round";
              g.beginPath();
              samples.forEach(function (s, i) { if (i === 0) g.moveTo(s.x, s.y); else g.lineTo(s.x, s.y); });
              g.closePath(); g.stroke(); g.setLineDash([]);
              // sauce path
              if (path.length > 1) {
                g.strokeStyle = "#e3352b"; g.lineWidth = 13; g.lineCap = "round"; g.lineJoin = "round";
                g.beginPath(); g.moveTo(path[0].x, path[0].y);
                path.forEach(function (p) { g.lineTo(p.x, p.y); });
                g.stroke();
                g.strokeStyle = "rgba(255,255,255,.28)"; g.lineWidth = 4;
                g.beginPath(); g.moveTo(path[0].x, path[0].y - 3);
                path.forEach(function (p) { g.lineTo(p.x, p.y - 3); });
                g.stroke();
              }
              // bottle at last point
              var bp = drawing && path.length ? path[path.length - 1] : { x: CX + 190, y: 90 };
              g.save(); g.translate(bp.x, bp.y); g.rotate(0.7);
              g.fillStyle = "#e3352b"; rr(g, -13, -64, 26, 52, 8); g.fill();
              g.fillStyle = "#fff"; rr(g, -8, -76, 16, 13, 4); g.fill();
              g.restore();
              if (!done && path.length < 2) txt(g, "Drag to squeeze the heart", W / 2, 428, 19, dark ? "rgba(247,232,216,.8)" : "rgba(93,58,22,.7)");
            }
          };
        }
      });
