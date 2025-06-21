declare global {
  interface Console {
    sent?: Function;
    alert?: Function;
  }
}
