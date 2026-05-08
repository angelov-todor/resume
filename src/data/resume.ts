export interface ProjectEntry {
  id: string;
  title: string;
  era: string;
  role: string;
  blurb: string;
  stack: string[];
  highlights?: string[];
}

export interface SkillGroup {
  label: string;
  value: string;
}

export interface EarlierEntry {
  name: string;
  year: string;
}

export interface LinkEntry {
  label: string;
  href: string;
}

export interface Resume {
  name: string;
  title: string;
  kicker: string;
  lead: string;
  stats: { num: string; lbl: string }[];
  marquee: ProjectEntry[];
  earlier: EarlierEntry[];
  skills: SkillGroup[];
  links: LinkEntry[];
  email: string; // for Gravatar fallback only; not displayed
}

export const resume: Resume = {
  name: 'Todor Angelov',
  title: 'Software Architect',
  kicker: 'SOFTWARE ARCHITECT · 16 YEARS',
  lead:
    "Building distributed systems that don't fall over — crypto exchanges, IoT platforms, real-estate engines, photorealistic showrooms. Equally happy designing the architecture and writing the production code.",
  stats: [
    { num: '16', lbl: 'Years engineering' },
    { num: 'PhD', lbl: 'Computer Informatics' },
    { num: '5+', lbl: 'Production stacks' },
  ],
  marquee: [
    {
      id: 'astraex',
      title: 'Astraex — AstraBit',
      era: '2025 — now',
      role: 'Tech Lead / Architect',
      blurb:
        'U.S. veteran-operated crypto trading platform unifying CEX/DEX access, AI-driven bots, copy trading, and white-label tools. Built as a FINRA-member firm with focus on transparency and regulation.',
      stack: ['.NET', 'Kotlin', 'Azure', 'ArgoCD', 'Terraform'],
      highlights: [
        'Designed and architected the exchange platform end-to-end',
        'Organized cross-functional teams to ship on time',
        'Drove the microservice architecture for trading, staking, portfolio',
      ],
    },
    {
      id: 'nabr',
      title: 'NABR — Photorealistic Real Estate',
      era: '2024 — 2025',
      role: 'Senior Engineer',
      blurb:
        'Tech-driven housing platform co-founded with architect Bjarke Ingels. Created a photorealistic touring experience using Unreal Engine 5.x with Lumen, plus the GCP-based microservice infrastructure behind it.',
      stack: ['Go', 'C/C++', 'Unreal 5', 'GKE', 'gRPC', 'Pub/Sub'],
      highlights: [
        'Built photorealistic real-estate touring with Unreal + Lumen',
        'Designed micro-frontend / microservice framework over gRPC',
        'Bootstrapped CI/CD with GH Actions, ArgoCD, Terraform Cloud',
      ],
    },
    {
      id: 'fleet-iot',
      title: 'Fleet Services IoT — GPS Bulgaria',
      era: '2023 — 2024',
      role: 'Senior Engineer',
      blurb:
        "Core platform redesign PoC for Bulgaria's leading fleet-management provider. GPS/GSM telemetry across vehicles, ships, and railway assets — efficient, flexible, cost-reducing.",
      stack: ['Go', 'Kubernetes'],
    },
    {
      id: 'real-estate',
      title: 'Real Estate Platform — Back-office',
      era: '2022 — 2023',
      role: 'Senior Engineer',
      blurb:
        'Multi-tenant platform for managing upcoming building projects, sales, reservations, and furniture. New gRPC microservices and React UI features.',
      stack: ['Go', 'React', 'TypeScript', 'gRPC', 'GCloud', 'Firestore'],
    },
    {
      id: 'jupiterdevshop',
      title: 'JupiterDevShop — Content & Product Platforms',
      era: '2021 — 2022',
      role: 'Senior Engineer',
      blurb:
        'Content-sharing and product-management platforms with multi-provider integrations. Split the monolith into microservices and coordinated their integration & scaling.',
      stack: ['Node.js', 'NestJS', 'React', 'K8s', 'AWS', 'Neo4j', 'Postgres'],
    },
    {
      id: 'smart-valor',
      title: 'Smart Valor — Crypto Exchange',
      era: '2018 — 2021',
      role: 'Senior Engineer',
      blurb:
        'Decentralized marketplace for tokenized alternative investments. From redesign to a full pre-sale site, KYC/payment/exchange-provider integrations, then platform evolution.',
      stack: ['Java', 'Node.js', 'Angular', 'NestJS', 'K8s', 'AWS', 'Blockchain'],
    },
  ],
  earlier: [
    { name: 'JigSaw — virtual sessions platform', year: '2018' },
    { name: 'Professional Services — customer add-ons', year: '2017' },
    { name: 'OpenStack Assurance Adapter', year: '2017' },
    { name: 'Viptela xStats Adapter', year: '2017' },
    { name: 'ADK — Adapter Development Kit', year: '2016' },
    { name: 'Docker API Adapter', year: '2015' },
    { name: 'CAS & UMS — single sign-on', year: '2014' },
    { name: 'Website Mobilizer — JS crawler', year: '2013' },
    { name: 'CDN — resource management', year: '2013' },
    { name: 'CRM — customer-management system', year: '2012' },
  ],
  skills: [
    { label: 'Primary languages', value: 'Java · Node.js · TypeScript · JavaScript · PHP' },
    { label: 'Secondary', value: 'Python · Go' },
    { label: 'Frameworks', value: 'Spring Boot · Angular · React · NestJS' },
    {
      label: 'Databases',
      value: 'MySQL · MariaDB · MongoDB · Elasticsearch · MSSQL · PostgreSQL · Neo4j · Firestore',
    },
    {
      label: 'Infra & orchestration',
      value: 'Kubernetes · Docker Swarm · Jenkins · Concourse · GH Actions · ArgoCD · Terraform',
    },
    { label: 'Paradigms', value: 'DDD · TDD · MVC · SOA · RESTful · Microservices · Design Patterns' },
    { label: 'Education', value: 'PhD, MSc, BSc — Univ. of Plovdiv "Paisii Hilendarski"' },
    { label: 'Languages', value: 'Bulgarian (native) · English (fluent) · German (basic)' },
  ],
  links: [
    { label: 'GitHub', href: 'https://github.com/angelov-todor' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/todor-angelov-b5b18274/' },
  ],
  email: 'todor.angelov@wisertech.com',
};
