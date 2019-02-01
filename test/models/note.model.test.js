const mongoose = require('mongoose');
const Note = require('../../models/note.model');
const expect = require('chai').expect;

describe('Note model', () => {
  let testNote = {
    title: 'Some title',
    content: 'Some content',
    author: mongoose.Types.ObjectId(),
    lastModified: new Date()
  };

  it('should require a title', done => {
    let mockNote = { ...testNote, title: '' };
    const note = new Note(mockNote);
    expect(note.validateSync()).to.exist;
    done();
  });

  it('should require an author', done => {
    let mockNote = { ...testNote, author: null };
    const note = new Note(mockNote);
    expect(note.validateSync()).to.exist;
    done();
  });

  it('should allow empty content', done => {
    let mockNote = { ...testNote, content: '' };
    const note = new Note(mockNote);
    expect(note.validateSync()).to.be.undefined;
    done();
  });
});
