import React, { useEffect, useState } from 'react';
import styles from './QuoteBox.module.css';

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
        return <p className={styles.loading}>Loading...</p>;
    }

    return (
        <div className={styles.quoteBox}>
            <p className={styles.quote}>{quote}</p>
            <p className={styles.author}>- {author}</p>
        </div>
    );
}

export default QuoteBox;
