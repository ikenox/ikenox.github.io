const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage, createRedirect } = actions

  // old path
  for (let slug of [
    ["2017-10-15", "first-commit"],
    ["2017-12-25", "ideavim-introduction"],
    ["2018-05-20", "perl-mousex-types-enum"],
    ["2018-08-04", "replaced-blog-with-gatsbyjs"],
    ["2018-09-02", "inheritance-and-delegation-and-interface"],
    ["2019-01-10", "database-is-like-global-variable"],
    ["2019-01-21", "made-corne-keyboard"],
    ["2019-01-25", "getting-started-ideavim"]
  ]) {
    createRedirect({
      fromPath: "/" + slug[0] + "-" + slug[1],
      toPath: "/blog/" + slug[1] + "/",
      isPermanent: true,
      redirectInBrowser: true
    });
    createRedirect({
      fromPath: "/" + slug[0] + "-" + slug[1] + "/",
      toPath: "/blog/" + slug[1] + "/",
      isPermanent: true,
      redirectInBrowser: true
    });
    createRedirect({
      fromPath: "/" + slug[0] + "/" + slug[1],
      toPath: "/blog/" + slug[1] + "/",
      isPermanent: true,
      redirectInBrowser: true
    });
    createRedirect({
      fromPath: "/" + slug[0] + "/" + slug[1] + "/",
      toPath: "/blog/" + slug[1] + "/",
      isPermanent: true,
      redirectInBrowser: true
    });
  }

  // Get all markdown blog posts sorted by date
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: ASC }
          limit: 1000
        ) {
          nodes {
            id
            fields {
              slug
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const posts = result.data.allMarkdownRemark.nodes

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

      // Define a template for blog post
      const blogPost = post.fields.slug.startsWith('/blog/')? path.resolve(`./src/templates/blog-post.js`):path.resolve(`./src/templates/simple-page.js`);

      createPage({
        path: post.fields.slug,
        component: blogPost,
        context: {
          id: post.id,
          previousPostId,
          nextPostId
        }
      })
    })
  }
}
const execSync = require('child_process').execSync;
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    const gitAuthorTime = execSync(
      `git log -1 --pretty=format:%aI ${node.fileAbsolutePath}`
    ).toString()

    const currentDir = execSync(
      `pwd`
    ).toString()

    createNodeField({
      name: `fileRelativePath`,
      node,
      value:node.fileAbsolutePath.substring(currentDir.length-1,node.fileAbsolutePath.length),
    })
    createNodeField({
      name: `lastModified`,
      node,
      value: node.frontmatter.lastModified || gitAuthorTime,
    })
    createNodeField({
      name: `slug`,
      node,
      value
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
    }

    type Fields {
      slug: String
    }
  `)
}
