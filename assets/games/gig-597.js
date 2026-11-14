// GoofGig #597 — The Wrong Shoe
// A tiny everyday gig: One shoe wandered onto the wrong foot.
registerGame({
  n: 597,
  title: "The Wrong Shoe",
  desc: "One shoe wandered onto the wrong foot.",
  hint: "Tap the shoe that does not belong.",
  grades: [
    ["Legendary Shoe Checker", "Textbook perfect. Frame this run."],
    ["Solid Shoe Checker", "A fine display of shoe mastery."],
    ["Journeyman Shoe Checker", "Middle of the pack, top of the morning."],
    ["Learning Shoe Checker", "The shoe survived. That counts for something."],
    ["Chaos Shoe Checker", "The shoe is still recovering. So are we."]
  ],
  thumb: function (g) {
    g.fillStyle = "#dcfce7"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#86efac"; g.fillRect(0, 74, 300, 18);
    g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(36, 22, 12, 0, 7); g.fill();
    g.beginPath(); g.arc(264, 26, 9, 0, 7); g.fill();
    var x = 52, y = 46, s = 34, c1 = "#ef4444", c2 = "#14532d", c3 = "#22c55e";
    g.fillStyle=c1;g.beginPath();g.moveTo(x-s*0.48,y+s*0.1);g.quadraticCurveTo(x-s*0.5,y-s*0.3,x-s*0.18,y-s*0.3);g.lineTo(x-s*0.1,y-s*0.05);g.quadraticCurveTo(x+s*0.1,y-s*0.12,x+s*0.34,y-s*0.02);g.quadraticCurveTo(x+s*0.52,y+s*0.02,x+s*0.48,y+s*0.18);g.closePath();g.fill();
    g.fillStyle=c2;g.fillRect(x-s*0.5,y+s*0.16,s*1.0,s*0.12);
    g.strokeStyle="#fff";g.lineWidth=3;g.beginPath();g.moveTo(x-s*0.02,y-s*0.08);g.lineTo(x+s*0.12,y-s*0.02);g.stroke();
    x = 248; y = 46; s = 34; c1 = "#14532d"; c2 = "#22c55e"; c3 = "#ef4444";
    g.fillStyle=c1;g.beginPath();g.moveTo(x-s*0.48,y+s*0.1);g.quadraticCurveTo(x-s*0.5,y-s*0.3,x-s*0.18,y-s*0.3);g.lineTo(x-s*0.1,y-s*0.05);g.quadraticCurveTo(x+s*0.1,y-s*0.12,x+s*0.34,y-s*0.02);g.quadraticCurveTo(x+s*0.52,y+s*0.02,x+s*0.48,y+s*0.18);g.closePath();g.fill();
    g.fillStyle=c2;g.fillRect(x-s*0.5,y+s*0.16,s*1.0,s*0.12);
    g.strokeStyle="#fff";g.lineWidth=3;g.beginPath();g.moveTo(x-s*0.02,y-s*0.08);g.lineTo(x+s*0.12,y-s*0.02);g.stroke();
    x = 150; y = 46; s = 58; c1 = "#22c55e"; c2 = "#ef4444"; c3 = "#14532d";
    g.fillStyle=c1;g.beginPath();g.moveTo(x-s*0.48,y+s*0.1);g.quadraticCurveTo(x-s*0.5,y-s*0.3,x-s*0.18,y-s*0.3);g.lineTo(x-s*0.1,y-s*0.05);g.quadraticCurveTo(x+s*0.1,y-s*0.12,x+s*0.34,y-s*0.02);g.quadraticCurveTo(x+s*0.52,y+s*0.02,x+s*0.48,y+s*0.18);g.closePath();g.fill();
    g.fillStyle=c2;g.fillRect(x-s*0.5,y+s*0.16,s*1.0,s*0.12);
    g.strokeStyle="#fff";g.lineWidth=3;g.beginPath();g.moveTo(x-s*0.02,y-s*0.08);g.lineTo(x+s*0.12,y-s*0.02);g.stroke();
  },
  create: function (api) {

  var P = {sky:"#dcfce7", gnd:"#86efac", c1:"#22c55e", c2:"#ef4444", c3:"#14532d"};
  function R(a, b) { return a + Math.random() * (b - a); }
  function RI(a, b) { return Math.floor(R(a, b + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ic(g, kind, x, y, s, c1, c2, c3) {
    if (!isFinite(x)) x = 0; if (!isFinite(y)) y = 0;
    if (!isFinite(s) || s <= 0) s = 10;
    c1 = c1 || P.c1; c2 = c2 || P.c2; c3 = c3 || P.c3;
    switch (kind) {
      case "shoe":
        g.fillStyle=c1;g.beginPath();g.moveTo(x-s*0.48,y+s*0.1);g.quadraticCurveTo(x-s*0.5,y-s*0.3,x-s*0.18,y-s*0.3);g.lineTo(x-s*0.1,y-s*0.05);g.quadraticCurveTo(x+s*0.1,y-s*0.12,x+s*0.34,y-s*0.02);g.quadraticCurveTo(x+s*0.52,y+s*0.02,x+s*0.48,y+s*0.18);g.closePath();g.fill();
        g.fillStyle=c2;g.fillRect(x-s*0.5,y+s*0.16,s*1.0,s*0.12);
        g.strokeStyle="#fff";g.lineWidth=3;g.beginPath();g.moveTo(x-s*0.02,y-s*0.08);g.lineTo(x+s*0.12,y-s*0.02);g.stroke();
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
      case "cat":
        g.fillStyle=c1;g.beginPath();g.arc(x,y,s*0.42,0,7);g.fill();
        g.beginPath();g.moveTo(x-s*0.36,y-s*0.28);g.lineTo(x-s*0.3,y-s*0.55);g.lineTo(x-s*0.08,y-s*0.38);g.closePath();g.fill();
        g.beginPath();g.moveTo(x+s*0.36,y-s*0.28);g.lineTo(x+s*0.3,y-s*0.55);g.lineTo(x+s*0.08,y-s*0.38);g.closePath();g.fill();
        g.fillStyle="#222";g.beginPath();g.arc(x-s*0.16,y-s*0.05,s*0.05,0,7);g.fill();g.beginPath();g.arc(x+s*0.16,y-s*0.05,s*0.05,0,7);g.fill();
        g.strokeStyle="#222";g.lineWidth=2;g.beginPath();g.moveTo(x-s*0.06,y+s*0.14);g.quadraticCurveTo(x,y+s*0.22,x+s*0.06,y+s*0.14);g.stroke();
        g.strokeStyle="rgba(0,0,0,0.35)";g.lineWidth=1.5;
        g.beginPath();g.moveTo(x-s*0.4,y+s*0.08);g.lineTo(x-s*0.62,y+s*0.02);g.stroke();
        g.beginPath();g.moveTo(x+s*0.4,y+s*0.08);g.lineTo(x+s*0.62,y+s*0.02);g.stroke();
        break;
      case "dog":
        g.fillStyle=c1;g.beginPath();g.arc(x,y,s*0.42,0,7);g.fill();
        g.fillStyle=c2;g.beginPath();g.ellipse(x-s*0.4,y-s*0.02,s*0.14,s*0.28,0.3,0,7);g.fill();
        g.beginPath();g.ellipse(x+s*0.4,y-s*0.02,s*0.14,s*0.28,-0.3,0,7);g.fill();
        g.fillStyle="#222";g.beginPath();g.arc(x-s*0.16,y-s*0.08,s*0.05,0,7);g.fill();g.beginPath();g.arc(x+s*0.16,y-s*0.08,s*0.05,0,7);g.fill();
        g.fillStyle="#222";g.beginPath();g.ellipse(x,y+s*0.12,s*0.1,s*0.07,0,0,7);g.fill();
        g.strokeStyle="#222";g.lineWidth=2;g.beginPath();g.moveTo(x,y+s*0.2);g.quadraticCurveTo(x,y+s*0.3,x+s*0.1,y+s*0.28);g.stroke();
        break;
      case "bird":
        g.fillStyle=c1;g.beginPath();g.ellipse(x,y,s*0.42,s*0.32,0,0,7);g.fill();
        g.beginPath();g.arc(x+s*0.3,y-s*0.24,s*0.22,0,7);g.fill();
        g.fillStyle=c2;g.beginPath();g.ellipse(x-s*0.1,y-s*0.02,s*0.3,s*0.14,-0.3,0,7);g.fill();
        g.fillStyle="#f59e0b";g.beginPath();g.moveTo(x+s*0.48,y-s*0.26);g.lineTo(x+s*0.66,y-s*0.2);g.lineTo(x+s*0.48,y-s*0.14);g.closePath();g.fill();
        g.fillStyle="#222";g.beginPath();g.arc(x+s*0.34,y-s*0.3,s*0.045,0,7);g.fill();
        break;
      case "fish":
        g.fillStyle=c1;g.beginPath();g.ellipse(x,y,s*0.4,s*0.26,0,0,7);g.fill();
        g.beginPath();g.moveTo(x-s*0.36,y);g.lineTo(x-s*0.6,y-s*0.22);g.lineTo(x-s*0.6,y+s*0.22);g.closePath();g.fill();
        g.fillStyle=c2;g.beginPath();g.moveTo(x-s*0.05,y-s*0.24);g.quadraticCurveTo(x+s*0.15,y-s*0.45,x+s*0.3,y-s*0.2);g.closePath();g.fill();
        g.fillStyle="#222";g.beginPath();g.arc(x+s*0.26,y-s*0.06,s*0.045,0,7);g.fill();
        break;
      case "apple":
        g.fillStyle=c1;g.beginPath();g.arc(x-s*0.14,y+s*0.05,s*0.32,0,7);g.arc(x+s*0.14,y+s*0.05,s*0.32,0,7);g.fill();
        g.fillStyle="#4caf50";g.beginPath();g.ellipse(x+s*0.16,y-s*0.34,s*0.16,s*0.08,0.5,0,7);g.fill();
        g.strokeStyle="#8d6e63";g.lineWidth=4;g.beginPath();g.moveTo(x,y-s*0.22);g.quadraticCurveTo(x,y-s*0.45,x+s*0.08,y-s*0.42);g.stroke();
        break;
      case "grape":
        g.fillStyle=c1;
        var gp=[[-0.18,-0.3],[0.16,-0.3],[0,-0.12],[-0.24,0.08],[0.22,0.08],[-0.12,0.28],[0.12,0.28],[0,0.44]];
        for(var i=0;i<gp.length;i++){g.beginPath();g.arc(x+gp[i][0]*s,y+gp[i][1]*s,s*0.14,0,7);g.fill();}
        g.fillStyle="#4caf50";g.beginPath();g.ellipse(x+s*0.1,y-s*0.44,s*0.14,s*0.07,0.5,0,7);g.fill();
        break;
      case "leaf":
        g.fillStyle=c1;g.beginPath();
        g.moveTo(x,y-s*0.5);g.quadraticCurveTo(x+s*0.5,y-s*0.1,x,y+s*0.5);g.quadraticCurveTo(x-s*0.5,y-s*0.1,x,y-s*0.5);g.fill();
        g.strokeStyle=c2;g.lineWidth=3;g.beginPath();g.moveTo(x,y-s*0.42);g.lineTo(x,y+s*0.42);g.stroke();
        break;
      case "book":
        g.fillStyle=c1;g.fillRect(x-s*0.34,y-s*0.42,s*0.68,s*0.84);
        g.fillStyle=c2;g.fillRect(x-s*0.06,y-s*0.42,s*0.12,s*0.84);
        g.fillStyle="#fff";g.fillRect(x+s*0.08,y-s*0.3,s*0.2,s*0.05);g.fillRect(x+s*0.08,y-s*0.18,s*0.2,s*0.05);g.fillRect(x+s*0.08,y-s*0.06,s*0.2,s*0.05);
        g.fillStyle="#fff";g.fillRect(x-s*0.28,y+s*0.28,s*0.56,s*0.06);
        break;
      case "pencil":
        g.fillStyle=c1;g.beginPath();g.moveTo(x-s*0.45,y+s*0.15);g.lineTo(x+s*0.3,y+s*0.15);g.lineTo(x+s*0.52,y);g.lineTo(x+s*0.3,y-s*0.15);g.lineTo(x-s*0.45,y-s*0.15);g.closePath();g.fill();
        g.fillStyle="#fde68a";g.beginPath();g.moveTo(x+s*0.3,y+s*0.15);g.lineTo(x+s*0.52,y);g.lineTo(x+s*0.3,y-s*0.15);g.closePath();g.fill();
        g.fillStyle="#222";g.beginPath();g.moveTo(x+s*0.42,y+s*0.05);g.lineTo(x+s*0.52,y);g.lineTo(x+s*0.42,y-s*0.05);g.closePath();g.fill();
        g.fillStyle=c2;g.fillRect(x-s*0.45,y-s*0.15,s*0.1,s*0.3);
        break;
      case "key":
        g.strokeStyle=c1;g.lineWidth=6;g.beginPath();g.arc(x-s*0.26,y,s*0.2,0,7);g.stroke();
        g.beginPath();g.moveTo(x-s*0.08,y);g.lineTo(x+s*0.5,y);g.stroke();
        g.beginPath();g.moveTo(x+s*0.32,y);g.lineTo(x+s*0.32,y+s*0.18);g.stroke();
        g.beginPath();g.moveTo(x+s*0.48,y);g.lineTo(x+s*0.48,y+s*0.14);g.stroke();
        break;
      default:
        g.fillStyle = c1; g.beginPath(); g.arc(x, y, s * 0.5, 0, 7); g.fill();
        g.fillStyle = c2; g.beginPath(); g.arc(x - s * 0.15, y - s * 0.15, s * 0.18, 0, 7); g.fill();
    }
  }
  function bg(g) {
    var dk = isDark();
    g.fillStyle = dk ? "#232c3d" : P.sky; g.fillRect(0, 0, W, H);
g.fillStyle=dk?"#2b3648":"#dcfce7";
g.beginPath();g.arc(90,90,40,0,7);g.fill();
g.fillStyle="#4caf50";g.fillRect(0,300,W,70);
g.fillStyle="#fff";g.fillRect(60,320,80,8);g.fillRect(300,320,80,8);g.fillRect(540,320,80,8);
g.fillStyle="#f59e0b";g.beginPath();g.arc(W-80,80,22,0,7);g.fill();
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


  var ROUNDS = 4, round = 0, scores = [], flash = 0, flashTxt = "", msg = "", cur = 0, r0 = 0;
  var odd = 0, BYCOLOR = 1;
  var groups = [
    ["star", "ball", "heart", "moon"],
    ["cat", "dog", "bird", "fish"],
    ["apple", "grape", "ball", "leaf"],
    ["book", "pencil", "ball", "key"]
  ];
  var grp = 0;
  function newRound() {
    grp = round % groups.length;
    odd = RI(0, 3); r0 = cur;
    msg = "Round " + (round + 1) + " of " + ROUNDS + "  —  which one does not belong?";
  }
  newRound();
  function cellPos(i) { return { x: 150 + i * 140, y: 225 }; }
  function finishAll() {
    var avg = 0, best = 0;
    for (var i = 0; i < scores.length; i++) { avg += scores[i]; if (scores[i] > best) best = scores[i]; }
    avg = scores.length ? avg / scores.length : 0;
    fin(avg, rows2("Best Pick", best, best + "%", "Average", avg, Math.round(avg) + "%"));
  }
  function down(p, now) {
    if (done) return; var q = san(p); if (!q) return;
    for (var i = 0; i < 4; i++) {
      var cp = cellPos(i);
      if (dist(q.x, q.y, cp.x, cp.y) < 56) {
        var rt = cur - r0;
        if (i === odd) {
          var sc = clamp(Math.round(110 - rt * 10), 20, 100);
          scores.push(sc); flash = 0.9; flashTxt = "That is the odd one!"; sndGood();
        } else {
          scores.push(0); flash = 0.9; flashTxt = "That one belongs!"; sndBad();
        }
        round++;
        if (round >= ROUNDS) finishAll(); else newRound();
        break;
      }
    }
  }
  function move(p, now) {}
  function up(p, now) {}
  function draw(g, dt, now) {
    bg(g);
    var t = el(now); cur = t;
    if (!done && t > 25) finishAll();
    var cx = W / 2, gk = groups[grp];
    txt(g, msg, cx, 52, 22, isDark() ? "#e8e8e8" : "#334155");
    dots(g, ROUNDS, round, cx, 82);
    txt(g, "Three of these go together. One crashed the party.", cx, 118, 17, isDark() ? "#aab6c6" : "#64748b");
    for (var i = 0; i < 4; i++) {
      var cp = cellPos(i);
      g.fillStyle = isDark() ? "#2f3a4d" : "#ffffff";
      rr(g, cp.x - 58, cp.y - 52, 116, 104, 16); g.fill();
      g.strokeStyle = "rgba(120,120,120,0.35)"; g.lineWidth = 2;
      rr(g, cp.x - 58, cp.y - 52, 116, 104, 16); g.stroke();
      var isOdd = i === odd;
      if (BYCOLOR === 1) {
        ic(g, "shoe", cp.x, cp.y, 52, isOdd ? "#f59e0b" : P.c1, P.c2, P.c3);
      } else {
        var kind = isOdd ? "rocket" : gk[(i + grp) % 3];
        ic(g, kind, cp.x, cp.y, 52, P.c1, P.c2, P.c3);
      }
    }
    if (flash > 0) { flash -= dt || 0.016; txt(g, flashTxt, cx, 148, 22, "#0ea5e9"); }
    txt(g, "Tap the one that does not belong with the rest.", cx, H - 46, 15, isDark() ? "#aab6c6" : "#64748b");
    bar(g, 24, H - 26, W - 48, 8, 1 - t / 25, "#38bdf8");
  }

  return {
    status: function () { return msg + (done ? "  Done!" : ""); },
    down: down, move: move, up: up, draw: draw
  };

  }
});
