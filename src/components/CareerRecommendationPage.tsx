import React, { useEffect, useState } from 'react';
import { ActivePage, StudentProfile } from '../types';
import { CAREER_ROLES } from '../data/careerRolesData';
import { getCareerRecommendations } from '../utils/analysisEngine';
import { 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  BarChart2, 
  Sparkles, 
  Award,
  Layers,
  SlidersHorizontal
} from 'lucide-react';

const ROLE_CATEGORY: Record<string, string> = {
  'java-developer': 'Backend & Enterprise',
  'python-developer': 'Backend & Automation',
  'web-developer': 'Frontend & Full Stack',
  'ai-ml-engineer': 'AI & Data Science',
  'data-scientist': 'AI & Data Science',
  'data-analyst': 'Data & Analytics',
  'business-analyst': 'Data & Analytics',
  'cloud-engineer': 'Cloud & Security',
  'devops-engineer': 'Cloud & Security',
  'cybersecurity-analyst': 'Cloud & Security',
};

interface CareerRecommendationPageProps {
  student: StudentProfile;
  setStudent: (student: StudentProfile) => void;
  setSelectedRoleId: (roleId: string) => void;
  setActivePage: (page: ActivePage) => void;
}

export const CareerRecommendationPage: React.FC<CareerRecommendationPageProps> = ({
  student,
  setStudent,
  setSelectedRoleId,
  setActivePage,
}) => {  const [filterCategory, setFilterCategory] = useState<string>('All');
     const [sortBy, setSortBy] = useState<'careerFit' | 'match' | 'readiness'>('careerFit');

  const [hanaRoles, setHanaRoles] = useState<any[]>([]);

useEffect(() => {
  fetch('/api/hana/roles')
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        
         const roles = data.roles.map((role: any) => ({
  id: role.id,
  title: role.title,
  category: ROLE_CATEGORY[role.id] ?? 'Other',
  description: role.description,
  requiredSkills: role.requiredSkills,
industryDemand: role.industryDemand,
typicalSalaryRange: role.salary,
marketSkills: role.requiredSkills
  .slice()
  .sort((a: any, b: any) => b.weight - a.weight)
  .slice(0, 5)
  .map((skill: any) => skill.skillName),
marketOutlook:
  role.industryDemand === 'Critical'
    ? 'Critical industry demand based on the current role benchmark.'
    : role.industryDemand === 'Very High'
    ? 'Very high industry demand based on the current role benchmark.'
    : 'High industry demand based on the current role benchmark.',
keyResponsibilities: [],
  recommendedElectives: [],
}));

        setHanaRoles(roles);
      }
    })
    .catch((error) => {
      console.error('Failed to load career roles from HANA:', error);
    });
}, []);

  // Compute recommendations
  const recommendationRoles = hanaRoles.length > 0 ? hanaRoles : CAREER_ROLES;
const hasAssessmentData =
  student.skills.length > 0 ||
  (student.interests?.length ?? 0) > 0 ||
  (student.careerPreferences?.length ?? 0) > 0;

const allRecommendations = hasAssessmentData
  ? getCareerRecommendations(recommendationRoles, student)
  : [];

  const categories = ['All', 'Backend & Enterprise', 'Frontend & Full Stack', 'Data & Analytics', 'AI & Data Science', 'Backend & Automation', 'Cloud & Security'];

  const filtered = allRecommendations.filter(item => {
  if (filterCategory === 'All') return true;
  return item.role.category === filterCategory;
});

const sorted = [...filtered].sort((a, b) => {
  let scoreA = 0;
  let scoreB = 0;

  if (sortBy === 'readiness') {
    scoreA = Number(a.overallReadinessScore);
    scoreB = Number(b.overallReadinessScore);
  } else if (sortBy === 'match') {
    scoreA = Number(a.matchPercentage);
    scoreB = Number(b.matchPercentage);
  } else if (sortBy === 'careerFit') {
    scoreA = Number(a.careerFitScore ?? 0);
    scoreB = Number(b.careerFitScore ?? 0);
  }

  return scoreB - scoreA;
});

