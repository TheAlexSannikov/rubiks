import React from 'react';
import './App.css';
import { Grid } from '@material-ui/core';
import CubeRow from './CubeRow';

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
          newFaces["RIGHT"] = this.rotateFace(faces["RIGHT"],"ccw")
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
          newFaces["RIGHT"] = this.rotateFace(faces["RIGHT"],"cw")
          await this.setState({ faces: newFaces, });
          console.log(this.state.faces);
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
                              <CubeRow row={top} rowNumber={0}/>
                         </Grid>
                         <Grid className={'meat'} container item xs={12} spacing={3}>
                              <CubeRow row={meat} rowNumber={1}/>
                         </Grid>
                         <Grid className={'bottom'} container item xs={12} spacing={3}>
                              <CubeRow row={bottom} rowNumber={2}/>
                         </Grid>
                    </Grid>
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
