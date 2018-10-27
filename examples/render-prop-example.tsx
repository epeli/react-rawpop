import React, {CSSProperties} from "react";
import {Popover} from "../src";
import styled from "react-emotion";

const Button = styled("button")({
    color: "red",
});

const contentStyles: CSSProperties = {
    backgroundColor: "red",
};

const buttonStyles: CSSProperties = {
    margin: 100,
};

function RenderPropExample() {
    return (
        <Popover
            position="bottom"
            renderContent={() => <div style={contentStyles}>hello</div>}
        >
            {pop => (
                <Button
                    style={buttonStyles}
                    innerRef={pop.getRef}
                    onClick={pop.open}
                >
                    click
                </Button>
            )}
        </Popover>
    );
}

export default RenderPropExample;
