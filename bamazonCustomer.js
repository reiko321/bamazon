// pacakges used
let mysql = require('mysql');
let inquirer = require('inquirer');
let Table = require('cli-table');

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "", //Your username
    password: "", //Your password
    database: "bamazon_db"
});

function displayAll() {
    //show all products from database.
    connection.query('SELECT * FROM Products', function (error, response) {
        if (error) { console.log(error) };

        let displayTable = new Table({
            //catagories of table
            head: ['Item ID', 'Product Name', 'Department', 'Price', 'Quantity'],
            //set widths of columns
            colWidths: [10, 35, 18, 10, 10]
        });
        //for each row of the loop
        for (i = 0; i < response.length; i++) {
            //display the table values
            displayTable.push(
                [response[i].item_id, response[i].product_name, response[i].department_name, response[i].price, response[i].stock_quantity]
            );
        }
        
        console.log(displayTable.toString());
        purchase();
    });

};

function purchase() {
    //get item ID and desired quantity from user. Pass to purchase from Database
    inquirer.prompt([

        {
            name: "id",
            type: "input",
            message: "What is the item ID number of the item you wish to purchase?"
        }, {
            name: 'quantity',
            type: 'input',
            message: "How many would you like to buy?"
        },

    ]).then(function (answers) {

        let orderQuantity = answers.quantity;
        let idDesired = answers.id;

        connection.query('SELECT * FROM products WHERE item_id = ' + idDesired, function (error, response) {
            if (error) { console.log(error) };

            if (idDesired <= 10) {
                purchaseFromDatabase(idDesired, orderQuantity);
            } else {
                console.log("****No Such Item****");
                displayAll();
            };

        });

    });

};

function purchaseFromDatabase(idDesired, orderQuantity) {
    //check quantity of desired purchase. inform user "Insufficient quantity" if not enough for purchase. Else process order and update table.
    connection.query('SELECT * FROM products WHERE item_id = ' + idDesired, function (error, response) {
        if (error) { console.log(error) };

        //if in stock
        if (orderQuantity <= response[0].stock_quantity) {
            //calculate cost
            let totalCost = response[0].price * orderQuantity;
            //inform user
            console.log("****Purchase Successful****");
            console.log("Your total cost for " + orderQuantity + " " + response[0].product_name + " is " + totalCost + ".");
            console.log("Continue Shopping?");
            //update database, minus purchased quantity
            connection.query('UPDATE products SET stock_quantity = stock_quantity - ' + orderQuantity + ' WHERE item_id = ' + idDesired);
        } else {
            console.log("Insufficient quantity of " + response[0].product_name + " to fulfill your order.");
        };
        displayAll();
    });

};

displayAll();