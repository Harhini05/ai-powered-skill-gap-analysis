import { RoadmapPhase } from '../types';

export const ROLE_ROADMAPS: Record<string, RoadmapPhase[]> = {
  'java-developer': [
    {
      phaseNumber: 1,
      phaseTitle: 'Phase 1: Java Foundations & Object-Oriented Principles',
      levelBadge: 'Beginner',
      description: 'Master core Java language syntax, data types, control flow, and pure object-oriented system design principles.',
      milestones: [
        {
          id: 'java-core',
          skillName: 'Java Language Core',
          levelTarget: 'Beginner',
          importance: 'Essential',
          suggestedOrder: 1,
          durationEstimate: '2-3 Weeks',
          keyTopics: ['JVM, JRE & JDK architecture', 'Java 17/21 features: records, pattern matching', 'Exception handling & memory management'],
          portfolioProject: {
            name: 'Student Record Management System (CLI)',
            brief: 'Build an interactive console tool managing enrolled courses, grades, and GPA calculations using clean OOP abstractions.',
            outcome: 'Proves firm grasp of classes, inheritance, polymorphism, and Java Collections framework.',
          },
          resources: [
            { title: 'Oracle Java Documentation & Tutorials', provider: 'Oracle', type: 'Documentation', duration: 'Self-paced' },
            { title: 'Java Programming Masterclass', provider: 'freeCodeCamp', type: 'Free Course', duration: '10 Hours' },
          ],
        },
        {
          id: 'oop-design',
          skillName: 'OOP & SOLID Principles',
          levelTarget: 'Intermediate',
          importance: 'Essential',
          suggestedOrder: 2,
          durationEstimate: '2 Weeks',
          keyTopics: ['Encapsulation & Interfaces', 'SOLID architectural design principles', 'Creational & Structural Design Patterns (Factory, Singleton, Strategy)'],
          portfolioProject: {
            name: 'Object-Oriented Payment Processing Gateway Engine',
            brief: 'Simulate credit card, PayPal, and crypto transactions using strategy pattern and loose coupling.',
            outcome: 'Demonstrates clean code architecture and extensible class hierarchies for technical interviews.',
          },
          resources: [
            { title: 'Refactoring Guru: Design Patterns in Java', provider: 'RefactoringGuru', type: 'Documentation', duration: '6 Hours' },
          ],
        },
        {
          id: 'dsa-java',
          skillName: 'Data Structures & Algorithms',
          levelTarget: 'Intermediate',
          importance: 'High',
          suggestedOrder: 3,
          durationEstimate: '3-4 Weeks',
          keyTopics: ['ArrayList, LinkedList, HashMap internals', 'Trees, Binary Search, Graph traversal (BFS/DFS)', 'Time & Space complexity (Big-O)'],
          portfolioProject: {
            name: 'Campus Route Pathfinder Algorithm',
            brief: 'Implement Dijkstra and A* pathfinding to calculate optimal walking routes between campus university buildings.',
            outcome: 'Demonstrates mastery of graphs, priority queues, and algorithmic efficiency.',
          },
          resources: [
            { title: 'Java Algorithms Track', provider: 'LeetCode / HackerRank', type: 'Practice Track', duration: 'Daily practice' },
          ],
        },
      ],
    },
    {
      phaseNumber: 2,
      phaseTitle: 'Phase 2: Database Persistence & Backend Services',
      levelBadge: 'Intermediate',
      description: 'Connect enterprise Java applications to relational database backends with SQL schemas, JPA, and transaction isolation.',
      milestones: [
        {
          id: 'sql-relational',
          skillName: 'SQL & Database Architecture',
          levelTarget: 'Intermediate',
          importance: 'Essential',
          suggestedOrder: 4,
          durationEstimate: '2-3 Weeks',
          keyTopics: ['PostgreSQL / MySQL normalization (3NF)', 'Complex JOINs, indexes, triggers, and query plans', 'ACID transactions & foreign key integrity'],
          portfolioProject: {
            name: 'University Placement Portal Database Schema',
            brief: 'Model students, corporate recruiters, job postings, and interview rounds with indexed relationships and analytics queries.',
            outcome: 'Demonstrates production-ready database schema design and analytical SQL optimization.',
          },
          resources: [
            { title: 'SQL Zoo Interactive Tutorials', provider: 'SQLZoo', type: 'Practice Track', duration: '8 Hours' },
            { title: 'PostgreSQL Tutorial for Developers', provider: 'PostgreSQL.org', type: 'Documentation', duration: 'Self-paced' },
          ],
        },
        {
          id: 'spring-boot-core',
          skillName: 'Spring Boot & RESTful APIs',
          levelTarget: 'Intermediate',
          importance: 'Essential',
          suggestedOrder: 5,
          durationEstimate: '3-4 Weeks',
          keyTopics: ['Dependency Injection & Spring IoC', 'Spring Data JPA & Hibernate entity mappings', 'Spring Web REST controllers & validation', 'Spring Security with JWT'],
          portfolioProject: {
            name: 'Campus Event Ticketing Microservice',
            brief: 'Construct a complete REST API with role-based auth (Admin, Student), ticket reserving, and database persistence.',
            outcome: 'Industry-standard enterprise project ready for your technical resume.',
          },
          resources: [
            { title: 'Spring Boot Official Quickstart Guides', provider: 'Spring.io', type: 'Documentation', duration: 'Self-paced' },
            { title: 'Spring Boot 3 Full Course', provider: 'Amigoscode / YouTube', type: 'Free Course', duration: '8 Hours' },
          ],
        },
        {
          id: 'git-collab',
          skillName: 'Git & Team Workflow',
          levelTarget: 'Intermediate',
          importance: 'Medium',
          suggestedOrder: 6,
          durationEstimate: '1 Week',
          keyTopics: ['Feature branching, rebasing, and merge conflicts', 'GitHub Actions CI/CD automated build workflows', 'Pull request code reviews'],
          portfolioProject: {
            name: 'Automated CI/CD Pipeline for Maven/Gradle',
            brief: 'Configure GitHub Actions workflow to run JUnit 5 tests, static code analysis, and package JARs on every pull request.',
            outcome: 'Shows engineering rigor and readiness for professional agile teams.',
          },
          resources: [
            { title: 'Pro Git Book (Free Edition)', provider: 'Git-SCM', type: 'Documentation', duration: 'Self-paced' },
          ],
        },
      ],
    },
    {
      phaseNumber: 3,
      phaseTitle: 'Phase 3: Production Polish, Concurrency & Placement Drills',
      levelBadge: 'Advanced',
      description: 'Elevate your Java expertise to Advanced level with multithreading, Docker containerization, and technical interview mastery.',
      milestones: [
        {
          id: 'java-advanced-concurrency',
          skillName: 'Advanced Java Concurrency & Microservices',
          levelTarget: 'Advanced',
          importance: 'Essential',
          suggestedOrder: 7,
          durationEstimate: '3-4 Weeks',
          keyTopics: ['Java Virtual Threads (Project Loom)', 'ExecutorService, CompletableFuture, and synchronization', 'Dockerizing Spring Boot applications and deploying to cloud'],
          portfolioProject: {
            name: 'High-Concurrency Order Processing Service',
            brief: 'Simulate high-volume checkout queue using thread pools, optimistic locking, and Dockerized deployment.',
            outcome: 'Proves ability to engineer scalable backend systems under load.',
          },
          resources: [
            { title: 'Java Concurrency in Practice (Guides)', provider: 'Baeldung', type: 'Documentation', duration: '12 Hours' },
          ],
        },
        {
          id: 'placement-interview-prep',
          skillName: 'Enterprise Placement Interview Drills',
          levelTarget: 'Advanced',
          importance: 'Essential',
          suggestedOrder: 8,
          durationEstimate: '2 Weeks',
          keyTopics: ['System Design for campus hires', 'Top 50 Java Spring interview challenges', 'Live mock coding and resume refinement'],
          portfolioProject: {
            name: 'Complete Portfolio Repository with Live Cloud Link',
            brief: 'Deploy your Spring Boot service live with Swagger OpenAPI docs and clear architecture diagrams.',
            outcome: 'Directly shareable link with recruiters during campus recruitment drives.',
          },
          resources: [
            { title: 'Java Microservices Interview Cheat Sheet', provider: 'Dev.to / GitHub', type: 'Practice Track', duration: '10 Hours' },
          ],
        },
      ],
    },
  ],

  'web-developer': [
    {
      phaseNumber: 1,
      phaseTitle: 'Phase 1: Modern Web Standards & JavaScript Core',
      levelBadge: 'Beginner',
      description: 'Master semantic accessible HTML5, responsive CSS3 architectures, and modern ES6+ asynchronous JavaScript.',
      milestones: [
        {
          id: 'html-css-mastery',
          skillName: 'Semantic HTML & Modern CSS',
          levelTarget: 'Intermediate',
          importance: 'Essential',
          suggestedOrder: 1,
          durationEstimate: '2 Weeks',
          keyTopics: ['Accessible DOM tree & WCAG compliance', 'Flexbox & CSS Grid layouts', 'Responsive design without layout shifts', 'Tailwind CSS utility styling'],
          portfolioProject: {
            name: 'Accessible University Club Portal',
            brief: 'Build a multi-page responsive web hub with keyboard navigation, dark mode, and pristine typography.',
            outcome: 'Demonstrates deep visual engineering standards and zero-clutter layout discipline.',
          },
          resources: [
            { title: 'MDN Web Docs: HTML & CSS Complete Guides', provider: 'Mozilla MDN', type: 'Documentation', duration: 'Self-paced' },
          ],
        },
        {
          id: 'js-deep-dive',
          skillName: 'JavaScript (ES6+ & Async)',
          levelTarget: 'Advanced',
          importance: 'Essential',
          suggestedOrder: 2,
          durationEstimate: '3-4 Weeks',
          keyTopics: ['Closures, Scope, Hoisting & Prototype chain', 'Event Loop, Promises & async/await', 'DOM manipulation & fetch API', 'Modules and modern build tooling'],
          portfolioProject: {
            name: 'Interactive Real-Time Task Kanban Board',
            brief: 'Build a drag-and-drop task workflow engine with local storage persistence and undo/redo history using vanilla JS.',
            outcome: 'Proves genuine JS mastery without relying as a crutch on frontend frameworks.',
          },
          resources: [
            { title: 'JavaScript.info Complete Guide', provider: 'JavaScript.info', type: 'Documentation', duration: 'Self-paced' },
          ],
        },
      ],
    },
    {
      phaseNumber: 2,
      phaseTitle: 'Phase 2: Modern React Architecture & State Management',
      levelBadge: 'Intermediate',
      description: 'Build production single-page applications with reusable component hierarchies, custom hooks, and API integration.',
      milestones: [
        {
          id: 'react-ecosystem',
          skillName: 'React Component Architecture',
          levelTarget: 'Intermediate',
          importance: 'Essential',
          suggestedOrder: 3,
          durationEstimate: '3-4 Weeks',
          keyTopics: ['useState, useEffect, useMemo, useCallback & useRef', 'Custom hook extraction and state lifting', 'Context API & client state caching', 'React Router client-side routing'],
          portfolioProject: {
            name: 'Student Course & Internship Marketplace',
            brief: 'Interactive SPA featuring search filters, bookmarked roles, multi-step application modal, and live state updates.',
            outcome: 'Strong showcase piece proving modern React component design and clean architecture.',
          },
          resources: [
            { title: 'Official React Documentation (react.dev)', provider: 'React Team', type: 'Documentation', duration: 'Self-paced' },
          ],
        },
        {
          id: 'rest-api-client',
          skillName: 'REST APIs & Asynchronous Data Fetching',
          levelTarget: 'Intermediate',
          importance: 'Essential',
          suggestedOrder: 4,
          durationEstimate: '2 Weeks',
          keyTopics: ['Consuming REST endpoints with error/loading states', 'Pagination, debouncing & search throttling', 'Authentication headers & JWT token handling'],
          portfolioProject: {
            name: 'Live Campus Weather & Transit Tracker',
            brief: 'Consume public transit and weather APIs, rendering interactive live schedules and status badges.',
            outcome: 'Proves ability to integrate external third-party services and handle network states gracefully.',
          },
          resources: [
            { title: 'Async JavaScript & Fetch API Masterclass', provider: 'freeCodeCamp', type: 'Free Course', duration: '5 Hours' },
          ],
        },
      ],
    },
    {
      phaseNumber: 3,
      phaseTitle: 'Phase 3: Production Optimization & Placement Portfolio',
      levelBadge: 'Advanced',
      description: 'Optimize Core Web Vitals, implement automated testing, and assemble a standout portfolio for web engineering interviews.',
      milestones: [
        {
          id: 'web-performance-testing',
          skillName: 'Testing & Web Performance Optimization',
          levelTarget: 'Advanced',
          importance: 'High',
          suggestedOrder: 5,
          durationEstimate: '2 Weeks',
          keyTopics: ['Unit testing with Vitest & React Testing Library', 'Lighthouse audits: LCP, CLS, FID optimization', 'Code splitting, dynamic imports & memoization'],
          portfolioProject: {
            name: 'Tested & High-Performance SaaS Landing Experience',
            brief: 'Build a 98+ Lighthouse score application with comprehensive automated test suite and zero layout shift.',
            outcome: 'Distinguishes you from ordinary applicants during technical evaluations.',
          },
          resources: [
            { title: 'Web.dev Performance Learning Path', provider: 'Google Developers', type: 'Documentation', duration: 'Self-paced' },
          ],
        },
      ],
    },
  ],

  'data-analyst': [
    {
      phaseNumber: 1,
      phaseTitle: 'Phase 1: Advanced SQL & Relational Analytics',
      levelBadge: 'Beginner',
      description: 'Master advanced database querying to slice, aggregate, and transform enterprise datasets into analytical tables.',
      milestones: [
        {
          id: 'sql-advanced-analytics',
          skillName: 'Advanced Analytical SQL',
          levelTarget: 'Advanced',
          importance: 'Essential',
          suggestedOrder: 1,
          durationEstimate: '3 Weeks',
          keyTopics: ['Window functions (ROW_NUMBER, RANK, DENSE_RANK, NTILE, LAG/LEAD)', 'Common Table Expressions (CTEs) & Subqueries', 'Data aggregation, GROUPING SETS, and pivot tables'],
          portfolioProject: {
            name: 'E-Commerce Cohort Retention & Churn SQL Audit',
            brief: 'Write complex multi-step queries analyzing user cohort retention curves over a 12-month transaction log.',
            outcome: 'A premier SQL case study proving deep analytical querying capabilities.',
          },
          resources: [
            { title: 'Advanced SQL for Data Analysis', provider: 'Mode Analytics', type: 'Documentation', duration: '12 Hours' },
          ],
        },
      ],
    },
    {
      phaseNumber: 2,
      phaseTitle: 'Phase 2: Python Data Manipulation & Exploratory Analysis',
      levelBadge: 'Intermediate',
      description: 'Use Python, Pandas, and NumPy to clean noisy spreadsheets, detect outliers, and engineer analytical features.',
      milestones: [
        {
          id: 'python-pandas-eda',
          skillName: 'Python, Pandas & NumPy',
          levelTarget: 'Intermediate',
          importance: 'Essential',
          suggestedOrder: 2,
          durationEstimate: '3-4 Weeks',
          keyTopics: ['Data cleaning, handling missing data, and type conversion', 'Vectorized DataFrame operations and merges', 'Exploratory Data Analysis (EDA) methodologies'],
          portfolioProject: {
            name: 'University Placement Salary Trend Analyzer',
            brief: 'Clean and explore 5 years of historical college placement reports, uncovering key drivers of compensation packages.',
            outcome: 'Generates reproducible Jupyter notebooks and interactive charts.',
          },
          resources: [
            { title: 'Python for Data Analysis by Wes McKinney', provider: 'O’Reilly / Online', type: 'Book', duration: 'Self-paced' },
          ],
        },
        {
          id: 'ml-basics-analytics',
          skillName: 'Machine Learning for Business Insights',
          levelTarget: 'Beginner',
          importance: 'Medium',
          suggestedOrder: 3,
          durationEstimate: '2 Weeks',
          keyTopics: ['Linear and Logistic Regression for forecasting', 'K-Means clustering for customer segmentation', 'Interpreting model coefficients and statistical significance'],
          portfolioProject: {
            name: 'Customer Segmentation & Churn Predictor',
            brief: 'Cluster customers into 4 distinct persona groups and predict likelihood of churn with 85%+ accuracy.',
            outcome: 'Demonstrates ability to provide predictive guidance to business leadership.',
          },
          resources: [
            { title: 'Scikit-Learn Getting Started Guide', provider: 'scikit-learn.org', type: 'Documentation', duration: '6 Hours' },
          ],
        },
      ],
    },
    {
      phaseNumber: 3,
      phaseTitle: 'Phase 3: Executive Dashboards & Portfolio Storytelling',
      levelBadge: 'Advanced',
      description: 'Translate technical findings into executive dashboards, business summaries, and interview presentation slides.',
      milestones: [
        {
          id: 'dashboard-storytelling',
          skillName: 'Data Storytelling & Executive Dashboards',
          levelTarget: 'Advanced',
          importance: 'Essential',
          suggestedOrder: 4,
          durationEstimate: '2 Weeks',
          keyTopics: ['Executive dashboard design principles', 'Hypothesis testing (p-values, A/B test analysis)', 'Effective presentation of quantitative findings to non-technical stakeholders'],
          portfolioProject: {
            name: 'Public Health or Economic Trends Dashboard',
            brief: 'Build an interactive web dashboard with clear metrics, drill-down filters, and narrative recommendations.',
            outcome: 'A polished visual asset ready for your portfolio website and recruiter presentations.',
          },
          resources: [
            { title: 'Storytelling with Data', provider: 'Cole Nussbaumer Knaflic', type: 'Book', duration: 'Self-paced' },
          ],
        },
      ],
    },
  ],

  'python-developer': [
    {
      phaseNumber: 1,
      phaseTitle: 'Phase 1: Advanced Python & Object-Oriented Design',
      levelBadge: 'Beginner',
      description: 'Master idiomatic Python (Pythonic code), data structures, generators, decorators, and modular design.',
      milestones: [
        {
          id: 'pythonic-core',
          skillName: 'Python Architecture & Idioms',
          levelTarget: 'Intermediate',
          importance: 'Essential',
          suggestedOrder: 1,
          durationEstimate: '2-3 Weeks',
          keyTopics: ['Decorators, generators & context managers', 'Type hinting, dataclasses & Pydantic models', 'Memory model, GIL & async programming (asyncio)'],
          portfolioProject: {
            name: 'Asynchronous Web Scraper & Data Pipeline',
            brief: 'Engineer an async web crawler using aiohttp and BeautifulSoup to index university research publications.',
            outcome: 'Demonstrates deep asynchronous programming and clean error handling in Python.',
          },
          resources: [
            { title: 'Fluent Python (Reference Guide)', provider: 'Luciano Ramalho', type: 'Book', duration: 'Self-paced' },
          ],
        },
        {
          id: 'dsa-python',
          skillName: 'Data Structures in Python',
          levelTarget: 'Intermediate',
          importance: 'Essential',
          suggestedOrder: 2,
          durationEstimate: '3 Weeks',
          keyTopics: ['Lists, dicts, sets, heap, collections module', 'Recursion, dynamic programming & graphs', 'Optimizing algorithmic runtimes in Python'],
          portfolioProject: {
            name: 'Automated Campus Course Scheduler Algorithm',
            brief: 'Solve classroom allocation and timetable conflicts using backtracking and constraint satisfaction algorithms.',
            outcome: 'Strong showcase of problem solving and algorithmic reasoning.',
          },
          resources: [
            { title: 'NeetCode Python DSA Roadmap', provider: 'NeetCode.io', type: 'Practice Track', duration: 'Daily' },
          ],
        },
      ],
    },
    {
      phaseNumber: 2,
      phaseTitle: 'Phase 2: Backend APIs, Databases & Testing',
      levelBadge: 'Intermediate',
      description: 'Build enterprise-grade backend services with FastAPI or Django, SQL databases, and automated testing.',
      milestones: [
        {
          id: 'fastapi-backend',
          skillName: 'FastAPI & REST API Architecture',
          levelTarget: 'Intermediate',
          importance: 'Essential',
          suggestedOrder: 3,
          durationEstimate: '3 Weeks',
          keyTopics: ['FastAPI dependency injection, routers & schemas', 'SQLAlchemy / SQLModel ORM integration', 'JWT authentication and role-based permissions', 'PyTest unit and integration testing'],
          portfolioProject: {
            name: 'Automated Code Review & Submission API',
            brief: 'Construct a microservice that accepts code submissions, executes safe sandbox validations, and returns graded feedback.',
            outcome: 'A standout backend project directly relevant to software development teams.',
          },
          resources: [
            { title: 'FastAPI Official Tutorial & Docs', provider: 'tiangolo.com', type: 'Documentation', duration: 'Self-paced' },
          ],
        },
      ],
    },
    {
      phaseNumber: 3,
      phaseTitle: 'Phase 3: Production Deployment, Docker & Placement Drills',
      levelBadge: 'Advanced',
      description: 'Containerize backend services with Docker, set up CI/CD workflows, and prepare for Python backend engineering interviews.',
      milestones: [
        {
          id: 'docker-deployment',
          skillName: 'Docker, CI/CD & Production Engineering',
          levelTarget: 'Advanced',
          importance: 'Essential',
          suggestedOrder: 4,
          durationEstimate: '2-3 Weeks',
          keyTopics: ['Multi-stage Dockerfiles for Python services', 'PostgreSQL database containerization with Docker Compose', 'Deploying to cloud platforms with environment configurations'],
          portfolioProject: {
            name: 'Fully Dockerized Production Microservice Stack',
            brief: 'Package a FastAPI service with Postgres and Redis cache behind Nginx reverse proxy with health checks.',
            outcome: 'Proves end-to-end devops readiness for entry-level backend positions.',
          },
          resources: [
            { title: 'Docker for Developers Guide', provider: 'Docker Docs', type: 'Documentation', duration: '6 Hours' },
          ],
        },
      ],
    },
  ],

  'ai-ml-engineer': [
    {
      phaseNumber: 1,
      phaseTitle: 'Phase 1: Mathematical Foundations & Python for AI',
      levelBadge: 'Beginner',
      description: 'Establish the core mathematical intuition (linear algebra, calculus, probability) and master tensor operations in NumPy.',
      milestones: [
        {
          id: 'math-python-ml',
          skillName: 'NumPy & Linear Algebra for ML',
          levelTarget: 'Intermediate',
          importance: 'Essential',
          suggestedOrder: 1,
          durationEstimate: '3 Weeks',
          keyTopics: ['Matrix multiplication, eigenvalues, dot products', 'Partial derivatives, gradient descent intuition', 'Vectorized broadcasting in NumPy'],
          portfolioProject: {
            name: 'Neural Network from Scratch (No ML Libraries)',
            brief: 'Implement forward propagation, backpropagation, and gradient descent using only raw Python and NumPy.',
            outcome: 'Demonstrates deep fundamental mastery of deep learning mechanics without relying blindly on frameworks.',
          },
          resources: [
            { title: 'Mathematics for Machine Learning', provider: 'Deisenroth et al. (Free PDF)', type: 'Book', duration: 'Self-paced' },
          ],
        },
      ],
    },
    {
      phaseNumber: 2,
      phaseTitle: 'Phase 2: Classical Machine Learning & Feature Engineering',
      levelBadge: 'Intermediate',
      description: 'Master supervised, unsupervised, and ensemble algorithms using scikit-learn with rigorous cross-validation.',
      milestones: [
        {
          id: 'sklearn-classical',
          skillName: 'Scikit-Learn & Classical ML',
          levelTarget: 'Advanced',
          importance: 'Essential',
          suggestedOrder: 2,
          durationEstimate: '4 Weeks',
          keyTopics: ['Random Forests, Gradient Boosting (XGBoost/LightGBM)', 'Bias-variance tradeoff, cross-validation & hyperparameter tuning', 'Feature scaling, one-hot encoding, and feature importance'],
          portfolioProject: {
            name: 'Early Warning College Dropout & Attrition Predictor',
            brief: 'Train XGBoost model on academic behavioral metrics with 90%+ AUC-ROC and explainable SHAP interpretability.',
            outcome: 'A production-level ML classification project with feature importance analysis.',
          },
          resources: [
            { title: 'Applied Machine Learning Course', provider: 'Coursera / Andrew Ng', type: 'Free Course', duration: 'Self-paced' },
          ],
        },
      ],
    },
    {
      phaseNumber: 3,
      phaseTitle: 'Phase 3: Deep Learning, PyTorch & LLM Inference',
      levelBadge: 'Advanced',
      description: 'Build neural network architectures using PyTorch and explore modern generative AI model deployment.',
      milestones: [
        {
          id: 'pytorch-deep-learning',
          skillName: 'PyTorch & Neural Networks',
          levelTarget: 'Intermediate',
          importance: 'Essential',
          suggestedOrder: 3,
          durationEstimate: '4 Weeks',
          keyTopics: ['PyTorch tensors, autograd & Dataset/DataLoader pipeline', 'Convolutional Neural Networks (CNNs) & Transfer Learning', 'Transformer architecture basics & self-attention'],
          portfolioProject: {
            name: 'Academic Document Q&A with Vector Embeddings',
            brief: 'Build a Retrieval-Augmented Generation (RAG) pipeline parsing university textbooks and answering student queries.',
            outcome: 'Highly relevant modern AI project showcasing embedding generation and vector search.',
          },
          resources: [
            { title: 'Deep Learning with PyTorch: A 60 Minute Blitz', provider: 'PyTorch.org', type: 'Documentation', duration: '3 Hours' },
          ],
        },
        {
          id: 'ml-deployment-interview',
          skillName: 'ML Model Serving & Technical Interviews',
          levelTarget: 'Advanced',
          importance: 'Essential',
          suggestedOrder: 4,
          durationEstimate: '2 Weeks',
          keyTopics: ['Packaging models with ONNX / TorchScript', 'Serving inference endpoints via FastAPI', 'Handling data drift, latency, and GPU throughput'],
          portfolioProject: {
            name: 'Live Deployed Computer Vision / NLP API',
            brief: 'Deploy your PyTorch model as a cloud REST API with latency under 150ms and automated testing.',
            outcome: 'Proves production readiness beyond basic Jupyter notebooks.',
          },
          resources: [
            { title: 'Made With ML: Production MLOps Course', provider: 'MadeWithML', type: 'Documentation', duration: '15 Hours' },
          ],
        },
      ],
    },
  ],
};

