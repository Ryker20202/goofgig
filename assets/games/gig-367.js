// GoofGig #367 — The Price Slider
// A tiny everyday gig: Too high and nobody buys; too low and you cry.
registerGame({
  n: 367,
  title: "The Price Slider",
  desc: "Too high and nobody buys; too low and you cry.",
  hint: "Drag the slider to the gold target price.",
  grades: [
    ["The Price Whisperer", "Textbook perfect. Frame this run."],
    ["Solid Price Setter", "Almost flawless. The price is jealous."],
    ["The Price Apprentice", "You handled the price like a pro. Almost."],
    ["The Price Dabbler", "A valiant effort. The price is unimpressed."],
    ["Certified Price Hazard", "Bold strategy. The price disagrees."]
  ],
  thumb: function (g) {
    g.fillStyle = "#ffedd5"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#d6d3d1"; g.fillRect(0, 74, 300, 18);
    g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(36, 22, 12, 0, 7); g.fill();
    g.beginPath(); g.arc(264, 26, 9, 0, 7); g.fill();
    var x = 52, y = 46, s = 34, c1 = "#22c55e", c2 = "#7c2d12", c3 = "#f97316";
    g.fillStyle=c1;g.beginPath();g.moveTo(x-s*0.3,y-s*0.35);g.lineTo(x+s*0.3,y-s*0.35);g.lineTo(x+s*0.45,y);g.lineTo(x+s*0.3,y+s*0.35);g.lineTo(x-s*0.3,y+s*0.35);g.closePath();g.fill();
    g.fillStyle="#fff";g.beginPath();g.arc(x-s*0.18,y,s*0.07,0,7);g.fill();
    g.fillStyle=c2;g.fillRect(x+s*0.02,y-s*0.08,s*0.24,s*0.05);g.fillRect(x+s*0.02,y+s*0.06,s*0.18,s*0.05);
    x = 248; y = 46; s = 34; c1 = "#7c2d12"; c2 = "#f97316"; c3 = "#22c55e";
    g.fillStyle=c1;g.beginPath();g.moveTo(x-s*0.3,y-s*0.35);g.lineTo(x+s*0.3,y-s*0.35);g.lineTo(x+s*0.45,y);g.lineTo(x+s*0.3,y+s*0.35);g.lineTo(x-s*0.3,y+s*0.35);g.closePath();g.fill();
    g.fillStyle="#fff";g.beginPath();g.arc(x-s*0.18,y,s*0.07,0,7);g.fill();
    g.fillStyle=c2;g.fillRect(x+s*0.02,y-s*0.08,s*0.24,s*0.05);g.fillRect(x+s*0.02,y+s*0.06,s*0.18,s*0.05);
    x = 150; y = 46; s = 58; c1 = "#f97316"; c2 = "#22c55e"; c3 = "#7c2d12";
    g.fillStyle=c1;g.beginPath();g.moveTo(x-s*0.3,y-s*0.35);g.lineTo(x+s*0.3,y-s*0.35);g.lineTo(x+s*0.45,y);g.lineTo(x+s*0.3,y+s*0.35);g.lineTo(x-s*0.3,y+s*0.35);g.closePath();g.fill();
    g.fillStyle="#fff";g.beginPath();g.arc(x-s*0.18,y,s*0.07,0,7);g.fill();
    g.fillStyle=c2;g.fillRect(x+s*0.02,y-s*0.08,s*0.24,s*0.05);g.fillRect(x+s*0.02,y+s*0.06,s*0.18,s*0.05);
  },
  create: function (api) {

  var P = {sky:"#ffedd5", gnd:"#d6d3d1", c1:"#f97316", c2:"#22c55e", c3:"#7c2d12"};
  function R(a, b) { return a + Math.random() * (b - a); }
  function RI(a, b) { return Math.floor(R(a, b + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ic(g, kind, x, y, s, c1, c2, c3) {
    if (!isFinite(x)) x = 0; if (!isFinite(y)) y = 0;
    if (!isFinite(s) || s <= 0) s = 10;
    c1 = c1 || P.c1; c2 = c2 || P.c2; c3 = c3 || P.c3;
    switch (kind) {
      case "tag":
        g.fillStyle=c1;g.beginPath();g.moveTo(x-s*0.3,y-s*0.35);g.lineTo(x+s*0.3,y-s*0.35);g.lineTo(x+s*0.45,y);g.lineTo(x+s*0.3,y+s*0.35);g.lineTo(x-s*0.3,y+s*0.35);g.closePath();g.fill();
        g.fillStyle="#fff";g.beginPath();g.arc(x-s*0.18,y,s*0.07,0,7);g.fill();
        g.fillStyle=c2;g.fillRect(x+s*0.02,y-s*0.08,s*0.24,s*0.05);g.fillRect(x+s*0.02,y+s*0.06,s*0.18,s*0.05);
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
g.fillStyle=dk?"#2b3648":"#fce7f3";
for(var i=0;i<4;i++){g.fillRect(50+i*170,70,120,110);g.fillStyle=dk?"#3b475c":"#fff";g.fillRect(62+i*170,82,96,86);g.fillStyle=dk?"#2b3648":"#fce7f3";}
g.fillStyle="#ef4444";g.beginPath();g.arc(660,60,20,0,7);g.fill();
g.fillStyle=dk?"#3b475c":"#d6d3d1";g.fillRect(0,300,W,70);
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


  var RND = 3;
  var round = 0, target = 0, val = 0, grab = false, scores = [], flash = 0, flashGood = false, msg = "";
  var VERT = 1;
  function newRound() {
    target = R(0.15, 0.85); val = R(0.05, 0.95);
    msg = "Round " + (round + 1) + " of " + RND + "  —  set it to the gold mark";
  }
  newRound();
  function knobPos() {
    if (VERT === 1) return { x: W / 2, y: 120 + val * 210 };
    return { x: 130 + val * (W - 260), y: 215 };
  }
  function finishAll() {
    var avg = 0, best = 0;
    for (var i = 0; i < scores.length; i++) { avg += scores[i]; if (scores[i] > best) best = scores[i]; }
    avg = scores.length ? avg / scores.length : 0;
    fin(avg, rows2("Best Setting", best, best + "%", "Average", avg, Math.round(avg) + "%"));
  }
  function setFrom(p) {
    var q = san(p); if (!q) return;
    if (VERT === 1) val = clamp((q.y - 120) / 210, 0, 1);
    else val = clamp((q.x - 130) / (W - 260), 0, 1);
  }
  function down(p, now) {
    if (done) return; var q = san(p); if (!q) return;
    var k = knobPos();
    if (dist(q.x, q.y, k.x, k.y) < 55) grab = true;
    else setFrom(q);
  }
  function move(p, now) { if (!done && grab) setFrom(p); }
  function up(p, now) {
    if (done || !grab) return; grab = false;
    var err = Math.abs(val - target);
    var sc = clamp(Math.round(100 - err * 240), 0, 100);
    scores.push(sc); flash = 0.9; flashGood = sc >= 70;
    if (sc >= 70) sndGood(); else sndBad();
    round++;
    if (round >= RND) finishAll(); else newRound();
  }
  function draw(g, dt, now) {
    bg(g);
    var t = el(now);
    if (!done && t > 25) finishAll();
    var cx = W / 2, cy = 215, k = knobPos();
    txt(g, msg, cx, 52, 22, isDark() ? "#e8e8e8" : "#334155");
    dots(g, RND, round, cx, 82);
    g.fillStyle = isDark() ? "#2f3a4d" : "#ffffff";
    if (VERT === 1) {
      rr(g, cx - 50, 100, 100, 250, 22); g.fill();
      g.fillStyle = "rgba(120,120,120,0.3)"; g.fillRect(cx - 6, 120, 12, 210);
      g.fillStyle = "#f59e0b"; g.fillRect(cx - 50, 120 + target * 210 - 4, 100, 8);
      g.fillStyle = "#38bdf8"; g.beginPath(); g.arc(cx, k.y, 26, 0, 7); g.fill();
      g.strokeStyle = "#0369a1"; g.lineWidth = 3; g.beginPath(); g.arc(cx, k.y, 26, 0, 7); g.stroke();
      ic(g, "tag", cx, k.y, 30, "#ffffff", P.c2, P.c3);
      txt(g, Math.round(val * 100) + "", cx + 90, k.y, 20, isDark() ? "#e8e8e8" : "#334155");
    } else {
      rr(g, 110, cy - 50, W - 220, 100, 22); g.fill();
      g.fillStyle = "rgba(120,120,120,0.3)"; g.fillRect(130, cy - 6, W - 260, 12);
      g.fillStyle = "#f59e0b"; g.fillRect(130 + target * (W - 260) - 4, cy - 50, 8, 100);
      g.fillStyle = "#38bdf8"; g.beginPath(); g.arc(k.x, cy, 26, 0, 7); g.fill();
      g.strokeStyle = "#0369a1"; g.lineWidth = 3; g.beginPath(); g.arc(k.x, cy, 26, 0, 7); g.stroke();
      ic(g, "tag", k.x, cy, 30, "#ffffff", P.c2, P.c3);
      txt(g, Math.round(val * 100) + "", k.x, cy - 66, 20, isDark() ? "#e8e8e8" : "#334155");
    }
    if (flash > 0) { flash -= dt || 0.016; txt(g, flashGood ? "Spot on!" : "Off the mark!", cx, 128, 24, flashGood ? "#16a34a" : "#dc2626"); }
    txt(g, "Drag the knob to the gold mark, then let go.", cx, H - 46, 15, isDark() ? "#aab6c6" : "#64748b");
    bar(g, 24, H - 26, W - 48, 8, 1 - t / 25, "#38bdf8");
  }

  return {
    status: function () { return msg + (done ? "  Done!" : ""); },
    down: down, move: move, up: up, draw: draw
  };

  }
});
