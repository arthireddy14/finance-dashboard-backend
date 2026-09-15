const Record = require("../models/Record");

// CREATE RECORD - Admin only
exports.createRecord = async (req, res) => {
    try {
        const { amount, type, category, date, description } = req.body;

        const record = await Record.create({
            createdBy: req.user.id,
            amount,
            type,
            category,
            date,
            description
        });

        res.status(201).json({
            success: true,
            message: "Financial record created successfully",
            record
        });
    } catch (err) {
        console.error(err);

        res.status(400).json({
            success: false,
            message: err.message || "Error creating record"
        });
    }
};


// GET RECORDS - All authenticated roles
exports.getRecords = async (req, res) => {
    try {
        const {
            type,
            category,
            page = 1,
            limit = 10
        } = req.query;

        const filter = {};

        if (type) {
            filter.type = type.toLowerCase();
        }

        if (category) {
            filter.category = category;
        }

        const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
        const limitNumber = Math.min(
            Math.max(parseInt(limit, 10) || 10, 1),
            100
        );

        const skip = (pageNumber - 1) * limitNumber;

        const [records, totalRecords] = await Promise.all([
            Record.find(filter)
                .populate("createdBy", "name email role")
                .sort({ date: -1 })
                .skip(skip)
                .limit(limitNumber),

            Record.countDocuments(filter)
        ]);

        res.json({
            success: true,
            page: pageNumber,
            limit: limitNumber,
            totalRecords,
            totalPages: Math.ceil(totalRecords / limitNumber),
            records
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Error fetching records"
        });
    }
};


// UPDATE RECORD - Admin only
exports.updateRecord = async (req, res) => {
    try {
        const updatedRecord = await Record.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate("createdBy", "name email role");

        if (!updatedRecord) {
            return res.status(404).json({
                success: false,
                message: "Record not found"
            });
        }

        res.json({
            success: true,
            message: "Financial record updated successfully",
            record: updatedRecord
        });

    } catch (err) {
        console.error(err);

        res.status(400).json({
            success: false,
            message: err.message || "Error updating record"
        });
    }
};


// DELETE RECORD - Admin only
exports.deleteRecord = async (req, res) => {
    try {
        const deletedRecord = await Record.findByIdAndDelete(req.params.id);

        if (!deletedRecord) {
            return res.status(404).json({
                success: false,
                message: "Record not found"
            });
        }

        res.json({
            success: true,
            message: "Financial record deleted successfully"
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Error deleting record"
        });
    }
};


// DASHBOARD SUMMARY - All authenticated roles
exports.getSummary = async (req, res) => {
    try {
        const result = await Record.aggregate([
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]);

        let totalIncome = 0;
        let totalExpense = 0;
        let incomeRecords = 0;
        let expenseRecords = 0;

        result.forEach(item => {
            if (item._id === "income") {
                totalIncome = item.total;
                incomeRecords = item.count;
            }

            if (item._id === "expense") {
                totalExpense = item.total;
                expenseRecords = item.count;
            }
        });

        res.json({
            success: true,
            totalIncome,
            totalExpense,
            netBalance: totalIncome - totalExpense,
            totalRecords: incomeRecords + expenseRecords,
            incomeRecords,
            expenseRecords
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Error generating summary"
        });
    }
};