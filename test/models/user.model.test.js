const mongoose = require('mongoose');
const User = require('../../models/user.model');
const expect = require('chai').expect;

describe('User model', () => {
  let testUser = { email: 'test@test.com', password: 'testPass' };

  it('should require an email', done => {
    let mockUser = { ...testUser, email: '' };
    const user = new User(mockUser);
    expect(user.validateSync()).to.not.be.undefined;
    done();
  });

  it('should require a password', done => {
    let mockUser = { ...testUser, password: '' };
    const user = new User(mockUser);
    expect(user.validateSync()).to.not.be.undefined;
    done();
  });
});