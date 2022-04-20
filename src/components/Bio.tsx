import * as React from "react"

import Link from "gatsby-link"
import ExternalLink from "./ExternalLink"

const Bio = () => (
  <div
    style={{
      marginTop: "1rem",
      marginBottom: "1rem",
      verticalAlign: "middle",
      display: "flex",
      alignItems: "center"
    }}
  >
    <Link to={`/about`} style={{ float: "left", lineHeight: 0 }}>
      <img
        src={`/icon.png`}
        alt={`@ikenox`}
        style={{
          height: "3em",
        }}
      />
    </Link>
    <div style={{ marginLeft: "12px" }}>
        @ikenox
        <br />
        <ExternalLink to={`https://github.com/ikenox`}>
          GitHub
        </ExternalLink>
        &nbsp;
        <ExternalLink to={`https://twitter.com/ikenox_`}>
          Twitter
        </ExternalLink>
        &nbsp;
        <ExternalLink to="/rss.xml">
          RSS
        </ExternalLink>
    </div>
  </div>
)

export default Bio
