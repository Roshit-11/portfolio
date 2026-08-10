export const profile = {
  name: 'Roshit Lamichhane',
  role: 'Software Developer & AI Student',
  tagline:
    'I build AI-powered tools, automation pipelines, and full-stack web apps — currently studying Computing with AI and automating marketing data workflows at Allied Title & Escrow.',
  location: 'New Baneswor, Kathmandu, Nepal',
  email: 'roshitlamichhane12@gmail.com',
  phone: '+977 9742209455',
  github: 'https://github.com/Roshit-11',
  linkedin: 'https://www.linkedin.com/in/roshit-lamichhane/',
  siteUrl: 'https://roshitlamichhane.netlify.app/',
  resumeDriveId: '1srn2H0uZvgBOx7sjSKeg98bqbQQSu6Fh',
};

export interface Experience {
  company: string;
  role: string;
  start: { year: number; month: number }; // month is 1-based
  end: { year: number; month: number } | null; // null = present
  summary: string;
  bullets: string[];
  tech: string[];
}

export const experience: Experience[] = [
  {
    company: 'Allied Title & Escrow',
    role: 'Marketing Automation & Lead Research',
    start: { year: 2026, month: 5 },
    end: null,
    summary:
      'Own the end-to-end outbound data pipeline for the marketing team — from finding leads to running the campaign.',
    bullets: [
      'Research real estate agent leads at scale using web scraping, automation scripts, and AI tools (ChatGPT, Grok).',
      'Infer email patterns for edge cases and validate contact data with custom validation scripts before campaigns go out.',
      'Manage HubSpot CRM: contact ingestion, data-quality checks, and building & running email sequences.',
      'Design cold email campaigns and automate responses and follow-ups with AI tooling.',
    ],
    tech: ['Python', 'Web Scraping', 'HubSpot CRM', 'Email Automation', 'ChatGPT', 'Grok AI'],
  },
];

export interface Project {
  title: string;
  featured?: boolean;
  category: 'AI & Automation' | 'Web' | 'Java & OOP' | 'Data & IoT';
  problem: string;
  solution: string;
  features: string[];
  tech: string[];
  github?: string;
  live?: string;
  note?: string;
}

