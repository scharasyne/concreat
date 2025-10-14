// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
    const closeIcon = mobileMenuBtn.querySelector('.close-icon');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.toggle('hidden');
            menuIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        });
    }

    // Set current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Close mobile menu when clicking on a link
    const mobileNavLinks = mobileNav.querySelectorAll('.nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileNav.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // LEARN dropdown + toggle (desktop & mobile)
    const learnDropdown = document.getElementById('learnDropdown');
    const learnToggle = document.getElementById('learnToggle');
    const mobileLearnDropdown = document.getElementById('mobileLearnDropdown');
    const mobileLearnToggle = document.getElementById('mobileLearnToggle');
    const learnInternal = document.getElementById('learnInternal');
    const learnExternal = document.getElementById('learnExternal');

    function showSection(type) {
        if (type === 'internal') {
            learnInternal.style.display = '';
            learnExternal.style.display = 'none';
            if (learnDropdown) learnDropdown.value = 'internal';
            if (learnToggle) learnToggle.textContent = 'Show External';
            if (mobileLearnDropdown) mobileLearnDropdown.value = 'internal';
            if (mobileLearnToggle) mobileLearnToggle.textContent = 'Show External';
        } else {
            learnInternal.style.display = 'none';
            learnExternal.style.display = '';
            if (learnDropdown) learnDropdown.value = 'external';
            if (learnToggle) learnToggle.textContent = 'Show Internal';
            if (mobileLearnDropdown) mobileLearnDropdown.value = 'external';
            if (mobileLearnToggle) mobileLearnToggle.textContent = 'Show Internal';
        }
        // On switch, always reset open academy/courses
        const academyCoursesContainer = document.getElementById('academyCoursesContainer');
        if (academyCoursesContainer) academyCoursesContainer.innerHTML = '';
        let selectedAcademy = null;
        document.querySelectorAll('.academy-card.selected').forEach(card => card.classList.remove('selected'));
    }
    if (learnDropdown && learnToggle) {
        learnDropdown.addEventListener('change', function (e) { showSection(e.target.value); });
        learnToggle.addEventListener('click', function () {
            showSection(learnDropdown.value === 'internal' ? 'external' : 'internal');
        });
    }
    if (mobileLearnDropdown && mobileLearnToggle) {
        mobileLearnDropdown.addEventListener('change', function (e) { showSection(e.target.value); });
        mobileLearnToggle.addEventListener('click', function () {
            showSection(mobileLearnDropdown.value === 'internal' ? 'external' : 'internal');
        });
    }
    showSection('internal'); // default

    // Academy -> courses logic
    const academiesGrid = document.getElementById('academiesGrid');
    const academyCoursesContainer = document.getElementById('academyCoursesContainer');
    let selectedAcademy = null;
    const courses = {
        operations: [
            {title: 'Operations Essentials', desc:'Core operational concepts for every engineer.', link:'#'},
            {title: 'Plant Safety 101', desc:'Principles of hazard prevention and site safety.', link:'#'},
            {title: 'Process Optimization', desc:'Improve plant efficiency and reduce costs.', link:'#'}
        ],
        customer: [
            {title: 'Customer-first Selling', desc:'How to build long-term client loyalty.', link:'#'},
            {title: 'Logistics Management', desc:'Delivering seamless customer experiences.', link:'#'}
        ],
        culture: [
            {title: 'Ethics & Integrity', desc:'Cementing your values at work and beyond.', link:'#'},
            {title: 'Team Culture Workshop', desc:'How teams foster a positive workplace.', link:'#'}
        ],
        finance: [
            {title: 'Finance Basics', desc:'Accounting essentials for all staff.', link:'#'},
            {title: 'Public Affairs Comms', desc:'Stakeholder relations and compliance.', link:'#'}
        ]
    };
    function renderCoursesForAcademy(academy) {
        if (!academyCoursesContainer || !courses[academy]) return;
        let html = '<div class="courses-grid">';
        courses[academy].forEach(course => {
            html += `<div class="card academy-course-card"><h4 class="course-title">${course.title}</h4><p class="course-desc">${course.desc}</p><a href="${course.link}" class="btn btn-primary btn-sm">Access</a></div>`;
        });
        html += '</div>';
        academyCoursesContainer.innerHTML = html;
    }
    if (academiesGrid && academyCoursesContainer) {
        academiesGrid.addEventListener('click', function(e) {
            let card = e.target.closest('.academy-card');
            if (!card) return;
            let academy = card.getAttribute('data-academy');
            if (!academy) return;
            if (selectedAcademy === academy) {
                // collapse
                card.classList.remove('selected');
                selectedAcademy = null;
                academyCoursesContainer.innerHTML = '';
            } else {
                academiesGrid.querySelectorAll('.academy-card').forEach(el => el.classList.remove('selected'));
                card.classList.add('selected');
                selectedAcademy = academy;
                renderCoursesForAcademy(academy);
            }
        });
    }

    // Learn nav dropdown for mobile (tap-to-toggle)
    var learnNavMobile = document.getElementById('learnNavMobile');
    var learnNavDropdownMobile = document.getElementById('learnNavDropdownMobile');
    if (learnNavMobile && learnNavDropdownMobile) {
        learnNavMobile.addEventListener('click', function (e) {
            e.preventDefault();
            if (learnNavDropdownMobile.style.display === 'block') {
                learnNavDropdownMobile.style.display = 'none';
            } else {
                learnNavDropdownMobile.style.display = 'block';
            }
        });
    }

    // On academy.html: read ?mode=internal/external param and set initial state
    if (window.location.pathname.includes('academy.html')) {
      function getParamMode() {
        var params = new URLSearchParams(window.location.search);
        var mode = params.get('mode');
        return (mode === 'external') ? 'external' : 'internal';
      }
      showSection(getParamMode());
    }

    // Remove any header-level learn toggle/dropdown in academy.html (handled via nav dropdown now)

    // Set active nav on Learn for ALL academy/internal course pages
    var path = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(function(link) {
        link.classList.remove('active');
        var href = link.getAttribute('href') || '';
        // Highlight Learn if any 'academy' page
        if (path.indexOf('academy') !== -1 && href.indexOf('academy') !== -1) {
            link.classList.add('active');
        }
        // Highlight Home, About, etc. on explicit match
        else if (href && (path.endsWith(href) || path === '/' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
});

// Form submission handler (for contact page)
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Show success message
    const formData = new FormData(event.target);
    const name = formData.get('firstName');
    
    // In a real application, you would send this data to a server
    alert(`Thank you for your message, ${name}! We'll get back to you soon.`);
    
    // Reset form
    event.target.reset();
    
    return false;
}
