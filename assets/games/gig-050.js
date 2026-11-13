/* ================================================================
   GoofGig — Gig #050 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #050 — Key in Lock
         Slide the key along the dotted groove into the keyhole.
         Leaving the groove scrapes the key.
         ================================================================ */
      registerGame({
        n: 50, title: "Key in Lock",
        desc: "One wiggly groove, one nervous key. Stay on the dots.",
        hint: '<b>Drag the key</b> along the <b>dotted groove</b> into the keyhole. Every moment off the groove is a <b>scrape</b>.',
        grades: [
          ["Locksmith's Ghost", "In without a sound. The lock never woke up."],
          ["Smooth Keyhand", "Barely a whisper of metal on metal."],
          ["Careful Tenant", "Home at last, with only minor key drama."],
          ["Scrape Artist", "That key has seen things. Mostly the groove's edge."],
          ["Locked Out Forever", "The neighbours now open their doors in fear."]
        ],
        thumb: function (g) {
          g.fillStyle = "#8a5a28"; rr(g, 128, 10, 44, 72, 8); g.fill();
          g.fillStyle = "#33241a"; g.beginPath(); g.arc(150, 34, 7, 0, Math.PI * 2); g.fill();
          g.fillRect(147, 38, 6, 14);
          g.strokeStyle = "#ffd83d"; g.lineWidth = 4;
          g.beginPath(); g.arc(112, 62, 12, 0, Math.PI * 2); g.stroke();
          g.fillStyle = "#ffd83d"; g.fillRect(122, 60, 16, 5); g.fillRect(132, 65, 4, 6); g.fillRect(138, 65, 4, 6);
        },
        create: function (api) {
          var pts = [], N = 60, i;
          for (i = 0; i <= N; i++) {
            var t = i / N;
            pts.push({ x: 96 + t * 486 + Math.sin(t * 9) * 34 * (1 - t * 0.35), y: 384 - t * 268 + Math.sin(t * 13) * 20 });
          }
          var key = { x: pts[0].x, y: pts[0].y };
          var holding = false, started = false, done = false;
          var scrapes = 0, offTime = 0, time = 0, bestIdx = 0, spark = 0;
          function nearest() {
            var bd = 1e9, bi = 0;
            for (var j = 0; j <= N; j++) { var d = dist(key.x, key.y, pts[j].x, pts[j].y); if (d < bd) { bd = d; bi = j; } }
            return { d: bd, i: bi };
          }
          function finishRound() {
            done = true;
            var s = clamp(Math.round(102 - scrapes * 7 - time * 1.1), 2, 100);
            api.finish({ score: s, rows: [
              { label: "Scrapes", value: clamp(scrapes * 12, 0, 100), text: "" + scrapes, good: scrapes <= 2 },
              { label: "Unlock time", value: clamp(time / 12 * 100, 0, 100), text: time.toFixed(1) + "s" }
            ] });
          }
          return {
            status: function () { return done ? "Click… you're in!" : (started ? "Groove covered " + Math.round(bestIdx / N * 100) + "% · scrapes " + scrapes : "Grab the key and follow the dots!"); },
            down: function (p) {
              if (done) return;
              if (dist(p.x, p.y, key.x, key.y) <= 46) { holding = true; started = true; audio(); }
            },
            move: function (p) {
              if (!holding || done) return;
              key.x = clamp(p.x, 20, W - 20); key.y = clamp(p.y, 20, 445);
            },
            up: function () { holding = false; },
            draw: function (g, dt) {
              var dark = isDark();
              var nr = nearest();
              if (nr.i > bestIdx) bestIdx = nr.i;
              if (started && !done) {
                time += dt;
                if (holding && nr.d > 36) {
                  offTime += dt; spark = 0.1;
                  if (offTime >= 0.35) { scrapes++; offTime = 0; blip(1400, .04, "sawtooth", .05); }
                } else offTime = Math.max(0, offTime - dt * 2);
                if (bestIdx >= N - 1 && nr.d <= 42) { sndGood(); finishRound(); }
              }
              if (spark > 0) spark -= dt;
              // door
              g.fillStyle = dark ? "#5e4020" : "#8a5a28"; rr(g, 40, 26, 640, 408, 14); g.fill();
              g.strokeStyle = "rgba(0,0,0,.18)"; g.lineWidth = 3; rr(g, 66, 52, 588, 356, 10); g.stroke();
              // groove dots
              for (i = 0; i <= N; i += 2) {
                g.fillStyle = i <= bestIdx ? "#ffd83d" : "rgba(255,255,255,.5)";
                g.beginPath(); g.arc(pts[i].x, pts[i].y, 4, 0, Math.PI * 2); g.fill();
              }
              // lock plate + keyhole at path end
              var end = pts[N];
              g.fillStyle = "#c8ccd2"; rr(g, end.x - 26, end.y - 34, 52, 68, 10); g.fill();
              g.fillStyle = "#26221e"; g.beginPath(); g.arc(end.x, end.y - 8, 8, 0, Math.PI * 2); g.fill();
              g.fillRect(end.x - 4.5, end.y - 6, 9, 20);
              // key (ring + shaft + teeth), pointing right
              g.save(); g.translate(key.x, key.y); g.rotate(-0.5);
              g.strokeStyle = "#e8b93c"; g.lineWidth = 6;
              g.beginPath(); g.arc(-20, 0, 13, 0, Math.PI * 2); g.stroke();
              g.fillStyle = "#e8b93c"; g.fillRect(-8, -3.5, 40, 7);
              g.fillRect(20, 3, 6, 9); g.fillRect(30, 3, 6, 7);
              g.restore();
              if (spark > 0) {
                g.fillStyle = "#fff3b0";
                for (var k = 0; k < 5; k++) { g.beginPath(); g.arc(key.x + 26 + Math.random() * 14 - 7, key.y + Math.random() * 14 - 7, 2.4, 0, Math.PI * 2); g.fill(); }
                txt(g, "SCRAPE!", key.x + 30, key.y - 26, 16, "#ff5a3c");
              }
              if (!started) txt(g, "Drag the key along the dotted groove!", W / 2, 436, 19, "rgba(247,232,216,.9)");
            }
          };
        }
      });
