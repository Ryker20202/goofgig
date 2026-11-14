// GoofGig #161 — The Blinking Cursor
// A tiny everyday gig: It blinks. You wait. It blinks again.
registerGame({
  n: 161,
  title: "The Blinking Cursor",
  desc: "It blinks. You wait. It blinks again.",
  hint: "Tap when the cursor flashes gold.",
  grades: [
    ["The Cursor Whisperer", "You make this look easy. It is not."],
    ["Senior Cursor Watcher", "A fine display of cursor mastery."],
    ["The Cursor Regular", "You handled the cursor like a pro. Almost."],
    ["Cursor Watcher Hopeful", "Not your best, not your worst. The cursor shrugs."],
    ["The Cursor Disaster", "The cursor requests a different player."]
  ],
  thumb: function (g) {
    g.fillStyle = "#e0e7ff"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#94a3b8"; g.fillRect(0, 74, 300, 18);
    g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(36, 22, 12, 0, 7); g.fill();
    g.beginPath(); g.arc(264, 26, 9, 0, 7); g.fill();
    var x = 52, y = 46, s = 34, c1 = "#f59e0b", c2 = "#475569", c3 = "#6366f1";
    g.fillStyle=c1;g.beginPath();g.moveTo(x+s*0.08,y-s*0.55);g.lineTo(x-s*0.3,y+s*0.05);g.lineTo(x-s*0.02,y+s*0.05);g.lineTo(x-s*0.12,y+s*0.55);g.lineTo(x+s*0.3,y-s*0.08);g.lineTo(x+s*0.02,y-s*0.08);g.closePath();g.fill();
    x = 248; y = 46; s = 34; c1 = "#475569"; c2 = "#6366f1"; c3 = "#f59e0b";
    g.fillStyle=c1;g.beginPath();g.moveTo(x+s*0.08,y-s*0.55);g.lineTo(x-s*0.3,y+s*0.05);g.lineTo(x-s*0.02,y+s*0.05);g.lineTo(x-s*0.12,y+s*0.55);g.lineTo(x+s*0.3,y-s*0.08);g.lineTo(x+s*0.02,y-s*0.08);g.closePath();g.fill();
    x = 150; y = 46; s = 58; c1 = "#6366f1"; c2 = "#f59e0b"; c3 = "#475569";
    g.fillStyle=c1;g.beginPath();g.moveTo(x+s*0.08,y-s*0.55);g.lineTo(x-s*0.3,y+s*0.05);g.lineTo(x-s*0.02,y+s*0.05);g.lineTo(x-s*0.12,y+s*0.55);g.lineTo(x+s*0.3,y-s*0.08);g.lineTo(x+s*0.02,y-s*0.08);g.closePath();g.fill();
  },
  create: function (api) {

  var P = {sky:"#e0e7ff", gnd:"#94a3b8", c1:"#6366f1", c2:"#f59e0b", c3:"#475569"};
  function R(a, b) { return a + Math.random() * (b - a); }
  function RI(a, b) { return Math.floor(R(a, b + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ic(g, kind, x, y, s, c1, c2, c3) {
    if (!isFinite(x)) x = 0; if (!isFinite(y)) y = 0;
    if (!isFinite(s) || s <= 0) s = 10;
    c1 = c1 || P.c1; c2 = c2 || P.c2; c3 = c3 || P.c3;
    switch (kind) {
      case "bolt":
        g.fillStyle=c1;g.beginPath();g.moveTo(x+s*0.08,y-s*0.55);g.lineTo(x-s*0.3,y+s*0.05);g.lineTo(x-s*0.02,y+s*0.05);g.lineTo(x-s*0.12,y+s*0.55);g.lineTo(x+s*0.3,y-s*0.08);g.lineTo(x+s*0.02,y-s*0.08);g.closePath();g.fill();
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


  var RND = 5;
  var round = 0, scores = [], flash = 0, flashTxt = "", msg = "";
  var lit = -1, litT = 0, nextAt = 1.0, tapped = false, CIRCLE = 1;
  var NL = 5, litIdx = 0;
  function newRound(now) {
    msg = "Round " + (round + 1) + " of " + RND;
    nextAt = el(now) + R(0.7, 1.8); lit = -1; tapped = false;
  }
  newRound(0);
  function finishAll() {
    var avg = 0, best = 0;
    for (var i = 0; i < scores.length; i++) { avg += scores[i]; if (scores[i] > best) best = scores[i]; }
    avg = scores.length ? avg / scores.length : 0;
    fin(avg, rows2("Best Flash", best, best + "%", "Average", avg, Math.round(avg) + "%"));
  }
  function nextR(now) {
    round++;
    if (round >= RND) finishAll(); else newRound(now);
  }
  function down(p, now) {
    if (done) return; var q = san(p); if (!q) return;
    var t = el(now);
    if (lit >= 0 && !tapped) {
      var rt = t - litT;
      var sc = clamp(Math.round(100 - rt * 110), 10, 100);
      scores.push(sc); tapped = true; flash = 0.8; flashTxt = "Caught it!"; sndGood();
      nextR(now);
    } else if (lit < 0 && !tapped) {
      scores.push(0); tapped = true; flash = 0.8; flashTxt = "Nothing lit!"; sndBad();
      nextR(now);
    }
  }
  function move(p, now) {}
  function up(p, now) {}
  function lightPos(i) {
    if (CIRCLE === 1) {
      var a = -Math.PI / 2 + i * Math.PI * 2 / NL;
      return { x: W / 2 + Math.cos(a) * 110, y: 215 + Math.sin(a) * 95 };
    }
    return { x: 180 + i * 90, y: 215 };
  }
  function draw(g, dt, now) {
    bg(g);
    var t = el(now);
    if (!done && t > 25) finishAll();
    if (!done && lit < 0 && t >= nextAt) { lit = RI(0, NL - 1); litT = t; blip(1200, 0.08, "sine", 0.15); }
    if (!done && lit >= 0 && t - litT > 0.7) { if (!tapped) { scores.push(0); flash = 0.8; flashTxt = "Missed it!"; sndBad(); } nextR(now); }
    var cx = W / 2;
    txt(g, msg, cx, 52, 22, isDark() ? "#e8e8e8" : "#334155");
    dots(g, RND, round, cx, 82);
    g.fillStyle = isDark() ? "#2f3a4d" : "#ffffff";
    rr(g, cx - 270, 120, 540, 200, 24); g.fill();
    g.strokeStyle = "rgba(120,120,120,0.4)"; g.lineWidth = 2; rr(g, cx - 270, 120, 540, 200, 24); g.stroke();
    for (var i = 0; i < NL; i++) {
      var lp = lightPos(i), isLit = i === lit;
      g.fillStyle = isLit ? "#fbbf24" : (isDark() ? "#3b475c" : "#cbd5e1");
      g.beginPath(); g.arc(lp.x, lp.y, isLit ? 30 : 24, 0, 7); g.fill();
      if (isLit) {
        g.strokeStyle = "rgba(251,191,36,0.5)"; g.lineWidth = 6;
        g.beginPath(); g.arc(lp.x, lp.y, 40, 0, 7); g.stroke();
      }
      g.fillStyle = "rgba(255,255,255,0.5)";
      g.beginPath(); g.arc(lp.x - 8, lp.y - 8, 7, 0, 7); g.fill();
    }
    ic(g, "bolt", cx, 350, 30, P.c1, P.c2, P.c3);
    if (flash > 0) { flash -= dt || 0.016; txt(g, flashTxt, cx, 128, 24, "#0ea5e9"); }
    txt(g, "Tap the instant the golden light flashes.", cx, H - 46, 15, isDark() ? "#aab6c6" : "#64748b");
    bar(g, 24, H - 26, W - 48, 8, 1 - t / 25, "#38bdf8");
  }

  return {
    status: function () { return msg + (done ? "  Done!" : ""); },
    down: down, move: move, up: up, draw: draw
  };

  }
});
