import React from 'react';

export default function FormResults(props) {
  const { results } = props;
  const paragraphContent = results ? results.map((item) => {
        const itemSubArray = item.meanings;
        const displayedMeanings = itemSubArray.map((dicEntry, index) => {
          return (
            <div key={index}>
              <p>{dicEntry.meaning}</p>
            </div>
          );
        });

        return (
          <div key={item.queryWord}>
            <h4>{item.queryWord}</h4>
            <div>{displayedMeanings}</div>
          </div>
        );
      })
    : null;

  return <div>{paragraphContent}</div>;
}
