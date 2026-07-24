(function(){
  // Reveal-capable elements (e.g. still boxes) must initialize regardless
  // of whether the CMS data fetch succeeds, so they're never stuck invisible.
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

  var active = vidA, standby = vidB;

  // Prime the standby element so its first entrance also rotates in correctly.
  standby.style.transform = 'rotate(-18deg) scale(1.08)';

  function showVideo(src){
    if(!src) return;
    standby.src = src;
    var p = standby.play();
    var swap = function(){
      requestAnimationFrame(function(){
        active.style.transform = 'rotate(18deg) scale(1.08)';
        active.classList.remove('is-active');
        standby.classList.add('is-active');
        var finished = active;
        var t = active; active = standby; standby = t;
        setTimeout(function(){
          finished.pause();
          finished.style.transition = 'none';
          finished.style.transform = 'rotate(-18deg) scale(1.08)';
          void finished.offsetWidth;
          finished.style.transition = '';
        }, 620);
      });
    };
    if(p && p.then){ p.then(swap).catch(swap); } else { swap(); }
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
          active.src = w.video;
          active.style.transform = 'rotate(0deg) scale(1.08)';
          var p = active.play();
          if(p && p.catch){ p.catch(function(){}); }
        }
      });

      if(window.initDynamicInteractions) window.initDynamicInteractions();
    })
    .catch(function(err){ console.error('Could not load instagram-explore.json', err); });
})();
