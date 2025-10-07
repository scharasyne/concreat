// Student Dashboard JavaScript
class StudentDashboard {
    constructor() {
        this.currentUser = null;
        this.studentData = {};
        this.initializeAuth();
        this.initializeComponents();
        this.loadStudentData();
    }

    initializeAuth() {
        if (!AuthUtils.requireAuth('student')) {
            return;
        }
        
        this.currentUser = AuthUtils.getCurrentUser();
        this.updateUserProfile();
    }

    updateUserProfile() {
        if (this.currentUser) {
            document.getElementById('userName').textContent = this.currentUser.name;
            document.getElementById('userAvatar').textContent = this.currentUser.name.charAt(0).toUpperCase();
            document.getElementById('welcomeName').textContent = this.currentUser.name.split(' ')[0];
        }
    }

    initializeComponents() {
        this.initializeModals();
        this.initializeForms();
        this.startRealTimeUpdates();
    }

    initializeModals() {
        window.openModal = (modalId) => {
            document.getElementById(modalId).style.display = 'block';
        };

        window.closeModal = (modalId) => {
            document.getElementById(modalId).style.display = 'none';
        };

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    initializeForms() {
        document.getElementById('addGoalForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddGoal();
        });
    }

    loadStudentData() {
        // Load or create student profile data
        const studentKey = `student_${this.currentUser.username}`;
        this.studentData = JSON.parse(localStorage.getItem(studentKey) || '{}');
        
        // Initialize with default data if empty
        if (Object.keys(this.studentData).length === 0) {
            this.studentData = this.getDefaultStudentData();
            localStorage.setItem(studentKey, JSON.stringify(this.studentData));
        }
        
        this.updateDashboard();
    }

    getDefaultStudentData() {
        return {
            enrolledCourses: [
                {
                    id: 'course_1',
                    name: 'Safety Training',
                    progress: 75,
                    grade: 88,
                    completedModules: 6,
                    totalModules: 8,
                    status: 'active'
                },
                {
                    id: 'course_2',
                    name: 'Concrete Fundamentals',
                    progress: 45,
                    grade: 82,
                    completedModules: 3,
                    totalModules: 6,
                    status: 'in-progress'
                },
                {
                    id: 'course_3',
                    name: 'Equipment Operation',
                    progress: 0,
                    grade: null,
                    completedModules: 0,
                    totalModules: 5,
                    status: 'not-started'
                }
            ],
            assignments: [
                {
                    id: 'assign_1',
                    title: 'Safety Protocol Quiz',
                    course: 'Safety Training',
                    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
                    status: 'pending',
                    priority: 'high'
                },
                {
                    id: 'assign_2',
                    title: 'Concrete Mixing Assignment',
                    course: 'Concrete Fundamentals',
                    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days
                    status: 'in-progress',
                    priority: 'medium'
                },
                {
                    id: 'assign_3',
                    title: 'Equipment Maintenance Report',
                    course: 'Equipment Operation',
                    dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days
                    status: 'not-started',
                    priority: 'low'
                }
            ],
            completedAssignments: 12,
            overallGrade: 85,
            goals: [
                {
                    id: 'goal_1',
                    title: 'Complete Safety Training',
                    progress: 75,
                    targetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
                    description: 'Master all safety protocols and procedures'
                },
                {
                    id: 'goal_2',
                    title: 'Master Concrete Mixing',
                    progress: 30,
                    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    description: 'Learn advanced concrete mixing techniques'
                }
            ],
            achievements: [
                {
                    id: 'achieve_1',
                    title: 'Safety Champion',
                    description: 'Completed all safety modules with 90%+ scores',
                    icon: '🏆',
                    earnedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: 'achieve_2',
                    title: 'Quick Learner',
                    description: 'Completed 3 modules in one week',
                    icon: '⭐',
                    earnedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
                }
            ],
            schedule: [
                {
                    day: 'Monday',
                    time: '09:00 AM',
                    course: 'Safety Training',
                    topic: 'Hazard Identification',
                    type: 'lecture'
                },
                {
                    day: 'Wednesday',
                    time: '02:00 PM',
                    course: 'Concrete Fundamentals',
                    topic: 'Mix Design Lab',
                    type: 'practical'
                },
                {
                    day: 'Friday',
                    time: '10:00 AM',
                    course: 'Safety Training',
                    topic: 'Assessment Test',
                    type: 'exam'
                }
            ]
        };
    }

