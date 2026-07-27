(function(){
  // Reveal-capable elements (e.g. still boxes) must initialize regardless
  // of whether the CMS data fetch succeeds, so they're never stuck invisible.
  document.addEventListener('DOMContentLoaded', function(){
    if(window.initDynamicInteractions) window.initDynamicInteractions();
  });

  var row = document.getElementById('archiveRow');
  if(!row) return;

  function esc(s){
    return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  fetch('data/ai-archive.json')
    .then(function(r){ return r.json(); })
    .then(function(data){
      var works = (data.works || []).slice(0, 4);
      works.forEach(function(w){
        var a = document.createElement('a');
        a.className = 'acard';
        a.href = w.slug ? (w.slug + '.html') : '#';
        if(!w.slug) a.classList.add('no-op');

        var media = document.createElement('div');
        media.className = 'ac-media';
        if(w.image){
          media.style.backgroundImage = 'url(' + w.image + ')';
        }

        var title = document.createElement('span');
        title.className = 'ac-title';
        title.textContent = w.title || '';

        a.appendChild(media);
        a.appendChild(title);
        row.appendChild(a);
      });

      if(window.initDynamicInteractions) window.initDynamicInteractions();
    })
    .catch(function(err){ console.error('Could not load ai-archive.json', err); });
})();
