declare global {
  interface Console {
    sent?: Function;
    alert?: Function;
  }
  var SHARD_ID: number | undefined;
}
export {};
