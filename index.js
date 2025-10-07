
// --- STATE ---
let currentRole = 'learner'; // Can be 'admin' or 'learner'

// --- DATA ---
const MOCK_COURSES = [
  {
    id: 1,
    title: 'Advanced Concrete Technology',
    description: 'Explore the latest advancements in concrete materials and techniques.',
    instructor: 'Dr. Evelyn Reed',
    imageUrl: 'https://images.unsplash.com/photo-1581092446333-f61b471a5f6e?q=80&w=2070&auto=format&fit=crop',
    modules: 8,
    assignments: [
      { id: 101, courseId: 1, title: 'Material Analysis Report', dueDate: '2024-08-15', submitted: true, graded: true, score: 92 },
      { id: 102, courseId: 1, title: 'Mix Design Project', dueDate: '2024-08-30', submitted: false, graded: false },
    ],
  },
  {
    id: 2,
    title: 'Construction Project Management',
    description: 'Master the principles of managing large-scale construction projects.',
    instructor: 'John Carter',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop',
    modules: 12,
    assignments: [
      { id: 201, courseId: 2, title: 'Risk Assessment Plan', dueDate: '2024-08-20', submitted: true, graded: false },
      { id: 202, courseId: 2, title: 'Final Project Blueprint', dueDate: '2024-09-10', submitted: false, graded: false },
    ],
  },
  {
    id: 3,
    title: 'Workplace Safety Standards',
    description: 'A comprehensive guide to OSHA regulations and safety protocols on site.',
    instructor: 'Maria Garcia',
    imageUrl: 'https://images.unsplash.com/photo-1580252433128-982a3c74a05d?q=80&w=2070&auto=format&fit=crop',
    modules: 6,
    assignments: [
        { id: 301, courseId: 3, title: 'Safety Audit Checklist', dueDate: '2024-08-12', submitted: true, graded: true, score: 100 },
        { id: 302, courseId: 3, title: 'Incident Report Simulation', dueDate: '2024-08-25', submitted: true, graded: true, score: 88 },
    ],
  },
];

const MOCK_STUDENT_PROGRESS = [
    { studentId: 1, studentName: 'Alice Johnson', assignments: [{ assignmentId: 101, submitted: true, score: 92 }, { assignmentId: 102, submitted: false }] },
    { studentId: 2, studentName: 'Bob Williams', assignments: [{ assignmentId: 101, submitted: true, score: 85 }, { assignmentId: 102, submitted: true, score: 95 }] },
    { studentId: 3, studentName: 'Charlie Brown', assignments: [{ assignmentId: 101, submitted: false }, { assignmentId: 102, submitted: false }] },
];

// --- SVG ICONS ---
const ICONS = {
  dashboard: 'M10.5 4.5a.75.75 0 00-1.5 0v3h-3a.75.75 0 000 1.5h3v3a.75.75 0 001.5 0v-3h3a.75.75 0 000-1.5h-3v-3zM13.5 4.5a.75.75 0 00-1.5 0v3h-3a.75.75 0 000 1.5h3v3a.75.75 0 001.5 0v-3h3a.75.75 0 000-1.5h-3v-3z M4.5 13.5a.75.75 0 00-1.5 0v3h-3a.75.75 0 000 1.5h3v3a.75.75 0 001.5 0v-3h3a.75.75 0 000-1.5h-3v-3z M6 13.5a.75.75 0 00-1.5 0v3H1.5a.75.75 0 000 1.5h3v3a.75.75 0 001.5 0v-3h3a.75.75 0 000-1.5h-3v-3z',
  courses: 'M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z',
  progress: 'M15 19.128a9.38 9.38 0 002.625.372 9.75 9.75 0 009.75-9.75c0-1.564-.37-3.039-1.031-4.335A13.5 13.5 0 0115 19.128zM10.5 19.128c1.355.333 2.76.52 4.2.52a13.5 13.5 0 010 3.75c-1.44.02-2.845-.167-4.2-.52A9.38 9.38 0 007.875 19.5a9.75 9.75 0 00-9.75-9.75c0-1.564.37-3.039 1.031-4.335A13.5 13.5 0 0110.5 19.128z',
  reports: 'M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375zM1.5 9.75v10.5C1.5 21.16 2.34 22 3.375 22h17.25c1.035 0 1.875-.84 1.875-1.875V9.75A1.875 1.875 0 0020.625 8H3.375A1.875 1.875 0 001.5 9.75zM12 11.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V12a.75.75 0 01.75-.75zM9 12.75a.75.75 0 00-1.5 0v2.25a.75.75 0 001.5 0v-2.25zM15 12a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75z',
  users: 'M15 6a3 3 0 11-6 0 3 3 0 016 0zM17.25 8.25a.75.75 0 01.75.75v4.5a2.25 2.25 0 01-2.25 2.25h-6a2.25 2.25 0 01-2.25-2.25V9a.75.75 0 011.5 0v4.5a.75.75 0 00.75.75h6a.75.75 0 00.75-.75V9a.75.75 0 01.75-.75zM5.25 8.25a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75V8.25z',
};

