'use strict';
let  database;
const Musician = require('../models/musician');;
//let superTest = require('supertest');
const assert = require('chai').assert;
const expect = require('chai').expect;
const describe = require('mocha').describe;
const it = require('mocha').it;

describe('Query Helper : ', () => {
    before(() => {
        database = require("../database/database");
    });

    after(() => {
        database.close();
    });

    it('Connect to DB', function (done) {
        expect(database).to.be.an('object');
        done();

    });

    it('QueryMusicians', function (done) {
        Musician.find({})
            .then(doc => {
                console.log(doc)
                expect(doc).to.be.an('array');
                done();

            })
            .catch(err => {
                console.error(err)
                done(err)
            })
    });
});



