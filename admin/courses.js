// Course Management JavaScript
class CourseManager {
    constructor() {
        this.currentUser = null;
        this.courses = [];
        this.currentView = 'grid';
        this.editingCourse = null;
        
        this.initializeAuth();
        this.initializeComponents();
        this.loadCourses();
    }

    initializeAuth() {
        if (!AuthUtils.requireAuth('admin')) {
            return;
        }
        
        this.currentUser = AuthUtils.getCurrentUser();
        this.updateUserProfile();
    }

    updateUserProfile() {
        if (this.currentUser) {
            document.getElementById('userName').textContent = this.currentUser.name;
            document.getElementById('userAvatar').textContent = this.currentUser.name.charAt(0).toUpperCase();
        }
    }

    initializeComponents() {
        this.initializeModals();
        this.initializeFilters();
        this.initializeForms();
        this.initializeViewSwitcher();
        this.initializeMobileNav();
    }

    initializeModals() {
        window.openModal = (modalId) => {
            document.getElementById(modalId).style.display = 'block';
        };

        window.closeModal = (modalId) => {
            document.getElementById(modalId).style.display = 'none';
            if (modalId === 'addCourseModal') {
                this.resetCourseForm();
            }
        };

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    initializeFilters() {
        document.getElementById('categoryFilter').addEventListener('change', () => this.filterCourses());
        document.getElementById('statusFilter').addEventListener('change', () => this.filterCourses());
        document.getElementById('searchInput').addEventListener('input', () => this.filterCourses());
    }

    initializeForms() {
        document.getElementById('courseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSaveCourse();
        });
    }

    initializeViewSwitcher() {
        window.switchView = (view) => {
            this.currentView = view;
            
            // Update button states
            document.getElementById('gridView').classList.toggle('btn-primary', view === 'grid');
            document.getElementById('gridView').classList.toggle('btn-outline', view !== 'grid');
            document.getElementById('listView').classList.toggle('btn-primary', view === 'list');
            document.getElementById('listView').classList.toggle('btn-outline', view !== 'list');
            
            this.renderCourses();
        };
        
        // Set default view
        switchView('grid');
    }

