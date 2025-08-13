# React 19, TypeScript, Vite, Tailwind CSS v4, Prettier, Eslint and Husky Template

A modern, ready-to-use template for building web applications with React 19, TypeScript, Vite, and Tailwind CSS v4, featuring a comprehensive theming system with dark mode support.

## Features

- 🎨 Complete theming system with semantic color variables
- 🌓 Dark mode support out of the box
- 📱 Responsive design ready
- 🚀 Optimized for Tailwind CSS v4
- ⚛️ React 19 with TypeScript
- ⚡️ Vite for fast development and builds
- 🧹 ESLint and Prettier for code quality
- 🪝 Husky and lint-staged for pre-commit hooks

## Technologies Used

- **React 19**: Latest version of the popular UI library with improved performance
- **TypeScript**: Static type checking for more robust code
- **Vite**: Next generation frontend tooling for fast development and optimized builds
- **Tailwind CSS v4**: Utility-first CSS framework with built-in dark mode support
- **ESLint**: Linting utility for identifying and fixing code problems
- **Prettier**: Code formatter for consistent styling
- **Husky**: Git hooks to enforce code quality checks before commits
- **lint-staged**: Run linters on git staged files

## Getting Started

### Installation

1. Clone this repository:

   ```bash
   git clone [repository-url] my-project
   cd my-project
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open your browser and visit http://localhost:3000

### Project Structure

```
locofy-test/
├── .husky/                # Git hooks configuration
├── src/
│   ├── components/        # Reusable components
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── globals.css        # Global styles and theme variables
├── public/                # Static assets
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── eslint.config.js       # ESLint configuration
└── package.json           # Project dependencies and scripts
```

## Available Scripts

The template includes the following npm scripts:

- **`npm run dev`**: Start the development server
- **`npm run build`**: Type-check and build the app for production
- **`npm run preview`**: Preview the production build locally
- **`npm run lint`**: Run ESLint to check for code issues
- **`npm run lint:fix`**: Run ESLint and automatically fix issues
- **`npm run format`**: Run Prettier to format all files
- **`npm run format:check`**: Check if files are properly formatted
- **`npm run fix-all`**: Run both lint:fix and format to fix all issues
- **`npm run upgrade`**: Update all dependencies to their latest versions

## Development Tools

### ESLint Configuration

This template uses ESLint to enforce code quality. The configuration is in `eslint.config.js` and includes:

- React recommended rules
- TypeScript integration
- Import order rules
- React Hooks rules

To run ESLint:

```bash
npm run lint      # Check for issues
npm run lint:fix  # Fix issues automatically
```

### Prettier Configuration

Prettier ensures consistent code formatting. Configuration is in `.prettierrc`:

```json
{
  "singleQuote": true,
  "semi": true,
  "tabWidth": 2,
  "printWidth": 80,
  "trailingComma": "es5",
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

To run Prettier:

```bash
npm run format        # Format all files
npm run format:check  # Check formatting
```

### Husky and lint-staged

The template uses Husky to run checks before commits and lint-staged to only check files that are being committed:

- ESLint and Prettier run on staged JavaScript/TypeScript files
- Prettier runs on staged JSON and Markdown files

This ensures that all committed code meets the project's quality standards.
