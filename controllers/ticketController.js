const Ticket = require('../models/Ticket');
const User = require('../models/User');
const DevTicket = require('../models/DevTicket');

exports.getSupportTicket = async (req, res, next) => {
    console.log('in req object', req.user);
    const users$ = await User.find();
    // console.log(users$);
    res.render('add-ticket', {
        name: req.user.name,
        users: users$,
        user$: req.user,
        pageTitle: 'New Support Ticket',
        path: 'add-ticket',
        editing: true,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
        // name: req.user.institutionName,
        // certificatesNumber: certificatesLength,
        // institutionsNumber: institutionsLength,
        // coursesNumber: coursesLength,
        // institutions: institutions,
        // courses: courses,
    });
};

exports.getSupportTicketList = async (req, res) => {
    const users$ = await User.find();
    const createdby = [];
    const date_now = Date.now();

    const tickets = await Ticket.find({ Open: true }).sort({
        timestamp: -1,
    });
    console.log(tickets);

    for (let i = 0; i < tickets.length; i++) {
        const username = await User.findOne({ _id: tickets[i].User });
        // console.log(username.email);
        createdby.push(username);
    }
    // console.log(createdby);
    res.render('support-ticket-list', {
        name: req.user.name,
        users: users$,
        created: createdby,
        ticket: tickets,
        date_today: date_now,
        pageTitle: 'Support Ticket List',
        path: 'support-ticket-list',
        editing: true,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
        // name: req.user.institutionName,
        // certificatesNumber: certificatesLength,
        // institutionsNumber: institutionsLength,
        // coursesNumber: coursesLength,
        // institutions: institutions,
        // courses: courses,
    });
};

exports.postSupportTicketLitFilterMain = async (req, res) => {
    const users1$ = await User.findOne({ email: req.user.email });
    const users$ = await User.find();
    let tickets;
    const createdby = [];

    const date_now = Date.now();

    if (req.body.selection == 'All open tickets') {
        tickets = await Ticket.find({ Open: true }).sort({ timestamp: -1 });
    }
    if (req.body.selection == 'All tickets') {
        tickets = await Ticket.find().sort({ timestamp: -1 });
    }
    if (req.body.selection == 'All tickets the user is responsible for') {
        tickets = await Ticket.find({ User: req.user._id }).sort({
            timestamp: -1,
        });
    }
    if (req.body.selection == 'All tickets the user created') {
        tickets = await Ticket.find({ User: req.user._id }).sort({
            timestamp: -1,
        });
    }
    if (req.body.selection == 'Solved tickets') {
        tickets = await Ticket.find({ Open: false }).sort({
            timestamp: -1,
        });
    }
    console.log(tickets[0].updatedAt);

    if (req.body.sort == 'Last updated') {
        let temp;
        if (tickets.length > 0) {
            for (let i = 0; i < tickets.length - 1; i++) {
                console.log('runs');
                if (
                    new Date(tickets[i].updatedAt) <
                    new Date(tickets[i + 1].updatedAt)
                ) {
                    temp = tickets[i];
                    tickets[i] = tickets[i + 1];
                    tickets[i + 1] = temp;
                }
            }
        }
    }

    if (req.body.sort == 'Priority') {
        const low = [];
        const medium = [];
        const high = [];
        const immediate = [];
        if (tickets.length > 0) {
            for (let i = 0; i < tickets.length; i++) {
                if (tickets[i].Priority == 'Låg') {
                    low.push(tickets[i]);
                }
                if (tickets[i].Priority == 'Medium') {
                    medium.push(tickets[i]);
                }
                if (tickets[i].Priority == 'Hög') {
                    high.push(tickets[i]);
                }
                if (tickets[i].Priority == 'Brådskande') {
                    immediate.push(tickets[i]);
                }
            }
        }
        let firstarr = immediate.concat(high);
        console.log(firstarr);
        firstarr = firstarr.concat(medium);
        console.log(firstarr);
        firstarr = firstarr.concat(low);
        console.log(firstarr);
        tickets = firstarr;
    }

    if (req.body.sort == 'Status') {
        const low = [];
        const medium = [];
        const high = [];
        const immediate = [];
        if (tickets.length > 0) {
            for (let i = 0; i < tickets.length; i++) {
                if (tickets[i].Status == 'Löst') {
                    low.push(tickets[i]);
                }
                if (tickets[i].Status == 'Inväntar svar') {
                    medium.push(tickets[i]);
                }
                if (tickets[i].Status == 'Bokat besök') {
                    high.push(tickets[i]);
                }
                if (tickets[i].Status == 'Problemsökning') {
                    immediate.push(tickets[i]);
                }
            }
        }
        let firstarr = immediate.concat(high);
        console.log(firstarr);
        firstarr = firstarr.concat(medium);
        console.log(firstarr);
        firstarr = firstarr.concat(low);
        console.log(firstarr);
        tickets = firstarr;
    }

    for (let i = 0; i < tickets.length; i++) {
        const username = await User.findOne({ _id: tickets[i].User });
        // console.log(username.email);
        createdby.push(username);
    }
    // console.log(createdby);
    res.render('support-ticket-list', {
        name: req.user.name,
        users: users$,
        created: createdby,
        ticket: tickets,
        date_today: date_now,
        pageTitle: 'Support Ticket List',
        path: 'support-ticket-list',
        editing: true,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
        // name: req.user.institutionName,
        // certificatesNumber: certificatesLength,
        // institutionsNumber: institutionsLength,
        // coursesNumber: coursesLength,
        // institutions: institutions,
        // courses: courses,
    });
};

