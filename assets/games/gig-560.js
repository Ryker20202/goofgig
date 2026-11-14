// GoofGig #560 — How Many Apples?
// A tiny everyday gig: Count them fast, before the tree drops more.
registerGame({
  n: 560,
  title: "How Many Apples?",
  desc: "Count them fast, before the tree drops more.",
  hint: "Count the apples, then tap the right number.",
  grades: [
    ["Master of the Apple", "The apple has officially met its master."],
    ["Seasoned Apple Counter", "Sharp work. The apple barely kept up."],
    ["Casual Apple Counter", "You handled the apple like a pro. Almost."],
    ["Rookie Apple Counter", "A valiant effort. The apple is unimpressed."],
    ["Dangerous Apple Counter", "Chaos, but make it funny."]
  ],
  thumb: function (g) {
    g.fillStyle = "#fef9c3"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#86efac"; g.fillRect(0, 74, 300, 18);
    g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(36, 22, 12, 0, 7); g.fill();
    g.beginPath(); g.arc(264, 26, 9, 0, 7); g.fill();
    var x = 52, y = 46, s = 34, c1 = "#38bdf8", c2 = "#365314", c3 = "#84cc16";
    g.fillStyle=c1;g.beginPath();g.arc(x-s*0.14,y+s*0.05,s*0.32,0,7);g.arc(x+s*0.14,y+s*0.05,s*0.32,0,7);g.fill();
    g.fillStyle="#4caf50";g.beginPath();g.ellipse(x+s*0.16,y-s*0.34,s*0.16,s*0.08,0.5,0,7);g.fill();
    g.strokeStyle="#8d6e63";g.lineWidth=4;g.beginPath();g.moveTo(x,y-s*0.22);g.quadraticCurveTo(x,y-s*0.45,x+s*0.08,y-s*0.42);g.stroke();
    x = 248; y = 46; s = 34; c1 = "#365314"; c2 = "#84cc16"; c3 = "#38bdf8";
    g.fillStyle=c1;g.beginPath();g.arc(x-s*0.14,y+s*0.05,s*0.32,0,7);g.arc(x+s*0.14,y+s*0.05,s*0.32,0,7);g.fill();
    g.fillStyle="#4caf50";g.beginPath();g.ellipse(x+s*0.16,y-s*0.34,s*0.16,s*0.08,0.5,0,7);g.fill();
    g.strokeStyle="#8d6e63";g.lineWidth=4;g.beginPath();g.moveTo(x,y-s*0.22);g.quadraticCurveTo(x,y-s*0.45,x+s*0.08,y-s*0.42);g.stroke();
    x = 150; y = 46; s = 58; c1 = "#84cc16"; c2 = "#38bdf8"; c3 = "#365314";
    g.fillStyle=c1;g.beginPath();g.arc(x-s*0.14,y+s*0.05,s*0.32,0,7);g.arc(x+s*0.14,y+s*0.05,s*0.32,0,7);g.fill();
    g.fillStyle="#4caf50";g.beginPath();g.ellipse(x+s*0.16,y-s*0.34,s*0.16,s*0.08,0.5,0,7);g.fill();
    g.strokeStyle="#8d6e63";g.lineWidth=4;g.beginPath();g.moveTo(x,y-s*0.22);g.quadraticCurveTo(x,y-s*0.45,x+s*0.08,y-s*0.42);g.stroke();
  },
  create: function (api) {

  var P = {sky:"#fef9c3", gnd:"#86efac", c1:"#84cc16", c2:"#38bdf8", c3:"#365314"};
  function R(a, b) { return a + Math.random() * (b - a); }
  function RI(a, b) { return Math.floor(R(a, b + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ic(g, kind, x, y, s, c1, c2, c3) {
    if (!isFinite(x)) x = 0; if (!isFinite(y)) y = 0;
    if (!isFinite(s) || s <= 0) s = 10;
    c1 = c1 || P.c1; c2 = c2 || P.c2; c3 = c3 || P.c3;
    switch (kind) {
      case "apple":
        g.fillStyle=c1;g.beginPath();g.arc(x-s*0.14,y+s*0.05,s*0.32,0,7);g.arc(x+s*0.14,y+s*0.05,s*0.32,0,7);g.fill();
        g.fillStyle="#4caf50";g.beginPath();g.ellipse(x+s*0.16,y-s*0.34,s*0.16,s*0.08,0.5,0,7);g.fill();
        g.strokeStyle="#8d6e63";g.lineWidth=4;g.beginPath();g.moveTo(x,y-s*0.22);g.quadraticCurveTo(x,y-s*0.45,x+s*0.08,y-s*0.42);g.stroke();
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


  var ROUNDS = 3, round = 0, scores = [], flash = 0, flashTxt = "", msg = "";
  var items = [], count = 0, phase = "show", showT = 0, GRID = 0, cur = 0;
  function newRound() {
    count = RI(3, 9);
    items = [];
    for (var i = 0; i < count; i++) {
      if (GRID === 1) items.push({ x: 200 + (i % 3) * 160, y: 175 + Math.floor(i / 3) * 95 });
      else items.push({ x: R(150, W - 150), y: R(150, 310) });
    }
    phase = "show"; showT = cur + 2.6;
    msg = "Round " + (round + 1) + " of " + ROUNDS + "  —  how many do you see?";
  }
  newRound();
  function finishAll() {
    var avg = 0, best = 0;
    for (var i = 0; i < scores.length; i++) { avg += scores[i]; if (scores[i] > best) best = scores[i]; }
    avg = scores.length ? avg / scores.length : 0;
    fin(avg, rows2("Best Count", best, best + "%", "Average", avg, Math.round(avg) + "%"));
  }
  function endRound(guess) {
    var sc = guess === count ? 100 : clamp(100 - Math.abs(guess - count) * 30, 0, 100);
    scores.push(sc); flash = 0.9;
    flashTxt = guess === count ? "Exactly right!" : ("It was " + count + "!");
    if (guess === count) sndGood(); else sndBad();
    round++;
    if (round >= ROUNDS) finishAll(); else newRound();
  }
  function numBtn(n) {
    return { x: 130 + (n - 1) * 52, y: 330 };
  }
  function down(p, now) {
    if (done || phase !== "ask") return; var q = san(p); if (!q) return;
    for (var n = 1; n <= 10; n++) {
      var b = numBtn(n);
      if (dist(q.x, q.y, b.x, b.y) < 26) { endRound(n); break; }
    }
  }
  function move(p, now) {}
  function up(p, now) {}
  function draw(g, dt, now) {
    bg(g);
    var t = el(now); cur = t;
    if (!done && t > 25) finishAll();
    if (!done && phase === "show" && t >= showT) { phase = "ask"; msg = "How many were there? Tap the number."; }
    var cx = W / 2;
    txt(g, msg, cx, 52, 22, isDark() ? "#e8e8e8" : "#334155");
    dots(g, ROUNDS, round, cx, 82);
    if (phase === "show") {
      for (var i = 0; i < items.length; i++) {
        ic(g, "apple", items[i].x, items[i].y, 52, P.c1, P.c2, P.c3);
      }
      bar(g, cx - 120, 112, 240, 8, clamp((showT - t) / 2.6, 0, 1), "#38bdf8");
    } else {
      txt(g, "?", cx, 225, 72, isDark() ? "#e8e8e8" : "#334155", "center", "bold");
      for (var n = 1; n <= 10; n++) {
        var b = numBtn(n);
        g.fillStyle = isDark() ? "#2f3a4d" : "#ffffff";
        g.beginPath(); g.arc(b.x, b.y, 22, 0, 7); g.fill();
        g.strokeStyle = "#38bdf8"; g.lineWidth = 2;
        g.beginPath(); g.arc(b.x, b.y, 22, 0, 7); g.stroke();
        txt(g, "" + n, b.x, b.y + 1, 18, isDark() ? "#e8e8e8" : "#334155");
      }
    }
    if (flash > 0) { flash -= dt || 0.016; txt(g, flashTxt, cx, 140, 22, "#0ea5e9"); }
    txt(g, "Count the items, then tap the right number.", cx, H - 46, 15, isDark() ? "#aab6c6" : "#64748b");
    bar(g, 24, H - 26, W - 48, 8, 1 - t / 25, "#38bdf8");
  }

  return {
    status: function () { return msg + (done ? "  Done!" : ""); },
    down: down, move: move, up: up, draw: draw
  };

  }
});
