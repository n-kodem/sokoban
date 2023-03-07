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
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    componentDidMount() {
        this.loadData(this.props.level);
        window.addEventListener('keydown', this.handleKeyDown);
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
    getTileSign(tile) {
        const { tiles } = this.state.data;
        return Object.keys(tiles).find(key => tiles[key] === tile);
    }
    getPlayerPosition(map,tiles) {
        let playerPosition = { x: -1, y: -1 };
        map.forEach((row, y) => {
            row.split("").forEach((letter, x) => {
                if (letter === this.getTileSign("player")) {
                    playerPosition = { x, y };
                    return playerPosition;
                }
            });
        });
        return playerPosition;
    }
    movePlayer(map, tiles, oldPlayerPosition, newPlayerPosition) {
        let newMap = map.map((el,index)=>{ return el.toString().split("")}) //map[0].toString().split("");

        // newMap[oldPlayerPosition.y][oldPlayerPosition.x] = "F"
        // console.log(newMap[oldPlayerPosition.y][oldPlayerPosition.x]);

        newMap[oldPlayerPosition.y][oldPlayerPosition.x] = this.getTileSign("floor");
        newMap[newPlayerPosition.y][newPlayerPosition.x] = this.getTileSign("player");
        newMap = newMap.map((el)=>{ return el.join("")})
        console.log(newMap);
        console.log(oldPlayerPosition);
        console.log(newPlayerPosition);
        this.setState({ data: { ...this.state.data, map: newMap } });
    }
    handleKeyDown(event) {
        console.log(`Key ${event.keyCode} pressed`);
        // player moving stuff
        const { data,tiles } = this.state;
        let map = data.map;
        // move player if next title is floor
        const playerPosition = this.getPlayerPosition(map, tiles);
        let newPlayerPosition = { x: playerPosition.x, y: playerPosition.y };
        if (event.keyCode === 37) {
            // left
            if (map[playerPosition.y][playerPosition.x - 1] === this.getTileSign("floor")) {
                newPlayerPosition.x -= 1;
            }
        }
        if (event.keyCode === 38) {
            // up
            if (map[playerPosition.y - 1][playerPosition.x] === this.getTileSign("floor")) {
                newPlayerPosition.y -= 1;
            }
        }
        if (event.keyCode === 39) {
            // right
            if (map[playerPosition.y][playerPosition.x + 1] === this.getTileSign("floor")) {
                newPlayerPosition.x += 1;
            }
        }
        if (event.keyCode === 40) {
            // down
            if (map[playerPosition.y + 1][playerPosition.x] === this.getTileSign("floor")) {
                newPlayerPosition.y += 1;
            }
        }
        this.movePlayer(map, tiles, playerPosition, newPlayerPosition);
    }
    render() {
        const { data, error, backToLevelSelect } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        }

        if (!data) {
            return <div>Loading...</div>;
        }
        const textures = {
            wall: "black",
            floor: "gray",
            player: "red",
            mud: "blue",
            treasure: "yellow"
        }

        const table = data.map.map((row,index) => {
            // console.log(row);
            return <tr key={100+index}>{
                row.toString().split('').map((cell,index) => {
                    return <td style={
                        {
                            backgroundColor: textures[data.tiles[cell]],
                            width:"2ch",
                            height:"2ch",
                            aspectRatio: "1",
                        }
                    } key={index}></td>;
                })
            }</tr>;
        });
        return (
            <div>
                <button onClick={backToLevelSelect}>Back to Level Selection</button>
                <h1>{data.name}</h1>
                <table style={{borderCollapse: "collapse"}}><tbody>
                {
                    table
                }
                </tbody>

                </table>
            </div>
        );
    }
}

export default Map;