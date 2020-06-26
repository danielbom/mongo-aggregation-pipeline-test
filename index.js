// @ts-check

const { expect } = require("chai");
const models = require("./models");
const factory = require("./factory");
const methods = require("./methods");
const mongoose = require("mongoose");

const { pipeline, op } = require("../mongo-pipeline");
// const { pipeline, op } = require("mongo-pipeline");

async function generateFakeData() {
  const DB = "test";
  const URI = `mongodb://localhost:27017/${DB}`;
  const OPTS = { useNewUrlParser: true, useUnifiedTopology: true };
  await mongoose.connect(URI, OPTS);
  await mongoose.connection.dropDatabase();
  mongoose.connection.on("exit", () => mongoose.connection.close());

  for (let i = 0; i < 10; i++) {
    await factory.create("People");
  }
  for (let i = 0; i < 10; i++) {
    await factory.create("Contact");
  }
}

describe("Basic test with one model", () => {
  before(generateFakeData);

  describe("One", () => {
    it("user", async () => {
      const user = await pipeline()
        .sort({ createdAt: -1 })
        .aggregateOneWith(models.User);

      expect(user).to.not.be.undefined;
      expect(user).to.have.property("username");
    });
    it("contact", async () => {
      const contact = await pipeline()
        .sort({ createdAt: -1 })
        .aggregateOneWith(models.Contact);

      expect(contact).to.not.be.undefined;
      expect(contact).to.have.keys("__v", "_id", "phone", "email", "user_id");
    });
  });

  describe("Multi", () => {
    it("users", async () => {
      const users = await pipeline().match({}).aggregateWith(models.User);

      expect(users).to.has.length(10);
    });
    it("contacts", async () => {
      const contacts = await pipeline().match({}).aggregateWith(models.Contact);

      expect(contacts).to.has.length(10);
      for (const contact of contacts) {
        expect(contact).to.have.keys("__v", "_id", "phone", "email", "user_id");
      }
    });
  });

  describe("Relation One", () => {
    it("users + people", async () => {
      const users = await pipeline()
        .lookupAndUnwind("peoples", "_id", "user_id", "people")
        .aggregateWith(models.User);

      expect(users).to.has.length(10);
      for (const user of users) {
        expect(user).to.have.any.keys("people");
        expect(user.people).to.be.a("object").and.to.have.any.keys("_id");
      }
    });
  });

  describe("Relation Many", () => {
    it("users + contacts", async () => {
      const users = await pipeline()
        .lookup("contacts", "_id", "user_id", "contacts")
        .aggregateWith(models.User);

      expect(users).to.has.length(10);
      for (const user of users) {
        expect(user).to.have.any.keys("contacts");
        expect(user.contacts).to.be.an("array");
        for (const contact of user.contacts) {
          expect(contact).to.have.any.keys("_id");
        }
      }
    });
  });
});

describe("General testes", () => {
  describe("Each method should works", () => {
    methods.forEach((method) => {
      it(`Method '${method.name}'`, () => {
        const result = op[method.name](...method.args);
        expect(result).to.be.eql(method.expect);
      });
    });
  });
});
