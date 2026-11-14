// GoofGig #400 — The Earphone Pair
// A tiny everyday gig: One earphone, one match, and a very tangled cord.
registerGame({
  n: 400,
  title: "The Earphone Pair",
  desc: "One earphone, one match, and a very tangled cord.",
  hint: "Drag each earphone onto its matching pair.",
  grades: [
    ["The Earphones Whisperer", "Perfect score, zero mercy for the earphones."],
    ["Solid Earphone Matcher", "Excellent. The earphones sends its regards."],
    ["Capable Earphone Matcher", "Respectable. The earphones gives a small nod."],
    ["Earphone Matcher Hopeful", "Rough around the edges, but charming."],
    ["The Earphones Disaster", "Bold strategy. The earphones disagrees."]
  ],
  thumb: function (g) {
    g.fillStyle = "#e0f2fe"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#bae6fd"; g.fillRect(0, 74, 300, 18);
    g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(36, 22, 12, 0, 7); g.fill();
    g.beginPath(); g.arc(264, 26, 9, 0, 7); g.fill();
    var x = 52, y = 46, s = 34, c1 = "#f59e0b", c2 = "#0c4a6e", c3 = "#0ea5e9";
    g.strokeStyle=c1;g.lineWidth=6;g.beginPath();g.arc(x,y+s*0.1,s*0.4,Math.PI,0);g.stroke();
    g.fillStyle=c1;g.fillRect(x-s*0.46,y+s*0.05,s*0.12,s*0.26);g.fillRect(x+s*0.34,y+s*0.05,s*0.12,s*0.26);
    g.fillStyle=c2;g.beginPath();g.arc(x-s*0.4,y+s*0.18,s*0.06,0,7);g.fill();g.beginPath();g.arc(x+s*0.4,y+s*0.18,s*0.06,0,7);g.fill();
    x = 248; y = 46; s = 34; c1 = "#0c4a6e"; c2 = "#0ea5e9"; c3 = "#f59e0b";
    g.strokeStyle=c1;g.lineWidth=6;g.beginPath();g.arc(x,y+s*0.1,s*0.4,Math.PI,0);g.stroke();
    g.fillStyle=c1;g.fillRect(x-s*0.46,y+s*0.05,s*0.12,s*0.26);g.fillRect(x+s*0.34,y+s*0.05,s*0.12,s*0.26);
    g.fillStyle=c2;g.beginPath();g.arc(x-s*0.4,y+s*0.18,s*0.06,0,7);g.fill();g.beginPath();g.arc(x+s*0.4,y+s*0.18,s*0.06,0,7);g.fill();
    x = 150; y = 46; s = 58; c1 = "#0ea5e9"; c2 = "#f59e0b"; c3 = "#0c4a6e";
    g.strokeStyle=c1;g.lineWidth=6;g.beginPath();g.arc(x,y+s*0.1,s*0.4,Math.PI,0);g.stroke();
    g.fillStyle=c1;g.fillRect(x-s*0.46,y+s*0.05,s*0.12,s*0.26);g.fillRect(x+s*0.34,y+s*0.05,s*0.12,s*0.26);
    g.fillStyle=c2;g.beginPath();g.arc(x-s*0.4,y+s*0.18,s*0.06,0,7);g.fill();g.beginPath();g.arc(x+s*0.4,y+s*0.18,s*0.06,0,7);g.fill();
  },
  create: function (api) {

  var P = {sky:"#e0f2fe", gnd:"#bae6fd", c1:"#0ea5e9", c2:"#f59e0b", c3:"#0c4a6e"};
  function R(a, b) { return a + Math.random() * (b - a); }
  function RI(a, b) { return Math.floor(R(a, b + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ic(g, kind, x, y, s, c1, c2, c3) {
    if (!isFinite(x)) x = 0; if (!isFinite(y)) y = 0;
    if (!isFinite(s) || s <= 0) s = 10;
    c1 = c1 || P.c1; c2 = c2 || P.c2; c3 = c3 || P.c3;
    switch (kind) {
      case "earphone":
        g.strokeStyle=c1;g.lineWidth=6;g.beginPath();g.arc(x,y+s*0.1,s*0.4,Math.PI,0);g.stroke();
        g.fillStyle=c1;g.fillRect(x-s*0.46,y+s*0.05,s*0.12,s*0.26);g.fillRect(x+s*0.34,y+s*0.05,s*0.12,s*0.26);
        g.fillStyle=c2;g.beginPath();g.arc(x-s*0.4,y+s*0.18,s*0.06,0,7);g.fill();g.beginPath();g.arc(x+s*0.4,y+s*0.18,s*0.06,0,7);g.fill();
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
g.fillStyle=dk?"#2b3648":"#ddd6fe";
for(var i=0;i<5;i++){g.beginPath();g.arc(70+i*140,90,18,0,7);g.fill();}
g.fillStyle=dk?"#3b475c":"#c4b5fd";
for(var j=0;j<4;j++){g.beginPath();g.arc(140+j*140,150,12,0,7);g.fill();}
g.fillStyle=dk?"#3b475c":"#a78bfa";g.fillRect(0,300,W,70);
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


  var items = [], dragIdx = -1, gx = 0, gy = 0, matched = 0, flash = 0, flashTxt = "";
  var BYKIND = 0;
  var kinds = ["star", "ball", "heart", "moon"];
  var cols = ["#ef4444", "#38bdf8", "#a3e635", "#f59e0b"];
  var NP = 4;
  (function build() {
    var spots = [];
    for (var i = 0; i < NP * 2; i++) {
      spots.push({ x: 110 + (i % 4) * 165 + R(-25, 25), y: (i < 4 ? 170 : 290) + R(-12, 12) });
    }
    for (var k = 0; k < NP; k++) {
      for (var j = 0; j < 2; j++) {
        var s = spots[k * 2 + j];
        items.push({ kind: k, x: s.x, y: s.y, home: { x: s.x, y: s.y }, gone: false });
      }
    }
  })();
  function finishAll() {
    var sc = Math.round(matched / NP * 100);
    fin(sc, rows2("Pairs Found", sc, matched + " / " + NP, "Accuracy", sc, sc + "%"));
  }
  function down(p, now) {
    if (done) return; var q = san(p); if (!q) return;
    for (var i = 0; i < items.length; i++) {
      if (!items[i].gone && dist(q.x, q.y, items[i].x, items[i].y) < 45) {
        dragIdx = i; gx = q.x - items[i].x; gy = q.y - items[i].y; break;
      }
    }
  }
  function move(p, now) {
    if (done || dragIdx < 0) return; var q = san(p); if (!q) return;
    items[dragIdx].x = clamp(q.x - gx, 40, W - 40);
    items[dragIdx].y = clamp(q.y - gy, 110, H - 60);
  }
  function up(p, now) {
    if (done || dragIdx < 0) return;
    var a = items[dragIdx], hit = -1;
    for (var i = 0; i < items.length; i++) {
      if (i !== dragIdx && !items[i].gone && items[i].kind === a.kind && dist(a.x, a.y, items[i].x, items[i].y) < 70) { hit = i; break; }
    }
    if (hit >= 0) {
      a.gone = true; items[hit].gone = true; matched++;
      flash = 0.9; flashTxt = "A perfect pair!"; sndGood();
      if (matched >= NP) finishAll();
    } else {
      a.x = a.home.x; a.y = a.home.y;
      flash = 0.7; flashTxt = "Not a match!"; sndBad();
    }
    dragIdx = -1;
  }
  function draw(g, dt, now) {
    bg(g);
    var t = el(now);
    if (!done && t > 25) finishAll();
    var cx = W / 2;
    txt(g, "Match the pairs: " + matched + " / " + NP, cx, 52, 22, isDark() ? "#e8e8e8" : "#334155");
    dots(g, NP, matched, cx, 82);
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (it.gone) continue;
      if (i === dragIdx) {
        g.strokeStyle = "#38bdf8"; g.lineWidth = 3;
        g.beginPath(); g.arc(it.x, it.y, 40, 0, 7); g.stroke();
      }
      if (BYKIND === 1) ic(g, kinds[it.kind], it.x, it.y, 48, cols[it.kind], "#ffffff", cols[it.kind]);
      else ic(g, "earphone", it.x, it.y, 48, cols[it.kind], P.c2, P.c3);
    }
    if (flash > 0) { flash -= dt || 0.016; txt(g, flashTxt, cx, 128, 22, "#0ea5e9"); }
    txt(g, "Drag each item onto its matching twin.", cx, H - 46, 15, isDark() ? "#aab6c6" : "#64748b");
    bar(g, 24, H - 26, W - 48, 8, 1 - t / 25, "#38bdf8");
  }

  return {
    status: function () { return "Pairs: " + matched + " / " + NP + (done ? "  Done!" : ""); },
    down: down, move: move, up: up, draw: draw
  };

  }
});
