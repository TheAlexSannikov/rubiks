import React from "react";
import Cube from "./Cube";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App(props) {
	return (
		<Tabs defaultActiveKey="3d" id="navbar" className="mb-3">
			<Tab eventKey="3d" title="3d" className="tab">
				<Cube displayMode="3d" />
			</Tab>
			<Tab eventKey="net" title="net" className="tab">
				<Cube displayMode="net" />
			</Tab>
		</Tabs>
	);
}
export default App;
