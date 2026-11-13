/* ================================================================
   GoofGig — Gig #019 (independent game module)
   ----------------------------------------------------------------
   This file is ONE game. It registers itself with the shell via
   registerGame(). To add a new game later (e.g. Gig #021):
     1. Copy this file (or gig-template.js) to gig-021.js
     2. Change its number/title/gameplay
     3. Add ONE line for it in manifest.js
   The shell (index.html) and every other gig file stay untouched.
   ================================================================ */
/* ================================================================
         GIG #019 — Scoop Stack
         Drop 3 swinging scoops dead-centre onto the cone.
         ================================================================ */
      registerGame({
        n: 19, title: "Scoop Stack",
        desc: "Three scoops, one cone, dangerously wobbly physics.",
        hint: 'A scoop swings above the cone — <b>tap</b> to drop it dead centre. <b>3 scoops</b>, stack them straight.',
        grades: [
          ["Scoop Architect", "A tower of perfection. Gravity sends its regards."],
          ["Cone Captain", "Straight, tall, and ready for a photo."],
          ["Dessert Builder", "A gentle lean adds character. Probably."],
          ["Wobble Chef", "That stack is one sneeze from history."],
          ["Scoop Scatterer", "The cone is wearing none of that ice cream."]
        ],
        thumb: function (g) {
          g.fillStyle = "#ff8fa3"; g.beginPath(); g.arc(150, 30, 17, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#57b7dd"; g.beginPath(); g.arc(150, 56, 15, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#d9a05a"; g.beginPath(); g.moveTo(136, 62); g.lineTo(164, 62); g.lineTo(150, 88); g.closePath(); g.fill();
        },
        create: function (api) {
          var CONE = { x: W / 2, topY: 316 };
          var stack = [], scores = [], falling = null, done = false, t0 = Math.random() * 9;
          var COLORS = ["#ff8fa3", "#57b7dd", "#a8d97c"];
          function topCenter() { return stack.length ? stack[stack.length - 1].x : CONE.x; }
          function landScoop(x) {
            var off = x - topCenter();
            var s = Math.abs(off) > 74 ? 0 : clamp(Math.round(100 - Math.abs(off) * 1.5), 0, 100);
            scores.push(s);
            stack.push({ x: s > 0 ? topCenter() + off * 0.5 : topCenter(), c: COLORS[scores.length - 1] });
            if (s >= 70) sndGood(); else sndBad();
            falling = null;
            if (scores.length >= 3) {
              done = true;
              var avg = Math.round(scores.reduce(function (a, b) { return a + b; }, 0) / 3);
              api.finish({ score: clamp(avg, 1, 100), rows: scores.map(function (v, i) {
                return { label: "Scoop " + (i + 1), value: v, text: v + "", good: v >= 70 };
              }) });
            }
          }
          return {
            status: function () { return done ? "Stack served!" : "Scoop " + (scores.length + 1) + " of 3"; },
            down: function (p, now) {
              if (done || falling) return;
              var x = W / 2 + Math.sin((now + t0) * 1.7) * 205;
              falling = { x: x, y: 108, targetY: CONE.topY - 16 - stack.length * 52 };
              audio();
            },
            move: function () {}, up: function () {},
            draw: function (g, dt, now) {
              var dark = isDark();
              // counter
              g.fillStyle = "#b9834e"; rr(g, 40, 398, 640, 28, 10); g.fill();
              // guide
              g.strokeStyle = "rgba(255,90,60,.4)"; g.lineWidth = 2; g.setLineDash([6, 8]);
              g.beginPath(); g.moveTo(topCenter(), 150); g.lineTo(topCenter(), CONE.topY); g.stroke(); g.setLineDash([]);
              // cone
              g.fillStyle = "#d9a05a";
              g.beginPath(); g.moveTo(CONE.x - 34, CONE.topY); g.lineTo(CONE.x + 34, CONE.topY); g.lineTo(CONE.x, CONE.topY + 84); g.closePath(); g.fill();
              g.strokeStyle = "rgba(146,84,20,.55)"; g.lineWidth = 2.5;
              for (var i = 0; i < 3; i++) {
                g.beginPath(); g.moveTo(CONE.x - 30 + i * 8, CONE.topY + 12 + i * 20); g.lineTo(CONE.x + 30 - i * 8, CONE.topY + 12 + i * 20); g.stroke();
              }
              // stacked scoops
              stack.forEach(function (s, i) {
                var y = CONE.topY - 16 - i * 52;
                g.fillStyle = s.c; g.beginPath(); g.arc(s.x, y, 33, 0, Math.PI * 2); g.fill();
                g.fillStyle = "rgba(255,255,255,.4)"; g.beginPath(); g.arc(s.x - 11, y - 11, 9, 0, Math.PI * 2); g.fill();
              });
              // swinging scoop
              if (!done && !falling) {
                var x = W / 2 + Math.sin((now + t0) * 1.7) * 205;
                g.strokeStyle = dark ? "#c4a68d" : "#7a5f4d"; g.lineWidth = 3;
                g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 76); g.stroke();
                g.fillStyle = COLORS[scores.length];
                g.beginPath(); g.arc(x, 108, 33, 0, Math.PI * 2); g.fill();
                g.fillStyle = "rgba(255,255,255,.4)"; g.beginPath(); g.arc(x - 11, 97, 9, 0, Math.PI * 2); g.fill();
                txt(g, "TAP TO DROP", W / 2, 44, 17, dark ? "rgba(247,232,216,.75)" : "rgba(93,58,22,.65)");
              }
              if (falling) {
                falling.y += dt * 560;
                g.fillStyle = COLORS[scores.length];
                g.beginPath(); g.arc(falling.x, Math.min(falling.y, falling.targetY), 33, 0, Math.PI * 2); g.fill();
                if (falling.y >= falling.targetY) landScoop(falling.x);
              }
            }
          };
        }
      });
