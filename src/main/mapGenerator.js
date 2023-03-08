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
            .then((yamlData) => yaml.load(yamlData,{}))
            .then((parsedData) => this.setState({ data: parsedData, error: null }))
            .catch((error) => this.setState({ data: null, error: error }));
    }
    getTileSign(tile) {
        const { tiles } = this.state.data;
        return Object.keys(tiles).find(key => tiles[key] === tile);
    }
    getPlayerPosition(map) {
        let playerPosition = { x: -1, y: -1 };
        // Get all tiles that are player
        let playerTiles = Object.keys(this.state.data.tiles).filter(key => this.state.data.tiles[key].includes("player"));
        map.forEach((row, y) => {
            row.split("").forEach((letter, x) => {
                if (playerTiles.includes(letter.toString())) {
                    playerPosition = { x, y };
                    return playerPosition;
                }
            });
        });
        return playerPosition;
    }
    movePlayer(map, tiles, oldPlayerPosition, newPlayerPosition) {
        let updatedMap = map.map((el,_)=>{ return el.toString().split("")})
        let playerTile = this.getTileSign("player");
        let floorTile = this.getTileSign("floor");
        // used when player moves on special tile
        let specialTilesActions = {
            "stone": () => {
                // tiles that stone can move on and what to do
                let stoneMovesOn = {
                    "floor": () => {
                        updatedMap[newPlayerPosition.y + (newPlayerPosition.y-oldPlayerPosition.y)][newPlayerPosition.x +newPlayerPosition.x-oldPlayerPosition.x] = this.getTileSign("stone");
                    },
                    "button": () => {
                        updatedMap[newPlayerPosition.y + (newPlayerPosition.y-oldPlayerPosition.y)][newPlayerPosition.x +newPlayerPosition.x-oldPlayerPosition.x] = this.getTileSign("clicked_button");
                    }
                }
                // moves stone if it can move on the tile
                if (!stoneMovesOn.hasOwnProperty(
                    this.state.data.tiles[updatedMap[newPlayerPosition.y +
                    (newPlayerPosition.y-oldPlayerPosition.y)][newPlayerPosition.x +newPlayerPosition.x-oldPlayerPosition.x]]
                ))
                    return false;
                stoneMovesOn[this.state.data.tiles[updatedMap[newPlayerPosition.y +
                (newPlayerPosition.y-oldPlayerPosition.y)][newPlayerPosition.x +newPlayerPosition.x-oldPlayerPosition.x]]]();

                return true;
            },
            "clicked_button": () => {
                if (updatedMap[newPlayerPosition.y + (newPlayerPosition.y-oldPlayerPosition.y)][newPlayerPosition.x +newPlayerPosition.x-oldPlayerPosition.x] !== this.getTileSign("floor"))
                    return false;
                updatedMap[newPlayerPosition.y + (newPlayerPosition.y-oldPlayerPosition.y)][newPlayerPosition.x +newPlayerPosition.x-oldPlayerPosition.x] = this.getTileSign("stone");
                playerTile = this.getTileSign("player_on_button");
                return true;
            },
            "button": () => {
                playerTile = this.getTileSign("player_on_button");
                return true;
            },
            "treasure": () => {
                playerTile = this.getTileSign("player_on_treasure");
                return true;
            },
            "player_on_button": () => {
                floorTile = this.getTileSign("button");
                return true;
            },
            "player_on_treasure": () => {
                floorTile = this.getTileSign("treasure");
                return true;
            }
        }
        // check if new position is special tile
        if (specialTilesActions.hasOwnProperty(this.state.data.tiles[updatedMap[newPlayerPosition.y][newPlayerPosition.x]]))
            if(!specialTilesActions[this.state.data.tiles[updatedMap[newPlayerPosition.y][newPlayerPosition.x]]]())
                return;

        // check if player is on special tile
        if (updatedMap[oldPlayerPosition.y][oldPlayerPosition.x] !== this.getTileSign("player"))
            specialTilesActions[this.state.data.tiles[updatedMap[oldPlayerPosition.y][oldPlayerPosition.x]]]()


        updatedMap[oldPlayerPosition.y][oldPlayerPosition.x] = floorTile;
        updatedMap[newPlayerPosition.y][newPlayerPosition.x] = playerTile;
        updatedMap = updatedMap.map((el)=>{ return el.join("")})


        this.setState({ data: { ...this.state.data, map: updatedMap } });
    }
    handleKeyDown(event) {
        // console.log(`Key ${event.keyCode} pressed`);
        // player moving stuff
        const { data,tiles } = this.state;
        let map = data.map;
        // move player if next title is floor
        const playerPosition = this.getPlayerPosition(map);
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
        // const textures = {
        //     wall: "black",
        //     floor: "gray",
        //     player: "red",
        //     mud: "blue",
        //     stone: "lightblue",
        //     clicked_button: "cyan",
        //     button: "darkgray",
        //     player_on_button: "darkred",
        //     treasure: "yellow"
        // }

        const table = data.map.map((row,index) => {
            return <tr key={100+index}>{
                row.toString().split('').map((cell,index) => {
                    return <td style={
                        {
                            backgroundColor: data.textures[data.tiles[cell]],
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