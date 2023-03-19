const dbConect = require("./connection/connection")
const inquirer = require("Inquirer");
const fs = require("fs");

dbConect.connect((error) => {
    if (error) {
        // throw error
        console.log("Could not connect to database!")
    } else {
        console.log("Success!")
    }
})


// inquirer
// .prompt ([
//     {
//         type: "input",
//         name: "test",
//         message: "This is a test prompt"

//     }
// ])
