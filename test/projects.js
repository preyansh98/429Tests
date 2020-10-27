var assert = require('assert');
var fetch = require('fetch')
let chai = require('chai');
let chaiHttp = require('chai-http');
const { expect } = require('chai');
let should = chai.should();

chai.use(chaiHttp);

let baseUrl = "http://localhost:4567/"

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

//POST PROJECT
describe('projects', () => {
    describe('POST /projects: post a project', () => {
        it('should post a project to the database', async() => {
            chai.request(baseUrl).post('projects')
            .send(sampleProject)
            .then((res) => {
                let responseBody = res.body;
                expect(responseBody.id).to.exist;
                
            }).catch( (err) => {
                assert.fail()
            })
        })
    })
})

//GET ALL PROJECTS
describe('projects', () => {
    describe('GET /projects: get all projects', () => {
        it('should return a list of all the projects', async() => {
            chai.request(baseUrl).get("projects")
            .then((res) => {
                let projects = res.body;
                
            }).catch( (err) => {
                assert.fail()
            })
        })
    })
})

//GET PROJECT BY ID
describe('projects', () => {
    describe('GET /projects/:id : get project by id', () => {
        it('should get the project by an id', async() => {
            //ID 1 will always exist by before clause.
            chai.request(baseUrl).get('projects/1')
            .then((res) => {
                expect(res).to.have.status(200);
                
            }).catch( (err) => {
                assert.fail()
            })
        })
    })
})

//HEAD for PROJECT
describe('projects', () => {
    describe('HEAD /projects : headers for project', () => {
        it('should return all headers for projects', async () => {
            chai.request(baseUrl).head('projects')
            .then((res) => {
                expect(res).to.have.status(200);
                
            }).catch( (err) => {
                assert.fail()
            })
        })
    })
})

//DELETE PROJECT.
describe('projects', () => {
    describe('GET /projects/:id : delete project by id', () => {
        it('should delete the project by an id', async() => {
            //ID 1 will always exist by before clause.
            await chai.request(baseUrl).delete('projects/1')
            .then((res) => {
                expect(res).to.have.status(200);
                
            }).catch( (err) => {
                assert.fail()
            })
        })
    })
})

//PUT Project by ID
describe('projects', () => {
    describe('PUT /projects/:id : amend a specific project by id', () => {
        it('should amend the project by an id with fields provided', async() => {
            chai.request(baseUrl).put('projects/1')
            .send({title : "new title"})
            .then((res) => {
                //check if title changed.
                expect(res.body.title).to.equal("new title");
            }).catch( (err) => {
                assert.fail()
            })
        })
    })
})