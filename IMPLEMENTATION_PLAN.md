# EMAL Fitness Tracker - Implementation Plan

## Overview
Build a science-based fitness tracker web application based on the Energy Management Allostatic Load (EMAL) model. The app helps users track and improve their energy levels through sleep, exercise, stress management, and daily monitoring.

## Tech Stack
- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand with local persistence
- **Database**: Dexie.js (IndexedDB wrapper) for client-side storage
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form + Zod validation
- **Date Utils**: date-fns
- **Icons**: Lucide React

## Project Structure
```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Dashboard (home)
│   ├── energy/            # Energy tracking
│   ├── sleep/             # Sleep tracking & tips
│   ├── exercise/          # Exercise logging
│   ├── stress/            # Stress management tools
│   ├── learn/             # EMAL educational content
│   └── settings/          # User settings
├── components/
│   ├── ui/                # shadcn/ui base components
│   ├── charts/            # Chart components (Energy, Sleep, Exercise trends)
│   ├── forms/             # Data entry forms
│   ├── layout/            # Navigation, Header, Cards
│   └── tools/             # Breathing timer, Mindfulness guides
├── lib/
│   ├── db.ts              # Dexie.js database setup
│   └── utils.ts           # Helper functions
├── store/                 # Zustand stores
│   ├── energyStore.ts
│   ├── sleepStore.ts
│   ├── exerciseStore.ts
│   └── stressStore.ts
├── types/                 # TypeScript type definitions
│   ├── energy.ts
│   ├── sleep.ts
│   ├── exercise.ts
│   └── stress.ts
├── hooks/                 # Custom React hooks
└── content/               # Educational content from EMAL model
```

## Core Data Models

### Energy Entry
```typescript
interface EnergyEntry {
  id: string;
  date: Date;
  timestamp: Date;
  energyLevel: number;        // 1-10 scale
  mood: 'excellent' | 'good' | 'neutral' | 'low' | 'exhausted';
  notes?: string;
  factors?: {
    sleep?: 'poor' | 'fair' | 'good' | 'excellent';
    stress?: 'none' | 'low' | 'medium' | 'high';
    exercise?: boolean;
  };
}
```

### Sleep Entry
```typescript
interface SleepEntry {
  id: string;
  date: Date;
  bedtime: Date;
  wakeTime: Date;
  duration: number;           // Hours (calculated)
  quality: 1 | 2 | 3 | 4 | 5;
  interruptions?: number;
  mood: 'refreshed' | 'okay' | 'groggy' | 'exhausted';
  factors?: {
    caffeine?: boolean;       // After 2pm
    alcohol?: boolean;
    lateExercise?: boolean;
    screenTime?: boolean;
  };
}
```

### Exercise Entry
```typescript
interface ExerciseEntry {
  id: string;
  date: Date;
  duration: number;           // Minutes
  type: 'cardio' | 'strength' | 'flexibility' | 'walking' | 'sports' | 'other';
  intensity: 'low' | 'moderate' | 'high' | 'vigorous';
  energyBefore?: number;      // 1-10 scale
  energyAfter?: number;
  notes?: string;
}
```

### Stress Management Entry
```typescript
interface StressEntry {
  id: string;
  date: Date;
  type: 'breathing' | 'gratitude' | 'mindfulness';
  duration?: number;
  breathingPattern?: {
    name: string;             // "4-7-8", "Box Breathing", etc.
    cycles: number;
  };
  gratitudeItems?: string[];
  stressLevelBefore?: number; // 1-10 scale
  stressLevelAfter?: number;
}
```

## Key Features

### 1. Dashboard (Home Page)
- Current energy level indicator
- Today's stats summary (sleep, exercise, stress activities)
- Weekly energy trend chart
- Quick action buttons for logging
- Streak indicators and insights

### 2. Energy Level Tracking
- Simple 1-10 slider with mood selection
- Multiple daily entries supported
- Visualizations:
  - Line chart of energy over time
  - Heatmap calendar view
  - Time-of-day patterns
- Correlation analysis with sleep/exercise/stress
- Educational content on energy sources (ATP, mitochondria)

### 3. Sleep Tracking & Tips
- Log bedtime, wake time, quality (1-5 stars)
- Sleep factors checklist (caffeine, alcohol, screen time)
- Sleep consistency score
- Charts: duration trends, quality, correlation with energy
- Educational tips based on EMAL content:
  - 7-9 hours recommendation
  - Consistent schedule
  - Morning sunlight exposure
  - Cool bedroom temperature
  - Evening wind-down routine
  - Avoid caffeine after 2pm

### 4. Exercise Logging
- Quick entry: type, duration, intensity
- Pre/post energy level tracking
- Weekly minutes tracker
- Visualizations: activity summary, type distribution
- Educational content:
  - Mitochondrial growth benefits
  - Metabolic compensation
  - WHO recommendations (300+ min moderate/week)

