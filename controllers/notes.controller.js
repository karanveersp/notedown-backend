const Note = require('../models/note.model');

const notesController = {
  /**
   * Find all notes by user's id
   */
  getAll(req, res) {
    const userId = req.userId;
    console.log('UserId:', userId);
    Note.find({ author: userId })
      .then(notes => {
        res.status(200).json({ message: 'Fetched all notes', notes: notes });
      })
      .catch(err => {
        res.status(404).json({ error: err });
      });
  },

  create(req, res) {
    const noteData = {
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    };
    const note = new Note(noteData);
    note
      .save()
      .then(result => {
        res.status(201).json({
          message: 'Note Created',
          noteId: result._id
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  },

  update(req, res) {
    const note = {
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    };
    const noteId = req.params.noteId;
    Note.findOneAndUpdate({ _id: noteId }, note, { new: true })
      .then(result => {
        res
          .status(200)
          .json({ message: 'Note updated' });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: 'Update error'
        });
      });
  },

  delete(req, res) {
    const id = req.params.noteId;
    Note.deleteOne({ _id: id })
      .then(result => {
        res.json({ message: 'Note deleted successfully', deletedCount: result.deletedCount });
      })
      .catch(err => {
        res.status(500).json({
          message: 'Error deleting'
        });
      });
  }
};

module.exports = notesController;
