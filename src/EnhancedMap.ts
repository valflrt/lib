export interface EnhancedMapEntry<V = any> {
  /**
   * Key of the entry.
   */
  k: string;
  /**
   * Value of the entry.
   */
  v: V;
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
  public get size(): number {
    return this.reduce(0, (acc) => acc + 1);
  }

  /**
   * Creates an empty Map.
   */
  constructor();
  /**
   * Creates a Map from premade entries.
   *
   * @param entries Entries to make the Map with.
   */
  constructor(entries: EnhancedMapEntry<V>[] | Map<string, V>);
  constructor(entries?: EnhancedMapEntry<V>[] | Map<string, V>) {
    super();
    if (entries)
      if (Array.isArray(entries)) {
        entries.forEach(({ k, v }) => this.set(k, v));
      } else if (entries instanceof Map) {
        entries.forEach((v, k) => this.set(k, v));
      }
  }

  /**
   * Adds a new entry with the specified key and value.
   *
   * @param key Key of the new entry.
   * @param value Value of the new entry.
   *
   * @returns {this} The current Map.
   */
  public set(key: string, value: V): this {
    super.set(key, value);
    return this;
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
   *
   * @param index Index of the entry.
   */
  public get(index: number): V | undefined;
  public get(keyOrIndex: string | number): V | undefined {
    return typeof keyOrIndex === "string"
      ? super.get(keyOrIndex)
      : typeof keyOrIndex === "number"
      ? this.find((e, i) => i === keyOrIndex)?.v ?? undefined
      : undefined;
  }

  /**
   * Checks if all specified entries exist.
   *
   * @param keys Keys of the entries.
   *
   * @returns {boolean} Whether all the entries exist or not.
   */
  public hasAll(...keys: string[]): boolean {
    return keys.map((key) => this.has(key)).every((i) => !!i);
  }

  /**
   * Checks if one of the specified entries exists.
   *
   * @param keys Keys of the entries.
   *
   * @returns {boolean} Whether one or more of the entries
   * exists or not.
   */
  public hasAny(...keys: string[]): boolean {
    return keys.map((key) => this.has(key)).some((i) => !!i);
  }

  /**
   * Removes all entries matching the filter.
   *
   * @param filter Function executed for each entry, when true
   * is returned, the corresponding entry is removed.
   *
   * @returns {this} The current Map.
   */
  public remove(
    filter: (entry: EnhancedMapEntry<V>, index: number) => unknown
  ): this {
    this.each((e, i) => (filter(e, i) ? this.delete(e.k) : null));
    return this;
  }

  /**
   * Removes the entries with the specified keys.
   *
   * @param keys Keys of the entries to remove.
   *
   * @returns {this} The current Map.
   */
  public removeKeys(...keys: string[]): this {
    return this.remove((e) => keys.some((k) => k === e.k));
  }

  /**
   * Removes all entries.
   *
   * @returns {this} The current Map.
   */
  public removeAll(): this {
    return this.remove(() => true);
  }

  /**
   * Determine if an entry matches the specified filter.
   *
   * @param filter Function called one time for each element
   * in the Map, if true is returned, the entry is
   * considered as matching the filter.
   *
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
   *
   * @param filter Function called one time for each element
   * in the Map.
   *
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
   * Executes a function for each entry of the Map.
   *
   * @param callback Function executed for each entry of the
   * Map.
   *
   * @returns {this} The current Map.
   */
  public each(
    callback: (entry: EnhancedMapEntry<V>, index: number) => unknown
  ): this {
    let i = 0;
    super.forEach((v, k) => {
      callback({ k, v }, i);
      i += 1;
    });
    return this;
  }

  /**
   * Executes a function for each entry of the Map.
   *
   * @deprecated
   */
  public forEach(
    callbackfn: (value: any, key: any, map: Map<any, any>) => any,
    thisArg?: any
  ): void {
    super.forEach(callbackfn, thisArg);
  }

  /**
   * Maps Map: executes a function for each entry and creates
   * a new Map from what it returns (similar to {@link Array.map}).
   *
   * @param mapper Function called for each entry.
   *
   * @returns {EnhancedMap} The new Map.
   */
  public map<V2>(
    mapper: (entry: EnhancedMapEntry<V>, index: number) => EnhancedMapEntry<V2>
  ): EnhancedMap<V2> {
    let newMap = new EnhancedMap<V2>();
    this.each((e, i) => {
      let { k, v } = mapper(e, i);
      newMap.set(k, v);
    });
    return newMap;
  }

  /**
   * Executes the specified callback function for each entry
   * in the map. An initial value is provided and updated with
   * the value returned for each execution of the callback.
   *
   * @param initialValue The initial value.
   * @param callback The function executed for each entry.
   *
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
    let value = initialValue;
    this.each((e, i) => (value = callback(value, e, i, this)));
    return value;
  }

  /**
   * Sorts the map.
   *
   * @param compare Function used to sort the entries. It is
   * expected to return "less" if the first argument is less
   * than the second argument, "equal" if they're equal, and
   * "more" otherwise. If omitted, the entries are sorted in
   * ascending ASCII character order.
   *
   * @returns The new value.
   */
  public sort(
    compare: (a: EnhancedMapEntry<V>, b: EnhancedMapEntry<V>) => number
  ): this {
    new EnhancedMap(this.toJSON().sort(compare));
    return this;
  }

  /**
   * Finds all entries matching the specified filter.
   *
   * @param finder Function called for every entries, when
   * returning true, the entry is added to the output array.
   *
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
   *
   * @param finder Function called for every entries until it
   * returns true.
   *
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
   *
   * @returns {EnhancedMap<V>}
   */
  public clone(): EnhancedMap<V> {
    return new EnhancedMap<V>(this);
  }

  /**
   * Concats the current Map with one or more other
   * Map
   *
   * @param others Other Map to concat with
   *
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