export const projects: Project[] = [
  {
    title: 'TailSpark',
    featured: true,
    category: 'Web',
    problem:
      'Learning Tailwind CSS from docs alone is passive — nothing forces you to actually write utility classes.',
    solution:
      'A gamified learning platform that teaches Tailwind through interactive challenges with real-time visual feedback and an AI tutor.',
    features: [
      'Interactive challenges with instant preview of your utility classes',
      'AI chatbot tutor integrated via Grok API',
      'Gamified progression built with modern frontend practices',
    ],
    tech: ['Next.js', 'JavaScript', 'Tailwind CSS', 'Grok API'],
    github: 'https://github.com/RabinBam/Learn-T',
    live: 'https://tailspark.vercel.app',
  },
  {
    title: 'The Dispatch',
    featured: true,
    category: 'AI & Automation',
    problem:
      'Following Nepali news means juggling multiple sites in one language, with no quick way to get the gist.',
    solution:
      'A Node.js aggregator that scrapes four major Nepali news sites every 10 minutes and serves AI summaries in 18 languages, running 24/7.',
    features: [
      'Automated scraping + deduplication pipeline on a 10-minute cycle',
      'AI summaries via Llama 3.2 3B (OpenRouter) — paste any article URL for an instant summary',
      '10 native + 8 translated languages, deployed on Render with uptime monitoring',
    ],
    tech: ['Node.js', 'OpenRouter', 'Llama 3.2', 'Web Scraping', 'REST APIs'],
    github: 'https://github.com/Roshit-11/the-dispatch',
    live: 'https://the-dispatch-wa0s.onrender.com',
  },
  {
    title: 'Smart CRM System',
    category: 'AI & Automation',
    problem:
      'Wanted to understand what actually happens inside tools like HubSpot instead of just using them at work.',
    solution:
      'A self-initiated, HubSpot-inspired customer relationship manager built from scratch in Java.',
    features: [
      'Contact and pipeline management modeled on real CRM workflows',
      'Built as a personal deep-dive into the tooling used daily at work',
    ],
    tech: ['Java', 'OOP'],
    github: 'https://github.com/Roshit-11/Smart-CRM-System',
  },
  {
    title: 'Smart Farming IoT System',
    category: 'Data & IoT',
    problem:
      'Small farms waste water and catch plant disease late because monitoring is manual.',
    solution:
      'An ESP32-based system that automates irrigation, monitors environmental conditions, and flags plant disease with ML.',
    features: [
      'Automated irrigation driven by live sensor readings',
      'Real-time alerts and remote control through Blynk',
      'Plant disease detection module using pre-trained ML models',
    ],
    tech: ['ESP32', 'C++', 'Blynk', 'Machine Learning', 'Sensors'],
    github: 'https://github.com/Roshit-11/automated-farming-system-arduino',
  },
  {
    title: 'Employee Management System',
    category: 'Java & OOP',
    problem:
      'HR record-keeping needs secure access and reliable CRUD over a real relational database — not spreadsheets.',
    solution:
      'A Java Swing desktop app with secure login/registration and full employee record management on Oracle Database.',
    features: [
      'CRUD operations over JDBC with a properly normalized schema',
      'Secure login and registration flows',
      'OOP design with robust error handling throughout the GUI',
    ],
    tech: ['Java', 'Swing', 'Oracle Database', 'JDBC', 'SQL'],
    github: 'https://github.com/Roshit-11/ems-by-roshit',
  },
  {
    title: 'Gym Management System',
    category: 'Java & OOP',
    problem:
      'Gyms juggle membership tiers, attendance, and loyalty perks — usually across disconnected tools.',
    solution:
      'A Java GUI application that manages members, plans, attendance, and loyalty points in one place.',
    features: [
      'Multiple membership plans with attendance tracking',
      'Loyalty points system for member retention',
      'Modular OOP design built to extend',
    ],
    tech: ['Java', 'OOP', 'GUI', 'ArrayList'],
    github: 'https://github.com/Roshit-11/gym-management-system-java',
  },
  {
    title: 'Wristy — Watch E-commerce',
    category: 'Web',
    problem:
      'A luxury watch reseller needs a storefront that feels as premium as the product.',
    solution:
      'A luxury-themed e-commerce site with elegant UI and smooth navigation, built with vanilla web technologies.',
    features: [
      'Responsive, structured product pages',
      'Luxury-focused visual design and seamless navigation',
      'Group coursework built to real client-style guidelines',
    ],
    tech: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    github: 'https://github.com/Roshit-11/watch-website-html',
  },
  {
    title: 'Inventory Management System',
    category: 'Data & IoT',
    problem:
      'A small seller needs to track buying, selling, and restocking without a database server.',
    solution:
      'A Python inventory system over text-file storage that automates pricing and produces formatted reports.',
    features: [
      'Buy, sell, view, restock, and add-product workflows',
      'Automated selling-price calculation with markup',
      'File handling with dictionaries and lists for efficient processing',
    ],
    tech: ['Python', 'File I/O'],
    github: 'https://github.com/Roshit-11/inventory-management-system-python',
  },
  {
    title: 'Travel Company Database Design',
    category: 'Data & IoT',
    problem:
      'A travel company scenario with trips, buses, passengers, staff, and payments — and messy unnormalized data.',
    solution:
      'A full relational design: ERD, DFDs, and data dictionary, normalized from UNF to 3NF with proper keys and constraints.',
    features: [
      'Complex relationship modeling from real business rules',
      'UNF → 3NF normalization with keys and constraints',
      'ERD, DFD, and data dictionary deliverables',
    ],
    tech: ['SQL', 'ERD', 'Normalization', 'Data Modeling'],
    note: 'Academic design project — documentation-based, no public repo.',
  },
];

export interface SkillGroup {
  title: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Languages',
    skills: ['Python', 'Java', 'JavaScript', 'SQL', 'HTML & CSS'],
  },
  {
    title: 'Web & Frontend',
    skills: ['Next.js', 'Tailwind CSS', 'Responsive Design', 'REST APIs'],
  },
  {
    title: 'Data & AI',
    skills: ['Power BI', 'NumPy', 'Data Modeling & ERD', 'Database Normalization', 'ML Basics'],
  },
  {
    title: 'Databases',
    skills: ['Oracle Database', 'MySQL', 'JDBC'],
  },
  {
    title: 'Cloud & Tools',
    skills: ['AWS Cloud Foundations', 'Git & GitHub', 'ESP32 & Blynk (IoT)'],
  },
  {
    title: 'Automation & CRM',
    skills: ['HubSpot CRM', 'Email Automation', 'Web Scraping', 'Validation Scripts'],
  },
];

