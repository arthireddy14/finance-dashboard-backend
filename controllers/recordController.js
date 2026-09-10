const mongoose = require("mongoose");

const Record = require("../models/Record");

// --------------------
// Get Records
// --------------------

exports.getRecords = async (req, res) => {
    try {
        const {
            type,
            category,
            page = 1,
            limit = 10
        } = req.query;

        // Convert pagination values to numbers
        const pageNumber = Math.max(
            parseInt(page, 10) || 1,
            1
        );

        const limitNumber = Math.min(
            Math.max(parseInt(limit, 10) || 10, 1),
            100
        );

        const skip = (pageNumber - 1) * limitNumber;

        // --------------------
        // Build filter
        // --------------------

        const filter = {};

        // Admin can view all records.
        // Other users can view only their own records.
        if (req.user.role !== "admin") {
            filter.user = req.user.id;
        }

        // Optional type filter
        if (type) {
            if (!["income", "expense"].includes(type)) {
                return res.status(400).json({
                    success: false,
                    message: "Type must be income or expense"
                });
            }

            filter.type = type;
        }

        // Optional category filter
        if (category) {
            filter.category = category.trim();
        }

        // --------------------
        // Fetch records
        // --------------------

        const [records, totalRecords] = await Promise.all([
            Record.find(filter)
                .sort({ date: -1 })
                .skip(skip)
                .limit(limitNumber),

            Record.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(
            totalRecords / limitNumber
        );

        return res.status(200).json({
            success: true,
            records,
            pagination: {
                currentPage: pageNumber,
                limit: limitNumber,
                totalRecords,
                totalPages
            }
        });

    } catch (error) {
        console.error(
            "Get records error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch records"
        });
    }
};

// --------------------
// Get Dashboard Summary
// --------------------

exports.getSummary = async (req, res) => {
    try {
        // --------------------
        // Build match filter
        // --------------------

        const matchFilter = {};

        // Admin can see summary of all users.
        // Other roles can see only their own summary.
        if (req.user.role !== "admin") {
            matchFilter.user = new mongoose.Types.ObjectId(
                req.user.id
            );
        }

        // --------------------
        // Aggregate summary
        // --------------------

        const summary = await Record.aggregate([
            {
                $match: matchFilter
            },
            {
                $group: {
                    _id: "$type",
                    total: {
                        $sum: "$amount"
                    },
                    count: {
                        $sum: 1
                    }
                }
            }
        ]);

        let totalIncome = 0;
        let totalExpense = 0;
        let incomeCount = 0;
        let expenseCount = 0;

        summary.forEach((item) => {
            if (item._id === "income") {
                totalIncome = item.total;
                incomeCount = item.count;
            }

            if (item._id === "expense") {
                totalExpense = item.total;
                expenseCount = item.count;
            }
        });

        const balance = totalIncome - totalExpense;

        return res.status(200).json({
            success: true,
            summary: {
                totalIncome,
                totalExpense,
                balance,
                incomeCount,
                expenseCount,
                totalRecords:
                    incomeCount + expenseCount
            }
        });

    } catch (error) {
        console.error(
            "Get summary error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch summary"
        });
    }
};

// --------------------
// Create Record
// --------------------

exports.createRecord = async (req, res) => {
    try {
        const {
            amount,
            type,
            category,
            description,
            date
        } = req.body;

        // Validate required fields
        if (
            amount === undefined ||
            !type ||
            !category
        ) {
            return res.status(400).json({
                success: false,
                message: "Amount, type and category are required"
            });
        }

        // Validate amount
        const numericAmount = Number(amount);

        if (
            !Number.isFinite(numericAmount) ||
            numericAmount <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Amount must be a positive number"
            });
        }

        // Validate type
        if (!["income", "expense"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Type must be income or expense"
            });
        }

        // Validate category
        if (category.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Category cannot be empty"
            });
        }

        // Validate date if provided
        if (date && isNaN(new Date(date).getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date"
            });
        }

        const record = await Record.create({
            user: req.user.id,
            amount: numericAmount,
            type,
            category: category.trim(),
            description: description?.trim(),
            date: date || Date.now()
        });

        return res.status(201).json({
            success: true,
            message: "Record created successfully",
            record
        });
    } catch (error) {
        console.error("Create record error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to create record"
        });
    }
};

// --------------------
// Update Record
// --------------------

exports.updateRecord = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid record ID"
            });
        }

        const {
            amount,
            type,
            category,
            description,
            date
        } = req.body;

        // Build update object
        const updates = {};

        if (amount !== undefined) {
            const numericAmount = Number(amount);

            if (
                !Number.isFinite(numericAmount) ||
                numericAmount <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Amount must be a positive number"
                });
            }

            updates.amount = numericAmount;
        }

        if (type !== undefined) {
            if (!["income", "expense"].includes(type)) {
                return res.status(400).json({
                    success: false,
                    message: "Type must be income or expense"
                });
            }

            updates.type = type;
        }

        if (category !== undefined) {
            if (category.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Category cannot be empty"
                });
            }

            updates.category = category.trim();
        }

        if (description !== undefined) {
            updates.description = description.trim();
        }

        if (date !== undefined) {
            if (isNaN(new Date(date).getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid date"
                });
            }

            updates.date = date;
        }

        // IMPORTANT:
        // Only update a record belonging to the logged-in user.
        const record = await Record.findOneAndUpdate(
            {
                _id: id,
                user: req.user.id
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Record not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Record updated successfully",
            record
        });
    } catch (error) {
        console.error("Update record error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to update record"
        });
    }
};

// --------------------
// Delete Record
// --------------------

exports.deleteRecord = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid record ID"
            });
        }

        // Admin can delete any record
        const record = await Record.findByIdAndDelete(id);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Record not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Record deleted successfully"
        });
    } catch (error) {
        console.error("Delete record error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to delete record"
        });
    }
};