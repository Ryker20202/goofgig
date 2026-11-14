// GoofGig #551 — The Microwave Beeps
// A tiny everyday gig: Beep, beep, beep, and dinner is served.
registerGame({
  n: 551,
  title: "The Microwave Beeps",
  desc: "Beep, beep, beep, and dinner is served.",
  hint: "Watch the beep pattern, then tap it back.",
  grades: [
    ["Master of the Timer", "The timer salutes you. So do we."],
    ["Beep Repeater Extraordinaire", "That was smooth. Suspiciously smooth."],
    ["Beep Repeater in Training", "Respectable. The timer gives a small nod."],
    ["Weekend Beep Repeater", "Halfway there. The timer believes in you."],
    ["Dangerous Beep Repeater", "That was... a performance. Of some kind."]
  ],
  thumb: function (g) {
    g.fillStyle = "#fee2e2"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#fecaca"; g.fillRect(0, 74, 300, 18);
    g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(36, 22, 12, 0, 7); g.fill();
    g.beginPath(); g.arc(264, 26, 9, 0, 7); g.fill();
    var x = 52, y = 46, s = 34, c1 = "#f59e0b", c2 = "#7f1d1d", c3 = "#ef4444";
    g.fillStyle="#fff";g.beginPath();g.arc(x,y,s*0.46,0,7);g.fill();
    g.strokeStyle=c1;g.lineWidth=5;g.beginPath();g.arc(x,y,s*0.46,0,7);g.stroke();
    g.strokeStyle="#222";g.lineWidth=4;g.lineCap="round";
    g.beginPath();g.moveTo(x,y);g.lineTo(x,y-s*0.28);g.stroke();
    g.beginPath();g.moveTo(x,y);g.lineTo(x+s*0.22,y+s*0.08);g.stroke();
    g.fillStyle="#ef4444";g.beginPath();g.arc(x,y,s*0.05,0,7);g.fill();
    g.fillStyle=c2;g.beginPath();g.arc(x,y-s*0.38,s*0.04,0,7);g.fill();g.beginPath();g.arc(x+s*0.38,y,s*0.04,0,7);g.fill();
    x = 248; y = 46; s = 34; c1 = "#7f1d1d"; c2 = "#ef4444"; c3 = "#f59e0b";
    g.fillStyle="#fff";g.beginPath();g.arc(x,y,s*0.46,0,7);g.fill();
    g.strokeStyle=c1;g.lineWidth=5;g.beginPath();g.arc(x,y,s*0.46,0,7);g.stroke();
    g.strokeStyle="#222";g.lineWidth=4;g.lineCap="round";
    g.beginPath();g.moveTo(x,y);g.lineTo(x,y-s*0.28);g.stroke();
    g.beginPath();g.moveTo(x,y);g.lineTo(x+s*0.22,y+s*0.08);g.stroke();
    g.fillStyle="#ef4444";g.beginPath();g.arc(x,y,s*0.05,0,7);g.fill();
    g.fillStyle=c2;g.beginPath();g.arc(x,y-s*0.38,s*0.04,0,7);g.fill();g.beginPath();g.arc(x+s*0.38,y,s*0.04,0,7);g.fill();
    x = 150; y = 46; s = 58; c1 = "#ef4444"; c2 = "#f59e0b"; c3 = "#7f1d1d";
    g.fillStyle="#fff";g.beginPath();g.arc(x,y,s*0.46,0,7);g.fill();
    g.strokeStyle=c1;g.lineWidth=5;g.beginPath();g.arc(x,y,s*0.46,0,7);g.stroke();
    g.strokeStyle="#222";g.lineWidth=4;g.lineCap="round";
    g.beginPath();g.moveTo(x,y);g.lineTo(x,y-s*0.28);g.stroke();
    g.beginPath();g.moveTo(x,y);g.lineTo(x+s*0.22,y+s*0.08);g.stroke();
    g.fillStyle="#ef4444";g.beginPath();g.arc(x,y,s*0.05,0,7);g.fill();
    g.fillStyle=c2;g.beginPath();g.arc(x,y-s*0.38,s*0.04,0,7);g.fill();g.beginPath();g.arc(x+s*0.38,y,s*0.04,0,7);g.fill();
  },
  create: function (api) {

  var P = {sky:"#fee2e2", gnd:"#fecaca", c1:"#ef4444", c2:"#f59e0b", c3:"#7f1d1d"};
  function R(a, b) { return a + Math.random() * (b - a); }
  function RI(a, b) { return Math.floor(R(a, b + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ic(g, kind, x, y, s, c1, c2, c3) {
    if (!isFinite(x)) x = 0; if (!isFinite(y)) y = 0;
    if (!isFinite(s) || s <= 0) s = 10;
    c1 = c1 || P.c1; c2 = c2 || P.c2; c3 = c3 || P.c3;
    switch (kind) {
      case "clock":
        g.fillStyle="#fff";g.beginPath();g.arc(x,y,s*0.46,0,7);g.fill();
        g.strokeStyle=c1;g.lineWidth=5;g.beginPath();g.arc(x,y,s*0.46,0,7);g.stroke();
        g.strokeStyle="#222";g.lineWidth=4;g.lineCap="round";
        g.beginPath();g.moveTo(x,y);g.lineTo(x,y-s*0.28);g.stroke();
        g.beginPath();g.moveTo(x,y);g.lineTo(x+s*0.22,y+s*0.08);g.stroke();
        g.fillStyle="#ef4444";g.beginPath();g.arc(x,y,s*0.05,0,7);g.fill();
        g.fillStyle=c2;g.beginPath();g.arc(x,y-s*0.38,s*0.04,0,7);g.fill();g.beginPath();g.arc(x+s*0.38,y,s*0.04,0,7);g.fill();
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
g.fillStyle=dk?"#2b3648":"#fef3c7";
g.fillRect(0,60,W,90);
g.fillStyle=dk?"#3b475c":"#f59e0b";
for(var i=0;i<6;i++){g.fillRect(40+i*115,80,70,50);}
g.fillStyle="#ef4444";g.beginPath();g.arc(90,110,12,0,7);g.fill();
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


  var ROUNDS = 3, round = 0, scores = [], flash = 0, flashTxt = "", msg = "";
  var seq = [], input = [], phase = "show", showIdx = 0, showT = 0, GRID = 1, cur = 0;
  var NPAD = 4;
  var padCols = ["#ef4444", "#38bdf8", "#a3e635", "#f59e0b"];
  function newRound() {
    var len = 4 + round;
    seq = []; input = [];
    for (var i = 0; i < len; i++) seq.push(RI(0, NPAD - 1));
    phase = "show"; showIdx = 0; showT = cur + 0.6;
    msg = "Round " + (round + 1) + " of " + ROUNDS + "  —  watch, then repeat";
  }
  newRound();
  function padPos(i) {
    if (GRID === 1) return { x: 300 + (i % 2) * 120, y: 175 + Math.floor(i / 2) * 110 };
    return { x: 180 + i * 120, y: 225 };
  }
  function finishAll() {
    var avg = 0, best = 0;
    for (var i = 0; i < scores.length; i++) { avg += scores[i]; if (scores[i] > best) best = scores[i]; }
    avg = scores.length ? avg / scores.length : 0;
    fin(avg, rows2("Best Recall", best, best + "%", "Average", avg, Math.round(avg) + "%"));
  }
  function endRound(sc) {
    scores.push(sc); flash = 0.9;
    flashTxt = sc >= 90 ? "Perfect recall!" : (sc >= 60 ? "Good memory!" : "Mixed up!");
    if (sc >= 60) sndGood(); else sndBad();
    round++;
    if (round >= ROUNDS) finishAll(); else newRound();
  }
  function down(p, now) {
    if (done || phase !== "input") return; var q = san(p); if (!q) return;
    for (var i = 0; i < NPAD; i++) {
      var pp = padPos(i);
      if (dist(q.x, q.y, pp.x, pp.y) < 52) {
        blip(500 + i * 120, 0.1, "sine", 0.18);
        if (i === seq[input.length]) {
          input.push(i);
          if (input.length >= seq.length) endRound(100);
        } else {
          var got = input.length;
          endRound(Math.round(got / seq.length * 100));
        }
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
    if (!done && phase === "show") {
      if (t >= showT) {
        showIdx++;
        showT = t + 0.55;
        if (showIdx > seq.length) { phase = "input"; msg = "Your turn! Tap the pads in order."; }
        else if (showIdx <= seq.length) blip(500 + seq[showIdx - 1] * 120, 0.12, "sine", 0.15);
      }
    }
    var cx = W / 2;
    txt(g, msg, cx, 52, 22, isDark() ? "#e8e8e8" : "#334155");
    dots(g, ROUNDS, round, cx, 82);
    txt(g, phase === "show" ? "Watch..." : "Repeat: " + input.length + " / " + seq.length, cx, 112, 18, isDark() ? "#aab6c6" : "#64748b");
    for (var i = 0; i < NPAD; i++) {
      var pp = padPos(i);
      var lit = phase === "show" && showIdx > 0 && showIdx <= seq.length && seq[showIdx - 1] === i;
      g.fillStyle = lit ? padCols[i] : (isDark() ? "#2f3a4d" : "#e2e8f0");
      g.beginPath(); g.arc(pp.x, pp.y, lit ? 48 : 42, 0, 7); g.fill();
      g.strokeStyle = padCols[i]; g.lineWidth = 4;
      g.beginPath(); g.arc(pp.x, pp.y, lit ? 48 : 42, 0, 7); g.stroke();
      ic(g, "clock", pp.x, pp.y, 30, lit ? "#ffffff" : padCols[i], "#ffffff", padCols[i]);
    }
    if (flash > 0) { flash -= dt || 0.016; txt(g, flashTxt, cx, 140, 22, "#0ea5e9"); }
    txt(g, "Watch the flashing pads, then tap them back in the same order.", cx, H - 46, 15, isDark() ? "#aab6c6" : "#64748b");
    bar(g, 24, H - 26, W - 48, 8, 1 - t / 25, "#38bdf8");
  }

  return {
    status: function () { return msg + (done ? "  Done!" : ""); },
    down: down, move: move, up: up, draw: draw
  };

  }
});
