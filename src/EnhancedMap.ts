export type MapEntry<K = string, V = any> = [key: K, value: V];

export class EnhancedMap<K = string, V = any> extends Map<K, V> {
  /**
   * Creates an empty Map.
   */
  constructor();
  /**
   * Creates a Map from premade entries.
   * @param entries Entries to make the Map with.
   */
  constructor(entries: MapEntry<V>[] | Map<K, V>);
  constructor(entries?: MapEntry<K, V>[] | Map<K, V>) {
    let map: MapEntry<K, V>[] = [];
    if (entries)
      if (Array.isArray(entries)) {
        entries.forEach(([key, value]) => map.push([key, value]));
      } else {
        entries.forEach((value, key) => map.push([key, value]));
      }
    super(map ?? undefined);
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
  public remove(filter: (value: V, key: K) => any) {
    this.forEach((v, k) => (filter(v, k) ? this.delete(k) : null));
  }

  /**
   * Removes the entries with the specified keys.
   * @param keys Keys of the entries to remove.
   */
  public removeKeys(...keys: K[]) {
    this.remove((v, k) => keys.some((key) => key === k));
  }

  /**
   * Determine if an entry matches the specified filter.
   * @param filter Function called one time for each element
   * in the Map, if true is returned, the entry is
   * considered as matching the filter.
   * @returns {boolean} Whether an entry matched the filter
   * or not.
   */
  public some(filter: (value: V, key: K) => any): boolean {
    let result: boolean[] = [];
    this.forEach((v, k) => result.push(filter(v, k)));
    return result.some((i) => !!i);
  }

  /**
   * Determine if all the entries match the specified filter.
   * @param filter Function called one time for each element
   * in the Map.
   * @returns {boolean} Whether all entries matched the filter
   * or not.
   */
  public every(filter: (value: V, key: K) => any): boolean {
    let result: boolean[] = [];
    this.forEach((v, k) => result.push(filter(v, k)));
    return result.every((i) => !!i);
  }

  /**
   * Maps Map: executes a function for each entry and
   * creates a new Map from what it returns
   * (similar to {@link Array.map}).
   * @param mapper Function called for each entry.
   * @returns {EnhancedMap} The new Map.
   */
  public map<V2>(mapper: (value: V, key: K) => MapEntry<V2>): EnhancedMap<V2> {
    let newMap = new EnhancedMap<V2>();
    this.forEach((k, v) => newMap.set(...mapper(k, v)));
    return newMap;
  }

  /**
   * Finds an entry matching the specified filter.
   * (similar to {@link Array.find})
   * @param finder Function called for every entries until it
   * returns true.
   * @returns {MapEntry<V> | null} The found
   * entry or null if no entry matched the filter.
   */
  public find(finder: (value: V, key: K) => any): MapEntry<K, V> | null {
    let found = this.findAll((v, k) => !!finder(v, k));
    return found ? found[0] : null;
  }

  /**
   * Finds all entries matching the specified filter.
   * @param finder Function called for every entries, when
   * returning true, the entry is added to the output array.
   * @returns {MapEntry<V>[] | null} Array of found
   * entries or null if no entry matched the filter.
   */
  public findAll(finder: (value: V, key: K) => any): MapEntry<K, V>[] | null {
    let found: MapEntry<K, V>[] = [];
    this.forEach((v, k) => (!!finder(v, k) ? found.push([k, v]) : null));
    return found.length !== 0 ? found : null;
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
   * @returns {EnhancedMap<V | V2>} The new Map
   */
  public concat<V2>(...others: EnhancedMap<V2>[]): EnhancedMap<V | V2> {
    return new EnhancedMap<V | V2>([
      ...this.toArray(),
      ...others.reduce<MapEntry<V2>[]>(
        (acc, c) => [...acc, ...c.toArray()],
        []
      ),
    ]);
  }

  /**
   * Raw entries as an array
   */
  public toArray() {
    let array: MapEntry<K, V>[] = [];
    this.forEach((v, k) => array.push([k, v]));
    return array;
  }
}
