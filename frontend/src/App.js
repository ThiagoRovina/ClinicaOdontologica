import React, {useEffect, useState} from 'react';

import logo from './logo.svg';
import './App.css';


function App() {
    cons [groups, setGroups] = useState([]);

    useEffect(() => {
        setLoading(true);

        fetch('/api/groups')
            .then(response => response.json())
            .then(data => {
                setGroups(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching groups:', error);
                setLoading(false);
            });
    }, []);
    if (loading) {
        return <p>Loading...</p>;
    }

  return (
    <div className="App">
      <h1>Ola react :)</h1>
    </div>
  );
}

export default App;