exports.postSupportTicketLitFilter = async (req, res) => {
    let dateObj = Date.now();
    if (req.body.time == 'last week') {
        dateObj = new Date(dateObj - 7 * 86400000);
    }
    if (req.body.time == 'last 30 days') {
        dateObj = new Date(dateObj - 30 * 86400000);
    }
    if (req.body.time == 'last year') {
        dateObj = new Date(dateObj - 365 * 86400000);
    }

    const users1$ = await User.findOne({ email: req.body.User });
    const users$ = await User.find();
    const createdby = [];

    const date_now = Date.now();
    console.log(req.body);
    if (req.body) console.log('hrlo');
    const tickets = await Ticket.find({
        Type: req.body.Type,
        timestamp: { $gte: dateObj },
        Status: req.body.Status,
        Priority: req.body.Priority,
        User: users1$._id,
    }).sort({ timestamp: -1 });
    console.log('filter', tickets);

    for (let i = 0; i < tickets.length; i++) {
        const username = await User.findOne({ _id: tickets[i].User });
        // console.log(username.email);
        createdby.push(username);
    }
    // console.log(createdby);
    res.render('support-ticket-list', {
        name: req.user.name,
        users: users$,
        created: createdby,
        ticket: tickets,
        date_today: date_now,
        pageTitle: 'Support Ticket List',
        path: 'support-ticket-list',
        editing: true,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
        // name: req.user.institutionName,
        // certificatesNumber: certificatesLength,
        // institutionsNumber: institutionsLength,
        // coursesNumber: coursesLength,
        // institutions: institutions,
        // courses: courses,
    });
};

