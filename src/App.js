import React from "react";
import "./App.css";
import "./styles/custom_styles.css";
import Board from "./views/Board";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                {/* <header> */}
                <Board />
            </header>
        </div>
    );
}

export default App;
