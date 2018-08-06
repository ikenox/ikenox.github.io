import React from 'react'

class PreviewLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <a href={this.props.url}>
        <div>
          {this.state.title}
          <br/>
          {this.state.description}
          <br/>
          {this.state.imageUrl}
          <br/>
          {this.state.host}
        </div>
      </a>
    )
  }

  componentDidMount() {
    fetch(`https://api.microlink.io/?url=${ this.props.url }`)
      .then(res => res.json())
      .then(
        (result) => {
          if ("success" === result.status) {
            this.setState({
              title: result.data.title,
              description: result.data.description,
              imageUrl: result.data.image ? result.data.image.url : null,
              host: result.data.publisher,
            });
          }
        },
        (error) => {
          this.setState({
          });
        }
      )
  }
}

export default PreviewLink
