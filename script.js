// ===== PARTICLE SYSTEM =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let animationId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.size = Math.random() * 2 + 0.5;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.life = 0;
    this.maxLife = Math.random() * 200 + 100;
    const colors = ['0, 212, 255', '0, 255, 204', '176, 96, 255', '255, 215, 0'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    if (this.life > this.maxLife || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    const alpha = this.life < 20 ? this.life / 20 : this.life > this.maxLife - 20 ? (this.maxLife - this.life) / 20 : 1;
    ctx.save();
    ctx.globalAlpha = this.opacity * alpha;
    ctx.fillStyle = `rgba(${this.color}, 1)`;
    ctx.shadowBlur = 6;
    ctx.shadowColor = `rgba(${this.color}, 0.8)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Create particles
for (let i = 0; i < 120; i++) particles.push(new Particle());

// Draw connections
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const alpha = (1 - dist / 100) * 0.15;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = `rgba(0, 212, 255, 1)`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  animationId = requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = document.getElementById('navbar').offsetHeight;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.section-header, .about-card, .skill-card, .passion-card, .tl-item, .vision-quote');
revealElements.forEach((el, i) => {
  el.classList.add('reveal');
  el.classList.add(`reveal-delay-${(i % 4) + 1}`);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => observer.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start);
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(num => {
        const target = parseInt(num.dataset.target);
        animateCounter(num, target);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

// ===== SKILL BAR ANIMATION =====
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.skill-fill');
      fills.forEach(fill => {
        const width = fill.dataset.width;
        setTimeout(() => { fill.style.width = width + '%'; }, 200);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillsSection = document.getElementById('skills');
if (skillsSection) skillObserver.observe(skillsSection);

// ===== AVATAR LOAD =====
const avatarImg = document.getElementById('avatar-img');
if (avatarImg) {
  avatarImg.addEventListener('error', () => {
    // Fallback: replace with styled div
    const fallback = document.createElement('div');
    fallback.style.cssText = `
      width: 220px; height: 220px; border-radius: 50%;
      background: linear-gradient(135deg, #050d1f, #0a1e3f);
      border: 3px solid rgba(0,212,255,0.5);
      display: flex; align-items: center; justify-content: center;
      font-size: 5rem; box-shadow: 0 0 40px rgba(0,212,255,0.3);
      z-index: 2; position: relative;
    `;
    fallback.textContent = '👨‍💼';
    avatarImg.parentNode.replaceChild(fallback, avatarImg);
  });
}

// ===== MOUSE PARALLAX ON HERO =====
const heroSection = document.getElementById('hero');
if (heroSection) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    const avatarContainer = document.querySelector('.avatar-container');
    if (avatarContainer) {
      avatarContainer.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
    }
  });
  heroSection.addEventListener('mouseleave', () => {
    const avatarContainer = document.querySelector('.avatar-container');
    if (avatarContainer) {
      avatarContainer.style.transform = 'translate(0, 0)';
    }
  });
}

// ===== TYPING EFFECT FOR TERMINAL =====
const terminalLines = document.querySelectorAll('.t-line');
if (terminalLines.length) {
  terminalLines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      line.style.opacity = '1';
    }, i * 200 + 500);
  });
}

// ===== CURSOR TRAIL =====
const trail = [];
const trailLength = 8;
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// ===== DYNAMIC NAV ACTIVE STATE =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = 'var(--accent-blue)';
        }
      });
    }
  });
});

// ===== CARD TILT EFFECT =====
document.querySelectorAll('.passion-card, .skill-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.5s ease';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});

console.log('%c🚀 Leo999 - 數位商管跨領域人才', 'color: #00d4ff; font-size: 20px; font-family: Orbitron, monospace; font-weight: bold;');
console.log('%c南山中學 × 智光商工 | 新北中和', 'color: #00ffcc; font-size: 12px; font-family: monospace;');
