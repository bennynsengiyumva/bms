export type Language = 'en' | 'rw';

export type UserRole = 
  | 'union_admin' 
  | 'field_admin' 
  | 'district_admin' 
  | 'church_admin' 
  | 'pastor' 
  | 'instructor' 
  | 'candidate';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  unionId?: string;
  fieldId?: string;
  districtId?: string;
  churchId?: string;
  status: 'active' | 'inactive';
}

export interface Church {
  id: string;
  name: string;
  districtId?: string;
  fieldId?: string;
  unionId?: string;
  location?: string;
}

export interface Candidate {
  id: string;
  userId: string;
  dateOfBirth?: string;
  gender?: string;
  addressProvince?: string;
  addressDistrict?: string;
  addressSector?: string;
  referralSource?: string;
  previousReligion?: string;
  instructorId?: string;
  status: 'registered' | 'in_progress' | 'ready' | 'baptized';
  registrationDate: string;
}

export interface BaptismEvent {
  id: string;
  churchId: string;
  eventDate: string;
  location?: string;
  officiatingPastorId?: string;
}

export interface Member {
  id: string;
  userId: string;
  baptismRecordId?: string;
  currentChurchId: string;
  status: 'active' | 'inactive' | 'transferred' | 'deceased';
  joinDate: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface SpiritualGrowthLog {
  id: string;
  candidateId: string;
  logType: string;
  content: string;
  loggedAt: string;
}

export interface BaptismInterview {
  id: string;
  candidateId: string;
  interviewerId: string;
  interviewDate?: string;
  readinessScore?: number;
  feedback?: string;
  isReady: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
