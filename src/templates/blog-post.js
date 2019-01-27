import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'

import Bio from '../components/Bio'
import Comments from '../components/Comments'
import SocialButtons from '../components/SocialButtons'
import styled from 'styled-components';

import rehypeReact from "rehype-react"
import PreviewLink from "../components/PreviewLink"

const renderAst = new rehypeReact({
                                    createElement: React.createElement, components: {"preview-link": PreviewLink},
                                  }).Compiler

require('./blog-post.css')

const Pager = styled.div`
a {
  text-decoration:none;
}

.linkPrevious{
font-size:.9rem;
padding:5px;
}
.linkNext{
font-size:.9rem;
padding:5px;
}
`

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const {previous, next} = this.props.pathContext

    const title = `${post.frontmatter.title}`

    return (<div>
      <Helmet title={title}>
        <meta name={`og:title`} content={title}/>
        /* FIXME absolute path */
        {post.frontmatter.thumbnail ? <meta name={`og:image`} content={'https://ikenox.info' + post.frontmatter.thumbnail.publicURL}/> : ""}
      </Helmet>
      <h1 style={{marginBottom: 0}}>{post.frontmatter.title}</h1>
      <p className={`date-text`} style={{marginTop: 0}}>{post.frontmatter.date}</p>
      <SocialButtons path={this.props.location.pathname}/>
      <div className={`content`} style={{marginTop: "2rem", marginBottom: "2rem"}}>
        {renderAst(post.htmlAst)}
      </div>
      <Bio/>
      <hr/>
      <Comments pageId={this.props.location.pathname.replace(/^\/|\/$/g, '')}/>
      <hr/>
      <Pager style={{ marginBottom:"40px" }}>
        {previous && (<div className={`linkPrevious`}>
          <Link to={previous.fields.slug} rel="prev">
            ← {previous.frontmatter.title}
          </Link>
        </div>)}

        {next && (<div className={`linkNext`}>
          <Link to={next.fields.slug} rel="next">
            → {next.frontmatter.title}
          </Link>
        </div>)}
      </Pager>
    </div>)
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {site {siteMetadata {title
    author}}
    markdownRemark(fields: {slug: {eq: $slug}}) {id
    htmlAst
    frontmatter {title
      thumbnail{
        publicURL
      }
    date(formatString: "MMMM DD, YYYY")}}}
  `
