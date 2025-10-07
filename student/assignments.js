// Student Assignments JavaScript
class StudentAssignments {
    constructor() {
        this.currentUser = null;
        this.assignments = [];
        this.currentTab = 'pending';
        
        this.initializeAuth();
        this.initializeComponents();
        this.loadAssignments();
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
        }
    }

    initializeComponents() {
        this.initializeModals();
        this.initializeTabs();
        this.initializeFilters();
        this.initializeForms();
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

    initializeTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });
    }

    initializeFilters() {
        document.getElementById('statusFilter').addEventListener('change', () => this.filterAssignments());
        document.getElementById('courseFilter').addEventListener('change', () => this.filterAssignments());
    }

    initializeForms() {
        document.getElementById('submitForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmitAssignment();
        });

        window.saveDraft = () => {
            this.saveDraft();
        };
    }

    loadAssignments() {
        // Load assignments from localStorage or create default data
        const studentKey = `assignments_${this.currentUser.username}`;
        this.assignments = JSON.parse(localStorage.getItem(studentKey) || '[]');
        
        if (this.assignments.length === 0) {
            this.assignments = this.getDefaultAssignments();
            localStorage.setItem(studentKey, JSON.stringify(this.assignments));
        }
        
        this.updateDashboard();
    }

    getDefaultAssignments() {
        const now = new Date();
        
        return [
            {
                id: 'assign_1',
                title: 'Safety Protocol Quiz',
                course: 'Safety Training',
                courseId: 'safety',
                description: 'Complete a comprehensive quiz on safety protocols and procedures for concrete construction sites.',
                instructions: 'Answer all 20 questions. You have 60 minutes to complete the quiz. A score of 80% or higher is required to pass.',
                dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
                assignedDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
                status: 'pending',
                priority: 'high',
                points: 100,
                estimatedTime: 60,
                resources: ['Safety Manual Chapter 1-3', 'Video: Hazard Identification'],
                submissionType: 'quiz'
            },
            {
                id: 'assign_2',
                title: 'Concrete Mixing Assignment',
                course: 'Concrete Fundamentals',
                courseId: 'concrete',
                description: 'Prepare a detailed report on concrete mixing ratios and techniques for different construction scenarios.',
                instructions: 'Create a 1500-word report covering mixing ratios, techniques, and quality control measures. Include at least 3 references.',
                dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days
                assignedDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
                status: 'in-progress',
                priority: 'medium',
                points: 150,
                estimatedTime: 180,
                resources: ['Concrete Technology Handbook', 'Lab Manual Chapter 5'],
                submissionType: 'report',
                draft: {
                    text: 'Started working on the introduction section...',
                    savedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
                }
            },
            {
                id: 'assign_3',
                title: 'Equipment Maintenance Report',
                course: 'Equipment Operation',
                courseId: 'equipment',
                description: 'Document maintenance procedures for concrete mixing equipment including preventive maintenance schedules.',
                instructions: 'Create a comprehensive maintenance guide with schedules, checklists, and troubleshooting procedures.',
                dueDate: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days
                assignedDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
                status: 'pending',
                priority: 'low',
                points: 120,
                estimatedTime: 240,
                resources: ['Equipment Manual', 'Maintenance Checklists'],
                submissionType: 'report'
            },
            {
                id: 'assign_4',
                title: 'Quality Control Assessment',
                course: 'Advanced Concrete Technology',
                courseId: 'advanced',
                description: 'Complete a comprehensive assessment on quality control procedures in concrete production.',
                instructions: 'Submit detailed answers to case studies and practical scenarios. Show all calculations.',
                dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago (overdue)
                assignedDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
                status: 'overdue',
                priority: 'high',
                points: 200,
                estimatedTime: 120,
                resources: ['QC Manual', 'Case Study Documents'],
                submissionType: 'assessment'
            },
            {
                id: 'assign_5',
                title: 'Basic Safety Test',
                course: 'Safety Training',
                courseId: 'safety',
                description: 'Foundational safety knowledge test covering basic protocols and emergency procedures.',
                instructions: 'Complete all sections of the test. Review safety manual before attempting.',
                dueDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
                assignedDate: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days ago
                status: 'submitted',
                priority: 'medium',
                points: 80,
                estimatedTime: 45,
                resources: ['Basic Safety Manual'],
                submissionType: 'test',
                submission: {
                    text: 'Completed all safety test questions with detailed explanations.',
                    submittedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
                    files: ['safety_test_responses.pdf']
                }
            },
            {
                id: 'assign_6',
                title: 'Concrete Strength Analysis',
                course: 'Concrete Fundamentals',
                courseId: 'concrete',
                description: 'Analyze concrete strength test results and provide recommendations.',
                instructions: 'Review lab results and create analysis report with graphs and recommendations.',
                dueDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
                assignedDate: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString(), // 28 days ago
                status: 'graded',
                priority: 'medium',
                points: 100,
                estimatedTime: 90,
                resources: ['Lab Results Data', 'Analysis Templates'],
                submissionType: 'analysis',
                submission: {
                    text: 'Comprehensive analysis of concrete strength data with statistical analysis and recommendations.',
                    submittedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                    files: ['strength_analysis.pdf', 'data_charts.xlsx']
                },
                grade: {
                    score: 87,
                    feedback: 'Excellent analysis with clear recommendations. Statistical methods were applied correctly.',
                    gradedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                    gradedBy: 'John Administrator'
                }
            }
        ];
    }

    updateDashboard() {
        this.updateStatistics();
        this.updateUrgentAssignments();
        this.updateAssignmentTabs();
    }

    updateStatistics() {
        const total = this.assignments.length;
        const completed = this.assignments.filter(a => a.status === 'submitted' || a.status === 'graded').length;
        const pending = this.assignments.filter(a => a.status === 'pending' || a.status === 'in-progress').length;
        
        // Calculate average score from graded assignments
        const gradedAssignments = this.assignments.filter(a => a.grade && a.grade.score);
        const averageScore = gradedAssignments.length > 0 
            ? Math.round(gradedAssignments.reduce((sum, a) => sum + a.grade.score, 0) / gradedAssignments.length)
            : 0;

        document.getElementById('totalAssignments').textContent = total;
        document.getElementById('completedAssignments').textContent = completed;
        document.getElementById('pendingAssignments').textContent = pending;
        document.getElementById('averageScore').textContent = averageScore + '%';
    }

    updateUrgentAssignments() {
        const now = new Date();
        const urgentAssignments = this.assignments.filter(assignment => {
            const dueDate = new Date(assignment.dueDate);
            const timeDiff = dueDate - now;
            const isUrgent = timeDiff > 0 && timeDiff < 48 * 60 * 60 * 1000; // Less than 48 hours
            const isOverdue = timeDiff < 0;
            return (isUrgent || isOverdue) && (assignment.status === 'pending' || assignment.status === 'in-progress');
        });

        const urgentSection = document.getElementById('urgentAssignments');
        const urgentList = document.getElementById('urgentList');

        if (urgentAssignments.length === 0) {
            urgentSection.style.display = 'none';
        } else {
            urgentSection.style.display = 'block';
            urgentList.innerHTML = urgentAssignments.map(assignment => {
                const dueDate = new Date(assignment.dueDate);
                const isOverdue = dueDate < now;
                const statusText = isOverdue ? 'Overdue' : 'Due Soon';
                const statusClass = isOverdue ? 'danger' : 'warning';
                
                return `
                    <div class="d-flex justify-between align-center p-3" style="border-left: 4px solid var(--${isOverdue ? 'error' : 'warning'});">
                        <div>
                            <h4 class="text-primary mb-1">${assignment.title}</h4>
                            <p class="text-secondary mb-1">${assignment.course}</p>
                            <small class="text-${isOverdue ? 'danger' : 'warning'}">
                                ${isOverdue ? 'Overdue by' : 'Due'} ${this.formatDueDate(dueDate)}
                            </small>
                        </div>
                        <div class="d-flex gap-2 align-center">
                            <span class="badge badge-${statusClass}">${statusText}</span>
                            <button class="btn btn-primary" onclick="studentAssignments.viewAssignment('${assignment.id}')">
                                ${assignment.status === 'in-progress' ? 'Continue' : 'Start'}
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    updateAssignmentTabs() {
        const tabs = {
            'pending': this.assignments.filter(a => a.status === 'pending'),
            'in-progress': this.assignments.filter(a => a.status === 'in-progress'), 
            'submitted': this.assignments.filter(a => a.status === 'submitted'),
            'graded': this.assignments.filter(a => a.status === 'graded')
        };

        Object.keys(tabs).forEach(tabName => {
            const container = document.getElementById(`${tabName === 'in-progress' ? 'inProgress' : tabName}AssignmentsList`);
            const assignments = tabs[tabName];
            
            if (assignments.length === 0) {
                container.innerHTML = `
                    <div class="text-center p-4 text-secondary">
                        <p>No ${tabName.replace('-', ' ')} assignments found.</p>
                    </div>
                `;
            } else {
                container.innerHTML = assignments.map(assignment => this.renderAssignmentCard(assignment)).join('');
            }
        });
    }

    renderAssignmentCard(assignment) {
        const dueDate = new Date(assignment.dueDate);
        const now = new Date();
        const isOverdue = dueDate < now && (assignment.status === 'pending' || assignment.status === 'in-progress');
        const dueDateStr = this.formatDueDate(dueDate);
        
        return `
            <div class="card mb-3">
                <div class="card-header">
                    <div>
                        <h4 class="text-primary">${assignment.title}</h4>
                        <small class="text-secondary">${assignment.course} • ${assignment.points} points</small>
                    </div>
                    <div class="d-flex gap-2 align-center">
                        ${isOverdue ? '<span class="badge badge-danger">Overdue</span>' : ''}
                        <span class="badge badge-${this.getPriorityClass(assignment.priority)}">${assignment.priority}</span>
                    </div>
                </div>
                <div class="p-3">
                    <p class="mb-2">${assignment.description}</p>
                    
                    <div class="d-flex justify-between text-secondary mb-3">
                        <small>Due: ${dueDateStr}</small>
                        <small>Estimated: ${assignment.estimatedTime} minutes</small>
                    </div>
                    
                    ${assignment.grade ? `
                        <div class="mb-3 p-2" style="background-color: var(--light-blue); border-radius: 6px;">
                            <div class="d-flex justify-between align-center">
                                <strong class="text-primary">Grade: ${assignment.grade.score}%</strong>
                                <small class="text-secondary">Graded by ${assignment.grade.gradedBy}</small>
                            </div>
                            ${assignment.grade.feedback ? `<p class="mb-0 mt-1"><small>${assignment.grade.feedback}</small></p>` : ''}
                        </div>
                    ` : ''}
                    
                    ${assignment.draft ? `
                        <div class="mb-3 p-2" style="background-color: var(--light-gray); border-radius: 6px;">
                            <small class="text-secondary">Draft saved: ${new Date(assignment.draft.savedAt).toLocaleString()}</small>
                        </div>
                    ` : ''}
                    
                    <div class="d-flex gap-2">
                        <button class="btn btn-primary" onclick="studentAssignments.viewAssignment('${assignment.id}')">
                            View Details
                        </button>
                        ${assignment.status === 'pending' || assignment.status === 'in-progress' ? `
                            <button class="btn btn-success" onclick="studentAssignments.submitAssignment('${assignment.id}')">
                                ${assignment.status === 'in-progress' ? 'Continue & Submit' : 'Start Assignment'}
                            </button>
                        ` : ''}
                        ${assignment.submission ? `
                            <button class="btn btn-info" onclick="studentAssignments.viewSubmission('${assignment.id}')">
                                View Submission
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    switchTab(tabName) {
        // Update button states
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('btn-primary', 'active');
            btn.classList.add('btn-outline');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.remove('btn-outline');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('btn-primary', 'active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
            content.classList.remove('active');
        });
        
        const tabId = tabName === 'in-progress' ? 'in-progressTab' : `${tabName}Tab`;
        document.getElementById(tabId).classList.remove('hidden');
        document.getElementById(tabId).classList.add('active');

        this.currentTab = tabName;
    }

    viewAssignment(assignmentId) {
        const assignment = this.assignments.find(a => a.id === assignmentId);
        if (!assignment) return;

        document.getElementById('assignmentTitle').textContent = assignment.title;
        document.getElementById('assignmentContent').innerHTML = `
            <div class="grid grid-2 mb-4">
                <div>
                    <h4 class="text-primary mb-2">Assignment Details</h4>
                    <p><strong>Course:</strong> ${assignment.course}</p>
                    <p><strong>Points:</strong> ${assignment.points}</p>
                    <p><strong>Due Date:</strong> ${new Date(assignment.dueDate).toLocaleString()}</p>
                    <p><strong>Estimated Time:</strong> ${assignment.estimatedTime} minutes</p>
                    <p><strong>Status:</strong> <span class="badge badge-${this.getStatusClass(assignment.status)}">${this.getStatusText(assignment.status)}</span></p>
                </div>
                <div>
                    <h4 class="text-primary mb-2">Resources</h4>
                    <ul class="mb-0">
                        ${assignment.resources.map(resource => `<li>${resource}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="mb-4">
                <h4 class="text-primary mb-2">Description</h4>
                <p>${assignment.description}</p>
            </div>
            
            <div class="mb-4">
                <h4 class="text-primary mb-2">Instructions</h4>
                <p>${assignment.instructions}</p>
            </div>
            
            ${assignment.grade ? `
                <div class="mb-4 p-3" style="background-color: var(--light-blue); border-radius: 6px;">
                    <h4 class="text-primary mb-2">Grade & Feedback</h4>
                    <p><strong>Score:</strong> ${assignment.grade.score}%</p>
                    <p><strong>Graded by:</strong> ${assignment.grade.gradedBy}</p>
                    <p><strong>Date:</strong> ${new Date(assignment.grade.gradedAt).toLocaleString()}</p>
                    ${assignment.grade.feedback ? `<p><strong>Feedback:</strong> ${assignment.grade.feedback}</p>` : ''}
                </div>
            ` : ''}
            
            <div class="d-flex gap-2">
                ${(assignment.status === 'pending' || assignment.status === 'in-progress') ? `
                    <button class="btn btn-success" onclick="studentAssignments.submitAssignment('${assignment.id}'); closeModal('assignmentModal')">
                        ${assignment.status === 'in-progress' ? 'Continue & Submit' : 'Start Assignment'}
                    </button>
                ` : ''}
                <button class="btn btn-outline" onclick="closeModal('assignmentModal')">Close</button>
            </div>
        `;

        openModal('assignmentModal');
    }

    submitAssignment(assignmentId) {
        const assignment = this.assignments.find(a => a.id === assignmentId);
        if (!assignment) return;

        document.getElementById('submitAssignmentId').value = assignmentId;
        document.getElementById('submitAssignmentTitle').textContent = assignment.title;
        
        // Pre-fill with draft if exists
        if (assignment.draft) {
            document.getElementById('submissionText').value = assignment.draft.text;
        }

        openModal('submitModal');
    }

    handleSubmitAssignment() {
        const assignmentId = document.getElementById('submitAssignmentId').value;
        const text = document.getElementById('submissionText').value;
        const notes = document.getElementById('submissionNotes').value;
        const files = document.getElementById('submissionFiles').files;

        const assignment = this.assignments.find(a => a.id === assignmentId);
        if (!assignment) return;

        // Create submission
        assignment.submission = {
            text: text,
            notes: notes,
            submittedAt: new Date().toISOString(),
            files: Array.from(files).map(file => file.name)
        };
        
        assignment.status = 'submitted';
        
        // Remove draft
        delete assignment.draft;

        this.saveAssignments();
        this.updateDashboard();
        
        this.showNotification('Assignment submitted successfully!', 'success');
        closeModal('submitModal');
        document.getElementById('submitForm').reset();
    }

    saveDraft() {
        const assignmentId = document.getElementById('submitAssignmentId').value;
        const text = document.getElementById('submissionText').value;

        if (!text.trim()) {
            this.showNotification('Please enter some content before saving draft.', 'warning');
            return;
        }

        const assignment = this.assignments.find(a => a.id === assignmentId);
        if (!assignment) return;

        assignment.draft = {
            text: text,
            savedAt: new Date().toISOString()
        };
        
        assignment.status = 'in-progress';

        this.saveAssignments();
        this.updateDashboard();
        
        this.showNotification('Draft saved successfully!', 'success');
    }

    saveAssignments() {
        const studentKey = `assignments_${this.currentUser.username}`;
        localStorage.setItem(studentKey, JSON.stringify(this.assignments));
    }

    filterAssignments() {
        // Implementation for filtering would go here
        // For now, we'll just reload the assignments
        this.updateAssignmentTabs();
    }

    formatDueDate(date) {
        const now = new Date();
        const diff = date - now;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        
        if (days < 0) return `${Math.abs(days)} days ago`;
        if (days === 0) return 'Today';
        if (days === 1) return 'Tomorrow';
        if (days < 7) return `in ${days} days`;
        return date.toLocaleDateString();
    }

    getPriorityClass(priority) {
        const priorityMap = {
            'high': 'danger',
            'medium': 'warning',
            'low': 'info'
        };
        return priorityMap[priority] || 'info';
    }

    getStatusClass(status) {
        const statusMap = {
            'pending': 'warning',
            'in-progress': 'info',
            'submitted': 'success',
            'graded': 'primary',
            'overdue': 'danger'
        };
        return statusMap[status] || 'info';
    }

    getStatusText(status) {
        const statusMap = {
            'pending': 'Pending',
            'in-progress': 'In Progress',
            'submitted': 'Submitted',
            'graded': 'Graded',
            'overdue': 'Overdue'
        };
        return statusMap[status] || status;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
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

// Initialize when page loads
let studentAssignments;
document.addEventListener('DOMContentLoaded', () => {
    studentAssignments = new StudentAssignments();
});