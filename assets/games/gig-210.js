// GoofGig #210 — The Expanding Wave
// A tiny everyday gig: The wave grows, the surfers wait, the sand watches.
registerGame({
  n: 210,
  title: "The Expanding Wave",
  desc: "The wave grows, the surfers wait, the sand watches.",
  hint: "Tap when the wave matches the gold ring.",
  grades: [
    ["Legendary Wave Watcher", "The wave salutes you. So do we."],
    ["Solid Wave Watcher", "The wave did not see that coming."],
    ["Capable Wave Watcher", "Middle of the pack, top of the morning."],
    ["Amateur Wave Watcher", "Room to grow, and the wave will wait."],
    ["The Wave Newcomer", "Legendary effort, in the worst way."]
  ],
  thumb: function (g) {
    g.fillStyle = "#dbeafe"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#93c5fd"; g.fillRect(0, 74, 300, 18);
    g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(36, 22, 12, 0, 7); g.fill();
    g.beginPath(); g.arc(264, 26, 9, 0, 7); g.fill();
    var x = 52, y = 46, s = 34, c1 = "#f59e0b", c2 = "#1e3a8a", c3 = "#3b82f6";
    g.strokeStyle=c1;g.lineWidth=6;g.lineCap="round";
    g.beginPath();g.moveTo(x-s*0.5,y-s*0.15);
    g.quadraticCurveTo(x-s*0.25,y+s*0.25,x,y-s*0.15);g.quadraticCurveTo(x+s*0.25,y+s*0.25,x+s*0.5,y-s*0.15);g.stroke();
    g.beginPath();g.moveTo(x-s*0.5,y+s*0.25);
    g.quadraticCurveTo(x-s*0.25,y+s*0.55,x,y+s*0.25);g.quadraticCurveTo(x+s*0.25,y+s*0.55,x+s*0.5,y+s*0.25);g.stroke();
    g.fillStyle=c2;g.beginPath();g.arc(x+s*0.3,y-s*0.3,s*0.08,0,7);g.fill();
    x = 248; y = 46; s = 34; c1 = "#1e3a8a"; c2 = "#3b82f6"; c3 = "#f59e0b";
    g.strokeStyle=c1;g.lineWidth=6;g.lineCap="round";
    g.beginPath();g.moveTo(x-s*0.5,y-s*0.15);
    g.quadraticCurveTo(x-s*0.25,y+s*0.25,x,y-s*0.15);g.quadraticCurveTo(x+s*0.25,y+s*0.25,x+s*0.5,y-s*0.15);g.stroke();
    g.beginPath();g.moveTo(x-s*0.5,y+s*0.25);
    g.quadraticCurveTo(x-s*0.25,y+s*0.55,x,y+s*0.25);g.quadraticCurveTo(x+s*0.25,y+s*0.55,x+s*0.5,y+s*0.25);g.stroke();
    g.fillStyle=c2;g.beginPath();g.arc(x+s*0.3,y-s*0.3,s*0.08,0,7);g.fill();
    x = 150; y = 46; s = 58; c1 = "#3b82f6"; c2 = "#f59e0b"; c3 = "#1e3a8a";
    g.strokeStyle=c1;g.lineWidth=6;g.lineCap="round";
    g.beginPath();g.moveTo(x-s*0.5,y-s*0.15);
    g.quadraticCurveTo(x-s*0.25,y+s*0.25,x,y-s*0.15);g.quadraticCurveTo(x+s*0.25,y+s*0.25,x+s*0.5,y-s*0.15);g.stroke();
    g.beginPath();g.moveTo(x-s*0.5,y+s*0.25);
    g.quadraticCurveTo(x-s*0.25,y+s*0.55,x,y+s*0.25);g.quadraticCurveTo(x+s*0.25,y+s*0.55,x+s*0.5,y+s*0.25);g.stroke();
    g.fillStyle=c2;g.beginPath();g.arc(x+s*0.3,y-s*0.3,s*0.08,0,7);g.fill();
  },
  create: function (api) {

  var P = {sky:"#dbeafe", gnd:"#93c5fd", c1:"#3b82f6", c2:"#f59e0b", c3:"#1e3a8a"};
  function R(a, b) { return a + Math.random() * (b - a); }
  function RI(a, b) { return Math.floor(R(a, b + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ic(g, kind, x, y, s, c1, c2, c3) {
    if (!isFinite(x)) x = 0; if (!isFinite(y)) y = 0;
    if (!isFinite(s) || s <= 0) s = 10;
    c1 = c1 || P.c1; c2 = c2 || P.c2; c3 = c3 || P.c3;
    switch (kind) {
      case "wave":
        g.strokeStyle=c1;g.lineWidth=6;g.lineCap="round";
        g.beginPath();g.moveTo(x-s*0.5,y-s*0.15);
        g.quadraticCurveTo(x-s*0.25,y+s*0.25,x,y-s*0.15);g.quadraticCurveTo(x+s*0.25,y+s*0.25,x+s*0.5,y-s*0.15);g.stroke();
        g.beginPath();g.moveTo(x-s*0.5,y+s*0.25);
        g.quadraticCurveTo(x-s*0.25,y+s*0.55,x,y+s*0.25);g.quadraticCurveTo(x+s*0.25,y+s*0.55,x+s*0.5,y+s*0.25);g.stroke();
        g.fillStyle=c2;g.beginPath();g.arc(x+s*0.3,y-s*0.3,s*0.08,0,7);g.fill();
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


  var RND = 3, SPD = 62.086;
  var round = 0, target = 0, scores = [], flash = 0, flashGood = false, msg = "";
  var r0 = 0, SQUARE = 1;
  function newRound(now) {
    target = R(52, 96); r0 = el(now);
    msg = "Round " + (round + 1) + " of " + RND;
  }
  newRound(0);
  function radAt(now) { return 12 + (el(now) - r0) * SPD; }
  function finishAll() {
    var avg = 0, best = 0;
    for (var i = 0; i < scores.length; i++) { avg += scores[i]; if (scores[i] > best) best = scores[i]; }
    avg = scores.length ? avg / scores.length : 0;
    fin(avg, rows2("Best Match", best, best + "%", "Average", avg, Math.round(avg) + "%"));
  }
  function down(p, now) {
    if (done) return; var q = san(p); if (!q) return;
    var err = Math.abs(radAt(now) - target);
    var sc = clamp(Math.round(100 - err * 2.2), 0, 100);
    scores.push(sc); flash = 0.9; flashGood = sc >= 70;
    if (sc >= 70) sndGood(); else sndBad();
    round++;
    if (round >= RND) finishAll(); else newRound(now);
  }
  function move(p, now) {}
  function up(p, now) {}
  function draw(g, dt, now) {
    bg(g);
    var t = el(now);
    if (!done && t > 25) finishAll();
    if (!done && radAt(now) > 130) { scores.push(0); flash = 0.9; flashGood = false; sndBad(); round++; if (round >= RND) finishAll(); else newRound(now); }
    var cx = W / 2, cy = 225, rad = clamp(radAt(now), 0, 130);
    txt(g, msg, cx, 52, 22, isDark() ? "#e8e8e8" : "#334155");
    dots(g, RND, round, cx, 82);
    // gold target ring
    g.strokeStyle = "#f59e0b"; g.lineWidth = 4; g.setLineDash([10, 8]);
    if (SQUARE === 1) { g.strokeRect(cx - target, cy - target, target * 2, target * 2); }
    else { g.beginPath(); g.arc(cx, cy, target, 0, 7); g.stroke(); }
    g.setLineDash([]);
    // growing shape
    g.fillStyle = P.c1; g.globalAlpha = 0.85;
    if (SQUARE === 1) { rr(g, cx - rad, cy - rad, rad * 2, rad * 2, 14); g.fill(); }
    else { g.beginPath(); g.arc(cx, cy, rad, 0, 7); g.fill(); }
    g.globalAlpha = 1;
    g.strokeStyle = "rgba(0,0,0,0.15)"; g.lineWidth = 2;
    if (SQUARE === 1) { rr(g, cx - rad, cy - rad, rad * 2, rad * 2, 14); g.stroke(); }
    else { g.beginPath(); g.arc(cx, cy, rad, 0, 7); g.stroke(); }
    ic(g, "wave", cx, cy, clamp(rad * 0.9, 8, 60), P.c2, P.c3, P.c1);
    if (flash > 0) { flash -= dt || 0.016; txt(g, flashGood ? "Perfect fit!" : "Wrong size!", cx, 128, 24, flashGood ? "#16a34a" : "#dc2626"); }
    txt(g, "Tap when the growing shape matches the gold ring.", cx, H - 46, 15, isDark() ? "#aab6c6" : "#64748b");
    bar(g, 24, H - 26, W - 48, 8, 1 - t / 25, "#38bdf8");
  }

  return {
    status: function () { return msg + (done ? "  Done!" : ""); },
    down: down, move: move, up: up, draw: draw
  };

  }
});
