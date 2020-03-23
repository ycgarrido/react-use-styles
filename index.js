const ObjectPath = require("object-path");
const v4 = require("uuid/v4");

const THEME_REG_EXP = /@theme\([A-Za-z0-9]+([\.|-][A-Za-z0-9]+)*\)/g;
const PATH_REG_EPX = /\([A-Za-z0-9]+([\.|-][A-Za-z0-9]+)*\)/g;
const CAMEL_CASE_REG_EXP = /([a-z])+|([A-Z][a-z]*)/g;

const isObject = obj =>
  obj &&
  typeof obj === "object" &&
  obj.constructor &&
  obj.constructor === Object;

const hashBuilder = content => {
  const _content = content || v4();
  let hash = 0,
    i,
    chr;
  if (_content.length === 0) return hash;
  for (i = 0; i < _content.length; i++) {
    chr = _content.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
};

const isBrowser = () => typeof window !== "undefined";

const isRegisteredClass = className => {
  if (isBrowser()) {
    if (!window.Kamila) {
      window.Kamila = {};
    }
    if (!window.Kamila.$__registeredClasses) {
      window.Kamila.$__registeredClasses = [];
    }
    return window.Kamila.$__registeredClasses.includes(className);
  }
  return false;
};

const registerClass = className => {
  if (isBrowser()) {
    if (!window.Kamila) {
      window.Kamila = {};
    }
    if (!window.Kamila.$__registeredClasses) {
      window.Kamila.$__registeredClasses = [];
    }
    if (!window.Kamila.$__registeredClasses.includes(className))
      window.Kamila.$__registeredClasses.push(className);
  }
};

const appendClass = styles => {
  if (isBrowser()) {
    const element = document.getElementById("kamila-use-styles");
    if (element) {
      element.innerHTML = element.innerHTML + " " + styles;
    } else {
      const styleNode = styles;

      const body = document.body || document.getElementsByTagName("body")[0];
      const style = document.createElement("style");
      style.type = "text/css";
      style.id = "kamila-use-styles";
      if (style.styleSheet) style.styleSheet.cssText = styleNode;
      else style.appendChild(document.createTextNode(styleNode));
      body.appendChild(style);
    }
  }
};

const evaluate = (value, theme) => {
  if (typeof value === "string") {
    let index = value.match(THEME_REG_EXP);
    const match = [];
    if (index)
      index.map(m => {
        const sub = m.match(PATH_REG_EPX);
        if (sub && sub[0] && !match.includes(sub[0])) match.push(sub[0]);
      });
    match.map(m => {
      if (m && m.startsWith("(") && m.endsWith(")")) {
        const pure = m.substring(1, m.length - 1);
        const r = new RegExp(`@theme\\(${pure}\\)`, "g");
        const tempValue = ObjectPath.get(theme, pure);
        value = isObject(tempValue)
          ? JSON.stringify(objectToCssProp(tempValue))
          : value.replace(r, tempValue);
      }
    });
  }
  return value;
};

const objectToCssProp = obj => {
  const newObject = {};
  for (let i in obj) newObject[toCssProperty(i)] = obj[i];
  return newObject;
};

const toCssProperty = propName =>
  propName
    .match(CAMEL_CASE_REG_EXP)
    .join("-")
    .toLowerCase();

const decode = (style, path, theme = {}, media = null) => {
  let stylesheet = "";
  Object.keys(style).map(prop => {
    let content = "";
    let ignoreBasePath = false;
    const propValue = style[prop];
    const propName = prop.trim();
    if (style[prop]) {
      if (
        !propName.startsWith("&") &&
        (typeof propValue === "string" || typeof propValue === "number")
      )
        content = `{${toCssProperty(prop)}:${evaluate(propValue, theme)}}`;
      else if (propName.startsWith("&") && isObject(propValue))
        content = decode(propValue, propName.substring(1), theme);
      if (media) {
        content = `${media}{${path}${content}}`;
        ignoreBasePath = true;
      }
    }
    if (content)
      stylesheet += ignoreBasePath ? `${content}` : `${path}${content}`;
  });
  return stylesheet;
};

const keyframes = (obj, theme) => {
  let content = "";
  for (let i in obj) {
    let childContent = "";
    if (isObject(obj[i])) {
      for (let j in obj[i]) {
        childContent += `${toCssProperty(j)}:${evaluate(obj[i][j], theme)};`;
      }
    }
    if (childContent) content += `${i}{${childContent}}`;
  }
  return content ? `{${content}}` : "";
};

const useStyles = ({
  props: { className, style, ...props },
  theme = {},
  direction = "ltr"
}) => {
  let stylesheet = "";
  let cls = className || "";
  let baseHash = `.kc-${hashBuilder()}`;
  let containsBase = false;
  if (isObject(style))
    Object.keys(style).map(prop => {
      let content = "";
      const propValue = style[prop];
      const propName = prop.trim();

      if (style[prop]) {
        if (
          !propName.startsWith("&") &&
          (typeof propValue === "string" || typeof propValue === "number")
        ) {
          content = `{${toCssProperty(prop)}:${evaluate(propValue, theme)}}`;
          if (content) {
            if (direction === "rtl") content = rtl(content);
            const hash = `kc-${hashBuilder(`${prop}${content}`)}`;
            let contentClass = `.${hash}${content}`;
            if (!isRegisteredClass(hash)) {
              appendClass(contentClass);
              registerClass(hash);
            }
            cls += !cls.includes(hash) ? ` ${hash}` : "";
            stylesheet += `${contentClass}`;
          }
        } else if (
          (propName.startsWith("&") || propName.startsWith("@media")) &&
          isObject(propValue)
        ) {
          content = decode(
            propValue,
            propName.startsWith("@media")
              ? baseHash
              : `${baseHash}${propName.substring(1)}`,
            theme,
            propName.startsWith("@media") ? propName : null
          );
          if (direction === "rtl") content = rtl(content);
          appendClass(content);
          stylesheet += `${content}`;
          containsBase = true;
        } else if (propName.startsWith("@keyframes") && isObject(propValue)) {
          content = `${propName}${keyframes(propValue, theme)}`;
          appendClass(content);
          stylesheet += `${content}`;
        } else if (
          propName === "&" &&
          typeof propValue === "string" &&
          propValue.startsWith("@design(") &&
          propValue.endsWith(")")
        ) {
          content = evaluate(propValue, theme);
          if (direction === "rtl") content = rtl(content);
          content = `${baseHash}${content}`;
          appendClass(content);
          stylesheet += `${content}`;
          containsBase = true;
        }
      }
    });
  return {
    className: `${cls} ${containsBase ? baseHash.substring(1) : ""}`.trim(),
    properties: props,
    stylesheet
  };
};

const rtl = content => {
  return content
    .replace(/right/g, "l-e-f-t")
    .replace(/left/g, "r-i-g-h-t")
    .replace(/l-e-f-t/g, "left")
    .replace(/r-i-g-h-t/g, "right");
};

module.exports = useStyles;
