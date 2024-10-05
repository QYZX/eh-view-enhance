import { defineConfig } from 'vite';
import monkey, { cdn } from 'vite-plugin-monkey';

const VERSION = '4.9.2';
// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  let downloadURL: string | undefined;
  let updateURL: string | undefined;
  let outDir: string | undefined;
  let emptyOutDir = true;
  if (command === 'build') {
    downloadURL = 'https://github.com/MapoMagpie/eh-view-enhance/raw/master/eh-view-enhance.user.js';
    updateURL = 'https://github.com/MapoMagpie/eh-view-enhance/raw/master/eh-view-enhance.meta.js';
    outDir = '';
    emptyOutDir = false;
  }
  return {
    define: {
      _VERSION_: `"${VERSION}"`,
    },
    build: {
      target: 'esnext',
      outDir,
      emptyOutDir,
    },
    server: {
      host: '0.0.0.0',
    },
    plugins: [
      monkey({
        entry: 'src/main.ts',
        userscript: {
          version: VERSION,
          icon: 'https://exhentai.org/favicon.ico',
          namespace: 'https://github.com/MapoMagpie/eh-view-enhance',
          supportURL: 'https://github.com/MapoMagpie/eh-view-enhance/issues',
          downloadURL,
          updateURL,
          match: ['*://*/*'],
          name: {
            "": "Comic Looms",
            "zh-CN": "漫画织机",
            "zh-TW": "漫畫織機",
            "ja": "コミック織機",
            "ko": "만화 베틀",
            "eo": "Comic Looms",
            "ka": "Comic Looms",
          },
          license: 'MIT',
          author: 'MapoMagpie',
          description: {
            "": "Manga Viewer + Downloader, Focus on experience and low load on the site. Support you in finding the site you are searching for.",
            "zh-CN": "漫画阅读 + 下载器，注重体验和对站点的负载控制。支持你正在搜索的站点。",
            "zh-TW": "漫畫閱讀 + 下載器，注重體驗和對站點的負載控制。支持你正在搜索的站點。",
            "ja": "サイトのエクスペリエンスと負荷制御に重点を置いたコミック閲覧 + ダウンローダー。あなたが探しているサイトを見つけるのをサポートします。",
            "ko": "만화 읽기 + 다운로더, 유저 경험 및 낮은 사이트 부하에 중점을 둡니다. 당신이 검색하고 있는 사이트를 찾는 것을 지원합니다.",
            "eo": `Manga Viewer + Downloader, Focus on experience and low load on the site. Support:  ${["e-hentai | exhentai | E绅士",
              "twitter | x | 推特",
              "instagram",
              "artstation",
              "pixiv",
              "18comic | 禁漫",
              "nhentai",
              "hitomi",
              "rule34 | danbooru | gelbooru | yande",
              "wnacg | 绅士漫画",
              "manhuagui | 漫画柜",
              "mangacopy | 拷贝漫画",
              "hentainexus",
              "koharu",
              "arca",].join(" | ")}`,
            "ka": `Manga Viewer + Downloader, Focus on experience and low load on the site. Support:  ${["e-hentai.org | exhentai.org",
              "twitter.com | x.com",
              "instagram.com",
              "artstation.com",
              "pixiv.net",
              "18comic.vip",
              "nhentai.net | nhentai.xxx",
              "hitomi.la",
              "rule34.xxx | danbooru.donmai.us | gelbooru.com | yande.re",
              "wnacg.com",
              "manhuagui.com",
              "mangacopy.com",
              "hentainexus.com",
              "koharu.to",
              "arca.live",].join(" | ")}
 `,
          },
          connect: ['*'],
          grant: [
            'GM_xmlhttpRequest',
            'GM_setValue',
            'GM_getValue',
          ],
        },
        build: {
          fileName: 'eh-view-enhance.user.js',
          metaFileName: 'eh-view-enhance.meta.js',
          externalGlobals: {
            "@zip.js/zip.js": cdn.jsdelivr("zip", "dist/zip-full.min.js"),
            "file-saver": cdn.jsdelivr("saveAs", "dist/FileSaver.min.js"),
            "pica": cdn.jsdelivr("pica", "dist/pica.min.js"),
          },
          autoGrant: true,
        },
        server: { mountGmApi: false },
      }),
    ],
  };
});
