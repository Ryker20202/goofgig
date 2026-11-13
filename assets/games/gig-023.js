/* ================================================================
   GoofGig — Gig #023 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #023 — Mosquito Slap
         Twenty seconds of slapping. Leave one alive for more
         than 4 seconds and it bites — the itch meter remembers.
         ================================================================ */
      registerGame({
        n: 23, title: "Mosquito Slap",
        desc: "Twenty seconds. Every mosquito you spare for 4 seconds bites back.",
        hint: '<b>Tap mosquitoes</b> to splat them. One left alive for over <b>4 seconds</b> takes a bite and raises your <b>itch meter</b>. Survive <b>20 seconds</b>.',
        grades: [
          ["Palm of Justice", "Not a single ankle was harmed in your presence."],
          ["Certified Swatter", "The mosquitoes are filing a formal complaint."],
          ["Mostly Unharmed", "A few bites. A lot of dignity still intact."],
          ["Walking Buffet", "They told their friends about you."],
          ["All-You-Can-Eat", "You are not the hunter. You are the restaurant."]
        ],
        thumb: function (g) {
          g.fillStyle = "#3a3a3a"; g.beginPath(); g.ellipse(150, 46, 10, 7, 0, 0, Math.PI * 2); g.fill();
          g.fillStyle = "rgba(180,220,240,.8)"; g.beginPath(); g.ellipse(140, 36, 10, 5, -0.6, 0, Math.PI * 2); g.fill();
          g.beginPath(); g.ellipse(160, 36, 10, 5, 0.6, 0, Math.PI * 2); g.fill();
          g.strokeStyle = "#3a3a3a"; g.lineWidth = 2;
          g.beginPath(); g.moveTo(158, 50); g.lineTo(170, 60); g.stroke();
        },
        create: function (api) {
          var bugs = [], splats = [], kills = 0, bites = 0, timeLeft = 20, spawnT = 0, started = false, done = false;
          function spawn() {
            bugs.push({ x: 80 + Math.random() * 560, y: 70 + Math.random() * 300, vx: (Math.random() * 2 - 1) * 130, vy: (Math.random() * 2 - 1) * 110, age: 0, wob: Math.random() * 6.28 });
          }
          function finishRound() {
            done = true;
            var resolved = kills + bites;
            var ratio = resolved ? kills / resolved : 0;
            var s = clamp(Math.round(ratio * 70 + kills * 2), 2, 100);
            api.finish({ score: s, rows: [
              { label: "Mosquitoes slapped", value: ratio * 100, text: kills + " splats", good: kills >= 10 },
              { label: "Bites suffered", value: clamp(bites * 14, 0, 100), text: bites + " bites" }
            ] });
          }
          return {
            status: function () {
              if (done) return "The room is quiet again.";
              return started ? "Time " + Math.ceil(timeLeft) + "s · slaps " + kills + " · itch " + bites : "Tap a mosquito to start the war!";
            },
            down: function (p) {
              if (done) return;
              started = true; audio();
              var hit = -1;
              for (var i = 0; i < bugs.length; i++) if (dist(p.x, p.y, bugs[i].x, bugs[i].y) < 36) { hit = i; break; }
              if (hit >= 0) {
                splats.push({ x: bugs[hit].x, y: bugs[hit].y, t: 0.6 });
                bugs.splice(hit, 1); kills++;
                blip(180 + Math.random() * 60, .06, "square", .08);
              } else blip(90, .04, "sine", .03);
            },
            move: function () {}, up: function () {},
            draw: function (g, dt, now) {
              var dark = isDark();
              if (started && !done) {
                timeLeft -= dt;
                spawnT -= dt;
                if (spawnT <= 0 && bugs.length < 4) { spawn(); spawnT = 0.85; }
                for (var i = bugs.length - 1; i >= 0; i--) {
                  var b = bugs[i];
                  b.age += dt; b.wob += dt * 9;
                  b.vx += (Math.random() * 2 - 1) * 620 * dt;
                  b.vy += (Math.random() * 2 - 1) * 620 * dt;
                  var sp = Math.sqrt(b.vx * b.vx + b.vy * b.vy), MAXS = 210;
                  if (sp > MAXS) { b.vx *= MAXS / sp; b.vy *= MAXS / sp; }
                  b.x += b.vx * dt; b.y += b.vy * dt;
                  if (b.x < 40) { b.x = 40; b.vx = Math.abs(b.vx); } if (b.x > W - 40) { b.x = W - 40; b.vx = -Math.abs(b.vx); }
                  if (b.y < 50) { b.y = 50; b.vy = Math.abs(b.vy); } if (b.y > 400) { b.y = 400; b.vy = -Math.abs(b.vy); }
                  if (b.age > 4) { bugs.splice(i, 1); bites++; splats.push({ x: b.x, y: b.y, t: 0.6, bite: true }); blip(720, .09, "sawtooth", .05); }
                }
                if (timeLeft <= 0) { if (kills >= bites) sndGood(); else sndBad(); finishRound(); }
              }
              for (var j = splats.length - 1; j >= 0; j--) { splats[j].t -= dt; if (splats[j].t <= 0) splats.splice(j, 1); }
              // room wall + lamp
              g.fillStyle = dark ? "#33302a" : "#f3e9d2"; g.fillRect(0, 0, W, 460);
              g.fillStyle = dark ? "#4a463c" : "#e7d7b4"; g.fillRect(0, 402, W, 58);
              txt(g, "ITCH", 96, 430, 15, dark ? "#c4a68d" : "#7a5f4d");
              g.fillStyle = dark ? "#4a3423" : "#f0dcc4"; rr(g, 140, 421, 440, 18, 9); g.fill();
              g.fillStyle = "#d93e22"; rr(g, 140, 421, 440 * clamp(bites / 8, 0, 1), 18, 9); g.fill();
              // splats & bite marks
              splats.forEach(function (s) {
                if (s.bite) {
                  g.fillStyle = "rgba(217,62,34,.75)"; g.beginPath(); g.arc(s.x, s.y, 9, 0, Math.PI * 2); g.fill();
                  txt(g, "BITE!", s.x, s.y - 16, 13, "#d93e22");
                } else {
                  g.fillStyle = "rgba(90,60,30,.55)"; g.beginPath(); g.ellipse(s.x, s.y, 13, 8, 0.6, 0, Math.PI * 2); g.fill();
                }
              });
              // mosquitoes
              bugs.forEach(function (b) {
                var fl = Math.sin(now / 22 + b.wob) * 0.5;
                g.fillStyle = "rgba(190,225,245,.85)";
                g.beginPath(); g.ellipse(b.x - 9, b.y - 7, 10, 4.5, -0.6 + fl * 0.3, 0, Math.PI * 2); g.fill();
                g.beginPath(); g.ellipse(b.x + 9, b.y - 7, 10, 4.5, 0.6 - fl * 0.3, 0, Math.PI * 2); g.fill();
                g.fillStyle = b.age > 3 ? "#b02020" : "#333";
                g.beginPath(); g.ellipse(b.x, b.y, 9, 6, 0, 0, Math.PI * 2); g.fill();
                g.strokeStyle = "#333"; g.lineWidth = 1.6;
                g.beginPath(); g.moveTo(b.x + 7, b.y + 2); g.lineTo(b.x + 17, b.y + 6); g.stroke();
                if (b.age > 2.6) { g.strokeStyle = "rgba(217,62,34,.8)"; g.lineWidth = 2; g.beginPath(); g.arc(b.x, b.y, 18 + Math.sin(now / 60) * 2, 0, Math.PI * 2); g.stroke(); }
              });
              if (!started) txt(g, "Tap a mosquito to start!", W / 2, 44, 21, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
              if (started && !done) txt(g, Math.ceil(timeLeft) + "s", 640, 44, 24, dark ? "#f7e8d8" : "#33241a");
            }
          };
        }
      });
