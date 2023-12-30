const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");

const team = [];

function createManager() {
  console.log("Please enter the manager's information:");
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: "Manager's name:",
      },
      {
        type: 'input',
        name: 'id',
        message: "Manager's ID:",
      },
      {
        type: 'input',
        name: 'email',
        message: "Manager's email:",
      },
      {
        type: 'input',
        name: 'officeNumber',
        message: "Manager's office number:",
      },
    ])
    .then((answers) => {
      const manager = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
      team.push(manager);
      createTeam();
    });
}

function createTeam() {
  console.log('Select the next team member to add:');
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'Choose a team member to add:',
        choices: ['Engineer', 'Intern', 'Finish building the team'],
      },
    ])
    .then((answers) => {
      if (answers.choice === 'Engineer') {
        createEngineer();
      } else if (answers.choice === 'Intern') {
        createIntern();
      } else {
        renderHTML();
      }
    });
}

function createEngineer() {
  console.log("Please enter the engineer's information:");
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: "Engineer's name:",
      },
      {
        type: 'input',
        name: 'id',
        message: "Engineer's ID:",
      },
      {
        type: 'input',
        name: 'email',
        message: "Engineer's email:",
      },
      {
        type: 'input',
        name: 'github',
        message: "Engineer's GitHub username:",
      },
    ])
    .then((answers) => {
      const engineer = new Engineer(answers.name, answers.id, answers.email, answers.github);
      team.push(engineer);
      createTeam();
    });
}

function createIntern() {
  console.log("Please enter the intern's information:");
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: "Intern's name:",
      },
      {
        type: 'input',
        name: 'id',
        message: "Intern's ID:",
      },
      {
        type: 'input',
        name: 'email',
        message: "Intern's email:",
      },
      {
        type: 'input',
        name: 'school',
        message: "Intern's school:",
      },
    ])
    .then((answers) => {
      const intern = new Intern(answers.name, answers.id, answers.email, answers.school);
      team.push(intern);
      createTeam();
    });
}

function renderHTML() {
  const html = render(team);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }

  fs.writeFile(outputPath, html, (err) => {
    if (err) throw err;
    console.log('Team HTML file has been created!');
  });
}

createManager();
