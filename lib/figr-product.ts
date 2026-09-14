// ============================================================
// FIGR PRODUCT DATA + ASSESSMENT ENGINE
// ============================================================

export type CoreSkill =
  | "Numerical"
  | "Logical"
  | "Communication"
  | "Creativity"
  | "Organization"
  | "Practical";
export type StudentStep =
  | "profile"
  | "assessment"
  | "analysis"
  | "careers"
  | "college-selection"
  | "competitive-exams"
  | "counselling"
  | "gaps"
  | "roadmap"
  | "learning"
  | "companion"
  | "adaptation"
  | "handoff"
  | "alumni"
  | "internships";

export type ChatMessage = {
  from: "student" | "guide";
  text: string;
};

export interface GapItem {
  skill: CoreSkill;
  current: number;
  required: number;
  gap: number;
}

export interface RoadmapItem {
  title: string;
  type: string;
  objective: string;
  resource: string;
  weeks: string;
  duration: string;
}

export interface VerifiedResource {
  provider: string;
  type: string;
  url: string;
  cost: string;
}

export interface Counsellor {
  id: string;
  name: string;
  initials: string;
  role: string;
  focus: string;
  languages: string;
  experience: string;
  rating: string;
}

export type Track =
  | "Exploring all fields"
  | "Technology & Engineering"
  | "Commerce & Finance"
  | "Creative & Media"
  | "Hospitality & Service"
  | "Healthcare & People"
  | "Law & Public Service";

export type StudentProfile = {
  name: string;
  level: string;
  track: Track;
  budget: string;
  weeklyHours: number;
  interests: string[];
  selfRatings: Record<CoreSkill, number>;
};

export type Question = {
  id: string;
  skill: CoreSkill;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
  difficulty: "Foundation" | "Applied";
};

export type Career = {
  id: string;
  title: string;
  category: Exclude<Track, "Exploring all fields">;
  summary: string;
  tags: string[];
  color: string;
  requirements: Record<CoreSkill, number>;
  focusSkills: string[];
  trialTask: string;
  project: string;
  checkpoint: Question;
};

export type CareerResult = Career & {
  match: number;
  readiness: number;
  interestAlignment: number;
  supporting: CoreSkill[];
  missing: CoreSkill[];
};

// ============================================================
// CORE SKILLS
// ============================================================

export const coreSkills: CoreSkill[] = [
  "Numerical",
  "Logical",
  "Communication",
  "Creativity",
  "Organization",
  "Practical",
];

// ============================================================
// TRACKS
// ============================================================

export const tracks: Track[] = [
  "Exploring all fields",
  "Technology & Engineering",
  "Commerce & Finance",
  "Creative & Media",
  "Hospitality & Service",
  "Healthcare & People",
  "Law & Public Service",
];

// ============================================================
// INTEREST OPTIONS
// ============================================================

export const interestChoices = [
  "Programming",
  "Mathematics",
  "Problem Solving",
  "AI & Data",
  "Cybersecurity",
  "Design",
  "Writing",
  "Communication",
  "Public Speaking",
  "Teaching",
  "Science",
  "Medicine",
  "Law & Society",
  "Business",
  "Entrepreneurship",
  "Finance",
  "Accounting",
  "Marketing",
  "Food & Cooking",
  "Hospitality",
  "Robotics",
  "Gaming",
  "Helping People",
  "Leadership",
];

// ============================================================
// QUESTION HELPER
// ============================================================

const q = (
  id: string,
  skill: CoreSkill,
  prompt: string,
  options: string[],
  answer: number,
  explanation: string,
  difficulty: Question["difficulty"] = "Foundation",
): Question => ({
  id,
  skill,
  prompt,
  options,
  answer,
  explanation,
  difficulty,
});

// ============================================================
// QUESTION BANKS
// EXACTLY 15 QUESTIONS PER TRACK
// ============================================================

