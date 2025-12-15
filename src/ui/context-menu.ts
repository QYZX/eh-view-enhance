import { i18n } from "../utils/i18n";
import q from "../utils/query-element";
import { AppEventDesc, AppEventIDInBigImgFrame, AppEventIDInFullViewGrid, AppEvents } from "./event";
import { Elements } from "./html";

export class ContextMenu {
  root: HTMLElement;
  menu?: HTMLElement;
  // events: AppEvents;
  getEvents: () => [AppEventIDInBigImgFrame | AppEventIDInFullViewGrid, AppEventDesc][];
  constructor(html: Elements, events: AppEvents) {
    this.root = html.root;
    // this.events = events;
    html.root.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      this.open(event);
    });
    this.getEvents = () => {
      const list: [AppEventIDInBigImgFrame | AppEventIDInFullViewGrid, AppEventDesc][] = [];
      if (!html.bigImageFrame.classList.contains("big-img-frame-collapse")) {
        list.push(["exit-big-image-mode", events.inBigImageMode["exit-big-image-mode"]]);
        list.push(["round-read-mode", events.inBigImageMode["round-read-mode"]]);
        list.push(["toggle-reverse-pages", events.inBigImageMode["toggle-reverse-pages"]]);
        list.push(["scale-image-increase", events.inBigImageMode["scale-image-increase"]]);
        list.push(["scale-image-decrease", events.inBigImageMode["scale-image-decrease"]]);
        list.push(["rotate-image", events.inBigImageMode["rotate-image"]]);
        list.push(["step-image-prev", events.inBigImageMode["step-image-prev"]]);
        list.push(["step-image-next", events.inBigImageMode["step-image-next"]]);
      } else {
        list.push(["open-big-image-mode", events.inFullViewGrid["open-big-image-mode"]]);
      }
      list.push(["toggle-auto-play", events.inFullViewGrid["toggle-auto-play"]]);
      list.push(["columns-decrease", events.inFullViewGrid["columns-decrease"]]);
      list.push(["columns-increase", events.inFullViewGrid["columns-increase"]]);
      list.push(["resize-flow-vision", events.inFullViewGrid["resize-flow-vision"]]);
      list.push(["retry-fetch-next-page", events.inFullViewGrid["retry-fetch-next-page"]]);
      list.push(["go-prev-chapter", events.inFullViewGrid["go-prev-chapter"]]);
      list.push(["go-next-chapter", events.inFullViewGrid["go-next-chapter"]]);
      list.push(["start-download", events.inFullViewGrid["start-download"]]);
      list.push(["exit-full-view-grid", events.inFullViewGrid["exit-full-view-grid"]]);
      return list;
    }
  }

  open(event: MouseEvent) {
    console.log("event", event);
    this.close();
    this.menu = this.create();
    this.root.appendChild(this.menu);
    const [w, h] = [this.menu.offsetWidth, this.menu.offsetHeight];
    this.menu.style.top = (event.clientY - (h / 2)) + "px";
    this.menu.style.left = (event.clientX - (w / 2)) + "px";
  }

  close() {
    this.menu?.remove();
  }

  private create(): HTMLElement {
    const div = document.createElement("div");
    div.classList.add("ehvp-context-menu");
    // tooltip
    div.innerHTML = `
      <div class="ehvp-context-menu-tooltip"><span class="ehvp-context-menu-tooltip-span">Context Menu</span></div>
      <div class="ehvp-context-menu-grid"></div>
    `;
    const tooltip = q<HTMLSpanElement>(".ehvp-context-menu-tooltip-span", div);
    const items = this.getEvents().map<HTMLElement>(([id, desc]) => {
      const elem = document.createElement("div");
      elem.classList.add("ehvp-context-menu-item");
      elem.innerHTML = `<span>${desc.icon}</span>`;
      elem.addEventListener("mouseover", () => {
        const textContent = i18n.keyboard[id as AppEventIDInBigImgFrame | AppEventIDInFullViewGrid].get();
        tooltip.textContent = textContent.replace(/\s*\(.*?\)/, "");
        // console.log(tooltip);
      });
      elem.addEventListener("click", (event) => {
        desc.cb(event);
        // div.remove();
      });
      return elem;
    });
    q(".ehvp-context-menu-grid", div).append(...items);
    div.addEventListener("blur", () => div.remove());
    div.addEventListener("mouseleave", () => div.remove());
    return div;
  }

}
