/**
 * API client for BMS
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('bms_token') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bms_token');
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
}

export const api = {
  auth: {
    login: (credentials: any) => 
      fetchWithAuth('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    getMe: () => fetchWithAuth('/auth/me'),
  },
  reports: {
    getBaptismStats: () => fetchWithAuth('/reports/baptism-stats'),
    getCandidateProgress: () => fetchWithAuth('/reports/candidate-progress'),
    getChurchComparison: () => fetchWithAuth('/reports/church-comparison'),
    getGrowthAnalytics: () => fetchWithAuth('/reports/growth-analytics'),
  },
  baptism: {
    getEvents: (filters?: any) => {
      const query = filters ? `?${new URLSearchParams(filters)}` : '';
      return fetchWithAuth(`/baptism/events${query}`);
    },
  },
  instructors: {
    getAll: (filters?: any) => {
      const query = filters ? `?${new URLSearchParams(filters)}` : '';
      return fetchWithAuth(`/instructors${query}`);
    },
    getById: (id: string) => fetchWithAuth(`/instructors/${id}`),
    getMetrics: (id: string) => fetchWithAuth(`/instructors/${id}/metrics`),
    updateProfile: (id: string, data: any) => 
      fetchWithAuth(`/instructors/${id}/profile`, { method: 'PATCH', body: JSON.stringify(data) }),
    addTraining: (profileId: string, data: any) => 
      fetchWithAuth(`/instructors/profile/${profileId}/training`, { method: 'POST', body: JSON.stringify(data) }),
    getCommunications: (id: string) => fetchWithAuth(`/instructors/communications/${id}`),
  },
  candidates: {
    getAll: (filters?: any) => {
      const query = filters ? `?${new URLSearchParams(filters)}` : '';
      return fetchWithAuth(`/candidates${query}`);
    },
    assignInstructor: (id: string, instructorId: string) => 
      fetchWithAuth(`/candidates/${id}/assign-instructor`, { method: 'POST', body: JSON.stringify({ instructorId }) }),
  },
  notifications: {
    getAll: () => fetchWithAuth('/notifications'),
    markAsRead: (id: string) => fetchWithAuth(`/notifications/${id}/read`, { method: 'PATCH' }),
    markAllAsRead: () => fetchWithAuth('/notifications/read-all', { method: 'PATCH' }),
    delete: (id: string) => fetchWithAuth(`/notifications/${id}`, { method: 'DELETE' }),
  },
  broadcast: {
    getTemplates: () => fetchWithAuth('/broadcast/templates'),
    createTemplate: (data: any) => fetchWithAuth('/broadcast/templates', { method: 'POST', body: JSON.stringify(data) }),
    updateTemplate: (id: string, data: any) => fetchWithAuth(`/broadcast/templates/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteTemplate: (id: string) => fetchWithAuth(`/broadcast/templates/${id}`, { method: 'DELETE' }),
    send: (data: { subject: string; body: string; channels: string[]; recipients: string }) => 
      fetchWithAuth('/broadcast/send', { method: 'POST', body: JSON.stringify(data) }),
    getHistory: () => fetchWithAuth('/broadcast/history'),
    resend: (id: string) => fetchWithAuth(`/broadcast/history/${id}/resend`, { method: 'POST' }),
    deleteMessage: (id: string) => fetchWithAuth(`/broadcast/history/${id}`, { method: 'DELETE' }),
  },
  audit: {
    getLogs: (filters?: any) => {
      const query = filters ? `?${new URLSearchParams(filters)}` : '';
      return fetchWithAuth(`/audit/logs${query}`);
    }
  },
  membership: {
    getAll: (filters?: any) => {
      const query = filters ? `?${new URLSearchParams(filters)}` : '';
      return fetchWithAuth(`/members${query}`);
    },
    getById: (id: string) => fetchWithAuth(`/members/${id}`),
    getTransfers: (filters?: any) => {
      const query = filters ? `?${new URLSearchParams(filters)}` : '';
      return fetchWithAuth(`/members/transfers${query}`);
    },
    requestTransfer: (memberId: string, data: { toChurchId: string; notes?: string }) =>
      fetchWithAuth(`/members/${memberId}/transfer`, { method: 'POST', body: JSON.stringify(data) }),
    approveTransfer: (transferId: string) =>
      fetchWithAuth(`/members/transfers/${transferId}/approve`, { method: 'POST' }),
    rejectTransfer: (transferId: string, reason?: string) =>
      fetchWithAuth(`/members/transfers/${transferId}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),
    getCertificate: (memberId: string) => fetchWithAuth(`/members/${memberId}/certificate`),
  },
  churches: {
    getHierarchy: () => fetchWithAuth('/churches/hierarchy'),
    getUnions: () => fetchWithAuth('/churches/unions'),
    getFields: () => fetchWithAuth('/churches/fields'),
    getDistricts: () => fetchWithAuth('/churches/districts'),
    getAll: (filters?: any) => {
      const query = filters ? `?${new URLSearchParams(filters)}` : '';
      return fetchWithAuth(`/churches/churches${query}`);
    },
    getStats: () => fetchWithAuth('/churches/stats'),
    getAnnouncements: () => fetchWithAuth('/churches/announcements'),
    getMeetings: () => fetchWithAuth('/churches/meetings'),
    getMessages: () => fetchWithAuth('/churches/messages'),
    sendMessage: (data: any) => fetchWithAuth('/churches/messages', { method: 'POST', body: JSON.stringify(data) }),
  },
  documents: {
    upload: (data: any) => fetchWithAuth('/documents', { method: 'POST', body: JSON.stringify(data) }),
    getCandidateDocuments: (candidateId: string) => fetchWithAuth(`/documents/candidate/${candidateId}`),
    logAccess: (data: { documentId: string; action: string }) => 
      fetchWithAuth('/documents/log-access', { method: 'POST', body: JSON.stringify(data) }),
    getTemplates: () => fetchWithAuth('/documents/templates'),
    getTemplateById: (id: string) => fetchWithAuth(`/documents/templates/${id}`),
    createTemplate: (data: any) => fetchWithAuth('/documents/templates', { method: 'POST', body: JSON.stringify(data) }),
    updateTemplate: (id: string, data: any) => 
      fetchWithAuth(`/documents/templates/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    generateCertificate: (data: any) => fetchWithAuth('/documents/generate-certificate', { method: 'POST', body: JSON.stringify(data) }),
    signCertificate: (candidateId: string, signature: string) => 
      fetchWithAuth(`/baptism/sign-certificate/${candidateId}`, { method: 'POST', body: JSON.stringify({ signature }) }),
  },
  spiritual: {
    getProgress: (candidateId: string) => fetchWithAuth(`/spiritual/progress/${candidateId}`),
    getAll: (candidateId?: string) => {
      const query = candidateId ? `?candidateId=${candidateId}` : '';
      return fetchWithAuth(`/spiritual${query}`);
    },
    logAttendance: (data: { candidateId: string; type: string; date: string; present: boolean }) =>
      fetchWithAuth('/spiritual/attendance', { method: 'POST', body: JSON.stringify(data) }),
    logPrayerRequest: (data: { candidateId: string; request: string; answered: boolean }) =>
      fetchWithAuth('/spiritual/prayer-requests', { method: 'POST', body: JSON.stringify(data) }),
    logTestimony: (data: { candidateId: string; testimony: string }) =>
      fetchWithAuth('/spiritual/testimonies', { method: 'POST', body: JSON.stringify(data) }),
    logDiscipline: (data: { candidateId: string; type: string; duration: number; notes?: string }) =>
      fetchWithAuth('/spiritual/disciplines', { method: 'POST', body: JSON.stringify(data) }),
    updateCharacterAssessment: (candidateId: string, data: { trait: string; score: number; notes?: string }) =>
      fetchWithAuth(`/spiritual/character/${candidateId}`, { method: 'POST', body: JSON.stringify(data) }),
    getReadiness: (candidateId: string) => fetchWithAuth(`/spiritual/readiness/${candidateId}`),
    updateReadiness: (candidateId: string, data: { score: number; notes: string; isReady: boolean }) =>
      fetchWithAuth(`/spiritual/readiness/${candidateId}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },
  bibleStudy: {
    getLessons: (filters?: any) => {
      const query = filters ? `?${new URLSearchParams(filters)}` : '';
      return fetchWithAuth(`/bible-study/lessons${query}`);
    },
    getLessonById: (id: string) => fetchWithAuth(`/bible-study/lessons/${id}`),
    createLesson: (data: any) => fetchWithAuth('/bible-study/lessons', { method: 'POST', body: JSON.stringify(data) }),
    updateLesson: (id: string, data: any) => fetchWithAuth(`/bible-study/lessons/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteLesson: (id: string) => fetchWithAuth(`/bible-study/lessons/${id}`, { method: 'DELETE' }),
    getProgress: (candidateId: string) => fetchWithAuth(`/bible-study/progress/${candidateId}`),
    getAllProgress: (filters?: any) => {
      const query = filters ? `?${new URLSearchParams(filters)}` : '';
      return fetchWithAuth(`/bible-study/progress${query}`);
    },
    logCompletion: (data: { candidateId: string; lessonId: string; understandingLevel: number; notes?: string }) =>
      fetchWithAuth('/bible-study/progress', { method: 'POST', body: JSON.stringify(data) }),
    updateProgress: (progressId: string, data: { understandingLevel?: number; notes?: string; completed?: boolean }) =>
      fetchWithAuth(`/bible-study/progress/${progressId}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },
};
