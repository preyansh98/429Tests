var assert = require('assert');
var fetch = require('fetch')
let chai = require('chai');
let chaiHttp = require('chai-http');
const { expect } = require('chai');
let should = chai.should();
const { spawn } = require("child_process");
const delay = ms => new Promise(res => setTimeout(res, ms));

chai.use(chaiHttp);

