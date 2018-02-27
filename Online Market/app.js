// Build a server
const express = require('express');
const app = express();

// For parsing value from html in handlebars file
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Getting direction, now __dirname has the direction to this folder.
const path = require('path');
app.use(express.static(path.join(__dirname)));

// Read the jason file
var itemList = require("./itemList.json");

// Using this alarm package to let user know the error.
var alert = require('alert-node')

// Setting handlerbars for rendering other pages.
// The main page is the foundation of all the other handlerbars files.
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Rendering the home page.
app.get('/', function(req, res) {
  res.render('home');
});

// Calling fs package for writing data into the json file.
const fs = require('fs');
const fileName = "./itemList.json";
const file = require(fileName);

app.post('/checkout', function(req, res) {
  // Conditional statements to avoid negative quantity or empty basket.
  if (req.body.orderQuantity0 < 0 ||
      req.body.orderQuantity1 < 0 ||
      req.body.orderQuantity2 < 0 ||
      req.body.orderQuantity3 < 0 ||
      req.body.orderQuantity4 < 0){
    console.log('You cannot order with negative quantity..');
    alert('You cannot order with negative quantity..');
  }
  else if (req.body.orderQuantity0 > itemList.items[0].quantityInStock ||
      req.body.orderQuantity1 > itemList.items[1].quantityInStock ||
      req.body.orderQuantity2 > itemList.items[2].quantityInStock ||
      req.body.orderQuantity3 > itemList.items[3].quantityInStock ||
      req.body.orderQuantity4 > itemList.items[4].quantityInStock){
        console.log('Sorry, the product is out of stock.');
        alert('Sorry, the product is out of stock.');
      }
  else if (req.body.orderQuantity0 == 0 &&
    req.body.orderQuantity0 == 0 &&
    req.body.orderQuantity0 == 0 &&
    req.body.orderQuantity0 == 0 &&
    req.body.orderQuantity0 == 0) {
        console.log('Your shopping basket is empty.');
        alert('Your shopping basket is empty.');
      }
  else {
    // If the user input values are okay, put the input data into our json file.
    // and the data will be used in checkout page for editing or purchasing.
  itemList.result[0].orderQuantity = req.body.orderQuantity0;
  itemList.result[1].orderQuantity = req.body.orderQuantity1;
  itemList.result[2].orderQuantity = req.body.orderQuantity2;
  itemList.result[3].orderQuantity = req.body.orderQuantity3;
  itemList.result[4].orderQuantity = req.body.orderQuantity4;

  // Writing the order quantities into the json file.
  fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
    if (err) return console.log(err);
    // This code will refresh the page with changed values.
    res.render('checkout');
    });
  }
});

app.post('/edit', (req, res) => {
  // Conditional statements to avoid negative quantity or empty basket caused by edited quantity.
  if (Number(req.body.edit0) + Number(itemList.result[0].orderQuantity) >= 0 &&
      Number(req.body.edit1) + Number(itemList.result[1].orderQuantity) >= 0 &&
      Number(req.body.edit2) + Number(itemList.result[2].orderQuantity) >= 0 &&
      Number(req.body.edit3) + Number(itemList.result[3].orderQuantity) >= 0 &&
      Number(req.body.edit4) + Number(itemList.result[4].orderQuantity) >= 0) {

        itemList.result[0].orderQuantity = Number(req.body.edit0) + Number(itemList.result[0].orderQuantity);
        itemList.result[1].orderQuantity = Number(req.body.edit1) + Number(itemList.result[1].orderQuantity);
        itemList.result[2].orderQuantity = Number(req.body.edit2) + Number(itemList.result[2].orderQuantity);
        itemList.result[3].orderQuantity = Number(req.body.edit3) + Number(itemList.result[3].orderQuantity);
        itemList.result[4].orderQuantity = Number(req.body.edit4) + Number(itemList.result[4].orderQuantity);

        // Writing the edited order quantities into the json file.
        fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
           if (err) return console.log(err);
           // This code will refresh the page with changed values.
           res.render('checkout');
        });
      } else if (Number(req.body.edit0) + Number(itemList.result[0].orderQuantity) < 0 ||
                Number(req.body.edit1) + Number(itemList.result[1].orderQuantity) < 0 ||
                Number(req.body.edit2) + Number(itemList.result[2].orderQuantity) < 0 ||
                Number(req.body.edit3) + Number(itemList.result[3].orderQuantity) < 0 ||
                Number(req.body.edit4) + Number(itemList.result[4].orderQuantity) < 0) {
        console.log('Sorry, you cannot order nagative quantity.');
        alert('Sorry, you cannot order nagative quantity.');
      };
});

app.post('/purchase', (req, res) => {
  // Finally, user order quantities will be counted with the data in my json file.
  itemList.items[0].quantityInStock -= itemList.result[0].orderQuantity
  itemList.items[1].quantityInStock -= itemList.result[1].orderQuantity
  itemList.items[2].quantityInStock -= itemList.result[2].orderQuantity
  itemList.items[3].quantityInStock -= itemList.result[3].orderQuantity
  itemList.items[4].quantityInStock -= itemList.result[4].orderQuantity

  fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
     if (err) return console.log(err);
     console.log('Edtting the product quantity in the database.');
     // Rendering the thankyou page.
     res.render('thankyou');
   });
});

app.listen(4000, () => {
    console.log('listening on port 4000!');
});
