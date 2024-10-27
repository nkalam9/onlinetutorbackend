const tutorController = require('../controllers/tutorController');
const express = require('express');

const router = express.Router();

router.post('/register', tutorController.tutorRegister);
router.post('/login', tutorController.tutorLogin);
router.get('/:id', tutorController.getTutorById);
router.put('/:id', tutorController.updateTutorById);
router.put('/addSlots/:tutorId', tutorController.addTutionSlot);
router.get('/getTutorByLocation/:city/:state/:country', tutorController.findTutorByLocation)
router.get('/getPendingApprovals/:id', tutorController.getPendingApprovals)

module.exports = router;
