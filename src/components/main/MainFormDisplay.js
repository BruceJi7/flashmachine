import React from 'react';

export default function MainFormDisplay(props) {
  function splitToParagraph(wordList) {
    const wordListArray = wordList.split('\n');
    const paragraphs = wordListArray.map((word) => <p key={word}>{word}</p>);
    return paragraphs;
  }

  return (
    <div>
      {/* <div>{splitToParagraph(props.wordList)}</div> */}

      <textarea
        value={props.wordList}
        name="wordList"
        placeholder="Add vocab words here!"
        onChange={props.handleChange}
      />
      <br />
      <button onClick={props.makeRequest}>Get Definitions</button>
    </div>
  );
}
