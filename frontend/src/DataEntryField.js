import React, { useState } from "react";

import "./App.css";

const DataEntryField = (props) => {
	const [input, setInput] = React.useState("");

	return (
		<label>
			{props.label}
			<input
				type="text"
				value={input}
				onChange={(e) => {
					setInput(e.target.value);
				}}
				onKeyPress={(e) => {
					if (e.key === "Enter") {
						props.onEnter(input);
						setInput("");
					}
				}}
			/>
		</label>
	);
};

export default DataEntryField;
