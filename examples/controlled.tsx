import React from "react";
import {RawPop} from "../src";
const initialState = {open: false};

class ControlledExample extends React.Component<{}, typeof initialState> {
    state = initialState;

    render() {
        return (
            <RawPop
                position="bottom"
                isOpen={this.state.open}
                onChange={open => {
                    // this.setState({open});
                    setTimeout(() => {
                        this.setState({open});
                    }, 500);
                }}
                renderContent={() => (
                    <div style={{backgroundColor: "yellow"}}>
                        <a href="#1">link1</a>
                        <a href="#2">link2</a>
                    </div>
                )}
            >
                {pop => (
                    <button ref={pop.getRef} onClick={pop.open}>
                        Slow controlled component
                    </button>
                )}
            </RawPop>
        );
    }
}

export default ControlledExample;
