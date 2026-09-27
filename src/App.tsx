import React, { useState, useEffect } from 'react';
import { ActivePage, StudentProfile } from './types';
import { SAMPLE_PROFILES } from './data/sampleProfiles';
import { CAREER_ROLES } from './data/careerRolesData';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { SkillAssessmentPage } from './components/SkillAssessmentPage';
import { SkillGapAnalysisPage } from './components/SkillGapAnalysisPage';
import { CareerRecommendationPage } from './components/CareerRecommendationPage';
import { LearningRoadmapPage } from './components/LearningRoadmapPage';
import { GraduationCap, ArrowUpRight } from 'lucide-react';

const STORAGE_KEY = 'skillbridge_student_profile_v1';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('java-developer');

  // Initialize student from localStorage or default demo student
  const [student, setStudent] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load profile from localStorage', e);
    }
    // Default to first sample profile
    return SAMPLE_PROFILES[0].profile;
  });

  // Save to localStorage when student changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(student));
    } catch (e) {
      console.warn('Could not save profile to localStorage', e);
    }
  }, [student]);

  const selectedRole = CAREER_ROLES.find(r => r.id === selectedRoleId) || CAREER_ROLES[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Bar Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        student={student}
        setStudent={setStudent}
        selectedRoleTitle={selectedRole.title}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            setActivePage={setActivePage}
            student={student}
            setStudent={setStudent}
            onSelectRole={(roleId) => setSelectedRoleId(roleId)}
          />
        )}

        {activePage === 'assessment' && (
          <SkillAssessmentPage
            student={student}
            setStudent={setStudent}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'gap-analysis' && (
          <SkillGapAnalysisPage
            student={student}
            selectedRoleId={selectedRoleId}
            setSelectedRoleId={setSelectedRoleId}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'recommendations' && (
          <CareerRecommendationPage
            student={student}
            setSelectedRoleId={setSelectedRoleId}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'roadmap' && (
          <LearningRoadmapPage
            student={student}
            setStudent={setStudent}
            selectedRoleId={selectedRoleId}
            setSelectedRoleId={setSelectedRoleId}
            setActivePage={setActivePage}
          />
        )}
      </main>

      {/* Clean Footer (follows Anti-Slop Discipline) */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800">
              SkillBridge AI
            </span>
            <span>·</span>
            <span>College Student Skill Gap Analysis & Career Recommendation System</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActivePage('home')}
              className="hover:text-slate-900 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => setActivePage('assessment')}
              className="hover:text-slate-900 transition-colors"
            >
              Assessment
            </button>
            <button
              onClick={() => setActivePage('gap-analysis')}
              className="hover:text-slate-900 transition-colors"
            >
              Gap Matrix
            </button>
            <button
              onClick={() => setActivePage('recommendations')}
              className="hover:text-slate-900 transition-colors"
            >
              Role Matches
            </button>
            <button
              onClick={() => setActivePage('roadmap')}
              className="hover:text-slate-900 transition-colors"
            >
              Roadmaps
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
