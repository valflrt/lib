import { describe, it } from "mocha";
import { expect } from "chai";

import { EnhancedMap } from "../src/EnhancedMap";

// TODO: Replace Collection by map in comments and variables

describe("Collection tests", () => {
  describe("Collection.set()", () => {
    it("should set an entry properly", () => {
      let collection = new EnhancedMap();
      collection.set("rick", "https://youtu.be/dQw4w9WgXcQ");
      expect(collection).to.deep.equal(
        new Map<string, any>().set("rick", "https://youtu.be/dQw4w9WgXcQ")
      );
    });
  });

  describe("Collection.get()", () => {
    it("should get an entry properly", () => {
      let collection = new EnhancedMap();
      collection.set("rick", "https://youtu.be/dQw4w9WgXcQ");
      expect(collection.get("rick")).to.equal("https://youtu.be/dQw4w9WgXcQ");
    });
  });

  describe("Collection.has()", () => {
    it("should return true if the entry exists", () => {
      let collection = new EnhancedMap();
      collection.set("greetings", ["hello", "hi", "goodbye"]);
      expect(collection.has("greetings")).to.be.true;
    });
    it("should return false if the entry doesn't exist", () => {
      let collection = new EnhancedMap();
      expect(collection.has("greetings")).to.be.false;
    });
  });

  describe("Collection.hasAll()", () => {
    it("should return true if all specified entries exist", () => {
      let collection = new EnhancedMap();
      collection.set("greetings", ["hello", "hi", "goodbye"]);
      collection.set("rick", "https://youtu.be/dQw4w9WgXcQ");
      expect(collection.hasAll("greetings", "rick")).to.be.true;
    });
    it("should return false if one or more of the specified entries doesn't exist", () => {
      let collection = new EnhancedMap();
      collection.set("greetings", ["hello", "hi", "goodbye"]);
      expect(collection.hasAll("greetings", "rick")).to.be.false;
      expect(collection.hasAll("greetings", "rick", "nothing")).to.be.false;
    });
  });

  describe("Collection.hasAny()", () => {
    it("should return true if one or more of the specified entries exists", () => {
      let collection = new EnhancedMap();
      collection.set("greetings", ["hello", "hi", "goodbye"]);
      expect(collection.hasAny("greetings", "rick", "nothing")).to.be.true;
    });
    it("should return false if none of the specified entries exist", () => {
      let collection = new EnhancedMap();
      collection.set("greetings", ["hello", "hi", "goodbye"]);
      expect(collection.hasAny("rick", "nothing")).to.be.false;
    });
  });

  describe("Collection.remove()", () => {
    it("should remove properly the entries that match the filter", () => {
      let collection = new EnhancedMap();
      collection.set("greetings", ["hello", "hi", "goodbye"]);
      collection.set("one", 1);
      collection.set("rick", "https://youtu.be/dQw4w9WgXcQ");
      collection.set("array", [1, 2, 3]);

      collection.remove((e) => Array.isArray(e.value));

      expect(collection.hasAll("one", "rick")).to.be.true;
      expect(collection.hasAny("greetings", "array")).to.be.false;
    });
  });

  describe("Collection.removeKeys()", () => {
    it("should properly remove entries with the specified keys", () => {
      let collection = new EnhancedMap();
      collection.set("greetings", ["hello", "hi", "goodbye"]);
      collection.set("one", 1);
      collection.set("rick", "https://youtu.be/dQw4w9WgXcQ");
      collection.set("array", [1, 2, 3]);

      collection.removeKeys("greetings", "rick");

      expect(collection.hasAll("one", "array")).to.be.true;
      expect(collection.hasAny("greetings", "rick")).to.be.false;
    });
  });

  describe("Collection.some()", () => {
    it("should check if one of the Collection entries matches the filter", () => {
      let collection = new EnhancedMap();
      collection.set("greetings", ["hello", "hi", "goodbye"]);
      collection.set("one", 1);
      collection.set("rick", "https://youtu.be/dQw4w9WgXcQ");
      collection.set("array", [1, 2, 3]);

      expect(collection.some(({ key }) => key === "one")).to.be.true;
      expect(
        collection.some(({ value }) => value === "https://youtu.be/dQw4w9WgXcQ")
      ).to.be.true;
    });
  });

  describe("Collection.forEach()", () => {
    it("should execute a function for each entry in the collection", () => {
      let collection = new EnhancedMap();
      collection.set("greetings", ["hello", "hi", "goodbye"]);
      collection.set("one", 1);
      collection.set("rick", "https://youtu.be/dQw4w9WgXcQ");
      collection.set("array", [1, 2, 3]);

      let keys: string[] = [];
      let values: any[] = [];

      collection.forEach((value, key) => {
        keys.push(key);
        values.push(value);
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

  describe("Collection.map()", () => {
    it("should execute a function for each item that maps the original Collection into another", () => {
      let collection = new EnhancedMap<string, number>();
      collection.set("first", 1);
      collection.set("second", 2);
      collection.set("third", 3);

      let newCollection = collection.map(({ key, value }) => ({
        key,
        value: value + 1,
      }));

      expect(newCollection).to.deep.equal(
        new EnhancedMap<string, any>()
          .set("first", 2)
          .set("second", 3)
          .set("third", 4)
      );
    });
  });

  describe("Collection.find()", () => {
    it("should find an entry that matches the specified filter", () => {
      let collection = new EnhancedMap<string, number>();
      collection.set("zero point five", 0.5);
      collection.set("one", 1);
      collection.set("one point five", 1.5);

      let found = collection.find(({ value }) => Number.isInteger(value));

      expect(found).to.not.be.null;
      expect(found?.key).to.equal("one");
      expect(found?.value).to.equal(1);
    });
    it("should return null if no entry matches the specified filter", () => {
      let collection = new EnhancedMap<string, number>();
      collection.set("one", 1);
      collection.set("two", 2);
      collection.set("three", 3);

      let found = collection.find(({ value }) => !Number.isInteger(value));

      expect(found).to.be.null;
    });
  });

  describe("Collection.findAll()", () => {
    it("should find all entries that match the specified filter", () => {
      let collection = new EnhancedMap<string, number>();
      collection.set("zero point five", 0.5);
      collection.set("one", 1);
      collection.set("one point five", 1.5);
      collection.set("two", 2);

      let found = collection.findAll(({ value }) => Number.isInteger(value));

      expect(
        found?.every(
          (e) =>
            (e.key === "one" || e.key === "two") &&
            (e.value === 1 || e.value === 2)
        )
      ).to.be.true;
    });
    it("should return null if no entry matches the specified filter", () => {
      let collection = new EnhancedMap<number | string>();
      collection.set("one", 1);
      collection.set("two", 2);
      collection.set("three", 3);

      let found = collection.findAll((e) => !Number.isInteger(e.value));

      expect(found).to.be.null;
    });
  });

  describe("Collection.filter()", () => {
    it("should execute a function for each item that filters the original Collection and makes another", () => {
      let collection = new EnhancedMap<string, number>();
      collection.set("zero point five", 0.5);
      collection.set("one", 1);
      collection.set("one point five", 1.5);
      collection.set("two", 2);

      let newCollection = collection.filter((v) => Number.isInteger(v));

      expect(newCollection).to.deep.equal(
        new Map<string, number>().set("one", 1).set("two", 2)
      );
    });
  });

  describe("Collection.concat()", () => {
    it("should concat two EnhancedMaps properly", () => {
      let collection1 = new EnhancedMap<string, number>()
        .set("one", 1)
        .set("two", 2);
      let collection2 = new EnhancedMap<string, number>()
        .set("three", 3)
        .set("four", 4);

      let newCollection = collection1.concat(collection2);

      expect(newCollection).to.deep.equal(
        new Map<string, number>()
          .set("one", 1)
          .set("two", 2)
          .set("three", 3)
          .set("four", 4)
      );
    });
  });
});
