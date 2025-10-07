// Reports & Analytics JavaScript
class ReportsManager {
    constructor() {
        this.currentUser = null;
        this.reportData = {};
        this.filters = {
            dateRange: '30',
            category: '',
            department: '',
            status: ''
        };
        
        this.initializeAuth();
        this.initializeComponents();
        this.loadReportData();
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
        this.initializeFilters();
        this.initializeExportFunctions();
    }

    initializeFilters() {
        // Date Range Filter
        document.getElementById('dateRange').addEventListener('change', (e) => {
            this.filters.dateRange = e.target.value;
            this.updateReports();
        });

        // Category Filter
        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.filters.category = e.target.value;
            this.updateReports();
        });

        // Department Filter
        document.getElementById('departmentFilter').addEventListener('change', (e) => {
            this.filters.department = e.target.value;
            this.updateReports();
        });

        // Status Filter
        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this.filters.status = e.target.value;
            this.updateReports();
        });
    }

    initializeExportFunctions() {
        window.exportReport = () => {
            this.exportReport();
        };

        window.generateReport = () => {
            this.refreshData();
        };
    }

    loadReportData() {
        // In a real application, this would fetch data from an API
        this.reportData = this.generateMockData();
        this.updateReports();
    }

    generateMockData() {
        return {
            metrics: {
                totalEnrollments: 1247,
                completionRate: 87,
                averageScore: 82,
                activeStudents: 245,
                trends: {
                    enrollments: '+15%',
                    completion: '+3%',
                    score: '-2%',
                    students: '+8%'
                }
            },
            enrollmentTrends: [
                { month: 'Jul', enrollments: 120, completions: 98 },
                { month: 'Aug', enrollments: 135, completions: 112 },
                { month: 'Sep', enrollments: 142, completions: 119 },
                { month: 'Oct', enrollments: 138, completions: 113 },
                { month: 'Nov', enrollments: 142, completions: 119 },
                { month: 'Dec', enrollments: 156, completions: 134 }
            ],
            coursePerformance: [
                {
                    course: 'Safety Training',
                    code: 'SF-101',
                    enrolled: 45,
                    completed: 38,
                    averageScore: 88,
                    completionRate: 84.4
                },
                {
                    course: 'Concrete Fundamentals',
                    code: 'CF-201',
                    enrolled: 32,
                    completed: 25,
                    averageScore: 82,
                    completionRate: 78.1
                },
                {
                    course: 'Equipment Operation',
                    code: 'EO-301',
                    enrolled: 28,
                    completed: 20,
                    averageScore: 79,
                    completionRate: 71.4
                }
            ],
            topStudents: [
                {
                    name: 'Emily Davis',
                    department: 'Operations Dept.',
                    course: 'Safety Training',
                    score: 95,
                    completion: 100
                },
                {
                    name: 'Mike Johnson',
                    department: 'Quality Control',
                    course: 'Concrete Fundamentals',
                    score: 92,
                    completion: 100
                },
                {
                    name: 'John Doe',
                    department: 'Maintenance',
                    course: 'Equipment Operation',
                    score: 90,
                    completion: 85
                }
            ],
            departmentAnalysis: [
                {
                    name: 'Operations',
                    completionRate: 92,
                    averageScore: 87,
                    activeLearners: 85,
                    status: 'excellent'
                },
                {
                    name: 'Safety',
                    completionRate: 78,
                    averageScore: 82,
                    activeLearners: 62,
                    status: 'good'
                },
                {
                    name: 'Quality Control',
                    completionRate: 89,
                    averageScore: 90,
                    activeLearners: 43,
                    status: 'excellent'
                }
            ],
            monthlyTimeline: [
                {
                    month: 'December 2024',
                    enrollments: 156,
                    completions: 134,
                    completionRate: 86,
                    averageScore: 84,
                    trend: '+5%'
                },
                {
                    month: 'November 2024',
                    enrollments: 142,
                    completions: 119,
                    completionRate: 84,
                    averageScore: 82,
                    trend: '+2%'
                },
                {
                    month: 'October 2024',
                    enrollments: 138,
                    completions: 113,
                    completionRate: 82,
                    averageScore: 81,
                    trend: '-1%'
                }
            ]
        };
    }

    updateReports() {
        this.updateMetrics();
        this.updateTopStudents();
        this.updateCoursePerformance();
        this.updateChartPlaceholders();
    }

    updateMetrics() {
        const metrics = this.reportData.metrics;
        
        document.getElementById('totalEnrollments').textContent = metrics.totalEnrollments.toLocaleString();
        document.getElementById('completionRate').textContent = metrics.completionRate + '%';
        document.getElementById('averageScore').textContent = metrics.averageScore;
        document.getElementById('activeStudents').textContent = metrics.activeStudents;

        // Update trend indicators would be implemented here
        // For now, they're hardcoded in HTML
    }

    updateTopStudents() {
        const tbody = document.getElementById('topStudents');
        const students = this.reportData.topStudents;

        tbody.innerHTML = students.map(student => `
            <tr>
                <td>
                    <strong>${student.name}</strong><br>
                    <small class="text-secondary">${student.department}</small>
                </td>
                <td>${student.course}</td>
                <td><span class="badge badge-${this.getScoreBadgeClass(student.score)}">${student.score}%</span></td>
                <td>${student.completion}%</td>
            </tr>
        `).join('');
    }

    updateCoursePerformance() {
        const tbody = document.getElementById('coursePerformance');
        const courses = this.reportData.coursePerformance;

        tbody.innerHTML = courses.map(course => `
            <tr>
                <td>
                    <strong>${course.course}</strong><br>
                    <small class="text-secondary">${course.code}</small>
                </td>
                <td>${course.enrolled}</td>
                <td>${course.completed}</td>
                <td><span class="badge badge-${this.getScoreBadgeClass(course.averageScore)}">${course.averageScore}%</span></td>
            </tr>
        `).join('');
    }

    updateChartPlaceholders() {
        // In a real application, this would initialize actual charts
        // For now, we're using placeholder text
        
        const chartContainers = document.querySelectorAll('.chart-placeholder');
        chartContainers.forEach((container, index) => {
            // Add some simple visual indication that data is being processed
            container.style.background = `linear-gradient(45deg, 
                ${index % 2 === 0 ? 'var(--light-blue)' : 'var(--secondary-blue)'}, 
                var(--medium-gray))`;
        });
    }

    getScoreBadgeClass(score) {
        if (score >= 90) return 'success';
        if (score >= 80) return 'warning';
        if (score >= 70) return 'info';
        return 'danger';
    }

    applyFilters() {
        // Filter the data based on current filter settings
        let filteredData = { ...this.reportData };
        
        // Apply date range filter
        if (this.filters.dateRange && this.filters.dateRange !== 'custom') {
            // Implementation would filter data by date range
        }
        
        // Apply category filter
        if (this.filters.category) {
            // Implementation would filter by course category
        }
        
        // Apply department filter
        if (this.filters.department) {
            // Implementation would filter by department
        }
        
        // Apply status filter
        if (this.filters.status) {
            // Implementation would filter by status
        }
        
        return filteredData;
    }

    refreshData() {
        this.showNotification('Refreshing report data...', 'info');
        
        // Simulate API call
        setTimeout(() => {
            this.reportData = this.generateMockData();
            this.updateReports();
            this.showNotification('Report data updated successfully!', 'success');
        }, 1500);
    }

    exportReport() {
        // Create a simple CSV export
        const csvData = this.generateCSVData();
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `concorp_training_report_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.showNotification('Report exported successfully!', 'success');
    }

    generateCSVData() {
        let csv = 'ConCorp Learning Management - Training Report\n\n';
        
        // Add metrics
        csv += 'Key Metrics\n';
        csv += 'Metric,Value\n';
        csv += `Total Enrollments,${this.reportData.metrics.totalEnrollments}\n`;
        csv += `Completion Rate,${this.reportData.metrics.completionRate}%\n`;
        csv += `Average Score,${this.reportData.metrics.averageScore}\n`;
        csv += `Active Students,${this.reportData.metrics.activeStudents}\n\n`;
        
        // Add course performance
        csv += 'Course Performance\n';
        csv += 'Course,Code,Enrolled,Completed,Average Score\n';
        this.reportData.coursePerformance.forEach(course => {
            csv += `${course.course},${course.code},${course.enrolled},${course.completed},${course.averageScore}%\n`;
        });
        
        csv += '\n';
        
        // Add top students
        csv += 'Top Performing Students\n';
        csv += 'Name,Department,Course,Score,Completion\n';
        this.reportData.topStudents.forEach(student => {
            csv += `${student.name},${student.department},${student.course},${student.score}%,${student.completion}%\n`;
        });
        
        return csv;
    }

    generateDetailedReport() {
        // This would generate a more comprehensive report
        const report = {
            generatedAt: new Date().toISOString(),
            filters: this.filters,
            data: this.applyFilters(),
            summary: {
                totalCourses: this.reportData.coursePerformance.length,
                totalStudents: this.reportData.metrics.activeStudents,
                overallPerformance: this.calculateOverallPerformance()
            }
        };
        
        return report;
    }

    calculateOverallPerformance() {
        const courses = this.reportData.coursePerformance;
        const totalEnrolled = courses.reduce((sum, course) => sum + course.enrolled, 0);
        const totalCompleted = courses.reduce((sum, course) => sum + course.completed, 0);
        const weightedScoreSum = courses.reduce((sum, course) => sum + (course.averageScore * course.completed), 0);
        
        return {
            overallCompletionRate: Math.round((totalCompleted / totalEnrolled) * 100),
            overallAverageScore: Math.round(weightedScoreSum / totalCompleted),
            totalEnrollments: totalEnrolled,
            totalCompletions: totalCompleted
        };
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
            transition: all 0.3s ease;
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
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Method to generate a comprehensive analytics dashboard
    generateAnalyticsDashboard() {
        return {
            performance: this.calculateOverallPerformance(),
            trends: this.analyzeTrends(),
            recommendations: this.generateRecommendations(),
            alerts: this.generateAlerts()
        };
    }

    analyzeTrends() {
        // Analyze trends in the data
        const timeline = this.reportData.monthlyTimeline;
        
        return {
            enrollmentTrend: this.calculateTrend(timeline.map(m => m.enrollments)),
            completionTrend: this.calculateTrend(timeline.map(m => m.completionRate)),
            scoreTrend: this.calculateTrend(timeline.map(m => m.averageScore))
        };
    }

    calculateTrend(values) {
        if (values.length < 2) return 'stable';
        
        const firstHalf = values.slice(0, Math.floor(values.length / 2));
        const secondHalf = values.slice(Math.floor(values.length / 2));
        
        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
        
        const change = ((secondAvg - firstAvg) / firstAvg) * 100;
        
        if (change > 5) return 'increasing';
        if (change < -5) return 'decreasing';
        return 'stable';
    }

    generateRecommendations() {
        const performance = this.calculateOverallPerformance();
        const recommendations = [];
        
        if (performance.overallCompletionRate < 80) {
            recommendations.push({
                type: 'completion',
                priority: 'high',
                message: 'Course completion rate is below 80%. Consider reviewing course content and engagement strategies.'
            });
        }
        
        if (performance.overallAverageScore < 75) {
            recommendations.push({
                type: 'performance',
                priority: 'medium',
                message: 'Average scores are below target. Review assessment difficulty and provide additional support materials.'
            });
        }
        
        return recommendations;
    }

    generateAlerts() {
        const alerts = [];
        const courses = this.reportData.coursePerformance;
        
        courses.forEach(course => {
            if (course.completionRate < 70) {
                alerts.push({
                    type: 'low_completion',
                    severity: 'warning',
                    course: course.course,
                    message: `${course.course} has a completion rate of only ${course.completionRate.toFixed(1)}%`
                });
            }
            
            if (course.averageScore < 70) {
                alerts.push({
                    type: 'low_scores',
                    severity: 'warning',
                    course: course.course,
                    message: `${course.course} average score is ${course.averageScore}%, below acceptable threshold`
                });
            }
        });
        
        return alerts;
    }
}

// Initialize reports manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ReportsManager();
});