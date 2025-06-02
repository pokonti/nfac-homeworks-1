import React, { useEffect, useState } from 'react';

function QuoteBox() {
    const [quote, setQuote] = useState('');
    const [author, setAuthor] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const API_KEY = import.meta.env.VITE_API_NINJAS_KEY;
  
    useEffect(() => {
        let isMounted = true;
        
        fetch('https://api.api-ninjas.com/v1/quotes', {
          headers: { 'X-Api-Key': API_KEY }
        })
          .then(res => res.json())
          .then(data => {
            if (isMounted && data && data.length > 0) {
              setQuote(data[0].quote);
              setAuthor(data[0].author);
              setIsLoading(false);
            }
          })
          .catch(err => {
            console.error('Error fetching quote:', err);
            if (isMounted) {
              setIsLoading(false);
            }
          });

        return () => {
            isMounted = false;
        };
    }, []);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <p>{quote}</p>
            <p>- {author}</p>
        </div>
    );
}

export default QuoteBox;
