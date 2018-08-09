import React from 'react'

const radius = ".2rem"

class PreviewLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={{marginTop: "1rem", marginBottom: "1rem"}}>
        <a href={this.props.url} target={`_blank`}
           style={{textDecoration: "none", border: "0"}}>
          <div style={{
            verticalAlign: "middle",
            display: "flex",
            alignItems: "center",
            border: "1px solid #eee",
            borderRadius: radius,
            width:"100%",
          }}>
            <div style={{marginLeft: ".75rem", marginRight: ".5rem", width:"100%"}}>
              <p style={{
                fontSize: "1rem",
                fontWeight: "600",
                margin: 0,
                lineHeight: "1.2em",
                height: "1.2em",
                overflow: "hidden",
              }}>
                {this.state.title ? this.state.title : this.props.title}
              </p>
              <p style={{
                overflow: "hidden",
                fontSize: ".85rem",
                color: "#666",
                margin: ".4rem 0 0 0",
                lineHeight: "1.4em",
                height: "2.8em",
                lineClamp:"2",
              }}>
                {this.state.description}
              </p>
              <p style={{
                overflow: "hidden",
                wordBreak: "break-all",
                fontSize: ".7em",
                color: "#666",
                margin: ".6rem 0 0 0",
                lineHeight: "1.2em",
                height: "1.2em",
                lineClamp:"1",
              }}>
                {this.props.url.toString().replace(/^.*\/\/([^\/?#]*).*$/, "$1")}
              </p>
            </div>
            <div style={{width: "7rem", height: "7rem" }}>
              <img
                src={this.state.imageUrl ? this.state.imageUrl : "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN89x8AAuEB74Y0o2cAAAAASUVORK5CYII="}
                style={{
                  borderBottomRightRadius: radius,
                  borderTopRightRadius: radius,
                  objectFit: "cover",
                  width: "7rem",
                  height: "7rem",
                }}
              />
            </div>
          </div>
        </a>
      </div>
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
              imageUrl: result.data.logo ? result.data.logo.url : null,
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
