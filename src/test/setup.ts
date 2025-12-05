import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock fetch to prevent network requests in tests
global.fetch = vi.fn(() =>
    Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({}),
        text: async () => '',
        blob: async () => new Blob(),
        arrayBuffer: async () => new ArrayBuffer(0),
    } as Response)
);

// Mock XMLHttpRequest to prevent network requests
class MockXMLHttpRequest {
    open = vi.fn();
    send = vi.fn();
    setRequestHeader = vi.fn();
    addEventListener = vi.fn();
    removeEventListener = vi.fn();
    abort = vi.fn();
    readyState = 0;
    status = 200;
    responseText = '';
    response = '';
}

// @ts-expect-error - Mocking XMLHttpRequest
global.XMLHttpRequest = vi.fn(() => new MockXMLHttpRequest());

// Mock image loading
const mockImage = {
    onload: vi.fn(),
    onerror: vi.fn(),
    src: '',
    addEventListener: vi.fn((event: string, handler: () => void) => {
        if (event === 'load') {
            setTimeout(() => handler(), 0);
        }
    }),
    removeEventListener: vi.fn(),
};

// @ts-expect-error - Mocking Image constructor
global.Image = vi.fn(() => mockImage);

// Suppress console errors in tests (optional)
global.console.error = vi.fn();
global.console.warn = vi.fn();
