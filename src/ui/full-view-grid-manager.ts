import { conf } from "../config";
import EBUS from "../event-bus";
import { VisualNode } from "../img-node";
import { Debouncer } from "../utils/debouncer";
import { Elements } from "./html";
import { BigImageFrameManager } from "./ultra-image-frame-manager";

const INTERSECTING_ATTR = "intersecting";
type E = {
  node: VisualNode,
  element: HTMLElement
  ratio?: number;
}
abstract class Layout {
  abstract append(nodes: E[]): void;
  abstract nearBottom(): boolean;
  abstract reset(): void;
}

export class FullViewGridManager {
  root: HTMLElement;
  queue: E[] = [];
  done: boolean = false;
  chapterIndex: number = 0;
  layout: Layout;
  observer: IntersectionObserver;
  constructor(HTML: Elements, BIFM: BigImageFrameManager, flowVision: boolean = false) {
    this.root = HTML.fullViewGrid;
    if (flowVision) {
      this.layout = new FlowVisionLayout(this.root);
    } else {
      this.layout = new GRIDLayout(this.root);
    }
    EBUS.subscribe("pf-on-appended", (_total, nodes, chapterIndex, done) => {
      if (this.chapterIndex > -1 && chapterIndex !== this.chapterIndex) return;
      this.append(nodes);
      this.done = done || false;
      setTimeout(() => this.renderCurrView(), 200);
    });
    EBUS.subscribe("pf-change-chapter", (index) => {
      this.chapterIndex = index;
      this.layout.reset();
      this.queue = [];
      this.done = false;
      this.observer.disconnect();
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => entry.target.setAttribute(INTERSECTING_ATTR, entry.isIntersecting ? "true" : "false"));
      }, { root: this.root });
    });
    // scroll to the element that is in full view grid
    EBUS.subscribe("ifq-do", (_, imf) => {
      if (!BIFM.visible) return;
      if (imf.chapterIndex !== this.chapterIndex) return;
      if (!imf.node.root) return;
      let scrollTo = 0;
      if (flowVision) {
        scrollTo = imf.node.root.parentElement!.offsetTop - window.screen.availHeight / 3;
      } else {
        scrollTo = imf.node.root.offsetTop - window.screen.availHeight / 3;
      }
      scrollTo = scrollTo <= 0 ? 0 : scrollTo >= this.root.scrollHeight ? this.root.scrollHeight : scrollTo;
      if (this.root.scrollTo.toString().includes("[native code]")) {
        this.root.scrollTo({ top: scrollTo, behavior: "smooth" });
      } else {
        this.root.scrollTop = scrollTo;
      }
    });
    EBUS.subscribe("cherry-pick-changed", (chapterIndex) => this.chapterIndex === chapterIndex && this.updateRender());
    const debouncer = new Debouncer();
    this.root.addEventListener("scroll", () => debouncer.addEvent("FULL-VIEW-SCROLL-EVENT", () => {
      if (HTML.root.classList.contains("ehvp-root-collapse")) return;
      this.renderCurrView();
      this.tryExtend();
    }, 400));
    this.root.addEventListener("click", (event) => {
      if (event.target === HTML.fullViewGrid
        || (event.target as HTMLElement).classList.contains("img-node")
        || (event.target as HTMLElement).classList.contains("fvg-sub-container")
      ) {
        EBUS.emit("toggle-main-view", false);
      }
    });
    // will init again at pf-change-chapter triggered, so here is do nothing
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => entry.target.setAttribute(INTERSECTING_ATTR, entry.isIntersecting ? "true" : "false"));
    }, { root: this.root });
  }
  append(nodes: VisualNode[]) {
    if (nodes.length > 0) {
      const list = nodes.map(n => ({ node: n, element: n.create(), ratio: n.ratio() }));
      this.queue.push(...list);
      this.layout.append(list);
      list.forEach(l => this.observer.observe(l.element)); // observer element;
    }
  }
  tryExtend() {
    if (this.done) return;
    if (this.layout.nearBottom()) EBUS.emit("pf-try-extend");
  }
  updateRender() {
    this.queue.forEach(({ node }) => node.isRender() && node.render());
  }
  renderCurrView() {
    let lastRender = 0;
    let hasIntersected = false;
    let lastTop = 0;
    for (let i = 0; i < this.queue.length; i++) {
      const e = this.queue[i];
      if (e.element.getAttribute(INTERSECTING_ATTR) === "true") {
        e.node.render();
        lastRender = i;
        hasIntersected = true;
      } else if (hasIntersected) {
        lastTop = e.element.getBoundingClientRect().top;
        break;
      }
    }
    // extend 3 rows
    let rows = 0;
    for (let i = lastRender + 1; i < this.queue.length; i++) {
      const e = this.queue[i];
      let top = e.element.getBoundingClientRect().top;
      if (lastTop < top) {
        rows++;
        lastTop = top;
      }
      if (rows > 2) break;
      e.node.render();
    }
  }
}

