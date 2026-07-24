(function(){
  // Reveal-capable elements (e.g. still boxes) must initialize regardless
  // of whether the CMS data fetch succeeds, so they're never stuck invisible.
  document.addEventListener('DOMContentLoaded', function(){
    if(window.initDynamicInteractions) window.initDynamicInteractions();
  });

  var track = document.getElementById('carouselTrack');
  var stage = document.getElementById('carouselStage');
  var ring  = document.getElementById('ring');
  var dots  = document.getElementById('ringDots');
  if(!track || !ring) return;

  var cards = Array.prototype.slice.call(ring.querySelectorAll('.glasscard'));
  var N = cards.length;
  var STEP = 360 / N;
  var RADIUS = 430;

  cards.forEach(function(){
    var d = document.createElement('i');
    dots.appendChild(d);
  });
  var dotEls = Array.prototype.slice.call(dots.children);

  // Place each card around the ring, facing outward.
  function layout(){
    var w = ring.getBoundingClientRect().width;
    RADIUS = Math.max(320, w * 0.92);
    cards.forEach(function(c, i){
      c.style.transform =
        'rotateY(' + (i * STEP) + 'deg) translateZ(' + RADIUS + 'px)';
    });
  }

  var current = -1;
  function render(){
    var rect = track.getBoundingClientRect();
    var scrollable = track.offsetHeight - window.innerHeight;
    var progress = scrollable > 0 ? (-rect.top) / scrollable : 0;
    progress = Math.max(0, Math.min(1, progress));

    // Rotate through N-1 steps so the last card lands centered at the end.
    var angle = -progress * STEP * (N - 1);
    ring.style.transform = 'translateZ(-' + RADIUS + 'px) rotateY(' + angle + 'deg)';

    var active = Math.round(progress * (N - 1));
    if(active !== current){
      current = active;
      dotEls.forEach(function(d, i){
        d.classList.toggle('on', i === active);
      });
    }

    // Fade cards that have rotated to the back of the ring.
    cards.forEach(function(c, i){
      var rel = ((i * STEP + angle) % 360 + 360) % 360;
      var facing = Math.cos(rel * Math.PI / 180);
      c.style.opacity = (0.25 + 0.75 * Math.max(0, facing)).toFixed(3);
      c.style.pointerEvents = facing > 0.75 ? 'auto' : 'none';
    });
  }

  var ticking = false;
  function onScroll(){
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(function(){
      render();
      ticking = false;
    });
  }

  layout();
  render();
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', function(){ layout(); render(); });

  // Background comes from ai-assets.json; the 4 cards share the same
  // data source as the archive/detail pages, so there's one place to edit.
  fetch('data/ai-assets.json')
    .then(function(r){ return r.json(); })
    .then(function(data){
      if(data.background_image){
        document.getElementById('stageBg').style.backgroundImage = 'url(' + data.background_image + ')';
      }
    })
    .catch(function(){});

  fetch('data/ai-archive.json')
    .then(function(r){ return r.json(); })
    .then(function(data){
      var works = data.works || [];
      works.slice(0,4).forEach(function(w, i){
        var card = cards[i];
        if(!card) return;
        if(w.slug){
          card.href = w.slug + '.html';
          card.classList.remove('no-op');
        }
        if(w.image){
          card.querySelector('.gc-media').style.backgroundImage = 'url(' + w.image + ')';
        }
        if(w.title){
          card.querySelector('.gc-title').textContent = w.title;
        }
      });
    })
    .catch(function(){ /* placeholders remain */ });
})();
