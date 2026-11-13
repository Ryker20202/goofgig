/* ================================================================
   GoofGig — Gig #005 (independent game module)
   ----------------------------------------------------------------
   This file is ONE game. It registers itself with the shell via
   registerGame(). To add a new game later (e.g. Gig #021):
     1. Copy this file (or gig-template.js) to gig-021.js
     2. Change its number/title/gameplay
     3. Add ONE line for it in manifest.js
   The shell (index.html) and every other gig file stay untouched.
   ================================================================ */
/* ================================================================
         GIG #005 — Catch the Toast
         Toast pops to a random height — catch it at the very top.
         ================================================================ */
      registerGame({
        n: 5, title: "Catch the Toast",
        desc: "It pops when it feels like it. Grab it at the top of the arc.",
        hint: 'Toast pops out at a random height — <b>tap</b> to catch it at its <b>highest point</b>. You get <b>3 pops</b>, best catch counts.',
        grades: [
          ["Apex Predator", "Caught at the exact peak. The toast never saw you coming."],
          ["Breakfast Ninja", "Fast hands, warm toast, zero crumbs of doubt."],
          ["Toast Watcher", "A solid grab. Butter it before it cools."],
          ["Crumb Chaser", "You caught mostly air, but the toast respects the effort."],
          ["Floor Toast Fan", "Five-second rule is doing heavy lifting here."]
        ],
        thumb: function (g) {
          g.fillStyle = "#8fa3ad"; rr(g, 100, 56, 100, 30, 10); g.fill();
          g.fillStyle = "#e8a54b"; rr(g, 128, 12, 44, 40, 12); g.fill();
          g.fillStyle = "#cf8430"; rr(g, 136, 20, 28, 24, 8); g.fill();
        },
        create: function (api) {
          var TY = 352, pops = 0, best = 0, state = "wait", waitT = 0.7, toast = null, caught = null, done = false;
          function launch() {
            pops++;
            var peak = 120 + Math.random() * 130; // apex height above start
            var vy = -Math.sqrt(2 * 1500 * peak);
            toast = { y: TY, vy: vy };
            state = "fly";
          }
          function endPop(scoreHere) {
            best = Math.max(best, scoreHere);
            toast = null; caught = null;
            if (pops >= 3) {
              done = true;
              api.finish({ score: clamp(Math.round(best), 1, 100), rows: [
                { label: "Best catch", value: best, text: Math.round(best) + " / 100", good: best >= 70 }
              ] });
            } else { state = "wait"; waitT = 0.9; }
          }
          return {
            status: function () { return done ? "Breakfast served!" : "Pop " + Math.min(pops + (state === "fly" ? 0 : 1), 3) + " of 3 · best " + Math.round(best); },
            down: function () {
              if (done || state !== "fly" || !toast) return;
              var s = clamp(100 - Math.abs(toast.vy) / 11, 2, 100);
              caught = { y: toast.y, s: s };
              if (s >= 70) sndGood(); else sndBad();
              state = "caught"; waitT = 0.75;
            },
            move: function () {}, up: function () {},
            draw: function (g, dt) {
              var dark = isDark();
              if (!done) {
                if (state === "wait") { waitT -= dt; if (waitT <= 0) launch(); }
                else if (state === "fly" && toast) {
                  toast.vy += 1500 * dt; toast.y += toast.vy * dt;
                  if (toast.y >= TY && toast.vy > 0) { sndBad(); endPop(4); }
                } else if (state === "caught") { waitT -= dt; if (waitT <= 0) endPop(caught ? caught.s : 0); }
              }
              // table
              g.fillStyle = "#b9834e"; rr(g, 40, 392, 640, 30, 10); g.fill();
              // toaster
              g.fillStyle = "#8fa3ad"; rr(g, 285, TY + 6, 150, 52, 14); g.fill();
              g.fillStyle = "#6d828d"; rr(g, 300, TY + 2, 120, 12, 6); g.fill();
              g.fillStyle = "#ff5a3c"; g.beginPath(); g.arc(452, TY + 30, 7, 0, Math.PI * 2); g.fill();
              // toast in flight / caught
              var ty = toast ? toast.y : (caught ? caught.y : null);
              if (ty !== null) {
                g.save(); g.translate(W / 2, ty);
                g.fillStyle = "#e8a54b"; rr(g, -42, -46, 84, 62, 16); g.fill();
                g.fillStyle = "#f7d9a0"; rr(g, -32, -37, 64, 44, 11); g.fill();
                g.restore();
                if (caught) txt(g, "+" + Math.round(caught.s), W / 2 + 84, ty - 10, 24, "#0e9594");
              }
              if (state === "wait" && !done) txt(g, "Wait for it…", W / 2, 70, 22, dark ? "rgba(247,232,216,.8)" : "rgba(93,58,22,.7)");
              if (state === "fly") txt(g, "Catch it at the top!", W / 2, 70, 20, dark ? "rgba(247,232,216,.8)" : "rgba(93,58,22,.7)");
            }
          };
        }
      });
