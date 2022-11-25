/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from "react";
import type { Node } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import axios from 'axios';

const App: () => Node = () => {
  const URL_WEATHER = "http://api.openweathermap.org/data/2.5/forecast?q=Jakarta&appid=542ffd081e67f4512b705f89d2a611b2"

  const isDarkMode = useColorScheme() === 'dark';
  const [solution2, setSolution2] = useState([]);
  const [solution1, setSolution1] = useState("");

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    printOutSolution1()
    printOutSolution2()
  }, [])

  printOutSolution1 = () => {
    let output = ""
    for (let i = 1; i <= 100; i++) {
      if (i % 5 == 0 && i % 3 == 0) {
        output = output.concat(`ApaBole`)
      } else if (i % 5 == 0) {
        output = output.concat(`Bole`)
      } else if (i % 3 == 0) {
        output = output.concat(`Apa`)
      } else {
        output = output.concat(`${i}`)
      }
      output = output.concat(`,`)
    }

    setSolution1(output)
  }

  printOutSolution2 = async () => {
    let weatherListText = "Weather Forecast\n"
    await axios.get(URL_WEATHER)
      .then(function (response) {

        if (response.status === 200) {
          const weatherList = []
          response.data.list.map(item => {
            const itemDate = new Date(item.dt_txt)

            let wd = new Intl.DateTimeFormat('en', { weekday: 'short' }).format(itemDate);
            let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(itemDate);
            let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(itemDate);
            let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(itemDate);
            const celsiusValue = (item?.main?.temp - 273.15).toFixed(2)

            if (weatherList.length === 0) {
              weatherList.push({
                weekday: wd,
                day: da,
                month: mo,
                year: ye,
                cel: celsiusValue
              })
            } else {
              const lastWeatherInsert = weatherList[weatherList.length - 1]
              if (lastWeatherInsert.day != da) {
                weatherList.push({
                  weekday: wd,
                  day: da,
                  month: mo,
                  year: ye,
                  cel: celsiusValue
                })
              }
            }
          })

          weatherList.map(item => {
            const { weekday, day, month, year, cel } = item
            weatherListText = weatherListText.concat(`${weekday}, ${day} ${month} ${year}: ${cel}°C \n`)
          })
        }

        setSolution2(weatherListText)
      })
      .catch(function (error) {
        console.log(error);
        setSolution2(error)
      });
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Text style={styles.solutionHeaderText}>
          Solution 1 - ApaBole
        </Text>
        <Text style={styles.solutionText}>{solution1}</Text>

        <Text style={styles.solutionHeaderText}>
          Solution 2 - Ramalan cuaca kota Jakarta untuk 5 hari kedepan
        </Text>
        <Text style={styles.solutionText}>{solution2}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({ 
  solutionHeaderText:{
    fontSize: 24,
    marginTop:16,
    marginBottom:16,
    paddingVertical:10,
    paddingHorizontal:8,
    fontWeight:'bold',
    backgroundColor:'#89CFF0'
  },
  solutionText:{
    padding:4,
    fontSize: 24
  }
});

export default App;
