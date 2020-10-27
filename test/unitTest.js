var assert = require('assert');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

let baseUrl = "http://localhost:4567/"

// describe('todos', () => {
//     describe('get all todos', () => {
//         it('should return a list of all the todos', async ()=>{
//             assert.equal(1,1);
//         })
//     })
// })

// describe('projects', () => {
//     describe('get all projects', () => {
//         it('should return a list of all the projects', async() => {
//             chai.request(baseUrl).get("/projects")
//             .end((err,res) => {
//                 let projects = res.body;
//             });
//             assert.equal(1, 1);
//         })
//     })
// })