// Fallback generator for roles without explicit preset
export function getRoadmapForRole(roleId: string, roleTitle: string): RoadmapPhase[] {
  if (ROLE_ROADMAPS[roleId]) {
    return ROLE_ROADMAPS[roleId];
  }

  return [
    {
      phaseNumber: 1,
      phaseTitle: `Phase 1: ${roleTitle} Core Foundations`,
      levelBadge: 'Beginner',
      description: 'Master core languages and theoretical prerequisites essential for this career role.',
      milestones: [
        {
          id: `${roleId}-foundations`,
          skillName: 'Fundamental Competencies',
          levelTarget: 'Beginner',
          importance: 'Essential',
          suggestedOrder: 1,
          durationEstimate: '3-4 Weeks',
          keyTopics: ['Core syntax & data types', 'Algorithmic logic and control structures', 'Standard library utilities'],
          portfolioProject: {
            name: `${roleTitle} Starter Portfolio Project`,
            brief: 'Build an initial application demonstrating core problem solving and language idioms.',
            outcome: 'Firm foundation established for advanced domain concepts.',
          },
          resources: [
            { title: 'Official Documentation & Guides', provider: 'Official Docs', type: 'Documentation', duration: 'Self-paced' },
          ],
        },
      ],
    },
    {
      phaseNumber: 2,
      phaseTitle: `Phase 2: Applied Systems & Engineering Practice`,
      levelBadge: 'Intermediate',
      description: 'Implement real-world projects utilizing modern frameworks and version-controlled team workflows.',
      milestones: [
        {
          id: `${roleId}-systems`,
          skillName: 'Frameworks & Database Integrations',
          levelTarget: 'Intermediate',
          importance: 'Essential',
          suggestedOrder: 2,
          durationEstimate: '4-5 Weeks',
          keyTopics: ['Architecture patterns', 'Database transactions and indexing', 'API contracts and data exchange'],
          portfolioProject: {
            name: `Applied ${roleTitle} Capstone Application`,
            brief: 'A full-cycle project solving real college or industry operational challenges.',
            outcome: 'Production-ready showcase piece for technical interviews.',
          },
          resources: [
            { title: 'Hands-on Labs & Coding Tracks', provider: 'Open Source Community', type: 'Hands-on Lab', duration: '12 Hours' },
          ],
        },
      ],
    },
    {
      phaseNumber: 3,
      phaseTitle: `Phase 3: Production Mastery & Placement Drills`,
      levelBadge: 'Advanced',
      description: 'Refine performance, security, automated testing, and prepare for campus placement assessments.',
      milestones: [
        {
          id: `${roleId}-placement`,
          skillName: 'Performance & Placement Readiness',
          levelTarget: 'Advanced',
          importance: 'Essential',
          suggestedOrder: 3,
          durationEstimate: '2-3 Weeks',
          keyTopics: ['High-yield technical interview questions', 'System design principles', 'Resume and GitHub portfolio optimization'],
          portfolioProject: {
            name: 'Live Deployed Cloud Capstone',
            brief: 'Complete, documented project hosted live with automated test suites and architectural diagrams.',
            outcome: 'Direct asset to provide recruiters and hackathon judges.',
          },
          resources: [
            { title: 'Technical Interview Mastery Track', provider: 'Tech Interview Handbook', type: 'Practice Track', duration: 'Self-paced' },
          ],
        },
      ],
    },
  ];
}
