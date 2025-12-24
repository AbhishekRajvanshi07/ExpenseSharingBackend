const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/group.controller');
const { deleteGroupIfSettled } = require('../controllers/group.delete.controller');

router.delete('/:groupId', deleteGroupIfSettled);  // DELETE /api/groups/:groupId
router.post('/', ctrl.createGroup);               // POST /api/groups
router.post('/:groupId/add-member', ctrl.addMember); // POST /api/groups/:groupId/add-member
router.get('/', ctrl.listGroups);                 // GET /api/groups
router.get('/:id', ctrl.getGroup);                // GET /api/groups/:id

module.exports = router;
