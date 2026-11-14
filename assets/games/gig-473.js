// GoofGig #473 — The Bouncing Marble
// A tiny everyday gig: Marbles roll, paddles swing, physics laughs.
registerGame({
  n: 473,
  title: "The Bouncing Marble",
  desc: "Marbles roll, paddles swing, physics laughs.",
  hint: "Move the paddle to keep the marble bouncing.",
  grades: [
    ["Legendary Marble Bouncer", "Peak marble energy. Nothing more to say."],
    ["The Marble Ace", "Strong run. One tiny wobble, forgiven."],
    ["The Marble Regular", "Solid effort. The marble survived, mostly."],
    ["Weekend Marble Bouncer", "The marble survived. That counts for something."],
    ["The Marble Disaster", "That was... a performance. Of some kind."]
  ],
  thumb: function (g) {
    g.fillStyle = "#fee2e2"; g.fillRect(0, 0, 300, 92);
    g.fillStyle = "#a8a29e"; g.fillRect(0, 74, 300, 18);
    g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(36, 22, 12, 0, 7); g.fill();
    g.beginPath(); g.arc(264, 26, 9, 0, 7); g.fill();
    var x = 52, y = 46, s = 34, c1 = "#38bdf8", c2 = "#7f1d1d", c3 = "#ef4444";
    g.fillStyle=c1;g.beginPath();
    for(var i=0;i<10;i++){var a=-Math.PI/2+i*Math.PI/5,r2=i%2===0?s*0.55:s*0.24;var px=x+Math.cos(a)*r2,py=y+Math.sin(a)*r2;if(i===0)g.moveTo(px,py);else g.lineTo(px,py);}
    g.closePath();g.fill();g.fillStyle=c2;g.beginPath();g.arc(x-s*0.12,y-s*0.12,s*0.1,0,7);g.fill();
    x = 248; y = 46; s = 34; c1 = "#7f1d1d"; c2 = "#ef4444"; c3 = "#38bdf8";
    g.fillStyle=c1;g.beginPath();
    for(var i=0;i<10;i++){var a=-Math.PI/2+i*Math.PI/5,r2=i%2===0?s*0.55:s*0.24;var px=x+Math.cos(a)*r2,py=y+Math.sin(a)*r2;if(i===0)g.moveTo(px,py);else g.lineTo(px,py);}
    g.closePath();g.fill();g.fillStyle=c2;g.beginPath();g.arc(x-s*0.12,y-s*0.12,s*0.1,0,7);g.fill();
    x = 150; y = 46; s = 58; c1 = "#ef4444"; c2 = "#38bdf8"; c3 = "#7f1d1d";
    g.fillStyle=c1;g.beginPath();
    for(var i=0;i<10;i++){var a=-Math.PI/2+i*Math.PI/5,r2=i%2===0?s*0.55:s*0.24;var px=x+Math.cos(a)*r2,py=y+Math.sin(a)*r2;if(i===0)g.moveTo(px,py);else g.lineTo(px,py);}
    g.closePath();g.fill();g.fillStyle=c2;g.beginPath();g.arc(x-s*0.12,y-s*0.12,s*0.1,0,7);g.fill();
  },
  create: function (api) {

  var P = {sky:"#fee2e2", gnd:"#a8a29e", c1:"#ef4444", c2:"#38bdf8", c3:"#7f1d1d"};
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
g.fillStyle=dk?"#2b3648":"#fef3c7";
g.fillRect(60,50,220,130);
g.fillStyle=dk?"#3b475c":"#166534";g.fillRect(72,62,196,106);
g.fillStyle="rgba(255,255,255,0.7)";g.fillRect(90,84,120,6);g.fillRect(90,104,90,6);g.fillRect(90,124,140,6);
g.fillStyle="#f59e0b";g.beginPath();g.arc(W-90,80,24,0,7);g.fill();
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


  var DUR = 20, px = W / 2, ball = { x: W / 2, y: 160, vx: 120, vy: 0 };
  var bounces = 0, drops = 0, MAXDROP = 3, FAST = 1;
  var PAD_Y = 350, PAD_W = 120;
  function finishAll() {
    var sc = clamp(Math.round(Math.min(bounces, 25) * 3.4 + (MAXDROP - drops) * 5), 0, 100);
    fin(sc, rows2("Bounces", Math.min(bounces * 4, 100), bounces + " bounces", "Drops", Math.round((MAXDROP - drops) / MAXDROP * 100), drops + " / " + MAXDROP));
  }
  function setPos(p) { var q = san(p); if (q && !done) px = clamp(q.x, PAD_W / 2 + 10, W - PAD_W / 2 - 10); }
  function down(p, now) { setPos(p); }
  function move(p, now) { setPos(p); }
  function up(p, now) {}
  function draw(g, dt, now) {
    bg(g);
    var t = el(now);
    if (!done && t > DUR) finishAll();
    var d = clamp(dt || 0.016, 0, 0.05);
    if (!done) {
      ball.vy += 620 * d;
      ball.x += ball.vx * d; ball.y += ball.vy * d;
      if (ball.x < 30) { ball.x = 30; ball.vx = Math.abs(ball.vx); }
      if (ball.x > W - 30) { ball.x = W - 30; ball.vx = -Math.abs(ball.vx); }
      if (ball.y < 100) { ball.y = 100; ball.vy = Math.abs(ball.vy); }
      if (ball.vy > 0 && ball.y >= PAD_Y - 22 && ball.y < PAD_Y + 14 && Math.abs(ball.x - px) < PAD_W / 2 + 16) {
        ball.y = PAD_Y - 22;
        ball.vy = -(430 + (FAST === 1 ? bounces * 12 : 0));
        ball.vx += (ball.x - px) * 2.4;
        ball.vx = clamp(ball.vx, -260, 260);
        bounces++; blip(720 + bounces * 12, 0.07, "sine", 0.15);
      }
      if (ball.y > H - 20) {
        drops++; sndBad();
        ball.x = W / 2 + R(-120, 120); ball.y = 140; ball.vx = R(-120, 120); ball.vy = 0;
        if (drops >= MAXDROP) finishAll();
      }
    }
    txt(g, "Bounces " + bounces + "  •  Drops " + drops + " / " + MAXDROP, W / 2, 52, 22, isDark() ? "#e8e8e8" : "#334155");
    // paddle
    g.fillStyle = P.c2;
    rr(g, px - PAD_W / 2, PAD_Y, PAD_W, 20, 10); g.fill();
    g.strokeStyle = "rgba(0,0,0,0.2)"; g.lineWidth = 2; rr(g, px - PAD_W / 2, PAD_Y, PAD_W, 20, 10); g.stroke();
    g.fillStyle = "rgba(255,255,255,0.35)";
    rr(g, px - PAD_W / 2 + 8, PAD_Y + 4, PAD_W - 16, 6, 3); g.fill();
    // ball trail
    g.fillStyle = "rgba(245,158,11,0.25)";
    g.beginPath(); g.arc(ball.x - ball.vx * 0.03, ball.y - ball.vy * 0.03, 12, 0, 7); g.fill();
    ic(g, "star", ball.x, ball.y, 40, P.c1, P.c2, P.c3);
    txt(g, "Move the paddle to keep it bouncing. Three drops and it is over.", W / 2, H - 46, 15, isDark() ? "#aab6c6" : "#64748b");
    bar(g, 24, H - 26, W - 48, 8, 1 - t / DUR, "#38bdf8");
  }

  return {
    status: function () { return "Bounces " + bounces + (done ? "  Done!" : ""); },
    down: down, move: move, up: up, draw: draw
  };

  }
});
