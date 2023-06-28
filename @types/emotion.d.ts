import "@emotion/react";

declare module "@emotion/react" {
  export interface Theme {
    colors: {
      primary: string;
      secondary: string;
      success: string;
      error: string;
      gray: string;
    };
    fonts: {
      main: string;
    };
    sizes: {
      maxWidth: string;
      borderRadius: string;
      heading1: string;
    };
  }
}
