/* GoofGig — Gig #092 Fastest Fingers */
registerGame({
  n: 92, title: "Fastest Fingers",
  desc: "Numbers 1 to 9, scattered like they owe you money. Tap them in order.",
  hint: '<b>Tap the numbers in order: 1, 2, 3… 9</b>, as fast as you can. Wrong taps add shame (and time penalties). Timer starts on your first tap.',
  grades: [
    ["Keyboard Ninja", "Blink and the numbers were gone. In order."],
    ["Speed Demon", "Your fingers have their own fan club."],
    ["Quick Enough", "Respectable pace. The numbers felt mild pressure."],
    ["Hunt and Peck", "You found them eventually. They had settled down."],
    ["Counting on Fingers", "Literally. We could see you counting on your fingers."]
  ],
  thumb: function (g) {
    g.fillStyle = "#57b7dd"; rr(g, 105, 16, 34, 34, 8); g.fill();
    g.fillStyle = "#ffb627"; rr(g, 148, 40, 34, 34, 8); g.fill();
    g.fillStyle = "#35c4a0"; rr(g, 190, 16, 34, 34, 8); g.fill();
    txt(g, "1", 122, 42, 20, "#fff"); txt(g, "2", 165, 66, 20, "#fff"); txt(g, "3", 207, 42, 20, "#fff");
  },
  create: function (api) {
    var pos = [], next = 1, time = 0, started = false, mistakes = 0, done = false;
    var order = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (var i = order.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var tmp = order[i]; order[i] = order[j]; order[j] = tmp; }
    for (var c = 0; c < 9; c++) pos.push({ n: order[c], x: 150 + (c % 3) * 210, y: 140 + Math.floor(c / 3) * 105, hit: false });
    function finishRound() {
      done = true;
      var score = clamp(Math.round(112 - time * 6.5 - mistakes * 4), 2, 100);
      if (score >= 70) sndGood(); else sndBad();
      api.finish({ score: score, rows: [
        { label: "Total time", value: clamp(112 - time * 6.5, 0, 100), text: time.toFixed(1) + "s", good: time < 8 },
        { label: "Wrong taps", value: clamp(100 - mistakes * 20, 0, 100), text: "" + mistakes }
      ] });
    }
    return {
      status: function () { return done ? "All nine, in order." : (started ? "Find: " + next + " · " + time.toFixed(1) + "s" : "Tap 1 to start the clock!"); },
      down: function (p) {
        if (done) return;
        for (var i = 0; i < 9; i++) {
          var cell = pos[i];
          if (!cell.hit && Math.abs(p.x - cell.x) < 52 && Math.abs(p.y - cell.y) < 46) {
            if (!started) { started = true; audio(); }
            if (cell.n === next) { cell.hit = true; next++; blip(400 + cell.n * 50, .06, "sine", .07); if (next > 9) finishRound(); }
            else { mistakes++; time += 0.5; blip(150, .1, "sawtooth", .06); }
            return;
          }
        }
      },
      move: function () {}, up: function () {},
      draw: function (g, dt) {
        var dark = isDark();
        if (started && !done) time += dt;
        txt(g, started ? "NEXT: " + Math.min(next, 9) : "FASTEST FINGERS", W / 2, 56, 24, dark ? "#f7e8d8" : "#33241a");
        txt(g, time.toFixed(1) + "s", W / 2, 90, 17, dark ? "#c4a68d" : "#7a5f4d");
        pos.forEach(function (cell) {
          var isNext = cell.n === next && !done;
          g.fillStyle = cell.hit ? (dark ? "#2c2119" : "#e5d9c5") : (isNext ? "#ffb627" : (dark ? "#4a3423" : "#fff6e8"));
          rr(g, cell.x - 52, cell.y - 44, 104, 88, 14); g.fill();
          g.strokeStyle = isNext ? "#e08e00" : (dark ? "#7a5f4d" : "#d9b98a"); g.lineWidth = isNext ? 4 : 2;
          rr(g, cell.x - 52, cell.y - 44, 104, 88, 14); g.stroke();
          txt(g, "" + cell.n, cell.x, cell.y + 13, 38, cell.hit ? "#9a8871" : (dark ? "#f7e8d8" : "#33241a"));
        });
        if (!started) txt(g, "The clock starts when you tap 1", W / 2, 448, 17, dark ? "rgba(247,232,216,.8)" : "rgba(93,58,22,.7)");
      }
    };
  }
});
