const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const stripe = require('stripe')('sk_test_51IIAwuDoiJ6oH5bsjygtC4YDZ2LMrzjwDXeFGOIlY7Cn0feHFxfDpVbQDz96mIC0xmHQayzwlb71fPRAI67menkv003BJCHgAS'); // Add your Secret Key Here

const app = express();

// This will make our form data much more useful
app.use(bodyParser.urlencoded({ extended: true }));

// This will set express to render our views folder, then to render the files as normal html
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, './views')));

app.post("/charge", (req, res) => {
    try {
      stripe.customers
        .create({
          name: req.body.name,
          email: req.body.email,
          source: req.body.stripeToken,
        })
        .then(customer =>
          stripe.charges.create({
            amount: req.body.amount * 100,
            currency: "usd",
            customer: customer.id,
            receipt_email: customer.email,
            description: 'Software development services',
            shipping: {
              name: 'Jenny Rosen',
              address: {
                line1: '510 Townsend St',
                postal_code: '98140',
                city: 'San Francisco',
                state: 'CA',
                country: 'US',
              },
            },

          })
        )
        .then(() => res.render("completed.html"))
        .catch(err => console.log(err));
    } catch (err) {
      res.send(err);
    }
  });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server is running...'));