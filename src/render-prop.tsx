import React, {CSSProperties, MouseEventHandler} from "react";
import ReactDOM from "react-dom";
import focusTrap, {FocusTrap} from "focus-trap";

const Z_INDEX_BASE = 100;

function getContainerStyles(props: {
    top: number;
    left: number;
    position: string;
}): CSSProperties {
    return {
        zIndex: Z_INDEX_BASE + 1,
        position: "absolute",
        top: props.top,
        left: props.left,
        transform: props.position,
    };
}

const TRANSFORMS = {
    top: "translate(-50%, -100%)",
    bottom: "translateX(-50%)",
    left: "translate(-100%, -50%)",
    right: "translate(0%, -50%)",
    center: "translate(-50%, -50%)",

    ["top-left"]: "translate(-100%, -100%)",
    ["top-right"]: "translate(0%, -100%)",
    ["bottom-left"]: "translate(-100%, 0%)",
    ["bottom-right"]: "",
};

export type IPosition = keyof typeof TRANSFORMS;

export interface IPopoverActions {
    open: () => void;
    close: () => void;
    getRef: (el: HTMLElement | null) => any;
}

export interface IContentParams {
    close: () => void;
    open: () => void;
    position: IPosition;
}

export interface IPopoverProps {
    children: (actions: IPopoverActions) => React.ReactNode;
    position?: IPosition;
    isOpen?: boolean;
    onChange?: (visible: boolean) => void;
    renderContent(props: IContentParams): React.ReactNode;
}

interface IState {
    isOpen: boolean;
    position: {top: number; left: number};
    overlayContainer: HTMLElement | null;
}

const TRAPS: ReturnType<typeof focusTrap>[] = [];

export class Popover extends React.Component<IPopoverProps, IState> {
    targetRef = React.createRef<HTMLElement>();
    containerEl?: HTMLDivElement;
    trap?: FocusTrap;

    constructor(props: IPopoverProps) {
        super(props);
        this.state = {
            position: {top: 0, left: 0},
            isOpen: false,
            overlayContainer: null,
        };
    }

    isVisible(): boolean {
        if (typeof this.props.isOpen === "boolean") {
            return this.props.isOpen;
        }

        return this.state.isOpen;
    }

    componentDidMount() {
        const el = document.getElementById("overlay-container");

        if (!el) {
            return;
        }

        this.setState({overlayContainer: el}, () => {
            this.updatePosition();
        });
    }

    componentWillUnmount() {
        this.removeTrap();
    }

    componentDidUpdate() {
        this.updateTrap();
    }

    updateTrap() {
        if (!this.trap) {
            return;
        }

        if (this.isVisible()) {
            this.trap.activate();
        } else {
            this.trap.deactivate();
        }
    }

    close = () => {
        if (this.props.onChange) {
            this.props.onChange(false);
        }
        this.setState({isOpen: false});

        TRAPS.forEach(trap => {
            if (trap !== this.trap) {
                trap.unpause();
            }
        });
    };

    handleWrapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).dataset.popoveroverlay) {
            this.close();
        }
    };

    open = () => {
        console.log("trying to open");

        TRAPS.forEach(trap => {
            if (trap !== this.trap) {
                trap.pause();
            }
        });

        if (this.props.onChange) {
            this.props.onChange(true);
        }
        this.setState({isOpen: true});
        this.updatePosition();
    };

    getPosition(): IPosition {
        return this.props.position || "bottom";
    }

    updatePosition = () => {
        if (!this.targetRef.current) {
            return;
        }

        const rect = this.targetRef.current.getBoundingClientRect();

        const center = {
            top: rect.top + rect.height / 2,
            left: rect.left + rect.width / 2,
        };

        let left: number;
        let top: number;

        const position = this.getPosition();

        if (position === "bottom") {
            left = center.left;
            top = rect.top + rect.height;
        } else if (position === "top") {
            left = center.left;
            top = rect.top;
        } else if (position === "center") {
            left = center.left;
            top = center.top;
        } else if (position === "right") {
            left = rect.left + rect.width;
            top = center.top;
        } else if (position === "top-left") {
            left = rect.left;
            top = rect.top;
        } else if (position === "top-right") {
            left = rect.left + rect.width;
            top = rect.top;
        } else if (position === "bottom-right") {
            left = rect.left + rect.width;
            top = rect.top + rect.height;
        } else if (position === "bottom-left") {
            left = rect.left;
            top = rect.top + rect.height;
        } else {
            // left
            left = rect.left;
            top = center.top;
        }

        this.setState({
            position: {
                top: top,
                left,
            },
        });
    };

    handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as any).dataset.popoveroverlay) {
            this.close();
        }
    };

    removeTrap() {
        if (!this.trap) {
            return;
        }

        this.trap.deactivate();

        const index = TRAPS.indexOf(this.trap);

        if (index > -1) {
            TRAPS.splice(index, 1);
        }
    }

    getContentRef = (el: HTMLDivElement | null) => {
        if (!el) {
            this.removeTrap();
            this.containerEl = undefined;
            return;
        }

        if (this.containerEl === el) {
            return;
        }

        if (this.trap) {
            this.removeTrap();
        }

        this.containerEl = el;

        this.trap = focusTrap(el, {
            fallbackFocus: () => {
                if (this.containerEl) {
                    return this.containerEl;
                } else {
                    throw new Error("No contentEl?");
                }
            },
            clickOutsideDeactivates: true,
            onDeactivate: this.close,
        });

        TRAPS.push(this.trap);
    };

    render() {
        const {overlayContainer} = this.state;

        return (
            <>
                {this.props.children({
                    open: this.open,
                    close: this.close,
                    getRef: this.targetRef as any, // hmph
                })}
                {this.isVisible() &&
                    overlayContainer &&
                    ReactDOM.createPortal(
                        <div
                            ref={this.getContentRef}
                            tabIndex={-1}
                            style={getContainerStyles({
                                position: TRANSFORMS[this.getPosition()],
                                top: this.state.position.top,
                                left: this.state.position.left,
                            })}
                        >
                            {this.props.renderContent({
                                position: this.getPosition(),
                                close: this.close,
                                open: this.open,
                            })}
                        </div>,

                        overlayContainer,
                    )}
            </>
        );
    }
}
