// GoofGig #186 — The Woodpecker Waltz
// A tiny everyday gig: Knock, knock, knock, on your favorite tree.
registerGame({
  n: 186,
  title: "The Woodpecker Waltz",
  desc: "Knock, knock, knock, on your favorite tree.",
  hint: "Tap in time as each ring shrinks to the beat.",
  grades: [
    ["Legendary Bird Listener", "Textbook perfect. Frame this run."],
    ["Senior Bird Listener", "You and the bird are clearly old friends."],
    ["The Steady Bird", "Good enough to brag about at lunch."],
    ["The Bird Tourist", "The bird survived. That counts for something."],
    ["Certified Bird Hazard", "The bird has filed a formal complaint."]
  ],
  thumb: function (g) {
    g.fillStyle = "#dcfce7"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#86efac"; g.fillRect(0, 74, 300, 18);
    g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(36, 22, 12, 0, 7); g.fill();
    g.beginPath(); g.arc(264, 26, 9, 0, 7); g.fill();
    var x = 52, y = 46, s = 34, c1 = "#f59e0b", c2 = "#166534", c3 = "#22c55e";
    g.fillStyle=c1;g.beginPath();g.ellipse(x,y,s*0.42,s*0.32,0,0,7);g.fill();
    g.beginPath();g.arc(x+s*0.3,y-s*0.24,s*0.22,0,7);g.fill();
    g.fillStyle=c2;g.beginPath();g.ellipse(x-s*0.1,y-s*0.02,s*0.3,s*0.14,-0.3,0,7);g.fill();
    g.fillStyle="#f59e0b";g.beginPath();g.moveTo(x+s*0.48,y-s*0.26);g.lineTo(x+s*0.66,y-s*0.2);g.lineTo(x+s*0.48,y-s*0.14);g.closePath();g.fill();
    g.fillStyle="#222";g.beginPath();g.arc(x+s*0.34,y-s*0.3,s*0.045,0,7);g.fill();
    x = 248; y = 46; s = 34; c1 = "#166534"; c2 = "#22c55e"; c3 = "#f59e0b";
    g.fillStyle=c1;g.beginPath();g.ellipse(x,y,s*0.42,s*0.32,0,0,7);g.fill();
    g.beginPath();g.arc(x+s*0.3,y-s*0.24,s*0.22,0,7);g.fill();
    g.fillStyle=c2;g.beginPath();g.ellipse(x-s*0.1,y-s*0.02,s*0.3,s*0.14,-0.3,0,7);g.fill();
    g.fillStyle="#f59e0b";g.beginPath();g.moveTo(x+s*0.48,y-s*0.26);g.lineTo(x+s*0.66,y-s*0.2);g.lineTo(x+s*0.48,y-s*0.14);g.closePath();g.fill();
    g.fillStyle="#222";g.beginPath();g.arc(x+s*0.34,y-s*0.3,s*0.045,0,7);g.fill();
    x = 150; y = 46; s = 58; c1 = "#22c55e"; c2 = "#f59e0b"; c3 = "#166534";
    g.fillStyle=c1;g.beginPath();g.ellipse(x,y,s*0.42,s*0.32,0,0,7);g.fill();
    g.beginPath();g.arc(x+s*0.3,y-s*0.24,s*0.22,0,7);g.fill();
    g.fillStyle=c2;g.beginPath();g.ellipse(x-s*0.1,y-s*0.02,s*0.3,s*0.14,-0.3,0,7);g.fill();
    g.fillStyle="#f59e0b";g.beginPath();g.moveTo(x+s*0.48,y-s*0.26);g.lineTo(x+s*0.66,y-s*0.2);g.lineTo(x+s*0.48,y-s*0.14);g.closePath();g.fill();
    g.fillStyle="#222";g.beginPath();g.arc(x+s*0.34,y-s*0.3,s*0.045,0,7);g.fill();
  },
  create: function (api) {

  var P = {sky:"#dcfce7", gnd:"#86efac", c1:"#22c55e", c2:"#f59e0b", c3:"#166534"};
  function R(a, b) { return a + Math.random() * (b - a); }
  function RI(a, b) { return Math.floor(R(a, b + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ic(g, kind, x, y, s, c1, c2, c3) {
    if (!isFinite(x)) x = 0; if (!isFinite(y)) y = 0;
    if (!isFinite(s) || s <= 0) s = 10;
    c1 = c1 || P.c1; c2 = c2 || P.c2; c3 = c3 || P.c3;
    switch (kind) {
      case "bird":
        g.fillStyle=c1;g.beginPath();g.ellipse(x,y,s*0.42,s*0.32,0,0,7);g.fill();
        g.beginPath();g.arc(x+s*0.3,y-s*0.24,s*0.22,0,7);g.fill();
        g.fillStyle=c2;g.beginPath();g.ellipse(x-s*0.1,y-s*0.02,s*0.3,s*0.14,-0.3,0,7);g.fill();
        g.fillStyle="#f59e0b";g.beginPath();g.moveTo(x+s*0.48,y-s*0.26);g.lineTo(x+s*0.66,y-s*0.2);g.lineTo(x+s*0.48,y-s*0.14);g.closePath();g.fill();
        g.fillStyle="#222";g.beginPath();g.arc(x+s*0.34,y-s*0.3,s*0.045,0,7);g.fill();
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
g.fillStyle="#4caf50";
for(var i=0;i<7;i++){var fx=50+i*105;g.fillRect(fx,300,5,40);g.beginPath();g.arc(fx,292,12,0,7);g.fill();}
g.fillStyle="#f472b6";g.beginPath();g.arc(90,120,14,0,7);g.fill();g.beginPath();g.arc(W-120,90,14,0,7);g.fill();
g.fillStyle="#fbbf24";g.beginPath();g.arc(W-80,70,24,0,7);g.fill();
g.fillStyle=dk?"#2b3648":"#86efac";g.beginPath();g.arc(60,60,40,0,7);g.fill();
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


  var BEATS = 8, IV = 1.299;
  var beat = 0, scores = [], flash = 0, flashTxt = "", msg = "Listen for the beat...";
  var startT = 1.2, hit = false, ringT = 0;
  function beatAt(i) { return startT + i * IV; }
  function finishAll() {
    var avg = 0, best = 0;
    for (var i = 0; i < scores.length; i++) { avg += scores[i]; if (scores[i] > best) best = scores[i]; }
    avg = scores.length ? avg / scores.length : 0;
    fin(avg, rows2("Best Beat", best, best + "%", "Average", avg, Math.round(avg) + "%"));
  }
  function down(p, now) {
    if (done) return; var q = san(p); if (!q) return;
    var t = el(now);
    if (beat >= BEATS) return;
    var err = Math.abs(t - beatAt(beat));
    if (err < 0.45 && !hit) {
      var sc = clamp(Math.round(100 - err * 200), 10, 100);
      scores.push(sc); hit = true; flash = 0.7; flashTxt = sc >= 85 ? "Perfect beat!" : "On the beat!";
      sndGood();
    } else if (!hit) {
      scores.push(0); hit = true; flash = 0.7; flashTxt = "Off beat!"; sndBad();
    }
  }
  function move(p, now) {}
  function up(p, now) {}
  function draw(g, dt, now) {
    bg(g);
    var t = el(now);
    if (!done && t > 25) finishAll();
    if (!done && beat < BEATS && t > beatAt(beat) + 0.45) {
      if (!hit) { scores.push(0); flash = 0.7; flashTxt = "Missed the beat!"; }
      beat++; hit = false;
      if (beat >= BEATS) finishAll();
    }
    var cx = W / 2, cy = 215;
    txt(g, msg, cx, 52, 22, isDark() ? "#e8e8e8" : "#334155");
    dots(g, BEATS, beat, cx, 82);
    // beat track
    g.fillStyle = isDark() ? "#2f3a4d" : "#ffffff";
    rr(g, cx - 260, cy - 90, 520, 180, 24); g.fill();
    g.strokeStyle = "rgba(120,120,120,0.4)"; g.lineWidth = 2; rr(g, cx - 260, cy - 90, 520, 180, 24); g.stroke();
    // shrinking ring for current beat
    if (beat < BEATS) {
      var bt = beatAt(beat), prog = clamp((t - (bt - 1.0)) / 1.0, 0, 1);
      var rr2 = 78 - prog * 44;
      g.strokeStyle = hit ? "#4caf50" : "#f59e0b"; g.lineWidth = 5;
      g.beginPath(); g.arc(cx, cy, Math.max(rr2, 6), 0, 7); g.stroke();
      g.strokeStyle = "rgba(120,120,120,0.4)"; g.lineWidth = 2;
      g.beginPath(); g.arc(cx, cy, 34, 0, 7); g.stroke();
    }
    ic(g, "bird", cx, cy, 52, P.c1, P.c2, P.c3);
    // upcoming beat pips
    for (var i = 0; i < BEATS; i++) {
      g.fillStyle = i < beat ? "#4caf50" : (i === beat ? "#f59e0b" : "rgba(120,120,120,0.3)");
      g.beginPath(); g.arc(cx - 220 + i * (440 / Math.max(BEATS - 1, 1)), cy + 70, 8, 0, 7); g.fill();
    }
    if (flash > 0) { flash -= dt || 0.016; txt(g, flashTxt, cx, 128, 24, "#0ea5e9"); }
    txt(g, "Tap when the ring closes on the beat.", cx, H - 46, 15, isDark() ? "#aab6c6" : "#64748b");
    bar(g, 24, H - 26, W - 48, 8, 1 - t / 25, "#38bdf8");
  }

  return {
    status: function () { return "Beat " + (beat + 1) + " of " + BEATS + (done ? "  Done!" : ""); },
    down: down, move: move, up: up, draw: draw
  };

  }
});
