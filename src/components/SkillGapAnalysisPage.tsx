import React, { useState, useEffect } from 'react';
import { ActivePage, StudentProfile, CareerRole } from '../types';
import { CAREER_ROLES } from '../data/careerRolesData';
import { analyzeCareerGap } from '../utils/analysisEngine';
import { SkillGapChart } from './SkillGapChart';
import { 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Briefcase, 
  HelpCircle, 
  RefreshCw,
  Award,
  BookOpen
} from 'lucide-react';

interface SkillGapAnalysisPageProps {
  student: StudentProfile;
  selectedRoleId: string;
  setSelectedRoleId: (roleId: string) => void;
  setActivePage: (page: ActivePage) => void;
}

export const SkillGapAnalysisPage: React.FC<SkillGapAnalysisPageProps> = ({
  student,
  selectedRoleId,
  setSelectedRoleId,
  setActivePage,
}) => {
  // AI Diagnostic State
  const [aiDiagnostic, setAiDiagnostic] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [hanaRoles, setHanaRoles] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'mastered' | 'improvement' | 'missing'>('all');

  // Load career roles from SAP HANA
  useEffect(() => {
    fetch('/api/hana/roles')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const roles = data.roles.map((role: any) => ({
  id: role.id,
  title: role.title,
  description: role.description,
  salary: role.salary,
  requiredSkills: role.requiredSkills,
}));

          setHanaRoles(roles);
        }
      })
      .catch((error) => {
        console.error('Failed to load career roles from HANA:', error);
      });
  }, []);

  const currentRole =
  hanaRoles.find(r => r.id === selectedRoleId) || CAREER_ROLES[0];

