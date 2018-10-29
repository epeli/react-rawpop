import React, {CSSProperties} from "react";
import {Popover, IPosition} from "../src";
import styled from "react-emotion";

const Button = styled("button")({
    color: "red",
});

const contentStyles: CSSProperties = {
    backgroundColor: "red",
    padding: 20,
    opacity: 0.6,
};

const buttonStyles: CSSProperties = {
    margin: 50,
};

function RenderPropExample(props: {position: IPosition}) {
    return (
        <Popover
            isOpen
            position={props.position}
            renderContent={() => <div style={contentStyles}>hello</div>}
        >
            {pop => (
                <Button
                    style={buttonStyles}
                    innerRef={pop.getRef}
                    onClick={pop.open}
                >
                    {props.position}
                </Button>
            )}
        </Popover>
    );
}

export default RenderPropExample;