const topMatch = sorted.length > 0 ? sorted[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            Stage 03: Career Fit & Role Recommendations
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Career Role Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Ranked analysis of technology careers matched with {student.name || 'your'}'s skills. Roles are evaluated based on foundational coverage and depth of required proficiencies.
          </p>
        </div>

        <button
          onClick={() => setActivePage('assessment')}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap self-start md:self-auto"
        >
          Update Skills ({student.skills.length} logged)
        </button>
      </div>

      {/* Top Match Spotlight Banner */}
      {topMatch && (
        <div className="p-6 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-2xl shadow-md border border-indigo-800/40 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-semibold border border-indigo-400/30">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                <span>Top Personalized Career Match</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {topMatch.role.title}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {topMatch.role.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                <span>Industry Demand: <strong className="text-emerald-400">{topMatch.role.industryDemand}</strong></span>
                <span>·</span>
                <span>Typical Entry Salary: <strong className="text-white">{topMatch.role.typicalSalaryRange}</strong></span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <div className="text-center p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 min-w-[110px]">
                <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                  {topMatch.overallReadinessScore}%
                </div>
                <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
                  Readiness Score
                </div>
              </div>

              <div className="space-y-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setSelectedRoleId(topMatch.role.id);
                    setActivePage('gap-analysis');
                  }}


                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Analyze Skill Gap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
  setStudent({
    ...student,
    confirmedCareerRoleId: topMatch.role.id,
  });

  setSelectedRoleId(topMatch.role.id);
  setActivePage('roadmap');
}}
                  className="w-full sm:w-auto px-5 py-2 text-xs font-semibold text-indigo-200 hover:text-white bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/50 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>View Roadmap</span>
                </button>
                <button
 onClick={() => {
  setStudent({
    ...student,
    confirmedCareerRoleId: topMatch.role.id,
  });

  setSelectedRoleId(topMatch.role.id);
  setActivePage('roadmap');
}}
  className="w-full sm:w-auto px-5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center gap-1.5"
>
  <CheckCircle2 className="w-3.5 h-3.5" />
  <span>
    {student.confirmedCareerRoleId === topMatch.role.id
      ? 'Career Path Confirmed'
      : 'Confirm Career Path'}
  </span>
