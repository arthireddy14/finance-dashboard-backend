const mongoose = require("mongoose");
const Record = require("../models/Record");

// --------------------
// Monthly Financial Analysis
// --------------------

exports.getMonthlyAnalytics = async (req, res) => {
    try {
        const matchFilter = {};

        // Admin can analyze all records.
        // Analyst can analyze only their own records.
        if (req.user.role !== "admin") {
            matchFilter.user = new mongoose.Types.ObjectId(req.user.id);
        }

        const monthlyData = await Record.aggregate([
            {
                $match: matchFilter
            },
            {
                $group: {
                    _id: {
                        month: {
                            $dateToString: {
                                format: "%Y-%m",
                                date: "$date"
                            }
                        },
                        type: "$type"
                    },
                    total: {
                        $sum: "$amount"
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $group: {
                    _id: "$_id.month",
                    income: {
                        $sum: {
                            $cond: [
                                { $eq: ["$_id.type", "income"] },
                                "$total",
                                0
                            ]
                        }
                    },
                    expense: {
                        $sum: {
                            $cond: [
                                { $eq: ["$_id.type", "expense"] },
                                "$total",
                                0
                            ]
                        }
                    },
                    incomeCount: {
                        $sum: {
                            $cond: [
                                { $eq: ["$_id.type", "income"] },
                                "$count",
                                0
                            ]
                        }
                    },
                    expenseCount: {
                        $sum: {
                            $cond: [
                                { $eq: ["$_id.type", "expense"] },
                                "$count",
                                0
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id",
                    income: 1,
                    expense: 1,
                    incomeCount: 1,
                    expenseCount: 1,
                    netBalance: {
                        $subtract: ["$income", "$expense"]
                    }
                }
            },
            {
                $sort: {
                    month: 1
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            data: monthlyData
        });
    } catch (error) {
        console.error("Monthly analytics error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch monthly analytics"
        });
    }
};

// --------------------
// Category Financial Analysis
// --------------------

exports.getCategoryAnalytics = async (req, res) => {
    try {
        const matchFilter = {
            type: "expense"
        };

        // Admin can analyze all expense records.
        // Analyst can analyze only their own expense records.
        if (req.user.role !== "admin") {
            matchFilter.user = new mongoose.Types.ObjectId(req.user.id);
        }

        const categoryData = await Record.aggregate([
            {
                $match: matchFilter
            },
            {
                $group: {
                    _id: "$category",
                    totalExpense: {
                        $sum: "$amount"
                    },
                    recordCount: {
                        $sum: 1
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    totalExpense: 1,
                    recordCount: 1
                }
            },
            {
                $sort: {
                    totalExpense: -1
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            data: categoryData
        });
    } catch (error) {
        console.error("Category analytics error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch category analytics"
        });
    }
};
