/* ============================================
   ScholarHub - Scholarships JavaScript
   ============================================ */

// Sample Scholarship Data
const scholarshipsData = [
  {
    id: 1,
    title: 'Merit-Based Excellence Scholarship',
    description: 'Awarded to students with outstanding academic achievements and leadership qualities.',
    amount: '$10,000',
    deadline: '2024-12-31',
    category: 'Merit-Based',
    level: 'Undergraduate',
    image: 'assets/img/merit-based-excellence.png'
  },
  {
    id: 2,
    title: 'STEM Innovation Grant',
    description: 'Supporting students pursuing degrees in Science, Technology, Engineering, and Mathematics.',
    amount: '$15,000',
    deadline: '2024-11-30',
    category: 'STEM',
    level: 'Graduate',
    image: 'assets/img/stem-innovation-grant.png'
  },
  {
    id: 3,
    title: 'Community Service Award',
    description: 'Recognizing students who have made significant contributions to their communities.',
    amount: '$8,000',
    deadline: '2024-12-15',
    category: 'Community',
    level: 'Undergraduate',
    image: 'assets/img/community-service-award.png'
  },
  {
    id: 4,
    title: 'International Student Scholarship',
    description: 'Financial assistance for international students pursuing higher education.',
    amount: '$12,000',
    deadline: '2024-11-20',
    category: 'International',
    level: 'All Levels',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400'
  },
  {
    id: 5,
    title: 'Arts & Humanities Fellowship',
    description: 'Supporting talented students in arts, literature, and humanities programs.',
    amount: '$9,000',
    deadline: '2024-12-10',
    category: 'Arts',
    level: 'Graduate',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400'
  },
  {
    id: 6,
    title: 'First Generation College Grant',
    description: 'Helping first-generation college students achieve their educational dreams.',
    amount: '$7,500',
    deadline: '2024-12-05',
    category: 'Need-Based',
    level: 'Undergraduate',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400'
  }
];

let filteredScholarships = [...scholarshipsData];

// Initialize
document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const levelFilter = document.getElementById('levelFilter');
  const sortFilter = document.getElementById('sortFilter');
  const clearFiltersBtn = document.getElementById('clearFilters');
  const resultsContainer = document.getElementById('resultsContainer');
  const resultsCount = document.getElementById('resultsCount');

  // Filter Toggle Logic
  const filterToggleBtn = document.getElementById('filterToggle');
  const filtersSection = document.querySelector('.filters-section');

  if (filterToggleBtn && filtersSection) {
    filterToggleBtn.addEventListener('click', function () {
      filtersSection.classList.toggle('expanded');
      this.classList.toggle('active');
    });
  }

  // Render scholarships
  function renderScholarships(scholarships) {
    if (!resultsContainer) return;

    if (scholarships.length === 0) {
      resultsContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <div class="empty-state-text">No scholarships found</div>
          <p>Try adjusting your filters or search terms</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = scholarships.map(scholarship => `
      <div class="scholarship-card scroll-animate">
        <img src="${scholarship.image}" alt="${scholarship.title}" class="scholarship-card-img" loading="lazy">
        <div class="scholarship-card-body">
          <h3 class="scholarship-card-title">${scholarship.title}</h3>
          <p class="scholarship-card-text">${scholarship.description}</p>
          <div class="scholarship-card-footer">
            <span class="scholarship-amount">${scholarship.amount}</span>
            <span class="scholarship-deadline">Deadline: ${formatDate(scholarship.deadline)}</span>
          </div>
          <a href="scholarship-detail.html?id=${scholarship.id}" class="btn btn-primary" style="margin-top: 1rem; width: 100%;">View Details</a>
        </div>
      </div>
    `).join('');

    // Trigger scroll animations
    setTimeout(() => {
      const animateElements = document.querySelectorAll('.scroll-animate');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
          }
        });
      }, { threshold: 0.1 });

      animateElements.forEach(el => observer.observe(el));
    }, 100);
  }

  // Update results count
  function updateResultsCount(count) {
    if (resultsCount) {
      resultsCount.textContent = `Found ${count} ${count === 1 ? 'scholarship' : 'scholarships'}`;
    }
  }

  // Filter and search
  function filterScholarships() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const category = categoryFilter ? categoryFilter.value : 'all';
    const level = levelFilter ? levelFilter.value : 'all';
    const sort = sortFilter ? sortFilter.value : 'default';

    filteredScholarships = scholarshipsData.filter(scholarship => {
      const matchesSearch = scholarship.title.toLowerCase().includes(searchTerm) ||
        scholarship.description.toLowerCase().includes(searchTerm);
      const matchesCategory = category === 'all' || scholarship.category === category;
      const matchesLevel = level === 'all' || scholarship.level === level;

      return matchesSearch && matchesCategory && matchesLevel;
    });

    // Sort
    if (sort === 'amount-high') {
      filteredScholarships.sort((a, b) => parseFloat(b.amount.replace('$', '').replace(',', '')) -
        parseFloat(a.amount.replace('$', '').replace(',', '')));
    } else if (sort === 'amount-low') {
      filteredScholarships.sort((a, b) => parseFloat(a.amount.replace('$', '').replace(',', '')) -
        parseFloat(b.amount.replace('$', '').replace(',', '')));
    } else if (sort === 'deadline') {
      filteredScholarships.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    }

    renderScholarships(filteredScholarships);
    updateResultsCount(filteredScholarships.length);
  }

  // Event listeners
  if (searchInput) {
    searchInput.addEventListener('input', debounce(filterScholarships, 300));
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterScholarships);
  }

  if (levelFilter) {
    levelFilter.addEventListener('change', filterScholarships);
  }

  if (sortFilter) {
    sortFilter.addEventListener('change', filterScholarships);
  }

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', function () {
      if (searchInput) searchInput.value = '';
      if (categoryFilter) categoryFilter.value = 'all';
      if (levelFilter) levelFilter.value = 'all';
      if (sortFilter) sortFilter.value = 'default';
      filterScholarships();
    });
  }

  // Initial render
  renderScholarships(filteredScholarships);
  updateResultsCount(filteredScholarships.length);
});

// Utility Functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { scholarshipsData, formatDate };
}

