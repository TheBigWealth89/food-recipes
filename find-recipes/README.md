# Recipe Finder

A modern, responsive Recipe Finder web application built with React, TypeScript, and TheMealDB API. Discover thousands of recipes from around the world with advanced search and filtering capabilities.

🌍 **Live Demo**: [https://recipes-finderx.netlify.app/](https://recipes-finderx.netlify.app/)

## 🌟 Features

- **Recipe Search**: Search recipes by name or ingredients
- **Advanced Filtering**: Filter by cuisine and category
- **Recipe Details**: View complete recipes with ingredients and instructions
- **Favorites System**: Save and manage your favorite recipes
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Real-time Data**: Uses TheMealDB API for thousands of real recipes

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: React Router 6 (SPA mode)
- **State Management**: Zustand with localStorage persistence
- **Styling**: TailwindCSS 3 + Radix UI components
- **API**: TheMealDB (free, no API key required)
- **Icons**: Lucide React
- **Testing**: Vitest

## 📁 Project Structure

```
client/
├── components/           # React components
│   ├── ui/              # Pre-built UI component library
│   └── RecipeCard.tsx   # Recipe card component
├── pages/               # Page components
│   ├── Index.tsx        # Homepage with search and recipes
│   ├── RecipeDetails.tsx # Recipe details page
│   └── Favorites.tsx    # Favorites page
├── services/            # API services
│   └── recipeApi.ts     # TheMealDB API integration
├── store/               # State management
│   └── useRecipeStore.ts # Zustand store
├── types/               # TypeScript type definitions
│   └── recipes.ts       # Recipe interfaces
├── App.tsx             # App entry point with routing
└── global.css          # Global styles and theme
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:8080](http://localhost:8080) in your browser

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run typecheck` - Run TypeScript type checking
- `npm test` - Run tests
- `npm run format.fix` - Format code with Prettier

## 🎯 Key Features

### Recipe Search & Discovery

- Search recipes by name
- Browse by cuisine (American, Italian, Chinese, etc.)
- Filter by category (Chicken, Beef, Dessert, etc.)
- Discover featured and random recipes

### Recipe Management

- View detailed recipe information
- Save recipes to favorites
- Persistent favorites using localStorage
- Recent search history

### User Experience

- Modern, clean interface
- Responsive design for all devices
- Loading states and error handling
- Intuitive navigation

## 🌐 API Integration

This app uses [TheMealDB](https://www.themealdb.com/) API which provides:

- Free access to thousands of recipes
- No API key required
- Rich recipe data including ingredients, instructions, and images
- Categories and cuisine filtering

## 🎨 Design System

- **Colors**: Food-focused warm palette with orange primary and green accents
- **Typography**: Clean, readable fonts with proper hierarchy
- **Components**: Consistent Radix UI components with custom styling
- **Responsive**: Mobile-first design with breakpoints for all screen sizes

## 🔧 Development

### Adding New Features

1. **New Components**: Add to `client/components/`
2. **New Pages**: Add to `client/pages/` and update routing in `App.tsx`
3. **State Management**: Extend `useRecipeStore.ts` for new state needs
4. **Styling**: Use TailwindCSS classes and custom CSS variables

### Code Style

- TypeScript throughout for type safety
- Functional components with hooks
- Clean, readable code with proper naming
- Responsive design patterns

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.
