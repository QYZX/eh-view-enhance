const bookIcon = `📖`;
const moonViewCeremony = `<🎑>`;
const sixPointedStar = `🔯`;
const entryIcon = `⍇⍈`;
const zoomIcon = `⇱⇲`;
const exitIcon = `<svg
  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
  <path d="M4 4V20C4 21.1 4.9 22 6 22H12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M10 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  <path d="M16 8L20 12L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
</svg>
`;
const prevIcon = `<svg
  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
  <path d="M19 12H5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  <path d="M11 6L5 12L11 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
</svg>
`;
const nextIcon = `<svg
  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
  <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  <path d="M13 6L19 12L13 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
</svg>
`;
const zoomInIcon = `<svg
  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
  <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" />
  <line x1="16" y1="16" x2="21" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  <line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
</svg>
`;
const zoomOutIcon = `<svg
  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
  <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" />
  <line x1="16" y1="16" x2="21" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  <line x1="11" y1="8" x2="11" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  <line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
</svg>
`;
const prevChapterIcon = `<svg
  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
  <path d="M4 6C4 4.9 4.9 4 6 4H11V20H6C4.9 20 4 19.1 4 18V6Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
  <path d="M11 4H18C19.1 4 20 4.9 20 6V18C20 19.1 19.1 20 18 20H11V4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
  <path d="M7.5 13V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  <path d="M5.5 11L7.5 9L9.5 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
</svg>
`;
const nextChapterIcon = `<svg
  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
  <path d="M4 6C4 4.9 4.9 4 6 4H11V20H6C4.9 20 4 19.1 4 18V6Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
  <path d="M11 4H18C19.1 4 20 4.9 20 6V18C20 19.1 19.1 20 18 20H11V4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
  <path d="M7.5 9V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  <path d="M5.5 11L7.5 13L9.5 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
</svg>
`;
const rotateIcon = `<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.5 20.5C6.80558 20.5 3 16.6944 3 12C3 7.30558 6.80558 3.5 11.5 3.5C16.1944 3.5 20 7.30558 20 12C20 13.5433 19.5887 14.9905 18.8698 16.238M22.5 15L18.8698 16.238M17.1747 12.3832L18.5289 16.3542L18.8698 16.238" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
const switchReadModeIcon = `<svg width="24px" height="24px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="48" height="48" fill="white" fill-opacity="0.01"/>
<path d="M30 10H40C41.8856 10 42.8284 10 43.4142 10.5858C44 11.1716 44 12.1144 44 14V34C44 35.8856 44 36.8284 43.4142 37.4142C42.8284 38 41.8856 38 40 38H30" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18 10H8C6.11438 10 5.17157 10 4.58579 10.5858C4 11.1716 4 12.1144 4 14V34C4 35.8856 4 36.8284 4.58579 37.4142C5.17157 38 6.11438 38 8 38H18" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M24 6V42" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
const playIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 6 L18 12 L8 18 Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
const reverseIcon = `<svg width="24px" height="24px" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
<g fill="none" fill-rule="evenodd" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" transform="translate(3 3)">
<path d="m6.5 6.5-4 4 4 4"/> <path d="m14.5 10.5h-12"/> <path d="m8.5.5 4 4-4 4"/> <path d="m12.5 4.5h-12"/> </g>
</svg>`;
const downloadIcon = `<svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<g id="Complete">
<g id="download">
<g>
<path d="M3,12.3v7a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2v-7" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
<g>
<polyline data-name="Right" fill="none" id="Right-2" points="7.9 12.3 12 16.3 16.1 12.3" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
<line fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="12" x2="12" y1="2.7" y2="14.2"/>
</g>
</g>
</g>
</g>
</svg>
`;
const resizeGridIcon = `<svg fill="#000000" width="24px" height="24px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="resize"  enable-background="new 0 0 32 32" xml:space="preserve">
  <path d="M28 10V4h-6v2H10V4H4v6h2v12H4v6h6v-2h12v2h6v-6h-2V10H28zM24 6h2v2h-2V6zM6 6h2v2H6V6zM8 26H6v-2h2V26zM26 26h-2v-2h2V26zM24 22h-2v2H10v-2H8V10h2V8h12v2h2V22z"/>
  <polygon points="17,12 15,12 15,15 12,15 12,17 15,17 15,20 17,20 17,17 20,17 20,15 17,15 "/>
</svg>
`;
const refetchNextIcon = `<svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000"><path d="M7.293 9.006l-.88.88A2.484 2.484 0 0 0 4 8a2.488 2.488 0 0 0-2.413 1.886l-.88-.88L0 9.712l1.147 1.146-.147.146v1H0v.999h1v.053c.051.326.143.643.273.946L0 15.294.707 16l1.1-1.099A2.873 2.873 0 0 0 4 16a2.875 2.875 0 0 0 2.193-1.099L7.293 16 8 15.294l-1.273-1.292A3.92 3.92 0 0 0 7 13.036v-.067h1v-.965H7v-1l-.147-.146L8 9.712l-.707-.706zM4 9.006a1.5 1.5 0 0 1 1.5 1.499h-3A1.498 1.498 0 0 1 4 9.006zm2 3.997A2.217 2.217 0 0 1 4 15a2.22 2.22 0 0 1-2-1.998v-1.499h4v1.499z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M5 2.41L5.78 2l9 6v.83L9 12.683v-1.2l4.6-3.063L6 3.35V7H5V2.41z"/></svg>`;
const icons = {
  bookIcon,
  moonViewCeremony,
  sixPointedStar,
  entryIcon,
  zoomIcon,
  exitIcon,
  prevIcon,
  nextIcon,
  zoomInIcon,
  zoomOutIcon,
  prevChapterIcon,
  nextChapterIcon,
  rotateIcon,
  switchReadModeIcon,
  playIcon,
  reverseIcon,
  downloadIcon,
  resizeGridIcon,
  refetchNextIcon,
}
export default icons;
