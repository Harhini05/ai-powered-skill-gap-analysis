import { StudentProfile } from '../types';

export const SAMPLE_PROFILES: { label: string; badge: string; profile: StudentProfile }[] = [
  {
    label: 'Priya Sharma (Web & Frontend Aspirant)',
    badge: '3rd Year B.Tech CSE',
    profile: {
      name: 'Priya Sharma',
      degree: 'B.Tech in Computer Science and Engineering',
      collegeYear: '3rd Year',
      skills: [
        { skillId: 'html', skillName: 'HTML', level: 'Advanced', category: 'Web & Frontend' },
        { skillId: 'css', skillName: 'CSS', level: 'Intermediate', category: 'Web & Frontend' },
        { skillId: 'javascript', skillName: 'JavaScript', level: 'Intermediate', category: 'Core Languages' },
        { skillId: 'react', skillName: 'React', level: 'Beginner', category: 'Web & Frontend' },
        { skillId: 'git', skillName: 'Git', level: 'Intermediate', category: 'DevOps & Tools' },
        { skillId: 'data-structures', skillName: 'Data Structures', level: 'Beginner', category: 'CS Fundamentals' },
        { skillId: 'oop', skillName: 'OOP', level: 'Intermediate', category: 'CS Fundamentals' },
      ],
      completedRoadmapSkills: [],
    },
  },
  {
    label: 'Devon Patel (Java Backend Enthusiast)',
    badge: 'Final Year B.Tech IT',
    profile: {
      name: 'Devon Patel',
      degree: 'B.Tech in Information Technology',
      collegeYear: '4th Year (Final Year)',
      skills: [
        { skillId: 'java', skillName: 'Java', level: 'Intermediate', category: 'Core Languages' },
        { skillId: 'oop', skillName: 'OOP', level: 'Advanced', category: 'CS Fundamentals' },
        { skillId: 'data-structures', skillName: 'Data Structures', level: 'Intermediate', category: 'CS Fundamentals' },
        { skillId: 'sql', skillName: 'SQL', level: 'Intermediate', category: 'Backend & Data' },
        { skillId: 'git', skillName: 'Git', level: 'Intermediate', category: 'DevOps & Tools' },
        { skillId: 'spring-boot', skillName: 'Spring Boot', level: 'Beginner', category: 'Backend & Data' },
      ],
      completedRoadmapSkills: [],
    },
  },
  {
    label: 'Aisha Khan (Data & Machine Learning)',
    badge: '3rd Year BS Data Science',
    profile: {
      name: 'Aisha Khan',
      degree: 'B.S. in Data Science & Artificial Intelligence',
      collegeYear: '3rd Year',
      skills: [
        { skillId: 'python', skillName: 'Python', level: 'Intermediate', category: 'Core Languages' },
        { skillId: 'sql', skillName: 'SQL', level: 'Intermediate', category: 'Backend & Data' },
        { skillId: 'machine-learning', skillName: 'Machine Learning', level: 'Beginner', category: 'AI & Machine Learning' },
        { skillId: 'pandas-numpy', skillName: 'Pandas & NumPy', level: 'Intermediate', category: 'AI & Machine Learning' },
        { skillId: 'git', skillName: 'Git', level: 'Beginner', category: 'DevOps & Tools' },
        { skillId: 'data-structures', skillName: 'Data Structures', level: 'Beginner', category: 'CS Fundamentals' },
      ],
      completedRoadmapSkills: [],
    },
  },
];
