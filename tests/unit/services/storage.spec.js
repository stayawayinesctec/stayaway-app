import Storage from '@app/services/storage';
import AsyncStorage from '@react-native-community/async-storage';

describe('Storage Service', () => {
  const prefix = 'divoc-app-pt.inesctec.stayaway.debug:';

  describe('hasItem()', () => {
    it('Given an existing key for a stored value, hasItem returns true', async () => {
      // Prepare
      const key = 'key';
      const value = 'value';
      AsyncStorage.getItem = jest.fn(() => Promise.resolve(value));

      // Execute
      const result = await Storage.hasItem(key);

      // Assert
      expect(AsyncStorage.getItem.mock.calls.length).toBe(1);
      expect(AsyncStorage.getItem.mock.calls[0][0]).toBe(prefix + key);
      expect(result).toBe(true);
    });
    it('Given an unexisting key, hasItem returns the false', async () => {
      // Prepare
      const key = 'key';
      AsyncStorage.getItem = jest.fn(() => Promise.resolve(null));

      // Execute
      const result = await Storage.hasItem(key);

      // Assert
      expect(AsyncStorage.getItem.mock.calls.length).toBe(1);
      expect(AsyncStorage.getItem.mock.calls[0][0]).toBe(prefix + key);
      expect(result).toBe(false);
    });
  });
  describe('getItem()', () => {
    it('Given an existing key for a stored value, getItem returns the stored value', async () => {
      // Prepare
      const key = 'key';
      const value = 'value';
      AsyncStorage.getItem = jest.fn(() => Promise.resolve(value));

      // Execute
      const result = await Storage.getItem(key);

      // Assert
      expect(AsyncStorage.getItem.mock.calls.length).toBe(1);
      expect(AsyncStorage.getItem.mock.calls[0][0]).toBe(prefix + key);
      expect(result).toBe(value);
    });
    it('Given an unexisting key, getItem returns undefined', async () => {
      // Prepare
      const key = 'key';
      AsyncStorage.getItem = jest.fn(() => Promise.resolve(undefined));

      // Execute
      const result = await Storage.getItem(key);

      // Assert
      expect(AsyncStorage.getItem.mock.calls.length).toBe(1);
      expect(AsyncStorage.getItem.mock.calls[0][0]).toBe(prefix + key);
      expect(result).toBe(undefined);
    });
    it('Given an unexisting key and a default value, getItem returns the default value', async () => {
      // Prepare
      const key = 'key';
      const value = 'value';
      AsyncStorage.getItem = jest.fn(() => Promise.resolve(undefined));

      // Execute
      const result = await Storage.getItem(key, value);

      // Assert
      expect(AsyncStorage.getItem.mock.calls.length).toBe(1);
      expect(AsyncStorage.getItem.mock.calls[0][0]).toBe(prefix + key);
      expect(result).toBe(value);
    });
  });
  describe('setItem()', () => {
    it('Given a key and a value, setItem stores the value', async () => {
      // Prepare
      const key = 'key';
      const value = 'value';
      AsyncStorage.setItem = jest.fn(() => {});

      // Execute
      const result = await Storage.setItem(key, value);

      // Assert
      expect(AsyncStorage.setItem.mock.calls.length).toBe(1);
      expect(AsyncStorage.setItem.mock.calls[0][0]).toBe(prefix + key);
      expect(AsyncStorage.setItem.mock.calls[0][1]).toBe(value);
      expect(result).toEqual({key, value});
    });
  });
  describe('removeItem()', () => {
    it('Given an existing key, removeItem deletes the value', async  () => {
      // Prepare
      const key = 'key';
      const value = 'value';
      AsyncStorage.getItem = jest.fn(() => Promise.resolve(value));
      AsyncStorage.removeItem = jest.fn(() => Promise.resolve());

      // Execute
      const result = await Storage.removeItem(key);

      // Assert
      expect(AsyncStorage.getItem.mock.calls.length).toBe(1);
      expect(AsyncStorage.getItem.mock.calls[0][0]).toBe(prefix + key);
      expect(AsyncStorage.removeItem.mock.calls.length).toBe(1);
      expect(AsyncStorage.removeItem.mock.calls[0][0]).toBe(prefix + key);
      expect(result).toEqual({ key, value });
    });
    it('Given an not existing key, removeItem returns an empty object', async () => {
      // Prepare
      const key = 'key';
      AsyncStorage.getItem = jest.fn(() => Promise.resolve());
      AsyncStorage.removeItem = jest.fn(() => Promise.resolve());

      // Execute
      const result = await Storage.removeItem(key);

      // Assert
      expect(AsyncStorage.getItem.mock.calls.length).toBe(1);
      expect(AsyncStorage.getItem.mock.calls[0][0]).toBe(prefix + key);
      expect(AsyncStorage.removeItem.mock.calls.length).toBe(0);
      expect(result).toEqual({});
    });
  });
  describe('isEmpty()', () => {
    it('For an empty storage, isEmpty should return true', async () => {
      // Prepare
      AsyncStorage.getAllKeys = jest.fn(() => Promise.resolve([]));
      AsyncStorage.getItem = jest.fn(() => Promise.resolve());

      // Execute
      const result = await Storage.isEmpty();

      // Assert
      expect(AsyncStorage.getAllKeys.mock.calls.length).toBe(1);
      expect(AsyncStorage.getItem.mock.calls.length).toBe(0);
      expect(result).toBe(true);
    });
    it('For a not empty storage, isEmpty should return false', async () => {
      // Prepare
      const key = 'key';
      const value = 'value';
      AsyncStorage.getAllKeys = jest.fn(() => Promise.resolve([prefix + key]));
      AsyncStorage.getItem = jest.fn(() => Promise.resolve(value));

      // Execute
      const result = await Storage.isEmpty();

      // Assert
      expect(AsyncStorage.getAllKeys.mock.calls.length).toBe(1);
      expect(AsyncStorage.getItem.mock.calls.length).toBe(1);
      expect(AsyncStorage.getItem.mock.calls[0][0]).toBe(prefix + key);
      expect(result).toBe(false);
    });
  });
  describe('clearStorage()', () => {
    it('For an not empty storage, clearStorage should delete all items', async () => {
      // Prepare
      const key = 'key';
      const value = 'value';
      AsyncStorage.getAllKeys = jest.fn(() => Promise.resolve([prefix + key]));
      AsyncStorage.getItem = jest.fn(() => Promise.resolve(value));
      AsyncStorage.removeItem = jest.fn(() => Promise.resolve(key));

      // Execute
      await Storage.clearStorage();

      // Assert
      expect(AsyncStorage.getAllKeys.mock.calls.length).toBe(1);
      expect(AsyncStorage.getItem.mock.calls.length).toBe(1);
      expect(AsyncStorage.getItem.mock.calls[0][0]).toBe(prefix + key);
      expect(AsyncStorage.removeItem.mock.calls.length).toBe(1);
      expect(AsyncStorage.removeItem.mock.calls[0][0]).toBe(prefix + key);
    });
    it('For an not empty storage, findItems should return all query-matching items', async () => {
      // Prepare
      AsyncStorage.getAllKeys = jest.fn(() => Promise.resolve([]));
      AsyncStorage.getItem = jest.fn(() => Promise.resolve());
      AsyncStorage.removeItem = jest.fn(() => Promise.resolve());

      // Execute
      await Storage.clearStorage();

      // Assert
      expect(AsyncStorage.getAllKeys.mock.calls.length).toBe(1);
      expect(AsyncStorage.getItem.mock.calls.length).toBe(0);
      expect(AsyncStorage.removeItem.mock.calls.length).toBe(0);
    });
  });
});
