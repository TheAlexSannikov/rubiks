import React from 'react';
import { Grid, Paper } from '@material-ui/core';

function CubeRow(props) {
     if (props.row === undefined)
          return
     return (props.front ?
          <>
               <Grid item xs={4}>
                    <Paper className={`cuberow left ${props.row[0]}`}> {props.rowNumber} , {0} </Paper>
               </Grid>
               <Grid item xs={4}>
                    <Paper className={`cuberow center ${props.row[1]}`} onClick={(e) => props.handleCenterClick(e)} onContextMenu={(e) => {
                         props.handleCenterClick(e); e.preventDefault();
                    }}> {props.rowNumber} , {1} </Paper>
               </Grid>
               <Grid item xs={4}>
                    <Paper className={`cuberow right ${props.row[2]}`}> {props.rowNumber} , {2} </Paper>
               </Grid>
          </>
          :
          <>
               <Grid item xs={4}>
                    <Paper className={`cuberow left ${props.row[0]}`} > {props.rowNumber} , {0} </Paper>
               </Grid>
               <Grid item xs={4}>
                    <Paper className={`cuberow center ${props.row[1]}`}> {props.rowNumber} , {1} </Paper>
               </Grid>
               <Grid item xs={4}>
                    <Paper className={`cuberow right ${props.row[2]}`}> {props.rowNumber} , {2} </Paper>
               </Grid>
          </>
     );
}

export default CubeRow;
