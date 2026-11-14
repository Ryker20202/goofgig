// GoofGig #316 — The Dog Leash
// A tiny everyday gig: Clip it on before he sees the squirrel.
registerGame({
  n: 316,
  title: "The Dog Leash",
  desc: "Clip it on before he sees the squirrel.",
  hint: "Drag the leash onto the dog.",
  grades: [
    ["The Dog Whisperer", "Perfect score, zero mercy for the dog."],
    ["The Dog Ace", "Strong run. One tiny wobble, forgiven."],
    ["Capable Leash Master", "Good enough to brag about at lunch."],
    ["Learning Leash Master", "The dog survived. That counts for something."],
    ["Chaos Leash Master", "The dog has seen things now. Terrible things."]
  ],
  thumb: function (g) {
    g.fillStyle = "#ffedd5"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#d6d3d1"; g.fillRect(0, 74, 300, 18);
    g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(36, 22, 12, 0, 7); g.fill();
    g.beginPath(); g.arc(264, 26, 9, 0, 7); g.fill();
    var x = 52, y = 46, s = 34, c1 = "#22c55e", c2 = "#7c2d12", c3 = "#fb923c";
    g.fillStyle=c1;g.beginPath();g.arc(x,y,s*0.42,0,7);g.fill();
    g.fillStyle=c2;g.beginPath();g.ellipse(x-s*0.4,y-s*0.02,s*0.14,s*0.28,0.3,0,7);g.fill();
    g.beginPath();g.ellipse(x+s*0.4,y-s*0.02,s*0.14,s*0.28,-0.3,0,7);g.fill();
    g.fillStyle="#222";g.beginPath();g.arc(x-s*0.16,y-s*0.08,s*0.05,0,7);g.fill();g.beginPath();g.arc(x+s*0.16,y-s*0.08,s*0.05,0,7);g.fill();
    g.fillStyle="#222";g.beginPath();g.ellipse(x,y+s*0.12,s*0.1,s*0.07,0,0,7);g.fill();
    g.strokeStyle="#222";g.lineWidth=2;g.beginPath();g.moveTo(x,y+s*0.2);g.quadraticCurveTo(x,y+s*0.3,x+s*0.1,y+s*0.28);g.stroke();
    x = 248; y = 46; s = 34; c1 = "#7c2d12"; c2 = "#fb923c"; c3 = "#22c55e";
    g.fillStyle=c1;g.beginPath();g.arc(x,y,s*0.42,0,7);g.fill();
    g.fillStyle=c2;g.beginPath();g.ellipse(x-s*0.4,y-s*0.02,s*0.14,s*0.28,0.3,0,7);g.fill();
    g.beginPath();g.ellipse(x+s*0.4,y-s*0.02,s*0.14,s*0.28,-0.3,0,7);g.fill();
    g.fillStyle="#222";g.beginPath();g.arc(x-s*0.16,y-s*0.08,s*0.05,0,7);g.fill();g.beginPath();g.arc(x+s*0.16,y-s*0.08,s*0.05,0,7);g.fill();
    g.fillStyle="#222";g.beginPath();g.ellipse(x,y+s*0.12,s*0.1,s*0.07,0,0,7);g.fill();
    g.strokeStyle="#222";g.lineWidth=2;g.beginPath();g.moveTo(x,y+s*0.2);g.quadraticCurveTo(x,y+s*0.3,x+s*0.1,y+s*0.28);g.stroke();
    x = 150; y = 46; s = 58; c1 = "#fb923c"; c2 = "#22c55e"; c3 = "#7c2d12";
    g.fillStyle=c1;g.beginPath();g.arc(x,y,s*0.42,0,7);g.fill();
    g.fillStyle=c2;g.beginPath();g.ellipse(x-s*0.4,y-s*0.02,s*0.14,s*0.28,0.3,0,7);g.fill();
    g.beginPath();g.ellipse(x+s*0.4,y-s*0.02,s*0.14,s*0.28,-0.3,0,7);g.fill();
    g.fillStyle="#222";g.beginPath();g.arc(x-s*0.16,y-s*0.08,s*0.05,0,7);g.fill();g.beginPath();g.arc(x+s*0.16,y-s*0.08,s*0.05,0,7);g.fill();
    g.fillStyle="#222";g.beginPath();g.ellipse(x,y+s*0.12,s*0.1,s*0.07,0,0,7);g.fill();
    g.strokeStyle="#222";g.lineWidth=2;g.beginPath();g.moveTo(x,y+s*0.2);g.quadraticCurveTo(x,y+s*0.3,x+s*0.1,y+s*0.28);g.stroke();
  },
  create: function (api) {

  var P = {sky:"#ffedd5", gnd:"#d6d3d1", c1:"#fb923c", c2:"#22c55e", c3:"#7c2d12"};
  function R(a, b) { return a + Math.random() * (b - a); }
  function RI(a, b) { return Math.floor(R(a, b + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ic(g, kind, x, y, s, c1, c2, c3) {
    if (!isFinite(x)) x = 0; if (!isFinite(y)) y = 0;
    if (!isFinite(s) || s <= 0) s = 10;
    c1 = c1 || P.c1; c2 = c2 || P.c2; c3 = c3 || P.c3;
    switch (kind) {
      case "dog":
        g.fillStyle=c1;g.beginPath();g.arc(x,y,s*0.42,0,7);g.fill();
        g.fillStyle=c2;g.beginPath();g.ellipse(x-s*0.4,y-s*0.02,s*0.14,s*0.28,0.3,0,7);g.fill();
        g.beginPath();g.ellipse(x+s*0.4,y-s*0.02,s*0.14,s*0.28,-0.3,0,7);g.fill();
        g.fillStyle="#222";g.beginPath();g.arc(x-s*0.16,y-s*0.08,s*0.05,0,7);g.fill();g.beginPath();g.arc(x+s*0.16,y-s*0.08,s*0.05,0,7);g.fill();
        g.fillStyle="#222";g.beginPath();g.ellipse(x,y+s*0.12,s*0.1,s*0.07,0,0,7);g.fill();
        g.strokeStyle="#222";g.lineWidth=2;g.beginPath();g.moveTo(x,y+s*0.2);g.quadraticCurveTo(x,y+s*0.3,x+s*0.1,y+s*0.28);g.stroke();
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
g.fillStyle=dk?"#2b3648":"#fde68a";
g.beginPath();g.arc(80,90,30,0,7);g.fill();g.beginPath();g.arc(W-100,70,24,0,7);g.fill();
g.fillStyle="rgba(244,114,182,0.5)";
g.beginPath();g.ellipse(200,320,14,10,0,0,7);g.fill();g.beginPath();g.ellipse(500,330,14,10,0,0,7);g.fill();
g.fillStyle=dk?"#3b475c":"#d6d3d1";g.fillRect(0,300,W,70);
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


  var RND = 3;
  var round = 0, scores = [], flash = 0, flashGood = false, msg = "";
  var ix = 0, iy = 0, tx = 0, ty = 0, grab = false, gx = 0, gy = 0, RING = 1;
  function newRound() {
    ix = R(120, 300); iy = R(150, 280);
    tx = R(430, 600); ty = R(150, 280);
    msg = "Round " + (round + 1) + " of " + RND + "  —  drag it to the target";
  }
  newRound();
  function finishAll() {
    var avg = 0, best = 0;
    for (var i = 0; i < scores.length; i++) { avg += scores[i]; if (scores[i] > best) best = scores[i]; }
    avg = scores.length ? avg / scores.length : 0;
    fin(avg, rows2("Best Drop", best, best + "%", "Average", avg, Math.round(avg) + "%"));
  }
  function down(p, now) {
    if (done) return; var q = san(p); if (!q) return;
    if (dist(q.x, q.y, ix, iy) < 60) { grab = true; gx = q.x - ix; gy = q.y - iy; }
  }
  function move(p, now) {
    if (done || !grab) return; var q = san(p); if (!q) return;
    ix = clamp(q.x - gx, 40, W - 40); iy = clamp(q.y - gy, 100, H - 60);
  }
  function up(p, now) {
    if (done || !grab) return; grab = false;
    var d = dist(ix, iy, tx, ty);
    var sc = clamp(Math.round(100 - d * 0.55), 0, 100);
    scores.push(sc); flash = 0.9; flashGood = sc >= 70;
    if (sc >= 70) sndGood(); else sndBad();
    round++;
    if (round >= RND) finishAll(); else newRound();
  }
  function draw(g, dt, now) {
    bg(g);
    var t = el(now);
    if (!done && t > 25) finishAll();
    var cx = W / 2;
    txt(g, msg, cx, 52, 22, isDark() ? "#e8e8e8" : "#334155");
    dots(g, RND, round, cx, 82);
    // target
    if (RING === 1) {
      g.strokeStyle = "#f59e0b"; g.lineWidth = 5; g.setLineDash([10, 8]);
      g.beginPath(); g.arc(tx, ty, 52, 0, 7); g.stroke();
      g.setLineDash([]);
      g.fillStyle = "rgba(245,158,11,0.15)";
      g.beginPath(); g.arc(tx, ty, 52, 0, 7); g.fill();
    } else {
      g.fillStyle = "rgba(245,158,11,0.2)";
      rr(g, tx - 60, ty - 50, 120, 100, 16); g.fill();
      g.strokeStyle = "#f59e0b"; g.lineWidth = 4; g.setLineDash([10, 8]);
      rr(g, tx - 60, ty - 50, 120, 100, 16); g.stroke();
      g.setLineDash([]);
    }
    txt(g, "TARGET", tx, ty + (RING === 1 ? 74 : 72), 13, "#f59e0b");
    // guide arrow
    if (!grab) {
      var a = Math.atan2(ty - iy, tx - ix);
      g.strokeStyle = "rgba(120,120,120,0.5)"; g.lineWidth = 2; g.setLineDash([6, 8]);
      g.beginPath(); g.moveTo(ix, iy); g.lineTo(tx, ty); g.stroke();
      g.setLineDash([]);
    }
    // draggable object
    g.fillStyle = "rgba(0,0,0,0.12)";
    g.beginPath(); g.ellipse(ix, iy + 34, 34, 8, 0, 0, 7); g.fill();
    if (grab) {
      g.strokeStyle = "#38bdf8"; g.lineWidth = 3;
      g.beginPath(); g.arc(ix, iy, 44, 0, 7); g.stroke();
    }
    ic(g, "dog", ix, iy, grab ? 62 : 56, P.c1, P.c2, P.c3);
    if (flash > 0) { flash -= dt || 0.016; txt(g, flashGood ? "Right on target!" : "Off target!", cx, 128, 24, flashGood ? "#16a34a" : "#dc2626"); }
    txt(g, "Drag the item onto the gold target, then let go.", cx, H - 46, 15, isDark() ? "#aab6c6" : "#64748b");
    bar(g, 24, H - 26, W - 48, 8, 1 - t / 25, "#38bdf8");
  }

  return {
    status: function () { return msg + (done ? "  Done!" : ""); },
    down: down, move: move, up: up, draw: draw
  };

  }
});
