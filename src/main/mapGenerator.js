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
        let updatedMap = map.map((el,_)=>{ return el.toString().split("")}) //map[0].toString().split("");

        // updatedMap[oldPlayerPosition.y][oldPlayerPosition.x] = "F"
        // console.log(updatedMap[oldPlayerPosition.y][oldPlayerPosition.x]);
        // check if new position is stone to move it
        if (updatedMap[newPlayerPosition.y][newPlayerPosition.x] === this.getTileSign("stone")) {
            console.log("stone")
            console.log((newPlayerPosition.y-oldPlayerPosition.y,newPlayerPosition.x-oldPlayerPosition.x));
            // move stone if next title after it is floor
            if (updatedMap[newPlayerPosition.y + (newPlayerPosition.y-oldPlayerPosition.y)][newPlayerPosition.x +newPlayerPosition.x-oldPlayerPosition.x] !== this.getTileSign("floor"))
                return;
            updatedMap[newPlayerPosition.y + (newPlayerPosition.y-oldPlayerPosition.y)][newPlayerPosition.x +newPlayerPosition.x-oldPlayerPosition.x] = this.getTileSign("stone");
        }
        updatedMap[oldPlayerPosition.y][oldPlayerPosition.x] = this.getTileSign("floor");
        updatedMap[newPlayerPosition.y][newPlayerPosition.x] = this.getTileSign("player");
        updatedMap = updatedMap.map((el)=>{ return el.join("")})
        console.log(updatedMap);
        console.log(oldPlayerPosition);
        console.log(newPlayerPosition);
        this.setState({ data: { ...this.state.data, map: updatedMap } });
    }
    handleKeyDown(event) {
        // console.log(`Key ${event.keyCode} pressed`);
        // player moving stuff
        const { data,tiles } = this.state;
        let map = data.map;
        // move player if next title is floor
        const playerPosition = this.getPlayerPosition(map, tiles);
        let newPlayerPosition = { x: playerPosition.x, y: playerPosition.y };
        let movement = {
            37: () => {
                // left
                if ([this.getTileSign("wall"),this.getTileSign("mud")].includes(map[playerPosition.y][playerPosition.x - 1]))
                    return;
                newPlayerPosition.x -= 1;

            },
            38: () => {
                // up
                if ([this.getTileSign("wall"),this.getTileSign("mud")].includes(map[playerPosition.y - 1][playerPosition.x]))
                    return;
                newPlayerPosition.y -= 1;

            },
            39: () => {
                // right
                if ([this.getTileSign("wall"),this.getTileSign("mud")].includes(map[playerPosition.y][playerPosition.x + 1]))
                    return;
                newPlayerPosition.x += 1;

            },
            40: () => {
                // down
                if ([this.getTileSign("wall"),this.getTileSign("mud")].includes(map[playerPosition.y + 1][playerPosition.x]))
                    return;
                newPlayerPosition.y += 1;

            }
        };
        movement.hasOwnProperty(event.keyCode) && movement[event.keyCode]();

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
            stone: "darkgray",
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