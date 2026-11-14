// GoofGig #354 — The Snow Trail
// A tiny everyday gig: Follow the trail, dodge the trees, find the lodge.
registerGame({
  n: 354,
  title: "The Snow Trail",
  desc: "Follow the trail, dodge the trees, find the lodge.",
  hint: "Drag along the dotted snow trail.",
  grades: [
    ["Grand Trail Follower", "You make this look easy. It is not."],
    ["Trail Follower Plus", "You and the snowflake are clearly old friends."],
    ["The Snowflake Apprentice", "A steady hand and a patient snowflake."],
    ["Rookie Trail Follower", "The snowflake is still in one piece. Call it a win."],
    ["Certified Snowflake Hazard", "The snowflake is still recovering. So are we."]
  ],
  thumb: function (g) {
    g.fillStyle = "#dbeafe"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#94a3b8"; g.fillRect(0, 74, 300, 18);
    g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(36, 22, 12, 0, 7); g.fill();
    g.beginPath(); g.arc(264, 26, 9, 0, 7); g.fill();
    var x = 52, y = 46, s = 34, c1 = "#fbbf24", c2 = "#1e3a8a", c3 = "#38bdf8";
    g.strokeStyle=c1;g.lineWidth=4;g.lineCap="round";
    for(var i=0;i<6;i++){var a=i*Math.PI/3;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*s*0.5,y+Math.sin(a)*s*0.5);g.stroke();
    g.beginPath();g.moveTo(x+Math.cos(a)*s*0.3,y+Math.sin(a)*s*0.3);g.lineTo(x+Math.cos(a+0.5)*s*0.42,y+Math.sin(a+0.5)*s*0.42);g.stroke();}
    g.fillStyle=c2;g.beginPath();g.arc(x,y,s*0.1,0,7);g.fill();
    x = 248; y = 46; s = 34; c1 = "#1e3a8a"; c2 = "#38bdf8"; c3 = "#fbbf24";
    g.strokeStyle=c1;g.lineWidth=4;g.lineCap="round";
    for(var i=0;i<6;i++){var a=i*Math.PI/3;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*s*0.5,y+Math.sin(a)*s*0.5);g.stroke();
    g.beginPath();g.moveTo(x+Math.cos(a)*s*0.3,y+Math.sin(a)*s*0.3);g.lineTo(x+Math.cos(a+0.5)*s*0.42,y+Math.sin(a+0.5)*s*0.42);g.stroke();}
    g.fillStyle=c2;g.beginPath();g.arc(x,y,s*0.1,0,7);g.fill();
    x = 150; y = 46; s = 58; c1 = "#38bdf8"; c2 = "#fbbf24"; c3 = "#1e3a8a";
    g.strokeStyle=c1;g.lineWidth=4;g.lineCap="round";
    for(var i=0;i<6;i++){var a=i*Math.PI/3;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*s*0.5,y+Math.sin(a)*s*0.5);g.stroke();
    g.beginPath();g.moveTo(x+Math.cos(a)*s*0.3,y+Math.sin(a)*s*0.3);g.lineTo(x+Math.cos(a+0.5)*s*0.42,y+Math.sin(a+0.5)*s*0.42);g.stroke();}
    g.fillStyle=c2;g.beginPath();g.arc(x,y,s*0.1,0,7);g.fill();
  },
  create: function (api) {

  var P = {sky:"#dbeafe", gnd:"#94a3b8", c1:"#38bdf8", c2:"#fbbf24", c3:"#1e3a8a"};
  function R(a, b) { return a + Math.random() * (b - a); }
  function RI(a, b) { return Math.floor(R(a, b + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ic(g, kind, x, y, s, c1, c2, c3) {
    if (!isFinite(x)) x = 0; if (!isFinite(y)) y = 0;
    if (!isFinite(s) || s <= 0) s = 10;
    c1 = c1 || P.c1; c2 = c2 || P.c2; c3 = c3 || P.c3;
    switch (kind) {
      case "flake":
        g.strokeStyle=c1;g.lineWidth=4;g.lineCap="round";
        for(var i=0;i<6;i++){var a=i*Math.PI/3;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*s*0.5,y+Math.sin(a)*s*0.5);g.stroke();
        g.beginPath();g.moveTo(x+Math.cos(a)*s*0.3,y+Math.sin(a)*s*0.3);g.lineTo(x+Math.cos(a+0.5)*s*0.42,y+Math.sin(a+0.5)*s*0.42);g.stroke();}
        g.fillStyle=c2;g.beginPath();g.arc(x,y,s*0.1,0,7);g.fill();
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
g.fillStyle="rgba(255,255,255,0.75)";
g.beginPath();g.arc(120,80,26,0,7);g.arc(150,70,30,0,7);g.arc(185,82,24,0,7);g.fill();
g.beginPath();g.arc(W-160,110,22,0,7);g.arc(W-130,100,26,0,7);g.fill();
g.fillStyle="#fbbf24";g.beginPath();g.arc(W-70,70,24,0,7);g.fill();
g.strokeStyle="rgba(56,189,248,0.5)";g.lineWidth=3;
for(var i=0;i<4;i++){g.beginPath();g.moveTo(300+i*40,60);g.lineTo(292+i*40,90);g.stroke();}
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
    ic(g, "flake", path[0].x, path[0].y - 52, 30, P.c1, P.c2, P.c3);
    ic(g, "flake", path[NP - 1].x, path[NP - 1].y + 44, 30, P.c2, P.c3, P.c1);
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
