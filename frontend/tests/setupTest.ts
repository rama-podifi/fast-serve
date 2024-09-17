import '@testing-library/jest-dom/extend-expect'; // Extends Jest with custom matchers for DOM elements
import { configure } from '@testing-library/react'; // Optional configurations for testing-library

// Optional configurations
configure({ testIdAttribute: 'data-testid' });