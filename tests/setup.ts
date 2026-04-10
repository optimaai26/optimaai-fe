import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from '@/mocks/handlers';

// Setup Mock Service Worker for testing environments
export const server = setupServer(...handlers);

beforeAll(() => {
    // Start MSW Server before all tests
    server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
    // Reset any request handlers that we may add during the tests,
    // so they don't affect other tests.
    server.resetHandlers();
});

afterAll(() => {
    // Clean up after the tests are finished.
    server.close();
});
