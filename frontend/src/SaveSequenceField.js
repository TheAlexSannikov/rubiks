import React from "react";
import RestaurantDataService from "./services/restaurant";
import "./App.css";

class SaveSequenceField extends React.Component {
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
		console.log("here1");
		// this.props.saveSequence(this.state.value);
		// this.setState({ value: "" });
		// event.preventDefault();
		console.log("here2");
		RestaurantDataService.getAll()
			.then((response) => {
				console.log(response.data);
			})
			.catch((e) => {
				console.log(e);
			});
	}

	render() {
		return (
			<label>
				Save Sequence
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

export default SaveSequenceField;
