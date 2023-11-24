import { conf } from "./config";
import { IMGFetcherQueue } from "./fetcher-queue";
import { IdleLoader } from "./idle-loader";
import { IMGFetcher } from "./img-fetcher";
import { HTML, Oriented } from "./main";
import { DifferentialMatcher } from "./platform/platform";
import { events } from "./ui/event";
import { updatePageHelper } from "./ui/page-helper";
import { evLog } from "./utils/ev-log";

type AsyncAppendFunc = () => Promise<boolean>;

export class PageFetcher {
  queue: IMGFetcherQueue;
  pageURLs: string[];
  currPage: number;
  idleLoader: IdleLoader;
  fetched: boolean;
  imgAppends: Record<"prev" | "next", AsyncAppendFunc[]>;
  matcher: DifferentialMatcher;
  constructor(queue: IMGFetcherQueue, idleLoader: IdleLoader, matcher: DifferentialMatcher) {
    this.queue = queue;
    this.idleLoader = idleLoader;
    //所有页的地址
    this.pageURLs = [];
    //当前页所在的索引
    this.currPage = 0;
    //每页的图片获取器列表，用于实现懒加载
    this.imgAppends = { prev: [], next: [] };
    //平均高度，用于渲染未加载的缩略图,单位px
    this.fetched = false;
    this.matcher = matcher;
  }

  async init() {
    await this.initPageAppend();
  }

  async initPageAppend() {
    for (const pageURL of this.matcher.parsePageURLs()) {
      this.imgAppends["next"].push(
        async () => {
          let ok = await this.appendPageImg(pageURL, "next");
          this.renderCurrView(
            HTML.fullViewPlane.scrollTop,
            HTML.fullViewPlane.clientHeight
          );
          return ok;
        }
      );
    }
    this.loadAllPageImg();
  }

  async loadAllPageImg() {
    if (this.fetched) return;
    for (let i = 0; i < this.imgAppends["next"].length; i++) {
      const executor = this.imgAppends["next"][i];
      await executor();
    }
    for (let i = this.imgAppends["prev"].length - 1; i > -1; i--) {
      const executor = this.imgAppends["prev"][i];
      await executor();
    }
  }

  async appendPageImg(pageURL: string, oriented: Oriented): Promise<boolean> {
    try {
      const doc = await this.fetchDocument(pageURL);
      const imgNodeList = await this.obtainImageNodeList(doc);
      const IFs = imgNodeList.map(
        (imgNode) => new IMGFetcher(imgNode as HTMLElement, this.matcher)
      );
      switch (oriented) {
        case "prev":
          HTML.fullViewPlane.firstElementChild!.nextElementSibling!.after(
            ...imgNodeList
          );
          const len = this.queue.length;
          this.queue.unshift(...IFs);
          if (len > 0) {
            this.idleLoader.processingIndexList[0] += IFs.length;
            const { root } = this.queue[this.idleLoader.processingIndexList[0]];
            HTML.fullViewPlane.scrollTo(0, root.offsetTop);
          }
          break;
        case "next":
          HTML.fullViewPlane.lastElementChild!.after(...imgNodeList);
          this.queue.push(...IFs);
          break;
      }
      updatePageHelper("updateTotal", this.queue.length.toString());
      return true;
    } catch (error) {
      evLog(`从下一页或上一页中提取图片元素时出现了错误！`, error);
      return false;
    }
  }

  //从文档的字符串中创建缩略图元素列表
  async obtainImageNodeList(docString: string): Promise<Element[]> {
    // make node template
    const imgNodeTemplate = document.createElement("div");
    imgNodeTemplate.classList.add("img-node");
    const imgTemplate = document.createElement("img");
    imgTemplate.setAttribute("decoding", "async");
    imgTemplate.style.height = "auto";
    imgTemplate.setAttribute(
      "src",
      "data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
    );
    imgNodeTemplate.appendChild(imgTemplate);

    const list = await this.matcher.parseImgNodes(docString, imgNodeTemplate);
    list.forEach((imgNode) => {
      imgNode.addEventListener("click", events.showBigImageEvent);
    })
    return list;
  }

  //通过地址请求该页的文档
  async fetchDocument(pageURL: string): Promise<string> {
    return await window.fetch(pageURL).then((response) => response.text());
  }

  /**
   *当滚动停止时，检查当前显示的页面上的是什么元素，然后渲染图片
   * @param {当前滚动位置} currTop
   * @param {窗口高度} clientHeight
   */
  renderCurrView(currTop: number, clientHeight: number) {
    const [startRander, endRander] = this.findOutsideRoundView(currTop, clientHeight);
    evLog(`要渲染的范围是:${startRander + 1}-${endRander + 1}`);
    this.queue.slice(startRander, endRander + 1).forEach((imgFetcher) => imgFetcher.render());
  }

  findOutsideRoundViewNode(currTop: number, clientHeight: number): [HTMLElement, HTMLElement] {
    const [outsideTop, outsideBottom] = this.findOutsideRoundView(currTop, clientHeight);
    return [this.queue[outsideTop].root, this.queue[outsideBottom].root];
  }

  findOutsideRoundView(currTop: number, clientHeight: number): [number, number] {
    const viewButtom = currTop + clientHeight;
    let outsideTop: number = 0;
    let outsideBottom: number = 0;
    for (let i = 0; i < this.queue.length; i += conf.colCount) {
      const { root } = this.queue[i];
      // 查询最靠近当前视图上边的缩略图索引
      // 缩略图在父元素的位置 - 当前视图上边位置 = 缩略图与当前视图上边的距离，如果距离 >= 0，说明缩略图在当前视图内
      if (outsideBottom === 0) {
        if (root.offsetTop + 2 >= currTop) { // +2 for deviation
          outsideBottom = i + 1; // +1 for skip current condition
        } else {
          outsideTop = i;
        }
      } else {
        outsideBottom = i;
        if (root.offsetTop + root.offsetHeight > viewButtom) {
          break;
        }
      }
    }
    return [outsideTop, Math.min(outsideBottom + conf.colCount, this.queue.length - 1)];
  }
}
