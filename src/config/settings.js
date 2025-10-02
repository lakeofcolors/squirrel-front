export function getUrl(path = "/", ws = false) {

  let protocol;
  if (ws) {
    protocol = window.location.protocol === "https:" ? "wss" : "ws";
  }
  else{
    protocol = window.location.protocol.replace(":", "");

  }
  const host = window.location.host.split(".")[1];
  return `${protocol}://api.${host}${path}`;
}
