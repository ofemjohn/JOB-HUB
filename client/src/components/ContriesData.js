const fs = require('fs');

const apiUrl = 'https://restcountries.com/v3.1/all';

const fetchData = async () => {
  try {
    // Dynamically import node-fetch using import()
    const fetchModule = await import('node-fetch');
    const fetch = fetchModule.default;
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    const countryData = data.map((country) => ({
      name: country.name.common,
      code: country.cca2,
    }));

    // Save the data to a JSON file in your project directory
    fs.writeFileSync('countriesData.json', JSON.stringify(countryData, null, 2));
    console.log('Countries data fetched and saved to countriesData.json');
  } catch (error) {
    console.error('Error fetching countries:', error);
  }
};

fetchData();
