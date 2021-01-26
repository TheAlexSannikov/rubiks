import React from 'react';
import './App.css';
import { Grid } from '@material-ui/core';
import CubeRow from './CubeRow';
import { lightGreen } from '@material-ui/core/colors';

const colors = ['WHITE', 'BLUE', 'RED', 'GREEN', 'ORANGE', 'YELLOW']; // dictates the starting position; and center pieces 
const faceNames = ['BOTTOM', 'FRONT', 'RIGHT', 'BACK', 'LEFT', 'TOP'];

class Cube extends React.Component {
     constructor(props) {
          super(props)
          this.state = {
               faces: [{}],
               displayedFace: props.displayedFace,
          }
          this.lookToRightFace = this.lookToRightFace.bind(this);
          this.lookToLeftFace = this.lookToLeftFace.bind(this);
          this.lookToTopFace = this.lookToTopFace.bind(this);
          this.lookToBottomFace = this.lookToBottomFace.bind(this);
          this.rotateFrontCW = this.rotateFrontCW.bind(this);
     }

     rotateFace(face, dir) { //lookToRight: top -> cw; bottom -> ccw
          if (dir !== 'ccw' && dir !== 'cw')
               throw 'dir can only be ccw or cw'
          //lazy
          let newFace = [];
          let top = [];
          let meat = [];
          let bottom = [];
          if (dir == 'cw') {
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

     async loadInitialState() {
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

          await this.setState({ faces: newFaces })
          console.log(this.state.faces)
     }

     async lookToRightFace() {
          const faces = this.state.faces;
          let newFaces = {};
          newFaces["FRONT"] = faces["RIGHT"];
          newFaces["RIGHT"] = faces["BACK"];
          newFaces["BACK"] = faces["LEFT"];
          newFaces["LEFT"] = faces["FRONT"];

          newFaces["TOP"] = this.rotateFace(faces["TOP"], 'cw');
          newFaces["BOTTOM"] = this.rotateFace(faces["BOTTOM"], 'ccw');
          await this.setState({ faces: newFaces, });
          console.log(this.state.faces);
     }

     async lookToLeftFace() {
          const faces = this.state.faces;
          let newFaces = {};
          newFaces["FRONT"] = faces["LEFT"];
          newFaces["LEFT"] = faces["BACK"];
          newFaces["BACK"] = faces["RIGHT"];
          newFaces["RIGHT"] = faces["FRONT"];
          newFaces["TOP"] = this.rotateFace(faces["TOP"], 'ccw');
          newFaces["BOTTOM"] = this.rotateFace(faces["BOTTOM"], 'cw');
          await this.setState({ faces: newFaces, });
          console.log(this.state.faces);
     }

     async lookToTopFace() {
          const faces = this.state.faces;
          let newFaces = {};
          newFaces["FRONT"] = faces["TOP"];
          newFaces["TOP"] = faces["BACK"];
          newFaces["BACK"] = faces["BOTTOM"];
          newFaces["BOTTOM"] = faces["FRONT"];

          newFaces["LEFT"] = this.rotateFace(faces["LEFT"], "cw");
          newFaces["RIGHT"] = this.rotateFace(faces["RIGHT"], "ccw")
          await this.setState({ faces: newFaces, });
          console.log(this.state.faces);
     }

     async lookToBottomFace() {
          const faces = this.state.faces;
          let newFaces = {};
          newFaces["FRONT"] = faces["BOTTOM"];
          newFaces["BOTTOM"] = faces["BACK"];
          newFaces["BACK"] = faces["TOP"];
          newFaces["TOP"] = faces["FRONT"];
          newFaces["LEFT"] = this.rotateFace(faces["LEFT"], "ccw");
          newFaces["RIGHT"] = this.rotateFace(faces["RIGHT"], "cw")
          await this.setState({ faces: newFaces, });
          console.log(this.state.faces);
     }

     rotateFrontCW(cube) {
          if (cube == undefined || cube["FRONT"] === undefined)
               return

          let newCube = {};
          // for (const faceName in cube) { //copy cube
          //      const face = object[faceName];
          //      newCube[faceName] = face;
          // }


          let leftFace = JSON.parse(JSON.stringify(cube["LEFT"]));
          let topFace = JSON.parse(JSON.stringify(cube["TOP"]));
          let rightFace = JSON.parse(JSON.stringify(cube["RIGHT"]));
          let bottomFace = JSON.parse(JSON.stringify(cube["BOTTOM"]));
          console.log(leftFace)

          //lazy algorithm
          leftFace[0][2] = cube["BOTTOM"][0][0];
          leftFace[1][2] = cube["BOTTOM"][0][1];
          leftFace[2][2] = cube["BOTTOM"][0][2];

          console.log(cube);

          topFace[2][0] = cube["LEFT"][0][2];
          topFace[2][1] = cube["LEFT"][1][2];
          topFace[2][2] = cube["LEFT"][2][2];

          rightFace[0][0] = cube["TOP"][2][0];
          rightFace[1][0] = cube["TOP"][2][1];
          rightFace[2][0] = cube["TOP"][2][2];

          bottomFace[0][0] = cube["RIGHT"][0][0];
          bottomFace[0][1] = cube["RIGHT"][1][0];
          bottomFace[0][2] = cube["RIGHT"][2][0];

          newCube["FRONT"] = this.rotateFace(cube["FRONT"], "cw");
          newCube["BACK"] = cube["BACK"];
          newCube["LEFT"] = leftFace;
          newCube["TOP"] = topFace;
          newCube["RIGHT"] = rightFace;
          newCube["BOTTOM"] = bottomFace;
          console.log(newCube)
          return newCube;
     }

     getDisplayedFace() {
          let face = this.state.faces[this.state.displayedFace];
          if (face === undefined)
               return
          let top = face[0];
          let meat = face[1];
          let bottom = face[2];

          return (
               <>
                    <div className="controls controls-top">
                         <label> look to left
                         <input
                                   type="checkbox"
                                   className="checkbox"
                                   // value="1"
                                   // checked={}
                                   onChange={this.lookToLeftFace} />
                         </label>
                         <label> look to top
                         <input
                                   type="checkbox"
                                   className="checkbox"
                                   // value="1"
                                   // checked={}
                                   onChange={this.lookToTopFace} />
                         </label>
                         <label> look to bottom
                         <input
                                   type="checkbox"
                                   className="checkbox"
                                   // value="1"
                                   // checked={}
                                   onChange={this.lookToBottomFace} />
                         </label>
                         <label> look to right
                         <input
                                   type="checkbox"
                                   className="checkbox"
                                   // value="1"
                                   // checked={}
                                   onChange={this.lookToRightFace} />
                         </label>
                    </div>
                    <Grid container spacing={1}>

                         <Grid className={'top'} container item xs={12} spacing={3}>
                              <CubeRow row={top} rowNumber={0} />
                         </Grid>
                         <Grid className={'meat'} container item xs={12} spacing={3}>
                              <CubeRow row={meat} rowNumber={1} />
                         </Grid>
                         <Grid className={'bottom'} container item xs={12} spacing={3}>
                              <CubeRow row={bottom} rowNumber={2} />
                         </Grid>
                    </Grid>
                    <div className="controls controls-bottom">
                         <label> rotate front CW
                         <input
                                   type="checkbox"
                                   className="checkbox"
                                   // value="1"
                                   // checked={}
                                   onChange={() => { this.setState({ faces: this.rotateFrontCW(this.state.faces) }); }} />
                         </label>
                    </div>
               </>
          );
     }

     render() {
          return (
               <div>
                    {this.getDisplayedFace()}
               </div>
          )
     }

     // taken from https://material-ui.com/components/grid/


}

export default Cube;
