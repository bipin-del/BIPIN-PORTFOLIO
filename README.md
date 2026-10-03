# Bipin S Menon - 3D Personal Portfolio

An interactive, 3D-animated personal portfolio website for Bipin S Menon, built with modern web technologies.

## 🚀 Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom CSS Design System
- **3D Graphics & Animations**: Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
- **UI Animation**: Framer Motion + GSAP ScrollTrigger
- **Lottie**: `lottie-react`
- **Deployment**: Vercel

## ✨ Key Features

- **3D Anime Character**: Interactive 3D avatar featuring customizable styling, real-time mouse tracking, idle breathing, section-based facial expressions, click power-up (aura burst & lightning), and double-click gestures.
- **Orbiting Tech Rings**: 3D orbital badges around the character that react to interaction.
- **Dedicated Resume Website**: Clean, responsive resume web page matching the official CV document, accessible directly via the "View Resume" navbar button (`/resume.html`).
- **Interactive UI**:
  - Skill orbit tree with category selection
  - 3D tilt cards & interactive project flip cards
  - Scroll-triggered journey timeline and certifications grid
  - Cursor particle trails & click-burst effects
  - Audio effects toggle & Dark / Light theme toggle
  - Hidden Konami code Easter egg (Super Saiyan theme)
- **Direct Contact**: Integrated contact form and functional contact links (Email, GitHub, LinkedIn, Phone).

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/bipin-del/BIPIN-PORTFOLIO.git

# Navigate to project directory
cd BIPIN-PORTFOLIO

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## 📦 Deployment

Deploy easily to [Vercel](https://vercel.com):
1. Connect your GitHub repository.
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
