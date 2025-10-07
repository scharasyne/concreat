// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.currentUser = null;
        this.initializeAuth();
        this.initializeComponents();
        this.loadDashboardData();
    }

    initializeAuth() {
        // Check authentication
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
        // Initialize modals
        this.initializeModals();
        
        // Initialize forms
        this.initializeForms();
        
        // Initialize mobile navigation
        this.initializeMobileNav();
        
        // Initialize real-time updates
        this.startRealTimeUpdates();
    }

    initializeModals() {
        // Modal functionality
        window.openModal = (modalId) => {
            document.getElementById(modalId).style.display = 'block';
        };

        window.closeModal = (modalId) => {
            document.getElementById(modalId).style.display = 'none';
        };

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    initializeForms() {
        // Add Course Form
        document.getElementById('addCourseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddCourse();
        });

        // Add Assignment Form
        document.getElementById('addAssignmentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddAssignment();
        });
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

        // Quick actions toggle for mobile
        window.toggleQuickActions = () => {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('open');
        };

        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            const mobileNav = document.getElementById('mobileNav');
            const toggle = document.querySelector('.mobile-nav-toggle');
            const sidebar = document.getElementById('sidebar');
            
            if (!mobileNav.contains(e.target) && !toggle.contains(e.target)) {
                mobileNav.classList.remove('open');
            }
            
            if (window.innerWidth > 768 && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
                // Don't auto-close sidebar on desktop
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            const mobileNav = document.getElementById('mobileNav');
            const sidebar = document.getElementById('sidebar');
            
            if (window.innerWidth > 768) {
                mobileNav.classList.remove('open');
                sidebar.classList.remove('open');
            }
        });
    }

    handleAddCourse() {
        const formData = {
            name: document.getElementById('courseName').value,
            description: document.getElementById('courseDescription').value,
            category: document.getElementById('courseCategory').value,
            created: new Date().toISOString(),
            instructor: this.currentUser.name
        };

        // Save to localStorage (in real app, this would be an API call)
        this.saveCourse(formData);
        
        // Show success message
        this.showNotification('Course created successfully!', 'success');
        
        // Close modal and reset form
        closeModal('addCourseModal');
        document.getElementById('addCourseForm').reset();
        
        // Refresh dashboard data
        this.loadDashboardData();
    }

    handleAddAssignment() {
        const formData = {
            title: document.getElementById('assignmentTitle').value,
            course: document.getElementById('assignmentCourse').value,
            dueDate: document.getElementById('assignmentDueDate').value,
            description: document.getElementById('assignmentDescription').value,
            created: new Date().toISOString(),
            instructor: this.currentUser.name,
            submissions: []
        };

        // Save to localStorage
        this.saveAssignment(formData);
        
        // Show success message
        this.showNotification('Assignment created successfully!', 'success');
        
        // Close modal and reset form
        closeModal('addAssignmentModal');
        document.getElementById('addAssignmentForm').reset();
        
        // Refresh dashboard data
        this.loadDashboardData();
    }

    saveCourse(courseData) {
        let courses = JSON.parse(localStorage.getItem('courses') || '[]');
        courseData.id = 'course_' + Date.now();
        courses.push(courseData);
        localStorage.setItem('courses', JSON.stringify(courses));
    }

    saveAssignment(assignmentData) {
        let assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
        assignmentData.id = 'assignment_' + Date.now();
        assignments.push(assignmentData);
        localStorage.setItem('assignments', JSON.stringify(assignments));
    }

    loadDashboardData() {
        // Load statistics
        this.updateStatistics();
        
        // Load recent submissions
        this.loadRecentSubmissions();
        
        // Load course performance
        this.loadCoursePerformance();
        
        // Load upcoming deadlines
        this.loadUpcomingDeadlines();
    }

    updateStatistics() {
        // In a real app, these would come from API calls
        const stats = {
            totalStudents: this.getStudentCount(),
            activeCourses: this.getActiveCourseCount(),
            pendingAssignments: this.getPendingAssignmentCount(),
            completionRate: this.getCompletionRate()
        };

        document.getElementById('totalStudents').textContent = stats.totalStudents;
        document.getElementById('activeCourses').textContent = stats.activeCourses;
        document.getElementById('pendingAssignments').textContent = stats.pendingAssignments;
        document.getElementById('completionRate').textContent = stats.completionRate + '%';
    }

    getStudentCount() {
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        return students.length || 245; // Default demo data
    }

    getActiveCourseCount() {
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        return courses.length || 12; // Default demo data
    }

    getPendingAssignmentCount() {
        const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
        const pendingCount = assignments.filter(assignment => {
            const dueDate = new Date(assignment.dueDate);
            return dueDate > new Date();
        }).length;
        return pendingCount || 38; // Default demo data
    }

    getCompletionRate() {
        // Calculate completion rate based on submitted assignments
        return 87; // Default demo data
    }

    loadRecentSubmissions() {
        // Demo data for recent submissions
        const recentSubmissions = [
            {
                assignment: 'Safety Protocol Quiz',
                student: 'John Doe',
                time: '2 hours ago',
                status: 'submitted'
            },
            {
                assignment: 'Concrete Mixing Assignment',
                student: 'Emily Davis',
                time: '4 hours ago',
                status: 'submitted'
            },
            {
                assignment: 'Equipment Maintenance',
                student: 'Mike Johnson',
                time: '1 day ago',
                status: 'late'
            }
        ];

        const container = document.getElementById('recentSubmissions');
        container.innerHTML = recentSubmissions.map(submission => `
            <div class="d-flex justify-between align-center mb-2">
                <div>
                    <strong>${submission.assignment}</strong><br>
                    <small class="text-secondary">${submission.student} • ${submission.time}</small>
                </div>
                <span class="badge badge-${submission.status === 'submitted' ? 'success' : 'warning'}">
                    ${submission.status === 'submitted' ? 'Submitted' : 'Late'}
                </span>
            </div>
        `).join('');
    }

    loadCoursePerformance() {
        // Demo data for course performance
        const coursePerformance = [
            { name: 'Safety Training', percentage: 92 },
            { name: 'Concrete Fundamentals', percentage: 87 },
            { name: 'Equipment Operation', percentage: 78 }
        ];

        const container = document.getElementById('coursePerformance');
        container.innerHTML = coursePerformance.map(course => `
            <div class="mb-3">
                <div class="d-flex justify-between mb-1">
                    <span>${course.name}</span>
                    <span>${course.percentage}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${course.percentage}%"></div>
                </div>
            </div>
        `).join('');
    }

    loadUpcomingDeadlines() {
        // Demo data for upcoming deadlines
        const upcomingDeadlines = [
            {
                assignment: 'Quality Control Assessment',
                course: 'Advanced Concrete Technology',
                dueDate: 'Tomorrow',
                submissions: '15/23',
                status: 'pending'
            },
            {
                assignment: 'Site Safety Report',
                course: 'Construction Safety',
                dueDate: 'Dec 10, 2024',
                submissions: '8/18',
                status: 'overdue'
            },
            {
                assignment: 'Material Testing Lab',
                course: 'Concrete Fundamentals',
                dueDate: 'Dec 15, 2024',
                submissions: '0/25',
                status: 'not-started'
            }
        ];

        const tbody = document.getElementById('upcomingDeadlines');
        tbody.innerHTML = upcomingDeadlines.map(deadline => `
            <tr>
                <td>${deadline.assignment}</td>
                <td>${deadline.course}</td>
                <td>${deadline.dueDate}</td>
                <td>${deadline.submissions}</td>
                <td><span class="badge badge-${this.getStatusBadgeClass(deadline.status)}">
                    ${this.getStatusText(deadline.status)}
                </span></td>
            </tr>
        `).join('');
    }

    getStatusBadgeClass(status) {
        const statusMap = {
            'pending': 'warning',
            'overdue': 'danger',
            'not-started': 'info',
            'completed': 'success'
        };
        return statusMap[status] || 'info';
    }

    getStatusText(status) {
        const statusMap = {
            'pending': 'Pending',
            'overdue': 'Overdue',
            'not-started': 'Not Started',
            'completed': 'Completed'
        };
        return statusMap[status] || 'Unknown';
    }

    startRealTimeUpdates() {
        // Update dashboard data every 5 minutes
        setInterval(() => {
            this.updateStatistics();
        }, 5 * 60 * 1000);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '1rem 1.5rem';
        notification.style.borderRadius = '6px';
        notification.style.color = 'white';
        notification.style.fontWeight = '500';
        notification.style.zIndex = '9999';
        notification.style.boxShadow = 'var(--shadow-hover)';
        
        // Set background color based on type
        const colors = {
            'success': 'var(--success)',
            'warning': 'var(--warning)',
            'danger': 'var(--error)',
            'info': 'var(--secondary-blue)'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AdminDashboard();
});