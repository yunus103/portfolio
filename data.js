const stats = [
  { label: 'Projects shipped', value: '15+' },
  { label: 'Year in CS', value: '4th' },
  { label: 'Collaboration ready', value: 'Open' },
];

const focusAreas = ['Design systems', 'Frontend', 'Problem solving', 'Performance', 'Responsive Design'];

const filters = ['all', 'featured', 'frontend', 'games', 'tools'];

const projects = [
  {
    title: 'Photographer Landing Page',
    description: 'A cinematic React landing page with layered hero, gallery grid, and immersive motion cues.',
    image: 'images/recai.png',
    live: 'https://recai-gunes-2.vercel.app/',
    repo: 'https://github.com/yunus103/recai-gunes-2',
    tags: ['featured', 'frontend'],
    tech: ['React', 'Framer Motion', 'CSS Modules'],
  },
  {
    title: 'Resume Builder',
    description: 'React-based CV builder with live preview, ATS-friendly formatting, and export options.',
    image: 'images/resume.png',
    live: 'https://yunus103.github.io/ats-resume-builder/',
    repo: 'https://github.com/yunus103/ats-resume-builder',
    tags: ['featured', 'frontend', 'tools'],
    tech: ['React', 'Context API', 'Styled Components'],
  },
  {
    title: 'Mutant Memory Run',
    description: 'Teenage Mutant Ninja Turtles themed memory game focusing on quick interactions and snappy feedback.',
    image: 'images/mutant.png',
    live: 'https://memory-card-game-jjqx.vercel.app/',
    repo: 'https://github.com/yunus103/memory-card-game',
    tags: ['games', 'frontend'],
    tech: ['React', 'Hooks'],
  },
  {
    title: 'Tic Tac Toe',
    description: 'Minimalist game with responsive layout and clear win states built in vanilla JS.',
    image: 'images/tictac.png',
    live: 'https://yunus103.github.io/odin-tic-tac-toe/',
    repo: 'https://github.com/yunus103/odin-tic-tac-toe',
    tags: ['games'],
    tech: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    title: 'Almila Landing Page',
    description: 'Responsive marketing site crafted from a Bootstrap template with refined typography and flow.',
    image: 'images/almila.png',
    live: 'https://almila-kumas.vercel.app/index.html',
    repo: 'https://github.com/yunus103/almila-kumas',
    tags: ['frontend'],
    tech: ['Bootstrap', 'JavaScript'],
  },
  {
    title: 'Pilav Landing Page',
    description: 'Clean, single-page marketing layout focused on copy hierarchy and conversion.',
    image: 'images/pilav.png',
    live: 'https://yunus103.github.io/pilavcioglu/',
    repo: 'https://github.com/yunus103/pilavcioglu',
    tags: ['frontend'],
    tech: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    title: 'Game Library App',
    description: 'Library to organize titles across platforms with curated collections and quick search.',
    image: 'images/GameLibrary.png',
    live: 'https://youtu.be/oJymXmt8g8E',
    repo: 'https://github.com/yunus103/GameLibraryApp',
    tags: ['tools'],
    tech: ['Java', 'SQL'],
  },
  {
    title: 'Responsive Multi Step Form',
    description: 'Four-step subscription flow with add-ons, price summary, and keyboard-friendly navigation.',
    image: 'images/form.png',
    live: 'https://yunus103.github.io/multi-step-form/',
    repo: 'https://github.com/yunus103/multi-step-form',
    tags: ['frontend', 'tools'],
    tech: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    title: 'Calculator',
    description: 'Responsive calculator supporting keyboard input and smooth hover feedback.',
    image: 'images/calculator.png',
    live: 'https://yunus103.github.io/odin-calculator/',
    repo: 'https://github.com/yunus103/odin-calculator',
    tags: ['tools'],
    tech: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    title: 'Rock Paper Scissors',
    description: 'Playful browser game with quick rounds and crisp visuals.',
    image: 'images/rock.png',
    live: 'https://yunus103.github.io/odin-rock-paper-scissors/',
    repo: 'https://github.com/yunus103/odin-rock-paper-scissors',
    tags: ['games'],
    tech: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    title: 'Etch-a-Sketch',
    description: 'Interactive drawing grid with resizable canvas and vivid hover states.',
    image: 'images/etch1.png',
    live: 'https://yunus103.github.io/odin-etch-a-sketch/',
    repo: 'https://github.com/yunus103/odin-etch-a-sketch',
    tags: ['tools'],
    tech: ['HTML', 'CSS', 'JavaScript'],
  },
];

const techStack = [
  { name: 'HTML', icon: 'images/html.png', level: 'Semantic, accessible markup' },
  { name: 'CSS', icon: 'images/css.png', level: 'Modern layouts, animations' },
  { name: 'JavaScript', icon: 'images/js.png', level: 'Reusable components' },
  { name: 'React', icon: 'images/React-icon.svg.png', level: 'Hooks, state, routing' },
  { name: 'Node.js', icon: 'images/nodejs.png', level: 'APIs, tooling' },
  { name: 'SQL', icon: 'images/sql.png', level: 'Relational modeling' },
  { name: 'Git', icon: 'images/git.png', level: 'Team workflows' },
  { name: 'Bootstrap', icon: 'images/Bootstrap_logo.svg.png', level: 'Rapid UI' },
  { name: 'Java', icon: 'images/java.png', level: 'OOP fundamentals' },
  { name: 'C++', icon: 'images/c++.png', level: 'Systems thinking' },
  { name: 'Unreal Engine', icon: 'images/unreal.png', level: 'Immersive worlds' },
];

const certificates = [
  {
    title: 'CS50x: Introduction to Computer Science (Harvard University)',
    description: 'Algorithms, data structures, memory management, and full-stack concepts with C, Python, SQL, and JavaScript.',
    link: 'https://courses.edx.org/certificates/33493257c49b46c496ba892ef3000d52?_gl=1*1p4lzvt*_gcl_au*MTA2Mzc5NjI5My4xNzU0MDU1OTk4*_ga*NjI5MzU0NTkuMTc1NDA1NTk5OA..*_ga_D3KS4KMDT0*czE3NTQwNTU5OTgkbzEkZzEkdDE3NTQwNTYwNDUkajE0JGwwJGgw',
  },
];
