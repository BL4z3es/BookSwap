/* ========================================
   BookSwap - JavaScript Functionality
   ======================================== */

// Mock Books Data
const mockBooks = [
  {
    id: "1",
    title: "Mathematics Grade 10",
    subject: "Mathematics",
    grade: "Grade 10",
    condition: "Good",
    status: "Available",
    location: "Sandton",
    listedDaysAgo: 2,
  },
  {
    id: "2",
    title: "English Home Language",
    subject: "English",
    grade: "Grade 11",
    condition: "New",
    status: "Available",
    location: "Pretoria",
    listedDaysAgo: 1,
  },
  {
    id: "3",
    title: "Physical Sciences",
    subject: "Science",
    grade: "Grade 12",
    condition: "Used",
    status: "Reserved",
    location: "Johannesburg",
    listedDaysAgo: 5,
  },
  {
    id: "4",
    title: "Life Sciences Textbook",
    subject: "Biology",
    grade: "Grade 11",
    condition: "Good",
    status: "Available",
    location: "Cape Town",
    listedDaysAgo: 3,
  },
  {
    id: "5",
    title: "Geography Grade 10",
    subject: "Geography",
    grade: "Grade 10",
    condition: "Heavily Used",
    status: "Available",
    location: "Durban",
    listedDaysAgo: 7,
  },
  {
    id: "6",
    title: "History of South Africa",
    subject: "History",
    grade: "Grade 12",
    condition: "Good",
    status: "Claimed",
    location: "Bloemfontein",
    listedDaysAgo: 10,
  },
  {
    id: "7",
    title: "Accounting Made Easy",
    subject: "Accounting",
    grade: "Grade 11",
    condition: "New",
    status: "Available",
    location: "Port Elizabeth",
    listedDaysAgo: 4,
  },
  {
    id: "8",
    title: "Afrikaans Eerste Taal",
    subject: "Afrikaans",
    grade: "Grade 9",
    condition: "Used",
    status: "Available",
    location: "Stellenbosch",
    listedDaysAgo: 6,
  },
];

const grades = ["Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const subjects = ["Mathematics", "English", "Afrikaans", "Science", "Biology", "Geography", "History", "Accounting", "Business Studies", "Economics"];
const conditions = ["New", "Good", "Used", "Heavily Used"];
const statuses = ["Available", "Reserved", "Claimed"];

// ========================================
// Utility Functions
// ========================================

function getConditionClass(condition) {
  const classes = {
    "New": "badge-condition-new",
    "Good": "badge-condition-good",
    "Used": "badge-condition-used",
    "Heavily Used": "badge-condition-heavily-used"
  };
  return classes[condition] || "badge-condition-good";
}

function getStatusClass(status) {
  const classes = {
    "Available": "badge-available",
    "Reserved": "badge-reserved",
    "Claimed": "badge-claimed"
  };
  return classes[status] || "badge-available";
}

function showToast(title, description) {
  const container = document.querySelector('.toast-container') || createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast-title">${title}</div>
    <div class="toast-description">${description}</div>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'fadeIn 0.3s ease-out reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// ========================================
// Book Card Generation
// ========================================

function createBookCard(book) {
  return `
    <div class="book-card">
      <div class="book-card-image">
        <div class="book-card-placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
          </svg>
        </div>
        <span class="badge ${getStatusClass(book.status)} book-card-badge">${book.status}</span>
      </div>
      <div class="book-card-content">
        <h3 class="book-card-title">${book.title}</h3>
        <p class="book-card-meta">${book.grade} • ${book.subject}</p>
        <div class="book-card-footer">
          <span class="badge badge-condition ${getConditionClass(book.condition)}">${book.condition}</span>
          ${book.location ? `
            <span class="book-card-location">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              ${book.location}
            </span>
          ` : ''}
        </div>
        <a href="book-detail.html?id=${book.id}" class="btn btn-outline btn-full btn-sm">View Details</a>
      </div>
    </div>
  `;
}

// ========================================
// Mobile Menu Toggle
// ========================================

function initMobileMenu() {
  const toggle = document.querySelector('.navbar-mobile-toggle');
  const menu = document.querySelector('.navbar-mobile-menu');
  
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
      const icon = toggle.querySelector('svg');
      if (menu.classList.contains('open')) {
        icon.innerHTML = `<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`;
      } else {
        icon.innerHTML = `<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>`;
      }
    });
  }
}

// ========================================
// Browse Page Functionality
// ========================================

