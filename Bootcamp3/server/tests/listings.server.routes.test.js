const should = require('should');
const request = require('supertest');
const express = require('../config/express');
const Listing = require('../models/listings.server.model.js');

/* Global variables */
let app;
let agent;
let listing;
let id;
let listing2;
let id2;

/* Unit tests for testing server side routes for the listings API */
describe('Listings CRUD tests', function () {
  this.timeout(10000);

  before((done) => {
    app = express.init();
    agent = request.agent(app);

    done();
  });

  it('should it able to retrieve all listings', (done) => {
    agent.get('/api/listings').expect(200).end((err, res) => {
      should.not.exist(err);
      should.exist(res);
      res.body.should.have.length(147);
      done();
    });
  });
  it('should be able to retrieve a single listing', (done) => {
    Listing.findOne({ name: 'Library West' }, (err, listing) => {
      if (err) {
        console.log(err);
      } else {
        agent.get(`/api/listings/${listing._id}`).expect(200).end((err, res) => {
          should.not.exist(err);
          should.exist(res);
          res.body.name.should.equal('Library West');
          res.body.code.should.equal('LBW');
          res.body.address.should.equal('1545 W University Ave, Gainesville, FL 32603, United States');
          res.body._id.should.equal(listing._id.toString());
          done();
        });
      }
    });
  });

  it('should be able to save a listing', (done) => {
    const listing = {
      code: 'CEN3035',
      name: 'Introduction to Software Engineering',
      address: '432 Newell Dr, Gainesville, FL 32611',
    };
    agent.post('/api/listings').send(listing).expect(200).end((err, res) => {
      should.not.exist(err);
      should.exist(res.body._id);
      res.body.name.should.equal('Introduction to Software Engineering');
      res.body.code.should.equal('CEN3035');
      res.body.address.should.equal('432 Newell Dr, Gainesville, FL 32611');
      id = res.body._id;
      done();
    });
  });

  it('should be able to update a listing', (done) => {
    const updatedListing = {
      code: 'CEN3031',
      name: 'Introduction to Software Engineering',
      address: '432 Newell Dr, Gainesville, FL 32611',
    };

    agent.put(`/api/listings/${id}`).send(updatedListing).expect(200).end((err, res) => {
      should.not.exist(err);
      should.exist(res.body._id);
      res.body.name.should.equal('Introduction to Software Engineering');
      res.body.code.should.equal('CEN3031');
      res.body.address.should.equal('432 Newell Dr, Gainesville, FL 32611');
      done();
    });
  });

  it('should be able to delete a listing', (done) => {
    agent.delete(`/api/listings/${id}`).expect(200).end((err, res) => {
      should.not.exist(err);
      should.exist(res);

      agent.get(`/api/listings/${id}`).expect(400).end((err, res) => {
        id = undefined;
        done();
      });
    });
  });

  /* If this test fails because you haven't completed the  coordinates.server.controlelr.js file
  use the filter feature in MongoDB Atlas to find and delete the entry
  {'code' : 'GMC'}
  This should resolve the issue. Although the test has failed our create function still
  sends the listing to the database.

  You can comment the two coordinate tests until you have completed the code the
  coordinates.server.controlelr.js file
*/
  it('should be able to save a listing with coordinates', (done) => {
    const listing2 = {
      code: 'GMC',
      name: 'Dr. Gardner-McCunes Office',
      address: '432 Newell Dr, Gainesville, FL 32611',
    };
    agent.post('/api/listings').send(listing2).expect(200).end((err, res) => {
      should.not.exist(err);
      should.exist(res.body._id);
      res.body.name.should.equal('Dr. Gardner-McCunes Office');
      res.body.code.should.equal('GMC');
      res.body.address.should.equal('432 Newell Dr, Gainesville, FL 32611');
      res.body.coordinates.latitude.should.equal(28.75054);
      res.body.coordinates.longitude.should.equal(-82.5001);
      id2 = res.body._id;
      done();
    });
  });

  it('should be able to delete the listing with coordinates', (done) => {
    agent.delete(`/api/listings/${id2}`).expect(200).end((err, res) => {
      should.not.exist(err);
      should.exist(res);
      agent.get(`/api/listings/${id2}`).expect(400).end((err, res) => {
        id = undefined;
        done();
      });
    });
  });

  after((done) => {
    if (id) {
      Listing.deleteOne({ _id: id }, (err) => {
        if (err) throw err;
        next();
      });
    }
    if (id2) {
      Listing.deleteOne({ _id: id2 }, (err) => {
        if (err) throw err;
        done();
      });
    } else done();
  });
});
