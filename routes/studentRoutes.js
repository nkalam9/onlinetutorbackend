const studentController = require('../controllers/studentController');
const express = require('express');

const studentRouter = express.Router();

studentRouter.post('/register', studentController.studentRegister);
studentRouter.post('/login', studentController.studentLogin);
studentRouter.get('/registrations/:id', studentController.getRegisteredSubjects);
studentRouter.get('/:id', studentController.getStudentById);
studentRouter.put('/:id', studentController.updateStudentById);
studentRouter.post('/enrollForTution', studentController.registerForTution);


module.exports = studentRouter;
