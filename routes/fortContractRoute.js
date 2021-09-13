// require express
const express = require('express');
// require fortContractRoute
const router = express.Router();
// require fortContractController
const { fortnoxContractController, fortnoxPostContractController } = require('../controllers/fortContractController');
router.get('/fortnox-contracts', fortnoxContractController);
router.post('/fortnox-contracts', fortnoxPostContractController);
module.exports = router;