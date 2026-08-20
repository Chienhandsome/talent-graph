import { graphDataSchema, type GraphData } from "../../src/lib/data/schema";

const TAXONOMY_SOURCE =
  "Curated synthetic taxonomy inspired by public O*NET and ESCO concepts";
const PROJECT_SOURCE = "Synthetic portfolio project curated for TalentGraph";

type Seniority = "entry" | "mid" | "senior" | "lead";
type TransitionDifficulty = "easy" | "moderate" | "hard";
type ResourceType = "course" | "documentation" | "tutorial" | "book";
type ProjectDifficulty = "beginner" | "intermediate" | "advanced";
type SkillLevel = "beginner" | "intermediate" | "advanced";

interface SkillSpec {
  id: string;
  name: string;
  category: string;
}

interface RoleSpec {
  id: string;
  name: string;
  category: string;
  seniority: Seniority;
  summary: string;
  skillIds: string[];
}

interface ResourceSpec {
  id: string;
  title: string;
  type: ResourceType;
  provider: string;
  url: string;
  description: string;
  skillIds: string[];
}

interface ProjectSpec {
  id: string;
  title: string;
  difficulty: ProjectDifficulty;
  description: string;
  skillIds: string[];
}

interface ProfileSpec {
  id: string;
  name: string;
  summary: string;
  currentRoleId: string;
  skills: Array<{ id: string; level: SkillLevel }>;
}

const skillSpecs: SkillSpec[] = [
  { id: "javascript", name: "JavaScript", category: "Programming & Web" },
  { id: "typescript", name: "TypeScript", category: "Programming & Web" },
  { id: "python", name: "Python", category: "Programming & Web" },
  { id: "java", name: "Java", category: "Programming & Web" },
  { id: "c-sharp", name: "C#", category: "Programming & Web" },
  { id: "go", name: "Go", category: "Programming & Web" },
  { id: "rust", name: "Rust", category: "Programming & Web" },
  { id: "sql", name: "SQL", category: "Programming & Web" },
  { id: "html", name: "HTML", category: "Programming & Web" },
  { id: "css", name: "CSS", category: "Programming & Web" },
  { id: "bash", name: "Bash", category: "Programming & Web" },
  { id: "dart", name: "Dart", category: "Programming & Web" },
  { id: "kotlin", name: "Kotlin", category: "Programming & Web" },
  { id: "swift", name: "Swift", category: "Programming & Web" },
  { id: "r", name: "R", category: "Programming & Web" },
  { id: "react", name: "React", category: "Frameworks" },
  { id: "next-js", name: "Next.js", category: "Frameworks" },
  { id: "node-js", name: "Node.js", category: "Frameworks" },
  { id: "express-js", name: "Express.js", category: "Frameworks" },
  { id: "nest-js", name: "NestJS", category: "Frameworks" },
  { id: "django", name: "Django", category: "Frameworks" },
  { id: "fastapi", name: "FastAPI", category: "Frameworks" },
  { id: "spring-boot", name: "Spring Boot", category: "Frameworks" },
  { id: "dotnet", name: ".NET", category: "Frameworks" },
  { id: "flutter", name: "Flutter", category: "Frameworks" },
  { id: "react-native", name: "React Native", category: "Frameworks" },
  { id: "tailwind-css", name: "Tailwind CSS", category: "Frameworks" },
  { id: "data-modeling", name: "Data Modeling", category: "Data" },
  { id: "postgresql", name: "PostgreSQL", category: "Data" },
  { id: "mongodb", name: "MongoDB", category: "Data" },
  { id: "redis", name: "Redis", category: "Data" },
  { id: "graph-databases", name: "Graph Databases", category: "Data" },
  { id: "cypher", name: "Cypher", category: "Data" },
  { id: "data-warehousing", name: "Data Warehousing", category: "Data" },
  { id: "etl", name: "ETL", category: "Data" },
  { id: "pandas", name: "pandas", category: "Data" },
  { id: "spark", name: "Apache Spark", category: "Data" },
  { id: "machine-learning", name: "Machine Learning", category: "AI & ML" },
  { id: "deep-learning", name: "Deep Learning", category: "AI & ML" },
  {
    id: "natural-language-processing",
    name: "Natural Language Processing",
    category: "AI & ML",
  },
  { id: "computer-vision", name: "Computer Vision", category: "AI & ML" },
  {
    id: "large-language-models",
    name: "Large Language Models",
    category: "AI & ML",
  },
  { id: "prompt-engineering", name: "Prompt Engineering", category: "AI & ML" },
  { id: "model-evaluation", name: "Model Evaluation", category: "AI & ML" },
  { id: "feature-engineering", name: "Feature Engineering", category: "AI & ML" },
  { id: "mlops", name: "MLOps", category: "AI & ML" },
  { id: "statistics", name: "Statistics", category: "AI & ML" },
  { id: "git", name: "Git", category: "Cloud & DevOps" },
  { id: "docker", name: "Docker", category: "Cloud & DevOps" },
  { id: "kubernetes", name: "Kubernetes", category: "Cloud & DevOps" },
  { id: "aws", name: "AWS", category: "Cloud & DevOps" },
  { id: "azure", name: "Microsoft Azure", category: "Cloud & DevOps" },
  { id: "gcp", name: "Google Cloud", category: "Cloud & DevOps" },
  { id: "ci-cd", name: "CI/CD", category: "Cloud & DevOps" },
  { id: "linux", name: "Linux", category: "Cloud & DevOps" },
  { id: "terraform", name: "Terraform", category: "Cloud & DevOps" },
  { id: "observability", name: "Observability", category: "Cloud & DevOps" },
  { id: "rest-apis", name: "REST APIs", category: "Software Engineering" },
  { id: "graphql", name: "GraphQL", category: "Software Engineering" },
  { id: "microservices", name: "Microservices", category: "Software Engineering" },
  { id: "system-design", name: "System Design", category: "Software Engineering" },
  { id: "testing", name: "Software Testing", category: "Software Engineering" },
  { id: "security", name: "Application Security", category: "Software Engineering" },
  { id: "accessibility", name: "Accessibility", category: "Product & Delivery" },
  { id: "ui-ux", name: "UI/UX", category: "Product & Delivery" },
  { id: "agile", name: "Agile Delivery", category: "Product & Delivery" },
  { id: "communication", name: "Communication", category: "Product & Delivery" },
  { id: "problem-solving", name: "Problem Solving", category: "Foundations" },
  { id: "data-structures", name: "Data Structures", category: "Foundations" },
  { id: "algorithms", name: "Algorithms", category: "Foundations" },
];

