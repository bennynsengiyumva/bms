import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function clearExistingData() {
  // Clear in correct order to avoid foreign key constraints
  // Use try-catch since tables may not exist yet
  const tables = [
    'auditLog', 'notification', 'communicationLog', 'documentAccessLog',
    'document', 'certificateTemplateLog', 'certificateTemplate',
    'spiritualGrowthLog', 'baptismInterview', 'candidateLesson',
    'baptismRecord', 'baptismEvent', 'membershipTransfer', 'member',
    'candidate', 'instructorProfile', 'instructorTraining',
    'coordinationMeeting', 'announcement', 'user', 'localChurch',
    'district', 'field', 'union'
  ];
  
  for (const table of tables) {
    try {
      await (prisma as any)[table].deleteMany();
    } catch (e: any) {
      // Ignore errors if table doesn't exist
      if (!e.code?.startsWith('P2021')) {
        console.log(`Warning: Could not clear ${table}: ${e.message}`);
      }
    }
  }
}

async function main() {
  console.log('Seeding database...');

  // Clear existing data first
  await clearExistingData();

  // 1. Create Union (upsert by name)
  const union = await prisma.union.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Rwanda Union Mission',
      location: 'Kigali, Rwanda',
    },
  });
  console.log('Created Union:', union.name);

  // 2. Create Fields
  const field1 = await prisma.field.upsert({
    where: { id: '00000000-0000-0000-0000-000000000011' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000011',
      name: 'Central Rwanda Field',
      unionId: union.id,
      location: 'Kigali',
    },
  });
  const field2 = await prisma.field.upsert({
    where: { id: '00000000-0000-0000-0000-000000000012' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000012',
      name: 'Northern Rwanda Field',
      unionId: union.id,
      location: 'Musanze',
    },
  });
  console.log('Created Fields:', field1.name, field2.name);

  // 3. Create Districts
  const district1 = await prisma.district.upsert({
    where: { id: '00000000-0000-0000-0000-000000000021' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000021',
      name: 'Nyarugenge District',
      fieldId: field1.id,
    },
  });
  const district2 = await prisma.district.upsert({
    where: { id: '00000000-0000-0000-0000-000000000022' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000022',
      name: 'Gasabo District',
      fieldId: field1.id,
    },
  });
  const district3 = await prisma.district.upsert({
    where: { id: '00000000-0000-0000-0000-000000000023' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000023',
      name: 'Musanze District',
      fieldId: field2.id,
    },
  });
  console.log('Created Districts:', district1.name, district2.name, district3.name);

  // 4. Create Local Churches
  const church1 = await prisma.localChurch.upsert({
    where: { id: '00000000-0000-0000-0000-000000000031' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000031',
      name: 'Kigali Central Church',
      districtId: district1.id,
    },
  });
  const church2 = await prisma.localChurch.upsert({
    where: { id: '00000000-0000-0000-0000-000000000032' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000032',
      name: 'Remera Church',
      districtId: district1.id,
    },
  });
  const church3 = await prisma.localChurch.upsert({
    where: { id: '00000000-0000-0000-0000-000000000033' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000033',
      name: 'Musanze Church',
      districtId: district3.id,
    },
  });
  console.log('Created Churches:', church1.name, church2.name, church3.name);

  // 5. Create or update Bible Lessons (upsert by orderIndex)
  const lessons = [
    { title: 'The Word of God', description: 'Understanding the Bible', orderIndex: 1 },
    { title: 'The Godhead', description: 'Understanding Trinity', orderIndex: 2 },
    { title: 'God the Father', description: 'Our Heavenly Father', orderIndex: 3 },
    { title: 'God the Son', description: 'Jesus Christ our Savior', orderIndex: 4 },
    { title: 'God the Holy Spirit', description: 'The Helper', orderIndex: 5 },
    { title: 'Creation', description: 'The Story of Creation', orderIndex: 6 },
    { title: 'The Fall', description: 'Sin and its Consequences', orderIndex: 7 },
    { title: 'Salvation Plan', description: 'God\'s Plan for Salvation', orderIndex: 8 },
  ];

  for (const lesson of lessons) {
    await prisma.bibleLesson.upsert({
      where: { orderIndex: lesson.orderIndex },
      update: {},
      create: lesson,
    });
  }
  console.log('Created', lessons.length, 'Bible Lessons');

  // 6. Create Super Admin (upsert by email)
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@bms.rw' },
    update: {},
    create: {
      email: 'admin@bms.rw',
      passwordHash: hashedPassword,
      fullName: 'System Administrator',
      role: 'union_admin',
      unionId: union.id,
    },
  });
  console.log('Created admin@bms.rw');

  // 7. Create Instructors (2 per different churches)
  const instructor1Password = await bcrypt.hash('instructor123', 10);
  const instructor1 = await prisma.user.upsert({
    where: { email: 'pastor.john@bms.rw' },
    update: {},
    create: {
      email: 'pastor.john@bms.rw',
      passwordHash: instructor1Password,
      fullName: 'Pastor John Kamanzi',
      role: 'instructor',
      phone: '+250788123456',
      churchId: church1.id,
      districtId: district1.id,
      fieldId: field1.id,
      unionId: union.id,
    },
  });

  // Upsert instructor profile
  await prisma.instructorProfile.upsert({
    where: { userId: instructor1.id },
    update: {},
    create: {
      userId: instructor1.id,
      qualifications: 'Bachelor of Theology',
      certifications: 'ADP Certified',
      experienceYears: 5,
      specialization: 'Discipleship',
    },
  });

  const instructor2Password = await bcrypt.hash('instructor123', 10);
  const instructor2 = await prisma.user.upsert({
    where: { email: 'pastor.marie@bms.rw' },
    update: {},
    create: {
      email: 'pastor.marie@bms.rw',
      passwordHash: instructor2Password,
      fullName: 'Pastor Marie Uwimana',
      role: 'instructor',
      phone: '+250788234567',
      churchId: church3.id, // Different church (Musanze)
      districtId: district3.id,
      fieldId: field2.id,
      unionId: union.id,
    },
  });

  await prisma.instructorProfile.upsert({
    where: { userId: instructor2.id },
    update: {},
    create: {
      userId: instructor2.id,
      qualifications: 'Diploma in Theology',
      certifications: 'Lay Pastor Certification',
      experienceYears: 3,
      specialization: 'Youth Ministry',
    },
  });
  console.log('Created 2 Instructors:', instructor1.email, 'and', instructor2.email);

  // 8. Create Pastors for churches
  const pastor1Password = await bcrypt.hash('pastor123', 10);
  await prisma.user.upsert({
    where: { email: 'rev.peter@bms.rw' },
    update: {},
    create: {
      email: 'rev.peter@bms.rw',
      passwordHash: pastor1Password,
      fullName: 'Rev. Peter Habumuremyi',
      role: 'pastor',
      phone: '+250788345678',
      churchId: church1.id,
      districtId: district1.id,
      fieldId: field1.id,
      unionId: union.id,
    },
  });

  const pastor2Password = await bcrypt.hash('pastor123', 10);
  await prisma.user.upsert({
    where: { email: 'rev.agnes@bms.rw' },
    update: {},
    create: {
      email: 'rev.agnes@bms.rw',
      passwordHash: pastor2Password,
      fullName: 'Rev. Agnes Mukamana',
      role: 'pastor',
      phone: '+250788456789',
      churchId: church3.id,
      districtId: district3.id,
      fieldId: field2.id,
      unionId: union.id,
    },
  });
  console.log('Created 2 Pastors');

  // 9. Create District Admin
  const admin1Password = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'district.admin1@bms.rw' },
    update: {},
    create: {
      email: 'district.admin1@bms.rw',
      passwordHash: admin1Password,
      fullName: 'District Admin Nyarugenge',
      role: 'district_admin',
      districtId: district1.id,
      fieldId: field1.id,
      unionId: union.id,
    },
  });
  console.log('Created District Admin');

  // 10. Create Candidates (4 spread across different churches/districts/fields)
  const candidates = [
    {
      email: 'candidate.emmanuel@bms.rw',
      name: 'Emmanuel Nkusi',
      church: church1,
      district: district1,
      field: field1,
      dob: '1995-03-15',
    },
    {
      email: 'candidate.ange@bms.rw',
      name: 'Ange Mukamana',
      church: church2, // Different church in same district
      district: district1,
      field: field1,
      dob: '1998-07-22',
    },
    {
      email: 'candidate.isaac@bms.rw',
      name: 'Isaac Habimana',
      church: church3, // Different district and field
      district: district3,
      field: field2,
      dob: '1990-11-08',
    },
    {
      email: 'candidate.diane@bms.rw',
      name: 'Diane Uwase',
      church: church3, // Same as Isaac but different candidate
      district: district3,
      field: field2,
      dob: '2000-01-30',
    },
  ];

  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i];
    const candidatePassword = await bcrypt.hash('candidate123', 10);
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        email: c.email,
        passwordHash: candidatePassword,
        fullName: c.name,
        role: 'candidate',
        phone: '+25078800000' + i,
        churchId: c.church.id,
        districtId: c.district.id,
        fieldId: c.field.id,
        unionId: union.id,
      },
    });

    const candidateNumber = `CAN-2026-${(i + 1).toString().padStart(4, '0')}`;
    await prisma.candidate.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        candidateNumber,
        dateOfBirth: new Date(c.dob),
        gender: i % 2 === 0 ? 'male' : 'female',
        addressProvince: 'Kigali',
        addressDistrict: c.district.name,
        addressSector: 'Sector ' + (i + 1),
        instructorId: i < 2 ? instructor1.id : instructor2.id,
        status: 'in_progress',
      },
    });
  }
  console.log('Created', candidates.length, 'Candidates across different churches/districts/fields');
  console.log('  - 2 candidates in Central Rwanda Field (church1, church2)');
  console.log('  - 2 candidates in Northern Rwanda Field (church3)');

  // 11. Create some Members
  const memberPassword = await bcrypt.hash('member123', 10);
  await prisma.user.upsert({
    where: { email: 'member1@bms.rw' },
    update: {},
    create: {
      email: 'member1@bms.rw',
      passwordHash: memberPassword,
      fullName: 'First Member',
      role: 'member',
      churchId: church1.id,
      districtId: district1.id,
      fieldId: field1.id,
      unionId: union.id,
    },
  });
  console.log('Created sample Member');

  console.log('\n=== Seed Summary ===');
  console.log('Union: 1 (Rwanda Union Mission)');
  console.log('Fields: 2 (Central Rwanda, Northern Rwanda)');
  console.log('Districts: 3 (Nyarugenge, Gasabo, Musanze)');
  console.log('Churches: 3 (Kigali Central, Remera, Musanze)');
  console.log('Instructors: 2 (one per field for testing scoping)');
  console.log('Pastors: 2');
  console.log('Candidates: 4 (2 in Central Field, 2 in Northern Field)');
  console.log('\nLogin credentials:');
  console.log('  Admin: admin@bms.rw / admin123');
  console.log('  Instructor: pastor.john@bms.rw / instructor123 (Central Field - church1)');
  console.log('  Instructor: pastor.marie@bms.rw / instructor123 (Northern Field - church3)');
  console.log('  Candidate: candidate.emmanuel@bms.rw / candidate123 (church1)');
  console.log('  Candidate: candidate.isaac@bms.rw / candidate123 (church3 - different field)');
  console.log('===================');
  console.log('\nSeeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });