// GoofGig #584 — The Matching Tiles
// A tiny everyday gig: Flip them, match them, and try not to peek.
registerGame({
  n: 584,
  title: "The Matching Tiles",
  desc: "Flip them, match them, and try not to peek.",
  hint: "Flip two tiles at a time to find the pairs.",
  grades: [
    ["Captain Tile", "Perfect score, zero mercy for the tile."],
    ["Rising Tile Matcher", "You and the tile are clearly old friends."],
    ["Casual Tile Matcher", "Solid effort. The tile survived, mostly."],
    ["Rookie Tile Matcher", "The tile survived. That counts for something."],
    ["The Tile Disaster", "Somehow the tile is laughing. At you."]
  ],
  thumb: function (g) {
    g.fillStyle = "#dcfce7"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#86efac"; g.fillRect(0, 74, 300, 18);
    g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(36, 22, 12, 0, 7); g.fill();
    g.beginPath(); g.arc(264, 26, 9, 0, 7); g.fill();
    var x = 52, y = 46, s = 34, c1 = "#f59e0b", c2 = "#14532d", c3 = "#16a34a";
    g.fillStyle="#fff";g.fillRect(x-s*0.3,y-s*0.42,s*0.6,s*0.84);
    g.strokeStyle=c1;g.lineWidth=3;g.strokeRect(x-s*0.3,y-s*0.42,s*0.6,s*0.84);
    g.fillStyle=c1;g.beginPath();g.arc(x,y,s*0.16,0,7);g.fill();
    g.fillStyle=c2;g.beginPath();g.arc(x-s*0.18,y-s*0.3,s*0.06,0,7);g.fill();g.beginPath();g.arc(x+s*0.18,y+s*0.3,s*0.06,0,7);g.fill();
    x = 248; y = 46; s = 34; c1 = "#14532d"; c2 = "#16a34a"; c3 = "#f59e0b";
    g.fillStyle="#fff";g.fillRect(x-s*0.3,y-s*0.42,s*0.6,s*0.84);
    g.strokeStyle=c1;g.lineWidth=3;g.strokeRect(x-s*0.3,y-s*0.42,s*0.6,s*0.84);
    g.fillStyle=c1;g.beginPath();g.arc(x,y,s*0.16,0,7);g.fill();
    g.fillStyle=c2;g.beginPath();g.arc(x-s*0.18,y-s*0.3,s*0.06,0,7);g.fill();g.beginPath();g.arc(x+s*0.18,y+s*0.3,s*0.06,0,7);g.fill();
    x = 150; y = 46; s = 58; c1 = "#16a34a"; c2 = "#f59e0b"; c3 = "#14532d";
    g.fillStyle="#fff";g.fillRect(x-s*0.3,y-s*0.42,s*0.6,s*0.84);
    g.strokeStyle=c1;g.lineWidth=3;g.strokeRect(x-s*0.3,y-s*0.42,s*0.6,s*0.84);
    g.fillStyle=c1;g.beginPath();g.arc(x,y,s*0.16,0,7);g.fill();
    g.fillStyle=c2;g.beginPath();g.arc(x-s*0.18,y-s*0.3,s*0.06,0,7);g.fill();g.beginPath();g.arc(x+s*0.18,y+s*0.3,s*0.06,0,7);g.fill();
  },
  create: function (api) {

  var P = {sky:"#dcfce7", gnd:"#86efac", c1:"#16a34a", c2:"#f59e0b", c3:"#14532d"};
  function R(a, b) { return a + Math.random() * (b - a); }
  function RI(a, b) { return Math.floor(R(a, b + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ic(g, kind, x, y, s, c1, c2, c3) {
    if (!isFinite(x)) x = 0; if (!isFinite(y)) y = 0;
    if (!isFinite(s) || s <= 0) s = 10;
    c1 = c1 || P.c1; c2 = c2 || P.c2; c3 = c3 || P.c3;
    switch (kind) {
      case "card":
        g.fillStyle="#fff";g.fillRect(x-s*0.3,y-s*0.42,s*0.6,s*0.84);
        g.strokeStyle=c1;g.lineWidth=3;g.strokeRect(x-s*0.3,y-s*0.42,s*0.6,s*0.84);
        g.fillStyle=c1;g.beginPath();g.arc(x,y,s*0.16,0,7);g.fill();
        g.fillStyle=c2;g.beginPath();g.arc(x-s*0.18,y-s*0.3,s*0.06,0,7);g.fill();g.beginPath();g.arc(x+s*0.18,y+s*0.3,s*0.06,0,7);g.fill();
        break;
      case "star":
        g.fillStyle=c1;g.beginPath();
        for(var i=0;i<10;i++){var a=-Math.PI/2+i*Math.PI/5,r2=i%2===0?s*0.55:s*0.24;var px=x+Math.cos(a)*r2,py=y+Math.sin(a)*r2;if(i===0)g.moveTo(px,py);else g.lineTo(px,py);}
        g.closePath();g.fill();g.fillStyle=c2;g.beginPath();g.arc(x-s*0.12,y-s*0.12,s*0.1,0,7);g.fill();
        break;
      case "ball":
        g.fillStyle=c1;g.beginPath();g.arc(x,y,s*0.5,0,7);g.fill();
        g.fillStyle=c2;g.beginPath();g.arc(x-s*0.16,y-s*0.16,s*0.16,0,7);g.fill();
        g.strokeStyle="rgba(0,0,0,0.15)";g.lineWidth=2;g.beginPath();g.arc(x,y,s*0.5,0,7);g.stroke();
        break;
      case "heart":
        g.fillStyle=c1;g.beginPath();
        g.moveTo(x,y+s*0.45);g.bezierCurveTo(x-s*0.6,y-s*0.05,x-s*0.35,y-s*0.55,x,y-s*0.2);
        g.bezierCurveTo(x+s*0.35,y-s*0.55,x+s*0.6,y-s*0.05,x,y+s*0.45);g.fill();
        g.fillStyle="rgba(255,255,255,0.4)";g.beginPath();g.arc(x-s*0.2,y-s*0.18,s*0.09,0,7);g.fill();
        break;
      case "moon":
        g.fillStyle=c1;g.beginPath();g.arc(x,y,s*0.5,0,7);g.fill();
        g.fillStyle=c2;g.beginPath();g.arc(x+s*0.2,y-s*0.12,s*0.4,0,7);g.fill();
        g.fillStyle=c1;g.beginPath();g.arc(x-s*0.18,y+s*0.1,s*0.08,0,7);g.fill();
        break;
      case "sun":
        g.fillStyle=c1;g.beginPath();g.arc(x,y,s*0.34,0,7);g.fill();
        g.strokeStyle=c1;g.lineWidth=4;g.lineCap="round";
        for(var i=0;i<8;i++){var a=i*Math.PI/4;g.beginPath();g.moveTo(x+Math.cos(a)*s*0.4,y+Math.sin(a)*s*0.4);g.lineTo(x+Math.cos(a)*s*0.55,y+Math.sin(a)*s*0.55);g.stroke();}
        g.fillStyle=c2;g.beginPath();g.arc(x-s*0.1,y-s*0.06,s*0.06,0,7);g.fill();g.beginPath();g.arc(x+s*0.1,y-s*0.06,s*0.06,0,7);g.fill();
        break;
      case "flower":
        g.fillStyle=c2;
        for(var i=0;i<6;i++){var a=i*Math.PI/3;g.beginPath();g.arc(x+Math.cos(a)*s*0.3,y+Math.sin(a)*s*0.3,s*0.22,0,7);g.fill();}
        g.fillStyle=c1;g.beginPath();g.arc(x,y,s*0.22,0,7);g.fill();
        g.fillStyle="#4caf50";g.fillRect(x-2,y+s*0.2,4,s*0.3);
        break;
      case "rocket":
        g.fillStyle=c1;g.beginPath();g.moveTo(x,y-s*0.55);g.quadraticCurveTo(x+s*0.3,y-s*0.1,x+s*0.22,y+s*0.3);g.lineTo(x-s*0.22,y+s*0.3);g.quadraticCurveTo(x-s*0.3,y-s*0.1,x,y-s*0.55);g.fill();
        g.fillStyle=c2;g.beginPath();g.arc(x,y-s*0.08,s*0.12,0,7);g.fill();
        g.fillStyle="#ef4444";g.beginPath();g.moveTo(x-s*0.22,y+s*0.2);g.lineTo(x-s*0.4,y+s*0.5);g.lineTo(x-s*0.18,y+s*0.42);g.closePath();g.fill();
        g.beginPath();g.moveTo(x+s*0.22,y+s*0.2);g.lineTo(x+s*0.4,y+s*0.5);g.lineTo(x+s*0.18,y+s*0.42);g.closePath();g.fill();
        g.fillStyle="#f59e0b";g.beginPath();g.moveTo(x-s*0.1,y+s*0.3);g.lineTo(x,y+s*0.55);g.lineTo(x+s*0.1,y+s*0.3);g.closePath();g.fill();
        break;
      default:
        g.fillStyle = c1; g.beginPath(); g.arc(x, y, s * 0.5, 0, 7); g.fill();
        g.fillStyle = c2; g.beginPath(); g.arc(x - s * 0.15, y - s * 0.15, s * 0.18, 0, 7); g.fill();
    }
  }
  function bg(g) {
    var dk = isDark();
    g.fillStyle = dk ? "#232c3d" : P.sky; g.fillRect(0, 0, W, H);
g.fillStyle=dk?"#2b3648":"#bfdbfe";
g.beginPath();g.moveTo(0,300);g.lineTo(150,180);g.lineTo(300,300);g.closePath();g.fill();
g.beginPath();g.moveTo(250,300);g.lineTo(420,150);g.lineTo(590,300);g.closePath();g.fill();
g.fillStyle="#fff";g.beginPath();g.moveTo(150,180);g.lineTo(178,214);g.lineTo(122,214);g.closePath();g.fill();
g.fillStyle="#fbbf24";g.beginPath();g.arc(W-80,70,24,0,7);g.fill();
    g.fillStyle = dk ? "#2c3646" : P.gnd; g.fillRect(0, H - 34, W, 34);
  }
  function dots(g, n, done, cx, cy) {
    for (var i = 0; i < n; i++) {
      g.fillStyle = i < done ? "#4caf50" : "rgba(120,120,120,0.35)";
      g.beginPath(); g.arc(cx + (i - (n - 1) / 2) * 22, cy, 7, 0, 7); g.fill();
    }
  }
  function bar(g, x, y, w, h, frac, col) {
    frac = clamp(frac, 0, 1);
    g.fillStyle = "rgba(120,120,120,0.25)"; rr(g, x, y, w, h, h / 2); g.fill();
    if (frac > 0.01) { g.fillStyle = col; rr(g, x, y, w * frac, h, h / 2); g.fill(); }
  }
  function san(p) {
    if (!p || typeof p.x !== "number" || typeof p.y !== "number") return null;
    var x = p.x, y = p.y;
    if (!isFinite(x)) x = 0; if (!isFinite(y)) y = 0;
    return { x: clamp(x, 0, W), y: clamp(y, 0, H) };
  }
  var t0 = -1, done = false;
  function el(now) { if (!isFinite(now)) now = 0; if (t0 < 0) t0 = now; return Math.max(0, now - t0); }
  function fin(score, rows) {
    if (done) return; done = true;
    score = Math.round(score); if (!isFinite(score)) score = 0;
    score = clamp(score, 0, 100);
    if (!rows || !rows.length) rows = [{ label: "Score", value: score, text: score + "%", good: score >= 70 }];
    api.finish({ score: score, rows: rows });
  }
  function rows2(l1, v1, t1, l2, v2, t2) {
    return [
      { label: l1, value: clamp(Math.round(v1), 0, 100), text: t1, good: v1 >= 70 },
      { label: l2, value: clamp(Math.round(v2), 0, 100), text: t2, good: v2 >= 70 }
    ];
  }


  var PAIRS = 1 === 1 ? 6 : 4;
  var tiles = [], first = -1, lock = false, lockT = 0, found = 0, flips = 0, cur = 0;
  var kinds = ["star", "ball", "heart", "moon", "sun", "flower"];
  var cols = ["#ef4444", "#38bdf8", "#a3e635", "#f59e0b", "#c084fc", "#fb923c"];
  (function build() {
    var deck = [];
    for (var k = 0; k < PAIRS; k++) { deck.push(k); deck.push(k); }
    for (var i = deck.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = deck[i]; deck[i] = deck[j]; deck[j] = tmp;
    }
    var colsN = PAIRS === 6 ? 4 : 4, rowsN = PAIRS === 6 ? 3 : 2;
    for (var t = 0; t < deck.length; t++) {
      var c = t % colsN, r = Math.floor(t / colsN);
      tiles.push({
        kind: deck[t],
        x: 180 + c * 120, y: 165 + r * 105,
        up: false, gone: false
      });
    }
  })();
  function finishAll() {
    var sc = Math.round(found / PAIRS * 80 + clamp(20 - flips * 0.5, 0, 20));
    fin(sc, rows2("Pairs Found", Math.round(found / PAIRS * 100), found + " / " + PAIRS, "Flips", clamp(100 - flips * 2, 0, 100), flips + " flips"));
  }
  function down(p, now) {
    if (done || lock) return; var q = san(p); if (!q) return;
    for (var i = 0; i < tiles.length; i++) {
      var tl = tiles[i];
      if (!tl.gone && !tl.up && Math.abs(q.x - tl.x) < 52 && Math.abs(q.y - tl.y) < 44) {
        tl.up = true; flips++; blip(660, 0.07, "sine", 0.14);
        if (first < 0) { first = i; }
        else {
          if (tiles[first].kind === tl.kind) {
            tiles[first].gone = true; tl.gone = true; found++; sndGood();
            first = -1;
            if (found >= PAIRS) finishAll();
          } else {
            lock = true; lockT = cur + 0.7;
          }
        }
        break;
      }
    }
  }
  function move(p, now) {}
  function up(p, now) {}
  function draw(g, dt, now) {
    bg(g);
    var t = el(now); cur = t;
    if (!done && t > 25) finishAll();
    if (!done && lock && t >= lockT) {
      for (var i = 0; i < tiles.length; i++) if (!tiles[i].gone) tiles[i].up = false;
      first = -1; lock = false;
    }
    var cx = W / 2;
    txt(g, "Find the pairs: " + found + " / " + PAIRS + "  •  Flips " + flips, cx, 52, 22, isDark() ? "#e8e8e8" : "#334155");
    dots(g, PAIRS, found, cx, 82);
    for (var j = 0; j < tiles.length; j++) {
      var tl = tiles[j];
      if (tl.gone) {
        g.fillStyle = "rgba(76,175,80,0.18)";
        rr(g, tl.x - 50, tl.y - 42, 100, 84, 12); g.fill();
        continue;
      }
      if (tl.up) {
        g.fillStyle = isDark() ? "#2f3a4d" : "#ffffff";
        rr(g, tl.x - 50, tl.y - 42, 100, 84, 12); g.fill();
        g.strokeStyle = cols[tl.kind]; g.lineWidth = 3;
        rr(g, tl.x - 50, tl.y - 42, 100, 84, 12); g.stroke();
        ic(g, kinds[tl.kind], tl.x, tl.y, 44, cols[tl.kind], "#ffffff", cols[tl.kind]);
      } else {
        g.fillStyle = P.c1;
        rr(g, tl.x - 50, tl.y - 42, 100, 84, 12); g.fill();
        g.fillStyle = "rgba(255,255,255,0.35)";
        txt(g, "?", tl.x, tl.y + 2, 26, "#ffffff", "center", "bold");
      }
    }
    txt(g, "Flip two tiles at a time to find the matching pairs.", cx, H - 46, 15, isDark() ? "#aab6c6" : "#64748b");
    bar(g, 24, H - 26, W - 48, 8, 1 - t / 25, "#38bdf8");
  }

  return {
    status: function () { return "Pairs: " + found + " / " + PAIRS + (done ? "  Done!" : ""); },
    down: down, move: move, up: up, draw: draw
  };

  }
});