function initBrowsePage() {
  const booksGrid = document.getElementById('books-grid');
  const searchInput = document.getElementById('search-input');
  const filtersToggle = document.getElementById('filters-toggle');
  const filtersPanel = document.getElementById('filters-panel');
  const clearFiltersBtn = document.getElementById('clear-filters');
  const resultsCount = document.getElementById('results-count');
  
  if (!booksGrid) return;
  
  let filters = {
    search: '',
    grade: null,
    subject: null,
    condition: null,
    status: null
  };
  
  function renderBooks() {
    const filtered = mockBooks.filter(book => {
      const matchesSearch = !filters.search || 
        book.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        book.subject.toLowerCase().includes(filters.search.toLowerCase()) ||
        book.grade.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesGrade = !filters.grade || book.grade === filters.grade;
      const matchesSubject = !filters.subject || book.subject === filters.subject;
      const matchesCondition = !filters.condition || book.condition === filters.condition;
      const matchesStatus = !filters.status || book.status === filters.status;
      
      return matchesSearch && matchesGrade && matchesSubject && matchesCondition && matchesStatus;
    });
    
    if (resultsCount) {
      resultsCount.textContent = filtered.length;
    }
    
    if (filtered.length === 0) {
      booksGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
          <h3 class="empty-state-title">No books found</h3>
          <p class="empty-state-description">Try adjusting your search or filters</p>
          <button class="btn btn-outline" onclick="clearAllFilters()">Clear Filters</button>
        </div>
      `;
    } else {
      booksGrid.innerHTML = filtered.map(createBookCard).join('');
    }
  }
  
  // Search
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filters.search = e.target.value;
      renderBooks();
    });
  }
  
  // Filters Toggle
  if (filtersToggle && filtersPanel) {
    filtersToggle.addEventListener('click', () => {
      filtersPanel.style.display = filtersPanel.style.display === 'none' ? 'block' : 'none';
    });
  }
  
  // Clear Filters
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      filters = { search: '', grade: null, subject: null, condition: null, status: null };
      if (searchInput) searchInput.value = '';
      document.querySelectorAll('.filter-btn.active').forEach(btn => btn.classList.remove('active'));
      renderBooks();
    });
  }
  
  // Global clear function
  window.clearAllFilters = () => {
    filters = { search: '', grade: null, subject: null, condition: null, status: null };
    if (searchInput) searchInput.value = '';
    document.querySelectorAll('.filter-btn.active').forEach(btn => btn.classList.remove('active'));
    renderBooks();
  };
  
  // Filter Buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const filterType = btn.dataset.filterType;
      const filterValue = btn.dataset.filterValue;
      
      // Toggle active state
      const siblings = btn.parentElement.querySelectorAll('.filter-btn');
      siblings.forEach(s => s.classList.remove('active'));
      
      if (filters[filterType] === filterValue) {
        filters[filterType] = null;
      } else {
        btn.classList.add('active');
        filters[filterType] = filterValue;
      }
      
      renderBooks();
    });
  });
  
  // Initial render
  renderBooks();
}

// ========================================
// Book Detail Page
// ========================================

function initBookDetailPage() {
  const container = document.getElementById('book-detail-container');
  if (!container) return;
  
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('id');
  
  const book = mockBooks.find(b => b.id === bookId);
  
  if (!book) {
    container.innerHTML = `
      <div class="text-center py-20">
        <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">Book Not Found</h1>
        <a href="browse.html" class="btn btn-primary btn-md">Back to Browse</a>
      </div>
    `;
    return;
  }
  
  const otherBooks = mockBooks.filter(b => b.id !== bookId).slice(0, 4);
  
  container.innerHTML = `
    <a href="browse.html" class="btn btn-ghost btn-sm book-detail-back">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
      </svg>
      Back to Browse
    </a>
    
    <div class="book-detail-grid">
      <div>
        <div class="book-detail-image">
          <div class="book-detail-image-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
            </svg>
          </div>
        </div>
      </div>
      
      <div>
        <div class="book-detail-header">
          <span class="badge ${getStatusClass(book.status)}" style="font-size: 0.875rem; padding: 0.375rem 0.75rem;">${book.status}</span>
          <button class="btn btn-ghost btn-icon-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
        </div>
        
        <h1 class="book-detail-title">${book.title}</h1>
        
        <div class="book-detail-meta">
          <span class="book-detail-meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
            </svg>
            ${book.subject}
          </span>
          <span>•</span>
          <span>${book.grade}</span>
          <span>•</span>
          <span>2024 School Year</span>
        </div>
        
        <div class="book-detail-badges">
          <span class="badge badge-condition ${getConditionClass(book.condition)}" style="padding: 0.5rem 1rem;">${book.condition} Condition</span>
          ${book.location ? `
            <span class="badge badge-secondary" style="padding: 0.5rem 1rem; display: inline-flex; align-items: center; gap: 0.375rem;">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              ${book.location}
            </span>
          ` : ''}
        </div>
        
        <div class="owner-card">
          <div class="owner-info">
            <div class="owner-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <p class="owner-name">Sarah M.</p>
              <p class="owner-listed">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                Listed ${book.listedDaysAgo} days ago
              </p>
            </div>
          </div>
          
          <button class="btn btn-hero btn-lg btn-full mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
            </svg>
            Contact Owner
          </button>
          
          <div class="owner-contact-btns">
            <button class="btn btn-outline btn-sm flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              WhatsApp
            </button>
            <button class="btn btn-outline btn-sm flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              Email
            </button>
          </div>
        </div>
        
        <div class="book-detail-description">
          <h3>Description</h3>
          <p>This textbook is in ${book.condition.toLowerCase()} condition. All pages are intact with minimal highlighting. Perfect for students entering ${book.grade}. Some notes in margins but very readable.</p>
        </div>
        
        <div class="pickup-preferences">
          <h4>Pick-up Preferences</h4>
          <p>Can meet after school at the main gate or weekends at a convenient location in ${book.location}.</p>
        </div>
      </div>
    </div>
    
    <section class="related-books">
      <h2>More Books You Might Like</h2>
      <div class="grid grid-4">
        ${otherBooks.map(createBookCard).join('')}
      </div>
    </section>
  `;
}

// ========================================
// List Book Page
// ========================================

function initListBookPage() {
  const form = document.getElementById('list-book-form');
  if (!form) return;
  
  const formData = {
    title: '',
    subject: '',
    grade: '',
    condition: '',
    description: '',
    contactMethod: 'whatsapp',
    contactValue: ''
  };
  
  let images = [];
  
  // Preview elements
  const previewTitle = document.getElementById('preview-title');
  const previewMeta = document.getElementById('preview-meta');
  const previewCondition = document.getElementById('preview-condition');
  const previewImage = document.getElementById('preview-image');
  
  function updatePreview() {
    if (previewTitle) previewTitle.textContent = formData.title || 'Book Title';
    if (previewMeta) previewMeta.textContent = `${formData.grade || 'Grade'} • ${formData.subject || 'Subject'}`;
    if (previewCondition) {
      if (formData.condition) {
        previewCondition.style.display = 'inline-flex';
        previewCondition.textContent = formData.condition;
        previewCondition.className = `badge badge-condition ${getConditionClass(formData.condition)}`;
      } else {
        previewCondition.style.display = 'none';
      }
    }
  }
  
  // Title input
  const titleInput = document.getElementById('book-title');
  if (titleInput) {
    titleInput.addEventListener('input', (e) => {
      formData.title = e.target.value;
      updatePreview();
    });
  }
  
  // Subject buttons
  document.querySelectorAll('[data-subject]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-subject]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      formData.subject = btn.dataset.subject;
      updatePreview();
    });
  });
  
  // Grade buttons
  document.querySelectorAll('[data-grade]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-grade]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      formData.grade = btn.dataset.grade;
      updatePreview();
    });
  });
  
  // Condition buttons
  document.querySelectorAll('[data-condition]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-condition]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      formData.condition = btn.dataset.condition;
      updatePreview();
    });
  });
  
  // Contact method buttons
  document.querySelectorAll('[data-contact-method]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-contact-method]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      formData.contactMethod = btn.dataset.contactMethod;
      
      const contactInput = document.getElementById('contact-value');
      if (contactInput) {
        contactInput.placeholder = formData.contactMethod === 'email' ? 'your@email.com' : 'Your phone number';
      }
    });
  });
  
  // Image upload simulation
  const addImageBtn = document.getElementById('add-image-btn');
  const imagesContainer = document.getElementById('images-container');
  
  if (addImageBtn) {
    addImageBtn.addEventListener('click', () => {
      if (images.length < 3) {
        images.push('/placeholder.svg');
        renderImages();
      }
    });
  }
  
  function renderImages() {
    if (!imagesContainer) return;
    
    imagesContainer.innerHTML = images.map((img, index) => `
      <div class="image-upload-preview">
        <img src="${img}" alt="Book image">
        <button type="button" class="image-upload-remove" data-index="${index}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    `).join('') + (images.length < 3 ? `
      <button type="button" class="image-upload-btn" id="add-image-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        <span>Add Photo</span>
      </button>
    ` : '');
    
    // Re-attach event listeners
    document.querySelectorAll('.image-upload-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        images.splice(index, 1);
        renderImages();
      });
    });
    
    const newAddBtn = document.getElementById('add-image-btn');
    if (newAddBtn) {
      newAddBtn.addEventListener('click', () => {
        if (images.length < 3) {
          images.push('/placeholder.svg');
          renderImages();
        }
      });
    }
    
    // Update preview image
    if (previewImage) {
      if (images.length > 0) {
        previewImage.innerHTML = `<img src="${images[0]}" alt="Preview">`;
      } else {
        previewImage.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
          <span style="font-size: 0.875rem;">No image yet</span>
        `;
      }
    }
  }
  
  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Listing Created!', 'Your book has been successfully listed.');
  });
}

