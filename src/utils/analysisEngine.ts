import { 
  CareerRole, 
  StudentProfile, 
  SkillLevel, 
  SkillEvaluation, 
  CareerGapReport, 
  CareerRecommendationItem,
  SkillMatchStatus
} from '../types';
import { ALL_SKILLS } from '../data/skillsData';

export function levelToScore(level?: SkillLevel): number {
  switch (level) {
    case 'Beginner': return 1;
    case 'Intermediate': return 2;
    case 'Advanced': return 3;
    default: return 0;
  }
}

export function scoreToLevel(score: number): SkillLevel {
  if (score >= 3) return 'Advanced';
  if (score >= 2) return 'Intermediate';
  return 'Beginner';
}

/**
 * Evaluates a single career role against a student's skills
 */
export function analyzeCareerGap(role: CareerRole, student: StudentProfile): CareerGapReport {
  const matchingSkills: SkillEvaluation[] = [];
  const improvementSkills: SkillEvaluation[] = [];
  const missingSkills: SkillEvaluation[] = [];

  let totalPossibleWeightedScore = 0;
  let studentEarnedWeightedScore = 0;

  // Map student skills for fast lookup
  const studentSkillMap = new Map<string, SkillLevel>();
  for (const s of student.skills) {
  studentSkillMap.set(String(s.skillId ?? '').toLowerCase(), s.level);
  // also normalize name
  studentSkillMap.set(String(s.skillName ?? '').toLowerCase(), s.level);
}

  // Account for roadmap checkoffs
  const completedRoadmap = new Set(student.completedRoadmapSkills || []);

  const chartData: CareerGapReport['chartData'] = [];

  for (const req of role.requiredSkills) {
    const skillDef = ALL_SKILLS.find(
  s =>
    String(s.id ?? '').toLowerCase() === String(req.skillId ?? '').toLowerCase() ||
    String(s.name ?? '').toLowerCase() === String(req.skillName ?? '').toLowerCase()
);



const category = req.category || skillDef?.category || 'CS Fundamentals';
    let studentLevel =
  studentSkillMap.get(String(req.skillId ?? '').toLowerCase()) ||
  studentSkillMap.get(String(req.skillName ?? '').toLowerCase());

    // If marked completed in roadmap, elevate level
    if (!studentLevel && completedRoadmap.has(req.skillId)) {
      studentLevel = req.requiredLevel;
    }

    const studentScore = levelToScore(studentLevel);
    const requiredScore = levelToScore(req.requiredLevel);
    const weight = req.weight || 2;

    totalPossibleWeightedScore += (requiredScore * weight);

    let status: SkillMatchStatus = 'missing';
    let guidance = '';

    if (studentScore === 0) {
      status = 'missing';
      guidance = `Mandatory skill not yet acquired. Start with foundational tutorials and practical exercises.`;
      missingSkills.push({
        skillId: req.skillId,
        skillName: req.skillName,
        category,
        studentLevel: undefined,
        requiredLevel: req.requiredLevel,
        status,
        studentScore: 0,
        requiredScore,
        gapDelta: requiredScore,
        guidance,
      });
    } else if (studentScore >= requiredScore) {
      status = 'mastered';
      studentEarnedWeightedScore += (requiredScore * weight);
      guidance = `Meets or exceeds target competency (${studentLevel} vs ${req.requiredLevel} benchmark).`;
      matchingSkills.push({
        skillId: req.skillId,
        skillName: req.skillName,
        category,
        studentLevel,
        requiredLevel: req.requiredLevel,
        status,
        studentScore,
        requiredScore,
        gapDelta: 0,
        guidance,
      });
    } else {
      status = 'improvement_needed';
      // Partial credit for having beginner/intermediate level
      studentEarnedWeightedScore += (studentScore * weight);
      guidance = `Level is currently ${studentLevel}. Elevate to ${req.requiredLevel} through challenging real-world projects.`;
      improvementSkills.push({
        skillId: req.skillId,
        skillName: req.skillName,
        category,
        studentLevel,
        requiredLevel: req.requiredLevel,
        status,
        studentScore,
        requiredScore,
        gapDelta: requiredScore - studentScore,
        guidance,
      });
    }

    chartData.push({
      skill: req.skillName,
      studentValue: studentScore,
      requiredValue: requiredScore,
      status,
    });
  }

  const overallReadinessScore = totalPossibleWeightedScore > 0 
    ? Math.min(100, Math.round((studentEarnedWeightedScore / totalPossibleWeightedScore) * 100))
    : 0;

  const totalRequired = role.requiredSkills.length;
  const matchPercentage = totalRequired > 0
    ? Math.round(((matchingSkills.length + (improvementSkills.length * 0.65)) / totalRequired) * 100)
    : 0;

  let summary = '';
  if (overallReadinessScore >= 80) {
    summary = `Exceptional alignment! Student demonstrates high readiness (${overallReadinessScore}%) with ${matchingSkills.length} of ${totalRequired} competencies at industry benchmark.`;
  } else if (overallReadinessScore >= 55) {
    summary = `Solid foundation (${overallReadinessScore}% readiness). Focused work on ${missingSkills.length} missing skill(s) and upgrading ${improvementSkills.length} area(s) will position the student strongly for placement.`;
  } else {
    summary = `Emerging trajectory (${overallReadinessScore}% readiness). Recommended to follow the progressive multi-phase roadmap to build required competencies step-by-step.`;
  }

  return {
    role,
    overallReadinessScore,
    matchPercentage: Math.min(100, matchPercentage),
    matchingSkills,
    improvementSkills,
    missingSkills,
    summary,
    chartData,
  };
}

