const _ = require('lodash')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const nodeTypes = require("./src/utils/node-types");
const { isConference, createConference } = require("./src/types/conference");
const { attachFields } = require(`gatsby-plugin-node-fields`)

const QUERY_POST = `
query Post {
  allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, limit: 1000) {
    edges {
      node {
        fields {
          type
          slug
          title
        }
        frontmatter {
          title
        }
      }
    }
  }
}`;
//const QUERY_TRELLO = `
//query Trello {
//  allTrelloCard {
//    edges {
//      node {
//        id
//        name
//      }
//    }
//  }
//}`;
exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js')
    resolve(
      graphql(QUERY_POST).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        // Create blog posts pages.
        const posts = result.data.allMarkdownRemark.edges;
        _.each(posts, (post, index) => {
          const previous = index === posts.length - 1 ? null : posts[index + 1].node;
          const next = index === 0 ? null : posts[index - 1].node;
          if (!post.node.fields.slug) console.log(JSON.stringify(post, null, 4))
          
          createPage({
            path: post.node.fields.slug,
            component: blogPost,
            context: {
              slug: post.node.fields.slug,
              previous,
              next,
            },
          })
        })
      //}).then(_ => {
      //  return graphql(QUERY_TRELLO).then(result => {
      //    if (result.errors) {
      //      console.log(result.errors)
      //      reject(result.errors)
      //    }
      //  })
      })
    )
  })
}

const createArticle = ({ node, boundActionCreators, getNode }) => {
    const { createNodeField } = boundActionCreators
    createNodeField({
        name: "type",
        node,
        value: "article"
    })
    const slug = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value: slug,
    })
    attachFields(node, createNodeField, [{
        predicate: _ => true,
        fields: [
            {
                name: 'readers',
                getter: node => node.frontmatter.readers,
                defaultValue: "",
                transformer: readers => readers.split(",").map(r => r.trim()).filter(r => r),
            },
            {
                name: 'author',
                getter: node => node.frontmatter.author,
                defaultValue: "Tobie Langel",
            },
            {
                name: 'title',
                getter: node => node.frontmatter.title,
                defaultValue: node => node.fields.slug,
            },
            {
                name: 'date',
                getter: node => node.frontmatter.date,
            },
            {
                name: 'bio',
                getter: node => node.frontmatter.bio,
                defaultValue: false,
            }
        ]
    }]);
};

exports.onCreateNode = ({ node, boundActionCreators, getNode }) => {
  const { createNodeField } = boundActionCreators
//if (isConference({ node, getNode })) {
//    console.log(JSON.stringify(node, null, 4))
//    createConference({ node, getNode, boundActionCreators });
//}
  if (nodeTypes.isArticleNode({ node, getNode })) {
      createArticle({ node, getNode, boundActionCreators })
  }
}


 

