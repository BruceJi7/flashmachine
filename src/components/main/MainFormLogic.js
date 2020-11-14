import React, { useState, useEffect, useCallback } from 'react';

import MainFormDisplay from './MainFormDisplay';
import FormResults from './FormResults';

import dictResultParser from './dictResultParser';

export default function MainFormLogic() {
  const [wordList, setWordList] = useState(['House']);
  const [displayValue, setDisplayValue] = useState('House');
  const [searchResultWords, setSearchResultWords] = useState([]);
  const [preventEntry, setPreventEntry] = useState(false);

  function makeRequestForWords() {
    console.log('Requesting...');

    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const naverRequestURLPrefix =
      'https://en.dict.naver.com/api3/enko/search?query=';
    const naverRequestURLSuffix =
      '&m=pc&range=all&shouldSearchVlive=true&lang=en';

    for (let i = 0; i < wordList.length; i++) {
      let word = wordList[i];

      console.log(`Working on word '${word}...' `);
      const corsRequestURL =
        proxyUrl + naverRequestURLPrefix + word + naverRequestURLSuffix;

      fetch(corsRequestURL)
        .then((response) => response.json())
        .then((data) => dictResultParser(data, word))
        .then((result) => {
          const resultsToAdd = [...searchResultWords, result];
          setSearchResultWords(null); // Clear results
          setSearchResultWords(resultsToAdd);
        });
    }
  }

  // useEffect(() => {
  //   setSearchResultWords([]); // Clear results
  // }, []);

  function handleWordEntry(event) {
    const value = event.target.value;

    const currentWordList = wordList;
    const currentDisplayValue = displayValue;

    const splitValue = value.split('\n');

    if (splitValue.length > 30) {
      console.log('The list is capped at 30');
      setPreventEntry(true);
      setWordList(currentWordList);
      setDisplayValue(currentDisplayValue);
    } else {
      setPreventEntry(false);
      setWordList(splitValue);
      setDisplayValue(value);
    }
  }

  // function handleChange(event){

  //     const {name, value} = event.target
  //     if (name === 'wordList') {
  //         setWordList(value)
  //     }

  // }

  return (
    <div>
      <button onClick={() => setSearchResultWords([])}>Click to clear</button>
      <MainFormDisplay
        wordList={displayValue}
        handleChange={handleWordEntry}
        makeRequest={makeRequestForWords}
      />
      <FormResults results={searchResultWords} />
    </div>
  );
}
