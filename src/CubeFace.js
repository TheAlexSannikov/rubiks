import React from "react";
import { Grid } from "@material-ui/core";
import CubeRow from "./CubeRow";

class CubeFace extends React.Component {
	constructor(props) {
		super(props);
		this.handleCenterPieceClick = this.handleCenterPieceClick.bind(this); // rename / make more general?
	}

	//clicking center piece will rotate front piece
	handleCenterPieceClick(e) {}

	getFace() {
		if (this.props.face === undefined) return;
		console.log("this.props.face");
		console.log(this.props.face);
		return (
			<Grid className={`cubeFace ${this.props.face}`} container>
				<CubeRow row={this.props.face[-1]} className="bottom"></CubeRow>
				<CubeRow row={this.props.face[0]} className="meat"></CubeRow>
				<CubeRow row={this.props.face[1]} className="top"></CubeRow>
			</Grid>
		);
	}

	render() {
		return <>{this.getFace()}</>;
	}
}
export default CubeFace;
