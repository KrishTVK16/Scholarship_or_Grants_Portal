/* ============================================
   ScholarHub - Main JavaScript
   ============================================ */

// Theme Toggle Functionality
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  // Apply saved theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);
  
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }
}

function updateThemeIcon(theme) {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '☀' : '☾';
  }
}

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  // Initialize theme
  initTheme();
  
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      this.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileMenuToggle.innerHTML = '☰';
      }
    });
  }
  
  // Active Navigation Link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .nav-dropdown-link');
  
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
      
      // If it's a dropdown link, mark parent link as active but don't open dropdown
      const dropdownItem = link.closest('.nav-item-dropdown');
      if (dropdownItem) {
        // Don't add 'active' class to dropdown container - keep dropdown hidden
        const parentLink = dropdownItem.querySelector('.nav-link.has-dropdown');
        if (parentLink) {
          parentLink.classList.add('active');
        }
      }
    }
  });
  
  // Dropdown Toggle on Click and Hover
  const dropdownItems = document.querySelectorAll('.nav-item-dropdown');
  let dropdownTimeout = null;
  const isMobile = window.innerWidth <= 820; // Match mobile breakpoint
  
  // Ensure dropdowns are hidden by default
  dropdownItems.forEach(item => {
    item.classList.remove('active');
  });
  
  dropdownItems.forEach(item => {
    const dropdownLink = item.querySelector('.nav-link.has-dropdown');
    const dropdownMenu = item.querySelector('.nav-dropdown');
    
    if (dropdownLink) {
      // Click functionality - works on both desktop and mobile
      dropdownLink.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Clear any pending timeout
        clearTimeout(dropdownTimeout);
        
        // Close other dropdowns
        dropdownItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
        
        // Toggle current dropdown
        item.classList.toggle('active');
      });
      
      // Hover functionality - desktop only
      if (!isMobile) {
        // Mouse enter - show dropdown immediately
        item.addEventListener('mouseenter', function() {
          clearTimeout(dropdownTimeout);
          item.classList.add('active');
        });
        
        // Mouse leave - hide dropdown after 100ms delay
        item.addEventListener('mouseleave', function() {
          dropdownTimeout = setTimeout(() => {
            item.classList.remove('active');
          }, 100);
        });
      }
    }
  });
  
  // Close dropdown when clicking outside (both desktop and mobile)
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-item-dropdown')) {
      clearTimeout(dropdownTimeout);
      dropdownItems.forEach(item => {
        item.classList.remove('active');
      });
    }
  });
  
  // Close dropdown on mobile when clicking outside the menu
  if (isMobile) {
    const navMenu = document.querySelector('.nav-menu');
    document.addEventListener('click', function(e) {
      if (navMenu && !navMenu.contains(e.target) && !e.target.closest('.navbar-actions')) {
        dropdownItems.forEach(item => {
          item.classList.remove('active');
        });
      }
    });
  }
  
  // Smooth Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
  
  // Form Validation
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add('was-validated');
    });
  });
  
  // Logo is now an anchor tag, so no JavaScript needed
  
  // Back to Top Button
  const backToTopButton = document.getElementById('backToTop');
  if (backToTopButton) {
    // Show/hide button on scroll
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });
    
    // Smooth scroll to top on click
    backToTopButton.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});

// Utility Functions
function showLoading(element) {
  if (element) {
    element.classList.add('loading');
  }
}

function hideLoading(element) {
  if (element) {
    element.classList.remove('loading');
  }
}

function showMessage(message, type = 'success') {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message message-${type}`;
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background: ${type === 'success' ? 'var(--primary)' : 'var(--accent-red)'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideInRight 0.3s ease;
  `;
  
  document.body.appendChild(messageDiv);
  
  setTimeout(() => {
    messageDiv.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => messageDiv.remove(), 300);
  }, 3000);
}

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(100px); }
  }
`;
document.head.appendChild(style);

