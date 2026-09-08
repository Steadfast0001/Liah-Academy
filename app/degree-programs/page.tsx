'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, Settings, Clock, Search, X,
  Code, Shield, Calendar, MapPin, Globe, ArrowRight, Mail,
  BookOpen, Award, CheckCircle2, Terminal, Cpu, Database, 
  Server, Smartphone, Layers, Sparkles, ChevronRight, Check
} from 'lucide-react';

export interface CurriculumLevel {
  level: string;
  stageName: string;
  duration: string;
  description: string;
  skills: string[];
}

export interface CurriculumTrack {
  id: string;
  title: string;
  badge: string;
  icon: string;
  degreeLink: string;
  programParam: string;
  summary: string;
  totalDuration: string;
  levels: CurriculumLevel[];
  certifications: {
    title: string;
    issuer: string;
    notes?: string;
  }[];
}

export const curriculumTracksData: CurriculumTrack[] = [
  {
    id: 'devops',
    title: 'DevOps & Cloud Systems',
    badge: 'Infrastructure & Automation',
    icon: 'server',
    degreeLink: 'Certification',
    programParam: 'DevOps Certification',
    summary: 'Master containerization, continuous integration/delivery (CI/CD), infrastructure as code, cloud architectures, and production cluster orchestration.',
    totalDuration: '6 – 9 Months (Modular)',
    levels: [
      {
        level: 'Beginner',
        stageName: 'Background and Infrastructure',
        duration: '1-2 Months',
        description: 'Focuses on establishing core systems intelligence. Before diving into orchestration tools, you must master the environments where software actually runs, dependencies are managed, and team code is version-controlled.',
        skills: [
          'Linux Operating System (File management, text processing, basic system admin, and permissions)',
          'Networking Fundamentals (Protocols, DNS management, HTTP/S, and basic SSH security setups)',
          'Git & Version Control (Branching, merging, managing repositories via GitHub/GitLab)',
          'Fundamental Scripting (Bash or basic Python for workflow automation)'
        ]
      },
      {
        level: 'Intermediate',
        stageName: 'DevOps Fundamentals & Infrastructure Virtualization',
        duration: '2-3 Months',
        description: 'Bridges the gap between standalone code and scalable infrastructure. This stage shifts focus to packaging apps cleanly so they perform consistently across local machines, staging environments, and the cloud.',
        skills: [
          'Containerization basics using Docker (Writing Dockerfiles, managing container registries, and Docker Compose multi-containers)',
          'Artifact Management (Storing builds and dependencies securely using tools like Sonatype Nexus)',
          'Cloud Computing Foundations (Core compute, storage, security policies, and IAM access rules on AWS)'
        ]
      },
      {
        level: 'Advanced',
        stageName: 'Core DevOps & Orchestration Automation',
        duration: '3-4 Months',
        description: 'The heart of the DevOps ecosystem. Learn to manage highly resilient, distributed cloud microservices at scale and orchestrate automatic, high-speed software release engines.',
        skills: [
          'Container Orchestration with Kubernetes (Deploying pods, ingress controllers, configurations, and stateful clusters)',
          'Continuous Integration & Continuous Delivery (CI/CD pipelines via GitHub Actions, GitLab CI, or Jenkins to test, package, and auto-deploy)',
          'Deep Cloud Administration (Advanced scaling, Virtual Private Clouds, and multi-tenant management)'
        ]
      },
      {
        level: 'Production-Ready',
        stageName: 'Enterprise Infrastructure as Code (IaC) & Advanced Architecture',
        duration: '3-4 Months',
        description: 'Treats data centers and infrastructure configurations exactly like application code. Transitions you into a cloud systems engineer capable of provisioning global tech setups dynamically, maintaining visibility, and implementing unified security.',
        skills: [
          'Infrastructure as Code using Terraform or Pulumi to construct entire server setups automatically',
          'Configuration Management via Ansible to maintain state across thousands of web servers simultaneously',
          'Monitoring & Observability using Prometheus and Grafana (Intercepting failure metrics, tracing real-time performance, summarizing logs)',
          'DevSecOps integration (Automated static code security screening, container vulnerability assessments, and secret masking)'
        ]
      }
    ],
    certifications: [
      {
        issuer: 'Linux Foundation',
        title: 'Certified Kubernetes Administrator (CKA)',
        notes: 'Highly valued core validation for production cluster operations.'
      },
      {
        issuer: 'Amazon Web Services',
        title: 'AWS Certified Solutions Architect (Associate) / DevOps Engineer (Professional)',
        notes: 'Validates industry cloud systems design and pipeline governance.'
      },
      {
        issuer: 'HashiCorp',
        title: 'Terraform Associate',
        notes: 'Validates practical Infrastructure as Code capabilities.'
      },
      {
        issuer: 'IBM / Coursera',
        title: 'IBM DevOps and Software Engineering Professional Certificate',
        notes: 'Comprehensive career framework across CI/CD and agile engineering.'
      }
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cyber Security & Defense',
    badge: 'Defensive & Offensive SecOps',
    icon: 'shield',
    degreeLink: 'HND',
    programParam: 'Cybersecurity & Cloud Defense HND',
    summary: 'Develop defensive and offensive security expertise, spanning network architecture, ethical penetration testing, SIEM log forensics, and cloud compliance.',
    totalDuration: '6 – 9 Months (Modular / HND 2 Yrs)',
    levels: [
      {
        level: 'Beginner',
        stageName: 'Core Networking & Operating System Fundamentals',
        duration: '2-3 Months',
        description: 'Establishes the structural baseline. Before learning how to defend or exploit a network, you must understand exactly how data moves across systems and become fully comfortable navigating command-line environments.',
        skills: [
          'Networking Infrastructure (OSI and TCP/IP models, IP addressing, subnetting, switching, and routing protocols)',
          'Network Services (Managing core internet services like DNS, DHCP, HTTP/S, and SSH security layers)',
          'System Administration (Linux CLI file structures, access control permissions, log handling, and Windows Active Directory baselines)'
        ]
      },
      {
        level: 'Intermediate',
        stageName: 'Core Security Concepts & Defensive Baselines',
        duration: '2-3 Months',
        description: 'Introduces fundamental threats, system vulnerabilities, and initial defense methodologies. Shifts from basic administration to identifying attack vectors and deploying defensive configurations to safeguard local networks.',
        skills: [
          'Threat Identification (Analyzing common vulnerabilities, malware types, social engineering tactics, and cryptographic basics)',
          'Network Defenses (Designing firewalls, configuring basic Intrusion Detection/Prevention Systems (IDS/IPS), and implementing access controls)',
          'Log Monitoring & Scripting (Bash or Python automation scripts for scanning files and filtering system security logs)'
        ]
      },
      {
        level: 'Advanced',
        stageName: 'Specialization Framework (Offensive vs. Defensive Security)',
        duration: '3-4 Months',
        description: 'Choose a specialized operational branch to develop deeper technical expertise: Offensive Track (Penetration Testing / Ethical Hacking) or Defensive Track (Security Operations / Blue Teaming).',
        skills: [
          'Offensive Track: Penetration testing tools, wireless assessment (airodump-ng, macchanger), reconnaissance scanners (Nmap), and exploitation (Metasploit)',
          'Defensive Track: Continuous threat detection and event mitigation using SIEM tools (Splunk, ELK stack) to parse live traffic logs, track security incidents, and conduct digital forensics'
        ]
      },
      {
        level: 'Enterprise-Ready',
        stageName: 'Enterprise Security Architecture & Compliance Engineering',
        duration: '3-4 Months',
        description: 'Focuses on overseeing macro-level cloud architectures, response operations, and regulatory security frameworks across distributed corporate environments.',
        skills: [
          'Cloud Security (Establishing secure identity policies, tracking resource constraints, isolating workloads across AWS, Azure, or GCP)',
          'Incident Handling (Structuring corporate disaster recovery plans and automated response configurations)',
          'Governance & Risk (Syncing platform operations with international compliance models like ISO 27001, SOC 2, or GDPR)'
        ]
      }
    ],
    certifications: [
      {
        issuer: 'CompTIA',
        title: 'CompTIA Security+ (SY0-701)',
        notes: 'Standard foundational security benchmark for international entry-level roles.'
      },
      {
        issuer: 'EC-Council',
        title: 'Certified Ethical Hacker (CEH)',
        notes: 'Highly recognized certification for enterprise compliance and red-team operations.'
      },
      {
        issuer: 'Offensive Security',
        title: 'Offensive Security Certified Professional (OSCP)',
        notes: 'Elite practical 24-hour examination standard for offensive penetration testing.'
      },
      {
        issuer: '(ISC)²',
        title: 'CISSP (Certified Information Systems Security Professional)',
        notes: 'The ultimate benchmark for senior administration, cloud security, and governance tracks.'
      }
    ]
  },
  {
    id: 'datascience',
    title: 'Data Science & Machine Learning',
    badge: 'Analytics, ML & Generative AI',
    icon: 'database',
    degreeLink: 'Certification',
    programParam: 'Data Science Certification',
    summary: 'Extract actionable intelligence, train classical machine learning models, and build production deep learning and generative AI workflows.',
    totalDuration: '6 – 9 Months (Modular)',
    levels: [
      {
        level: 'Beginner',
        stageName: 'Mathematical Foundations & Programming Core',
        duration: '2-3 Months',
        description: 'Establishes the core analytic and programming frameworks. Data science is deeply rooted in mathematics; you must understand the underlying statistical mechanisms before passing data into automated algorithms.',
        skills: [
          'Core Mathematics: Linear algebra (matrix manipulations, eigenvectors), multivariable calculus (derivatives, partial derivatives, gradient descent)',
          'Applied Statistics & Probability: Descriptive statistics, probability distributions (Normal, Binomial, Poisson), hypothesis testing (p-values, t-tests), A/B test design',
          'Core Programming: Mastering Python fundamentals (data structures, loops, object-oriented programming)'
        ]
      },
      {
        level: 'Intermediate',
        stageName: 'Data Engineering, Retrieval & Exploratory Analysis',
        duration: '2-3 Months',
        description: 'Focuses on extracting, cleaning, and structuring unstructured real-world datasets. Emphasizes transformation, manipulating relational data tables, and visualizing trends.',
        skills: [
          'Structured Queries: Advanced SQL (Complex joins, window functions, aggregations, subqueries) to pull data from relational databases',
          'Data Manipulation Libraries: Pandas and NumPy for cleaning missing values, filtering dataframes, and parsing structural arrays',
          'Data Visualization: Matplotlib, Seaborn, or Plotly for distribution charts, scatter plots, and executive trend reporting',
          'Environment Management: Managing dependencies natively using Git, GitHub, and tools like Poetry or uv'
        ]
      },
      {
        level: 'Advanced',
        stageName: 'Classical Machine Learning & Statistical Modeling',
        duration: '3 Months',
        description: 'Shifting from describing past data to predicting future outcomes. Implement classical algorithmic models, evaluate mathematical error rates, and tune hyper-parameters to avoid underfitting or overfitting.',
        skills: [
          'Supervised Learning: Linear/Polynomial Regression, Logistic Regression, Decision Trees, Random Forests, Gradient Boosting (XGBoost, LightGBM)',
          'Unsupervised Learning: K-Means Clustering, Hierarchical Clustering, Principal Component Analysis (PCA) for dimensional simplification',
          'Frameworks & Testing: Scikit-Learn, cross-validation techniques, bias-variance trade-off tracking, evaluation metrics (ROC-AUC, Precision, Recall, F1-Score)'
        ]
      },
      {
        level: 'Industry-Ready',
        stageName: 'Production MLOps, Deep Learning & AI Integration',
        duration: '3-4 Months',
        description: 'Bridges experimental notebook scripts and scalable cloud software systems. Focuses on building deep learning models, leveraging generative AI tools, and orchestrating models via functional APIs.',
        skills: [
          'Deep Learning Foundations: Neural network baselines, Convolutional Neural Networks (CNNs), Transformer patterns using PyTorch or TensorFlow',
          'Natural Language Processing (NLP): Tokenization, embeddings, fine-tuning and prompting Large Language Models (LLMs) via API structures',
          'Model Deployment (MLOps): Wrapping prediction algorithms into APIs using FastAPI or Flask, containerizing with Docker, tracking experiments with MLflow'
        ]
      }
    ],
    certifications: [
      {
        issuer: 'Google Cloud',
        title: 'Professional Data Engineer',
        notes: 'Validates ability to design data processing systems and operationalize machine learning models on GCP.'
      },
      {
        issuer: 'IBM',
        title: 'IBM Data Science Professional Certificate',
        notes: 'Popular multi-course foundation covering Python, SQL, and open-source data science tools.'
      },
      {
        issuer: 'Databricks',
        title: 'Certified Data Scientist Associate',
        notes: 'Validates performance with large-scale machine learning workflows on unified data analytics platforms.'
      },
      {
        issuer: 'Amazon Web Services',
        title: 'AWS Certified Data Engineer (Associate)',
        notes: 'Focuses on AWS core data collection, ingestion, storage, and transformation pipelines.'
      }
    ]
  },
  {
    id: 'webdev',
    title: 'Full-Stack Web Development',
    badge: 'Modern Web, APIs & Cloud',
    icon: 'code',
    degreeLink: 'HND',
    programParam: 'Software Engineering HND',
    summary: 'Build modern responsive frontends with React/Next.js and engineer scalable backend microservices, SQL/NoSQL databases, and cloud CI/CD pipelines.',
    totalDuration: '6 – 9 Months (Modular / HND 2 Yrs)',
    levels: [
      {
        level: 'Beginner',
        stageName: 'Client-Side Foundations & Interactive UI',
        duration: '2-3 Months',
        description: 'Focuses on the user-facing layer of the web. Transitions you from writing basic structure to constructing component-driven, highly interactive user interfaces that process data smoothly.',
        skills: [
          'Core Web Standards: Semantic HTML5 (accessibility/WCAG standards) and responsive CSS3 (Flexbox, CSS Grid)',
          'Modern Styling Frameworks: Tailwind CSS for rapid, utility-first interface design',
          'Programmatic Logic: JavaScript (ES6+, async/await, Promises, Fetch API) and TypeScript for static type-safety',
          'Component Architecture: React or Next.js to build modular, reusable interface components and manage complex state'
        ]
      },
      {
        level: 'Intermediate',
        stageName: 'Server-Side Engineering & Business Logic',
        duration: '2-3 Months',
        description: 'Shifting focus behind the scenes to handle user authentication, server-side data processing, and application security. Constructing the core brains and API workflows of a web application.',
        skills: [
          'MVC Frameworks: Laravel (PHP) or Node.js (Express) to route traffic, handle middleware, and enforce backend security',
          'API Architecture: Designing clean, standardized RESTful APIs or GraphQL endpoints to serve data securely to your frontend',
          'Authentication Ecosystems: Implementing secure user sessions, OAuth, JWT (JSON Web Tokens), and Single Sign-On (SSO) strategies'
        ]
      },
      {
        level: 'Advanced',
        stageName: 'Data Architecture & Persistence Layers',
        duration: '2 Months',
        description: 'Focuses on how application data is securely stored, queried, and optimized. Design data models that maintain speed and integrity as user traffic grows.',
        skills: [
          'Relational Databases (SQL): PostgreSQL and MySQL (complex joins, performance indexing, transactions, schema migrations)',
          'NoSQL Databases: Exploring document-based storage like MongoDB for unstructured data profiles',
          'Caching & In-Memory Storage: Utilizing Redis to cache database queries and handle fast session state management'
        ]
      },
      {
        level: 'Production-Ready',
        stageName: 'Production Deployment, Git Workflows & Cloud Infrastructure',
        duration: '3 Months',
        description: 'Bridges code development with live server administration. Ensures full-stack applications are deployed securely, monitored for errors, and easily updated without downtime.',
        skills: [
          'Version Control & Workflows: Advanced Git commands, branching models, collaborative pull request workflows on GitHub/GitLab',
          'Server & Control Panels: Deployment and environment administration using cPanel, DirectAdmin, and Linux CLI server basics',
          'Containerization & CI/CD: Packaging web apps into Docker containers and automating test-and-deploy pipelines via GitHub Actions',
          'Cloud Hosting Environments: Deploying modular setups across AWS, DigitalOcean, or specialized cloud environments'
        ]
      }
    ],
    certifications: [
      {
        issuer: 'Amazon Web Services',
        title: 'AWS Certified Developer (Associate)',
        notes: 'Validates technical expertise in developing, deploying, and maintaining cloud applications on AWS.'
      },
      {
        issuer: 'Meta / Coursera',
        title: 'Meta Back-End & Front-End Developer Professional Certificates',
        notes: 'Comprehensive multi-course frameworks validating core engineering languages and databases.'
      },
      {
        issuer: 'OpenJS Foundation',
        title: 'OpenJS Node.js Application Developer (JNAD)',
        notes: 'Practical, performance-based certification proving competence in building robust backend services using Node.js.'
      }
    ]
  },
  {
    id: 'mobiledev',
    title: 'Mobile App Development',
    badge: 'iOS, Android & Cross-Platform',
    icon: 'smartphone',
    degreeLink: 'Certification',
    programParam: 'Industrial Web Design',
    summary: 'Design tactile mobile user experiences and engineer cross-platform and native iOS/Android applications with hardware sensor integration and App Store deployment.',
    totalDuration: '6 – 9 Months (Modular)',
    levels: [
      {
        level: 'Beginner',
        stageName: 'Client-Side Structuring, Git & JavaScript Foundations',
        duration: '2-3 Months',
        description: 'Establishes foundational logic and interface layouts. Before jumping into complex mobile SDKs, you must master the fundamental languages and version control systems used to construct dynamic user experiences.',
        skills: [
          'Core Web Standards: Semantic HTML5 and responsive CSS3 layouts using Flexbox or CSS Grid',
          'Programmatic Logic: Modern JavaScript (ES6+, asynchronous event execution, Promises, Fetch API handlers)',
          'Static Typing: TypeScript to manage structural data variables and reduce compilation errors',
          'Collaborative Version Control: Multi-branch Git operations and repository tracking natively on GitHub or GitLab'
        ]
      },
      {
        level: 'Intermediate',
        stageName: 'Mobile UI/UX Design & Component Architecture',
        duration: '2 Months',
        description: 'Adapts frontend concepts to hardware limits and layout structures unique to mobile environments. Focuses on designing accessible screen interfaces optimized for touch interactions.',
        skills: [
          'Mobile UI/UX Wireframing: Touch-target scaling, platform-specific navigation hierarchies, and asset sizing using Figma',
          'Utility-First Styling: Utilizing Tailwind CSS to rapidly style fluid layouts',
          'Component Engineering: Building declarative, interactive mobile interface modules using React state management'
        ]
      },
      {
        level: 'Advanced',
        stageName: 'The Cross-Platform Core Ecosystem (React Native or Flutter)',
        duration: '3 Months',
        description: 'The centerpiece of modern app development. Build cross-platform applications that share a single codebase but compile directly into high-performance, native mobile software.',
        skills: [
          'Cross-Platform Engineering: Master React Native (leveraging JavaScript/React) or Flutter (using Google’s typed Dart language)',
          'Device Hardware Access: Interfacing code securely with on-device camera modules, biometrics, SQLite storage, GPS sensors',
          'State Orchestration: Managing application states across multiple screens using Context APIs, Redux Toolkit, or Riverpod'
        ]
      },
      {
        level: 'Production-Ready',
        stageName: 'Backend API Integration & Native Platform Tooling',
        duration: '3-4 Months',
        description: 'Bridges client-side applications with cloud databases and infrastructure. Focuses on securing data flows, configuring native development environments, and publishing complete applications to public app stores.',
        skills: [
          'Backend & API Systems: Connecting apps to server backends via RESTful or GraphQL APIs, handling user sessions, push notifications',
          'Native Development Environments: Compiling code and tracking build states using Android Studio (Kotlin) and Xcode (Swift on macOS)',
          'Production Deployment: Configuring application bundles, managing app store signing identities, and launching to Google Play Store & Apple App Store'
        ]
      }
    ],
    certifications: [
      {
        issuer: 'Google',
        title: 'Google Associate Android Developer',
        notes: 'Proves applied competence in building functional Android applications using Kotlin and Android Studio.'
      },
      {
        issuer: 'IBM',
        title: 'IBM iOS and Android Mobile App Developer Professional Certificate',
        notes: 'Multi-course program via Coursera covering native design, cross-platform frameworks, and backend integration.'
      },
      {
        issuer: 'Meta',
        title: 'Meta Android & iOS Developer Professional Certificates',
        notes: 'Rigorous, project-centric tracks validating core engineering languages and publishing standards.'
      },
      {
        issuer: 'Google',
        title: 'Google UX Design Professional Certificate',
        notes: 'Provides visual design baselines, user research, wireframing, and mobile interface design principles.'
      }
    ]
  }
];

const programsData = [
  // School of Engineering & Technology (HND & ND)
  {
    id: 1,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Software Engineering HND',
    desc: 'Learn full-stack programming, backend frameworks, software design patterns, and enterprise database operations.',
    degree: 'HND',
    duration: '2 Years',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '250,000 FRS',
    tags: ['Web Dev', 'Python', 'JavaScript', 'Algorithms', 'SQL', 'React'],
    featured: true
  },
  {
    id: 2,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Cybersecurity & Cloud Defense HND',
    desc: 'Network defense architectures, ethical penetration testing, vulnerability assessment, Linux server hardening, and cloud security.',
    degree: 'HND',
    duration: '2 Years',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '250,000 FRS',
    tags: ['Ethical Hacking', 'Linux', 'Firewalls', 'Cloud Security', 'SIEM'],
    featured: true
  },
  {
    id: 3,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Network and Maintenance HND',
    desc: 'Audit network topologies, manage systems security, configure routing protocols, and handle hardware diagnostics.',
    degree: 'HND',
    duration: '2 Years',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '250,000 FRS',
    tags: ['Linux Admin', 'Cisco Networking', 'PC Maintenance', 'Security'],
    featured: false
  },
  {
    id: 4,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Web and Graphics Design HND',
    desc: 'Acquire skills in creating user interfaces, design tools, modern UI/UX layouts, branding assets, and frontend programming.',
    degree: 'HND',
    duration: '2 Years',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '250,000 FRS',
    tags: ['UI/UX', 'Figma', 'Photoshop', 'HTML/CSS', 'Next.js'],
    featured: false
  },
  {
    id: 5,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Digital Marketing and E-Commerce HND',
    desc: 'Build online shops, optimize payment methods, run digital campaigns, and scale automated conversion funnels.',
    degree: 'HND',
    duration: '2 Years',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '250,000 FRS',
    tags: ['SEO', 'Social Media', 'Google Ads', 'WooCommerce'],
    featured: false
  },
  {
    id: 6,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Computer Engineering ND',
    desc: 'Hardware architectures, computer electronics, circuit diagnostics, component repair, and microprocessor programming.',
    degree: 'ND',
    duration: '1 Year',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '150,000 FRS',
    tags: ['Hardware Architecture', 'Electronics', 'Microprocessors', 'Repair'],
    featured: false
  },
  {
    id: 7,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Information & Communication Tech ND',
    desc: 'Database systems, basic web technologies, local networking infrastructure, and IT technical user support.',
    degree: 'ND',
    duration: '1 Year',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '150,000 FRS',
    tags: ['Database Systems', 'Web Tech', 'Networking', 'IT Support'],
    featured: false
  },
  {
    id: 8,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Web Design ND',
    desc: 'Foundational website markup, styling, scripting, and mobile-friendly responsive user interfaces.',
    degree: 'ND',
    duration: '1 Year',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '150,000 FRS',
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive Layouts'],
    featured: false
  },
  {
    id: 9,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Computerized Accounting ND',
    desc: 'Apply financial computing theories using digital bookkeeping platforms, spreadsheets, and reporting systems.',
    degree: 'ND',
    duration: '1 Year',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '150,000 FRS',
    tags: ['QuickBooks', 'Excel', 'Financial Records', 'Accounting'],
    featured: false
  },
  {
    id: 10,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Graphics Design and Printing ND',
    desc: 'Visual communication, Adobe design suite, typography, prepress output, digital printing, and brand collateral creation.',
    degree: 'ND',
    duration: '1 Year',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '150,000 FRS',
    tags: ['Photoshop', 'Illustrator', 'Printing', 'Typography'],
    featured: false
  },
  {
    id: 11,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Basic Computer ND',
    desc: 'Office productivity software, operating systems navigation, internet protocols, typing speed, and foundational digital literacy.',
    degree: 'ND',
    duration: '1 Year',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '150,000 FRS',
    tags: ['Office 365', 'Windows', 'Internet', 'Typing'],
    featured: false
  },

  // Professional Certifications
  {
    id: 12,
    school: 'CERTIFICATION',
    title: 'Digital Marketing and SEO',
    desc: 'Drive traffic, run ads, perform keyword audits, and manage campaigns across social media channels.',
    degree: 'CERTIFICATION',
    duration: '6 Months',
    format: 'fulltime',
    studyFormat: 'Fulltime',
    tuition: '350,000 FRS',
    tags: ['SEO', 'Content Marketing', 'Google Analytics', 'Ads'],
    featured: false
  },
  {
    id: 13,
    school: 'CERTIFICATION',
    title: 'Industrial Web Design',
    desc: 'Build fully responsive corporate websites, frontend layouts, animations, and modern CMS architectures.',
    degree: 'CERTIFICATION',
    duration: '6 Months',
    format: 'fulltime',
    studyFormat: 'Fulltime',
    tuition: '300,000 FRS',
    tags: ['Responsive Design', 'HTML5', 'CSS3', 'JavaScript', 'Git'],
    featured: false
  },
  {
    id: 14,
    school: 'CERTIFICATION',
    title: 'DevOps Certification',
    desc: 'Acquire skills in containerization, pipeline automation, cloud setups, and Infrastructure as Code.',
    degree: 'CERTIFICATION',
    duration: '9 Months',
    format: 'fulltime',
    studyFormat: 'Fulltime',
    tuition: '350,000 FRS',
    tags: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'AWS'],
    featured: false
  },
  {
    id: 15,
    school: 'CERTIFICATION',
    title: 'Data Science Certification',
    desc: 'Master Python, machine learning models, database queries, and data visualization tools to analyze data.',
    degree: 'CERTIFICATION',
    duration: '9 Months',
    format: 'fulltime',
    studyFormat: 'Fulltime',
    tuition: '350,000 FRS',
    tags: ['Python', 'Machine Learning', 'SQL', 'Data Visualization'],
    featured: true
  }
];

