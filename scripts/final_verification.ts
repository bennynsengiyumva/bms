import prisma from '../src/api/models/prisma';
import * as candidateService from '../src/api/services/candidate.service';
import { BaptismService } from '../src/api/services/baptism.service';
import { MemberService } from '../src/api/services/member.service';
import { LessonService } from '../src/api/services/lesson.service';
import { SpiritualService } from '../src/api/services/spiritual.service';
import { ScopeService } from '../src/api/services/scope.service';

const baptismService = new BaptismService();
const memberService = new MemberService();
const lessonService = new LessonService();
const spiritualService = new SpiritualService();
const scopeService = new ScopeService();

async function runVerification() {
  console.log('==================================================');
  console.log('BMS FINAL E2E VERIFICATION SUITE');
  console.log('==================================================\n');

  const results = {
    journey: [] as { step: string; status: 'PASS' | 'FAIL'; message?: string }[],
    scoping: [] as { check: string; status: 'PASS' | 'FAIL'; message?: string }[],
    audit: [] as { action: string; status: 'PASS' | 'FAIL' }[],
  };

  try {
    // 1. SETUP: Find a church and some roles
    const church1 = await prisma.localChurch.findFirst({
        where: { name: 'Kigali Central Church' },
        include: { district: { include: { field: true } } }
    });
    const church2 = await prisma.localChurch.findFirst({
        where: { name: 'Musanze Church' }
    });
    const instructor = await prisma.user.findFirst({ where: { email: 'pastor.john@bms.rw' } });
    const pastor = await prisma.user.findFirst({ where: { email: 'rev.peter@bms.rw' } });
    const districtAdmin = await prisma.user.findFirst({ where: { role: 'district_admin' } });

    if (!church1 || !church2 || !instructor || !pastor || !districtAdmin) {
        throw new Error('Required seed data missing. Please run seed script first.');
    }

    console.log('--- PHASE 1: CANDIDATE JOURNEY ---');

    // Step 1.1: Registration
    const candidateEmail = `test.candidate.${Date.now()}@example.com`;
    let candidate;
    try {
        candidate = await candidateService.registerCandidate({
            email: candidateEmail,
            password: 'Password123!',
            fullName: 'Test Journey Candidate',
            phone: '0780000000',
            churchId: church1.id,
            gender: 'male',
            dateOfBirth: '1990-01-01'
        }, { executorId: instructor.id, ipAddress: '127.0.0.1' });
        results.journey.push({ step: 'Self-Registration', status: 'PASS' });
    } catch (e: any) {
        results.journey.push({ step: 'Self-Registration', status: 'FAIL', message: e.message });
        throw e;
    }

    // Step 1.2: Instructor Assignment
    try {
        await candidateService.assignInstructor(candidate.id, instructor.id, { executorId: instructor.id });
        const updated = await candidateService.getCandidateById(candidate.id);
        if (updated?.status === 'in_progress') {
            results.journey.push({ step: 'Instructor Assignment', status: 'PASS' });
        } else {
            throw new Error(`Expected status in_progress, got ${updated?.status}`);
        }
    } catch (e: any) {
        results.journey.push({ step: 'Instructor Assignment', status: 'FAIL', message: e.message });
    }

    // Step 1.3: Lesson Completion
    try {
        const lessons = await lessonService.getAllLessons();
        for (const lesson of lessons) {
            await lessonService.logLessonCompletion({
                candidateId: candidate.id,
                lessonId: lesson.id,
                completionDate: new Date(),
                understandingScore: 5
            }, { executorId: instructor.id });
        }
        const progress = await lessonService.getCandidateProgress(candidate.id);
        if (progress.progressPercentage === 100) {
            results.journey.push({ step: '100% Lesson Completion', status: 'PASS' });
        } else {
            throw new Error(`Expected 100% progress, got ${progress.progressPercentage}%`);
        }
    } catch (e: any) {
        results.journey.push({ step: '100% Lesson Completion', status: 'FAIL', message: e.message });
    }

    // Step 1.4: Spiritual Readiness
    try {
        const interview = await spiritualService.scheduleInterview({
            candidateId: candidate.id,
            interviewerId: pastor.id,
            interviewDate: new Date()
        }, { executorId: pastor.id });

        await spiritualService.recordInterviewResult(interview.id, {
            readinessScore: 5,
            feedback: 'Very ready',
            isReady: true
        }, { executorId: pastor.id });

        const updated = await candidateService.getCandidateById(candidate.id);
        if (updated?.status === 'ready') {
            results.journey.push({ step: 'Spiritual Readiness Interview', status: 'PASS' });
        } else {
            throw new Error(`Expected status ready, got ${updated?.status}`);
        }
    } catch (e: any) {
        results.journey.push({ step: 'Spiritual Readiness Interview', status: 'FAIL', message: e.message });
    }

    // Step 1.5: Baptism & Membership
    try {
        const event = await baptismService.createEvent({
            churchId: church1.id,
            eventDate: new Date(),
            officiatingPastorId: pastor.id
        }, { executorId: pastor.id });

        await baptismService.recordBaptism({
            eventId: event.id,
            candidateId: candidate.id,
            certificateNumber: `CERT-${Date.now()}`
        }, { executorId: pastor.id });

        const updated = await candidateService.getCandidateById(candidate.id);
        const member = await prisma.member.findUnique({ where: { userId: candidate.userId } });

        if (updated?.status === 'baptized' && member) {
            results.journey.push({ step: 'Baptism & Membership Transition', status: 'PASS' });
        } else {
            throw new Error('Status not updated to baptized or Member record missing');
        }

        // Digital Signature
        await baptismService.signRecord(updated!.baptismRecord!.id, pastor.id, { executorId: pastor.id });
        const signedRecord = await baptismService.getRecordById(updated!.baptismRecord!.id);
        if (signedRecord?.signedAt) {
             results.journey.push({ step: 'Pastor Digital Signature', status: 'PASS' });
        } else {
             throw new Error('Record not signed');
        }

    } catch (e: any) {
        results.journey.push({ step: 'Baptism & Membership Transition', status: 'FAIL', message: e.message });
    }

    console.log('\n--- PHASE 2: HIERARCHICAL SCOPING ---');

    // Check 2.1: Church Admin Scope
    try {
        // instructor is in church1
        const inScope = await scopeService.checkScope(instructor.id, 'Candidate', candidate.id);
        if (inScope) {
            results.scoping.push({ check: 'Instructor access in-church candidate', status: 'PASS' });
        } else {
            throw new Error('Access denied incorrectly');
        }

        // Try access candidate in church2 (if we had one)
        // Let's find one from seed
        const otherCandidate = await prisma.candidate.findFirst({
            where: { user: { churchId: church2.id } }
        });
        if (otherCandidate) {
            const outScope = await scopeService.checkScope(instructor.id, 'Candidate', otherCandidate.id);
            if (!outScope) {
                results.scoping.push({ check: 'Instructor access out-of-church candidate', status: 'PASS' });
            } else {
                throw new Error('Access granted incorrectly to out-of-church resource');
            }
        }
    } catch (e: any) {
        results.scoping.push({ check: 'Church Scoping Enforcement', status: 'FAIL', message: e.message });
    }

    // Check 2.2: District Admin Scope
    try {
        const inScope = await scopeService.checkScope(districtAdmin.id, 'Candidate', candidate.id);
        if (inScope) {
             results.scoping.push({ check: 'District Admin access in-district candidate', status: 'PASS' });
        } else {
             throw new Error('Access denied incorrectly to in-district resource');
        }
    } catch (e: any) {
         results.scoping.push({ check: 'District Scoping Enforcement', status: 'FAIL', message: e.message });
    }

    console.log('\n--- PHASE 3: AUDIT LOG CONSISTENCY ---');
    const actionsToCheck = ['REGISTER_CANDIDATE', 'LOG_LESSON_COMPLETION', 'SIGN_BAPTISM_RECORD'];
    for (const action of actionsToCheck) {
        const log = await prisma.auditLog.findFirst({ where: { action } });
        results.audit.push({ action, status: log ? 'PASS' : 'FAIL' });
    }

    // FINAL REPORT
    console.log('\n==================================================');
    console.log('VERIFICATION REPORT');
    console.log('==================================================');

    console.log('\n[Candidate Journey]');
    results.journey.forEach(r => console.log(`${r.status === 'PASS' ? '✅' : '❌'} ${r.step} ${r.message ? '(' + r.message + ')' : ''}`));

    console.log('\n[Scoping Enforcement]');
    results.scoping.forEach(r => console.log(`${r.status === 'PASS' ? '✅' : '❌'} ${r.check} ${r.message ? '(' + r.message + ')' : ''}`));

    console.log('\n[Audit Logs]');
    results.audit.forEach(r => console.log(`${r.status === 'PASS' ? '✅' : '❌'} ${r.action}`));

    console.log('\n==================================================');
    const allPassed = [...results.journey, ...results.scoping, ...results.audit].every(r => r.status === 'PASS');
    console.log(`FINAL RESULT: ${allPassed ? 'SUCCESS' : 'FAILURE'}`);
    console.log('==================================================');

    if (!allPassed) process.exit(1);

  } catch (error) {
    console.error('\nVerification failed with fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runVerification();
