const express = require('express');

const router = express.Router();
const { secured } = require('../middlewares/secured');

const {
  getEmployees,
  getEmployeesMonths,
  getEmployeeMonthHistory,
  postApproveEmploeeMonth,
  postEditEmployeeInfo
} = require("../controllers/adminController");

router.get('/employees', secured, getEmployees);
router.get('/employee-history/:employeeId', secured, getEmployeesMonths);
router.get('/employee-history/:employeeId/:month', secured, getEmployeeMonthHistory);
router.post('/approve-employee-month', secured, postApproveEmploeeMonth);
router.post('/edit-employee-info', secured, postEditEmployeeInfo);

module.exports = router;
