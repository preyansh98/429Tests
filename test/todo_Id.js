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

const validTodo = {
    title: "ammended title",
    doneStatus: false,
    description: "ammended description"
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

describe('todo', () => {
    describe('GET /todo:id', () => {
        it('should return a specific todo based on given id', async() => {
            return chai.request(baseUrl).get("todos/1")
            .then((res) => {
                expect(res.body.todos.includes(DEFAULT_TODO.todos[1]));
            }).catch((err) => {
                console.log(err);
                assert.fail();
            })
        })
    });
    describe('HEAD /todo:id', () => {
        it('should confirm endpoint exists', async() => {
            return chai.request(baseUrl).head("todos/1")
            .then((res) => {
                expect(res).to.have.status(200);
            }).catch((err) => {
                assert.fail();
            })
        })
    });
    describe('POST /todo:id', () => {
        it('should amend instances of todo with specific ID using post', async() => {
            return chai.request(baseUrl).post("todos/1")
            .send(validTodo)
            .then((res) => {
                expect(res).to.have.status(200);
            }).catch((err) => {
                assert.fail();
            })
        }) 
    });
    describe('PUT /todo:id', () => {
        it('should amend instances of todo with specific ID using put', async() => {
            return chai.request(baseUrl).put("todos/2")
            .send(validTodo)
            .then((res) => {
                expect(res).to.have.status(200);
            }).catch((err) => {
                assert.fail();
            })
        })
    });
    describe('DELETE /todo:id', () => {
        it('deletes a specific todo instance identified by its id', async() => {
            return chai.request(baseUrl).delete("todos/2")
            .then((res) => {
                expect(res).to.have.status(200);
            }).catch((err) => {
                assert.fail();
            })
        });
        it('should not delete a non existing todo instance', async() => {
            return chai.request(baseUrl).delete("todos/-1")
            .then((res) => {
                expect(res).to.have.status(404);
            }).catch((err) => {
                console.log(err);
                assert.fail();
            })
        });
    });
})