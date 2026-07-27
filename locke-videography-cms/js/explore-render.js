(function(){
  // Reveal-capable elements must initialize regardless of whether the
  // CMS data fetch succeeds, so nothing is stuck invisible.
  document.addEventListener('DOMContentLoaded', function(){
    if(window.initDynamicInteractions) window.initDynamicInteractions();
  });

  var sidebar = document.getElementById('exploreSidebar');
  var vidA = document.getElementById('exploreVideoA');
  var vidB = document.getElementById('exploreVideoB');
  if(!sidebar) return;

  function esc(s){
    return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // Turns a plain Vimeo or YouTube share link into a clean, autoplaying,
  // looping, muted embed URL. Falls back to using the input as-is if it's
  // already a full embed URL (or something else entirely).
  function buildEmbedSrc(url){
    if(!url) return '';
    url = url.trim();
    var vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if(vimeoMatch){
      return 'https://player.vimeo.com/video/' + vimeoMatch[1] + '?background=1&autoplay=1&loop=1&muted=1';
    }
    var ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
    if(ytMatch){
      var id = ytMatch[1];
      return 'https://www.youtube.com/embed/' + id +
        '?autoplay=1&mute=1&loop=1&playlist=' + id + '&controls=0&modestbranding=1&rel=0';
    }
    return url;
  }

  function embedHtml(src){
    return '<iframe src="' + src + '" allow="autoplay; fullscreen" frameborder="0"></iframe>';
  }

  var active = vidA, standby = vidB;
  standby.style.transform = 'rotate(-18deg) scale(1.08)';

  function showVideo(rawUrl){
    if(!rawUrl) return;
    standby.innerHTML = embedHtml(buildEmbedSrc(rawUrl));
    requestAnimationFrame(function(){
      active.style.transform = 'rotate(18deg) scale(1.08)';
      active.classList.remove('is-active');
      standby.classList.add('is-active');
      var finished = active;
      var t = active; active = standby; standby = t;
      setTimeout(function(){
        finished.innerHTML = ''; // stop the hidden embed entirely
        finished.style.transition = 'none';
        finished.style.transform = 'rotate(-18deg) scale(1.08)';
        void finished.offsetWidth;
        finished.style.transition = '';
      }, 620);
    });
  }

  fetch('data/instagram-explore.json')
    .then(function(r){ return r.json(); })
    .then(function(data){
      var works = data.works || [];
      works.forEach(function(w, i){
        var item = document.createElement('div');
        item.className = 'e-item' + (i === 0 ? ' is-open' : '');
        item.innerHTML =
          '<button class="e-head" type="button">' +
            '<span class="e-textwrap">' +
              '<span class="e-title">' + esc(w.title) + '</span>' +
              '<span class="e-desc">' + esc(w.description) + '</span>' +
            '</span>' +
          '</button>';
        sidebar.appendChild(item);

        item.querySelector('.e-head').addEventListener('click', function(){
          var wasOpen = item.classList.contains('is-open');
          sidebar.querySelectorAll('.e-item').forEach(function(el){ el.classList.remove('is-open'); });
          if(!wasOpen){
            item.classList.add('is-open');
            showVideo(w.video);
          }
        });

        if(i === 0 && w.video){
          active.innerHTML = embedHtml(buildEmbedSrc(w.video));
          active.style.transform = 'rotate(0deg) scale(1.08)';
        }
      });

      if(window.initDynamicInteractions) window.initDynamicInteractions();
    })
    .catch(function(err){ console.error('Could not load instagram-explore.json', err); });
})();
