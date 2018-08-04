import React from 'react'

import profilePic from './profile.jpeg'
import FaGithub from 'react-icons/lib/fa/github'
import FaTwitter from 'react-icons/lib/fa/twitter'
import Link from 'gatsby-link'

class Bio extends React.Component {
  render() {
    return (
      <div style={{ verticalAlign:"middle", display:"flex", alignItems:"center" }}>
        <Link to={`/about`} style={{float:"left", lineHeight:0 }}>
          <img
            src={profilePic}
            alt={`Naoto Ikeno`}
            width={80}
            height={80}
            style={{ borderRadius:40 }}
          />
        </Link>
        <div style={{ marginLeft:"12px"}}>
          <p style={{ fontSize:"1.2em", fontWeight:"700", margin:0, lineHeight:"1.2em" }}>
            Naoto Ikeno
          </p>
          <p style={{ fontSize:".8em", color:"#666", fontWeight:"500", margin:0, lineHeight:"1.2em" }}>
            Backend Engineer, Software Architecture & Design, Perl, Golang, GCP
          </p>
          <p style={{ fontSize:"1.2em", margin:0, lineHeight:"1.2em" }}>
            <a href={`https://github.com/ikenox`} target={`_blank`}><FaGithub/></a>
            <a href={`https://twitter.com/ikenoxx`} target={`_blank`}><FaTwitter/></a>
          </p>
        </div>
      </div>
    )
  }
}

export default Bio
