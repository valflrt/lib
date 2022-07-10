export interface CollectionEntry<ValueType = any> {
  key: string;
  value: ValueType;
}

export class Collection<ValuesType = any> {
  public rawEntries: CollectionEntry<ValuesType>[];

  /**
   * Creates a Collection.
   */
  constructor();
  /**
   * Creates a Collection from premade entries.
   * @param entries Entries to make the collection with.
   */
  constructor(entries: CollectionEntry<ValuesType>[]);
  constructor(entries?: CollectionEntry<ValuesType>[]) {
    this.rawEntries = entries ?? [];
  }

  /**
   * Sets new entry (a key and the value attached to it).
   * @param key Key of the new entry.
   * @param value Value of the new entry.
   * @returns {boolean} Whether the entry was successfully
   * created or not (if not, the entry already exists).
   */
  public set(key: string, value: ValuesType): boolean {
    if (this.has(key)) return false;
    this.rawEntries.push({ key, value });
    return true;
  }

  /**
   * Finds an entry from its key and returns it (the entry).
   * @param key Key of the entry.
   * @returns {ValuesType} The entry.
   */
  public get(key: string): ValuesType {
    return this.find((e) => e.key === key)!.value;
  }

  /**
   * Checks if an entry exists.
   * @param key Key of the entry.
   * @returns {boolean} Whether the entry exists or not.
   */
  public has(key: string): boolean {
    return !!this.find((e) => e.key === key);
  }

  /**
   * Checks if several entries all exist.
   * @param keys Keys of the entries.
   * @returns {boolean} Whether all the entries exist or not.
   */
  public hasAll(...keys: string[]): boolean {
    return keys.map((key) => this.has(key)).every((i) => !!i);
  }

  /**
   * Checks if one of the specified entries exists.
   * @param keys Keys of the entries.
   * @returns {boolean} Whether one of the entries exists or
   * not.
   */
  public hasAny(...keys: string[]): boolean {
    return keys.map((key) => this.has(key)).some((i) => !!i);
  }

  /**
   * Removes all entries matching the filter.
   * @param filter Function executed for each entry, when true
   * is returned, the corresponding entry is removed.
   */
  public remove(filter: (entry: CollectionEntry<ValuesType>) => any) {
    this.rawEntries = this.rawEntries.filter((e) => !filter(e));
  }

  /**
   * Removes the entries with the specified keys.
   * @param keys Keys of the entries to remove.
   */
  public removeKeys(...keys: string[]) {
    this.rawEntries = this.rawEntries.filter(
      (e) => !keys.some((k) => k === e.key)
    );
  }

  // TODO: Add some, every, concat, merge (intersect, difference)

  /**
   * Executes the specified function for each element in the
   * collection (similar to {@link Array.forEach}).
   * @param callback Function called one time for each element
   * in the array.
   */
  public forEach(callback: (entry: CollectionEntry) => unknown) {
    this.rawEntries.forEach((e) => callback(e));
  }

  /**
   * Maps Collection: executes a function for each entry and
   * creates a new Collection from what it returns
   * (similar to {@link Array.map}).
   * @param mapper Function called for each entry.
   * @returns {Collection} The new Collection.
   */
  public map<V>(
    mapper: (
      entry: CollectionEntry<ValuesType>
    ) => CollectionEntry<V> | [key: string, value: V]
  ): Collection<V> {
    let newCollection = new Collection<V>();
    this.forEach((e) => {
      let entry = mapper(e);
      if (Array.isArray(entry)) newCollection.set(...entry);
      else newCollection.set(entry.key, entry.value);
    });
    return newCollection;
  }

  /**
   * Finds an entry matching the specified filter.
   * (similar to {@link Array.find})
   * @param finder Function called for every entries until it
   * returns true.
   * @returns {CollectionEntry<ValuesType> | null} The found
   * entry or null if no entry matched the filter.
   */
  public find(
    finder: (entry: CollectionEntry) => any
  ): CollectionEntry<ValuesType> | null {
    let entry = this.rawEntries.find((e) => !!finder(e));
    return entry ?? null;
  }

  /**
   * Finds all entries matching the specified filter.
   * @param finder Function called for every entries, when
   * returning true, the entry is added to the output array.
   * @returns {CollectionEntry<ValuesType>[] | null} Array of found
   * entries or null if no entry matched the filter.
   */
  public findAll(
    finder: (entry: CollectionEntry) => any
  ): CollectionEntry<ValuesType>[] | null {
    let found: CollectionEntry<ValuesType>[] = [];
    this.forEach((e) => (!!finder(e) ? found.push(e) : null));
    return found.length !== 0 ? found : null;
  }

  /**
   * Filters all entries with the specified filter.
   * @param filter Function executed for each entry, if it
   * returns true the entry is kept.
   * @returns {Collection<ValuesType>} The filtered Collection.
   */
  public filter(
    filter: (entry: CollectionEntry<ValuesType>) => unknown
  ): Collection<ValuesType> {
    return new Collection(this.rawEntries.filter((e) => filter(e)));
  }
}
