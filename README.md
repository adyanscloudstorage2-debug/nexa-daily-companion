# Nexa - Your AI Daily Companion

A mobile-first AI chatbot application that serves as a personal daily companion, blending learning, productivity, and wellness into one clean, minimal platform.

## Features

### 🤖 Chat Assistance
- Natural, human-like conversation interface
- General Q&A for homework, productivity tips, and advice
- Full chat history storage for easy reference

### 📚 Learning & Growth
- Homework help (math, science, writing support)
- Language practice (translation, grammar correction, vocabulary training)
- Fun facts & learning quizzes

### ✅ Productivity
- Task reminders with scheduling
- Quick notes and saves
- Mini to-do system

### 💚 Wellness & Support
- Daily motivational quotes
- Mood check-ins with AI support
- Gentle wellness nudges

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Supabase (Authentication, Database, Edge Functions)
- **AI**: Google Generative AI (Gemini)
- **Mobile**: Capacitor for native iOS/Android apps
- **UI Components**: Radix UI + shadcn/ui

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or bun

### Installation

1. Clone the repository
```bash
git clone <YOUR_GIT_URL>
cd nexa-daily-companion
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## Database Setup

The project uses Supabase for backend services. All necessary migrations are in the `supabase/migrations/` folder:

- User profiles with authentication trigger
- Chat history storage
- Mood tracking logs
- Reminders/tasks system

Row-Level Security (RLS) policies are configured to ensure users can only access their own data.

## Mobile Development

### Running on Mobile Devices

1. Export your project to GitHub
2. Clone it locally
3. Install dependencies: `npm install`
4. Add platforms:
   ```bash
   npx cap add ios
   npx cap add android
   ```
5. Build the project: `npm run build`
6. Sync with native platforms: `npx cap sync`
7. Run on device/emulator:
   ```bash
   npx cap run android
   # or
   npx cap run ios
   ```

**Note**: iOS development requires macOS with Xcode. Android requires Android Studio.

## Environment Variables

The following environment variables are configured:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon key
- `VITE_GOOGLE_AI_API_KEY` - Your Google Generative AI API key

## Design System

Nexa uses a comprehensive design system defined in `src/index.css`:
- **Primary**: Indigo (#6366F1) - Main brand color
- **Secondary**: Emerald (#10B981) - Success and positive actions
- **Accent**: Soft Pink - Mood tracking
- Supports both light and dark themes
- All colors use HSL format for consistency

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ui/           # shadcn/ui components
│   ├── ChatInterface.tsx
│   ├── ChatMessage.tsx
│   ├── MoodTracker.tsx
│   ├── RemindersList.tsx
│   ├── QuickActions.tsx
│   └── Navigation.tsx
├── contexts/         # React contexts
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── hooks/            # Custom React hooks
│   ├── useChat.ts
│   ├── useMood.ts
│   └── useReminders.ts
├── pages/            # Page components
│   ├── Index.tsx
│   ├── Auth.tsx
│   ├── Profile.tsx
│   └── NotFound.tsx
├── services/         # External service integrations
│   └── ai.ts
└── integrations/     # Supabase integration
    └── supabase/
```

## Authentication

The app uses Supabase Auth with support for:
- Email/Password authentication
- Google OAuth
- Automatic profile creation on signup
- Session persistence

To test locally, you may want to disable "Confirm email" in Supabase settings for faster development.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Lovable platform.

## Support

For issues or questions, please open an issue on GitHub or contact the development team.

---

**Project URL**: https://lovable.dev/projects/4ca2caf1-1756-4bcd-83a5-28e249f0c805
