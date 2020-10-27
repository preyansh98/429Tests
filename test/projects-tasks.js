var assert = require('assert');
var fetch = require('fetch')
let chai = require('chai');
let chaiHttp = require('chai-http');
const { expect } = require('chai');
let should = chai.should();
const { spawn } = require("child_process");
const delay = ms => new Promise(res => setTimeout(res, ms));

chai.use(chaiHttp);

let baseUrl = "http://localhost:4567/"
let sampleProjectId = 1;

const sampleProject = {
    title: "Project Title",
    completed: true,
    active: true,
    description: "Project Description"
}

const sampleTodo = {
    title: "boris nisi ut aliqui",
    doneStatus: false,
    description: "strud exercitation u"
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

//POST PROJECT with a Task
describe('projects', () => {
    describe('POST /projects: post a project', () => {
        it('should post a project to the database', async() => {
            return chai.request(baseUrl).post('projects/1/tasks')
            .send(sampleTodo)
            .then( (res) => {
                expect(res).to.have.status(201);
            }).catch( (err) => {
                assert.fail();
            })
        })
    })
})

//GET Project Tasks with ID
describe('projects', () => {
    describe('GET /projects/:id/tasks: get all tasks related to a project', () => {
        it('should get all tasks from the project id', async() => {
            return chai.request(baseUrl).get('projects/1/tasks')
            .then((res) => {
                expect(res.body.todos).to.exist;
            })
            .catch((err) => {
                assert.fail()
            })
        })
    })
})

//DELETE Project Tasks with Project ID and Task ID
describe('projects', () => {
    describe('DELETE /projects/:id/tasks/:id: delete all tasks related to a project', () => {
        it('should delete the link between the project and the task', async() => {
            return chai.request(baseUrl).delete('projects/1/tasks/1')
            .then((res) => {
                expect(res).to.have.status(200)
            })
            .catch((err) => {
                assert.fail()
            })
        })
    })
})

//HEAD Project Tasks with ID
describe('projects', () => {
    describe('HEAD /projects/:id/tasks: headers for all tasks item related to project', () => {
        it('should return headers for the todo items related to the project', async() => {
            return chai.request(baseUrl).head('projects/1/tasks')
            .then((res) => {
                expect(res).to.have.status(200)
            })
            .catch((err) => {
                assert.fail()
            })
        })
    })
})