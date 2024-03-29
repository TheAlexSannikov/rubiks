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
		const topIndex = this.props.face.rowColTopLeft[0] === 1 ? 1 : -1;
		const bottomIndex = this.props.face.rowColTopLeft[0] === 1 ? -1 : 1;
		return (
			<Grid
				className={`cube_face cube_face--${this.props.face.faceName}`}
				container
			>
				<CubeRow
					face={this.props.face}
					row={topIndex}
					className="top"
				></CubeRow>
				<CubeRow
					face={this.props.face}
					row={0}
					className="meat"
				></CubeRow>
				<CubeRow
					face={this.props.face}
					row={bottomIndex}
					className="bottom"
				></CubeRow>
			</Grid>
		);
	}

	render() {
		return <>{this.getFace()}</>;
	}
}
export default CubeFace;
