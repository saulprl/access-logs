import { Global, css } from "@emotion/react";

export const GlobalStyles = () => (
  <Global
    styles={css`
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      * {
        margin: 0;
        
        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      *::-webkit-scrollbar {
        display: none;
      }

      body {
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
        max-width: 100vw;
        overflow-x: hidden;
      }

      img,
      picture,
      video,
      canvas,
      svg {
        display: block;
        max-width: 100%;
      }

      input,
      button,
      textarea,
      select {
        font: inherit;
      }

      p,
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        overflow-wrap: break-word;
      }

      #root,
      #__next {
        isolation: isolate;
      }
    `}
  />
);
