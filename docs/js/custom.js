// Custom JS for small interactive tweaks
// Example: log page load and enable any future custom behaviours
console.log('Custom JS loaded for chenyuheee.github.io');

// Placeholder: if mermaid is loaded and not auto-starting, we can render manually
if (window.mermaid && typeof window.mermaid.initialize === 'function') {
  window.mermaid.initialize({ startOnLoad: false });
}
