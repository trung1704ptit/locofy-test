# Testing Guide

This project uses Jest for unit testing with React Testing Library for component testing.

## 🚀 Quick Start

### Run all tests

```bash
npm test
```

### Run tests in watch mode (recommended for development)

```bash
npm run test:watch
```

### Run tests with coverage report

```bash
npm run test:coverage
```

### Run tests in CI mode

```bash
npm run test:ci
```

## 📁 Test Structure

```
src/
├── __tests__/           # Test directories
│   ├── lib/            # Tests for utility functions
│   ├── data/           # Tests for mock data
│   └── types/          # Tests for type definitions
├── setupTests.ts       # Test setup and configuration
└── ...
```

## 🧪 Test Files

### Utility Functions (`src/lib/__tests__/nodes.test.ts`)

- Tests for `findNodeById`, `updateNodeById`, `computeComponentLabels`, `nodeToStyle`
- Covers node traversal, updates, component labeling, and style conversion

### Mock Data (`src/data/__tests__/mockNodes.test.ts`)

- Validates structure and integrity of mock data
- Ensures all nodes have valid properties and unique IDs

### Type Definitions (`src/types/__tests__/index.test.ts`)

- Tests TypeScript type compatibility
- Ensures Node interface works correctly

## ⚙️ Configuration

### Jest Configuration (`jest.config.js`)

- Uses `ts-jest` for TypeScript support
- Configured for ES modules
- Includes coverage reporting
- Excludes build artifacts and setup files

### Test Setup (`src/setupTests.ts`)

- Imports `@testing-library/jest-dom` for custom matchers
- Mocks browser APIs (matchMedia, ResizeObserver, etc.)
- Suppresses React warnings in tests

### TypeScript Test Config (`tsconfig.test.json`)

- Extends main TypeScript configuration
- Includes Jest types
- Configured for test files

## 🎯 Writing Tests

### Example Test Structure

```typescript
describe('Function Name', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = functionToTest(input);

    // Assert
    expect(result).toBe('expected');
  });
});
```

### Testing Utilities

- **`@testing-library/react`**: React component testing
- **`@testing-library/jest-dom`**: Custom DOM matchers
- **`@testing-library/user-event`**: User interaction simulation

### Available Matchers

```typescript
// DOM assertions
expect(element).toBeInTheDocument();
expect(element).toHaveClass('className');
expect(element).toHaveTextContent('text');

// Object assertions
expect(object).toEqual(expected);
expect(array).toHaveLength(3);
expect(fn).toHaveBeenCalledWith('arg');
```

## 📊 Coverage

Coverage reports are generated in the `coverage/` directory:

- **HTML**: Open `coverage/lcov-report/index.html` in browser
- **Text**: View in terminal with `npm run test:coverage`
- **LCOV**: For CI/CD integration

## 🔧 Troubleshooting

### Common Issues

1. **TypeScript errors in tests**
   - Ensure `tsconfig.test.json` is properly configured
   - Check that test files are included in the config

2. **Module import errors**
   - Verify Jest configuration for ES modules
   - Check `moduleNameMapping` in Jest config

3. **Test environment issues**
   - Ensure `jsdom` is properly configured
   - Check `setupTests.ts` for missing mocks

### Debug Mode

```bash
# Run specific test file
npm test -- nodes.test.ts

# Run with verbose output
npm test -- --verbose

# Run specific test
npm test -- --testNamePattern="should find a node by its ID"
```

## 📝 Best Practices

1. **Test Structure**: Use descriptive test names and organize tests logically
2. **Coverage**: Aim for high test coverage, especially for utility functions
3. **Mocking**: Mock external dependencies and browser APIs appropriately
4. **Assertions**: Use specific assertions and avoid testing implementation details
5. **Setup**: Use `beforeEach` and `afterEach` for test setup and cleanup

## 🚀 Continuous Integration

The `test:ci` script is designed for CI/CD pipelines:

- Runs tests once (no watch mode)
- Generates coverage reports
- Exits with appropriate code for CI systems