exports.addTicket = async (req, res) => {
    let color;
    if (req.body.Priority == 'Låg') {
        color = 'green';
    }
    if (req.body.Priority == 'Medium') {
        color = 'blue';
    }
    if (req.body.Priority == 'Hög') {
        color = 'orange';
    }
    if (req.body.Priority == 'Brådskande') {
        color = 'red';
    }

    const ticket$ = await new Ticket({
        Subject: req.body.subject,
        Description: req.body.description,
        User: req.user._id,
        Type: req.body.Type,
        Status: req.body.Status,
        Priority: req.body.Priority,
        Priority_color: color,
        Create_deviation: req.body.Create_deviation,
        Open: true,
        Customer_info: {
            name: req.body.name,
            organization: req.body.organization,
            telephone: req.body.telephone,
            mail: req.body.mail,
            contact_method: req.body.Contact_method,
        },
    }).save();
    console.log(ticket$);
    if (ticket$.Create_deviation == true) {
        const deviation_ticket$ = await new DevTicket({
            Subject: req.body.subject,
            Description: req.body.description,
            User: req.user._id,
            Type: req.body.Type,
            Status: req.body.Status,
            Priority: req.body.Priority,
            Priority_color: color,
            Create_deviation: req.body.Create_deviation,
            Open: true,
            Customer_info: {
                name: req.body.name,
                organization: req.body.organization,
                telephone: req.body.telephone,
                mail: req.body.mail,
                contact_method: req.body.Contact_method,
            },
        }).save();
        console.log(deviation_ticket$);
    }
    req.flash('success_msg', 'Ticket added successfully...');
    res.redirect('/support-ticket');
};

exports.getTicketDataById = async (req, res) => {
    const users$ = await User.find();
    const ticket_id = req.params.id;
    const ticket$ = await Ticket.findOne({ _id: ticket_id });
    const username = await User.findOne({ _id: ticket$.User });
    console.log(username);
    // console.log(ticket$);

    res.render('ticket-data', {
        name: req.user.name,
        ticket: ticket$,
        user: username,
        users: users$,
        pageTitle: 'Ticket Data',
        path: 'ticket-data',
        editing: true,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
        // name: req.user.institutionName,
        // certificatesNumber: certificatesLength,
        // institutionsNumber: institutionsLength,
        // coursesNumber: coursesLength,
        // institutions: institutions,
        // courses: courses,
    });
};
exports.getTicketViewbyId = async (req, res) => {
    const users$ = await User.find();
    const ticket_id = req.params.id;
    const ticket$ = await Ticket.findOne({ _id: ticket_id });
    const username = await User.findOne({ _id: ticket$.User });
    console.log(ticket$);
    // console.log(ticket$);

    res.render('ticket-view', {
        name: req.user.name,
        ticket: ticket$,
        user: username,
        user$: req.user,
        users: users$,
        pageTitle: 'Ticket View',
        path: 'ticket-view',
        editing: true,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
        // name: req.user.institutionName,
        // certificatesNumber: certificatesLength,
        // institutionsNumber: institutionsLength,
        // coursesNumber: coursesLength,
        // institutions: institutions,
        // courses: courses,
    });
};

exports.updateTicket = async (req, res, err) => {
    console.log(req.body);
    let color;
    if (req.body.Priority == 'Låg') {
        color = 'green';
    }
    if (req.body.Priority == 'Medium') {
        color = 'blue';
    }
    if (req.body.Priority == 'Hög') {
        color = 'orange';
    }
    if (req.body.Priority == 'Brådskande') {
        color = 'red';
    }

    const user$ = await User.findOne({ email: req.body.User });
    await Ticket.findByIdAndUpdate(req.body.ticketid, {
        Subject: req.body.subject,
        Description: req.body.description,
        User: user$._id,
        Type: req.body.Type,
        Status: req.body.Status,
        Priority: req.body.Priority,
        Priority_color: color,
        Create_deviation: req.body.Create_deviation,
        Open: true,
        Customer_info: {
            name: req.body.name,
            organization: req.body.organization,
            telephone: req.body.telephone,
            mail: req.body.mail,
            contact_method: req.body.Contact_method,
        },
    });

    const upd_ticket = await Ticket.findOne({ _id: req.body.ticketid });

    if (
        req.body.Create_deviation == true &&
        upd_ticket.Create_deviation == ''
    ) {
        await new DevTicket({
            Subject: req.body.subject,
            Description: req.body.description,
            User: req.user._id,
            Type: req.body.Type,
            Status: req.body.Status,
            Priority: req.body.Priority,
            Priority_color: color,
            Create_deviation: req.body.Create_deviation,
            Open: true,
            Customer_info: {
                name: req.body.name,
                organization: req.body.organization,
                telephone: req.body.telephone,
                mail: req.body.mail,
                contact_method: req.body.Contact_method,
            },
        }).save();
    }

    res.redirect('/support-ticket-list');
};

