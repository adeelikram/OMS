// require express router
const router = require('express').Router();
// require admin controller
const { adminController } = require('../controllers/adminFortnoxController');
const { fortnoxProdController, fortnoxProdPostController } = require('../controllers/fortnox-prod-controller');

router.get("/admin", adminController);
router.get("/fortnox-prods", fortnoxProdController)
router.post("/fortnox-prods", fortnoxProdPostController)
module.exports = router;
