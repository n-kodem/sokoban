// import logo from './logo.svg';
import './App.css';
import Map from "./main/mapGenerator";
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

function LevelSelection(props) {
    return (
        <div>
            <h1>Choose a level:</h1>
            <div>
                <div className="accordion" data-level="1" id="accordionPanelsStayOpenExample">
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true"
                                    aria-controls="panelsStayOpen-collapseOne">
                                Beginner
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show"
                             aria-labelledby="panelsStayOpen-headingOne">
                            <div className="accordion-body">
                                <button className={"btn btn-primary"} onClick={() => props.onLevelSelect(1)}>1</button>
                                <button className={"btn btn-primary"} onClick={() => props.onLevelSelect(2)}>2</button>
                                <button className={"btn btn-primary"} onClick={() => props.onLevelSelect(3)}>3</button>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item" data-level="2">
                        <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="true"
                                    aria-controls="panelsStayOpen-collapseTwo">
                                Intermediate
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse show"
                             aria-labelledby="panelsStayOpen-headingTwo">
                            <div className="accordion-body">
                                Todo
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item" data-level="3">
                        <h2 className="accordion-header" id="panelsStayOpen-headingThree">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="true"
                                    aria-controls="panelsStayOpen-collapseThree">
                                Advanced
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse show"
                             aria-labelledby="panelsStayOpen-headingThree">
                            <div className="accordion-body">
                                Todo
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item" data-level="4">
                        <h2 className="accordion-header" id="panelsStayOpen-headingFour">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#panelsStayOpen-collapseFour" aria-expanded="true"
                                    aria-controls="panelsStayOpen-collapseFour">
                                Expert
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseFour" className="accordion-collapse collapse show"
                             aria-labelledby="panelsStayOpen-headingFour">
                            <div className="accordion-body">
                                Todo
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
        <div className="App">
            {isLevelSelectionDisplayed ? <LevelSelection onLevelSelect={handleLevelSelect} /> : <Map {...{ level: selectedLevel, onBackToLevelSelect: handleBackToLevelSelect }} />}
        </div>
    );
}

export default App;
