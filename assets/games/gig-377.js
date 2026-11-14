// GoofGig #377 — The Steamy Window
// A tiny everyday gig: Wipe the steam, see the road, drive on.
registerGame({
  n: 377,
  title: "The Steamy Window",
  desc: "Wipe the steam, see the road, drive on.",
  hint: "Drag to wipe the steam off the window.",
  grades: [
    ["The Window Whisperer", "Gold stars all round. The window agrees."],
    ["Steam Wiper Plus", "A fine display of window mastery."],
    ["Journeyman Steam Wiper", "Good enough to brag about at lunch."],
    ["Rookie Steam Wiper", "Room to grow, and the window will wait."],
    ["Certified Window Hazard", "Chaos, but make it funny."]
  ],
  thumb: function (g) {
    g.fillStyle = "#ede9fe"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#94a3b8"; g.fillRect(0, 74, 300, 18);
    g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(36, 22, 12, 0, 7); g.fill();
    g.beginPath(); g.arc(264, 26, 9, 0, 7); g.fill();
    var x = 52, y = 46, s = 34, c1 = "#f59e0b", c2 = "#334155", c3 = "#8b5cf6";
    g.fillStyle=c1;g.fillRect(x-s*0.42,y-s*0.42,s*0.84,s*0.84);
    g.fillStyle="#bae6fd";g.fillRect(x-s*0.34,y-s*0.34,s*0.68,s*0.68);
    g.fillStyle=c1;g.fillRect(x-s*0.04,y-s*0.34,s*0.08,s*0.68);g.fillRect(x-s*0.34,y-s*0.04,s*0.68,s*0.08);
    g.fillStyle="#fff";g.beginPath();g.arc(x-s*0.18,y-s*0.2,s*0.08,0,7);g.fill();
    x = 248; y = 46; s = 34; c1 = "#334155"; c2 = "#8b5cf6"; c3 = "#f59e0b";
    g.fillStyle=c1;g.fillRect(x-s*0.42,y-s*0.42,s*0.84,s*0.84);
    g.fillStyle="#bae6fd";g.fillRect(x-s*0.34,y-s*0.34,s*0.68,s*0.68);
    g.fillStyle=c1;g.fillRect(x-s*0.04,y-s*0.34,s*0.08,s*0.68);g.fillRect(x-s*0.34,y-s*0.04,s*0.68,s*0.08);
    g.fillStyle="#fff";g.beginPath();g.arc(x-s*0.18,y-s*0.2,s*0.08,0,7);g.fill();
    x = 150; y = 46; s = 58; c1 = "#8b5cf6"; c2 = "#f59e0b"; c3 = "#334155";
    g.fillStyle=c1;g.fillRect(x-s*0.42,y-s*0.42,s*0.84,s*0.84);
    g.fillStyle="#bae6fd";g.fillRect(x-s*0.34,y-s*0.34,s*0.68,s*0.68);
    g.fillStyle=c1;g.fillRect(x-s*0.04,y-s*0.34,s*0.08,s*0.68);g.fillRect(x-s*0.34,y-s*0.04,s*0.68,s*0.08);
    g.fillStyle="#fff";g.beginPath();g.arc(x-s*0.18,y-s*0.2,s*0.08,0,7);g.fill();
  },
  create: function (api) {

  var P = {sky:"#ede9fe", gnd:"#94a3b8", c1:"#8b5cf6", c2:"#f59e0b", c3:"#334155"};
  function R(a, b) { return a + Math.random() * (b - a); }
  function RI(a, b) { return Math.floor(R(a, b + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ic(g, kind, x, y, s, c1, c2, c3) {
    if (!isFinite(x)) x = 0; if (!isFinite(y)) y = 0;
    if (!isFinite(s) || s <= 0) s = 10;
    c1 = c1 || P.c1; c2 = c2 || P.c2; c3 = c3 || P.c3;
    switch (kind) {
      case "window":
        g.fillStyle=c1;g.fillRect(x-s*0.42,y-s*0.42,s*0.84,s*0.84);
        g.fillStyle="#bae6fd";g.fillRect(x-s*0.34,y-s*0.34,s*0.68,s*0.68);
        g.fillStyle=c1;g.fillRect(x-s*0.04,y-s*0.34,s*0.08,s*0.68);g.fillRect(x-s*0.34,y-s*0.04,s*0.68,s*0.08);
        g.fillStyle="#fff";g.beginPath();g.arc(x-s*0.18,y-s*0.2,s*0.08,0,7);g.fill();
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
g.fillStyle=dk?"#2b3648":"#cbd5e1";
for(var i=0;i<5;i++){var bw=70+((i*37)%50);g.fillRect(20+i*140,150-((i*53)%60),bw,220);}
g.fillStyle=dk?"#3b475c":"#94a3b8";g.fillRect(0,300,W,70);
g.strokeStyle="#fbbf24";g.lineWidth=4;g.setLineDash([24,18]);g.beginPath();g.moveTo(0,335);g.lineTo(W,335);g.stroke();g.setLineDash([]);
g.fillStyle="#fbbf24";g.beginPath();g.arc(W-70,70,26,0,7);g.fill();
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


  var COLS = 14, ROWS = 7, cells = [], wiping = false;
  var GRID = 0;
  for (var i = 0; i < COLS * ROWS; i++) cells.push(true);
  function coverage() {
    var n = 0;
    for (var i = 0; i < cells.length; i++) if (!cells[i]) n++;
    return n / cells.length;
  }
  function finishAll() {
    var sc = Math.round(coverage() * 100);
    fin(sc, rows2("Cleaned", sc, sc + "%", "Coverage", sc, sc + "%"));
  }
  function wipe(x, y) {
    var x0 = 90, y0 = 110, cw = (W - 180) / COLS, ch = 220 / ROWS;
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        var cx = x0 + c * cw + cw / 2, cy = y0 + r * ch + ch / 2;
        if (dist(x, y, cx, cy) < 46) cells[r * COLS + c] = false;
      }
    }
  }
  function down(p, now) {
    if (done) return; var q = san(p); if (!q) return;
    wiping = true; wipe(q.x, q.y);
  }
  function move(p, now) {
    if (done || !wiping) return; var q = san(p); if (!q) return;
    wipe(q.x, q.y);
    if (coverage() > 0.93) finishAll();
  }
  function up(p, now) { wiping = false; }
  function draw(g, dt, now) {
    bg(g);
    var t = el(now);
    if (!done && t > 25) finishAll();
    var cx = W / 2, cov = coverage(), x0 = 90, y0 = 110, cw = (W - 180) / COLS, ch = 220 / ROWS;
    txt(g, "Wipe it clean: " + Math.round(cov * 100) + "%", cx, 52, 22, isDark() ? "#e8e8e8" : "#334155");
    // revealed picture underneath
    g.fillStyle = isDark() ? "#2f3a4d" : "#ffffff";
    rr(g, x0 - 8, y0 - 8, (W - 180) + 16, 236, 18); g.fill();
    ic(g, "window", cx - 130, y0 + 110, 90, P.c1, P.c2, P.c3);
    ic(g, "window", cx + 130, y0 + 110, 90, P.c2, P.c3, P.c1);
    txt(g, "Squeaky clean!", cx, y0 + 110, 24, isDark() ? "#e8e8e8" : "#334155");
    // covering layer
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        if (!cells[r * COLS + c]) continue;
        g.fillStyle = GRID === 1 ? "#94a3b8" : "rgba(148,163,184,0.85)";
        if (GRID === 1) g.fillRect(x0 + c * cw + 1, y0 + r * ch + 1, cw - 2, ch - 2);
        else { g.beginPath(); g.arc(x0 + c * cw + cw / 2, y0 + r * ch + ch / 2, Math.min(cw, ch) * 0.55, 0, 7); g.fill(); }
      }
    }
    g.strokeStyle = "rgba(120,120,120,0.4)"; g.lineWidth = 2;
    rr(g, x0 - 8, y0 - 8, (W - 180) + 16, 236, 18); g.stroke();
    txt(g, "Drag to wipe the layer away and reveal what is underneath.", cx, H - 46, 15, isDark() ? "#aab6c6" : "#64748b");
    bar(g, 24, H - 26, W - 48, 8, 1 - t / 25, "#38bdf8");
    bar(g, cx - 150, 82, 300, 10, cov, "#4caf50");
  }

  return {
    status: function () { return "Cleaned: " + Math.round(coverage() * 100) + "%" + (done ? "  Done!" : ""); },
    down: down, move: move, up: up, draw: draw
  };

  }
});
