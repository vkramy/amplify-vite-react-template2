# BitFit Pro - Personal Fitness Coaching Website

A modern, responsive React-based website for personal fitness coaching with four specialized programs: Weight Loss, Muscle Building, Stress Relief, and Exercises Anywhere.

## 🏋️ Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Four Specialized Programs**:
  - Weight Loss Program
  - Muscle Building Program  
  - Stress Relief Program
  - Exercises Anywhere Program
- **Downloadable Guides**: Each program includes a comprehensive downloadable guide
- **Modern UI**: Clean, professional design with smooth animations
- **Easy Navigation**: Intuitive routing between different program pages

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd fitness-coaching-website
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Built With

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **Lucide React** - Icon library

## 📱 Pages Structure

### Home Page (`/`)
- Hero section with call-to-action
- Four program cards with navigation
- Features section highlighting benefits
- Responsive grid layout

### Program Pages
Each program page includes:
- **Hero Section**: Program-specific branding and overview
- **Program Details**: Comprehensive information about the program
- **Features/Benefits**: What users can expect
- **Download Section**: Free guide download functionality

#### Weight Loss (`/weight-loss`)
- 12-week structured program
- Nutrition guidelines and meal plans
- Progressive workout phases
- Tracking and monitoring tools

#### Muscle Building (`/muscle-build`)
- 16-week progressive program
- Compound movement focus
- Training phases from foundation to peak
- Nutrition optimization for muscle growth

#### Stress Relief (`/stress-relief`)
- 8-week holistic wellness program
- Mindful movement and breathing techniques
- Lifestyle integration strategies
- Mind-body connection focus

#### Exercises Anywhere (`/exercises-anywhere`)
- Bodyweight exercise library
- No equipment required
- Travel-friendly routines
- Scalable difficulty levels

## 🎨 Design Features

- **Color-coded Programs**: Each program has its own color theme
- **Smooth Animations**: Hover effects and transitions
- **Professional Typography**: Clean, readable fonts
- **Consistent Layout**: Unified design across all pages
- **Mobile-first**: Responsive design principles

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Customization

### Adding New Programs
1. Create a new page component in `src/pages/`
2. Add the route in `src/App.tsx`
3. Update the navigation in `src/components/Navbar.tsx`
4. Add the program card to the home page

### Styling
- Tailwind CSS classes are used throughout
- Custom styles can be added to `src/App.css`
- Color themes can be modified in the Tailwind configuration

### Download Guides
Each program page includes a download function that generates a text file with comprehensive program information. You can customize the content in each page's `handleDownload` function.

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Icons provided by [Lucide React](https://lucide.dev/)
- Styling framework by [Tailwind CSS](https://tailwindcss.com/)
- Built with [Vite](https://vitejs.dev/) and [React](https://reactjs.org/)