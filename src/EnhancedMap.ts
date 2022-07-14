export interface EnhancedMapEntry<K = string, V = any> {
  key: K;
  value: V;
}

export class EnhancedMap<K = string, V = any> extends Map<K, V> {
  /**
   * Creates an empty Map.
   */
  constructor();
  /**
   * Creates a Map from premade entries.
   * @param entries Entries to make the Map with.
   */
  constructor(entries: EnhancedMapEntry<K, V>[] | Map<K, V>);
  constructor(entries?: EnhancedMapEntry<K, V>[] | Map<K, V>) {
    let mappedEntries: [K, V][] = [];
    if (entries)
      if (Array.isArray(entries)) {
        entries.forEach(({ key, value }) => mappedEntries.push([key, value]));
      } else {
        entries.forEach((value, key) => mappedEntries.push([key, value]));
      }
    super(mappedEntries ?? undefined);
  }

  /**
   * Checks if all specified entries exist.
   * @param keys Keys of the entries.
   * @returns {boolean} Whether all the entries exist or not.
   */
  public hasAll(...keys: K[]): boolean {
    return keys.map((key) => this.has(key)).every((i) => !!i);
  }

  /**
   * Checks if one of the specified entries exists.
   * @param keys Keys of the entries.
   * @returns {boolean} Whether one or more of the entries
   * exists or not.
   */
  public hasAny(...keys: K[]): boolean {
    return keys.map((key) => this.has(key)).some((i) => !!i);
  }

  /**
   * Removes all entries matching the filter.
   * @param filter Function executed for each entry, when true
   * is returned, the corresponding entry is removed.
   */
  public remove(filter: (entry: EnhancedMapEntry<K, V>) => unknown) {
    this.each((e) => (filter(e) ? this.delete(e.key) : null));
  }

  /**
   * Removes the entries with the specified keys.
   * @param keys Keys of the entries to remove.
   */
  public removeKeys(...keys: K[]) {
    this.remove((e) => keys.some((k) => k === e.key));
  }

  /**
   * Determine if an entry matches the specified filter.
   * @param filter Function called one time for each element
   * in the Map, if true is returned, the entry is
   * considered as matching the filter.
   * @returns {boolean} Whether an entry matched the filter
   * or not.
   */
  public some(filter: (entry: EnhancedMapEntry<K, V>) => unknown): boolean {
    let result: boolean[] = [];
    this.each((e) => result.push(!!filter(e)));
    return result.some((i) => !!i);
  }

  /**
   * Determine if all the entries match the specified filter.
   * @param filter Function called one time for each element
   * in the Map.
   * @returns {boolean} Whether all entries matched the filter
   * or not.
   */
  public every(filter: (entry: EnhancedMapEntry<K, V>) => unknown): boolean {
    let result: boolean[] = [];
    this.each((e) => result.push(!!filter(e)));
    return result.every((i) => !!i);
  }

  /**
   * Executes a function for each entry of the Map.
   * @param callback Function executed for each entry of the
   * Map.
   */
  public each(callback: (entry: EnhancedMapEntry<K, V>) => unknown): void {
    super.forEach((v, k) => callback({ key: k, value: v }));
  }

  /**
   * Maps Map: executes a function for each entry and
   * creates a new Map from what it returns
   * (similar to {@link Array.map}).
   * @param mapper Function called for each entry.
   * @returns {EnhancedMap} The new Map.
   */
  public map<V2>(
    mapper: (entry: EnhancedMapEntry<K, V>) => EnhancedMapEntry<V2>
  ): EnhancedMap<V2> {
    let newMap = new EnhancedMap<V2>();
    this.each((e) => {
      let { key, value } = mapper(e);
      newMap.set(key, value);
    });
    return newMap;
  }

  /**
   * Finds all entries matching the specified filter.
   * @param finder Function called for every entries, when
   * returning true, the entry is added to the output array.
   * @returns {EnhancedMapEntry<V>[] | null} Array of found
   * entries or null if no entry matched the filter.
   */
  public findAll(
    finder: (entry: EnhancedMapEntry<K, V>) => unknown
  ): EnhancedMapEntry<K, V>[] | null {
    let found: EnhancedMapEntry<K, V>[] = [];
    this.each((e) => !!finder(e) && found.push(e));
    return found.length !== 0 ? found : null;
  }

  /**
   * Finds an entry matching the specified filter.
   * (similar to {@link Array.find})
   * @param finder Function called for every entries until it
   * returns true.
   * @returns {EnhancedMapEntry<V> | null} The found
   * entry or null if no entry matched the filter.
   */
  public find(
    finder: (entry: EnhancedMapEntry<K, V>) => unknown
  ): EnhancedMapEntry<K, V> | null {
    return this.findAll(finder)?.[0] ?? null;
  }

  /**
   * Filters all entries with the specified filter.
   * @param filter Function executed for each entry, if it
   * returns true the entry is kept.
   * @returns {EnhancedMap<V>} The filtered new Map.
   */
  public filter(filter: (value: V, key: K) => unknown): EnhancedMap<K, V> {
    let clone = this.clone();
    clone.forEach((v, k) => (!filter(v, k) ? clone.delete(k) : null));
    return clone;
  }

  /**
   * Creates an exact copy of the current Map.
   * @returns {EnhancedMap<V>}
   */
  public clone(): EnhancedMap<K, V> {
    return new EnhancedMap<K, V>(this);
  }

  // TODO: Add concat, merge (intersect, difference)

  /**
   * Concats the current Map with one or more other
   * Map
   * @param others Other Map to concat with
   * @returns {EnhancedMap<K | K2,V | V2>} The new Map
   */
  public concat<K2, V2>(
    ...others: EnhancedMap<K2, V2>[]
  ): EnhancedMap<K | K2, V | V2> {
    return new EnhancedMap<K | K2, V | V2>([
      ...this.toJSON(),
      ...others.reduce<EnhancedMapEntry<K2, V2>[]>(
        (acc, c) => [...acc, ...c.toJSON()],
        []
      ),
    ]);
  }

  /**
   * Returns raw entries as an array
   */
  public toJSON() {
    let array: EnhancedMapEntry<K, V>[] = [];
    this.each((e) => array.push(e));
    return array;
  }
}
