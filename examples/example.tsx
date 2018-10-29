import ReactDOM from "react-dom";
import React from "react";
import RenderPropExample from "./render-prop-example";
import ControlledExample from "./controlled";

function App() {
    return (
        <div>
            <div id="overlay-container" />
            <div style={{marginTop: 800, width: 1000}}>
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
            <div>
                <RenderPropExample name="no tappables" position="bottom-right">
                    Hello
                </RenderPropExample>

                <ControlledExample />

                <RenderPropExample name="nested" position="top-left">
                    <a href="#4">link</a>
                    <RenderPropExample position="bottom-left" />
                </RenderPropExample>
            </div>
        </div>
    );
}

const root = document.getElementById("app");

if (root) {
    ReactDOM.render(<App />, root);
}
