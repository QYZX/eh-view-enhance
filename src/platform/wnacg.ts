import { GalleryMeta } from "../download/gallery-meta";
import ImageNode from "../img-node";
import { PagesSource } from "../page-fetcher";
import { BaseMatcher, OriginMeta } from "./platform";

export class WnacgMatcher extends BaseMatcher {
  name(): string {
    return "绅士漫画"
  }

  meta?: GalleryMeta;
  baseURL?: string;

  async *fetchPagesSource(): AsyncGenerator<PagesSource, any, unknown> {
    const id = this.extractIDFromHref(window.location.href);
    if (!id) {
      throw new Error("Cannot find gallery ID");
    }
    this.baseURL = `${window.location.origin}/photos-index-page-1-aid-${id}.html`;
    let doc = await window.fetch(this.baseURL).then((res) => res.text()).then((text) => new DOMParser().parseFromString(text, "text/html"));
    this.meta = this.pasrseGalleryMeta(doc);
    yield doc;
    while (true) {
      const next = doc.querySelector<HTMLAnchorElement>(".paginator > .next > a");
      if (!next) break;
      const url = next.href;
      doc = await window.fetch(url).then((res) => res.text()).then((text) => new DOMParser().parseFromString(text, "text/html"));
      yield doc;
    }
  }

  async parseImgNodes(page: PagesSource): Promise<ImageNode[]> {
    const doc = page as Document;
    const result: ImageNode[] = [];
    const list = Array.from(doc.querySelectorAll(".grid > .gallary_wrap > .cc > li"));
    for (const li of list) {
      const anchor = li.querySelector<HTMLAnchorElement>(".pic_box > a");
      if (!anchor) continue;
      const img = anchor.querySelector<HTMLImageElement>("img");
      if (!img) continue;
      const title = li.querySelector(".title > .name")?.textContent || "unknown";
      result.push(new ImageNode(img.src, anchor.href, title));
    }
    return result;
  }

  async fetchOriginMeta(href: string): Promise<OriginMeta> {
    const doc = await window.fetch(href).then((res) => res.text()).then((text) => new DOMParser().parseFromString(text, "text/html"));
    const img = doc.querySelector<HTMLImageElement>("#picarea")
    if (!img) throw new Error(`Cannot find #picarea from ${href}`);
    const url = img.src;
    const title = url.split("/").pop();
    return { url, title }
  }

  workURL(): RegExp {
    return /(wnacg.com|wn\d{2}.cc)\/photos-index/;
  }

  galleryMeta(doc: Document): GalleryMeta {
    return this.meta || super.galleryMeta(doc);
  }

  // https://www.hm19.lol/photos-index-page-1-aid-253297.html
  private extractIDFromHref(href: string): string | undefined {
    const match = href.match(/-(\d+).html$/);
    if (!match) return undefined;
    return match[1];
  }

  private pasrseGalleryMeta(doc: Document): GalleryMeta {
    const title = doc.querySelector<HTMLTitleElement>("#bodywrap > h2")?.textContent || "unknown";
    const meta = new GalleryMeta(this.baseURL || window.location.href, title);
    const tags = Array.from(doc.querySelectorAll(".asTB .tagshow")).map(ele => ele.textContent).filter(Boolean);
    const description = Array.from(doc.querySelector(".asTB > .asTBcell.uwconn > p")?.childNodes || []).map(e => e.textContent).filter(Boolean) as string[];
    meta.tags = { "tags": tags, "description": description }
    return meta;
  }

}
