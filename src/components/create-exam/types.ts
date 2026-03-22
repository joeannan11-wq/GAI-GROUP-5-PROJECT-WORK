export type Step = "upload" | "review" | "configure";

export interface ParsedQuestion {
  id: number;
  type: "mcq" | "short" | "essay";
  text: string;
  options?: string[];
  answer?: string;
  marks: number;
  flagged?: boolean;
}

export const typeLabel = {
  mcq: "Multiple Choice",
  short: "Short Answer",
  essay: "Essay",
};

export const typeColor = {
  mcq: "bg-info/15 text-info",
  short: "bg-secondary/20 text-secondary-foreground",
  essay: "bg-primary/10 text-primary",
};

export const sampleQuestions: ParsedQuestion[] = [
  { id: 1, type: "mcq", text: "What is the value of x if 2x + 5 = 15?", options: ["3", "5", "7", "10"], answer: "5", marks: 2 },
  { id: 2, type: "mcq", text: "Which of the following is a prime number?", options: ["4", "9", "11", "15"], answer: "11", marks: 2 },
  { id: 3, type: "short", text: "Simplify the expression: 3(x + 4) - 2(x - 1)", answer: "x + 14", marks: 3 },
  { id: 4, type: "essay", text: "Explain the difference between a linear equation and a quadratic equation. Provide examples of each.", marks: 10, flagged: true },
  { id: 5, type: "mcq", text: "What is the area of a circle with radius 7 cm? (Use π = 22/7)", options: ["44 cm²", "154 cm²", "88 cm²", "308 cm²"], answer: "154 cm²", marks: 2 },
];

