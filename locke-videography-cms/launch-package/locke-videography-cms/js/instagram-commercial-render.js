(function(){
  fetch('data/instagram-works.json')
    .then(function(r){ return r.json(); })
    .then(function(data){
      var works = data.works || [];
      document.querySelectorAll('.photobox[data-slug]').forEach(function(el){
        var slug = el.getAttribute('data-slug');
        var w = works.find(function(x){ return x.slug === slug; });
        if(!w) return;
        if(w.title){
          var h4 = el.querySelector('h4');
          if(h4) h4.textContent = w.title;
        }
        if(w.cover_image){
          var inner = el.querySelector('.inner');
          if(inner){
            inner.style.backgroundImage = 'url(' + w.cover_image + ')';
            inner.style.backgroundSize = 'cover';
            inner.style.backgroundPosition = 'center';
          }
        }
      });
    })
    .catch(function(err){ console.error('Could not load instagram-works.json', err); });
})();
