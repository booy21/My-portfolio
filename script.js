// Snowfall Animation
const snowCanvas = document.getElementById('snow-canvas');
const heroSection = document.querySelector('.hero-section');
const ctx = snowCanvas.getContext('2d');
let snowflakes = [];

function resizeCanvas() {
  // Always match hero section size
  const rect = heroSection.getBoundingClientRect();
  snowCanvas.width = rect.width;
  snowCanvas.height = rect.height;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createSnowflakes() {
  snowflakes = [];
  let count = Math.floor(snowCanvas.width / 8);
  for (let i = 0; i < count; i++) {
    snowflakes.push({
      x: Math.random() * snowCanvas.width,
      y: Math.random() * snowCanvas.height,
      r: Math.random() * 2.5 + 1,
      d: Math.random() * 1 + 0.5,
      drift: Math.random() * 1.5 - 0.75
    });
  }
}
createSnowflakes();
window.addEventListener('resize', createSnowflakes);

function drawSnowflakes() {
  ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
  ctx.save();
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = '#fff';
  snowflakes.forEach(flake => {
    ctx.beginPath();
    ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function moveSnowflakes() {
  snowflakes.forEach(flake => {
    flake.y += flake.d;
    flake.x += flake.drift;
    if (flake.y > snowCanvas.height) {
      flake.y = -flake.r;
      flake.x = Math.random() * snowCanvas.width;
    }
    if (flake.x > snowCanvas.width) flake.x = 0;
    if (flake.x < 0) flake.x = snowCanvas.width;
  });
}

function animateSnow() {
  drawSnowflakes();
  moveSnowflakes();
  requestAnimationFrame(animateSnow);
}
animateSnow();

// --- Chimney Smoke Animation ---
function createSmokePuff(x, y, scale, delay) {
  // Returns an SVG path string for a smoke puff
  const puffId = 'smoke-puff-' + Math.random().toString(36).substr(2, 9);
  return {
    id: puffId,
    x,
    y,
    scale,
    opacity: 0.5 + Math.random() * 0.3,
    life: 0,
    maxLife: 120 + Math.random() * 40,
    delay: delay || 0,
    path: `M${x},${y} q${-10*scale},${-20*scale} ${0},${-40*scale} q${10*scale},${-20*scale} ${20*scale},${-10*scale}`
  };
}

function animateSmoke(groupId, baseX, baseY, scale) {
  const group = document.getElementById(groupId);
  if (!group) return;
  let puffs = [];
  function addPuff() {
    puffs.push(createSmokePuff(0, 0, scale, 0));
  }
  // Add initial puffs
  for (let i = 0; i < 3; i++) {
    puffs.push(createSmokePuff(0, 0, scale, i * 40));
  }
  function animate() {
    // Remove old puffs
    puffs = puffs.filter(p => p.life < p.maxLife);
    // Add new puff if needed
    if (puffs.length < 4) {
      puffs.push(createSmokePuff(0, 0, scale, 0));
    }
    // Animate puffs
    group.innerHTML = '';
    puffs.forEach(puff => {
      if (puff.delay > 0) {
        puff.delay--;
        return;
      }
      puff.life++;
      const progress = puff.life / puff.maxLife;
      const px = baseX + Math.sin(progress * 2 * Math.PI) * 6 * scale;
      const py = baseY - progress * 60 * scale;
      const puffScale = scale * (0.8 + 0.4 * progress);
      const puffOpacity = puff.opacity * (1 - progress);
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M${px},${py} q${-10*puffScale},${-20*puffScale} 0,${-40*puffScale} q${10*puffScale},${-20*puffScale} ${20*puffScale},${-10*puffScale}`);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', '#e0e0e0');
      path.setAttribute('stroke-width', 6 * puffScale);
      path.setAttribute('opacity', puffOpacity);
      group.appendChild(path);
    });
    requestAnimationFrame(animate);
  }
  animate();
}

document.addEventListener('DOMContentLoaded', function() {
  // House 1 chimney (left)
  animateSmoke('smoke1', 358, 465, 0.7);
  // House 2 chimney (right)
  animateSmoke('smoke2', 1044, 400, 0.9);
});

// --- Window Flicker Animation ---
function flickerWindows() {
  document.querySelectorAll('.houses .window').forEach(win => {
    if (Math.random() > 0.7) {
      win.classList.add('flicker');
      setTimeout(() => win.classList.remove('flicker'), 200 + Math.random() * 300);
    }
  });
}
setInterval(flickerWindows, 700);

// Smooth scroll for nav links and hero button
const navLinks = document.querySelectorAll('.nav-links a, .footer-nav a, .site-name, .btn');
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Typewriter Animation
function typeWriter(element, text, speed = 100) {
  let i = 0;
  let isDeleting = false;
  function type() {
    if (isDeleting) {
      element.textContent = text.substring(0, element.textContent.length - 1);
      if (element.textContent === '') {
        isDeleting = false;
        setTimeout(type, 1000);
        return;
      }
    } else {
      element.textContent = text.substring(0, i + 1);
      i++;
      if (i === text.length) {
        setTimeout(() => {
          isDeleting = true;
          type();
        }, 2000);
        return;
      }
    }
    setTimeout(type, isDeleting ? speed / 2 : speed);
  }
  type();
}
document.addEventListener('DOMContentLoaded', function() {
  const typewriterElement = document.getElementById('typewriter');
  if (typewriterElement) {
    typeWriter(typewriterElement, 'Aayush Kumar', 150);
  }
});

// EmailJS Contact Form
(function() {
  emailjs.init('vGovdhJRpu_AVJQ-j');
})();

document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const form = this;
  const formMessage = document.getElementById('form-message');
  formMessage.textContent = '';
  formMessage.style.color = '#6dd5ed';
  emailjs.sendForm('service_ihtzg8p', 'template_m8gy8xq', form)
    .then(function() {
      formMessage.textContent = 'Message sent successfully!';
      formMessage.style.color = '#6dd5ed';
      form.reset();
    }, function(error) {
      formMessage.textContent = 'Failed to send message. Please try again later.';
      formMessage.style.color = '#e25555';
    });
});

// === THEME TOGGLE ===
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function setTheme(mode) {
  if (mode === 'light') {
    body.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.remove('light-mode');
    localStorage.setItem('theme', 'dark');
  }
}
// Load theme from storage
if (localStorage.getItem('theme') === 'light') setTheme('light');

themeToggle.addEventListener('click', () => {
  if (body.classList.contains('light-mode')) {
    setTheme('dark');
  } else {
    setTheme('light');
  }
});

// === SKY ELEMENTS ===
// --- Stars (night) ---
function createStars() {
  const starsContainer = document.getElementById('stars');
  starsContainer.innerHTML = '';
  const w = window.innerWidth, h = heroSection.offsetHeight;
  for (let i = 0; i < 70; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2 + 1;
    star.style.width = star.style.height = size + 'px';
    star.style.left = Math.random() * w + 'px';
    star.style.top = Math.random() * (h * 0.5) + 'px';
    star.style.opacity = 0.6 + Math.random() * 0.4;
    star.style.animationDuration = (2 + Math.random() * 2) + 's';
    starsContainer.appendChild(star);
  }
}
function updateStars() {
  if (!body.classList.contains('light-mode')) createStars();
  else document.getElementById('stars').innerHTML = '';
}
window.addEventListener('resize', updateStars);
document.addEventListener('DOMContentLoaded', updateStars);

// --- Clouds (day) ---
const cloudShapes = [
  [ // cloud 1
    {w: 60, h: 30, x: 0, y: 0},
    {w: 40, h: 24, x: 30, y: -10},
    {w: 30, h: 18, x: 50, y: 10}
  ],
  [ // cloud 2
    {w: 50, h: 22, x: 0, y: 0},
    {w: 30, h: 16, x: 20, y: -8},
    {w: 20, h: 12, x: 35, y: 8}
  ],
  [ // cloud 3
    {w: 40, h: 18, x: 0, y: 0},
    {w: 25, h: 12, x: 15, y: -6},
    {w: 18, h: 10, x: 25, y: 6}
  ]
];
let cloudObjs = [];
function createClouds() {
  const cloudsContainer = document.getElementById('clouds');
  cloudsContainer.innerHTML = '';
  cloudObjs = [];
  const w = window.innerWidth, h = heroSection.offsetHeight;
  for (let i = 0; i < 4; i++) {
    const cloudGroup = document.createElement('div');
    cloudGroup.className = 'cloud';
    const shape = cloudShapes[Math.floor(Math.random() * cloudShapes.length)];
    const baseX = Math.random() * (w - 120);
    const baseY = Math.random() * (h * 0.25);
    cloudGroup.style.left = baseX + 'px';
    cloudGroup.style.top = baseY + 'px';
    cloudGroup.style.width = '80px';
    cloudGroup.style.height = '40px';
    cloudGroup.style.opacity = 0.7 + Math.random() * 0.2;
    // Add blobs
    shape.forEach(blob => {
      const blobDiv = document.createElement('div');
      blobDiv.style.position = 'absolute';
      blobDiv.style.left = blob.x + 'px';
      blobDiv.style.top = blob.y + 'px';
      blobDiv.style.width = blob.w + 'px';
      blobDiv.style.height = blob.h + 'px';
      blobDiv.style.background = '#fff';
      blobDiv.style.borderRadius = '50%';
      blobDiv.style.boxShadow = '0 8px 32px #b6eaff44';
      cloudGroup.appendChild(blobDiv);
    });
    cloudsContainer.appendChild(cloudGroup);
    cloudObjs.push({el: cloudGroup, x: baseX, y: baseY, speed: 0.1 + Math.random() * 0.12});
  }
}
function animateClouds() {
  if (!body.classList.contains('light-mode')) return;
  cloudObjs.forEach(cloud => {
    cloud.x += cloud.speed;
    if (cloud.x > window.innerWidth) cloud.x = -120;
    cloud.el.style.left = cloud.x + 'px';
  });
  requestAnimationFrame(animateClouds);
}
function updateClouds() {
  if (body.classList.contains('light-mode')) {
    createClouds();
    animateClouds();
  } else {
    document.getElementById('clouds').innerHTML = '';
  }
}
window.addEventListener('resize', updateClouds);
document.addEventListener('DOMContentLoaded', updateClouds);

// --- Animate on theme change ---
function animateSkyElements() {
  updateStars();
  updateClouds();
}
const observer = new MutationObserver(animateSkyElements);
observer.observe(body, {attributes: true, attributeFilter: ['class']});

// === GREETING MESSAGE ===
function getGreeting() {
  const now = new Date();
  const hour = now.getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning User';
  if (hour >= 12 && hour < 17) return 'Good Afternoon User';
  if (hour >= 17 && hour < 21) return 'Good Evening User';
  return 'Good Night User';
}
function updateGreeting() {
  const greetingEl = document.getElementById('greeting-message');
  if (greetingEl) greetingEl.textContent = getGreeting();
}
updateGreeting();
setInterval(updateGreeting, 60000);

// === CURSOR TRAIL EFFECT ===
const hero = document.querySelector('.hero-section');
const trailContainer = document.getElementById('cursor-trail');
let isCursorInHero = false;

console.log('Trail elements found:', { hero, trailContainer }); // Debug log

function createTrailDot(x, y) {
  if (!trailContainer) {
    console.error('Trail container not found!');
    return;
  }

  const dot = document.createElement('div');
  dot.className = 'trail-dot';
  dot.style.left = x + 'px';
  dot.style.top = y + 'px';
  trailContainer.appendChild(dot);
  console.log('Trail dot created at:', x, y); // Debug log
  setTimeout(() => dot.remove(), 800);
}

if (hero) {
  hero.addEventListener('mouseenter', () => {
    isCursorInHero = true;
    console.log('Mouse entered hero section'); // Debug log
  });
  hero.addEventListener('mouseleave', () => {
    isCursorInHero = false;
    console.log('Mouse left hero section'); // Debug log
  });
  hero.addEventListener('mousemove', e => {
    if (!isCursorInHero) return;
    // Get mouse position relative to hero section
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createTrailDot(x, y);
  });
} else {
  console.error('Hero section not found!');
} 

// Skill tooltip functionality
document.addEventListener('DOMContentLoaded', function() {
  const skillCards = document.querySelectorAll('.skill-card');
  
  skillCards.forEach(card => {
    const tooltip = card.querySelector('.tooltip');
    
    // Show tooltip on hover
    card.addEventListener('mouseenter', function() {
      tooltip.style.opacity = '1';
      tooltip.style.visibility = 'visible';
      tooltip.style.transform = 'translateX(-50%) translateY(-5px)';
    });
    
    // Hide tooltip on mouse leave
    card.addEventListener('mouseleave', function() {
      tooltip.style.opacity = '0';
      tooltip.style.visibility = 'hidden';
      tooltip.style.transform = 'translateX(-50%) translateY(0)';
    });
    
    // Auto-hide tooltip when mouse moves away
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // If mouse is outside the card bounds, hide tooltip
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
        tooltip.style.transform = 'translateX(-50%) translateY(0)';
      }
    });
  });
}); 

// Scroll to Top functionality
document.addEventListener('DOMContentLoaded', function() {
  const scrollToTopBtn = document.getElementById('scrollToTop');
  
  if (scrollToTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    });
    
    // Smooth scroll to top when clicked
    scrollToTopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Smooth scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Add click feedback
      scrollToTopBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        scrollToTopBtn.style.transform = '';
      }, 150);
    });
    
    // Debug logging
    console.log('Scroll to top button initialized');
  } else {
    console.error('Scroll to top button not found!');
  }
}); 

// Download Resume functionality
document.addEventListener('DOMContentLoaded', function() {
  const downloadBtn = document.querySelector('.download-resume-btn');
  
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Add click feedback
      downloadBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        downloadBtn.style.transform = '';
      }, 150);
      
      // Show loading state
      const originalText = downloadBtn.innerHTML;
      downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Preparing...</span>';
      downloadBtn.disabled = true;
      
      // Simulate download (replace with actual resume file)
      setTimeout(() => {
        // For now, just show a message
        alert('Resume download feature will be implemented with your actual resume file!');
        
        // Reset button
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
      }, 1500);
      
      // TODO: Replace with actual resume download
      // const link = document.createElement('a');
      // link.href = 'path/to/your/resume.pdf';
      // link.download = 'Aayush_Kumar_Resume.pdf';
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
    });
    
    console.log('Download resume button initialized');
  } else {
    console.error('Download resume button not found!');
  }
}); 

// Scroll-based Animations with Intersection Observer
document.addEventListener('DOMContentLoaded', function() {
  // Check if Intersection Observer is supported
  if ('IntersectionObserver' in window) {
    // Create observer for section animations
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Create observer for staggered animations
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -30px 0px'
    });

    // Observe all section animations
    const sectionElements = document.querySelectorAll('.section-animate, .about-container, .skills-grid, .projects-coming-soon, .contact-container');
    sectionElements.forEach(el => sectionObserver.observe(el));

    // Observe all staggered animations
    const staggerElements = document.querySelectorAll('.stagger-animate, .skill-card, .trait-item, .contact-form, .contact-details, .section-heading');
    staggerElements.forEach(el => staggerObserver.observe(el));

    console.log('Scroll animations initialized');
  } else {
    // Fallback for browsers that don't support Intersection Observer
    console.log('Intersection Observer not supported, showing all elements');
    const animatedElements = document.querySelectorAll('.section-animate, .stagger-animate, .about-container, .skills-grid, .projects-coming-soon, .contact-container, .skill-card, .trait-item, .contact-form, .contact-details, .section-heading');
    animatedElements.forEach(el => el.classList.add('animate-in'));
  }
}); 