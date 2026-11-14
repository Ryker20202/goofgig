// GoofGig #233 — The Coffee Drip
// A tiny everyday gig: The office coffee drips like it is paid by the hour.
registerGame({
  n: 233,
  title: "The Coffee Drip",
  desc: "The office coffee drips like it is paid by the hour.",
  hint: "Hold to fill the mug, release in the green zone.",
  grades: [
    ["Master of the Coffee", "You make this look easy. It is not."],
    ["Caffeine Seeker Plus", "You and the coffee are clearly old friends."],
    ["Capable Caffeine Seeker", "Not bad at all. The coffee nods slowly."],
    ["Learning Caffeine Seeker", "Room to grow, and the coffee will wait."],
    ["The Coffee Newcomer", "The coffee has filed a formal complaint."]
  ],
  thumb: function (g) {
    g.fillStyle = "#e0e7ff"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#94a3b8"; g.fillRect(0, 74, 300, 18);
    g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(36, 22, 12, 0, 7); g.fill();
    g.beginPath(); g.arc(264, 26, 9, 0, 7); g.fill();
    var x = 52, y = 46, s = 34, c1 = "#f59e0b", c2 = "#475569", c3 = "#6366f1";
    g.fillStyle=c1;g.fillRect(x-s*0.32,y-s*0.3,s*0.56,s*0.62);
    g.strokeStyle=c1;g.lineWidth=6;g.beginPath();g.arc(x+s*0.32,y,s*0.18,-Math.PI/2,Math.PI/2);g.stroke();
    g.fillStyle=c2;g.fillRect(x-s*0.32,y-s*0.3,s*0.56,s*0.12);
    g.strokeStyle="rgba(148,163,184,0.8)";g.lineWidth=3;g.beginPath();g.moveTo(x-s*0.12,y-s*0.4);g.quadraticCurveTo(x-s*0.2,y-s*0.55,x-s*0.1,y-s*0.62);g.stroke();
    x = 248; y = 46; s = 34; c1 = "#475569"; c2 = "#6366f1"; c3 = "#f59e0b";
    g.fillStyle=c1;g.fillRect(x-s*0.32,y-s*0.3,s*0.56,s*0.62);
    g.strokeStyle=c1;g.lineWidth=6;g.beginPath();g.arc(x+s*0.32,y,s*0.18,-Math.PI/2,Math.PI/2);g.stroke();
    g.fillStyle=c2;g.fillRect(x-s*0.32,y-s*0.3,s*0.56,s*0.12);
    g.strokeStyle="rgba(148,163,184,0.8)";g.lineWidth=3;g.beginPath();g.moveTo(x-s*0.12,y-s*0.4);g.quadraticCurveTo(x-s*0.2,y-s*0.55,x-s*0.1,y-s*0.62);g.stroke();
    x = 150; y = 46; s = 58; c1 = "#6366f1"; c2 = "#f59e0b"; c3 = "#475569";
    g.fillStyle=c1;g.fillRect(x-s*0.32,y-s*0.3,s*0.56,s*0.62);
    g.strokeStyle=c1;g.lineWidth=6;g.beginPath();g.arc(x+s*0.32,y,s*0.18,-Math.PI/2,Math.PI/2);g.stroke();
    g.fillStyle=c2;g.fillRect(x-s*0.32,y-s*0.3,s*0.56,s*0.12);
    g.strokeStyle="rgba(148,163,184,0.8)";g.lineWidth=3;g.beginPath();g.moveTo(x-s*0.12,y-s*0.4);g.quadraticCurveTo(x-s*0.2,y-s*0.55,x-s*0.1,y-s*0.62);g.stroke();
  },
  create: function (api) {

  var P = {sky:"#e0e7ff", gnd:"#94a3b8", c1:"#6366f1", c2:"#f59e0b", c3:"#475569"};
  function R(a, b) { return a + Math.random() * (b - a); }
  function RI(a, b) { return Math.floor(R(a, b + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ic(g, kind, x, y, s, c1, c2, c3) {
    if (!isFinite(x)) x = 0; if (!isFinite(y)) y = 0;
    if (!isFinite(s) || s <= 0) s = 10;
    c1 = c1 || P.c1; c2 = c2 || P.c2; c3 = c3 || P.c3;
    switch (kind) {
      case "mug":
        g.fillStyle=c1;g.fillRect(x-s*0.32,y-s*0.3,s*0.56,s*0.62);
        g.strokeStyle=c1;g.lineWidth=6;g.beginPath();g.arc(x+s*0.32,y,s*0.18,-Math.PI/2,Math.PI/2);g.stroke();
        g.fillStyle=c2;g.fillRect(x-s*0.32,y-s*0.3,s*0.56,s*0.12);
        g.strokeStyle="rgba(148,163,184,0.8)";g.lineWidth=3;g.beginPath();g.moveTo(x-s*0.12,y-s*0.4);g.quadraticCurveTo(x-s*0.2,y-s*0.55,x-s*0.1,y-s*0.62);g.stroke();
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
g.fillStyle=dk?"#2b3648":"#e2e8f0";
for(var i=0;i<4;i++){g.fillRect(40+i*170,60,120,150);g.fillStyle=dk?"#3b475c":"#bae6fd";g.fillRect(52+i*170,72,96,126);g.fillStyle=dk?"#2b3648":"#e2e8f0";}
g.fillStyle=dk?"#3b475c":"#94a3b8";g.fillRect(0,300,W,70);
g.fillStyle="#4caf50";g.beginPath();g.arc(70,330,16,0,7);g.fill();g.fillRect(66,344,8,20);
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


  var RND = 4, RATE = 0.29;
  var round = 0, target = 0, level = 0, holding = false, scores = [], flash = 0, flashGood = false, msg = "";
  var HORIZ = 0;
  function newRound() {
    target = R(0.45, 0.8); level = 0;
    msg = "Round " + (round + 1) + " of " + RND + "  —  fill to the green zone";
  }
  newRound();
  function finishAll() {
    var avg = 0, best = 0;
    for (var i = 0; i < scores.length; i++) { avg += scores[i]; if (scores[i] > best) best = scores[i]; }
    avg = scores.length ? avg / scores.length : 0;
    fin(avg, rows2("Best Fill", best, best + "%", "Average", avg, Math.round(avg) + "%"));
  }
  function scoreRound() {
    var err = Math.abs(level - target);
    var sc = clamp(Math.round(100 - err * 260), 0, 100);
    scores.push(sc); flash = 0.9; flashGood = sc >= 70;
    if (sc >= 70) sndGood(); else sndBad();
    round++;
    if (round >= RND) finishAll(); else newRound();
  }
  function down(p, now) { if (!done && san(p)) holding = true; }
  function move(p, now) {}
  function up(p, now) {
    if (done || !holding) return; holding = false; scoreRound();
  }
  function draw(g, dt, now) {
    bg(g);
    var t = el(now);
    if (!done && t > 25) finishAll();
    var d = clamp(dt || 0.016, 0, 0.05);
    if (!done && holding) {
      level += d * RATE;
      if (level >= 1) { level = 1; scores.push(0); flash = 0.9; flashGood = false; sndBad(); holding = false; round++; if (round >= RND) finishAll(); else newRound(); }
    }
    var cx = W / 2, cy = 215;
    txt(g, msg, cx, 52, 22, isDark() ? "#e8e8e8" : "#334155");
    dots(g, RND, round, cx, 82);
    if (HORIZ === 0) {
      // vertical tank
      var x0 = cx - 70, y0 = 120, w = 140, h = 210;
      g.fillStyle = isDark() ? "#2f3a4d" : "#ffffff";
      rr(g, x0 - 8, y0 - 8, w + 16, h + 16, 18); g.fill();
      g.fillStyle = "#4caf50";
      g.fillRect(x0, y0 + h * (1 - target - 0.09), w, h * 0.18);
      g.fillStyle = P.c1;
      var fh = h * clamp(level, 0, 1);
      if (fh > 1) { rr(g, x0, y0 + h - fh, w, fh, 8); g.fill(); }
      g.strokeStyle = "rgba(120,120,120,0.5)"; g.lineWidth = 2; rr(g, x0, y0, w, h, 12); g.stroke();
      // level ticks
      g.fillStyle = isDark() ? "#9aa7b8" : "#64748b";
      for (var i = 1; i < 5; i++) g.fillRect(x0 + w + 14, y0 + h * i / 5, 12, 2);
      ic(g, "mug", cx - 170, cy, 44, P.c2, P.c3, P.c1);
      ic(g, "mug", cx + 170, cy, 44, P.c1, P.c2, P.c3);
    } else {
      var hx0 = 130, hy = cy - 30, hw = W - 260, hh = 60;
      g.fillStyle = isDark() ? "#2f3a4d" : "#ffffff";
      rr(g, hx0 - 8, hy - 8, hw + 16, hh + 16, 18); g.fill();
      g.fillStyle = "#4caf50";
      g.fillRect(hx0 + hw * (target - 0.09), hy, hw * 0.18, hh);
      g.fillStyle = P.c1;
      var fw = hw * clamp(level, 0, 1);
      if (fw > 1) { rr(g, hx0, hy, fw, hh, 8); g.fill(); }
      g.strokeStyle = "rgba(120,120,120,0.5)"; g.lineWidth = 2; rr(g, hx0, hy, hw, hh, 12); g.stroke();
      ic(g, "mug", cx, cy - 110, 44, P.c2, P.c3, P.c1);
    }
    txt(g, holding ? "Filling... release in the green!" : "Press and hold to fill.", cx, 128, 20, holding ? "#f59e0b" : (isDark() ? "#aab6c6" : "#64748b"));
    if (flash > 0) { flash -= dt || 0.016; txt(g, flashGood ? "Perfect fill!" : "Off the zone!", cx, 152, 22, flashGood ? "#16a34a" : "#dc2626"); }
    txt(g, "Hold to fill, release inside the green zone. Do not overflow!", cx, H - 46, 15, isDark() ? "#aab6c6" : "#64748b");
    bar(g, 24, H - 26, W - 48, 8, 1 - t / 25, "#38bdf8");
  }

  return {
    status: function () { return msg + (done ? "  Done!" : ""); },
    down: down, move: move, up: up, draw: draw
  };

  }
});
