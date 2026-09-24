import API from './api';

// Students Service
export const studentService = {
  getAll: async (params) => (await API.get('/students', { params })).data,
  getById: async (id) => (await API.get(`/students/${id}`)).data,
  create: async (data) => (await API.post('/students', data)).data,
  update: async (id, data) => (await API.put(`/students/${id}`, data)).data,
  delete: async (id) => (await API.delete(`/students/${id}`)).data,
};

// Faculty Service
export const facultyService = {
  getAll: async (params) => (await API.get('/faculty', { params })).data,
  getPublic: async (params) => (await API.get('/faculty/public', { params })).data,
  getById: async (id) => (await API.get(`/faculty/${id}`)).data,
  create: async (data) => (await API.post('/faculty', data)).data,
  update: async (id, data) => (await API.put(`/faculty/${id}`, data)).data,
  delete: async (id) => (await API.delete(`/faculty/${id}`)).data,
};

// Departments Service
export const departmentService = {
  getAll: async () => (await API.get('/departments')).data,
  getById: async (id) => (await API.get(`/departments/${id}`)).data,
  create: async (data) => (await API.post('/departments', data)).data,
  update: async (id, data) => (await API.put(`/departments/${id}`, data)).data,
  delete: async (id) => (await API.delete(`/departments/${id}`)).data,
};

// Courses Service
export const courseService = {
  getAll: async (params) => (await API.get('/courses', { params })).data,
  getById: async (id) => (await API.get(`/courses/${id}`)).data,
  create: async (data) => (await API.post('/courses', data)).data,
  update: async (id, data) => (await API.put(`/courses/${id}`, data)).data,
  delete: async (id) => (await API.delete(`/courses/${id}`)).data,
};

// Subjects Service
export const subjectService = {
  getAll: async (params) => (await API.get('/subjects', { params })).data,
  getById: async (id) => (await API.get(`/subjects/${id}`)).data,
  create: async (data) => (await API.post('/subjects', data)).data,
  update: async (id, data) => (await API.put(`/subjects/${id}`, data)).data,
  delete: async (id) => (await API.delete(`/subjects/${id}`)).data,
};

// Attendance Service
export const attendanceService = {
  getAll: async (params) => (await API.get('/attendance', { params })).data,
  mark: async (data) => (await API.post('/attendance', data)).data,
  update: async (id, data) => (await API.put(`/attendance/${id}`, data)).data,
  getStudentAttendance: async (studentId) => (await API.get(`/attendance/student/${studentId}`)).data,
};

// Assignments Service
export const assignmentService = {
  getAll: async (params) => (await API.get('/assignments', { params })).data,
  getById: async (id) => (await API.get(`/assignments/${id}`)).data,
  create: async (formData) =>
    (
      await API.post('/assignments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    ).data,
  update: async (id, formData) =>
    (
      await API.put(`/assignments/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    ).data,
  delete: async (id) => (await API.delete(`/assignments/${id}`)).data,
  submit: async (id, formData) =>
    (
      await API.post(`/assignments/${id}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    ).data,
  grade: async (submissionId, data) =>
    (await API.put(`/assignments/submissions/${submissionId}/grade`, data)).data,
};

// Notices Service
export const noticeService = {
  getAll: async (params) => (await API.get('/notices', { params })).data,
  getById: async (id) => (await API.get(`/notices/${id}`)).data,
  create: async (data) => (await API.post('/notices', data)).data,
  update: async (id, data) => (await API.put(`/notices/${id}`, data)).data,
  delete: async (id) => (await API.delete(`/notices/${id}`)).data,
};

// Events Service
export const eventService = {
  getAll: async () => (await API.get('/events')).data,
  getById: async (id) => (await API.get(`/events/${id}`)).data,
  create: async (data) => (await API.post('/events', data)).data,
  update: async (id, data) => (await API.put(`/events/${id}`, data)).data,
  delete: async (id) => (await API.delete(`/events/${id}`)).data,
};

// Timetable Service
export const timetableService = {
  getAll: async (params) => (await API.get('/timetable', { params })).data,
  create: async (data) => (await API.post('/timetable', data)).data,
  update: async (id, data) => (await API.put(`/timetable/${id}`, data)).data,
  delete: async (id) => (await API.delete(`/timetable/${id}`)).data,
};

// Materials Service
export const materialService = {
  getAll: async (params) => (await API.get('/materials', { params })).data,
  upload: async (formData) =>
    (
      await API.post('/materials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    ).data,
  delete: async (id) => (await API.delete(`/materials/${id}`)).data,
};

// Notifications Service
export const notificationService = {
  getAll: async () => (await API.get('/notifications')).data,
  markAsRead: async (id) => (await API.put(`/notifications/${id}/read`)).data,
  markAllAsRead: async () => (await API.put('/notifications/read-all')).data,
};

// Reports Service
export const reportService = {
  getAdminStats: async () => (await API.get('/reports/admin')).data,
  getFacultyStats: async () => (await API.get('/reports/faculty')).data,
  getStudentStats: async () => (await API.get('/reports/student')).data,
};
