import React from 'react';
import './App.css';
import { Grid } from '@material-ui/core';
import CubeFace from './CubeFace';

const colors = ['WHITE', 'BLUE', 'RED', 'GREEN', 'ORANGE', 'YELLOW']; // dictates the starting position; and center pieces 
const faceNames = ['BOTTOM', 'FRONT', 'RIGHT', 'BACK', 'LEFT', 'TOP'];

class Cube extends React.Component {
     constructor(props) {
          super(props)
          this.state = {
               faces: {},
          }
          this.lookToRightFace = this.lookToRightFace.bind(this);
          this.lookToLeftFace = this.lookToLeftFace.bind(this);
          this.lookToTopFace = this.lookToTopFace.bind(this);
          this.lookToBottomFace = this.lookToBottomFace.bind(this);
          this.rotateFrontCW = this.rotateFrontCW.bind(this);
          this.rotateFront180Deg = this.rotateFront180Deg.bind(this);
          this.rotateFrontCCW = this.rotateFrontCCW.bind(this);
          this.makeTopBlack = this.makeTopBlack.bind(this); //debug purposes
          this.getTopControls = this.getTopControls.bind(this);
          this.getBottomControls = this.getBottomControls.bind(this);
     }

     rotateFace(face, dir) { //lookToRight: top -> cw; bottom -> ccw
          if (dir !== 'ccw' && dir !== 'cw') {
               console.error('dir can only be ccw or cw');
               return;
          }
          //lazy
          let newFace = [];
          let top = [];
          let meat = [];
          let bottom = [];
          if (dir === 'cw') {
               top.push(face[2][0]); top.push(face[1][0]); top.push(face[0][0]);
               meat.push(face[2][1]); meat.push(face[1][1]); meat.push(face[0][1]);
               bottom.push(face[2][2]); bottom.push(face[1][2]); bottom.push(face[0][2]);

               newFace.push(top);
               newFace.push(meat);
               newFace.push(bottom);

          } else {
               top.push(face[0][2]); top.push(face[1][2]); top.push(face[2][2]);
               meat.push(face[0][1]); meat.push(face[1][1]); meat.push(face[2][1]);
               bottom.push(face[0][0]); bottom.push(face[1][0]); bottom.push(face[2][0]);

               newFace.push(top);
               newFace.push(meat);
               newFace.push(bottom);
          }
          return newFace;
     }

     componentDidMount() {
          this.loadInitialState();
     }

     loadInitialState() {
          let newFaces = {}

          for (let i = 0; i < 6; i++) {
               let face = []; // row col
               const color = colors[i];
               for (let row = 0; row < 3; row++) {
                    let col = [color, color, color];
                    face.push(col);
               }
               newFaces[faceNames[i]] = face;
          }

          this.setState({ faces: newFaces })
          console.log(this.state.faces)
     }

     lookToRightFace() {
          const faces = this.state.faces;
          let newFaces = {};
          newFaces["FRONT"] = faces["RIGHT"];
          newFaces["RIGHT"] = faces["BACK"];
          newFaces["BACK"] = faces["LEFT"];
          newFaces["LEFT"] = faces["FRONT"];

          newFaces["TOP"] = this.rotateFace(faces["TOP"], 'cw');
          newFaces["BOTTOM"] = this.rotateFace(faces["BOTTOM"], 'ccw');
          this.setState({ faces: newFaces, });
          // console.log(this.state.faces);
     }

     lookToLeftFace() {
          const faces = this.state.faces;
          let newFaces = {};
          newFaces["FRONT"] = faces["LEFT"];
          newFaces["LEFT"] = faces["BACK"];
          newFaces["BACK"] = faces["RIGHT"];
          newFaces["RIGHT"] = faces["FRONT"];
          newFaces["TOP"] = this.rotateFace(faces["TOP"], 'ccw');
          newFaces["BOTTOM"] = this.rotateFace(faces["BOTTOM"], 'cw');
          this.setState({ faces: newFaces, });
          // console.log(this.state.faces);
     }

