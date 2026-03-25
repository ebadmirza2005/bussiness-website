// Hamburger Menu on Mobile


const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('show');
      hamburger.classList.toggle('active');
  });


//   Active Links

 let links = document.querySelectorAll(".nav-link");

links.forEach(link => {
  link.addEventListener("click", function() {
      links.forEach(nav => nav.classList.remove("active"));
      this.classList.add("active");
  });
});


// Custom Cursor Only Protfolio


let cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
});