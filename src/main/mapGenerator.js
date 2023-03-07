import React from 'react';
import yaml from 'js-yaml';
class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.level,
            data: null,
            error: null,
            backToLevelSelect: props.onBackToLevelSelect
        };
    }

    componentDidMount() {
        this.loadData(this.props.level);
    }

    // componentDidUpdate(prevProps) {
    //     if (prevprops.level !== this.props.level) {
    //         this.loadData(this.props.level);
    //     }
    // }

    loadData(id) {
        fetch(`./maps/${id}.yaml`)
            .then((response) => response.text())
            .then((yamlData) => yaml.load(yamlData))
            .then((parsedData) => this.setState({ data: parsedData, error: null }))
            .catch((error) => this.setState({ data: null, error: error }));
    }

    render() {
        const { data, error, backToLevelSelect } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        }

        if (!data) {
            return <div>Loading...</div>;
        }

        return (
            <div>
                <button onClick={backToLevelSelect}>Back to Level Selection</button>
                <h1>{data.name}</h1>
                <p>{data.map.join("\n")}</p>
            </div>
        );
    }
}

export default Map;