/**
 * @private
 */
export declare class Form {
    private _focused;
    private _ids;
    private _inputs;
    register(input: any): void;
    deregister(input: any): void;
    focusOut(): void;
    setAsFocused(input: any): void;
    /**
     * Focuses the next input element, if it exists.
     */
    tabFocus(currentInput: any): any;
    nextId(): number;
}
