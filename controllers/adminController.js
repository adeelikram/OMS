const User = require('../models/User');
const Employee = require('../models/Employee/Employee');
const Absent = require('../models/Employee/Absent');
const Milage = require('../models/Employee/Milage');
const Hourly = require('../models/Employee/Hourly');
const _ = require('lodash');

const mlist = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

module.exports.getEmployees = async (req, res) => {
    const { _raw, _json, ...userProfile } = req.user;

    const user = await User.findById(userProfile._id);

    let employees = await Employee.find({});
    for(let i=0; i < employees.length; i++){
        let hours = await Hourly.countDocuments({employeeId: employees[i]._id});
        let milages = await Milage.countDocuments({employeeId: employees[i]._id});
        let absents = await Absent.countDocuments({employeeId: employees[i]._id});
        employees[i] = {
            ...employees[i]._doc,
            hours,
            milages,
            absents
        }
    }

    res.render('admin/employees', {
        employees,
        employeesCount: employees.length,
        name: userProfile.nickname,
        role: user.role,
    });
};

module.exports.getEmployeesMonths = async (req, res) => {
    const { _raw, _json, ...userProfile } = req.user;

    const user = await User.findById(userProfile._id);
    const { employeeId } = req.params;

    const employee = await Employee.findById(employeeId);

    let hours = await Hourly.find({employeeId});
    let milages = await Milage.find({employeeId});
    let absents = await Absent.find({employeeId});
    let months = [];

    if(hours.length > 0){
        hours = hours.map(i => {
            return {
                ...i,
                month: mlist[(new Date(i.date).getMonth())]
            }
        });
        months = [...months, ...new Set(hours.map(i => i.month))];
    }

    if(milages.length > 0){
        milages = milages.map(i => {
            return {
                ...i,
                month: mlist[(new Date(i.date).getMonth())]
            }
        });
        months = [...months, ...new Set(milages.map(i => i.month))];
    }

    if(absents.length > 0){
        absents = absents.map(i => {
            return {
                ...i,
                month: mlist[(new Date(i.from).getMonth())]
            }
        });
        months = [...months, ...new Set(absents.map(i => i.month))];
    }

    months = [...new Set(months)];


    res.render('admin/employee-history', {
        months,
        monthsCount: months.length,
        employee,
        name: userProfile.nickname,
        editing: true,
        disabled: false
    });
};

module.exports.getEmployeeMonthHistory = async (req, res) => {
    const { _raw, _json, ...userProfile } = req.user;
    const { employeeId, month } = req.params;

    const user = await User.findById(userProfile._id);

    const employee = await Employee.findById(employeeId);

    let hours = await Hourly.find({employeeId});
    let milages = await Milage.find({employeeId});
    let absents = await Absent.find({employeeId});
    
    if(hours.length > 0){
        hours = hours.map(i => {
            return {
                ...i,
                month: mlist[(new Date(i.date).getMonth())]
            }
        });
        hours = hours.filter(i => i.month === month);
        hours = hours.map(i => i._doc);
    }

    if(milages.length > 0){
        milages = milages.map(i => {
            return {
                ...i,
                month: mlist[(new Date(i.date).getMonth())]
            }
        });
        milages = milages.filter(i => i.month === month);
        milages = milages.map(i => i._doc);
    }

    if(absents.length > 0){
        absents = absents.map(i => {
            return {
                ...i,
                month: mlist[(new Date(i.from).getMonth())]
            }
        });
        absents = absents.filter(i => i.month === month);
        absents = absents.map(i => i._doc);
    }

    res.render('admin/employee-history-month', {
        month,
        hours,
        hoursCount: hours.length,
        milages,
        milagesCount: milages.length,
        absents,
        absentsCount: absents.length,
        name: userProfile.nickname,
        employee
    });
};

exports.postApproveEmploeeMonth = async (req, res) => {
    try {
        const { _raw, _json, nickname: name, ...userProfile } = req.user;
        const body = _.pick(req.body, [
            'month',
            'employeeId',
        ]);
        const employeeId = body.employeeId;
        const month = body.month;

        // const employee = await Employee.findById(bodemployeeId);

        let hours = await Hourly.find({employeeId});
        let milages = await Milage.find({employeeId});
        let absents = await Absent.find({employeeId});
        
        if(hours.length > 0){
            hours = hours.filter(i => mlist[(new Date(i.date).getMonth())] === month);
            for(let i=0; i<hours.length;i++){
                hours[i].approved = true;
                hours[i] = await hours[i].save();
            }
        }
    
        if(milages.length > 0){
            milages = milages.filter(i => mlist[(new Date(i.date).getMonth())] === month);
            for(let i=0; i<milages.length;i++){
                milages[i].approved = true;
                milages[i] = await milages[i].save();
            }
        }
    
        if(absents.length > 0){
            absents = absents.filter(i => mlist[(new Date(i.from).getMonth())] === month);
            for(let i=0; i<absents.length;i++){
                absents[i].approved = true;
                absents[i] = await absents[i].save();
            }
        }
        
        req.flash('success_msg', 'Month Approved');
        res.status(200).send();
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};

exports.postEditEmployeeInfo = async (req, res) => {
    try {
        const { _raw, _json, nickname: name, ...userProfile } = req.user;
        
        const body = _.pick(req.body, [
            'id',
            'jobType',
            'vaccations'
        ]);
        let employee = await Employee.findById(body.id);
        if(employee){
            employee.jobType = body.jobType;
            employee.vaccations = parseInt(body.vaccations);
            employee = await employee.save();
        }

        req.flash('success_msg', 'Information Updated');
        res.status(200).send();
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};
