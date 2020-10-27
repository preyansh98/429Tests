var assert = require('assert');
var fetch = require('fetch')
let chai = require('chai');
let chaiHttp = require('chai-http');
const { expect } = require('chai');
let should = chai.should();

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
    doneStatus: "false",
    description: "strud exercitation u"
}

//POST PROJECT with a Task
describe('projects', () => {
    describe('POST /projects: post a project', () => {
        it('should post a project to the database', async() => {
            chai.request(baseUrl).post('projects/'+sampleProjectId+'/tasks')
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
            chai.request(baseUrl).get('projects/'+sampleProjectId+'/tasks')
            .then((res) => {
                expect(res)
            })
            .catch((err) => {
                assert.fail()
            })
        })
    })
})