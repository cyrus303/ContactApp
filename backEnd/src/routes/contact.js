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
  const reqData = req.body;

  // Read the existing data from the JSON file
  fs.readFile(JsonPath, 'utf8', (readErr, fileData) => {
    if (readErr) {
      console.error('Error reading the file:', readErr);
      return res.status(500).send('Error reading the file');
    }

    try {
      let myObject = JSON.parse(fileData);

      // Ensure myObject is an array or initialize it as an empty array
      if (!Array.isArray(myObject)) {
        myObject = [];
      }

      myObject.push(reqData);

      // Write the updated data back to the JSON file
      fs.writeFile(JsonPath, JSON.stringify(myObject), (writeErr) => {
        if (writeErr) {
          console.error('Error writing to the file:', writeErr);
          return res.status(500).send('Error writing to the file');
        }

        console.log('New data added');
        res.status(201).send(reqData);
      });
    } catch (parseErr) {
      console.error('Error parsing JSON data:', parseErr);
      res.status(400).send('Invalid JSON data');
    }
  });
});

module.exports = router;
