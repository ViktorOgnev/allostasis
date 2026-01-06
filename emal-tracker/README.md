# Allostasis Tracker

An adaptive wellbeing tracker that learns which factors most impact your energy. Monitor your **allostatic load** - the cumulative wear and tear on your body from stress - through intelligent analysis of sleep, physical activity, recovery, and psychological stress patterns.

## Features

### Version 2: Adaptive Allostatic Load Algorithm

- **5-Question Quick Check-In**: Simplified daily tracking (all metrics on 0-10 scale)
  - Sleep Recovery
  - Physical Load
  - Recovery from Load
  - Psychological Stress
  - Energy Level (anchor metric)

- **Adaptive Weight Calculation**: System learns what matters most for YOUR wellbeing
  - Impact Component: Spearman correlation with energy
  - Volatility Component: Metric instability detection
  - Imbalance Component: Conflict pattern detection

- **sALI (Simplified Allostatic Load Index)**: 0-1 score showing system strain
  - Raw sALI with EMA(7) and EMA(28) smoothing
  - Lower = better balance and recovery
  - Interpretable breakdown showing what's driving your load

- **Conflict Pattern Detection**: 8 patterns (4 acute + 4 chronic)
  - High load + low recovery
  - Poor sleep + high stress
  - Overwork patterns
  - Brain fog (60+ day chronic pattern)

- **Insights Dashboard**: Comprehensive analytics at `/allostasis`
  - sALI trend visualization
  - Combined metrics chart
  - Weight breakdown
  - Personalized recommendations

### Legacy Features (Version 1)

- **Detailed Tracking**: Granular logging for power users
- **Sleep Tracking**: Duration, quality, and sleep factors
- **Exercise Logging**: Type, duration, intensity with energy impact
- **Stress Management**: Breathing exercises, gratitude journal, mindfulness
- **Data Visualization**: Charts and trend analysis

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
│   ├── allostasis/        # Insights dashboard (Version 2)
│   ├── log/               # Daily logging page
│   └── ...                # Legacy pages
├── components/             # Reusable React components
│   ├── charts/            # Visualization components
│   │   ├── sALITrendChart.tsx
│   │   ├── CombinedMetricsChart.tsx
│   │   ├── WeightBreakdownChart.tsx
│   │   ├── InterpretableFeedback.tsx
│   │   └── ChronicPatternAlerts.tsx
│   └── forms/             # Input forms
│       ├── AllostaticCheckInForm.tsx  # New 5-question form
│       └── ...            # Legacy forms
├── lib/                    # Core library code
│   ├── db.ts              # Dexie.js database (AllostatisDatabase)
│   ├── allostasis/        # Calculation engine (Version 2)
│   │   ├── spearman.ts    # Correlation & statistics
│   │   ├── weights.ts     # Adaptive weight calculation
│   │   ├── conflicts.ts   # Pattern detection
│   │   ├── sali.ts        # sALI calculation
│   │   ├── ema.ts         # Exponential moving averages
│   │   └── calculations.ts # Main orchestrator
│   └── utils.ts           # Helper functions
├── store/                  # Zustand stores
│   ├── allostaticStore.ts # Version 2 store
│   ├── energyStore.ts     # Legacy stores
│   ├── sleepStore.ts
│   ├── exerciseStore.ts
│   └── stressStore.ts
├── types/                  # TypeScript type definitions
│   ├── allostasis.ts      # Version 2 types
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
