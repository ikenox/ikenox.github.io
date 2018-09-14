import React from 'react'

class Bio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {text: '', name: '', isPosting: false, comments: []};

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.postComment = this.postComment.bind(this);
  }

  render() {
    return (<div>
      {this.state.comments.map((e) =>
        <p key={e.comment.commentId}>{e.commenter.name}{e.comment.text}</p>
      )}
      <form onSubmit={this.postComment}>
        <label>
          Name:
          <input type="text" value={this.state.name} onChange={this.handleNameChange} disabled={this.state.isPosting}/>
        </label>
        <label>
          Text:
          <input type="text" value={this.state.text} onChange={this.handleTextChange} disabled={this.state.isPosting}/>
        </label>
        <input type="submit" value="Submit" disabled={this.state.isPosting}/>
      </form>
    </div>)
  }

  postComment(event) {
    let body = {
      pageId: this.props.pageId, tokenId: ``, name: this.state.name, text: this.state.text,
    }

    this.setState({isPosting: true});
    fetch(`https://comment-api-dev.appspot.com/comment`, {
      method: "POST", headers: {
        "Content-Type": "application/json; charset=utf-8",
      }, body: JSON.stringify(body),
    })
      .then(res => res.json())
      .then((result) => {
        this.setState({text: "", name: ""});
      }, (error) => {
        console.error(error)
      })
      .finally(() => {
        this.setState({isPosting: false});
      })
    event.preventDefault();
  }

  handleTextChange(event) {
    this.setState({text: event.target.value});
  }

  handleNameChange(event) {
    this.setState({name: event.target.value});
  }

  componentDidMount() {
    let pageId = this.props.pageId;
    fetch(`https://comment-api-dev.appspot.com/comment?pageId=` + pageId)
      .then(res => res.json())
      .then((result) => {
        this.setState({comments: result.data});
      }, (error) => {
        console.error(error)
      })
  }
}

export default Bio