const roleSpecs: RoleSpec[] = [
  {
    id: "frontend-developer",
    name: "Frontend Developer",
    category: "Web Development",
    seniority: "entry",
    summary: "Builds accessible browser interfaces and turns product designs into responsive web experiences.",
    skillIds: ["html", "css", "javascript", "typescript", "react", "next-js", "tailwind-css", "accessibility", "testing", "git"],
  },
  {
    id: "backend-developer",
    name: "Backend Developer",
    category: "Web Development",
    seniority: "mid",
    summary: "Designs reliable server APIs, business logic, persistence layers, and service integrations.",
    skillIds: ["typescript", "node-js", "python", "rest-apis", "sql", "data-modeling", "nest-js", "express-js", "fastapi", "django"],
  },
  {
    id: "full-stack-developer",
    name: "Full Stack Developer",
    category: "Web Development",
    seniority: "mid",
    summary: "Delivers complete web features across browser interfaces, APIs, and relational persistence.",
    skillIds: ["html", "css", "javascript", "typescript", "react", "node-js", "rest-apis", "sql", "git", "testing"],
  },
  {
    id: "mobile-developer",
    name: "Mobile Developer",
    category: "Mobile Development",
    seniority: "mid",
    summary: "Creates cross-platform mobile applications with usable interfaces and dependable API integration.",
    skillIds: ["dart", "flutter", "react-native", "rest-apis", "git", "testing", "ui-ux", "ci-cd", "accessibility", "typescript"],
  },
  {
    id: "ios-developer",
    name: "iOS Developer",
    category: "Mobile Development",
    seniority: "mid",
    summary: "Builds secure and accessible native applications for Apple platforms using Swift.",
    skillIds: ["swift", "ui-ux", "rest-apis", "git", "testing", "ci-cd", "security", "algorithms", "data-structures", "accessibility"],
  },
  {
    id: "android-developer",
    name: "Android Developer",
    category: "Mobile Development",
    seniority: "mid",
    summary: "Builds maintainable native Android applications and integrates them with backend services.",
    skillIds: ["kotlin", "java", "ui-ux", "rest-apis", "git", "testing", "ci-cd", "algorithms", "data-structures", "security"],
  },
  {
    id: "software-engineer",
    name: "Software Engineer",
    category: "Software Engineering",
    seniority: "mid",
    summary: "Solves general software problems with sound algorithms, design principles, and production-quality code.",
    skillIds: ["java", "c-sharp", "go", "rust", "data-structures", "algorithms", "testing", "system-design", "dotnet", "spring-boot"],
  },
  {
    id: "qa-engineer",
    name: "QA Engineer",
    category: "Quality Engineering",
    seniority: "entry",
    summary: "Prevents regressions through automated testing, exploratory analysis, and clear quality communication.",
    skillIds: ["testing", "ci-cd", "git", "javascript", "python", "rest-apis", "accessibility", "communication", "problem-solving", "security"],
  },
  {
    id: "devops-engineer",
    name: "DevOps Engineer",
    category: "Infrastructure",
    seniority: "mid",
    summary: "Automates delivery pipelines and operates reliable cloud infrastructure for software teams.",
    skillIds: ["linux", "git", "docker", "kubernetes", "ci-cd", "aws", "terraform", "observability", "bash", "security"],
  },
  {
    id: "cloud-engineer",
    name: "Cloud Engineer",
    category: "Infrastructure",
    seniority: "mid",
    summary: "Designs and operates secure infrastructure across public cloud platforms using automation.",
    skillIds: ["aws", "azure", "gcp", "terraform", "docker", "kubernetes", "linux", "security", "observability", "system-design"],
  },
  {
    id: "site-reliability-engineer",
    name: "Site Reliability Engineer",
    category: "Infrastructure",
    seniority: "senior",
    summary: "Applies software engineering to availability, incident response, capacity, and production operations.",
    skillIds: ["linux", "observability", "kubernetes", "docker", "ci-cd", "python", "bash", "system-design", "security", "terraform"],
  },
  {
    id: "security-engineer",
    name: "Security Engineer",
    category: "Security",
    seniority: "senior",
    summary: "Reduces application and infrastructure risk through secure design, testing, and monitoring.",
    skillIds: ["security", "linux", "python", "bash", "docker", "aws", "testing", "rest-apis", "observability", "system-design"],
  },
  {
    id: "database-engineer",
    name: "Database Engineer",
    category: "Data",
    seniority: "mid",
    summary: "Designs, tunes, and operates dependable data stores for transactional application workloads.",
    skillIds: ["sql", "postgresql", "mongodb", "redis", "data-modeling", "graph-databases", "cypher", "linux", "system-design", "security"],
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    category: "Data",
    seniority: "entry",
    summary: "Transforms business questions into trustworthy analysis, metrics, and clearly communicated findings.",
    skillIds: ["sql", "statistics", "python", "pandas", "data-modeling", "data-warehousing", "communication", "problem-solving", "etl", "r"],
  },
  {
    id: "data-engineer",
    name: "Data Engineer",
    category: "Data",
    seniority: "mid",
    summary: "Builds reliable batch and streaming pipelines that make governed data available at scale.",
    skillIds: ["python", "sql", "etl", "data-warehousing", "spark", "postgresql", "docker", "aws", "data-modeling", "git"],
  },
  {
    id: "analytics-engineer",
    name: "Analytics Engineer",
    category: "Data",
    seniority: "mid",
    summary: "Models tested warehouse data into reusable datasets for reporting and decision making.",
    skillIds: ["sql", "data-modeling", "data-warehousing", "etl", "python", "git", "testing", "communication", "postgresql", "pandas"],
  },
  {
    id: "data-scientist",
    name: "Data Scientist",
    category: "AI & Data Science",
    seniority: "mid",
    summary: "Uses statistics and machine learning to investigate data and validate predictive solutions.",
    skillIds: ["python", "statistics", "machine-learning", "pandas", "sql", "feature-engineering", "model-evaluation", "communication", "r", "data-modeling"],
  },
  {
    id: "machine-learning-engineer",
    name: "Machine Learning Engineer",
    category: "AI & Data Science",
    seniority: "senior",
    summary: "Turns validated models into scalable, tested, monitored production machine-learning systems.",
    skillIds: ["python", "machine-learning", "deep-learning", "feature-engineering", "model-evaluation", "mlops", "docker", "aws", "data-structures", "algorithms"],
  },
  {
    id: "ai-engineer",
    name: "AI Engineer",
    category: "AI & Data Science",
    seniority: "senior",
    summary: "Builds production AI features that combine models, evaluation, APIs, and responsible operations.",
    skillIds: ["python", "machine-learning", "deep-learning", "natural-language-processing", "large-language-models", "prompt-engineering", "model-evaluation", "mlops", "rest-apis", "system-design"],
  },
  {
    id: "nlp-engineer",
    name: "NLP Engineer",
    category: "AI & Data Science",
    seniority: "senior",
    summary: "Develops and evaluates language understanding and generation systems for real products.",
    skillIds: ["python", "natural-language-processing", "deep-learning", "large-language-models", "prompt-engineering", "model-evaluation", "mlops", "statistics", "rest-apis", "data-structures"],
  },
  {
    id: "computer-vision-engineer",
    name: "Computer Vision Engineer",
    category: "AI & Data Science",
    seniority: "senior",
    summary: "Creates and deploys image and video models with measurable real-world performance.",
    skillIds: ["python", "computer-vision", "deep-learning", "machine-learning", "model-evaluation", "feature-engineering", "mlops", "statistics", "docker", "algorithms"],
  },
  {
    id: "mlops-engineer",
    name: "MLOps Engineer",
    category: "AI Infrastructure",
    seniority: "senior",
    summary: "Automates model delivery, reproducibility, monitoring, and infrastructure across the ML lifecycle.",
    skillIds: ["python", "mlops", "docker", "kubernetes", "ci-cd", "aws", "observability", "model-evaluation", "terraform", "linux"],
  },
  {
    id: "graph-database-developer",
    name: "Graph Database Developer",
    category: "Data",
    seniority: "mid",
    summary: "Models connected domains and builds bounded graph queries and APIs for application use cases.",
    skillIds: ["graph-databases", "cypher", "data-modeling", "python", "typescript", "rest-apis", "system-design", "testing", "security", "aws"],
  },
  {
    id: "data-architect",
    name: "Data Architect",
    category: "Architecture",
    seniority: "lead",
    summary: "Defines scalable data models, integration patterns, governance boundaries, and platform direction.",
    skillIds: ["data-modeling", "sql", "data-warehousing", "etl", "graph-databases", "system-design", "aws", "security", "communication", "cypher"],
  },
  {
    id: "solutions-architect",
    name: "Solutions Architect",
    category: "Architecture",
    seniority: "lead",
    summary: "Translates business constraints into secure, operable, and clearly communicated system designs.",
    skillIds: ["system-design", "aws", "azure", "gcp", "security", "communication", "rest-apis", "microservices", "data-modeling", "terraform"],
  },
  {
    id: "product-engineer",
    name: "Product Engineer",
    category: "Product Development",
    seniority: "mid",
    summary: "Balances customer outcomes and engineering quality while shipping complete product increments.",
    skillIds: ["javascript", "typescript", "react", "node-js", "rest-apis", "graphql", "testing", "ui-ux", "agile", "communication"],
  },
  {
    id: "technical-product-manager",
    name: "Technical Product Manager",
    category: "Product Development",
    seniority: "senior",
    summary: "Aligns technical teams around measurable outcomes, constraints, sequencing, and user value.",
    skillIds: ["agile", "communication", "problem-solving", "system-design", "data-modeling", "ui-ux", "statistics", "git", "rest-apis", "accessibility"],
  },
  {
    id: "ux-engineer",
    name: "UX Engineer",
    category: "Product Development",
    seniority: "mid",
    summary: "Bridges design and engineering through accessible prototypes and production interface systems.",
    skillIds: ["html", "css", "javascript", "typescript", "react", "accessibility", "ui-ux", "testing", "communication", "tailwind-css"],
  },
  {
    id: "platform-engineer",
    name: "Platform Engineer",
    category: "Infrastructure",
    seniority: "senior",
    summary: "Creates secure self-service infrastructure that improves developer delivery and reliability.",
    skillIds: ["linux", "docker", "kubernetes", "terraform", "ci-cd", "aws", "observability", "security", "system-design", "go"],
  },
  {
    id: "engineering-manager",
    name: "Engineering Manager",
    category: "Leadership",
    seniority: "lead",
    summary: "Builds healthy engineering teams and guides delivery, quality, reliability, and technical decisions.",
    skillIds: ["communication", "agile", "system-design", "security", "testing", "observability", "problem-solving", "git", "aws", "ci-cd"],
  },
];