exports.updateTicketPartial = async (req, res) => {
    let color;
    if (req.body.Priority == 'Låg') {
        color = 'green';
    }
    if (req.body.Priority == 'Medium') {
        color = 'blue';
    }
    if (req.body.Priority == 'Hög') {
        color = 'orange';
    }
    if (req.body.Priority == 'Brådskande') {
        color = 'red';
    }
    const user$ = await User.findOne({ email: req.body.User });
    await Ticket.findByIdAndUpdate(req.body.ticketid, {
        User: user$._id,
        Type: req.body.Type,
        Status: req.body.Status,
        Priority: req.body.Priority,
        Priority_color: color,
    });

    req.flash('success_msg', 'Ticket updated successfully...');

    res.redirect('/support-ticket-list');
};
exports.updateTicketNotes = async (req, res) => {
    const ticket$ = await Ticket.findOne({ _id: req.body.ticketid });

    let note = [];
    const { data } = req.body;
    const timestamp = Date.now();
    const { tagged } = req.body;
    const { author } = req.body;
    note = ticket$.Notes;

    const obj = { data, timestamp, tagged, author };

    const { length } = note;
    note[length] = obj;

    const upd = await Ticket.findByIdAndUpdate(req.body.ticketid, {
        Notes: note,
    });
    console.log(upd);

    req.flash('success_msg', 'Ticket updated successfully...');

    res.redirect('/support-ticket-list/');
};

exports.getTicketArchivebyId = async (req, res) => {
    const users$ = await User.find();
    const ticket_id = req.params.id;
    const ticket$ = await Ticket.findOne({ _id: ticket_id });
    const username = await User.findOne({ _id: ticket$.User });
    console.log(ticket$);
    // console.log(ticket$);

    const upd = await Ticket.findByIdAndUpdate(ticket_id, {
        Open: false,
    });
    console.log(upd);

    req.flash('success_msg', 'Ticket Archived successfully...');

    res.render('support-ticket-list', {
        name: req.user.name,
        ticket: ticket$,
        user: username,
        users: users$,
        pageTitle: 'Support Ticket List',
        path: 'support-ticket-list',
        editing: true,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
        // name: req.user.institutionName,
        // certificatesNumber: certificatesLength,
        // institutionsNumber: institutionsLength,
        // coursesNumber: coursesLength,
        // institutions: institutions,
        // courses: courses,
    });
};
exports.addDeviationTicket = async (req, res) => {
    await new DevTicket({
        Subject: req.body.subject,
        Description: req.body.description,
        Temporary_action: req.body.temporary_action,
        Routine: req.body.routine,
        User: req.user._id,
        Type: req.body.Type,
        Status: req.body.Status,
        Priority: req.body.Priority,
        Create_deviation: req.body.Create_deviation,
        Open: true,
        Customer_info: {
            name: req.body.name,
            organization: req.body.organization,
            telephone: req.body.telephone,
            mail: req.body.mail,
            contact_method: req.body.Contact_method,
        },
    }).save();

    req.flash('success_msg', 'Ticket added successfully...');
    res.redirect('/deviation-ticket');
};

exports.getDeviationTicket = async (req, res) => {
    const users$ = await User.find();
    res.render('add-deviation-ticket', {
        user$: req.user,
        name: req.user.name,
        users: users$,
        pageTitle: 'New Deviation Ticket',
        path: 'add-deviation-ticket',
        editing: true,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
        // name: req.user.institutionName,
        // certificatesNumber: certificatesLength,
        // institutionsNumber: institutionsLength,
        // coursesNumber: coursesLength,
        // institutions: institutions,
        // courses: courses,
    });
};

