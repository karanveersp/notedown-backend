const userController = require('../../controllers/user.controller');
const httpMocks = require('node-mocks-http');
const User = require('../../models/user.model');
const expect = require('chai').expect;

function buildResponse() {
  return httpMocks.createResponse({
    eventEmitter: require('events').EventEmitter
  });
}

describe('User Controller', () => {
  it('POST /signup should create a new user with valid data', done => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        email: 'test@test.com',
        password: 'testpass'
      }
    });
    const res = buildResponse();

    res.on('end', () => {
      const data = JSON.parse(res._getData());
      expect(data.result).to.exist;
      expect(data.message).to.eql('User created');
      done();
    });

    userController.signUp(req, res);
  });

  it('POST /login should login a user with valid data and return token', done => {
    User.create({ email: 'test@test.com', password: 'testpass' }).then(
      result => {
        const req = httpMocks.createRequest({
          method: 'POST',
          body: {
            email: 'test@test.com',
            password: 'testpass'
          }
        });
        const res = buildResponse();

        res.on('end', () => {
          const data = JSON.parse(res._getData());
          expect(data.token).to.exist;
          expect(data.userId).to.equal(result._id.toString());
          done();
        });

        userController.login(req, res);
      }
    );
  });
});
