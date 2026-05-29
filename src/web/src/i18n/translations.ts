// Translation type definition
export interface TranslationStructure {
  nav: {
    home: string;
    login: string;
    register: string;
    logout: string;
    dashboard: string;
    candidates: string;
    bibleStudy: string;
    spiritualGrowth: string;
    baptism: string;
    membership: string;
    instructors: string;
    churches: string;
    reports: string;
    documents: string;
    settings: string;
    notifications: string;
  };
  churches: {
    title: string;
    subtitle: string;
    directoryTab: string;
    statsTab: string;
    communicationTab: string;
    profileTab: string;
    hierarchyTitle: string;
    statsTitle: string;
    totalChurches: string;
    activeInstructors: string;
    avgGrowth: string;
    editProfile: string;
    createProfile: string;
    churchName: string;
    type: string;
    pastorName: string;
    phone: string;
    address: string;
    communicationTitle: string;
    composeMessage: string;
    noMessages: string;
    churchList: string;
    district: string;
  };
  documents: {
    title: string;
    subtitle: string;
    repositoryTab: string;
    templatesTab: string;
    bulkTab: string;
    logsTab: string;
    uploadButton: string;
    createTemplate: string;
    templateName: string;
    templateType: string;
    lastUpdated: string;
    actions: string;
    searchPlaceholder: string;
    fileName: string;
    fileSize: string;
    fileType: string;
    uploadedBy: string;
    accessDate: string;
    user: string;
    action: string;
    generateBulk: string;
    selectTemplate: string;
    preview: string;
    download: string;
    delete: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    email: string;
    password: string;
    confirmPassword: string;
    forgotPassword: string;
    loginButton: string;
    registerTitle: string;
    registerSubtitle: string;
    fullName: string;
    phone: string;
    role: string;
    selectRole: string;
    church: string;
    selectChurch: string;
    candidateCode: string;
    noAccount: string;
    hasAccount: string;
    signUp: string;
    signIn: string;
    resetPassword: string;
    resetPasswordTitle: string;
    resetPasswordSubtitle: string;
    backToLogin: string;
    sendResetLink: string;
    passwordResetSent: string;
    or: string;
  };
  roles: {
    union_admin: string;
    field_admin: string;
    district_admin: string;
    church_admin: string;
    pastor: string;
    instructor: string;
    candidate: string;
  };
  dashboard: {
    welcome: string;
    activeCandidates: string;
    pendingBaptisms: string;
    lessonsCompleted: string;
    baptizedThisMonth: string;
    recentActivity: string;
    quickActions: string;
    registerCandidate: string;
    logLesson: string;
    viewReports: string;
    upcomingBaptisms: string;
    noUpcomingBaptisms: string;
  };
  bibleStudy: {
    title: string;
    subtitle: string;
    lessons: string;
    lessonCatalog: string;
    logCompletion: string;
    logLessonCompletion: string;
    lessonTitle: string;
    lessonDescription: string;
    learningObjectives: string;
    duration: string;
    searchPlaceholder: string;
    searchLessons: string;
    viewProgress: string;
    noLessonsFound: string;
    lessonProgress: string;
    markComplete: string;
    completed: string;
    completedOf: string;
    inProgress: string;
    notStarted: string;
    scheduleNextLesson: string;
    schedule: string;
    nextLesson: string;
    previousLesson: string;
    notes: string;
    instructorNotes: string;
    understandingLevel: string;
    candidateProgress: string;
    overallProgress: string;
    lessonDetails: string;
    done: string;
    progress: string;
    addLesson: string;
    editLesson: string;
    deleteLesson: string;
    manageCatalog: string;
    lessonOrder: string;
    objectives: string;
    saveLesson: string;
    cancelLesson: string;
    confirmDelete: string;
    progressPercentage: string;
    lessonCompleted: string;
    assessmentScore: string;
    selectCandidate: string;
    markAsComplete: string;
  };
  spiritual: {
    title: string;
    spiritualGrowth: string;
    attendance: string;
    prayerLife: string;
    testimony: string;
    lifeTransformation: string;
    mentorInteractions: string;
    characterAssessment: string;
    character: string;
    spiritualDisciplines: string;
    interviewPreparation: string;
    readinessScore: string;
    readiness: string;
    candidateReadiness: string;
    worshipAttendance: string;
    prayerMeetingAttendance: string;
    prayerRequests: string;
    logAttendance: string;
    logPrayerRequest: string;
    logTestimony: string;
    logDiscipline: string;
    attendanceTracking: string;
    worshipServices: string;
    prayerMeetings: string;
    prayerRequest: string;
    testimonyLogs: string;
    disciplineLogs: string;
    disciplineType: string;
    duration: string;
    addEntry: string;
    viewHistory: string;
    characterTraits: string;
    honesty: string;
    kindness: string;
    patience: string;
    humility: string;
    service: string;
    assessmentNotes: string;
    overallReadiness: string;
    readyForBaptism: string;
    notReady: string;
    inProgress: string;
  };
  baptism: {
    title: string;
    scheduleBaptism: string;
    selectDate: string;
    selectLocation: string;
    officiatingPastor: string;
    candidateList: string;
    baptismOrder: string;
    witness: string;
    sponsor: string;
    confirmBaptism: string;
    baptismCertificate: string;
    generateCertificate: string;
    serviceDetails: string;
    location: string;
    date: string;
    time: string;
    candidatesReady: string;
    noCandidatesReady: string;
    markBaptized: string;
    baptized: string;
    baptismHistory: string;
    exportRecords: string;
    verifyRequirements: string;
    bibleStudyProgress: string;
    interviewStatus: string;
    signCertificate: string;
    applySavedSignature: string;
    drawSignature: string;
    clearSignature: string;
    signatureSaved: string;
    requirementsVerified: string;
    requirementsNotMet: string;
    signaturePlaceholder: string;
  };
  candidate: {
    registration: string;
    title: string;
    personalInfo: string;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    male: string;
    female: string;
    contactInfo: string;
    email: string;
    phone: string;
    address: string;
    province: string;
    district: string;
    sector: string;
    referralInfo: string;
    referralSource: string;
    churchReferral: string;
    previousAffiliation: string;
    previousReligion: string;
    churchAssignment: string;
    localChurch: string;
    selectLocalChurch: string;
    instructor: string;
    assignedInstructor: string;
    selectInstructor: string;
    baptismInterview: string;
    scheduleInterview: string;
    interviewDate: string;
    interviewer: string;
    readinessScore: string;
    notes: string;
    documents: string;
    uploadDocuments: string;
    submitRegistration: string;
    registrationSuccess: string;
    registrationRef: string;
    churchReferralInfo: string;
    additionalNotes: string;
    registered: string;
    inProgress: string;
    ready: string;
    baptized: string;
    status: string;
    candidateDirectory: string;
    newCandidate: string;
    candidateList: string;
    candidateId: string;
    progress: string;
    lastActivity: string;
    scheduleLesson: string;
    viewDetails: string;
    noCandidatesFound: string;
    candidateDetails: string;
    editCandidate: string;
    deleteCandidate: string;
    confirmDelete: string;
    familyBackground: string;
    invitedBy: string;
    directory: string;
    searchPlaceholder: string;
    filterByStatus: string;
    filterByChurch: string;
    registrationDate: string;
    statusRegistered: string;
    statusInProgress: string;
    statusReady: string;
    statusBaptized: string;
    enterFullName: string;
    enterDistrict: string;
    enterSector: string;
    placeholderEmail: string;
    placeholderPhone: string;
    kigali: string;
    northernProvince: string;
    southernProvince: string;
    easternProvince: string;
    westernProvince: string;
    kigaliCentral: string;
    kigaliNorth: string;
    kigaliSouth: string;
    ruhengeri: string;
    butare: string;
    registerNewCandidate: string;
    failedToRegister: string;
    manageCandidates: string;
  };
  instructor: {
    directory: string;
    title: string;
    subtitle: string;
    qualifications: string;
    specialization: string;
    experience: string;
    experienceYears: string;
    assignedCandidates: string;
    activeCandidates: string;
    lessonsCompleted: string;
    avgReadiness: string;
    baptismsThisYear: string;
    assignCandidate: string;
    selectCandidate: string;
    selectCandidatePlaceholder: string;
    assignButton: string;
    trainingRecords: string;
    addTraining: string;
    trainingTitle: string;
    trainingDate: string;
    trainingProvider: string;
    noInstructorsFound: string;
    viewProfile: string;
    workloadVisualization: string;
    performanceOverview: string;
  };
  membership: {
    directory: string;
    subtitle: string;
    addMember: string;
    searchPlaceholder: string;
    memberDetails: string;
    personalInfo: string;
    contactInfo: string;
    churchInfo: string;
    currentChurch: string;
    joinDate: string;
    baptismInfo: string;
    baptismDate: string;
    baptismChurch: string;
    involvement: string;
    departments: string;
    roles: string;
    transferRequest: string;
    requestTransfer: string;
    transferDescription: string;
    toChurch: string;
    selectChurch: string;
    transferNotes: string;
    transferNotesPlaceholder: string;
    submitTransfer: string;
    transferHistory: string;
    certificates: string;
    generateCertificate: string;
    active: string;
    inactive: string;
    transferred: string;
    noMembersFound: string;
  };
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    view: string;
    search: string;
    filter: string;
    export: string;
    loading: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    confirm: string;
    yes: string;
    no: string;
    submit: string;
    next: string;
    previous: string;
    close: string;
    back: string;
    date: string;
    status: string;
    actions: string;
    name: string;
    description: string;
    type: string;
    required: string;
    optional: string;
    all: string;
    none: string;
    select: string;
    selectOption: string;
    noData: string;
    done: string;
    inProgress: string;
    schedule: string;
    print: string;
    send: string;
  };
  mfa: {
    setupTitle: string;
    setupSubtitle: string;
    scanQRCode: string;
    manualEntry: string;
    verificationCode: string;
    enableButton: string;
    disableButton: string;
    challengeTitle: string;
    challengeSubtitle: string;
    verifyButton: string;
    useBackupCode: string;
    invalidCode: string;
    enabled: string;
    disabled: string;
    twoFactorAuth: string;
    backupCodes: string;
    backupCodesTitle: string;
    backupCodesSubtitle: string;
    backupCodesWarning: string;
    downloadCodes: string;
  };
  settings: {
    security: string;
    securitySubtitle: string;
    loginHistory: string;
    currentSession: string;
    sessions: string;
    sessionsDescription: string;
    manageSessions: string;
    userManagement: string;
    userManagementSubtitle: string;
    addUser: string;
    lastLogin: string;
    roleManagement: string;
    roleMatrix: string;
  };
  audit: {
    title: string;
    subtitle: string;
    userActivity: string;
    resourceAccess: string;
    timestamp: string;
    ipAddress: string;
    noLogsFound: string;
  };
  reports: {
    title: string;
    subtitle: string;
    baptismStats: string;
    candidateProgress: string;
    demographics: string;
    churchComparison: string;
    growthAnalytics: string;
    totalCandidates: string;
    avgCompletion: string;
    baptizedTotal: string;
    customReport: string;
    generateReport: string;
    exportPdf: string;
    exportExcel: string;
    selectDateRange: string;
    startDate: string;
    endDate: string;
    applyFilters: string;
  };
  notifications: {
    title: string;
    subtitle: string;
    unread: string;
    allRead: string;
    markAsRead: string;
    markAllAsRead: string;
    noNotifications: string;
    justNow: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
    broadcastTitle: string;
    broadcastSubtitle: string;
    recipients: string;
    channels: string;
    subject: string;
    subjectPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    showPreview: string;
    hidePreview: string;
    preview: string;
    sendBroadcast: string;
    smsWarning: string;
    templateManager: string;
    templateManagerSubtitle: string;
    newTemplate: string;
    templateName: string;
    templateNamePlaceholder: string;
    templateType: string;
    emailSubject: string;
    emailSubjectPlaceholder: string;
    insertVariable: string;
    messageBody: string;
    messageBodyPlaceholder: string;
    characters: string;
    searchTemplates: string;
    noTemplates: string;
    editTemplate: string;
    createTemplate: string;
    messageHistory: string;
    messageHistorySubtitle: string;
    searchMessages: string;
    noMessagesFound: string;
    messageDetails: string;
    sentBy: string;
    totalRecipients: string;
    readCount: string;
    readRate: string;
    statusSent: string;
    statusDelivered: string;
    statusFailed: string;
    resend: string;
    updated: string;
  };
  validation: {
    required: string;
    invalidEmail: string;
    invalidPhone: string;
    passwordTooShort: string;
    passwordMismatch: string;
    invalidDate: string;
  };
  passwordStrength: {
    veryWeak: string;
    weak: string;
    fair: string;
    strong: string;
    veryStrong: string;
  };
  language: {
    selectLanguage: string;
    english: string;
    kinyarwanda: string;
  };
  footer: {
    rights: string;
    version: string;
  };
}

