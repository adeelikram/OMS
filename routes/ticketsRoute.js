const express = require('express');
const { ensureAuthenticated } = require('../config/auth');
const {
    getSupportTicket,
    getSupportTicketList,
    postSupportTicketLitFilterMain,
    postSupportTicketLitFilter,
    addTicket,
    getTicketDataById,
    getTicketViewbyId,
    updateTicket,
    updateTicketPartial,
    updateTicketNotes,
    getTicketArchivebyId,
    addDeviationTicket,
    getDeviationTicket,
    getDeviationTicketList,
    postDeviationTicketListFilterMain,
    postDeviationListFilter,
    getDeviationTicketViewbyId,
    updateDeviationTicket,
    updateDeviationTicketPartial,
    updateDeviationTicketNotes,
    getDeviationTicketDatabyId,
    getDeviationTicketArchivebyId,
} = require('../controllers/ticketController');

const router = express.Router();
const { secured } = require('../middlewares/secured');

router.get('/support-ticket', secured, ensureAuthenticated, getSupportTicket);

router.get(
    '/support-ticket-list',
    secured,
    ensureAuthenticated,
    getSupportTicketList
);
router.post(
    '/support-ticket-list-filter-main',
    secured,
    ensureAuthenticated,
    postSupportTicketLitFilterMain
);
router.post(
    '/support-ticket-list-filter',
    secured,
    ensureAuthenticated,
    postSupportTicketLitFilter
);
router.post('/add-ticket', secured, ensureAuthenticated, addTicket);
router.get('/ticket-data/:id', secured, ensureAuthenticated, getTicketDataById);
router.get('/ticket-view/:id', secured, ensureAuthenticated, getTicketViewbyId);
router.post('/update-ticket', secured, ensureAuthenticated, updateTicket);
router.post(
    '/update-ticket-partial',
    secured,
    ensureAuthenticated,
    updateTicketPartial
);
router.post(
    '/update-ticket-notes',
    secured,
    ensureAuthenticated,
    updateTicketNotes
);
router.get(
    '/ticket-archive/:id',
    secured,
    ensureAuthenticated,
    getTicketArchivebyId
);
router.post(
    '/add-deviation-ticket',
    secured,
    ensureAuthenticated,
    addDeviationTicket
);
router.get(
    '/deviation-ticket',
    secured,
    ensureAuthenticated,
    getDeviationTicket
);
router.get(
    '/deviation-ticket-list',
    secured,
    ensureAuthenticated,
    getDeviationTicketList
);
router.post(
    '/deviation-ticket-list-filter-main',
    secured,
    ensureAuthenticated,
    postDeviationTicketListFilterMain
);
router.post(
    '/deviation-ticket-list-filter',
    secured,
    ensureAuthenticated,
    postDeviationListFilter
);
router.get(
    '/deviation-ticket-view/:id',
    secured,
    ensureAuthenticated,
    getDeviationTicketViewbyId
);
router.post(
    '/update-deviation-ticket',
    secured,
    ensureAuthenticated,
    updateDeviationTicket
);

router.post(
    '/update-deviation-ticket-partial',
    secured,
    ensureAuthenticated,
    updateDeviationTicketPartial
);
router.post(
    '/update-deviation-ticket-notes',
    secured,
    ensureAuthenticated,
    updateDeviationTicketNotes
);
router.get(
    '/deviation-ticket-data/:id',
    secured,
    ensureAuthenticated,
    getDeviationTicketDatabyId
);
router.get(
    '/deviation-ticket-archive/:id',
    secured,
    ensureAuthenticated,
    getDeviationTicketArchivebyId
);
module.exports = router;