     lookToTopFace() {
          const faces = this.state.faces;
          let newFaces = {};
          newFaces["FRONT"] = faces["TOP"];
          newFaces["TOP"] = this.rotateFace(this.rotateFace(faces["BACK"], "cw"), "cw"); //fix issue?
          newFaces["BACK"] = this.rotateFace(this.rotateFace(faces["BOTTOM"], "cw"), "cw"); //fix issue?;
          newFaces["BOTTOM"] = faces["FRONT"];

          newFaces["LEFT"] = this.rotateFace(faces["LEFT"], "cw");
          newFaces["RIGHT"] = this.rotateFace(faces["RIGHT"], "ccw")
          this.setState({ faces: newFaces, });
          // console.log(this.state.faces);
     }

     lookToBottomFace() {
          const faces = this.state.faces;
          let newFaces = {};
          newFaces["FRONT"] = faces["BOTTOM"];
          newFaces["BOTTOM"] = this.rotateFace(this.rotateFace(faces["BACK"], "cw"), "cw"); //fix issue?
          newFaces["BACK"] = this.rotateFace(this.rotateFace(faces["TOP"], "cw"), "cw"); //fix issue?
          newFaces["TOP"] = faces["FRONT"];
          newFaces["LEFT"] = this.rotateFace(faces["LEFT"], "ccw");
          newFaces["RIGHT"] = this.rotateFace(faces["RIGHT"], "cw")
          this.setState({ faces: newFaces, });
          // console.log(this.state.faces);
     }

     rotateFrontCW(cube, directlyUpdateCube) {
          if (cube === undefined || cube["FRONT"] === undefined) {
               if (this.state.faces !== undefined) {
                    cube = this.state.faces;
               } else {
                    return;
               }
          }

          let newCube = {};

          let leftFace = JSON.parse(JSON.stringify(cube["LEFT"]));
          let topFace = JSON.parse(JSON.stringify(cube["TOP"]));
          let rightFace = JSON.parse(JSON.stringify(cube["RIGHT"]));
          let bottomFace = JSON.parse(JSON.stringify(cube["BOTTOM"]));

          //lazy algorithm
          leftFace[0][2] = cube["BOTTOM"][0][0];
          leftFace[1][2] = cube["BOTTOM"][0][1];
          leftFace[2][2] = cube["BOTTOM"][0][2];

          topFace[2][0] = cube["LEFT"][2][2];
          topFace[2][1] = cube["LEFT"][1][2];
          topFace[2][2] = cube["LEFT"][0][2];

          rightFace[0][0] = cube["TOP"][2][0];
          rightFace[1][0] = cube["TOP"][2][1];
          rightFace[2][0] = cube["TOP"][2][2];



          bottomFace[0][0] = cube["RIGHT"][2][0];
          bottomFace[0][1] = cube["RIGHT"][1][0];
          bottomFace[0][2] = cube["RIGHT"][0][0];

          newCube["FRONT"] = this.rotateFace(cube["FRONT"], "cw");
          newCube["BACK"] = cube["BACK"];
          newCube["LEFT"] = leftFace;
          newCube["TOP"] = topFace;
          newCube["RIGHT"] = rightFace;
          newCube["BOTTOM"] = bottomFace;

          if (directlyUpdateCube) {
               this.setState({ faces: newCube });
          } else {
               return newCube;
          }
     }

     rotateFront180Deg(cube) {
          let newCube = this.rotateFrontCW(cube);
          return this.rotateFrontCW(newCube);
     }

     rotateFrontCCW(cube, directlyUpdateCube) {
          console.log("in cube.js. Rotate front CCW")
          let newCube = this.rotateFront180Deg(cube);
          newCube = this.rotateFrontCW(newCube);
          if (directlyUpdateCube) {
               this.setState({ faces: newCube });
          } else {
               return newCube;
          }
     }