export const translations: Record<'en' | 'rw', TranslationStructure> = {
  en: {
    nav: {
      home: 'Home',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      dashboard: 'Dashboard',
      candidates: 'Candidates',
      bibleStudy: 'Bible Study',
      spiritualGrowth: 'Spiritual Growth',
      baptism: 'Baptism',
      membership: 'Membership',
      instructors: 'Instructors',
      churches: 'Churches',
      reports: 'Reports',
      documents: 'Documents',
      settings: 'Settings',
      notifications: 'Notifications',
    },
    churches: {
      title: 'Church Coordination',
      subtitle: 'Manage organizational structure and inter-church communication',
      directoryTab: 'Directory',
      statsTab: 'Regional Stats',
      communicationTab: 'Communication',
      profileTab: 'Church Management',
      hierarchyTitle: 'Church Hierarchy',
      statsTitle: 'Regional Statistics',
      totalChurches: 'Total Churches',
      activeInstructors: 'Active Instructors',
      avgGrowth: 'Avg. Growth',
      editProfile: 'Edit Church Profile',
      createProfile: 'Create Church Profile',
      churchName: 'Church Name',
      type: 'Church Type',
      pastorName: 'Assigned Pastor',
      phone: 'Phone Number',
      address: 'Address',
      communicationTitle: 'Inter-church Communication',
      composeMessage: 'Compose Message',
      noMessages: 'No messages found',
      churchList: 'Church List',
      district: 'District',
    },
    documents: {
      title: 'Document & Certificate Management',
      subtitle: 'Manage church documents, baptism certificates, and templates',
      repositoryTab: 'Document Repository',
      templatesTab: 'Certificate Templates',
      bulkTab: 'Bulk Generation',
      logsTab: 'Access Logs',
      uploadButton: 'Upload Document',
      createTemplate: 'Create Template',
      templateName: 'Template Name',
      templateType: 'Type',
      lastUpdated: 'Last Updated',
      actions: 'Actions',
      searchPlaceholder: 'Search documents...',
      fileName: 'File Name',
      fileSize: 'Size',
      fileType: 'Type',
      uploadedBy: 'Uploaded By',
      accessDate: 'Access Date',
      user: 'User',
      action: 'Action',
      generateBulk: 'Generate Certificates',
      selectTemplate: 'Select Template',
      preview: 'Preview',
      download: 'Download',
      delete: 'Delete',
    },
    auth: {
      loginTitle: 'Welcome Back',
      loginSubtitle: 'Sign in to continue to BMS',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot password?',
      loginButton: 'Sign In',
      registerTitle: 'Create Account',
      registerSubtitle: 'Join the BMS community',
      fullName: 'Full Name',
      phone: 'Phone Number',
      role: 'Role',
      selectRole: 'Select your role',
      church: 'Church',
      selectChurch: 'Select your church',
      candidateCode: 'Candidate Code',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      signUp: 'Sign Up',
      signIn: 'Sign In',
      resetPassword: 'Reset Password',
      resetPasswordTitle: 'Reset your password',
      resetPasswordSubtitle: 'Enter your email to receive reset instructions',
      backToLogin: 'Back to Login',
      sendResetLink: 'Send Reset Link',
      passwordResetSent: 'Password reset link sent to your email',
      or: 'or',
    },
    roles: {
      union_admin: 'Union Administrator',
      field_admin: 'Field Administrator',
      district_admin: 'District Administrator',
      church_admin: 'Church Administrator',
      pastor: 'Pastor',
      instructor: 'Bible Instructor',
      candidate: 'Baptism Candidate',
    },
    dashboard: {
      welcome: 'Welcome',
      activeCandidates: 'Active Candidates',
      pendingBaptisms: 'Pending Baptisms',
      lessonsCompleted: 'Lessons Completed',
      baptizedThisMonth: 'Baptized This Month',
      recentActivity: 'Recent Activity',
      quickActions: 'Quick Actions',
      registerCandidate: 'Register Candidate',
      logLesson: 'Log Lesson',
      viewReports: 'View Reports',
      upcomingBaptisms: 'Upcoming Baptisms',
      noUpcomingBaptisms: 'No upcoming baptisms scheduled',
    },
    bibleStudy: {
      title: 'Bible Study Lessons',
      subtitle: 'View and manage Bible study curriculum',
      lessons: 'Lessons',
      lessonCatalog: 'Lesson Catalog',
      logCompletion: 'Log Lesson Completion',
      logLessonCompletion: 'Log Lesson Completion',
      lessonTitle: 'Lesson Title',
      lessonDescription: 'Lesson Description',
      learningObjectives: 'Learning Objectives',
      duration: 'Duration',
      searchPlaceholder: 'Search lessons...',
      searchLessons: 'Search lessons...',
      viewProgress: 'View Progress',
      noLessonsFound: 'No lessons found matching your search.',
      lessonProgress: 'Lesson Progress',
      markComplete: 'Mark Complete',
      completed: 'Completed',
      completedOf: 'of lessons completed',
      inProgress: 'In Progress',
      notStarted: 'Not Started',
      scheduleNextLesson: 'Schedule Next Lesson',
      schedule: 'Schedule',
      nextLesson: 'Next Lesson',
      previousLesson: 'Previous Lesson',
      notes: 'Notes',
      instructorNotes: 'Instructor Notes',
      understandingLevel: 'Understanding Level',
      candidateProgress: 'Candidate Progress',
      overallProgress: 'Overall Progress',
      lessonDetails: 'Lesson Details',
      done: 'Done',
      progress: 'Progress',
      addLesson: 'Add Lesson',
      editLesson: 'Edit Lesson',
      deleteLesson: 'Delete Lesson',
      manageCatalog: 'Manage Lesson Catalog',
      lessonOrder: 'Lesson Order',
      objectives: 'Objectives',
      saveLesson: 'Save Lesson',
      cancelLesson: 'Cancel',
      confirmDelete: 'Are you sure you want to delete this lesson?',
      progressPercentage: 'Progress Percentage',
      lessonCompleted: 'Lesson Completed',
      assessmentScore: 'Assessment Score',
      selectCandidate: 'Select Candidate',
      markAsComplete: 'Mark as Complete',
    },
    spiritual: {
      title: 'Spiritual Growth',
      spiritualGrowth: 'Spiritual Growth',
      attendance: 'Attendance',
      prayerLife: 'Prayer Life',
      testimony: 'Testimony',
      lifeTransformation: 'Life Transformation',
      mentorInteractions: 'Mentor Interactions',
      characterAssessment: 'Character Assessment',
      character: 'Character',
      spiritualDisciplines: 'Spiritual Disciplines',
      interviewPreparation: 'Interview Preparation',
      readinessScore: 'Readiness Score',
      readiness: 'Readiness',
      candidateReadiness: 'Candidate Readiness',
      worshipAttendance: 'Worship Attendance',
      prayerMeetingAttendance: 'Prayer Meeting Attendance',
      prayerRequests: 'Prayer Requests',
      logAttendance: 'Log Attendance',
      logPrayerRequest: 'Log Prayer Request',
      logTestimony: 'Log Testimony',
      logDiscipline: 'Log Discipline',
      attendanceTracking: 'Attendance Tracking',
      worshipServices: 'Worship Services',
      prayerMeetings: 'Prayer Meetings',
      prayerRequest: 'Prayer Request',
      testimonyLogs: 'Testimony Logs',
      disciplineLogs: 'Discipline Logs',
      disciplineType: 'Discipline Type',
      duration: 'Duration',
      addEntry: 'Add Entry',
      viewHistory: 'View History',
      characterTraits: 'Character Traits',
      honesty: 'Honesty',
      kindness: 'Kindness',
      patience: 'Patience',
      humility: 'Humility',
      service: 'Service',
      assessmentNotes: 'Assessment Notes',
      overallReadiness: 'Overall Readiness',
      readyForBaptism: 'Ready for Baptism',
      notReady: 'Not Ready',
      inProgress: 'In Progress',
    },
    baptism: {
      title: 'Baptism Management',
      scheduleBaptism: 'Schedule Baptism',
      selectDate: 'Select Date',
      selectLocation: 'Select Location',
      officiatingPastor: 'Officiating Pastor',
      candidateList: 'Candidates',
      baptismOrder: 'Baptism Order',
      witness: 'Witness',
      sponsor: 'Sponsor',
      confirmBaptism: 'Confirm Baptism',
      baptismCertificate: 'Baptism Certificate',
      generateCertificate: 'Generate Certificate',
      serviceDetails: 'Service Details',
      location: 'Location',
      date: 'Date',
      time: 'Time',
      candidatesReady: 'Candidates Ready',
      noCandidatesReady: 'No candidates ready for baptism',
      markBaptized: 'Mark as Baptized',
      baptized: 'Baptized',
      baptismHistory: 'Baptism History',
      exportRecords: 'Export Records',
      verifyRequirements: 'Verify Requirements',
      bibleStudyProgress: 'Bible Study Progress',
      interviewStatus: 'Interview Status',
      signCertificate: 'Sign Certificate',
      applySavedSignature: 'Apply Saved Signature',
      drawSignature: 'Draw Signature',
      clearSignature: 'Clear Signature',
      signatureSaved: 'Signature applied successfully',
      requirementsVerified: 'All requirements verified',
      requirementsNotMet: 'Requirements not met',
      signaturePlaceholder: 'Sign here',
    },
    candidate: {
      registration: 'Candidate Registration',
      title: 'Candidate',
      personalInfo: 'Personal Information',
      fullName: 'Full Name',
      dateOfBirth: 'Date of Birth',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      contactInfo: 'Contact Information',
      email: 'Email',
      phone: 'Phone Number',
      address: 'Address',
      province: 'Province',
      district: 'District',
      sector: 'Sector',
      referralInfo: 'Referral Information',
      referralSource: 'Who invited you?',
      churchReferral: 'Church Referral',
      previousAffiliation: 'Previous Affiliation',
      previousReligion: 'Previous Religion (if any)',
      churchAssignment: 'Church Assignment',
      localChurch: 'Local Church',
      selectLocalChurch: 'Select Local Church',
      instructor: 'Assigned Instructor',
      assignedInstructor: 'Assigned Instructor',
      selectInstructor: 'Select Instructor',
      baptismInterview: 'Baptism Interview',
      scheduleInterview: 'Schedule Interview',
      interviewDate: 'Interview Date',
      interviewer: 'Interviewer',
      readinessScore: 'Readiness Score',
      notes: 'Notes',
      documents: 'Documents',
      uploadDocuments: 'Upload Documents',
      submitRegistration: 'Submit Registration',
      registrationSuccess: 'Candidate registered successfully',
      registrationRef: 'Registration Reference',
      churchReferralInfo: 'Church & Referral Information',
      additionalNotes: 'Additional Notes',
      registered: 'Registered',
      inProgress: 'In Progress',
      ready: 'Ready',
      baptized: 'Baptized',
      status: 'Status',
      candidateDirectory: 'Candidate Directory',
      newCandidate: 'New Candidate',
      candidateList: 'Candidate List',
      candidateId: 'Candidate ID',
      progress: 'Progress',
      lastActivity: 'Last Activity',
      scheduleLesson: 'Schedule Lesson',
      viewDetails: 'View Details',
      noCandidatesFound: 'No candidates found',
      candidateDetails: 'Candidate Details',
      editCandidate: 'Edit Candidate',
      deleteCandidate: 'Delete Candidate',
      confirmDelete: 'Are you sure you want to delete this candidate?',
      familyBackground: 'Family Background',
      invitedBy: 'Invited By',
      directory: 'Candidate Directory',
      searchPlaceholder: 'Search candidates by name or ID...',
      filterByStatus: 'Filter by Status',
      filterByChurch: 'Filter by Church',
      registrationDate: 'Registration Date',
      statusRegistered: 'Registered',
      statusInProgress: 'In Progress',
      statusReady: 'Ready for Baptism',
      statusBaptized: 'Baptized',
      enterFullName: 'Enter full name',
      enterDistrict: 'Enter district',
      enterSector: 'Enter sector',
      placeholderEmail: 'email@example.com',
      placeholderPhone: '+250 788 000 000',
      kigali: 'Kigali',
      northernProvince: 'Northern Province',
      southernProvince: 'Southern Province',
      easternProvince: 'Eastern Province',
      westernProvince: 'Western Province',
      kigaliCentral: 'Kigali Central Church',
      kigaliNorth: 'Kigali North Church',
      kigaliSouth: 'Kigali South Church',
      ruhengeri: 'Ruhengeri Church',
      butare: 'Butare Church',
      registerNewCandidate: 'Register a new baptism candidate',
      failedToRegister: 'Failed to register candidate. Please try again.',
      manageCandidates: 'Manage baptism candidates and their preparation progress',
    },
    instructor: {
      directory: 'Instructor Directory',
      title: 'Instructors & Mentors',
      subtitle: 'Manage Bible instructors and their assigned candidates',
      qualifications: 'Qualifications',
      specialization: 'Specialization',
      experience: 'Experience',
      experienceYears: 'years',
      assignedCandidates: 'Assigned Candidates',
      activeCandidates: 'Active Candidates',
      lessonsCompleted: 'Lessons Completed',
      avgReadiness: 'Avg. Readiness',
      baptismsThisYear: 'Baptisms This Year',
      assignCandidate: 'Assign Candidate',
      selectCandidate: 'Select a Candidate',
      selectCandidatePlaceholder: 'Choose a candidate to assign',
      assignButton: 'Assign',
      trainingRecords: 'Training Records',
      addTraining: 'Add Training',
      trainingTitle: 'Training Title',
      trainingDate: 'Training Date',
      trainingProvider: 'Training Provider',
      noInstructorsFound: 'No instructors found',
      viewProfile: 'View Profile',
      workloadVisualization: 'Workload Distribution',
      performanceOverview: 'Performance Overview',
    },
    membership: {
      directory: 'Member Directory',
      subtitle: 'Manage church members and their records',
      addMember: 'Add Member',
      searchPlaceholder: 'Search members...',
      memberDetails: 'Member Details',
      personalInfo: 'Personal Information',
      contactInfo: 'Contact Information',
      churchInfo: 'Church Information',
      currentChurch: 'Current Church',
      joinDate: 'Join Date',
      baptismInfo: 'Baptism Information',
      baptismDate: 'Baptism Date',
      baptismChurch: 'Baptism Church',
      involvement: 'Church Involvement',
      departments: 'Departments',
      roles: 'Roles',
      transferRequest: 'Transfer Request',
      requestTransfer: 'Request Transfer',
      transferDescription: 'Request a transfer to another church within the denomination.',
      toChurch: 'Destination Church',
      selectChurch: 'Select a church',
      transferNotes: 'Notes',
      transferNotesPlaceholder: 'Reason for transfer request...',
      submitTransfer: 'Submit Transfer Request',
      transferHistory: 'Transfer History',
      certificates: 'Certificates',
      generateCertificate: 'Generate Certificate',
      active: 'Active',
      inactive: 'Inactive',
      transferred: 'Transferred',
      noMembersFound: 'No members found',
    },
    mfa: {
      setupTitle: 'Set up Two-Factor Authentication',
      setupSubtitle: 'Scan the QR code with your authenticator app',
      scanQRCode: 'Scan QR Code',
      manualEntry: 'Or enter this code manually:',
      verificationCode: 'Verification Code',
      enableButton: 'Enable 2FA',
      disableButton: 'Disable 2FA',
      challengeTitle: 'Two-Factor Authentication',
      challengeSubtitle: 'Enter the code from your authenticator app',
      verifyButton: 'Verify',
      useBackupCode: 'Use a backup code instead',
      invalidCode: 'Invalid verification code. Please try again.',
      enabled: 'Enabled',
      disabled: 'Disabled',
      twoFactorAuth: 'Two-Factor Authentication',
      backupCodes: 'Backup Codes',
      backupCodesTitle: 'Your Backup Codes',
      backupCodesSubtitle: 'Save these codes in a safe place. You can use any of them to sign in if you lose access to your authenticator.',
      backupCodesWarning: 'These codes can only be used once. Store them securely.',
      downloadCodes: 'Download Codes',
    },
    settings: {
      security: 'Security Settings',
      securitySubtitle: 'Manage your account security and authentication',
      loginHistory: 'Recent Login Activity',
      currentSession: 'Current session',
      sessions: 'Active Sessions',
      sessionsDescription: 'Manage devices that are logged into your account.',
      manageSessions: 'Manage Sessions',
      userManagement: 'User Management',
      userManagementSubtitle: 'Manage system users and their roles',
      addUser: 'Add User',
      lastLogin: 'Last Login',
      roleManagement: 'Role Management',
      roleMatrix: 'Role Permission Matrix',
    },
    audit: {
      title: 'Audit Logs',
      subtitle: 'Monitor user activity and resource access',
      userActivity: 'User Activity',
      resourceAccess: 'Resource Access',
      timestamp: 'Timestamp',
      ipAddress: 'IP Address',
      noLogsFound: 'No audit logs found',
    },
    reports: {
      title: 'Reporting & Analytics',
      subtitle: 'Analyze church growth and candidate progress',
      baptismStats: 'Baptism Statistics',
      candidateProgress: 'Candidate Progress',
      demographics: 'Demographic Analysis',
      churchComparison: 'Church Comparison',
      growthAnalytics: 'Growth Analytics',
      totalCandidates: 'Total Candidates',
      avgCompletion: 'Average Completion',
      baptizedTotal: 'Total Baptized',
      customReport: 'Custom Report Builder',
      generateReport: 'Generate Report',
      exportPdf: 'Export as PDF',
      exportExcel: 'Export as Excel',
      selectDateRange: 'Select Date Range',
      startDate: 'Start Date',
      endDate: 'End Date',
      applyFilters: 'Apply Filters',
    },
    notifications: {
      title: 'Notifications',
      subtitle: 'Manage your notifications and messages',
      unread: 'unread',
      allRead: 'All notifications are read',
      markAsRead: 'Mark as read',
      markAllAsRead: 'Mark all as read',
      noNotifications: 'No notifications yet',
      justNow: 'Just now',
      minutesAgo: 'min ago',
      hoursAgo: 'hours ago',
      daysAgo: 'days ago',
      broadcastTitle: 'Broadcast Message',
      broadcastSubtitle: 'Send messages to groups of users',
      recipients: 'Recipients',
      channels: 'Channels',
      subject: 'Subject',
      subjectPlaceholder: 'Enter message subject',
      message: 'Message',
      messagePlaceholder: 'Enter your message here...',
      showPreview: 'Show Preview',
      hidePreview: 'Hide Preview',
      preview: 'Preview',
      sendBroadcast: 'Send Broadcast',
      smsWarning: 'SMS messages may incur charges',
      templateManager: 'Message Templates',
      templateManagerSubtitle: 'Manage reusable message templates',
      newTemplate: 'New Template',
      templateName: 'Template Name',
      templateNamePlaceholder: 'Enter template name',
      templateType: 'Template Type',
      emailSubject: 'Email Subject',
      emailSubjectPlaceholder: 'Enter email subject',
      insertVariable: 'Insert Variable',
      messageBody: 'Message Body',
      messageBodyPlaceholder: 'Enter message content...',
      characters: 'characters',
      searchTemplates: 'Search templates...',
      noTemplates: 'No templates yet',
      editTemplate: 'Edit Template',
      createTemplate: 'Create Template',
      messageHistory: 'Message History',
      messageHistorySubtitle: 'View sent messages and delivery status',
      searchMessages: 'Search messages...',
      noMessagesFound: 'No messages found',
      messageDetails: 'Message Details',
      sentBy: 'Sent by',
      totalRecipients: 'Total Recipients',
      readCount: 'Read',
      readRate: 'Read Rate',
      statusSent: 'Sent',
      statusDelivered: 'Delivered',
      statusFailed: 'Failed',
      resend: 'Resend',
      updated: 'Updated',
    },
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      search: 'Search',
      filter: 'Filter',
      export: 'Export',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      submit: 'Submit',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      back: 'Back',
      date: 'Date',
      status: 'Status',
      actions: 'Actions',
      name: 'Name',
      description: 'Description',
      type: 'Type',
      required: 'Required',
      optional: 'Optional',
      all: 'All',
      none: 'None',
      select: 'Select',
      selectOption: 'Select an option',
      noData: 'No data available',
      done: 'Done',
      inProgress: 'In Progress',
      schedule: 'Schedule',
      print: 'Print',
      send: 'Send',
    },
    validation: {
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
      invalidPhone: 'Please enter a valid phone number',
      passwordTooShort: 'Password must be at least 8 characters',
      passwordMismatch: 'Passwords do not match',
      invalidDate: 'Please enter a valid date',
    },
    passwordStrength: {
      veryWeak: 'Very Weak',
      weak: 'Weak',
      fair: 'Fair',
      strong: 'Strong',
      veryStrong: 'Very Strong',
    },
    language: {
      selectLanguage: 'Select Language',
      english: 'English',
      kinyarwanda: 'Kinyarwanda',
    },
    footer: {
      rights: 'All rights reserved.',
      version: 'Version',
    },
  },
  rw: {
    nav: {
      home: 'Imbere',
      login: 'Injira',
      register: 'Iyandikishe',
      logout: 'Sohoka',
      dashboard: 'Dashboard',
      candidates: 'Abategerwa',
      bibleStudy: 'Ibyigiro bya Bibiliya',
      spiritualGrowth: 'Imimerero',
      baptism: 'Ubaptizimu',
      membership: 'Abagize umuryango',
      instructors: 'Abigisha',
      churches: 'Amatorero',
      reports: 'Amanarabyaha',
      documents: 'Amadosiye',
      settings: 'Igenamiterwe',
      notifications: 'Ibibutsisho',
    },
    churches: {
      title: 'Ihuza ry\'Amatorero',
      subtitle: 'Cunga imiterere y\'ubuyobozi n\'itumanaho hagati y\'amatorero',
      directoryTab: 'Urutonde',
      statsTab: 'Imibare y\'Akarere',
      communicationTab: 'Itumanaho',
      profileTab: 'Igenamiterere ry\'Itorero',
      hierarchyTitle: 'Imiterere y\'Ubuyobozi',
      statsTitle: 'Imibare y\'Iterambere',
      totalChurches: 'Amatorero yose',
      activeInstructors: 'Abigisha bakora',
      avgGrowth: 'Impuzandengo y\'izamuka',
      editProfile: 'Hindura amakuru y\'Itorero',
      createProfile: 'Andika Itorero rishya',
      churchName: 'Izina ry\'Itorero',
      type: 'Ubwoko bw\'Itorero',
      pastorName: 'Umushumba ugenwe',
      phone: 'Nimero ya telephone',
      address: 'Aderesi',
      communicationTitle: 'Itumanaho hagati y\'amatorero',
      composeMessage: 'Andika ubutumwa',
      noMessages: 'Nta butumwa buhari',
      churchList: 'Urutonde rw\'amatorero',
      district: 'Akarere',
    },
    documents: {
      title: 'Gucunga Amadosiye n\'Impamyabumenyi',
      subtitle: 'Cunga amadosiye y\'itorero, impamyabumenyi z\'ububatisimu n\'ingero zazo',
      repositoryTab: 'Ububiko bw\'Amadosiye',
      templatesTab: 'Ingero z\'Impamyabumenyi',
      bulkTab: 'Gukora Impamyabumenyi Nyinshi',
      logsTab: 'Amayeri y\'Amadosiye',
      uploadButton: 'Bika Idosiye',
      createTemplate: 'Kora Urugero',
      templateName: 'Izina ry\'Urugero',
      templateType: 'Ubwoko',
      lastUpdated: 'Byavuguruwe bwa nyuma',
      actions: 'Ibikorwa',
      searchPlaceholder: 'Shakisha amadosiye...',
      fileName: 'Izina ry\'Idosiye',
      fileSize: 'Ingano',
      fileType: 'Ubwoko',
      uploadedBy: 'Yabitswe na',
      accessDate: 'Itariki yo kureba',
      user: 'Umukoresha',
      action: 'Igikorwa',
      generateBulk: 'Kora Impamyabumenyi',
      selectTemplate: 'Hitamo Urugero',
      preview: 'Ibanze',
      download: 'Kurura',
      delete: 'Siba',
    },
    auth: {
      loginTitle: 'Murakaza neza',
      loginSubtitle: 'Injira wongerere ku BMS',
      email: 'Imeyili',
      password: 'Ijambobanga',
      confirmPassword: 'Emeza ijambobanga',
      forgotPassword: 'Wibagiwe ijambobanga ryawe?',
      loginButton: 'Injira',
      registerTitle: 'Kora konti',
      registerSubtitle: 'Join the BMS community',
      fullName: 'Izina ryuzuye',
      phone: 'Nimero ya telephone',
      role: 'Inshingano',
      selectRole: 'Hitamo inshingano yawe',
      church: 'Itorero',
      selectChurch: 'Hitamo itorero ryawe',
      candidateCode: 'Kode y\'umwegerwa',
      noAccount: 'Nta konti ufite?',
      hasAccount: 'Ufite konti jo?',
      signUp: 'Iyandikishe',
      signIn: 'Injira',
      resetPassword: 'Ongera ijambobanga',
      resetPasswordTitle: 'Ongera ijambobanga ryawe',
      resetPasswordSubtitle: 'Shyiramo imeyili yawe kugira ngo uone amabwiriza yo kongera ijambobanga',
      backToLogin: 'Subira inyuma',
      sendResetLink: 'Ohereza link yo kongera',
      passwordResetSent: 'Link yo kongera ijambobanga yoherejwe kuri imeyili yawe',
      or: 'cyangwa',
    },
    roles: {
      union_admin: 'Umuyobozi wa Union',
      field_admin: 'Umuyobozi wa Field',
      district_admin: 'Umuyobozi wa District',
      church_admin: 'Umuyobozi w\'Itorero',
      pastor: 'Umushumba',
      instructor: 'Umwigisha wa Bibiliya',
      candidate: 'Umwegerwa w\'ubaptizimu',
    },
    dashboard: {
      welcome: 'Murakaza neza',
      activeCandidates: 'Abategerwa bari gukora',
      pendingBaptisms: 'Ubaptizimu bushatirwaho',
      lessonsCompleted: 'Ibyigiro byakomezwe',
      baptizedThisMonth: 'Abaptijwe Muri icyi gihe',
      recentActivity: 'Ibikorwa bishya',
      quickActions: 'Ibikorwa vuba',
      registerCandidate: 'Andikisha umwegerwa',
      logLesson: 'Andikisha ibyigiro',
      viewReports: 'Reba amanarabyaha',
      upcomingBaptisms: 'Ubaptizimu bufiteho',
      noUpcomingBaptisms: 'Nta baptizimu ifiteho',
    },
    bibleStudy: {
      title: 'Ibyigiro bya Bibiliya',
      subtitle: 'Reba no gucunga ibyigiro bya Bibiliya',
      lessons: 'Ibyigiro',
      lessonCatalog: 'Urutonde rw ibyigiro',
      logCompletion: 'Andikisha ibyigiro byakomeje',
      logLessonCompletion: 'Andikisha ibyigiro byakomeje',
      lessonTitle: 'Umutwe w\'ibyigiro',
      lessonDescription: 'Ibirebana n\'ibyigiro',
      learningObjectives: 'Intego z\'ibyigiro',
      duration: 'Igihe',
      searchPlaceholder: 'Shakisha ibyigiro...',
      searchLessons: 'Shakisha ibyigiro...',
      viewProgress: 'Reba iterambere',
      noLessonsFound: 'Nta byigiro bibonetse.',
      lessonProgress: 'Iterambere ry\'ibyigiro',
      markComplete: 'Menyesha ko byakomeje',
      completed: 'Byakomeje',
      completedOf: 'byigiro byakomeje',
      inProgress: 'Biri gukorwamo',
      notStarted: 'Biratanzwe',
      scheduleNextLesson: 'Gena ibyigiro ikurikira',
      schedule: 'Gena',
      nextLesson: 'Ibyigiro ikurikira',
      previousLesson: 'Ibyigiro rishize',
      notes: 'Ibisobanuro',
      instructorNotes: 'Ibisobanuro by\'umwigisha',
      understandingLevel: 'Ingano y\'understand',
      candidateProgress: 'Iterambere ry\'umwegerwa',
      overallProgress: 'Iterambere ryo hejuru',
      lessonDetails: 'Ibirebana n\'ibyigiro',
      done: 'Byakozwe',
      progress: 'Iterambere',
      addLesson: 'Ongeraho inyigiro',
      editLesson: 'Hindura inyigiro',
      deleteLesson: 'Siba inyigiro',
      manageCatalog: 'Gucunga urutonde rw\'ibyigiro',
      lessonOrder: 'Imiterere y\'ibyigiro',
      objectives: 'Intego',
      saveLesson: 'Bika inyigiro',
      cancelLesson: 'Hagarika',
      confirmDelete: 'Urashaka gusiba inyigiro?',
      progressPercentage: 'Ingaruka percent',
      lessonCompleted: 'Inyigiro yakomeje',
      assessmentScore: 'Ingano y\' оценка',
      selectCandidate: 'Guhitamo umwegerwa',
      markAsComplete: 'Menyesha ko byakomeje',
    },
    spiritual: {
      title: 'Imimerero',
      spiritualGrowth: 'Imimerero',
      attendance: 'Kugaragira',
      prayerLife: 'Uburyo bwo gusenga',
      testimony: 'Iburiro',
      lifeTransformation: 'Imimerere nshya',
      mentorInteractions: 'Ibikorwa bya mentor',
      characterAssessment: 'Kumenya imimerere',
      character: 'Imimerere',
      spiritualDisciplines: 'Ibikorwa bya mwitterere',
      interviewPreparation: 'I Ready for interview',
      readinessScore: 'Ingano y\'ready',
      readiness: 'Uburyo bwo kw готов',
      candidateReadiness: 'Umwegerwa arakготов',
      worshipAttendance: 'Kugaragira mwigongo',
      prayerMeetingAttendance: 'Kugaragira meeting ya masengesho',
      prayerRequests: 'Ibyifuzo bya masengesho',
      logAttendance: 'Andika Kugaragira',
      logPrayerRequest: 'Andika Ibyifuzo',
      logTestimony: 'Andika Iburiro',
      logDiscipline: 'Andika Ibikorwa',
      attendanceTracking: 'Gukurikirana Kugaragira',
      worshipServices: 'Serivisi z\'Ibik娄',
      prayerMeetings: 'Inama zya Masengesho',
      prayerRequest: 'Ibyifuzo',
      testimonyLogs: 'Iburiro',
      disciplineLogs: 'Ibikorwa bya mwitterere',
      disciplineType: 'Ubwoko bw\'ibikorwa',
      duration: 'Igihe',
      addEntry: 'Ongeraho',
      viewHistory: 'Reba Ibyabaye',
      characterTraits: 'Imimerere',
      honesty: 'Uburenganzira',
      kindness: 'Urununu',
      patience: 'Imimerere',
      humility: 'Kuvuna',
      service: 'Serivisi',
      assessmentNotes: 'Ibisobanuro',
      overallReadiness: 'Ready yose',
      readyForBaptism: 'Arakготов',
      notReady: 'Nta ready',
      inProgress: 'Biri gukorwamo',
    },
    baptism: {
      title: 'Gukurikirana Ubaptizimu',
      scheduleBaptism: 'Gena Ubaptizimu',
      selectDate: 'Gena Itariki',
      selectLocation: 'Gena Ahantu',
      officiatingPastor: 'Umupastori Urenganira',
      candidateList: 'Abagezwa',
      baptismOrder: 'Ibikorwa byo mbere y\'ubaptizimu',
      witness: 'Umuhepi',
      sponsor: 'Umusigi',
      confirmBaptism: 'Emeza Ubaptizimu',
      baptismCertificate: 'Ibyangobwa by\'ubaptizimu',
      generateCertificate: 'Gena Ibyangobwa',
      serviceDetails: 'Ibikorwa bya misengesho',
      location: 'Ahantu',
      date: 'Itariki',
      time: 'Igihe',
      candidatesReady: 'Abagezwa Bare',
      noCandidatesReady: 'Nta mugerweze ufite readiness',
      markBaptized: 'Menyesha ko yabaptijwe',
      baptized: 'Yabaptijwe',
      baptismHistory: 'Amayer y\'ubaptizimu',
      exportRecords: 'Extract amakuru',
      verifyRequirements: 'Genzura Ibisabwa',
      bibleStudyProgress: 'Iterambere ry\'Ibyigiro bya Bibiliya',
      interviewStatus: 'Imiterere y\'Ibizami',
      signCertificate: 'Sinya Impamyabumenyi',
      applySavedSignature: 'Koresha Umukono Wabitswe',
      drawSignature: 'Piha Umukono',
      clearSignature: 'Siba',
      signatureSaved: 'Umukono wakiriwe neza',
      requirementsVerified: 'Ibisabwa byose byagenzuwe',
      requirementsNotMet: 'Ibisabwa ntibyujujwe',
      signaturePlaceholder: 'Sinya hano',
    },
    candidate: {
      registration: 'Andikisha Umwegerwa',
      title: 'Umwegerwa',
      personalInfo: "Amakuru y' Personal",
      fullName: 'Izina ryuzuye',
      dateOfBirth: "Italiki y'amavuko",
      gender: 'Igitsina',
      male: 'Gabo',
      female: 'Gore',
      contactInfo: "Amakuru y'abakoresha",
      email: 'Imeyili',
      phone: 'Nimero ya telephone',
      address: 'Aderesi',
      province: 'Intara',
      district: 'Akarere',
      sector: 'Imirenge',
      referralInfo: "Amakuru y'abitseyeho",
      referralSource: 'Ninde wabitseyeho?',
      churchReferral: 'Inzu yibikopso',
      previousAffiliation: 'Ibigozwe ya mbere',
      previousReligion: 'Idini ryaherukaneyo (niba rifite)',
      churchAssignment: "Inzu y'ibikopso",
      localChurch: "Inzu y'ibikopso",
      selectLocalChurch: "Hitamo inzu y'ibikopso",
      instructor: 'Umwigisha',
      assignedInstructor: 'Umwigisha',
      selectInstructor: 'Hitamo umwigisha',
      baptismInterview: "Inteko y'ubaptizimu",
      scheduleInterview: 'Genzura inteko',
      interviewDate: "Italiki y'inteko",
      interviewer: 'Umukono',
      readinessScore: "Ingano y'ubготов",
      notes: 'Ibisobanuro',
      documents: 'Amadosiye',
      uploadDocuments: 'Bika amadosiye',
      submitRegistration: 'Ohereza andika',
      registrationSuccess: 'Umwegerwa yandikishijwe neza',
      registrationRef: 'Referenasi ya andika',
      churchReferralInfo: 'Inzu yibikopso & Amakuru yabitseyeho',
      additionalNotes: 'Ibisobanuro by附加',
      registered: 'Andikishijwe',
      inProgress: 'Ari gukora',
      ready: 'Arakготов',
      baptized: 'Baptijwe',
      status: 'Status',
      candidateDirectory: 'Abategerwa',
      newCandidate: 'Umwegerwa mushya',
      candidateList: 'Lisiti yabategerwa',
      candidateId: 'ID y umwegerwa',
      progress: 'Ibikorwa',
      lastActivity: 'Ibikorwa biheruka',
      scheduleLesson: 'Gena ibyigiro',
      viewDetails: 'Reba bisobanuro',
      noCandidatesFound: 'Ntaategerwa abonetse',
      candidateDetails: 'Amakuru y umwegerwa',
      editCandidate: 'Hindura umwegerwa',
      deleteCandidate: 'Siba umwegerwa',
      confirmDelete: 'Urashaka gusiba uyu mwegerwa?',
      directory: 'Abategerwa',
      searchPlaceholder: 'Shakisha abategerwa...',
      filterByStatus: 'Filtira status',
      filterByChurch: 'Filtira inzu yibikopso',
      statusRegistered: 'Andikishijwe',
      statusInProgress: 'Ari gukora',
      statusReady: 'Arakготов',
      statusBaptized: 'Baptijwe',
      enterFullName: 'Shyiramo izina ryuzuye',
      enterDistrict: 'Shyiramo akarere',
      enterSector: 'Shyiramo imirenge',
      placeholderEmail: 'imeyili@example.com',
      placeholderPhone: '+250 788 000 000',
      kigali: 'Kigali',
      northernProvince: 'Intara yAmajyaruguru',
      southernProvince: 'Intara yAmajyepfo',
      easternProvince: 'Intara yIburengerazuba',
      westernProvince: 'Intara yIburengerazuba',
      kigaliCentral: 'Inzu yibikopso ya Kigali Central',
      kigaliNorth: 'Inzu yibikopso ya Kigali North',
      kigaliSouth: 'Inzu yibikopso ya Kigali South',
      ruhengeri: 'Inzu yibikopso ya Ruhengeri',
      butare: 'Inzu yibikopso ya Butare',
      registerNewCandidate: 'Andikisha umwegerwa mushya wubaptizimu',
      failedToRegister: 'Byanze kongera ugenze.',
      manageCandidates: 'Gucunga abategerwa niterambere ryabo',
      familyBackground: 'Imiterere y umuryango',
      invitedBy: 'Wabitseyeho',
      registrationDate: 'Italiki yandikisha',
    },
    instructor: {
      directory: 'Abigisha',
      title: 'Abigisha nAbavizeshi',
      subtitle: 'Gucunga abigisha ba Bibiliya nabanzegeraniro',
      qualifications: 'Ubunarizi',
      specialization: 'Ibikorwa bySPEC',
      experience: 'Ub experience',
      experienceYears: 'imyaka',
      assignedCandidates: 'Abategerwa babanzegeraniriwe',
      activeCandidates: 'Abategerwa bari mu by都好',
      lessonsCompleted: 'Ibyigiro byakomezwe',
      avgReadiness: 'Average Readiness',
      baptismsThisYear: 'Abaptijwe muri uyu mwaka',
      assignCandidate: 'Murekegera Umwegerwa',
      selectCandidate: 'Hitamo Umwegerwa',
      selectCandidatePlaceholder: 'Hitamo umwegerwa wo kwegerera',
      assignButton: 'Kwegerera',
      trainingRecords: 'Ubufashizi bwerekanwe',
      addTraining: 'Ongeraho Ubufashizi',
      trainingTitle: 'Ubufashizi bwererekanwe',
      trainingDate: 'Italiki yfashizi',
      trainingProvider: 'Umwanditsi wifashizi',
      noInstructorsFound: 'Nta migisha abonetse',
      viewProfile: 'Reba Profile',
      workloadVisualization: 'Workload Distribution',
      performanceOverview: 'Performance Overview',
    },
    membership: {
      directory: 'Abagize Umuryango',
      subtitle: 'Gucunga abagize umuryango n amakuru yawo',
      addMember: 'Ongeraho Umugize',
      searchPlaceholder: 'Shakisha abagize umuryango...',
      memberDetails: 'Ibikorwa byumugize',
      personalInfo: 'Amakuru yabana',
      contactInfo: 'Amakuru yabana na contact',
      churchInfo: 'Amakuru y inzu yibikopso',
      currentChurch: 'Inzu yibikopso ubu',
      joinDate: 'Italiki yandikishijwe',
      baptismInfo: 'Amakuru yubaptizimu',
      baptismDate: 'Italiki yubaptizimu',
      baptismChurch: 'Inzu yibikopso yabaptijwemo',
      involvement: 'Ibikorwa munsi y inzu yibikopso',
      departments: 'Imishinga',
      roles: 'Imyanya',
      transferRequest: 'Ibisabwa byoherezwa',
      requestTransfer: 'Saba transfer',
      transferDescription: 'Saba transfer y inzu yibikopso yindi.',
      toChurch: 'Inzu yibikopso yo kugerera',
      selectChurch: 'Hitamo inzu yibikopso',
      transferNotes: 'Ibisobanuro',
      transferNotesPlaceholder: 'Impamvu yo gusaba transfer...',
      submitTransfer: 'Tumiza Ubusabe',
      transferHistory: 'Amakuru ytransfer',
      certificates: 'Certificate',
      generateCertificate: 'Gena Certificate',
      active: 'Arakora',
      inactive: 'Ntakora',
      transferred: 'Yahindukiwe',
      noMembersFound: 'Ntabagize umuryango abonetse',
    },
    mfa: {
      setupTitle: 'Gena Two-Factor Authentication',
      setupSubtitle: 'Scan the QR code na authenticator app yawe',
      scanQRCode: 'Scan QR Code',
      manualEntry: 'Cyangoba ingingo:',
      verificationCode: 'Code y，确认',
      enableButton: 'Enable 2FA',
      disableButton: 'Disable 2FA',
      challengeTitle: 'Two-Factor Authentication',
      challengeSubtitle: 'Injiza code ivuye kuri authenticator app yawe',
      verifyButton: 'Emeza',
      useBackupCode: 'Use backup code instead',
      invalidCode: 'Code ntakurikwijemo. Ongera ugenze.',
      enabled: 'Byak活',
      disabled: 'Byagaze',
      twoFactorAuth: 'Two-Factor Authentication',
      backupCodes: 'Backup Codes',
      backupCodesTitle: 'Backup Codes yawe',
      backupCodesSubtitle: 'Bika aya code munzira ik security. Code yPS yose irashobora gukoreshwa.',
      backupCodesWarning: 'Aya code ashobora gukoreshwa rimwe gusa.',
      downloadCodes: 'Download Codes',
    },
    settings: {
      security: 'Igenamiterwe by安全',
      securitySubtitle: 'Gucunga account yawe安全和认证',
      loginHistory: 'Ibikorwa by，最近���录',
      currentSession: 'Ibihe bishya',
      sessions: 'Active Sessions',
      sessionsDescription: 'Gucunga ibikoresho byangavu.',
      manageSessions: 'Manage Sessions',
      userManagement: 'Gucunga Abagore',
      userManagementSubtitle: 'Gucunga abantu system nimit yam roles',
      addUser: 'Ongeraho Umuntu',
      lastLogin: 'Inyuma Login',
      roleManagement: 'Role Management',
      roleMatrix: 'Role Permission Matrix',
    },
    audit: {
      title: 'Audit Logs',
      subtitle: 'Monitor user activity na resource access',
      userActivity: 'User Activity',
      resourceAccess: 'Resource Access',
      timestamp: 'Igihe',
      ipAddress: 'IP Address',
      noLogsFound: 'Nta audit logs bibonetse',
    },
    reports: {
      title: 'Raporo & Isesengura',
      subtitle: 'Sesengura izamuka ry\'itorero n\'iterambere ry\'abegerwa',
      baptismStats: 'Imibare y\'ubaptizimu',
      candidateProgress: 'Iterambere ry\'umwegerwa',
      demographics: 'Isesengura ry\'abantu',
      churchComparison: 'Igereranya ry\'amatorero',
      growthAnalytics: 'Isesengura ry\'izamuka',
      totalCandidates: 'Abegerwa bose',
      avgCompletion: 'Igereranya ryo kuzuza',
      baptizedTotal: 'Abaptijwe bose',
      customReport: 'Icyubaka raporo yihariye',
      generateReport: 'Kora raporo',
      exportPdf: 'Eksporta nka PDF',
      exportExcel: 'Eksporta nka Excel',
      selectDateRange: 'Hitamo igihe',
      startDate: 'Italiki itangira',
      endDate: 'Italiki isoza',
      applyFilters: 'Shyira mu bikorwa amayunguruzo',
    },
    notifications: {
      title: 'Ibis通知',
      subtitle: 'Gucunga ibis通知 n\'ibyerekana',
      unread: 'bitarasomwa',
      allRead: 'Ibis通知 byose byarasomwe',
      markAsRead: 'Meka nk\'ariko birasomwa',
      markAllAsRead: 'Meka byose nk\'ariko birasomwa',
      noNotifications: 'Nta bis通知 bihari',
      justNow: 'Muri uri',
      minutesAgo: 'min ishize',
      hoursAgo: 'hrs ishize',
      daysAgo: 'iminsi ishize',
      broadcastTitle: 'Iheruka',
      broadcastSubtitle: 'Ohereza ubutumwa ku bice by\'abantu',
      recipients: 'Abagiriwe',
      channels: 'Amashusho',
      subject: 'Ingingo',
      subjectPlaceholder: 'Injiza ingingo y\'ubutumwa',
      message: 'Ubutumwa',
      messagePlaceholder: 'Injiza ubutumwa bwawe aha...',
      showPreview: 'Garagaza ibimenyetso',
      hidePreview: 'Hisha ibimenyetso',
      preview: 'Ibibonere',
      sendBroadcast: 'Ohereza ibyinshi',
      smsWarning: 'Ubutumwa bwa SMS bushobora kwiyongera',
      templateManager: 'Ibishusho by\'ubutumwa',
      templateManagerSubtitle: 'Gucunga ibishusho by\'ubutumwa bikoreshwa',
      newTemplate: 'Ibishushoバイリーン',
      templateName: 'Izina ry\'ibishusho',
      templateNamePlaceholder: 'Injiza izina ry\'ibishusho',
      templateType: 'Ubwoko bw\'ibishusho',
      emailSubject: 'Ingingo ya email',
      emailSubjectPlaceholder: 'Injiza ingingo ya email',
      insertVariable: 'F泓iresha variable',
      messageBody: 'Ubutumwa bufite',
      messageBodyPlaceholder: 'Injiza ubutumwa bufite...',
      characters: 'ibimenyetso',
      searchTemplates: 'Shakisha ibishusho...',
      noTemplates: 'Nta bishusho bihari',
      editTemplate: 'Hindura ibishusho',
      createTemplate: 'Kora ibishusho',
      messageHistory: 'Ibyo washiranye',
      messageHistorySubtitle: 'Rebuka ubutumwa bwatumje n\'ibimenyetso by\'kugeza',
      searchMessages: 'Shakisha ubutumwa...',
      noMessagesFound: 'Nta butumwa bwabonetse',
      messageDetails: 'Ibisohoka by\'ubutumwa',
      sentBy: 'Watumje',
      totalRecipients: 'Abagiriwe bose',
      readCount: 'Barazamye',
      readRate: 'Rate y\'kuzamura',
      statusSent: 'Butumwe',
      statusDelivered: 'Bugejewe',
      statusFailed: 'Byanze',
      resend: 'Ongera woherereza',
      updated: 'Byakunzwe',
    },
    common: {
      save: 'Bika',
      cancel: 'Hagarika',
      delete: 'Siba',
      edit: 'Hindura',
      view: 'Reba',
      search: 'Shakisha',
      filter: 'Filtira',
      export: 'Eksporta',
      loading: 'Gut loading...',
      error: 'Ikosa',
      success: 'Byakunze',
      warning: 'Iburenganzira',
      info: 'Amakuru',
      confirm: 'Emeza',
      yes: 'Yego',
      no: 'Oya',
      submit: 'Ohereza',
      next: 'Ikiringiro',
      previous: 'Inyuma',
      close: 'Funga',
      back: 'Subira',
      date: 'Italiki',
      status: 'Status',
      actions: 'Ibikorwa',
      name: 'Izina',
      description: 'Ibirebana',
      type: 'Ubwoko',
      required: 'Iyoroshye',
      optional: 'Biriho',
      all: 'Byose',
      none: 'Nta',
      select: 'Hitamo',
      selectOption: 'Hitamo option',
      noData: 'Nta makuru',
      done: 'Byakozwe',
      inProgress: 'Biri gukorwamo',
      schedule: 'Gena',
      print: 'Gena',
      send: 'Ohereza',
    },
    validation: {
      required: 'Oyu muriro urakenewe',
      invalidEmail: 'Shyiramo imeyili nyakuri',
      invalidPhone: 'Shyiramo telephone nyakuri',
      passwordTooShort: 'Ijambobanga rikeneweho nibura inyuguti 8',
      passwordMismatch: 'Ijambobanga ridahuje',
      invalidDate: 'Shyiramo italiki nyakuri',
    },
    passwordStrength: {
      veryWeak: 'Ibibabaje cyane',
      weak: 'Ibibabaje',
      fair: 'Bimeze neza',
      strong: 'Byuzuye',
      veryStrong: 'Byuzuye cyane',
    },
    language: {
      selectLanguage: 'Hitamo ururimi',
      english: 'English',
      kinyarwanda: 'Kinyarwanda',
    },
    footer: {
      rights: 'Amakuru yose aratowe.',
      version: 'Verisiyo',
    },
  },
};

export type TranslationKeys = TranslationStructure;