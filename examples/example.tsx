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

                <RenderPropExample position="bottom-right">
                    <a href="#4">link</a>
                    <RenderPropExample position="bottom-left" />
                </RenderPropExample>
            </div>
            <div>
                <RenderPropExample name="no tappables" position="bottom-right">
                    Hello
                </RenderPropExample>
            </div>
        </div>
    );
}

const root = document.getElementById("app");

if (root) {
    ReactDOM.render(<App />, root);
}
