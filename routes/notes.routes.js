const notesController = require('../controllers/notes.controller');
const express = require('express');
const router = express.Router();

router.get('/', notesController.getAll);
// router.get('/:id', notesController.getById);
router.post('/', notesController.create);
router.put('/:noteId', notesController.update);
router.delete('/:noteId', notesController.delete);

module.exports = router;