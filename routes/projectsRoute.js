const express = require('express');

const router = express.Router();
const { secured } = require('../middlewares/secured');
const {
    getOngoingProjects,
    editOngoingProject,
} = require('../controllers/ProjectsController');

router.get('/ongoing-projects', secured, getOngoingProjects);
router.get('/get-ongoing-project/:orderId', secured, editOngoingProject);

module.exports = router;
