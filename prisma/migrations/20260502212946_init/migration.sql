-- CreateTable
CREATE TABLE "Union" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Field" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "unionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Field_unionId_fkey" FOREIGN KEY ("unionId") REFERENCES "Union" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "District" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fieldId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "District_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LocalChurch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "districtId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LocalChurch_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL,
    "unionId" TEXT,
    "fieldId" TEXT,
    "districtId" TEXT,
    "churchId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "lastLogin" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_unionId_fkey" FOREIGN KEY ("unionId") REFERENCES "Union" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "LocalChurch" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "dateOfBirth" DATETIME,
    "gender" TEXT,
    "addressProvince" TEXT,
    "addressDistrict" TEXT,
    "addressSector" TEXT,
    "referralSource" TEXT,
    "previousReligion" TEXT,
    "instructorId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'registered',
    "registrationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Candidate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Candidate_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BibleLesson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "learningObjectives" TEXT
);

-- CreateTable
CREATE TABLE "CandidateLesson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "candidateId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "completionDate" DATETIME,
    "understandingScore" INTEGER,
    "instructorNotes" TEXT,
    "nextLessonDate" DATETIME,
    CONSTRAINT "CandidateLesson_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CandidateLesson_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "BibleLesson" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SpiritualGrowthLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "candidateId" TEXT NOT NULL,
    "logType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "loggedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SpiritualGrowthLog_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BaptismInterview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "candidateId" TEXT NOT NULL,
    "interviewerId" TEXT NOT NULL,
    "interviewDate" DATETIME,
    "readinessScore" INTEGER,
    "feedback" TEXT,
    "isReady" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BaptismInterview_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BaptismInterview_interviewerId_fkey" FOREIGN KEY ("interviewerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BaptismEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "churchId" TEXT NOT NULL,
    "eventDate" DATETIME NOT NULL,
    "location" TEXT,
    "officiatingPastorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BaptismEvent_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "LocalChurch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BaptismEvent_officiatingPastorId_fkey" FOREIGN KEY ("officiatingPastorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BaptismRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "witnessName" TEXT,
    "sponsorName" TEXT,
    "certificateNumber" TEXT,
    "recordedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BaptismRecord_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "BaptismEvent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BaptismRecord_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "baptismRecordId" TEXT,
    "currentChurchId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "joinDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Member_baptismRecordId_fkey" FOREIGN KEY ("baptismRecordId") REFERENCES "BaptismRecord" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Member_currentChurchId_fkey" FOREIGN KEY ("currentChurchId") REFERENCES "LocalChurch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MembershipTransfer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "fromChurchId" TEXT NOT NULL,
    "toChurchId" TEXT NOT NULL,
    "requestDate" DATETIME NOT NULL,
    "approvalDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    CONSTRAINT "MembershipTransfer_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MembershipTransfer_fromChurchId_fkey" FOREIGN KEY ("fromChurchId") REFERENCES "LocalChurch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MembershipTransfer_toChurchId_fkey" FOREIGN KEY ("toChurchId") REFERENCES "LocalChurch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_userId_key" ON "Candidate"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BibleLesson_orderIndex_key" ON "BibleLesson"("orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateLesson_candidateId_lessonId_key" ON "CandidateLesson"("candidateId", "lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "BaptismRecord_candidateId_key" ON "BaptismRecord"("candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "BaptismRecord_certificateNumber_key" ON "BaptismRecord"("certificateNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Member_userId_key" ON "Member"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_baptismRecordId_key" ON "Member"("baptismRecordId");
