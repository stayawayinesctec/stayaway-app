/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import AsyncStorage from '@react-native-community/async-storage';
import Configuration from '@app/services/configuration';

class Storage {
  constructor () {
    this.storage = AsyncStorage;
    this.instance = undefined;
    this.prefix = `divoc-app-(${Configuration.APP_ID}):`;
    this.prefixReg = new RegExp(`^(${ Storage.escapeRegex(this.prefix) })(.+)`, 'gi');
  }

  /**
   * Get an instance of this singleton class.
   */
  static getInstance () {
    if (this.instance === undefined) {
      this.instance = new Storage();
    }

    return this.instance;
  }

  /**
   * Check if storage has an Item / exists with the given key.
   *
   * @param {string} key the key of the Item
   *
   * @returns {Promise<Boolean>} True if exists, False otherwise
   */
  hasItem (key) {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await this.storage.getItem(this.prefix + key) !== null);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get an item from the storage.
   *
   * @param {string} key the key of the Item
   *
   * @returns {Promise<Item>} The item from the localStorage
   */
  getItem (key, ifNull = undefined) {
    return new Promise((resolve, reject) => {
      this.storage.getItem(this.prefix + key)
      .then((result) => resolve(result || ifNull))
      .catch(error => reject(error));
    });
  }

  /**
   * Put an item in the storage.
   *
   * @param {string} key the key of the Item
   * @param {string} value the value of the Item
   *
   * @returns {Promise<Item>} The item added to the localStorage
   */
  setItem (key, value) {
    return new Promise((resolve) => {
      this.storage.setItem(this.prefix + key, value);
      resolve({ key, value });
    });
  }

  /**
   * Remove an item from the storage.
   *
   * @param {string} key the key of the Item
   *
   * @returns {Promise<Item|{}>} Returns the item if it exists, {} otherwise
   */
  removeItem (key) {
    return new Promise(async (resolve, reject) => {
      try {
        let item = {};
        const value = await this.storage.getItem(this.prefix + key);

        if (value !== undefined) {
          await this.storage.removeItem(this.prefix + key);
          item = { key, value };
        }
        resolve(item);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Check if the storage is empty.
   *
   * @returns {Promise<Boolean>} True if exists, False otherwise
   */
  isEmpty () {
    return new Promise(async (resolve, reject) => {
      try {
        const results = await this.findItems(this.prefixReg);
        if (results.length > 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Clear all keys of the storage.
   *
   */
  clearStorage () {
    return new Promise(async (resolve, reject) => {
      try {
        const results = await this.findItems(this.prefixReg);
        const promises = [];

        results.forEach(item => promises.push(this.storage.removeItem(item.key)));

        Promise.all(promises)
        .then(() => resolve())
        .catch((error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Find all items in the this.storage by an RegExp.
   *
   * @param query The regexp used to filter
   *
   * @returns {Promise<Array<Item>>} An array of items
   */
  findItems (query) {
    return new Promise(async (resolve, reject) => {
      try {
        const results = [];
        const keys = await this.storage.getAllKeys();

        for(let i = 0; i < keys.length; i++) {
          const key = keys[i];

          if (key.match(query) || (!query && typeof key === 'string')) {
            const value = await this.storage.getItem(key);
            results.push({ key, value });
          }
        }

        resolve(results);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Escape a RegExp string.
   *
   * @param regexp The regexp used to escape
   *
   * @returns {String} Escaped string
   */
  static escapeRegex(regexp) {
    return regexp.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  }
}

const storage = Storage.getInstance();

export default storage;
