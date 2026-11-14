// GoofGig #438 — The Traffic Cone
// A tiny everyday gig: Cones roll, cars swerve, you dodge.
registerGame({
  n: 438,
  title: "The Traffic Cone",
  desc: "Cones roll, cars swerve, you dodge.",
  hint: "Move to dodge the rolling cones.",
  grades: [
    ["The Cone Whisperer", "The cone has officially met its master."],
    ["Rising Cone Dodger", "Almost flawless. The cone is jealous."],
    ["The Cone Regular", "Respectable. The cone gives a small nod."],
    ["Rookie Cone Dodger", "Keep practicing. The cone is patient."],
    ["The Cone Rookie", "The cone has filed a formal complaint."]
  ],
  thumb: function (g) {
    g.fillStyle = "#dbeafe"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#94a3b8"; g.fillRect(0, 74, 300, 18);
    g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(36, 22, 12, 0, 7); g.fill();
    g.beginPath(); g.arc(264, 26, 9, 0, 7); g.fill();
    var x = 52, y = 46, s = 34, c1 = "#f59e0b", c2 = "#334155", c3 = "#38bdf8";
    g.fillStyle=c1;g.beginPath();g.moveTo(x-s*0.3,y+s*0.35);g.lineTo(x,y-s*0.5);g.lineTo(x+s*0.3,y+s*0.35);g.closePath();g.fill();
    g.fillStyle="#fff";g.fillRect(x-s*0.2,y-s*0.08,s*0.4,s*0.12);
    g.fillStyle=c1;g.fillRect(x-s*0.42,y+s*0.35,s*0.84,s*0.1);
    x = 248; y = 46; s = 34; c1 = "#334155"; c2 = "#38bdf8"; c3 = "#f59e0b";
    g.fillStyle=c1;g.beginPath();g.moveTo(x-s*0.3,y+s*0.35);g.lineTo(x,y-s*0.5);g.lineTo(x+s*0.3,y+s*0.35);g.closePath();g.fill();
    g.fillStyle="#fff";g.fillRect(x-s*0.2,y-s*0.08,s*0.4,s*0.12);
    g.fillStyle=c1;g.fillRect(x-s*0.42,y+s*0.35,s*0.84,s*0.1);
    x = 150; y = 46; s = 58; c1 = "#38bdf8"; c2 = "#f59e0b"; c3 = "#334155";
    g.fillStyle=c1;g.beginPath();g.moveTo(x-s*0.3,y+s*0.35);g.lineTo(x,y-s*0.5);g.lineTo(x+s*0.3,y+s*0.35);g.closePath();g.fill();
    g.fillStyle="#fff";g.fillRect(x-s*0.2,y-s*0.08,s*0.4,s*0.12);
    g.fillStyle=c1;g.fillRect(x-s*0.42,y+s*0.35,s*0.84,s*0.1);
  },
  create: function (api) {

  var P = {sky:"#dbeafe", gnd:"#94a3b8", c1:"#38bdf8", c2:"#f59e0b", c3:"#334155"};
  function R(a, b) { return a + Math.random() * (b - a); }
  function RI(a, b) { return Math.floor(R(a, b + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ic(g, kind, x, y, s, c1, c2, c3) {
    if (!isFinite(x)) x = 0; if (!isFinite(y)) y = 0;
    if (!isFinite(s) || s <= 0) s = 10;
    c1 = c1 || P.c1; c2 = c2 || P.c2; c3 = c3 || P.c3;
    switch (kind) {
      case "cone":
        g.fillStyle=c1;g.beginPath();g.moveTo(x-s*0.3,y+s*0.35);g.lineTo(x,y-s*0.5);g.lineTo(x+s*0.3,y+s*0.35);g.closePath();g.fill();
        g.fillStyle="#fff";g.fillRect(x-s*0.2,y-s*0.08,s*0.4,s*0.12);
        g.fillStyle=c1;g.fillRect(x-s*0.42,y+s*0.35,s*0.84,s*0.1);
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


  var DUR = 20, hazards = [], px = W / 2, py = 260, lives = 3, near = 0, spawnT = 0;
  var SIDE = 1;
  var invuln = 0;
  function finishAll() {
    var sc = clamp(Math.round(lives / 3 * 70 + Math.min(near, 12) * 2.5), 0, 100);
    fin(sc, rows2("Lives Left", Math.round(lives / 3 * 100), lives + " / 3", "Close Calls", Math.min(near * 8, 100), near + " dodged"));
  }
  function setPos(p) { var q = san(p); if (q && !done) { px = clamp(q.x, 50, W - 50); py = clamp(q.y, 110, H - 60); } }
  function down(p, now) { setPos(p); }
  function move(p, now) { setPos(p); }
  function up(p, now) {}
  function draw(g, dt, now) {
    bg(g);
    var t = el(now);
    if (!done && t > DUR) finishAll();
    var d = clamp(dt || 0.016, 0, 0.05);
    if (!done) {
      if (invuln > 0) invuln -= d;
      spawnT -= d;
      if (spawnT <= 0) {
        spawnT = R(0.5, 0.9);
        if (SIDE === 1) hazards.push({ x: Math.random() < 0.5 ? -30 : W + 30, y: R(130, 340), vx: 0, vy: 0 });
        else hazards.push({ x: R(60, W - 60), y: 100, vx: 0, vy: R(130, 200) });
        var h = hazards[hazards.length - 1];
        if (SIDE === 1) h.vx = (h.x < 0 ? 1 : -1) * R(140, 210);
      }
      for (var i = hazards.length - 1; i >= 0; i--) {
        var hz = hazards[i];
        hz.x += hz.vx * d; hz.y += hz.vy * d;
        var dd = dist(hz.x, hz.y, px, py);
        if (dd < 34 && invuln <= 0) {
          lives--; invuln = 1.2; sndBad();
          hazards.splice(i, 1);
          if (lives <= 0) { finishAll(); break; }
          continue;
        }
        if (dd < 70 && dd >= 34 && !hz.counted) { hz.counted = true; near++; }
        if (hz.y > H - 20 || hz.x < -50 || hz.x > W + 50) hazards.splice(i, 1);
      }
    }
    txt(g, "Lives " + lives + "  •  Close calls " + near, W / 2, 52, 22, isDark() ? "#e8e8e8" : "#334155");
    // hearts
    for (var h2 = 0; h2 < 3; h2++) {
      g.fillStyle = h2 < lives ? "#ef4444" : "rgba(120,120,120,0.3)";
      g.beginPath(); g.arc(W / 2 - 30 + h2 * 30, 82, 9, 0, 7); g.fill();
    }
    for (var j = 0; j < hazards.length; j++) {
      ic(g, "cone", hazards[j].x, hazards[j].y, 44, "#ef4444", P.c2, P.c3);
    }
    // player
    if (invuln > 0 && Math.floor(t * 10) % 2 === 0) { /* blink */ }
    else ic(g, "star", px, py, 44, "#38bdf8", "#ffffff", "#0369a1");
    g.strokeStyle = "rgba(56,189,248,0.4)"; g.lineWidth = 2;
    g.beginPath(); g.arc(px, py, 30, 0, 7); g.stroke();
    txt(g, "Move to dodge everything. Three hits and it is over.", W / 2, H - 46, 15, isDark() ? "#aab6c6" : "#64748b");
    bar(g, 24, H - 26, W - 48, 8, 1 - t / DUR, "#38bdf8");
  }

  return {
    status: function () { return "Lives " + lives + (done ? "  Done!" : ""); },
    down: down, move: move, up: up, draw: draw
  };

  }
});
