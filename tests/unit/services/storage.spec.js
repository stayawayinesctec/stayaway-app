import Storage from '@app/services/storage';
import AsyncStorage from '@react-native-community/async-storage';

describe('Storage Service', () => {
  const prefix = 'divoc-app-pt.inesctec.stayaway.debug:';

  describe('hasItem()', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('Given an existing key for a stored value, hasItem returns true', async () => {
      // Prepare
      const key = 'key';
      const value = 'value';
      AsyncStorage.getItem.mockImplementation(() => Promise.resolve(value));

      // Execute
      const result = await Storage.hasItem(key);

      // Assert
      expect(AsyncStorage.getItem).toHaveBeenCalled();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(prefix + key);
      expect(result).toBe(true);
    });
    it('Given an unexisting key, hasItem returns the false', async () => {
      // Prepare
      const key = 'key';
      AsyncStorage.getItem.mockImplementation(() => Promise.resolve(null));

      // Execute
      const result = await Storage.hasItem(key);

      // Assert
      expect(AsyncStorage.getItem).toHaveBeenCalled();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(prefix + key);
      expect(result).toBe(false);
    });
  });
  describe('getItem()', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('Given an existing key for a stored value, getItem returns the stored value', async () => {
      // Prepare
      const key = 'key';
      const value = 'value';
      AsyncStorage.getItem.mockImplementation(() => Promise.resolve(value));

      // Execute
      const result = await Storage.getItem(key);

      // Assert
      expect(AsyncStorage.getItem).toHaveBeenCalled();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(prefix + key);
      expect(result).toBe(value);
    });
    it('Given an unexisting key, getItem returns undefined', async () => {
      // Prepare
      const key = 'key';
      AsyncStorage.getItem.mockImplementation(() => Promise.resolve(undefined));

      // Execute
      const result = await Storage.getItem(key);

      // Assert
      expect(AsyncStorage.getItem).toHaveBeenCalled();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(prefix + key);
      expect(result).toBe(undefined);
    });
    it('Given an unexisting key and a default value, getItem returns the default value', async () => {
      // Prepare
      const key = 'key';
      const value = 'value';
      AsyncStorage.getItem.mockImplementation(() => Promise.resolve(undefined));

      // Execute
      const result = await Storage.getItem(key, value);

      // Assert
      expect(AsyncStorage.getItem).toHaveBeenCalled();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(prefix + key);
      expect(result).toBe(value);
    });
  });
  describe('setItem()', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('Given a key and a value, setItem stores the value', async () => {
      // Prepare
      const key = 'key';
      const value = 'value';
      AsyncStorage.setItem.mockImplementation(() => {});

      // Execute
      const result = await Storage.setItem(key, value);

      // Assert
      expect(AsyncStorage.setItem).toHaveBeenCalled();
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(prefix + key, value);
      expect(result).toEqual({key, value});
    });
  });
  describe('removeItem()', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('Given an existing key, removeItem deletes the value', async  () => {
      // Prepare
      const key = 'key';
      const value = 'value';
      AsyncStorage.getItem.mockImplementation(() => Promise.resolve(value));
      AsyncStorage.removeItem.mockImplementation(() => Promise.resolve());

      // Execute
      const result = await Storage.removeItem(key);

      // Assert
      expect(AsyncStorage.getItem).toHaveBeenCalled();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(prefix + key);
      expect(AsyncStorage.removeItem).toHaveBeenCalled();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(prefix + key);
      expect(result).toEqual({ key, value });
    });
    it('Given an not existing key, removeItem returns an empty object', async () => {
      // Prepare
      const key = 'key';
      AsyncStorage.getItem.mockImplementation(() => Promise.resolve());
      AsyncStorage.removeItem.mockImplementation(() => Promise.resolve());

      // Execute
      const result = await Storage.removeItem(key);

      // Assert
      expect(AsyncStorage.getItem).toHaveBeenCalled();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(prefix + key);
      expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });
  describe('isEmpty()', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('For an empty storage, isEmpty should return true', async () => {
      // Prepare
      AsyncStorage.getAllKeys.mockImplementation(() => Promise.resolve([]));
      AsyncStorage.getItem.mockImplementation(() => Promise.resolve());

      // Execute
      const result = await Storage.isEmpty();

      // Assert
      expect(AsyncStorage.getAllKeys).toHaveBeenCalled();
      expect(AsyncStorage.getItem).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });
    it('For a not empty storage, isEmpty should return false', async () => {
      // Prepare
      const key = 'key';
      const value = 'value';
      AsyncStorage.getAllKeys.mockImplementation(() => Promise.resolve([prefix + key]));
      AsyncStorage.getItem.mockImplementation(() => Promise.resolve(value));

      // Execute
      const result = await Storage.isEmpty();

      // Assert
      expect(AsyncStorage.getAllKeys).toHaveBeenCalled();
      expect(AsyncStorage.getItem).toHaveBeenCalled();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(prefix + key);
      expect(result).toBe(false);
    });
  });
  describe('clearStorage()', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('For an not empty storage, clearStorage should delete all items', async () => {
      // Prepare
      const key = 'key';
      const value = 'value';
      AsyncStorage.getAllKeys.mockImplementation(() => Promise.resolve([prefix + key]));
      AsyncStorage.getItem.mockImplementation(() => Promise.resolve(value));
      AsyncStorage.removeItem.mockImplementation(() => Promise.resolve(key));

      // Execute
      await Storage.clearStorage();

      // Assert
      expect(AsyncStorage.getAllKeys).toHaveBeenCalled();
      expect(AsyncStorage.getItem).toHaveBeenCalled();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(prefix + key);
      expect(AsyncStorage.removeItem).toHaveBeenCalled();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(prefix + key);
    });
    it('For an not empty storage, findItems should return all query-matching items', async () => {
      // Prepare
      AsyncStorage.getAllKeys.mockImplementation(() => Promise.resolve([]));
      AsyncStorage.getItem.mockImplementation(() => Promise.resolve());
      AsyncStorage.removeItem.mockImplementation(() => Promise.resolve());

      // Execute
      await Storage.clearStorage();

      // Assert
      expect(AsyncStorage.getAllKeys).toHaveBeenCalled();
      expect(AsyncStorage.getItem).not.toHaveBeenCalled();
      expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
    });
  });
});
