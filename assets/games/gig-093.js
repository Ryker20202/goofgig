/* GoofGig — Gig #093 Tap the Word */
registerGame({
  n: 93, title: "Tap the Word",
  desc: "The word is right there. Its letters are down there. Some assembly required.",
  hint: 'A word shows at the top. <b>Tap its letters below in order</b> to spell it. <b>3 words</b> — speed counts, typos count more.',
  grades: [
    ["Spelling Bee Royalty", "Three words, zero hesitation. The dictionary salutes."],
    ["Word Surgeon", "Fast and accurate. Letters fear your precision."],
    ["Competent Speller", "All words spelled. Eventually. Correctly, even."],
    ["Autocorrect Dependent", "You spell like autocorrect raised you. It did not."],
    ["Alphabet Soup", "Those letters formed… something. Not the word, but something."]
  ],
  thumb: function (g) {
    var L = ["G", "O", "O", "F", "Y"];
    L.forEach(function (ch, i) { g.fillStyle = i % 2 ? "#57b7dd" : "#ffb627"; rr(g, 92 + i * 26, 28, 23, 34, 5); g.fill(); txt(g, ch, 103 + i * 26, 52, 16, "#fff"); });
  },
  create: function (api) {
    var WORDS = ["CAT", "JUMP", "PIZZA", "GOOFY", "MILK", "CAKE", "FROG", "DANCE", "ROBOT", "MELON"];
    var picks = [];
    while (picks.length < 3) { var w = WORDS[Math.floor(Math.random() * WORDS.length)]; if (picks.indexOf(w) < 0) picks.push(w); }
    var wi = 0, li = 0, buttons = [], time = 0, started = false, mistakes = 0, done = false;
    function setupWord() {
      var word = picks[wi], letters = word.split("");
      for (var i = letters.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = letters[i]; letters[i] = letters[j]; letters[j] = t; }
      buttons = letters.map(function (ch, k) { return { ch: ch, used: false, x: W / 2 + (k - (letters.length - 1) / 2) * 92, y: 330 }; });
      li = 0;
    }
    setupWord();
    function finishRound() {
      done = true;
      var score = clamp(Math.round(108 - time * 3.4 - mistakes * 6), 2, 100);
      if (score >= 70) sndGood(); else sndBad();
      api.finish({ score: score, rows: [
        { label: "Total time", value: clamp(108 - time * 3.4, 0, 100), text: time.toFixed(1) + "s", good: time < 14 },
        { label: "Wrong letters", value: clamp(100 - mistakes * 16, 0, 100), text: "" + mistakes }
      ] });
    }
    return {
      status: function () { return done ? "Dictionary closed." : "Word " + (wi + 1) + " / 3 · " + time.toFixed(1) + "s"; },
      down: function (p) {
        if (done) return;
        if (!started) { started = true; audio(); }
        for (var i = 0; i < buttons.length; i++) {
          var b = buttons[i];
          if (!b.used && Math.abs(p.x - b.x) < 42 && Math.abs(p.y - b.y) < 40) {
            if (b.ch === picks[wi][li]) {
              b.used = true; li++; blip(460 + li * 60, .06, "sine", .07);
              if (li >= picks[wi].length) { wi++; if (wi >= 3) { finishRound(); return; } setupWord(); }
            } else { mistakes++; blip(150, .1, "sawtooth", .06); }
            return;
          }
        }
      },
      move: function () {}, up: function () {},
      draw: function (g, dt) {
        var dark = isDark();
        if (started && !done) time += dt;
        var word = picks[wi] || picks[2];
        txt(g, "SPELL THIS:", W / 2, 66, 17, dark ? "#c4a68d" : "#7a5f4d");
        // word slots
        for (var i = 0; i < word.length; i++) {
          var x = W / 2 + (i - (word.length - 1) / 2) * 76;
          g.fillStyle = i < li ? "#35c4a0" : (dark ? "#4a3423" : "#fdf1dc");
          rr(g, x - 32, 92, 64, 74, 10); g.fill();
          txt(g, i < li ? word[i] : "·", x, y138(i), 36, i < li ? "#fff" : (dark ? "#8a715a" : "#c9b18c"));
        }
        function y138() { return 140; }
        txt(g, "tap the letters in order", W / 2, 224, 16, dark ? "rgba(247,232,216,.7)" : "rgba(93,58,22,.6)");
        // letter buttons
        buttons.forEach(function (b) {
          g.fillStyle = b.used ? (dark ? "#2c2119" : "#e5d9c5") : (dark ? "#4a3423" : "#fff6e8");
          rr(g, b.x - 40, b.y - 40, 80, 80, 12); g.fill();
          g.strokeStyle = dark ? "#7a5f4d" : "#d9b98a"; g.lineWidth = 2; rr(g, b.x - 40, b.y - 40, 80, 80, 12); g.stroke();
          txt(g, b.ch, b.x, b.y + 12, 32, b.used ? "#9a8871" : (dark ? "#f7e8d8" : "#33241a"));
        });
        // word progress
        for (var d = 0; d < 3; d++) { g.fillStyle = d < wi ? "#35c4a0" : (d === wi ? "#ffb627" : (dark ? "#4a3423" : "#e5d9c5")); g.beginPath(); g.arc(W / 2 - 30 + d * 30, 448, 8, 0, Math.PI * 2); g.fill(); }
      }
    };
  }
});
