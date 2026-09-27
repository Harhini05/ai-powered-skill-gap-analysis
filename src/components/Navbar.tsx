import React from 'react';
import { ActivePage, StudentProfile } from '../types';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';
import { Sparkles, GraduationCap, ChevronDown, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  student: StudentProfile;
  setStudent: (student: StudentProfile) => void;
  selectedRoleTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  student,
  setStudent,
}) => {
  const [showPresetDropdown, setShowPresetDropdown] = React.useState(false);

  const handleSelectPreset = (preset: typeof SAMPLE_PROFILES[0]) => {
    setStudent({ ...preset.profile });
    setShowPresetDropdown(false);
  };

  const navItems: { id: ActivePage; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'assessment', label: 'Skill Assessment' },
    { id: 'gap-analysis', label: 'Gap Analysis' },
    { id: 'recommendations', label: 'Career Matches' },
    { id: 'roadmap', label: 'Learning Roadmap' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Zone 1: Single text element wordmark */}
          <button 
            onClick={() => setActivePage('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:bg-indigo-700 transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              SkillBridge AI
            </span>
          </button>

          {/* Zone 2: 5 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap focus:outline-none ${
                    isActive 
                      ? 'text-indigo-600 font-semibold' 
                      : 'hover:text-slate-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 primary actions (Hackathon Preset Switcher & Assessment status) */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Preset Dropdown for Hackathon Judges */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPresetDropdown(!showPresetDropdown)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Switch demo student profiles for presentation"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Demo Presets:</span>
                <span className="max-w-[110px] truncate font-semibold text-slate-900">
                  {student.name.split(' ')[0] || 'Student'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showPresetDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50 text-xs"
                  onMouseLeave={() => setShowPresetDropdown(false)}
                >
                  <div className="px-3 py-1.5 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-100">
                    Load Hackathon Sample Profiles
                  </div>
                  {SAMPLE_PROFILES.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPreset(preset)}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between group transition-colors"
                    >
                      <div>
                        <div className="font-medium text-slate-800 group-hover:text-indigo-600">
                          {preset.profile.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {preset.badge} · {preset.profile.skills.length} skills
                        </div>
                      </div>
                      {student.name === preset.profile.name && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setStudent({
                          name: '',
                          degree: 'B.Tech in Computer Science',
                          collegeYear: '3rd Year',
                          skills: [],
                          completedRoadmapSkills: [],
                        });
                        setShowPresetDropdown(false);
                        setActivePage('assessment');
                      }}
                      className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 font-medium transition-colors"
                    >
                      Clear & Start Blank Profile
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => setActivePage('assessment')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 whitespace-nowrap"
            >
              Assess Skills ({student.skills.length})
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Sub-bar */}
      <div className="md:hidden border-t border-slate-200 bg-slate-50/80 px-2 py-1.5 flex items-center justify-around text-xs font-medium text-slate-600 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                isActive 
                  ? 'bg-indigo-600 text-white font-semibold' 
                  : 'hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