// ========================================
// Dashboard Page
// ========================================

function initDashboardPage() {
  const navBtns = document.querySelectorAll('.dashboard-nav-btn');
  const tabContents = document.querySelectorAll('.dashboard-tab-content');
  
  if (!navBtns.length) return;
  
  // Tab switching
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      tabContents.forEach(content => {
        content.style.display = content.dataset.tab === tab ? 'block' : 'none';
      });
    });
  });
  
  // Status filter
  const statusBtns = document.querySelectorAll('.status-filter-btn');
  const listingsGrid = document.getElementById('listings-grid');
  let statusFilter = 'All';
  
  function renderListings() {
    const userBooks = mockBooks.slice(0, 4);
    const filtered = statusFilter === 'All' 
      ? userBooks 
      : userBooks.filter(book => book.status === statusFilter);
    
    if (!listingsGrid) return;
    
    if (filtered.length === 0) {
      listingsGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
            </svg>
          </div>
          <h3 class="empty-state-title">No listings yet</h3>
          <p class="empty-state-description">Start sharing your books with the community</p>
          <a href="list.html" class="btn btn-hero btn-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            List Your First Book
          </a>
        </div>
      `;
    } else {
      listingsGrid.innerHTML = filtered.map(book => `
        <div class="listing-card">
          <div class="listing-card-image">
            <div class="listing-card-image-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
              </svg>
            </div>
            <span class="badge ${getStatusClass(book.status)} listing-card-badge">${book.status}</span>
          </div>
          <div class="listing-card-content">
            <h3 class="listing-card-title">${book.title}</h3>
            <p class="listing-card-meta">${book.grade} • ${book.subject}</p>
            <div class="listing-card-stats">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
              </svg>
              <span>12 inquiries</span>
              <span>•</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <span>48 views</span>
            </div>
            <div class="listing-card-actions">
              <button class="btn btn-outline btn-sm flex-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
                </svg>
                Edit
              </button>
              <button class="btn btn-ghost btn-icon-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: hsl(var(--destructive));">
                  <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }
  
  statusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      statusBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      statusFilter = btn.dataset.status;
      renderListings();
    });
  });
  
  // Profile form
  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Profile Updated', 'Your changes have been saved.');
    });
  }
  
  // Initial render
  renderListings();
}

// ========================================
// FAQ Page
// ========================================

function initFAQPage() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      
      // Close all other items
      faqItems.forEach(i => i.classList.remove('open'));
      
      // Toggle current item
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

// ========================================
// Contact Page
// ========================================

function initContactPage() {
  const form = document.getElementById('contact-form');
  
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending...';
      submitBtn.disabled = true;
      
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showToast('Message Sent!', "We'll get back to you as soon as possible.");
      form.reset();
      
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    });
  }
}

// ========================================
// Homepage - Featured Books
// ========================================

function initHomepage() {
  const featuredGrid = document.getElementById('featured-books');
  
  if (featuredGrid) {
    featuredGrid.innerHTML = mockBooks.slice(0, 4).map(createBookCard).join('');
  }
}

// ========================================
// Initialize on DOM Ready
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initHomepage();
  initBrowsePage();
  initBookDetailPage();
  initListBookPage();
  initDashboardPage();
  initFAQPage();
  initContactPage();
});
