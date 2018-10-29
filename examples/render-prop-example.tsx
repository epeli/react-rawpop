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

class Grow extends React.Component {
    state = {
        things: [] as number[],
    };

    handleClick = () => {
        this.setState({
            things: [...this.state.things, Math.random()],
        });
    };

    render() {
        return (
            <div>
                <button onClick={this.handleClick}>add</button>
                {this.state.things.map(thing => (
                    <div key={thing}>{thing}</div>
                ))}
            </div>
        );
    }
}

function RenderPropExample(props: {
    position: IPosition;
    name?: string;
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
                            <Grow />
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
                    {props.name || props.position}
                </Button>
            )}
        </Popover>
    );
}

export default RenderPropExample;
