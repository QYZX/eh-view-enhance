import { conf, saveConf } from "../config";
import { Comic18Matcher } from "./18comic";
import { DanbooruDonmaiMatcher, GelBooruMatcher, KonachanMatcher, Rule34Matcher, YandereMatcher } from "./danbooru";
import { EHMatcher } from "./ehentai";
import { HentaiNexusMatcher } from "./hentainexus";
import { HitomiMather } from "./hitomi";
import { IMHentaiMatcher } from "./im-hentai";
import { NHMatcher } from "./nhentai";
import { PixivMatcher } from "./pixiv";
import { Matcher } from "./platform";
import { RokuHentaiMatcher } from "./rokuhentai";
import { SteamMatcher } from "./steam";
import { TwitterMatcher } from "./twitter";
import { WnacgMatcher } from "./wnacg";

export const matchers: Matcher[] = [
  new EHMatcher(),
  new NHMatcher(),
  new HitomiMather(),
  new PixivMatcher(),
  new SteamMatcher(),
  new RokuHentaiMatcher(),
  new Comic18Matcher(),
  new DanbooruDonmaiMatcher(),
  new Rule34Matcher(),
  new YandereMatcher(),
  new KonachanMatcher(),
  new GelBooruMatcher(),
  new IMHentaiMatcher(),
  new TwitterMatcher(),
  new WnacgMatcher(),
  new HentaiNexusMatcher(),
];

export function adaptMatcher(url: string): Matcher | null {
  const checkValid = (urls: string[]) => {
    const workURLs = matchers.flatMap(m => m.workURLs()).map(r => r.source);
    // check excludeURLs health, remove invalid RegExp
    const newExcludeURLs = urls.filter(source => {
      return workURLs.indexOf(source) > -1;
    });
    if (newExcludeURLs.length !== urls.length) {
      urls = newExcludeURLs;
      saveConf(conf);
    }
  };
  checkValid(conf.excludeURLs);
  checkValid(conf.autoOpenExcludeURLs);

  // if all sites are excluded, don't exclude any
  if (conf.excludeURLs.length < matchers.length) {
    for (const regex of conf.excludeURLs) {
      if (new RegExp(regex).test(url)) {
        return null;
      }
    }
  }
  return matchers.find(m => m.workURLs().find(r => r.test(url))) || null;
}

export function enableAutoOpen(url: string): boolean {
  // this must execute after adaptMatcher
  // if the url matches any in Exclude list, then do not enable
  return conf.autoOpenExcludeURLs.find(excludeReg => RegExp(excludeReg).test(url)) == undefined;
}