function calculatePersonalFitScore(
  role: CareerRole,
  student: StudentProfile
): number {
  const interests = student.interests || [];
  const preferences = student.careerPreferences || [];

  const interestMatches: Record<string, string[]> = {
    'Software Development': [
      'java-developer',
      'python-developer',
      'web-developer',
      'ai-ml-engineer',
    ],
    'Data & Analytics': [
      'data-analyst',
      'data-scientist',
      'business-analyst',
    ],
    'AI & Machine Learning': [
      'ai-ml-engineer',
      'data-scientist',
    ],
    'Cloud & DevOps': [
      'cloud-engineer',
      'devops-engineer',
    ],
    'Cybersecurity': [
      'cybersecurity-analyst',
    ],
    'Web Development': [
      'web-developer',
    ],
    'Business & Management': [
      'business-analyst',
    ],
  };

  const preferenceMatches: Record<string, string[]> = {
    'Building Applications': [
      'web-developer',
      'java-developer',
      'python-developer',
      'ai-ml-engineer',
    ],
    'Working with Data': [
      'data-analyst',
      'data-scientist',
      'business-analyst',
    ],
    'Solving Technical Problems': [
      'java-developer',
      'python-developer',
      'ai-ml-engineer',
      'cloud-engineer',
      'devops-engineer',
      'cybersecurity-analyst',
    ],
    'Designing Systems': [
      'java-developer',
      'cloud-engineer',
      'devops-engineer',
      'ai-ml-engineer',
    ],
    'Working in Cybersecurity': [
      'cybersecurity-analyst',
    ],
    'Business & Process Analysis': [
      'business-analyst',
    ],
    'Research & Innovation': [
      'ai-ml-engineer',
      'data-scientist',
    ],
  };

       const interestHits = interests.filter(i => roleMatches(role, interestMatches[i])).length;
     const prefHits = preferences.filter(p => roleMatches(role, preferenceMatches[p])).length;

     const interestFit = interests.length ? (interestHits / interests.length) * 100 : 0;
     const prefFit = preferences.length ? (prefHits / preferences.length) * 100 : 0;

     if (interests.length && preferences.length) {
       return Math.round(interestFit * 0.6 + prefFit * 0.4);
     }
     return Math.round(interestFit || prefFit);
   }
const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function roleMatches(role: CareerRole, list?: string[]): boolean {
  if (!list) return false;
  const title = (role as any).title ?? (role as any).name ?? '';
  const keys = [String(role.id).toLowerCase(), slugify(title)];
  return list.some(k => keys.includes(k));
}

// How many of the student's chosen skills this role actually uses
function skillRelevanceScore(role: CareerRole, student: StudentProfile): number {
  if (!student.skills.length) return 0;
  const reqKeys = new Set(
    role.requiredSkills.flatMap(r => [
      String(r.skillId).toLowerCase(),
      String(r.skillName).toLowerCase(),
    ])
  );
  const used = student.skills.filter(
    s => reqKeys.has(s.skillId.toLowerCase()) || reqKeys.has(s.skillName.toLowerCase())
  ).length;
  return Math.round((used / student.skills.length) * 100);
}



/**
 * Computes recommendations across all career roles and ranks them by match
 */
export function getCareerRecommendations(
  roles: CareerRole[], 
  student: StudentProfile
): CareerRecommendationItem[] {
  const recommendations: CareerRecommendationItem[] = roles.map(role => {
    const report = analyzeCareerGap(role, student);
const personalFitScore = calculatePersonalFitScore(role, student);

   const skillRelevance = skillRelevanceScore(role, student);

      const hasInterests =
     (student.interests?.length || 0) + (student.careerPreferences?.length || 0) > 0;

   const careerFitScore = Math.round(
     hasInterests
       ? report.overallReadinessScore * 0.50 +
         skillRelevance * 0.30 +
         personalFitScore * 0.20
       : report.overallReadinessScore * 0.60 +
         skillRelevance * 0.40
   );
const matchingSkillsList = report.matchingSkills.map(s => s.skillName);
    const missingSkillsList = report.missingSkills.map(s => s.skillName);
    const improvementSkillsList = report.improvementSkills.map(s => s.skillName);

    const topGaps = [...missingSkillsList, ...improvementSkillsList].slice(0, 3);

return {
  role,
  matchPercentage: report.matchPercentage,
  overallReadinessScore: report.overallReadinessScore,
  personalFitScore,
  careerFitScore,
  matchingSkillsCount: report.matchingSkills.length,
      matchingSkillsList,
      missingSkillsCount: report.missingSkills.length,
      missingSkillsList,
      improvementSkillsCount: report.improvementSkills.length,
      improvementSkillsList,
      topGaps,
      isTopMatch: false,
    };
  });

  // "Sort descending by career fit score", then match percentage
  recommendations.sort((a, b) => {
  const careerFitA = a.careerFitScore ?? 0;
  const careerFitB = b.careerFitScore ?? 0;

  if (careerFitB !== careerFitA) {
    return careerFitB - careerFitA;
  }

  if (b.personalFitScore !== a.personalFitScore) {
    return (b.personalFitScore ?? 0) - (a.personalFitScore ?? 0);
  }

  if (b.overallReadinessScore !== a.overallReadinessScore) {
    return b.overallReadinessScore - a.overallReadinessScore;
  }

  return b.matchPercentage - a.matchPercentage;
});
  if (recommendations.length > 0) {
    recommendations[0].isTopMatch = true;
  }

  return recommendations;
}
