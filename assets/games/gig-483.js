// GoofGig #483 — The Water Balloon
// A tiny everyday gig: Fill it, sling it, and run before it pops.
registerGame({
  n: 483,
  title: "The Water Balloon",
  desc: "Fill it, sling it, and run before it pops.",
  hint: "Drag back and release to launch at the target.",
  grades: [
    ["Captain Water balloon", "Not a single wobble. Suspiciously good."],
    ["Balloon Slinger Plus", "A fine display of water balloon mastery."],
    ["Balloon Slinger in Training", "You handled the water balloon like a pro. Almost."],
    ["Balloon Slinger Hopeful", "Rough around the edges, but charming."],
    ["The Water balloon Disaster", "The water balloon has filed a formal complaint."]
  ],
  thumb: function (g) {
    g.fillStyle = "#dcfce7"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#86efac"; g.fillRect(0, 74, 300, 18);
    g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(36, 22, 12, 0, 7); g.fill();
    g.beginPath(); g.arc(264, 26, 9, 0, 7); g.fill();
    var x = 52, y = 46, s = 34, c1 = "#f59e0b", c2 = "#166534", c3 = "#22c55e";
    g.fillStyle=c1;g.beginPath();g.ellipse(x,y-s*0.08,s*0.36,s*0.44,0,0,7);g.fill();
    g.fillStyle="rgba(255,255,255,0.4)";g.beginPath();g.ellipse(x-s*0.14,y-s*0.26,s*0.09,s*0.14,-0.4,0,7);g.fill();
    g.fillStyle=c1;g.beginPath();g.moveTo(x-s*0.07,y+s*0.34);g.lineTo(x+s*0.07,y+s*0.34);g.lineTo(x,y+s*0.44);g.closePath();g.fill();
    g.strokeStyle="#94a3b8";g.lineWidth=2;g.beginPath();g.moveTo(x,y+s*0.44);g.quadraticCurveTo(x+s*0.1,y+s*0.6,x,y+s*0.72);g.stroke();
    x = 248; y = 46; s = 34; c1 = "#166534"; c2 = "#22c55e"; c3 = "#f59e0b";
    g.fillStyle=c1;g.beginPath();g.ellipse(x,y-s*0.08,s*0.36,s*0.44,0,0,7);g.fill();
    g.fillStyle="rgba(255,255,255,0.4)";g.beginPath();g.ellipse(x-s*0.14,y-s*0.26,s*0.09,s*0.14,-0.4,0,7);g.fill();
    g.fillStyle=c1;g.beginPath();g.moveTo(x-s*0.07,y+s*0.34);g.lineTo(x+s*0.07,y+s*0.34);g.lineTo(x,y+s*0.44);g.closePath();g.fill();
    g.strokeStyle="#94a3b8";g.lineWidth=2;g.beginPath();g.moveTo(x,y+s*0.44);g.quadraticCurveTo(x+s*0.1,y+s*0.6,x,y+s*0.72);g.stroke();
    x = 150; y = 46; s = 58; c1 = "#22c55e"; c2 = "#f59e0b"; c3 = "#166534";
    g.fillStyle=c1;g.beginPath();g.ellipse(x,y-s*0.08,s*0.36,s*0.44,0,0,7);g.fill();
    g.fillStyle="rgba(255,255,255,0.4)";g.beginPath();g.ellipse(x-s*0.14,y-s*0.26,s*0.09,s*0.14,-0.4,0,7);g.fill();
    g.fillStyle=c1;g.beginPath();g.moveTo(x-s*0.07,y+s*0.34);g.lineTo(x+s*0.07,y+s*0.34);g.lineTo(x,y+s*0.44);g.closePath();g.fill();
    g.strokeStyle="#94a3b8";g.lineWidth=2;g.beginPath();g.moveTo(x,y+s*0.44);g.quadraticCurveTo(x+s*0.1,y+s*0.6,x,y+s*0.72);g.stroke();
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
      case "balloon":
        g.fillStyle=c1;g.beginPath();g.ellipse(x,y-s*0.08,s*0.36,s*0.44,0,0,7);g.fill();
        g.fillStyle="rgba(255,255,255,0.4)";g.beginPath();g.ellipse(x-s*0.14,y-s*0.26,s*0.09,s*0.14,-0.4,0,7);g.fill();
        g.fillStyle=c1;g.beginPath();g.moveTo(x-s*0.07,y+s*0.34);g.lineTo(x+s*0.07,y+s*0.34);g.lineTo(x,y+s*0.44);g.closePath();g.fill();
        g.strokeStyle="#94a3b8";g.lineWidth=2;g.beginPath();g.moveTo(x,y+s*0.44);g.quadraticCurveTo(x+s*0.1,y+s*0.6,x,y+s*0.72);g.stroke();
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


  var SHOTS = 3, shot = 0, scores = [], flash = 0, flashGood = false, msg = "";
  var AX = 150, AY = 300, dragging = false, dx = 0, dy = 0;
  var proj = null, tx = 0, ty = 0, AIR = 0;
  function newTarget() {
    tx = R(480, 640);
    ty = AIR === 1 ? R(130, 220) : 320;
    msg = "Shot " + (shot + 1) + " of " + SHOTS + "  —  pull back and let go";
  }
  newTarget();
  function finishAll() {
    var avg = 0, best = 0;
    for (var i = 0; i < scores.length; i++) { avg += scores[i]; if (scores[i] > best) best = scores[i]; }
    avg = scores.length ? avg / scores.length : 0;
    fin(avg, rows2("Best Shot", best, best + "%", "Average", avg, Math.round(avg) + "%"));
  }
  function scoreShot() {
    var d = proj ? dist(proj.x, proj.y, tx, ty) : 999;
    var sc = clamp(Math.round(100 - d * 0.5), 0, 100);
    scores.push(sc); flash = 0.9; flashGood = sc >= 70;
    if (sc >= 70) sndGood(); else sndBad();
    shot++; proj = null;
    if (shot >= SHOTS) finishAll(); else newTarget();
  }
  function down(p, now) {
    if (done) return; var q = san(p); if (!q) return;
    if (!proj && dist(q.x, q.y, AX, AY) < 70) dragging = true;
  }
  function move(p, now) {
    if (done || !dragging) return; var q = san(p); if (!q) return;
    dx = clamp(q.x - AX, -110, 110); dy = clamp(q.y - AY, -90, 90);
  }
  function up(p, now) {
    if (done || !dragging) return; dragging = false;
    if (Math.abs(dx) + Math.abs(dy) < 12) { dx = 0; dy = 0; return; }
    proj = { x: AX, y: AY, vx: -dx * 5.2, vy: -dy * 5.2 - 60 };
    dx = 0; dy = 0; blip(440, 0.1, "sine", 0.2);
  }
  function draw(g, dt, now) {
    bg(g);
    var t = el(now);
    if (!done && t > 25) finishAll();
    var d = clamp(dt || 0.016, 0, 0.05);
    if (!done && proj) {
      proj.vy += 900 * d;
      proj.x += proj.vx * d; proj.y += proj.vy * d;
      if (proj.y > H - 40 || proj.x > W + 20 || proj.x < -20) {
        if (proj.y > H - 40) proj.y = H - 40;
        scoreShot();
      }
    }
    var cx = W / 2;
    txt(g, msg, cx, 52, 22, isDark() ? "#e8e8e8" : "#334155");
    dots(g, SHOTS, shot, cx, 82);
    // slingshot fork
    g.strokeStyle = "#92400e"; g.lineWidth = 10; g.lineCap = "round";
    g.beginPath(); g.moveTo(AX, AY + 40); g.lineTo(AX, AY); g.stroke();
    g.beginPath(); g.moveTo(AX, AY); g.lineTo(AX - 26, AY - 30); g.stroke();
    g.beginPath(); g.moveTo(AX, AY); g.lineTo(AX + 26, AY - 30); g.stroke();
    // band
    if (dragging) {
      g.strokeStyle = "#e11d48"; g.lineWidth = 4;
      g.beginPath(); g.moveTo(AX - 26, AY - 30); g.lineTo(AX + dx, AY + dy); g.lineTo(AX + 26, AY - 30); g.stroke();
      ic(g, "balloon", AX + dx, AY + dy, 40, P.c1, P.c2, P.c3);
    } else if (!proj) {
      ic(g, "balloon", AX, AY - 6, 40, P.c1, P.c2, P.c3);
    }
    // target
    g.fillStyle = "rgba(245,158,11,0.2)";
    g.beginPath(); g.arc(tx, ty, 48, 0, 7); g.fill();
    g.strokeStyle = "#f59e0b"; g.lineWidth = 4; g.setLineDash([10, 8]);
    g.beginPath(); g.arc(tx, ty, 48, 0, 7); g.stroke();
    g.setLineDash([]);
    g.fillStyle = "#f59e0b"; g.beginPath(); g.arc(tx, ty, 10, 0, 7); g.fill();
    if (AIR === 0) {
      g.fillStyle = isDark() ? "#3b475c" : "#94a3b8";
      g.fillRect(tx - 4, ty + 10, 8, H - 34 - ty);
    }
    if (proj) ic(g, "balloon", proj.x, proj.y, 40, P.c1, P.c2, P.c3);
    if (flash > 0) { flash -= dt || 0.016; txt(g, flashGood ? "Bullseye!" : "Off target!", cx, 128, 24, flashGood ? "#16a34a" : "#dc2626"); }
    txt(g, "Drag back from the slingshot and release to launch.", cx, H - 46, 15, isDark() ? "#aab6c6" : "#64748b");
    bar(g, 24, H - 26, W - 48, 8, 1 - t / 25, "#38bdf8");
  }

  return {
    status: function () { return msg + (done ? "  Done!" : ""); },
    down: down, move: move, up: up, draw: draw
  };

  }
});
