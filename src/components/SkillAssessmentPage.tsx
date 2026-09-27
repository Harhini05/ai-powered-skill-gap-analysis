import React, { useEffect, useState } from 'react';
import { ActivePage, StudentProfile, SkillLevel, SkillCategory, StudentSkill } from '../types';
import { ALL_SKILLS } from '../data/skillsData';
import { 
  Check, 
  Search, 
  Plus, 
  Trash2, 
  Sparkles, 
  ArrowRight, 
  GraduationCap, 
  Layers, 
  BookOpen, 
  CheckCircle2, 
  Filter
} from 'lucide-react';

interface SkillAssessmentPageProps {
  student: StudentProfile;
  setStudent: (student: StudentProfile) => void;
  setActivePage: (page: ActivePage) => void;
}

const COMMON_DEGREES = [
  'B.Tech in Computer Science and Engineering',
  'B.Tech in Information Technology',
  'B.S. in Computer Science',
  'B.S. in Data Science & Artificial Intelligence',
  'Bachelor of Computer Applications (BCA)',
  'Master of Computer Applications (MCA)',
  'B.E. in Electronics & Communication Engineering',
];

const COLLEGE_YEARS = [
  '1st Year (Freshman)',
  '2nd Year (Sophomore)',
  '3rd Year (Junior)',
  '4th Year (Senior / Final Year)',
  'Postgraduate / Recent Graduate',
];

