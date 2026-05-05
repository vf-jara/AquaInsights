/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  moduleNameMapper: {
    // Mock do Firebase
    'firebase/firestore': '<rootDir>/src/__mocks__/firebase/firestore.ts',
    'firebase/auth': '<rootDir>/src/__mocks__/firebase/auth.ts',
    '../config/firebase': '<rootDir>/src/__mocks__/firebase/config.ts',
    '../../config/firebase': '<rootDir>/src/__mocks__/firebase/config.ts',
    // Mock do AsyncStorage
    '@react-native-async-storage/async-storage': '<rootDir>/src/__mocks__/asyncStorage.ts',
    // Mock do NetInfo
    '@react-native-community/netinfo': '<rootDir>/src/__mocks__/netinfo.ts',
  },
};
