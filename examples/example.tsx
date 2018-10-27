import ReactDOM from "react-dom";
import React from "react";
import RenderPropExample from "./render-prop";

function App() {
    return (
        <div>
            <div id="overlay-container" />

            <RenderPropExample />
        </div>
    );
}

const root = document.getElementById("app");

if (root) {
    ReactDOM.render(<App />, root);
}