### 5. Stress Management Tools

#### Breathing Exercises
- Visual breathing guide (animated expanding circle)
- Timer with audio cues
- Preset patterns:
  - Box Breathing (4-4-4-4)
  - 4-7-8 Breathing
  - Coherent Breathing (5-5)
- Track before/after stress levels
- Scientific explanation of parasympathetic activation

#### Gratitude Journal
- Daily entries (3-5 items)
- Prompts for inspiration
- History view with search
- Streak tracking

#### Mindfulness Practices
- Guided exercises (body scan, emotion observation)
- Timer with reminders
- Mini-sessions (30 seconds) for busy times
- Monitor and Acceptance Theory (MAT) education

### 6. Educational Content (Learn Section)
Based on EMAL model from source materials:
- **Energy Sources**: ATP production, mitochondria, cellular respiration
- **Energy Expenditure**: Brain (20%), vital functions, allostasis, reserves
- **Allostasis Explained**: Stress response, energy cost (15-67% increase)
- **Sleep Science**: Memory consolidation, energy savings, toxin removal
- **Exercise Benefits**: Mitochondrial growth, metabolic compensation
- **Nutrition Guidelines**: Complex carbs, healthy fats, protein timing
- **Stress Management**: HBR Energy Management framework
- **Energy Rituals**: Time-based recovery practices

## Implementation Phases

### Phase 1: Foundation (Days 1-3)
**Critical Files to Create:**
- `/src/lib/db.ts` - Dexie.js database schema
- `/src/types/*.ts` - All TypeScript type definitions
- `/src/store/*.ts` - Zustand stores with persistence

**Tasks:**
1. Initialize Next.js project with TypeScript: `npx create-next-app@latest`
2. Install dependencies:
   ```bash
   npm install dexie zustand recharts react-hook-form zod @hookform/resolvers/zod date-fns lucide-react
   npm install -D tailwindcss @tailwindcss/typography
   npx shadcn-ui@latest init
   ```
3. Set up Tailwind CSS and shadcn/ui
4. Configure Dexie.js database with all tables
5. Create type definitions for all data models
6. Build Zustand stores for each feature
7. Create basic navigation layout

### Phase 2: Energy Tracking (Days 4-6)
**Critical Files:**
- `/src/components/forms/EnergyEntryForm.tsx`
- `/src/components/charts/EnergyLevelChart.tsx`
- `/src/app/energy/page.tsx`

**Tasks:**
1. Build energy entry form with 1-10 slider
2. Implement data persistence to IndexedDB via store
3. Create line chart for energy trends over time
4. Add calendar heatmap view
5. Build energy history page with filters
6. Add educational tooltips about energy sources

### Phase 3: Sleep Tracking (Days 7-9)
**Critical Files:**
- `/src/components/forms/SleepLogForm.tsx`
- `/src/components/charts/SleepQualityChart.tsx`
- `/src/app/sleep/page.tsx`
- `/src/app/sleep/tips/page.tsx`

**Tasks:**
1. Build sleep log form (bedtime, wake time, quality)
2. Auto-calculate sleep duration
3. Create sleep factors checklist
4. Build sleep history with charts
5. Create sleep tips content pages from EMAL material
6. Implement correlation view with next-day energy

### Phase 4: Exercise Logging (Days 10-12)
**Critical Files:**
- `/src/components/forms/ExerciseLogForm.tsx`
- `/src/app/exercise/page.tsx`

**Tasks:**
1. Build exercise entry form (type, duration, intensity)
2. Add pre/post energy level tracking
3. Create weekly exercise summary chart
4. Build exercise history view
5. Add educational content about exercise benefits from EMAL

### Phase 5: Stress Management (Days 13-16)
**Critical Files:**
- `/src/components/tools/BreathingTimer.tsx`
- `/src/components/forms/GratitudeEntryForm.tsx`
- `/src/app/stress/breathing/page.tsx`
- `/src/app/stress/gratitude/page.tsx`

**Tasks:**
1. Build animated breathing timer with visual guide
2. Implement breathing pattern presets (4-7-8, Box, etc.)
3. Create gratitude journal interface
4. Build mindfulness practice guides
5. Add stress level tracking (before/after)
6. Create stress tools dashboard

### Phase 6: Dashboard & Analytics (Days 17-19)
**Critical Files:**
- `/src/app/page.tsx` - Main dashboard
- `/src/components/charts/WeeklyOverview.tsx`
- `/src/components/layout/DashboardCard.tsx`