</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
        
        {/* Categories */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors focus:outline-none ${
                filterCategory === cat
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
          >

            <option value="readiness">Readiness Score (High to Low)</option>
            <option value="match">Match Percentage (High to Low)</option>
               <option value="careerFit">Career Fit (Best for you)</option>
          </select>
          <span className="text-[10px] text-indigo-600 font-semibold">
  {sortBy}
</span>
        </div>
      </div>

      {/* Career Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sorted.length === 0 && (
  <div className="p-10 bg-white rounded-xl border border-slate-200 text-center">
    <div className="text-sm font-bold text-slate-900">
      No career recommendation yet
    </div>
    <p className="text-xs text-slate-500 mt-2">
      Complete your skill assessment, interests, and work preferences
      to receive personalized career recommendations.
    </p>
    <button
      onClick={() => setActivePage('assessment')}
      className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
    >
      Start Assessment
    </button>
  </div>
)}
        {sorted.map((item, idx) => {
          console.log(
  'SORT:',
  sortBy,
  item.role.title,
  item.overallReadinessScore,
  item.matchPercentage,
  item.careerFitScore
);
          const isTop = idx === 0;

          return (
  <div
    key={item.role.id}
    onClick={(e) => {
      if (e.target instanceof Element && e.target.closest('button')) return;
      setSelectedRoleId(item.role.id);
      setActivePage('gap-analysis');
    }}
    className={`p-6 bg-white rounded-xl border transition-all flex flex-col justify-between shadow-xs hover:shadow-md cursor-pointer ${
      isTop 
        ? 'border-indigo-400 ring-1 ring-indigo-300' 
        : 'border-slate-200 hover:border-slate-300'
    }`}
  >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-semibold text-indigo-600 uppercase tracking-wider">
                        {item.role.category}
                      </span>
                      {isTop && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Best Fit
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      {item.role.title}
                    </h3>
                  </div>

                  {/* Dual Score Pills */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <div className="text-xl font-bold font-mono text-indigo-600">
                        {item.overallReadinessScore}%
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">Readiness</div>
                      <div className="text-[9px] text-slate-400">
  {item.matchingSkillsCount}/{item.role.requiredSkills.length} skills met
</div>
                    </div>
                    <div className="w-px h-7 bg-slate-200" />
                    <div className="text-right">
                      <div className="text-xl font-bold font-mono text-slate-700">
                        {item.matchPercentage}%
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">Skill Match</div>
                    </div>
                    <div className="w-px h-7 bg-slate-200" />

<div className="text-right">
  <div className="text-xl font-bold font-mono text-emerald-600">
    {item.personalFitScore ?? 0}%
  </div>
  <div className="text-[10px] text-slate-400 font-medium">Personal Fit</div>
</div>
<div className="w-px h-7 bg-slate-200" />

<div className="text-right">
  <div className="text-xl font-bold font-mono text-purple-600">
    {item.careerFitScore ?? 0}%
  </div>
  <div className="text-[10px] text-slate-400 font-medium">Career Fit</div>
</div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 leading-relaxed mb-4">
  <p>{item.role.description}</p>

</div>

                {/* Demand & Salary strip */}
                <div className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-100 mb-4 font-mono text-[11px]">
                  <span className="text-slate-600">
                    Demand: <strong className="text-emerald-700 font-sans">{item.role.industryDemand}</strong>
                  </span>
                  <span className="text-slate-600">
                    Salary: <strong className="text-slate-900 font-sans">{item.role.typicalSalaryRange}</strong>
                  </span>
                </div>

                {/* Matching Skills */}
                <div className="space-y-1.5 mb-3">
                  <div className="text-[11px] font-semibold text-slate-700 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Matching Skills ({item.matchingSkillsList.length})
                    </span>
                    <span className="text-slate-400 text-[10px]">Already possess</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.matchingSkillsList.length > 0 ? (
                      item.matchingSkillsList.map((skillName, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200"
                        >
                          {skillName}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">None logged yet</span>
                    )}
                  </div>
                </div>

                {/* Skills to Improve */}
<div className="space-y-1.5 mb-4">
  <div className="text-[11px] font-semibold text-slate-700 flex items-center justify-between">
    <span className="flex items-center gap-1.5 text-amber-600">
      <TrendingUp className="w-3.5 h-3.5" />
      Skills to Improve ({item.improvementSkillsCount})
    </span>
    <span className="text-slate-400 text-[10px]">Needs higher proficiency</span>
  </div>
  <div className="flex flex-wrap gap-1">
  {item.improvementSkillsList.length > 0 ? (
    item.improvementSkillsList.map((skillName, i) => (
      <span
        key={i}
        className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200"
      >
        {skillName}
      </span>
    ))
  ) : (
    <span className="text-xs text-slate-400 italic">
      No improvement areas
    </span>
  )}
</div>
</div>

{/* Market Intelligence */}
{(item.role.marketSkills?.length || item.role.marketOutlook) && (
  <div className="mt-4 mb-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
    <div className="flex items-center gap-2 mb-2">
      <TrendingUp className="w-4 h-4 text-indigo-600" />
      <h4 className="text-xs font-bold text-indigo-900">
        Market Intelligence
      </h4>
    </div>

    {item.role.marketOutlook && (
      <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
        {item.role.marketOutlook}
      </p>
    )}

    {item.role.marketSkills && item.role.marketSkills.length > 0 && (
      <div>
        <div className="text-[10px] font-semibold text-slate-600 mb-1.5">
          Key Skills for This Role
        </div>

        <div className="flex flex-wrap gap-1.5">
          {item.role.marketSkills.map((skill, i) => (
            <span
              key={i}
              className="text-[10px] font-medium px-2 py-1 rounded-full bg-white text-indigo-700 border border-indigo-100"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
)}

                {/* Missing Skills */}
                <div className="space-y-1.5 mb-4">
                  <div className="text-[11px] font-semibold text-slate-700 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-rose-600">
                      <XCircle className="w-3.5 h-3.5" />
                      Missing Skills ({item.missingSkillsList.length})
                    </span>
                    <span className="text-slate-400 text-[10px]">To be acquired</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.missingSkillsList.length > 0 ? (
                      item.missingSkillsList.map((skillName, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200"
                        >
                          {skillName}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-emerald-600 font-medium">
                        ✓ All foundational skills present!
                      </span>
                    )}
                  </div>
                </div>

              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setSelectedRoleId(item.role.id);
                    setActivePage('gap-analysis');
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>Analyze Gap Chart</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedRoleId(item.role.id);
                    setActivePage('roadmap');
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Learning Roadmap</span>
                </button>
                   <button
     onClick={() => setStudent({ ...student, confirmedCareerRoleId: item.role.id })}
     className={`flex-1 py-2 text-xs font-semibold rounded-lg border flex items-center justify-center gap-1.5 ${
       student.confirmedCareerRoleId === item.role.id
         ? 'bg-emerald-600 text-white border-emerald-600'
         : 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
     }`}
   >
     <CheckCircle2 className="w-3.5 h-3.5" />
     <span>{student.confirmedCareerRoleId === item.role.id ? 'Confirmed' : 'Confirm'}</span>
   </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Career Guidance Footer Note */}
      <div className="p-6 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-bold text-slate-900">How match percentages are computed:</span> Our academic engine analyzes your skill level (Beginner=1, Intermediate=2, Advanced=3) weighted against industry hiring benchmarks for entry-level and junior placement roles.
        </div>
        <button
          onClick={() => setActivePage('roadmap')}
          className="px-4 py-2 text-xs font-bold text-indigo-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
        >
          View Full Curriculum Roadmaps →
        </button>
      </div>

    </div>
  );
};
