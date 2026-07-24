(function(){
  var video = document.getElementById('heroClip');
  var cta = document.getElementById('heroCta');
  var scroll = document.getElementById('heroScroll');

  // Card reveals etc. must initialize regardless of the video's fate.
  // Deferred to DOMContentLoaded so this works no matter where this
  // script tag sits relative to the shared script that defines it.
  document.addEventListener('DOMContentLoaded', function(){
    if(window.initDynamicInteractions) window.initDynamicInteractions();
  });

  if(!video) return;

  function reveal(){
    if(cta) cta.classList.add('show');
    if(scroll) scroll.classList.add('show');
  }

  // Freeze on the final frame when playback ends.
  video.addEventListener('ended', function(){
    try { video.pause(); video.currentTime = Math.max(0, video.duration - 0.05); } catch(e){}
    reveal();
  });

  // Safety net: if the video can't play (missing file, autoplay blocked,
  // reduced-motion), still show the button so the page is never stuck.
  video.addEventListener('error', reveal);
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  fetch('data/home.json')
    .then(function(r){ return r.json(); })
    .then(function(data){
      if(data.hero_poster){ video.setAttribute('poster', data.hero_poster); }
      if(data.hero_video){
        video.src = data.hero_video;
        if(reduce){
          // Respect reduced-motion: show poster + button, don't autoplay.
          reveal();
          return;
        }
        var p = video.play();
        if(p && p.catch){ p.catch(function(){ reveal(); }); }
      } else {
        // No video set yet — reveal button over the dark background.
        reveal();
      }
    })
    .catch(function(){ reveal(); });
})();
