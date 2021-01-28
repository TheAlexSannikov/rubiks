import React from 'react';
import { Grid } from '@material-ui/core';
import CubeRow from './CubeRow';

class CubeFace extends React.Component {
     constructor(props) {
          super(props)
          this.handleCenterPieceClick = this.handleCenterPieceClick.bind(this);
     }

     //clicking center piece will rotate front piece
     handleCenterPieceClick(e) {
          console.log("click detected");
          (e.type === 'click') ? this.props.rotateCCW(undefined, true) : this.props.rotateCW(undefined, true);
     }

     getFace() {
          if (this.props.faceArr === undefined || this.props.faceArr[2] === undefined || this.props.faceArr[2][2] === undefined)
               return (
                    <></>
               )
          let top = this.props.faceArr[0];
          let meat = this.props.faceArr[1];
          let bottom = this.props.faceArr[2];

          return (this.props.facePosition === "FRONT" ?
               //front face
               <Grid container spacing={1} >
                    <Grid className={'top'} container item xs={12} spacing={3}>
                         <CubeRow row={top} front rowNumber={0} />
                    </Grid>
                    <Grid className={'meat'} container item xs={12} spacing={3}>
                         <CubeRow row={meat} front handleCenterClick={this.handleCenterPieceClick} rowNumber={1} />
                    </Grid>
                    <Grid className={'bottom'} container item xs={12} spacing={3}>
                         <CubeRow row={bottom} front rowNumber={2} />
                    </Grid>
               </Grid>
               ://other faces
               <Grid container spacing={1} onClick={this.props.lookToFace}>
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
          )
     }

     render() {


          return (
               <>
                    {this.getFace()}
               </>
          );
     }
}
export default CubeFace