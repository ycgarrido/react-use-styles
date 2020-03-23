# react-use-styles

Build dynamic class bassed in css styles for React's components, with rtl support.

#### Install

```
npm i --save @kamila-lab/use-styles
```

#### Usage

Write css styles like component's prop, writing `style` into prop object.

#### Example

###### Import useStyles and create a component:

```js
// import useStyles
import useStyles from "@kamila-lab/use-styles";

// create a custom component
const MyComponent = {direction,...props} => {
  const styles = useStyles({ props, direction });
  return (
    <div {...styles.props} className={styles.className}>
      This is a <span>component</span>
    </div>
  );
};

export default MyComponent;
```

###### Apply styles:

```js
// Define style
const myComponentStyle = {
  color: "#fff",
  backgroundColor: "#075294",
  padding: "5px",
  "&:hover": {
    border: "1px solid #458CCC !important",
    boxShadow: "0 28px 50px rgba(0,0,0,0.16)"
  },
  "&:focus": {
    border: "1px solid #458CCC !important"
  }
};
// use custom component
const OtherComponent = () => <MyComponent style={myComponentStyle} />;
```

###### Apply styles to nested components:

```js
/*
 * To apply styles to nested components add css selector after state
 */
const style = {
  "&:hover span": { color: "red" },
  "&:focus span": { color: "red" }
};

const OtherComponent = () => <MyComponent style={style} />;
```

#### Right to left

```js
/*
 * To use right to left add a bool prop rtl to componnet
 */
const style = {
  paddingLeft: "10px",
  borderTopLeftRadius: "30px",
  borderBottomLeftRadius: "30px"
};
const OtherComponent = () => <MyComponent style={style} direction="rtl" />;
```

#### Media and animations

```js
const style = {
  display: "inline-block",
    position: "relative",
    width: "80px",
    height: "80px",
    "& div": {
      position: "absolute",
      border: "4px solid #fff",
      opacity: 1,
      borderRadius: "50%",
      animation: "$lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite"
    },
    "& div:nth-child(2)": {
      animationDelay: "-0.5s"
    }
  "@media(max-width:400px)": {
    paddingLeft: "10px",
    borderTopLeftRadius: "30px",
    borderBottomLeftRadius: "30px"
  },
  "@keyframes lds-ripple": {
    "0%": {
      top: "36px",
      left: "36px",
      width: 0,
      height: 0,
      opacity: 1
    },
    "100%": {
      top: 0,
      left: 0,
      width: "72px",
      height: "72px",
      opacity: 0
    }
  }
};
const OtherComponent = () => <MyComponent style={style} />;
```
