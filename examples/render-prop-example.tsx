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

function RenderPropExample(props: {
    position: IPosition;
    children?: React.ReactNode;
}) {
    return (
        <Popover
            position={props.position}
            renderContent={() => (
                <div style={contentStyles}>
                    {props.children ? (
                        props.children
                    ) : (
                        <>
                            <a href="#1">link1</a>
                            <a href="#2">link2</a>
                        </>
                    )}
                </div>
            )}
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
