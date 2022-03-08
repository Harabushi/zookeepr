const express = require('express');
const PORT = process.env.PORT || 3001;
// I think this  bracket notation around animals kind of takes it out of being JSON
const { animals } = require('./data/animals');

const app = express();

function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  // Note that we save the animalsArray as filteredResults here:
  let filteredResults = animalsArray;

  if (query.personalityTraits) {
    // Save personalityTraits as a dedicated array.
    // If personalityTraits is a string, place it into a new array and save.
    if (typeof query.personalityTraits === 'string') {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    // Loop through each trait in the personalityTraits array:
    personalityTraitsArray.forEach(trait => {
      // Check the trait against each animal in the filteredResults array.
      // Remember, it is initially a copy of the animalsArray,
      // but here we're updating it for each trait in the .forEach() loop.
      // For each trait being targeted by the filter, the filteredResults
      // array will then contain only the entries that contain the trait,
      // so at the end we'll have an array of animals that have every one 
      // of the traits when the .forEach() loop is finished.
      /* My Notes:
      * The filter method filters for stuff to add to the "new" filteredResults
      * array, this one is filtering for any of the animals in the array that
      * have the queried personality trait. It is checking if the trait is in
      * the personality trait section of the animal object, the indexOf method
      * returns either the index of the searched parameter in the array(which is 
      * what the personalityTrait section of the animal object is) or -1 if it's 
      * not there. So filtering by !== -1 leaves only the animals with the trait
      */
      filteredResults = filteredResults.filter(
        animal => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }

  if (query.diet) { 
    filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
  }
  if (query.species) {
    filteredResults = filteredResults.filter(animal => animal.species === query.species);
  }
  if (query.name) {
    filteredResults = filteredResults.filter(animal => animal.name === query.name);
  }
  return filteredResults;
}

function findById(id, animalsArray) {
  const result = animalsArray.filter(animal => animal.id === id)[0];
  // not sure why this wouldn't return an empty array
  return result;
}

app.get('/api/animals', (req, res) => {
  // We need this to be let, not const
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results)
});

app.get('/api/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);

  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});



app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});