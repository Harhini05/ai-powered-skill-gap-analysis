export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type SkillCategory =
  | 'Core Languages'
  | 'Web & Frontend'
  | 'Backend & Data'
  | 'CS Fundamentals'
  | 'AI & Machine Learning'
  | 'DevOps & Tools'
  | 'Employability Skills'
  | 'Soft Skills';

export interface SkillDefinition {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  iconName?: string;
  isPopular?: boolean;
}

export interface StudentSkill {
  skillId: string;
  skillName: string;
  level: SkillLevel;
  category: SkillCategory;
}

export interface StudentProfile {

  name: string;

  degree: string;

  collegeYear: string;

  skills: StudentSkill[];

  interests?: string[];

  careerPreferences?: string[];

  completedRoadmapSkills?: string[];

  confirmedCareerRoleId?: string;

}

export interface RoleSkillRequirement {
  skillId: string;
  skillName: string;
  category?: SkillCategory;
  requiredLevel: SkillLevel;
  weight: number; // 1 to 3
  whyImportant: string;
}

export interface CareerRole {

  id: string;

  title: string;

  category: string;

  description: string;

  requiredSkills: RoleSkillRequirement[];

  industryDemand: 'High' | 'Very High' | 'Critical';

  typicalSalaryRange: string;

  marketSkills?: string[];

  marketOutlook?: string;

  keyResponsibilities: string[];

  recommendedElectives: string[];

}

export type SkillMatchStatus = 'mastered' | 'improvement_needed' | 'missing';

export interface SkillEvaluation {
  skillId: string;
  skillName: string;
  category: SkillCategory;
  studentLevel?: SkillLevel;
  requiredLevel: SkillLevel;
  status: SkillMatchStatus;
  studentScore: number; // 0 to 3
  requiredScore: number; // 1 to 3
  gapDelta: number; // required - student
  guidance: string;
}

export interface CareerGapReport {
  role: CareerRole;
  overallReadinessScore: number; // 0 - 100
  matchPercentage: number; // percentage of skills touched or mastered
  matchingSkills: SkillEvaluation[];
  improvementSkills: SkillEvaluation[];
  missingSkills: SkillEvaluation[];
  summary: string;
  chartData: {
    skill: string;
    studentValue: number;
    requiredValue: number;
    status: SkillMatchStatus;
  }[];
}

export interface LearningResource {
  title: string;
  provider: string;
  type: 'Documentation' | 'Free Course' | 'Hands-on Lab' | 'Practice Track' | 'Book';
  duration: string;
}

export interface RoadmapMilestone {
  id: string;
  skillName: string;
  levelTarget: SkillLevel;
  importance: 'High' | 'Medium' | 'Essential';
  suggestedOrder: number;
  durationEstimate: string;
  keyTopics: string[];
  portfolioProject: {
    name: string;
    brief: string;
    outcome: string;
  };
  resources: LearningResource[];
}

export interface RoadmapPhase {
  phaseNumber: number;
  phaseTitle: string;
  levelBadge: SkillLevel;
  description: string;
  milestones: RoadmapMilestone[];
}

export interface CareerRecommendationItem {
  role: CareerRole;
  matchPercentage: number;
  overallReadinessScore: number;
  personalFitScore?: number;
  careerFitScore?: number;
  matchingSkillsCount: number;
  matchingSkillsList: string[];
  missingSkillsCount: number;
  missingSkillsList: string[];
  improvementSkillsCount: number;
  improvementSkillsList: string[];
  topGaps: string[];
  isTopMatch: boolean;
}

export type ActivePage = 'home' | 'assessment' | 'gap-analysis' | 'recommendations' | 'roadmap';
