import React, { useState, useEffect, useCallback } from 'react';

function Quote() {
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [error, setError] = useState(null);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor] = useState('#000000');
  const [btnColor, setBtnColor] = useState('#3498db');

  const fetchQuote = useCallback(async () => {
    const api = 'https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json';
    try {
      const res = await fetch(api);
      if (!res.ok) throw new Error('Network response was not ok');
      const results = await res.json();
      if (results.quotes && results.quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * results.quotes.length);
        setQuote(results.quotes[randomIndex]);
        setError(null);
      } else {
        throw new Error('No quotes found in the response.');
      }
    } catch (error) {
      setError(error.message);
    }
  }, []);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  const getButtonColor = (bgColor) => {
    const [r, g, b] = [0, 2, 4].map((i) => Math.min(
      255,
      parseInt(bgColor.slice(i + 1, i + 3), 16) + 50,
    ));
    return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
  };

  const changeColors = () => {
    const newColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    setBgColor(newColor);
    setBtnColor(getButtonColor(newColor));
  };

  const changeColorsAndQuote = async () => {
    try {
      await fetchQuote();
      changeColors();
    } catch (error) {
      setError('Failed to fetch a new quote.');
    }
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `"${quote.quote}" — ${quote.author}`
    )}`;
    window.open(twitterUrl, '_blank');
  };

  return (
    <div className="app" style={{ backgroundColor: bgColor }}>
      <div id="quote-box" className="quote-box" style={{ color: textColor }}>
        <h1>Quote of the Day</h1>
        {error ? (
          <p className="error" style={{ color: textColor }}>
            Error: {error}
          </p>
        ) : (
          <>
            <i className="fa-solid fa-quote-left" style={{ color: textColor }} />
            <p id="text" className="quote-content" style={{ color: textColor }}>
              “{quote.quote}”
            </p>
            <p id="author" className="author" style={{ color: textColor }}>
              --- {quote.author}
            </p>
          </>
        )}
        <button
          id="new-quote"
          type="button"
          onClick={changeColorsAndQuote}
          className="new-quote-button"
          style={{ backgroundColor: btnColor, color: textColor }}
        >
          New Quote
        </button>
        <a
          id="tweet-quote"
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `"${quote.text}" — ${quote.author}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="twitter-share"
          
        >
          <i className="fab fa-twitter" style={{ color: textColor }} />
        </a>
      </div>
    </div>
  );
}

export default Quote;


