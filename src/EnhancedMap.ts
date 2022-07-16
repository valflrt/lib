export interface EnhancedMapEntry<V = any> {
  key: string;
  value: V;
}

export interface EnhancedMapConstructor {
  new (): EnhancedMap;
  new <V>(entries: EnhancedMapEntry<V>[]): EnhancedMap<V>;
  new <V>(entries: Map<string, V>): EnhancedMap<V>;
  readonly prototype: EnhancedMap;
  readonly [Symbol.species]: EnhancedMapConstructor;
}

export interface EnhancedMap<V = any> extends Map<string, V> {
  constructor: EnhancedMapConstructor;
}

export class EnhancedMap<V = any> extends Map<string, V> {
  /**
   * Creates an empty Map.
   */
  constructor();
  /**
   * Creates a Map from premade entries.
   * @param entries Entries to make the Map with.
   */
  constructor(entries: EnhancedMapEntry<V>[] | Map<string, V>);
  constructor(entries?: EnhancedMapEntry<V>[] | Map<string, V>) {
    let mappedEntries: [string, V][] = [];
    if (entries)
      if (Array.isArray(entries)) {
        entries.forEach(({ key, value }) => mappedEntries.push([key, value]));
      } else {
        entries.forEach((value, key) => mappedEntries.push([key, value]));
      }
    super(mappedEntries ?? undefined);
  }

  /**
   * Returns the entry with the specified key. If it doesn't
   * exist, returns undefined.
   * @param key Key of the entry.
   */
  public get(key: string): V | undefined;
  /**
   * Returns the entry at the specified index. If it doesn't
   * exist returns undefined.
   * @param index Index of the entry.
   */
  public get(index: number): V | undefined;
  public get(keyOrIndex: string | number): V | undefined {
    return typeof keyOrIndex === "string"
      ? super.get(keyOrIndex)
      : typeof keyOrIndex === "number"
      ? this.find((e, i) => i === keyOrIndex)?.value ?? undefined
      : undefined;
  }

  /**
   * Checks if all specified entries exist.
   * @param keys Keys of the entries.
   * @returns {boolean} Whether all the entries exist or not.
   */
  public hasAll(...keys: string[]): boolean {
    return keys.map((key) => this.has(key)).every((i) => !!i);
  }

  /**
   * Checks if one of the specified entries exists.
   * @param keys Keys of the entries.
   * @returns {boolean} Whether one or more of the entries
   * exists or not.
   */
  public hasAny(...keys: string[]): boolean {
    return keys.map((key) => this.has(key)).some((i) => !!i);
  }

  /**
   * Removes all entries matching the filter.
   * @param filter Function executed for each entry, when true
   * is returned, the corresponding entry is removed.
   */
  public remove(
    filter: (entry: EnhancedMapEntry<V>, index: number) => unknown
  ) {
    this.each((e, i) => (filter(e, i) ? this.delete(e.key) : null));
  }

  /**
   * Removes the entries with the specified keys.
   * @param keys Keys of the entries to remove.
   */
  public removeKeys(...keys: string[]) {
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
  public some(
    filter: (entry: EnhancedMapEntry<V>, index: number) => unknown
  ): boolean {
    let result: boolean[] = [];
    this.each((e, i) => result.push(!!filter(e, i)));
    return result.some((i) => !!i);
  }

  /**
   * Determine if all the entries match the specified filter.
   * @param filter Function called one time for each element
   * in the Map.
   * @returns {boolean} Whether all entries matched the filter
   * or not.
   */
  public every(
    filter: (entry: EnhancedMapEntry<V>, index: number) => unknown
  ): boolean {
    let result: boolean[] = [];
    this.each((e, i) => result.push(!!filter(e, i)));
    return result.every((i) => !!i);
  }

  /**
   * @deprecated Use {@link EnhancedMap.each} instead
   */
  public forEach(
    callbackfn: (value: V, key: string, map: Map<string, V>) => void,
    thisArg?: any
  ): void {
    super.forEach(callbackfn, thisArg);
  }

  /**
   * Executes a function for each entry of the Map.
   * @param callback Function executed for each entry of the
   * Map.
   */
  public each(
    callback: (entry: EnhancedMapEntry<V>, index: number) => unknown
  ): void {
    let i = 0;
    super.forEach((v, k) => {
      callback({ key: k, value: v }, i);
      i += 1;
    });
  }

  /**
   * Maps Map: executes a function for each entry and creates
   * a new Map from what it returns (similar to {@link Array.map}).
   * @param mapper Function called for each entry.
   * @returns {EnhancedMap} The new Map.
   */
  public map<V2>(
    mapper: (entry: EnhancedMapEntry<V>, index: number) => EnhancedMapEntry<V2>
  ): EnhancedMap<V2> {
    let newMap = new EnhancedMap<V2>();
    this.each((e, i) => {
      let { key, value } = mapper(e, i);
      newMap.set(key, value);
    });
    return newMap;
  }

  /**
   * Executes the specified callback function for each entry
   * in the map. An initial value is provided and updated with
   * the value returned for each execution of the callback.
   * @param initialValue The initial value.
   * @param callback The function executed for each entry.
   * @returns The new value.
   */
  public reduce<V2>(
    initialValue: V2,
    callback: (
      accumulator: V2,
      entry: EnhancedMapEntry<V>,
      index: number,
      map: EnhancedMap<V>
    ) => V2
  ): V2 {
    let v = initialValue;
    this.each((e, i) => (v = callback(v, e, i, this)));
    return v;
  }

  /**
   * Finds all entries matching the specified filter.
   * @param finder Function called for every entries, when
   * returning true, the entry is added to the output array.
   * @returns {EnhancedMapEntry<V>[] | null} Array of found
   * entries or null if no entry matched the filter.
   */
  public findAll(
    finder: (entry: EnhancedMapEntry<V>, index: number) => unknown
  ): EnhancedMapEntry<V>[] | null {
    let found: EnhancedMapEntry<V>[] = [];
    this.each((e, i) => !!finder(e, i) && found.push(e));
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
    finder: (entry: EnhancedMapEntry<V>, index: number) => unknown
  ): EnhancedMapEntry<V> | null {
    return this.findAll(finder)?.[0] ?? null;
  }

  /**
   * Creates an exact copy of the current Map.
   * @returns {EnhancedMap<V>}
   */
  public clone(): EnhancedMap<V> {
    return new EnhancedMap<V>(this);
  }

  /**
   * Concats the current Map with one or more other
   * Map
   * @param others Other Map to concat with
   * @returns {EnhancedMap<V | V2>} The new Map
   */
  public concat<V2>(...others: EnhancedMap<V2>[]): EnhancedMap<V | V2> {
    return new EnhancedMap<V | V2>([
      ...this.toJSON(),
      ...others.reduce<EnhancedMapEntry<V2>[]>(
        (acc, c) => [...acc, ...c.toJSON()],
        []
      ),
    ]);
  }

  /**
   * Returns raw entries as an array
   */
  public toJSON() {
    let array: EnhancedMapEntry<V>[] = [];
    this.each((e) => array.push(e));
    return array;
  }
}
