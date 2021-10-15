import React, { useState } from "react";
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

	// const [currentTab, setCurrentTab] = useState("net");
	// return (
	// 	<Tabs
	// 		defaultActiveKey="net"
	// 		id="navbar"
	// 		className="mb-3"
	// 		onSelect={(k) => {
	// 			console.log("current tab: " + k);
	// 			setCurrentTab(k);
	// 		}}
	// 	>
	// 		<Tab eventKey="net" title="net" className="tab">
	// 			<Cube
	// 				displayMode="net"
	// 				currentTab={currentTab === "net" ? true : false}
	// 			/>
	// 		</Tab>
	// 		<Tab eventKey="3d" title="3d" className="tab">
	// 			<Cube
	// 				displayMode="3d"
	// 				currentTab={currentTab === "3d" ? true : false}
	// 			/>
	// 		</Tab>
	// 	</Tabs>
	// );
}
export default App;
