import React from 'react';
import { ActivePage, StudentProfile } from '../types';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';
import { CAREER_ROLES } from '../data/careerRolesData';
import { 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  Compass, 
  Layers, 
  GraduationCap, 
  Cpu, 
  BookOpen, 
  Sparkles,
  Award
} from 'lucide-react';

interface HomePageProps {
  setActivePage: (page: ActivePage) => void;
  student: StudentProfile;
  setStudent: (student: StudentProfile) => void;
  onSelectRole: (roleId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setActivePage,
  student,
  setStudent,
  onSelectRole,
}) => {
  const [imgLoaded, setImgLoaded] = React.useState(true);

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-14 pb-12 bg-gradient-to-b from-indigo-50/60 via-slate-50 to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Next-Gen Engineering Career Advisory for College Students</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 text-balance leading-tight">
                AI-Powered Skill Gap Analysis & Career Recommendation System
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Bridge the transition from campus syllabus to industry production. Evaluate your technical proficiencies, visualize exact competency deficits for roles like Java Developer and AI Engineer, and unlock actionable step-by-step learning roadmaps.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActivePage('assessment')}
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span>Start Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActivePage('recommendations')}
                  className="px-5 py-3.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors shadow-xs"
                >
                  Explore Target Roles ({CAREER_ROLES.length})
                </button>
              </div>

              {/* Student Context Bar */}
              <div className="pt-2 flex items-center gap-3 text-xs text-slate-500 border-t border-slate-200/80">
                <span className="font-semibold text-slate-700">Current Profile:</span>
                <span>{student.name || 'New Student'}</span>
                <span>·</span>
                <span>{student.degree}</span>
                <span>·</span>
                <span className="font-medium text-indigo-600">{student.skills.length} skills evaluated</span>
              </div>
            </div>

            {/* Right Column: Hero Visual Asset */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 group">
                {imgLoaded ? (
                  <img
                    src="/src/assets/images/hero_career_skills_1790328322026.jpg"
                    alt="Skill Gap Analysis and Career Pathway Visualization"
                    className="w-full h-auto object-cover aspect-video lg:aspect-4/3 transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={() => setImgLoaded(false)}
                  />
                ) : (
                  <div className="w-full aspect-video lg:aspect-4/3 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 p-8 flex flex-col justify-between text-white">
                    <div className="space-y-2">
                      <Cpu className="w-10 h-10 text-indigo-400" />
                      <div className="text-xl font-bold">Campus to Tech Placement Pipeline</div>
                    </div>
                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span>Algorithmic Gap Mapping</span>
                        <span className="text-emerald-400 font-mono">ACTIVE</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span>Career Match Indexing</span>
                        <span className="text-indigo-400 font-mono">100% RELIABLE</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Roadmap Phases</span>
                        <span className="text-amber-400 font-mono">STRUCTURED</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Floating Micro Badge */}
                <div className="absolute bottom-3 left-3 right-3 p-3 bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/10 text-white flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-medium">Industry Benchmark Engine</span>
                  </div>
                  <span className="text-indigo-300 font-mono text-[11px]">Academic Edition</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Quick Launch Demo Presets for Hackathon Judges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Hackathon Demo Presets
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Test Instant Student Profiles in 1 Click
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-sm">
              Click any college student archetype below to instantly populate assessment data and see live matching across all careers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {SAMPLE_PROFILES.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setStudent({ ...item.profile });
                  setActivePage('gap-analysis');
                }}
                className={`p-4 rounded-lg border transition-all cursor-pointer text-left group hover:border-indigo-400 hover:shadow-xs ${
                  student.name === item.profile.name 
                    ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500' 
                    : 'border-slate-200 bg-slate-50/50 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                    {item.badge}
                  </span>
                  {student.name === item.profile.name && (
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active
                    </span>
                  )}
                </div>
                <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {item.profile.name}
                </div>
                <div className="text-xs text-slate-500 mt-1 line-clamp-1">
                  {item.label.split('(')[1]?.replace(')', '') || item.profile.degree}
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {item.profile.skills.slice(0, 4).map((s) => (
                    <span key={s.skillId} className="text-[10px] font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                      {s.skillName} ({s.level[0]})
                    </span>
                  ))}
                  {item.profile.skills.length > 4 && (
                    <span className="text-[10px] font-mono text-slate-400 px-1">
                      +{item.profile.skills.length - 4} more
                    </span>
                  )}
                </div>
                <div className="mt-3 text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  <span>Analyze this profile</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Core Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            System Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Four Steps to Campus Placement Success
          </h2>
          <p className="text-sm text-slate-600">
            Designed to solve the ambiguity college students face when preparing for competitive placement rounds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div 
            onClick={() => setActivePage('assessment')}
            className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono font-semibold text-slate-400 mb-1">01. Assessment</div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              Technical Skill Inventory
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Log your proficiencies across languages, frameworks, DSA, and databases with granular Beginner, Intermediate, and Advanced tiers.
            </p>
          </div>

          <div 
            onClick={() => setActivePage('gap-analysis')}
            className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono font-semibold text-slate-400 mb-1">02. Gap Analysis</div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              Competency Delta Chart
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Compare your skills side-by-side against standard job profiles. View mastered areas, skills needing improvement, and completely missing competencies.
            </p>
          </div>

          <div 
            onClick={() => setActivePage('recommendations')}
            className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Compass className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono font-semibold text-slate-400 mb-1">03. Career Matching</div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              Match Percentage Ranking
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Discover roles mathematically aligned with your strengths: Java Developer, Web Developer, Data Analyst, Python Developer, and AI/ML Engineer.
            </p>
          </div>

          <div 
            onClick={() => setActivePage('roadmap')}
            className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Layers className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono font-semibold text-slate-400 mb-1">04. Learning Roadmap</div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              Structured Milestones
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Follow chronological phases with free curated resources, resume-worthy capstone projects, and an interactive checklist that updates your readiness score.
            </p>
          </div>

        </div>
      </section>

      {/* Featured Career Paths */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 bg-slate-900 rounded-2xl text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Industry Roles Supported
              </div>
              <h2 className="text-2xl font-bold mt-1">
                Calibrated Against Real Industry Job Descriptions
              </h2>
            </div>
            <button
              onClick={() => setActivePage('assessment')}
              className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
            >
              Analyze Your Match
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {CAREER_ROLES.map((role) => (
              <div 
                key={role.id}
                onClick={() => {
                  onSelectRole(role.id);
                  setActivePage('gap-analysis');
                }}
                className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-indigo-400 hover:bg-slate-800 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider">
                    {role.category}
                  </div>
                  <h4 className="text-base font-bold text-white mt-1 group-hover:text-indigo-300 transition-colors">
                    {role.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {role.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{role.requiredSkills.length} Core Skills</span>
                  <span className="text-emerald-400 font-medium">{role.industryDemand} Demand</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Hackathon Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 bg-indigo-50/70 rounded-xl border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Zero-Database Architectural Resilience
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                The application operates instantaneously in memory and via localStorage caching, perfectly tailored for hackathon evaluations and offline academic demonstrations.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActivePage('assessment')}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            Get Started Now
          </button>
        </div>
      </section>

    </div>
  );
};
