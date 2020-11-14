import React from 'react';

export default function About() {
  return (
    <div className="about-cell">
      <p>This tool is called Flashmachine</p>
      <p>It helps you write flashcards for Anki</p>
      <ul>
        <li>
          Enter words as you read them, into the text box on the main page.
        </li>
        <li>When you've finished reading, click submit.</li>
        <li>You'll receive a list of meanings for each word.</li>
        <li>
          Select and edit the meanings to make the flashcard content you want.
        </li>
        <li>Click save to see your Anki-compatible flashcard content!</li>
      </ul>
    </div>
  );
}