const transitionSpecs: Array<[string, string, TransitionDifficulty]> = [
  ["frontend-developer", "full-stack-developer", "moderate"],
  ["frontend-developer", "ux-engineer", "easy"],
  ["frontend-developer", "product-engineer", "moderate"],
  ["ux-engineer", "frontend-developer", "easy"],
  ["ux-engineer", "product-engineer", "moderate"],
  ["product-engineer", "full-stack-developer", "easy"],
  ["full-stack-developer", "backend-developer", "moderate"],
  ["full-stack-developer", "frontend-developer", "easy"],
  ["full-stack-developer", "product-engineer", "easy"],
  ["full-stack-developer", "data-engineer", "hard"],
  ["backend-developer", "full-stack-developer", "easy"],
  ["backend-developer", "data-engineer", "moderate"],
  ["backend-developer", "graph-database-developer", "moderate"],
  ["backend-developer", "machine-learning-engineer", "hard"],
  ["backend-developer", "devops-engineer", "moderate"],
  ["mobile-developer", "ios-developer", "moderate"],
  ["mobile-developer", "android-developer", "moderate"],
  ["mobile-developer", "product-engineer", "moderate"],
  ["ios-developer", "mobile-developer", "easy"],
  ["android-developer", "mobile-developer", "easy"],
  ["software-engineer", "backend-developer", "moderate"],
  ["software-engineer", "devops-engineer", "hard"],
  ["software-engineer", "engineering-manager", "hard"],
  ["qa-engineer", "software-engineer", "moderate"],
  ["qa-engineer", "devops-engineer", "moderate"],
  ["devops-engineer", "platform-engineer", "moderate"],
  ["devops-engineer", "site-reliability-engineer", "moderate"],
  ["devops-engineer", "cloud-engineer", "easy"],
  ["cloud-engineer", "solutions-architect", "hard"],
  ["cloud-engineer", "devops-engineer", "easy"],
  ["cloud-engineer", "security-engineer", "moderate"],
  ["site-reliability-engineer", "platform-engineer", "easy"],
  ["site-reliability-engineer", "devops-engineer", "easy"],
  ["security-engineer", "cloud-engineer", "moderate"],
  ["security-engineer", "solutions-architect", "hard"],
  ["database-engineer", "data-engineer", "moderate"],
  ["database-engineer", "graph-database-developer", "easy"],
  ["database-engineer", "data-architect", "hard"],
  ["data-analyst", "analytics-engineer", "moderate"],
  ["data-analyst", "data-scientist", "moderate"],
  ["data-analyst", "technical-product-manager", "moderate"],
  ["data-engineer", "analytics-engineer", "easy"],
  ["data-engineer", "data-scientist", "moderate"],
  ["data-engineer", "machine-learning-engineer", "moderate"],
  ["data-engineer", "data-architect", "hard"],
  ["analytics-engineer", "data-engineer", "moderate"],
  ["analytics-engineer", "data-analyst", "easy"],
  ["data-scientist", "machine-learning-engineer", "moderate"],
  ["data-scientist", "nlp-engineer", "hard"],
  ["machine-learning-engineer", "ai-engineer", "moderate"],
  ["machine-learning-engineer", "mlops-engineer", "moderate"],
  ["machine-learning-engineer", "computer-vision-engineer", "moderate"],
  ["ai-engineer", "nlp-engineer", "moderate"],
  ["ai-engineer", "solutions-architect", "hard"],
  ["nlp-engineer", "ai-engineer", "easy"],
  ["computer-vision-engineer", "machine-learning-engineer", "easy"],
  ["mlops-engineer", "platform-engineer", "moderate"],
  ["graph-database-developer", "data-architect", "hard"],
  ["data-architect", "solutions-architect", "moderate"],
  ["solutions-architect", "technical-product-manager", "moderate"],
];

