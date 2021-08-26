const express = require('express');

const router = express.Router();
const { secured } = require('../middlewares/secured');

const {
  getAddEmployeeInfo,
  postAddEmployeeInfo,
  getAbsents,
  postAddAbsent,
  getMilage,
  postAddMilage,
  getHours,
  postAddHourlyReview,
  getMonths,
  getMonthHistory
} = require("../controllers/employeeController");

router.get('/employee-information', secured, getAddEmployeeInfo);
router.post('/edit-employee-information', secured, postAddEmployeeInfo);

router.get('/employee-absent-reports', secured, getAbsents);
router.post('/add-employee-absent-report', secured, postAddAbsent);

router.get('/employee-milages', secured, getMilage);
router.post('/add-employee-milage', secured, postAddMilage);


router.get('/employee-hourly-reviews', secured, getHours);
router.post('/add-employee-hourly-review', secured, postAddHourlyReview);

router.get('/employee-history', secured, getMonths);
router.get('/employee-history/:month', secured, getMonthHistory);

module.exports = router;