// Small UX enhancements: add fade-in class when DOM is ready
document.addEventListener('DOMContentLoaded', function(){
  // fade in hero and cards
  var hero = document.querySelector('.hero-inner');
  if(hero) hero.classList.add('fade-in');

  var cards = document.querySelectorAll('.card');
  cards.forEach(function(c, i){
    setTimeout(function(){ c.classList.add('fade-in'); }, 120 * i);
  });
});
