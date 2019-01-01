'use strict';
let  database;
const MusicanModel = require("../models/musician");
//const _ = require('lodash');
//let superTest = require('supertest');
const assert = require('chai').assert;
const expect = require('chai').expect;
const describe = require('mocha').describe;
const it = require('mocha').it;
//const ip = require('ip');



// populate the musicians
function processBeatle(firstName, lastName, dob, instruments)
{
    const musician = new MusicanModel({
        firstName: firstName,
        lastName: lastName,
        dob: new Date(dob.year, dob.month, dob.day),
        instruments: instruments
    });

    return musician.save()
     .then(doc => {
       console.log(doc);
       return doc;
     })
     .catch(err => {
       console.error(err)
     })
}



describe('Seeding process: ', () => {
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

    it('populate george', function (done) {
        const dob = {year:1961, month: 12, day: 11};
        const instruments = ["Bass"];
        processBeatle("Darryl", "Jones", dob, instruments)
            .then((doc)=>{
                expect(doc).to.be.an('object');
                console.log(doc);
                done();

            })
            .catch(err => {
                console.error(err)
            });
    });
});

//populate song

//populate albums

//getJohn();

