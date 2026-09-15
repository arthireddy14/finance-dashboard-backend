const Record = require("../models/Record");


// CATEGORY ANALYTICS
exports.getCategoryAnalytics = async (req, res) => {
    try {
        const analytics = await Record.aggregate([
            {
                $group: {
                    _id: {
                        type: "$type",
                        category: "$category"
                    },
                    totalAmount: {
                        $sum: "$amount"
                    },
                    recordCount: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    totalAmount: -1
                }
            }
        ]);

        res.json({
            success: true,
            data: analytics
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Error generating category analytics"
        });
    }
};


// MONTHLY ANALYTICS
exports.getMonthlyAnalytics = async (req, res) => {
    try {
        const analytics = await Record.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                        type: "$type"
                    },
                    totalAmount: {
                        $sum: "$amount"
                    },
                    recordCount: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]);

        res.json({
            success: true,
            data: analytics
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Error generating monthly analytics"
        });
    }
};