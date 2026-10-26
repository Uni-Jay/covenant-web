// @ts-nocheck
// Birthday and anniversary cards: the same six designs as Church Studio, drawn in the browser.
import { getAssetUrl } from '../utils/api';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function hexA(hex, a) { var h = String(hex || '#3d1f73').replace('#', ''); if (h.length === 3) h = h.split('').map(function (x) { return x + x; }).join(''); var n = parseInt(h, 16); return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')'; }
  var CARD_W = 1080, CARD_H = 1350;
  var SCRIPT = '"Great Vibes", "Segoe Script", "Brush Script MT", cursive', SANS = '"Segoe UI", Roboto, Arial, sans-serif', SERIF = 'Georgia, "Times New Roman", serif';
  var PALETTES = [
    ['#3d1f73', '#e3b341', '#ffe7a8'], ['#0d4a3a', '#e8c66a', '#fff1c4'], ['#7a1256', '#f7c04a', '#ffe0ef'], ['#0f2a5c', '#f2a23a', '#dbe8ff'],
    ['#6b0f1a', '#f0c75e', '#ffe9d6'], ['#0e5a6e', '#ff9f43', '#d8f6ff'], ['#2b1b4a', '#ff6fa5', '#ffe3f0'], ['#173b2c', '#9be15d', '#e9ffd9']
  ];
  var WISHES = [
    'Happy birthday, {first}! May the Lord bless you and keep you, and may this new year of your life overflow with His joy, peace and favour.',
    'Today we celebrate you, {first}! May God crown this new year with His goodness, and may your paths overflow with abundance.',
    'Happy birthday, {first}! May your new year be filled with answered prayers, open doors and the sweet presence of God.',
    'We thank God for your life, {first}! May you grow in grace, walk in divine health and shine brighter this year.',
    'Happy birthday, {first}! It is your season of laughter. May everything that concerns you be perfected by the Lord.',
    'Celebrating God’s faithfulness in your life, {first}! May this year bring you uncommon testimonies and lasting joy.',
    'Happy birthday, {first}! You are a blessing to us. May the Lord satisfy you with long life and show you His salvation.',
    'Cheers to a new year, {first}! May God’s favour surround you like a shield, and may you never lack any good thing.'
  ];
  var ANN_WISHES = [
    'Happy wedding anniversary, {first}! May your home continue to be a place of love, peace and laughter, and may God bless your union more and more.',
    'Celebrating your love today! May the Lord who brought you together keep you together in joy, and may your marriage shine as a light.',
    'Happy anniversary! May your love grow sweeter every year, and may God’s grace rest richly upon your home.'
  ];
  var VERSES = [['The Lord bless thee, and keep thee: the Lord make his face shine upon thee.', 'Numbers 6:24-25'], ['With long life will I satisfy him, and shew him my salvation.', 'Psalm 91:16'],
    ['This is the day which the LORD hath made; we will rejoice and be glad in it.', 'Psalm 118:24'], ['Grant thee according to thine own heart, and fulfil all thy counsel.', 'Psalm 20:4'],
    ['The blessing of the LORD, it maketh rich, and he addeth no sorrow with it.', 'Proverbs 10:22'], ['Thou crownest the year with thy goodness; and thy paths drop fatness.', 'Psalm 65:11'],
    ['I wish above all things that thou mayest prosper and be in health.', '3 John 1:2'], ['For I know the thoughts that I think toward you… to give you an expected end.', 'Jeremiah 29:11']];
  var YO_WISHES = ['Ẹ kú ọjọ́ ìbí! Ọlọ́run yóò fi ẹ̀mí gígùn tẹ́ yín lọ́rùn.', 'Ẹ kú àyájọ́ ọjọ́ ìbí! Ayọ̀ yín kò ní dínkù.', 'Ẹ kú ọdún tuntun ayé yín! Olúwa yóò ṣe yín ní ìbùkún.'];
  function hashStr(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { var a = seed || 1; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function firstName(n) {
    var s = String(n || '').trim(), re = /^(\((mrs|mr|dr|rev|engr|barr)\.?\)|bro|sis|brother|sister|mr|mrs|miss|ms|dr|pastor|pst|apostle|apst|rev|reverend|bishop|archbishop|min|minister|deacon|deaconess|dcn|dcns|elder|evang|evangelist|prophet|prophetess|master|chief|prof|engr|barr|hon|sir|lady|mummy|daddy)\.?\s+/i, k = 0;
    while (re.test(s) && k++ < 5) s = s.replace(re, '');
    return s.split(/[\s&]+/)[0] || 'friend';
  }
  function wrapLines(x, text, maxW) {
    var out = []; String(text).split('\n').forEach(function (p) { var cur = ''; p.split(/\s+/).forEach(function (w) { var t = cur ? cur + ' ' + w : w; if (x.measureText(t).width > maxW && cur) { out.push(cur); cur = w; } else cur = t; }); out.push(cur); });
    return out;
  }
  function drawText(x, text, cx, y, maxW, size, weight, family, color, lh, align) {
    x.font = (weight || 400) + ' ' + size + 'px ' + family; x.fillStyle = color; x.textAlign = align || 'center';
    var ls = wrapLines(x, text, maxW); ls.forEach(function (l, i) { x.fillText(l, cx, y + i * size * (lh || 1.3)); }); return y + ls.length * size * (lh || 1.3);
  }
  function fitText(x, text, maxW, size, weight, family, min) { x.font = weight + ' ' + size + 'px ' + family; while (size > (min || 30) && x.measureText(text).width > maxW) { size -= 2; x.font = weight + ' ' + size + 'px ' + family; } return size; }
  function photoCircle(x, img, cx, cy, r, ring, ringW) {
    x.save(); x.beginPath(); x.arc(cx, cy, r + ringW, 0, Math.PI * 2); x.fillStyle = ring; x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 40; x.fill(); x.restore();
    x.save(); x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.clip(); coverImg(x, img, cx - r, cy - r, r * 2, r * 2); x.restore();
  }
  function coverImg(x, img, dx, dy, dw, dh) {
    if (!img) { x.fillStyle = '#ddd'; x.fillRect(dx, dy, dw, dh); x.fillStyle = '#999'; x.font = '700 ' + Math.round(dw / 4) + 'px ' + SANS; x.textAlign = 'center'; x.fillText('🎂', dx + dw / 2, dy + dh / 2 + dw / 10); return; }
    var s = Math.max(dw / img.width, dh / img.height), w = img.width * s, h = img.height * s;
    x.drawImage(img, dx + (dw - w) / 2, dy + (dh - h) * 0.3, w, h);
  }
  function roundRectPath(x, rx, ry, rw, rh, r) { x.beginPath(); x.moveTo(rx + r, ry); x.arcTo(rx + rw, ry, rx + rw, ry + rh, r); x.arcTo(rx + rw, ry + rh, rx, ry + rh, r); x.arcTo(rx, ry + rh, rx, ry, r); x.arcTo(rx, ry, rx + rw, ry, r); x.closePath(); }
  function confettiDots(x, R, n, colors, area) {
    for (var i = 0; i < n; i++) {
      x.save(); x.translate(area[0] + R() * area[2], area[1] + R() * area[3]); x.rotate(R() * Math.PI); x.fillStyle = colors[i % colors.length]; x.globalAlpha = .55 + R() * .45;
      if (i % 3) x.fillRect(-7, -14, 14, 28); else { x.beginPath(); x.arc(0, 0, 8, 0, Math.PI * 2); x.fill(); } x.restore();
    }
  }
  function balloon(x, cx, cy, r, col) {
    x.save(); x.strokeStyle = 'rgba(0,0,0,.25)'; x.lineWidth = 3; x.beginPath(); x.moveTo(cx, cy + r * 1.2); x.bezierCurveTo(cx - 20, cy + r * 1.8, cx + 20, cy + r * 2.3, cx, cy + r * 3); x.stroke();
    var g = x.createRadialGradient(cx - r * .35, cy - r * .4, r * .1, cx, cy, r * 1.25); g.addColorStop(0, '#ffffff'); g.addColorStop(.25, col); g.addColorStop(1, col);
    x.fillStyle = g; x.beginPath(); x.ellipse(cx, cy, r, r * 1.2, 0, 0, Math.PI * 2); x.fill();
    x.beginPath(); x.moveTo(cx - 10, cy + r * 1.2); x.lineTo(cx + 10, cy + r * 1.2); x.lineTo(cx, cy + r * 1.2 - 14); x.fill(); x.restore();
  }
  function trimLogo(logo) {   // the logo without its empty see-through edges
    if (logo.__trim) return logo.__trim;
    var c = document.createElement('canvas'); c.width = logo.naturalWidth || logo.width; c.height = logo.naturalHeight || logo.height;
    var t = c.getContext('2d'); t.drawImage(logo, 0, 0); var box = { x: 0, y: 0, w: c.width, h: c.height };
    try {
      var px = t.getImageData(0, 0, c.width, c.height).data, x0 = c.width, y0 = c.height, x1 = -1, y1 = -1;
      for (var y = 0; y < c.height; y++) for (var x = 0; x < c.width; x++) if (px[(y * c.width + x) * 4 + 3] > 24) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      if (x1 > x0 && y1 > y0) box = { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
    } catch (e) {}
    return (logo.__trim = box);
  }
  function bigLogo(x, logo, left, top, w) {   // the church logo itself, big enough to read (no circle behind it)
    if (!logo) return; var b = trimLogo(logo), h = w * b.h / b.w;
    if (h > w * 1.25) { h = w * 1.25; w = h * b.w / b.h; }
    x.save(); x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = 22; x.shadowOffsetY = 6;
    x.drawImage(logo, b.x, b.y, b.w, b.h, left, top, w, h); x.restore();
  }
    function logoBadge(x, logo, cx, cy, r) {   // big, bold church logo: white disc with a thick gold ring
    if (!logo) return; r = Math.round(r * 1.7); var ring = Math.max(7, r * .1);
    cx = Math.min(Math.max(cx, r + ring + 14), CARD_W - r - ring - 14); cy = Math.max(cy, r + ring + 14);
    x.save(); x.beginPath(); x.arc(cx, cy, r + ring, 0, Math.PI * 2); var g = x.createLinearGradient(0, cy - r, 0, cy + r); g.addColorStop(0, '#fff1b8'); g.addColorStop(.5, '#d4a02c'); g.addColorStop(1, '#f3d27a'); x.fillStyle = g; x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 24; x.shadowOffsetY = 6; x.fill(); x.restore();
    x.save(); x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.fillStyle = '#fff'; x.fill(); x.restore();
    var s = Math.min(r * 1.72 / logo.width, r * 1.72 / logo.height); x.drawImage(logo, cx - logo.width * s / 2, cy - logo.height * s / 2, logo.width * s, logo.height * s);
  }
  function familyLine(x, text, cx, y, color, align) {   // "with love from the HOCFAM family", big and bold
    x.textAlign = align || 'center'; var maxW = align === 'left' ? CARD_W - cx - 50 : CARD_W - 120;
    fitText(x, text, maxW, 42, 800, SANS, 26); x.fillStyle = color; x.fillText(text, cx, y);
  }
  // card designs: each takes (x, d) where d = { img, logo, name, date, wish, verse, yo, family, church, pal, R, kind }

  function cardTitle(d) { return d.kind === 'anniv' ? 'Happy Anniversary' : 'Happy Birthday'; }
  function goldFill(x, y0, y1) { var g = x.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#fff3c4'); g.addColorStop(.45, '#e9b949'); g.addColorStop(.55, '#c8901f'); g.addColorStop(1, '#f6d77a'); return g; }
  function star(x, cx, cy, r, n, inner) { x.beginPath(); for (var i = 0; i < n * 2; i++) { var rr = i % 2 ? r * (inner || .45) : r, a = Math.PI * i / n - Math.PI / 2; x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } x.closePath(); }
  function sparkle(x, cx, cy, r, col) { x.save(); x.fillStyle = col; star(x, cx, cy, r, 4, .22); x.fill(); x.restore(); }
  function heartPath(x, cx, cy, s) { x.beginPath(); x.moveTo(cx, cy + s * .35); x.bezierCurveTo(cx - s * 1.1, cy - s * .35, cx - s * .45, cy - s * 1.05, cx, cy - s * .5); x.bezierCurveTo(cx + s * .45, cy - s * 1.05, cx + s * 1.1, cy - s * .35, cx, cy + s * .35); x.closePath(); }
  function hexPath(x, cx, cy, r) { x.beginPath(); for (var i = 0; i < 6; i++) { var a = Math.PI / 3 * i - Math.PI / 6; x.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } x.closePath(); }
  function leaf(x, cx, cy, len, ang, col) { x.save(); x.translate(cx, cy); x.rotate(ang); x.fillStyle = col; x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(len * .5, -len * .28, len, 0); x.quadraticCurveTo(len * .5, len * .28, 0, 0); x.fill(); x.restore(); }
  function flower(x, cx, cy, r, col, mid) { x.save(); x.fillStyle = col; for (var i = 0; i < 5; i++) { var a = Math.PI * 2 / 5 * i; x.beginPath(); x.ellipse(cx + Math.cos(a) * r * .55, cy + Math.sin(a) * r * .55, r * .55, r * .38, a, 0, Math.PI * 2); x.fill(); } x.fillStyle = mid; x.beginPath(); x.arc(cx, cy, r * .32, 0, Math.PI * 2); x.fill(); x.restore(); }
  function clipDraw(x, path, img, dx, dy, dw, dh) { x.save(); path(); x.clip(); coverImg(x, img, dx, dy, dw, dh); x.restore(); }
  var DESIGNS = [
    function goldRing(x, d) {   // deep colour, glowing ring photo, confetti
      var p = d.pal, g = x.createRadialGradient(540, 470, 60, 540, 600, 900); g.addColorStop(0, p[0]); g.addColorStop(1, '#09060f'); x.fillStyle = g; x.fillRect(0, 0, CARD_W, CARD_H);
      confettiDots(x, d.R, 26, [p[1], '#ffffff', p[2]], [0, 280, 280, 560]); confettiDots(x, d.R, 26, [p[1], '#ffffff', p[2]], [800, 280, 280, 560]);
      bigLogo(x, d.logo, 24, 24, 200);
      x.textAlign = 'center'; fitText(x, d.kind === 'anniv' ? 'Happy Anniversary' : 'Happy Birthday', 560, 96, 400, SCRIPT, 60); x.fillStyle = p[1]; x.fillText(d.kind === 'anniv' ? 'Happy Anniversary' : 'Happy Birthday', 560, 262);
      photoCircle(x, d.img, 540, 560, 230, p[1], 14);
      var s = fitText(x, d.name, 960, 66, 800, SANS); x.fillStyle = '#fff'; x.fillText(d.name, 540, 885);
      x.font = '700 30px ' + SANS; x.fillStyle = p[1]; x.fillText(d.date.toUpperCase(), 540, 935);
      var y = drawText(x, d.wish, 540, 1000, 900, 31, 400, SANS, 'rgba(255,255,255,.92)', 1.4);
      if (d.yo) drawText(x, d.yo, 540, y + 12, 900, 27, 600, SANS, p[2], 1.35);
      familyLine(x, 'With love from ' + d.family, 540, 1300, p[1]);
    },
    function splitPanel(x, d) {   // big photo across the top, colour panel below with a slanted edge
      var p = d.pal; x.fillStyle = p[0]; x.fillRect(0, 0, CARD_W, CARD_H);
      x.save(); x.beginPath(); x.moveTo(0, 0); x.lineTo(CARD_W, 0); x.lineTo(CARD_W, 640); x.lineTo(0, 760); x.closePath(); x.clip(); coverImg(x, d.img, 0, 0, CARD_W, 760);
      var gg = x.createLinearGradient(0, 520, 0, 760); gg.addColorStop(0, 'rgba(0,0,0,0)'); gg.addColorStop(1, 'rgba(0,0,0,.45)'); x.fillStyle = gg; x.fillRect(0, 0, CARD_W, 760); x.restore();
      x.fillStyle = p[1]; x.beginPath(); x.moveTo(0, 760); x.lineTo(CARD_W, 640); x.lineTo(CARD_W, 668); x.lineTo(0, 788); x.closePath(); x.fill();
      bigLogo(x, d.logo, 856, 24, 200);
      x.textAlign = 'left'; x.font = '800 30px ' + SANS; x.fillStyle = p[1]; x.fillText('HAPPY', 70, 860);
      x.font = '400 92px ' + SCRIPT; x.fillStyle = '#fff'; x.fillText(d.kind === 'anniv' ? 'Anniversary' : 'Birthday', 64, 950);
      var s = fitText(x, d.name, 600, 52, 800, SANS, 32); x.textAlign = 'right'; x.fillStyle = '#fff'; x.fillText(d.name, 1010, 860);
      x.font = '700 28px ' + SANS; x.fillStyle = p[1]; x.fillText(d.date, 1010, 905);
      var y = drawText(x, d.wish, 70, 1020, 940, 30, 400, SANS, 'rgba(255,255,255,.92)', 1.42, 'left');
      if (d.verse) { y = drawText(x, '“' + d.verse[0] + '” — ' + d.verse[1], 70, y + 18, 940, 24, 400, SERIF, p[2], 1.4, 'left'); }
      familyLine(x, 'From ' + d.family + ' 🎉', 70, 1300, p[1], 'left');
    },
    function balloons(x, d) {   // bright, playful, balloons and an arch photo
      var p = d.pal, g = x.createLinearGradient(0, 0, 0, CARD_H); g.addColorStop(0, p[2]); g.addColorStop(1, '#ffffff'); x.fillStyle = g; x.fillRect(0, 0, CARD_W, CARD_H);
      var cols = [p[0], p[1], '#ff6b6b', '#4dabf7', '#51cf66'];
      for (var i = 0; i < 7; i++) balloon(x, i < 4 ? 60 + i * 70 + d.R() * 30 : 820 + (i - 4) * 80 + d.R() * 20, 140 + d.R() * 160, 46 + d.R() * 16, cols[i % cols.length]);
      bigLogo(x, d.logo, 450, 4, 180);
      x.save(); roundRectPath(x, 290, 200, 500, 560, 250); x.fillStyle = p[0]; x.shadowColor = 'rgba(0,0,0,.25)'; x.shadowBlur = 30; x.fill(); x.restore();
      x.save(); roundRectPath(x, 305, 215, 470, 530, 235); x.clip(); coverImg(x, d.img, 305, 215, 470, 530); x.restore();
      x.font = '900 72px ' + SANS; x.fillStyle = p[0]; x.textAlign = 'center'; x.fillText(d.kind === 'anniv' ? 'HAPPY ANNIVERSARY' : 'HAPPY BIRTHDAY', 540, 850);
      var s = fitText(x, d.name, 960, 58, 800, SANS); x.fillStyle = '#1d1530'; x.fillText(d.name, 540, 925);
      x.font = '700 28px ' + SANS; x.fillStyle = p[0]; x.fillText('🎂  ' + d.date + '  🎂', 540, 975);
      var y = drawText(x, d.wish, 540, 1035, 900, 30, 400, SANS, '#3b3350', 1.4);
      x.fillStyle = p[0]; x.fillRect(0, CARD_H - 96, CARD_W, 96); familyLine(x, 'Love from ' + d.family, 540, CARD_H - 33, '#fff');
    },
    function polaroid(x, d) {   // cream paper, tilted polaroid with tape, serif headline
      var p = d.pal; x.fillStyle = '#f6efe3'; x.fillRect(0, 0, CARD_W, CARD_H);
      x.fillStyle = p[0]; x.globalAlpha = .08; for (var i = 0; i < 14; i++) { x.beginPath(); x.arc(d.R() * CARD_W, d.R() * CARD_H, 30 + d.R() * 90, 0, Math.PI * 2); x.fill(); } x.globalAlpha = 1;
      bigLogo(x, d.logo, 24, 24, 210);
      x.save(); x.translate(540, 470); x.rotate(-0.05 + d.R() * 0.03); x.shadowColor = 'rgba(0,0,0,.3)'; x.shadowBlur = 30; x.shadowOffsetY = 12; x.fillStyle = '#fff'; x.fillRect(-270, -300, 540, 620); x.shadowColor = 'transparent';
      coverImg(x, d.img, -240, -270, 480, 480); x.font = '400 46px ' + SCRIPT; x.fillStyle = '#333'; x.textAlign = 'center'; x.fillText(firstName(d.name) + ' ♥', 0, 290);
      x.fillStyle = hexA(p[1], .75); x.fillRect(-70, -322, 140, 44); x.restore();
      x.font = 'italic 700 74px ' + SERIF; x.fillStyle = p[0]; x.textAlign = 'center'; x.fillText(d.kind === 'anniv' ? 'Happy Anniversary' : 'Happy Birthday', 540, 900);
      var s = fitText(x, d.name, 960, 48, 700, SANS); x.fillStyle = '#1d1530'; x.fillText(d.name + '  ·  ' + d.date, 540, 960);
      var y = drawText(x, d.wish, 540, 1025, 880, 30, 400, SERIF, '#3b3350', 1.42);
      familyLine(x, '— ' + d.family, 540, 1305, p[0]);
    },
    function bokehNight(x, d) {   // photo blurred behind, glowing lights, sharp circle photo
      var p = d.pal; x.fillStyle = '#0a0710'; x.fillRect(0, 0, CARD_W, CARD_H);
      if (d.img) { x.save(); x.filter = 'blur(38px) brightness(.45) saturate(1.3)'; coverImg(x, d.img, -80, -80, CARD_W + 160, CARD_H + 160); x.restore(); }
      for (var i = 0; i < 26; i++) { var r = 20 + d.R() * 70, bx = d.R() * CARD_W, by = d.R() * CARD_H, gg = x.createRadialGradient(bx, by, 0, bx, by, r); gg.addColorStop(0, hexA(i % 2 ? p[1] : p[2], .55)); gg.addColorStop(1, hexA(p[1], 0)); x.fillStyle = gg; x.beginPath(); x.arc(bx, by, r, 0, Math.PI * 2); x.fill(); }
      bigLogo(x, d.logo, 24, 24, 200);
      photoCircle(x, d.img, 540, 420, 210, '#ffffff', 10);
      x.font = '400 96px ' + SCRIPT; x.fillStyle = '#fff'; x.textAlign = 'center'; x.fillText(d.kind === 'anniv' ? 'Happy Anniversary' : 'Happy Birthday', 540, 760);
      var s = fitText(x, d.name, 960, 60, 800, SANS); x.fillStyle = p[1]; x.fillText(d.name.toUpperCase(), 540, 845);
      x.font = '600 28px ' + SANS; x.fillStyle = 'rgba(255,255,255,.85)'; x.fillText(d.date, 540, 893);
      var y = drawText(x, d.wish, 540, 960, 900, 31, 400, SANS, '#fff', 1.42);
      if (d.verse) { y = drawText(x, '“' + d.verse[0] + '” — ' + d.verse[1], 540, y + 16, 860, 24, 400, SERIF, p[2], 1.4); }
      familyLine(x, 'Celebrating you · ' + d.family, 540, 1305, p[1]);
    },
    function geometric(x, d) {   // bold diagonal blocks, rounded square photo
      var p = d.pal; x.fillStyle = '#ffffff'; x.fillRect(0, 0, CARD_W, CARD_H);
      x.fillStyle = p[0]; x.beginPath(); x.moveTo(0, 0); x.lineTo(CARD_W, 0); x.lineTo(CARD_W, 520); x.lineTo(0, 760); x.closePath(); x.fill();
      x.fillStyle = p[1]; x.beginPath(); x.moveTo(0, 760); x.lineTo(CARD_W, 520); x.lineTo(CARD_W, 560); x.lineTo(0, 800); x.closePath(); x.fill();
      x.fillStyle = hexA(p[1], .18); for (var i = 0; i < 6; i++) { x.beginPath(); x.arc(80 + d.R() * 920, 60 + d.R() * 380, 10 + d.R() * 26, 0, Math.PI * 2); x.fill(); }
      bigLogo(x, d.logo, 876, 16, 180);
      x.textAlign = 'left'; x.font = '900 86px ' + SANS; x.fillStyle = '#fff'; x.fillText('HAPPY', 70, 270); x.fillStyle = p[1]; x.fillText(d.kind === 'anniv' ? 'ANNIVERSARY' : 'BIRTHDAY', 70, 360);
      x.font = '700 30px ' + SANS; x.fillStyle = 'rgba(255,255,255,.9)'; x.fillText(d.date.toUpperCase(), 70, 420);
      x.save(); x.translate(800, 490); x.rotate(0.06); roundRectPath(x, -210, -240, 420, 480, 40); x.fillStyle = p[1]; x.shadowColor = 'rgba(0,0,0,.3)'; x.shadowBlur = 30; x.fill(); x.restore();
      x.save(); x.translate(800, 490); x.rotate(0.06); roundRectPath(x, -195, -225, 390, 450, 32); x.clip(); coverImg(x, d.img, -195, -225, 390, 450); x.restore();
      var s = fitText(x, d.name, 940, 60, 900, SANS); x.textAlign = 'left'; x.fillStyle = p[0]; x.fillText(d.name, 70, 900);
      var y = drawText(x, d.wish, 70, 965, 900, 31, 400, SANS, '#2b2340', 1.42, 'left');
      if (d.yo) drawText(x, d.yo, 70, y + 10, 900, 27, 700, SANS, p[0], 1.35, 'left');
      x.fillStyle = p[0]; x.fillRect(70, 1268, 80, 6); familyLine(x, 'With love, ' + d.family, 170, 1282, '#2b2340', 'left');
    },

    function royalCrown(x, d) {   // deep royal colour, gold frame, crown over the photo
      var p = d.pal, g = x.createLinearGradient(0, 0, 0, CARD_H); g.addColorStop(0, '#1a0b2e'); g.addColorStop(.5, p[0]); g.addColorStop(1, '#12081f'); x.fillStyle = g; x.fillRect(0, 0, CARD_W, CARD_H);
      x.strokeStyle = goldFill(x, 0, CARD_H); x.lineWidth = 6; x.strokeRect(36, 36, CARD_W - 72, CARD_H - 72); x.lineWidth = 2; x.strokeRect(52, 52, CARD_W - 104, CARD_H - 104);
      for (var i = 0; i < 18; i++) sparkle(x, 80 + d.R() * 920, 80 + d.R() * 560, 6 + d.R() * 12, 'rgba(255,230,160,.8)');
      photoCircle(x, d.img, 540, 520, 220, goldFill(x, 290, 750), 14);
      x.save(); x.translate(540, 262); x.fillStyle = goldFill(x, -70, 20); x.beginPath(); x.moveTo(-110, 20); x.lineTo(-130, -60); x.lineTo(-62, -18); x.lineTo(0, -82); x.lineTo(62, -18); x.lineTo(130, -60); x.lineTo(110, 20); x.closePath(); x.fill();
      x.fillStyle = '#fff'; [-130, 0, 130].forEach(function (cx, i) { x.beginPath(); x.arc(cx, i === 1 ? -88 : -66, 11, 0, Math.PI * 2); x.fill(); }); x.restore();
      bigLogo(x, d.logo, 64, 64, 180);
      x.font = '400 100px ' + SCRIPT; x.fillStyle = goldFill(x, 800, 900); x.textAlign = 'center'; x.fillText(cardTitle(d), 540, 870);
      fitText(x, d.name, 900, 56, 800, SANS); x.fillStyle = '#fff'; x.fillText(d.name, 540, 950);
      x.font = '700 28px ' + SANS; x.fillStyle = '#f2cf73'; x.fillText('✦  ' + d.date.toUpperCase() + '  ✦', 540, 998);
      var y = drawText(x, d.wish, 540, 1058, 860, 29, 400, SANS, 'rgba(255,255,255,.9)', 1.42);
      familyLine(x, 'With love from ' + d.family, 540, 1275, '#f2cf73');
    },
    function floralWreath(x, d) {   // soft cream, a wreath of leaves and flowers around the photo
      var p = d.pal; x.fillStyle = '#fbf6ee'; x.fillRect(0, 0, CARD_W, CARD_H);
      x.fillStyle = hexA(p[1], .12); x.beginPath(); x.arc(540, 500, 420, 0, Math.PI * 2); x.fill();
      photoCircle(x, d.img, 540, 500, 230, '#ffffff', 10);
      var greens = ['#5b8c5a', '#7aa874', '#3f6e47'], flowers = ['#e98a9a', '#f4c26b', '#f6a5c0', '#ffffff'];
      for (var i = 0; i < 46; i++) { var a = Math.PI * 2 * i / 46 + d.R() * .08, r = 262 + d.R() * 18; leaf(x, 540 + Math.cos(a) * r, 500 + Math.sin(a) * r, 52 + d.R() * 26, a + Math.PI / 2 + (i % 2 ? .5 : -.5), greens[i % 3]); }
      for (var j = 0; j < 14; j++) { var b = Math.PI * 2 * j / 14 + d.R() * .2; flower(x, 540 + Math.cos(b) * 268, 500 + Math.sin(b) * 268, 26 + d.R() * 12, flowers[j % flowers.length], '#f7d26a'); }
      bigLogo(x, d.logo, 30, 30, 200);
      x.font = 'italic 700 78px ' + SERIF; x.fillStyle = p[0]; x.textAlign = 'center'; x.fillText(cardTitle(d), 540, 900);
      fitText(x, d.name, 920, 52, 700, SANS); x.fillStyle = '#2d2433'; x.fillText(d.name, 540, 965);
      x.font = '600 27px ' + SANS; x.fillStyle = '#8a6d3b'; x.fillText(d.date, 540, 1008);
      var y = drawText(x, d.wish, 540, 1068, 860, 29, 400, SERIF, '#4a3f52', 1.45);
      familyLine(x, '❀  ' + d.family + '  ❀', 540, 1290, p[0]);
    },
    function sunburst(x, d) {   // bright rays from behind the photo
      var p = d.pal; x.fillStyle = p[1]; x.fillRect(0, 0, CARD_W, CARD_H);
      x.save(); x.translate(540, 470); for (var i = 0; i < 28; i++) { x.rotate(Math.PI * 2 / 28); x.fillStyle = i % 2 ? hexA('#ffffff', .22) : hexA(p[0], .12); x.beginPath(); x.moveTo(0, 0); x.lineTo(-90, -1100); x.lineTo(90, -1100); x.closePath(); x.fill(); } x.restore();
      var rg = x.createRadialGradient(540, 470, 100, 540, 470, 700); rg.addColorStop(0, 'rgba(255,255,255,.5)'); rg.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = rg; x.fillRect(0, 0, CARD_W, CARD_H);
      confettiDots(x, d.R, 40, [p[0], '#ffffff', '#ff6b6b'], [0, 0, CARD_W, 760]);
      photoCircle(x, d.img, 540, 470, 235, '#ffffff', 16);
      bigLogo(x, d.logo, 24, 24, 200);
      x.fillStyle = p[0]; x.fillRect(0, 790, CARD_W, CARD_H - 790);
      x.font = '900 76px ' + SANS; x.fillStyle = '#fff'; x.textAlign = 'center'; x.fillText(cardTitle(d).toUpperCase(), 540, 880);
      fitText(x, d.name, 940, 54, 800, SANS); x.fillStyle = p[1]; x.fillText(d.name, 540, 950);
      x.font = '700 28px ' + SANS; x.fillStyle = 'rgba(255,255,255,.85)'; x.fillText(d.date, 540, 995);
      var y = drawText(x, d.wish, 540, 1055, 880, 29, 400, SANS, '#ffffff', 1.42);
      familyLine(x, 'From ' + d.family, 540, 1300, p[1]);
    },
    function blackGold(x, d) {   // elegant black and gold, arched photo
      x.fillStyle = '#0c0b0a'; x.fillRect(0, 0, CARD_W, CARD_H);
      var gg = x.createRadialGradient(540, 300, 50, 540, 300, 800); gg.addColorStop(0, 'rgba(201,150,40,.22)'); gg.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gg; x.fillRect(0, 0, CARD_W, CARD_H);
      x.strokeStyle = goldFill(x, 0, CARD_H); x.lineWidth = 3; x.strokeRect(40, 40, CARD_W - 80, CARD_H - 80);
      x.save(); roundRectPath(x, 300, 150, 480, 600, 240); x.strokeStyle = goldFill(x, 150, 750); x.lineWidth = 12; x.stroke(); x.restore();
      clipDraw(x, function () { roundRectPath(x, 312, 162, 456, 576, 228); }, d.img, 312, 162, 456, 576);
      for (var i = 0; i < 10; i++) sparkle(x, 120 + d.R() * 840, 120 + d.R() * 640, 5 + d.R() * 10, 'rgba(246,215,122,.85)');
      bigLogo(x, d.logo, 60, 60, 200);
      x.font = '400 104px ' + SCRIPT; x.fillStyle = goldFill(x, 800, 880); x.textAlign = 'center'; x.fillText(cardTitle(d), 540, 860);
      fitText(x, d.name.toUpperCase(), 900, 46, 300, SANS); x.fillStyle = '#ffffff'; x.fillText(d.name.toUpperCase(), 540, 935);
      x.fillStyle = goldFill(x, 960, 964); x.fillRect(440, 962, 200, 3);
      x.font = '600 26px ' + SANS; x.fillStyle = '#e9c46a'; x.fillText(d.date.toUpperCase(), 540, 1005);
      var y = drawText(x, d.wish, 540, 1060, 840, 28, 400, SERIF, 'rgba(255,255,255,.88)', 1.45);
      familyLine(x, '— ' + d.family + ' —', 540, 1270, '#e9c46a');
    },
    function ankara(x, d) {   // African print bands at the top and bottom
      var p = d.pal; x.fillStyle = '#fffaf2'; x.fillRect(0, 0, CARD_W, CARD_H);
      function band(y0, h) {
        x.fillStyle = p[0]; x.fillRect(0, y0, CARD_W, h);
        for (var i = 0; i < 14; i++) { var cx = i * 80 + 40; x.fillStyle = p[1]; x.beginPath(); x.moveTo(cx, y0 + 12); x.lineTo(cx + 34, y0 + h / 2); x.lineTo(cx, y0 + h - 12); x.lineTo(cx - 34, y0 + h / 2); x.closePath(); x.fill();
          x.fillStyle = '#fff'; x.beginPath(); x.arc(cx, y0 + h / 2, 9, 0, Math.PI * 2); x.fill(); x.fillStyle = '#e4572e'; x.fillRect(cx + 36, y0 + 8, 8, h - 16); }
      }
      band(0, 120); band(CARD_H - 120, 120);
      bigLogo(x, d.logo, 30, 132, 190);
      photoCircle(x, d.img, 540, 470, 230, p[1], 12);
      x.save(); x.strokeStyle = p[0]; x.lineWidth = 4; x.setLineDash([14, 10]); x.beginPath(); x.arc(540, 470, 262, 0, Math.PI * 2); x.stroke(); x.restore();
      x.font = '900 70px ' + SANS; x.fillStyle = p[0]; x.textAlign = 'center'; x.fillText(cardTitle(d).toUpperCase(), 540, 820);
      fitText(x, d.name, 920, 54, 800, SANS); x.fillStyle = '#2b1d12'; x.fillText(d.name, 540, 890);
      x.font = '700 28px ' + SANS; x.fillStyle = '#e4572e'; x.fillText(d.date, 540, 935);
      var y = drawText(x, d.wish, 540, 995, 880, 29, 400, SANS, '#3d2f22', 1.42);
      if (d.yo) drawText(x, d.yo, 540, y + 10, 880, 26, 700, SANS, p[0], 1.35);
      familyLine(x, 'With love, ' + d.family, 540, CARD_H - 150, p[0]);
    },
    function starryHex(x, d) {   // night sky with stars, hexagon photo
      var p = d.pal, g = x.createLinearGradient(0, 0, 0, CARD_H); g.addColorStop(0, '#0b1533'); g.addColorStop(1, p[0]); x.fillStyle = g; x.fillRect(0, 0, CARD_W, CARD_H);
      for (var i = 0; i < 90; i++) { x.fillStyle = 'rgba(255,255,255,' + (.3 + d.R() * .7) + ')'; x.beginPath(); x.arc(d.R() * CARD_W, d.R() * 760, d.R() * 2.4 + .4, 0, Math.PI * 2); x.fill(); }
      for (var k = 0; k < 7; k++) { x.save(); x.fillStyle = hexA(p[1], .85); star(x, 80 + d.R() * 920, 60 + d.R() * 640, 10 + d.R() * 14, 5); x.fill(); x.restore(); }
      x.save(); hexPath(x, 540, 460, 270); x.fillStyle = p[1]; x.shadowColor = hexA(p[1], .7); x.shadowBlur = 50; x.fill(); x.restore();
      clipDraw(x, function () { hexPath(x, 540, 460, 252); }, d.img, 540 - 252, 460 - 252, 504, 504);
      bigLogo(x, d.logo, 24, 24, 200);
      x.font = '400 96px ' + SCRIPT; x.fillStyle = '#ffffff'; x.textAlign = 'center'; x.fillText(cardTitle(d), 540, 850);
      fitText(x, d.name, 920, 56, 800, SANS); x.fillStyle = p[1]; x.fillText(d.name, 540, 925);
      x.font = '600 28px ' + SANS; x.fillStyle = 'rgba(255,255,255,.8)'; x.fillText('★  ' + d.date + '  ★', 540, 972);
      var y = drawText(x, d.wish, 540, 1032, 880, 29, 400, SANS, '#ffffff', 1.42);
      if (d.verse) drawText(x, '“' + d.verse[0] + '” — ' + d.verse[1], 540, y + 14, 860, 23, 400, SERIF, p[2], 1.4);
      familyLine(x, 'You shine! · ' + d.family, 540, 1305, p[1]);
    },
    function bigDate(x, d) {   // huge day number behind, modern and clean
      var p = d.pal; x.fillStyle = p[2]; x.fillRect(0, 0, CARD_W, CARD_H);
      var day = String(d.date).split(' ')[0];
      x.font = '900 560px ' + SANS; x.textAlign = 'right'; x.fillStyle = hexA(p[0], .16); x.fillText(day, 1070, 780);
      x.save(); roundRectPath(x, 170, 170, 580, 580, 290); x.fillStyle = p[0]; x.shadowColor = 'rgba(0,0,0,.25)'; x.shadowBlur = 40; x.fill(); x.restore();
      photoCircle(x, d.img, 460, 460, 270, '#ffffff', 8);
      bigLogo(x, d.logo, 856, 24, 200);
      x.textAlign = 'left'; x.font = '800 30px ' + SANS; x.fillStyle = p[0]; x.fillText(d.date.toUpperCase(), 80, 120);
      x.textAlign = 'center'; x.font = '900 82px ' + SANS; x.fillStyle = p[0]; x.fillText(cardTitle(d), 540, 860);
      fitText(x, d.name, 920, 50, 700, SANS); x.fillStyle = '#1e1b2e'; x.fillText(d.name, 540, 925);
      var y = drawText(x, d.wish, 540, 990, 860, 29, 400, SANS, '#2f2b40', 1.42);
      x.fillStyle = p[0]; x.fillRect(0, CARD_H - 96, CARD_W, 96); familyLine(x, 'Celebrating you · ' + d.family, 540, CARD_H - 33, '#fff');
    },
    function magazine(x, d) {   // full photo like a magazine cover
      var p = d.pal; coverImg(x, d.img, 0, 0, CARD_W, CARD_H);
      var g = x.createLinearGradient(0, 0, 0, CARD_H); g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(.3, 'rgba(0,0,0,0)'); g.addColorStop(.55, 'rgba(0,0,0,.1)'); g.addColorStop(1, 'rgba(0,0,0,.88)'); x.fillStyle = g; x.fillRect(0, 0, CARD_W, CARD_H);
      x.textAlign = 'center'; x.font = '900 128px ' + SERIF; x.fillStyle = '#fff'; x.fillText(d.kind === 'anniv' ? 'TOGETHER' : 'CELEBRATE', 540, 170);
      x.font = '700 26px ' + SANS; x.fillStyle = p[1]; x.fillText((d.kind === 'anniv' ? 'ANNIVERSARY EDITION' : 'BIRTHDAY EDITION') + '  ·  ' + d.date.toUpperCase(), 540, 222);
      bigLogo(x, d.logo, 850, 250, 200);
      x.textAlign = 'left'; x.font = '400 84px ' + SCRIPT; x.fillStyle = p[1]; x.fillText(cardTitle(d), 64, 960);
      fitText(x, d.name, 950, 64, 900, SANS); x.fillStyle = '#fff'; x.fillText(d.name, 64, 1040);
      x.fillStyle = p[1]; x.fillRect(64, 1066, 120, 6);
      var y = drawText(x, d.wish, 64, 1120, 900, 28, 400, SANS, 'rgba(255,255,255,.92)', 1.4, 'left');
      familyLine(x, d.family.toUpperCase(), 64, 1300, p[1], 'left');
    },
    function heartsRibbons(x, d) {   // pastel, streamers, a heart frame for anniversaries
      var p = d.pal, g = x.createLinearGradient(0, 0, CARD_W, CARD_H); g.addColorStop(0, '#ffe3ec'); g.addColorStop(1, p[2]); x.fillStyle = g; x.fillRect(0, 0, CARD_W, CARD_H);
      var cols = ['#ff7aa2', p[1], '#7cc6fe', '#b388eb'];
      for (var i = 0; i < 9; i++) { x.strokeStyle = cols[i % cols.length]; x.lineWidth = 7; x.lineCap = 'round'; x.beginPath(); var sx = d.R() * CARD_W; x.moveTo(sx, -20); x.bezierCurveTo(sx + 120, 120, sx - 120, 260, sx + 60, 380 + d.R() * 120); x.stroke(); }
      for (var j = 0; j < 12; j++) { x.save(); x.fillStyle = hexA('#ff7aa2', .35 + d.R() * .4); heartPath(x, d.R() * CARD_W, 80 + d.R() * 700, 14 + d.R() * 22); x.fill(); x.restore(); }
      if (d.kind === 'anniv') {
        x.save(); heartPath(x, 540, 560, 330); x.fillStyle = '#fff'; x.shadowColor = 'rgba(0,0,0,.2)'; x.shadowBlur = 30; x.fill(); x.restore();
        clipDraw(x, function () { heartPath(x, 540, 556, 305); }, d.img, 230, 200, 620, 560);
      } else {
        photoCircle(x, d.img, 540, 480, 230, '#ffffff', 14);
      }
      bigLogo(x, d.logo, 24, 24, 200);
      x.font = '400 98px ' + SCRIPT; x.fillStyle = '#d6336c'; x.textAlign = 'center'; x.fillText(cardTitle(d), 540, 860);
      fitText(x, d.name, 920, 52, 800, SANS); x.fillStyle = '#3b2340'; x.fillText(d.name, 540, 930);
      x.font = '700 27px ' + SANS; x.fillStyle = '#d6336c'; x.fillText('♥  ' + d.date + '  ♥', 540, 975);
      var y = drawText(x, d.wish, 540, 1035, 880, 29, 400, SANS, '#4b3550', 1.42);
      familyLine(x, 'With love from ' + d.family, 540, 1300, '#d6336c');
    },
    function brushStroke(x, d) {   // soft paint blobs and a brush stroke behind the name
      var p = d.pal; x.fillStyle = '#ffffff'; x.fillRect(0, 0, CARD_W, CARD_H);
      for (var i = 0; i < 9; i++) { var bx = d.R() * CARD_W, by = d.R() * 760, br = 120 + d.R() * 220, gg = x.createRadialGradient(bx, by, 0, bx, by, br); gg.addColorStop(0, hexA(i % 2 ? p[1] : p[0], .28)); gg.addColorStop(1, hexA(p[0], 0)); x.fillStyle = gg; x.beginPath(); x.arc(bx, by, br, 0, Math.PI * 2); x.fill(); }
      x.save(); x.translate(540, 450); x.rotate(-0.04); roundRectPath(x, -250, -290, 500, 580, 36); x.fillStyle = '#fff'; x.shadowColor = 'rgba(0,0,0,.22)'; x.shadowBlur = 36; x.fill(); x.restore();
      x.save(); x.translate(540, 450); x.rotate(-0.04); clipDraw(x, function () { roundRectPath(x, -232, -272, 464, 544, 26); }, d.img, -232, -272, 464, 544); x.restore();
      bigLogo(x, d.logo, 24, 24, 200);
      x.save(); x.fillStyle = hexA(p[0], .92); x.beginPath(); x.moveTo(110, 905); x.bezierCurveTo(300, 870, 780, 880, 975, 895); x.lineTo(965, 960); x.bezierCurveTo(760, 975, 320, 968, 118, 975); x.closePath(); x.fill(); x.restore();
      x.font = '400 92px ' + SCRIPT; x.fillStyle = p[0]; x.textAlign = 'center'; x.fillText(cardTitle(d), 540, 850);
      fitText(x, d.name, 840, 52, 900, SANS); x.fillStyle = '#ffffff'; x.fillText(d.name, 540, 950);
      x.font = '700 27px ' + SANS; x.fillStyle = p[0]; x.fillText('✿  ' + d.date + '  ✿', 540, 1020);
      var y = drawText(x, d.wish, 540, 1078, 880, 29, 400, SANS, '#2e2a3a', 1.42);
      familyLine(x, '— ' + d.family, 540, 1300, p[0]);
    }
  ];
  var DESIGN_NAMES = ['Gold ring', 'Split photo', 'Balloons', 'Polaroid', 'Night lights', 'Bold shapes', 'Royal crown', 'Floral wreath', 'Sunburst', 'Black & gold', 'Ankara', 'Starry night', 'Big date', 'Magazine cover', 'Hearts & ribbons', 'Brush stroke'];
  var CHURCH_COLORS = ['#224165', '#c88b22', '#fff3d6'];   // Hocfam blue and gold

  function loadImg(src) {
    return new Promise(function (res) {
      if (!src) return res(null);
      var i = new Image(); i.crossOrigin = 'anonymous';
      i.onload = function () { res(i); }; i.onerror = function () { res(null); }; i.src = src;
    });
  }
  var fontsReady = null;
  function loadFonts() {
    if (fontsReady) return fontsReady;
    if (!document.querySelector('link[data-card-fonts]')) {
      var l = document.createElement('link'); l.rel = 'stylesheet'; l.dataset.cardFonts = '1';
      l.href = 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap'; document.head.appendChild(l);
    }
    fontsReady = Promise.race([document.fonts.load('400 100px "Great Vibes"'), new Promise(function (r) { setTimeout(r, 2500); })]).catch(function () {});
    return fontsReady;
  }

  export type CardPerson = { id: number | string; name: string; spouse?: string; day?: number | null; month?: number | null; annDay?: number | null; annMonth?: number | null; photo?: string };
  export type Card = { canvas: HTMLCanvasElement; design: string; name: string; first: string; kind: 'bday' | 'anniv'; date: string; wish: string };
  export const DESIGN_COUNT = DESIGNS.length;

  /** Draw one card. variant 0, 1, 2… gives a different design, colours and words each time. */
  export function makeCard(person: CardPerson, kind: 'bday' | 'anniv', variant = 0, opts: { family?: string; yoruba?: boolean } = {}): Promise<Card> {
    var yr = new Date().getFullYear(), base = hashStr(person.id + ':' + kind + ':' + yr), v = variant || 0;
    var di = (base + v) % DESIGNS.length;
    var seed = base + v * 7919, R = rng(seed);
    var pal = (seed >>> 3) % 3 === 0 ? CHURCH_COLORS : PALETTES[(seed >>> 5) % PALETTES.length];
    var name = kind === 'anniv' && person.spouse ? person.name + ' & ' + person.spouse : person.name;
    var wishes = kind === 'anniv' ? ANN_WISHES : WISHES;
    var wish = (wishes[(seed >>> 7) % wishes.length]).replace(/\{first\}/g, firstName(person.name));
    var date = kind === 'anniv' ? person.annDay + ' ' + MONTHS[(person.annMonth || 1) - 1] : person.day + ' ' + MONTHS[(person.month || 1) - 1];
    var verse = VERSES[(seed >>> 9) % VERSES.length], yo = opts.yoruba !== false && kind !== 'anniv' ? YO_WISHES[(seed >>> 11) % YO_WISHES.length] : '';
    return Promise.all([loadImg(person.photo ? getAssetUrl(person.photo) : ''), loadImg('/image/New_Logo.png'), loadFonts()]).then(function (im) {
      var cv = document.createElement('canvas'); cv.width = CARD_W; cv.height = CARD_H; var x = cv.getContext('2d');
      DESIGNS[di](x, { img: im[0], logo: im[1], name: name, date: date, wish: wish, verse: verse, yo: yo, family: opts.family || 'the HOCFAM family', church: 'Household Of Covenant And Faith Apostolic Ministry', pal: pal, R: R, kind: kind });
      return { canvas: cv, design: DESIGN_NAMES[di], name: name, first: firstName(person.name), kind: kind, date: date, wish: wish };
    });
  }
  export const cardBlob = (c: Card): Promise<Blob> => new Promise((res, rej) => c.canvas.toBlob((b) => (b ? res(b) : rej(new Error('Could not make the picture'))), 'image/jpeg', 0.9));
  export { firstName };
