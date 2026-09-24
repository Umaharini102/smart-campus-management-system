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

    // 1. Create Core Users (Generic Placeholder Identities)
    console.log('👤 Creating Generic Users...');
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@campus.edu',
      password: 'Admin@123',
      role: 'admin',
      phone: '+1 (555) 000-0001',
      profileImage: '',
    });

    const facultyUser1 = await User.create({
      name: 'Demo Faculty',
      email: 'faculty@campus.edu',
      password: 'Faculty@123',
      role: 'faculty',
      phone: '+1 (555) 000-0002',
      profileImage: '',
    });

    const facultyUser2 = await User.create({
      name: 'Faculty Member',
      email: 'faculty2@campus.edu',
      password: 'Faculty@123',
      role: 'faculty',
      phone: '+1 (555) 000-0003',
      profileImage: '',
    });

    const studentUser1 = await User.create({
      name: 'Demo Student',
      email: 'student@campus.edu',
      password: 'Student@123',
      role: 'student',
      phone: '+1 (555) 000-0004',
      profileImage: '',
    });

    const studentUser2 = await User.create({
      name: 'Student Two',
      email: 'student2@campus.edu',
      password: 'Student@123',
      role: 'student',
      phone: '+1 (555) 000-0005',
      profileImage: '',
    });

    const studentUser3 = await User.create({
      name: 'Student Three',
      email: 'student3@campus.edu',
      password: 'Student@123',
      role: 'student',
      phone: '+1 (555) 000-0006',
      profileImage: '',
    });

    // 2. Create Departments (Generic Names)
    console.log('🏛️ Creating Departments...');
    const deptCS = await Department.create({
      name: 'Computer Science & Engineering',
      code: 'CSE',
      description: 'Computing systems, algorithms, cloud, and software engineering.',
      hod: 'Faculty Head - CSE',
    });

    const deptAI = await Department.create({
      name: 'Artificial Intelligence & Data Science',
      code: 'AIDS',
      description: 'Machine learning, generative models, deep neural networks, and data science.',
      hod: 'Demo Faculty',
    });

    const deptRobotics = await Department.create({
      name: 'Robotics & Automation',
      code: 'ROB',
      description: 'Mechatronics, autonomous kinematics, control systems, and embedded IoT.',
      hod: 'Faculty Head - Robotics',
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
      name: 'Deep Learning & Neural Networks',
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

    // 6. Create Students (Generic Roll Numbers and Dorms)
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
      address: 'Campus Hostel Block A, Room 304',
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
      address: 'Campus Hostel Block B, Room 112',
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
      address: 'Campus Hostel Block C, Room 205',
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
        classroom: 'Lecture Hall 101',
        startTime: '09:00 AM',
        endTime: '10:15 AM',
      });
      await Timetable.create({
        day: d,
        period: 2,
        subjectId: subCloud._id,
        facultyId: faculty2._id,
        classroom: 'Computer Lab 302',
        startTime: '10:30 AM',
        endTime: '11:45 AM',
      });
      await Timetable.create({
        day: d,
        period: 3,
        subjectId: subOS._id,
        facultyId: faculty2._id,
        classroom: 'Academic Hall 204',
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
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      totalMarks: 100,
      attachment: '',
    });

    const assign2 = await Assignment.create({
      title: 'Assignment 2: Distributed Microservices Deployment with Docker',
      description: 'Deploy a resilient microservices architecture with containerization and caching.',
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
      title: 'Annual Campus Hackathon - Registration Open',
      description: 'Registration is now open for the 48-hour student hackathon. Themes include Intelligent Systems and Autonomous Applications.',
      createdBy: facultyUser1._id,
      targetRole: 'student',
      priority: 'Medium',
      pinned: true,
    });

    await Notice.create({
      title: 'Faculty Academic Senate & Curriculum Review Meeting',
      description: 'All department heads and faculty members are invited to the senate hall for the curriculum review meeting.',
      createdBy: adminUser._id,
      targetRole: 'faculty',
      priority: 'Urgent',
      pinned: false,
    });

    // 11. Create Events
    console.log('🎉 Creating Events...');
    await Event.create({
      title: 'Annual Campus Tech Fest & Technology Expo',
      description: 'Keynote presentations, project exhibitions, and technology showcases.',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      time: '10:00 AM - 05:00 PM',
      location: 'Campus Main Auditorium',
      category: 'Festival',
      createdBy: adminUser._id,
    });

    await Event.create({
      title: 'Campus Placement & Career Fair',
      description: 'Technology enterprises conducting on-campus recruitment and internships.',
      date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      time: '09:00 AM - 04:00 PM',
      location: 'Campus Convention Center',
      category: 'Placement',
      createdBy: adminUser._id,
    });

    // 12. Create Notifications
    console.log('🔔 Creating Notifications...');
    await Notification.create({
      userId: studentUser1._id,
      title: 'Assignment Graded',
      message: 'Faculty evaluated your Assignment 1: 95/100.',
      type: 'success',
      isRead: false,
    });

    await Notification.create({
      userId: studentUser1._id,
      title: 'Exam Schedule Notice',
      message: 'Mid-term schedule published for Fall Semester.',
      type: 'info',
      isRead: false,
    });

    await Notification.create({
      userId: facultyUser1._id,
      title: 'New Assignment Submission',
      message: 'Demo Student submitted Assignment 1.',
      type: 'info',
      isRead: false,
    });

    console.log('\n======================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('======================================================');
    console.log('DEMO ACCOUNTS CREATED:');
    console.log('  1. ADMIN:   admin@campus.edu   / Admin@123');
    console.log('  2. FACULTY: faculty@campus.edu / Faculty@123');
    console.log('  3. STUDENT: student@campus.edu / Student@123');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
