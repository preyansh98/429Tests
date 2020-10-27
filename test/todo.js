var assert = require('assert');
var fetch = require('fetch')
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const { expect } = require('chai');

chai.use(chaiHttp);

let baseUrl = "http://localhost:4567/"
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
    title: "boris nisi ut aliqui",
    doneStatus: false,
    description: "strud exercitation u"
  }

  const validSimpleTodo = {
    title: "boris nisi ut aliqui"
  }

  const invalidTitleTodo = {
    title: ""
  }

  const expectedError = "Invalid Creation: Failed Validation: Not allowed to create with id";


describe('todo', () => {
    describe('GET /todo all todos', () => {
        it('should return a list of all the todos', async() => {
            chai.request(baseUrl).get("todos")
            .then((res) => {
                expect(res.body.todos.includes(DEFAULT_TODO.todos[0]));
                expect(res.body.todos.includes(DEFAULT_TODO.todos[1]));
            }).catch((err) => {
                assert.fail();
            })
        })
    });
    describe('HEAD /todo', () => {
        it('should confirm existance of endpoint', async() => {
            chai.request(baseUrl).head("todos")
            .then((res) => {
                expect(res).to.have.status(200);
            }).catch((err) => {
                assert.fail();
            })
            
        })
    });
    describe('POST /todo', () => {
        it('should create a new todo with only a title', async() => {
            chai.request(baseUrl).post("todos")
            .send(validSimpleTodo)
            .then((res) => {
                let reponseBody = res.body;
                expect(reponseBody.id).to.exist;
            }).catch((err) => {
                assert.fail();
            })
        });
        it('should create a new todo with more than the minimal info (status and description)', async() => {
            chai.request(baseUrl).post("todos")
            .send(validTodo)
            .then((res) => {
                let reponseBody = res.body;
                expect(reponseBody.id).to.exist;
            }).catch((err) => {
                assert.fail();
            })
        });
        it('shouldnt create todo with an invalid title', async() => {
            chai.request(baseUrl).post("todos")
            .send(invalidTitleTodo)
            .then((res) => {
                expect(res).to.have.status(400);
            }).catch((err) => {
                assert.fail();
            })
        });
    })
})