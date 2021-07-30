import React, {useEffect, useState} from "react"; 
import { Select, FormControl, MenuItem,  Card, CardContent } from '@material-ui/core'
import './App.css';
import InfoBox from './InfoBox';
import Table from "./Table";
import {sortData} from "./util"
import LineGraph from "./LineGraph";
// import Map from "./Map";
// import "leaflet/dist/leaflet.css";

function App() {

  const [countries, setCountries]= useState([]);
  const [country, setCountry]= useState('worldwide');
  const [countryInfo, setCountryInfo]= useState({});
  const [tableData, setTableData]= useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  // Center of world  
  // useState({ lat: 34.80746, lng: -40.4796 });
  // const [mapZoom, setMapZoom] = useState(3);

  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then((data) => {
      setCountryInfo(data);
    })
  }, []);


  useEffect(()=>{
    const getCountriesData= async()=>{
      // Fetching all the information of covid here 
      await fetch ("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries= data.map((country)=>(
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ));

        const sortedData= sortData(data);
        setTableData(sortedData);
        setCountries(countries);
        // setMapCenter
      });
    };

    getCountriesData();
  }, [] );

  const onCountryChange= async (event) =>{
    // to get the country code when we select it
    const CountryCode= event.target.value;
    // To display country name as we select any particular country 
    setCountry(CountryCode);

    const url= country ==='worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${CountryCode}`

    await fetch(url)
    .then(response => response.json())
    .then(data =>{
      setCountry(CountryCode);
      setCountryInfo(data);
    })

  }


  return (
    <div className="app">

      <div class="app__left">


      <div class="app__header">
        <h1>COVID 19 TRACKER</h1>
        <FormControl class="app__dropdown">
          <Select variant="outlined" onChange={onCountryChange} value={country}>
            {/* To display WorldWide instead of any particular Country  */}
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {
              // Making a dropdown list for all the countries by accessing its value and name
              countries.map((country)=>(
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </div>


      <div className="app__stats">
        <InfoBox class="cases" title="CoronaVirus cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
        <InfoBox class="recovered" title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
        <InfoBox class="deaths" title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths } />
      </div>


      <div className="graph">
        <h2>Recent CoronaVirus Cases WorldWide</h2>
      <LineGraph />
      </div>
  
      {/* <Map 
        center={mapCenter}
        zoom={mapZoom}
      /> */}

      </div>


      <Card className="app__right">
        <CardContent>
          <h3>Live Cases country wise</h3>
          <Table countries={tableData} />
          {/* <LineGraph /> */}
        </CardContent>
      </Card>

    </div>
  );
}

export default App;