class GRIDLayout extends Layout {
  root: HTMLElement;
  constructor(root: HTMLElement) {
    super();
    this.root = root;
    this.root.classList.add("fvg-grid");
    this.root.classList.remove("fvg-flow");
  }
  append(nodes: E[]): void {
    this.root.append(...nodes.map(l => l.element));
  }
  nearBottom(): boolean {
    // find the last node in this.root;
    const nodes = Array.from(this.root.childNodes);
    if (nodes.length === 0) return false;
    const lastImgNode = nodes[nodes.length - 1] as HTMLElement;
    const viewButtom = this.root.scrollTop + this.root.clientHeight;
    if (viewButtom + (this.root.clientHeight * 2.5) < lastImgNode.offsetTop + lastImgNode.offsetHeight) {
      return false;
    }
    return true;
  }
  reset(): void {
    this.root.innerHTML = "";
  }
}

class FlowVisionLayout extends Layout {
  root: HTMLElement;
  lastRow?: HTMLElement;
  count: number = 0;
  defaultHeight: number;
  resizeObserver: ResizeObserver;
  lastRootWidth: number;
  constructor(root: HTMLElement) {
    super();
    this.root = root;
    this.root.classList.add("fvg-flow");
    this.root.classList.remove("fvg-grid");
    this.defaultHeight = window.screen.availHeight / 3.4;
    this.lastRootWidth = this.root.offsetWidth;
    this.resizeObserver = new ResizeObserver((entries) => {
      const root = entries[0];
      const width = root.contentRect.width;
      if (this.lastRootWidth !== width) {
        this.lastRootWidth = width;
        Array.from(root.target.querySelectorAll<HTMLElement>(".fvg-sub-container")).forEach(row => this.resizeRow(row));
      }
    });
    this.resizeObserver.observe(this.root);
  }
  createRow(_columns: number): HTMLElement {
    const container = document.createElement("div");
    container.classList.add("fvg-sub-container");
    container.style.height = this.defaultHeight + "px";
    container.style.marginTop = "10px";
    this.root.appendChild(container);
    return container;
  }
  append(nodes: E[]): void {
    for (const node of nodes) {
      node.element.style.marginLeft = "10px";
      if (!this.lastRow) this.lastRow = this.createRow(conf.colCount);
      const lastChild = this.lastRow.lastElementChild as HTMLElement | null;
      let isFirst = lastChild === null;
      if (lastChild) {
        const nodeWidth = this.lastRow.offsetHeight * (node.ratio ?? 1);
        const gap = (this.lastRow.childElementCount + 1) * 10;
        const ratios = this.childrenRatio(this.lastRow).concat([node.ratio ?? 1]);
        const factor = ratios.reduce((prev, curr) => prev * Math.max(1, curr), 1);
        if (this.childrenWidth(this.lastRow) + gap + (nodeWidth * (0.5 / factor)) > this.root.offsetWidth) {
          isFirst = true;
          this.resizeRow(this.lastRow);
          this.lastRow = this.createRow(conf.colCount);
        }
      }
      if (isFirst) {
        if ((node.ratio ?? 1) > 1) {
          this.lastRow.style.height = this.lastRow.offsetHeight / node.ratio! + "px";
        }
      }
      this.lastRow.appendChild(node.element);
      this.count++;
    }
  }
  childrenWidth(row: HTMLElement): number {
    let width = 0;
    row.childNodes.forEach(c => width += (c as HTMLElement).offsetWidth);
    return width;
  }
  childrenRatio(row: HTMLElement): number[] {
    let ret: number[] = [];
    row.childNodes.forEach(c => ret.push((c as HTMLElement).offsetWidth / (c as HTMLElement).offsetHeight));
    return ret;
  }
  resizeRow(row: HTMLElement) {
    const gap = (row.childElementCount + 1) * 10;
    const width = this.childrenWidth(row) + gap;
    const scale = width / this.root.offsetWidth;
    row.style.height = (row.offsetHeight / scale) + "px";
    row.childNodes.forEach(c => (c as HTMLElement).style.marginLeft = "");
    row.style.justifyContent = "space-around";
  }
  nearBottom(): boolean {
    // return false;
    // find the last node in this.root;
    const last = this.lastRow;
    if (!last) return false;
    const viewButtom = this.root.scrollTop + this.root.clientHeight;
    if (viewButtom + (this.root.clientHeight * 2.5) < last.offsetTop + last.offsetHeight) {
      return false;
    }
    return true;
  }
  reset(): void {
    this.root.innerHTML = "";
  }
}
