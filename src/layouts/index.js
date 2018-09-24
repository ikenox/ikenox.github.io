import React from 'react'
import Link from 'gatsby-link'
import FaRSS from 'react-icons/lib/fa/feed'
import Bio from '../components/Bio'
import Helmet from 'react-helmet'

require("./prism.css");
require("./base.css");
require("firebaseui");

class Template extends React.Component {

  render() {
    const {location, children} = this.props
    let header
    if (location.pathname === '/') {
      header = (<div>
          <h1 style={{fontSize: "1.5rem", marginTop: ".5rem", display: "inline-block"}}>
            <Link to={'/'}>
              ikenox.info
            </Link>
          </h1>
          <a href={'/rss.xml'} target={`_blank`}
             style={{display: "block", fontSize: "1.5rem", float: "right", marginTop: "0.6rem"}}><FaRSS/></a>
        </div>)
    }
    else {
      header = (<div>
          <h3 style={{fontSize: "1.5rem", marginTop: ".5rem", display: "inline-block"}}>
            <Link to={'/'}>
              ikenox.info
            </Link>
          </h3>
          <a href={'/rss.xml'} target={`_blank`}
             style={{display: "block", fontSize: "1.5rem", float: "right", marginTop: "0.6rem"}}><FaRSS/></a>
        </div>)
    }
    return (<div className={`content-wrapper`}>
        <Helmet>
          <meta name={`og:image`} content={`https://ikenox.info/icon.png`}/>
          <meta name={`og:type`} content={`website`}/>
        </Helmet>
        {header}
        <Bio/>
        {children()}
      </div>)
  }
}

Template.propTypes = {
  children: React.PropTypes.func, location: React.PropTypes.object, route: React.PropTypes.object,
}

export default Template