export default function DegreeProgramsPage() {
  const [explorerView, setExplorerView] = useState<'tracks' | 'catalog'>('tracks');
  const [activeTrackId, setActiveTrackId] = useState<string>('devops');
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeTrack = curriculumTracksData.find(t => t.id === activeTrackId) || curriculumTracksData[0];

  const filteredPrograms = programsData.filter((prog) => {
    const matchesSchool = 
      selectedSchool === 'all' || 
      (selectedSchool === 'ENGINEERING' && prog.school === 'SCHOOL OF ENGINEERING') ||
      (selectedSchool === 'CERTIFICATION' && prog.school === 'CERTIFICATION');

    const matchesSearch =
      searchQuery.trim() === '' ||
      prog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSchool && matchesSearch;
  });

  return (
    <main style={{ marginTop: 'calc(var(--header-height) + 40px)', marginBottom: '90px' }}>
      <div className="container">
        
        {/* Header with Direct Inquiry on the Left */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '24px', 
            marginBottom: '50px' 
          }}
        >
          {/* Direct Inquiry Button (Left) */}
          <div style={{ flexShrink: 0 }}>
            <Link 
              href="/contact#inquiry" 
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 22px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.92rem',
                background: '#FFFFFF',
                border: '2px solid #F5A623',
                color: '#081F3E',
                boxShadow: '0 4px 16px rgba(245, 166, 35, 0.2)',
                transition: 'all 0.2s ease'
              }}
            >
              <Mail size={18} color="#F5A623" /> Direct Inquiry
            </Link>
          </div>

          {/* Center Curriculum Header */}
          <div style={{ textAlign: 'center', flexGrow: 1, maxWidth: '720px' }}>
            <span style={{ 
              display: 'inline-block', 
              background: '#FEF3C7', 
              color: '#B45309', 
              padding: '5px 14px', 
              borderRadius: '4px', 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.75rem', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em', 
              marginBottom: '14px' 
            }}>
              CURRICULUM
            </span>
            <p className="page-header-subtitle">
              Degrees &amp; Programs
            </p>
            <h1 className="page-header-title">Curriculum Explorer</h1>
            <p className="page-header-desc">
              Explore step-by-step skill set roadmaps from Beginner to Production-Ready, complete with durations, core competencies, and optional international certifications.
            </p>
          </div>

          {/* Right Spacer on Desktop to preserve symmetric centering */}
          <div style={{ width: '160px', display: 'block', visibility: 'hidden' }} className="header-spacer-desktop" />
        </div>

        {/* 1. TOP 3 INFO CARDS */}
        <section className="grid-3" style={{ marginBottom: '60px', alignItems: 'stretch' }}>
          {/* Card 1: Higher National Diploma */}
          <div 
            className="premium-card"
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '36px 30px',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
            }}
          >
            <span style={{ 
              display: 'inline-block', 
              background: '#FEF3C7', 
              color: '#B45309', 
              padding: '4px 10px', 
              borderRadius: '4px', 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.72rem', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '0.06em', 
              marginBottom: '16px' 
            }}>
              ACADEMIC CORE
            </span>
            <h3 style={{ color: '#081F3E', fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>Higher National Diploma</h3>
            <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '20px' }}>
              Two-year national technical diploma accredited by the Ministry of Higher Education:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem', color: '#081F3E' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <GraduationCap size={20} color="#F5A623" />
                <span><strong>Duration:</strong> 2 Academic Years</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Code size={18} color="#F5A623" />
                <span>Software Engineering &amp; Networks</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="#10B981" />
                <span>National Examination Clearance</span>
              </li>
            </ul>
          </div>

          {/* Card 2: National Diploma */}
          <div 
            className="premium-card"
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '36px 30px',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
            }}
          >
            <span style={{ 
              display: 'inline-block', 
              background: '#FEF3C7', 
              color: '#B45309', 
              padding: '4px 10px', 
              borderRadius: '4px', 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.72rem', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '0.06em', 
              marginBottom: '16px' 
            }}>
              TECHNICAL FOUNDATION
            </span>
            <h3 style={{ color: '#081F3E', fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>National Diploma (ND)</h3>
            <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '20px' }}>
              One-year foundational diploma focused on core engineering, hardware, and bookkeeping:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem', color: '#081F3E' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <GraduationCap size={20} color="#F5A623" />
                <span><strong>Duration:</strong> 1 Academic Year</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Settings size={18} color="#F5A623" />
                <span>Computer Engineering &amp; ICT</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="#10B981" />
                <span>Direct HND Pathway Entry</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Professional Certifications */}
          <div 
            className="premium-card"
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '36px 30px',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
            }}
          >
            <span style={{ 
              display: 'inline-block', 
              background: '#DCFCE7', 
              color: '#15803D', 
              padding: '4px 10px', 
              borderRadius: '4px', 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.72rem', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '0.06em', 
              marginBottom: '16px' 
            }}>
              CAREER ACCELERATION
            </span>
            <h3 style={{ color: '#081F3E', fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>Professional Certifications</h3>
            <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '20px' }}>
              Intensive, hands-on industry bootcamps built for direct job placement in technology:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem', color: '#081F3E' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Award size={18} color="#10B981" />
                <span><strong>Duration:</strong> 6 to 9 Months</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={18} color="#10B981" />
                <span>DevOps, Cloud Pipelines &amp; Data Science</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="#10B981" />
                <span>Corporate Incubator Placement</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 2. CURRICULUM EXPLORER & TRACK ROADMAP SECTION */}
        <section style={{ marginBottom: '60px' }}>
          
          {/* Main View Switcher (Tracks Syllabus vs Full Catalog) */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <div style={{
              display: 'inline-flex',
              background: '#F1F5F9',
              padding: '6px',
              borderRadius: '12px',
              border: '1px solid rgba(15,23,42,0.08)'
            }}>
              <button
                type="button"
                onClick={() => setExplorerView('tracks')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 22px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  background: explorerView === 'tracks' ? '#081F3E' : 'transparent',
                  color: explorerView === 'tracks' ? '#FFFFFF' : '#475569',
                  boxShadow: explorerView === 'tracks' ? '0 4px 12px rgba(8,31,62,0.2)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Layers size={18} color={explorerView === 'tracks' ? '#F5A623' : '#64748B'} />
                Program Tracks &amp; Skill Set Roadmap
              </button>

              <button
                type="button"
                onClick={() => setExplorerView('catalog')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 22px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  background: explorerView === 'catalog' ? '#081F3E' : 'transparent',
                  color: explorerView === 'catalog' ? '#FFFFFF' : '#475569',
                  boxShadow: explorerView === 'catalog' ? '0 4px 12px rgba(8,31,62,0.2)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <BookOpen size={18} color={explorerView === 'catalog' ? '#F5A623' : '#64748B'} />
                Full Academic &amp; Degree Catalog
              </button>
            </div>
          </div>

          {/* VIEW A: TRACKS & SKILL SET ROADMAP */}
          {explorerView === 'tracks' && (
            <div>
              {/* Track Selection Tabs Bar */}
              <div 
                style={{
                  display: 'flex',
                  gap: '10px',
                  overflowX: 'auto',
                  paddingBottom: '12px',
                  marginBottom: '28px',
                  scrollbarWidth: 'thin'
                }}
              >
                {curriculumTracksData.map((track) => {
                  const isActive = track.id === activeTrackId;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => setActiveTrackId(track.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 20px',
                        borderRadius: '12px',
                        border: isActive ? '2px solid #F5A623' : '1px solid rgba(15,23,42,0.08)',
                        background: isActive ? '#081F3E' : '#FFFFFF',
                        color: isActive ? '#FFFFFF' : '#081F3E',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        boxShadow: isActive ? '0 6px 18px rgba(8,31,62,0.15)' : '0 2px 8px rgba(0,0,0,0.02)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {track.icon === 'server' && <Server size={18} color={isActive ? '#F5A623' : '#081F3E'} />}
                      {track.icon === 'shield' && <Shield size={18} color={isActive ? '#F5A623' : '#081F3E'} />}
                      {track.icon === 'database' && <Database size={18} color={isActive ? '#F5A623' : '#081F3E'} />}
                      {track.icon === 'code' && <Code size={18} color={isActive ? '#F5A623' : '#081F3E'} />}
                      {track.icon === 'smartphone' && <Smartphone size={18} color={isActive ? '#F5A623' : '#081F3E'} />}
                      <span>{track.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Track Header Showcase */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #081F3E 0%, #0F2F57 100%)',
                  borderRadius: '16px',
                  padding: '30px 32px',
                  color: '#FFFFFF',
                  marginBottom: '32px',
                  boxShadow: '0 12px 36px rgba(8,31,62,0.18)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '20px'
                }}
              >
                <div style={{ maxWidth: '750px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ 
                      background: 'rgba(245, 166, 35, 0.2)', 
                      color: '#F5A623', 
                      padding: '4px 12px', 
                      borderRadius: '4px', 
                      fontSize: '0.76rem', 
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {activeTrack.badge}
                    </span>
                    <span style={{ color: '#94A3B8', fontSize: '0.84rem', fontWeight: 600 }}>
                      ⏱️ Duration: <strong>{activeTrack.totalDuration}</strong>
                    </span>
                  </div>
                  <h2 style={{ color: '#FFFFFF', fontSize: '1.9rem', fontWeight: 900, margin: '6px 0 10px 0' }}>
                    {activeTrack.title}
                  </h2>
                  <p style={{ color: '#CBD5E1', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                    {activeTrack.summary}
                  </p>
                </div>

                <div>
                  <Link
                    href={`/admissions?degree=${encodeURIComponent(activeTrack.degreeLink)}&program=${encodeURIComponent(activeTrack.programParam)}#apply`}
                    className="btn btn-primary"
                    style={{
                      padding: '14px 24px',
                      fontSize: '0.95rem',
                      fontWeight: 900,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 6px 20px rgba(245,166,35,0.4)'
                    }}
                  >
                    Enroll in this Track <ArrowRight size={18} />
                  </Link>
                </div>
              </div>

              {/* Level-by-Level Syllabus Breakdown */}
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ color: '#081F3E', fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Layers size={22} color="#F5A623" /> Progressive Skill Set &amp; Level Curriculum
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {activeTrack.levels.map((lvl, lIdx) => {
                    const isBeginner = lvl.level.toLowerCase().includes('beginner');
                    const isProd = lvl.level.toLowerCase().includes('production') || lvl.level.toLowerCase().includes('enterprise') || lvl.level.toLowerCase().includes('industry');
                    const isIntermediate = lvl.level.toLowerCase().includes('intermediate');
                    
                    const badgeBg = isBeginner ? '#EFF6FF' : isIntermediate ? '#FEF3C7' : isProd ? '#ECFDF5' : '#F5F3FF';
                    const badgeColor = isBeginner ? '#1D4ED8' : isIntermediate ? '#B45309' : isProd ? '#047857' : '#6D28D9';
                    const borderColor = isBeginner ? '#BFDBFE' : isIntermediate ? '#FDE68A' : isProd ? '#A7F3D0' : '#DDD6FE';

                    return (
                      <div
                        key={lIdx}
                        className="premium-card"
                        style={{
                          background: '#FFFFFF',
                          borderRadius: '14px',
                          padding: '24px 28px',
                          border: '1px solid rgba(15,23,42,0.08)',
                          borderLeft: `5px solid ${badgeColor}`,
                          boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <span style={{
                              background: badgeBg,
                              color: badgeColor,
                              border: `1px solid ${borderColor}`,
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em'
                            }}>
                              Stage {lIdx + 1}: {lvl.level}
                            </span>
                            <h4 style={{ margin: 0, color: '#081F3E', fontSize: '1.2rem', fontWeight: 800 }}>
                              {lvl.stageName}
                            </h4>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '0.85rem', fontWeight: 700 }}>
                            <Clock size={16} color="#F5A623" />
                            <span>Duration: <strong>{lvl.duration}</strong></span>
                          </div>
                        </div>

                        <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '18px' }}>
                          {lvl.description}
                        </p>

                        <div>
                          <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#081F3E', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                            🛠️ Key Skills, Frameworks &amp; Tools Covered:
                          </span>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
                            {lvl.skills.map((skill, sIdx) => (
                              <div 
                                key={sIdx}
                                style={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: '8px',
                                  background: '#F8FAFC',
                                  border: '1px solid rgba(15,23,42,0.06)',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  fontSize: '0.84rem',
                                  color: '#1E293B',
                                  lineHeight: '1.45'
                                }}
                              >
                                <Check size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <span>{skill}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Industry Certifications (Optional) */}
              <div 
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '28px 30px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.03)',
                  marginBottom: '40px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <Award size={24} color="#F5A623" />
                  <div>
                    <h3 style={{ margin: 0, color: '#081F3E', fontSize: '1.25rem', fontWeight: 800 }}>
                      Industry Certifications (Optional / Recommended Validation)
                    </h3>
                    <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem' }}>
                      Prepare for internationally recognized credentials to bypass HR filters and validate production-readiness:
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                  {activeTrack.certifications.map((cert, cIdx) => (
                    <div
                      key={cIdx}
                      style={{
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '10px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <span style={{ 
                          fontSize: '0.72rem', 
                          fontWeight: 800, 
                          color: '#B45309', 
                          background: '#FEF3C7', 
                          padding: '2px 8px', 
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                          display: 'inline-block',
                          marginBottom: '8px'
                        }}>
                          {cert.issuer}
                        </span>
                        <h4 style={{ margin: '0 0 6px 0', color: '#081F3E', fontSize: '0.95rem', fontWeight: 800 }}>
                          {cert.title}
                        </h4>
                        {cert.notes && (
                          <p style={{ margin: 0, color: '#64748B', fontSize: '0.82rem', lineHeight: '1.45' }}>
                            {cert.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW B: ALL DEGREE & CERTIFICATION PROGRAMS CATALOG */}
          {explorerView === 'catalog' && (
            <div>
              {/* Filter & Search Bar */}
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  flexWrap: 'wrap', 
                  gap: '16px', 
                  background: '#FFFFFF', 
                  padding: '16px 20px', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(15,23,42,0.08)', 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  marginBottom: '36px' 
                }}
              >
                {/* Filter Buttons Swipable Pill Bar */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#081F3E', marginRight: '4px', whiteSpace: 'nowrap' }}>Department:</span>
                  
                  <button 
                    onClick={() => setSelectedSchool('all')}
                    style={{
                      background: selectedSchool === 'all' ? '#081F3E' : 'rgba(245, 166, 35, 0.08)',
                      color: selectedSchool === 'all' ? '#FFFFFF' : '#081F3E',
                      border: selectedSchool === 'all' ? '1px solid #081F3E' : '1px solid rgba(245, 166, 35, 0.3)',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    All Programs
                  </button>

                  <button 
                    onClick={() => setSelectedSchool('ENGINEERING')}
                    style={{
                      background: selectedSchool === 'ENGINEERING' ? '#081F3E' : 'rgba(245, 166, 35, 0.08)',
                      color: selectedSchool === 'ENGINEERING' ? '#FFFFFF' : '#081F3E',
                      border: selectedSchool === 'ENGINEERING' ? '1px solid #081F3E' : '1px solid rgba(245, 166, 35, 0.3)',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    School of Engineering &amp; Technology
                  </button>

                  <button 
                    onClick={() => setSelectedSchool('CERTIFICATION')}
                    style={{
                      background: selectedSchool === 'CERTIFICATION' ? '#081F3E' : 'rgba(245, 166, 35, 0.08)',
                      color: selectedSchool === 'CERTIFICATION' ? '#FFFFFF' : '#081F3E',
                      border: selectedSchool === 'CERTIFICATION' ? '1px solid #081F3E' : '1px solid rgba(245, 166, 35, 0.3)',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Professional Certifications
                  </button>
                </div>

                {/* Quick Course Search with Clear Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '220px', flexGrow: 1, maxWidth: '340px', position: 'relative' }}>
                  <label htmlFor="degree_course_search_input" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <Search size={16} color="#94A3B8" />
                  </label>
                  <input
                    id="degree_course_search_input"
                    name="degree_course_search_input"
                    aria-label="Quick course search"
                    type="text"
                    placeholder="Search software, fees, programs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      border: 'none',
                      borderBottom: '1px solid rgba(15,23,42,0.15)',
                      padding: '6px 24px 6px 8px',
                      fontSize: '14px',
                      outline: 'none',
                      background: 'transparent',
                      width: '100%',
                      color: '#081F3E'
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                      style={{
                        position: 'absolute',
                        right: 0,
                        background: 'none',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Courses Catalog Grid */}
              <div className="grid-3" style={{ alignItems: 'stretch', gap: '28px' }}>
                {filteredPrograms.length > 0 ? (
                  filteredPrograms.map((prog) => (
                    <div 
                      key={prog.id} 
                      className="premium-card" 
                      style={{ 
                        borderRadius: '16px', 
                        padding: '30px 26px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'space-between',
                        background: '#FFFFFF',
                        border: '1px solid rgba(15, 23, 42, 0.08)',
                        borderTop: prog.featured ? '4px solid #F5A623' : '1px solid rgba(15, 23, 42, 0.08)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div>
                        {/* School / Category Badge */}
                        <span style={{ 
                          display: 'inline-block', 
                          background: '#FEF3C7', 
                          color: '#B45309', 
                          padding: '4px 10px', 
                          borderRadius: '4px', 
                          fontFamily: 'var(--font-mono)', 
                          fontSize: '0.7rem', 
                          fontWeight: 800, 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.06em', 
                          marginBottom: '16px' 
                        }}>
                          {prog.school}
                        </span>

                        {/* Program Title */}
                        <h3 style={{ color: '#081F3E', fontSize: '1.25rem', fontWeight: 800, lineHeight: '1.35', marginBottom: '12px' }}>
                          {prog.title}
                        </h3>

                        {/* Program Description */}
                        <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: '1.65', marginBottom: '22px' }}>
                          {prog.desc}
                        </p>

                        {/* Metadata Grid */}
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: '1fr 1fr 1fr', 
                          gap: '8px 12px', 
                          fontSize: '0.85rem', 
                          color: '#475569',
                          borderTop: '1px solid rgba(15, 23, 42, 0.06)',
                          paddingTop: '16px',
                          marginBottom: '20px'
                        }}>
                          <div>
                            <span>Level: <strong>{prog.degree}</strong></span>
                          </div>
                          <div>
                            <span>Duration: <strong>{prog.duration}</strong></span>
                          </div>
                          <div>
                            <span>Tuition: <strong style={{ color: '#081F3E' }}>{prog.tuition}</strong></span>
                          </div>
                        </div>

                        {/* Tech & Skill Tags */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                          {prog.tags.map((tag, tIdx) => (
                            <span 
                              key={tIdx} 
                              style={{
                                display: 'inline-block',
                                background: '#081F3E',
                                color: '#F8FAFC',
                                padding: '4px 12px',
                                borderRadius: '16px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                letterSpacing: '0.02em'
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Enroll Action Button */}
                      <Link 
                        href={`/admissions?degree=${encodeURIComponent(prog.degree)}&program=${encodeURIComponent(prog.title)}#apply`}
                        className="btn" 
                        style={{ 
                          background: '#F5A623', 
                          color: '#081F3E', 
                          width: '100%', 
                          padding: '12px 16px', 
                          borderRadius: '8px', 
                          fontWeight: 800, 
                          fontSize: '0.92rem', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: '8px', 
                          textDecoration: 'none', 
                          boxShadow: '0 4px 14px rgba(245, 166, 35, 0.35)', 
                          transition: 'all 0.2s ease' 
                        }}
                      >
                        Enroll <ArrowRight size={16} />
                      </Link>
                    </div>
                  ))
                ) : (
                  <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '60px 0', color: '#64748B' }}>
                    <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No programs match your search criteria.</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </section>

      </div>
    </main>
  );
}
