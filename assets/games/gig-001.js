/* ================================================================
   GoofGig — Gig #001 (independent game module)
   ----------------------------------------------------------------
   This file is ONE game. It registers itself with the shell via
   registerGame(). To add a new game later (e.g. Gig #021):
     1. Copy this file (or gig-template.js) to gig-021.js
     2. Change its number/title/gameplay
     3. Add ONE line for it in manifest.js
   The shell (index.html) and every other gig file stay untouched.
   ================================================================ */
/* ================================================================
         GIG #001 — Cut It Fair! (original module, unchanged gameplay)
         Drag down through the slippery loaf: 4 cuts, 5 equal pieces.
         ================================================================ */
      registerGame({
        n: 1, title: "Cut It Fair!",
        desc: "Slice the slippery loaf into 5 equal pieces. Sounds easy. Isn't.",
        hint: 'Drag <b>down</b> through the loaf — <b>4 cuts</b>, <b>5 equal pieces</b>. Careful: the cake is <b>slippery</b>.',
        scoreLabel: "FAIRNESS",
        grades: [
          ["Cake Surgeon", "Surgical. Those pieces are twins."],
          ["Fair & Square Baker", "Nobody at the table can complain."],
          ["Close Enough Chef", "One lucky cousin gets the big slice."],
          ["Rusty Knife Rookie", "The loaf fought back. Respectable effort."],
          ["Chaos Baker", "Five pieces, five different life choices."]
        ],
        thumb: function (g) {
          g.fillStyle = "#a9743f"; rr(g, 30, 66, 240, 12, 5); g.fill();
          var grad = g.createLinearGradient(0, 22, 0, 68);
          grad.addColorStop(0, "#f0b45e"); grad.addColorStop(1, "#d98e35");
          g.fillStyle = grad; rr(g, 55, 24, 190, 44, 14); g.fill();
          g.strokeStyle = "rgba(255,246,230,.9)"; g.lineWidth = 3;
          [0.25, 0.45, 0.65, 0.83].forEach(function (f) {
            g.beginPath(); g.moveTo(55 + 190 * f, 27); g.lineTo(55 + 190 * f, 65); g.stroke();
          });
        },
        create: function (api) {
          var LOAF_W = 540, LOAF_H = 118, LOAF_TOP = 196;
          var BASE_X = (W - LOAF_W) / 2, BOARD_Y = LOAF_TOP + LOAF_H + 8;
          var reduced = api.reduced;
          var cuts = [], phase = "play";
          var slideX = 0, slideTarget = 0, slideVel = 0;
          var wiggleT = 99, sepT = 0, drag = null, denyT = 0, denyX = 0, finishTimer = -1;

          function boundaries() { return [0].concat(cuts, [1]); }
          function loafLeft() { return BASE_X + slideX; }

          function drawCakePiece(g, x, y, w, h, faceL, faceR) {
            var grad = g.createLinearGradient(0, y, 0, y + h);
            grad.addColorStop(0, "#f2b761"); grad.addColorStop(0.55, "#e09c3d"); grad.addColorStop(1, "#cf8430");
            g.fillStyle = grad;
            rr(g, x, y, w, h, Math.min(22, w / 2)); g.fill();
            g.fillStyle = "rgba(255,236,200,.55)";
            rr(g, x + 4, y + 4, Math.max(0, w - 8), h * 0.3, Math.min(16, w / 2)); g.fill();
            g.fillStyle = "#fbe7bd";
            if (faceL) { rr(g, x, y + 5, 7, h - 10, 3); g.fill(); }
            if (faceR) { rr(g, x + w - 7, y + 5, 7, h - 10, 3); g.fill(); }
            g.strokeStyle = "rgba(146,84,20,.5)"; g.lineWidth = 3; g.lineCap = "round";
            var n = Math.max(1, Math.floor(w / 46));
            for (var i = 0; i < n; i++) {
              var sx = x + (i + 0.5) * (w / n);
              g.beginPath(); g.moveTo(sx - 8, y + 16); g.lineTo(sx + 8, y + 30); g.stroke();
            }
          }
          function drawKnife(g, x, y) {
            g.save(); g.translate(x, y);
            var grad = g.createLinearGradient(0, -96, 0, 6);
            grad.addColorStop(0, "#e8edf2"); grad.addColorStop(1, "#aeb9c4");
            g.fillStyle = grad;
            g.beginPath();
            g.moveTo(-13, -96); g.lineTo(13, -96); g.lineTo(13, -12);
            g.quadraticCurveTo(13, 4, 0, 6);
            g.quadraticCurveTo(-13, 4, -13, -12);
            g.closePath(); g.fill();
            g.strokeStyle = "rgba(70,85,100,.5)"; g.lineWidth = 2; g.stroke();
            g.fillStyle = "#8a4b21"; rr(g, -10, -138, 20, 44, 8); g.fill();
            g.fillStyle = "#c98d4e"; rr(g, -10, -138, 7, 44, 3); g.fill();
            g.restore();
          }
          function attemptCut(x) {
            var f = (x - loafLeft()) / LOAF_W;
            var tooThin = cuts.some(function (c) { return Math.abs(c - f) < 0.05; });
            if (f < 0.05 || f > 0.95 || tooThin) { denyT = 1; denyX = x; sndBad(); return; }
            cuts.push(f); cuts.sort(function (a, b) { return a - b; });
            blip(190, 0.12, "triangle", 0.22); blip(90, 0.16, "sine", 0.2, 0.02);
            wiggleT = 0;
            var amp = reduced ? 4 : 17;
            slideTarget = clamp(slideTarget + (Math.random() * 2 - 1) * amp, -26, 26);
            if (cuts.length === 4) finishTimer = 0.45;
          }
          function finishRound() {
            phase = "done";
            var b = boundaries(), sizes = [];
            for (var i = 0; i < 5; i++) sizes.push((b[i + 1] - b[i]) * 100);
            var mad = sizes.reduce(function (s, v) { return s + Math.abs(v - 20); }, 0) / 5;
            var fairness = clamp(Math.round(100 - mad * 4), 1, 100);
            api.finish({
              score: fairness,
              rows: sizes.map(function (s, i) {
                return { label: "Piece " + (i + 1), value: clamp(s * 2.5, 4, 100), text: s.toFixed(1) + "%", good: Math.abs(s - 20) <= 2 };
              }),
              extra: { sizes: sizes }
            });
          }
          return {
            status: function () {
              if (phase === "done") return "All cut!";
              var left = 4 - cuts.length;
              var s = left + (left === 1 ? " cut" : " cuts") + " left ";
              for (var i = 0; i < 4; i++) s += i < cuts.length ? "●" : "○";
              return s;
            },
            down: function (p) { if (phase === "play") drag = { x: p.x, y: p.y, startY: p.y, cutDone: false }; },
            move: function (p) {
              if (!drag || phase !== "play") return;
              drag.x = p.x; drag.y = p.y;
              if (!drag.cutDone && drag.y > LOAF_TOP + LOAF_H + 14 && drag.y > drag.startY + 40) {
                drag.cutDone = true; attemptCut(drag.x);
              }
            },
            up: function () { drag = null; },
            draw: function (g, dt) {
              if (finishTimer > 0) { finishTimer -= dt; if (finishTimer <= 0) finishRound(); }
              slideVel += (slideTarget - slideX) * 0.14; slideVel *= 0.72; slideX += slideVel;
              if (phase === "done" && sepT < 1) sepT = Math.min(1, sepT + dt * 2.6);
              if (denyT > 0) denyT -= dt * 2.4;
              var dark = isDark();
              g.fillStyle = dark ? "rgba(255,182,39,.08)" : "rgba(255,90,60,.07)";
              g.fillRect(0, BOARD_Y + 54, W, 90);
              var bg = g.createLinearGradient(0, BOARD_Y, 0, BOARD_Y + 52);
              bg.addColorStop(0, "#b9834e"); bg.addColorStop(1, "#96682f");
              g.fillStyle = bg; rr(g, 36, BOARD_Y, W - 72, 52, 14); g.fill();
              g.strokeStyle = "rgba(90,55,15,.35)"; g.lineWidth = 2;
              [14, 27, 40].forEach(function (dy) {
                g.beginPath(); g.moveTo(52, BOARD_Y + dy); g.lineTo(W - 52, BOARD_Y + dy); g.stroke();
              });
              g.fillStyle = "rgba(90,55,15,.4)";
              g.beginPath(); g.ellipse(120, BOARD_Y + 26, 12, 5, 0.3, 0, Math.PI * 2); g.fill();
              g.beginPath(); g.ellipse(590, BOARD_Y + 20, 9, 4, -0.4, 0, Math.PI * 2); g.fill();
              var squash = 1, stretch = 1;
              if (wiggleT < 1.2) {
                var wob = Math.sin(wiggleT * 16) * Math.exp(-wiggleT * 4) * (reduced ? 0.01 : 0.035);
                squash = 1 - Math.abs(wob); stretch = 1 + wob; wiggleT += dt;
              }
              var lh = LOAF_H * squash, ly = LOAF_TOP + (LOAF_H - lh);
              var lx = loafLeft() - (stretch - 1) * LOAF_W / 2, lw = LOAF_W * stretch;
              g.fillStyle = "rgba(90,50,10,.18)";
              g.beginPath(); g.ellipse(W / 2 + slideX * 0.6, BOARD_Y + 6, LOAF_W / 2 + 16, 12, 0, 0, Math.PI * 2); g.fill();
              var b = boundaries(), i, px, pw;
              if (phase === "done") {
                for (i = 0; i < 5; i++) {
                  px = lx + b[i] * lw + (i - 2) * 7 * sepT;
                  pw = (b[i + 1] - b[i]) * lw - (i > 0 && i < 4 ? 3 : 0) * sepT - (i === 0 || i === 4 ? 1.5 : 0) * sepT;
                  drawCakePiece(g, px, ly, Math.max(10, pw), lh, i > 0, i < 4);
                  txt(g, ((b[i + 1] - b[i]) * 100).toFixed(0) + "%", px + pw / 2, BOARD_Y + 82, 19, dark ? "#f7e8d8" : "#5d3a16");
                }
              } else {
                drawCakePiece(g, lx, ly, lw, lh, false, false);
                cuts.forEach(function (f) {
                  var cx = lx + f * lw;
                  g.fillStyle = "#fbe7bd"; g.fillRect(cx - 3, ly + 4, 6, lh - 8);
                  g.fillStyle = "rgba(120,66,14,.55)"; g.fillRect(cx - 0.75, ly + 4, 1.5, lh - 8);
                });
                if (drag) {
                  g.strokeStyle = dark ? "rgba(247,232,216,.45)" : "rgba(51,36,26,.4)"; g.lineWidth = 2; g.setLineDash([7, 7]);
                  g.beginPath(); g.moveTo(drag.x, 24); g.lineTo(drag.x, BOARD_Y); g.stroke(); g.setLineDash([]);
                  drawKnife(g, drag.x, drag.y);
                } else {
                  txt(g, cuts.length === 0 ? "Press and drag down through the loaf" : "Again! " + (4 - cuts.length) + " to go",
                    W / 2, 66, 21, dark ? "rgba(247,232,216,.8)" : "rgba(93,58,22,.7)");
                }
                if (denyT > 0) {
                  txt(g, "Too thin! Give it some cake.", W / 2, 104, 20, "rgba(217,62,34," + clamp(denyT, 0, 1) + ")");
                  g.strokeStyle = "rgba(217,62,34," + clamp(denyT, 0, 1) + ")"; g.lineWidth = 4;
                  g.beginPath(); g.moveTo(denyX - 11, LOAF_TOP - 26); g.lineTo(denyX + 11, LOAF_TOP - 4);
                  g.moveTo(denyX + 11, LOAF_TOP - 26); g.lineTo(denyX - 11, LOAF_TOP - 4); g.stroke();
                }
              }
            }
          };
        }
      });
