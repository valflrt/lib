export interface CollectionEntry<ValueType = any> {
  key: string;
  value: ValueType;
}

export class Collection<ValuesType = any> {
  private _entries: CollectionEntry[];

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
    this._entries = entries ?? [];
  }

  /**
   * Sets new entry (a key and the value attached to it).
   * @param key Key of the new entry.
   * @param value Value of the new entry.
   */
  public set(key: string, value: ValuesType) {
    this._entries.push({ key, value });
  }

  /**
   * Finds and returns an entry using its key it, crashes if
   * the entry doesn't exist.
   * @param key Key of the entry.
   * @returns {ValuesType}
   */
  public get(key: string): ValuesType {
    return this.find((k) => key === k)!.value;
  }

  /**
   * Checks if an entry exists.
   * @param key Key of the entry.
   * @returns
   */
  public has(key: string) {
    return !!this.find((k) => key === k);
  }

  /**
   * Executes the given function for each element in the
   * collection (similar to {@link Array.forEach}).
   * @param callback Function called one time for each element
   * in the array.
   */
  public forEach(callback: (key: string, value: ValuesType) => unknown) {
    this._entries.forEach((e) => callback(e.key, e.value));
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
      key: string,
      value: ValuesType
    ) => { key: string; value: V } | [key: string, value: V]
  ): Collection {
    let newCollection = new Collection<V>();
    this.forEach((key, value) => {
      let entry = mapper(key, value);
      if (Array.isArray(entry)) newCollection.set(...entry);
      else newCollection.set(entry.key, entry.value);
    });
    return newCollection;
  }

  /**
   * Find an entry using a callback (similar to {@link Array.find})
   * @param finder Function called for every entries until it
   * returns true
   */
  public find(
    finder: (key: string, value: ValuesType) => any
  ): CollectionEntry | null {
    let entry = this._entries.find((e) => !!finder(e.key, e.value));
    return entry ?? null;
  }

  /**
   * Find an entry using a callback (similar to {@link Array.find})
   * @param filter Callback
   */
  public filter(filter: (key: string, value: ValuesType) => unknown) {
    return this._entries.filter((e) => filter(e.key, e.value));
  }
}
