# AI-WeatherTracker 🌤️

A modern, visually stunning weather application built with React, TypeScript, and Vite. Features smooth animations, real-time weather data, air quality monitoring, and comprehensive weather history tracking.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![React](https://img.shields.io/badge/React-19.2-blue)
![Vite](https://img.shields.io/badge/Vite-6.0-purple)

## ✨ Features

### Core Features
- 🌍 **Current Weather Display** - Real-time weather for any location
- 📅 **5-Day Forecast** - Detailed daily forecasts with high/low temperatures
- ⏰ **Hourly Forecast** - Hour-by-hour weather predictions
- 🔍 **City Search** - Smart autocomplete search with geocoding
- 📍 **Geolocation** - Auto-detect user's current location
- ⭐ **Favorites** - Save up to 10 favorite locations
- 🎨 **Themes** - Light and dark mode with system preference detection
- 🌐 **i18n** - Multi-language support (English, Spanish, French, German)

### Advanced Features
- 💨 **Air Quality Index** - Detailed AQI with pollutant breakdown and health advice
- 📊 **Weather History** - Track and visualize weather trends over time
- 📈 **Charts** - Temperature trends and precipitation charts
- 🎭 **Animations** - Smooth Framer Motion transitions and Lottie weather animations
- 📱 **Responsive Design** - Optimized for mobile, tablet, and desktop
- ♿ **Accessibility** - WCAG AA compliant with reduced motion support
- 💾 **Offline Support** - IndexedDB for weather history persistence
- 🎯 **Widget Dashboard** - Customizable weather widget grid with drag-and-drop

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn
- OpenWeatherMap API key ([Get one free](https://openweathermap.org/api))

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd AI-WeatherTracker

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your API key to .env
VITE_OPENWEATHER_API_KEY=your_api_key_here

# Start development server
npm run dev
```

Visit `http://localhost:5173` to view the app.

## 📚 Documentation

- **[API Documentation](docs/API_DOCUMENTATION.md)** - Complete API reference for hooks, services, and components
- **[Developer Guide](docs/DEVELOPER_GUIDE.md)** - Development workflow, code standards, and best practices
- **[Architecture](docs/architecture.md)** - Technical architecture and system design
- **[PRD](docs/prd.md)** - Product requirements and specifications

## 🏗️ Tech Stack

### Core
- **React 19.2** - UI framework with latest features
- **TypeScript 5.3** - Type-safe development
- **Vite 6.0** - Lightning-fast build tool and dev server
- **React Router 7** - Client-side routing

### State Management
- **TanStack Query 5** - Server state management with caching
- **React Context** - Global UI state (theme, favorites)

### Styling & Animation
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion 12** - Production-ready animation library
- **Lottie React** - Lightweight animations for weather icons

### Data & Storage
- **Axios** - HTTP client for API requests
- **Dexie.js** - IndexedDB wrapper for weather history
- **LocalStorage** - Settings and favorites persistence

### Developer Experience
- **Vitest** - Unit testing framework
- **Testing Library** - React component testing
- **ESLint** - Code linting
- **TypeScript strict mode** - Maximum type safety

## 📁 Project Structure

```
AI-WeatherTracker/
├── src/
│   ├── components/         # React components
│   │   ├── layout/        # Layout components
│   │   ├── widgets/       # Weather widgets
│   │   └── history/       # History charts
│   ├── context/           # React Context providers
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   ├── pages/             # Page components
│   ├── i18n/              # Internationalization
│   └── lib/               # Third-party configs
├── docs/                  # Documentation
├── public/                # Static assets
└── tests/                 # Test files
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## �� Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report
npm run lint         # Lint code
```

## 🌐 API Integration

This app uses the [OpenWeatherMap API](https://openweathermap.org/api) for weather data:

- **Current Weather API** - Real-time weather conditions
- **5-Day Forecast API** - 5-day forecast with 3-hour intervals
- **Geocoding API** - City search and reverse geocoding
- **Air Pollution API** - Air quality data

## 🎨 Design Philosophy

The app prioritizes:
- **User Experience** - Intuitive, delightful interactions
- **Performance** - Fast load times and smooth animations
- **Accessibility** - Keyboard navigation and screen reader support
- **Responsive Design** - Works beautifully on all devices
- **Clean Code** - TypeScript, JSDoc, and consistent patterns

## 📊 Features in Detail

### Weather Display
- Current temperature with "feels like"
- Weather condition with animated icon
- Humidity, pressure, wind speed, visibility
- Sunrise and sunset times
- Weather-responsive background animations

### Forecast
- 5-day daily forecast with high/low temps
- Hourly forecast for next 24 hours
- Precipitation probability
- Weather condition icons

### Air Quality
- AQI score with color-coded indicators
- Individual pollutant measurements (PM2.5, PM10, CO, NO₂, O₃, SO₂)
- Health recommendations
- Expandable detailed view

### History & Analytics
- Automatic weather snapshot saving
- Temperature trend charts
- Precipitation charts
- Historical data export/import
- Sample data generation for testing

### Favorites & Widgets
- Save up to 10 favorite locations
- Widget dashboard with grid/list views
- Drag-and-drop reordering
- Quick access to favorite locations
- Persistent preferences

## ♿ Accessibility

- **WCAG AA Compliant** - Color contrast and semantic HTML
- **Keyboard Navigation** - Full keyboard support
- **Screen Readers** - ARIA labels and proper headings
- **Reduced Motion** - Respects `prefers-reduced-motion`
- **Focus Management** - Visible focus indicators

## 🌍 Internationalization

Supports multiple languages:
- English (en)
- Spanish (es)
- French (fr)
- German (de)

Language detection and switching built-in.

## 🔒 Privacy & Data

- **No personal data collection** - Weather data only
- **Local storage only** - Data stays on your device
- **No tracking** - No analytics or third-party trackers
- **API key secure** - Never exposed in client code

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add JSDoc comments to all public APIs
4. Write tests for new features
5. Ensure all tests pass
6. Submit a pull request

See [Developer Guide](docs/DEVELOPER_GUIDE.md) for details.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons and animations from [Lottie Files](https://lottiefiles.com/)
- Built with [Vite](https://vitejs.dev/) and [React](https://react.dev/)

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, and modern web technologies**

*Last Updated: December 4, 2025*