// Ghana Education Service syllabus topics by subject and grade
export const ghanaTopics: Record<string, Record<string, string[]>> = {
  mathematics: {
    jhs1: ["Number and Numeration", "Fractions and Decimals", "Ratios and Proportions", "Measurement (Length, Mass, Capacity)", "Basic Geometry (Lines, Angles)", "Data Handling (Pictographs, Bar Charts)", "Patterns and Sequences"],
    jhs2: ["Integers and Rational Numbers", "Algebraic Expressions", "Linear Equations in One Variable", "Geometry (Triangles, Quadrilaterals)", "Perimeter and Area", "Data Handling (Pie Charts, Mean)", "Sets and Operations"],
    jhs3: ["Indices and Standard Form", "Simultaneous Linear Equations", "Quadratic Equations", "Trigonometry (Sine, Cosine, Tangent)", "Circle Theorems", "Statistics (Mean, Median, Mode)", "Probability"],
    shs1: ["Sets, Relations and Functions", "Real Number System", "Algebraic Expressions and Equations", "Surds", "Sequences and Series", "Plane Geometry", "Coordinate Geometry"],
    shs2: ["Polynomials", "Rational and Irrational Functions", "Trigonometric Functions", "Matrices and Determinants", "Vectors in 2D", "Statistics and Probability", "Differentiation (Introduction)"],
    shs3: ["Calculus (Differentiation & Integration)", "Further Trigonometry", "Further Statistics", "Permutations and Combinations", "Binary Operations", "Logic and Proofs", "Numerical Methods"],
  },
  science: {
    jhs1: ["Living and Non-Living Things", "Cells and Tissues", "Measurement in Science", "Matter and Its Properties", "Forces and Motion (Introduction)", "The Solar System", "Environmental Awareness"],
    jhs2: ["Photosynthesis and Nutrition in Plants", "Human Body Systems (Digestive, Circulatory)", "Mixtures and Compounds", "Energy Forms and Transformation", "Simple Machines", "Rocks and Minerals", "Health and Diseases"],
    jhs3: ["Reproduction in Humans and Plants", "Acids, Bases and Salts", "Electricity and Magnetism", "The Periodic Table (Introduction)", "Ecology and Ecosystems", "Climate and Weather", "Science and Technology in Ghana"],
    shs1: ["Cell Biology", "Ecology", "Atomic Structure", "Chemical Bonding", "Kinematics", "Dynamics (Newton's Laws)", "Energy and Work"],
    shs2: ["Genetics and Heredity", "Evolution", "Organic Chemistry", "Electrochemistry", "Waves and Optics", "Thermal Physics", "Electrostatics"],
    shs3: ["Biotechnology", "Excretion and Homeostasis", "Industrial Chemistry", "Nuclear Chemistry", "Electromagnetism", "Modern Physics", "Environmental Chemistry"],
  },
  english: {
    jhs1: ["Parts of Speech (Nouns, Verbs, Adjectives)", "Sentence Construction", "Comprehension (Narrative Texts)", "Composition Writing (Descriptive)", "Vocabulary Development", "Spelling and Dictation", "Oral English (Pronunciation)"],
    jhs2: ["Tenses (Simple, Continuous, Perfect)", "Comprehension (Expository Texts)", "Composition (Narrative, Letter Writing)", "Figures of Speech (Simile, Metaphor)", "Synonyms and Antonyms", "Punctuation and Capitalization", "Oral English (Dialogue)"],
    jhs3: ["Active and Passive Voice", "Direct and Indirect Speech", "Comprehension (Argumentative Texts)", "Essay Writing (Argumentative, Discursive)", "Idiomatic Expressions", "Summary Writing", "Literature (Poetry, Prose)"],
    shs1: ["Advanced Grammar (Clauses, Phrases)", "Comprehension and Summary", "Narrative and Descriptive Essays", "Formal and Informal Letters", "Vocabulary in Context", "Introduction to Literature", "Speech and Oral Presentations"],
    shs2: ["Complex Sentence Structures", "Argumentative and Discursive Essays", "Literary Appreciation (Drama, Poetry)", "Report and Article Writing", "Registers and Styles", "Critical Reading", "Debate and Public Speaking"],
    shs3: ["Advanced Essay Types", "Literary Criticism", "Research and Referencing", "Précis Writing", "Advanced Comprehension", "Creative Writing", "Examination Preparation"],
  },
  social: {
    jhs1: ["The Family and Community", "Our Environment", "Ghana: Location and Physical Features", "Culture and National Identity", "Government (Local and National)", "Economic Activities in Ghana", "Map Reading (Introduction)"],
    jhs2: ["History of Ghana (Pre-Colonial)", "Colonialism in Ghana", "Independence and Nation Building", "Constitutional Development", "Resources and Industries", "Population and Migration", "West African Neighbours"],
    jhs3: ["Government and Democracy", "Human Rights and Responsibilities", "Ghana's Foreign Relations", "Economic Development and Challenges", "Science, Technology and Society", "Environmental Issues", "Contemporary Issues in Ghana"],
    shs1: ["Introduction to Government", "The Ghanaian Constitution", "Political Institutions", "Citizenship and Rights", "Economic Systems", "Social Organisation", "Introduction to International Relations"],
    shs2: ["Political Parties and Elections", "Public Administration", "Law and Justice", "National Development Planning", "International Organisations", "Conflict Resolution", "Africa in World Affairs"],
    shs3: ["Comparative Government", "International Law", "Globalisation", "Contemporary Political Issues", "Economic Integration in Africa", "Environmental Governance", "Ghana's Role in ECOWAS and AU"],
  },
  ict: {
    jhs1: ["Introduction to Computers", "Parts of a Computer", "Using the Keyboard and Mouse", "Introduction to Word Processing", "File Management", "Internet Basics", "Digital Citizenship and Safety"],
    jhs2: ["Advanced Word Processing", "Introduction to Spreadsheets", "Presentation Software", "Internet Research Skills", "Email Communication", "Introduction to Coding (Scratch)", "Hardware and Software"],
    jhs3: ["Database Concepts", "Advanced Spreadsheets (Formulas, Charts)", "Web Design Basics (HTML)", "Multimedia (Image & Video Editing)", "Networking Fundamentals", "Cybersecurity Awareness", "ICT and Society"],
    shs1: ["Computer Systems Architecture", "Operating Systems", "Word Processing and Desktop Publishing", "Spreadsheet Applications", "Introduction to Programming (Python/Visual Basic)", "Networking and the Internet", "ICT Ethics"],
    shs2: ["Database Design and Management", "Web Development (HTML, CSS)", "Programming (Loops, Functions, Arrays)", "Systems Analysis and Design", "Multimedia Systems", "E-Commerce", "Data Communication"],
    shs3: ["Advanced Programming", "Software Development Life Cycle", "Project Management in ICT", "Artificial Intelligence (Introduction)", "Cloud Computing", "ICT Project Work", "Emerging Technologies"],
  },
};
