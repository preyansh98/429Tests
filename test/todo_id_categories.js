var assert = require('assert');
var fetch = require('fetch')
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const { expect } = require('chai');
const { spawn } = require("child_process");

chai.use(chaiHttp);

let baseUrl = "http://localhost:4567/"

const delay = ms => new Promise(res => setTimeout(res, ms));

const DEFAULT_TODO = {
    "todos": [
        {
            "id": "1",
            "title": "scan paperwork",
            "doneStatus": "false",
            "description": "",
            "tasksof": [
                {
                    "id": "1"
                }
            ],
            "categories": [
                {
                    "id": "1"
                }
            ]
        },
        {
            "id": "2",
            "title": "file paperwork",
            "doneStatus": "false",
            "description": "",
            "tasksof": [
                {
                    "id": "1"
                }
            ]
        }
    ]
};

const existingCategory = {
    id:"1"
}

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

describe('todo/:id/categories', () => {
    describe('POST /todo:id/categories', () => {
        it('should create link between category and todo instance', async() => {
            return chai.request(baseUrl).post("todos/2/categories")
            .send(existingCategory)
            .then((res) => {
                //status confirms creation of link
                expect(res).to.have.status(201);
            }).catch((err) => {
                console.log(err);
                assert.fail();
            })
        })
    });

    describe("GET todos/:id/categories", () => {
        it("should return a category items related to todo given id", async () => {
            return chai.request(baseUrl)
                .get("todos/1/categories")
                .then((res) => {
                    expect(res).to.have.status(200);
                    assert(res.body.categories[0].id, 1);
                }).catch(err =>{
                    console.log(err);
                    assert.fail();
                });
            });
        it("should confirm recently created link between category and todo from previous post", async () => {
            return chai.request(baseUrl)
                .get("todos/2/categories")
                .then((res) => {
                    expect(res).to.have.status(200);
                    assert(res.body.categories[0].id, 1);
                }).catch(err =>{
                    console.log(err);
                    assert.fail();
                });
            });
    
        });
    describe('HEAD /todo:id/categories', () => {
        it('should confirm endpoint exists', async() => {
            return chai.request(baseUrl).head("todos/1/categories")
            .then((res) => {
                expect(res).to.have.status(200);
            }).catch((err) => {
                assert.fail();
            })
        })
    });
});

describe('todo/:id/categories', () => {
    describe('DELETE /todo:id/categories/:id', () => {
        it('should delete a specific link between category of specified id and todo of specified id', async() => {
            return chai.request(baseUrl).delete("todos/2/categories/1")
            .then((res) => {
                expect(res).to.have.status(200);
            }).catch((err) => {
                console.log(err);
                assert.fail();
            })
        });
    })
});


    