exports.getDeviationTicketList = async (req, res) => {
    const users$ = await User.find();
    const createdby = [];
    const date_now = Date.now();

    const tickets = await DevTicket.find({ Open: true }).sort({
        timestamp: -1,
    });
    console.log(tickets);

    for (let i = 0; i < tickets.length; i++) {
        const username = await User.findOne({ _id: tickets[i].User });
        // console.log(username.email);
        createdby.push(username);
    }
    // console.log(createdby);
    res.render('deviation-ticket-list', {
        name: req.user.name,
        users: users$,
        created: createdby,
        ticket: tickets,
        date_today: date_now,
        pageTitle: 'Deviation Ticket List',
        path: 'deviation-ticket-list',
        editing: true,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
        // name: req.user.institutionName,
        // certificatesNumber: certificatesLength,
        // institutionsNumber: institutionsLength,
        // coursesNumber: coursesLength,
        // institutions: institutions,
        // courses: courses,
    });
};

exports.postDeviationTicketListFilterMain = async (req, res) => {
    const users1$ = await User.findOne({ email: req.user.email });
    const users$ = await User.find();
    let tickets;
    const createdby = [];

    const date_now = Date.now();
    console.log(req.body);

    if (req.body.selection == 'All open tickets') {
        tickets = await DevTicket.find({ Open: true }).sort({
            timestamp: -1,
        });
    }
    if (req.body.selection == 'All tickets') {
        tickets = await DevTicket.find().sort({ timestamp: -1 });
    }
    if (req.body.selection == 'All tickets the user is responsible for') {
        tickets = await DevTicket.find({ User: req.user._id }).sort({
            timestamp: -1,
        });
    }
    if (req.body.selection == 'All tickets the user created') {
        tickets = await DevTicket.find({ User: req.user._id }).sort({
            timestamp: -1,
        });
    }
    if (req.body.selection == 'Solved tickets') {
        tickets = await DevTicket.find({ Open: false }).sort({
            timestamp: -1,
        });
    }

    if (req.body.sort == 'Last updated') {
        let temp;
        if (tickets.length > 0) {
            for (let i = 0; i < tickets.length - 1; i++) {
                console.log('runs');
                if (
                    new Date(tickets[i].updatedAt) <
                    new Date(tickets[i + 1].updatedAt)
                ) {
                    temp = tickets[i];
                    tickets[i] = tickets[i + 1];
                    tickets[i + 1] = temp;
                }
            }
        }
    }

    if (req.body.sort == 'Priority') {
        const low = [];
        const medium = [];
        const high = [];
        const immediate = [];
        if (tickets.length > 0) {
            for (let i = 0; i < tickets.length; i++) {
                if (tickets[i].Priority == 'Låg') {
                    low.push(tickets[i]);
                }
                if (tickets[i].Priority == 'Medium') {
                    medium.push(tickets[i]);
                }
                if (tickets[i].Priority == 'Hög') {
                    high.push(tickets[i]);
                }
                if (tickets[i].Priority == 'Brådskande') {
                    immediate.push(tickets[i]);
                }
            }
        }
        let firstarr1 = immediate.concat(high);
        console.log(firstarr1);
        firstarr1 = firstarr1.concat(medium);
        console.log(firstarr1);
        firstarr1 = firstarr1.concat(low);
        console.log(firstarr1);
        tickets = firstarr1;
    }

    if (req.body.sort == 'Status') {
        const low = [];
        const medium = [];
        const high = [];
        const immediate = [];
        if (tickets.length > 0) {
            for (let i = 0; i < tickets.length; i++) {
                if (tickets[i].Status == 'Löst') {
                    low.push(tickets[i]);
                }
                if (tickets[i].Status == 'Inväntar svar') {
                    medium.push(tickets[i]);
                }
                if (tickets[i].Status == 'Bokat besök') {
                    high.push(tickets[i]);
                }
                if (tickets[i].Status == 'Problemsökning') {
                    immediate.push(tickets[i]);
                }
            }
        }
        let firstarr = immediate.concat(high);
        console.log(firstarr);
        firstarr = firstarr.concat(medium);
        console.log(firstarr);
        firstarr = firstarr.concat(low);
        console.log(firstarr);
        tickets = firstarr;
    }

    for (let i = 0; i < tickets.length; i++) {
        const username = await User.findOne({ _id: tickets[i].User });
        // console.log(username.email);
        createdby.push(username);
    }
    // console.log(createdby);
    res.render('deviation-ticket-list', {
        name: req.user.name,
        users: users$,
        created: createdby,
        ticket: tickets,
        date_today: date_now,
        pageTitle: 'Deviation Ticket List',
        path: 'deviation-ticket-list',
        editing: true,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
        // name: req.user.institutionName,
        // certificatesNumber: certificatesLength,
        // institutionsNumber: institutionsLength,
        // coursesNumber: coursesLength,
        // institutions: institutions,
        // courses: courses,
    });
};
exports.postDeviationListFilter = async (req, res) => {
    let dateObj = Date.now();
    if (req.body.time == 'last week') {
        dateObj = new Date(dateObj - 7 * 86400000);
    }
    if (req.body.time == 'last 30 days') {
        dateObj = new Date(dateObj - 30 * 86400000);
    }
    if (req.body.time == 'last year') {
        dateObj = new Date(dateObj - 365 * 86400000);
    }

    const users1$ = await User.findOne({ email: req.user.email });
    const users$ = await User.find();
    const createdby = [];

    const date_now = Date.now();
    console.log(req.body);
    if (req.body) console.log('hrlo');
    const tickets = await DevTicket.find({
        Type: req.body.Type,
        timestamp: { $gte: dateObj },
        Status: req.body.Status,
        Priority: req.body.Priority,
        User: users1$._id,
    }).sort({ timestamp: -1 });
    console.log('filter', tickets);

    for (let i = 0; i < tickets.length; i++) {
        const username = await User.findOne({ _id: tickets[i].User });
        // console.log(username.email);
        createdby.push(username);
    }
    // console.log(createdby);
    res.render('deviation-ticket-list', {
        name: req.user.name,
        users: users$,
        created: createdby,
        ticket: tickets,
        date_today: date_now,
        pageTitle: 'Deviation Ticket List',
        path: 'deviation-ticket-list',
        editing: true,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
        // name: req.user.institutionName,
        // certificatesNumber: certificatesLength,
        // institutionsNumber: institutionsLength,
        // coursesNumber: coursesLength,
        // institutions: institutions,
        // courses: courses,
    });
};

