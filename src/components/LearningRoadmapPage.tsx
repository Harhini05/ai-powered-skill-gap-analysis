import React, { useState, useEffect } from 'react';
import { ActivePage, StudentProfile, SkillLevel } from '../types';
import { CAREER_ROLES } from '../data/careerRolesData';
import { getRoadmapForRole } from '../data/roadmapData';
import { analyzeCareerGap } from '../utils/analysisEngine';
import { 
  Layers, 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  BookOpen, 
  FolderGit2, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Printer, 
  Download,
  Calendar,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface LearningRoadmapPageProps {
  student: StudentProfile;
  setStudent: (student: StudentProfile) => void;
  selectedRoleId: string;
  setSelectedRoleId: (roleId: string) => void;
  setActivePage: (page: ActivePage) => void;
}

export const LearningRoadmapPage: React.FC<LearningRoadmapPageProps> = ({
  student,
  setStudent,
  selectedRoleId,
  setSelectedRoleId,
  setActivePage,
}) => {
  const [hanaRoles, setHanaRoles] = useState<any[]>([]);
  const [hanaCourses, setHanaCourses] = useState<any[]>([]);
const [hanaCertifications, setHanaCertifications] = useState<any[]>([]);
const hasSelectedRole = selectedRoleId !== '';

const currentRole =
  hanaRoles.find((r: any) => r.id === selectedRoleId) ||
  CAREER_ROLES.find(r => r.id === selectedRoleId) ||
  CAREER_ROLES[0];
const gapReport = analyzeCareerGap(currentRole, student);

const YEAR_ORDER: Record<string, number> = {
  '1st Year': 1,
  '2nd Year': 2,
  '3rd Year': 3,
  'Final Year': 4,
};

const studentYearNumber = YEAR_ORDER[student.collegeYear] || 4;

const recommendedCourses = hanaCourses.filter((course: any) => {
  const minYear = YEAR_ORDER[course.MIN_YEAR] || 1;
  const maxYear = YEAR_ORDER[course.MAX_YEAR] || 4;

  return (
    course.ROLE_ID === currentRole.id &&
    studentYearNumber >= minYear &&
    studentYearNumber <= maxYear
  );
});

const recommendedCertifications = hanaCertifications.filter((cert: any) => {
  const minYear = YEAR_ORDER[cert.MIN_YEAR] || 1;
  const maxYear = YEAR_ORDER[cert.MAX_YEAR] || 4;

  return (
    cert.ROLE_ID === currentRole.id &&
    studentYearNumber >= minYear &&
    studentYearNumber <= maxYear
  );
});

const prioritySkills = [
  ...gapReport.missingSkills,
  ...gapReport.improvementSkills,
];

  const completedSet = new Set(student.completedRoadmapSkills || []);

  const [filterLevel, setFilterLevel] = useState<string>('All');
  const [showExportModal, setShowExportModal] = useState(false);
  const [customAIPlan, setCustomAIPlan] = useState<any[] | null>(null);
  const [loadingAIPlan, setLoadingAIPlan] = useState(false);
  const [hanaRoadmap, setHanaRoadmap] = useState<any[]>([]);
  
  useEffect(() => {
  fetch('/api/hana/roadmap')
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        setHanaRoadmap(data.roadmap);
      }
    })
    .catch((error) => {
      console.error('Failed to load roadmap from HANA:', error);
    });
}, []);

useEffect(() => {
  fetch('/api/hana/courses')
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        setHanaCourses(data.courses);
      }
    })
    .catch((error) => {
      console.error('Failed to load courses from HANA:', error);
    });

  fetch('/api/hana/certifications')
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        setHanaCertifications(data.certifications);
      }
    })
    .catch((error) => {
      console.error('Failed to load certifications from HANA:', error);
    });
}, []);

useEffect(() => {
  fetch('/api/hana/roles')
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        setHanaRoles(data.roles);
      }
    })
    .catch((error) => {
      console.error('Failed to load roles from HANA:', error);
    });
}, []);