const report = currentRole
  ? analyzeCareerGap(currentRole, student)
  : analyzeCareerGap(CAREER_ROLES[0], student);

  // Trigger AI diagnostic fetch when role changes or upon button click
  const fetchAiDiagnostic = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/ai/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: student.name,
          degree: student.degree,
          targetRole: currentRole.title,
          readinessScore: report.overallReadinessScore,
          matchingSkills: report.matchingSkills,
          improvementSkills: report.improvementSkills,
          missingSkills: report.missingSkills,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setAiDiagnostic(json.data);
      }
    } catch (err) {
      console.warn('AI diagnostic fetch error, using algorithmic fallback', err);
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    // Fetch initial diagnostic for default role
    fetchAiDiagnostic();
  }, [selectedRoleId, student.skills.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      
      {/* Header & Role Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4" />
            Stage 02: Quantitative Skill Gap Analysis
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Gap Analysis for {currentRole.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Comparing {student.name || 'Student'}'s profile against the {currentRole.title} benchmark. Skills are categorized into Mastered, Improvement Needed, and Missing.
          </p>
        </div>

        {/* Role Selector Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <label className="text-xs font-semibold text-slate-700 whitespace-nowrap self-center sm:self-auto">
            Benchmark Against:
          </label>
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
            onClick={() => setActivePage('roadmap')}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <span>Open Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Role Quick Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {hanaRoles.map((r) => {
          const isSelected = r.id === selectedRoleId;
          return (
            <button
              key={r.id}
              onClick={() => setSelectedRoleId(r.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-semibold'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
              }`}
            >
              {r.title}
            </button>
          );
        })}
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Overall Readiness Score Card */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Career Readiness Score
            </div>
            <div className="text-3xl font-extrabold text-indigo-600 font-mono mt-1">
              {report.overallReadinessScore}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Weighted role alignment
            </div>
          </div>
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-600 transition-all duration-1000"
                strokeDasharray={`${report.overallReadinessScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[11px] font-bold text-slate-800">
              {report.overallReadinessScore}%
            </span>
          </div>
        </div>

        {/* Mastered Skills Count */}
        <div 
          onClick={() => setActiveTab('mastered')}
          className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-300 transition-colors"
        >
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Already Mastered</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {report.matchingSkills.length} <span className="text-xs font-normal text-slate-500">/ {currentRole.requiredSkills.length}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Meets or exceeds benchmark
          </p>
        </div>

        {/* Needs Improvement Count */}
        <div 
          onClick={() => setActiveTab('improvement')}
          className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-amber-300 transition-colors"
        >
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Needs Improvement</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {report.improvementSkills.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Has basics; level upgrade required
          </p>
        </div>

        {/* Missing Skills Count */}
        <div 
          onClick={() => setActiveTab('missing')}
          className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-rose-300 transition-colors"
        >
          <div className="flex items-center justify-between text-rose-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Missing Skills</span>
            <XCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {report.missingSkills.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Not yet started; add to roadmap
          </p>
        </div>

      </div>

      {/* Main Grid: Visual Skill-Gap Chart + Diagnostic Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Chart */}
        <div className="lg:col-span-7">
          <SkillGapChart report={report} />
        </div>

        {/* Right Column: AI Deep Advisory & Strategic Summary */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Executive Summary Card */}
          <div className="p-6 bg-slate-900 text-white rounded-xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  AI Placement Diagnostic
                </span>
              </div>
              <button
                onClick={fetchAiDiagnostic}
                disabled={loadingAi}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 focus:outline-none"
                title="Refresh AI diagnostic"
              >
                <RefreshCw className={`w-3 h-3 ${loadingAi ? 'animate-spin' : ''}`} />
                <span>{loadingAi ? 'Analyzing...' : 'Re-analyze'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {aiDiagnostic?.executiveSummary || report.summary}
            </p>

            {/* Critical Pivots / Priority Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider">
                Priority Action Plan:
              </div>
              <ul className="space-y-2">
                {(aiDiagnostic?.criticalPivots || [
  report.missingSkills.length > 0
    ? `Learn ${report.missingSkills[0].skillName} from the fundamentals and complete practical exercises.`
    : report.improvementSkills.length > 0
    ? `Upgrade ${report.improvementSkills[0].skillName} from ${report.improvementSkills[0].studentLevel} to ${report.improvementSkills[0].requiredLevel}.`
    : `Strengthen your ${currentRole.title} skills through advanced projects.`,

  report.improvementSkills.length > 0
    ? `Improve ${report.improvementSkills.map(s => s.skillName).slice(0, 2).join(' and ')} through hands-on projects.`
    : `Build a portfolio project demonstrating your ${currentRole.title} competencies.`,

  `Complete the ${currentRole.title} learning roadmap and build a portfolio project aligned with the required skills.`,
]).map((action: string, i: number) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-indigo-950 text-indigo-400 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Placement Timeline Callout */}
            <div className="pt-2 text-[11px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-800/80">
              <span>Target Timeline:</span>
              <span className="text-emerald-400 font-semibold">
                {aiDiagnostic?.placementTimeline || '8-10 Weeks to Placement'}
              </span>
            </div>
          </div>

          {/* Recommended Capstone Project Box */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              <span>Recommended Hackathon Capstone</span>
            </div>
            
            <h4 className="text-sm font-bold text-slate-900">
              {aiDiagnostic?.hackathonProjectIdea?.title || `Production ${currentRole.title} Capstone`}
            </h4>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              {aiDiagnostic?.hackathonProjectIdea?.description || 
               `Construct a project that integrates your mastered skills (${report.matchingSkills.slice(0, 2).map(s => s.skillName).join(', ') || 'languages'}) while conquering missing gaps (${report.missingSkills.slice(0, 2).map(s => s.skillName).join(', ') || 'frameworks'}).`}
            </p>

            <button
              onClick={() => setActivePage('roadmap')}
              className="w-full mt-2 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors text-center block"
            >
              View Learning Order & Project Guide →
            </button>
          </div>

        </div>
      </div>

      {/* Detailed Skill Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Table Filter Tabs */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Granular Skill-by-Skill Audit
            </h3>
            <p className="text-xs text-slate-500">
              Every required competency analyzed against your current student inventory.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({currentRole.requiredSkills.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('mastered')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'mastered' ? 'bg-white text-emerald-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mastered ({report.matchingSkills.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('improvement')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'improvement' ? 'bg-white text-amber-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Improve ({report.improvementSkills.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('missing')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'missing' ? 'bg-white text-rose-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Missing ({report.missingSkills.length})
            </button>
          </div>
        </div>

        {/* Table Rows */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Competency</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Your Level</th>
                <th className="py-3 px-4">Benchmark Required</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Why It Matters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentRole.requiredSkills
               .filter((req: any) => {
                  const ev = [...report.matchingSkills, ...report.improvementSkills, ...report.missingSkills]
                    .find(e => e.skillId === req.skillId);
                  if (activeTab === 'all') return true;

if (activeTab === 'mastered') {
  return report.matchingSkills.some(e => e.skillId === req.skillId);
}

if (activeTab === 'improvement') {
  return report.improvementSkills.some(e => e.skillId === req.skillId);
}

if (activeTab === 'missing') {
  return report.missingSkills.some(e => e.skillId === req.skillId);
}

return true;
                })
                .map((req: any) => {
                  const evaluation = [...report.matchingSkills, ...report.improvementSkills, ...report.missingSkills]
                    .find(e => e.skillId === req.skillId);

                  const isMastered = evaluation?.status === 'mastered';
                  const isImprovement = evaluation?.status === 'improvement_needed';
                  const isMissing = evaluation?.status === 'missing';

                  return (
                    <tr key={req.skillId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {req.skillName}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {evaluation?.category}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${
                          isMastered ? 'text-emerald-700' : isImprovement ? 'text-amber-700' : 'text-slate-400'
                        }`}>
                          {evaluation?.studentLevel || 'None'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {req.requiredLevel}
                      </td>
                      <td className="py-3 px-4">
                        {isMastered && (
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Met
                          </span>
                        )}
                        {isImprovement && (
                          <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
                            <AlertTriangle className="w-3.5 h-3.5" /> Upgrade Level
                          </span>
                        )}
                        {isMissing && (
                          <span className="inline-flex items-center gap-1 font-semibold text-rose-600">
                            <XCircle className="w-3.5 h-3.5" /> Missing
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs leading-relaxed">
                        {req.whyImportant}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => setActivePage('recommendations')}
            className="text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
          >
            ← View All Career Role Recommendations
          </button>

          <button
            onClick={() => setActivePage('roadmap')}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>Proceed to Learning Roadmap for {currentRole.title}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
