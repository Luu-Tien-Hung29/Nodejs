const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const path = require('path');
const app = express();
const port = 3000;
const route = require('./routes');

app.use(morgan('combined'));

app.engine(
  'hbs',
  handlebars.engine({
    extname: '.hbs',
  }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'reSource/views'));

// routes init
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port localhost:${port}`);
});
