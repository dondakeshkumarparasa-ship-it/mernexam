const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// Client endpoints
router.get('/questions/next', apiController.getNextQuestion);
router.post('/questions/submit', apiController.submitAnswer);
router.post('/bookmarks/toggle', apiController.toggleBookmark);
router.get('/notifications', apiController.getNotifications);

// Admin endpoints
router.post('/notifications/add', apiController.addNotification);
router.delete('/notifications/delete/:id', apiController.deleteNotification);
router.get('/admin/stats', apiController.getAdminStats);
router.get('/admin/users', apiController.getUsers);
router.post('/admin/users/suspend/:id', apiController.toggleUserSuspension);
router.post('/questions/bulk-upload', apiController.bulkUploadQuestions);

module.exports = router;
