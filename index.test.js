const useStyles = require("./index");

const equals = (value, specs) => {
  if (value !== specs) console.error(`Test fail: ${value} specs ${specs}`);
  else console.info("Test success");
};

const theme = {
  palette: {
    primary: { base: "blue" }
  },
  design: {
    typo: {
      eds: {
        fontSize3: {
          fontSize: "12px",
          fontWeight: "bold"
        }
      }
    },
    border: {
      small: "2px"
    }
  }
};

const base = {
  style: {
    boxShadow:
      "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)"
  }
};
const state = {
  style: {
    "&:hover": {
      color: "blue"
    }
  }
};

const nested = {
  style: {
    "&.my-class p span": {
      color: "blue"
    }
  }
};

const evaluate = {
  style: {
    border: "solid @theme(design.border.small) @theme(palette.primary.base)"
  }
};

const media = {
  style: {
    "@media(min-width:450px)": {
      backgroundColor: "red"
    }
  }
};

const animations = {
  style: {
    "@keyframes lds-ripple": {
      "0%": {
        top: "36px"
      },
      "100%": {
        top: 0
      }
    }
  }
};

const rtl = {
  style: {
    borderRight: "none"
  }
};

const temp1 = useStyles({
  props: base,
  theme
});

equals(
  temp1.stylesheet,
  `.${temp1.className}{box-shadow:0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)}`
);

const temp2 = useStyles({
  props: state,
  theme
});

equals(temp2.stylesheet, `.${temp2.className}:hover{color:blue}`);

const temp3 = useStyles({
  props: nested,
  theme
});

equals(temp3.stylesheet, `.${temp3.className}.my-class p span{color:blue}`);

const temp4 = useStyles({
  props: evaluate,
  theme
});

equals(
  temp4.stylesheet,
  `.${temp4.className}{border:solid ${theme.design.border.small} ${theme.palette.primary.base}}`
);

const temp5 = useStyles({
  props: media,
  theme
});

equals(
  temp5.stylesheet,
  `@media(min-width:450px){.${temp5.className}{background-color:red}}`
);

const temp6 = useStyles({
  props: animations,
  theme
});

equals(temp6.stylesheet, "@keyframes lds-ripple{0%{top:36px;}100%{top:0;}}");

const temp7 = useStyles({
  props: rtl,
  direction: "rtl",
  theme
});

equals(temp7.stylesheet, `.${temp7.className}{border-left:none}`);
