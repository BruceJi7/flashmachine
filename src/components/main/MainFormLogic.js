import React, { useState, useEffect } from "react";
import axios from "../../instances/axios";

import MainFormDisplay from "./MainFormDisplay";
// import FormResults from "./FormResults"

import makeParagraphContent from "./dictResultParser";

export default function MainFormLogic() {
  const [wordList, setWordList] = useState([]);
  const [displayValue, setDisplayValue] = useState("");
  const [searchResultWords, setSearchResultWords] = useState([]);
  const [includeHanja, setIncludeHanja] = useState(false);
  const [preventEntry, setPreventEntry] = useState(false);
  const [flashCardContents, setFlashCardContents] = useState([]);

  function makeRequestForWords() {
    setSearchResultWords(null);

    console.log("Requesting...");
    console.log(wordList);

    if (wordList === []) {
      console.log("Empty Query Terms");
    } else {
      const wordQuery = {
        word_array: wordList,
      };

      axios
        .post("", wordQuery)
        .then((response) => {
          console.log(response);
          setSearchResultWords([...response.data]);

          const paragraphFormat = makeParagraphContent(response.data, includeHanja); //Returns an object
          console.log("Received the following:");
          console.log(paragraphFormat);
          setFlashCardContents(paragraphFormat);
        })
        .catch((error) => {
          console.log(error);
        });
    } //Endif
  } // End of makeRequestForWords

  function handleWordEntry(event) {
    const value = event.target.value;

    const currentWordList = wordList;
    const currentDisplayValue = displayValue;

    const splitValue = value.split("\n");

    if (splitValue.length > 30) {
      console.log("The list is capped at 30");
      setPreventEntry(true);
      setWordList(currentWordList);
      setDisplayValue(currentDisplayValue);
    } else {
      setPreventEntry(false);
      setWordList(splitValue);
      setDisplayValue(value);
    }
  }

  function handleHanja(event) {
    setIncludeHanja(event.target.checked);
  }

  function handleFlashEdit(event) {
    const { name, value } = event.target;

    let currentFlashContent = flashCardContents;

    const editedObject = { word: name, paragraph: value };

    const updatedFlashContent = {
      ...currentFlashContent,
      [name]: editedObject,
    };

    setFlashCardContents(updatedFlashContent);
  }

  function makeTextFile() {
    const flashcardString = makeFlashcardString();

    const element = document.createElement("a");

    const file = new Blob([flashcardString], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "anki_flashcards.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  function makeFlashcardString() {
    const keys = Object.keys(flashCardContents);

    const paragraphsArray = keys.map((key) => {
      const word = flashCardContents[key].word;
      let paragraph = flashCardContents[key].paragraph;

      paragraph = paragraph.replace(/"/g, '""');

      return `${word};"${paragraph}"`;
    });

    const flashcardString = paragraphsArray.join("\n");

    return flashcardString;
  }

  // useEffect to put word list into browser storage
  useEffect(() => {
    return () => {
      // const joinedWordList = wordList.join('%%')
      localStorage.setItem("wordList", wordList);
    };
  }, [wordList]);

  // useEffect to retrieve word list from browser storage
  useEffect(() => {
    const localWordList = localStorage.getItem("wordList");
    console.log(localWordList);
    let splitLocalWordList = localWordList.split(",");
    splitLocalWordList = splitLocalWordList.filter((w) => w !== "");

    setWordList(splitLocalWordList);
    const displayWordList = localWordList.replace(/,/g, "\n");
    setDisplayValue(displayWordList);
  }, []);

  // Display the flashcard contents
  let editableContents = null;
  if (flashCardContents) {
    const keys = Object.keys(flashCardContents);

    editableContents = keys.map((key) => {
      return (
        <div className="flash-cell" key={key}>
          <p className="flash-title">{flashCardContents[key].word}</p>

          <textarea
            className="flash-edit-box input-box"
            name={flashCardContents[key].word}
            value={flashCardContents[key].paragraph}
            onChange={handleFlashEdit}
          />
        </div>
      );
    });
  } //Endif
  //End of display contents section

  return (
    <div className="inner-container">
      <MainFormDisplay
        wordList={displayValue}
        preventEntry={preventEntry}
        handleChange={handleWordEntry}
        makeRequest={makeRequestForWords}
        handleHanja={handleHanja}
      />

      <div className="flash-content-section">
        {editableContents.length > 0 ? (
          <div>
            <h3>Your flashcard contents:</h3>
            {editableContents}
            <p>
              <button onClick={makeTextFile}>Download Flashcards</button>
            </p>
          </div>
        ) : (
          // Else

          <p>Enter words above!</p>
        )}
      </div>
    </div>
  );
}
