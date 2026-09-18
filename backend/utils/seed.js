const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Department = require('../models/Department');
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Notice = require('../models/Notice');
const Event = require('../models/Event');
const Timetable = require('../models/Timetable');
const Notification = require('../models/Notification');
const Material = require('../models/Material');

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_campus_db';
    await mongoose.connect(mongoUri);
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Department.deleteMany();
    await Course.deleteMany();
    await Subject.deleteMany();
    await Student.deleteMany();
    await Faculty.deleteMany();
    await Attendance.deleteMany();
    await Assignment.deleteMany();
    await Submission.deleteMany();
    await Notice.deleteMany();
    await Event.deleteMany();
    await Timetable.deleteMany();
    await Notification.deleteMany();
    await Material.deleteMany();
    console.log('🧹 Purged existing collections.');

    // 1. Create Core Users
    console.log('👤 Creating Users...');
    const adminUser = await User.create({
      name: 'Campus Provost & Admin',
      email: 'admin@campus.edu',
      password: 'Admin@123',
      role: 'admin',
      phone: '+1 (555) 019-9001',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    });

    const facultyUser1 = await User.create({
      name: 'Dr. Elena Vance',
      email: 'elena.vance@campus.edu',
      password: 'Faculty@123',
      role: 'faculty',
      phone: '+1 (555) 019-9002',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    });

    const facultyUser2 = await User.create({
      name: 'Prof. Marcus Thorne',
      email: 'marcus.thorne@campus.edu',
      password: 'Faculty@123',
      role: 'faculty',
      phone: '+1 (555) 019-9003',
      profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    });

    const studentUser1 = await User.create({
      name: 'Aarav Sharma',
      email: 'aarav.sharma@campus.edu',
      password: 'Student@123',
      role: 'student',
      phone: '+1 (555) 019-9004',
      profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    });

    const studentUser2 = await User.create({
      name: 'Maya Patel',
      email: 'maya.patel@campus.edu',
      password: 'Student@123',
      role: 'student',
      phone: '+1 (555) 019-9005',
      profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    });

    const studentUser3 = await User.create({
      name: 'Liam O Connor',
      email: 'liam.oconnor@campus.edu',
      password: 'Student@123',
      role: 'student',
      phone: '+1 (555) 019-9006',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    });

    // 2. Create Departments
    console.log('🏛️ Creating Departments...');
    const deptCS = await Department.create({
      name: 'Computer Science & Engineering',
      code: 'CSE',
      description: 'Computing systems, algorithms, cloud, and software engineering.',
      hod: 'Dr. Robert Jenkins',
    });

    const deptAI = await Department.create({
      name: 'Artificial Intelligence & Data Science',
      code: 'AIDS',
      description: 'Machine learning, generative AI, deep neural networks, and computer vision.',
      hod: 'Dr. Elena Vance',
    });

    const deptRobotics = await Department.create({
      name: 'Robotics & Automation',
      code: 'ROB',
      description: 'Mechatronics, autonomous kinematics, SLAM, and embedded IoT.',
      hod: 'Dr. Aisha Al-Mansoor',
    });

    // 3. Create Courses
    console.log('📖 Creating Courses...');
    const courseBTechCSE = await Course.create({
      name: 'B.Tech in Computer Science & Engineering',
      code: 'BTECH-CSE',
      departmentId: deptCS._id,
      duration: '4 Years',
      description: 'Undergraduate engineering program in computational science.',
    });

    const courseBTechAI = await Course.create({
      name: 'B.Tech in Artificial Intelligence',
      code: 'BTECH-AI',
      departmentId: deptAI._id,
      duration: '4 Years',
      description: 'Undergraduate program in artificial intelligence and deep neural networks.',
    });

    // 4. Create Faculty Profiles
    console.log('👨‍🏫 Creating Faculty Profiles...');
    const faculty1 = await Faculty.create({
      facultyId: 'FAC-1001',
      userId: facultyUser1._id,
      departmentId: deptAI._id,
      designation: 'Professor & Department Chair',
      phone: facultyUser1.phone,
    });

    const faculty2 = await Faculty.create({
      facultyId: 'FAC-1002',
      userId: facultyUser2._id,
      departmentId: deptCS._id,
      designation: 'Associate Professor',
      phone: facultyUser2.phone,
    });

    // 5. Create Subjects
    console.log('📚 Creating Subjects...');
    const subDL = await Subject.create({
      name: 'Deep Learning & Transformers',
      code: 'CS-501',
      courseId: courseBTechAI._id,
      facultyId: faculty1._id,
      semester: 6,
      credits: 4,
    });

    const subCloud = await Subject.create({
      name: 'Distributed Cloud Architectures',
      code: 'CS-502',
      courseId: courseBTechCSE._id,
      facultyId: faculty2._id,
      semester: 6,
      credits: 4,
    });

    const subOS = await Subject.create({
      name: 'Advanced Operating Systems',
      code: 'CS-503',
      courseId: courseBTechCSE._id,
      facultyId: faculty2._id,
      semester: 6,
      credits: 3,
    });

    // Link subjects to faculty
    faculty1.subjects = [subDL._id];
    await faculty1.save();

    faculty2.subjects = [subCloud._id, subOS._id];
    await faculty2.save();

    // 6. Create Students
    console.log('🎓 Creating Student Profiles...');
    const student1 = await Student.create({
      studentId: 'STU-2024-001',
      userId: studentUser1._id,
      departmentId: deptAI._id,
      courseId: courseBTechAI._id,
      year: 3,
      semester: 6,
      section: 'A',
      rollNumber: '24AI001',
      phone: studentUser1.phone,
      address: 'Titan Hall, Room 304, Campus Residence',
    });

    const student2 = await Student.create({
      studentId: 'STU-2024-002',
      userId: studentUser2._id,
      departmentId: deptAI._id,
      courseId: courseBTechAI._id,
      year: 3,
      semester: 6,
      section: 'A',
      rollNumber: '24AI002',
      phone: studentUser2.phone,
      address: 'Helios Wing, Room 112',
    });

    const student3 = await Student.create({
      studentId: 'STU-2024-003',
      userId: studentUser3._id,
      departmentId: deptCS._id,
      courseId: courseBTechCSE._id,
      year: 3,
      semester: 6,
      section: 'B',
      rollNumber: '24CS015',
      phone: studentUser3.phone,
      address: 'Day Scholar, Metro City',
    });

    // 7. Create Timetable
    console.log('🗓️ Creating Timetable Slots...');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    for (const d of days) {
      await Timetable.create({
        day: d,
        period: 1,
        subjectId: subDL._id,
        facultyId: faculty1._id,
        classroom: 'Smart Hall Alpha (SH-101)',
        startTime: '09:00 AM',
        endTime: '10:15 AM',
      });
      await Timetable.create({
        day: d,
        period: 2,
        subjectId: subCloud._id,
        facultyId: faculty2._id,
        classroom: 'Cyber Cloud Lab 3 (CL-302)',
        startTime: '10:30 AM',
        endTime: '11:45 AM',
      });
      await Timetable.create({
        day: d,
        period: 3,
        subjectId: subOS._id,
        facultyId: faculty2._id,
        classroom: 'Academic Block B (AB-204)',
        startTime: '01:30 PM',
        endTime: '02:45 PM',
      });
    }

    // 8. Create Attendance Records
    console.log('⏱️ Generating Sample Attendance Logs...');
    const pastDays = [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18];
    for (const dayNum of pastDays) {
      const attDate = new Date();
      attDate.setDate(attDate.getDate() - (18 - dayNum));

      // Student 1 (93% attendance)
      await Attendance.create({
        studentId: student1._id,
        subjectId: subDL._id,
        facultyId: faculty1._id,
        date: attDate,
        status: dayNum === 5 ? 'Absent' : 'Present',
      });
      await Attendance.create({
        studentId: student1._id,
        subjectId: subCloud._id,
        facultyId: faculty2._id,
        date: attDate,
        status: 'Present',
      });

      // Student 2 (100% attendance)
      await Attendance.create({
        studentId: student2._id,
        subjectId: subDL._id,
        facultyId: faculty1._id,
        date: attDate,
        status: 'Present',
      });

      // Student 3 (78% attendance)
      await Attendance.create({
        studentId: student3._id,
        subjectId: subCloud._id,
        facultyId: faculty2._id,
        date: attDate,
        status: dayNum % 4 === 0 ? 'Absent' : 'Present',
      });
    }

    // 9. Create Assignments & Submissions
    console.log('📝 Creating Assignments & Submissions...');
    const assign1 = await Assignment.create({
      title: 'Assignment 1: Implementing Self-Attention in PyTorch',
      description: 'Construct a multi-head self-attention module from scratch and test on token embeddings.',
      subjectId: subDL._id,
      facultyId: faculty1._id,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      totalMarks: 100,
      attachment: '',
    });

    const assign2 = await Assignment.create({
      title: 'Assignment 2: Distributed Microservices Deployment with Docker',
      description: 'Deploy a resilient microservices architecture with Kubernetes ingress and redis caching.',
      subjectId: subCloud._id,
      facultyId: faculty2._id,
      dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      totalMarks: 100,
      attachment: '',
    });

    // Sample Graded Submission for student1
    await Submission.create({
      assignmentId: assign1._id,
      studentId: student1._id,
      file: '',
      comments: 'All test cases passed with 98.4% validation accuracy.',
      submittedAt: new Date(),
      marks: 95,
      feedback: 'Outstanding implementation of vectorized tensor scaling.',
      status: 'Graded',
    });

    // 10. Create Notices
    console.log('📢 Creating Notices...');
    await Notice.create({
      title: 'Fall Semester Mid-Term Examination Schedule Released',
      description: 'The mid-term examination timetable has been finalized and published. All scholars must carry their valid student ID.',
      createdBy: adminUser._id,
      targetRole: 'all',
      priority: 'High',
      pinned: true,
    });

    await Notice.create({
      title: 'Annual Nexus Hackathon 2026 ($25,000 Prize Pool)',
      description: 'Registration is now open for the 48-hour student hackathon. Themes include AI Agents and Autonomous Robotics.',
      createdBy: facultyUser1._id,
      targetRole: 'student',
      priority: 'Medium',
      pinned: true,
    });

    await Notice.create({
      title: 'Faculty Academic Senate & Curriculum Review Meeting',
      description: 'All department heads and professors are invited to the senate hall for the Fall curriculum upgrade.',
      createdBy: adminUser._id,
      targetRole: 'faculty',
      priority: 'Urgent',
      pinned: false,
    });

    // 11. Create Events
    console.log('🎉 Creating Events...');
    await Event.create({
      title: 'Nexus Annual Tech Fest & AI Expo 2026',
      description: 'Keynote speakers from Google DeepMind and robotics showcases.',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      time: '10:00 AM - 05:00 PM',
      location: 'Central University Auditorium',
      category: 'Festival',
      createdBy: adminUser._id,
    });

    await Event.create({
      title: 'Campus Placement & Career Fair',
      description: 'Over 40 technology enterprises conducting on-campus recruitment and internships.',
      date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      time: '09:00 AM - 04:00 PM',
      location: 'Turing Convention Center',
      category: 'Placement',
      createdBy: adminUser._id,
    });

    // 12. Create Notifications
    console.log('🔔 Creating Notifications...');
    await Notification.create({
      userId: studentUser1._id,
      title: 'Assignment Graded',
      message: 'Dr. Elena Vance graded your Assignment 1: 95/100.',
      type: 'success',
      isRead: false,
    });

    await Notification.create({
      userId: studentUser1._id,
      title: 'Exam Schedule Notice',
      message: 'Mid-term schedule published for Fall 2026.',
      type: 'info',
      isRead: false,
    });

    await Notification.create({
      userId: facultyUser1._id,
      title: 'New Assignment Submission',
      message: 'Aarav Sharma submitted Self-Attention in PyTorch.',
      type: 'info',
      isRead: false,
    });

    console.log('\n======================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('======================================================');
    console.log('DEMO ACCOUNTS CREATED:');
    console.log('  1. ADMIN:   admin@campus.edu        / Admin@123');
    console.log('  2. FACULTY: elena.vance@campus.edu  / Faculty@123');
    console.log('  3. STUDENT: aarav.sharma@campus.edu / Student@123');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
