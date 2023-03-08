// import logo from './logo.svg';
import './App.css';
import Map from "./main/mapGenerator";
import React, { useState } from 'react';

function LevelSelection(props) {
    return (
        <div>
            <button onClick={() => props.onLevelSelect(1)}>Level 1</button>
            <button onClick={() => props.onLevelSelect(2)}>Level 2</button>
            <button onClick={() => props.onLevelSelect(3)}>Level 3</button>
        </div>
    );
}

function App() {
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [isLevelSelectionDisplayed, setIsLevelSelectionDisplayed] = useState(true);

    function handleLevelSelect(level) {
        setSelectedLevel(level);
        setIsLevelSelectionDisplayed(false);
    }

    function handleBackToLevelSelect() {
        setSelectedLevel(null);
        setIsLevelSelectionDisplayed(true);
    }

    return (
        <div>
            {isLevelSelectionDisplayed ? <LevelSelection onLevelSelect={handleLevelSelect} /> : <Map {...{ level: selectedLevel, onBackToLevelSelect: handleBackToLevelSelect }} />}
        </div>
    );
}

export default App;
