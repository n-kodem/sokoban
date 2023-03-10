import React from 'react';
import yaml from 'js-yaml';
class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.level,
            data: null,
            error: null,
            levelFinished: false,
            backToLevelSelect: props.onBackToLevelSelect
        };
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    componentDidMount() {
        this.loadData(this.props.level);
        window.addEventListener('keydown', this.handleKeyDown);
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("XD",this.checkIfLevelFinished(),!this.state.levelFinished)
        // console.log(prevProps)
        console.log("ID",this.state.id,prevProps.level)
        if (this.state.id === prevProps.level)
        if (this.checkIfLevelFinished() && !this.state.levelFinished){
                this.setState({ levelFinished: true })
        }
        // if (this.state.levelFinished && !prevState.levelFinished) {
        //     // alert("Level completed!");
        // }

    }
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
    // Check if player finished the level
    checkIfLevelFinished() {
        const {tasks,map} = this.state.data;
        console.table(map);
        let taskHandler = {
            "buttons": () => {
                // Get all tiles that are button
                let buttonTiles = 0
                map.forEach((row) => {
                    row.split("").forEach((letter, _) => {
                        if (letter === this.getTileSign("stone")) {
                            buttonTiles+=1;
                        }
                    });
                });
                // check if there are no buttons left
                // console.log("btns" + buttonTiles)
                return buttonTiles === 0;
            },
            "treasure": () => {
                // Get all tiles that are treasure
                let treasureTiles = 0
                map.forEach((row) => {
                    row.split("").forEach((letter, _) => {
                        if (letter === this.getTileSign("treasure")) {
                            treasureTiles+=1;
                        }
                    });
                });
                // check if there are no treasures left
                return treasureTiles === 0;
            }
        }
        let finished = 0;
        tasks.forEach(task => {
            finished+=taskHandler[task]()
        })
        // console.log(finished === tasks.length)
        // this.setState({ levelFinished: finished === tasks.length })
        // console.log(this.state.levelFinished);
        return finished === tasks.length;


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
        const positionAfterPlayer = {y:(newPlayerPosition.y + (newPlayerPosition.y-oldPlayerPosition.y)), x: (newPlayerPosition.x +newPlayerPosition.x-oldPlayerPosition.x)};
        // used when player moves on special tile
        let specialTilesActions = {
            "floor": () => {
                return true;
            },
            "stone": () => {
                // tiles that stone can move on and what to do
                let stoneMovesOn = {
                    "floor": () => {
                        updatedMap[positionAfterPlayer.y][positionAfterPlayer.x] = this.getTileSign("stone");
                    },
                    "button": () => {
                        updatedMap[positionAfterPlayer.y][positionAfterPlayer.x] = this.getTileSign("clicked_button");
                    }
                }
                // moves stone if it can move on the tile
                if (!stoneMovesOn.hasOwnProperty(
                    this.state.data.tiles[updatedMap[positionAfterPlayer.y][positionAfterPlayer.x]]
                ))
                    return false;
                stoneMovesOn[this.state.data.tiles[updatedMap[positionAfterPlayer.y][positionAfterPlayer.x]]]();

                return true;
            },
            "clicked_button": () => {
                if (updatedMap[positionAfterPlayer.y][positionAfterPlayer.x] !== this.getTileSign("floor"))
                    return false;
                updatedMap[positionAfterPlayer.y][positionAfterPlayer.x] = this.getTileSign("stone");
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
        // check if new position is interactional tile
        if (!specialTilesActions.hasOwnProperty(this.state.data.tiles[updatedMap[newPlayerPosition.y][newPlayerPosition.x]]))
            return;

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
                newPlayerPosition.x -= 1;

            },
            38: () => {
                // up
                newPlayerPosition.y -= 1;

            },
            39: () => {
                // right
                newPlayerPosition.x += 1;

            },
            40: () => {
                // down
                newPlayerPosition.y += 1;

            }
        };
        movement.hasOwnProperty(event.keyCode) && movement[event.keyCode]();
        this.movePlayer(map, tiles, playerPosition, newPlayerPosition);
        // this.checkIfLevelFinished();


        // console.log(this.state.levelFinished);
    }
    render() {
        const { data, error, backToLevelSelect,levelFinished } = this.state;

        console.log(levelFinished)

        if (error) {
            return <div>Error: {error.message}</div>;
        }

        if (!data) {
            return <div>Loading...</div>;
        }

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
                {this.state.levelFinished && (<div><h1>Level Finished!</h1><button onClick={()=>{this.setState({ id: this.state.id+1,levelFinished:false });this.loadData(this.state.id+1)}}>Next Level</button><button>Restart Level</button></div>)}
            </div>
        );
    }
}

export default Map;