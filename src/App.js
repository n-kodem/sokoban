// import logo from './logo.svg';
import './App.css';
import Map from "./main/mapGenerator";
import Settings from "./main/Settings";
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
                                <button className={"btn btn-primary"} onClick={() => props.onLevelSelect(4)}>4</button>
                                <button className={"btn btn-primary"} onClick={() => props.onLevelSelect(5)}>5</button>
                                <button className={"btn btn-primary"} onClick={() => props.onLevelSelect(6)}>6</button>
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
                                <button className={"btn btn-primary"} onClick={() => props.onLevelSelect(7)}>7</button>
                                <button className={"btn btn-primary"} onClick={() => props.onLevelSelect(8)}>8</button>
                                <button className={"btn btn-primary"} onClick={() => props.onLevelSelect(9)}>9</button>
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
                                <button className={"btn btn-primary"} onClick={() => props.onLevelSelect(10)}>10</button>
                                <button className={"btn btn-primary"} onClick={() => props.onLevelSelect(11)}>11</button>
                                <button className={"btn btn-primary"} onClick={() => props.onLevelSelect(12)}>12</button>
                                <button className={"btn btn-primary"} onClick={() => props.onLevelSelect(13)}>13</button>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="button" className="btn btn-primary btn-settings" title={"Settings"} onClick={() => props.onLevelSelect(-1)}>
                    <svg width="32" height="32" fill="currentColor"
                         className="bi bi-gear-fill" viewBox="0 0 16 16">
                        <path
                            d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"></path>
                    </svg>
                </button>
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

    React.useEffect(() => {
        let volume = localStorage.getItem("volume")
        if (volume === null) {
            volume = 100;
            localStorage.setItem("volume", `${volume}`);
        }
    })

    return (
        <div className="App">
            {
                isLevelSelectionDisplayed ?
                    <LevelSelection onLevelSelect={handleLevelSelect} />
                : selectedLevel===-1 ?
                        <Settings {...{onBackToLevelSelect: handleBackToLevelSelect}}/>
                : <Map {...{ level: selectedLevel, onBackToLevelSelect: handleBackToLevelSelect }} />
            }
        </div>
    );
}

export default App;
