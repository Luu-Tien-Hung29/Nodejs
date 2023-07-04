const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const path = require('path');
const cors = require('cors')
const db = require('./config/db/index')
const route = require('./routes');
const app = express();
const port = 5000;





app.use(express.json());
require("dotenv").config();

app.use(cors({
    origin: '*'
}));
app.use(morgan('combined'));

// connect
db.connect()


app.engine(
    'hbs',
    handlebars.engine({
        extname: '.hbs',
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'reSource', 'views'));

// routes init
route(app);


app.listen(port, () => {
    console.log(`Listening on port localhost:${port}`);
});
