(function () {
  'use strict';
  var V = './static/videos/';
  var BLUE = '#4F7CC4', ORANGE = '#E07A33', NEUTRAL = '#A9B4C2';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function play(v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  function setSrc(v, src) {
    if (v.getAttribute('src') !== src) { v.setAttribute('src', src); v.load(); }
    play(v);
  }
  function picker(name, items, onPick) {
    var box = $('[data-picker="' + name + '"]');
    items.forEach(function (it, i) {
      var b = document.createElement('button');
      b.className = 'pick-btn' + (i === 0 ? ' is-active' : ''); b.textContent = it.label; b.type = 'button';
      b.addEventListener('click', function () {
        $$('.pick-btn', box).forEach(function (x) { x.classList.toggle('is-active', x === b); });
        onPick(it);
      });
      box.appendChild(b);
    });
    onPick(items[0]);
  }

  var WINDOWS = {'FurnitureBench': [{"label": "One leg", "id": "fb-one-leg"}, {"label": "Lamp", "id": "fb-lamp"}, {"label": "Round table", "id": "fb-round-table"}, {"label": "Square table", "id": "fb-square-table"}], 'RoboCasa365': [{"label": "Pick Place Counter To Stove", "id": "rc-pick-place-counter-to-stove"}, {"label": "Open Cabinet", "id": "rc-open-cabinet"}, {"label": "Prepare Coffee", "id": "rc-prepare-coffee"}, {"label": "Searing Meat", "id": "rc-searing-meat"}, {"label": "Set Up Cutting Station", "id": "rc-set-up-cutting-station"}, {"label": "Stack Bowls Cabinet", "id": "rc-stack-bowls-cabinet"}, {"label": "Pick Place Counter To Cabinet", "id": "rc-pick-place-counter-to-cabinet"}, {"label": "Stir Vegetables", "id": "rc-stir-vegetables"}, {"label": "Kettle Boiling", "id": "rc-kettle-boiling"}, {"label": "Pre Soak Pan", "id": "rc-pre-soak-pan"}, {"label": "Deliver Straw", "id": "rc-deliver-straw"}, {"label": "Get Toasted Bread", "id": "rc-get-toasted-bread"}, {"label": "Navigate Kitchen", "id": "rc-navigate-kitchen"}, {"label": "Pack Identical Lunches", "id": "rc-pack-identical-lunches"}, {"label": "Pack Identical Lunches (2)", "id": "rc-pack-identical-lunches-2"}, {"label": "Set Up Cutting Station (2)", "id": "rc-set-up-cutting-station-2"}], 'Real world': [{"label": "Hang mug", "id": "real-mug"}, {"label": "Cloth fold", "id": "real-cloth"}, {"label": "Dustpan", "id": "real-dustpan-1"}]};
  picker('predbench', Object.keys(WINDOWS).map(function (k) { return { label: k }; }), function (g) {
    $('[data-picker="pred"]').innerHTML = '';
    picker('pred', WINDOWS[g.label], function (it) {
      setSrc($('#pred-video'), V + 'gen-' + it.id + '-video.mp4?v=63');
      setSrc($('#pred-points'), V + 'gen-' + it.id + '-points.mp4?v=63');
    });
  });

  picker('corr', [{"label": "Round table: insert the leg", "id": "round-table-insert", "note": "Predicted plan: the hand opens before the leg is seated, and the leg tips over. After the edit: the leg is lowered into the socket, then released."}, {"label": "Round table: screw the leg", "id": "round-table-screw", "note": "Predicted plan: the open hand walks away from the unscrewed leg. After the edit: the hand grips the leg and turns it."}, {"label": "Square table: screw the leg", "id": "square-table-screw", "note": "Predicted plan: the open hand moves 9 cm away and the leg stays unscrewed. After the edit: the hand closes on the leg and turns it 35\u00b0."}, {"label": "Lamp: screw the bulb", "id": "lamp-screw", "note": "Direction: screw the bulb."}], function (it) {
    setSrc($('#edit-before'), V + 'edit-' + it.id + '-before.mp4?v=63'); setSrc($('#edit-after'), V + 'edit-' + it.id + '-after.mp4?v=63');
    setSrc($('#edit-closeup'), V + 'edit-' + it.id + '-closeup.mp4?v=63'); setSrc($('#edit-points'), V + 'edit-' + it.id + '-points.mp4?v=63');
    $('#edit-note').textContent = it.note;
  });

  picker('rcedit', [{"label": "Counter to cabinet", "id": "counter-to-cabinet", "note": "Predicted plan: the empty hand lifts to the shelf. After the edit: the hand goes back to the bottle."}, {"label": "Sink to counter", "id": "sink-to-counter", "note": "Predicted plan: the gripper closes on nothing and the lemon stays in the sink. After the edit: the lemon is grasped and lifted 12 cm."}, {"label": "Place on the shelf", "id": "shelf-place", "note": "Predicted plan: the bottle is released beside the shelf and falls to the counter. After the edit: the bottle is placed on the shelf."}, {"label": "Drive to the kettle", "id": "navigate", "note": "Predicted plan: the base drives 0.75 m to the stand mixer, the wrong appliance. After the edit: it drives 1.8 m to the kettle counter."}], function (it) {
    setSrc($('#rcedit-before'), V + 'edit-rc-' + it.id + '-before.mp4?v=63'); setSrc($('#rcedit-after'), V + 'edit-rc-' + it.id + '-after.mp4?v=63');
    setSrc($('#rcedit-points'), V + 'edit-rc-' + it.id + '-points.mp4?v=63');
    $('#rcedit-note').textContent = it.note;
  });

  var tip = $('#tip');
  function showTip(e, text) {
    tip.textContent = text; tip.classList.add('on');
    var x = (e.clientX || 0) + 12, y = (e.clientY || 0) + 14;
    tip.style.left = Math.min(x, window.innerWidth - tip.offsetWidth - 8) + 'px'; tip.style.top = y + 'px';
  }
  function hideTip() { tip.classList.remove('on'); }
  function chart(host, title, sub, rows, max, unit) {
    var c = document.createElement('div'); c.className = 'chart';
    c.innerHTML = '<h4></h4><p class="sub"></p>';
    $('h4', c).textContent = title; $('.sub', c).textContent = sub;
    rows.forEach(function (r) {
      var row = document.createElement('div'); row.className = 'row' + (r.sub === 'ours' ? ' ours' : '');
      var lab = document.createElement('div'); lab.className = 'lab'; lab.textContent = r.label;
      if (r.sub) { var s = document.createElement('small'); s.textContent = r.sub; lab.appendChild(s); }
      var bars = document.createElement('div'); bars.className = 'bars';
      r.bars.forEach(function (b) {
        var el = document.createElement('div'); el.className = 'bar'; el.tabIndex = 0;
        var pct = Math.max(0, b.v) / max * 100;
        var text = r.label + ' · ' + b.name + ': ' + b.v.toFixed(1) + unit;
        el.setAttribute('role', 'img'); el.setAttribute('aria-label', text);
        el.innerHTML = '<i style="width:' + pct * 0.86 + '%;background:' + b.color + '"></i><em style="left:' + pct * 0.86 + '%">' + b.v.toFixed(1) + '</em>';
        el.addEventListener('mousemove', function (e) { showTip(e, text); });
        el.addEventListener('mouseleave', hideTip);
        el.addEventListener('focus', function () { var q = el.getBoundingClientRect(); showTip({ clientX: q.left + 20, clientY: q.bottom - 8 }, text); });
        el.addEventListener('blur', hideTip);
        bars.appendChild(el);
      });
      row.appendChild(lab); row.appendChild(bars); c.appendChild(row);
    });
    var ax = document.createElement('div'); ax.className = 'axis';
    ax.innerHTML = '<span></span><div style="width:86%"><span>0</span><span>' + (max / 2) + '</span><span>' + max + unit + '</span></div>';
    c.appendChild(ax); host.appendChild(c);
  }
  function pair(label, a, b, sub) {
    return { label: label, sub: sub, bars: [{ v: a, color: BLUE, name: 'Ours' }, { v: b, color: ORANGE, name: 'Ours + agent' }] };
  }
  var sc = $('#success-charts');
  chart(sc, 'FurnitureBench', 'Success rate (%), four assembly tasks', [
    pair('One leg', 63.3, 70.0), pair('Lamp', 3.3, 40.0), pair('Round table', 10.0, 43.3), pair('Square table', 6.7, 36.7),
    pair('Average', 20.8, 47.5)
  ], 100, '%');
  chart(sc, 'RoboCasa365', 'Success rate (%), seen target tasks', [
    pair('Atomic', 38.7, 46.5, '18 tasks'), pair('Composite', 7.7, 27.4, '16 tasks')
  ], 100, '%');
  var ab = $('#ablation-charts');
  [['Round table', [10.0, 16.7, 13.3, 33.3, 43.3]], ['Lamp', [3.3, 16.7, 16.7, 30.0, 40.0]]].forEach(function (t) {
    var names = ['No agent', 'Image space', 'Best-of-10', 'Edit, no regeneration', 'Edit + regenerate'];
    var subs = ['', 'video → actions', 'pick a generation', '', 'ours'];
    var cols = [BLUE, NEUTRAL, NEUTRAL, NEUTRAL, ORANGE];
    chart(ab, t[0], 'Success rate (%) by how the agent acts', names.map(function (n, i) {
      return { label: n, sub: subs[i], bars: [{ v: t[1][i], color: cols[i], name: t[0] }] };
    }), 60, '%');
  });
  var FUN = {
    'One leg': [['Leg grasped', 100.0, 100.0], ['Leg in hole', 90.0, 93.3], ['Leg screwed', 63.3, 70.0]],
    'Lamp': [['Bulb grasped', 76.7, 86.7], ['Bulb in socket', 30.0, 66.7], ['Bulb screwed', 3.3, 53.3], ['Hood grasped', 3.3, 53.3], ['Hood placed', 3.3, 40.0]],
    'Square table': [['Leg 1 in hole', 96.7, 93.3], ['Leg 1 screwed', 86.7, 86.7], ['Leg 2 screwed', 66.7, 70.0], ['Leg 3 screwed', 50.0, 56.7], ['Leg 4 screwed', 6.7, 36.7]],
    'Round table': [['Leg grasped', 100.0, 100.0], ['Leg in hole', 86.7, 83.3], ['Leg screwed', 83.3, 70.0], ['Base grasped', 73.3, 63.3], ['Base on leg', 26.7, 53.3], ['Base screwed', 10.0, 43.3]]
  };
  picker('funnel', ['Lamp', 'Round table', 'Square table', 'One leg'].map(function (k) { return { label: k }; }), function (it) {
    var h = $('#funnel-chart'); h.innerHTML = '';
    chart(h, it.label, 'Episodes reaching each step (%), in order', FUN[it.label].map(function (r) { return pair(r[0], r[1], r[2]); }), 100, '%');
  });
  picker('robot', [{"label": "Hang mug", "id": "mug"}, {"label": "Dustpan", "id": "dustpan"}, {"label": "Cloth fold", "id": "cloth"}], function (it) {
    setSrc($('#robot-video'), V + 'robot-' + it.id + '.mp4?v=63');
  });
  chart($('#real-chart'), 'Real robot', 'Success rate (%), world model alone', [['Dustpan', 45.0], ['Hang mug', 60.0], ['Cloth fold', 90.0]].map(function (r) {
    return { label: r[0], bars: [{ v: r[1], color: BLUE, name: 'Ours' }] };
  }), 100, '%');
  $$('video[autoplay]').forEach(play);
})();
