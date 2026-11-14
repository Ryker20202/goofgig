// GoofGig #453 — The Wandering Robot
// A tiny everyday gig: It vacuums, it bumps, it needs its dock.
registerGame({
  n: 453,
  title: "The Wandering Robot",
  desc: "It vacuums, it bumps, it needs its dock.",
  hint: "Move to guide the robot back to its dock.",
  grades: [
    ["The Robot Virtuoso", "Peak robot energy. Nothing more to say."],
    ["The Robot Specialist", "Almost flawless. The robot is jealous."],
    ["Robot Guide in Training", "Middle of the pack, top of the morning."],
    ["Learning Robot Guide", "Halfway there. The robot believes in you."],
    ["Chaos Robot Guide", "Chaos, but make it funny."]
  ],
  thumb: function (g) {
    g.fillStyle = "#e2e8f0"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#94a3b8"; g.fillRect(0, 74, 300, 18);
    g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(36, 22, 12, 0, 7); g.fill();
    g.beginPath(); g.arc(264, 26, 9, 0, 7); g.fill();
    var x = 52, y = 46, s = 34, c1 = "#f59e0b", c2 = "#475569", c3 = "#38bdf8";
    g.fillStyle=c1;g.fillRect(x-s*0.32,y-s*0.42,s*0.64,s*0.5);
    g.fillStyle=c2;g.fillRect(x-s*0.4,y+s*0.08,s*0.8,s*0.34);
    g.fillStyle="#22c55e";g.beginPath();g.arc(x-s*0.14,y-s*0.2,s*0.06,0,7);g.fill();g.beginPath();g.arc(x+s*0.14,y-s*0.2,s*0.06,0,7);g.fill();
    g.strokeStyle="#222";g.lineWidth=3;g.beginPath();g.moveTo(x-s*0.14,y-s*0.02);g.lineTo(x+s*0.14,y-s*0.02);g.stroke();
    g.strokeStyle=c1;g.lineWidth=4;g.beginPath();g.moveTo(x,y-s*0.42);g.lineTo(x,y-s*0.55);g.stroke();
    g.fillStyle="#ef4444";g.beginPath();g.arc(x,y-s*0.55,s*0.05,0,7);g.fill();
    x = 248; y = 46; s = 34; c1 = "#475569"; c2 = "#38bdf8"; c3 = "#f59e0b";
    g.fillStyle=c1;g.fillRect(x-s*0.32,y-s*0.42,s*0.64,s*0.5);
    g.fillStyle=c2;g.fillRect(x-s*0.4,y+s*0.08,s*0.8,s*0.34);
    g.fillStyle="#22c55e";g.beginPath();g.arc(x-s*0.14,y-s*0.2,s*0.06,0,7);g.fill();g.beginPath();g.arc(x+s*0.14,y-s*0.2,s*0.06,0,7);g.fill();
    g.strokeStyle="#222";g.lineWidth=3;g.beginPath();g.moveTo(x-s*0.14,y-s*0.02);g.lineTo(x+s*0.14,y-s*0.02);g.stroke();
    g.strokeStyle=c1;g.lineWidth=4;g.beginPath();g.moveTo(x,y-s*0.42);g.lineTo(x,y-s*0.55);g.stroke();
    g.fillStyle="#ef4444";g.beginPath();g.arc(x,y-s*0.55,s*0.05,0,7);g.fill();
    x = 150; y = 46; s = 58; c1 = "#38bdf8"; c2 = "#f59e0b"; c3 = "#475569";
    g.fillStyle=c1;g.fillRect(x-s*0.32,y-s*0.42,s*0.64,s*0.5);
    g.fillStyle=c2;g.fillRect(x-s*0.4,y+s*0.08,s*0.8,s*0.34);
    g.fillStyle="#22c55e";g.beginPath();g.arc(x-s*0.14,y-s*0.2,s*0.06,0,7);g.fill();g.beginPath();g.arc(x+s*0.14,y-s*0.2,s*0.06,0,7);g.fill();
    g.strokeStyle="#222";g.lineWidth=3;g.beginPath();g.moveTo(x-s*0.14,y-s*0.02);g.lineTo(x+s*0.14,y-s*0.02);g.stroke();
    g.strokeStyle=c1;g.lineWidth=4;g.beginPath();g.moveTo(x,y-s*0.42);g.lineTo(x,y-s*0.55);g.stroke();
    g.fillStyle="#ef4444";g.beginPath();g.arc(x,y-s*0.55,s*0.05,0,7);g.fill();
  },
  create: function (api) {

  var P = {sky:"#e2e8f0", gnd:"#94a3b8", c1:"#38bdf8", c2:"#f59e0b", c3:"#475569"};
  function R(a, b) { return a + Math.random() * (b - a); }
  function RI(a, b) { return Math.floor(R(a, b + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ic(g, kind, x, y, s, c1, c2, c3) {
    if (!isFinite(x)) x = 0; if (!isFinite(y)) y = 0;
    if (!isFinite(s) || s <= 0) s = 10;
    c1 = c1 || P.c1; c2 = c2 || P.c2; c3 = c3 || P.c3;
    switch (kind) {
      case "robot":
        g.fillStyle=c1;g.fillRect(x-s*0.32,y-s*0.42,s*0.64,s*0.5);
        g.fillStyle=c2;g.fillRect(x-s*0.4,y+s*0.08,s*0.8,s*0.34);
        g.fillStyle="#22c55e";g.beginPath();g.arc(x-s*0.14,y-s*0.2,s*0.06,0,7);g.fill();g.beginPath();g.arc(x+s*0.14,y-s*0.2,s*0.06,0,7);g.fill();
        g.strokeStyle="#222";g.lineWidth=3;g.beginPath();g.moveTo(x-s*0.14,y-s*0.02);g.lineTo(x+s*0.14,y-s*0.02);g.stroke();
        g.strokeStyle=c1;g.lineWidth=4;g.beginPath();g.moveTo(x,y-s*0.42);g.lineTo(x,y-s*0.55);g.stroke();
        g.fillStyle="#ef4444";g.beginPath();g.arc(x,y-s*0.55,s*0.05,0,7);g.fill();
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


  var DUR = 22, wx = 140, wy = 220, gx = 590, gy = 220, delivered = 0, NEED = 2;
  var px = W / 2, py = 220, CHECK = 1;
  var cps = [{ x: 360, y: 150 }, { x: 360, y: 300 }], cpIdx = 0, bump = 0;
  function finishAll() {
    var sc = Math.round(delivered / NEED * 100);
    fin(sc, rows2("Delivered", sc, delivered + " / " + NEED, "Bumps", clamp(100 - bump * 10, 0, 100), bump + " bumps"));
  }
  function setPos(p) { var q = san(p); if (q && !done) { px = clamp(q.x, 40, W - 40); py = clamp(q.y, 110, H - 60); } }
  function down(p, now) { setPos(p); }
  function move(p, now) { setPos(p); }
  function up(p, now) {}
  function draw(g, dt, now) {
    bg(g);
    var t = el(now);
    if (!done && t > DUR) finishAll();
    var d = clamp(dt || 0.016, 0, 0.05);
    if (!done) {
      // wanderer follows pointer with lag, plus wobble
      var tx = px, ty = py;
      if (CHECK === 1 && cpIdx < cps.length) { tx = cps[cpIdx].x; ty = cps[cpIdx].y; }
      else if (CHECK === 1) { tx = gx; ty = gy; }
      else { tx = gx; ty = gy; }
      // pointer pulls the wanderer toward itself, wanderer drifts toward goal slowly
      var pullX = (px - wx) * 0.9, pullY = (py - wy) * 0.9;
      var goalX = (tx - wx) * 0.12, goalY = (ty - wy) * 0.12;
      wx += (pullX * 0.55 + goalX + Math.sin(t * 2.1) * 8) * d;
      wy += (pullY * 0.55 + goalY + Math.cos(t * 1.7) * 8) * d;
      wx = clamp(wx, 40, W - 40); wy = clamp(wy, 110, H - 60);
      // walls: two obstacle blocks
      var obs = [{ x: 300, y: 150, w: 26, h: 110 }, { x: 430, y: 230, w: 26, h: 110 }];
      for (var i = 0; i < obs.length; i++) {
        var o = obs[i];
        if (wx > o.x - 22 && wx < o.x + o.w + 22 && wy > o.y - 22 && wy < o.y + o.h + 22) {
          wx -= (pullX * 0.55 + goalX) * d * 2; wy -= (pullY * 0.55 + goalY) * d * 2;
          bump += d * 4;
        }
      }
      if (CHECK === 1 && cpIdx < cps.length && dist(wx, wy, cps[cpIdx].x, cps[cpIdx].y) < 42) { cpIdx++; blip(760, 0.09, "sine", 0.15); }
      if (dist(wx, wy, gx, gy) < 46) {
        delivered++; sndGood();
        wx = 140; wy = 220; cpIdx = 0;
        if (delivered >= NEED) finishAll();
      }
    }
    txt(g, "Delivered " + delivered + " / " + NEED, W / 2, 52, 22, isDark() ? "#e8e8e8" : "#334155");
    dots(g, NEED, delivered, W / 2, 82);
    // obstacles
    g.fillStyle = isDark() ? "#3b475c" : "#94a3b8";
    rr(g, 300, 150, 26, 110, 8); g.fill();
    rr(g, 430, 230, 26, 110, 8); g.fill();
    // checkpoints
    if (CHECK === 1) {
      for (var c = 0; c < cps.length; c++) {
        g.strokeStyle = c < cpIdx ? "#4caf50" : "#f59e0b"; g.lineWidth = 3; g.setLineDash([8, 6]);
        g.beginPath(); g.arc(cps[c].x, cps[c].y, 30, 0, 7); g.stroke();
        g.setLineDash([]);
      }
    }
    // goal
    g.fillStyle = "rgba(76,175,80,0.2)";
    g.beginPath(); g.arc(gx, gy, 46, 0, 7); g.fill();
    g.strokeStyle = "#4caf50"; g.lineWidth = 4; g.setLineDash([10, 8]);
    g.beginPath(); g.arc(gx, gy, 46, 0, 7); g.stroke();
    g.setLineDash([]);
    txt(g, "HOME", gx, gy + 64, 13, "#16a34a");
    // pointer guide ring
    g.strokeStyle = "rgba(56,189,248,0.6)"; g.lineWidth = 2;
    g.beginPath(); g.arc(px, py, 26, 0, 7); g.stroke();
    // wanderer
    ic(g, "robot", wx, wy, 52, P.c1, P.c2, P.c3);
    txt(g, "Guide the wanderer home with your pointer. Mind the walls.", W / 2, H - 46, 15, isDark() ? "#aab6c6" : "#64748b");
    bar(g, 24, H - 26, W - 48, 8, 1 - t / DUR, "#38bdf8");
  }

  return {
    status: function () { return "Delivered " + delivered + " / " + NEED + (done ? "  Done!" : ""); },
    down: down, move: move, up: up, draw: draw
  };

  }
});
