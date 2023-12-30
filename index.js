
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const Manager = require('./lib/Manager');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');
const render = require('./src/page-template');

const OUTPUT_DIR = path.resolve(__dirname, 'output');
const outputPath = path.join(OUTPUT_DIR, 'team.html');

const teamMembers = [];

const createManager = async () => {
  console.log('Please enter the manager\'s information:');
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Manager\'s name:',
    },
    {
      type: 'input',
      name: 'id',
      message: 'Manager\'s employee ID:',
    },
    {
      type: 'input',
      name: 'email',
      message: 'Manager\'s email address:',
    },
    {
      type: 'input',
      name: 'officeNumber',
      message: 'Manager\'s office number:',
    },
  ]);

  const manager = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
  teamMembers.push(manager);

  console.log('Manager added successfully!\n');
};

const createEmployee = async (role) => {
  console.log(`Please enter the ${role.toLowerCase()}'s information:`);
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: `${role}'s name:`,
    },
    {
      type: 'input',
      name: 'id',
      message: `${role}'s employee ID:`,
    },
    {
      type: 'input',
      name: 'email',
      message: `${role}'s email address:`,
    },
  ]);

  if (role === 'Engineer') {
    const github = await inquirer.prompt({
      type: 'input',
      name: 'github',
      message: 'Engineer\'s GitHub username:',
    });

    const engineer = new Engineer(answers.name, answers.id, answers.email, github.github);
    teamMembers.push(engineer);
  } else if (role === 'Intern') {
    const school = await inquirer.prompt({
      type: 'input',
      name: 'school',
      message: 'Intern\'s school:',
    });

    const intern = new Intern(answers.name, answers.id, answers.email, school.school);
    teamMembers.push(intern);
  }

  console.log(`${role} added successfully!\n`);
};

const init = async () => {
  await createManager();

  let addEmployee = true;

  while (addEmployee) {
    const { choice } = await inquirer.prompt({
      type: 'list',
      name: 'choice',
      message: 'What would you like to do next?',
      choices: ['Add Engineer', 'Add Intern', 'Finish building the team'],
    });

    switch (choice) {
      case 'Add Engineer':
        await createEmployee('Engineer');
        break;
      case 'Add Intern':
        await createEmployee('Intern');
        break;
      case 'Finish building the team':
        addEmployee = false;
        break;
      default:
        break;
    }
  }

  const html = render(teamMembers);
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }
  fs.writeFileSync(outputPath, html);

  console.log(`Team HTML generated successfully! Check the file at ${outputPath}`);
};

init();
