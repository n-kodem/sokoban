import React from 'react';
// import {render} from "react-dom";

function Settings(props) {
        return (
            <div>
                <button className={"btn btn-primary"} onClick={props.onBackToLevelSelect}>Back to Level Selection</button>
            </div>
        )

}

export default Settings;