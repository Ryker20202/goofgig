/* ================================================================
   GoofGig — Gig #084 (independent game module)
   ================================================================ */
/* ================================================================
         GIG #084 — Ski Jump
         Hold to crouch as you race down the ramp; release right
         at the lip to fly. Distance is everything.
         ================================================================ */
      registerGame({
        n: 84, title: "Ski Jump",
        desc: "Crouch deep, launch at the lip, fly like a polite eagle.",
        hint: '<b>Hold</b> to crouch (power builds) as you speed down the ramp. <b>Release right at the lip marker</b> to jump — deep crouch plus perfect timing equals huge distance.',
        grades: [
          ["Ski Flying Royalty", "The judges are standing. One is crying. It's snowing applause."],
          ["Eagle Cosplayer", "Huge air. The landing slope needed a moment."],
          ["Solid Jumper", "A respectable flight with a survivable landing."],
          ["Cautious Bunny Hill Fan", "That was less a jump, more a brisk slide with ambitions."],
          ["Snowball With Skis", "You left the ramp like a dropped sandwich."]
        ],
        thumb: function (g) {
          g.strokeStyle = "#fdfdf8"; g.lineWidth = 7;
          g.beginPath(); g.moveTo(96, 10); g.quadraticCurveTo(160, 30, 196, 62); g.stroke();
          g.strokeStyle = "#bfe3f2"; g.lineWidth = 3;
          g.beginPath(); g.moveTo(196, 62); g.lineTo(258, 76); g.stroke();
          g.fillStyle = "#e3352b"; g.beginPath(); g.arc(206, 52, 8, 0, Math.PI * 2); g.fill();
        },
        create: function (api) {
          var phase = "approach", t = 0, u = 0, crouch = 0, holding = false;
          var done = false, flyT = 0, jumpDist = 0, jumpU = 0;
          var LIP = { x: 440, y: 296 };
          function rampPoint(uu) {
            // quadratic bezier: (64,72) ctrl (300,110) -> lip (440,296)
            var a = (1 - uu) * (1 - uu), b = 2 * (1 - uu) * uu, c = uu * uu;
            return { x: a * 64 + b * 300 + c * LIP.x, y: a * 72 + b * 110 + c * LIP.y };
          }
          function slopeY(x) { return 304 + (x - LIP.x) * 0.52; }
          function doJump() {
            phase = "flight"; flyT = 0; jumpU = u;
            var errPx = (1 - u) * 260;
            var base = u < 0.5 ? 14 : 126 - errPx * 0.5;
            jumpDist = clamp(base * (0.5 + crouch * 0.0055), 4, 138);
            blip(300 + crouch * 3, .09, "sawtooth", .05);
          }
          function finishRound() {
            done = true;
            var s = clamp(Math.round(jumpDist / 138 * 100), 2, 100);
            if (s >= 70) sndGood(); else sndBad();
            api.finish({ score: s, rows: [
              { label: "Jump distance", value: s, text: Math.round(jumpDist) + " m", good: jumpDist >= 95 },
              { label: "Crouch power", value: crouch, text: Math.round(crouch) + "%" },
              { label: "Release timing", value: clamp(100 - (1 - jumpU) * 260 * 0.5, 0, 100), text: jumpU >= 0.93 ? "Right at the lip!" : jumpU < 0.5 ? "Way too early" : "A touch early" }
            ] });
          }
          return {
            status: function () {
              if (done) return "Jump judged!";
              if (phase === "flight") return "FLYING…";
              return holding ? "Crouch " + Math.round(crouch) + "% — release AT THE LIP!" : "Hold to crouch — the lip is coming!";
            },
            down: function () {
              if (done || phase !== "approach" || holding) return;
              audio(); holding = true;
            },
            move: function () {},
            up: function () {
              if (done || phase !== "approach" || !holding) return;
              holding = false;
              doJump();
            },
            draw: function (g, dt) {
              var dark = isDark();
              if (phase === "approach" && !done) {
                t += dt;
                u = Math.pow(clamp(t / 2.3, 0, 1), 1.3);
                if (holding) crouch = clamp(crouch + dt * 78, 0, 100);
                if (u >= 1) { holding = false; doJump(); }
              }
              // mountain + ramp
              g.fillStyle = dark ? "#26314f" : "#cfe8f7"; g.fillRect(0, 0, W, 460);
              g.fillStyle = dark ? "#3d4a6b" : "#fdfdf8";
              g.beginPath(); g.moveTo(30, 460); g.lineTo(30, 60);
              g.quadraticCurveTo(300, 100, LIP.x, LIP.y - 6);
              g.lineTo(706, 448); g.lineTo(706, 460); g.closePath(); g.fill();
              g.strokeStyle = "#57b7dd"; g.lineWidth = 5;
              g.beginPath(); g.moveTo(58, 66); g.quadraticCurveTo(300, 106, LIP.x, LIP.y - 10); g.stroke();
              g.strokeStyle = "rgba(87,183,221,.6)"; g.lineWidth = 3;
              g.beginPath(); g.moveTo(LIP.x, LIP.y - 8); g.lineTo(700, slopeY(700) - 4); g.stroke();
              // lip marker zone
              var zp = rampPoint(0.93);
              g.fillStyle = "rgba(53,196,160,.85)"; g.beginPath(); g.arc(zp.x, zp.y - 8, 9, 0, Math.PI * 2); g.fill();
              g.fillStyle = "#e3352b"; g.beginPath(); g.arc(LIP.x, LIP.y - 12, 6, 0, Math.PI * 2); g.fill();
              txt(g, "LIP", LIP.x + 4, LIP.y - 28, 14, "#e3352b");
              // distance flags on the slope
              [0.35, 0.6, 0.85].forEach(function (f) {
                var fx = LIP.x + 214 * f;
                g.strokeStyle = "#e88ca0"; g.lineWidth = 3;
                g.beginPath(); g.moveTo(fx, slopeY(fx) - 4); g.lineTo(fx, slopeY(fx) - 24); g.stroke();
                txt(g, Math.round(138 * f) + "m", fx, slopeY(fx) - 30, 12, dark ? "#c4a68d" : "#7a5f4d");
              });
              // skier
              if (phase === "approach") {
                var p = rampPoint(u);
                drawSkier(g, p.x, p.y - 12, holding ? 1 : 0.3);
              } else if (!done) {
                flyT += dt;
                var dur = 0.7 + jumpDist / 138 * 0.85;
                var f = clamp(flyT / dur, 0, 1);
                var fx2 = LIP.x + jumpDist * 1.55 * f;
                var fy = (LIP.y - 14) + (slopeY(fx2) - (LIP.y - 14)) * f - Math.sin(f * Math.PI) * 88;
                drawSkier(g, fx2, fy, 0.15);
                if (f >= 1) finishRound();
              } else {
                var lx = LIP.x + jumpDist * 1.55;
                drawSkier(g, lx, slopeY(lx) - 10, 0.4);
                txt(g, Math.round(jumpDist) + " m!", clamp(lx, 90, W - 90), slopeY(lx) - 44, 25, "#e3352b");
              }
              function drawSkier(g2, x, y, crouchAmt) {
                g2.save(); g2.translate(x, y); g2.rotate(0.25 - crouchAmt * 0.1);
                g2.strokeStyle = "#33241a"; g2.lineWidth = 4;
                g2.beginPath(); g2.moveTo(-14, 14); g2.lineTo(16, 10); g2.stroke();
                g2.fillStyle = "#e3352b"; g2.beginPath(); g2.arc(0, -6 - crouchAmt * 3, 8, 0, Math.PI * 2); g2.fill();
                g2.strokeStyle = "#e3352b"; g2.lineWidth = 5;
                g2.beginPath(); g2.moveTo(-2, 0); g2.lineTo(4 + crouchAmt * 5, 8); g2.stroke();
                g2.restore();
              }
              // crouch meter
              var PW = 300, PX = 60, PY = 420;
              txt(g, "CROUCH", PX + 40, PY - 10, 14, dark ? "#c4a68d" : "#5d7a94");
              g.fillStyle = dark ? "#39445f" : "#dceefb"; rr(g, PX, PY, PW, 16, 8); g.fill();
              g.fillStyle = "#e3352b"; rr(g, PX, PY, Math.max(8, PW * crouch / 100), 16, 8); g.fill();
              if (phase === "approach" && !holding && u < 0.4) txt(g, "HOLD to crouch — release exactly at the red lip!", W / 2, 40, 18, dark ? "rgba(247,232,216,.85)" : "rgba(40,70,100,.8)");
            }
          };
        }
      });
