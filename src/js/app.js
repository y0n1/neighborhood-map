'strict mode';


/*
 * Open the drawer when the menu ison is clicked.
 */
var menu = document.querySelector('#menu');
var main = document.querySelector('main');
var drawer = document.querySelector('#drawer');

menu.addEventListener('click', function (event) {
  drawer.classList.toggle('open');
  event.stopPropagation();
});

main.addEventListener('click', function (event) {
  drawer.classList.remove('open');
  event.stopPropagation();
});
