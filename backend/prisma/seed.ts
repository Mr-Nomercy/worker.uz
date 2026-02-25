import { PrismaClient, UserRole, Gender, JobStatus, ApplicationStatus, InterviewType, InterviewStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  await prisma.interview.deleteMany();
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.company.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();
  await prisma.aIConfig.deleteMany();

  console.log('🧹 Cleaned existing data');

  // Create AI Config (singleton)
  await prisma.aIConfig.create({
    data: {
      id: 'default',
      matchSensitivity: 75,
      minMatchScore: 60,
      maxCandidatesPerJob: 50,
      automatedVerification: true,
      modelVersion: 'v2.4.1',
    },
  });
  console.log('✅ AI Config created');

  // ==================== CANDIDATES ====================
  const passwordHash = await bcrypt.hash('password123', 12);

  const candidate1 = await prisma.user.create({
    data: {
      email: 'aziz.karimov@example.com',
      passwordHash,
      role: UserRole.CANDIDATE,
      pinfl: '12345678901234',
      passportSeries: 'AA1234567',
      isVerified: true,
      profile: {
        create: {
          fullName: 'Aziz Karimov',
          birthDate: new Date('1997-06-15'),
          gender: Gender.MALE,
          address: 'Tashkent, Uzbekistan',
          educationHistory: [
            {
              institution: 'Tashkent University of Information Technologies',
              degree: 'Bachelor of Computer Science',
              field: 'Computer Science',
              year: 2019,
              verified: true,
            },
          ],
          workHistory: [
            {
              company: 'Uzbektelecom JSC',
              position: 'Senior Software Developer',
              startDate: '2021-06',
              endDate: null,
              verified: true,
            },
            {
              company: 'Ministry of Digital Technologies',
              position: 'Junior Developer',
              startDate: '2019-06',
              endDate: '2021-05',
              verified: true,
            },
          ],
          phoneNumber: '+998 90 987-65-43',
          softSkills: ['Team Leadership', 'Problem Solving', 'Communication'],
          portfolioLinks: [
            { label: 'GitHub', url: 'github.com/azizkarimov' },
            { label: 'LinkedIn', url: 'linkedin.com/in/azizkarimov' },
          ],
        },
      },
    },
    include: { profile: true },
  });

  const candidate2 = await prisma.user.create({
    data: {
      email: 'sardor.davlatov@example.com',
      passwordHash,
      role: UserRole.CANDIDATE,
      pinfl: '23456789012345',
      passportSeries: 'AB2345678',
      isVerified: true,
      profile: {
        create: {
          fullName: 'Sardor Davlatov',
          birthDate: new Date('1996-03-22'),
          gender: Gender.MALE,
          address: 'Tashkent, Uzbekistan',
          educationHistory: [
            {
              institution: 'Tashkent State Technical University',
              degree: 'Bachelor of Software Engineering',
              field: 'Software Engineering',
              year: 2018,
              verified: true,
            },
          ],
          workHistory: [
            {
              company: 'Ucell JSC',
              position: 'Backend Developer',
              startDate: '2020-01',
              endDate: null,
              verified: true,
            },
            {
              company: 'Spark JSC',
              position: 'Junior Developer',
              startDate: '2018-06',
              endDate: '2019-12',
              verified: true,
            },
          ],
          phoneNumber: '+998 90 876-54-32',
          softSkills: ['Python', 'Django', 'PostgreSQL'],
          portfolioLinks: [],
        },
      },
    },
    include: { profile: true },
  });

  const candidate3 = await prisma.user.create({
    data: {
      email: 'nodir.rakhimov@example.com',
      passwordHash,
      role: UserRole.CANDIDATE,
      pinfl: '34567890123456',
      passportSeries: 'AC3456789',
      isVerified: true,
      profile: {
        create: {
          fullName: 'Nodir Rakhimov',
          birthDate: new Date('1998-09-10'),
          gender: Gender.MALE,
          address: 'Samarkand, Uzbekistan',
          educationHistory: [
            {
              institution: 'Samarkand State University',
              degree: 'Bachelor of Computer Engineering',
              field: 'Computer Engineering',
              year: 2020,
              verified: true,
            },
          ],
          workHistory: [
            {
              company: 'Uztelecom JSC',
              position: 'DevOps Engineer',
              startDate: '2021-03',
              endDate: null,
              verified: true,
            },
            {
              company: 'Samarkand Digital Hub',
              position: 'System Administrator',
              startDate: '2019-06',
              endDate: '2021-02',
              verified: true,
            },
          ],
          phoneNumber: '+998 90 765-43-21',
          softSkills: ['Kubernetes', 'Docker', 'AWS'],
          portfolioLinks: [],
        },
      },
    },
    include: { profile: true },
  });

  console.log('✅ Created 3 candidate users');

  // ==================== EMPLOYERS ====================
  const employer1 = await prisma.user.create({
    data: {
      email: 'hr@techcorp.uz',
      passwordHash,
      role: UserRole.EMPLOYER,
      pinfl: '45678901234567',
      passportSeries: 'AD4567890',
      isVerified: true,
      company: {
        create: {
          name: 'TechCorp Uzbekistan',
          taxId: 'IRN-123456789',
          address: 'Amir Temur Avenue, Tashkent',
          industry: 'IT & Software Development',
          website: 'https://techcorp.uz',
          description: 'TechCorp Uzbekistan is a leading IT company specializing in software development, cloud solutions, and digital transformation services.',
          isVerified: true,
          verifiedAt: new Date(),
        },
      },
    },
    include: { company: true },
  });

  const employer2 = await prisma.user.create({
    data: {
      email: 'hr@payme.uz',
      passwordHash,
      role: UserRole.EMPLOYER,
      pinfl: '56789012345678',
      passportSeries: 'AE5678901',
      isVerified: true,
      company: {
        create: {
          name: 'Payme Solutions',
          taxId: 'IRN-987654321',
          address: 'Metro Avenue, Tashkent',
          industry: 'FinTech',
          website: 'https://payme.uz',
          description: 'Leading payment solutions provider in Uzbekistan.',
          isVerified: true,
          verifiedAt: new Date(),
        },
      },
    },
    include: { company: true },
  });

  const employer3 = await prisma.user.create({
    data: {
      email: 'hr@beeline.uz',
      passwordHash,
      role: UserRole.EMPLOYER,
      pinfl: '67890123456789',
      passportSeries: 'AF6789012',
      isVerified: true,
      company: {
        create: {
          name: 'Beeline Uzbekistan',
          taxId: 'IRN-111222333',
          address: 'Bodomzor Avenue, Tashkent',
          industry: 'Telecommunications',
          website: 'https://beeline.uz',
          description: 'Leading telecommunications company.',
          isVerified: true,
          verifiedAt: new Date(),
        },
      },
    },
    include: { company: true },
  });

  console.log('✅ Created 3 employer users');

  // ==================== ADMIN ====================
  await prisma.user.create({
    data: {
      email: 'admin@worker.uz',
      passwordHash,
      role: UserRole.ADMIN,
      pinfl: '00000000000000',
      passportSeries: 'ADMIN001',
      isVerified: true,
      profile: {
        create: {
          fullName: 'System Administrator',
          birthDate: new Date('1980-01-01'),
          gender: Gender.MALE,
          address: 'Tashkent',
          educationHistory: [],
          workHistory: [],
        },
      },
    },
  });

  console.log('✅ Created admin user');

  // ==================== JOBS ====================
  const job1 = await prisma.job.create({
    data: {
      companyId: employer1.company!.id,
      title: 'Full Stack Developer',
      description: 'We are looking for an experienced Full Stack Developer to join our team.',
      requirements: ['3+ years experience', 'React', 'Node.js', 'TypeScript'],
      salaryMin: 5000000,
      salaryMax: 8000000,
      location: 'Tashkent',
      status: JobStatus.OPEN,
    },
  });

  const job2 = await prisma.job.create({
    data: {
      companyId: employer2.company!.id,
      title: 'Senior Backend Engineer',
      description: 'Join our backend team to build scalable payment solutions.',
      requirements: ['4+ years experience', 'Python', 'PostgreSQL', 'AWS'],
      salaryMin: 6000000,
      salaryMax: 10000000,
      location: 'Tashkent',
      status: JobStatus.OPEN,
    },
  });

  const job3 = await prisma.job.create({
    data: {
      companyId: employer3.company!.id,
      title: 'DevOps Engineer',
      description: 'Help us build and maintain our cloud infrastructure.',
      requirements: ['3+ years experience', 'Kubernetes', 'Docker', 'CI/CD'],
      salaryMin: 5500000,
      salaryMax: 9000000,
      location: 'Tashkent',
      status: JobStatus.OPEN,
    },
  });

  const job4 = await prisma.job.create({
    data: {
      companyId: employer1.company!.id,
      title: 'UI/UX Designer',
      description: 'Design beautiful and intuitive user interfaces.',
      requirements: ['2+ years experience', 'Figma', 'UI Design'],
      salaryMin: 4000000,
      salaryMax: 7000000,
      location: 'Tashkent',
      status: JobStatus.OPEN,
    },
  });

  console.log('✅ Created 4 jobs');

  // ==================== APPLICATIONS ====================
  await prisma.application.create({
    data: {
      jobId: job1.id,
      candidateId: candidate1.id,
      status: ApplicationStatus.INTERVIEW,
      matchScore: 98,
      coverLetter: 'I am very interested in this position...',
    },
  });

  await prisma.application.create({
    data: {
      jobId: job2.id,
      candidateId: candidate1.id,
      status: ApplicationStatus.PENDING,
      matchScore: 94,
    },
  });

  await prisma.application.create({
    data: {
      jobId: job3.id,
      candidateId: candidate1.id,
      status: ApplicationStatus.REJECTED,
      matchScore: 89,
    },
  });

  await prisma.application.create({
    data: {
      jobId: job2.id,
      candidateId: candidate2.id,
      status: ApplicationStatus.INTERVIEW,
      matchScore: 92,
    },
  });

  await prisma.application.create({
    data: {
      jobId: job3.id,
      candidateId: candidate3.id,
      status: ApplicationStatus.REVIEWING,
      matchScore: 87,
    },
  });

  console.log('✅ Created 5 applications');

  // ==================== INTERVIEWS ====================
  await prisma.interview.create({
    data: {
      applicationId: (await prisma.application.findFirst({ where: { jobId: job1.id } }))!.id,
      candidateId: candidate1.id,
      scheduledAt: new Date('2024-01-25T10:00:00'),
      duration: 60,
      type: InterviewType.VIDEO,
      status: InterviewStatus.SCHEDULED,
      meetingLink: 'https://meet.techcorp.uz/interview-1',
    },
  });

  await prisma.interview.create({
    data: {
      applicationId: (await prisma.application.findFirst({ where: { jobId: job2.id, candidateId: candidate2.id } }))!.id,
      candidateId: candidate2.id,
      scheduledAt: new Date('2024-01-26T14:00:00'),
      duration: 45,
      type: InterviewType.VIDEO,
      status: InterviewStatus.SCHEDULED,
      meetingLink: 'https://meet.payme.uz/interview-2',
    },
  });

  await prisma.interview.create({
    data: {
      applicationId: (await prisma.application.findFirst({ where: { jobId: job3.id, candidateId: candidate3.id } }))!.id,
      candidateId: candidate3.id,
      scheduledAt: new Date('2024-01-24T11:00:00'),
      duration: 30,
      type: InterviewType.PHONE,
      status: InterviewStatus.COMPLETED,
      notes: 'Good communication skills, technical knowledge needs improvement.',
    },
  });

  console.log('✅ Created 3 interviews');

  // ==================== AUDIT LOGS ====================
  await prisma.auditLog.createMany({
    data: [
      {
        action: 'LOGIN',
        entityType: 'USER',
        entityId: candidate1.id,
        userId: candidate1.id,
        details: { method: 'OneID', success: true },
        ipAddress: '192.168.1.101',
      },
      {
        action: 'CREATE_APPLICATION',
        entityType: 'APPLICATION',
        entityId: job1.id,
        userId: candidate1.id,
        details: { jobTitle: job1.title },
        ipAddress: '192.168.1.102',
      },
      {
        action: 'VERIFY_COMPANY',
        entityType: 'COMPANY',
        entityId: employer1.company!.id,
        userId: (await prisma.user.findFirst({ where: { role: UserRole.ADMIN } }))!.id,
        details: { companyName: 'TechCorp Uzbekistan' },
      },
      {
        action: 'POST_JOB',
        entityType: 'JOB',
        entityId: job1.id,
        userId: employer1.id,
        details: { title: job1.title },
        ipAddress: '192.168.1.201',
      },
    ],
  });

  console.log('✅ Created audit logs');

  // ==================== NOTIFICATIONS ====================
  await prisma.notification.createMany({
    data: [
      {
        userId: candidate1.id,
        title: 'Interview Scheduled',
        message: 'Your interview for Full Stack Developer has been scheduled for Jan 25, 2024',
        type: 'info',
      },
      {
        userId: candidate1.id,
        title: 'Application Update',
        message: 'Your application for Senior Backend Engineer is being reviewed',
        type: 'success',
      },
      {
        userId: employer1.id,
        title: 'New Application',
        message: 'You have received a new application for Full Stack Developer',
        type: 'info',
      },
    ],
  });

  console.log('✅ Created notifications');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📋 Login credentials:');
  console.log('   Candidate: aziz.karimov@example.com / password123');
  console.log('   Employer:  hr@techcorp.uz / password123');
  console.log('   Admin:     admin@worker.uz / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
