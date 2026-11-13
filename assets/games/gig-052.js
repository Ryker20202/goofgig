/* ================================================================
   GoofGig — Gig #052 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #052 — Fridge Letters
         Drag the C, A, T magnets onto their dashed outlines.
         ================================================================ */
      registerGame({
        n: 52, title: "Fridge Letters",
        desc: "Spell CAT on the fridge. The magnets have opinions.",
        hint: '<b>Drag each letter magnet</b> onto its <b>matching dashed outline</b>. Fast, first-try placements score best.',
        grades: [
          ["Fridge Poet", "C-A-T, perfectly placed. Shakespeare is jealous."],
          ["Magnet Maestro", "Every letter home without a single wobble."],
          ["Kitchen Literate", "It spells CAT. The fridge feels smarter already."],
          ["Alphabet Soup", "Letters placed, eventually, after some travel."],
          ["Spells CTA", "Close. The cat has questions about the new word."]
        ],
        thumb: function (g) {
          g.fillStyle = "#dfe9ee"; rr(g, 122, 4, 56, 84, 6); g.fill();
          txt(g, "C", 134, 40, 22, "#e8546d");
          txt(g, "A", 152, 40, 22, "#35c4a0");
          txt(g, "T", 168, 40, 22, "#ffb627");
          txt(g, "cat", 150, 74, 15, "#8a97a3");
        },
        create: function (api) {
          var letters = [
            { ch: "C", col: "#e8546d", tx: W / 2 - 84, ty: 148, x: W / 2 + 62, y: 356, placed: false },
            { ch: "A", col: "#35c4a0", tx: W / 2, ty: 148, x: W / 2 - 78, y: 372, placed: false },
            { ch: "T", col: "#ffb627", tx: W / 2 + 84, ty: 148, x: W / 2 + 4, y: 330, placed: false }
          ];
          var drag = -1, mistakes = 0, time = 0, started = false, done = false, placedCount = 0;
          function finishRound() {
            done = true;
            var s = clamp(Math.round(104 - time * 2.2 - mistakes * 10), 2, 100);
            api.finish({ score: s, rows: [
              { label: "Spelling time", value: clamp(time / 12 * 100, 0, 100), text: time.toFixed(1) + "s", good: time < 7 },
              { label: "Wrong spots", value: clamp(mistakes * 25, 0, 100), text: "" + mistakes }
            ] });
          }
          return {
            status: function () { return done ? "C-A-T. Nailed it." : "Letters placed: " + placedCount + " / 3"; },
            down: function (p) {
              if (done) return;
              started = true; audio();
              for (var i = letters.length - 1; i >= 0; i--) {
                if (!letters[i].placed && dist(p.x, p.y, letters[i].x, letters[i].y) <= 34) { drag = i; return; }
              }
            },
            move: function (p) {
              if (drag >= 0 && !done) { letters[drag].x = clamp(p.x, 26, W - 26); letters[drag].y = clamp(p.y, 30, 446); }
            },
            up: function (p) {
              if (drag < 0 || done) { drag = -1; return; }
              var L = letters[drag];
              if (dist(p.x, p.y, L.tx, L.ty) <= 40) {
                L.x = L.tx; L.y = L.ty; L.placed = true; placedCount++;
                blip(700, .07, "sine", .07);
                if (placedCount >= 3) { sndGood(); finishRound(); }
              } else {
                for (var j = 0; j < 3; j++) if (j !== drag && dist(p.x, p.y, letters[j].tx, letters[j].ty) <= 40) { mistakes++; blip(150, .09, "square", .06); break; }
              }
              drag = -1;
            },
            draw: function (g, dt) {
              var dark = isDark();
              if (started && !done) time += dt;
              // fridge door
              g.fillStyle = dark ? "#aebbc2" : "#dfe9ee"; rr(g, W / 2 - 150, 34, 300, 396, 18); g.fill();
              g.strokeStyle = "rgba(90,110,120,.4)"; g.lineWidth = 3; rr(g, W / 2 - 150, 34, 300, 396, 18); g.stroke();
              g.fillStyle = "rgba(90,110,120,.25)"; g.fillRect(W / 2 - 150, 218, 300, 4);
              g.fillStyle = "#8a97a3"; rr(g, W / 2 + 118, 70, 10, 74, 5); g.fill();
              // dashed target outlines
              for (var j = 0; j < 3; j++) {
                var L = letters[j];
                g.strokeStyle = L.col; g.lineWidth = 3; g.setLineDash([7, 6]);
                rr(g, L.tx - 27, L.ty - 27, 54, 54, 10); g.stroke(); g.setLineDash([]);
                txt(g, L.ch, L.tx, L.ty + 10, 30, "rgba(120,135,145,.4)");
              }
              // a doodle magnet for charm
              g.fillStyle = "#ffd83d"; g.beginPath(); g.arc(W / 2 - 96, 268, 13, 0, Math.PI * 2); g.fill();
              txt(g, "milk!", W / 2 + 30, 282, 17, "rgba(120,135,145,.55)");
              // letter magnets
              for (var i = 0; i < 3; i++) {
                var M = letters[i];
                g.fillStyle = M.col; rr(g, M.x - 25, M.y - 25, 50, 50, 10); g.fill();
                g.fillStyle = "rgba(255,255,255,.28)"; rr(g, M.x - 25, M.y - 25, 50, 16, 10); g.fill();
                txt(g, M.ch, M.x, M.y + 11, 32, "#fff");
              }
              if (!started) txt(g, "Drag C, A, T onto their outlines!", W / 2, 24, 19, dark ? "rgba(247,232,216,.85)" : "rgba(93,58,22,.75)");
            }
          };
        }
      });
