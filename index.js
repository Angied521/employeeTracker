const mysql = require('mysql')
const inquirer = require('inquirer')
// const cTable = require('console.table')

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  database: 'employee_tracker',
  password: 'root'
})

connection.connect(function (err) {
  if (err) throw err

  // console.log('connected as id ' + connection.threadId)
  runSearch()
})

// asks questions

function runSearch () {
  inquirer
    .prompt({

      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'View Employees by Manager',
        'View Employees by Department',
        'View Emplyee by Role',
        'Add Employee',
        'Remove Employee',
        'Update Employee Role',
        'Update Employee Manager',
        'EXIT']

    })
    .then(function (answer) {
      console.log(answer)
      switch (answer.action) {
        case 'View All Employees':
          employeeSearch()
          break

        case 'View Employees by Manager':
          managerSearch()
          break

        case 'View Employees by Department':
          departmentSearch()
          break

        case 'Find employees by role':
          roleSearch()
          break

        case 'Add Employees':
          updateEployee()
          break

        case 'Remove Employee':
          removeEmployee()
          break

        case 'Update Employee Role':
          updateRole()
          break

        case 'Update Employee Manager':
          updateManager()
          break

        case 'exit':
          connection.end()
          break
      }
    })
}

// all employee search
function employeeSearch () {
  var query = 'SELECT * FROM employee'
  connection.query(query, function (err, res) {
    if (err) throw err
    console.table(res)

    runSearch()
  })
}

// search by manager
function managerSearch () {
  connection.query('SELECT * FROM role WHERE title = "manager"', function (err, res) {
    if (err) throw err
    console.table(res)

    runSearch()
  })
}

// department search
function departmentSearch () {
  inquirer
    .prompt({
      type: 'list',
      name: 'choice',
      message: 'View Employees by Department?',
      choices: ['Human Resources',
        'Accounting',
        'Marketing',
        'IT',
        'Sales'
      ]
    })
    .then(function (answer) {
      console.log(answer.choice)
      // retreive id associated with role user chose
      // use id to search employee table that matches that role id
      connection.query('SELECT * FROM department WHERE ?', { name: answer.choice }, function (err, _res) {
        if (err) throw err

        // connection.query('SELECT * FROM employee HAVING role_id ?', { name: answer.choice }, function (err, _res) {
        //   if (err) throw err

        // console.log(
        //   'first_name: ' +
        //   res[0].first_name +
        //   ' || last_name: ' +
        //   res[0].last_name +
        //   ' || department: ' +
        //   res[0].department +
        //   ' || role: ' +
        //   res[0].role

        runSearch()
      })
    })
}

// role search by title
function roleSearch () {
  inquirer
    .prompt({
      type: 'list',
      name: 'choice',
      message: 'Find employees by role?',
      choices: ['Supervisor',
        'Accountant',
        'Marketing',
        'Sales',
        'Manager'
      ]
    })
    .then(function (answer) {
      console.log(answer.choice)
      connection.query('SELECT * role WHERE ?', { title: answer.choice }, function (err, res) {
        if (err) throw err
        console.log(
          'first_name: ' +
          res[0].first_name +
          ' || last_name: ' +
          res[0].last_name +
          ' || department: ' +
          res[0].department +
          ' || role: ' +
          res[0].role
        )
        runSearch()
      })
    })
}
