export interface CareerOutcomeItem {
  title: string;
  description: string;
  responsibilities: string[];
  averageSalary: string;
}

export interface CourseModuleItem {
  code: string;
  title: string;
  description: string;
  topics: string[];
}

export interface CurriculumLevelItem {
  levelName: string;
  modules: CourseModuleItem[];
}

export interface ProgramDetail {
  slug: string;
  categorySlug: string;
  title: string;
  degreeType: string;
  deliveryFormat: string;
  summary: string;
  heroQuote: {
    text: string;
    author: string;
    title: string;
  };
  heroImage: string;
  duration: string;
  tuition: string;
  applicationFee: string;
  tuitionInstallments: string;
  campus: string;
  intakes: string;
  overviewTitle: string;
  overviewText: string;
  careerOutcomes: CareerOutcomeItem[];
  admissionRequirements: {
    toApply: string[];
    conditional: string[];
  };
  curriculum: CurriculumLevelItem[];
  skillsAndSupport: {
    title: string;
    description: string;
    bullets: string[];
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface ProgramCategory {
  slug: string;
  name: string;
  bannerImage: string;
  tagline: string;
  overviewText: string;
  programs: ProgramDetail[];
}

export const PROGRAM_CATEGORIES: Record<string, ProgramCategory> = {
  // ==========================================
  // 1. HND PROGRAMS (All 250,000 FRS)
  // ==========================================
  'hnd': {
    slug: 'hnd',
    name: 'HND Programs',
    bannerImage: '/assets/images/female_student_practical_guide.jpg',
    tagline: 'Ministry-accredited 2-year technical diplomas built for high-demand engineering, design, and technology careers.',
    overviewText: 'Our Higher National Diploma (HND) faculty combines rigorous academic standards with intensive production lab training at our Bakweri Town campus. Earn an official Cameroon Ministry of Higher Education (MINESUP) diploma while building real-world software, enterprise networks, and digital marketing systems in Buea.',
    programs: [
      {
        slug: 'software-engineering',
        categorySlug: 'hnd',
        title: 'Higher National Diploma (HND) in Software Engineering',
        degreeType: 'HND (2 Years)',
        deliveryFormat: '100% On-Campus',
        summary: 'A 2-year accredited diploma covering full-stack web development, Python backends, TypeScript architectures, relational databases, and enterprise software engineering at our Bakweri Town Campus.',
        heroQuote: {
          text: 'The practical coding labs and real-world team projects at Liah gave me the exact skills and confidence to land a software developer role within 3 months of graduation.',
          author: 'Elvis Tabi',
          title: 'Fullstack Engineer at FinTech Corp / Liah Alumnus'
        },
        heroImage: '/assets/images/male_student_laptop.jpg',
        duration: '2 Years (4 Semesters)',
        tuition: '250,000 FRS / Year',
        applicationFee: '15,000 FRS',
        tuitionInstallments: 'Payable in Flexible Installments',
        campus: 'Bakweri Town Campus, Buea',
        intakes: 'October (Fall) / February (Spring)',
        overviewTitle: 'Become the Engineer Who Architects Scalable Software',
        overviewText: 'Develop the technical precision and problem-solving judgment to build high-performance software applications. Through applied production labs at Bakweri Town, you will strengthen expertise in full-stack architecture, relational and NoSQL databases, RESTful APIs, Git workflows, and cloud deployments.',
        careerOutcomes: [
          {
            title: 'Full-Stack Software Engineer',
            description: 'Design and implement end-to-end web and cloud applications using modern frameworks and reactive architectures.',
            responsibilities: [
              'Build responsive frontends with React, Next.js, and TypeScript',
              'Develop secure RESTful and GraphQL APIs with Node.js and Python',
              'Optimize database queries and handle distributed data storage'
            ],
            averageSalary: '3,600,000 – 9,000,000 FRS / Year'
          },
          {
            title: 'Backend & API Developer',
            description: 'Architect scalable server-side systems, microservices, authentication protocols, and database transactions.',
            responsibilities: [
              'Design high-throughput microservices in Go, Python, or Node.js',
              'Integrate third-party payment gateways and webhook services',
              'Manage data modeling and caching with PostgreSQL and Redis'
            ],
            averageSalary: '4,000,000 – 10,000,000 FRS / Year'
          }
        ],
        admissionRequirements: {
          toApply: [
            'Non-refundable Application Fee: 15,000 FRS (MTN MoMo or on-campus)',
            'Completed Application Form',
            'Official GCE Advanced Level Certificate (at least 2 papers) or Baccalauréat equivalent',
            'Certified copy of National Identity Card or Birth Certificate',
            '2 Recent Passport-sized Photographs'
          ],
          conditional: [
            'Candidates awaiting GCE A-Level results may receive conditional admission pending official release.',
            'Direct 2nd Year Entry is available for candidates with accredited ND or equivalent university coursework.'
          ]
        },
        curriculum: [
          {
            levelName: 'Level 100 (Year 1)',
            modules: [
              {
                code: 'SWE 101',
                title: 'Modern Web Architecture & TypeScript',
                description: 'Foundations of web systems, semantic HTML5, modern CSS3/Tailwind, JavaScript ES6+, TypeScript type systems, and responsive component design.',
                topics: ['DOM Manipulation', 'TypeScript Generics', 'Responsive Layouts', 'REST Integrations']
              },
              {
                code: 'SWE 102',
                title: 'Data Structures & Algorithms in Python',
                description: 'Core algorithmic problem solving, time/space complexity analysis, arrays, linked lists, stacks, queues, trees, and hash tables.',
                topics: ['Big-O Notation', 'Tree Traversal', 'Dynamic Programming', 'Sorting Algorithms']
              }
            ]
          },
          {
            levelName: 'Level 200 (Year 2)',
            modules: [
              {
                code: 'SWE 201',
                title: 'Full-Stack React & Next.js Frameworks',
                description: 'Building server-rendered and static web applications, server components, state management, caching, and edge middleware.',
                topics: ['Next.js App Router', 'React Server Components', 'Zustand State', 'API Routes']
              },
              {
                code: 'SWE 202',
                title: 'Capstone Enterprise Engineering Project',
                description: 'Students collaborate in teams under senior industry mentors in our labs to build, test, and deploy a production-ready application.',
                topics: ['Agile Sprints', 'CI/CD Pipelines', 'Code Reviews', 'Live Production Release']
              }
            ]
          }
        ],
        skillsAndSupport: [
          {
            title: 'Real-World Software Engineering Education',
            description: 'Build real portfolio applications from day one in our Bakweri Town Campus with 24/7 power backup and dedicated fiber optic connectivity.',
            bullets: [
              'Collaborate on GitHub with professional pull requests and code reviews',
              'Deploy production apps to AWS, Vercel, and dedicated Linux servers',
              'Participate in semester hackathons and Silicon Mountain developer demo days'
            ]
          },
          {
            title: 'Dedicated Career Services & Tech Mentorship',
            description: 'Access seasoned tech leads and software architects who prepare you for global tech opportunities and corporate technical placements.',
            bullets: [
              '1-on-1 resume optimization and GitHub portfolio showcases',
              'Mock technical coding interviews and systems design reviews',
              'Direct apprenticeship referrals to partner software companies in Cameroon and abroad'
            ]
          }
        ],
        faqs: [
          {
            question: 'What qualification do I receive upon graduation?',
            answer: 'You will receive the official Cameroon Ministry of Higher Education (MINESUP) Higher National Diploma (HND) in Software Engineering.'
          },
          {
            question: 'Where do classes take place?',
            answer: 'All lectures and practical lab sessions take place exclusively at our physical campus in Bakweri Town, Buea.'
          }
        ]
      },

      {
        slug: 'web-graphic-design',
        categorySlug: 'hnd',
        title: 'Higher National Diploma (HND) in Web & Graphic Design',
        degreeType: 'HND (2 Years)',
        deliveryFormat: '100% On-Campus',
        summary: 'A 2-year accredited program blending modern UI/UX design, Figma design systems, corporate branding, Adobe Creative Suite, and responsive web development in our Buea campus studios.',
        heroQuote: {
          text: 'Designing real client brands and coding responsive interactive sites gave me a killer portfolio that clients immediately trusted.',
          author: 'Brice Nde',
          title: 'Senior UI/UX Designer / Alumnus'
        },
        heroImage: '/assets/images/image_3.jpg',
        duration: '2 Years (4 Semesters)',
        tuition: '250,000 FRS / Year',
        applicationFee: '15,000 FRS',
        tuitionInstallments: 'Payable in Flexible Installments',
        campus: 'Bakweri Town Campus, Buea',
        intakes: 'October & February',
        overviewTitle: 'Become the Designer Who Shapes Digital Experiences',
        overviewText: 'Master user research, wireframing, high-fidelity prototypes, brand identity guidelines, and responsive web publishing in our creative design lab.',
        careerOutcomes: [
          {
            title: 'UI/UX Product Designer',
            description: 'Design intuitive digital apps and web experiences with user flows, wireframes, and interactive Figma prototypes.',
            responsibilities: ['User journey mapping', 'Design systems & component libraries', 'Usability testing'],
            averageSalary: '3,000,000 – 7,500,000 FRS / Year'
          },
          {
            title: 'Frontend Web Designer',
            description: 'Translate visual designs into clean, responsive HTML, CSS, JavaScript, and Tailwind web code.',
            responsibilities: ['Responsive web development', 'Cross-browser testing', 'SEO and performance optimization'],
            averageSalary: '3,000,000 – 7,000,000 FRS / Year'
          }
        ],
        admissionRequirements: {
          toApply: [
            'Non-refundable Application Fee: 15,000 FRS (MTN MoMo or on-campus)',
            'Completed Application Form', 'GCE Advanced Level (2 papers) or equivalent', '2 Passport Photos', 'Copy of National ID'],
          conditional: ['No prior design portfolio required for entry.']
        },
        curriculum: [
          {
            levelName: 'Level 100: Design Fundamentals & Figma Prototyping',
            modules: [
              {
                code: 'DSG 101',
                title: 'UI/UX Principles & Figma Design Systems',
                description: 'Color theory, typography, spacing grids, auto-layout, components, and interactive prototypes.',
                topics: ['Figma Auto-Layout', 'Design Systems', 'Wireframing', 'User Flows']
              }
            ]
          },
          {
            levelName: 'Level 200: Responsive Frontend & Brand Identity',
            modules: [
              {
                code: 'DSG 201',
                title: 'Responsive Web Design with HTML, CSS & JavaScript',
                description: 'Building custom responsive websites, CSS Grid, animations, and CMS integrations.',
                topics: ['Tailwind CSS', 'JavaScript Interactions', 'Portfolio Web Build']
              }
            ]
          }
        ],
        skillsAndSupport: [
          {
            title: 'Portfolio Showcase from Day One',
            description: 'Graduate with a complete Behance, Dribbble, and personal live portfolio website.',
            bullets: ['Figma to code translation', 'Client brand identity packages', 'UX case studies']
          }
        ],
        faqs: [
          {
            question: 'Do I need expensive software to participate?',
            answer: 'No! We provide full access to lab design suites, Figma, Adobe tools, and high-resolution workstations at our Bakweri Town campus.'
          }
        ]
      },

      {
        slug: 'digital-marketing',
        categorySlug: 'hnd',
        title: 'Higher National Diploma (HND) in Digital Marketing & E-Commerce',
        degreeType: 'HND (2 Years)',
        deliveryFormat: '100% On-Campus',
        summary: 'Master performance advertising, Search Engine Optimization (SEO), growth funnels, social media management, data analytics, and digital brand scaling on campus in Buea.',
        heroQuote: {
          text: 'Learning how to run profitable Meta ads and rank websites on Google helped me scale e-commerce brands across West and Central Africa.',
          author: 'Kelly Forchu',
          title: 'Growth Marketing Lead / Graduate'
        },
        heroImage: '/assets/images/female_student_practical_guide.jpg',
        duration: '2 Years (4 Semesters)',
        tuition: '250,000 FRS / Year',
        applicationFee: '15,000 FRS',
        tuitionInstallments: 'Payable in Flexible Installments',
        campus: 'Bakweri Town Campus, Buea',
        intakes: 'October & February',
        overviewTitle: 'Drive Revenue and Growth Through Modern Digital Channels',
        overviewText: 'Learn to build and execute high-converting digital marketing campaigns, analyze customer acquisition costs (CAC), manage online storefronts, and master search engine dominance in our marketing labs.',
        careerOutcomes: [
          {
            title: 'Digital Marketing Strategist',
            description: 'Plan, execute, and scale multi-channel acquisition funnels for corporate brands and tech startups.',
            responsibilities: ['Paid advertising (Google/Meta/TikTok)', 'Analytics tracking and conversion optimization', 'Email marketing automation'],
            averageSalary: '3,000,000 – 7,500,000 FRS / Year'
          },
          {
            title: 'E-Commerce Manager',
            description: 'Manage online stores, product catalogs, customer retention funnels, and payment gateways.',
            responsibilities: ['Shopify & WooCommerce management', 'Inventory forecasting and pricing strategy', 'Checkout conversion rate optimization'],
            averageSalary: '3,500,000 – 8,000,000 FRS / Year'
          }
        ],
        admissionRequirements: {
          toApply: [
            'Non-refundable Application Fee: 15,000 FRS (MTN MoMo or on-campus)',
            'Completed Application Form', 'GCE Advanced Level (2 papers) or equivalent', '2 Passport Photos', 'Copy of National ID'],
          conditional: ['Business and marketing bridging fundamentals provided.']
        },
        curriculum: [
          {
            levelName: 'Level 100: Digital Marketing Foundations & Content Strategy',
            modules: [
              {
                code: 'MKT 101',
                title: 'Search Engine Optimization (SEO) & Copywriting',
                description: 'On-page SEO, technical audits, keyword research, backlink strategies, and persuasive copywriting.',
                topics: ['Google Search Console', 'Ahrefs/SEMrush', 'Keyword Clustering', 'Sales Copy']
              }
            ]
          },
          {
            levelName: 'Level 200: Paid Performance Media & E-Commerce Infrastructure',
            modules: [
              {
                code: 'MKT 201',
                title: 'Meta Ads, Google Ads & Data Analytics',
                description: 'Managing ad budgets, conversion tracking, Google Analytics 4 (GA4), and automated email funnels.',
                topics: ['Meta Pixel Tracking', 'Google Tag Manager', 'Klaviyo Email Automation', 'ROAS Optimization']
              }
            ]
          }
        ],
        skillsAndSupport: [
          {
            title: 'Live Ad Budget Practice',
            description: 'Students run live test campaigns with real budgets on partner brands in Buea.',
            bullets: ['Google & Meta Ads Certifications', 'Real e-commerce store launches']
          }
        ],
        faqs: [
          {
            question: 'Are practical ad campaigns included?',
            answer: 'Yes, students manage real ad campaigns and analytics tracking in our Bakweri Town Campus.'
          }
        ]
      },

      {
        slug: 'network-maintenance',
        categorySlug: 'hnd',
        title: 'Higher National Diploma (HND) in Network & Maintenance',
        degreeType: 'HND (2 Years)',
        deliveryFormat: '100% On-Campus',
        summary: 'Comprehensive hands-on training in enterprise computer networking, Cisco routing & switching, Linux server maintenance, hardware diagnostics, and fiber optic cabling.',
        heroQuote: {
          text: 'The physical hardware labs and Cisco networking setups gave me the exact hands-on experience needed for enterprise IT infrastructure.',
          author: 'Gael Forba',
          title: 'Systems & Network Engineer / Alumnus'
        },
        heroImage: '/assets/images/image_4.jpg',
        duration: '2 Years (4 Semesters)',
        tuition: '250,000 FRS / Year',
        applicationFee: '15,000 FRS',
        tuitionInstallments: 'Payable in Flexible Installments',
        campus: 'Bakweri Town Campus, Buea',
        intakes: 'October & February',
        overviewTitle: 'Master Enterprise Networking and Hardware Infrastructure',
        overviewText: 'Master computer architecture, network design, server clustering, hardware diagnostics, and telecommunication principles in our dedicated campus tech labs at Bakweri Town.',
        careerOutcomes: [
          {
            title: 'Network & Systems Administrator',
            description: 'Configure and maintain enterprise switches, routers, firewalls, and server infrastructure.',
            responsibilities: ['Cisco routing & switching', 'Server virtualization (VMware/Proxmox)', 'Network troubleshooting'],
            averageSalary: '3,200,000 – 8,500,000 FRS / Year'
          },
          {
            title: 'Hardware & Infrastructure Specialist',
            description: 'Manage corporate hardware setups, enterprise backups, power systems, and physical connectivity.',
            responsibilities: ['Hardware diagnostics & upgrades', 'Fiber optic cabling & testing', 'Disaster recovery'],
            averageSalary: '3,000,000 – 7,500,000 FRS / Year'
          }
        ],
        admissionRequirements: {
          toApply: [
            'Non-refundable Application Fee: 15,000 FRS (MTN MoMo or on-campus)',
            'Completed Application Form', 'GCE Advanced Level (2 papers) or equivalent diploma', '2 Passport Photos', 'Copy of National ID'],
          conditional: ['Bridging hardware basics module available for incoming students.']
        },
        curriculum: [
          {
            levelName: 'Level 100: Computer Architecture & Network Fundamentals',
            modules: [
              {
                code: 'ENG 101',
                title: 'Hardware Architecture & Maintenance',
                description: 'Motherboard architectures, processors, memory buses, power supply diagnostics, and operating system installations.',
                topics: ['Hardware Diagnostics', 'Motherboards & CPUs', 'BIOS/UEFI Configuration']
              }
            ]
          },
          {
            levelName: 'Level 200: Enterprise Cisco Routing & Linux Servers',
            modules: [
              {
                code: 'ENG 201',
                title: 'Cisco Routing, Switching & Network Security',
                description: 'VLANs, OSPF, BGP, NAT, access control lists, and wireless network administration.',
                topics: ['Cisco CCNA Prep', 'VLAN Configuration', 'Server Virtualization']
              }
            ]
          }
        ],
        skillsAndSupport: [
          {
            title: 'Hardware & Cisco Lab Access',
            description: 'Hands-on practice on real physical Cisco switches, server racks, and testing equipment.',
            bullets: ['Cisco CCNA and CompTIA Network+ preparation', 'Practical fiber optic splicing and cabling labs']
          }
        ],
        faqs: [
          {
            question: 'Are physical lab sessions required?',
            answer: 'Yes! All classes and hardware diagnostics take place in our dedicated physics and networking labs in Bakweri Town.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // 2. CERTIFICATION PROGRAMS (Industrial Web Design: 300,000 FRS | Others: 350,000 FRS)
  // ==========================================
  'certifications': {
    slug: 'certifications',
    name: 'Certification Programs',
    bannerImage: '/assets/images/campus_students_liah_shirts.jpg',
    tagline: 'Intensive professional certification tracks designed for rapid practical upskilling and career mastery in Buea.',
    overviewText: 'Liah Academy’s professional IT certifications provide fast-track career acceleration. Master Data Science, DevOps Engineering, Industrial Web Design, and Digital Marketing & SEO through high-intensity, project-first training in our Bakweri Town Campus in 6 to 9 months.',
    programs: [
      {
        slug: 'data-science',
        categorySlug: 'certifications',
        title: 'Professional Certification in Data Science & Machine Learning',
        degreeType: 'Certification (9 Months)',
        deliveryFormat: '100% On-Campus',
        summary: 'An advanced data engineering track spanning Python data analysis, Pandas, SQL data warehousing, machine learning models, and PowerBI analytics in our Buea computer labs.',
        heroQuote: {
          text: 'Working with live datasets and deploying production ML models gave me a strong portfolio that made interviews effortless.',
          author: 'Sarah Mbella',
          title: 'Data Analyst at TechVentures / Graduate'
        },
        heroImage: '/assets/images/campus_students_liah_shirts.jpg',
        duration: '9 Months (Intensive)',
        tuition: '350,000 FRS',
        applicationFee: '25,000 FRS',
        tuitionInstallments: 'Payable in Flexible Installments',
        campus: 'Bakweri Town Campus, Buea',
        intakes: 'Quarterly (Jan, Apr, Jul, Oct)',
        overviewTitle: 'Turn Complex Data into High-Value Business Intelligence',
        overviewText: 'Master data cleaning, exploratory data analysis, statistical modeling, machine learning deployment, and interactive executive dashboards in our Bakweri Town labs.',
        careerOutcomes: [
          {
            title: 'Data Scientist / ML Engineer',
            description: 'Train and deploy machine learning models to solve business forecasting problems.',
            responsibilities: ['Scikit-Learn & PyTorch modeling', 'Feature engineering & data cleaning', 'Deploy ML APIs with FastAPI'],
            averageSalary: '4,200,000 – 11,000,000 FRS / Year'
          }
        ],
        admissionRequirements: {
          toApply: ['Application Form', 'High School or University Certificate', 'Copy of National ID', '2 Passport Photos'],
          conditional: ['Python and math review provided at course commencement.']
        },
        curriculum: [
          {
            levelName: 'Phase 1: Python Data Analysis & Data Warehousing',
            modules: [
              {
                code: 'DS 101',
                title: 'Data Wrangling with Pandas & Advanced SQL',
                description: 'Data cleaning, feature scaling, window functions, and database query optimization.',
                topics: ['Pandas & NumPy', 'SQL Window Functions', 'Data Visualization']
              }
            ]
          }
        ],
        skillsAndSupport: [
          {
            title: 'Real-World Data Pipelines',
            description: 'Work on actual datasets from African and international financial and tech enterprises.',
            bullets: ['Publish data portfolio on GitHub & Kaggle', 'End-to-end ML project deployment']
          }
        ],
        faqs: [
          {
            question: 'What is the tuition fee?',
            answer: 'The total tuition fee for Data Science & Machine Learning is 350,000 FRS, payable in flexible installments.'
          }
        ]
      },

      {
        slug: 'devops',
        categorySlug: 'certifications',
        title: 'Professional Certification in DevOps & Cloud Infrastructure',
        degreeType: 'Certification (9 Months)',
        deliveryFormat: '100% On-Campus',
        summary: 'Comprehensive pipeline engineering covering Docker, Kubernetes, GitHub Actions, Terraform IaC, Prometheus observability, and Cloud Systems in our Buea server labs.',
        heroQuote: {
          text: 'The fiber optic labs and 24/7 power backup meant zero downtime during our semester hackathons. Top-tier mentors who manage production cloud systems.',
          author: 'Nathalie Ewane',
          title: 'DevOps Apprentice & Cloud Admin'
        },
        heroImage: '/assets/images/female_student_practical_guide.jpg',
        duration: '9 Months (Modular)',
        tuition: '350,000 FRS',
        applicationFee: '25,000 FRS',
        tuitionInstallments: 'Payable in Flexible Installments',
        campus: 'Bakweri Town Campus, Buea',
        intakes: 'Quarterly',
        overviewTitle: 'Become the Cloud Systems Engineer Powering Global Scale',
        overviewText: 'Learn to manage highly resilient, distributed cloud microservices at scale and orchestrate automatic, high-speed software release engines in our Bakweri Town terminal labs.',
        careerOutcomes: [
          {
            title: 'DevOps / Cloud Engineer',
            description: 'Build automated CI/CD pipelines and manage cloud infrastructure for software teams.',
            responsibilities: ['Configure Docker & Kubernetes', 'Write Terraform scripts', 'Automate GitHub Actions'],
            averageSalary: '4,500,000 – 12,000,000 FRS / Year'
          }
        ],
        admissionRequirements: {
          toApply: ['Application Form', 'Basic computer/coding knowledge', 'Copy of National ID', '2 Passport Photos'],
          conditional: ['Linux and networking prep module provided for beginners.']
        },
        curriculum: [
          {
            levelName: 'Phase 1: Linux, Containers & CI/CD Pipelines',
            modules: [
              {
                code: 'DEV 101',
                title: 'Docker Containerization & GitHub Actions',
                description: 'Writing Dockerfiles, multi-stage builds, registry management, and automated test-and-deploy pipelines.',
                topics: ['Docker Engine', 'GitHub Actions', 'Jenkins', 'SonarQube']
              }
            ]
          }
        ],
        skillsAndSupport: [
          {
            title: 'Enterprise Cloud Labs',
            description: 'Build and deploy on live clusters with production domain names and SSL certs.',
            bullets: ['Hands-on CKA and AWS exam readiness', 'Real-world incident simulation and rollbacks']
          }
        ],
        faqs: [
          {
            question: 'What is the tuition fee?',
            answer: 'The total tuition fee for DevOps & Cloud Infrastructure is 350,000 FRS, payable in flexible installments.'
          }
        ]
      },

      {
        slug: 'industrial-web-design',
        categorySlug: 'certifications',
        title: 'Professional Certification in Industrial Web Design',
        degreeType: 'Certification (6 Months)',
        deliveryFormat: '100% On-Campus',
        summary: 'Fast-track practical web design mastering HTML5, CSS3, Tailwind CSS, JavaScript ES6, WordPress CMS, and high-converting commercial web portals.',
        heroQuote: {
          text: 'Within 4 months of enrolling in the web design certification, I designed and delivered 5 client websites with custom domains.',
          author: 'David Ndumbe',
          title: 'Freelance Web Designer / Graduate'
        },
        heroImage: '/assets/images/image_1.jpg',
        duration: '6 Months (Fast-Track)',
        tuition: '300,000 FRS',
        applicationFee: '25,000 FRS',
        tuitionInstallments: 'Payable in Flexible Installments',
        campus: 'Bakweri Town Campus, Buea',
        intakes: 'Monthly & Quarterly',
        overviewTitle: 'Build Modern Commercial Websites for Businesses Worldwide',
        overviewText: 'Learn to design, develop, deploy, and maintain robust business websites, e-commerce storefronts, and responsive web portals in our computer labs in Buea.',
        careerOutcomes: [
          {
            title: 'Commercial Web Designer & Developer',
            description: 'Build responsive business websites, landing pages, and interactive CMS portals.',
            responsibilities: ['Custom web development', 'Client requirements analysis', 'Domain and hosting management'],
            averageSalary: '2,500,000 – 6,000,000 FRS / Year'
          }
        ],
        admissionRequirements: {
          toApply: ['Application Form', 'Basic computer literacy', 'Copy of National ID', '2 Passport Photos'],
          conditional: ['Open to all students, graduates, and professionals.']
        },
        curriculum: [
          {
            levelName: 'Phase 1: Modern HTML5, CSS3 & Responsive Design',
            modules: [
              {
                code: 'IWD 101',
                title: 'Responsive Web Architecture & Tailwind',
                description: 'Modern layouts, flexbox, CSS grid, mobile-first design, and interactive UI styling.',
                topics: ['Flexbox & Grid', 'Tailwind CSS', 'Mobile First Design']
              }
            ]
          }
        ],
        skillsAndSupport: [
          {
            title: 'Live Client Deliverables',
            description: 'Build 3 production websites for local businesses during the program.',
            bullets: ['Hosting and DNS setup', 'SEO metadata optimization', 'Client proposal writing']
          }
        ],
        faqs: [
          {
            question: 'What is the tuition fee for Industrial Web Design?',
            answer: 'The total tuition fee for Industrial Web Design is 300,000 FRS, payable in flexible installments.'
          }
        ]
      },

      {
        slug: 'digital-marketing-seo',
        categorySlug: 'certifications',
        title: 'Professional Certification in Digital Marketing & SEO',
        degreeType: 'Certification (6 Months)',
        deliveryFormat: '100% On-Campus',
        summary: 'Master search engine optimization, Google Analytics 4, Meta advertising, sales copywriting, and conversion rate optimization (CRO) at our Bakweri Town Campus.',
        heroQuote: {
          text: 'The SEO and paid ads certification helped me grow our agency clients by over 300% in organic search traffic.',
          author: 'Mercy Akum',
          title: 'Digital Marketing Consultant'
        },
        heroImage: '/assets/images/two_students_laptop_guide.jpg',
        duration: '6 Months (Practical)',
        tuition: '350,000 FRS',
        applicationFee: '25,000 FRS',
        tuitionInstallments: 'Payable in Flexible Installments',
        campus: 'Bakweri Town Campus, Buea',
        intakes: 'Quarterly',
        overviewTitle: 'Dominate Search Engines and Drive Predictable Customer Acquisition',
        overviewText: 'Learn to rank websites at the top of Google, run high-ROI paid ad campaigns, and build automated lead generation funnels in our marketing labs at Bakweri Town.',
        careerOutcomes: [
          {
            title: 'SEO & Growth Marketing Specialist',
            description: 'Optimize search rankings, execute keyword strategies, and manage corporate marketing campaigns.',
            responsibilities: ['Technical SEO audits', 'Google Search rankings', 'Ad campaign management'],
            averageSalary: '2,500,000 – 6,500,000 FRS / Year'
          }
        ],
        admissionRequirements: {
          toApply: ['Application Form', 'Copy of ID / Birth Certificate', '2 Passport Photos'],
          conditional: ['No previous marketing background required.']
        },
        curriculum: [
          {
            levelName: 'Phase 1: Search Engine Optimization & Paid Ads',
            modules: [
              {
                code: 'SEO 101',
                title: 'Technical SEO, Keyword Research & Meta Ads',
                description: 'On-page SEO, schema markup, Google Ads search campaigns, and Meta advertising funnels.',
                topics: ['Google Search Console', 'Technical Audits', 'Meta Ads Manager']
              }
            ]
          }
        ],
        skillsAndSupport: [
          {
            title: 'Certified Marketer Credentials',
            description: 'Prepare for official Google Ads, Google Analytics (GA4), and HubSpot Inbound certifications.',
            bullets: ['Google Search Certification', 'Meta Certified Digital Associate']
          }
        ],
        faqs: [
          {
            question: 'What is the tuition fee?',
            answer: 'The total tuition fee for Digital Marketing & SEO is 350,000 FRS, payable in flexible installments.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // 3. ND PROGRAMS (All 150,000 FRS)
  // ==========================================
  'nd': {
    slug: 'nd',
    name: 'ND Programs',
    bannerImage: '/assets/images/image_4.jpg',
    tagline: 'Comprehensive foundational and vocational diplomas providing hands-on practical technical mastery at Bakweri Town.',
    overviewText: 'Our National Diploma (ND) faculty offers accessible, high-impact vocational and foundational diplomas in Buea. Build career-ready competencies in Computer Engineering, ICT, Web Design, Graphic Design & Printing, Basic Computer, Office Automation Secretaryship, and Computerized Accounting for just 150,000 FRS.',
    programs: [
      {
        slug: 'computer-engineering',
        categorySlug: 'nd',
        title: 'National Diploma (ND) in Computer Engineering',
        degreeType: 'ND (1 Year)',
        deliveryFormat: '100% On-Campus',
        summary: 'Foundational computer hardware architecture, system assembly, electronic diagnostics, microcontrollers, and computer maintenance in our Buea workbench labs.',
        heroQuote: {
          text: 'The hardware assembly and diagnostics labs in Buea gave me the exact hands-on troubleshooting skills I needed.',
          author: 'Samuel Enow',
          title: 'Computer Maintenance Tech / Graduate'
        },
        heroImage: '/assets/images/image_4.jpg',
        duration: '1 Year (2 Semesters)',
        tuition: '150,000 FRS / Year',
        applicationFee: '15,000 FRS',
        tuitionInstallments: 'Payable in Flexible Installments',
        campus: 'Bakweri Town Campus, Buea',
        intakes: 'October & February',
        overviewTitle: 'Build Practical Hardware Assembly & Systems Engineering Skills',
        overviewText: 'Master computer hardware assembly, circuit testing, processor architectures, BIOS configuration, and preventative system maintenance in our physical labs in Bakweri Town.',
        careerOutcomes: [
          {
            title: 'Computer Hardware Technician',
            description: 'Diagnose, repair, and maintain computer systems, motherboards, power units, and peripheral devices.',
            responsibilities: ['Hardware diagnostics', 'System upgrades', 'Preventative maintenance'],
            averageSalary: '2,000,000 – 4,500,000 FRS / Year'
          }
        ],
        admissionRequirements: {
          toApply: ['Application Form', 'GCE Ordinary / Advanced Level or equivalent', '2 Passport Photos', 'Copy of National ID'],
          conditional: ['Practical technical aptitude test included on orientation.']
        },
        curriculum: [
          {
            levelName: 'Year 1: Hardware Engineering & Assembly Basics',
            modules: [
              {
                code: 'NDE 101',
                title: 'Computer Architecture, Assembly & Diagnostics',
                description: 'Component testing, power supplies, motherboard socket configurations, RAM modules, and storage devices.',
                topics: ['PC Assembly', 'Hardware Troubleshooting', 'OS Installation']
              }
            ]
          }
        ],
        skillsAndSupport: [
          {
            title: 'Hands-On Hardware Workbench',
            description: 'Direct access to diagnostic multimeters, soldering stations, and disassembled computer test benches.',
            bullets: ['Physical PC build projects', 'Enterprise hardware maintenance']
          }
        ],
        faqs: [
          {
            question: 'What is the tuition fee?',
            answer: 'The tuition fee is 150,000 FRS for the full ND program, payable in flexible installments.'
          }
        ]
      },

      {
        slug: 'ict',
        categorySlug: 'nd',
        title: 'National Diploma (ND) in Information & Communication Technology (ICT)',
        degreeType: 'ND (1 Year)',
        deliveryFormat: '100% On-Campus',
        summary: 'Comprehensive ICT training covering computer systems, local networking, office applications, databases, and IT support fundamentals.',
        heroQuote: {
          text: 'The ICT diploma opened direct doors for corporate IT support roles across banking and educational institutions.',
          author: 'Judith Mbah',
          title: 'IT Support Specialist / Alumna'
        },
        heroImage: '/assets/images/female_student_practical_guide.jpg',
        duration: '1 Year (2 Semesters)',
        tuition: '150,000 FRS / Year',
        applicationFee: '15,000 FRS',
        tuitionInstallments: 'Payable in Flexible Installments',
        campus: 'Bakweri Town Campus, Buea',
        intakes: 'October & February',
        overviewTitle: 'Become an Essential IT Support & Information Systems Specialist',
        overviewText: 'Gain broad expertise across operating systems, network setup, office productivity software, client databases, and helpdesk customer support in our Buea computer labs.',
        careerOutcomes: [
          {
            title: 'IT Support & Helpdesk Specialist',
            description: 'Provide technical assistance, resolve hardware/software issues, and maintain enterprise office IT setups.',
            responsibilities: ['User support & troubleshooting', 'Network connectivity', 'Software deployment'],
            averageSalary: '2,200,000 – 5,000,000 FRS / Year'
          }
        ],
        admissionRequirements: {
          toApply: ['Application Form', 'GCE O/A Level or equivalent diploma', '2 Passport Photos', 'Copy of National ID'],
          conditional: ['Introductory computer module included.']
        },
        curriculum: [
          {
            levelName: 'Core ICT Curriculum',
            modules: [
              {
                code: 'ICT 101',
                title: 'Enterprise Information Systems & Office Tech',
                description: 'Advanced office productivity, spreadsheet formulas, database entry, and network printer administration.',
                topics: ['Office 365', 'Data Management', 'Network Troubleshooting']
              }
            ]
          }
        ],
        skillsAndSupport: [
          {
            title: 'Helpdesk Scenario Labs',
            description: 'Simulate real enterprise IT ticket resolution and helpdesk administration.',
            bullets: ['Ticketing systems', 'Remote desktop support']
          }
        ],
        faqs: [
          {
            question: 'What is the tuition fee?',
            answer: 'The tuition fee is 150,000 FRS for the full ND program, payable in installments.'
          }
        ]
      },

      {
        slug: 'web-design',
        categorySlug: 'nd',
        title: 'National Diploma (ND) in Web Design',
        degreeType: 'ND (1 Year)',
        deliveryFormat: '100% On-Campus',
        summary: 'Foundational web development covering semantic HTML5, CSS3, modern responsive layouts, JavaScript basics, and web hosting at our Bakweri Town Campus.',
        heroQuote: {
          text: 'Learning the core building blocks of the web gave me the confidence to build and publish responsive websites for local clients.',
          author: 'Patrick Ebot',
          title: 'Junior Web Developer / Graduate'
        },
        heroImage: '/assets/images/image_1.jpg',
        duration: '1 Year (2 Semesters)',
        tuition: '150,000 FRS / Year',
        applicationFee: '15,000 FRS',
        tuitionInstallments: 'Payable in Flexible Installments',
        campus: 'Bakweri Town Campus, Buea',
        intakes: 'October & February',
        overviewTitle: 'Learn to Code Responsive and Interactive Web Interfaces',
        overviewText: 'Master HTML, CSS, JavaScript, responsive mobile design, web accessibility, and website deployment to live domains in our Bakweri Town labs.',
        careerOutcomes: [
          {
            title: 'Junior Web Designer',
            description: 'Create responsive web pages, format site layouts, and update web content for businesses.',
            responsibilities: ['HTML/CSS site builds', 'Responsive testing', 'Content updates'],
            averageSalary: '2,000,000 – 4,500,000 FRS / Year'
          }
        ],
        admissionRequirements: {
          toApply: ['Application Form', 'GCE O-Level / A-Level or equivalent', '2 Passport Photos', 'Copy of National ID'],
          conditional: ['No previous coding required.']
        },
        curriculum: [
          {
            levelName: 'Web Design Foundations',
            modules: [
              {
                code: 'NDW 101',
                title: 'HTML5, CSS3 & Responsive Web Development',
                description: 'Web structure, styling, flexbox, CSS grid, media queries, and basic DOM manipulation.',
                topics: ['HTML5 Tags', 'CSS3 Styling', 'Responsive Grids', 'Domain Publishing']
              }
            ]
          }
        ],
        skillsAndSupport: [
          {
            title: 'Live Website Publishing',
            description: 'Each student publishes their own portfolio website with a live domain.',
            bullets: ['Hosting management', 'Git version control']
          }
        ],
        faqs: [
          {
            question: 'What is the tuition fee?',
            answer: 'The tuition fee is 150,000 FRS for the full ND program, payable in installments.'
          }
        ]
      },

      {
        slug: 'graphic-design-printing',
        categorySlug: 'nd',
        title: 'National Diploma (ND) in Graphic Design & Printing',
        degreeType: 'ND (1 Year)',
        deliveryFormat: '100% On-Campus',
        summary: 'Commercial graphic design, Adobe Photoshop, Illustrator, InDesign, typography, color separation, and industrial digital printing techniques.',
        heroQuote: {
          text: 'The print design and prepress training made it easy to start working with top commercial printing presses immediately.',
          author: 'Clarisse Fongod',
          title: 'Graphic & Print Designer / Graduate'
        },
        heroImage: '/assets/images/image_3.jpg',
        duration: '1 Year (2 Semesters)',
        tuition: '150,000 FRS / Year',
        applicationFee: '15,000 FRS',
        tuitionInstallments: 'Payable in Flexible Installments',
        campus: 'Bakweri Town Campus, Buea',
        intakes: 'October & February',
        overviewTitle: 'Master Visual Design and Commercial Printing Technologies',
        overviewText: 'Learn to design eye-catching posters, business branding, brochures, packaging, and prepare high-resolution print files for industrial presses.',
        careerOutcomes: [
          {
            title: 'Graphic Designer & Prepress Operator',
            description: 'Design brand collateral and manage digital and offset printing prepress workflows.',
            responsibilities: ['Adobe Creative Suite design', 'Color separation (CMYK)', 'Print press quality control'],
            averageSalary: '2,000,000 – 4,800,000 FRS / Year'
          }
        ],
        admissionRequirements: {
          toApply: ['Application Form', 'GCE O/A Level or equivalent', '2 Passport Photos', 'Copy of National ID'],
          conditional: ['Creative aptitude assessment included.']
        },
        curriculum: [
          {
            levelName: 'Graphic Design & Print Production',
            modules: [
              {
                code: 'GDP 101',
                title: 'Photoshop, Illustrator & Commercial Print Prep',
                description: 'Vector artwork, raster manipulation, CMYK color profiles, bleed settings, and large-format printing.',
                topics: ['Photoshop Retouching', 'Illustrator Vectors', 'CMYK Printing', 'Packaging Design']
              }
            ]
          }
        ],
        skillsAndSupport: [
          {
            title: 'Print Lab Experience',
            description: 'Hands-on print file preparation and industrial equipment visits.',
            bullets: ['Prepress prep', 'Color management']
          }
        ],
        faqs: [
          {
            question: 'What is the tuition fee?',
            answer: 'The tuition fee is 150,000 FRS for the full ND program, payable in installments.'
          }
        ]
      },

      {
        slug: 'basic-computer',
        categorySlug: 'nd',
        title: 'National Diploma (ND) in Basic Computer Operations & Applications',
        degreeType: 'ND (6 Months – 1 Year)',
        deliveryFormat: '100% On-Campus',
        summary: 'Essential computer fundamentals, touch typing mastery, Windows OS administration, Microsoft Office Suite (Word, Excel, PowerPoint), and digital literacy in Buea.',
        heroQuote: {
          text: 'Going from zero computer experience to effortlessly working with Excel spreadsheets and Word documents transformed my career opportunities.',
          author: 'Esther Ayuk',
          title: 'Administrative Officer / Graduate'
        },
        heroImage: '/assets/images/campus_students_liah_shirts.jpg',
        duration: '6 Months – 1 Year',
        tuition: '150,000 FRS',
        applicationFee: '15,000 FRS',
        tuitionInstallments: 'Payable in Flexible Installments',
        campus: 'Bakweri Town Campus, Buea',
        intakes: 'Monthly & Quarterly',
        overviewTitle: 'Build Complete Computer Confidence and Digital Literacy',
        overviewText: 'Master everyday computer operations, high-speed typing, document formatting, spreadsheet calculations, presentation design, and safe digital practices in our Bakweri Town labs.',
        careerOutcomes: [
          {
            title: 'Computer Operator / Data Entry Clerk',
            description: 'Enter data, format corporate documents, maintain electronic records, and manage office correspondence.',
            responsibilities: ['Word processing', 'Excel data spreadsheets', 'Email & file archiving'],
            averageSalary: '1,500,000 – 3,500,000 FRS / Year'
          }
        ],
        admissionRequirements: {
          toApply: ['Application Form', 'First School Leaving Certificate or GCE O-Level', 'Copy of National ID', '2 Passport Photos'],
          conditional: ['No previous computer knowledge required.']
        },
        curriculum: [
          {
            levelName: 'Fundamental Computer Operations',
            modules: [
              {
                code: 'BCO 101',
                title: 'Windows Administration, Touch Typing & Microsoft Office',
                description: 'File explorer management, touch typing (40+ WPM), Word formatting, Excel formulas, and PowerPoint animations.',
                topics: ['Touch Typing', 'Microsoft Word', 'Excel Formulas', 'Internet Safety']
              }
            ]
          }
        ],
        skillsAndSupport: [
          {
            title: '1-on-1 Typing & Lab Drills',
            description: 'Personalized practice computers in our air-conditioned Buea labs.',
            bullets: ['Speed typing tests', 'Certificate of digital literacy']
          }
        ],
        faqs: [
          {
            question: 'What is the tuition fee?',
            answer: 'The tuition fee is 150,000 FRS for the Basic Computer ND program, payable in installments.'
          }
        ]
      },

      {
        slug: 'office-automation',
        categorySlug: 'nd',
        title: 'National Diploma (ND) in Office Automation Secretaryship',
        degreeType: 'ND (1 Year)',
        deliveryFormat: '100% On-Campus',
        summary: 'Professional secretarial operations, executive correspondence, calendar management, cloud office tools, digital archiving, and office administration in Buea.',
        heroQuote: {
          text: 'The office automation diploma prepared me perfectly for managing administrative workflows in a corporate organization.',
          author: 'Brenda Takor',
          title: 'Executive Assistant / Alumna'
        },
        heroImage: '/assets/images/female_student_practical_guide.jpg',
        duration: '1 Year (2 Semesters)',
        tuition: '150,000 FRS / Year',
        applicationFee: '15,000 FRS',
        tuitionInstallments: 'Payable in Flexible Installments',
        campus: 'Bakweri Town Campus, Buea',
        intakes: 'October & February',
        overviewTitle: 'Become a Highly Valued Executive Administrative Professional',
        overviewText: 'Master digital office automation, professional letter drafting, spreadsheet auditing, meeting scheduling, and office document security in our Bakweri Town campus.',
        careerOutcomes: [
          {
            title: 'Executive Assistant / Office Administrator',
            description: 'Manage executive schedules, prepare corporate reports, handle confidential documents, and coordinate meetings.',
            responsibilities: ['Executive correspondence', 'Calendar & travel coordination', 'Digital file archiving'],
            averageSalary: '2,200,000 – 5,500,000 FRS / Year'
          }
        ],
        admissionRequirements: {
          toApply: ['Application Form', 'GCE O/A Level or equivalent', '2 Passport Photos', 'Copy of National ID'],
          conditional: ['Business communication prep module included.']
        },
        curriculum: [
          {
            levelName: 'Office Automation & Secretarial Practice',
            modules: [
              {
                code: 'OAS 101',
                title: 'Executive Secretarial Practice & Cloud Office Tools',
                description: 'Office ethics, Google Workspace, Microsoft 365, document indexing, and business communication.',
                topics: ['Business English', 'Calendar Management', 'Google Workspace', 'Confidential Records']
              }
            ]
          }
        ],
        skillsAndSupport: [
          {
            title: 'Executive Simulation Lab',
            description: 'Practice real corporate board meeting minutes and executive reporting.',
            bullets: ['Professional communication', 'Office management certification']
          }
        ],
        faqs: [
          {
            question: 'What is the tuition fee?',
            answer: 'The tuition fee is 150,000 FRS for the Office Automation ND program, payable in installments.'
          }
        ]
      },

      {
        slug: 'computerized-accounting',
        categorySlug: 'nd',
        title: 'National Diploma (ND) in Computerized Accounting',
        degreeType: 'ND (1 Year)',
        deliveryFormat: '100% On-Campus',
        summary: 'Financial accounting fundamentals, Sage 50, QuickBooks, Advanced Excel financial modeling, payroll processing, and OHADA tax systems in Buea.',
        heroQuote: {
          text: 'Mastering Sage and QuickBooks gave me an immediate competitive edge in accounting and tax consultancy.',
          author: 'Christian Tanyitiku',
          title: 'Accounts Officer / Graduate'
        },
        heroImage: '/assets/images/male_student_laptop.jpg',
        duration: '1 Year (2 Semesters)',
        tuition: '150,000 FRS / Year',
        applicationFee: '15,000 FRS',
        tuitionInstallments: 'Payable in Flexible Installments',
        campus: 'Bakweri Town Campus, Buea',
        intakes: 'October & February',
        overviewTitle: 'Automate Financial Records and Master Accounting Software',
        overviewText: 'Learn to record accounting transactions, generate balance sheets and profit/loss statements, manage payroll, and operate industry-standard accounting software in our Buea computer labs.',
        careerOutcomes: [
          {
            title: 'Computerized Accounts Officer',
            description: 'Maintain general ledgers, reconcile bank accounts, process payroll, and prepare tax filings with Sage and QuickBooks.',
            responsibilities: ['Sage & QuickBooks accounting', 'Payroll & tax reconciliation', 'Financial statement generation'],
            averageSalary: '2,500,000 – 6,000,000 FRS / Year'
          }
        ],
        admissionRequirements: {
          toApply: ['Application Form', 'GCE O/A Level or equivalent', 'Copy of National ID', '2 Passport Photos'],
          conditional: ['Basic accounting review provided for non-commercial students.']
        },
        curriculum: [
          {
            levelName: 'Computerized Accounting Core',
            modules: [
              {
                code: 'CAC 101',
                title: 'Sage 50, QuickBooks & Advanced Excel Accounting',
                description: 'Chart of accounts, journal entries, inventory tracking, trial balance, and automated financial statements.',
                topics: ['Sage 50 Accounting', 'QuickBooks Desktop & Online', 'VLOOKUP & Pivot Tables', 'Tax Calculations']
              }
            ]
          }
        ],
        skillsAndSupport: [
          {
            title: 'Real-Company Accounting Files',
            description: 'Practice on real anonymous financial records of Cameroonian companies.',
            bullets: ['Sage 50 and QuickBooks certifications', 'Practical OHADA tax compliance']
          }
        ],
        faqs: [
          {
            question: 'What is the tuition fee?',
            answer: 'The tuition fee is 150,000 FRS for the Computerized Accounting ND program, payable in installments.'
          }
        ]
      }
    ]
  }
};

// Robust Category Lookup
export function getCategoryBySlug(rawSlug: string): ProgramCategory {
  if (!rawSlug) return PROGRAM_CATEGORIES['hnd'];
  const clean = rawSlug.toLowerCase().trim();
  
  if (PROGRAM_CATEGORIES[clean]) return PROGRAM_CATEGORIES[clean];

  if (clean.includes('hnd')) return PROGRAM_CATEGORIES['hnd'];
  if (clean.includes('cert')) return PROGRAM_CATEGORIES['certifications'];
  if (clean.includes('nd') || clean.includes('diploma')) return PROGRAM_CATEGORIES['nd'];

  // Check if rawSlug matches any program
  for (const catKey of ['hnd', 'certifications', 'nd']) {
    const cat = PROGRAM_CATEGORIES[catKey];
    if (cat && cat.programs.some(p => p.slug === clean || p.slug.replace(/-/g, '') === clean.replace(/-/g, ''))) {
      return cat;
    }
  }

  return PROGRAM_CATEGORIES['hnd'];
}

// Robust Program Lookup
export function getProgramBySlug(categorySlug?: string, programSlug?: string): { category: ProgramCategory; program: ProgramDetail } {
  let category = getCategoryBySlug(categorySlug || '');
  const cleanProg = (programSlug || '').toLowerCase().trim();
  
  // Search in matched category
  let program = category?.programs?.find(p => 
    p.slug.toLowerCase() === cleanProg || 
    p.slug.replace(/-/g, '') === cleanProg.replace(/-/g, '')
  );

  // If not found in current category, search across all categories
  if (!program) {
    for (const catKey of ['hnd', 'certifications', 'nd']) {
      const cat = PROGRAM_CATEGORIES[catKey];
      const found = cat?.programs?.find(p => 
        p.slug.toLowerCase() === cleanProg || 
        p.slug.replace(/-/g, '') === cleanProg.replace(/-/g, '')
      );
      if (found) {
        category = cat;
        program = found;
        break;
      }
    }
  }

  // Fallback to first program of category
  if (!program) {
    program = category?.programs?.[0] || PROGRAM_CATEGORIES['hnd'].programs[0];
  }

  return { category, program };
}

// Aliases for routing compatibility
PROGRAM_CATEGORIES['certification'] = PROGRAM_CATEGORIES['certifications'];
PROGRAM_CATEGORIES['certificate'] = PROGRAM_CATEGORIES['certifications'];
PROGRAM_CATEGORIES['cert'] = PROGRAM_CATEGORIES['certifications'];
PROGRAM_CATEGORIES['hnd-programs'] = PROGRAM_CATEGORIES['hnd'];
PROGRAM_CATEGORIES['certification-programs'] = PROGRAM_CATEGORIES['certifications'];
PROGRAM_CATEGORIES['nd-programs'] = PROGRAM_CATEGORIES['nd'];
PROGRAM_CATEGORIES['software-engineering'] = PROGRAM_CATEGORIES['hnd'];
PROGRAM_CATEGORIES['cybersecurity'] = PROGRAM_CATEGORIES['hnd'];
PROGRAM_CATEGORIES['devops'] = PROGRAM_CATEGORIES['certifications'];
PROGRAM_CATEGORIES['data-science'] = PROGRAM_CATEGORIES['certifications'];
PROGRAM_CATEGORIES['web-design'] = PROGRAM_CATEGORIES['nd'];
PROGRAM_CATEGORIES['computer-engineering'] = PROGRAM_CATEGORIES['nd'];