export const questionBanks: Record<Track, Question[]> = {

  // ==========================================================
  // EXPLORING ALL FIELDS
  // ==========================================================

  "Exploring all fields": [
    q(
      "all-num-01",
      "Numerical",
      "A ₹800 item has a 25% discount. What is the final price?",
      ["₹200", "₹600", "₹625", "₹750"],
      1,
      "25% of ₹800 is ₹200. Therefore ₹800 − ₹200 = ₹600.",
    ),

    q(
      "all-log-02",
      "Logical",
      "What comes next: 3, 6, 12, 24, ...?",
      ["30", "36", "42", "48"],
      3,
      "Each number is doubled. Therefore 24 × 2 = 48.",
    ),

    q(
      "all-com-03",
      "Communication",
      "A teammate misunderstood your idea. What is the clearest response?",
      [
        "Repeat it louder",
        "Use a simple example",
        "Ignore it",
        "Use more jargon",
      ],
      1,
      "A simple and relevant example can make an abstract idea easier to understand.",
    ),

    q(
      "all-cre-04",
      "Creativity",
      "Before redesigning a school poster, what should you understand first?",
      [
        "The audience and message",
        "The most expensive font",
        "How many effects fit",
        "What another school copied",
      ],
      0,
      "A strong design begins with understanding the audience and the purpose of the message.",
    ),

    q(
      "all-org-05",
      "Organization",
      "Three assignments have different deadlines. What should you do first?",
      [
        "Start randomly",
        "List deadlines and effort",
        "Wait for reminders",
        "Do only the easiest",
      ],
      1,
      "Listing deadlines and required effort helps you prioritise work intelligently.",
    ),

    q(
      "all-pra-06",
      "Practical",
      "Your model stops working before a demonstration. What is the best first step?",
      [
        "Throw it away",
        "Check power and connections",
        "Change the topic",
        "Hide the problem",
      ],
      1,
      "The best first step is to check simple possible causes such as power and connections.",
      "Applied",
    ),

    q(
      "all-num-07",
      "Numerical",
      "If 5 notebooks cost ₹250, how much does one notebook cost?",
      ["₹25", "₹40", "₹50", "₹60"],
      2,
      "₹250 divided by 5 notebooks gives ₹50 per notebook.",
    ),

    q(
      "all-log-08",
      "Logical",
      "If all A are B and all B are C, what must be true?",
      [
        "All C are A",
        "Some C are not B",
        "All A are C",
        "A and C are unrelated",
      ],
      2,
      "If A is inside B and B is inside C, then A must also be inside C.",
    ),

    q(
      "all-com-09",
      "Communication",
      "What is most important when giving instructions to a beginner?",
      [
        "Use difficult vocabulary",
        "Give clear ordered steps",
        "Speak as quickly as possible",
        "Avoid examples",
      ],
      1,
      "Clear steps make it easier for a beginner to follow and reproduce the task.",
    ),

    q(
      "all-cre-10",
      "Creativity",
      "You need three ideas for a school event. What is a useful brainstorming method?",
      [
        "Reject every idea immediately",
        "Generate several ideas before judging them",
        "Copy the first result online",
        "Choose without thinking",
      ],
      1,
      "Generating ideas first and evaluating them later encourages broader creative thinking.",
    ),

    q(
      "all-org-11",
      "Organization",
      "What is the best way to manage a project with several tasks?",
      [
        "Keep everything in memory",
        "Break it into tasks and deadlines",
        "Do tasks randomly",
        "Never review progress",
      ],
      1,
      "Breaking a project into smaller tasks with deadlines makes progress easier to manage.",
    ),

    q(
      "all-pra-12",
      "Practical",
      "A device becomes unusually hot. What should you do first?",
      [
        "Continue using it",
        "Ignore it",
        "Stop using it and check the cause safely",
        "Cover it with cloth",
      ],
      2,
      "Unexpected heat can indicate a problem. Stop using the device and investigate safely.",
      "Applied",
    ),

    q(
      "all-num-13",
      "Numerical",
      "A class has 40 students and 75% attend. How many students attend?",
      ["20", "25", "30", "35"],
      2,
      "75% of 40 is 30.",
    ),

    q(
      "all-log-14",
      "Logical",
      "Which approach is best when two explanations seem possible?",
      [
        "Choose randomly",
        "Look for evidence for both",
        "Always choose the first",
        "Ignore the problem",
      ],
      1,
      "Comparing evidence for competing explanations leads to a more reliable conclusion.",
      "Applied",
    ),

    q(
      "all-com-15",
      "Communication",
      "Which is the best way to explain a complex idea?",
      [
        "Use only technical words",
        "Break it into simple parts and examples",
        "Speak faster",
        "Avoid questions",
      ],
      1,
      "Breaking a complex concept into smaller parts and examples improves understanding.",
    ),
  ],

  // ==========================================================
  // TECHNOLOGY & ENGINEERING
  // ==========================================================

  "Technology & Engineering": [
    q(
      "tech-log-01",
      "Logical",
      "A loop repeats five times and adds 2 each time. What is added in total?",
      ["5", "7", "10", "12"],
      2,
      "Five additions of 2 produce 10.",
    ),

    q(
      "tech-num-02",
      "Numerical",
      "A 1.5 GB file is divided into 500 MB parts. Roughly how many parts are needed?",
      ["2", "3", "4", "5"],
      1,
      "1.5 GB is approximately 1500 MB, so 1500 ÷ 500 = 3 parts.",
    ),

    q(
      "tech-pra-03",
      "Practical",
      "A website button does nothing. What should you check first?",
      [
        "Its click action",
        "The logo colour",
        "The wallpaper",
        "The project name",
      ],
      0,
      "The click action is directly related to what should happen when the button is pressed.",
      "Applied",
    ),

    q(
      "tech-com-04",
      "Communication",
      "What makes a useful software bug report?",
      [
        "Only 'broken'",
        "Steps, expected result and actual result",
        "An emoji",
        "A guess about blame",
      ],
      1,
      "Reproduction steps plus expected and actual results help developers understand and reproduce the bug.",
    ),

    q(
      "tech-org-05",
      "Organization",
      "What is the safest way to build a large software feature?",
      [
        "One giant change",
        "Small tested steps",
        "No plan",
        "Skip saved versions",
      ],
      1,
      "Small tested changes are easier to debug, review and safely modify.",
    ),

    q(
      "tech-cre-06",
      "Creativity",
      "Two app ideas solve the same problem. Which is stronger?",
      [
        "The one with more colours",
        "The one tested with users",
        "The longer name",
        "The one with more screens",
      ],
      1,
      "Testing with users gives real evidence about whether the idea actually solves the problem.",
      "Applied",
    ),

    q(
      "tech-log-07",
      "Logical",
      "What should an algorithm contain?",
      [
        "Random actions",
        "Clear steps to solve a problem",
        "Only colours",
        "Only images",
      ],
      1,
      "An algorithm is a sequence of clear steps designed to solve a problem.",
    ),

    q(
      "tech-num-08",
      "Numerical",
      "A server processes 100 requests per second. How many requests does it process in 10 seconds?",
      ["100", "500", "1,000", "10,000"],
      2,
      "100 requests per second × 10 seconds = 1,000 requests.",
    ),

    q(
      "tech-pra-09",
      "Practical",
      "Your program crashes after a new change. What should you do?",
      [
        "Delete the whole project",
        "Check the recent change and error message",
        "Ignore it",
        "Add more features",
      ],
      1,
      "The recent change and error message provide useful evidence about the cause.",
      "Applied",
    ),

    q(
      "tech-com-10",
      "Communication",
      "When presenting a technical project, what should you explain first?",
      [
        "Every line of code",
        "The problem and solution",
        "Only your username",
        "Only the colours",
      ],
      1,
      "Starting with the problem and solution gives the audience context before technical details.",
    ),

    q(
      "tech-org-11",
      "Organization",
      "Why should developers use version control?",
      [
        "To make screens brighter",
        "To track and recover changes",
        "To remove documentation",
        "To avoid testing",
      ],
      1,
      "Version control records changes and makes it possible to review or recover previous versions.",
    ),

    q(
      "tech-cre-12",
      "Creativity",
      "A mobile app feels confusing. What is a useful improvement process?",
      [
        "Add more buttons",
        "Observe users and simplify the flow",
        "Add random animations",
        "Hide important options",
      ],
      1,
      "User observation can reveal confusion, allowing the interface flow to be simplified.",
      "Applied",
    ),

    q(
      "tech-log-13",
      "Logical",
      "If a condition is false, what should an if-statement do?",
      [
        "Always run the true branch",
        "Follow the appropriate alternative",
        "Delete the program",
        "Restart the computer",
      ],
      1,
      "Conditional logic chooses an appropriate branch based on whether the condition is true or false.",
    ),

    q(
      "tech-pra-14",
      "Practical",
      "A sensor gives unexpected values. What should you check first?",
      [
        "Its colour",
        "Connections and sensor input",
        "The application logo",
        "The project title",
      ],
      1,
      "Checking connections and the input source is a sensible first troubleshooting step.",
      "Applied",
    ),

    q(
      "tech-num-15",
      "Numerical",
      "A project takes 20 hours. If you work 4 hours per week, how many weeks will it take?",
      ["4", "5", "6", "8"],
      1,
      "20 hours ÷ 4 hours per week = 5 weeks.",
    ),
  ],

  // ==========================================================
  // COMMERCE & FINANCE
  // ==========================================================

  "Commerce & Finance": [
    q(
      "fin-num-01",
      "Numerical",
      "A product costs ₹500 and sells for ₹600. What is the profit?",
      ["₹50", "₹100", "₹500", "₹1,100"],
      1,
      "Profit = selling price − cost price = ₹600 − ₹500 = ₹100.",
    ),

    q(
      "fin-log-02",
      "Logical",
      "Two financial totals disagree. What should you do first?",
      [
        "Choose the larger",
        "Trace the entries",
        "Delete both",
        "Round randomly",
      ],
      1,
      "Tracing the source entries helps identify where the discrepancy occurred.",
    ),

    q(
      "fin-com-03",
      "Communication",
      "How should you explain a budget gap to a client?",
      [
        "Hide it",
        "Show the cause and available options",
        "Use only technical words",
        "Change the subject",
      ],
      1,
      "Showing the cause and options allows the client to make an informed decision.",
    ),

    q(
      "fin-org-04",
      "Organization",
      "Which record best tracks daily business sales?",
      [
        "A dated ledger",
        "A photo gallery",
        "A blank notebook",
        "A social post",
      ],
      0,
      "A dated ledger creates a consistent record of transactions.",
    ),

    q(
      "fin-pra-05",
      "Practical",
      "A receipt is missing during reconciliation. What should you do?",
      [
        "Invent an amount",
        "Flag and verify it",
        "Ignore it",
        "Delete the month",
      ],
      1,
      "Missing evidence should be flagged and verified rather than guessed.",
      "Applied",
    ),

    q(
      "fin-cre-06",
      "Creativity",
      "A shop wants more repeat customers. Which idea is easiest to test?",
      [
        "Change everything",
        "Try a simple loyalty offer",
        "Copy a random brand",
        "Raise every price",
      ],
      1,
      "A small loyalty trial is easy to implement and its results can be measured.",
      "Applied",
    ),

    q(
      "fin-num-07",
      "Numerical",
      "What is 10% of ₹2,000?",
      ["₹20", "₹100", "₹200", "₹500"],
      2,
      "10% of ₹2,000 is ₹200.",
    ),

    q(
      "fin-log-08",
      "Logical",
      "If expenses rise while income stays the same, what happens to profit?",
      [
        "It generally decreases",
        "It always doubles",
        "It becomes zero automatically",
        "It cannot change",
      ],
      0,
      "Profit depends on income minus expenses, so higher expenses generally reduce profit.",
    ),

    q(
      "fin-com-09",
      "Communication",
      "What makes a financial presentation useful?",
      [
        "Only numbers",
        "Clear numbers with context",
        "No labels",
        "Very small text",
      ],
      1,
      "Numbers are easier to understand when accompanied by clear labels and context.",
    ),

    q(
      "fin-org-10",
      "Organization",
      "What should be checked before submitting financial records?",
      [
        "Completeness and accuracy",
        "Font colour only",
        "Page decoration",
        "Random numbers",
      ],
      0,
      "Financial records should be checked for completeness and accuracy before submission.",
    ),

    q(
      "fin-pra-11",
      "Practical",
      "A spreadsheet formula gives an unexpected total. What should you check?",
      [
        "Cell references and formula",
        "Computer wallpaper",
        "Font style",
        "File icon",
      ],
      0,
      "Checking the formula and referenced cells is the most direct troubleshooting step.",
      "Applied",
    ),

    q(
      "fin-cre-12",
      "Creativity",
      "A business wants to attract students. Which is a useful first experiment?",
      [
        "Test a student-focused offer",
        "Change the entire business",
        "Remove all products",
        "Copy an unrelated company",
      ],
      0,
      "A focused experiment lets the business test whether the offer appeals to students.",
      "Applied",
    ),

    q(
      "fin-num-13",
      "Numerical",
      "An investment of ₹10,000 grows by 10%. What is the new value?",
      ["₹10,100", "₹10,500", "₹11,000", "₹12,000"],
      2,
      "10% of ₹10,000 is ₹1,000, so the new value is ₹11,000.",
    ),

    q(
      "fin-log-14",
      "Logical",
      "Why compare a company's results over multiple periods?",
      [
        "To make reports longer",
        "To identify trends",
        "To avoid calculations",
        "To guarantee future profit",
      ],
      1,
      "Multiple periods help identify trends and distinguish them from one-off changes.",
      "Applied",
    ),

    q(
      "fin-com-15",
      "Communication",
      "How should you communicate a financial risk?",
      [
        "Hide it",
        "Explain the risk, evidence and possible impact",
        "Use only jargon",
        "Blame someone",
      ],
      1,
      "Clear communication should explain the risk, supporting evidence and possible consequences.",
    ),
  ],

  // ==========================================================
  // CREATIVE & MEDIA
  // ==========================================================

  "Creative & Media": [
    q(
      "cre-cre-01",
      "Creativity",
      "What should guide the first version of a poster?",
      [
        "Audience and purpose",
        "Every available colour",
        "The most fonts",
        "A random trend",
      ],
      0,
      "The audience and purpose define whether a design communicates effectively.",
    ),

    q(
      "cre-com-02",
      "Communication",
      "A client says 'make it better.' What should you ask?",
      [
        "Nothing",
        "What outcome should improve?",
        "Can I add more effects?",
        "Why are you wrong?",
      ],
      1,
      "Clarifying the desired outcome turns vague feedback into a useful design goal.",
    ),

    q(
      "cre-log-03",
      "Logical",
      "Users repeatedly miss a menu item. Which evidence matters most?",
      [
        "Your taste",
        "Observed user behaviour",
        "A friend's guess",
        "Logo size",
      ],
      1,
      "Observed user behaviour provides stronger evidence than personal preference.",
    ),

    q(
      "cre-org-04",
      "Organization",
      "How should design files be handed to a team?",
      [
        "Unnamed versions",
        "Clearly named and organised",
        "Screenshots only",
        "One unlabelled folder",
      ],
      1,
      "Clear names and organised folders make collaboration easier.",
    ),

    q(
      "cre-num-05",
      "Numerical",
      "A 1200 px banner is split into three equal columns. Each column is:",
      ["300 px", "400 px", "600 px", "900 px"],
      1,
      "1200 ÷ 3 = 400 px.",
    ),

    q(
      "cre-pra-06",
      "Practical",
      "A design looks attractive but its text is difficult to read. What should change first?",
      [
        "Add animation",
        "Improve contrast and size",
        "Add another image",
        "Hide the text",
      ],
      1,
      "Readable contrast and appropriate text size are fundamental usability requirements.",
      "Applied",
    ),

    q(
      "cre-cre-07",
      "Creativity",
      "Which method can help generate many design ideas?",
      [
        "Brainstorming",
        "Deleting ideas immediately",
        "Copying one design",
        "Avoiding experimentation",
      ],
      0,
      "Brainstorming encourages generating multiple possible ideas before evaluating them.",
    ),

    q(
      "cre-com-08",
      "Communication",
      "What makes a strong visual message?",
      [
        "A clear hierarchy",
        "Random placement",
        "Tiny text",
        "Too many competing messages",
      ],
      0,
      "Visual hierarchy guides the viewer toward the most important information.",
    ),

    q(
      "cre-log-09",
      "Logical",
      "If users fail the same task repeatedly, what should you investigate?",
      [
        "The user must always be wrong",
        "The design or process causing the difficulty",
        "The weather",
        "The file name",
      ],
      1,
      "Repeated failure is evidence that the design or process should be investigated.",
      "Applied",
    ),

    q(
      "cre-org-10",
      "Organization",
      "What is useful when managing multiple creative versions?",
      [
        "Clear version names",
        "Random filenames",
        "Deleting all old versions",
        "No backups",
      ],
      0,
      "Clear version names make it easier to identify and recover the correct work.",
    ),

    q(
      "cre-num-11",
      "Numerical",
      "A video is 10 minutes long and you edit 3 minutes each hour. Approximately how many hours are needed?",
      ["1", "2", "3", "5"],
      2,
      "10 ÷ 3 is approximately 3.3 hours, so about 3–4 hours are needed.",
    ),

    q(
      "cre-pra-12",
      "Practical",
      "A microphone records very low audio. What should you check first?",
      [
        "Input level and connection",
        "Video thumbnail",
        "Font size",
        "File name",
      ],
      0,
      "Input level and physical connection are direct possible causes of low audio.",
      "Applied",
    ),

    q(
      "cre-cre-13",
      "Creativity",
      "Why is prototyping useful?",
      [
        "It allows ideas to be tested before final production",
        "It guarantees success",
        "It removes users",
        "It prevents feedback",
      ],
      0,
      "A prototype allows an idea to be tested and improved before significant production effort.",
    ),

    q(
      "cre-com-14",
      "Communication",
      "When presenting creative work, what should you explain?",
      [
        "Only the colours",
        "The problem, design choices and intended outcome",
        "Only the software used",
        "Nothing",
      ],
      1,
      "Explaining the problem, design decisions and intended outcome gives useful context.",
    ),

    q(
      "cre-org-15",
      "Organization",
      "What is a good way to handle client feedback?",
      [
        "Ignore it",
        "Record feedback and prioritise changes",
        "Change everything randomly",
        "Delete previous work",
      ],
      1,
      "Recording and prioritising feedback prevents confusion and keeps the project organised.",
      "Applied",
    ),
  ],

  // ==========================================================
  // HOSPITALITY & SERVICE
  // ==========================================================

  "Hospitality & Service": [
    q(
      "hos-num-01",
      "Numerical",
      "A recipe for four needs two cups of flour. How much is needed for eight?",
      ["2 cups", "3 cups", "4 cups", "8 cups"],
      2,
      "Doubling the servings doubles the flour from 2 to 4 cups.",
    ),

    q(
      "hos-org-02",
      "Organization",
      "Three dishes must finish together. What helps most?",
      [
        "A timing plan",
        "Starting randomly",
        "Cooking one tomorrow",
        "Ignoring preparation",
      ],
      0,
      "A timing plan coordinates preparation and cooking durations.",
    ),

    q(
      "hos-com-03",
      "Communication",
      "A guest reports a wrong order. What should you do first?",
      [
        "Argue",
        "Listen, apologise and confirm",
        "Walk away",
        "Blame the kitchen",
      ],
      1,
      "Listening, apologising and confirming the issue is a respectful first response.",
    ),

    q(
      "hos-pra-04",
      "Practical",
      "An ingredient is unavailable. What is the best response?",
      [
        "Use anything",
        "Choose a safe suitable substitute",
        "Hide it",
        "Cancel every order",
      ],
      1,
      "A safe and suitable substitute can preserve quality while handling the constraint.",
      "Applied",
    ),

    q(
      "hos-cre-05",
      "Creativity",
      "A new dish should first be judged by:",
      [
        "Taste, safety and audience",
        "Name length",
        "Plate price only",
        "Ingredient count",
      ],
      0,
      "A successful dish should be safe, appropriate for its audience and enjoyable.",
    ),

    q(
      "hos-log-06",
      "Logical",
      "Orders are delayed at one station. What should be checked?",
      [
        "The bottleneck process",
        "The wall colour",
        "The music",
        "The menu font",
      ],
      0,
      "The bottleneck is the step limiting the overall workflow.",
      "Applied",
    ),

    q(
      "hos-num-07",
      "Numerical",
      "A restaurant receives 60 orders and 10% are cancelled. How many remain?",
      ["50", "54", "56", "59"],
      1,
      "10% of 60 is 6. Therefore 60 − 6 = 54.",
    ),

    q(
      "hos-org-08",
      "Organization",
      "What is important before a busy service begins?",
      [
        "Preparation and task allocation",
        "Waiting for problems",
        "Randomly choosing tasks",
        "Ignoring stock",
      ],
      0,
      "Preparation and clear task allocation reduce delays during busy periods.",
    ),

    q(
      "hos-com-09",
      "Communication",
      "A customer cannot understand a menu item. What should you do?",
      [
        "Ignore them",
        "Explain it clearly and answer questions",
        "Use more jargon",
        "Tell them to search online",
      ],
      1,
      "Clear explanations help customers make informed choices.",
    ),

    q(
      "hos-pra-10",
      "Practical",
      "A kitchen surface becomes contaminated. What should happen?",
      [
        "Continue using it",
        "Clean and sanitise it appropriately",
        "Cover it with paper",
        "Ignore it",
      ],
      1,
      "Proper cleaning and sanitisation are essential for food safety.",
      "Applied",
    ),

    q(
      "hos-cre-11",
      "Creativity",
      "A cafe wants a new seasonal drink. What is a useful approach?",
      [
        "Test a small recipe variation",
        "Change the whole menu",
        "Copy any competitor",
        "Choose randomly",
      ],
      0,
      "Testing a small variation allows the business to gather feedback before a larger launch.",
    ),

    q(
      "hos-log-12",
      "Logical",
      "If customer complaints suddenly increase, what should you examine?",
      [
        "Patterns in the complaints",
        "Only the logo",
        "The weather only",
        "Nothing",
      ],
      0,
      "Looking for patterns can identify whether the complaints share a common cause.",
      "Applied",
    ),

    q(
      "hos-num-13",
      "Numerical",
      "A recipe costs ₹400 to prepare and makes 8 portions. Cost per portion is:",
      ["₹25", "₹40", "₹50", "₹80"],
      2,
      "₹400 ÷ 8 = ₹50 per portion.",
    ),

    q(
      "hos-org-14",
      "Organization",
      "How should reservations be managed?",
      [
        "By memory only",
        "Using an accurate booking record",
        "On random paper",
        "Without dates",
      ],
      1,
      "Accurate booking records reduce scheduling mistakes and double bookings.",
    ),

    q(
      "hos-com-15",
      "Communication",
      "What is the best response when a customer gives unclear instructions?",
      [
        "Guess",
        "Ask a clear clarification question",
        "Ignore them",
        "Blame them",
      ],
      1,
      "Clarifying the request prevents avoidable mistakes.",
    ),
  ],

  // ==========================================================
  // HEALTHCARE & PEOPLE
  // ==========================================================

  "Healthcare & People": [
    q(
      "hea-com-01",
      "Communication",
      "Someone is nervous while explaining a problem. What helps most?",
      [
        "Interrupting",
        "Listening and clarifying",
        "Judging quickly",
        "Changing the topic",
      ],
      1,
      "Calm listening and clarification help the person feel understood.",
    ),

    q(
      "hea-log-02",
      "Logical",
      "A conclusion is based on one example. What is the main risk?",
      [
        "Too much evidence",
        "Overgeneralising",
        "Clear reasoning",
        "Better planning",
      ],
      1,
      "One example may not represent a larger population or situation.",
    ),

    q(
      "hea-org-03",
      "Organization",
      "Several learners need follow-up. What is the safest approach?",
      [
        "Rely on memory",
        "Keep a clear confidential schedule",
        "Post names publicly",
        "Contact randomly",
      ],
      1,
      "A confidential schedule supports consistent and responsible follow-up.",
    ),

    q(
      "hea-pra-04",
      "Practical",
      "A student does not understand your explanation. What should you try?",
      [
        "Repeat exactly",
        "Use another example or method",
        "Skip it",
        "Lower the score",
      ],
      1,
      "A different example or method may match the learner's needs better.",
      "Applied",
    ),

    q(
      "hea-num-05",
      "Numerical",
      "A class has 30 students and 80% attend. How many are present?",
      ["18", "20", "24", "28"],
      2,
      "80% of 30 is 24.",
    ),

    q(
      "hea-cre-06",
      "Creativity",
      "Which activity best explains a difficult idea?",
      [
        "A relevant demonstration",
        "More jargon",
        "No examples",
        "Longer copying",
      ],
      0,
      "A concrete demonstration can make an unfamiliar concept easier to understand.",
    ),

    q(
      "hea-com-07",
      "Communication",
      "What is important when explaining sensitive information?",
      [
        "Privacy and respectful language",
        "Speaking publicly",
        "Using jokes",
        "Ignoring questions",
      ],
      0,
      "Sensitive information should be communicated respectfully and with appropriate privacy.",
    ),

    q(
      "hea-log-08",
      "Logical",
      "Why is it risky to make a conclusion from a single observation?",
      [
        "It may not represent the full situation",
        "It always proves the conclusion",
        "It contains too much evidence",
        "It removes uncertainty",
      ],
      0,
      "A single observation may not represent the wider situation, so more evidence may be needed.",
      "Applied",
    ),

    q(
      "hea-org-09",
      "Organization",
      "Why are accurate records important in care-related work?",
      [
        "They support consistent follow-up",
        "They make work decorative",
        "They replace communication",
        "They remove responsibility",
      ],
      0,
      "Accurate records support continuity, consistency and responsible follow-up.",
    ),

    q(
      "hea-pra-10",
      "Practical",
      "A person reports a problem you cannot safely handle yourself. What should you do?",
      [
        "Pretend to know",
        "Follow the appropriate escalation process",
        "Ignore them",
        "Give random instructions",
      ],
      1,
      "When a situation is beyond your role, following the appropriate escalation process is safer.",
      "Applied",
    ),

    q(
      "hea-num-11",
      "Numerical",
      "A study has 200 participants and 25% are in one group. How many participants are in that group?",
      ["25", "40", "50", "75"],
      2,
      "25% of 200 is 50.",
    ),

    q(
      "hea-cre-12",
      "Creativity",
      "Which approach can make health education easier to understand?",
      [
        "Relevant visuals and examples",
        "More jargon",
        "No examples",
        "Very small text",
      ],
      0,
      "Relevant visuals and examples can make health information more accessible.",
    ),

    q(
      "hea-com-13",
      "Communication",
      "What is active listening?",
      [
        "Waiting only for your turn",
        "Listening, clarifying and responding",
        "Interrupting",
        "Ignoring emotions",
      ],
      1,
      "Active listening involves paying attention, clarifying meaning and responding appropriately.",
    ),

    q(
      "hea-log-14",
      "Logical",
      "If two possible explanations fit the same evidence, what should you do?",
      [
        "Consider additional evidence",
        "Choose randomly",
        "Declare both false",
        "Ignore the evidence",
      ],
      0,
      "Additional evidence can help distinguish between competing explanations.",
      "Applied",
    ),

    q(
      "hea-org-15",
      "Organization",
      "What is a good way to prepare for several appointments?",
      [
        "Use a clear schedule",
        "Rely entirely on memory",
        "Book overlapping times",
        "Avoid recording times",
      ],
      0,
      "A clear schedule reduces conflicts and missed appointments.",
    ),
  ],

  // ==========================================================
  // LAW & PUBLIC SERVICE
  // ==========================================================

  "Law & Public Service": [
    q(
      "law-log-01",
      "Logical",
      "An argument gives a conclusion but no evidence. What is missing?",
      [
        "A louder speaker",
        "Supporting reasons",
        "A longer title",
        "More repetition",
      ],
      1,
      "A conclusion needs relevant reasons or evidence to make the argument stronger.",
    ),

    q(
      "law-com-02",
      "Communication",
      "Two people disagree about a rule. What is the clearest next step?",
      [
        "Insult one person",
        "Read the rule and define the disputed point",
        "Ignore both",
        "Choose at random",
      ],
      1,
      "Reviewing the rule and identifying the exact disagreement creates a fair basis for discussion.",
    ),

    q(
      "law-org-03",
      "Organization",
      "How should documents for a public application be prepared?",
      [
        "Unlabelled",
        "Indexed and checked",
        "Mixed with personal notes",
        "Submitted incomplete",
      ],
      1,
      "Indexing and checking documents reduces omissions and makes review easier.",
    ),

    q(
      "law-num-04",
      "Numerical",
      "A town budget is ₹10 lakh and 30% funds education. How much is that?",
      ["₹1 lakh", "₹2 lakh", "₹3 lakh", "₹7 lakh"],
      2,
      "30% of ₹10 lakh is ₹3 lakh.",
    ),

    q(
      "law-cre-05",
      "Creativity",
      "A policy is difficult for citizens to understand. What could help?",
      [
        "More jargon",
        "A plain-language visual guide",
        "A smaller font",
        "No explanation",
      ],
      1,
      "Plain-language communication can make public information easier to understand.",
    ),

    q(
      "law-pra-06",
      "Practical",
      "You discover an error in a submitted report. What is the responsible action?",
      [
        "Hide it",
        "Report and correct it through the proper process",
        "Blame someone",
        "Delete the evidence",
      ],
      1,
      "Transparent correction protects accuracy and trust.",
      "Applied",
    ),

    q(
      "law-log-07",
      "Logical",
      "What makes evidence relevant to a claim?",
      [
        "It directly supports or challenges the claim",
        "It is very long",
        "It sounds impressive",
        "It is repeated many times",
      ],
      0,
      "Relevant evidence has a logical connection to the claim being examined.",
    ),

    q(
      "law-com-08",
      "Communication",
      "What is important in a public notice?",
      [
        "Clarity and accuracy",
        "Ambiguous wording",
        "Hidden information",
        "Unverified claims",
      ],
      0,
      "Public notices should communicate accurate information clearly and accessibly.",
    ),

    q(
      "law-org-09",
      "Organization",
      "Why are case documents usually organised carefully?",
      [
        "To find information efficiently",
        "To make them colourful",
        "To hide evidence",
        "To increase page count",
      ],
      0,
      "Careful organisation makes relevant information easier to locate and review.",
    ),

    q(
      "law-num-10",
      "Numerical",
      "A programme has a budget of ₹5 lakh and spends 60%. How much is spent?",
      ["₹2 lakh", "₹3 lakh", "₹4 lakh", "₹4.5 lakh"],
      1,
      "60% of ₹5 lakh is ₹3 lakh.",
    ),

    q(
      "law-pra-11",
      "Practical",
      "You receive two conflicting official documents. What should you do?",
      [
        "Choose randomly",
        "Verify which document is current and authoritative",
        "Delete both",
        "Ignore the conflict",
      ],
      1,
      "Checking the current authoritative source helps resolve conflicting information.",
      "Applied",
    ),

    q(
      "law-cre-12",
      "Creativity",
      "Citizens struggle to understand a government process. What could improve it?",
      [
        "A simple step-by-step guide",
        "More legal jargon",
        "Fewer instructions",
        "No examples",
      ],
      0,
      "A step-by-step guide can make a complex process easier for citizens to follow.",
    ),

    q(
      "law-log-13",
      "Logical",
      "If a claim contradicts reliable evidence, what should happen?",
      [
        "Re-examine the claim",
        "Ignore the evidence",
        "Repeat the claim louder",
        "Delete the evidence",
      ],
      0,
      "Reliable contradictory evidence is a reason to reassess the claim.",
      "Applied",
    ),

    q(
      "law-com-14",
      "Communication",
      "When explaining a disagreement, what should you focus on?",
      [
        "The issue and supporting evidence",
        "Personal insults",
        "Rumours",
        "Who speaks louder",
      ],
      0,
      "Focusing on the issue and evidence keeps communication constructive and relevant.",
    ),

    q(
      "law-org-15",
      "Organization",
      "What is useful before submitting an official application?",
      [
        "A final checklist",
        "Guessing",
        "Leaving fields blank",
        "Submitting without review",
      ],
      0,
      "A final checklist helps catch missing information before submission.",
    ),
  ],
};

