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

//GET ALL PROJECTS
describe('projects', () => {
    describe('GET /projects: get all projects', () => {
        it('should return a list of all the projects', async() => {
            return chai.request(baseUrl).get("projects")
            .set('Accept','application/xml')
            .then((res) => {
                console.log(res.body);
            }).catch( (err) => {
                console.log(err);
                assert.fail()
            })
        })
    })
})