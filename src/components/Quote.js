import React, { useState, useEffect, useCallback } from 'react';

function Quote() {
    const [quote, setQuote] = useState({ text: '', author: '' });
    const [error, setError] = useState(null);
    const [bgColor, setBgColor] = useState('#ffffff');
    const [textColor, setTextColor] = useState('#000000');
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
                setError(null); // Reset error on successful fetch
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

    const shareOnTwitter = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${quote.text}" — ${quote.author}`)}`;
        window.open(twitterUrl, '_blank');
    };

    const changeColorsAndQuote = async () => {
        try {
            await fetchQuote(); // Ensure a new quote is fetched
            changeColors();
        } catch (error) {
            setError('Failed to fetch a new quote.');
        }
    };

    const changeColors = () => {
        const newColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        setBgColor(newColor);
        setTextColor(getContrastingColor(newColor));
        setBtnColor(getButtonColor(newColor));
    };

    const getContrastingColor = (hex) => {
        const [r, g, b] = [0, 2, 4].map(i => parseInt(hex.slice(i + 1, i + 3), 16));
        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return luminance > 127.5 ? '#000000' : '#ffffff';
    };

    const getButtonColor = (bgColor) => {
        const [r, g, b] = [0, 2, 4].map(i => Math.min(255, parseInt(bgColor.slice(i + 1, i + 3), 16) + 50));
        return `#${[r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')}`;
    };

    return (
        <div className="app" style={{ backgroundColor: bgColor }}>
            <div className="container">
                <h1 style={{ color: textColor }}>Quote of the Day</h1>
                {error ? (
                    <p className="error" style={{ color: textColor }}>Error: {error}</p>
                ) : (
                    <>
                        <i className="fa-solid fa-quote-left" style={{ color: textColor }}></i>
                        <p className="quote-content" style={{ color: textColor }}>“{quote.quote}”</p>
                        <p className="author" style={{ color: textColor }}>--- {quote.author}</p>
                    </>
                )}
                <div className="button-position">
                    <button 
                        onClick={changeColorsAndQuote} 
                        style={{ backgroundColor: btnColor, color: textColor }}
                    >
                        New Quote
                    </button>
                </div>
                <div className="twitter-share">
                    <button 
                        onClick={shareOnTwitter} 
                        className="twitter-share-button" 
                        style={{ backgroundColor: btnColor }}
                    >
                        <i className="fab fa-twitter" style={{ color: textColor }}></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Quote;
