import { Theme } from "@emotion/react";

const purple = "#7145d6";
const blue = "#00b7ff";
const green = "#1ac768";
const pink = "#e91e63";

const poppins = "'Poppins', sans-serif";

const unit = 4;
const maxWidth = "768px";

const main: Theme = {
  colors: {
    primary: purple,
    secondary: blue,
    success: green,
    error: pink,
  },

  fonts: {
    main: poppins,
  },

  sizes: {
    maxWidth,
    borderRadius: `${unit * 4}px`,
    heading1: `${unit * 16}px`,
  },
};

export default main;
