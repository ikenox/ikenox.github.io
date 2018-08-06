import React from 'react'

class PreviewLink extends React.Component {
  render() {
    return (
      <a href={this.props.url}>
        {this.props.title}
      </a>
    )
  }

  componentDidMount() {
    console.log(this.props.url)
    console.log(this.props.title)
  }
}

export default PreviewLink
