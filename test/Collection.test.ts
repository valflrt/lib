import { describe, it } from "mocha";
import { expect } from "chai";

import { Collection } from "../src/Collection";

describe("Collection tests", () => {
  describe("Collection.set()", () => {
    it("should set an entry properly", () => {
      let collection = new Collection();
      collection.set("rick", "https://youtu.be/dQw4w9WgXcQ");
      expect(collection.rawEntries).to.deep.equal([
        { key: "rick", value: "https://youtu.be/dQw4w9WgXcQ" },
      ]);
    });
  });

  describe("Collection.get()", () => {
    it("should get an entry properly", () => {
      let collection = new Collection();
      collection.set("rick", "https://youtu.be/dQw4w9WgXcQ");
      expect(collection.get("rick")).to.equal("https://youtu.be/dQw4w9WgXcQ");
    });
  });

  describe("Collection.has()", () => {
    it("should return true if the entry exists", () => {
      let collection = new Collection();
      collection.set("greetings", ["hello", "hi", "goodbye"]);
      expect(collection.has("greetings")).to.be.true;
    });
    it("should return false if the entry doesn't exist", () => {
      let collection = new Collection();
      expect(collection.has("greetings")).to.be.false;
    });
  });

  describe("Collection.hasAll()", () => {
    it("should return true if all specified entries exist", () => {
      let collection = new Collection();
      collection.set("greetings", ["hello", "hi", "goodbye"]);
      collection.set("rick", "https://youtu.be/dQw4w9WgXcQ");
      expect(collection.hasAll("greetings", "rick")).to.be.true;
    });
    it("should return false if one or more of the specified entries doesn't exist", () => {
      let collection = new Collection();
      collection.set("greetings", ["hello", "hi", "goodbye"]);
      expect(collection.hasAll("greetings", "rick")).to.be.false;
      expect(collection.hasAll("greetings", "rick", "nothing")).to.be.false;
    });
  });

  describe("Collection.hasAny()", () => {
    it("should return true if one or more of the specified entries exists", () => {
      let collection = new Collection();
      collection.set("greetings", ["hello", "hi", "goodbye"]);
      expect(collection.hasAny("greetings", "rick", "nothing")).to.be.true;
    });
    it("should return false if none of the specified entries exist", () => {
      let collection = new Collection();
      collection.set("greetings", ["hello", "hi", "goodbye"]);
      expect(collection.hasAny("rick", "nothing")).to.be.false;
    });
  });

  describe("Collection.remove()", () => {
    it("should remove properly the entries that match the filter", () => {
      let collection = new Collection();
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
      let collection = new Collection();
      collection.set("greetings", ["hello", "hi", "goodbye"]);
      collection.set("one", 1);
      collection.set("rick", "https://youtu.be/dQw4w9WgXcQ");
      collection.set("array", [1, 2, 3]);

      collection.removeKeys("greetings", "rick");

      expect(collection.hasAll("one", "array")).to.be.true;
      expect(collection.hasAny("greetings", "rick")).to.be.false;
    });
  });

  describe("Collection.forEach()", () => {
    it("should execute a function for each entry in the collection", () => {
      let collection = new Collection();
      collection.set("greetings", ["hello", "hi", "goodbye"]);
      collection.set("one", 1);
      collection.set("rick", "https://youtu.be/dQw4w9WgXcQ");
      collection.set("array", [1, 2, 3]);

      let keys: string[] = [];
      let values: any[] = [];

      collection.forEach((e) => {
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

  describe("Collection.map()", () => {
    it("should execute a function for each item that maps the original Collection into another", () => {
      let collection = new Collection<number>();
      collection.set("one", 1);
      collection.set("two", 2);
      collection.set("three", 3);

      let newCollection = collection.map((e) => [e.key, e.key]);

      expect(newCollection.rawEntries).to.deep.equal([
        { key: "one", value: "one" },
        { key: "two", value: "two" },
        { key: "three", value: "three" },
      ]);
    });
  });

  describe("Collection.find()", () => {
    it("should find an entry that matches the specified filter", () => {
      let collection = new Collection<number>();
      collection.set("zero point five", 0.5);
      collection.set("one", 1);
      collection.set("one point five", 1.5);

      let found = collection.find((e) => Number.isInteger(e.value));

      expect(found?.key).to.equal("one");
      expect(found?.value).to.equal(1);
    });
    it("should return null if no entry matches the specified filter", () => {
      let collection = new Collection<number>();
      collection.set("one", 1);
      collection.set("two", 2);
      collection.set("three", 3);

      let found = collection.find((e) => !Number.isInteger(e.value));

      expect(found).to.be.null;
    });
  });

  describe("Collection.findAll()", () => {
    it("should find all entries that match the specified filter", () => {
      let collection = new Collection<number>();
      collection.set("zero point five", 0.5);
      collection.set("one", 1);
      collection.set("one point five", 1.5);
      collection.set("two", 2);

      let found = collection.findAll((e) => Number.isInteger(e.value));

      expect(
        found?.every(
          (e) =>
            (e.key === "one" || e.key === "two") &&
            (e.value === 1 || e.value === 2)
        )
      ).to.be.true;
    });
    it("should return null if no entry matches the specified filter", () => {
      let collection = new Collection<number | string>();
      collection.set("one", 1);
      collection.set("two", 2);
      collection.set("three", 3);

      let found = collection.findAll((e) => !Number.isInteger(e.value));

      expect(found).to.be.null;
    });
  });

  describe("Collection.filter()", () => {
    it("should execute a function for each item that filters the original Collection and makes another", () => {
      let collection = new Collection<number>();
      collection.set("zero point five", 0.5);
      collection.set("one", 1);
      collection.set("one point five", 1.5);
      collection.set("two", 2);

      let newCollection = collection.filter((e) => Number.isInteger(e.value));

      expect(newCollection.rawEntries).to.deep.equal([
        { key: "one", value: 1 },
        { key: "two", value: 2 },
      ]);
    });
  });
});
