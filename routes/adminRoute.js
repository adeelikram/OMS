// require express router
const router = require('express').Router();
// require admin controller
const { adminController } = require('../controllers/adminController');
const { fortnoxProdController } = require('../controllers/fortnox-prod-controller');

router.get("/admin", adminController);
router.get("/fortnox-prods", fortnoxProdController)
module.exports = router;
