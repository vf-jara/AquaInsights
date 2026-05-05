// Mock do firebase/firestore
export const collection = jest.fn();
export const addDoc = jest.fn(async () => ({ id: 'mock-firebase-id-123' }));
export const getDocs = jest.fn(async () => ({ forEach: jest.fn() }));
export const query = jest.fn();
export const where = jest.fn();
export const orderBy = jest.fn();
export const doc = jest.fn();
export const getDoc = jest.fn();
export const setDoc = jest.fn();
export const updateDoc = jest.fn();
export const Timestamp = {
  now: jest.fn(() => ({ toDate: () => new Date() })),
  fromDate: jest.fn((d: Date) => ({ toDate: () => d })),
};
