/* ================================================================
   GoofGig — Gig #025 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #025 — Alarm Whack
         Pure reaction. Wait for the ring, then WHACK it.
         Tap early and you've slapped a sleeping clock.
         ================================================================ */
      registerGame({
        n: 25, title: "Alarm Whack",
        desc: "Wait for it… wait for it… then whack it as fast as humanly possible.",
        hint: 'Stare at the clock. When it <b>rings</b>, <b>tap instantly</b>. Your score is your <b>reaction time</b>. Tapping early is a false start — and clocks remember.',
        grades: [
          ["Superhuman Reflexes", "The clock is scared of YOU now."],
          ["Certified Morning Person", "Fast enough to be genuinely annoying at 6am."],
          ["Functional Human", "Awake. Eventually. Like the rest of us."],
          ["Five More Minutes", "The snooze button sends its regards."],
          ["Legally Asleep", "The alarm gave up and went back to bed."]
        ],
        thumb: function (g) {
          g.fillStyle = "#e3352b"; g.beginPath(); g.arc(150, 52, 26, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#fdf6ec"; g.beginPath(); g.arc(150, 52, 19, 0, Math.PI * 2); g.fill();
          g.strokeStyle = "#333"; g.lineWidth = 3;
          g.beginPath(); g.moveTo(150, 52); g.lineTo(150, 40); g.stroke();
          g.beginPath(); g.moveTo(150, 52); g.lineTo(160, 58); g.stroke();
          g.fillStyle = "#ffb627"; g.beginPath(); g.arc(128, 26, 8, 0, Math.PI * 2); g.arc(172, 26, 8, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var t0 = -1, ringAt = 1500 + Math.random() * 3000, rang = false, ringT = 0, done = false, falseStart = false, reaction = 0;
          function finishRound() {
            done = true;
            var s = falseStart ? clamp(Math.round(6 + Math.random() * 6), 2, 14)
              : clamp(Math.round(108 - reaction * 0.16), 2, 100);
            api.finish({ score: s, rows: [
              { label: "Reaction time", value: falseStart ? 4 : clamp((600 - reaction) / 5.2, 0, 100), text: falseStart ? "False start!" : Math.round(reaction) + " ms", good: !falseStart && reaction < 230 },
              { label: "Clock status", value: falseStart ? 10 : 100, text: falseStart ? "Slapped while sleeping" : "Thoroughly whacked", good: !falseStart }
            ] });
          }
          return {
            status: function () {
              if (done) return falseStart ? "False start. The clock judges you." : "Whacked in " + Math.round(reaction) + " ms!";
              return rang ? "RING RING RING — TAP!" : "Wait for it…";
            },
            down: function (p, now) {
              if (done) return;
              audio();
              if (!rang) { falseStart = true; sndBad(); finishRound(); return; }
              reaction = now - ringT;
              if (reaction < 260) sndGood(); else sndBad();
              finishRound();
            },
            move: function () {}, up: function () {},
            draw: function (g, dt, now) {
              var dark = isDark();
              if (t0 < 0) t0 = now;
              if (!done && !rang && now - t0 >= ringAt) { rang = true; ringT = now; blip(1180, .12, "square", .07); }
              if (!done && rang && now - ringT > 1200) { reaction = 1200; finishRound(); }
              var CX = W / 2, CY = 238, shake = rang && !done ? Math.sin(now / 18) * 4 : 0;
              g.save(); g.translate(CX + shake, CY);
              // bells + legs
              g.fillStyle = "#ffb627"; g.beginPath(); g.arc(-62, -62, 20, 0, Math.PI * 2); g.arc(62, -62, 20, 0, Math.PI * 2); g.fill();
              g.strokeStyle = "#8a5a28"; g.lineWidth = 5;
              g.beginPath(); g.moveTo(-40, 74); g.lineTo(-56, 98); g.stroke();
              g.beginPath(); g.moveTo(40, 74); g.lineTo(56, 98); g.stroke();
              // body
              g.fillStyle = "#e3352b"; g.beginPath(); g.arc(0, 0, 82, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#fdf6ec"; g.beginPath(); g.arc(0, 0, 64, 0, Math.PI * 2); g.fill();
              // ticks
              g.fillStyle = "#55483a";
              for (var i = 0; i < 12; i++) {
                var a = i / 12 * Math.PI * 2;
                g.beginPath(); g.arc(Math.cos(a) * 54, Math.sin(a) * 54, i % 3 === 0 ? 3.4 : 2, 0, Math.PI * 2); g.fill();
              }
              // hands spin while waiting, freeze at ring
              var ha = rang ? 0 : (now - t0) / 300;
              g.strokeStyle = "#33241a"; g.lineWidth = 5; g.lineCap = "round";
              g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(ha - 1.57) * 34, Math.sin(ha - 1.57) * 34); g.stroke();
              g.lineWidth = 3.5;
              g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(ha * 2.7 - 1.57) * 48, Math.sin(ha * 2.7 - 1.57) * 48); g.stroke();
              g.fillStyle = "#e3352b"; g.beginPath(); g.arc(0, 0, 6, 0, Math.PI * 2); g.fill();
              g.restore();
              // Zzz or RING
              if (!rang && !done) {
                txt(g, "z", CX + 118, CY - 66 + Math.sin(now / 400) * 5, 22, dark ? "#9db4c8" : "#7a8a99");
                txt(g, "z", CX + 142, CY - 92 + Math.sin(now / 400 + 1) * 5, 28, dark ? "#9db4c8" : "#7a8a99");
                txt(g, "Wait for it…", CX, 64, 24, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
              }
              if (rang && !done) txt(g, "RING RING RING!", CX, 64, 32, "#d93e22");
              if (done && falseStart) txt(g, "It wasn't even awake yet.", CX, 64, 22, "#d93e22");
            }
          };
        }
      });
