const {Router} = require('express');
const router = Router();

const fs = require('fs');
const path = require('path');

const JsonPath = path.join(__dirname, 'contacts.json');

let contactList = [];

fs.readFile(JsonPath, 'utf8', (err, data) => {
  if (err) {
    console.log('Error in reading the file:', err);
    return;
  }
  try {
    const jsonData = JSON.parse(data);
    contactList = jsonData;
  } catch (err) {
    console.log('Error in parsing the JSON data:', err);
  }
});

router.get('/', (req, res) => {
  const {search, sort} = req.query;
  let result = contactList;

  if (search) {
    result = result.filter((element) =>
      element.number.toString().startsWith(search)
    );
  }

  if (sort) {
    if (sort === 'a-z') {
      result = result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'z-a') {
      result = result.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      res.status(400).send('Invalid sort parameter');
      return;
    }
  }

  res.send(result);
});

router.post('/', (req, res) => {
  const data = req.body;
  console.log(data);
  contactList.push(data);
  res.sendStatus(200);
});

module.exports = router;
