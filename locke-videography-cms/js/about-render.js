(function(){
  document.addEventListener('DOMContentLoaded', function(){
    if(window.initDynamicInteractions) window.initDynamicInteractions();
  });

  var stack = document.getElementById('lifeStack');
  var videoWrap = document.getElementById('videoWrap');
  if(!stack) return;

  function esc(s){
    return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function chainItem(cls, img, desc, i, connectorAfter){
    var el = document.createElement('div');
    el.className = 'chain-item';
    el.style.setProperty('--i', i);
    var bg = img ? ' style="background-image:url(' + img + ');background-size:cover;background-position:center"' : '';
    var node = '<div class="node ' + cls + '"' + bg + '></div>';
    var connector = '<span class="connector"></span>';
    var desc_html = '<p class="node-desc">' + esc(desc) + '</p>';
    // On the left branch the connector must sit between the circle and the
    // white node (i.e. after the circle in DOM order), not on its outer side.
    el.innerHTML = connectorAfter ? (node + connector + desc_html) : (connector + node + desc_html);
    return el;
  }

  fetch('data/about.json')
    .then(function(r){ return r.json(); })
    .then(function(data){
      if(data.video_embed && videoWrap){
        videoWrap.innerHTML = data.video_embed;
      }

      var stages = data.stages || [];
      var rows = [];
      var hoveredIndex = null;
      var lockedIndex = null;

      function render(){
        var activeIndex = hoveredIndex !== null ? hoveredIndex : lockedIndex;
        rows.forEach(function(row, i){
          row.classList.toggle('is-open', i === activeIndex);
        });
      }

      stages.forEach(function(stage, i){
        var row = document.createElement('div');
        row.className = 'life-row';

        var left = document.createElement('div');
        left.className = 'branch branch-left';
        if(stage.research){
          left.appendChild(chainItem('node-research', stage.research.image, stage.research.description, 0, true));
        }

        var center = document.createElement('div');
        center.className = 'life-node-wrap';
        center.innerHTML =
          '<button class="life-node" type="button" aria-label="' + esc(stage.label) + '"></button>' +
          '<span class="life-label">' + esc(stage.label) + '</span>';

        var right = document.createElement('div');
        right.className = 'branch branch-right';
        (stage.works || []).slice(0,4).forEach(function(w, wi){
          right.appendChild(chainItem('node-work', w.image, w.description, wi));
        });

        row.appendChild(left);
        row.appendChild(center);
        row.appendChild(right);
        stack.appendChild(row);
        rows.push(row);

        var btn = center.querySelector('.life-node');
        btn.addEventListener('mouseenter', function(){ hoveredIndex = i; render(); });
        btn.addEventListener('mouseleave', function(){ hoveredIndex = null; render(); });
        btn.addEventListener('click', function(){
          lockedIndex = (lockedIndex === i) ? null : i;
          render();
        });
      });

      if(window.initDynamicInteractions) window.initDynamicInteractions();
    })
    .catch(function(err){ console.error('Could not load about.json', err); });
})();
