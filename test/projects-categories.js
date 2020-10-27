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

const sampleCategory = {
    id: "1", title: "Office", description: "" 
}

//Post a project with categories
describe('projects', () => {
    describe('POST /projects/:id/categories: post a category to a project', () => {
        it('should add a category to a project', async() => {
            return chai.request(baseUrl).post('projects/1/categories')
            .send(sampleCategory)
            .then( (res) => {
                expect(res).to.have.status(201);
            }).catch( (err) => {
                assert.fail();
            })
        })
    })
})

//GET Project categories with ID
describe('projects', () => {
    describe('GET /projects/:id/categories: get all categories related to a project', () => {
        it('should get all categories from the project id', async() => {
            return chai.request(baseUrl).get('projects/1/categories')
            .then((res) => {
                expect(res.body.categories).length.greaterThan(0);
            })
            .catch((err) => {
                assert.fail()
            })
        })
    })
})

//DELETE Project categories with Project ID and Task ID
describe('projects', () => {
    describe('DELETE /projects/:id/categories/:id: delete all categories related to a project', () => {
        it('should delete the link between the project and the task', async() => {
            return chai.request(baseUrl).delete('projects/1/categories/1')
            .then((res) => {
                expect(res).to.have.status(200)
            })
            .catch((err) => {
                assert.fail()
            })
        })
    })
})

//HEAD Project categories with ID
describe('projects', () => {
    describe('HEAD /projects/:id/categories: headers for all categories item related to project', () => {
        it('should return headers for the todo items related to the project', async() => {
            return chai.request(baseUrl).head('projects/1/categories')
            .then((res) => {
                expect(res).to.have.status(200)
            })
            .catch((err) => {
                assert.fail()
            })
        })
    })
})