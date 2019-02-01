const notesController = require('../../controllers/notes.controller');
const httpMocks = require('node-mocks-http');
const expect = require('chai').expect;
const mongoose = require('mongoose');

const Note = require('../../models/note.model');

function buildResponse() {
  return httpMocks.createResponse({
    eventEmitter: require('events').EventEmitter
  });
}

describe('Notes Controller', function() {
  let mockNote = {
    title: 'Some title',
    content: 'Some content',
    author: mongoose.Types.ObjectId().toHexString()
  }
  let secondMockNote = {
    title: 'Anther title',
    content: 'Some more content',
    author: '5c5365a60917ab26ace21626'
  }

  it('POST /notes creates a note with valid data', done => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: mockNote
    });
    const res = buildResponse();

    res.on('end', () => {
      const data = JSON.parse(res._getData());
      expect(res._getStatusCode()).to.equal(201);
      expect(data.note.author).to.eql(mockNote.author)
      done();
    });
    
    notesController.create(req, res);
  });

  it('GET /notes retrieves all notes belonging to userId', done => {
    Note.create([mockNote, secondMockNote]).then(() => {
      const req = httpMocks.createRequest({
        method: 'GET',
        body: {
          userId: '5c5365a60917ab26ace21626'
        }
      });
      const res = buildResponse();

      res.on('end', () => {
        expect(res._getStatusCode()).to.equal(200);
        const data = JSON.parse(res._getData());
        expect(data.notes[0].author).to.equal('5c5365a60917ab26ace21626');
        done();
      });
      
      notesController.getAll(req, res);
    });
  });

  it('PUT /notes/:id updates note where id = note._id', done => {
    Note.create([mockNote, secondMockNote]).then((result) => {
      const req = httpMocks.createRequest({
        method: 'PUT',
        body: {
           ...secondMockNote, 
           title: 'This is an edited title'
        },
        params: {
          noteId: result[1]._id
        }
      });
      const res = buildResponse();

      res.on('end', () => {
        expect(res._getStatusCode()).to.equal(200);
        const data = JSON.parse(res._getData());
        expect(data.note.title).to.equal('This is an edited title');
        done();
      });
      
      notesController.update(req, res);
    });
  });

  
  it('DELETE /notes/:id deletes note where id = note._id', done => {
    Note.create(mockNote).then(result => {
      const req = httpMocks.createRequest({
        method: 'DELETE',
        params: {
          noteId: result._id
        }
      });
      const res = buildResponse();

      res.on('end', () => {
        expect(res._getStatusCode()).to.equal(200);
        const data = JSON.parse(res._getData());
        expect(data.message).to.equal('Note deleted successfully');
        expect(data.deletedCount).to.equal(1);
        done();
      });
      
      notesController.delete(req, res);
    });
  });

  
});