const createIcon = (path) => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path fill-rule="evenodd" d="${path}" clip-rule="evenodd" />
  </svg>
`;

// --- HTML TEMPLATE GENERATORS ---

const createSidebar = () => {
    const adminNav = `
        <li><a href="#" class="active">${createIcon(ICONS.dashboard)} Dashboard</a></li>
        <li><a href="#">${createIcon(ICONS.courses)} Courses</a></li>
        <li><a href="#">${createIcon(ICONS.users)} Students</a></li>
        <li><a href="#">${createIcon(ICONS.reports)} Reports</a></li>
    `;
    const learnerNav = `
        <li><a href="#" class="active">${createIcon(ICONS.dashboard)} Dashboard</a></li>
        <li><a href="#">${createIcon(ICONS.courses)} My Courses</a></li>
        <li><a href="#">${createIcon(ICONS.progress)} My Progress</a></li>
    `;
    return `
        <aside class="sidebar">
          <div class="sidebar-header"><span class="sidebar-logo">Concrete Corp.</span></div>
          <nav class="sidebar-nav"><ul>${currentRole === 'admin' ? adminNav : learnerNav}</ul></nav>
          <div class="sidebar-footer">
            <div class="user-toggle">
              <p>Viewing As:</p>
              <div class="toggle-switch">
                <button id="learner-btn" class="${currentRole === 'learner' ? 'active' : ''}">Learner</button>
                <button id="admin-btn" class="${currentRole === 'admin' ? 'active' : ''}">Admin</button>
              </div>
            </div>
          </div>
        </aside>
    `;
};

const createPageHeader = (title, subtitle) => `
    <header class="page-header">
        <h1>${title}</h1>
        <p>${subtitle}</p>
    </header>
`;

const createCard = (content, className = '') => `<div class="card ${className}">${content}</div>`;

const createStatCard = (title, value, iconPath) => {
    const content = `
        <div class="card-header">
            <h3 class="stat-label">${title}</h3>
            <div class="card-icon">${createIcon(iconPath)}</div>
        </div>
        <p class="stat-number">${value}</p>
    `;
    return createCard(content);
};

const createCourseCard = (course) => `
    <div class="card course-card">
        <div class="course-card-image" style="background-image: url(${course.imageUrl})"></div>
        <div class="course-card-content">
            <h3>${course.title}</h3>
            <p>${course.instructor}</p>
            <div class="course-card-footer">
                <span>${course.modules} Modules</span>
                <a href="#" class="btn btn-primary">View Course</a>
            </div>
        </div>
    </div>
