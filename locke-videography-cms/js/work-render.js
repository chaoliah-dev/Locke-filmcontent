(function(){
  var slug = document.body.getAttribute('data-slug');
  if (!slug) return;

  fetch('data/travel-works.json')
    .then(function(r){ return r.json(); })
    .then(function(data){
      var w = (data.works || []).find(function(x){ return x.slug === slug; });
      if (!w) { console.error('No work found for slug', slug); return; }

      document.title = w.title + ' — Locke Videography';

      var h1 = document.getElementById('workTitle');
      if (h1) h1.textContent = w.title;

      var meta = document.getElementById('workMeta');
      if (meta) meta.textContent = 'TRAVEL FILM — ' + (w.location || '').toUpperCase() + ' — ' + w.year;

      var desc = document.getElementById('workDesc');
      if (desc && w.description) desc.textContent = w.description;

      if (w.video_embed) {
        var vw = document.getElementById('videoWrap');
        if (vw) vw.innerHTML = w.video_embed;
      }

      ['1','2','3'].forEach(function(n){
        var img = w['still_' + n];
        if (!img) return;
        var el = document.querySelector('.spiral .s' + n);
        if (el) {
          el.style.backgroundImage = 'url(' + img + ')';
          el.style.backgroundSize = 'cover';
          el.style.backgroundPosition = 'center';
          var span = el.querySelector('span');
          if (span) span.remove();
        }
      });

      if (window.initDynamicInteractions) window.initDynamicInteractions();
    })
    .catch(function(err){
      console.error('Could not load travel-works.json', err);
    });
})();