const phases = hanaRoadmap
  .filter((phase: any) => phase.ROLE_ID === currentRole.id)
  .map((phase: any) => ({
    phaseNumber: phase.PHASE_NUMBER,
    phaseTitle: phase.PHASE_TITLE,
    description: phase.DESCRIPTION,
    levelBadge: phase.LEVEL,
    milestones: [
      {
        id: phase.ROADMAP_ID,
        suggestedOrder: phase.PHASE_NUMBER,
        levelTarget: phase.LEVEL,
        durationEstimate: phase.DURATION,
        skillName: phase.PHASE_TITLE,
        keyTopics: [phase.DESCRIPTION],
        resources: [] as { provider: string; title: string; type: string }[],
        portfolioProject: {
          name: phase.PORTFOLIO_PROJECT,
          brief: phase.DESCRIPTION,
          outcome: 'Complete this project to demonstrate the target skills.'
        }
      }
    ]
  }));

  // Toggle milestone completion in student profile
  const handleToggleMilestone = (milestoneId: string) => {
    const updated = new Set(student.completedRoadmapSkills || []);
    if (updated.has(milestoneId)) {
      updated.delete(milestoneId);
    } else {
      updated.add(milestoneId);
    }
    setStudent({
      ...student,
      completedRoadmapSkills: Array.from(updated),
    });
  };

  // Generate AI Customized Weekly Study Plan
  const handleGenerateAIPlan = async () => {
    setLoadingAIPlan(true);
    try {
      const res = await fetch('/api/ai/roadmap-customizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: currentRole.title,
          currentSkills: student.skills.map(s => `${s.skillName} (${s.level})`),
          gapSkills: [...gapReport.missingSkills, ...gapReport.improvementSkills].map(s => s.skillName),
          weeksAvailable: 10,
        }),
      });
      const data = await res.json();
      if (data.success && data.milestones) {
        setCustomAIPlan(data.milestones);
      }
    } catch (e) {
      console.warn('AI roadmap error, using fallback schedule', e);
    } finally {
      setLoadingAIPlan(false);
    }
  };

  // Calculate overall completed percentage
  const allMilestoneIds = phases.flatMap(p => p.milestones.map(m => m.id));
  const completedCount = allMilestoneIds.filter(id => completedSet.has(id)).length;
  const progressPercent = allMilestoneIds.length > 0 
    ? Math.round((completedCount / allMilestoneIds.length) * 100) 
    : 0;

    if (!hasSelectedRole) {
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto mt-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-indigo-50 flex items-center justify-center">
            <Layers className="w-7 h-7 text-indigo-600" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            No Career Path Selected
          </h2>

          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            Complete your skill assessment and explore your career
            recommendations to select a career path and generate your
            personalized learning roadmap.
          </p>

          <button
            onClick={() => setActivePage('recommendations')}
            className="mt-6 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            View Career Recommendations
          </button>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      
      {/* Header & Role Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            Stage 04: Structured Learning Curriculum
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Learning Roadmap: {currentRole.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            A suggested chronological curriculum with progressive milestones from Beginner to Advanced. Mark competencies complete as you study to track readiness.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {student.confirmedCareerRoleId && (
  <div className="flex flex-col text-[10px] leading-tight mr-2">
    <span className="text-emerald-600 font-semibold">
      Confirmed Career:{" "}
      {hanaRoles.find(
        (r: any) => r.id === student.confirmedCareerRoleId
      )?.title ||
        CAREER_ROLES.find(
          (r) => r.id === student.confirmedCareerRoleId
        )?.title ||
        "Confirmed Role"}
    </span>

    <span className="text-slate-500 mt-0.5">
      Currently Viewing: {currentRole.title}
    </span>
  </div>
)}
          <select
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            className="px-3.5 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 cursor-pointer"
          >
            {hanaRoles.map((r) => (
  <option key={r.id} value={r.id}>
    {r.title}
  </option>
))}
          </select>

          <button
            onClick={() => setShowExportModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Interactive Progress & Readiness Tracker */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Curriculum Milestone Completion
            </div>
            <div className="text-lg font-bold text-slate-900">
              {completedCount} of {allMilestoneIds.length} Objectives Completed
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-slate-500">Live Career Readiness</div>
              <div className="text-xl font-bold font-mono text-indigo-600">
                {gapReport.overallReadinessScore}%
              </div>
            </div>
            <button
              onClick={() => setActivePage('gap-analysis')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View Gap Chart</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
          <div
            className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>0% Start</span>
          <span>{progressPercent}% Milestones Mastered</span>
          <span>100% Industry Placement Ready</span>
        </div>
      </div>

      {/* Personalized Priority Skills */}
{prioritySkills.length > 0 && (
  <div className="p-6 bg-white rounded-xl border border-indigo-100 shadow-xs">
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-indigo-50">
        <TrendingUp className="w-5 h-5 text-indigo-600" />
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-bold text-slate-900">
          Your Priority Skills
        </h3>

        <p className="text-xs text-slate-500 mt-1">
          These skills are prioritized based on your current skill gaps for
          the {currentRole.title} role.
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {prioritySkills.map((skill: any) => (
            <span
              key={skill.skillId}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border ${
                gapReport.missingSkills.some(
                  (s: any) => s.skillId === skill.skillId
                )
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {skill.skillName}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-3 text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            Missing skill
          </span>

          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Needs improvement
          </span>
        </div>
      </div>
    </div>
  </div>
)}

      {/* AI Personalized Schedule Customizer Box */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-sm border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                AI Sprint Generator
              </span>
            </div>
            <h3 className="text-base font-bold text-white">
              Personalized 10-Week Placement Schedule for {student.name || 'You'}
            </h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Tailors the learning order specifically around your {gapReport.missingSkills.length} missing skill(s) and {gapReport.improvementSkills.length} area(s) needing upgrade.
            </p>
          </div>

          <button
            onClick={handleGenerateAIPlan}
            disabled={loadingAIPlan}
            className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{loadingAIPlan ? 'Generating Schedule...' : 'Generate 10-Week Sprint'}</span>
          </button>
        </div>

        {customAIPlan && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            {customAIPlan.map((sprint, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="text-[11px] font-mono text-indigo-400 font-semibold">
                  {sprint.weekRange}
                </div>
                <div className="text-sm font-bold text-white">
                  {sprint.phaseName}
                </div>
                <div className="text-xs text-slate-300">
                  Focus: <span className="font-semibold text-emerald-400">{sprint.focusSkills?.join(', ')}</span>
                </div>
                <div className="text-[11px] text-slate-400 pt-1">
                  Deliverable: <span className="text-slate-200">{sprint.portfolioCheckpoint}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Courses & Certifications */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

  {/* Courses */}
  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
    <div className="flex items-center gap-2 mb-4">
      <BookOpen className="w-5 h-5 text-indigo-600" />
      <h2 className="text-base font-bold text-slate-900">
        Recommended Courses
      </h2>
    </div>

    {recommendedCourses.length > 0 ? (
      <div className="space-y-3">
        {recommendedCourses.map((course: any) => (
          <a
            key={course.COURSE_ID}
            href={course.COURSE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {course.COURSE_NAME}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
  {course.PROVIDER} · {course.LEVEL} · {course.MIN_YEAR} – {course.MAX_YEAR}
</p>
              </div>
              <ExternalLink className="w-4 h-4 text-indigo-600 shrink-0" />
            </div>

            <p className="text-xs text-slate-600 mt-2">
              {course.DESCRIPTION}
            </p>
          </a>
        ))}
      </div>
    ) : (
      <p className="text-sm text-slate-500">
        No courses available for this career path and academic year.
      </p>
    )}
  </div>

  {/* Certifications */}
  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
    <div className="flex items-center gap-2 mb-4">
      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
      <h2 className="text-base font-bold text-slate-900">
        Recommended Certifications
      </h2>
    </div>

    {recommendedCertifications.length > 0 ? (
      <div className="space-y-3">
        {recommendedCertifications.map((cert: any) => (
          <a
            key={cert.CERTIFICATION_ID}
            href={cert.CERTIFICATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {cert.CERTIFICATION_NAME}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
  {cert.PROVIDER} · {cert.LEVEL} · {cert.MIN_YEAR} – {cert.MAX_YEAR}
</p>
              </div>
              <ExternalLink className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>

            <p className="text-xs text-slate-600 mt-2">
              {cert.DESCRIPTION}
            </p>
          </a>
        ))}
      </div>
    ) : (
      <p className="text-sm text-slate-500">
        No certifications available for this career path and academic year.
      </p>
    )}
  </div>

</div>

      {/* Suggested Chronological Roadmap Phases */}
      <div className="space-y-8">
        
        {phases.map((phase) => {
          return (
            <div key={phase.phaseNumber} className="space-y-4">
              
              {/* Phase Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-slate-100 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    0{phase.phaseNumber}
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      {phase.phaseTitle}
                    </h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {phase.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${
                    phase.levelBadge === 'Beginner' 
                      ? 'bg-blue-100 text-blue-800'
                      : phase.levelBadge === 'Intermediate'
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {phase.levelBadge} Level
                  </span>
                </div>
              </div>

              {/* Milestones inside Phase */}
              <div className="grid grid-cols-1 gap-4">
                {phase.milestones.map((milestone) => {
                  const isChecked = completedSet.has(milestone.id);

                  return (
                    <div
                      key={milestone.id}
                      className={`p-6 rounded-xl border transition-all ${
                        isChecked
                          ? 'bg-emerald-50/40 border-emerald-300'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                        
                        {/* Left: Checkbox and Details */}
                        <div className="flex items-start gap-4 flex-1">
                          
                          <button
                            type="button"
                            onClick={() => handleToggleMilestone(milestone.id)}
                            className="mt-1 text-slate-400 hover:text-indigo-600 focus:outline-none transition-colors shrink-0"
                            title="Click to toggle milestone completion"
                          >
                            {isChecked ? (
                              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                            ) : (
                              <Circle className="w-6 h-6 hover:text-indigo-600" />
                            )}
                          </button>

                          <div className="space-y-3 flex-1">
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="text-xs font-mono font-semibold text-slate-500">
                                  Order #{milestone.suggestedOrder}
                                </span>
                                <span className="text-slate-300">·</span>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                  Target: {milestone.levelTarget}
                                </span>
                                <span className="text-slate-300">·</span>
                                <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                                  <Clock className="w-3 h-3" /> {milestone.durationEstimate}
                                </span>
                              </div>

                              <h3 className={`text-lg font-bold transition-colors ${
                                isChecked ? 'line-through text-slate-500' : 'text-slate-900'
                              }`}>
                                {milestone.skillName}
                              </h3>
                            </div>

                            {/* Core Topics Checklist */}
                            <div className="space-y-1">
                              <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                                Core Study Topics:
                              </div>
                              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-600">
                                {milestone.keyTopics.map((topic, idx) => (
                                  <li key={idx} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                    <span>{topic}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Recommended Learning Resources */}
                            <div className="space-y-1.5 pt-2">
                              <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Curated Free Resources:</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {milestone.resources.map((res, idx) => (
                                  <div
                                    key={idx}
                                    className="inline-flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-800"
                                  >
                                    <span className="font-semibold text-indigo-700">{res.provider}:</span>
                                    <span>{res.title}</span>
                                    <span className="text-[10px] text-slate-400 font-mono">({res.type})</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* Right: Portfolio Checkpoint Project */}
                        <div className="lg:w-80 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 shrink-0">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <FolderGit2 className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Portfolio Checkpoint Project</span>
                          </div>
                          
                          <div className="font-bold text-xs text-slate-900">
                            {milestone.portfolioProject.name}
                          </div>
                          
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            {milestone.portfolioProject.brief}
                          </p>

                          <div className="pt-2 border-t border-slate-200/80 text-[10px] text-emerald-700 font-medium">
                            ✓ {milestone.portfolioProject.outcome}
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}

      </div>

      {/* Export / Print Report Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Academic Placement Portfolio Summary
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Career Readiness & Gap Report
                </h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
                <div>
                  <div className="text-slate-500">Student Name:</div>
                  <div className="font-bold text-slate-900 text-sm">{student.name || 'Anonymous Student'}</div>
                </div>
                <div>
                  <div className="text-slate-500">Degree Program:</div>
                  <div className="font-bold text-slate-900">{student.degree}</div>
                </div>
                <div>
                  <div className="text-slate-500">Target Role:</div>
                  <div className="font-bold text-indigo-600">{currentRole.title}</div>
                </div>
                <div>
                  <div className="text-slate-500">Overall Readiness:</div>
                  <div className="font-bold font-mono text-emerald-600">{gapReport.overallReadinessScore}%</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Mastered Competencies ({gapReport.matchingSkills.length})</h4>
                <div className="flex flex-wrap gap-1">
                  {gapReport.matchingSkills.map(s => (
                    <span key={s.skillId} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {s.skillName} ({s.studentLevel})
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Skills Needing Level Elevation ({gapReport.improvementSkills.length})</h4>
                <div className="flex flex-wrap gap-1">
                  {gapReport.improvementSkills.map(s => (
                    <span key={s.skillId} className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      {s.skillName} (Current: {s.studentLevel} → Target: {s.requiredLevel})
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Missing Skills to Acquire ({gapReport.missingSkills.length})</h4>
                <div className="flex flex-wrap gap-1">
                  {gapReport.missingSkills.map(s => (
                    <span key={s.skillId} className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                      {s.skillName} (Target: {s.requiredLevel})
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 text-slate-700 leading-relaxed">
                <span className="font-bold text-indigo-900">Placement Advisory Note:</span> {gapReport.summary}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
