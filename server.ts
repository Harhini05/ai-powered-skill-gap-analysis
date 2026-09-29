import hanaClient from '@sap/hana-client';
import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const createHanaConnection = () => hanaClient.createConnection();
app.get('/api/hana/test', (req, res) => {
    const hanaConnection = createHanaConnection();
  hanaConnection.connect({
    serverNode: `server${process.env.HANA_HOST}:${process.env.HANA_PORT}`,
    uid: process.env.HANA_USER,
    pwd: process.env.HANA_PASSWORD,
    encrypt: true
  }, (err) => {
    if (err) {
      console.error('HANA connection error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }

    hanaConnection.exec('SELECT CURRENT_USER FROM DUMMY', (err, result) => {
      hanaConnection.disconnect();

      if (err) {
        console.error('HANA query error:', err);
        return res.status(500).json({ success: false, error: err.message });
      }

      res.json({ success: true, result });
    });
  });
});
app.get('/api/hana/roles', (req, res) => {
  const hanaConnection = createHanaConnection();
  hanaConnection.connect({
    serverNode: `${process.env.HANA_HOST}:${process.env.HANA_PORT}`,
    uid: process.env.HANA_USER,
    pwd: process.env.HANA_PASSWORD,
    encrypt: true
  }, (err) => {
    if (err) {
      console.error('HANA connection error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }

    const query = `
      SELECT
       r.ROLE_ID,
  r.ROLE_NAME,
  r.DESCRIPTION,
  r.SALARY,
  r.INDUSTRY_DEMAND,
  crs.SKILL_ID,
        s.SKILL_NAME,
        s.CATEGORY,
        crs.REQUIRED_LEVEL,
        crs.WEIGHT,
        s.DESCRIPTION AS SKILL_DESCRIPTION
      FROM CAREER_ROLES r
      LEFT JOIN CAREER_REQUIRED_SKILLS crs
        ON r.ROLE_ID = crs.ROLE_ID
      LEFT JOIN SKILLS s
        ON crs.SKILL_ID = s.SKILL_ID
      ORDER BY r.ROLE_NAME, crs.SKILL_ID
    `;

    hanaConnection.exec(query, (err, result) => {
      hanaConnection.disconnect();

      if (err) {
        console.error('HANA query error:', err);
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      const roleMap: any = {};

      (result as any[]).forEach((row: any) => {
        const roleId = row.ROLE_ID;

        if (!roleMap[roleId]) {
  roleMap[roleId] = {
    id: row.ROLE_ID,
    title: row.ROLE_NAME,
    description: row.DESCRIPTION,
    salary: row.SALARY,
    industryDemand: row.INDUSTRY_DEMAND,
    requiredSkills: []
  };
}

        if (row.SKILL_ID) {
          roleMap[roleId].requiredSkills.push({
  skillId: row.SKILL_ID,
  skillName: row.SKILL_NAME,
  category: row.CATEGORY,
  requiredLevel: row.REQUIRED_LEVEL,
  weight: row.WEIGHT,
  whyImportant: row.SKILL_DESCRIPTION
});
        }
      });

      res.json({
        success: true,
        roles: Object.values(roleMap)
      });
    });
  });
});
app.get('/api/hana/skills', (req, res) => {
   const hanaConnection = createHanaConnection();
  hanaConnection.connect({
    serverNode: `${process.env.HANA_HOST}:${process.env.HANA_PORT}`,
    uid: process.env.HANA_USER,
    pwd: process.env.HANA_PASSWORD,
    encrypt: true
  }, (err) => {
    if (err) {
      console.error('HANA connection error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }

    hanaConnection.exec(
      'SELECT * FROM SKILLS ORDER BY SKILL_NAME',
      (err, result) => {
        hanaConnection.disconnect();

        if (err) {
          console.error('HANA query error:', err);
          return res.status(500).json({ success: false, error: err.message });
        }

        res.json({ success: true, skills: result });
      }
    );
  });
});
app.get('/api/hana/roadmap', (req, res) => {
  const hanaConnection = createHanaConnection();
  hanaConnection.connect({
    serverNode: `${process.env.HANA_HOST}:${process.env.HANA_PORT}`,
    uid: process.env.HANA_USER,
    pwd: process.env.HANA_PASSWORD,
    encrypt: true
  }, (err) => {
    if (err) {
      console.error('HANA connection error:', err);
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }

    const query = `
      SELECT
        ROADMAP_ID,
        ROLE_ID,
        PHASE_NUMBER,
        PHASE_TITLE,
        LEVEL,
        DESCRIPTION,
        DURATION,
        PORTFOLIO_PROJECT
      FROM ROADMAP
      ORDER BY ROLE_ID, PHASE_NUMBER
    `;

    hanaConnection.exec(query, (err, result) => {
      hanaConnection.disconnect();

      if (err) {
        console.error('HANA query error:', err);
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      res.json({
        success: true,
        roadmap: result
      });
    });
  });
});
app.get('/api/hana/courses', (req, res) => {
  const hanaConnection = createHanaConnection();

  hanaConnection.connect({
    serverNode: `${process.env.HANA_HOST}:${process.env.HANA_PORT}`,
    uid: process.env.HANA_USER,
    pwd: process.env.HANA_PASSWORD,
    encrypt: true
  }, (err) => {
    if (err) {
      console.error('HANA connection error:', err);
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }

    const query = `
      SELECT
        COURSE_ID,
        COURSE_NAME,
        PROVIDER,
        COURSE_URL,
        ROLE_ID,
        SKILL_ID,
        LEVEL,
        DESCRIPTION,
        MIN_YEAR,
        MAX_YEAR
      FROM COURSES
      ORDER BY ROLE_ID, MIN_YEAR, COURSE_NAME
    `;

    hanaConnection.exec(query, (err, result) => {
      hanaConnection.disconnect();

      if (err) {
        console.error('HANA query error:', err);
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      res.json({
        success: true,
        courses: result
      });
    });
  });
});
app.get('/api/hana/certifications', (req, res) => {
  const hanaConnection = createHanaConnection();

  hanaConnection.connect({
    serverNode: `${process.env.HANA_HOST}:${process.env.HANA_PORT}`,
    uid: process.env.HANA_USER,
    pwd: process.env.HANA_PASSWORD,
    encrypt: true
  }, (err) => {
    if (err) {
      console.error('HANA connection error:', err);
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }

    const query = `
      SELECT
        CERTIFICATION_ID,
        CERTIFICATION_NAME,
        PROVIDER,
        CERTIFICATION_URL,
        ROLE_ID,
        SKILL_ID,
        LEVEL,
        DESCRIPTION,
        MIN_YEAR,
        MAX_YEAR
      FROM CERTIFICATIONS
      ORDER BY ROLE_ID, MIN_YEAR, CERTIFICATION_NAME
    `;

    hanaConnection.exec(query, (err, result) => {
      hanaConnection.disconnect();

      if (err) {
        console.error('HANA query error:', err);
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      res.json({
        success: true,
        certifications: result
      });
    });
  });
});

const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

const MODEL_CHAIN = (
  process.env.GEMINI_MODELS ||
  'gemini-3.8-flash,gemini-3.7-flash,gemini-3.5-flash,gemini-flash-latest,gemini-3.1-flash-lite,gemini-2.5-flash-lite'
).split(',').map(m => m.trim());

async function generateWithRetry(contents: string) {
  if (!aiClient) throw new Error('No AI client');
  let lastErr: any;
  for (const model of MODEL_CHAIN) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await aiClient.models.generateContent({
          model,
          contents,
          config: { responseMimeType: 'application/json' },
        });
      } catch (err: any) {
        lastErr = err;
        if (err?.status === 404) break; // model not available, try next
        if (err?.status !== 503 && err?.status !== 429) throw err;
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }
  throw lastErr;
}

// AI Diagnostic & Placement Advisory Endpoint
app.post('/api/ai/diagnostic', async (req: Request, res: Response) => {
  try {
    const { studentName, degree, targetRole, matchingSkills, improvementSkills, missingSkills, readinessScore } = req.body;

    // Deterministic fallback generator in case API key is absent or API fails
    const fallbackResponse = {
      executiveSummary: `${studentName || 'The student'} (${degree || 'Computer Science'}) shows a promising ${readinessScore || 65}% readiness for the ${targetRole || 'Software Engineering'} career path. With ${matchingSkills?.length || 0} core competencies already in place, targeted focus on ${missingSkills?.[0]?.name || 'key frameworks'} will yield the fastest placement dividend.`,
      criticalPivots: [
        `Bridge the gap in ${missingSkills?.[0]?.name || 'system architecture'} through hands-on project implementations.`,
        improvementSkills?.length > 0 
          ? `Elevate ${improvementSkills[0].name} from ${improvementSkills[0].studentLevel} to ${improvementSkills[0].requiredLevel} with depth in concurrency and design patterns.`
          : 'Consolidate foundational algorithmic problem solving for technical interviews.',
        'Build and document 2 end-to-end portfolio projects with production deployment and GitHub README documentation.',
      ],
      hackathonProjectIdea: {
        title: `Production ${targetRole} Capstone with Cloud Deployment`,
        description: `Build a full-cycle application leveraging ${matchingSkills?.slice(0, 2).map((s: any) => s.name).join(' & ') || 'core technologies'} while directly implementing missing skills: ${missingSkills?.slice(0, 2).map((s: any) => s.name).join(', ') || 'modern industry standards'}.`,
        deliverables: ['Modular microservice or clean monolith architecture', 'Unit and integration test suite with CI/CD action', 'Live demo deployment with interactive UI'],
      },
      interviewPrepQuestions: [
        `How do you handle performance bottlenecks and state management when scaling a ${targetRole} system?`,
        `Describe a challenging bug you diagnosed using your knowledge of ${matchingSkills?.[0]?.name || 'Data Structures'} and how you resolved it.`,
        `Given the modern requirements of ${missingSkills?.[0]?.name || 'cloud engineering'}, how would you architect fault tolerance?`,
      ],
      placementTimeline: 'Suggested 8-12 week sprint to achieve industry placement readiness.'
    };

    if (!aiClient) {
      return res.json({ success: true, isAI: false, data: fallbackResponse });
    }

    const prompt = `You are a Senior Technical Career Architect and University Placement Dean.
Analyze this college student's profile for the target career role:
- Student Name: ${studentName || 'Student'}
- Degree: ${degree || 'Computer Science / Engineering'}
- Target Career Role: ${targetRole}
- Overall Readiness: ${readinessScore}%
- Currently Mastered/Matching Skills: ${JSON.stringify(matchingSkills || [])}
- Skills Needing Improvement (Below Target Level): ${JSON.stringify(improvementSkills || [])}
- Missing Skills (Not Yet Learned): ${JSON.stringify(missingSkills || [])}

Provide high-impact, actionable, academic & placement advisory.
Rules:
- Base recommendations on the Missing and Improvement lists above.
- Do not make claims about soft skills, degree type, or urgency that the data does not support.
- Keep the project to the target role's own skills; do not invent extra technologies.
Return your response ONLY as valid JSON matching this schema:
{
  "executiveSummary": "Concise 2-3 sentence strategic analysis of their placement potential.",
  "criticalPivots": ["Actionable step 1", "Actionable step 2", "Actionable step 3"],
  "hackathonProjectIdea": {
    "title": "Compelling resume-worthy project title",
    "description": "2 sentence overview integrating their current strengths and closing key skill gaps.",
    "deliverables": ["Deliverable 1", "Deliverable 2", "Deliverable 3"]
  },
  "interviewPrepQuestions": [
    "Technical question 1 focused on their gap areas",
    "Technical question 2 focused on their gap areas",
    "Technical question 3 focused on their gap areas"
  ],
  "placementTimeline": "E.g., 6-8 weeks intensive roadmap"
}`;

    const response = await generateWithRetry(prompt);

    const text = response.text;
    if (text) {
      try {
        const parsed = JSON.parse(text);
        return res.json({ success: true, isAI: true, data: parsed });
      } catch (parseError) {
        console.error('Failed to parse AI response, using fallback', parseError);
        return res.json({ success: true, isAI: false, data: fallbackResponse });
      }
    }

    return res.json({ success: true, isAI: false, data: fallbackResponse });
  } catch (error: any) {
    console.error('Error generating AI diagnostic:', error);
    // Return graceful fallback rather than 500 so UI continues smoothly
    return res.json({
      success: true,
      isAI: false,
      data: {
        executiveSummary: `Student profile analyzed for the ${req.body?.targetRole || 'Target'} role with an algorithmic readiness of ${req.body?.readinessScore || 70}%.`,
        criticalPivots: [
  req.body?.missingSkills?.length > 0
    ? `Learn ${req.body.missingSkills[0].skillName} from the fundamentals and complete practical exercises.`
    : req.body?.improvementSkills?.length > 0
    ? `Upgrade ${req.body.improvementSkills[0].skillName} from ${req.body.improvementSkills[0].studentLevel} to ${req.body.improvementSkills[0].requiredLevel}.`
    : `Strengthen your ${req.body?.targetRole || 'target role'} skills through advanced projects.`,

  req.body?.improvementSkills?.length > 0
    ? `Improve ${req.body.improvementSkills.map((s: any) => s.skillName).slice(0, 2).join(' and ')} through hands-on projects.`
    : `Build a portfolio project demonstrating your ${req.body?.targetRole || 'target role'} competencies.`,

  `Complete the ${req.body?.targetRole || 'target role'} learning roadmap and build a portfolio project aligned with the required skills.`
],
        hackathonProjectIdea: {
          title: 'Campus Tech Ecosystem Capstone',
          description: 'A responsive full-stack platform built with modern architectures solving real university student workflows.',
          deliverables: ['Clean separation of concerns', 'RESTful / type-safe APIs', 'Responsive interactive user experience']
        },
        interviewPrepQuestions: [
          'Explain the time complexity and memory overhead of your primary collection types.',
          'How do you design database indices for high-frequency queries?',
          'Walk through an end-to-end request lifecycle in your preferred framework.'
        ],
        placementTimeline: '8-10 week milestone plan for placement drives.'
      }
    });
  }
});

// AI Career Roadmap Customizer Endpoint
app.post('/api/ai/roadmap-customizer', async (req: Request, res: Response) => {
  
  try {
    const { targetRole, currentSkills, gapSkills, weeksAvailable } = req.body;
    const role = (targetRole || '').toLowerCase();
    const fallbackMilestones = [
      {
        weekRange: 'Weeks 1 - 3',
        phaseName: 'Foundation & Core Language Mastery',
        focusSkills:
  role.includes('java')
    ? ['Java', 'OOP']
    : role.includes('python')
    ? ['Python', 'OOP']
    : role.includes('web')
    ? ['HTML', 'CSS']
    : role.includes('ai/ml')
    ? ['Python', 'Data Structures']
    : role.includes('data analyst')
    ? ['SQL', 'Python']
    : gapSkills?.slice(0, 2) || ['Core Syntax', 'OOP'],
        objectives: ['Master syntax quirks, memory model, and typing rules', 'Solve 25 targeted algorithmic practice problems'],
        portfolioCheckpoint:
  role.includes('java')
    ? 'Java Student Management System'
    : role.includes('python')
    ? 'Python Student Management System'
    : role.includes('web')
    ? 'Responsive Portfolio Website'
    : role.includes('ai/ml')
    ? 'Machine Learning Prediction Project'
    : role.includes('data analyst')
    ? 'Student Performance Data Analysis'
    : 'CLI utility with unit tests',
      },
      {
        weekRange: 'Weeks 4 - 6',
        phaseName: 'Frameworks & Systems Design',
        focusSkills:
  role.includes('java')
    ? ['Java', 'SQL']
    : role.includes('python')
    ? ['Python', 'SQL']
    : role.includes('web')
    ? ['JavaScript', 'SQL']
    : role.includes('ai/ml')
    ? ['Machine Learning', 'SQL']
    : role.includes('data analyst')
    ? ['SQL', 'Data Analysis']
    : gapSkills?.slice(2, 4) || ['Backend Development', 'Database Persistence'],
        objectives: ['Implement RESTful architectural patterns with relational modeling', 'Manage state lifecycle and asynchronous events'],
        portfolioCheckpoint:
  role.includes('java')
    ? 'Java Spring Boot Backend Application'
    : role.includes('python')
    ? 'Python REST API with Database'
    : role.includes('web')
    ? 'Interactive JavaScript Web Application'
    : role.includes('ai/ml')
    ? 'End-to-End Machine Learning Application'
    : role.includes('data analyst')
    ? 'Business Sales Analytics Dashboard'
    : 'Full-stack CRUD application with authentication',
      },
      {
        weekRange: 'Weeks 7 - 10',
        phaseName: 'Enterprise Practices & Portfolio Capstone',
        focusSkills:
  role.includes('java')
    ? ['Spring Boot', 'Testing']
    : role.includes('python')
    ? ['REST APIs', 'Testing']
    : role.includes('web')
    ? ['Full Stack Development', 'Deployment']
    : role.includes('ai/ml')
    ? ['Model Deployment', 'AI Applications']
    : role.includes('data analyst')
    ? ['Data Visualization', 'Advanced Analytics']
    : gapSkills?.slice(4, 6) || ['Testing', 'Deployment & CI/CD'],
        objectives: ['Automated test coverage > 80%', 'Deploy live to cloud with health check endpoints'],
        portfolioCheckpoint:
  role.includes('java')
    ? 'Full Stack Java Career Preparation Project'
    : role.includes('python')
    ? 'Full Stack Python Web Application'
    : role.includes('web')
    ? 'Full Stack E-Commerce Application'
    : role.includes('ai/ml')
    ? 'AI-Powered Prediction and Recommendation System'
    : role.includes('data analyst')
    ? 'End-to-End Workforce Analytics Dashboard'
    : 'Production deployed capstone with detailed README and architecture diagram',
      },
    ];

    if (!aiClient) {
      return res.json({ success: true, isAI: false, milestones: fallbackMilestones });
    }

    const prompt = `You are a University Curriculum Director. Design a high-yield study schedule for a college student aiming for ${targetRole}.
Target Role: ${targetRole}
Current Skills: ${JSON.stringify(currentSkills || [])}
Gap/Missing Skills to conquer: ${JSON.stringify(gapSkills || [])}
Available Timeline: ${weeksAvailable || 10} weeks.

Return ONLY a JSON array of 3-4 structured milestone phases matching:
[
  {
    "weekRange": "Weeks 1 - 2",
    "phaseName": "Phase Title",
    "focusSkills": ["Skill 1", "Skill 2"],
    "objectives": ["Concrete objective 1", "Concrete objective 2"],
    "portfolioCheckpoint": "Specific deliverable to prove mastery"
  }
]`;

    const response = await generateWithRetry(prompt);

    const text = response.text;
    if (text) {
      try {
        const parsed = JSON.parse(text);
        return res.json({ success: true, isAI: true, milestones: parsed });
      } catch (e) {
        return res.json({ success: true, isAI: false, milestones: fallbackMilestones });
      }
    }

    return res.json({ success: true, isAI: false, milestones: fallbackMilestones });
    } catch (error) {
  console.warn('Gemini unavailable:', error);
    return res.json({
      success: true,
      isAI: false,
      milestones: [
  {
    weekRange: 'Weeks 1 - 3',
    phaseName: 'Foundation & Core Language Mastery',
    focusSkills:
      (req.body?.targetRole || '').toLowerCase().includes('java')
        ? ['Java', 'OOP']
        : (req.body?.targetRole || '').toLowerCase().includes('python')
        ? ['Python', 'OOP']
        : (req.body?.targetRole || '').toLowerCase().includes('web')
        ? ['HTML', 'CSS']
        : (req.body?.targetRole || '').toLowerCase().includes('ai/ml')
        ? ['Python', 'Data Structures']
        : (req.body?.targetRole || '').toLowerCase().includes('data analyst')
        ? ['SQL', 'Python']
        : ['Core Syntax', 'OOP'],
    objectives: [
      'Strengthen the core skills required for the selected career role',
      'Complete targeted practical exercises'
    ],
    portfolioCheckpoint:
      (req.body?.targetRole || '').toLowerCase().includes('java')
        ? 'Java Student Management System'
        : (req.body?.targetRole || '').toLowerCase().includes('python')
        ? 'Python Student Management System'
        : (req.body?.targetRole || '').toLowerCase().includes('web')
        ? 'Responsive Portfolio Website'
        : (req.body?.targetRole || '').toLowerCase().includes('ai/ml')
        ? 'Machine Learning Prediction Project'
        : (req.body?.targetRole || '').toLowerCase().includes('data analyst')
        ? 'Student Performance Data Analysis'
        : 'CLI utility with unit tests',
  },
  {
    weekRange: 'Weeks 4 - 6',
    phaseName: 'Frameworks & Systems Design',
    focusSkills:
      (req.body?.targetRole || '').toLowerCase().includes('java')
        ? ['Java', 'SQL']
        : (req.body?.targetRole || '').toLowerCase().includes('python')
        ? ['Python', 'SQL']
        : (req.body?.targetRole || '').toLowerCase().includes('web')
        ? ['JavaScript', 'SQL']
        : (req.body?.targetRole || '').toLowerCase().includes('ai/ml')
        ? ['Machine Learning', 'SQL']
        : (req.body?.targetRole || '').toLowerCase().includes('data analyst')
        ? ['SQL', 'Data Analysis']
        : ['Backend Development', 'Database Persistence'],
    objectives: [
      'Build practical applications using role-specific technologies',
      'Connect applications with databases or data workflows'
    ],
    portfolioCheckpoint:
      (req.body?.targetRole || '').toLowerCase().includes('java')
        ? 'Java Spring Boot Backend Application'
        : (req.body?.targetRole || '').toLowerCase().includes('python')
        ? 'Python REST API with Database'
        : (req.body?.targetRole || '').toLowerCase().includes('web')
        ? 'Interactive JavaScript Web Application'
        : (req.body?.targetRole || '').toLowerCase().includes('ai/ml')
        ? 'End-to-End Machine Learning Application'
        : (req.body?.targetRole || '').toLowerCase().includes('data analyst')
        ? 'Business Sales Analytics Dashboard'
        : 'Full-stack CRUD application',
  },
  {
    weekRange: 'Weeks 7 - 10',
    phaseName: 'Enterprise Practices & Portfolio Capstone',
    focusSkills:
      (req.body?.targetRole || '').toLowerCase().includes('java')
        ? ['Spring Boot', 'Testing']
        : (req.body?.targetRole || '').toLowerCase().includes('python')
        ? ['REST APIs', 'Testing']
        : (req.body?.targetRole || '').toLowerCase().includes('web')
        ? ['Full Stack Development', 'Deployment']
        : (req.body?.targetRole || '').toLowerCase().includes('ai/ml')
        ? ['Model Deployment', 'AI Applications']
        : (req.body?.targetRole || '').toLowerCase().includes('data analyst')
        ? ['Data Visualization', 'Advanced Analytics']
        : ['Testing', 'Deployment & CI/CD'],
    objectives: [
      'Complete and polish the final portfolio project',
      'Prepare the project for demonstration and placement interviews'
    ],
    portfolioCheckpoint:
      (req.body?.targetRole || '').toLowerCase().includes('java')
        ? 'Full Stack Java Career Preparation Project'
        : (req.body?.targetRole || '').toLowerCase().includes('python')
        ? 'Full Stack Python Web Application'
        : (req.body?.targetRole || '').toLowerCase().includes('web')
        ? 'Full Stack E-Commerce Application'
        : (req.body?.targetRole || '').toLowerCase().includes('ai/ml')
        ? 'AI-Powered Prediction and Recommendation System'
        : (req.body?.targetRole || '').toLowerCase().includes('data analyst')
        ? 'End-to-End Workforce Analytics Dashboard'
        : 'Production-ready capstone project',
  }
]
    });
  }
});

// Setup Vite middleware in dev or static server in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer();