    updateDashboard() {
        this.updateStatistics();
        this.updateUpcomingDeadlines();
        this.updateRecentActivity();
        this.updateCourseProgress();
        this.updateLearningGoals();
        this.updateAchievements();
        this.updateSchedule();
    }

    updateStatistics() {
        document.getElementById('enrolledCourses').textContent = this.studentData.enrolledCourses.length;
        document.getElementById('completedAssignments').textContent = this.studentData.completedAssignments;
        
        const pendingTasks = this.studentData.assignments.filter(a => a.status === 'pending' || a.status === 'in-progress').length;
        document.getElementById('pendingTasks').textContent = pendingTasks;
        document.getElementById('overallGrade').textContent = this.studentData.overallGrade + '%';
    }

    updateUpcomingDeadlines() {
        const container = document.getElementById('upcomingDeadlines');
        const sortedAssignments = this.studentData.assignments
            .filter(a => a.status !== 'completed')
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 3);

        container.innerHTML = sortedAssignments.map(assignment => {
            const dueDate = new Date(assignment.dueDate);
            const isUrgent = dueDate - new Date() < 48 * 60 * 60 * 1000; // Less than 2 days
            const dueDateStr = this.formatDueDate(dueDate);
            
            return `
                <div class="d-flex justify-between align-center mb-3">
                    <div>
                        <strong class="text-primary">${assignment.title}</strong><br>
                        <small class="text-secondary">${assignment.course} • Due ${dueDateStr}</small>
                    </div>
                    <span class="badge badge-${isUrgent ? 'warning' : this.getStatusBadgeClass(assignment.status)}">
                        ${isUrgent ? 'Urgent' : this.getStatusText(assignment.status)}
                    </span>
                </div>
            `;
        }).join('');
    }

    updateRecentActivity() {
        const activities = [
            {
                type: 'assignment',
                icon: '✓',
                title: 'Assignment Submitted',
                description: 'Quality Control Assessment • 2 hours ago',
                badgeClass: 'success'
            },
            {
                type: 'module',
                icon: '📚',
                title: 'Module Completed',
                description: 'Advanced Concrete Technology • Yesterday',
                badgeClass: 'info'
            },
            {
                type: 'grade',
                icon: '🎯',
                title: 'Grade Received',
                description: 'Safety Protocol Test: 92% • 2 days ago',
                badgeClass: 'warning'
            }
        ];

        const container = document.getElementById('recentActivity');
        container.innerHTML = activities.map(activity => `
            <div class="mb-3">
                <div class="d-flex align-center gap-2 mb-1">
                    <span class="badge badge-${activity.badgeClass}">${activity.icon}</span>
                    <strong>${activity.title}</strong>
                </div>
                <small class="text-secondary">${activity.description}</small>
            </div>
        `).join('');
    }

    updateCourseProgress() {
        const container = document.getElementById('courseProgress');
        container.innerHTML = this.studentData.enrolledCourses.map(course => {
            const statusClass = course.status === 'active' ? 'success' : 
                               course.status === 'in-progress' ? 'info' : 'warning';
            const buttonText = course.status === 'not-started' ? 'Start Course' : 'Continue Learning';
            const buttonClass = course.status === 'not-started' ? 'btn-secondary' : 'btn-primary';
            
            return `
                <div class="card">
                    <div class="card-header">
                        <h4 class="text-primary">${course.name}</h4>
                        <span class="badge badge-${statusClass}">${this.getStatusText(course.status)}</span>
                    </div>
                    <div class="mb-3">
                        <div class="d-flex justify-between mb-1">
                            <span>Progress</span>
                            <span>${course.progress}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${course.progress}%"></div>
                        </div>
                    </div>
                    <div class="d-flex justify-between text-secondary">
                        <small>${course.completedModules}/${course.totalModules} modules</small>
                        <small>Grade: ${course.grade ? course.grade + '%' : 'N/A'}</small>
                    </div>
                    <button class="btn ${buttonClass} mt-2" onclick="window.location.href='courses.html'">${buttonText}</button>
                </div>
            `;
        }).join('');
    }

    updateLearningGoals() {
        const container = document.getElementById('learningGoals');
        container.innerHTML = this.studentData.goals.map(goal => {
            const targetDate = new Date(goal.targetDate);
            const progressColor = goal.progress >= 75 ? 'success' : goal.progress >= 50 ? 'warning' : 'info';
            
            return `
                <div class="mb-3">
                    <div class="d-flex justify-between align-center mb-1">
                        <strong>${goal.title}</strong>
                        <span class="text-${progressColor}">${goal.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${goal.progress}%"></div>
                    </div>
                    <small class="text-secondary">Target: ${targetDate.toLocaleDateString()}</small>
                </div>
            `;
        }).join('');
    }

    updateAchievements() {
        const container = document.getElementById('achievements');
        container.innerHTML = this.studentData.achievements.map(achievement => `
            <div class="d-flex align-center gap-3 mb-3">
                <div class="badge badge-success" style="font-size: 1.5rem; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    ${achievement.icon}
                </div>
                <div>
                    <strong>${achievement.title}</strong><br>
                    <small class="text-secondary">${achievement.description}</small>
                </div>
            </div>
        `).join('');
    }

    updateSchedule() {
        const tbody = document.querySelector('.table tbody');
        tbody.innerHTML = this.studentData.schedule.map(item => {
            const typeClass = item.type === 'lecture' ? 'info' : 
                             item.type === 'practical' ? 'success' : 'warning';
            
            return `
                <tr>
                    <td>${item.day}</td>
                    <td>${item.time}</td>
                    <td>${item.course}</td>
                    <td>${item.topic}</td>
                    <td><span class="badge badge-${typeClass}">${this.capitalize(item.type)}</span></td>
                </tr>
            `;
        }).join('');
    }

    handleAddGoal() {
        const goalData = {
            id: 'goal_' + Date.now(),
            title: document.getElementById('goalTitle').value,
            targetDate: document.getElementById('goalTarget').value,
            description: document.getElementById('goalDescription').value,
            progress: 0
        };

        this.studentData.goals.push(goalData);
        this.saveStudentData();
        this.updateLearningGoals();
        
        this.showNotification('Learning goal added successfully!', 'success');
        closeModal('addGoalModal');
        document.getElementById('addGoalForm').reset();
    }

    saveStudentData() {
        const studentKey = `student_${this.currentUser.username}`;
        localStorage.setItem(studentKey, JSON.stringify(this.studentData));
    }

    formatDueDate(date) {
        const now = new Date();
        const diff = date - now;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) return 'Today';
        if (days === 1) return 'Tomorrow';
        if (days < 7) return `in ${days} days`;
        return date.toLocaleDateString();
    }

    getStatusBadgeClass(status) {
        const statusMap = {
            'pending': 'warning',
            'in-progress': 'info',
            'completed': 'success',
            'not-started': 'secondary',
            'active': 'success'
        };
        return statusMap[status] || 'info';
    }

    getStatusText(status) {
        const statusMap = {
            'pending': 'Pending',
            'in-progress': 'In Progress',
            'completed': 'Completed',
            'not-started': 'Not Started',
            'active': 'Active'
        };
        return statusMap[status] || status;
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    startRealTimeUpdates() {
        // Update dashboard every 5 minutes
        setInterval(() => {
            this.updateDashboard();
        }, 5 * 60 * 1000);
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

// Mobile navigation toggle
function toggleMobileNav() {
    const mobileNav = document.getElementById('mobileNav');
    mobileNav.classList.toggle('active');
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    new StudentDashboard();
});