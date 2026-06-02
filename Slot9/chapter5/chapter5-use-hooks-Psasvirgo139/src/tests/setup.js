import '@testing-library/jest-dom'

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem:    (key)        => store[key] ?? null,
    setItem:    (key, value) => { store[key] = String(value) },
    removeItem: (key)        => { delete store[key] },
    clear:      ()           => { store = {} },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Suppress noisy React prop warnings in test output
const originalError = console.error
beforeEach(() => {
  localStorageMock.clear()
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('Warning:')) return
    originalError(...args)
  }
})
afterEach(() => {
  console.error = originalError
})
