// GoofGig #283 — The Party Popper
// A tiny everyday gig: Pull it, pop it, clean up the confetti.
registerGame({
  n: 283,
  title: "The Party Popper",
  desc: "Pull it, pop it, clean up the confetti.",
  hint: "Hold to charge, release inside the green zone.",
  grades: [
    ["Party Popper Supreme", "Not a single wobble. Suspiciously good."],
    ["Party Popper Plus", "Strong run. One tiny wobble, forgiven."],
    ["Everyday Party Popper", "A steady hand and a patient popper."],
    ["The Popper Dabbler", "A shaky run. The popper forgives you. Mostly."],
    ["Certified Popper Hazard", "The popper has filed a formal complaint."]
  ],
  thumb: function (g) {
    g.fillStyle = "#ede9fe"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#ddd6fe"; g.fillRect(0, 74, 300, 18);
    g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(36, 22, 12, 0, 7); g.fill();
    g.beginPath(); g.arc(264, 26, 9, 0, 7); g.fill();
    var x = 52, y = 46, s = 34, c1 = "#f59e0b", c2 = "#4c1d95", c3 = "#8b5cf6";
    var cf=["#ef4444","#38bdf8","#a3e635","#f59e0b","#c084fc"];
    for(var i=0;i<8;i++){g.fillStyle=cf[i%5];g.save();g.translate(x+((i%4)-1.5)*s*0.28,y+(Math.floor(i/4)-0.5)*s*0.5);g.rotate(i*0.7);g.fillRect(-s*0.06,-s*0.1,s*0.12,s*0.2);g.restore();}
    g.fillStyle=c1;g.beginPath();g.arc(x,y,s*0.06,0,7);g.fill();
    x = 248; y = 46; s = 34; c1 = "#4c1d95"; c2 = "#8b5cf6"; c3 = "#f59e0b";
    var cf=["#ef4444","#38bdf8","#a3e635","#f59e0b","#c084fc"];
    for(var i=0;i<8;i++){g.fillStyle=cf[i%5];g.save();g.translate(x+((i%4)-1.5)*s*0.28,y+(Math.floor(i/4)-0.5)*s*0.5);g.rotate(i*0.7);g.fillRect(-s*0.06,-s*0.1,s*0.12,s*0.2);g.restore();}
    g.fillStyle=c1;g.beginPath();g.arc(x,y,s*0.06,0,7);g.fill();
    x = 150; y = 46; s = 58; c1 = "#8b5cf6"; c2 = "#f59e0b"; c3 = "#4c1d95";
    var cf=["#ef4444","#38bdf8","#a3e635","#f59e0b","#c084fc"];
    for(var i=0;i<8;i++){g.fillStyle=cf[i%5];g.save();g.translate(x+((i%4)-1.5)*s*0.28,y+(Math.floor(i/4)-0.5)*s*0.5);g.rotate(i*0.7);g.fillRect(-s*0.06,-s*0.1,s*0.12,s*0.2);g.restore();}
    g.fillStyle=c1;g.beginPath();g.arc(x,y,s*0.06,0,7);g.fill();
  },
  create: function (api) {

  var P = {sky:"#ede9fe", gnd:"#ddd6fe", c1:"#8b5cf6", c2:"#f59e0b", c3:"#4c1d95"};
  function R(a, b) { return a + Math.random() * (b - a); }
  function RI(a, b) { return Math.floor(R(a, b + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ic(g, kind, x, y, s, c1, c2, c3) {
    if (!isFinite(x)) x = 0; if (!isFinite(y)) y = 0;
    if (!isFinite(s) || s <= 0) s = 10;
    c1 = c1 || P.c1; c2 = c2 || P.c2; c3 = c3 || P.c3;
    switch (kind) {
      case "confetti":
        var cf=["#ef4444","#38bdf8","#a3e635","#f59e0b","#c084fc"];
        for(var i=0;i<8;i++){g.fillStyle=cf[i%5];g.save();g.translate(x+((i%4)-1.5)*s*0.28,y+(Math.floor(i/4)-0.5)*s*0.5);g.rotate(i*0.7);g.fillRect(-s*0.06,-s*0.1,s*0.12,s*0.2);g.restore();}
        g.fillStyle=c1;g.beginPath();g.arc(x,y,s*0.06,0,7);g.fill();
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
var fc=["#ef4444","#f59e0b","#22c55e","#38bdf8","#c084fc"];
for(var i=0;i<10;i++){g.fillStyle=fc[i%5];g.beginPath();g.moveTo(30+i*72,60);g.lineTo(66+i*72,60);g.lineTo(48+i*72,92);g.closePath();g.fill();}
g.strokeStyle=dk?"#3b475c":"#94a3b8";g.lineWidth=3;g.beginPath();g.moveTo(0,58);g.lineTo(W,58);g.stroke();
g.fillStyle="#fbbf24";g.beginPath();g.arc(360,150,10,0,7);g.fill();
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


  var RND = 3, SPD = 0.532;
  var round = 0, target = 0, power = 0, holding = false, scores = [], flash = 0, flashGood = false, msg = "";
  var RADIAL = 0;
  function newRound() {
    target = R(0.45, 0.8); power = 0;
    msg = "Round " + (round + 1) + " of " + RND + "  —  charge to the green zone";
  }
  newRound();
  function finishAll() {
    var avg = 0, best = 0;
    for (var i = 0; i < scores.length; i++) { avg += scores[i]; if (scores[i] > best) best = scores[i]; }
    avg = scores.length ? avg / scores.length : 0;
    fin(avg, rows2("Best Charge", best, best + "%", "Average", avg, Math.round(avg) + "%"));
  }
  function scoreRound() {
    var err = Math.abs(power - target);
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
    // triangle oscillation while holding
    if (!done && holding) { power = Math.abs(((t * SPD) % 2) - 1); }
    var cx = W / 2, cy = 215;
    txt(g, msg, cx, 52, 22, isDark() ? "#e8e8e8" : "#334155");
    dots(g, RND, round, cx, 82);
    if (RADIAL === 0) {
      var x0 = cx - 70, y0 = 120, w = 140, h = 210;
      g.fillStyle = isDark() ? "#2f3a4d" : "#ffffff";
      rr(g, x0 - 8, y0 - 8, w + 16, h + 16, 18); g.fill();
      g.fillStyle = "#4caf50";
      g.fillRect(x0, y0 + h * (1 - target - 0.09), w, h * 0.18);
      g.fillStyle = "#f59e0b";
      var fh = h * clamp(power, 0, 1);
      if (fh > 1) { rr(g, x0, y0 + h - fh, w, fh, 8); g.fill(); }
      g.strokeStyle = "rgba(120,120,120,0.5)"; g.lineWidth = 2; rr(g, x0, y0, w, h, 12); g.stroke();
      // sparks when high
      if (power > 0.85) {
        g.fillStyle = "#fbbf24";
        for (var i = 0; i < 5; i++) {
          g.beginPath(); g.arc(cx + R(-60, 60), y0 + R(0, 40), 3, 0, 7); g.fill();
        }
      }
      ic(g, "confetti", cx - 170, cy, 44, P.c2, P.c3, P.c1);
      ic(g, "confetti", cx + 170, cy, 44, P.c1, P.c2, P.c3);
    } else {
      g.strokeStyle = isDark() ? "#3b475c" : "#cbd5e1"; g.lineWidth = 18;
      g.beginPath(); g.arc(cx, cy, 95, 0, 7); g.stroke();
      g.strokeStyle = "#4caf50"; g.lineWidth = 18;
      g.beginPath(); g.arc(cx, cy, 95, -Math.PI / 2 + (target - 0.09) * Math.PI * 2, -Math.PI / 2 + (target + 0.09) * Math.PI * 2); g.stroke();
      g.strokeStyle = "#f59e0b"; g.lineWidth = 18;
      g.beginPath(); g.arc(cx, cy, 95, -Math.PI / 2, -Math.PI / 2 + power * Math.PI * 2); g.stroke();
      ic(g, "confetti", cx, cy, 64, P.c1, P.c2, P.c3);
    }
    txt(g, holding ? "Charging... release in the green!" : "Press and hold to charge.", cx, 128, 20, holding ? "#f59e0b" : (isDark() ? "#aab6c6" : "#64748b"));
    if (flash > 0) { flash -= dt || 0.016; txt(g, flashGood ? "Perfect charge!" : "Wrong power!", cx, 152, 22, flashGood ? "#16a34a" : "#dc2626"); }
    txt(g, "Hold to charge, release inside the green zone.", cx, H - 46, 15, isDark() ? "#aab6c6" : "#64748b");
    bar(g, 24, H - 26, W - 48, 8, 1 - t / 25, "#38bdf8");
  }

  return {
    status: function () { return msg + (done ? "  Done!" : ""); },
    down: down, move: move, up: up, draw: draw
  };

  }
});
