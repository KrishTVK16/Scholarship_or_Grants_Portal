/* ============================================
   ScholarHub - Advanced Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Intersection Observer for Scroll Animations
  const observerOptions = {
    threshold: 0.3, // Increased from 0.1 to 0.3 - animations trigger when 30% visible
    rootMargin: '0px 0px -150px 0px' // Increased from -50px to -150px - delays animation until element is more visible
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all scroll-animate elements
  document.querySelectorAll('.scroll-animate').forEach(el => {
    observer.observe(el);
  });
  
  // Counter Animation
  function animateCounter(element, target, duration = 2000) {
    if (!element) return;
    
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = formatNumber(target);
        clearInterval(timer);
      } else {
        element.textContent = formatNumber(Math.floor(current));
      }
    }, 16);
  }
  
  function formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
  
  // Initialize counters
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach(stat => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(stat.getAttribute('data-target') || stat.textContent.replace(/[^0-9]/g, ''));
          if (target) {
            stat.textContent = '0';
            animateCounter(stat, target);
            observer.unobserve(stat);
          }
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(stat);
  });
  
  // Parallax Effect for Hero (Fixed to prevent layout shifts)
  const hero = document.querySelector('.hero');
  if (hero) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const heroRect = hero.getBoundingClientRect();
          const heroHeight = hero.offsetHeight;
          
          // Only apply parallax when hero is visible
          if (scrolled < heroHeight) {
            const rate = scrolled * 0.3; // Reduced parallax intensity
            hero.style.transform = `translate3d(0, ${rate}px, 0)`;
            hero.style.willChange = 'transform';
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }
  
  // Card Hover Glow Effect
  const cards = document.querySelectorAll('.card, .scholarship-card, .category-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s ease';
    });
  });
  
  // Button Ripple Effect
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
  
  // Add ripple animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Staggered Animation for Grid Items
  function staggerAnimation(elements, delay = 150) { // Increased from 100ms to 150ms for smoother staggering
    elements.forEach((el, index) => {
      // Set initial state without affecting layout
      if (!el.classList.contains('animated')) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)'; // Increased from 20px for more noticeable effect
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out'; // Increased from 0.6s to 0.8s
        el.style.position = 'relative';
        el.style.zIndex = '1';
      }
      
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.classList.add('animated');
      }, index * delay);
    });
  }
  
  // Apply staggered animation to grid items on load
  const gridItems = document.querySelectorAll('.grid > *');
  if (gridItems.length > 0) {
    const gridObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const items = Array.from(entry.target.children || []);
          if (items.length > 0) {
            staggerAnimation(items);
            gridObserver.unobserve(entry.target);
          }
        }
      });
    }, { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }); // Increased threshold and rootMargin for delayed animations
    
    document.querySelectorAll('.grid').forEach(grid => {
      gridObserver.observe(grid);
    });
  }
  
  // Page Load Animation
  window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 100);
  });
  
  // Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offsetTop = target.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });
});

