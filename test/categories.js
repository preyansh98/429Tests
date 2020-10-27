let chai = require("chai");
let chaiHttp = require("chai-http");
const { assert, expect } = require("chai");
const { spawn } = require("child_process");
chai.use(chaiHttp);


let baseUrl = "http://localhost:4567/";

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
                let category = res.body.categories;
                assert.equal(category.length, 2);
            }).catch(err =>{
                console.log(err);
                assert.fail();
            });
        })

    });

    describe("create a category without a title", () => {
        it("should return a categories", async () => {
            return chai.request(baseUrl)
                .post("categories")
                .then((res) => {
                    expect(res).to.have.status(400);
                    assert.exists(res.body.errorMessages);
                }).catch(err =>{
                    console.log(JSON.stringify(err));
                    assert.fail();
            });
        })
    });

    let createdID = -1;
    let title ="give me marks"
    describe("create a category with a title", () => {
        it("should return a categories", async () => {
            return chai.request(baseUrl)
                .post("categories")
                .send({title})
                .then((res) => {
                    expect(res).to.have.status(201);
                    assert.equal(res.body.title, title);
                    assert.exists(res.body.id);
                    createdID = res.body.id;
                }).catch(err =>{
                    console.log(JSON.stringify(err));
                    assert.fail();
            });
        })
    });

    describe("check if there is a category", () => {
        it("should return an ok status", () => {
            return chai.request(baseUrl)
                .head("categories")
                .then((res) => {
                    expect(res).to.have.status(200);
                }).catch(err =>{
                    console.log(JSON.stringify(err));
                    assert.fail();
            });
        })
    });

    describe("checks a category using an id", () => {
        it("should return a ok status code", async () => {
            return chai.request(baseUrl)
                .head("categories/" + createdID)
                .then((res) => {
                    expect(res).to.have.status(200);
                }).catch(err =>{
                    console.log(JSON.stringify(err));
                    assert.fail();
            });
        })
    });


    describe("get a specific category", () => {
        it("should return a category", async () => {
            return chai.request(baseUrl)
                .get("categories/" + createdID)
                .then((res) => {
                    expect(res).to.have.status(200);
                    assert.equal(res.body.categories[0].title, title);
                    assert.equal(res.body.categories[0].id, createdID);
                }).catch(err =>{
                    console.log(JSON.stringify(err));
                    assert.fail();
            });
        })
    });

    let newTitle = "give me even more marks!"
    describe("amend a specific category", () => {
        it("should change the title of category", async () => {
            return chai.request(baseUrl)
                .post("categories/" + createdID)
                .send({title: newTitle})
                .then((res) => {
                    expect(res).to.have.status(200);
                    assert.equal(res.body.title, newTitle);
                    assert.equal(res.body.id, createdID);

                }).catch(err =>{
                    console.log(JSON.stringify(err));
                    assert.fail();
            });
        })
    });

    describe("amend a specific category", () => {
        it("should change the description of a category", async () => {
            return chai.request(baseUrl)
                .put("categories/" + createdID)
                .send({description: title})
                .then((res) => {
                    expect(res).to.have.status(200);
                    assert.equal(res.body.title, newTitle);
                    assert.equal(res.body.id, createdID);
                    assert.equal(res.body.description, title)
                }).catch(err =>{
                    console.log("I think this is a bug");
                    assert.fail();
            });
        })
    });


    describe("delete a category", () => {
        it("should delete a category", async () => {
            return chai.request(baseUrl)
                .delete("categories/" + createdID)
                .then((res) => {
                    expect(res).to.have.status(200);
                    assert.equal(res.body, '');
                }).catch(err =>{
                    console.log(JSON.stringify(err));
                    assert.fail();
            });
        })
    });

    describe("get a non existing category", () => {
        it("should return a category", async () => {
            return chai.request(baseUrl)
                .get("categories/" + createdID)
                .then((res) => {
                    expect(res).to.have.status(404);
                    assert.exists(res.body.errorMessages);
                }).catch(err =>{
                    console.log(JSON.stringify(err));
                    assert.fail();
            });
        })
    });

    let description = "this describes me";
    let newId = -1;
    describe("create a category with a title and a description", () => {
        it("should return a categories", async () => {
            return chai.request(baseUrl)
                .post("categories")
                .send({title, description})
                .then((res) => {
                    expect(res).to.have.status(201);
                    assert.equal(res.body.title, title);
                    assert.equal(res.body.description, description);
                    assert.exists(res.body.id);
                    newId = res.body.id;
                }).catch(err =>{
                    console.log(JSON.stringify(err));
                    assert.fail();
            });
        })
    });

    describe("should create a project for a category", () => {
        it("should return a project", () => {
            return chai.request(baseUrl)
            .post("/categories/" + newId + "/projects")
            .send({title, description})
            .then((res) => {
                expect(res).to.have.status(201);
                assert.equal(res.body.title, title);
                assert.equal(res.body.description, description);
                assert.exists(res.body.id);
                newId = res.body.id;
            }).catch(err =>{
                console.log(JSON.stringify(err));
                assert.fail();
        });
        })
    })

    
  });
