// GoofGig #421 — The Falling Stars
// A tiny everyday gig: Make a wish, catch a star, repeat.
registerGame({
  n: 421,
  title: "The Falling Stars",
  desc: "Make a wish, catch a star, repeat.",
  hint: "Move the net to catch the falling stars.",
  grades: [
    ["Legendary Star Catcher", "Flawless. The star never stood a chance."],
    ["Star Catcher Plus", "Sharp work. The star barely kept up."],
    ["Journeyman Star Catcher", "A steady hand and a patient star."],
    ["Star Catcher Hopeful", "Rough around the edges, but charming."],
    ["Certified Star Hazard", "The star requests a different player."]
  ],
  thumb: function (g) {
    g.fillStyle = "#e0f2fe"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#cbd5e1"; g.fillRect(0, 74, 300, 18);
    g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(36, 22, 12, 0, 7); g.fill();
    g.beginPath(); g.arc(264, 26, 9, 0, 7); g.fill();
    var x = 52, y = 46, s = 34, c1 = "#94a3b8", c2 = "#0c4a6e", c3 = "#0ea5e9";
    g.fillStyle=c1;g.beginPath();
    for(var i=0;i<10;i++){var a=-Math.PI/2+i*Math.PI/5,r2=i%2===0?s*0.55:s*0.24;var px=x+Math.cos(a)*r2,py=y+Math.sin(a)*r2;if(i===0)g.moveTo(px,py);else g.lineTo(px,py);}
    g.closePath();g.fill();g.fillStyle=c2;g.beginPath();g.arc(x-s*0.12,y-s*0.12,s*0.1,0,7);g.fill();
    x = 248; y = 46; s = 34; c1 = "#0c4a6e"; c2 = "#0ea5e9"; c3 = "#94a3b8";
    g.fillStyle=c1;g.beginPath();
    for(var i=0;i<10;i++){var a=-Math.PI/2+i*Math.PI/5,r2=i%2===0?s*0.55:s*0.24;var px=x+Math.cos(a)*r2,py=y+Math.sin(a)*r2;if(i===0)g.moveTo(px,py);else g.lineTo(px,py);}
    g.closePath();g.fill();g.fillStyle=c2;g.beginPath();g.arc(x-s*0.12,y-s*0.12,s*0.1,0,7);g.fill();
    x = 150; y = 46; s = 58; c1 = "#0ea5e9"; c2 = "#94a3b8"; c3 = "#0c4a6e";
    g.fillStyle=c1;g.beginPath();
    for(var i=0;i<10;i++){var a=-Math.PI/2+i*Math.PI/5,r2=i%2===0?s*0.55:s*0.24;var px=x+Math.cos(a)*r2,py=y+Math.sin(a)*r2;if(i===0)g.moveTo(px,py);else g.lineTo(px,py);}
    g.closePath();g.fill();g.fillStyle=c2;g.beginPath();g.arc(x-s*0.12,y-s*0.12,s*0.1,0,7);g.fill();
  },
  create: function (api) {

  var P = {sky:"#e0f2fe", gnd:"#cbd5e1", c1:"#0ea5e9", c2:"#94a3b8", c3:"#0c4a6e"};
  function R(a, b) { return a + Math.random() * (b - a); }
  function RI(a, b) { return Math.floor(R(a, b + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ic(g, kind, x, y, s, c1, c2, c3) {
    if (!isFinite(x)) x = 0; if (!isFinite(y)) y = 0;
    if (!isFinite(s) || s <= 0) s = 10;
    c1 = c1 || P.c1; c2 = c2 || P.c2; c3 = c3 || P.c3;
    switch (kind) {
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
g.fillStyle="rgba(255,255,255,0.75)";
g.beginPath();g.arc(120,80,26,0,7);g.arc(150,70,30,0,7);g.arc(185,82,24,0,7);g.fill();
g.beginPath();g.arc(W-160,110,22,0,7);g.arc(W-130,100,26,0,7);g.fill();
g.fillStyle="#fbbf24";g.beginPath();g.arc(W-70,70,24,0,7);g.fill();
g.strokeStyle="rgba(56,189,248,0.5)";g.lineWidth=3;
for(var i=0;i<4;i++){g.beginPath();g.moveTo(300+i*40,60);g.lineTo(292+i*40,90);g.stroke();}
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


  var DUR = 20, items = [], caught = 0, missed = 0, total = 0;
  var cx = W / 2, spawnT = 0, SWAY = 1;
  var CATCHY = 350, CW = 110;
  function finishAll() {
    var sc = total > 0 ? Math.round(caught / total * 100) : 0;
    fin(sc, rows2("Caught", sc, caught + " / " + total, "Missed", total ? Math.round(100 - missed / total * 100) : 0, missed + " missed"));
  }
  function down(p, now) { var q = san(p); if (q && !done) cx = clamp(q.x, 60, W - 60); }
  function move(p, now) { var q = san(p); if (q && !done) cx = clamp(q.x, 60, W - 60); }
  function up(p, now) {}
  function draw(g, dt, now) {
    bg(g);
    var t = el(now);
    if (!done && t > DUR) finishAll();
    var d = clamp(dt || 0.016, 0, 0.05);
    if (!done) {
      spawnT -= d;
      if (spawnT <= 0) {
        spawnT = R(0.55, 0.95);
        items.push({ x: R(70, W - 70), y: 100, v: R(120, 190), ph: Math.random() * 6 });
        total++;
      }
      for (var i = items.length - 1; i >= 0; i--) {
        var it = items[i];
        it.y += it.v * d;
        if (SWAY === 1) it.x += Math.sin(t * 3 + it.ph) * 22 * d;
        if (it.y >= CATCHY && it.y < CATCHY + 30) {
          if (Math.abs(it.x - cx) < CW / 2 + 14) { caught++; blip(880, 0.07, "sine", 0.15); }
          else missed++;
          items.splice(i, 1);
        } else if (it.y > H - 30) { missed++; items.splice(i, 1); }
      }
    }
    txt(g, "Caught " + caught + "  •  Missed " + missed, W / 2, 52, 22, isDark() ? "#e8e8e8" : "#334155");
    // falling items
    for (var j = 0; j < items.length; j++) {
      ic(g, "star", items[j].x, items[j].y, 40, P.c1, P.c2, P.c3);
    }
    // catcher
    g.fillStyle = P.c2;
    rr(g, cx - CW / 2, CATCHY, CW, 34, 12); g.fill();
    g.strokeStyle = "rgba(0,0,0,0.2)"; g.lineWidth = 2; rr(g, cx - CW / 2, CATCHY, CW, 34, 12); g.stroke();
    g.fillStyle = "rgba(255,255,255,0.35)";
    rr(g, cx - CW / 2 + 8, CATCHY + 5, CW - 16, 8, 4); g.fill();
    // catch line
    g.strokeStyle = "rgba(245,158,11,0.5)"; g.lineWidth = 2; g.setLineDash([8, 8]);
    g.beginPath(); g.moveTo(40, CATCHY + 8); g.lineTo(W - 40, CATCHY + 8); g.stroke();
    g.setLineDash([]);
    txt(g, "Move to catch the falling items in the tray.", W / 2, H - 46, 15, isDark() ? "#aab6c6" : "#64748b");
    bar(g, 24, H - 26, W - 48, 8, 1 - t / DUR, "#38bdf8");
  }

  return {
    status: function () { return "Caught " + caught + " of " + total + (done ? "  Done!" : ""); },
    down: down, move: move, up: up, draw: draw
  };

  }
});
