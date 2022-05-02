import * as React from "react"
import { Link } from "gatsby"
import Bio from "../components/Bio"
import ExternalLink from "./ExternalLink"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <Bio />
      <main>{children}</main>
      <hr />
      <footer>
        © {new Date().getFullYear()} Naoto Ikeno<br/>This site is built by <ExternalLink to={`https://www.gatsbyjs.com/`}>Gatsby</ExternalLink> and managed by <ExternalLink to={`https://github.com/ikenox/ikenox.github.io`}>This repository</ExternalLink>.
      </footer>
    </div>
  )
}

export default Layout
