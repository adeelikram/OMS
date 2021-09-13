const express = require('express');
const {
    getContractors,
    getCreateContractor,
    postCreateContractor,
} = require('../controllers/ContractorsController');

const router = express.Router();
const { secured } = require('../middlewares/secured');

router.get('/contractors', secured, getContractors);
router.get('/get-create-contractor', secured, getCreateContractor);

router.post('/post-create-contractor', secured, postCreateContractor);

module.exports = router;
