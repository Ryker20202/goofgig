/* ================================================================
   GoofGig — Gig #085 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #085 — Candy Catapult
         Drag back the spoon and release: candy arcs toward the
         bowl. Three candies, medieval dessert warfare.
         ================================================================ */
      registerGame({
        n: 85, title: "Candy Catapult",
        desc: "A spoon, three candies, one bowl. Siege the dessert.",
        hint: '<b>Drag back</b> the spoon and <b>release</b> to launch. Arc each of your <b>3 candies</b> into the <b>bowl</b> — close landings count a little.',
        grades: [
          ["Siege Engineer", "All candies in the bowl. The dessert has surrendered."],
          ["Trebuchet Whisperer", "Your spoon work belongs in a history documentary."],
          ["Snack Artillery", "Mostly on target. The table is collateral damage."],
          ["Candy Sprinkler", "Sweets everywhere except, pointedly, the bowl."],
          ["Bowl Preservation Society", "The bowl remains pristine, empty, and smug."]
        ],
        thumb: function (g) {
          g.fillStyle = "#8a5a28"; rr(g, 100, 62, 52, 12, 4); g.fill();
          g.strokeStyle = "#c9c9c9"; g.lineWidth = 6;
          g.beginPath(); g.moveTo(120, 66); g.lineTo(150, 26); g.stroke();
          g.fillStyle = "#e88ca0"; g.beginPath(); g.arc(168, 20, 9, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#bfe3f2"; g.beginPath(); g.ellipse(238, 66, 30, 14, 0, 0, Math.PI); g.fill();
        },
        create: function (api) {
          var candies = 3, pts = 0, inBowl = 0, done = false;
          var drag = null, flying = null, settled = [], restTimer = 0;
          var PX = 132, PY = 368, BOWL_X = 578, RIM_Y = 350, GROUND = 414;
          function resolve() {
            var near = Math.abs(flying.x - BOWL_X) <= 92;
            if (flying.inBowl) {
              pts += 34; inBowl++;
              settled.push({ x: BOWL_X - 16 + inBowl * 15, y: RIM_Y + 16, bowl: true });
              sndGood();
            } else if (near) {
              pts += 10;
              settled.push({ x: flying.x, y: GROUND - 8, bowl: false });
              blip(500, .07, "sine", .06);
            } else {
              settled.push({ x: flying.x, y: GROUND - 8, bowl: false });
              sndBad();
            }
            flying = null; candies--;
            restTimer = 0.7;
          }
          function finishRound() {
            done = true;
            api.finish({ score: clamp(pts, 0, 100), rows: [
              { label: "Candies in the bowl", value: inBowl / 3 * 100, text: inBowl + " / 3", good: inBowl >= 2 },
              { label: "Siege points", value: clamp(pts, 0, 100), text: pts + " / 100" }
            ] });
          }
          return {
            status: function () {
              if (done) return "Siege judged!";
              if (flying) return "Candy away…";
              return "Candies left: " + candies + " — drag back & release!";
            },
            down: function (p) {
              if (done || flying || candies <= 0 || drag) return;
              audio(); drag = { x: p.x, y: p.y };
            },
            move: function (p) { if (drag) { drag.x = p.x; drag.y = p.y; } },
            up: function () {
              if (done || !drag) return;
              var pullX = PX - drag.x, pullY = PY - 40 - drag.y;
              drag = null;
              var mag = Math.sqrt(pullX * pullX + pullY * pullY);
              if (mag < 26) { blip(240, .05, "square", .04); return; }
              var vx = clamp(pullX * 3.4, -60, 920), vy = clamp(pullY * 3.4, -880, 240);
              flying = { x: PX + 26, y: PY - 52, vx: vx, vy: vy, inBowl: false };
              blip(380, .07, "sawtooth", .05);
            },
            draw: function (g, dt) {
              var dark = isDark();
              if (flying) {
                var prevY = flying.y;
                flying.vy += 660 * dt;
                flying.x += flying.vx * dt;
                flying.y += flying.vy * dt;
                // crossing the rim plane downward inside the opening?
                if (flying.vy > 0 && prevY < RIM_Y && flying.y >= RIM_Y && Math.abs(flying.x - BOWL_X) <= 52) flying.inBowl = true;
                if (flying.inBowl && flying.y >= RIM_Y + 14) { flying.y = RIM_Y + 14; resolve(); }
                else if (!flying.inBowl && flying.y >= GROUND - 8) { flying.y = GROUND - 8; resolve(); }
                else if (flying.x > W + 30) { flying.x = W - 14; flying.y = GROUND - 8; resolve(); }
              }
              if (restTimer > 0 && !done) {
                restTimer -= dt;
                if (restTimer <= 0 && candies <= 0) finishRound();
              }
              // table
              g.fillStyle = dark ? "#4a3423" : "#caa26b"; g.fillRect(0, GROUND, W, 46);
              // catapult base + wheels
              g.fillStyle = "#8a5a28"; rr(g, PX - 52, PY + 6, 104, 16, 5); g.fill();
              g.fillStyle = "#5d3a12"; g.beginPath(); g.arc(PX - 34, PY + 26, 11, 0, Math.PI * 2); g.fill();
              g.beginPath(); g.arc(PX + 34, PY + 26, 11, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#a5713a"; g.beginPath(); g.moveTo(PX - 8, PY + 8); g.lineTo(PX + 8, PY + 8); g.lineTo(PX, PY - 46); g.closePath(); g.fill();
              // spoon arm: pulled toward drag point
              var cupX = PX + 24, cupY = PY - 58;
              if (drag) { cupX = PX + 24 + (drag.x - (PX + 24)) * 0.45; cupY = PY - 58 + (drag.y - (PY - 58)) * 0.45; }
              g.strokeStyle = "#c9c9c9"; g.lineWidth = 7;
              g.beginPath(); g.moveTo(PX, PY - 40); g.lineTo(cupX, cupY); g.stroke();
              g.fillStyle = "#e3e3e3"; g.beginPath(); g.ellipse(cupX, cupY, 15, 9, 0.4, 0, Math.PI * 2); g.fill();
              // loaded candy
              if (!flying && !done && candies > 0) drawCandy(g, cupX, cupY - 8);
              // aim guide while dragging
              if (drag) {
                g.strokeStyle = dark ? "rgba(247,232,216,.45)" : "rgba(93,58,22,.4)"; g.lineWidth = 2; g.setLineDash([4, 7]);
                var gx = PX + 26, gy = PY - 52, gvx = clamp((PX - drag.x) * 3.4, -60, 920), gvy = clamp((PY - 40 - drag.y) * 3.4, -880, 240);
                g.beginPath(); g.moveTo(gx, gy);
                for (var s = 1; s <= 7; s++) {
                  var tt = s * 0.14;
                  g.lineTo(gx + gvx * tt, gy + gvy * tt + 330 * tt * tt);
                }
                g.stroke(); g.setLineDash([]);
              }
              // bowl
              g.fillStyle = "rgba(160,210,235,.5)";
              g.beginPath(); g.moveTo(BOWL_X - 62, RIM_Y); g.lineTo(BOWL_X + 62, RIM_Y); g.lineTo(BOWL_X + 44, GROUND - 2); g.lineTo(BOWL_X - 44, GROUND - 2); g.closePath(); g.fill();
              g.strokeStyle = dark ? "#7fb6cc" : "#5d97ad"; g.lineWidth = 3; g.stroke();
              g.fillStyle = "rgba(255,255,255,.5)"; g.fillRect(BOWL_X - 62, RIM_Y - 3, 124, 5);
              txt(g, "BOWL", BOWL_X, GROUND + 30, 14, dark ? "#c4a68d" : "#7a5f4d");
              // settled candies
              settled.forEach(function (c) { drawCandy(g, c.x, c.y); });
              // flying candy
              if (flying) drawCandy(g, flying.x, flying.y);
              function drawCandy(g2, x, y) {
                g2.fillStyle = "#e88ca0"; g2.beginPath(); g2.arc(x, y, 10, 0, Math.PI * 2); g2.fill();
                g2.fillStyle = "#d1668a";
                g2.beginPath(); g2.moveTo(x - 10, y); g2.lineTo(x - 19, y - 6); g2.lineTo(x - 19, y + 6); g2.closePath(); g2.fill();
                g2.beginPath(); g2.moveTo(x + 10, y); g2.lineTo(x + 19, y - 6); g2.lineTo(x + 19, y + 6); g2.closePath(); g2.fill();
                g2.fillStyle = "rgba(255,255,255,.65)"; g2.beginPath(); g2.arc(x - 3, y - 3, 3, 0, Math.PI * 2); g2.fill();
              }
              txt(g, "Candies: " + "●".repeat(Math.max(0, candies)) + "○".repeat(Math.max(0, 3 - candies)) + " · In bowl: " + inBowl, 132, 60, 16, dark ? "#f7e8d8" : "#33241a");
              if (!drag && !flying && !done) txt(g, "Pull the spoon back-down, let go, pray.", W / 2, 96, 18, dark ? "rgba(247,232,216,.8)" : "rgba(93,58,22,.7)");
            }
          };
        }
      });
