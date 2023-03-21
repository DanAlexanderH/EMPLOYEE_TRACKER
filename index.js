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
        addRole();
    } else if (choices === "View All Departments") {
        viewDPT();
    } else if (choices === "Add Department") {
        addDPT();
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
    });
  };

  const addRole = () => {
    const sql = `SELECT * FROM department`;
    dbConect.query(sql, (err, res) => {
        const deptArray = [];
        res.forEach((department) =>{deptArray.push(department.name);});
        deptArray.push("Create Department");
        inquirer.prompt([
            {
               type: "list",
               name: "dptName",
               message: "Which department does this role reside in?",
               choices:  deptArray
            
            }
        ])
        .then((answer) => {
            if(answer.dptName === "Create Department") {
                this.addDPT();
            } else {
                addRoleResume();
            }
        });
        
        const addRoleResume = (dptData) => {
        inquirer.prompt([
            {
                type: "input",
                name: "newRole",
                message: "What is the name of the new Role?",
                validate: (answer) => {
                    if(answer === "") {
                        return "Please add a name to the new role."
                    }
                }
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary of this role?",
                validate: (answer) => {
                    if(isNaN(answer)) {
                        return "Please enter the salary of this role."
                    }
                }
            }
        ])
        .then((answer) => {
            const newRole = answer.newRole;
            let dptID;

            res.forEach((department) => {
                if (dptData.dptName === department.name) {dptID = department.id}
            });
            let sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
            let x = [newRole, answer.salary, dptID];
            
            dbConect.query(sql, x, (err) => {
                if(err) {
                    throw err
                }
                console.log("Created role succesfully!");
                viewRoles();
            });
        });
        };
      });
  };

  const viewDPT = () => {
    const sql = `SELECT department.id AS id, department.name AS department FROM department`;
    dbConect.query(sql, (err, res) => {
        console.log(res)
    });
  };

  const addDPT = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "newDPT",
            message: "What is the name of this new department?",
            validate: (answer) => {
                if(answer === ""){
                    return "Please enter a valid name for the department."
                }
            }
        },     
    ])
    .then((answer) => {
        let sql = `INSERT INTO department (name) VALUES (?)`;
        dbConect.query(sql, (err, res) => {
            console.log(answer.newDPT + `was succesfully added!`)
        });
    });
  };


