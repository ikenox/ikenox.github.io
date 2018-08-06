import React from 'react'
import styled from 'styled-components';

const Info = styled.div`
p { margin:0px;line-height:1.2em; }
`

class PreviewLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <a href={this.props.url}
         style={{display: "box", marginTop: "10px", marginBottom: "10px", textDecoration: "none"}}>
        <div style={{border: "1px solid #ccc", display: "flex", maxWidth: "500px"}}>
          <img src={this.state.imageUrl} style={{width: "120px", height: "120px", objectFit: "cover"}}/>
          <Info style={{padding: ".5rem .75rem", position:"relative"}}>
            <p style={{fontWeight: "bold"}}>{this.state.title}</p>
            <p style={{
              marginTop:".2rem",
              color: "#666",
              height:"4.2em",
              fontSize: ".75rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              wordBreak: "break-all",
              lineHeight:"1.4em"
            }}>{this.state.description}</p>
            <p style={{	marginBottom:".5rem", position: "absolute", bottom: 0, color: "#666", fontSize: ".7rem"}}>{this.state.host}</p>
          </Info>
        </div>
      </a>
    )
  }

  componentDidMount
  () {
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
          this.setState({});
        }
      )
  }
}

export default PreviewLink
