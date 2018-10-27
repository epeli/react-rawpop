import React, {CSSProperties} from "react";
import ReactDOM from "react-dom";

const Z_INDEX_BASE = 100;

function getOverlayStyles(): CSSProperties {
    return {
        display: "flex",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // backgroundColor: "rgba(0, 0, 0, 0.05)",
        zIndex: Z_INDEX_BASE,
    };
}

function getContainerStyles(props: {
    top: number;
    left: number;
    position: string;
}): CSSProperties {
    return {
        display: "flex",
        zIndex: Z_INDEX_BASE + 1,
        position: "fixed",
        flexDirection: "column",
        alignItems: "center",
        top: props.top,
        left: props.left,
        transform: props.position,
    };
}

const transforms = {
    top: "translate(-50%, -100%)",
    bottom: "translateX(-50%)",
    left: "translate(-100%, -50%)",
};

export type IPosition = keyof typeof transforms;

export interface IPopoverActions {
    open: () => void;
    close: () => void;
    // getRef: React.RefObject<HTMLElement>;
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
    overlay?: boolean;
    visible?: boolean;
    onChange?: (visible: boolean) => void;
    renderContent(props: IContentParams): React.ReactNode;
}

interface IState {
    visible: boolean;
    position: {top: number; left: number};
}

export class Popover extends React.Component<IPopoverProps, IState> {
    overlayContainer!: HTMLElement;

    wrapRef = React.createRef<HTMLElement>();

    static defaultProps = {
        overlay: true,
    };

    constructor(props: IPopoverProps) {
        super(props);
        this.state = {
            position: {top: 0, left: 0},
            visible: false,
        };
    }

    isVisible(): boolean {
        if (typeof this.props.visible === "boolean") {
            return this.props.visible;
        }

        return this.state.visible;
    }

    componentDidMount() {
        const el = document.getElementById("overlay-container");
        if (el) {
            this.overlayContainer = el;
        } else {
            throw new Error("Popover: cannot find overlay-container");
        }
    }

    close = () => {
        if (this.props.onChange) {
            this.props.onChange(false);
        }
        this.setState({visible: false});
    };

    handleWrapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).dataset.popoveroverlay) {
            this.close();
        }
    };

    open = () => {
        if (this.props.onChange) {
            this.props.onChange(true);
        }
        this.setState({visible: true});
        this.updatePosition();
    };

    getPosition(): IPosition {
        return this.props.position || "bottom";
    }

    updatePosition = () => {
        if (!this.wrapRef.current) {
            return;
        }

        const rect = this.wrapRef.current.getBoundingClientRect();

        const center = {
            top: rect.top + rect.height / 2,
            left: rect.left + rect.width / 2,
        };

        // const isTop = window.innerHeight / 2 - center.top > 0;
        // const isRight = window.innerWidth / 2 - center.left < 0;

        let left: number;
        let top: number;

        const position = this.getPosition();
        if (position === "bottom") {
            left = center.left;
            top = rect.top + rect.height;
        } else if (position === "top") {
            left = center.left;
            top = rect.top;
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

    renderMaybeOverlay(children: React.ReactNode) {
        if (!this.props.overlay) {
            return children;
        }

        return (
            <div
                style={getOverlayStyles()}
                data-popoveroverlay
                onClick={this.handleOverlayClick}
            >
                {children}
            </div>
        );
    }
    render() {
        return (
            <>
                {this.props.children({
                    open: this.open,
                    close: this.close,
                    getRef: this.wrapRef as any, // hmph
                })}
                {this.isVisible() &&
                    ReactDOM.createPortal(
                        this.renderMaybeOverlay(
                            <div
                                style={getContainerStyles({
                                    position: transforms[this.getPosition()],
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
                        ),
                        this.overlayContainer,
                    )}
            </>
        );
    }
}
