exports.settleDue = async (req, res) => {
  try {
    const { groupId, from, to, amount } = req.body;

    if (!groupId || !from || !to || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const settlement = await require('../models/Settlement').create({
      group: groupId,
      from,
      to,
      amount
    });

    return res.status(201).json(settlement);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
