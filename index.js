const ObjectPath = require("object-path");

const THEME_REG_EXP = /@palette\([A-Za-z0-9]+([\.|-][A-Za-z0-9]+)*\)/g;
const DESIGN_REG_EXP = /@design\([A-Za-z0-9]+([\.|-][A-Za-z0-9]+)*\)/g;
const PATH_REG_EPX = /\([A-Za-z0-9]+([\.|-][A-Za-z0-9]+)*\)/g;

const isObject = obj =>
  obj &&
  typeof obj === "object" &&
  obj.constructor &&
  obj.constructor === Object;

const hashBuilder = content => {
  if (content) {
    let hash = 0,
      i,
      chr;
    if (content.length === 0) return hash;
    for (i = 0; i < content.length; i++) {
      chr = content.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
  return null;
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
      if (style.styleSheet) {
        // This is required for IE8 and below.
        style.styleSheet.cssText = styleNode;
      } else {
        style.appendChild(document.createTextNode(styleNode));
      }
      body.appendChild(style);
    }
  }
};

const evaluate = (value, theme) => {
  const { palette = {}, design = {} } = theme;
  let REG_EXP = [];
  let themeToken = [];
  if (DESIGN_REG_EXP.test(value)) {
    REG_EXP.push(DESIGN_REG_EXP);
    themeToken.push(design);
  }
  if (THEME_REG_EXP.test(value)) {
    REG_EXP.push(THEME_REG_EXP);
    themeToken.push(palette);
  }
  REG_EXP.map((regExp, i) => {
    let index = value.match(regExp);
    const match = [];
    if (index)
      index.map(m => {
        const sub = m.match(PATH_REG_EPX);
        if (sub && sub[0] && !match.includes(sub[0])) match.push(sub[0]);
      });
    match.map(m => {
      if (m && m.startsWith("(") && m.endsWith(")")) {
        const pure = m.substring(1, m.length - 1);
        const r = new RegExp(`@palette\\(${pure}\\)|@design\\(${pure}\\)`, "g");
        value = value.replace(r, ObjectPath.get(themeToken[i], pure));
      }
    });
  });
  return value;
};

const useStyles = (props, theme = {}) => {
  let className = props.className || "";
  let newProps = {};
  const filteredProps = {};
  Object.keys(props).map(p => {
    if (p !== "style" && !p.startsWith("style-")) filteredProps[p] = props[p];
    if (p.startsWith("style-hover-")) {
      if (!newProps[":hover"]) newProps[":hover"] = {};
      newProps[":hover"][p.substring(12)] = props[p];
    } else if (p.startsWith("style-focus-")) {
      if (!newProps[":focus"]) newProps[":focus"] = {};
      newProps[":focus"][p.substring(12)] = props[p];
    } else if (p.startsWith("style-active-")) {
      if (!newProps[":active"]) newProps[":active"] = {};
      newProps[":active"][p.substring(13)] = props[p];
    } else if (p.startsWith("style-disabled-")) {
      if (!newProps[":disabled"]) newProps[":disabled"] = {};
      newProps[":disabled"][p.substring(15)] = props[p];
    } else if (p.startsWith("style-")) newProps[p.substring(6)] = props[p];
    else if (p === "style") newProps = Object.assign({}, newProps, props[p]);
  });
  Object.keys(newProps).map(p => {
    const prop = p
      .replace(/--space--/g, " ")
      .replace(/--point--/g, ".")
      .replace(/--hashtag--/g, "#");
    let content = "";
    if (typeof newProps[prop] === "string")
      content = `${
        newProps[prop] ? `{${prop}:${evaluate(newProps[prop], theme)}}` : ""
      }`;
    else if (isObject(newProps[prop]))
      content = `{${Object.entries(newProps[prop]).reduce(
        (content, [propName, propValue]) =>
          propValue
            ? `${content}${propName}:${evaluate(propValue, theme)};`
            : "",
        ""
      )}}`;

    content = content && content !== "{}" ? content : null;
    if (content) {
      if (props.rtl) content = rtl(content);
      const hash = `kc-${hashBuilder(`${prop}${content}`)}`;
      let contentClass = `.${hash}`;
      if (prop.startsWith(":")) contentClass += `${prop}${content}`;
      else if (prop.startsWith(".") || prop.startsWith("#")) {
        contentClass += ` ${prop}${content}`;
      } else if (prop.startsWith("@media"))
        contentClass = `${prop}{.${hash}${content}}`;
      else contentClass += content;
      if (!isRegisteredClass(hash)) {
        appendClass(contentClass);
        registerClass(hash);
      }
      className += !className.includes(hash) ? ` ${hash}` : "";
    }
  });

  return [className, filteredProps];
};

const rtl = content => {
  return content
    .replace(/right/g, "l-e-f-t")
    .replace(/left/g, "r-i-g-h-t")
    .replace(/l-e-f-t/g, "left")
    .replace(/r-i-g-h-t/g, "right");
};

module.exports = useStyles;
