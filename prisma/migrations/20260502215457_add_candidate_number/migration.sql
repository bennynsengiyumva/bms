/*
  Warnings:

  - Added the required column `candidateNumber` to the `Candidate` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Candidate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "candidateNumber" TEXT NOT NULL,
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
INSERT INTO "new_Candidate" ("addressDistrict", "addressProvince", "addressSector", "dateOfBirth", "gender", "id", "instructorId", "previousReligion", "referralSource", "registrationDate", "status", "userId") SELECT "addressDistrict", "addressProvince", "addressSector", "dateOfBirth", "gender", "id", "instructorId", "previousReligion", "referralSource", "registrationDate", "status", "userId" FROM "Candidate";
DROP TABLE "Candidate";
ALTER TABLE "new_Candidate" RENAME TO "Candidate";
CREATE UNIQUE INDEX "Candidate_candidateNumber_key" ON "Candidate"("candidateNumber");
CREATE UNIQUE INDEX "Candidate_userId_key" ON "Candidate"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
