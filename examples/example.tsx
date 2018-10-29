import ReactDOM from "react-dom";
import React from "react";
import RenderPropExample from "./render-prop-example";

function App() {
    return (
        <div>
            <div id="overlay-container" />
            <div>
                <RenderPropExample position="center" />
                <RenderPropExample position="left" />
                <RenderPropExample position="top" />
                <RenderPropExample position="bottom" />
                <RenderPropExample position="right" />
            </div>
            <div>
                <RenderPropExample position="top-left" />
                <RenderPropExample position="top-right" />
                <RenderPropExample position="bottom-left" />
                <RenderPropExample position="bottom-right" />
            </div>
        </div>
    );
}

const root = document.getElementById("app");

if (root) {
    ReactDOM.render(<App />, root);
}