export const SkillAssessmentPage: React.FC<SkillAssessmentPageProps> = ({
  student,
  setStudent,
  setActivePage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [customSkillName, setCustomSkillName] = useState('');
  const [customSkillCategory, setCustomSkillCategory] = useState<SkillCategory>('CS Fundamentals');
  const [hanaSkills, setHanaSkills] = useState<any[]>([]);
  useEffect(() => {
  fetch('/api/hana/skills')
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const skills = data.skills.map((skill: any) => ({
          id: skill.SKILL_ID,
          name: skill.SKILL_NAME,
          category: skill.CATEGORY,
          description: skill.DESCRIPTION,
          isPopular: skill.IS_POPULAR,
        }));

        setHanaSkills(skills);
      }
    })
    .catch((error) => {
      console.error('Failed to load skills from HANA:', error);
    });
}, []);

  const categories = ['All', 'Core Languages', 'Web & Frontend', 'Backend & Data', 'CS Fundamentals', 'AI & Machine Learning', 'DevOps & Tools'];

  // Check if a skill is in student's profile
  const getStudentSkill = (skillId: string): StudentSkill | undefined => {
    return student.skills.find(
      s => s.skillId.toLowerCase() === skillId.toLowerCase() || 
           s.skillName.toLowerCase() === skillId.toLowerCase()
    );
  };

  const handleToggleSkill = (skillId: string, skillName: string, category: SkillCategory) => {
    const existing = getStudentSkill(skillId);
    if (existing) {
      // Remove
      setStudent({
        ...student,
        skills: student.skills.filter(
          s => s.skillId.toLowerCase() !== skillId.toLowerCase() && 
               s.skillName.toLowerCase() !== skillName.toLowerCase()
        ),
      });
    } else {
      // Add with default level 'Intermediate'
      const newSkill: StudentSkill = {
        skillId,
        skillName,
        level: 'Intermediate',
        category,
      };
      setStudent({
        ...student,
        skills: [...student.skills, newSkill],
      });
    }
  };

  const handleSetSkillLevel = (skillId: string, level: SkillLevel) => {
    setStudent({
      ...student,
      skills: student.skills.map(s => 
        (s.skillId.toLowerCase() === skillId.toLowerCase() || s.skillName.toLowerCase() === skillId.toLowerCase())
          ? { ...s, level }
          : s
      ),
    });
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSkillName.trim()) return;

    const trimmed = customSkillName.trim();
    const id = trimmed.toLowerCase().replace(/[^a-z0-9]/g, '-');

    if (getStudentSkill(id)) {
      setCustomSkillName('');
      return;
    }

    const newSkill: StudentSkill = {
      skillId: id,
      skillName: trimmed,
      level: 'Intermediate',
      category: customSkillCategory,
    };

    setStudent({
      ...student,
      skills: [...student.skills, newSkill],
    });
    setCustomSkillName('');
  };

  const handleSelectAllCommon = () => {
    // Select the 12 core skills requested by user
    const coreIds = [
      'java', 'python', 'sql', 'html', 'css', 'javascript',
      'data-structures', 'oop', 'git', 'react', 'spring-boot', 'machine-learning'
    ];
    
    const newSkills: StudentSkill[] = [];
    for (const def of ALL_SKILLS) {
      if (coreIds.includes(def.id)) {
        const existing = getStudentSkill(def.id);
        newSkills.push(existing || {
          skillId: def.id,
          skillName: def.name,
          level: 'Intermediate',
          category: def.category,
        });
      }
    }

    setStudent({
      ...student,
      skills: newSkills,
    });
  };

  const handleClearAll = () => {
    setStudent({
      ...student,
      skills: [],
    });
  };

  // Filter skills
  const filteredSkills = hanaSkills.filter((skill) =>  {
    const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate level breakdown
  const beginnerCount = student.skills.filter(s => s.level === 'Beginner').length;
  const intermediateCount = student.skills.filter(s => s.level === 'Intermediate').length;
  const advancedCount = student.skills.filter(s => s.level === 'Advanced').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4" />
            Stage 01: Student Profiling
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Student Technical Skill Assessment
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Select the technical languages, frameworks, and CS fundamentals you have practiced. Indicate your proficiency level to calibrate the gap analysis engine accurately.
          </p>
        </div>

        <button
          onClick={() => setActivePage('gap-analysis')}
          disabled={student.skills.length === 0}
          className={`px-5 py-2.5 text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            student.skills.length > 0
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>Analyze My Skills</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Student Academic Info Card */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
          <span>Student Academic Details</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Student Full Name
            </label>
            <input
              type="text"
              value={student.name}
              onChange={(e) => setStudent({ ...student, name: e.target.value })}
              placeholder="e.g. Alex Chen"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-900"
            />
          </div>

          {/* Degree */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Education / Degree Program
            </label>
            <input
              type="text"
              list="degree-options"
              value={student.degree}
              onChange={(e) => setStudent({ ...student, degree: e.target.value })}
              placeholder="e.g. B.Tech in Computer Science"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-900"
            />
            <datalist id="degree-options">
              {COMMON_DEGREES.map((d, i) => (
                <option key={i} value={d} />
              ))}
            </datalist>
          </div>

          {/* Academic Year */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Current Academic Year
            </label>
            <select
              value={student.collegeYear}
              onChange={(e) => setStudent({ ...student, collegeYear: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-900"
            >
              {COLLEGE_YEARS.map((y, i) => (
                <option key={i} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Skill Inventory Counter & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-100/80 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            <span>Selected Skills:</span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-indigo-700 font-mono text-xs">
              {student.skills.length}
            </span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-3 text-slate-600">
            <span>Beginner: <strong className="font-mono text-slate-900">{beginnerCount}</strong></span>
            <span>Intermediate: <strong className="font-mono text-indigo-700">{intermediateCount}</strong></span>
            <span>Advanced: <strong className="font-mono text-emerald-700">{advancedCount}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSelectAllCommon}
            className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md border border-indigo-200 transition-colors"
          >
            Select 12 Core Tech Skills
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 bg-white hover:bg-rose-50 rounded-md border border-slate-200 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors focus:outline-none ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search skills (e.g. Java, React)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
            />
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => {
            const studentSkill = getStudentSkill(skill.id);
            const isSelected = !!studentSkill;

            return (
              <div
                key={skill.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-indigo-500 ring-1 ring-indigo-500 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleSkill(skill.id, skill.name, skill.category)}
                      className="flex items-start gap-2.5 text-left group flex-1 focus:outline-none"
                    >
                      <div
                        className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'border border-slate-300 group-hover:border-slate-400 bg-slate-50'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {skill.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {skill.category}
                        </div>
                      </div>
                    </button>

                    {skill.isPopular && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                        Core Tech
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed">
                    {skill.description}
                  </p>
                </div>

                {/* Level Selector - Only shown when skill is selected */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  {isSelected ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Your Proficiency Level:</span>
                        <span className="font-semibold text-indigo-700">
                          {studentSkill?.level}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 p-0.5 bg-slate-100 rounded-md">
                        {(['Beginner', 'Intermediate', 'Advanced'] as SkillLevel[]).map((level) => {
                          const isLevelActive = studentSkill?.level === level;
                          return (
                            <button
                              key={level}
                              type="button"
                              onClick={() => handleSetSkillLevel(skill.id, level)}
                              className={`py-1 text-[11px] font-medium rounded transition-all whitespace-nowrap focus:outline-none ${
                                isLevelActive
                                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              {level}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleToggleSkill(skill.id, skill.name, skill.category)}
                      className="w-full py-1 text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded transition-colors text-center"
                    >
                      + Click to Add Skill
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredSkills.length === 0 && (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
            <p className="text-sm text-slate-500">No predefined skills found matching "{searchQuery}".</p>
            <p className="text-xs text-slate-400 mt-1">You can add it below as a custom skill.</p>
          </div>
        )}
      </div>

      {/* Add Custom Skill Form */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Plus className="w-4 h-4 text-indigo-600" />
          Add Custom Technical Competency
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Know another language, library, or framework not listed above? Add it to your profile.
        </p>

        <form onSubmit={handleAddCustomSkill} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="text"
            placeholder="Skill name (e.g. Next.js, Kubernetes, Rust)"
            value={customSkillName}
            onChange={(e) => setCustomSkillName(e.target.value)}
            className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
          <select
            value={customSkillCategory}
            onChange={(e) => setCustomSkillCategory(e.target.value as SkillCategory)}
            className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          >
            {categories.filter(c => c !== 'All').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
          >
            Add to Profile
          </button>
        </form>
      </div>

      {/* Sticky Bottom Bar / Bottom CTA */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-900">
            {student.skills.length} Skills Evaluated for {student.name || 'Student'}
          </div>
          <div className="text-[11px] text-slate-500">
            Ready to benchmark against Java Developer, Web Developer, Data Analyst, Python Developer, and AI/ML Engineer.
          </div>
        </div>

        <button
          onClick={() => setActivePage('gap-analysis')}
          disabled={student.skills.length === 0}
          className={`px-6 py-2.5 text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 ${
            student.skills.length > 0
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer hover:shadow'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>Analyze My Skills & View Gap Chart</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
