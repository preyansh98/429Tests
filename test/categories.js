let chai = require("chai");
let chaiHttp = require("chai-http");
const { assert, expect } = require("chai");
chai.use(chaiHttp);

const { spawn } = require("child_process");

let baseUrl = "http://localhost:4567/";

let defaultCategories = {
  categories: [
    { id: "2", title: "Home", description: "" },
    { id: "1", title: "Office", description: "" },
  ],
};

let validId = 1;
let validId2 = 2;
let invalidId = 3;
const delay = ms => new Promise(res => setTimeout(res, ms));

before(function() {
    this.timeout(10000);
    const server = spawn('java', ["-jar", "./test/runTodoManagerRestAPI-1.5.5.jar"]);
    return delay(2000);
});

after(async () => {

    return new Promise((resolve, reject) => {
        chai.request(baseUrl)
            .get("shutdown")
            .end(() =>resolve())
    })
})

describe("categories", () => {

  describe("get all categories", () => {
    it("should return a list of all the categories", async () => {
        return chai.request(baseUrl)
            .get("categories")
            .then((res) => {
                expect(res).to.have.status(200);
                assert(res.body[0].id, 1);
            }).catch(err =>{
                console.log(err);
                assert.fail();
            });
        })

    });
  });
//   describe("get a specific category", () => {
//     it("should return a specific category", async () => {
//         chai.request(baseUrl)
//         .get("categories")
//         .end((err, res) => {
//           assert.include(res.body, defaultCategories[0]);
//           assert.include(res.body, defaultCategories[1]);
//         });
//     });
//   })
