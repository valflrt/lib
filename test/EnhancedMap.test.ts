import { describe, it } from "mocha";
import { expect } from "chai";

import { EnhancedMap } from "../src/EnhancedMap";

describe("EnhancedMap tests", () => {
  describe("EnhancedMap.get()", () => {
    it("should properly retrieve a value from a key", () => {
      let map = new EnhancedMap().set("rick", "https://youtu.be/dQw4w9WgXcQ");
      expect(map.get("rick")).to.equal("https://youtu.be/dQw4w9WgXcQ");
    });
    it("should return undefined if the entry doesn't exist", () => {
      let map = new EnhancedMap().set("rick", "https://youtu.be/dQw4w9WgXcQ");
      expect(map.get("rik")).to.be.undefined;
    });
    it("should properly retrieve a value from an index", () => {
      let map = new EnhancedMap().set("rick", "https://youtu.be/dQw4w9WgXcQ");
      expect(map.get(0)).to.equal("https://youtu.be/dQw4w9WgXcQ");
    });
    it("should return undefined if the entry doesn't exist", () => {
      let map = new EnhancedMap().set("rick", "https://youtu.be/dQw4w9WgXcQ");
      expect(map.get(666)).to.be.undefined;
    });
  });

  describe("EnhancedMap.hasAll()", () => {
    it("should return true if all specified entries exist", () => {
      let map = new EnhancedMap()
        .set("greetings", ["hello", "hi", "goodbye"])
        .set("rick", "https://youtu.be/dQw4w9WgXcQ");
      expect(map.hasAll("greetings", "rick")).to.be.true;
    });
    it("should return false if one or more of the specified entries doesn't exist", () => {
      let map = new EnhancedMap().set("greetings", ["hello", "hi", "goodbye"]);
      expect(map.hasAll("greetings", "rick")).to.be.false;
      expect(map.hasAll("greetings", "rick", "nothing")).to.be.false;
    });
  });

  describe("EnhancedMap.hasAny()", () => {
    it("should return true if one or more of the specified entries exists", () => {
      let map = new EnhancedMap().set("greetings", ["hello", "hi", "goodbye"]);
      expect(map.hasAny("greetings", "rick", "nothing")).to.be.true;
    });
    it("should return false if none of the specified entries exist", () => {
      let map = new EnhancedMap().set("greetings", ["hello", "hi", "goodbye"]);
      expect(map.hasAny("rick", "nothing")).to.be.false;
    });
  });

  describe("EnhancedMap.remove()", () => {
    it("should remove properly the entries that match the filter", () => {
      let map = new EnhancedMap()
        .set("greetings", ["hello", "hi", "goodbye"])
        .set("one", 1)
        .set("rick", "https://youtu.be/dQw4w9WgXcQ")
        .set("array", [1, 2, 3]);

      map.remove((e) => Array.isArray(e.value));

      expect(map.hasAll("one", "rick")).to.be.true;
      expect(map.hasAny("greetings", "array")).to.be.false;
    });
  });

  describe("EnhancedMap.removeKeys()", () => {
    it("should properly remove entries with the specified keys", () => {
      let map = new EnhancedMap()
        .set("greetings", ["hello", "hi", "goodbye"])
        .set("one", 1)
        .set("rick", "https://youtu.be/dQw4w9WgXcQ")
        .set("array", [1, 2, 3]);

      map.removeKeys("greetings", "rick");

      expect(map.hasAll("one", "array")).to.be.true;
      expect(map.hasAny("greetings", "rick")).to.be.false;
    });
  });

  describe("EnhancedMap.some()", () => {
    it("should check if one of the given EnhancedMap entries matches the filter", () => {
      let map = new EnhancedMap()
        .set("greetings", ["hello", "hi", "goodbye"])
        .set("one", 1)
        .set("rick", "https://youtu.be/dQw4w9WgXcQ")
        .set("array", [1, 2, 3]);

      expect(map.some(({ key }) => key === "one")).to.be.true;
      expect(map.some(({ value }) => value === "https://youtu.be/dQw4w9WgXcQ"))
        .to.be.true;
    });
  });

  describe("EnhancedMap.every()", () => {
    it("should check if all of the EnhancedMap entries match the filter", () => {
      let map = new EnhancedMap().set("one", 1).set("two", 2).set("three", 3);

      expect(map.every(({ value }) => Number.isInteger(value))).to.be.true;
    });
  });

  describe("EnhancedMap.each()", () => {
    it("should execute a function for each entry in the map", () => {
      let map = new EnhancedMap()
        .set("greetings", ["hello", "hi", "goodbye"])
        .set("one", 1)
        .set("rick", "https://youtu.be/dQw4w9WgXcQ")
        .set("array", [1, 2, 3]);

      let keys: string[] = [];
      let values: any[] = [];

      map.each((e) => {
        keys.push(e.key);
        values.push(e.value);
      });

      expect(keys).to.deep.equal(["greetings", "one", "rick", "array"]);
      expect(values).to.deep.equal([
        ["hello", "hi", "goodbye"],
        1,
        "https://youtu.be/dQw4w9WgXcQ",
        [1, 2, 3],
      ]);
    });
  });

  describe("EnhancedMap.map()", () => {
    it("should execute a function for each item that maps the original EnhancedMap into another", () => {
      let map = new EnhancedMap<number>()
        .set("first", 1)
        .set("second", 2)
        .set("third", 3);

      let newMap = map.map(({ key, value }) => ({
        key,
        value: value + 1,
      }));

      expect(newMap).to.deep.equal(
        new Map<string, number>()
          .set("first", 2)
          .set("second", 3)
          .set("third", 4)
      );
    });
  });

  describe("EnhancedMap.reduce()", () => {
    it("should execute a function for each item that reduces the original EnhancedMap into a new value", () => {
      let map = new EnhancedMap<number>()
        .set("one", 1)
        .set("two", 2)
        .set("three", 3);

      let sum = map.reduce(0, (v, { value }) => v + value);

      expect(sum).to.equal(6);
    });
  });

  describe("EnhancedMap.findAll()", () => {
    it("should find all entries that match the specified filter", () => {
      let map = new EnhancedMap<number>()
        .set("zero point five", 0.5)
        .set("one", 1)
        .set("one point five", 1.5)
        .set("two", 2);

      let found = map.findAll(({ value }) => Number.isInteger(value));

      expect(
        found?.every(
          (e) =>
            (e.key === "one" || e.key === "two") &&
            (e.value === 1 || e.value === 2)
        )
      ).to.be.true;
    });
    it("should return null if no entry matches the specified filter", () => {
      let map = new EnhancedMap<number | string>()
        .set("one", 1)
        .set("two", 2)
        .set("three", 3);

      let found = map.findAll((e) => !Number.isInteger(e.value));

      expect(found).to.be.null;
    });
  });

  describe("EnhancedMap.find()", () => {
    it("should find an entry that matches the specified filter", () => {
      let map = new EnhancedMap<number>()
        .set("zero point five", 0.5)
        .set("one", 1)
        .set("one point five", 1.5);

      let found = map.find(({ value }) => Number.isInteger(value));

      expect(found).to.not.be.null;
      expect(found?.key).to.equal("one");
      expect(found?.value).to.equal(1);
    });
    it("should return null if no entry matches the specified filter", () => {
      let map = new EnhancedMap<number>()
        .set("one", 1)
        .set("two", 2)
        .set("three", 3);

      let found = map.find(({ value }) => !Number.isInteger(value));

      expect(found).to.be.null;
    });
  });

  describe("EnhancedMap.clone()", () => {
    it("should clone a map properly", () => {
      let original = new EnhancedMap<number>()
        .set("one", 1)
        .set("two", 2)
        .set("three", 3);

      let clone = original.clone();

      expect(clone).to.deep.equal(original);
    });
  });

  describe("EnhancedMap.concat()", () => {
    it("should concat two EnhancedMaps properly", () => {
      let map1 = new EnhancedMap<number>().set("one", 1).set("two", 2);
      let map2 = new EnhancedMap<number>().set("three", 3).set("four", 4);

      let newMap = map1.concat(map2);

      expect(newMap).to.deep.equal(
        new Map<string, number>()
          .set("one", 1)
          .set("two", 2)
          .set("three", 3)
          .set("four", 4)
      );
    });
  });

  describe("EnhancedMap.toJSON()", () => {
    it("should turn a map into JSON object", () => {
      let map = new EnhancedMap<number>()
        .set("one", 1)
        .set("two", 2)
        .set("three", 3);

      let object = map.toJSON();

      expect(object).to.deep.equal([
        { key: "one", value: 1 },
        { key: "two", value: 2 },
        { key: "three", value: 3 },
      ]);
    });
  });
});
