const db = require('../config/db');

exports.getRiskAnalysis = async (req, res) => {
    try {
        const [projects] = await db.query('SELECT * FROM projects');
        // Mock progress fetch
        // In a real app, join with project_progress table

        const analysis = projects.map(p => {
            const budgetUsedPercent = (p.spent / p.budget) * 100;
            // Mock progress - ideally this comes from DB
            const progress = 50;

            let riskScore = 0;
            let riskLevel = 'Low';

            if (budgetUsedPercent > progress + 20) {
                riskScore += 50;
            }

            if (budgetUsedPercent > 90 && progress < 80) {
                riskScore += 30;
            }

            if (riskScore > 60) riskLevel = "Critical";
            else if (riskScore > 30) riskLevel = "High";
            else riskLevel = "Medium";

            return {
                projectId: p.id,
                projectName: p.name,
                riskScore,
                riskLevel
            };
        });

        res.json(analysis);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
