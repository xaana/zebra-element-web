import Resizer from "./resizer";
import FixedDistributor from "matrix-react-sdk/src/resizer/distributors/fixed";
import ResizeItem from "matrix-react-sdk/src/resizer/item";
import Sizer from "matrix-react-sdk/src/resizer/sizer";

export interface IConfig {
    toggleSize: number;
    onResizeStart?(): void;
    onResizeStop?(): void;
    onResized?(size: number | null, id: string | null, element: HTMLElement): void;
    handler?: HTMLDivElement;
}

export default class ToggleResizer<C extends IConfig, I extends ResizeItem<C> = ResizeItem<C>> extends Resizer<C, I> {
    constructor(
        container: HTMLElement | null,
        distributorCtor: {
            new (item: I): FixedDistributor<C, I>;
            createItem(resizeHandle: HTMLDivElement, resizer: Resizer<C, I>, sizer: Sizer, container?: HTMLElement): I;
            createSizer(containerElement: HTMLElement | null, vertical: boolean, reverse: boolean): Sizer;
        },
        config?: C,
    ) {
        super(container, distributorCtor, config);
    }

    public attach(): void {
        const attachment = this?.config?.handler?.parentElement ?? this.container;
        attachment?.addEventListener("click", this.onClick, false);
        window.addEventListener("resize", this.onResize);
    }

    public detach(): void {
        const attachment = this?.config?.handler?.parentElement ?? this.container;
        attachment?.removeEventListener("click", this.onClick, false);
        window.removeEventListener("resize", this.onResize);
    }

    protected onClick = (event: MouseEvent): void => {
        const resizeHandle = event.target && (<HTMLDivElement>event.target).closest(`.${this.classNames.handle}`);
        const hasHandler = this?.config?.handler;
        // prevent that stacked resizer's are both activated with one mouse event
        // (this is possible because the mouse events are connected to the containers not the handles)
        if (
            !resizeHandle || // if no resizeHandle exist / mouse event hit the container not the handle
            (!hasHandler && resizeHandle.parentElement !== this.container) || // no handler from config -> check if the containers match
            (hasHandler && resizeHandle !== hasHandler)
        ) {
            // handler from config -> check if the handlers match
            return;
        }

        // prevent starting a drag operation
        event.preventDefault();

        // mark as currently resizing
        if (this.classNames.resizing) {
            this.container?.classList?.add(this.classNames.resizing);
        }
        this.config?.onResizeStart?.();

        const { sizer, distributor } = this.createSizerAndDistributor(<HTMLDivElement>resizeHandle);
        distributor.start();

        const offset = sizer.offsetFromEvent(event);
        const toggleSize = this.config?.toggleSize || 250;
        // More on boundary
        if (offset < toggleSize - 20) {
            // open tab
            distributor.resizeFromContainerOffset(toggleSize - 1);
            distributor.resizeFromContainerOffset(toggleSize);
        } else {
            // close tab
            distributor.resizeFromContainerOffset(toggleSize - 1);
        }

        distributor.finish();
        this.config?.onResizeStop?.();
    };
}