`;

// --- DASHBOARD RENDERERS ---

const renderLearnerDashboard = () => {
    const enrolledCourses = MOCK_COURSES.length;
    const completedAssignments = MOCK_COURSES.flatMap(c => c.assignments).filter(a => a.submitted).length;
    const pendingAssignments = MOCK_COURSES.flatMap(c => c.assignments).filter(a => !a.submitted);
    const courseProgress = [
        { title: 'Advanced Concrete Technology', progress: 50 },
        { title: 'Construction Project Management', progress: 25 },
        { title: 'Workplace Safety Standards', progress: 100 },
    ];

    const myProgressContent = `
      <div class="card-header"><h3 class="card-title">My Progress</h3></div>
      <ul class="progress-list">
        ${courseProgress.map(course => `
          <li class="progress-item">
            <div class="progress-label"><span>${course.title}</span><span>${course.progress}%</span></div>
            <div class="progress-bar-container"><div class="progress-bar" style="width: ${course.progress}%"></div></div>
          </li>
        `).join('')}
      </ul>`;

    const upcomingAssignmentsContent = `
        <div class="card-header"><h3 class="card-title">Pending Assignments</h3></div>
        <ul class="assignment-list">
            ${pendingAssignments.map(a => `
                <li class="assignment-item">
                    <div>
                        <h4>${a.title}</h4>
                        <p>${MOCK_COURSES.find(c => c.id === a.courseId)?.title}</p>
                    </div>
                    <span class="assignment-due-date">Due: ${a.dueDate}</span>
                </li>
            `).join('')}
        </ul>`;

    return `
        ${createPageHeader('Welcome back!', "Here's your learning summary for today.")}
        <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))">
            ${createStatCard('Enrolled Courses', enrolledCourses, ICONS.courses)}
            ${createStatCard('Completed Tasks', completedAssignments, ICONS.progress)}
            ${createStatCard('Average Score', '93%', ICONS.reports)}
        </div>
        <div class="dashboard-grid" style="grid-template-columns: 2fr 1fr; margin-top: 2rem;">
            ${createCard(upcomingAssignmentsContent)}
            ${createCard(myProgressContent)}
        </div>
        <div style="margin-top: 2rem;">
            <h2 style="font-size: 1.75rem; font-weight: 600; margin-bottom: 1.5rem;">My Courses</h2>
            <div class="course-grid">${MOCK_COURSES.map(createCourseCard).join('')}</div>
        </div>`;
};

const renderAdminDashboard = () => {
    const totalStudents = MOCK_STUDENT_PROGRESS.length;
    const pendingSubmissions = MOCK_STUDENT_PROGRESS.flatMap(s => s.assignments).filter(a => !a.submitted).length;
    const gradedAssignments = MOCK_COURSES.flatMap(c => c.assignments).filter(a => a.graded);

    const courseSubmissionsContent = `
        <h3 class="card-title">Assignment Submissions</h3>
        <div class="table-container">
            <table>
                <thead><tr><th>Student</th><th>Status</th><th>Score</th></tr></thead>
                <tbody>
                    ${MOCK_STUDENT_PROGRESS.map(s => {
                        const assignment = s.assignments.find(a => a.assignmentId === 101);
                        return `
                            <tr>
                                <td>${s.studentName}</td>
                                <td>
                                    <span class="submission-status ${assignment?.submitted ? 'status-submitted' : 'status-pending'}">
                                        ${assignment?.submitted ? 'Submitted' : 'Pending'}
                                    </span>
                                </td>
                                <td>${assignment?.score ?? 'N/A'}</td>
                            </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>`;

    const gradedAssignmentsContent = `
        <div class="card-header"><h3 class="card-title">Completed & Graded</h3></div>
        <ul class="assignment-list">
            ${gradedAssignments.slice(0, 4).map(a => `
                <li class="assignment-item">
                    <div>
                        <h4>${a.title}</h4>
                        <p>${MOCK_COURSES.find(c => c.id === a.courseId)?.title}</p>
                    </div>
                    <span class="assignment-status status-graded">Score: ${a.score}%</span>
                </li>
            `).join('')}
        </ul>`;

    return `
        ${createPageHeader('Administrator Dashboard', "Oversee all learning activities.")}
        <div class="dashboard-grid">
            ${createStatCard('Total Courses', MOCK_COURSES.length, ICONS.courses)}
            ${createStatCard('Active Students', totalStudents, ICONS.users)}
            ${createStatCard('Pending Submissions', pendingSubmissions, ICONS.progress)}
        </div>
        <div class="dashboard-grid" style="grid-template-columns: 2fr 1fr; margin-top: 2rem;">
            ${createCard(courseSubmissionsContent)}
            ${createCard(gradedAssignmentsContent)}
        </div>
        <div style="margin-top: 2rem;">
            <h2 style="font-size: 1.75rem; font-weight: 600; margin-bottom: 1.5rem;">Manage Courses</h2>
            <div class="course-grid">${MOCK_COURSES.map(createCourseCard).join('')}</div>
        </div>`;
};

// --- MAIN APP LOGIC ---

const addEventListeners = () => {
    document.getElementById('learner-btn')?.addEventListener('click', () => {
        if (currentRole !== 'learner') {
            currentRole = 'learner';
            renderApp();
        }
    });

    document.getElementById('admin-btn')?.addEventListener('click', () => {
        if (currentRole !== 'admin') {
            currentRole = 'admin';
            renderApp();
        }
    });
};

const renderApp = () => {
    const root = document.getElementById('root');
    if (!root) return;

    const dashboardContent = currentRole === 'admin' ? renderAdminDashboard() : renderLearnerDashboard();
    root.innerHTML = `
        <div class="app-container">
            ${createSidebar()}
            <main class="main-content">${dashboardContent}</main>
        </div>`;
    addEventListeners();
};

// Initial Render
renderApp();
