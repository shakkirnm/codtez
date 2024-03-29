const Employee = require("../models/Employee");

module.exports = {
    empIdGenerator: async () => {
        try {
            const totalEmployees = await Employee.countDocuments();
            const empId =  `EMP${totalEmployees + 1}`;
            return empId;
        } catch (error) {
            console.error("Error generating employee ID:", error);
            return null;
        }
    }
}