     makeTopBlack() {
          let newFaces = JSON.parse(JSON.stringify(this.state.faces))
          let face = this.state.faces["FRONT"];
          if (face === undefined || face[0] === undefined || face[0][0] === undefined) {
               console.log("could not set top black");
               return
          }
          for (let i = 0; i < 3; i++) {
               for (let j = 0; j < 3; j++) {
                    face[i][j] = "BLACK";
               }
          }
          newFaces["TOP"] = face;
          this.setState({ faces: newFaces });
     }

     getTopControls() {
          return (
               <>
                    <div className="controls controls-top">
                         <label> look to left
                              <input
                                   type="checkbox"
                                   className="checkbox"
                                   onChange={this.lookToLeftFace} />
                         </label>
                         <label> look to top
                              <input
                                   type="checkbox"
                                   className="checkbox"
                                   onChange={this.lookToTopFace} />
                         </label>
                         <label> look to bottom
                              <input
                                   type="checkbox"
                                   className="checkbox"
                                   onChange={this.lookToBottomFace} />
                         </label>
                         <label> look to right
                              <input
                                   type="checkbox"
                                   className="checkbox"
                                   onChange={this.lookToRightFace} />
                         </label>
                    </div>
               </>
          )
     }

     getBottomControls() {
          return (
               <>
                    <div className="controls controls-bottom">
                         <label> rotate front 180 degrees
                              <input
                                   type="checkbox"
                                   className="checkbox"
                                   onChange={() => { this.setState({ faces: this.rotateFront180Deg(this.state.faces) }); }} />
                         </label>
                    </div>

                    <div className="controls controls-bottom">
                         <label> make top black
                              <input
                                   type="checkbox"
                                   className="checkbox"
                                   onChange={this.makeTopBlack} />
                         </label>
                    </div>
                    <form>
                         <label for="fname">Save as:</label>
                         <input type="text" id="saveAs" name="saveField"></input>
                    </form>
                    <button>
                         save
                    </button>
                    <form>
                         <label for="fname">load save:</label>
                         <input type="text" id="loadSave" name="load"></input>
                    </form>
                    <button>
                         save
                    </button>
               </>
                    )
     }

                    render() {
          return (

                    <>
                         <Grid spacing={0} container direction="column" justify={"center"}>


                              <Grid spacing={0} container direction="row" justify={"center"}>
                                   <Grid item xs={4}>
                                        <CubeFace faceArr={this.state.faces["TOP"]} facePosition={"TOP"} lookToFace={this.lookToTopFace} />
                                   </Grid>
                              </Grid>
                              <Grid spacing={0} container direction="row" justify={"center"}>
                                   <Grid item>
                                        <CubeFace faceArr={this.state.faces["LEFT"]} facePosition={"LEFT"} lookToFace={this.lookToLeftFace} />
                                   </Grid>
                                   <Grid item>
                                        <CubeFace faceArr={this.state.faces["FRONT"]} facePosition={"FRONT"} rotateCW={this.rotateFrontCW} rotateCCW={this.rotateFrontCCW} />
                                   </Grid>
                                   <Grid item>
                                        <CubeFace faceArr={this.state.faces["RIGHT"]} facePosition={"RIGHT"} lookToFace={this.lookToRightFace} />
                                   </Grid>
                              </Grid>
                              <Grid spacing={0} container direction="row" justify={"center"}>
                                   <Grid item xs={4}>
                                        <CubeFace faceArr={this.state.faces["BOTTOM"]} facePosition={"BOTTOM"} lookToFace={this.lookToBottomFace} />
                                   </Grid>
                              </Grid>
                              <Grid spacing={0} container direction="row" justify={"center"} >
                                   {this.getBottomControls()}
                              </Grid>
                         </Grid>
                    </>
                    )
     }
}

                    export default Cube;