export interface Certification {
  title: string;
  issuer: string;
  /** Google Drive file id — embeddable via /preview */
  driveId?: string;
  /** Non-Drive verification URL (may block iframes) */
  url?: string;
}

export const certifications: Certification[] = [
  {
    title: 'AWS Academy — Cloud Foundations',
    issuer: 'AWS Academy',
    driveId: '1nhX_D_vuuSnihxl_8TPTiOS4tOKzKb-y',
  },
  {
    title: 'AWS Academy — Machine Learning Foundations',
    issuer: 'AWS Academy',
    driveId: '1y1LT1UD12qjh1YGP0Axh16KDoNCBN5l5',
  },
  {
    title: 'AWS Academy — Data Engineering',
    issuer: 'AWS Academy',
    driveId: '1KVjWuOt-gQcQCkfrd83wJldA3QIBnajM',
  },
  {
    title: 'AWS Academy — ML for Natural Language Processing',
    issuer: 'AWS Academy',
    driveId: '1mvAVNoXI15OBxWOiiRXpNp11CwC03uv4',
  },
  {
    title: 'Learning HubSpot CRM',
    issuer: 'LinkedIn Learning',
    driveId: '1qDxfH8VsSSpYcF--VvKV31v3q-4L6Cfb',
  },
  {
    title: 'Python Essential Training',
    issuer: 'LinkedIn Learning',
    driveId: '1aQ4RpTfrJFycqZ5KiLMPeiwcx1G6HzGI',
  },
  {
    title: 'NumPy Essential Training: Foundations',
    issuer: 'LinkedIn Learning',
    driveId: '1LuCoEXbqbWsIri47rttkJPiAC-tNHOtr',
  },
  {
    title: 'Java: Object-Oriented Programming',
    issuer: 'LinkedIn Learning',
    driveId: '1-ruNk3n8dmQ28ofM59UqLHR7IMpilTPe',
  },
  {
    title: 'Data Visualization with Power BI',
    issuer: 'Islington College',
    url: 'https://certificate.islingtoncollege.edu.np/certificate/share/ICKAI4A240039LJGHD',
  },
  {
    title: 'Version Control System',
    issuer: 'Islington College',
    url: 'https://certificate.islingtoncollege.edu.np/certificate/share/ICKAI4A2400394TDZF',
  },
  {
    title: 'Islington Hackathon',
    issuer: 'Islington College',
    driveId: '13S7CpzO35gvM3C_v0vWITnggU6JL_sVl',
  },
];

export interface Education {
  school: string;
  degree: string;
  period: string;
  detail?: string;
}

export const education: Education[] = [
  {
    school: 'Islington College',
    degree: 'B.Sc. (Hons) Computing with Artificial Intelligence',
    period: '2024 — Present',
    detail: 'London Metropolitan University pathway. Coursework spanning Java OOP, databases, data structures, IoT, and machine learning.',
  },
  {
    school: 'Budhanilkantha School',
    degree: '+2, NEB Board',
    period: '2023 — 2024',
    detail: 'Graduated with GPA 3.78.',
  },
];

/** "May 2026 — Present · 14 mo" style tenure string, computed live */
export function tenure(exp: Experience): string {
  const months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
  const startLabel = `${months[exp.start.month - 1]} ${exp.start.year}`;
  if (!exp.end) {
    const now = new Date();
    const elapsed =
      (now.getFullYear() - exp.start.year) * 12 + (now.getMonth() + 1 - exp.start.month) + 1;
    const dur =
      elapsed >= 12
        ? `${Math.floor(elapsed / 12)} yr${elapsed >= 24 ? 's' : ''}${elapsed % 12 ? ` ${elapsed % 12} mo` : ''}`
        : `${elapsed} mo`;
    return `${startLabel} — Present · ${dur}`;
  }
  return `${startLabel} — ${months[exp.end.month - 1]} ${exp.end.year}`;
}
