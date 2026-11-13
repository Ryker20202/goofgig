/* ================================================================
   GoofGig — Gig #077 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #077 — Ring Toss
         Drag back and flick to toss a ring at the peg.
         Five rings — ringed or close counts.
         ================================================================ */
      registerGame({
        n: 77, title: "Ring Toss",
        desc: "Five rings, one smug little peg. Flick wisely.",
        hint: '<b>Drag back and flick</b> toward the peg to toss each ring. <b>5 rings</b> — a ringer is best, a near miss still counts a little.',
        grades: [
          ["Carnival Shark", "Five rings, pure hustle. The peg is filing a complaint."],
          ["Ring Whisperer", "The peg wears your rings like jewelry now."],
          ["Fairground Regular", "Solid tossing. The goldfish prizes fear you."],
          ["Ring Sprinkler", "Rings everywhere. The lawn is decorated, at least."],
          ["Peg's Best Friend", "The peg remains untouched and emotionally available."]
        ],
        thumb: function (g) {
          g.fillStyle = "#8a5a28"; rr(g, 138, 58, 24, 26, 3); g.fill();
          g.fillStyle = "#c0392b"; rr(g, 146, 30, 8, 32, 3); g.fill();
          g.strokeStyle = "#2471a3"; g.lineWidth = 6;
          g.beginPath(); g.arc(150, 26, 17, 0, Math.PI * 2); g.stroke();
          g.strokeStyle = "#f39c12";
          g.beginPath(); g.arc(104, 40, 13, 0, Math.PI * 2); g.stroke();
        },
        create: function (api) {
          var rings = 5, score = 0, ringed = 0, nears = 0, done = false;
          var drag = null, flying = null, resting = [], restTimer = 0;
          var PEG_X = 520, PEG_TOP = 196, GROUND = 402, HAND_X = 150, HAND_Y = 330;
          function resolve() {
            var d = Math.abs(flying.x - PEG_X);
            var onPeg = d <= 24 && flying.y < PEG_TOP + 60;
            if (onPeg) { score += 20; ringed++; resting.push({ x: PEG_X, y: PEG_TOP + 34 + ringed * 7, peg: true }); sndGood(); }
            else if (d <= 64) { score += 6; nears++; resting.push({ x: flying.x, y: GROUND - 6, peg: false }); blip(500, .07, "sine", .06); }
            else { resting.push({ x: flying.x, y: GROUND - 6, peg: false }); sndBad(); }
            flying = null; rings--;
            restTimer = 0.7;
          }
          function finishRound() {
            done = true;
            api.finish({ score: clamp(score, 0, 100), rows: [
              { label: "Ringers", value: ringed / 5 * 100, text: ringed + " / 5", good: ringed >= 3 },
              { label: "Near misses", value: nears / 5 * 100, text: nears + " close" }
            ] });
          }
          return {
            status: function () {
              if (done) return "Tossing judged!";
              if (flying) return "Ring away…";
              return "Rings left: " + rings + " — drag back & flick!";
            },
            down: function (p) {
              if (done || flying || rings <= 0 || drag) return;
              audio(); drag = { sx: p.x, sy: p.y, x: p.x, y: p.y };
            },
            move: function (p) { if (drag) { drag.x = p.x; drag.y = p.y; } },
            up: function (p) {
              if (done || !drag) return;
              var vx = (drag.sx - drag.x) * 3.4 + (p.x - drag.x) * 2;
              var vy = (drag.sy - drag.y) * 3.4;
              // launching toward the peg means flicking up-right: use drag vector from hand
              vx = clamp((p.x - drag.sx) * 2.6 + 260, 60, 900);
              vy = clamp((p.y - drag.sy) * 2.6 - 120, -780, 60);
              if (Math.abs(p.x - drag.sx) < 14 && Math.abs(p.y - drag.sy) < 14) { vx = 300; vy = -330; }
              flying = { x: HAND_X, y: HAND_Y, vx: vx, vy: vy, rot: 0 };
              drag = null;
              blip(420, .06, "sine", .05);
            },
            draw: function (g, dt) {
              var dark = isDark();
              if (flying) {
                flying.vy += 560 * dt;
                flying.x += flying.vx * dt;
                flying.y += flying.vy * dt;
                flying.rot += dt * 6;
                if (flying.y >= GROUND - 6 || (Math.abs(flying.x - PEG_X) <= 24 && flying.y >= PEG_TOP + 26 && flying.vy > 0)) resolve();
                else if (flying.x > W + 40 || flying.y > 470) { flying.x = Math.min(flying.x, W - 20); flying.y = GROUND - 6; resolve(); }
              }
              if (restTimer > 0 && !done) {
                restTimer -= dt;
                if (restTimer <= 0 && rings <= 0) finishRound();
              }
              // ground
              g.fillStyle = dark ? "#3a2c1c" : "#e3c491"; g.fillRect(0, GROUND, W, 58);
              // peg on its base
              g.fillStyle = "#8a5a28"; rr(g, PEG_X - 44, GROUND - 16, 88, 16, 4); g.fill();
              g.fillStyle = "#c0392b"; rr(g, PEG_X - 6, PEG_TOP, 12, GROUND - PEG_TOP - 12, 5); g.fill();
              g.fillStyle = "#e8b13c"; g.beginPath(); g.arc(PEG_X, PEG_TOP - 2, 8, 0, Math.PI * 2); g.fill();
              txt(g, "PEG", PEG_X, GROUND + 32, 14, dark ? "#c4a68d" : "#7a5f4d");
              // resting rings
              resting.forEach(function (r) {
                g.strokeStyle = r.peg ? "#2471a3" : "#7f8c9b"; g.lineWidth = 7;
                g.beginPath(); g.ellipse(r.x, r.y, 24, 9, 0, 0, Math.PI * 2); g.stroke();
              });
              // hand + ready ring
              g.fillStyle = "#ffd9a0"; g.beginPath(); g.arc(HAND_X, HAND_Y + 26, 20, 0, Math.PI * 2); g.fill();
              if (!flying && !done && rings > 0) {
                var rx = drag ? HAND_X + (drag.x - drag.sx) * 0.4 : HAND_X;
                var ry = drag ? HAND_Y + (drag.y - drag.sy) * 0.4 : HAND_Y;
                g.strokeStyle = "#2471a3"; g.lineWidth = 8;
                g.beginPath(); g.arc(rx, ry, 27, 0, Math.PI * 2); g.stroke();
                if (drag) {
                  g.strokeStyle = dark ? "rgba(247,232,216,.5)" : "rgba(93,58,22,.45)"; g.lineWidth = 2; g.setLineDash([5, 6]);
                  g.beginPath(); g.moveTo(rx, ry); g.lineTo(rx + (drag.sx - drag.x) * 1.4 + 90, ry + (drag.sy - drag.y) * 1.4 - 50); g.stroke(); g.setLineDash([]);
                }
              }
              // flying ring
              if (flying) {
                g.strokeStyle = "#2471a3"; g.lineWidth = 8;
                g.beginPath(); g.ellipse(flying.x, flying.y, 27, 27 - Math.abs(Math.sin(flying.rot)) * 12, 0, 0, Math.PI * 2); g.stroke();
              }
              txt(g, "Rings: " + "●".repeat(Math.max(0, rings)) + "○".repeat(Math.max(0, 5 - rings)), 84, 66, 17, dark ? "#f7e8d8" : "#33241a");
              txt(g, "Ringers so far: " + ringed, 84, 94, 15, dark ? "#c4a68d" : "#7a5f4d");
              if (!drag && !flying && !done) txt(g, "Drag back, flick up-right at the peg!", W / 2, 44, 19, dark ? "rgba(247,232,216,.8)" : "rgba(93,58,22,.7)");
            }
          };
        }
      });