exports.getDeviationTicketViewbyId = async (req, res) => {
    const users$ = await User.find();
    const ticket_id = req.params.id;
    const ticket$ = await DevTicket.findOne({ _id: ticket_id });
    const username = await User.findOne({ _id: ticket$.User });
    console.log(ticket$);
    // console.log(ticket$);

    res.render('deviation-ticket-view', {
        user$: req.user,
        name: req.user.name,
        ticket: ticket$,
        user: username,
        users: users$,
        pageTitle: 'Deviation Ticket View',
        path: 'deviation-ticket-view',
        editing: true,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
        // name: req.user.institutionName,
        // certificatesNumber: certificatesLength,
        // institutionsNumber: institutionsLength,
        // coursesNumber: coursesLength,
        // institutions: institutions,
        // courses: courses,
    });
};

exports.updateDeviationTicket = async (req, res) => {
    let color;
    if (req.body.Priority == 'Låg') {
        color = 'green';
    }
    if (req.body.Priority == 'Medium') {
        color = 'blue';
    }
    if (req.body.Priority == 'Hög') {
        color = 'orange';
    }
    if (req.body.Priority == 'Brådskande') {
        color = 'red';
    }
    console.log('body', req.body);
    const user$ = await User.findOne({ email: req.body.User });
    await DevTicket.findByIdAndUpdate(req.body.ticketid, {
        Subject: req.body.subject,
        Description: req.body.description,
        User: user$._id,
        Type: req.body.Type,
        Status: req.body.Status,
        Priority: req.body.Priority,
        Priority_color: color,
        Temporary_action: req.body.temporary_action,
        Routine: req.body.routine,
        Create_deviation: req.body.Create_deviation,
        Open: true,
        Customer_info: {
            name: req.body.name,
            organization: req.body.organization,
            telephone: req.body.telephone,
            mail: req.body.mail,
            contact_method: req.body.Contact_method,
        },
    });

    res.redirect('/deviation-ticket-list');
};

