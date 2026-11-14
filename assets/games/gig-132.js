// GoofGig #132 — Sliding Scale
// A tiny everyday gig: The bathroom scale slides its verdict across the floor.
registerGame({
  n: 132,
  title: "Sliding Scale",
  desc: "The bathroom scale slides its verdict across the floor.",
  hint: "Tap to stop the marker on the gold line.",
  grades: [
    ["Master of the Scale", "Flawless. The scale never stood a chance."],
    ["Seasoned Scale Negotiator", "That was smooth. Suspiciously smooth."],
    ["The Scale Regular", "Good enough to brag about at lunch."],
    ["Amateur Scale Negotiator", "Room to grow, and the scale will wait."],
    ["The Scale Wildcard", "Legendary effort, in the worst way."]
  ],
  thumb: function (g) {
    g.fillStyle = "#e0f2fe"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#cbd5e1"; g.fillRect(0, 74, 300, 18);
    g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(36, 22, 12, 0, 7); g.fill();
    g.beginPath(); g.arc(264, 26, 9, 0, 7); g.fill();
    var x = 52, y = 46, s = 34, c1 = "#22c55e", c2 = "#0c4a6e", c3 = "#38bdf8";
    g.fillStyle=c1;g.beginPath();g.ellipse(x,y+s*0.3,s*0.46,s*0.16,0,0,7);g.fill();
    g.fillRect(x-s*0.46,y+s*0.12,s*0.92,s*0.18);
    g.fillStyle="#fff";g.fillRect(x-s*0.2,y-s*0.3,s*0.4,s*0.3);
    g.fillStyle=c2;g.beginPath();g.arc(x,y-s*0.15,s*0.1,0,7);g.fill();
    g.strokeStyle="#222";g.lineWidth=3;g.beginPath();g.moveTo(x,y-s*0.15);g.lineTo(x+s*0.06,y-s*0.22);g.stroke();
    x = 248; y = 46; s = 34; c1 = "#0c4a6e"; c2 = "#38bdf8"; c3 = "#22c55e";
    g.fillStyle=c1;g.beginPath();g.ellipse(x,y+s*0.3,s*0.46,s*0.16,0,0,7);g.fill();
    g.fillRect(x-s*0.46,y+s*0.12,s*0.92,s*0.18);
    g.fillStyle="#fff";g.fillRect(x-s*0.2,y-s*0.3,s*0.4,s*0.3);
    g.fillStyle=c2;g.beginPath();g.arc(x,y-s*0.15,s*0.1,0,7);g.fill();
    g.strokeStyle="#222";g.lineWidth=3;g.beginPath();g.moveTo(x,y-s*0.15);g.lineTo(x+s*0.06,y-s*0.22);g.stroke();
    x = 150; y = 46; s = 58; c1 = "#38bdf8"; c2 = "#22c55e"; c3 = "#0c4a6e";
    g.fillStyle=c1;g.beginPath();g.ellipse(x,y+s*0.3,s*0.46,s*0.16,0,0,7);g.fill();
    g.fillRect(x-s*0.46,y+s*0.12,s*0.92,s*0.18);
    g.fillStyle="#fff";g.fillRect(x-s*0.2,y-s*0.3,s*0.4,s*0.3);
    g.fillStyle=c2;g.beginPath();g.arc(x,y-s*0.15,s*0.1,0,7);g.fill();
    g.strokeStyle="#222";g.lineWidth=3;g.beginPath();g.moveTo(x,y-s*0.15);g.lineTo(x+s*0.06,y-s*0.22);g.stroke();
  },
  create: function (api) {

  var P = {sky:"#e0f2fe", gnd:"#cbd5e1", c1:"#38bdf8", c2:"#22c55e", c3:"#0c4a6e"};
  function R(a, b) { return a + Math.random() * (b - a); }
  function RI(a, b) { return Math.floor(R(a, b + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ic(g, kind, x, y, s, c1, c2, c3) {
    if (!isFinite(x)) x = 0; if (!isFinite(y)) y = 0;
    if (!isFinite(s) || s <= 0) s = 10;
    c1 = c1 || P.c1; c2 = c2 || P.c2; c3 = c3 || P.c3;
    switch (kind) {
      case "scale":
        g.fillStyle=c1;g.beginPath();g.ellipse(x,y+s*0.3,s*0.46,s*0.16,0,0,7);g.fill();
        g.fillRect(x-s*0.46,y+s*0.12,s*0.92,s*0.18);
        g.fillStyle="#fff";g.fillRect(x-s*0.2,y-s*0.3,s*0.4,s*0.3);
        g.fillStyle=c2;g.beginPath();g.arc(x,y-s*0.15,s*0.1,0,7);g.fill();
        g.strokeStyle="#222";g.lineWidth=3;g.beginPath();g.moveTo(x,y-s*0.15);g.lineTo(x+s*0.06,y-s*0.22);g.stroke();
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
g.fillStyle=dk?"#2b3648":"#e0f2fe";
for(var i=0;i<8;i++){for(var j=0;j<2;j++){g.strokeStyle="rgba(148,163,184,0.4)";g.lineWidth=2;g.strokeRect(20+i*88,50+j*70,80,62);}}
g.fillStyle="rgba(255,255,255,0.6)";g.beginPath();g.arc(620,90,26,0,7);g.fill();
g.fillStyle=dk?"#3b475c":"#cbd5e1";g.fillRect(0,300,W,70);
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


  var RND = 3, SPD = 0.773;
  var round = 0, scores = [], flash = 0, flashGood = false, msg = "";
  var VERT = 0;
  function newRound() { msg = "Round " + (round + 1) + " of " + RND; }
  newRound();
  function posAt(now) { return Math.abs(((el(now) * SPD) % 2) - 1); }
  function finishAll() {
    var avg = 0, best = 0;
    for (var i = 0; i < scores.length; i++) { avg += scores[i]; if (scores[i] > best) best = scores[i]; }
    avg = scores.length ? avg / scores.length : 0;
    fin(avg, rows2("Best Stop", best, best + "%", "Average", avg, Math.round(avg) + "%"));
  }
  function down(p, now) {
    if (done) return; var q = san(p); if (!q) return;
    var pos = posAt(now), err = Math.abs(pos - 0.5) * 2;
    var sc = clamp(Math.round(100 - err * 110), 0, 100);
    scores.push(sc); flash = 0.9; flashGood = sc >= 70;
    if (sc >= 70) sndGood(); else sndBad();
    round++;
    if (round >= RND) finishAll(); else newRound();
  }
  function move(p, now) {}
  function up(p, now) {}
  function draw(g, dt, now) {
    bg(g);
    var t = el(now);
    if (!done && t > 25) finishAll();
    var cx = W / 2, cy = 215;
    txt(g, msg, cx, 52, 22, isDark() ? "#e8e8e8" : "#334155");
    dots(g, RND, round, cx, 82);
    var pos = posAt(now);
    if (VERT === 0) {
      var x0 = 130, x1 = W - 130;
      g.fillStyle = isDark() ? "#2f3a4d" : "#ffffff";
      rr(g, x0 - 20, cy - 46, (x1 - x0) + 40, 92, 20); g.fill();
      g.fillStyle = "#4caf50"; g.fillRect(cx - 6, cy - 46, 12, 92);
      g.strokeStyle = "#16a34a"; g.lineWidth = 2; g.strokeRect(cx - 6, cy - 46, 12, 92);
      var bx = x0 + pos * (x1 - x0);
      g.fillStyle = "#f59e0b"; rr(g, bx - 26, cy - 34, 52, 68, 12); g.fill();
      g.strokeStyle = "#92400e"; g.lineWidth = 2; rr(g, bx - 26, cy - 34, 52, 68, 12); g.stroke();
      ic(g, "scale", bx, cy, 30, P.c1, P.c2, P.c3);
    } else {
      var y0 = 120, y1 = 330;
      g.fillStyle = isDark() ? "#2f3a4d" : "#ffffff";
      rr(g, cx - 46, y0 - 20, 92, (y1 - y0) + 40, 20); g.fill();
      g.fillStyle = "#4caf50"; g.fillRect(cx - 46, cy - 6, 92, 12);
      g.strokeStyle = "#16a34a"; g.lineWidth = 2; g.strokeRect(cx - 46, cy - 6, 92, 12);
      var by = y0 + pos * (y1 - y0);
      g.fillStyle = "#f59e0b"; rr(g, cx - 34, by - 26, 68, 52, 12); g.fill();
      g.strokeStyle = "#92400e"; g.lineWidth = 2; rr(g, cx - 34, by - 26, 68, 52, 12); g.stroke();
      ic(g, "scale", cx, by, 30, P.c1, P.c2, P.c3);
    }
    if (flash > 0) { flash -= dt || 0.016; txt(g, flashGood ? "Dead center!" : "Off the line!", cx, 128, 24, flashGood ? "#16a34a" : "#dc2626"); }
    txt(g, "Tap to stop the slider dead center on the gold line.", cx, H - 46, 15, isDark() ? "#aab6c6" : "#64748b");
    bar(g, 24, H - 26, W - 48, 8, 1 - t / 25, "#38bdf8");
  }

  return {
    status: function () { return msg + (done ? "  Done!" : ""); },
    down: down, move: move, up: up, draw: draw
  };

  }
});
