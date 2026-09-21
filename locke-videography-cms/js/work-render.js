(function(){
  // Reveal-capable elements (e.g. still boxes) must initialize regardless
  // of whether the CMS data fetch succeeds, so they're never stuck invisible.
  document.addEventListener('DOMContentLoaded', function(){
    if(window.initDynamicInteractions) window.initDynamicInteractions();
  });

  var querySlug = new URLSearchParams(window.location.search).get('slug');
  var pageSlug = document.body.getAttribute('data-slug');
  var slug = querySlug || pageSlug;

  function showError(message){
    document.title = 'Film not found — Locke Videography';
    var h1 = document.getElementById('workTitle');
    var meta = document.getElementById('workMeta');
    var desc = document.getElementById('workDesc');
    if(h1) h1.textContent = 'Film not found';
    if(meta) meta.textContent = '';
    if(desc) desc.textContent = message;
  }

  if (!slug) {
    showError('No film was selected. Return to Travel Film and choose a project.');
    return;
  }

  fetch('data/travel-works.json')
    .then(function(r){
      if(!r.ok) throw new Error('Travel-film data request failed: ' + r.status);
      return r.json();
    })
    .then(function(data){
      var w = (data.works || []).find(function(x){ return x.slug === slug; });
      if (!w) {
        showError('This film could not be found. Return to Travel Film and choose another project.');
        return;
      }

      document.title = w.title + ' — Locke Videography';

      var canonical = document.querySelector('link[rel="canonical"]');
      if(!canonical){
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = window.location.origin + window.location.pathname + '?slug=' + encodeURIComponent(w.slug);

      var h1 = document.getElementById('workTitle');
      if (h1) h1.textContent = w.title;

      var meta = document.getElementById('workMeta');
      if (meta) meta.textContent = 'TRAVEL FILM — ' + (w.location || '').toUpperCase() + ' — ' + w.year;

      var desc = document.getElementById('workDesc');
      if (desc) desc.textContent = w.description || '';

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
      showError('The film information could not be loaded. Please try again shortly.');
    });
})();
