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

exports.getAddEmployeeInfo = async (req, res) => {
    const { _raw, _json, ...userProfile } = req.user;
    const user = await User.findById(userProfile._id);

    const employee = await Employee.findOne(user.employeeId);
    
    res.render('add-employee-info', {
        disabled: false,
        editing: true,
        name: userProfile.nickname,
        employee
    });
};

exports.postAddEmployeeInfo = async (req, res) => {
    try {
        const { _raw, _json, nickname: name, ...userProfile } = req.user;
        
        const body = _.pick(req.body, [
            'id',
            'username',
            'name',
            'address',
            'postNumber',
            'phoneNumber',
            'postAddress',
            'accountNumber',
            'bank',
            'clearing',
            'jobType',
            'vaccations'
        ]);
        let employee = await Employee.findById(body.id);
        if(employee){
            employee.username = body.username;
            employee.name = body.name;
            employee.address = body.address;
            employee.postNumber = body.postNumber;
            employee.phoneNumber = body.phoneNumber;
            employee.postAddress = body.postAddress;
            employee.accountNumber = body.accountNumber;
            employee.bank = body.userbankname;
            employee.clearing = body.clearing;
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

module.exports.getAbsents = async (req, res) => {
    const { _raw, _json, ...userProfile } = req.user;

    const user = await User.findById(userProfile._id);

    let absents = await Absent.find({employeeId: user.employeeId, approved:false});
    let months = [];
    if(absents.length > 0){
        absents = absents.map(i => {
            return {
                ...i._doc,
                month: mlist[(new Date(i.from).getMonth())]
            }
        });

        for(let j=0;j<absents.length;j++){
            if(months.filter(i => i.month === absents[j].month).length < 1){
              months.push({month: absents[j].month, absents: [absents[j]]});
            } else {
              let tmpMonth = months.filter(i => i.month === absents[j].month)[0];
              tmpMonth = {...tmpMonth, absents: [...tmpMonth.absents, absents[j]]};
              months = months.map(i => {
                if(i.month === tmpMonth.month){
                  return tmpMonth;
                }
                return i;
              })
            }
        }
    }
    
    res.render('absent-reports', {
        absents,
        absentsCount: absents.length,
        months,
        name: userProfile.nickname,
    });
};

exports.postAddAbsent = async (req, res) => {
    try {
        const { _raw, _json, nickname: name, ...userProfile } = req.user;
        
        const body = _.pick(req.body, [
            'type',
            'from',
            'to'
        ]);

        const user = await User.findById(userProfile._id);
        let report = new Absent({
            type: body.type,
            from: body.from,
            to: body.to,
            employeeId: user.employeeId
        });
        report = await report.save();
        
        req.flash('success_msg', 'Absent Added');
        res.status(200).send();
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};

module.exports.getMilage = async (req, res) => {
    const { _raw, _json, ...userProfile } = req.user;

    const user = await User.findById(userProfile._id);

    let milages = await Milage.find({employeeId: user.employeeId, approved:false});
    let months = [];
    if(milages.length > 0){
        milages = milages.map(i => {
            return {
                ...i._doc,
                month: mlist[(new Date(i.date).getMonth())]
            }
        });

        for(let j=0;j<milages.length;j++){
            if(months.filter(i => i.month === milages[j].month).length < 1){
              months.push({month: milages[j].month, milages: [milages[j]]});
            } else {
              let tmpMonth = months.filter(i => i.month === milages[j].month)[0];
              tmpMonth = {...tmpMonth, milages: [...tmpMonth.milages, milages[j]]};
              months = months.map(i => {
                if(i.month === tmpMonth.month){
                  return tmpMonth;
                }
                return i;
              })
            }
        }
    }
    res.render('milages', {
        milages,
        milagesCount: milages.length,
        months,
        name: userProfile.nickname,
    });
};

exports.postAddMilage = async (req, res) => {
    try {
        const { _raw, _json, nickname: name, ...userProfile } = req.user;
        
        const body = _.pick(req.body, [
            'date',
            'kilometer',
        ]);
        
        const user = await User.findById(userProfile._id);
        let report = new Milage({
            date: body.date,
            kilometer: body.kilometer,
            employeeId: user.employeeId
        });
        report = await report.save();
        
        req.flash('success_msg', 'Milage Added');
        res.status(200).send();
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};

module.exports.getHours = async (req, res) => {
    const { _raw, _json, ...userProfile } = req.user;

    const user = await User.findById(userProfile._id);

    let hours = await Hourly.find({employeeId: user.employeeId, approved:false});
    let months = [];
    if(hours.length > 0){
        hours = hours.map(i => {
            return {
                ...i._doc,
                month: mlist[(new Date(i.date).getMonth())]
            }
        });

        for(let j=0;j<hours.length;j++){
            if(months.filter(i => i.month === hours[j].month).length < 1){
              months.push({month: hours[j].month, hours: [hours[j]]});
            } else {
              let tmpMonth = months.filter(i => i.month === hours[j].month)[0];
              tmpMonth = {...tmpMonth, hours: [...tmpMonth.hours, hours[j]]};
              months = months.map(i => {
                if(i.month === tmpMonth.month){
                  return tmpMonth;
                }
                return i;
              })
            }
        }
    }
    res.render('hourly-reviews', {
        hours,
        hoursCount: hours.length,
        months,
        name: userProfile.nickname,
    });
};

exports.postAddHourlyReview = async (req, res) => {
    try {
        const { _raw, _json, nickname: name, ...userProfile } = req.user;
        
        const body = _.pick(req.body, [
            'date',
            'hours',
        ]);
        
        const user = await User.findById(userProfile._id);
        let report = new Hourly({
            date: body.date,
            hours: body.hours,
            employeeId: user.employeeId
        });
        report = await report.save();
        
        req.flash('success_msg', 'Hours Added');
        res.status(200).send();
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};

module.exports.getMonths = async (req, res) => {
    const { _raw, _json, ...userProfile } = req.user;

    const user = await User.findById(userProfile._id);

    let hours = await Hourly.find({employeeId: user.employeeId});
    let milages = await Milage.find({employeeId: user.employeeId});
    let absents = await Absent.find({employeeId: user.employeeId});
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


    res.render('employee-history', {
        months,
        monthsCount: months.length,
        name: userProfile.nickname,
    });
};

module.exports.getMonthHistory = async (req, res) => {
    const { _raw, _json, ...userProfile } = req.user;
    const { month} = req.params;

    const user = await User.findById(userProfile._id);

    let hours = await Hourly.find({employeeId: user.employeeId});
    let milages = await Milage.find({employeeId: user.employeeId});
    let absents = await Absent.find({employeeId: user.employeeId});
    
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

    res.render('employee-history-month', {
        month,
        hours,
        hoursCount: hours.length,
        milages,
        milagesCount: milages.length,
        absents,
        absentsCount: absents.length,
        name: userProfile.nickname,
    });
};
