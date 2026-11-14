// GoofGig #402 — The Playlist Order
// A tiny everyday gig: Slow songs first, loud songs last, skip the sad one.
registerGame({
  n: 402,
  title: "The Playlist Order",
  desc: "Slow songs first, loud songs last, skip the sad one.",
  hint: "Drag the songs into the right order.",
  grades: [
    ["Certified Playlist DJ Pro", "Gold stars all round. The music agrees."],
    ["The Music Ace", "A fine display of music mastery."],
    ["Capable Playlist DJ", "Not bad at all. The music nods slowly."],
    ["Learning Playlist DJ", "Halfway there. The music believes in you."],
    ["The Music Menace", "The music has seen things now. Terrible things."]
  ],
  thumb: function (g) {
    g.fillStyle = "#ede9fe"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#ddd6fe"; g.fillRect(0, 74, 300, 18);
    g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(36, 22, 12, 0, 7); g.fill();
    g.beginPath(); g.arc(264, 26, 9, 0, 7); g.fill();
    var x = 52, y = 46, s = 34, c1 = "#38bdf8", c2 = "#4c1d95", c3 = "#8b5cf6";
    g.fillStyle=c1;g.beginPath();g.ellipse(x-s*0.14,y+s*0.3,s*0.16,s*0.11,-0.4,0,7);g.fill();
    g.beginPath();g.ellipse(x+s*0.3,y+s*0.22,s*0.16,s*0.11,-0.4,0,7);g.fill();
    g.fillRect(x-s*0.02,y-s*0.4,s*0.08,s*0.68);g.fillRect(x+s*0.42,y-s*0.32,s*0.08,s*0.52);
    g.beginPath();g.moveTo(x-s*0.02,y-s*0.4);g.lineTo(x+s*0.5,y-s*0.32);g.lineTo(x+s*0.5,y-s*0.2);g.lineTo(x-s*0.02,y-s*0.28);g.closePath();g.fill();
    x = 248; y = 46; s = 34; c1 = "#4c1d95"; c2 = "#8b5cf6"; c3 = "#38bdf8";
    g.fillStyle=c1;g.beginPath();g.ellipse(x-s*0.14,y+s*0.3,s*0.16,s*0.11,-0.4,0,7);g.fill();
    g.beginPath();g.ellipse(x+s*0.3,y+s*0.22,s*0.16,s*0.11,-0.4,0,7);g.fill();
    g.fillRect(x-s*0.02,y-s*0.4,s*0.08,s*0.68);g.fillRect(x+s*0.42,y-s*0.32,s*0.08,s*0.52);
    g.beginPath();g.moveTo(x-s*0.02,y-s*0.4);g.lineTo(x+s*0.5,y-s*0.32);g.lineTo(x+s*0.5,y-s*0.2);g.lineTo(x-s*0.02,y-s*0.28);g.closePath();g.fill();
    x = 150; y = 46; s = 58; c1 = "#8b5cf6"; c2 = "#38bdf8"; c3 = "#4c1d95";
    g.fillStyle=c1;g.beginPath();g.ellipse(x-s*0.14,y+s*0.3,s*0.16,s*0.11,-0.4,0,7);g.fill();
    g.beginPath();g.ellipse(x+s*0.3,y+s*0.22,s*0.16,s*0.11,-0.4,0,7);g.fill();
    g.fillRect(x-s*0.02,y-s*0.4,s*0.08,s*0.68);g.fillRect(x+s*0.42,y-s*0.32,s*0.08,s*0.52);
    g.beginPath();g.moveTo(x-s*0.02,y-s*0.4);g.lineTo(x+s*0.5,y-s*0.32);g.lineTo(x+s*0.5,y-s*0.2);g.lineTo(x-s*0.02,y-s*0.28);g.closePath();g.fill();
  },
  create: function (api) {

  var P = {sky:"#ede9fe", gnd:"#ddd6fe", c1:"#8b5cf6", c2:"#38bdf8", c3:"#4c1d95"};
  function R(a, b) { return a + Math.random() * (b - a); }
  function RI(a, b) { return Math.floor(R(a, b + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ic(g, kind, x, y, s, c1, c2, c3) {
    if (!isFinite(x)) x = 0; if (!isFinite(y)) y = 0;
    if (!isFinite(s) || s <= 0) s = 10;
    c1 = c1 || P.c1; c2 = c2 || P.c2; c3 = c3 || P.c3;
    switch (kind) {
      case "music":
        g.fillStyle=c1;g.beginPath();g.ellipse(x-s*0.14,y+s*0.3,s*0.16,s*0.11,-0.4,0,7);g.fill();
        g.beginPath();g.ellipse(x+s*0.3,y+s*0.22,s*0.16,s*0.11,-0.4,0,7);g.fill();
        g.fillRect(x-s*0.02,y-s*0.4,s*0.08,s*0.68);g.fillRect(x+s*0.42,y-s*0.32,s*0.08,s*0.52);
        g.beginPath();g.moveTo(x-s*0.02,y-s*0.4);g.lineTo(x+s*0.5,y-s*0.32);g.lineTo(x+s*0.5,y-s*0.2);g.lineTo(x-s*0.02,y-s*0.28);g.closePath();g.fill();
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


  var items = [], dragIdx = -1, gx = 0, gy = 0, flash = 0, flashTxt = "";
  var BYNUM = 1;
  var N = 5;
  var order = [0, 1, 2, 3, 4];
  (function shuffle() {
    for (var i = order.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = order[i]; order[i] = order[j]; order[j] = tmp;
    }
  })();
  (function build() {
    for (var i = 0; i < N; i++) {
      items.push({
        rank: order[i], x: 110 + i * 125 + R(-15, 15), y: 175 + R(-10, 10),
        home: { x: 110 + i * 125, y: 175 }, slot: -1
      });
    }
  })();
  function slots() {
    var out = [];
    for (var i = 0; i < N; i++) out.push({ x: 110 + i * 125, y: 310 });
    return out;
  }
  function finishAll() {
    var good = 0, placed = 0;
    for (var i = 0; i < items.length; i++) {
      if (items[i].slot >= 0) { placed++; if (items[i].slot === items[i].rank) good++; }
    }
    var sc = Math.round(good / N * 100);
    fin(sc, rows2("Right Order", sc, good + " / " + N, "Placed", Math.round(placed / N * 100), placed + " / " + N));
  }
  function down(p, now) {
    if (done) return; var q = san(p); if (!q) return;
    for (var i = 0; i < items.length; i++) {
      if (dist(q.x, q.y, items[i].x, items[i].y) < 48) {
        dragIdx = i; gx = q.x - items[i].x; gy = q.y - items[i].y;
        items[i].slot = -1; break;
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
    var a = items[dragIdx], ss = slots(), best = -1, bd = 70;
    for (var i = 0; i < ss.length; i++) {
      var d = dist(a.x, a.y, ss[i].x, ss[i].y);
      var taken = false;
      for (var j = 0; j < items.length; j++) if (j !== dragIdx && items[j].slot === i) taken = true;
      if (!taken && d < bd) { bd = d; best = i; }
    }
    if (best >= 0) {
      a.slot = best; a.x = ss[best].x; a.y = ss[best].y;
      flash = 0.6; flashTxt = "Placed!"; blip(660, 0.08, "sine", 0.15);
    } else { a.x = a.home.x; a.y = a.home.y; }
    dragIdx = -1;
    var placed = 0;
    for (var k = 0; k < items.length; k++) if (items[k].slot >= 0) placed++;
    if (placed >= N) finishAll();
  }
  function draw(g, dt, now) {
    bg(g);
    var t = el(now);
    if (!done && t > 25) finishAll();
    var cx = W / 2;
    txt(g, BYNUM === 1 ? "Put them in number order, 1 to 5" : "Put them in size order, small to big", cx, 52, 22, isDark() ? "#e8e8e8" : "#334155");
    var ss = slots();
    for (var i = 0; i < ss.length; i++) {
      g.fillStyle = "rgba(245,158,11,0.15)";
      rr(g, ss[i].x - 52, ss[i].y - 42, 104, 84, 12); g.fill();
      g.strokeStyle = "#f59e0b"; g.lineWidth = 3; g.setLineDash([8, 6]);
      rr(g, ss[i].x - 52, ss[i].y - 42, 104, 84, 12); g.stroke();
      g.setLineDash([]);
      txt(g, "" + (i + 1), ss[i].x, ss[i].y + 62, 15, "#f59e0b");
    }
    for (var j = 0; j < items.length; j++) {
      var it = items[j];
      if (j === dragIdx) {
        g.strokeStyle = "#38bdf8"; g.lineWidth = 3;
        g.beginPath(); g.arc(it.x, it.y, 42, 0, 7); g.stroke();
      }
      var sz = BYNUM === 1 ? 46 : 26 + it.rank * 9;
      ic(g, "music", it.x, it.y, sz, P.c1, P.c2, P.c3);
      if (BYNUM === 1) txt(g, "" + (it.rank + 1), it.x, it.y + 4, 20, "#ffffff", "center", "bold");
    }
    if (flash > 0) { flash -= dt || 0.016; txt(g, flashTxt, cx, 128, 22, "#0ea5e9"); }
    txt(g, "Drag each item into a slot in the right order.", cx, H - 46, 15, isDark() ? "#aab6c6" : "#64748b");
    bar(g, 24, H - 26, W - 48, 8, 1 - t / 25, "#38bdf8");
  }

  return {
    status: function () { return "Place all five in order" + (done ? "  Done!" : ""); },
    down: down, move: move, up: up, draw: draw
  };

  }
});
