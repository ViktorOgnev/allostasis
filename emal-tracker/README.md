# EMAL Fitness Tracker

A science-based fitness tracker web application for managing energy through sleep, exercise, stress management, and daily monitoring, based on the **Energy Management Allostatic Load (EMAL)** model.

## Features

- **Energy Level Tracking**: Track daily energy levels (1-10 scale) with mood and contributing factors
- **Sleep Tracking**: Log sleep duration, quality, and factors affecting sleep
- **Exercise Logging**: Record workouts with type, duration, and intensity
- **Stress Management Tools**:
  - Breathing exercises (Box Breathing, 4-7-8, etc.)
  - Gratitude journal
  - Mindfulness practices
- **Educational Content**: Learn about the EMAL model, energy sources, and optimization strategies
- **Data Visualization**: Charts and analytics for tracking trends over time

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Database**: Dexie.js (IndexedDB)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Date Utils**: date-fns
- **Icons**: Lucide React

## Project Structure

```
emal-tracker/
├── app/                    # Next.js app router pages
├── components/             # Reusable React components
├── lib/                    # Core library code
│   ├── db.ts              # Dexie.js database setup
│   └── utils.ts           # Helper functions
├── store/                  # Zustand stores
│   ├── energyStore.ts
│   ├── sleepStore.ts
│   ├── exerciseStore.ts
│   └── stressStore.ts
├── types/                  # TypeScript type definitions
│   ├── energy.ts
│   ├── sleep.ts
│   ├── exercise.ts
│   ├── stress.ts
│   └── common.ts
├── hooks/                  # Custom React hooks
├── content/                # Educational content
└── constants/              # App constants
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Data Models

### Energy Entry
- Energy level (1-10 scale)
- Mood (excellent, good, neutral, low, exhausted)
- Contributing factors (sleep quality, stress level, exercise, meals)
- Notes and tags

### Sleep Entry
- Bedtime and wake time
- Sleep duration (auto-calculated)
- Quality rating (1-5 stars)
- Mood on waking
- Factors (caffeine, alcohol, late exercise, screen time, stress)

### Exercise Entry
- Exercise type (cardio, strength, flexibility, walking, sports, other)
- Duration and intensity
- Energy levels before/after
- Optional heart rate data

### Stress Management Entry
- Activity type (breathing, gratitude, mindfulness, journaling)
- Duration
- Breathing pattern details
- Gratitude items
- Stress levels before/after

## Privacy & Data

- **Local Storage Only**: All data is stored locally in your browser using IndexedDB
- **No Backend**: No server-side data storage or authentication
- **Privacy-Focused**: Your data never leaves your device
- **Export Functionality**: Backup your data as JSON files (coming soon)

## EMAL Model

The application is based on the Energy Management Allostatic Load model, which explains:

- **Energy Sources**: ATP production, mitochondria, cellular respiration
- **Energy Expenditure**: Brain (20%), vital functions, allostasis (stress), growth & repair
- **Sleep Importance**: 7-9 hours for memory consolidation, energy savings (30-50%), toxin removal
- **Exercise Benefits**: Mitochondrial growth, metabolic compensation
- **Stress Management**: Breathing techniques, gratitude, mindfulness (MAT)

## Development Roadmap

### Phase 1: Foundation ✅
- [x] Project setup with Next.js and TypeScript
- [x] Tailwind CSS configuration
- [x] Dexie.js database schema
- [x] TypeScript type definitions
- [x] Zustand stores for all features

### Phase 2: Energy Tracking (Current)
- [ ] Energy entry form
- [ ] Energy level charts
- [ ] Calendar heatmap view
- [ ] Energy history page

### Phase 3: Sleep Tracking
- [ ] Sleep log form
- [ ] Sleep quality charts
- [ ] Sleep tips content
- [ ] Correlation with energy

### Phase 4: Exercise Logging
- [ ] Exercise entry form
- [ ] Weekly summary charts
- [ ] Exercise history
- [ ] Educational content

### Phase 5: Stress Management
- [ ] Breathing timer component
- [ ] Gratitude journal
- [ ] Mindfulness guides
- [ ] Stress tools dashboard

### Phase 6: Dashboard & Analytics
- [ ] Main dashboard layout
- [ ] Summary stat cards
- [ ] Weekly overview
- [ ] Insights engine

### Phase 7: Educational Content
- [ ] EMAL model overview
- [ ] Energy sources explanation
- [ ] Sleep science content
- [ ] Nutrition guidelines

### Phase 8: Polish & Deployment
- [ ] Settings interface
- [ ] Data export
- [ ] Onboarding flow
- [ ] Performance optimization
- [ ] Deploy to Vercel

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

MIT

## Acknowledgments

- Based on the EMAL (Energy Management Allostatic Load) model
- Educational content derived from scientific research on energy management, sleep, exercise, and stress
