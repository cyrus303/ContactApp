const express = require('express');
const cors = require('cors');
const contactRoute = require('./routes/contact');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

app.use('/api/contacts', contactRoute);

app.listen(PORT, () => {
  console.log('Server Running on ' + PORT);
});
