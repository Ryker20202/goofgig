/* ================================================================
   GoofGig — Gig #040 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #040 — Hair Dryer
         Hold to blow-dry. Release in the dry zone;
         blast far past it and the hair frizzes out.
         ================================================================ */
      registerGame({
        n: 40, title: "Hair Dryer",
        desc: "Hold to dry. Silky finish or full frizz explosion.",
        hint: '<b>Press and hold</b> to blow-dry the hair. Let go inside the <b>zone (55–85%)</b>. Blast it to 100% and the hair <b>frizzes into orbit</b>.',
        grades: [
          ["Salon Legend", "Silky, shiny, commercial-ready hair. Gorgeous."],
          ["Blowout Professional", "Smooth with bounce. The mirror approves."],
          ["Bathroom Stylist", "Dry. Presentable. One rebellious curl."],
          ["Damp Forehead Club", "Still soggy. That is a wet helmet, not hair."],
          ["Frizz Volcano", "The hair has left the head's jurisdiction."]
        ],
        thumb: function (g) {
          g.fillStyle = "#f2c79b"; g.beginPath(); g.arc(140, 52, 24, 0, Math.PI * 2); g.fill();
          g.strokeStyle = "#8a5a28"; g.lineWidth = 5;
          for (var i = 0; i < 5; i++) { g.beginPath(); g.moveTo(124 + i * 8, 34); g.quadraticCurveTo(118 + i * 9, 14, 130 + i * 8, 10); g.stroke(); }
          g.fillStyle = "#57b7dd"; rr(g, 196, 30, 44, 18, 8); g.fill();
          g.fillStyle = "#3f8fb5"; rr(g, 232, 34, 16, 10, 4); g.fill();
        },
        create: function (api) {
          var dry = 0, holding = false, started = false, done = false, frizz = false, wind = 0;
          var ZONE = { lo: 55, hi: 85 };
          function finishRound() {
            done = true;
            var s;
            if (frizz) s = clamp(Math.round(10 + dry * 0.05), 5, 20);
            else if (dry >= ZONE.lo && dry <= ZONE.hi) s = clamp(Math.round(100 - Math.abs(dry - 70) * 1.8), 62, 100);
            else if (dry < ZONE.lo) s = clamp(Math.round(88 - (ZONE.lo - dry) * 1.5), 2, 87);
            else s = clamp(Math.round(88 - (dry - ZONE.hi) * 2.6), 26, 87);
            api.finish({ score: s, rows: [
              { label: "Dryness", value: dry, text: Math.round(dry) + "%" + (frizz ? " — FRIZZ VOLCANO!" : "") },
              { label: "Salon zone", value: 70, text: ZONE.lo + "–" + ZONE.hi + "%", good: !frizz && dry >= ZONE.lo && dry <= ZONE.hi }
            ] });
          }
          return {
            status: function () {
              if (done) return frizz ? "Frizz. Everywhere." : "Hair judged!";
              return started ? "Dryness " + Math.round(dry) + "% — release in the zone!" : "Press and HOLD to dry!";
            },
            down: function () { if (done) return; started = true; holding = true; audio(); },
            move: function () {},
            up: function () {
              if (done || !started || !holding) return;
              holding = false;
              if (dry >= ZONE.lo && dry <= ZONE.hi) sndGood(); else sndBad();
              finishRound();
            },
            draw: function (g, dt, now) {
              var dark = isDark();
              if (holding && !done) {
                dry = clamp(dry + dt * 35, 0, 100);
                wind += dt;
                if (dry >= 100) { frizz = true; holding = false; sndBad(); finishRound(); }
              }
              var CX = W / 2, HY = 268;
              // head
              g.fillStyle = "#f2c79b"; g.beginPath(); g.arc(CX, HY, 74, 0, Math.PI * 2); g.fill();
              // face (calm or frazzled)
              g.fillStyle = "#33241a";
              g.beginPath(); g.arc(CX - 26, HY - 4, 5.5, 0, Math.PI * 2); g.fill();
              g.beginPath(); g.arc(CX + 26, HY - 4, 5.5, 0, Math.PI * 2); g.fill();
              g.strokeStyle = "#33241a"; g.lineWidth = 3.5;
              g.beginPath();
              if (frizz) g.arc(CX, HY + 26, 12, Math.PI * 1.15, Math.PI * 1.85);
              else g.arc(CX, HY + 12, 16, Math.PI * 0.15, Math.PI * 0.85);
              g.stroke();
              // hair: wet = dark droopy strands; dry = lighter & lifted; frizz = wild spikes
              var lift = dry / 100;
              for (var i = 0; i < 11; i++) {
                var hx = CX - 66 + i * 13.2, phase = i * 1.7;
                var sway = holding ? Math.sin(wind * 16 + phase) * (3 + lift * 5) : Math.sin(now / 600 + phase) * 1.5;
                g.strokeStyle = frizz ? "#a8641e" : (lift < 0.4 ? "#5e3a12" : "#a8702c");
                g.lineWidth = 7; g.lineCap = "round";
                g.beginPath(); g.moveTo(hx, HY - 62);
                if (frizz) {
                  g.lineTo(hx + Math.sin(phase * 3) * 26 - 6, HY - 108 - (i % 3) * 14);
                } else {
                  g.quadraticCurveTo(hx + sway, HY - 84 - lift * 22, hx + sway * 1.6 + 4, HY - 66 - lift * 44 + (1 - lift) * 26);
                }
                g.stroke();
              }
              // hair dryer at right, wind streaks while holding
              g.save(); g.translate(CX + 196, HY - 88); g.rotate(0.5);
              g.fillStyle = "#57b7dd"; rr(g, -14, -46, 30, 76, 13); g.fill();
              g.fillStyle = "#3f8fb5"; rr(g, -52, -40, 42, 20, 8); g.fill();
              g.fillStyle = "#2f6e8c"; rr(g, 2, 28, 12, 34, 6); g.fill();
              g.restore();
              if (holding) {
                g.strokeStyle = "rgba(87,183,221,.65)"; g.lineWidth = 4; g.lineCap = "round";
                for (var wnd = 0; wnd < 3; wnd++) {
                  var wy = HY - 116 + wnd * 22, off = (wind * 320 + wnd * 47) % 90;
                  g.beginPath(); g.moveTo(CX + 128 - off, wy); g.lineTo(CX + 96 - off, wy); g.stroke();
                }
              }
              // dryness meter
              var MX = 140, MY = 424, MW = 440;
              txt(g, "DRY", 96, MY + 6, 15, dark ? "#c4a68d" : "#7a5f4d");
              g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, MX, MY - 9, MW, 18, 9); g.fill();
              g.fillStyle = "rgba(53,196,160,.55)"; g.fillRect(MX + MW * ZONE.lo / 100, MY - 9, MW * (ZONE.hi - ZONE.lo) / 100, 18);
              g.fillStyle = dry > ZONE.hi ? "#d93e22" : "#ffb627"; rr(g, MX, MY - 9, MW * dry / 100, 18, 9); g.fill();
              if (!started) txt(g, "Press & HOLD — stop in the green!", CX, 44, 21, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
