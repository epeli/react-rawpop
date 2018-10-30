import React, {CSSProperties, MouseEventHandler} from "react";
import ReactDOM from "react-dom";
import focusTrap, {FocusTrap} from "focus-trap";

const DEFAULT_CONTAINER_ID = "react-rawpop-container";

/**
 * https://github.com/WICG/EventListenerOptions/blob/139eb342e1cccb71c9be849927566a2ab6657097/explainer.md
 */
let SUPPORTS_PASSIVE = false;
try {
    var opts = Object.defineProperty({}, "passive", {
        get: function() {
            SUPPORTS_PASSIVE = true;
        },
    });
    window.addEventListener("testPassive", null as any, opts);
    window.removeEventListener("testPassive", null as any, opts);
} catch (e) {}

const CONTENT_STYLES: CSSProperties = {
    zIndex: 1000,
    position: "absolute",
};

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

export type Position = keyof typeof TRANSFORMS;

export interface TargetRenderProps {
    open: () => void;
    close: () => void;
    getRef: (el: HTMLElement | null) => any;
}

export interface ContentRenderProps {
    close: () => void;
    open: () => void;
    position: Position;
}

export interface RawPopProps {
    children: (actions: TargetRenderProps) => React.ReactNode;
    position?: Position;
    isOpen?: boolean;
    onChange?: (visible: boolean) => void;
    renderContent(props: ContentRenderProps): React.ReactNode;
    getContainer?: () => HTMLElement | null | undefined;
    contentClassName?: string;
    contentStyles?: CSSProperties;
}

interface State {
    isOpen: boolean;
    position: {top: number; left: number};
    overlayContainer: HTMLElement | null;
}

const TRAPS: ReturnType<typeof focusTrap>[] = [];

export class RawPop extends React.Component<RawPopProps, State> {
    targetRef = React.createRef<HTMLElement>();
    containerEl?: HTMLDivElement;
    trap?: FocusTrap;

    constructor(props: RawPopProps) {
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
        this.bindScroll();
        this.getContainer();
    }

    createContainer() {
        let el = document.getElementById(DEFAULT_CONTAINER_ID);

        if (!el) {
            el = document.createElement("div");
            el.id = DEFAULT_CONTAINER_ID;
            document.body.appendChild(el);
        }

        return el;
    }

    getContainer() {
        const el = this.props.getContainer
            ? this.props.getContainer()
            : this.createContainer();

        if (!el) {
            throw new Error("react-rawpop failed to get container");
        }

        this.setState({overlayContainer: el}, () => {
            this.updatePosition();
        });
    }

    bindScroll() {
        window.addEventListener(
            "scroll",
            this.updatePosition,
            SUPPORTS_PASSIVE ? {passive: true} : false,
        );
    }

    componentWillUnmount() {
        this.removeTrap();
        window.removeEventListener("scroll", this.updatePosition);
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

    open = () => {
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

    getPosition(): Position {
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
                top: top + window.scrollY,
                left: left + window.scrollX,
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
            initialFocus: () => el,
            clickOutsideDeactivates: true,
            onDeactivate: this.close,
        });

        TRAPS.push(this.trap);
    };

    render() {
        const {overlayContainer} = this.state;
        let {contentClassName, contentStyles} = this.props;

        let extraTransform = "";

        if (contentStyles && contentStyles.transform) {
            extraTransform = " " + contentStyles.transform;
        }

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
                            className={(
                                "react-rawpop-content " +
                                (contentClassName || "")
                            ).trim()}
                            ref={this.getContentRef}
                            tabIndex={-1}
                            style={{
                                ...CONTENT_STYLES,
                                ...contentStyles,
                                transform:
                                    TRANSFORMS[this.getPosition()] +
                                    extraTransform,
                                top: this.state.position.top,
                                left: this.state.position.left,
                            }}
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
