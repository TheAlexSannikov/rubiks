import React from 'react';
import { Grid, Paper } from '@material-ui/core';

class CubeRow extends React.Component {
     constructor(props) {
          super(props)
     }


     render() {
          if (this.props.row === undefined)
               return

          return (
               <React.Fragment>
                    <Grid item xs={4}>
                         <Paper className={`cuberow left ${this.props.row[0]}`} > {this.props.rowNumber} , {0} </Paper>
                    </Grid>
                    <Grid item xs={4}>
                         <Paper className={`cuberow center ${this.props.row[1]}`}> {this.props.rowNumber} , {1} </Paper>
                    </Grid>
                    <Grid className={'right'} item xs={4}>
                         <Paper className={`cuberow right ${this.props.row[2]}`}> {this.props.rowNumber} , {2} </Paper>
                    </Grid>
               </React.Fragment>
          );
     }
}

export default CubeRow;
