# LearnWise - AI-Powered Learning Platform

LearnWise is a modern, AI-powered learning platform that provides personalized education experiences through interactive lessons, AI tutoring, and gamified learning features.

## Features

### Core Learning Features
- **Interactive Lessons**: Engaging content with progress tracking
- **AI Tutor**: 24/7 intelligent tutoring support
- **Personalized Learning Paths**: AI-generated learning paths based on user progress
- **Progress Tracking**: Visual progress indicators and achievement system

### Enhanced User Experience
- **Modern UI**: Clean, intuitive interface built with React and Tailwind CSS
- **Responsive Design**: Works seamlessly across all devices
- **Real-time Updates**: Instant feedback and progress synchronization
- **Offline Mode**: Learn without internet connection

### Gamification
- **Achievement System**: Earn badges and rewards
- **Leaderboards**: Compete with peers
- **Learning Streaks**: Stay motivated with daily streaks
- **Points System**: Earn points for completing lessons and helping others

### AI Features
- **Smart Tutoring**: AI-powered explanations and help
- **Personalized Feedback**: Detailed analysis of your work
- **Adaptive Learning**: Content adjusts to your pace and style
- **Voice & Image Input**: Multiple ways to interact with the AI tutor

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/learn-wise-spark.git
   cd learn-wise-spark
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production
```bash
npm run build
```

## Project Structure

```
learn-wise-spark/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── lib/              # Utility functions and services
│   │   ├── ai/          # AI-related functionality
│   │   ├── offline/     # Offline mode management
│   │   └── gamification/# Gamification features
│   ├── hooks/           # Custom React hooks
│   └── integrations/    # Third-party integrations
├── public/              # Static assets
└── package.json         # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.io/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
