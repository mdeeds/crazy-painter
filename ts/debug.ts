import * as AFRAME from "aframe";

export class Debug {
  private static text: AFRAME.Entity = null;
  static init() {
    const container = document.querySelector('a-camera');
    Debug.text = document.createElement('a-entity');
    Debug.text.setAttribute('text', `value: ${new Date().toLocaleString()};`);
    Debug.text.setAttribute('width', '0.25');
    Debug.text.setAttribute('position', '0 0.2 -0.9');
    container.appendChild(Debug.text);
  }

  static set(message: string) {
    if (Debug.text) {
      Debug.text.setAttribute('text', `value: ${message};`);
    }
  }
}