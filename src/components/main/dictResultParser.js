const regexKeys = {
  matchKorean: /\(?[\uAC00-\uD7AF→.]+\)?/gi,
  matchEnglish: /\(?[a-z→.]+\)?/gi,
  matchHTML: /<.*?>/g,
  cleanStart: /^[\s,]+/,
  cleanEnd: /\s$/,
  trimSpaces: /\s{2,}/g,
  removeHiBullet: /[·=]/g,
  removeEndParen: /\($/,
  doCommaSpace: /,(?=[^\s])/g,
};

function extractWantedData(itemArray) {
  const meansCollectors = itemArray.map((w) => w.meansCollector);

  const hanjas = itemArray.map((w) => w.expAliasGeneralAlwaysList);

  // Map to extract word entry part
  const meanings = meansCollectors.map((w) => w[0]);

  const result = [];

  // Combine meanings with related hanjas:
  for (let i = 0; i < meanings.length; i++) {
    let m = meanings[i];
    let h = hanjas[i];

    // If no hanja data is present, add blank hanja data
    if (h.length === 0) {
      h = [
        {
          originLanguage: '',
          originLanguageValue: '',
        },
      ];
    }

    result.push({
      definitions: m,
      associatedHanja: h,
    });
  }

  return result;
}

function reformatData(queryWord, trimmedObject, typeOfEntry) {
  const result = [];
  trimmedObject.forEach((entry) => {
    // Deal with definitions
    const entryDefinitionArray = entry.definitions;

    // Get parts of speech
    const entryPartOfSpeechKOR = entryDefinitionArray.partOfSpeech;
    const entryPartOfSpeechENG = entryDefinitionArray.partOfSpeech2;

    const entryDefinitionMeanings = entryDefinitionArray.means;

    const entryMeaningsArray = [];

    for (let i = 0; i < entryDefinitionMeanings.length; i++) {
      let m = entryDefinitionMeanings[i];
      let h = entry.associatedHanja[i];

      entryMeaningsArray.push({
        type: typeOfEntry,
        meaning: m.value,
        example: m.exampleOri,
        exampleTranslation: m.exampleTrans,
        partOfSpeech: {
          english: entryPartOfSpeechENG,
          korean: entryPartOfSpeechKOR,
        },
        // If h exists, and has an 'originLanguage', use it, else null.
        hanja: h
          ? h.hasOwnProperty('originLanguage')
            ? h.originLanguage
            : null
          : null,
      });
    }
    // let assembledObject = {queryWord:queryWord, results:{entryMeaningsArray}}

    result.push(...entryMeaningsArray);
  });
  console.log(result);
  return result;
}

function cleanEntries(queryWord, definitions) {
  const result = [];

  definitions.forEach((item) => {
    item.meaning = item.meaning.replace(regexKeys.matchHTML, '');

    if (regexKeys.matchKorean.test(queryWord)) {
      //If the query word is a  Korean word...

      item.meaning = item.meaning.replace(regexKeys.matchKorean, ''); // Remove the Korean from the meanings
    } else {
      item.meaning = item.meaning.replace(regexKeys.matchEnglish, ''); // Remove the Korean from the meanings
    }
    // Regex processing
    item.meaning = item.meaning.replace(regexKeys.cleanStart, '');
    item.meaning = item.meaning.replace(regexKeys.trimSpaces, '');
    item.meaning = item.meaning.replace(regexKeys.removeHiBullet, '');
    item.meaning = item.meaning.replace(regexKeys.removeEndParen, '');
    item.meaning = item.meaning.replace(regexKeys.doCommaSpace, ', ');
    item.meaning = item.meaning.replace(regexKeys.cleanEnd, '');

    //Capitalize
    item.meaning = item.meaning.charAt(0).toUpperCase() + item.meaning.slice(1);

    if (item.meaning) {
      result.push(item);
    }
  });

  const assembledObject = { queryWord: queryWord, meanings: result };
  console.log(assembledObject);

  return assembledObject;
}

function dictResultParser(data, queryWord) {
  // data obj. comes with response info. Discard it.
  const usefulData = data.searchResultMap.searchResultListMap;

  console.log('Raw Data');
  console.log(usefulData);

  // Get word section, discard the rest.
  let WORD = usefulData.WORD;

  // WORD is an array of dictionary results
  WORD = WORD.items;

  // Process WORD arrays
  const WORDMeanings = extractWantedData(WORD); // Extract useful data only
  const reformattedDefinitions = reformatData(
    queryWord,
    WORDMeanings,
    'definitions'
  ); //Format to uniform format
  const regexParsedMeanings = cleanEntries(queryWord, reformattedDefinitions); //Tidy up entries

  return regexParsedMeanings;
}

export default dictResultParser;
