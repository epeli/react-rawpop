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

    export interface FocusTrap {
        activate(options: {onActivate?: Function}): FocusTrap;
        deactivate(options: {
            returnFocus?: boolean;
            onDeactivate?: Function;
        }): FocusTrap;
        pause(): FocusTrap;
        unpause(): FocusTrap;
    }

    function createFocusTrap(
        element: HTMLElement,
        options: TrapOptions,
    ): FocusTrap;
    export default createFocusTrap;
}
