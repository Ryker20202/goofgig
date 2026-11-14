// GoofGig #116 — Lucky Laundry Dial
// A tiny everyday gig: Delicate, normal, or the setting that eats socks.
registerGame({
  n: 116,
  title: "Lucky Laundry Dial",
  desc: "Delicate, normal, or the setting that eats socks.",
  hint: "Tap to stop the dial on the marked setting.",
  grades: [
    ["Master of the Washing machine", "Flawless. The washing machine never stood a chance."],
    ["The Washing machine Specialist", "Sharp work. The washing machine barely kept up."],
    ["Sock Survivor in Training", "Fine work. The washing machine barely complained."],
    ["The Wobbly Washing machine", "The washing machine survived. That counts for something."],
    ["The Washing machine Wildcard", "The washing machine requests a different player."]
  ],
  thumb: function (g) {
    g.fillStyle = "#fdf4ff"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#d6d3d1"; g.fillRect(0, 74, 300, 18);
    g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(36, 22, 12, 0, 7); g.fill();
    g.beginPath(); g.arc(264, 26, 9, 0, 7); g.fill();
    var x = 52, y = 46, s = 34, c1 = "#38bdf8", c2 = "#701a75", c3 = "#c084fc";
    g.fillStyle=c1;g.fillRect(x-s*0.4,y-s*0.44,s*0.8,s*0.88);
    g.fillStyle="#222";g.beginPath();g.arc(x,y+s*0.05,s*0.28,0,7);g.fill();
    g.fillStyle="#bae6fd";g.beginPath();g.arc(x,y+s*0.05,s*0.2,0,7);g.fill();
    g.fillStyle=c2;g.fillRect(x-s*0.4,y-s*0.44,s*0.8,s*0.14);
    g.fillStyle="#fff";g.beginPath();g.arc(x+s*0.26,y-s*0.37,s*0.05,0,7);g.fill();
    x = 248; y = 46; s = 34; c1 = "#701a75"; c2 = "#c084fc"; c3 = "#38bdf8";
    g.fillStyle=c1;g.fillRect(x-s*0.4,y-s*0.44,s*0.8,s*0.88);
    g.fillStyle="#222";g.beginPath();g.arc(x,y+s*0.05,s*0.28,0,7);g.fill();
    g.fillStyle="#bae6fd";g.beginPath();g.arc(x,y+s*0.05,s*0.2,0,7);g.fill();
    g.fillStyle=c2;g.fillRect(x-s*0.4,y-s*0.44,s*0.8,s*0.14);
    g.fillStyle="#fff";g.beginPath();g.arc(x+s*0.26,y-s*0.37,s*0.05,0,7);g.fill();
    x = 150; y = 46; s = 58; c1 = "#c084fc"; c2 = "#38bdf8"; c3 = "#701a75";
    g.fillStyle=c1;g.fillRect(x-s*0.4,y-s*0.44,s*0.8,s*0.88);
    g.fillStyle="#222";g.beginPath();g.arc(x,y+s*0.05,s*0.28,0,7);g.fill();
    g.fillStyle="#bae6fd";g.beginPath();g.arc(x,y+s*0.05,s*0.2,0,7);g.fill();
    g.fillStyle=c2;g.fillRect(x-s*0.4,y-s*0.44,s*0.8,s*0.14);
    g.fillStyle="#fff";g.beginPath();g.arc(x+s*0.26,y-s*0.37,s*0.05,0,7);g.fill();
  },
  create: function (api) {

  var P = {sky:"#fdf4ff", gnd:"#d6d3d1", c1:"#c084fc", c2:"#38bdf8", c3:"#701a75"};
  function R(a, b) { return a + Math.random() * (b - a); }
  function RI(a, b) { return Math.floor(R(a, b + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ic(g, kind, x, y, s, c1, c2, c3) {
    if (!isFinite(x)) x = 0; if (!isFinite(y)) y = 0;
    if (!isFinite(s) || s <= 0) s = 10;
    c1 = c1 || P.c1; c2 = c2 || P.c2; c3 = c3 || P.c3;
    switch (kind) {
      case "washer":
        g.fillStyle=c1;g.fillRect(x-s*0.4,y-s*0.44,s*0.8,s*0.88);
        g.fillStyle="#222";g.beginPath();g.arc(x,y+s*0.05,s*0.28,0,7);g.fill();
        g.fillStyle="#bae6fd";g.beginPath();g.arc(x,y+s*0.05,s*0.2,0,7);g.fill();
        g.fillStyle=c2;g.fillRect(x-s*0.4,y-s*0.44,s*0.8,s*0.14);
        g.fillStyle="#fff";g.beginPath();g.arc(x+s*0.26,y-s*0.37,s*0.05,0,7);g.fill();
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
for(var i=0;i<6;i++){g.beginPath();g.arc(60+i*120,80+((i*29)%50),18,0,7);g.fillStyle="rgba(255,255,255,0.5)";g.fill();g.fillStyle=dk?"#2b3648":"#e0f2fe";}
g.fillStyle=dk?"#3b475c":"#cbd5e1";g.fillRect(0,300,W,70);
g.strokeStyle="rgba(255,255,255,0.6)";g.lineWidth=3;g.beginPath();g.moveTo(0,320);g.lineTo(W,320);g.stroke();
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


  var RND = 3, SPD = 3.013;
  var round = 0, target = 0, scores = [], flash = 0, flashGood = false, msg = "";
  var spin = 0, lastNow = -1;
  function newRound() {
    target = R(0, Math.PI * 2);
    msg = "Round " + (round + 1) + " of " + RND;
  }
  newRound();
  function finishAll() {
    var avg = 0, best = 0;
    for (var i = 0; i < scores.length; i++) { avg += scores[i]; if (scores[i] > best) best = scores[i]; }
    avg = scores.length ? avg / scores.length : 0;
    fin(avg, rows2("Best Stop", best, best + "%", "Average", avg, Math.round(avg) + "%"));
  }
  function angDiff(a, b) {
    var d = Math.abs(a - b) % (Math.PI * 2);
    return d > Math.PI ? Math.PI * 2 - d : d;
  }
  function down(p, now) {
    if (done) return; var q = san(p); if (!q) return;
    var err = angDiff(spin, target);
    var sc = clamp(Math.round(100 - err * 55), 0, 100);
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
    if (lastNow < 0) lastNow = now;
    var d = clamp(now - lastNow, 0, 0.1); lastNow = now;
    if (!done) spin = (spin + d * SPD) % (Math.PI * 2);
    var cx = W / 2, cy = 225, rad = 130;
    txt(g, msg, cx, 52, 22, isDark() ? "#e8e8e8" : "#334155");
    dots(g, RND, round, cx, 82);
    // wheel
    var cols = ["#fbbf24", "#38bdf8", "#f472b6", "#a3e635", "#c084fc", "#fb923c"];
    for (var i = 0; i < 6; i++) {
      g.fillStyle = cols[i];
      g.beginPath(); g.moveTo(cx, cy);
      g.arc(cx, cy, rad, i * Math.PI / 3, (i + 1) * Math.PI / 3); g.closePath(); g.fill();
    }
    // gold target wedge
    g.fillStyle = "#f59e0b";
    g.beginPath(); g.moveTo(cx, cy);
    g.arc(cx, cy, rad, target - 0.28, target + 0.28); g.closePath(); g.fill();
    g.strokeStyle = "#92400e"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, rad, target - 0.28, target + 0.28); g.closePath(); g.stroke();
    g.fillStyle = isDark() ? "#2f3a4d" : "#ffffff";
    g.beginPath(); g.arc(cx, cy, 34, 0, 7); g.fill();
    // pointer
    g.strokeStyle = "#111827"; g.lineWidth = 6; g.lineCap = "round";
    g.beginPath(); g.moveTo(cx, cy);
    g.lineTo(cx + Math.cos(spin) * (rad - 8), cy + Math.sin(spin) * (rad - 8)); g.stroke();
    g.fillStyle = "#111827"; g.beginPath(); g.arc(cx, cy, 10, 0, 7); g.fill();
    ic(g, "washer", cx - rad - 55, cy, 38, P.c1, P.c2, P.c3);
    ic(g, "washer", cx + rad + 55, cy, 38, P.c2, P.c3, P.c1);
    if (flash > 0) { flash -= dt || 0.016; txt(g, flashGood ? "Bullseye!" : "Off the mark!", cx, 128, 24, flashGood ? "#16a34a" : "#dc2626"); }
    txt(g, "Tap to stop the pointer on the gold slice.", cx, H - 46, 15, isDark() ? "#aab6c6" : "#64748b");
    bar(g, 24, H - 26, W - 48, 8, 1 - t / 25, "#38bdf8");
  }

  return {
    status: function () { return msg + (done ? "  Done!" : ""); },
    down: down, move: move, up: up, draw: draw
  };

  }
});
