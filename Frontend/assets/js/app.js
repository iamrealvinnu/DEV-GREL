function loadNavbar() {
  fetch('components/navbar.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('navbar-container').innerHTML = data;
      const script = document.createElement('script');
      script.src = 'assets/js/dynamic-nav.js';
      document.body.appendChild(script);
    });
}

function loadFooter() {
  fetch('components/footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer-container').innerHTML = data;
    });
}

document.addEventListener('DOMContentLoaded', () => {
  loadNavbar();
  loadFooter();
});
