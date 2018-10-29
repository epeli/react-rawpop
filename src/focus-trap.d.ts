declare module "focus-trap" {
    interface GetDOMNode {
        (): HTMLElement;
    }

    interface TrapOptions {
        onActivate?: Function;
        onDeactivate?: Function;
        escapeDeactivates?: boolean;
        clickOutsideDeactivates?: boolean;
        returnFocusOnDeactivate?: boolean;

        initialFocus?: string | HTMLElement | GetDOMNode;
        fallbackFocus?: string | HTMLElement | GetDOMNode;
    }

    interface Trap {
        activate(options: {onActivate?: Function}): Trap;
        deactivate(options: {
            returnFocus?: boolean;
            onDeactivate?: Function;
        }): Trap;
        pause(): Trap;
        unpause(): Trap;
    }

    function createFocusTrap(element: HTMLElement, options: TrapOptions): Trap;
    export default createFocusTrap;
}
