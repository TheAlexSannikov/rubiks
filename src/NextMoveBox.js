import React from "react";
import "./App.css";

class NextMoveBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = { value: "F" };

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({ value: event.target.value });
	}

	handleSubmit(event) {
		// alert("Your move is: " + this.state.value);
		this.props.makeMove(this.state.value);
		event.preventDefault();
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<label>
					Next move:
					<select
						value={this.state.value}
						onChange={this.handleChange}
					>
						<option value="F">F</option>
						<option value="F'">F'</option>
						<option value="F²">F²</option>
						
						<option value="B">B</option>
						<option value="B'">B'</option>
						<option value="B²">B²</option>
						
						<option value="U">U</option>
						<option value="U'">U'</option>
						<option value="U²">U²</option>
						
						<option value="D">D</option>
						<option value="D'">D'</option>
						<option value="D²">D²</option>
						
						<option value="L">L</option>
						<option value="L'">L'</option>
						<option value="L²">L²</option>
						
						<option value="R">R</option>
						<option value="R'">R'</option>
						<option value="R²">R²</option>
						
						<option value="x">x</option>
						<option value="x'">x'</option>
						<option value="x²">x²</option>
			
						<option value="y">y</option>
						<option value="y'">y'</option>
						<option value="y²">y²</option>

						<option value ="z">z</option>
						<option value ="z'">z'</option>
						<option value ="z²">z²</option>

					</select>
				</label>
				<input type="submit" value="Submit" />
			</form>
		);
	}
}
export default NextMoveBox;