    initializeMobileNav() {
        // Mobile navigation toggle
        window.toggleMobileNav = () => {
            const mobileNav = document.getElementById('mobileNav');
            const sidebar = document.getElementById('sidebar');
            
            if (window.innerWidth <= 768) {
                mobileNav.classList.toggle('open');
            } else {
                sidebar.classList.toggle('open');
            }
        };

        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            const mobileNav = document.getElementById('mobileNav');
            const toggle = document.querySelector('.mobile-nav-toggle');
            const sidebar = document.getElementById('sidebar');
            
            if (!mobileNav.contains(e.target) && !toggle.contains(e.target)) {
                mobileNav.classList.remove('open');
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            const mobileNav = document.getElementById('mobileNav');
            
            if (window.innerWidth > 768) {
                mobileNav.classList.remove('open');
            }
        });
    }

    loadCourses() {
        // Load courses from localStorage
        this.courses = JSON.parse(localStorage.getItem('courses') || '[]');
        
        // Add default courses if none exist
        if (this.courses.length === 0) {
            this.courses = this.getDefaultCourses();
            localStorage.setItem('courses', JSON.stringify(this.courses));
        }
        
        this.renderCourses();
    }

    getDefaultCourses() {
        return [
            {
                id: 'course_1',
                name: 'Concrete Safety Fundamentals',
                code: 'SF-101',
                description: 'Essential safety protocols and procedures for concrete construction work.',
                category: 'safety',
                duration: 8,
                status: 'active',
                capacity: 25,
                enrolled: 18,
                objectives: 'Understand basic safety procedures, identify hazards, use protective equipment',
                prerequisites: 'None',
                instructor: 'John Administrator',
                created: new Date('2024-01-15').toISOString(),
                modules: 4,
                assignments: 3
            },
            {
                id: 'course_2',
                name: 'Advanced Concrete Technology',
                code: 'ACT-201',
                description: 'Advanced techniques in concrete mixing, pouring, and quality control.',
                category: 'technical',
                duration: 16,
                status: 'active',
                capacity: 20,
                enrolled: 15,
                objectives: 'Master advanced concrete techniques, quality control methods',
                prerequisites: 'Basic Concrete Fundamentals',
                instructor: 'Sarah Superintendent',
                created: new Date('2024-02-01').toISOString(),
                modules: 6,
                assignments: 5
            },
            {
                id: 'course_3',
                name: 'Equipment Operation & Maintenance',
                code: 'EOM-301',
                description: 'Comprehensive training on concrete equipment operation and maintenance.',
                category: 'technical',
                duration: 12,
                status: 'active',
                capacity: 15,
                enrolled: 12,
                objectives: 'Operate equipment safely, perform maintenance checks',
                prerequisites: 'Safety Fundamentals',
                instructor: 'John Administrator',
                created: new Date('2024-02-15').toISOString(),
                modules: 5,
                assignments: 4
            },
            {
                id: 'course_4',
                name: 'Project Management for Construction',
                code: 'PMC-401',
                description: 'Project management principles specific to concrete construction projects.',
                category: 'management',
                duration: 20,
                status: 'draft',
                capacity: 30,
                enrolled: 0,
                objectives: 'Plan and manage construction projects effectively',
                prerequisites: '2 years experience',
                instructor: 'John Administrator',
                created: new Date('2024-03-01').toISOString(),
                modules: 8,
                assignments: 6
            }
        ];
    }

    filterCourses() {
        const category = document.getElementById('categoryFilter').value;
        const status = document.getElementById('statusFilter').value;
        const search = document.getElementById('searchInput').value.toLowerCase();

        let filtered = this.courses.filter(course => {
            const matchesCategory = !category || course.category === category;
            const matchesStatus = !status || course.status === status;
            const matchesSearch = !search || 
                course.name.toLowerCase().includes(search) ||
                course.code.toLowerCase().includes(search) ||
                course.description.toLowerCase().includes(search);

            return matchesCategory && matchesStatus && matchesSearch;
        });

        this.renderCourses(filtered);
    }

    renderCourses(coursesToRender = null) {
        const courses = coursesToRender || this.courses;
        const container = document.getElementById('coursesContainer');
        
        if (this.currentView === 'grid') {
            container.className = 'grid grid-3';
            container.innerHTML = courses.map(course => this.renderCourseCard(course)).join('');
        } else {
            container.className = '';
            container.innerHTML = this.renderCourseTable(courses);
        }
    }

    renderCourseCard(course) {
        const statusClass = course.status === 'active' ? 'success' : 
                           course.status === 'draft' ? 'warning' : 'info';
        
        return `
            <div class="card">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">${course.name}</h3>
                        <small class="text-secondary">${course.code}</small>
                    </div>
                    <span class="badge badge-${statusClass}">${course.status}</span>
                </div>
                <div class="card-body">
                    <p class="text-secondary mb-2">${course.description.substring(0, 100)}${course.description.length > 100 ? '...' : ''}</p>
                    
                    <div class="mb-2">
                        <small class="text-secondary">Category:</small>
                        <span class="badge badge-info">${this.getCategoryLabel(course.category)}</span>
                    </div>
                    
                    <div class="d-flex justify-between mb-2">
                        <small>Duration: ${course.duration} hours</small>
                        <small>Enrolled: ${course.enrolled}/${course.capacity}</small>
                    </div>
                    
                    <div class="progress-bar mb-3">
                        <div class="progress-fill" style="width: ${(course.enrolled / course.capacity) * 100}%"></div>
                    </div>
                    
                    <div class="d-flex gap-1">
                        <button class="btn btn-primary" onclick="courseManager.viewCourse('${course.id}')">View</button>
                        <button class="btn btn-secondary" onclick="courseManager.editCourse('${course.id}')">Edit</button>
                        <button class="btn btn-danger" onclick="courseManager.deleteCourse('${course.id}')">Delete</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderCourseTable(courses) {
        return `
            <table class="table">
                <thead>
                    <tr>
                        <th>Course</th>
                        <th>Category</th>
                        <th>Duration</th>
                        <th>Enrolled</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${courses.map(course => `
                        <tr>
                            <td>
                                <strong>${course.name}</strong><br>
                                <small class="text-secondary">${course.code}</small>
                            </td>
                            <td><span class="badge badge-info">${this.getCategoryLabel(course.category)}</span></td>
                            <td>${course.duration} hours</td>
                            <td>${course.enrolled}/${course.capacity}</td>
                            <td><span class="badge badge-${course.status === 'active' ? 'success' : course.status === 'draft' ? 'warning' : 'info'}">${course.status}</span></td>
                            <td>
                                <div class="d-flex gap-1">
                                    <button class="btn btn-primary" onclick="courseManager.viewCourse('${course.id}')">View</button>
                                    <button class="btn btn-secondary" onclick="courseManager.editCourse('${course.id}')">Edit</button>
                                    <button class="btn btn-danger" onclick="courseManager.deleteCourse('${course.id}')">Delete</button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    getCategoryLabel(category) {
        const categories = {
            'safety': 'Safety Training',
            'technical': 'Technical Skills',
            'management': 'Management',
            'compliance': 'Compliance'
        };
        return categories[category] || category;
    }

    viewCourse(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) return;

        document.getElementById('detailsTitle').textContent = course.name;
        document.getElementById('courseDetailsContent').innerHTML = `
            <div class="grid grid-2">
                <div>
                    <h4 class="text-primary mb-2">Course Information</h4>
                    <p><strong>Code:</strong> ${course.code}</p>
                    <p><strong>Category:</strong> ${this.getCategoryLabel(course.category)}</p>
                    <p><strong>Duration:</strong> ${course.duration} hours</p>
                    <p><strong>Status:</strong> <span class="badge badge-${course.status === 'active' ? 'success' : 'warning'}">${course.status}</span></p>
                    <p><strong>Instructor:</strong> ${course.instructor}</p>
                    <p><strong>Created:</strong> ${new Date(course.created).toLocaleDateString()}</p>
                </div>
                <div>
                    <h4 class="text-primary mb-2">Enrollment</h4>
                    <p><strong>Capacity:</strong> ${course.capacity} students</p>
                    <p><strong>Enrolled:</strong> ${course.enrolled} students</p>
                    <p><strong>Available:</strong> ${course.capacity - course.enrolled} spots</p>
                    <div class="progress-bar mb-2">
                        <div class="progress-fill" style="width: ${(course.enrolled / course.capacity) * 100}%"></div>
                    </div>
                    <p><strong>Modules:</strong> ${course.modules}</p>
                    <p><strong>Assignments:</strong> ${course.assignments}</p>
                </div>
            </div>
            
            <div class="mt-3">
                <h4 class="text-primary mb-2">Description</h4>
                <p>${course.description}</p>
            </div>
            
            <div class="mt-3">
                <h4 class="text-primary mb-2">Learning Objectives</h4>
                <p>${course.objectives}</p>
            </div>
            
            <div class="mt-3">
                <h4 class="text-primary mb-2">Prerequisites</h4>
                <p>${course.prerequisites}</p>
            </div>
            
            <div class="d-flex gap-2 mt-4">
                <button class="btn btn-primary" onclick="courseManager.editCourse('${course.id}'); closeModal('courseDetailsModal')">Edit Course</button>
                <button class="btn btn-secondary" onclick="window.location.href='assignments.html?course=${course.id}'">Manage Assignments</button>
                <button class="btn btn-success" onclick="alert('Student management feature coming soon!')">View Students</button>
            </div>
        `;
        
        openModal('courseDetailsModal');
    }

    editCourse(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) return;

        this.editingCourse = course;
        
        // Populate form
        document.getElementById('modalTitle').textContent = 'Edit Course';
        document.getElementById('courseId').value = course.id;
        document.getElementById('courseName').value = course.name;
        document.getElementById('courseCode').value = course.code;
        document.getElementById('courseDescription').value = course.description;
        document.getElementById('courseCategory').value = course.category;
        document.getElementById('courseDuration').value = course.duration;
        document.getElementById('courseStatus').value = course.status;
        document.getElementById('courseCapacity').value = course.capacity;
        document.getElementById('courseObjectives').value = course.objectives;
        document.getElementById('coursePrerequisites').value = course.prerequisites;

        openModal('addCourseModal');
    }

    deleteCourse(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) return;

        document.getElementById('confirmDelete').onclick = () => {
            this.courses = this.courses.filter(c => c.id !== courseId);
            localStorage.setItem('courses', JSON.stringify(this.courses));
            this.renderCourses();
            this.showNotification('Course deleted successfully!', 'success');
            closeModal('deleteModal');
        };

        openModal('deleteModal');
    }

    handleSaveCourse() {
        const courseData = {
            name: document.getElementById('courseName').value,
            code: document.getElementById('courseCode').value,
            description: document.getElementById('courseDescription').value,
            category: document.getElementById('courseCategory').value,
            duration: parseInt(document.getElementById('courseDuration').value) || 0,
            status: document.getElementById('courseStatus').value,
            capacity: parseInt(document.getElementById('courseCapacity').value) || 30,
            objectives: document.getElementById('courseObjectives').value,
            prerequisites: document.getElementById('coursePrerequisites').value,
            instructor: this.currentUser.name
        };

        const courseId = document.getElementById('courseId').value;
        
        if (courseId) {
            // Update existing course
            const index = this.courses.findIndex(c => c.id === courseId);
            if (index !== -1) {
                this.courses[index] = { ...this.courses[index], ...courseData };
                this.showNotification('Course updated successfully!', 'success');
            }
        } else {
            // Create new course
            courseData.id = 'course_' + Date.now();
            courseData.enrolled = 0;
            courseData.created = new Date().toISOString();
            courseData.modules = 0;
            courseData.assignments = 0;
            
            this.courses.push(courseData);
            this.showNotification('Course created successfully!', 'success');
        }

        localStorage.setItem('courses', JSON.stringify(this.courses));
        this.renderCourses();
        closeModal('addCourseModal');
    }

    resetCourseForm() {
        document.getElementById('modalTitle').textContent = 'Add New Course';
        document.getElementById('courseForm').reset();
        document.getElementById('courseId').value = '';
        this.editingCourse = null;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            z-index: 9999;
            box-shadow: var(--shadow-hover);
        `;
        
        const colors = {
            'success': 'var(--success)',
            'warning': 'var(--warning)',
            'danger': 'var(--error)',
            'info': 'var(--secondary-blue)'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Initialize course manager when page loads
let courseManager;
document.addEventListener('DOMContentLoaded', () => {
    courseManager = new CourseManager();
});