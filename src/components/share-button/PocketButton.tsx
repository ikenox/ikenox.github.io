import * as React from "react";
import styled, { css } from "styled-components";

export class PocketButton extends React.Component {
  componentDidMount(): void {
    let script = document.createElement("script");
    script.id = "pocket-btn-js";
    script.src = "https://widgets.getpocket.com/v1/j/btn.js?v=1";
    script.async = true;
    try {
      document
        .getElementById("pocket-button-a")
        .parentElement.appendChild(script);
    } catch {}
  }

  render() {
    return (
      <PocketButtonWrapper>
        <a
          id="pocket-button-a"
          data-pocket-label="pocket"
          data-pocket-count="horizontal"
          className="pocket-btn"
          data-lang="en"
        />
      </PocketButtonWrapper>
    );
  }
}

const PocketButtonWrapper = styled.div`
  display: inline-block;
  height: 20px;
  overflow: hidden;
  .pocket-btn {
    display: inline-block;
  }
`;
