export function mediaQueryPhone() {
  return window.matchMedia("(max-width: 479px)")
}
export function mediaQueryTablet() {
  return window.matchMedia("(min-width: 480px) and (max-width: 839px)")
}
export function mediaQueryDesktop() {
  return window.matchMedia("(min-width: 840px)")
}
