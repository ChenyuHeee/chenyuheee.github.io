// Lightweight Mermaid loader/initializer
// This replaces the mermaid2 plugin usage.
(function(){
  const CDN = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
  function init(){
    if(!window.mermaid) return;
    try {
      window.mermaid.initialize({ startOnLoad: false, theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default' });
      const blocks = document.querySelectorAll('pre code.language-mermaid, .mermaid');
      blocks.forEach(block => {
        if(block.tagName.toLowerCase() === 'code') {
          const parent = block.parentElement;
          const wrapper = document.createElement('div');
          wrapper.className = 'mermaid';
          wrapper.textContent = block.textContent;
          parent.replaceWith(wrapper);
        }
      });
      window.mermaid.run();
    } catch(e){ console.error('Mermaid init failed', e); }
  }
  function load(){
    if(window.mermaid){ init(); return; }
    const s = document.createElement('script');
    s.src = CDN; s.onload = init; s.onerror = () => console.warn('Mermaid CDN load failed');
    document.head.appendChild(s);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load); else load();
})();
