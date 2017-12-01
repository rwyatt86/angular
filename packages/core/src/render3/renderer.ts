/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * The goal here is to make sure that the browser DOM API is the Renderer.
 * We do this by defining a subset of DOM API to be the renderer and than
 * use that time for rendering.
 *
 * At runtime we can than use the DOM api directly, in server or web-worker
 * it will be easy to implement such API.
 */

import {ComponentDef} from './public_interfaces';

export type Renderer3 = Renderer3oo | Renderer3Fn;

/**
 * Object Oriented style of API needed to create elements and text nodes.
 */
export interface Renderer3oo {
  createComment(data: string): RComment;
  createElement(tagName: string): RElement;
  createTextNode(data: string): RText;

  querySelector(selectors: string): RElement|null;
}

/**
 * Functional style of API needed to create elements and text nodes.
 */
export interface Renderer3Fn {
  destroy(): void;
  createElement(name: string, namespace?: string|null): RElement;
  createComment(value: string): RComment;
  createText(value: string): RText;
  /**
   * This property is allowed to be null / undefined,
   * in which case the view engine won't call it.
   * This is used as a performance optimization for production mode.
   */
  destroyNode?: ((node: RNode) => void)|null;
  appendChild(parent: RElement, newChild: RNode): void;
  insertBefore(parent: RNode, newChild: RNode, refChild: RNode|null): void;
  removeChild(parent: RElement, oldChild: RNode): void;
  selectRootElement(selectorOrNode: string|any): RElement;

  setAttribute(el: RElement, name: string, value: string, namespace?: string|null): void;
  removeAttribute(el: RElement, name: string, namespace?: string|null): void;
  addClass(el: RElement, name: string): void;
  removeClass(el: RElement, name: string): void;
  setStyle(el: RElement, style: string, value: any): void;
  removeStyle(el: RElement, style: string): void;
  setProperty(el: RElement, name: string, value: any): void;
  setValue(node: RText, value: string): void;

  // TODO(misko): Deprecate in favor of addEventListener/removeEventListener
  listen(target: RNode, eventName: string, callback: (event: any) => boolean | void): () => void;
}

export interface RendererFactory3 {
  createRenderer(hostElement: RElement, componentDef: ComponentDef<any>): Renderer3;
  begin?(): void;
  end?(): void;
}

/**
 * Subset of API needed for appending elements and text nodes.
 */
export interface RNode {
  removeChild(oldChild: RNode): void;

  /**
   * Insert a child node.
   *
   * Used exclusively for adding View root nodes into ViewAnchor location.
   */
  insertBefore(newChild: RNode, refChild: RNode|null, isViewRoot: boolean): void;

  /**
   * Append a child node.
   *
   * Used exclusively for building up DOM which are static (ie not View roots)
   */
  appendChild(newChild: RNode): RNode;
}

/**
 * Subset of API needed for writing attributes, properties, and setting up
 * listeners on Element.
 */
export interface RElement extends RNode {
  style: RCSSStyleDeclaration;
  classList: RDOMTokenList;
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
  setAttributeNS(namespaceURI: string, qualifiedName: string, value: string): void;
  addEventListener(type: string, listener: EventListener, useCapture?: boolean): void;
  removeEventListener(type: string, listener?: EventListener, options?: boolean): void;

  setProperty?(name: string, value: any): void;
}

export interface RCSSStyleDeclaration {
  removeProperty(propertyName: string): string;
  setProperty(propertyName: string, value: string|null, priority?: string): void;
}

export interface RDOMTokenList {
  add(token: string): void;
  remove(token: string): void;
}

export interface RText extends RNode { textContent: string|null; }

export interface RComment extends RNode {}