const crossCategorySkillLinks: Array<[string, string, number]> = [
  ["javascript", "react", 5],
  ["typescript", "next-js", 5],
  ["python", "machine-learning", 5],
  ["sql", "data-modeling", 5],
  ["git", "ci-cd", 5],
  ["docker", "observability", 5],
  ["aws", "terraform", 4],
  ["statistics", "model-evaluation", 5],
  ["machine-learning", "feature-engineering", 5],
  ["deep-learning", "model-evaluation", 4],
  ["computer-vision", "feature-engineering", 4],
  ["large-language-models", "model-evaluation", 5],
  ["graph-databases", "rest-apis", 3],
  ["react", "accessibility", 4],
  ["testing", "ci-cd", 4],
  ["system-design", "data-modeling", 4],
  ["ui-ux", "css", 4],
  ["agile", "git", 3],
  ["algorithms", "testing", 3],
  ["pandas", "statistics", 5],
];

const resourceSpecs: ResourceSpec[] = [
  { id: "mdn-web-learning", title: "MDN Learn Web Development", type: "documentation", provider: "Mozilla", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development", description: "Structured official guidance for modern browser fundamentals and accessible web development.", skillIds: ["html", "css", "javascript"] },
  { id: "typescript-handbook", title: "TypeScript Handbook", type: "documentation", provider: "Microsoft", url: "https://www.typescriptlang.org/docs/handbook/intro.html", description: "Official language guide covering TypeScript types, narrowing, functions, and object modeling.", skillIds: ["typescript", "javascript", "data-structures"] },
  { id: "react-learn", title: "React Learn", type: "documentation", provider: "React", url: "https://react.dev/learn", description: "Official interactive introduction to components, state, effects, and application composition.", skillIds: ["react", "javascript", "accessibility"] },
  { id: "nextjs-documentation", title: "Next.js Documentation", type: "documentation", provider: "Vercel", url: "https://nextjs.org/docs", description: "Official documentation for building full-stack React applications with the App Router.", skillIds: ["next-js", "react", "typescript"] },
  { id: "nodejs-learn", title: "Node.js Learn", type: "documentation", provider: "OpenJS Foundation", url: "https://nodejs.org/en/learn", description: "Official learning materials for server-side JavaScript, asynchronous code, and HTTP services.", skillIds: ["node-js", "javascript", "rest-apis"] },
  { id: "python-tutorial", title: "The Python Tutorial", type: "tutorial", provider: "Python Software Foundation", url: "https://docs.python.org/3/tutorial/", description: "Official tutorial covering Python syntax, data structures, modules, and standard tooling.", skillIds: ["python", "data-structures", "algorithms"] },
  { id: "devjava-learning", title: "Learn Java", type: "documentation", provider: "Oracle", url: "https://dev.java/learn/", description: "Official Java learning path for language fundamentals and production application development.", skillIds: ["java", "spring-boot", "testing"] },
  { id: "csharp-documentation", title: "C# Documentation", type: "documentation", provider: "Microsoft", url: "https://learn.microsoft.com/en-us/dotnet/csharp/", description: "Official C# language documentation and guided learning for the .NET platform.", skillIds: ["c-sharp", "dotnet", "rest-apis"] },
  { id: "tour-of-go", title: "A Tour of Go", type: "tutorial", provider: "The Go Authors", url: "https://go.dev/tour/", description: "Official interactive tour of Go syntax, methods, interfaces, generics, and concurrency.", skillIds: ["go", "microservices", "testing"] },
  { id: "rust-book", title: "The Rust Programming Language", type: "book", provider: "The Rust Project", url: "https://doc.rust-lang.org/book/", description: "Official book for Rust ownership, type safety, concurrency, and systems programming.", skillIds: ["rust", "data-structures", "algorithms"] },
  { id: "flutter-get-started", title: "Get Started with Flutter", type: "documentation", provider: "Google", url: "https://docs.flutter.dev/get-started", description: "Official path for creating cross-platform applications with Dart and Flutter widgets.", skillIds: ["dart", "flutter", "ui-ux"] },
  { id: "android-courses", title: "Android Developer Courses", type: "course", provider: "Google", url: "https://developer.android.com/courses", description: "Official Android courses covering Kotlin, app architecture, and modern interface development.", skillIds: ["kotlin", "java", "ui-ux"] },
  { id: "swift-book", title: "The Swift Programming Language", type: "book", provider: "Apple", url: "https://docs.swift.org/swift-book/documentation/the-swift-programming-language/", description: "Official guide to Swift language features used across Apple application platforms.", skillIds: ["swift", "ui-ux", "accessibility"] },
  { id: "postgresql-tutorial", title: "PostgreSQL Tutorial", type: "tutorial", provider: "PostgreSQL Global Development Group", url: "https://www.postgresql.org/docs/current/tutorial.html", description: "Official tutorial for relational concepts, SQL queries, joins, aggregates, and transactions.", skillIds: ["sql", "postgresql", "data-modeling"] },
  { id: "mongodb-university", title: "MongoDB University", type: "course", provider: "MongoDB", url: "https://learn.mongodb.com/", description: "Official courses for document modeling, querying, aggregation, and operational practices.", skillIds: ["mongodb", "data-modeling", "etl"] },
  { id: "cognodb-developer-guide", title: "CognoDB Developer Guide", type: "documentation", provider: "Wexa AI", url: "https://cognodb.com/docs", description: "Official guide for graph modeling, Cypher traversal, parameters, constraints, and Bolt clients.", skillIds: ["graph-databases", "cypher", "data-modeling"] },
  { id: "pro-git", title: "Pro Git", type: "book", provider: "Git SCM", url: "https://git-scm.com/book/en/v2", description: "Official open book covering distributed version control workflows and collaboration practices.", skillIds: ["git", "ci-cd", "agile"] },
  { id: "docker-get-started", title: "Docker Get Started", type: "documentation", provider: "Docker", url: "https://docs.docker.com/get-started/", description: "Official introduction to images, containers, multi-container applications, and delivery workflows.", skillIds: ["docker", "linux", "ci-cd"] },
  { id: "kubernetes-basics", title: "Learn Kubernetes Basics", type: "tutorial", provider: "Cloud Native Computing Foundation", url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/", description: "Official interactive tutorial for deploying, scaling, updating, and debugging containerized applications.", skillIds: ["kubernetes", "docker", "observability"] },
  { id: "terraform-tutorials", title: "Terraform Tutorials", type: "tutorial", provider: "HashiCorp", url: "https://developer.hashicorp.com/terraform/tutorials", description: "Official infrastructure-as-code tutorials across major public cloud providers and workflows.", skillIds: ["terraform", "aws", "azure"] },
  { id: "aws-skill-builder", title: "AWS Skill Builder", type: "course", provider: "Amazon Web Services", url: "https://explore.skillbuilder.aws/", description: "Official digital courses for cloud architecture, operations, and security on AWS.", skillIds: ["aws", "system-design", "security"] },
  { id: "google-ml-crash-course", title: "Machine Learning Crash Course", type: "course", provider: "Google", url: "https://developers.google.com/machine-learning/crash-course", description: "Official practical introduction to machine-learning concepts, data preparation, and evaluation.", skillIds: ["machine-learning", "feature-engineering", "model-evaluation"] },
  { id: "pytorch-tutorials", title: "PyTorch Tutorials", type: "tutorial", provider: "PyTorch Foundation", url: "https://pytorch.org/tutorials/", description: "Official examples for tensors, neural networks, training loops, vision, and language models.", skillIds: ["deep-learning", "computer-vision", "natural-language-processing"] },
  { id: "huggingface-llm-course", title: "Hugging Face LLM Course", type: "course", provider: "Hugging Face", url: "https://huggingface.co/learn/llm-course/chapter1/1", description: "Official course for transformer models, natural-language tasks, and responsible model use.", skillIds: ["large-language-models", "natural-language-processing", "prompt-engineering"] },
  { id: "google-cloud-mlops", title: "MLOps: Continuous Delivery and Automation Pipelines", type: "documentation", provider: "Google Cloud", url: "https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning", description: "Official architecture guidance for automated, testable, and observable machine-learning delivery.", skillIds: ["mlops", "model-evaluation", "observability"] },
];

const projectSpecs: ProjectSpec[] = [
  { id: "accessible-portfolio", title: "Accessible Developer Portfolio", difficulty: "beginner", description: "Build a responsive portfolio with semantic navigation, keyboard support, and tested components.", skillIds: ["html", "css", "react", "accessibility"] },
  { id: "full-stack-task-tracker", title: "Full Stack Task Tracker", difficulty: "intermediate", description: "Build a typed task product with server rendering, API routes, and relational persistence.", skillIds: ["typescript", "next-js", "node-js", "postgresql"] },
  { id: "mobile-habit-coach", title: "Mobile Habit Coach", difficulty: "intermediate", description: "Create a cross-platform habit application with offline-friendly flows and widget tests.", skillIds: ["dart", "flutter", "ui-ux", "testing"] },
  { id: "python-api-service", title: "Validated Python API Service", difficulty: "intermediate", description: "Implement a documented service with validation, database access, and integration tests.", skillIds: ["python", "fastapi", "rest-apis", "postgresql"] },
  { id: "cloud-deployment-pipeline", title: "Cloud Deployment Pipeline", difficulty: "advanced", description: "Containerize an application and automate tested deployment to a managed Kubernetes environment.", skillIds: ["docker", "kubernetes", "ci-cd", "aws"] },
  { id: "service-observability-lab", title: "Service Observability Lab", difficulty: "advanced", description: "Instrument a service with structured signals, dashboards, alerts, and repeatable infrastructure.", skillIds: ["observability", "linux", "python", "terraform"] },
  { id: "security-scanner", title: "Dependency Security Scanner", difficulty: "intermediate", description: "Create a command-line tool that detects risky dependencies and verifies remediation rules.", skillIds: ["security", "python", "bash", "testing"] },
  { id: "career-knowledge-graph", title: "Career Knowledge Graph", difficulty: "advanced", description: "Model career connections and expose bounded, parameterized multi-hop graph queries through an API.", skillIds: ["graph-databases", "cypher", "typescript", "rest-apis"] },
  { id: "analytics-warehouse", title: "Analytics Warehouse", difficulty: "advanced", description: "Load raw events into a warehouse and publish documented, tested analytical models.", skillIds: ["sql", "etl", "data-warehousing", "data-modeling"] },
  { id: "churn-prediction", title: "Churn Prediction Study", difficulty: "intermediate", description: "Train a reproducible churn model and communicate feature choices and evaluation limitations.", skillIds: ["python", "machine-learning", "feature-engineering", "model-evaluation"] },
  { id: "image-classifier", title: "Image Classification Service", difficulty: "advanced", description: "Train, evaluate, package, and serve an image classifier with documented failure cases.", skillIds: ["python", "deep-learning", "computer-vision", "model-evaluation"] },
  { id: "retrieval-assistant", title: "Retrieval-Augmented Assistant", difficulty: "advanced", description: "Build a grounded language assistant with prompt experiments and a repeatable evaluation set.", skillIds: ["python", "large-language-models", "natural-language-processing", "prompt-engineering"] },
  { id: "mlops-training-pipeline", title: "Automated ML Training Pipeline", difficulty: "advanced", description: "Automate model training, validation, artifact promotion, deployment, and production monitoring.", skillIds: ["mlops", "docker", "ci-cd", "observability"] },
  { id: "streaming-data-pipeline", title: "Streaming Data Pipeline", difficulty: "advanced", description: "Process event streams into partitioned analytical data with quality and recovery checks.", skillIds: ["spark", "etl", "python", "aws"] },
  { id: "cross-platform-commerce-app", title: "Cross-Platform Commerce App", difficulty: "advanced", description: "Build a polished mobile storefront with typed API integration and accessible interactions.", skillIds: ["react-native", "javascript", "ui-ux", "rest-apis"] },
  { id: "native-ios-journal", title: "Native iOS Journal", difficulty: "intermediate", description: "Create a native journal app with accessible controls, local state, and automated tests.", skillIds: ["swift", "ui-ux", "accessibility", "testing"] },
  { id: "android-transit-client", title: "Android Transit Client", difficulty: "intermediate", description: "Build a native transit client with resilient networking and testable application boundaries.", skillIds: ["kotlin", "java", "testing", "rest-apis"] },
  { id: "go-microservice-system", title: "Go Microservice System", difficulty: "advanced", description: "Design two small services with explicit contracts, tracing, and containerized local operation.", skillIds: ["go", "microservices", "system-design", "docker"] },
  { id: "dotnet-inventory-api", title: ".NET Inventory API", difficulty: "intermediate", description: "Implement a secure inventory API with relational persistence and contract-level testing.", skillIds: ["c-sharp", "dotnet", "rest-apis", "sql"] },
  { id: "team-delivery-simulation", title: "Team Delivery Simulation", difficulty: "beginner", description: "Plan and retrospect a small delivery cycle with clear decisions, risks, and version history.", skillIds: ["agile", "communication", "problem-solving", "git"] },
];

const profileSpecs: ProfileSpec[] = [
  {
    id: "frontend-learner",
    name: "Frontend Learner (Synthetic)",
    summary: "A synthetic learner preparing to move from frontend delivery toward applied AI engineering.",
    currentRoleId: "frontend-developer",
    skills: [
      ["javascript", "advanced"], ["typescript", "intermediate"], ["react", "advanced"], ["html", "advanced"], ["css", "advanced"],
      ["git", "intermediate"], ["testing", "intermediate"], ["accessibility", "intermediate"], ["tailwind-css", "intermediate"], ["next-js", "beginner"],
    ].map(([id, level]) => ({ id, level: level as SkillLevel })),
  },
  {
    id: "backend-learner",
    name: "Backend Learner (Synthetic)",
    summary: "A synthetic backend developer exploring graph systems and data engineering responsibilities.",
    currentRoleId: "backend-developer",
    skills: [
      ["typescript", "advanced"], ["node-js", "advanced"], ["express-js", "intermediate"], ["rest-apis", "advanced"], ["sql", "intermediate"],
      ["postgresql", "intermediate"], ["git", "advanced"], ["testing", "intermediate"], ["docker", "beginner"], ["data-modeling", "intermediate"],
    ].map(([id, level]) => ({ id, level: level as SkillLevel })),
  },
  {
    id: "analytics-learner",
    name: "Analytics Learner (Synthetic)",
    summary: "A synthetic analyst developing the engineering foundation needed for reliable data products.",
    currentRoleId: "data-analyst",
    skills: [
      ["sql", "advanced"], ["statistics", "intermediate"], ["python", "intermediate"], ["pandas", "advanced"], ["data-modeling", "intermediate"],
      ["communication", "advanced"], ["problem-solving", "advanced"], ["etl", "beginner"], ["r", "intermediate"], ["git", "beginner"],
    ].map(([id, level]) => ({ id, level: level as SkillLevel })),
  },
  {
    id: "ml-learner",
    name: "ML Learner (Synthetic)",
    summary: "A synthetic data scientist preparing to productionize and monitor machine-learning systems.",
    currentRoleId: "data-scientist",
    skills: [
      ["python", "advanced"], ["statistics", "advanced"], ["machine-learning", "advanced"], ["pandas", "advanced"], ["sql", "intermediate"],
      ["feature-engineering", "intermediate"], ["model-evaluation", "intermediate"], ["docker", "beginner"], ["git", "intermediate"], ["communication", "advanced"],
    ].map(([id, level]) => ({ id, level: level as SkillLevel })),
  },
  {
    id: "operations-learner",
    name: "Operations Learner (Synthetic)",
    summary: "A synthetic DevOps engineer building deeper platform reliability and infrastructure design skills.",
    currentRoleId: "devops-engineer",
    skills: [
      ["linux", "advanced"], ["git", "advanced"], ["docker", "advanced"], ["kubernetes", "intermediate"], ["ci-cd", "advanced"],
      ["aws", "intermediate"], ["terraform", "intermediate"], ["observability", "intermediate"], ["bash", "advanced"], ["security", "intermediate"],
    ].map(([id, level]) => ({ id, level: level as SkillLevel })),
  },
];

function formatSkillNames(skillIds: string[]): string {
  const names = skillIds.map(
    (id) => skillSpecs.find((skill) => skill.id === id)?.name ?? id,
  );
  return names.join(", ");
}

export function buildGraphData(): GraphData {
  const roles = roleSpecs.map((role) => ({
    id: role.id,
    slug: role.id,
    name: role.name,
    category: role.category,
    seniority: role.seniority,
    summary: role.summary,
    source: TAXONOMY_SOURCE,
  }));
  const skills = skillSpecs.map((skill) => ({
    ...skill,
    slug: skill.id,
    description: `Knowledge and practical application of ${skill.name} in software and data projects.`,
    source: TAXONOMY_SOURCE,
  }));

  const requires = roleSpecs.flatMap((role) =>
    role.skillIds.map((skillId, index) => ({
      roleId: role.id,
      skillId,
      importance: index < 2 ? 5 : index < 6 ? 4 : index < 8 ? 3 : 2,
      requiredLevel:
        index < 2 ? ("advanced" as const) : index < 6 ? ("intermediate" as const) : ("beginner" as const),
      essential: index < 6,
    })),
  );

  const transitions = transitionSpecs.map(([fromRoleId, toRoleId, difficulty]) => {
    const from = roleSpecs.find((role) => role.id === fromRoleId);
    const to = roleSpecs.find((role) => role.id === toRoleId);
    if (!from || !to) {
      throw new Error(`Unknown transition endpoint: ${fromRoleId} -> ${toRoleId}`);
    }
    const shared = from.skillIds.filter((skillId) => to.skillIds.includes(skillId)).slice(0, 3);
    const gaps = to.skillIds.filter((skillId) => !from.skillIds.includes(skillId)).slice(0, 2);
    return {
      fromRoleId,
      toRoleId,
      difficulty,
      reason: `${from.name} experience transfers through ${formatSkillNames(shared)}, while progress toward ${to.name} requires focused practice in ${formatSkillNames(gaps)}.`,
    };
  });

  const skillsByCategory = new Map<string, SkillSpec[]>();
  for (const skill of skillSpecs) {
    skillsByCategory.set(skill.category, [
      ...(skillsByCategory.get(skill.category) ?? []),
      skill,
    ]);
  }
  const relatedSkills = [...skillsByCategory.values()].flatMap((categorySkills) =>
    categorySkills.map((skill, index) => ({
      fromSkillId: skill.id,
      toSkillId: categorySkills[(index + 1) % categorySkills.length].id,
      relevance: 4,
    })),
  );
  relatedSkills.push(
    ...crossCategorySkillLinks.map(([fromSkillId, toSkillId, relevance]) => ({
      fromSkillId,
      toSkillId,
      relevance,
    })),
  );

  const learningResources = resourceSpecs.map((resource) => ({
    id: resource.id,
    title: resource.title,
    type: resource.type,
    provider: resource.provider,
    url: resource.url,
    description: resource.description,
    source: "Official provider documentation or learning material",
  }));
  const teaches = resourceSpecs.flatMap((resource) =>
    resource.skillIds.map((skillId) => ({ resourceId: resource.id, skillId })),
  );

  const projects = projectSpecs.map((project) => ({
    id: project.id,
    title: project.title,
    difficulty: project.difficulty,
    description: project.description,
    source: PROJECT_SOURCE,
  }));
  const demonstrates = projectSpecs.flatMap((project) =>
    project.skillIds.map((skillId) => ({ projectId: project.id, skillId })),
  );

  const profiles = profileSpecs.map((profile) => ({
    id: profile.id,
    name: profile.name,
    summary: profile.summary,
    synthetic: true as const,
  }));
  const hasSkills = profileSpecs.flatMap((profile) =>
    profile.skills.map((skill) => ({
      profileId: profile.id,
      skillId: skill.id,
      level: skill.level,
    })),
  );
  const currentRoles = profileSpecs.map((profile) => ({
    profileId: profile.id,
    roleId: profile.currentRoleId,
  }));

  return graphDataSchema.parse({
    roles,
    skills,
    learningResources,
    projects,
    profiles,
    relationships: {
      requires,
      transitions,
      relatedSkills,
      teaches,
      demonstrates,
      hasSkills,
      currentRoles,
    },
  });
}
