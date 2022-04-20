import * as React from "react";
import { PropsWithChildren } from "react"

const ExternalLink: React.FC<PropsWithChildren<{ to: string }>> = props => (
  <a href={props.to} target="_blank" rel="noopener noreferrer">
    {props.children}
  </a>
);

export default ExternalLink;
