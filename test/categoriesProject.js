let chai = require("chai");
let chaiHttp = require("chai-http");
const { assert, expect } = require("chai");
const { spawn } = require("child_process");
chai.use(chaiHttp);

let baseUrl = "http://localhost:4567/";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

before(function () {
  this.timeout(10000);
  const server = spawn("java", [
    "-jar",
    "./test/runTodoManagerRestAPI-1.5.5.jar",
  ]);
  return delay(2000);
});

after(async () => {
  return new Promise((resolve, reject) => {
    chai
      .request(baseUrl)
      .get("shutdown")
      .end(() => resolve());
  });
});

describe("categories-project", () => {
  let newId = -1;
  let title = "Hello World";
  let description = "Say my name!";
  describe("create a category with a title and a description", () => {
    it("should return a categories", async () => {
      return chai
        .request(baseUrl)
        .post("categories")
        .send({ title, description })
        .then((res) => {
          expect(res).to.have.status(201);
          assert.equal(res.body.title, title);
          assert.equal(res.body.description, description);
          assert.exists(res.body.id);
          newId = res.body.id;
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          assert.fail();
        });
    });
  });

  let projectName = "Name me";
  let projectId = -1;
  describe("create a project for a category", () => {
    it("should return a project", () => {
      return chai
        .request(baseUrl)
        .post("categories/" + newId + "/projects")
        .send({ name: projectName, description })
        .then((res) => {
          expect(res).to.have.status(201);
          assert.equal(res.body.name, projectName);
          assert.equal(res.body.description, description);
          assert.exists(res.body.id);
          projectId = res.body.id;
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          assert.fail();
        });
    });
  });

  describe("get the projects of a category", () => {
    it("should return a list of projects", () => {
      return chai
        .request(baseUrl)
        .get("categories/" + newId + "/projects")
        .then((res) => {
          expect(res).to.have.status(200);
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          assert.fail();
        });
    });
  });

  describe("check for projects of a category", () => {
    it("should a status ok", () => {
      return chai
        .request(baseUrl)
        .head("categories/" + newId + "/projects")
        .then((res) => {
          expect(res).to.have.status(200);
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          assert.fail();
        });
    });
  });
});
