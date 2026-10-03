// Single source of truth for all portfolio content. Nothing here is invented.
export const PROFILE = {
  name: 'Bipin S Menon',
  roles: ['Software Developer', 'Front-End Developer', 'AI Enthusiast'],
  intro:
    'B.E. CSE student at Sri Ramakrishna Engineering College, Coimbatore, building web apps and AI-powered systems.',
}

export const CONTACT = {
  email: 'bipinsmenon@gmail.com',
  gmail:
    'https://mail.google.com/mail/?view=cm&fs=1&to=bipinsmenon@gmail.com&su=Hello%20Bipin',
  mailto: 'mailto:bipinsmenon@gmail.com?subject=Hello%20Bipin',
  github: 'https://github.com/bipin-del',
  linkedin: 'https://www.linkedin.com/in/bipinsmenon',
  phone: '9566650960',
  tel: 'tel:9566650960',
}

export const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'journey', label: 'Journey' },
  { id: 'connect', label: 'Connect' },
]

export const STATS = [
  { value: 3, label: 'Projects' },
  { value: 5, label: 'Certifications' },
  { value: 1, label: 'Hackathon Win' },
]

export const SKILLS = [
  { key: 'lang', name: 'Languages', items: ['Java', 'Python', 'C'] },
  {
    key: 'front',
    name: 'Front-End',
    items: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Responsive Web Design', 'UI/UX'],
  },
  { key: 'frame', name: 'Frameworks', items: ['Spring Boot', 'Flask'] },
  { key: 'db', name: 'Database', items: ['MySQL'] },
  { key: 'ai', name: 'AI / NLP', items: ['OCR', 'RoBERTa', 'NLP'] },
  { key: 'qa', name: 'Testing', items: ['Manual & Automation Testing'] },
  { key: 'tools', name: 'Tools', items: ['GitHub', 'VS Code', 'Android Studio', 'Postman'] },
  {
    key: 'cs',
    name: 'CS Core',
    items: ['OOP', 'DBMS', 'Operating Systems', 'Computer Networks', 'REST APIs'],
  },
]

export const PROJECTS = [
  {
    id: 'ocr',
    title: 'OCR Accuracy Enhancement Using RoBERTa-based AI Model',
    short: 'OCR Accuracy Enhancement',
    tags: ['Python', 'RoBERTa', 'NLP', 'OCR'],
    summary:
      'AI post-processing system that corrects character- and word-level errors in scanned documents, books and forms.',
    details: [
      'Post-processes raw OCR output with a RoBERTa-based model',
      'Fixes character-level and word-level errors',
      'Targets scanned documents, books and forms',
    ],
    status: null,
  },
  {
    id: 'civisnap',
    title: 'CiviSnap – AI-Powered Civic Issue Reporting System',
    short: 'CiviSnap',
    tags: ['App Development', 'AI'],
    summary:
      'Citizens upload images of potholes, garbage and damaged streetlights; AI classifies, describes and routes the issue to the right department.',
    details: [
      'AI classifies and describes the reported issue',
      'Routes it to the right department',
      'Real-time complaint tracking',
      'Secure authentication and an admin dashboard',
    ],
    status: null,
  },
  {
    id: 'lifeline',
    title: 'LifeLine – Emergency First Response System',
    short: 'LifeLine',
    tags: ['React.js', 'Python', 'Flask'],
    summary:
      'Connects nearby physicians with heart attack patients, aiming to enable first aid before the ambulance arrives.',
    details: [
      'Connects nearby physicians with heart attack patients',
      'One-tap SOS with live location sharing',
      'Aims to enable first aid before the ambulance arrives',
    ],
    status: 'In progress',
  },
]

export const JOURNEY = [
  { when: '2023 – 2027', title: 'B.E. Computer Science & Engineering', text: 'Sri Ramakrishna Engineering College, Coimbatore. CGPA 7.3', mark: 'EDU' },
  { when: 'Internships', title: 'Dual-domain internships', text: 'UI/UX and Front-End Web Development', mark: 'INT' },
  { when: 'Hackathon', title: 'Winner, Tech Accelerate Hackathon', text: 'BITS Pilani Hyderabad. Blockchain Candidate Voting System', mark: 'WIN' },
  { when: '2022 – 2023', title: 'HSC', text: 'Coimbatore Public School (CBSE). 61.6%', mark: 'HSC' },
]

export const CERTS = [
  { name: 'AWS Certified Solutions Architect – Associate', by: 'Udemy' },
  { name: 'Infosys Certified Scrum Master', by: 'Infosys Springboard' },
  { name: 'Software Engineer', by: 'Infosys Springboard' },
  { name: 'Agile Software Development', by: 'Infosys Springboard' },
  { name: 'Programming in C', by: 'Skillrack' },
]
