# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Testing
- `npm test` - Run tests with Vitest in watch mode
- `npm run test:ui` - Run tests with Vitest UI interface
- `npm run test:run` - Run all tests once without watch mode

The project uses both Jest and Vitest configurations. Jest config is in `jest.config.js` with jsdom environment, while Vitest config is in `vitest.config.js`. Tests follow the pattern `*.test.js` and use Jest/Vitest syntax.

### ESLint
The project has ESLint configured (though not in package.json scripts). Use:
- `eslint "./*-module/**/*.js"` - Lint all module JavaScript files
- `eslint --fix "./*-module/**/*.js"` - Auto-fix linting issues

## Project Architecture

This is a JavaScript learning course project ("JavaScript/DOM/Интерфейсы" by Ilya Kantor) structured as progressive modules teaching DOM manipulation, event handling, and component-based architecture.

### Module Structure
The project follows a modular approach with 10 modules (0-9):

- **Module 0**: Basic algorithmic tasks (arrays, search, conditionals)
- **Modules 1-3**: Core JavaScript (functions, objects, arrays)
- **Modules 4-5**: DOM manipulation (element creation, event handling)
- **Modules 6-7**: Component architecture (tables, carousels, modals, sliders)
- **Modules 8-9**: Advanced components (shopping cart, product grid, full application)

Each module contains 1-6 tasks, with each task having:
- `README.md` - Task description and requirements
- `*.js` - Implementation file
- `*.test.js` - Jest/Vitest tests
- `index.html` - Demo page (for DOM tasks)
- `style.css` - Styling (when needed)

### Component Architecture (Modules 6-9)

The later modules implement a restaurant ordering system with these key components:

- **CartIcon**: Shopping cart icon with floating positioning and item count
- **Cart**: Shopping cart management with localStorage persistence
- **ProductCard**: Individual product display component
- **ProductGrid**: Grid of products with filtering capabilities
- **RibbonMenu**: Category selection carousel
- **StepSlider**: Range slider for filtering
- **Modal**: Popup component for cart display
- **Carousel**: Image carousel component

### Key Patterns

1. **ES6 Classes**: All components are ES6 classes with constructor initialization
2. **Event-Driven**: Components communicate via custom DOM events (`product-add`, `ribbon-select`, `slider-change`)
3. **createElement Helper**: Uses `assets/lib/create-element.js` for DOM creation
4. **Module Imports**: ES6 modules with `.js` extensions in imports
5. **Testing**: Comprehensive Jest tests with jsdom environment

### File Organization

```
{module-number}-module/
  {task-number}-task/
    README.md          # Task requirements (in Russian)
    {component}.js     # Main implementation
    {component}.test.js # Jest tests
    index.html         # Demo page
    style.css          # Component styles
```

### Error Logging

Use `console.error('Error message:', error)` for error logging throughout the project.

### Assets

- `assets/lib/create-element.js` - DOM creation utility
- `assets/lib/escape-html.js` - HTML escaping utility  
- `assets/images/` - Product images and icons
- `assets/styles/` - Common CSS styles

The final module (9-2) assembles all components into a complete SPA restaurant application with product loading, filtering, and cart functionality.