import axios from "axios";
import React from "react";

import './App.css';
import ChartTable from "./ChartTable";
import constants from "./constants";

const parse = (currentPlanets) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(currentPlanets, "text/html");
  const table = document.getElementsByTagName('table')[0].children[0].children;
  const result = [];
  for (let i = 1; i <= 12; i++) {
    const tr = table[i]
    const name = tr.children[1].innerHTML;
    const degrees = tr.children[2].innerHTML;
    const sign = tr.children[3].children[0].alt;
    const minutesSecondsRetrograde = tr.children[4].innerHTML;
    const split1 = minutesSecondsRetrograde.split('\'');
    const split2 = split1[1].split('"');
    const minutes = split1[0];
    const seconds = split2[0];
    const retrograde = split2[1] === 'r';
    result.push({name, degrees, sign, minutes, seconds, retrograde});
  }
  return result;
}

function App() {
  const [data, setData] = React.useState([]);

  const getCurrentPlanets = () => {
    // axios.get(constants.getPlanetsUrl).then((response) => {
    //   console.log('got PLANETS response:');
    //   console.log(response.data);
    //   setData(parse(response.data));
    // });
    setData(parse(constants.currentPlanetsConst));
  };

  const getChart = () => {
    axios.get(constants.getChartUrl).then((response) => {
      console.log('got CHART response:');
      console.log(response.data);
      // const div = document.createElement('div');
      // div.innerHTML = response.data;
      document.getElementById('chartElement').innerHTML = response.data;
      const image = document.getElementById('chartElement').children[1].children[0];
      console.log(image);
      image.src = 'http://astro.com' + image.src.substring(21);
    });
  }

  return (
    <div className="">
      <header className="App App-header">
        <p>
          Astro1
        </p>
        <button onClick={getCurrentPlanets}>Get current planets</button>
        <button onClick={getChart}>Get chart</button>

      </header>
      <div width="100%" style={{display: 'flex', justifyContent: 'space-evenly', marginTop: '20px'}}>
        <ChartTable chart={data} title="Current planets" />
        <ChartTable chart={constants.chartDataPetr} title="Petr Kratochvíl" />
      </div>
      <div id="chartElement" style={{margin: '20px'}}></div>
    </div>
  );
}

export default App;
