(function(){
  // Reveal-capable elements (e.g. still boxes) must initialize regardless
  // of whether the CMS data fetch succeeds, so they're never stuck invisible.
  document.addEventListener('DOMContentLoaded', function(){
    if(window.initDynamicInteractions) window.initDynamicInteractions();
  });

  function esc(s){
    return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  fetch('data/travel-works.json')
    .then(function(r){ return r.json(); })
    .then(function(data){
      var works = data.works || [];
      var recent = works.filter(function(w){ return w.section === 'recent'; }).slice(0, 4);
      var past   = works.filter(function(w){ return w.section === 'past'; }).slice(0, 6);

      // ---- hero: background layers ----
      var bg = document.getElementById('heroBg');
      recent.forEach(function(w, i){
        var layer = document.createElement('div');
        layer.className = 'bg-layer' + (i === 0 ? ' active' : '');
        layer.setAttribute('data-id', i + 1);
        if (w.cover_image) {
          layer.style.backgroundImage = 'url(' + w.cover_image + ')';
          layer.style.backgroundSize = 'cover';
          layer.style.backgroundPosition = 'center';
        } else {
          var span = document.createElement('span');
          span.textContent = 'STILL — ' + (w.title || '').toUpperCase();
          layer.appendChild(span);
        }
        bg.appendChild(layer);
      });

      // ---- hero: title list ----
      var titleList = document.getElementById('heroTitles');
      recent.forEach(function(w, i){
        var a = document.createElement('a');
        a.href = w.slug + '.html';
        if (i === 0) a.className = 'active';
        a.setAttribute('data-target', i + 1);
        a.innerHTML = '<span class="tname">' + esc(w.title) + '</span><span class="tyear">' + esc(w.year) + '</span>';
        titleList.appendChild(a);
      });

      // ---- past works grid ----
      var areas = ['a','b','c','d','e','f'];
      var grid = document.getElementById('pastGrid');
      past.forEach(function(w, i){
        var a = document.createElement('a');
        a.href = w.slug + '.html';
        a.className = 'btile';
        a.style.setProperty('--area', areas[i]);

        var cover = document.createElement('div');
        cover.className = 'cover';
        if (w.cover_image) {
          cover.style.backgroundImage = 'url(' + w.cover_image + ')';
          cover.style.backgroundSize = 'cover';
          cover.style.backgroundPosition = 'center';
        } else {
          cover.innerHTML = '<span>COVER</span>';
        }

        var info = document.createElement('div');
        info.className = 'info';
        info.innerHTML =
          '<h4>' + esc(w.title) + '</h4>' +
          '<p class="flabel">LOCATION</p><p class="fval">' + esc(w.location) + '</p>' +
          '<p class="flabel">YEAR</p><p class="fval">' + esc(w.year) + '</p>';

        a.appendChild(cover);
        a.appendChild(info);
        grid.appendChild(a);
      });

      if (window.initDynamicInteractions) window.initDynamicInteractions();
    })
    .catch(function(err){
      console.error('Could not load travel-works.json', err);
    });
})();
