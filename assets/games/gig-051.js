/* ================================================================
   GoofGig — Gig #051 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #051 — Plug It In
         Drag the plug and drop it dead-on into the socket.
         Score is your alignment error in pixels.
         ================================================================ */
      registerGame({
        n: 51, title: "Plug It In",
        desc: "Two prongs, one socket, zero room for wobble.",
        hint: '<b>Drag the plug</b> and <b>drop it</b> so the prongs land exactly on the socket. You get <b>4 drops</b> — plugging in ends the round.',
        grades: [
          ["Pixel Electrician", "Dead centre. The socket sent a thank-you card."],
          ["Steady Hands", "In with barely a wobble. Sparks stayed home."],
          ["Certified Fumbler", "Plugged in, eventually, with sound effects."],
          ["Prong Bender", "Those prongs will never be straight again."],
          ["Call the Fire Dept", "The wall has questions. So does the insurance."]
        ],
        thumb: function (g) {
          g.fillStyle = "#f0ead8"; rr(g, 128, 8, 44, 40, 6); g.fill();
          g.fillStyle = "#33241a"; rr(g, 140, 18, 6, 14, 2); g.fill(); rr(g, 154, 18, 6, 14, 2); g.fill();
          g.fillStyle = "#4a4a52"; rr(g, 136, 58, 28, 22, 6); g.fill();
          g.fillStyle = "#8a8a92"; g.fillRect(143, 50, 4, 9); g.fillRect(153, 50, 4, 9);
        },
        create: function (api) {
          var S = { x: W / 2, y: 138 };
          var plug = { x: W / 2 - 170, y: 372 };
          var drag = false, started = false, done = false, drops = 0, bestErr = 999, time = 0, plugged = false, lastErr = -1;
          function prongMid() { return { x: plug.x, y: plug.y - 34 }; }
          function finishRound(wasPlugged, err) {
            done = true; plugged = wasPlugged;
            var s = wasPlugged
              ? clamp(Math.round(102 - err * 1.1 - (drops - 1) * 8 - time * 0.7), 2, 100)
              : clamp(Math.round(72 - bestErr * 0.75), 2, 71);
            api.finish({ score: s, rows: [
              { label: "Final error", value: clamp((wasPlugged ? err : bestErr) * 1.6, 0, 100), text: Math.round(wasPlugged ? err : bestErr) + " px", good: (wasPlugged ? err : bestErr) <= 12 },
              { label: "Drops used", value: drops * 25, text: drops + " / 4" }
            ] });
          }
          return {
            status: function () {
              if (done) return plugged ? "Plugged in!" : "Out of drops!";
              return started ? "Drops: " + drops + " / 4" + (lastErr >= 0 ? " · last miss " + Math.round(lastErr) + " px" : "") : "Drag the plug to the socket!";
            },
            down: function (p) {
              if (done) return;
              started = true; audio();
              if (dist(p.x, p.y, plug.x, plug.y) <= 52) drag = true;
            },
            move: function (p) {
              if (drag && !done) { plug.x = clamp(p.x, 34, W - 34); plug.y = clamp(p.y, 44, 448); }
            },
            up: function () {
              if (!drag || done) { drag = false; return; }
              drag = false;
              var pm = prongMid(), err = dist(pm.x, pm.y, S.x, S.y);
              drops++; lastErr = err; if (err < bestErr) bestErr = err;
              if (err <= 16) { plug.x = S.x; plug.y = S.y + 34; sndGood(); finishRound(true, err); }
              else { blip(120, .1, "square", .07); if (drops >= 4) { sndBad(); finishRound(false, err); } }
            },
            draw: function (g, dt) {
              var dark = isDark();
              if (started && !done) time += dt;
              // wall
              g.fillStyle = dark ? "#3d3a44" : "#efe6d4"; g.fillRect(0, 0, W, 460);
              g.fillStyle = dark ? "#33303a" : "#e4d8c2"; g.fillRect(0, 330, W, 130);
              // socket plate
              g.fillStyle = "#faf6ea"; rr(g, S.x - 44, S.y - 44, 88, 88, 12); g.fill();
              g.strokeStyle = "#b9ac8f"; g.lineWidth = 3; rr(g, S.x - 44, S.y - 44, 88, 88, 12); g.stroke();
              g.fillStyle = "#26221e";
              rr(g, S.x - 17, S.y - 20, 10, 26, 4); g.fill();
              rr(g, S.x + 7, S.y - 20, 10, 26, 4); g.fill();
              g.beginPath(); g.arc(S.x, S.y + 22, 5, 0, Math.PI * 2); g.fill();
              // target crosshair
              g.strokeStyle = "rgba(53,196,160,.65)"; g.lineWidth = 2;
              g.beginPath(); g.arc(S.x, S.y - 7, 26, 0, Math.PI * 2); g.stroke();
              // cord
              g.strokeStyle = "#4a4a52"; g.lineWidth = 6;
              g.beginPath(); g.moveTo(plug.x, plug.y + 22);
              g.bezierCurveTo(plug.x - 30, plug.y + 70, plug.x + 60, plug.y + 80, plug.x + 30, 452); g.stroke();
              // plug body + prongs
              g.fillStyle = "#c8ccd2"; g.fillRect(plug.x - 13, plug.y - 34, 7, 16); g.fillRect(plug.x + 6, plug.y - 34, 7, 16);
              g.fillStyle = "#4a4a52"; rr(g, plug.x - 24, plug.y - 20, 48, 44, 10); g.fill();
              g.fillStyle = "rgba(255,255,255,.25)"; rr(g, plug.x - 24, plug.y - 20, 48, 14, 10); g.fill();
              if (!started) txt(g, "Drop it dead-on — error is measured in pixels!", W / 2, 300, 19, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