exports.updateDeviationTicketPartial = async (req, res) => {
    let color;
    if (req.body.Priority == 'Låg') {
        color = 'green';
    }
    if (req.body.Priority == 'Medium') {
        color = 'blue';
    }
    if (req.body.Priority == 'Hög') {
        color = 'orange';
    }
    if (req.body.Priority == 'Brådskande') {
        color = 'red';
    }
    const user$ = await User.findOne({ email: req.body.User });
    await DevTicket.findByIdAndUpdate(req.body.ticketid, {
        User: user$._id,
        Type: req.body.Type,
        Status: req.body.Status,
        Priority: req.body.Priority,
        Priority_color: color,
    });

    req.flash('success_msg', 'Ticket updated successfully...');

    res.redirect('/deviation-ticket-list');
};
exports.updateDeviationTicketNotes = async (req, res) => {
    const ticket$ = await DevTicket.findOne({ _id: req.body.ticketid });
    console.log(req.body);
    let note = [];
    const { data } = req.body;
    const timestamp = Date.now();
    const { tagged } = req.body;
    const { author } = req.body;
    note = ticket$.Notes;

    const obj = { data, timestamp, tagged, author };

    const { length } = note;
    note[length] = obj;

    const upd = await DevTicket.findByIdAndUpdate(req.body.ticketid, {
        Notes: note,
    });
    console.log(upd);

    req.flash('success_msg', 'Ticket updated successfully...');

    res.redirect(`/deviation-ticket-view/${req.body.ticketid}`);
};
exports.getDeviationTicketDatabyId = async (req, res) => {
    const users$ = await User.find();
    const ticket_id = req.params.id;
    const ticket$ = await DevTicket.findOne({ _id: ticket_id });
    const username = await User.findOne({ _id: ticket$.User });
    console.log(username);
    // console.log(ticket$);

    res.render('deviation-ticket-data', {
        name: req.user.name,
        ticket: ticket$,
        user: username,
        users: users$,
        pageTitle: 'Deviation Ticket Data',
        path: 'deviation-ticket-data',
        editing: true,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
        // name: req.user.institutionName,
        // certificatesNumber: certificatesLength,
        // institutionsNumber: institutionsLength,
        // coursesNumber: coursesLength,
        // institutions: institutions,
        // courses: courses,
    });
};
exports.getDeviationTicketArchivebyId = async (req, res) => {
    const users$ = await User.find();
    const ticket_id = req.params.id;
    const ticket$ = await DevTicket.findOne({ _id: ticket_id });
    const username = await User.findOne({ _id: ticket$.User });
    console.log(ticket$);
    // console.log(ticket$);

    const upd = await DevTicket.findByIdAndUpdate(ticket_id, {
        Open: false,
    });
    console.log(upd);

    req.flash('success_msg', 'Ticket Archived successfully...');

    res.render('deviation-ticket-list', {
        name: req.user.name,
        ticket: ticket$,
        user: username,
        users: users$,
        pageTitle: 'Deviation Ticket List',
        path: 'deviation-ticket-list',
        editing: true,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
        // name: req.user.institutionName,
        // certificatesNumber: certificatesLength,
        // institutionsNumber: institutionsLength,
        // coursesNumber: coursesLength,
        // institutions: institutions,
        // courses: courses,
    });
};
