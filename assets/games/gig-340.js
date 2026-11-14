// GoofGig #340 — The Party Favors
// A tiny everyday gig: Hats here, noisemakers there, confetti everywhere.
registerGame({
  n: 340,
  title: "The Party Favors",
  desc: "Hats here, noisemakers there, confetti everywhere.",
  hint: "Drag each favor into the matching bag.",
  grades: [
    ["Party Planner Supreme", "Peak party energy. Nothing more to say."],
    ["Party Planner Extraordinaire", "A fine display of party mastery."],
    ["Casual Party Planner", "Middle of the pack, top of the morning."],
    ["Party Planner Hopeful", "Rough around the edges, but charming."],
    ["The Party Rookie", "The party requests a different player."]
  ],
  thumb: function (g) {
    g.fillStyle = "#ede9fe"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#ddd6fe"; g.fillRect(0, 74, 300, 18);
    g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(36, 22, 12, 0, 7); g.fill();
    g.beginPath(); g.arc(264, 26, 9, 0, 7); g.fill();
    var x = 52, y = 46, s = 34, c1 = "#f59e0b", c2 = "#4c1d95", c3 = "#8b5cf6";
    g.fillStyle=c1;g.beginPath();g.ellipse(x,y-s*0.08,s*0.36,s*0.44,0,0,7);g.fill();
    g.fillStyle="rgba(255,255,255,0.4)";g.beginPath();g.ellipse(x-s*0.14,y-s*0.26,s*0.09,s*0.14,-0.4,0,7);g.fill();
    g.fillStyle=c1;g.beginPath();g.moveTo(x-s*0.07,y+s*0.34);g.lineTo(x+s*0.07,y+s*0.34);g.lineTo(x,y+s*0.44);g.closePath();g.fill();
    g.strokeStyle="#94a3b8";g.lineWidth=2;g.beginPath();g.moveTo(x,y+s*0.44);g.quadraticCurveTo(x+s*0.1,y+s*0.6,x,y+s*0.72);g.stroke();
    x = 248; y = 46; s = 34; c1 = "#4c1d95"; c2 = "#8b5cf6"; c3 = "#f59e0b";
    g.fillStyle=c1;g.beginPath();g.ellipse(x,y-s*0.08,s*0.36,s*0.44,0,0,7);g.fill();
    g.fillStyle="rgba(255,255,255,0.4)";g.beginPath();g.ellipse(x-s*0.14,y-s*0.26,s*0.09,s*0.14,-0.4,0,7);g.fill();
    g.fillStyle=c1;g.beginPath();g.moveTo(x-s*0.07,y+s*0.34);g.lineTo(x+s*0.07,y+s*0.34);g.lineTo(x,y+s*0.44);g.closePath();g.fill();
    g.strokeStyle="#94a3b8";g.lineWidth=2;g.beginPath();g.moveTo(x,y+s*0.44);g.quadraticCurveTo(x+s*0.1,y+s*0.6,x,y+s*0.72);g.stroke();
    x = 150; y = 46; s = 58; c1 = "#8b5cf6"; c2 = "#f59e0b"; c3 = "#4c1d95";
    g.fillStyle=c1;g.beginPath();g.ellipse(x,y-s*0.08,s*0.36,s*0.44,0,0,7);g.fill();
    g.fillStyle="rgba(255,255,255,0.4)";g.beginPath();g.ellipse(x-s*0.14,y-s*0.26,s*0.09,s*0.14,-0.4,0,7);g.fill();
    g.fillStyle=c1;g.beginPath();g.moveTo(x-s*0.07,y+s*0.34);g.lineTo(x+s*0.07,y+s*0.34);g.lineTo(x,y+s*0.44);g.closePath();g.fill();
    g.strokeStyle="#94a3b8";g.lineWidth=2;g.beginPath();g.moveTo(x,y+s*0.44);g.quadraticCurveTo(x+s*0.1,y+s*0.6,x,y+s*0.72);g.stroke();
  },
  create: function (api) {

  var P = {sky:"#ede9fe", gnd:"#ddd6fe", c1:"#8b5cf6", c2:"#f59e0b", c3:"#4c1d95"};
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
var fc=["#ef4444","#f59e0b","#22c55e","#38bdf8","#c084fc"];
for(var i=0;i<10;i++){g.fillStyle=fc[i%5];g.beginPath();g.moveTo(30+i*72,60);g.lineTo(66+i*72,60);g.lineTo(48+i*72,92);g.closePath();g.fill();}
g.strokeStyle=dk?"#3b475c":"#94a3b8";g.lineWidth=3;g.beginPath();g.moveTo(0,58);g.lineTo(W,58);g.stroke();
g.fillStyle="#fbbf24";g.beginPath();g.arc(360,150,10,0,7);g.fill();
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
  var round = 0, correct = 0, scores = [], flash = 0, flashTxt = "", msg = "";
  var ix = 0, iy = 0, grab = false, gx = 0, gy = 0;
  var kinds = ["a", "b", "c"], cols = ["#ef4444", "#38bdf8", "#a3e635"];
  var cur = 0, BYSHAPE = 0;
  var shapes = ["star", "ball", "heart"];
  function newRound() {
    cur = RI(0, 2);
    ix = W / 2 + R(-80, 80); iy = 170;
    msg = "Item " + (round + 1) + " of " + RND + "  —  drag it to the matching bin";
  }
  newRound();
  function bins() {
    var out = [];
    for (var i = 0; i < 3; i++) out.push({ x: 160 + i * 200, y: 320, w: 140, h: 70 });
    return out;
  }
  function finishAll() {
    var sc = Math.round(correct / RND * 100);
    fin(sc, rows2("Sorted Right", sc, correct + " / " + RND, "Accuracy", sc, sc + "%"));
  }
  function down(p, now) {
    if (done) return; var q = san(p); if (!q) return;
    if (dist(q.x, q.y, ix, iy) < 55) { grab = true; gx = q.x - ix; gy = q.y - iy; }
  }
  function move(p, now) {
    if (done || !grab) return; var q = san(p); if (!q) return;
    ix = clamp(q.x - gx, 40, W - 40); iy = clamp(q.y - gy, 100, H - 60);
  }
  function up(p, now) {
    if (done || !grab) return; grab = false;
    var bs = bins(), hit = -1;
    for (var i = 0; i < bs.length; i++) {
      if (ix > bs[i].x - bs[i].w / 2 && ix < bs[i].x + bs[i].w / 2 && iy > bs[i].y - bs[i].h / 2 && iy < bs[i].y + bs[i].h / 2) hit = i;
    }
    if (hit === cur) { correct++; flashTxt = "Correct bin!"; sndGood(); }
    else { flashTxt = hit < 0 ? "Missed the bins!" : "Wrong bin!"; sndBad(); }
    flash = 0.9;
    round++;
    if (round >= RND) finishAll(); else newRound();
  }
  function draw(g, dt, now) {
    bg(g);
    var t = el(now);
    if (!done && t > 25) finishAll();
    var cx = W / 2;
    txt(g, msg, cx, 52, 22, isDark() ? "#e8e8e8" : "#334155");
    dots(g, RND, round, cx, 82);
    // bins
    var bs = bins();
    for (var i = 0; i < 3; i++) {
      g.fillStyle = isDark() ? "#2f3a4d" : "#ffffff";
      rr(g, bs[i].x - bs[i].w / 2, bs[i].y - bs[i].h / 2, bs[i].w, bs[i].h, 14); g.fill();
      g.strokeStyle = cols[i]; g.lineWidth = 4;
      rr(g, bs[i].x - bs[i].w / 2, bs[i].y - bs[i].h / 2, bs[i].w, bs[i].h, 14); g.stroke();
      if (BYSHAPE === 1) ic(g, shapes[i], bs[i].x, bs[i].y, 34, cols[i], "#ffffff", cols[i]);
      else { g.fillStyle = cols[i]; g.beginPath(); g.arc(bs[i].x, bs[i].y, 16, 0, 7); g.fill(); }
    }
    // current item
    g.fillStyle = "rgba(0,0,0,0.12)";
    g.beginPath(); g.ellipse(ix, iy + 32, 32, 8, 0, 0, 7); g.fill();
    if (grab) { g.strokeStyle = "#38bdf8"; g.lineWidth = 3; g.beginPath(); g.arc(ix, iy, 42, 0, 7); g.stroke(); }
    if (BYSHAPE === 1) ic(g, shapes[cur], ix, iy, 52, cols[cur], "#ffffff", cols[cur]);
    else ic(g, "balloon", ix, iy, 52, cols[cur], P.c2, P.c3);
    txt(g, "Correct: " + correct + " / " + RND, cx, 128, 18, isDark() ? "#aab6c6" : "#64748b");
    if (flash > 0) { flash -= dt || 0.016; txt(g, flashTxt, cx, 152, 22, "#0ea5e9"); }
    txt(g, "Drag each item into the bin that matches it.", cx, H - 46, 15, isDark() ? "#aab6c6" : "#64748b");
    bar(g, 24, H - 26, W - 48, 8, 1 - t / 25, "#38bdf8");
  }

  return {
    status: function () { return msg + (done ? "  Done!" : ""); },
    down: down, move: move, up: up, draw: draw
  };

  }
});
