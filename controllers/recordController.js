const Record = require('../models/Record');

// CREATE RECORD
exports.createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    const newRecord = new Record({
      user: req.user.id,
      amount,
      type,
      category,
      date,
      notes
    });

    await newRecord.save();

    res.status(201).json({
      success:true,
      message: "Record created",
      record: newRecord
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ 
        success:false,
        message: "Error creating record" });
  }
};
// GET ALL RECORDS
exports.getRecords = async (req, res) => {
  try {
    const records = await Record.find({ user: req.user.id });

    res.json(records);

  } catch (err) {
    res.status(500).json({ success:false,
        message: "Error fetching records" });
  }
};
// GET RECORDS WITH FILTER
exports.getRecords = async (req, res) => {
  try {
    const { type, category } = req.query;

    let filter = { user: req.user.id };

    if (type) filter.type = type;
    if (category) filter.category = category;

    const records = await Record.find(filter);

    res.json(records);

  } catch (err) {
    res.status(500).json({ 
        success:false,
        message: "Error fetching records" });
  }
};
// UPDATE RECORD
exports.updateRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ 
        success:false,
        message: "Record not found" });
    }

    // optional: restrict to owner
    if (record.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updated = await Record.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ 
        success:false,
        message: "Error updating record" });
  }
};
// DELETE RECORD
exports.deleteRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ 
        success:false,
        message: "Record not found" });
    }

    if (record.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await Record.findByIdAndDelete(req.params.id);

    res.json({ success:true,
        message: "Record deleted" });

  } catch (err) {
    res.status(500).json({ 
        success:false,
        message: "Error deleting record" });
  }
};
// DASHBOARD SUMMARY
exports.getSummary = async (req, res) => {
  try {
    const records = await Record.find({ user: req.user.id });

    let income = 0;
    let expense = 0;

    records.forEach(r => {
      if (r.type === 'income') income += r.amount;
      else expense += r.amount;
    });

    res.json({
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
      totalRecords: records.length
    });

  } catch (err) {
    res.status(500).json({ 
        success:false,
        message: "Error generating summary" });
  }
};