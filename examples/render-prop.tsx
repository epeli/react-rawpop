import React, {CSSProperties} from "react";
import {Popover} from "../src";

const contentStyles: CSSProperties = {
    backgroundColor: "red",
};

const buttonStyles: CSSProperties = {
    margin: 100,
};

function RenderPropExample() {
    return (
        <Popover renderContent={() => <div style={contentStyles}>hello</div>}>
            {pop => (
                <button
                    style={buttonStyles}
                    ref={pop.getRef}
                    onClick={pop.open}
                >
                    click
                </button>
            )}
        </Popover>
    );
}

export default RenderPropExample;
