const dbConect = require("./config/connection");
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
            "View all Employees",
            "Add Employee",
            "Update Employee Role",
            "View All Roles",
            "Add Role",
            "View All Departments",
            "Add Department",
            "Quit"
        ]
    }
])
.then((answers) => {
    const {choices} = answers;

    if (choices === "View all Employees") {
        viewAllEmp();
    } else if (choices === "Add Employee") {
        addEmp();
    } else if (choices === "Update Employee Role") {
        updateEmp();
    } else if (choices === "View All Roles") {
        viewRoles();
    } else if (choices === "Add Role") {
        
    } else if (choices === "View All Departments") {
        
    } else if (choices === "Add Department") {
        
    } else if (choices === "Quit") {
        dbConect.end();
    } else {
        return 
    }
});
};

const viewAllEmp = () => {
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
    });
};

const addEmp = () => {
    inquirer.prompt ([
        {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?",
            validate: (answer) => {
                if(answer === "") {
                    return "Please enter a valid name."
                } return true
            }
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?",
            validate: (answer) => {
                if(answer === "") {
                    return "Please enter a valid last name."
                } return true
            }
        },
    ])
    .then(answer => {
        const emp = [answer.firstName, answer.lastName]
        const mysqlrole = "SELECT roles.id, roles.title FROM roles";
        dbConect.query(mysqlrole, (err, data) => {
            if(err) {
                throw err
            }
        const roles = data.map(({ id, title }) => ({ name: title, value: id}));
        inquirer.prompt([
            {
                type: "list",
                name: "role",
                message: "What is the employees role?",
                choices: roles
            }
        ])
        .then(roleAnswer => {
            const choice = roleAnswer.role;
            emp.push(choice);
            const manager = "SELECT * FROM employee";
            dbConect.query(manager, (err, data) => {
                if(err){
                    throw err
                }
            const sqlManager = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
            inquirer.prompt([
                {
                    type: "list",
                    name: "manager",
                    message: "Who is the manager of the employee?",
                    choices: sqlManager
                }
            ])
            .then(answer => {
            const manager = answer.manager;
            emp.push(manager);
            const sql = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
            dbConect.query(sql, emp, (err) => {
                if(err) {
                    throw err
                }
            console.log("Employee was successfully added!")
            viewAllEmp();    
            });
        });
        }) ;
         });
         });
        });
    };

    const updateEmp = () => {
        let sql = `SELECT employee.id, employee.first_name, employee.last_name, roles.id AS "role_id"
                    FROM employee, roles, department WHERE department.id = roles.department_id AND roles.id = employee.role_id`;
        dbConect.query(sql, (err, res) => {
        let empArray = [];
        res.forEach((employee) => {
            empArray.push(`${employee.first_name} ${employee.last_name}`)
        });   
        // });

        let mysql = "SELECT roles.id, roles.title FROM roles";
        dbConect.query(mysql, (err, res) => {
        let rolesArray = [];    
        res.forEach((roles) => {
            {rolesArray.push(roles.title)}
        });
        inquirer.prompt([
            {
                type: "list",
                name: "updEmp",
                message: "Which employee do you want to update their role?",
                choices: empArray
            },
            {
                type: "list",
                name: "newRole",
                message: "What is their new role?",
                choices: rolesArray
            }
        ])
        .then((answer) => {
            let newRole, empID;
            res.forEach((roles) => {
                if(answer.newRole === roles.title){
                    newRole = roles.id
                }
            });
            res.forEach((employee) => {
                if(answer.updateEmp === `${employee.first_name} ${employee.last_name}`) {
                    empID = employee.id;
                }
            });
    
        let sql = "UPDATE employee SET employee.role_id = ? WHERE employee.id =?";
        dbConect.query(sql, [newRole, empID], (err) => {
            console.log("Updated Employee's Role!");
            prompt();
        })     
    
        })    
        });
    });
  };

  const viewRoles = () => {
    const sql = `SELECT roles.id, roles.title, department.name AS department
                FROM roles INNER JOIN department on roles.department_id = department.id`;
    dbConect.query(sql, (err, res) => {
        if(err) {
            throw err
        }
        res.forEach((role) => {
        console.log(role.title)
        })
        prompt();
    })
  }



