# react-use-styles

Build dynamic class bassed in css styles for React's components, with rtl support.

#### Install

```
npm i --save @kamila-lab/use-styles
```

#### Usage

Write css styles like component's prop, writing `style-` prefix and after write the prop css. if you want apply styles in hover, focus, disabled or active states you can write `style-hover-`, `style-focus-`, `style-disabled-`, `style-active-`
prefixes respectively.

#### Example

###### Import useStyles and create a component:

```js
// import useStyles
import useStyles from "@kamila-lab/use-styles";

// create a custom component
const MyComponent = props => {
  const className = useStyles(props);
  return (
    <div className={className}>
      This is a <span>component</span>
    </div>
  );
};

export default MyComponent;
```

###### Apply styles with preffix:

```js
// use custom component
const OtherComponent = () => (
  <MyComponent
    style-color="#fff"
    style-background-color="#075294"
    style-padding="5px"
    style-hover-border="1px solid #458CCC !important"
    style-hover-box-shadow="0 28px 50px rgba(0,0,0,0.16)"
    style-focus-border="1px solid #458CCC !important"
  />
);
```

###### Apply styles with style prop:

```js
// use custom component
const style = {
  color: "#fff",
  padding: "5px",
  "background-color": "#075294",
  ":hover": {
    border: "1px solid #458CCC !important",
    "box-shadow": "0 28px 50px rgba(0,0,0,0.16)"
  },
  ":focus": {
    border: "1px solid #458CCC !important"
  }
};

const OtherComponent = () => <MyComponent style={style} />;
```

###### Apply styles to nested components:

```js
/*
 * To apply styles to nested components add css selector after state
 */
const style = {
  ":hover span": { color: "red" },
  ":focus span": { color: "red" }
};

const OtherComponent = () => <MyComponent style={style} />;
```

#### Right to left

```js
/*
 * To use right to left add a bool prop rtl to componnet
 */
const style = {
  "padding-left": "10px",
  "border-top-left-radius": "30px",
  "border-bottom-left-radius": "30px"
};
const OtherComponent = () => <MyComponent style={style} rtl />;
```
