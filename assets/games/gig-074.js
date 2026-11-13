/* ================================================================
   GoofGig — Gig #074 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #074 — Books Balance
         A book slides overhead. Tap to drop it on the stack.
         Six books, one wobbly tower, total alignment decides.
         ================================================================ */
      registerGame({
        n: 74, title: "Books Balance",
        desc: "Drop six sliding books onto one stack. Wobble is forever.",
        hint: '<b>Tap</b> to drop the sliding book onto the stack. Six books — the closer each lands to <b>dead center</b>, the straighter your tower.',
        grades: [
          ["Librarian Supreme", "Six books, zero lean. The tower could hold a mortgage."],
          ["Steady Stacker", "Barely a wobble. The books respect you."],
          ["Casual Leaning Tower", "It stands. It also has opinions about gravity."],
          ["Wobble Goblin", "That stack is one sneeze from a book avalanche."],
          ["Book Disaster", "The books have unionized and left the stack."]
        ],
        thumb: function (g) {
          g.fillStyle = "#c0392b"; rr(g, 118, 58, 64, 14, 3); g.fill();
          g.fillStyle = "#2471a3"; rr(g, 124, 44, 64, 14, 3); g.fill();
          g.fillStyle = "#27ae60"; rr(g, 130, 30, 64, 14, 3); g.fill();
          g.fillStyle = "#f39c12"; rr(g, 136, 8, 56, 14, 3); g.fill();
        },
        create: function (api) {
          var stack = [], fallen = 0, totalErr = 0, drops = 0, done = false;
          var slide = 0, falling = null, BOOK_H = 26, GROUND = 402;
          var COLORS = ["#c0392b", "#2471a3", "#27ae60", "#f39c12", "#8e44ad", "#16a085"];
          function stackTop() { return GROUND - stack.length * BOOK_H; }
          function curW() { return 118 + (drops % 3) * 14; }
          function finishRound() {
            done = true;
            var avg = totalErr / 6;
            var s = clamp(Math.round(100 - avg * 1.15), 2, 100);
            if (stack.length === 6 && avg <= 12) sndGood(); else if (s >= 60) sndGood(); else sndBad();
            api.finish({ score: s, rows: [
              { label: "Books stacked", value: stack.length / 6 * 100, text: stack.length + " / 6" + (fallen ? " (" + fallen + " fell off)" : ""), good: stack.length >= 5 },
              { label: "Average wobble", value: clamp(100 - avg * 1.15, 0, 100), text: Math.round(avg) + " px off-center" }
            ] });
          }
          return {
            status: function () {
              if (done) return "Tower judged!";
              if (falling) return "Down it goes…";
              return "Book " + (drops + 1) + " / 6 — tap to drop!";
            },
            down: function () {
              if (done || falling) return;
              audio();
              var w = curW();
              falling = { x: W / 2 + Math.sin(slide) * 215, y: 64, vy: 0, w: w };
              blip(500, .06, "square", .05);
            },
            move: function () {}, up: function () {},
            draw: function (g, dt, now) {
              var dark = isDark();
              slide += dt * 1.7;
              var cx = W / 2;
              // shelf / ground
              g.fillStyle = dark ? "#4a3423" : "#caa26b"; g.fillRect(60, GROUND, W - 120, 12);
              g.fillStyle = dark ? "#33241a" : "#8a6b42"; g.fillRect(60, GROUND + 12, W - 120, 34);
              // center guide
              g.strokeStyle = dark ? "rgba(247,232,216,.25)" : "rgba(93,58,22,.25)";
              g.lineWidth = 2; g.setLineDash([6, 8]);
              g.beginPath(); g.moveTo(cx, 40); g.lineTo(cx, GROUND); g.stroke(); g.setLineDash([]);
              // falling book physics
              if (falling && !done) {
                falling.vy += 1500 * dt;
                falling.y += falling.vy * dt;
                var top = stackTop();
                if (falling.y + BOOK_H >= top) {
                  var off = falling.x - cx;
                  drops++;
                  if (Math.abs(off) > 88) {
                    fallen++; totalErr += 120;
                    stack.push({ x: cx + (off > 0 ? 150 : -150) - falling.w / 2, w: falling.w, c: COLORS[(drops - 1) % 6], off: true });
                    sndBad();
                  } else {
                    totalErr += Math.abs(off);
                    stack.push({ x: falling.x - falling.w / 2, w: falling.w, c: COLORS[(drops - 1) % 6], off: false });
                    blip(180, .08, "sine", .08);
                  }
                  falling = null;
                  if (drops >= 6) finishRound();
                }
              }
              // stacked books
              stack.forEach(function (b, i) {
                if (b.off) {
                  g.save(); g.translate(b.x + b.w / 2, GROUND - 8); g.rotate(0.5);
                  g.fillStyle = b.c; rr(g, -b.w / 2, -8, b.w, 16, 3); g.fill(); g.restore();
                } else {
                  var y = GROUND - (i + 1) * BOOK_H + fallenOffset(i);
                  g.fillStyle = b.c; rr(g, b.x, y, b.w, BOOK_H - 3, 3); g.fill();
                  g.fillStyle = "rgba(255,255,255,.75)"; g.fillRect(b.x + 8, y + 5, b.w - 16, 4);
                }
              });
              function fallenOffset(i) { return 0; }
              // sliding book
              if (!falling && !done) {
                var w = curW(), bx = cx + Math.sin(slide) * 215;
                g.fillStyle = COLORS[drops % 6]; rr(g, bx - w / 2, 52, w, BOOK_H - 3, 3); g.fill();
                g.fillStyle = "rgba(255,255,255,.75)"; g.fillRect(bx - w / 2 + 8, 57, w - 16, 4);
                g.strokeStyle = dark ? "rgba(247,232,216,.5)" : "rgba(93,58,22,.4)"; g.lineWidth = 2;
                g.beginPath(); g.moveTo(bx, 82); g.lineTo(bx, stackTop() - 6); g.stroke();
              }
              if (falling) {
                g.fillStyle = COLORS[(drops) % 6]; rr(g, falling.x - falling.w / 2, falling.y, falling.w, BOOK_H - 3, 3); g.fill();
              }
              txt(g, "BOOKS BALANCE", cx, 30, 16, dark ? "#c4a68d" : "#7a5f4d");
            }
          };
        }
      });
