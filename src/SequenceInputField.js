import React from "react";
import "./App.css";

class SequenceInputField extends React.Component {
	constructor(props) {
		super(props);
		this.state = { value: "" };

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(e) {
		this.setState({ value: e.target.value });
	}

	handleSubmit() {
		this.props.loadState(this.state.value);
		this.setState({ value: "" });
		// event.preventDefault();
	}

	render() {
		return (
			<label>
				Sequence:
				<input
					type="text"
					value={this.state.value}
					onChange={this.handleChange}
					onKeyPress={(e) => {
						if (e.key === "Enter") {
							this.handleSubmit();
						}
					}}
				/>
			</label>
		);
	}
}

export default SequenceInputField;
