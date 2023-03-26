import React from 'react';
// import {render} from "react-dom";

function Settings(props) {
        const [value, setValue] = React.useState(50);

        const handleChange = (event) => {
            setValue(event.target.value);
            localStorage.setItem('volume', event.target.value);
        }
        React.useEffect(() => {
            console.log("useEffect");
            const storedData = localStorage.getItem('volume');
            console.log("storedData: " + storedData)
            if (storedData) {
                setValue(storedData);
            }
            else {
                localStorage.setItem('volume', `${100}`);
                setValue('100');
            }
            setValue(parseInt(localStorage.getItem('volume')))
            console.log("value: " + value)
        }, []);

        return (
            <div>
                <button className={"btn btn-primary"} onClick={props.onBackToLevelSelect}>Back to Level Selection</button>
                <br/>
                <form>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Volume: {value}</label>
                        <input onChange={handleChange} type={"range"} className="form-range" id="volumeRange" min="0" max="100" step="1" defaultValue={value}/>
                    </div>
                    <h1>{value}</h1>
                </form>
            </div>
        )

}

export default Settings;