// ============================================================
// CAREER HELPER
// ============================================================

const career = (
  id: string,
  title: string,
  category: Career["category"],
  summary: string,
  tags: string[],
  color: string,
  requirements: Record<CoreSkill, number>,
  focusSkills: string[],
  trialTask: string,
  project: string,
  checkpoint: Question,
): Career => ({
  id,
  title,
  category,
  summary,
  tags,
  color,
  requirements,
  focusSkills,
  trialTask,
  project,
  checkpoint,
});

// ============================================================
// CAREERS
// ============================================================

export const careers: Career[] = [

  career(
    "ml",
    "AI / Machine Learning Engineer",
    "Technology & Engineering",
    "Build systems that learn from data and improve through evidence.",
    ["Programming", "Mathematics", "AI & Data", "Problem Solving"],
    "#5147D9",
    {
      Numerical: 9,
      Logical: 9,
      Communication: 6,
      Creativity: 7,
      Organization: 7,
      Practical: 8,
    },
    ["Python", "Probability", "Model evaluation"],
    "Classify a small set of examples and explain the rule you used.",
    "Train and explain a beginner classification model.",
    q(
      "ml-check",
      "Logical",
      "Why should a model be tested on data it did not train on?",
      [
        "To make training longer",
        "To check whether it generalises",
        "To remove all errors",
        "To avoid collecting evidence",
      ],
      1,
      "Unseen data checks whether the model learned a useful pattern rather than memorising examples.",
      "Applied",
    ),
  ),

  career(
    "data-science",
    "Data Scientist",
    "Technology & Engineering",
    "Use statistics, code and experimentation to answer complex questions.",
    ["AI & Data", "Mathematics", "Programming", "Research"],
    "#3C64C7",
    {
      Numerical: 10,
      Logical: 9,
      Communication: 7,
      Creativity: 7,
      Organization: 8,
      Practical: 7,
    },
    ["Statistics", "Python", "Experiment design"],
    "Find one useful pattern in a small table and explain its limits.",
    "Complete an evidence-based data investigation.",
    q(
      "ds-check",
      "Numerical",
      "Which measure is least affected by one extreme value?",
      ["Mean", "Median", "Range", "Maximum"],
      1,
      "The median depends on order, so one extreme value usually changes it less than the mean.",
    ),
  ),

  career(
    "data-analyst",
    "Data Analyst",
    "Technology & Engineering",
    "Turn raw data into clear findings that support decisions.",
    ["AI & Data", "Mathematics", "Business", "Communication"],
    "#24899A",
    {
      Numerical: 9,
      Logical: 8,
      Communication: 8,
      Creativity: 6,
      Organization: 9,
      Practical: 8,
    },
    ["Spreadsheets", "SQL", "Data visualisation"],
    "Turn a five-row dataset into one chart and a one-sentence finding.",
    "Build a small decision dashboard.",
    q(
      "da-check",
      "Practical",
      "Which chart is clearest for comparing five categories?",
      ["Bar chart", "World map", "Scatter plot", "Gauge"],
      0,
      "A bar chart makes categorical values easy to compare.",
    ),
  ),

  career(
    "software",
    "Software Engineer",
    "Technology & Engineering",
    "Design dependable software by breaking problems into testable parts.",
    ["Programming", "Problem Solving", "Technology"],
    "#355ED7",
    {
      Numerical: 7,
      Logical: 10,
      Communication: 7,
      Creativity: 7,
      Organization: 9,
      Practical: 9,
    },
    ["Programming", "Algorithms", "Software design"],
    "Write steps for a simple app feature before writing any code.",
    "Build and test a small useful application.",
    q(
      "se-check",
      "Logical",
      "A program gives the wrong output. What is the best first debugging step?",
      [
        "Rewrite everything",
        "Check the smallest failing input",
        "Add features",
        "Ignore it",
      ],
      1,
      "A small failing input helps isolate the cause.",
    ),
  ),

  career(
    "full-stack",
    "Full Stack Developer",
    "Technology & Engineering",
    "Create complete web products from user interface to server logic.",
    ["Programming", "Design", "Problem Solving"],
    "#496FCA",
    {
      Numerical: 6,
      Logical: 9,
      Communication: 7,
      Creativity: 8,
      Organization: 8,
      Practical: 10,
    },
    ["Web foundations", "APIs", "Databases"],
    "Sketch a form and list what data its backend must receive.",
    "Build a small end-to-end web product.",
    q(
      "fs-check",
      "Practical",
      "What format is commonly used to exchange data between a web frontend and API?",
      ["JPEG", "JSON", "MP3", "CSS"],
      1,
      "JSON is a common structured format for web requests and responses.",
    ),
  ),

  career(
    "cyber",
    "Cybersecurity Analyst",
    "Technology & Engineering",
    "Protect systems, investigate threats and communicate digital risk.",
    ["Cybersecurity", "Programming", "Law & Society", "Problem Solving"],
    "#4A68AA",
    {
      Numerical: 6,
      Logical: 10,
      Communication: 8,
      Creativity: 6,
      Organization: 9,
      Practical: 9,
    },
    ["Networking", "Security fundamentals", "Threat analysis"],
    "Inspect a sample message and list three phishing clues.",
    "Write a beginner incident-analysis report.",
    q(
      "cy-check",
      "Practical",
      "You receive an unexpected login link. What should you do first?",
      [
        "Open it",
        "Forward it",
        "Verify sender and URL",
        "Enter a password",
      ],
      2,
      "Verification reduces the chance of entering credentials into a phishing page.",
    ),
  ),

  career(
    "cloud",
    "Cloud Engineer",
    "Technology & Engineering",
    "Build reliable online infrastructure and manage scalable services.",
    ["Programming", "Technology", "Problem Solving"],
    "#476F9E",
    {
      Numerical: 6,
      Logical: 9,
      Communication: 7,
      Creativity: 5,
      Organization: 10,
      Practical: 9,
    },
    ["Cloud concepts", "Linux", "Networking"],
    "Draw how a browser request reaches a hosted application.",
    "Deploy and document a small static service.",
    q(
      "cl-check",
      "Organization",
      "Why are infrastructure changes recorded as code?",
      [
        "To add colours",
        "To make them repeatable and reviewable",
        "To avoid testing",
        "To hide settings",
      ],
      1,
      "Recorded configuration can be reviewed and reproduced consistently.",
    ),
  ),

  career(
    "devops",
    "DevOps Engineer",
    "Technology & Engineering",
    "Improve how teams build, test, release and operate software.",
    ["Programming", "Leadership", "Problem Solving"],
    "#557692",
    {
      Numerical: 6,
      Logical: 9,
      Communication: 8,
      Creativity: 6,
      Organization: 10,
      Practical: 10,
    },
    ["Git", "Automation", "Monitoring"],
    "Create a checklist that prevents one common release failure.",
    "Automate a small build-and-check workflow.",
    q(
      "do-check",
      "Organization",
      "What is the main value of an automated test before deployment?",
      [
        "It guarantees perfection",
        "It detects known failures consistently",
        "It removes users",
        "It changes the design",
      ],
      1,
      "Automation repeatedly checks expected behaviour and catches regressions.",
    ),
  ),

  career(
    "ux",
    "UI/UX Designer",
    "Creative & Media",
    "Research people's needs and design useful, understandable experiences.",
    ["Design", "Creativity", "Helping People", "Communication"],
    "#8B61B5",
    {
      Numerical: 4,
      Logical: 7,
      Communication: 9,
      Creativity: 10,
      Organization: 7,
      Practical: 8,
    },
    ["Visual design", "UX research", "Prototyping"],
    "Observe someone completing one task and note where they hesitate.",
    "Create a tested mobile app case study.",
    q(
      "ux-check",
      "Logical",
      "Users cannot find an important button. What should a designer do first?",
      [
        "Add animation",
        "Observe and test the flow",
        "Hide more controls",
        "Change every colour",
      ],
      1,
      "Testing the task reveals why the control is being missed.",
    ),
  ),

  career(
    "product-design",
    "Product Designer",
    "Creative & Media",
    "Connect user research, product strategy and interface design.",
    ["Design", "Business", "Communication", "Creativity"],
    "#9A62A8",
    {
      Numerical: 5,
      Logical: 8,
      Communication: 9,
      Creativity: 10,
      Organization: 8,
      Practical: 8,
    },
    ["Research", "Product thinking", "Design systems"],
    "Interview one classmate about a repeated problem and map the steps.",
    "Design and validate a focused product concept.",
    q(
      "pd-check",
      "Communication",
      "Which interview question is least likely to lead the participant?",
      [
        "You like this, right?",
        "What happened the last time you did this?",
        "Isn't this confusing?",
        "Wouldn't this button help?",
      ],
      1,
      "Asking about a past event encourages specific evidence without suggesting an answer.",
    ),
  ),

  career(
    "game",
    "Game Developer",
    "Creative & Media",
    "Combine code, systems and storytelling to create interactive experiences.",
    ["Gaming", "Programming", "Creativity", "Design"],
    "#7564C5",
    {
      Numerical: 7,
      Logical: 9,
      Communication: 6,
      Creativity: 10,
      Organization: 7,
      Practical: 9,
    },
    ["Game loops", "Programming", "Level design"],
    "Design a paper game with one rule and test it with a friend.",
    "Build a small playable prototype.",
    q(
      "gd-check",
      "Practical",
      "What is a game loop responsible for?",
      [
        "Only the title",
        "Repeatedly updating input, state and output",
        "Writing the store page",
        "Choosing a username",
      ],
      1,
      "A game loop repeatedly processes input, updates game state and renders output.",
    ),
  ),

  career(
    "robotics",
    "Robotics Engineer",
    "Technology & Engineering",
    "Combine mechanics, electronics and software to build intelligent machines.",
    ["Robotics", "Science", "Mathematics", "Programming"],
    "#2F7B86",
    {
      Numerical: 9,
      Logical: 9,
      Communication: 6,
      Creativity: 8,
      Organization: 8,
      Practical: 10,
    },
    ["Electronics", "Mechanics", "Control systems"],
    "Map the sensor, decision and action parts of a line-following robot.",
    "Prototype a simple sensing-and-action system.",
    q(
      "ro-check",
      "Logical",
      "In a robot, a sensor primarily provides:",
      [
        "Decoration",
        "Information about the environment",
        "Battery power",
        "A final report",
      ],
      1,
      "Sensors provide information about physical conditions that the system can use.",
    ),
  ),

  career(
    "doctor",
    "Doctor / Medical Professional",
    "Healthcare & People",
    "Use scientific evidence and compassionate communication to support health.",
    ["Medicine", "Science", "Helping People"],
    "#C65B72",
    {
      Numerical: 7,
      Logical: 9,
      Communication: 9,
      Creativity: 5,
      Organization: 10,
      Practical: 9,
    },
    ["Biology", "Scientific reasoning", "Empathy"],
    "Explain a simple body system to a younger student without jargon.",
    "Create an evidence-based health education brief.",
    q(
      "med-check",
      "Logical",
      "Why is one symptom alone rarely enough for a diagnosis?",
      [
        "Symptoms are never useful",
        "Different conditions can share symptoms",
        "Tests are decorative",
        "Doctors should guess",
      ],
      1,
      "Different conditions can produce similar symptoms, so context and evidence matter.",
    ),
  ),

  career(
    "lawyer",
    "Lawyer / Legal Professional",
    "Law & Public Service",
    "Research rules, analyse arguments and communicate cases clearly.",
    ["Law & Society", "Writing", "Public Speaking", "Research"],
    "#A85D50",
    {
      Numerical: 4,
      Logical: 10,
      Communication: 10,
      Creativity: 7,
      Organization: 9,
      Practical: 7,
    },
    ["Legal reasoning", "Research", "Argumentation"],
    "Read two short arguments and identify the claim and evidence in each.",
    "Prepare a structured case brief and oral argument.",
    q(
      "law-check",
      "Logical",
      "What makes evidence relevant to an argument?",
      [
        "It is lengthy",
        "It directly supports or challenges the claim",
        "It uses difficult words",
        "It is repeated",
      ],
      1,
      "Relevant evidence has a clear logical relationship to the claim.",
    ),
  ),

  career(
    "teacher",
    "Teacher / Learning Designer",
    "Healthcare & People",
    "Help learners understand ideas through explanation, planning and feedback.",
    ["Teaching", "Helping People", "Communication", "Leadership"],
    "#28739A",
    {
      Numerical: 6,
      Logical: 7,
      Communication: 10,
      Creativity: 9,
      Organization: 9,
      Practical: 8,
    },
    ["Subject knowledge", "Explanation", "Assessment"],
    "Teach a five-minute concept and ask one question that checks understanding.",
    "Create and deliver a short learning experience.",
    q(
      "te-check",
      "Communication",
      "Which activity best checks understanding during a lesson?",
      [
        "Only attendance",
        "A short concept question",
        "More copying",
        "Speaking without pauses",
      ],
      1,
      "A targeted question reveals whether learners understood the concept.",
    ),
  ),

  career(
    "chef",
    "Chef / Culinary Professional",
    "Hospitality & Service",
    "Combine creativity, food science, discipline and service in professional kitchens.",
    ["Food & Cooking", "Hospitality", "Creativity", "Leadership"],
    "#D76849",
    {
      Numerical: 6,
      Logical: 6,
      Communication: 8,
      Creativity: 10,
      Organization: 10,
      Practical: 10,
    },
    ["Food safety", "Culinary technique", "Kitchen management"],
    "Plan the timing and hygiene steps for preparing one simple dish.",
    "Create a recipe, costing sheet and plated result.",
    q(
      "chef-check",
      "Practical",
      "What is the safest way to avoid raw-food cross-contamination?",
      [
        "Use the same board",
        "Rinse hands only",
        "Separate tools and wash properly",
        "Cook everything together",
      ],
      2,
      "Separating equipment and proper washing reduces harmful transfer.",
    ),
  ),
  career(
    "bpo",
    "BPO / Customer Support Associate",
    "Hospitality & Service",
    "Help customers solve problems through patient communication, process knowledge and accurate follow-up.",
    ["Communication", "Helping People", "Business", "Organization"],
    "#168C82",
    {
      Numerical: 5,
      Logical: 7,
      Communication: 10,
      Creativity: 6,
      Organization: 9,
      Practical: 9,
    },
    ["Active listening", "Customer communication", "Process accuracy"],
    "Respond to a fictional customer complaint in four calm, useful sentences.",
    "Create a small customer-support response guide and escalation checklist.",
    q(
      "bpo-check",
      "Communication",
      "A customer is upset and explains several problems at once. What should you do first?",
      [
        "End the conversation",
        "Acknowledge the concern and clarify the main issue",
        "Promise an impossible result",
        "Transfer them without explanation",
      ],
      1,
      "Acknowledging the concern and clarifying the issue creates a respectful, accurate starting point.",
      "Applied",
    ),
  ),
  career(
    "marketing",
    "Digital Marketing Specialist",
    "Creative & Media",
    "Grow audiences through clear stories, experiments and data-informed campaigns.",
    ["Marketing", "Communication", "Creativity", "AI & Data"],
    "#BE6B8F",
    {
      Numerical: 6,
      Logical: 7,
      Communication: 10,
      Creativity: 9,
      Organization: 8,
      Practical: 8,
    },
    ["Content strategy", "Analytics", "Campaign testing"],
    "Write two headlines for the same message and define how you would compare them.",
    "Plan and evaluate a small digital campaign.",
    q(
      "mk-check",
      "Numerical",
      "A campaign gets 50 clicks from 1,000 views. Its click-through rate is:",
      ["0.5%", "5%", "20%", "50%"],
      1,
      "50 ÷ 1000 = 0.05, which equals 5%.",
    ),
  ),
  career(
    "finance",
    "Financial Analyst",
    "Commerce & Finance",
    "Evaluate performance, risk and investment information for decisions.",
    ["Finance", "Mathematics", "Business", "AI & Data"],
    "#9B7627",
    {
      Numerical: 10,
      Logical: 9,
      Communication: 8,
      Creativity: 5,
      Organization: 10,
      Practical: 7,
    },
    ["Business mathematics", "Financial statements", "Risk"],
    "Compare two years of a fictional business and explain one trend.",
    "Produce a beginner company-analysis report.",
    q(
      "fa-check",
      "Logical",
      "Why compare financial results across several years?",
      [
        "To use more pages",
        "To identify trends",
        "To avoid calculations",
        "To remove all risk",
      ],
      1,
      "A time series helps distinguish a pattern from a one-off result.",
    ),
  ),
  career(
    "ca",
    "Chartered Accountant",
    "Commerce & Finance",
    "Work with accounting, taxation, audit and financial compliance.",
    ["Accounting", "Finance", "Mathematics", "Law & Society"],
    "#A66834",
    {
      Numerical: 10,
      Logical: 9,
      Communication: 8,
      Creativity: 4,
      Organization: 10,
      Practical: 8,
    },
    ["Accounting", "Taxation", "Audit"],
    "Classify five sample transactions and check whether totals balance.",
    "Create a small audit-ready record set.",
    q(
      "ca-check",
      "Numerical",
      "In the accounting equation, assets equal:",
      [
        "Income minus tax",
        "Liabilities plus equity",
        "Sales plus profit",
        "Cash minus expenses",
      ],
      1,
      "The standard accounting equation is Assets = Liabilities + Equity.",
    ),
  ),
  career(
    "civil-service",
    "Civil Services / Public Administration",
    "Law & Public Service",
    "Organise public programmes, analyse policy and serve communities fairly.",
    ["Law & Society", "Leadership", "Writing", "Public Speaking"],
    "#5D6F83",
    {
      Numerical: 7,
      Logical: 9,
      Communication: 10,
      Creativity: 6,
      Organization: 10,
      Practical: 8,
    },
    ["Current affairs", "Policy analysis", "Public communication"],
    "Summarise a local issue, affected groups and two possible actions.",
    "Write a balanced public-policy briefing.",
    q(
      "cs-check",
      "Communication",
      "A good public notice should primarily be:",
      [
        "Vague",
        "Clear, accurate and accessible",
        "Full of jargon",
        "Unverifiable",
      ],
      1,
      "Public communication should help people understand what happened and what to do.",
    ),
  ),
];
export const blankProfile: StudentProfile = {
  name: "",
  level: "Class 11",
  track: "Exploring all fields",
  budget: "Free resources only",
  weeklyHours: 5,
  interests: [],
  selfRatings: {
    Numerical: 5,
    Logical: 5,
    Communication: 5,
    Creativity: 5,
    Organization: 5,
    Practical: 5,
  },
};
export const demoProfile: StudentProfile = {
  name: "Aarav Sharma",
  level: "Class 11",
  track: "Exploring all fields",
  budget: "Free resources only",
  weeklyHours: 8,
  interests: [
    "Programming",
    "Mathematics",
    "AI & Data",
    "Problem Solving",
  ],
  selfRatings: {
    Numerical: 5,
    Logical: 7,
    Communication: 6,
    Creativity: 6,
    Organization: 6,
    Practical: 7,
  },
};
export function calculateEffectiveSkills(
  profile: StudentProfile,
  questions: Question[],
  answers: Record<string, number>,
) {
  const scores = {} as Record<CoreSkill, number>;
  coreSkills.forEach((skill) => {
    const relevant = questions.filter(
      (question) =>
        question.skill === skill &&
        answers[question.id] !== undefined,
    );
    const demonstrated = relevant.length
      ? (
          relevant.filter(
            (question) =>
              answers[question.id] === question.answer,
          ).length / relevant.length
        ) * 10
      : profile.selfRatings[skill];
    scores[skill] = Number(
      (
        profile.selfRatings[skill] * 0.45 +
        demonstrated * 0.55
      ).toFixed(1),
    );
  });
  return scores;
}
export function assessmentScore(
  questions: Question[],
  answers: Record<string, number>,
) {
  if (!questions.length) return 0;

  return Math.round(
    (
      questions.filter(
        (question) =>
          answers[question.id] === question.answer,
      ).length / questions.length
    ) * 100,
  );
}
export function rankCareers(
  profile: StudentProfile,
  skills: Record<CoreSkill, number>,
): CareerResult[] {
  return careers
    .map((item) => {
      const skillEvidence =
        (
          coreSkills.reduce(
            (sum, skill) => sum + skills[skill],
            0,
          ) / coreSkills.length
        ) * 10;

      const requirementFit =
        (
          coreSkills.reduce(
            (sum, skill) =>
              sum +
              Math.min(
                1,
                skills[skill] / item.requirements[skill],
              ),
            0,
          ) / coreSkills.length
        ) * 100;
      const tagMatches = item.tags.filter((tag) =>
        profile.interests.includes(tag),
      ).length;
      const trackMatch =
        profile.track === item.category
          ? 1
          : profile.track === "Exploring all fields"
            ? 0.35
            : 0;
      const interestAlignment = Math.min(
        100,
        Math.round(
          tagMatches * 22 +
          trackMatch * 35,
        ),
      );
      const match = Math.round(
        skillEvidence * 0.45 +
        requirementFit * 0.35 +
        interestAlignment * 0.2,
      );

      const supporting = coreSkills.filter(
        (skill) =>
          skills[skill] >=
          item.requirements[skill] - 1.5,
      );
      const missing = [...coreSkills]
        .filter(
          (skill) =>
            item.requirements[skill] -
              skills[skill] >
            0.5,
        )
        .sort(
          (a, b) =>
            item.requirements[b] -
            skills[b] -
            (item.requirements[a] -
              skills[a]),
        );
      return {
        ...item,
        match: Math.min(99, match),
        readiness: Math.round(requirementFit),
        interestAlignment,
        supporting,
        missing,
      };
    })
    .sort((a, b) => b.match - a.match);
}
export const counsellors: Counsellor[] = [
  {
    id: "priya",
    name: "Dr. Priya Menon",
    initials: "PM",
    role: "School career exploration",
    focus:
      "Classes 9–12 · STEM, finance and early career decisions",
    languages: "English · Hindi · Malayalam",
    experience: "15 years",
    rating: "4.9 · 320 demo sessions",
  },
  {
    id: "rahul",
    name: "Rahul Verma",
    initials: "RV",
    role: "Skills and pathway mentor",
    focus:
      "Technology, commerce and evidence-building projects",
    languages: "English · Hindi · Tamil",
    experience: "12 years",
    rating: "4.8 · 280 demo sessions",
  },
  {
    id: "sneha",
    name: "Sneha Iyer",
    initials: "SI",
    role: "Creative and people-focused careers",
    focus:
      "Design, education, communication and hospitality",
    languages: "English · Hindi · Kannada",
    experience: "10 years",
    rating: "4.9 · 195 demo sessions",
  },
];
export const verifiedResources: VerifiedResource[] = [
  {
    provider: "SWAYAM",
    type: "Course catalog",
    url: "https://swayam.gov.in",
    cost: "Free",
  },
  {
    provider: "NPTEL",
    type: "University lectures",
    url: "https://nptel.ac.in",
    cost: "Free",
  },
  {
    provider: "Khan Academy",
    type: "Foundations",
    url: "https://www.khanacademy.org",
    cost: "Free",
  },
  {
    provider: "freeCodeCamp",
    type: "Guided practice",
    url: "https://www.freecodecamp.org",
    cost: "Free",
  },
];