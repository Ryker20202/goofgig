/* ================================================================
   GoofGig — NEW GAME TEMPLATE
   Copy this file, rename it to gig-0XX.js, fill in your game,
   then add ONE line for it in manifest.js. Done — nothing else
   in the site changes.
   ================================================================ */
registerGame({
  n: 21, // <-- change to the new gig number
  title: "New Gig Title",
  desc: "One-line description shown on the home-page card.",
  hint: 'Explain the <b>one action</b> in one sentence.',
  grades: [
    ["Top Grade", "Sub-line for 95+."],
    ["Great Grade", "Sub-line for 85+."],
    ["Okay Grade", "Sub-line for 70+."],
    ["Low Grade", "Sub-line for 50+."],
    ["Bottom Grade", "Sub-line below 50."]
  ],
  thumb: function (g) {
    // Draw a tiny 300x92 preview for the home-page card here.
  },
  create: function (api) {
    // api.finish({ score: 0-100, rows: [{label, value, text, good}] })
    // api.reduced = true when the player prefers reduced motion.
    return {
      status: function () { return "Playing…"; },
      down: function (p, now) {},
      move: function (p, now) {},
      up: function (p, now) {},
      draw: function (g, dt, now) {}
    };
  }
});
