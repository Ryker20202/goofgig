/* ================================================================
   GoofGig — Gig #004 (independent game module)
   ----------------------------------------------------------------
   This file is ONE game. It registers itself with the shell via
   registerGame(). To add a new game later (e.g. Gig #021):
     1. Copy this file (or gig-template.js) to gig-021.js
     2. Change its number/title/gameplay
     3. Add ONE line for it in manifest.js
   The shell (index.html) and every other gig file stay untouched.
   ================================================================ */
/* ================================================================
         GIG #004 — Pancake Tower
         Tap to drop each sliding pancake onto the stack. 8 drops.
         ================================================================ */
      registerGame({
        n: 4, title: "Pancake Tower",
        desc: "Eight pancakes, one wobbly tower. Alignment is everything.",
        hint: 'A pancake slides back and forth — <b>tap</b> to drop it onto the stack. <b>8 pancakes</b>, neat as you can.',
        grades: [
          ["Tower Architect", "Engineers are taking notes on that stack."],
          ["Syrup-Ready Stacker", "Tall, proud, and only slightly leaning."],
          ["Brunch Builder", "It wobbles, but breakfast is saved."],
          ["Leaning Breakfast", "That tower has a strong opinion about gravity."],
          ["Pancake Scatterer", "The floor ate well today."]
        ],
        thumb: function (g) {
          ["#e8a54b", "#f0b45e", "#e8a54b"].forEach(function (c, i) {
            g.fillStyle = c; g.beginPath(); g.ellipse(150, 66 - i * 20, 62, 13, 0, 0, Math.PI * 2); g.fill();
          });
          g.fillStyle = "#ffb627"; g.beginPath(); g.ellipse(150, 14, 16, 8, 0, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var stack = [W / 2], scores = [], cur = null, dropAnim = null, done = false, t0 = Math.random() * 9;
          var BASE_Y = 372, PH = 21;
          function topCenter() { return stack[stack.length - 1]; }
          function settle(x) {
            var off = x - topCenter();
            var s = Math.abs(off) > 88 ? 0 : clamp(Math.round(100 - Math.abs(off) * 1.15), 0, 100);
            scores.push(s);
            if (s > 0) stack.push(topCenter() + off * 0.55);
            else stack.push(topCenter());
            if (s >= 70) sndGood(); else sndBad();
            cur = null;
            if (scores.length >= 8) {
              done = true;
              var avg = Math.round(scores.reduce(function (a, b) { return a + b; }, 0) / 8);
              api.finish({ score: clamp(avg, 1, 100), rows: scores.map(function (v, i) {
                return { label: "Pancake " + (i + 1), value: v, text: v + "", good: v >= 70 };
              }) });
            }
          }
          return {
            status: function () { return done ? "Tower complete!" : "Pancake " + (scores.length + 1) + " of 8"; },
            down: function () {
              if (done || dropAnim || !cur) return;
              dropAnim = { x: cur.x, y: 96, targetY: BASE_Y - stack.length * PH - PH / 2 };
              audio();
            },
            move: function () {}, up: function () {},
            draw: function (g, dt, t) {
              var dark = isDark();
              // plate + table
              g.fillStyle = "#b9834e"; rr(g, 40, 396, 640, 30, 10); g.fill();
              g.fillStyle = dark ? "#8fa3ad" : "#c8d6dd"; g.beginPath(); g.ellipse(W / 2, BASE_Y + 16, 190, 15, 0, 0, Math.PI * 2); g.fill();
              // guide line
              g.strokeStyle = "rgba(255,90,60,.4)"; g.lineWidth = 2; g.setLineDash([6, 8]);
              g.beginPath(); g.moveTo(topCenter(), 130); g.lineTo(topCenter(), BASE_Y); g.stroke(); g.setLineDash([]);
              // stack
              stack.slice(1).concat(stack.length === 1 ? [] : []).forEach(function () {});
              for (var i = 1; i < stack.length; i++) {
                var y = BASE_Y - (i - 0.5) * PH;
                g.fillStyle = i % 2 ? "#e8a54b" : "#f0b45e";
                g.beginPath(); g.ellipse(stack[i], y, 84, PH / 2 + 3, 0, 0, Math.PI * 2); g.fill();
                g.fillStyle = "rgba(146,84,20,.35)";
                g.beginPath(); g.ellipse(stack[i], y + 3, 84, PH / 2, 0, 0, Math.PI); g.fill();
              }
              if (stack.length === 1) { // the plate-level first pancake target marker
                g.fillStyle = "#f0b45e"; g.beginPath(); g.ellipse(W / 2, BASE_Y - PH / 2, 84, PH / 2 + 3, 0, 0, Math.PI * 2); g.fill();
              }
              // sliding / falling pancake
              if (!done && !dropAnim) {
                cur = { x: W / 2 + Math.sin((t + t0) * 2.1) * 235 };
                g.fillStyle = "#f5bd66"; g.beginPath(); g.ellipse(cur.x, 96, 84, 15, 0, 0, Math.PI * 2); g.fill();
                g.fillStyle = "#ffb627"; rr(g, cur.x - 13, 82, 26, 12, 5); g.fill();
                txt(g, "TAP TO DROP", W / 2, 44, 17, dark ? "rgba(247,232,216,.75)" : "rgba(93,58,22,.65)");
              }
              if (dropAnim) {
                dropAnim.y += dt * 620;
                g.fillStyle = "#f5bd66"; g.beginPath(); g.ellipse(dropAnim.x, Math.min(dropAnim.y, dropAnim.targetY), 84, 15, 0, 0, Math.PI * 2); g.fill();
                if (dropAnim.y >= dropAnim.targetY) { var dx = dropAnim.x; dropAnim = null; settle(dx); }
              }
            }
          };
        }
      });
