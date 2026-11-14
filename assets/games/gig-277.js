// GoofGig #277 — The Shaky Steps
// A tiny everyday gig: The escalator shakes, your knees agree.
registerGame({
  n: 277,
  title: "The Shaky Steps",
  desc: "The escalator shakes, your knees agree.",
  hint: "Hold and keep the needle inside the green zone.",
  grades: [
    ["Certified Step Climber Pro", "The steps salutes you. So do we."],
    ["The Steps Ace", "You and the steps are clearly old friends."],
    ["Casual Step Climber", "Good enough to brag about at lunch."],
    ["The Wobbly Steps", "A valiant effort. The steps is unimpressed."],
    ["The Steps Wildcard", "That was... a performance. Of some kind."]
  ],
  thumb: function (g) {
    g.fillStyle = "#e0f2fe"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#a8a29e"; g.fillRect(0, 74, 300, 18);
    g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(36, 22, 12, 0, 7); g.fill();
    g.beginPath(); g.arc(264, 26, 9, 0, 7); g.fill();
    var x = 52, y = 46, s = 34, c1 = "#ef4444", c2 = "#475569", c3 = "#0ea5e9";
    g.strokeStyle=c1;g.lineWidth=6;g.lineCap="round";
    g.beginPath();g.moveTo(x-s*0.28,y-s*0.5);g.lineTo(x-s*0.28,y+s*0.5);g.stroke();
    g.beginPath();g.moveTo(x+s*0.28,y-s*0.5);g.lineTo(x+s*0.28,y+s*0.5);g.stroke();
    g.lineWidth=5;
    for(var i=0;i<4;i++){g.beginPath();g.moveTo(x-s*0.28,y-s*0.3+i*s*0.22);g.lineTo(x+s*0.28,y-s*0.3+i*s*0.22);g.stroke();}
    x = 248; y = 46; s = 34; c1 = "#475569"; c2 = "#0ea5e9"; c3 = "#ef4444";
    g.strokeStyle=c1;g.lineWidth=6;g.lineCap="round";
    g.beginPath();g.moveTo(x-s*0.28,y-s*0.5);g.lineTo(x-s*0.28,y+s*0.5);g.stroke();
    g.beginPath();g.moveTo(x+s*0.28,y-s*0.5);g.lineTo(x+s*0.28,y+s*0.5);g.stroke();
    g.lineWidth=5;
    for(var i=0;i<4;i++){g.beginPath();g.moveTo(x-s*0.28,y-s*0.3+i*s*0.22);g.lineTo(x+s*0.28,y-s*0.3+i*s*0.22);g.stroke();}
    x = 150; y = 46; s = 58; c1 = "#0ea5e9"; c2 = "#ef4444"; c3 = "#475569";
    g.strokeStyle=c1;g.lineWidth=6;g.lineCap="round";
    g.beginPath();g.moveTo(x-s*0.28,y-s*0.5);g.lineTo(x-s*0.28,y+s*0.5);g.stroke();
    g.beginPath();g.moveTo(x+s*0.28,y-s*0.5);g.lineTo(x+s*0.28,y+s*0.5);g.stroke();
    g.lineWidth=5;
    for(var i=0;i<4;i++){g.beginPath();g.moveTo(x-s*0.28,y-s*0.3+i*s*0.22);g.lineTo(x+s*0.28,y-s*0.3+i*s*0.22);g.stroke();}
  },
  create: function (api) {

  var P = {sky:"#e0f2fe", gnd:"#a8a29e", c1:"#0ea5e9", c2:"#ef4444", c3:"#475569"};
  function R(a, b) { return a + Math.random() * (b - a); }
  function RI(a, b) { return Math.floor(R(a, b + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ic(g, kind, x, y, s, c1, c2, c3) {
    if (!isFinite(x)) x = 0; if (!isFinite(y)) y = 0;
    if (!isFinite(s) || s <= 0) s = 10;
    c1 = c1 || P.c1; c2 = c2 || P.c2; c3 = c3 || P.c3;
    switch (kind) {
      case "ladder":
        g.strokeStyle=c1;g.lineWidth=6;g.lineCap="round";
        g.beginPath();g.moveTo(x-s*0.28,y-s*0.5);g.lineTo(x-s*0.28,y+s*0.5);g.stroke();
        g.beginPath();g.moveTo(x+s*0.28,y-s*0.5);g.lineTo(x+s*0.28,y+s*0.5);g.stroke();
        g.lineWidth=5;
        for(var i=0;i<4;i++){g.beginPath();g.moveTo(x-s*0.28,y-s*0.3+i*s*0.22);g.lineTo(x+s*0.28,y-s*0.3+i*s*0.22);g.stroke();}
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


  var RND = 3, HOLD_T = 2.6;
  var round = 0, scores = [], flash = 0, flashGood = false, msg = "";
  var holding = false, needle = 0, inZone = 0, holdT = 0, seed = 0, DIAL = 0;
  function newRound() {
    needle = R(-0.4, 0.4); inZone = 0; holdT = 0; seed = Math.random() * 10;
    msg = "Round " + (round + 1) + " of " + RND + "  —  hold steady in the green";
  }
  newRound();
  function finishAll() {
    var avg = 0, best = 0;
    for (var i = 0; i < scores.length; i++) { avg += scores[i]; if (scores[i] > best) best = scores[i]; }
    avg = scores.length ? avg / scores.length : 0;
    fin(avg, rows2("Steadiest", best, best + "%", "Average", avg, Math.round(avg) + "%"));
  }
  function scoreRound() {
    var sc = holdT > 0.1 ? clamp(Math.round(inZone / holdT * 100), 0, 100) : 0;
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
      holdT += d;
      needle += Math.sin(t * 3.1 + seed) * 0.35 * d + Math.sin(t * 7.7 + seed * 2) * 0.22 * d;
      needle = clamp(needle, -1, 1);
      if (Math.abs(needle) < 0.28) inZone += d;
      if (holdT >= HOLD_T) { holding = false; scoreRound(); }
    } else if (!done) {
      needle += Math.sin(t * 1.3 + seed) * 0.1 * d;
      needle = clamp(needle, -1, 1);
    }
    var cx = W / 2, cy = 215;
    txt(g, msg, cx, 52, 22, isDark() ? "#e8e8e8" : "#334155");
    dots(g, RND, round, cx, 82);
    if (DIAL === 0) {
      // horizontal steady bar
      var x0 = 140, x1 = W - 140;
      g.fillStyle = isDark() ? "#2f3a4d" : "#ffffff";
      rr(g, x0 - 16, cy - 40, (x1 - x0) + 32, 80, 18); g.fill();
      g.fillStyle = "#4caf50";
      g.fillRect(cx - (x1 - x0) * 0.14, cy - 40, (x1 - x0) * 0.28, 80);
      var nx = cx + needle * (x1 - x0) / 2;
      g.fillStyle = "#e11d48";
      g.beginPath(); g.moveTo(nx, cy - 34); g.lineTo(nx - 12, cy - 58); g.lineTo(nx + 12, cy - 58); g.closePath(); g.fill();
      g.fillStyle = "#e11d48"; g.fillRect(nx - 3, cy - 34, 6, 68);
      txt(g, holding ? "Hold it steady..." : "Press and hold to start.", cx, cy + 72, 18, holding ? "#f59e0b" : (isDark() ? "#aab6c6" : "#64748b"));
    } else {
      // dial
      g.fillStyle = isDark() ? "#2f3a4d" : "#ffffff";
      g.beginPath(); g.arc(cx, cy, 110, 0, 7); g.fill();
      g.fillStyle = "#4caf50";
      g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, 110, -Math.PI / 2 - 0.3, -Math.PI / 2 + 0.3); g.closePath(); g.fill();
      var na = -Math.PI / 2 + needle * 1.2;
      g.strokeStyle = "#e11d48"; g.lineWidth = 5; g.lineCap = "round";
      g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(na) * 88, cy + Math.sin(na) * 88); g.stroke();
      g.fillStyle = "#e11d48"; g.beginPath(); g.arc(cx, cy, 10, 0, 7); g.fill();
      txt(g, holding ? "Hold it steady..." : "Press and hold to start.", cx, cy + 140, 18, holding ? "#f59e0b" : (isDark() ? "#aab6c6" : "#64748b"));
    }
    bar(g, cx - 120, 128, 240, 10, holdT / HOLD_T, "#38bdf8");
    ic(g, "ladder", cx - 260, cy, 40, P.c1, P.c2, P.c3);
    ic(g, "ladder", cx + 260, cy, 40, P.c2, P.c3, P.c1);
    if (flash > 0) { flash -= dt || 0.016; txt(g, flashGood ? "Rock steady!" : "Too wobbly!", cx, 104, 22, flashGood ? "#16a34a" : "#dc2626"); }
    txt(g, "Hold and keep the needle in the green zone.", cx, H - 46, 15, isDark() ? "#aab6c6" : "#64748b");
    bar(g, 24, H - 26, W - 48, 8, 1 - t / 25, "#38bdf8");
  }

  return {
    status: function () { return msg + (done ? "  Done!" : ""); },
    down: down, move: move, up: up, draw: draw
  };

  }
});
