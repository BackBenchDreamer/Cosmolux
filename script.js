// Smooth scroll for nav links
document.querySelectorAll("nav a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Mobile Navbar Functionality
const hamburger = document.querySelector('.hamburger');
const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

hamburger.addEventListener('click', () => {
  mobileNavOverlay.classList.toggle('show'); // Show or hide the mobile nav overlay
});

// Close mobile nav when clicking on a link
mobileNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileNavOverlay.classList.remove('show'); // Hide the nav overlay after clicking
  });
});

// Scroll to section and set active class
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (scrollY >= sectionTop - 60) {
      current = section.getAttribute('id'); // Get the current section ID
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(current)) {
      link.classList.add('active'); // Highlight the link for the active section
    }
  });
});


// Scroll to Top Button Visibility
window.onscroll = function () {
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    scrollTopBtn.style.display = "block";
  } else {
    scrollTopBtn.style.display = "none";
  }
};

// Scroll to Top Functionality
document.getElementById("scrollTopBtn").onclick = function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Infinite Loop Carousel
const profileCards = document.querySelector(".profile-cards");
const profiles = document.querySelectorAll(".profile-card");
const totalProfiles = profiles.length;
const profileCardWidth = profileCards.offsetWidth / 3; // Each profile is 30% of the container width

let scrollAmount = 0;

// Clone the first 3 and last 3 profiles
let cloneFirstProfiles = Array.from(profiles).slice(0, 3);
let cloneLastProfiles = Array.from(profiles).slice(-3);

// Append clones to the end and prepend clones to the start
cloneFirstProfiles.forEach((clone) => {
  profileCards.appendChild(clone.cloneNode(true));
});
cloneLastProfiles.forEach((clone) => {
  profileCards.prepend(clone.cloneNode(true));
});

// Initial scroll position to the real first profile (after prepending clones)
profileCards.scrollLeft = profileCardWidth * 3;

document.querySelector(".next").addEventListener("click", () => {
  scrollAmount += profileCardWidth;

  // Scroll to the next set
  profileCards.scrollBy({ left: profileCardWidth, behavior: "smooth" });

  // If we reach the end of the real profiles, reset to the start seamlessly
  if (scrollAmount >= profileCardWidth * totalProfiles) {
    setTimeout(() => {
      profileCards.scrollLeft = profileCardWidth * 3; // Jump back to the first real profile
      scrollAmount = 0; // Reset scroll amount
    }, 300); // Timeout to allow smooth transition before resetting
  }
});

document.querySelector(".prev").addEventListener("click", () => {
  scrollAmount -= profileCardWidth;

  // Scroll back to the previous set
  profileCards.scrollBy({ left: -profileCardWidth, behavior: "smooth" });

  // If we reach the start of the real profiles, jump to the end seamlessly
  if (scrollAmount < 0) {
    setTimeout(() => {
      profileCards.scrollLeft = profileCardWidth * totalProfiles; // Jump to the last real profile
      scrollAmount = profileCardWidth * totalProfiles; // Set scroll amount accordingly
    }, 300); // Timeout to allow smooth transition before resetting
  }
});

const panels = document.querySelectorAll(".panel");

panels.forEach((panel) => {
  panel.addEventListener("click", () => {
    removeActiveClasses();
    panel.classList.add("active");
  });
});

function removeActiveClasses() {
  panels.forEach((panel) => {
    panel.classList.remove("active");
  });
}
