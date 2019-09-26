# react-use-styles

Build dynamic class bassed in css styles for React's components.

#### Install

```
npm i --save @kamila-lab/use-styles
```

#### Usage

Write css styles like component's prop, writing `style-` prefix and after write the prop css. if you want apply styles in hover, focus, disabled or active states you can write `style-hover-`, `style-focus-`, `style-disabled-`, `style-active-`
prefixes respectively.

#### Example

```js
// import useStyles
import useStyles from "@kamila-lab/use-styles";

// create a custom component
const MyComponent = props => {
  const className = useStyles(props);
  return <div className={className}>This is a component</div>;
};

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