**Tasks:**
1. Build main dashboard layout
2. Create summary stat cards (today's sleep, exercise, stress)
3. Implement weekly energy overview chart
4. Add quick action buttons (log energy, start breathing)
5. Build insights/recommendations engine
6. Create streak tracking display
7. Add correlation analysis between all factors

### Phase 7: Educational Content (Days 20-22)
**Critical Files:**
- `/src/content/*.ts` - Educational content modules
- `/src/app/learn/page.tsx` and sub-pages

**Tasks:**
1. Structure educational content from source screenshots
2. Create EMAL model overview page with diagrams
3. Add energy sources explanation (ATP, mitochondria)
4. Create allostasis deep-dive content
5. Add nutrition guidelines
6. Create energy rituals guide
7. Implement content navigation

### Phase 8: Polish & Deployment (Days 23-25)
**Tasks:**
1. Build settings interface (theme, preferences)
2. Implement data export functionality (JSON)
3. Create onboarding flow for new users
4. Polish UI/UX across all pages
5. Add error handling and validation
6. Optimize performance (lazy loading, code splitting)
7. Test on multiple browsers and devices
8. Deploy to Vercel
9. Final bug fixes and refinements

## Critical Implementation Details

### Database Setup (lib/db.ts)
```typescript
import Dexie, { Table } from 'dexie';

class EMALDatabase extends Dexie {
  energyEntries!: Table<EnergyEntry>;
  sleepEntries!: Table<SleepEntry>;
  exerciseEntries!: Table<ExerciseEntry>;
  stressEntries!: Table<StressEntry>;

  constructor() {
    super('EMALFitnessTracker');
    this.version(1).stores({
      energyEntries: 'id, date, timestamp, energyLevel',
      sleepEntries: 'id, date, quality, duration',
      exerciseEntries: 'id, date, type, intensity',
      stressEntries: 'id, date, timestamp, type'
    });
  }
}

export const db = new EMALDatabase();
```

### State Management Pattern
Use Zustand with persistence for each feature area. Example for energy:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '@/lib/db';

interface EnergyStore {
  entries: EnergyEntry[];
  loadEntries: () => Promise<void>;
  addEntry: (entry: Omit<EnergyEntry, 'id'>) => Promise<void>;
  // ... other methods
}

export const useEnergyStore = create<EnergyStore>()(
  persist(
    (set, get) => ({
      entries: [],
      loadEntries: async () => {
        const entries = await db.energyEntries.toArray();
        set({ entries });
      },
      addEntry: async (entry) => {
        const newEntry = { ...entry, id: crypto.randomUUID() };
        await db.energyEntries.add(newEntry);
        set((state) => ({ entries: [...state.entries, newEntry] }));
      },
    }),
    { name: 'energy-storage' }
  )
);
```

### UI/UX Design Principles
1. **Simplicity**: Daily logging takes < 30 seconds
2. **Visual Hierarchy**: Energy level is the primary metric
3. **Positive Reinforcement**: Celebrate streaks and improvements
4. **Educational Integration**: Learn while tracking
5. **Calm Aesthetics**: Reduce stress, don't add to it

### Color Scheme (Energy-Based)
- Low Energy (1-3): Soft reds/oranges (#FCA5A5 → #FDBA74)
- Medium Energy (4-7): Yellows/light greens (#FCD34D → #BEF264)
- High Energy (8-10): Greens/blues (#86EFAC → #7DD3FC)
- Neutral UI: Grays and whites
- Dark mode support for evening use

## Key Educational Content Integration

From the EMAL model source material, integrate these key concepts:

1. **Energy Budget Breakdown**:
   - Brain: ~20% of total energy
   - Vital functions: Varies by activity
   - Allostasis (stress): 15-67% increase during stress
   - Growth & repair: Ongoing maintenance
   - Reserve: Buffer for increased demands

2. **Sleep Recommendations** (7-9 hours):
   - Memory consolidation
   - Energy savings (30-50% reduction)
   - Toxin removal (glymphatic system)
   - Consistent schedule importance

3. **Exercise Benefits**:
   - Increases mitochondria count and efficiency
   - Metabolic compensation (uses less energy for baseline functions)
   - Improves sleep quality
   - Boosts mood hormones

4. **Stress Management Science**:
   - Breathing activates parasympathetic nervous system
   - Gratitude reduces stress response
   - Monitor and Acceptance Theory (MAT)
   - HBR Energy Management framework

## Success Metrics

### Technical
- Page load time < 2 seconds
- Lighthouse score > 90
- Bundle size < 500KB initial
- 100% offline functionality

### User Experience
- Time to log energy < 30 seconds
- Chart rendering < 1 second
- Zero data loss

## Future Enhancements (Post-MVP)
- Smart insights and pattern detection
- Advanced correlation analytics
- Progressive Web App capabilities
- Data import from other trackers (CSV)
- Goal setting and tracking
- Achievement badges/gamification

## Notes
- All data stored locally in browser (IndexedDB)
- No backend or authentication required
- Privacy-focused: user data never leaves their device
- Export functionality for backup and data portability
- Mobile-first responsive design
- Accessible (WCAG AA compliance)
