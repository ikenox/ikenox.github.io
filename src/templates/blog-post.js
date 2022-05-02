import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { HatenaBookmarkButton } from "../components/share-button/HatenaBookmarkButton"
import { TwitterButton } from "../components/share-button/TwitterButton"
import { PocketButton } from "../components/share-button/PocketButton"
import ExternalLink from "../components/ExternalLink"

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Title`

  const modified = post.fields.lastModified;
  const posted = post.frontmatter.date;
  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <hr />
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <p>
            <span>{posted}</span>
            <span>{posted === modified
              ? <div />
              : <span>
              &nbsp;|&nbsp;Modified {modified} <ExternalLink to={`https://github.com/ikenox/ikenox.github.io/commits/master` + post.fields.fileRelativePath}>changelog</ExternalLink>
            </span>
            }</span> </p>
        </header>
        <div style={{ margin: "1rem 0 0 0" }}>
          <HatenaBookmarkButton />
          &nbsp;
          <TwitterButton />
          &nbsp;
          <PocketButton />
        </div>

        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
      </article>
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0
          }}
        >
        </ul>
      </nav>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
    query BlogPostBySlug(
        $id: String!
        $previousPostId: String
        $nextPostId: String
    ) {
        site {
            siteMetadata {
                title
            }
        }
        markdownRemark(id: { eq: $id }) {
            fields {
                lastModified(formatString: "yyyy-MM-DD")
                fileRelativePath
            }
            id
            excerpt(pruneLength: 160)
            html
            frontmatter {
                title
                date(formatString: "yyyy-MM-DD")
                description
            }
        }
        previous: markdownRemark(id: { eq: $previousPostId }) {
            fields {
                slug
            }
            frontmatter {
                title
            }
        }
        next: markdownRemark(id: { eq: $nextPostId }) {
            fields {
                slug
            }
            frontmatter {
                title
            }
        }
    }
`
