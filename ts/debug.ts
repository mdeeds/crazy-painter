import * as AFRAME from "aframe";

export class Debug {
  private static text: AFRAME.Entity = null;
  private static messages = new Map<string, string>();
  static init() {
    const container = document.querySelector('a-camera');
    Debug.text = document.createElement('a-entity');
    this.set('ts', `${new Date().toLocaleString()}`);
    Debug.text.setAttribute('width', '0.25');
    Debug.text.setAttribute('position', '0 0.2 -0.9');
    container.appendChild(Debug.text);
  }

  static set(key: string, message: string) {
    this.messages.set(key, message);
    let text = "";
    if (Debug.text) {
      for (const [k, v] of this.messages.entries()) {
        text = text + `${k}: ${v}\n`;
      }
      Debug.text.setAttribute('text', `value: ${text};`);
    }
  }
}