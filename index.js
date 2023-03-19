const dbConect = require("./connection/connection")
const inquirer = require("Inquirer");

dbConect.connect((error) => {
    if (error) {
        // throw error
        console.log("Could not connect to database!")
    } else {
        console.log("\nWelcome to Employee Tracker!\n")
        prompt();
    }
})

const prompt = () => {
    inquirer.prompt ([
    {
        name: "choices",
        type: "list",
        message: "Select an option",
        choices: [
            "View all Employees"
        ]
    }
])
.then((answers) => {
    const {choices} = answers;

    if (choices === "View all Employees") {
        viewAllEmployees();
    } else {
        return 
    }
});
};

const viewAllEmployees = () => {
    let mysql = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS "department", roles.salary
                FROM employee, roles, department
                WHERE department.id = roles.department_id AND roles.id = employee.role_id`;
    dbConect.query(mysql, (err, res) => {
        if (err) {
            throw err
        } else {
            console.log(res);
        }
        prompt();
    })
}


