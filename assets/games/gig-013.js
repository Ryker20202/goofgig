/* ================================================================
   GoofGig — Gig #013 (independent game module)
   ----------------------------------------------------------------
   This file is ONE game. It registers itself with the shell via
   registerGame(). To add a new game later (e.g. Gig #021):
     1. Copy this file (or gig-template.js) to gig-021.js
     2. Change its number/title/gameplay
     3. Add ONE line for it in manifest.js
   The shell (index.html) and every other gig file stay untouched.
   ================================================================ */
/* ================================================================
         GIG #013 — Sock Sort
         Drag 8 socks into their matching baskets against the clock.
         ================================================================ */
      registerGame({
        n: 13, title: "Sock Sort",
        desc: "Eight socks, four baskets, one laundry day deadline.",
        hint: '<b>Drag each sock</b> into the basket with the <b>matching colour</b>. All <b>8 socks</b> before the 30 seconds run out.',
        grades: [
          ["Laundry Legend", "Every sock found its soulmate. Beautiful."],
          ["Pair Master", "The drawer has never looked this organised."],
          ["Sock Wrangler", "Mostly pairs. One sock lives its own truth now."],
          ["Chaos Folder", "Several socks are in witness protection."],
          ["Sock Scatterer", "The laundry basket has filed for divorce."]
        ],
        thumb: function (g) {
          g.fillStyle = "#ff5a3c"; rr(g, 108, 14, 22, 44, 9); g.fill(); rr(g, 108, 48, 38, 20, 9); g.fill();
          g.fillStyle = "#0e9594"; rr(g, 168, 14, 22, 44, 9); g.fill(); rr(g, 168, 48, 38, 20, 9); g.fill();
        },
        create: function (api) {
          var COLORS = [
            { name: "red", fill: "#ff5a3c" }, { name: "teal", fill: "#0e9594" },
            { name: "gold", fill: "#ffb627" }, { name: "plum", fill: "#9b5de5" }
          ];
          var socks = [], dragS = null, sorted = 0, mistakes = 0, timeLeft = 30, started = false, done = false;
          var spots = [[120, 92], [268, 74], [430, 92], [580, 74], [190, 176], [352, 162], [512, 176], [620, 168]];
          var order = [0, 0, 1, 1, 2, 2, 3, 3];
          for (var i = order.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var tmp = order[i]; order[i] = order[j]; order[j] = tmp; }
          order.forEach(function (c, i) { socks.push({ c: c, x: spots[i][0], y: spots[i][1], home: { x: spots[i][0], y: spots[i][1] }, done: false }); });
          var baskets = COLORS.map(function (c, i) { return { c: i, x: 96 + i * 176, y: 330, w: 128, h: 74 }; });
          function finishRound() {
            done = true;
            var score = clamp(Math.round(sorted / 8 * 78 + (sorted === 8 ? timeLeft / 30 * 22 : 0) - mistakes * 3), 1, 100);
            api.finish({ score: score, rows: [
              { label: "Socks sorted", value: sorted / 8 * 100, text: sorted + " / 8", good: sorted >= 6 },
              { label: "Time left", value: timeLeft / 30 * 100, text: timeLeft.toFixed(0) + "s" }
            ] });
          }
          function drawSock(g, s) {
            g.save(); g.translate(s.x, s.y);
            g.fillStyle = COLORS[s.c].fill;
            rr(g, -13, -26, 26, 46, 10); g.fill();
            rr(g, -13, 8, 42, 24, 11); g.fill();
            g.fillStyle = "rgba(255,255,255,.55)"; g.fillRect(-13, -26, 26, 8);
            g.restore();
          }
          return {
            status: function () { return done ? "Laundry done!" : "Sorted " + sorted + " / 8 · " + Math.ceil(timeLeft) + "s left"; },
            down: function (p) {
              if (done) return;
              started = true; audio();
              for (var i = socks.length - 1; i >= 0; i--) {
                var s = socks[i];
                if (!s.done && Math.abs(p.x - s.x) < 34 && Math.abs(p.y - s.y) < 40) { dragS = s; return; }
              }
            },
            move: function (p) { if (dragS) { dragS.x = p.x; dragS.y = p.y; } },
            up: function () {
              if (!dragS || done) { dragS = null; return; }
              var s = dragS; dragS = null;
              var hit = null;
              baskets.forEach(function (b) { if (s.x > b.x - b.w / 2 && s.x < b.x + b.w / 2 && s.y > b.y - 20 && s.y < b.y + b.h) hit = b; });
              if (hit && hit.c === s.c) { s.done = true; sorted++; sndGood(); if (sorted === 8) finishRound(); }
              else { if (hit) { mistakes++; sndBad(); } s.x = s.home.x; s.y = s.home.y; }
            },
            draw: function (g, dt) {
              var dark = isDark();
              if (started && !done) { timeLeft -= dt; if (timeLeft <= 0) { timeLeft = 0; finishRound(); } }
              // floor line
              g.fillStyle = dark ? "rgba(255,255,255,.06)" : "rgba(255,255,255,.5)"; g.fillRect(0, 288, W, 4);
              // baskets
              baskets.forEach(function (b) {
                g.fillStyle = COLORS[b.c].fill; rr(g, b.x - b.w / 2, b.y, b.w, b.h, 10); g.fill();
                g.fillStyle = "rgba(0,0,0,.18)"; rr(g, b.x - b.w / 2, b.y, b.w, 18, 10); g.fill();
                txt(g, COLORS[b.c].name.toUpperCase(), b.x, b.y + 44, 15, "#fff");
              });
              // socks
              socks.forEach(function (s) { if (!s.done && s !== dragS) drawSock(g, s); });
              if (dragS) drawSock(g, dragS);
              if (!started) txt(g, "Grab a sock to start the clock", W / 2, 44, 20, dark ? "rgba(247,232,216,.8)" : "rgba(93,58,22,.7)");
              txt(g, Math.ceil(timeLeft) + "s", 46, 40, 26, timeLeft < 8 ? "#d93e22" : (dark ? "#f7e8d8" : "#33241a"));
            }
          };
        }
      });
