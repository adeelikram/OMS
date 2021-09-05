const express = require('express');

const router = express.Router();
const { secured } = require('../middlewares/secured');

const {
  getEmployees,
  getEmployeesMonths,
  getEmployeeMonthHistory,
  postApproveEmploeeMonth,
  postEditEmployeeInfo,
  getEmployeesFromHubspot,
  getEmployeeMeetings,
  getEmployeeCalls,
  getEmployeeEmails
} = require("../controllers/adminController");

router.get('/employees', secured, getEmployees);
router.get('/employee-history/:employeeId', secured, getEmployeesMonths);
router.get('/employee-history/:employeeId/:month', secured, getEmployeeMonthHistory);
router.post('/approve-employee-month', secured, postApproveEmploeeMonth);
router.post('/edit-employee-info', secured, postEditEmployeeInfo);
router.get('/hubspot/engangements', secured, getEmployeesFromHubspot);

router.get('/hubspot/engangements/calls/:id', secured, getEmployeeCalls);
router.get('/hubspot/engangements/meetings/:id', secured, getEmployeeMeetings);
router.get('/hubspot/engangements/emails/:id', secured, getEmployeeEmails);

module.exports = router;
