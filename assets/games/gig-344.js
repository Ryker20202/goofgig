// GoofGig #344 — The Shoelace
// A tiny everyday gig: Loop, swoop, pull, and try not to trip.
registerGame({
  n: 344,
  title: "The Shoelace",
  desc: "Loop, swoop, pull, and try not to trip.",
  hint: "Drag along the dotted lace path.",
  grades: [
    ["Certified Lace Tier Pro", "Textbook perfect. Frame this run."],
    ["Lace Tier Extraordinaire", "Excellent. The shoe sends its regards."],
    ["The Shoe Apprentice", "Solid effort. The shoe survived, mostly."],
    ["The Wobbly Shoe", "Room to grow, and the shoe will wait."],
    ["Certified Shoe Hazard", "Chaos, but make it funny."]
  ],
  thumb: function (g) {
    g.fillStyle = "#fee2e2"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#fca5a5"; g.fillRect(0, 74, 300, 18);
    g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(36, 22, 12, 0, 7); g.fill();
    g.beginPath(); g.arc(264, 26, 9, 0, 7); g.fill();
    var x = 52, y = 46, s = 34, c1 = "#38bdf8", c2 = "#7f1d1d", c3 = "#ef4444";
    g.fillStyle=c1;g.beginPath();g.moveTo(x-s*0.48,y+s*0.1);g.quadraticCurveTo(x-s*0.5,y-s*0.3,x-s*0.18,y-s*0.3);g.lineTo(x-s*0.1,y-s*0.05);g.quadraticCurveTo(x+s*0.1,y-s*0.12,x+s*0.34,y-s*0.02);g.quadraticCurveTo(x+s*0.52,y+s*0.02,x+s*0.48,y+s*0.18);g.closePath();g.fill();
    g.fillStyle=c2;g.fillRect(x-s*0.5,y+s*0.16,s*1.0,s*0.12);
    g.strokeStyle="#fff";g.lineWidth=3;g.beginPath();g.moveTo(x-s*0.02,y-s*0.08);g.lineTo(x+s*0.12,y-s*0.02);g.stroke();
    x = 248; y = 46; s = 34; c1 = "#7f1d1d"; c2 = "#ef4444"; c3 = "#38bdf8";
    g.fillStyle=c1;g.beginPath();g.moveTo(x-s*0.48,y+s*0.1);g.quadraticCurveTo(x-s*0.5,y-s*0.3,x-s*0.18,y-s*0.3);g.lineTo(x-s*0.1,y-s*0.05);g.quadraticCurveTo(x+s*0.1,y-s*0.12,x+s*0.34,y-s*0.02);g.quadraticCurveTo(x+s*0.52,y+s*0.02,x+s*0.48,y+s*0.18);g.closePath();g.fill();
    g.fillStyle=c2;g.fillRect(x-s*0.5,y+s*0.16,s*1.0,s*0.12);
    g.strokeStyle="#fff";g.lineWidth=3;g.beginPath();g.moveTo(x-s*0.02,y-s*0.08);g.lineTo(x+s*0.12,y-s*0.02);g.stroke();
    x = 150; y = 46; s = 58; c1 = "#ef4444"; c2 = "#38bdf8"; c3 = "#7f1d1d";
    g.fillStyle=c1;g.beginPath();g.moveTo(x-s*0.48,y+s*0.1);g.quadraticCurveTo(x-s*0.5,y-s*0.3,x-s*0.18,y-s*0.3);g.lineTo(x-s*0.1,y-s*0.05);g.quadraticCurveTo(x+s*0.1,y-s*0.12,x+s*0.34,y-s*0.02);g.quadraticCurveTo(x+s*0.52,y+s*0.02,x+s*0.48,y+s*0.18);g.closePath();g.fill();
    g.fillStyle=c2;g.fillRect(x-s*0.5,y+s*0.16,s*1.0,s*0.12);
    g.strokeStyle="#fff";g.lineWidth=3;g.beginPath();g.moveTo(x-s*0.02,y-s*0.08);g.lineTo(x+s*0.12,y-s*0.02);g.stroke();
  },
  create: function (api) {

  var P = {sky:"#fee2e2", gnd:"#fca5a5", c1:"#ef4444", c2:"#38bdf8", c3:"#7f1d1d"};
  function R(a, b) { return a + Math.random() * (b - a); }
  function RI(a, b) { return Math.floor(R(a, b + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ic(g, kind, x, y, s, c1, c2, c3) {
    if (!isFinite(x)) x = 0; if (!isFinite(y)) y = 0;
    if (!isFinite(s) || s <= 0) s = 10;
    c1 = c1 || P.c1; c2 = c2 || P.c2; c3 = c3 || P.c3;
    switch (kind) {
      case "shoe":
        g.fillStyle=c1;g.beginPath();g.moveTo(x-s*0.48,y+s*0.1);g.quadraticCurveTo(x-s*0.5,y-s*0.3,x-s*0.18,y-s*0.3);g.lineTo(x-s*0.1,y-s*0.05);g.quadraticCurveTo(x+s*0.1,y-s*0.12,x+s*0.34,y-s*0.02);g.quadraticCurveTo(x+s*0.52,y+s*0.02,x+s*0.48,y+s*0.18);g.closePath();g.fill();
        g.fillStyle=c2;g.fillRect(x-s*0.5,y+s*0.16,s*1.0,s*0.12);
        g.strokeStyle="#fff";g.lineWidth=3;g.beginPath();g.moveTo(x-s*0.02,y-s*0.08);g.lineTo(x+s*0.12,y-s*0.02);g.stroke();
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
g.fillStyle=dk?"#2b3648":"#dcfce7";
g.beginPath();g.arc(90,90,40,0,7);g.fill();
g.fillStyle="#4caf50";g.fillRect(0,300,W,70);
g.fillStyle="#fff";g.fillRect(60,320,80,8);g.fillRect(300,320,80,8);g.fillRect(540,320,80,8);
g.fillStyle="#f59e0b";g.beginPath();g.arc(W-80,80,22,0,7);g.fill();
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


  var path = [], covered = [], prog = 0, drawing = false, lastX = -1, lastY = -1;
  var flash = 0, ZIG = 1;
  var NP = 40;
  (function build() {
    for (var i = 0; i < NP; i++) {
      var f = i / (NP - 1);
      var x = 110 + f * (W - 220);
      var y;
      if (ZIG === 1) y = 215 + (i % 2 === 0 ? -70 : 70) * (0.5 + 0.5 * Math.sin(f * 3));
      else y = 215 + Math.sin(f * Math.PI * 2.2) * 75;
      path.push({ x: x, y: y });
      covered.push(false);
    }
  })();
  function coverage() {
    var n = 0;
    for (var i = 0; i < covered.length; i++) if (covered[i]) n++;
    return n / covered.length;
  }
  function finishAll() {
    var sc = Math.round(coverage() * 100);
    fin(sc, rows2("Path Covered", sc, sc + "%", "Accuracy", sc, sc + "%"));
  }
  function mark(x, y) {
    for (var i = 0; i < path.length; i++) {
      if (!covered[i] && dist(x, y, path[i].x, path[i].y) < 34) covered[i] = true;
    }
  }
  function down(p, now) {
    if (done) return; var q = san(p); if (!q) return;
    drawing = true; mark(q.x, q.y); lastX = q.x; lastY = q.y;
  }
  function move(p, now) {
    if (done || !drawing) return; var q = san(p); if (!q) return;
    mark(q.x, q.y); lastX = q.x; lastY = q.y;
    if (coverage() > 0.92) finishAll();
  }
  function up(p, now) { drawing = false; }
  function draw(g, dt, now) {
    bg(g);
    var t = el(now);
    if (!done && t > 25) finishAll();
    var cx = W / 2, cov = coverage();
    txt(g, "Trace the dotted path: " + Math.round(cov * 100) + "% covered", cx, 52, 22, isDark() ? "#e8e8e8" : "#334155");
    // path dots
    for (var i = 0; i < path.length; i++) {
      g.fillStyle = covered[i] ? "#4caf50" : "rgba(120,120,120,0.45)";
      g.beginPath(); g.arc(path[i].x, path[i].y, covered[i] ? 8 : 6, 0, 7); g.fill();
    }
    // start / end flags
    g.fillStyle = "#4caf50";
    g.beginPath(); g.arc(path[0].x, path[0].y, 13, 0, 7); g.fill();
    txt(g, "START", path[0].x, path[0].y - 26, 13, "#16a34a");
    g.fillStyle = "#f59e0b";
    g.beginPath(); g.arc(path[NP - 1].x, path[NP - 1].y, 13, 0, 7); g.fill();
    txt(g, "FINISH", path[NP - 1].x, path[NP - 1].y - 26, 13, "#f59e0b");
    // trail marker
    if (drawing && lastX >= 0) {
      g.strokeStyle = "#38bdf8"; g.lineWidth = 3;
      g.beginPath(); g.arc(lastX, lastY, 14, 0, 7); g.stroke();
    }
    ic(g, "shoe", path[0].x, path[0].y - 52, 30, P.c1, P.c2, P.c3);
    ic(g, "shoe", path[NP - 1].x, path[NP - 1].y + 44, 30, P.c2, P.c3, P.c1);
    txt(g, "Drag along the dotted path from START to FINISH.", cx, H - 46, 15, isDark() ? "#aab6c6" : "#64748b");
    bar(g, 24, H - 26, W - 48, 8, 1 - t / 25, "#38bdf8");
    bar(g, cx - 150, 82, 300, 10, cov, "#4caf50");
  }

  return {
    status: function () { return "Path: " + Math.round(coverage() * 100) + "%" + (done ? "  Done!" : ""); },
    down: down, move: move, up: up, draw: draw
  };

  }
});
