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
		return (
			<Grid className={`cubeFace ${this.props.face}`} container spacing={1} direction="row">
				<Grid className={"top"} container item xs={12} spacing={3}>
					<CubeRow row={this.props.face[-1]} />
				</Grid>
				<Grid className={"meat"} container item xs={12} spacing={3}>
					<CubeRow
						row={this.props.face[0]}
						// handleCenterClick={this.handleCenterPieceClick} // TODO
					/>
				</Grid>
				<Grid className={"bottom"} container item xs={12} spacing={3}>
					<CubeRow row={this.props.face[1]} />
				</Grid>
			</Grid>
		);
	}

	render() {
		return <>{this.getFace()}</>;
	}
}
export default CubeFace;
