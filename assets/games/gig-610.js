// GoofGig #610 — Coin in the Fountain
// A tiny everyday gig: Flick a coin into the fountain. The middle ring pays best. Make a wish.
registerGame({
  n: 610,
  title: "Coin in the Fountain",
  desc: "Flick a coin into the fountain. The middle ring pays best. Make a wish.",
  hint: "Flick the coin <b>toward the fountain</b> — the direction and speed of your flick is the throw.",
  grades: [
    ["Fountain Royalty", "Three coins, three wishes, one very impressed fountain."],
    ["Wish Granter", "The fountain heard you loud and clear."],
    ["Coin Tosser", "In the water, mostly where you meant. The wish stands."],
    ["Sidewalk Saver", "Your coins keep landing on the pavement. The pigeons thank you."],
    ["Wishful Thinker", "The fountain is dry of wishes and full of your excuses."]
  ],
  thumb: function (g) {
    g.fillStyle = "#e0f2fe"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#38bdf8";
    g.beginPath(); g.ellipse(150, 66, 80, 18, 0, 0, 7); g.fill();
    g.beginPath(); g.ellipse(150, 62, 52, 12, 0, 0, 7); g.fill();
    g.beginPath(); g.ellipse(150, 58, 24, 7, 0, 0, 7); g.fill();
    g.fillStyle = "#facc15"; g.beginPath(); g.arc(150, 34, 9, 0, 7); g.fill();
    g.fillStyle = "#facc15"; g.beginPath(); g.arc(90, 22, 9, 0, 7); g.fill();
  },
  create: function (api) {
    var LIMIT = 20, COINS = 3;
    var t0 = -1, done = false;
    var coinsLeft = COINS, score = 0, ringHits = 0;
    var flicking = false, flickStart = null, flickCur = null;
    var coin = null; // {x,y,vx,vy,landed}
    var splashes = [], flash = 0, flashTxt = "";
    var F = { x: 500, y: 250, r1: 26, r2: 62, r3: 100 };
    function el(now) { if (!isFinite(now)) now = 0; if (t0 < 0) t0 = now; return Math.max(0, now - t0); }
    function fin(s, rows) {
      if (done) return; done = true;
      s = clamp(Math.round(s), 0, 100); if (!isFinite(s)) s = 0;
      api.finish({ score: s, rows: rows });
    }
    function finishAll(now) {
      var total = score;
      fin(total, [
        { label: "Fountain points", value: Math.round(clamp(total / 150 * 100, 0, 100)), text: total + " pts", good: total >= 80 },
        { label: "Rings hit", value: Math.round(ringHits / COINS * 100), text: ringHits + " / " + COINS + " in the water", good: ringHits >= 2 }
      ]);
    }
    function newCoin() { return { x: 130, y: 330, vx: 0, vy: 0, flying: false }; }
    coin = newCoin();
    return {
      status: function () {
        return done ? "Wishes made. The fountain keeps the change." : "Coins left: " + coinsLeft + " — points: " + score;
      },
      down: function (p, now) {
        el(now); if (done || coinsLeft <= 0) return;
        if (!coin.flying && dist(p.x, p.y, coin.x, coin.y) < 55) {
          flicking = true; flickStart = { x: p.x, y: p.y }; flickCur = { x: p.x, y: p.y };
        }
      },
      move: function (p, now) { if (flicking) flickCur = { x: p.x, y: p.y }; },
      up: function (p, now) {
        if (!flicking || done) return;
        flicking = false;
        var dx = flickCur.x - flickStart.x, dy = flickCur.y - flickStart.y;
        var power = Math.hypot(dx, dy);
        if (power < 20) return;
        coin.flying = true;
        coin.vx = clamp(dx * 3.4, -80, 560);
        coin.vy = clamp(dy * 3.4, -520, 200);
        coinsLeft--;
        blip(480, 0.06);
      },
      draw: function (g, dt, now) {
        var dark = isDark();
        var t = el(now);
        if (!done && t > LIMIT) finishAll(now);
        if (!done && coinsLeft === 0 && !coin.flying && !flicking) finishAll(now);
        // coin physics
        if (coin.flying) {
          coin.vy += 640 * dt;
          coin.x += coin.vx * dt; coin.y += coin.vy * dt;
          var dF = dist(coin.x, coin.y, F.x, F.y);
          if (coin.vy > 0 && coin.y >= F.y - 8 && dF <= F.r3 + 6) {
            // landed in the fountain
            coin.flying = false;
            var pts = 0, ring = "miss";
            if (dF <= F.r1) { pts = 50; ring = "bullseye!"; }
            else if (dF <= F.r2) { pts = 30; ring = "middle ring"; }
            else { pts = 10; ring = "outer ring"; }
            score += pts; ringHits++;
            splashes.push({ x: coin.x, y: F.y, r: 6, a: 1 });
            flash = 0.9; flashTxt = "+" + pts + " — " + ring;
            sndGood();
            coin = newCoin();
          } else if (coin.y >= 380) {
            // hit the pavement
            coin.flying = false;
            flash = 0.9; flashTxt = "Clink! The pavement keeps it.";
            sndBad();
            coin = newCoin();
          } else if (coin.x > 720 || coin.x < 0) {
            coin.flying = false;
            flash = 0.9; flashTxt = "Way off! The pigeons got it.";
            sndBad();
            coin = newCoin();
          }
        }
        // scene
        g.fillStyle = dark ? "#16202b" : "#e0f2fe"; g.fillRect(0, 0, W, H);
        g.fillStyle = dark ? "#2b3a4a" : "#f1f5f9"; g.fillRect(0, 330, W, 110);
        // paving lines
        g.strokeStyle = dark ? "#33506b" : "#cbd5e1"; g.lineWidth = 2;
        for (var i = 0; i < 6; i++) { g.beginPath(); g.moveTo(0, 350 + i * 16); g.lineTo(W, 350 + i * 16); g.stroke(); }
        // fountain basin + rings
        g.fillStyle = dark ? "#475569" : "#94a3b8";
        g.beginPath(); g.ellipse(F.x, F.y, F.r3 + 16, 44, 0, 0, 7); g.fill();
        g.fillStyle = dark ? "#1d4e6b" : "#38bdf8";
        g.beginPath(); g.ellipse(F.x, F.y, F.r3, 38, 0, 0, 7); g.fill();
        g.fillStyle = dark ? "#0e7490" : "#7dd3fc";
        g.beginPath(); g.ellipse(F.x, F.y, F.r2, 26, 0, 0, 7); g.fill();
        g.fillStyle = dark ? "#155e75" : "#bae6fd";
        g.beginPath(); g.ellipse(F.x, F.y, F.r1, 14, 0, 0, 7); g.fill();
        // center spout
        g.fillStyle = dark ? "#64748b" : "#cbd5e1"; rr(g, F.x - 8, F.y - 52, 16, 52, 6); g.fill();
        g.strokeStyle = "#7dd3fc"; g.lineWidth = 3;
        g.beginPath(); g.moveTo(F.x, F.y - 52); g.quadraticCurveTo(F.x - 26, F.y - 66, F.x - 34, F.y - 34); g.stroke();
        g.beginPath(); g.moveTo(F.x, F.y - 52); g.quadraticCurveTo(F.x + 26, F.y - 66, F.x + 34, F.y - 34); g.stroke();
        // ring labels
        txt(g, "50", F.x, F.y - 2, 15, "#075985");
        txt(g, "30", F.x + 44, F.y + 2, 13, "#075985");
        txt(g, "10", F.x + 80, F.y + 2, 13, "#075985");
        // splashes
        splashes = splashes.filter(function (s) { return s.a > 0; });
        splashes.forEach(function (s) {
          s.r += 70 * dt; s.a -= dt * 1.6;
          g.strokeStyle = "rgba(125,211,252," + clamp(s.a, 0, 1) + ")"; g.lineWidth = 3;
          g.beginPath(); g.ellipse(s.x, s.y, s.r, s.r * 0.3, 0, 0, 7); g.stroke();
        });
        // flick guide
        if (flicking && flickStart) {
          var dx = flickCur.x - flickStart.x, dy = flickCur.y - flickStart.y;
          g.strokeStyle = "#f59e0b"; g.lineWidth = 3; g.setLineDash([6, 5]);
          g.beginPath(); g.moveTo(coin.x, coin.y);
          g.lineTo(coin.x + clamp(dx * 1.1, -180, 180), coin.y + clamp(dy * 1.1, -160, 160)); g.stroke(); g.setLineDash([]);
        }
        // coin
        g.fillStyle = "#facc15"; g.beginPath(); g.arc(coin.x, coin.y, 13, 0, 7); g.fill();
        g.strokeStyle = "#b45309"; g.lineWidth = 2; g.beginPath(); g.arc(coin.x, coin.y, 13, 0, 7); g.stroke();
        txt(g, "$", coin.x, coin.y + 1, 15, "#92400e");
        if (!coin.flying && coinsLeft > 0 && !flicking) txt(g, "flick the coin toward the fountain", 200, 300, 17, dark ? "#94a3b8" : "#64748b");
        // coins left
        for (var j = 0; j < COINS; j++) {
          g.fillStyle = j < coinsLeft ? "#facc15" : (dark ? "#33506b" : "#cbd5e1");
          g.beginPath(); g.arc(60 + j * 32, 40, 11, 0, 7); g.fill();
        }
        if (flash > 0) { flash -= dt; txt(g, flashTxt, 360, 70, 26, flashTxt.indexOf("+") === 0 ? "#16a34a" : "#64748b"); }
        var tl = clamp(1 - t / LIMIT, 0, 1);
        g.fillStyle = dark ? "#223140" : "#dbeafe"; rr(g, 160, H - 26, 400, 9, 4); g.fill();
        g.fillStyle = tl > 0.3 ? "#0284c7" : "#dc2626"; rr(g, 160, H - 26, 400 * tl, 9, 4); g.fill();
      }
    };
  }
});
