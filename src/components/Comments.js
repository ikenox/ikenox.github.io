import React from 'react'
import firebase from 'firebase/app';
import firebaseui from 'firebaseui';
import {debugLog} from '../util'
import dateformat from 'dateformat';

import nl2br from 'react-nl2br'

const COMMENT_API_URL = process.env.COMMENT_API_URL
const TEXTAREA_MIN_LINE_NUM = 5

let inputStyle = {
  border: "none", overflow: "auto", outline: "none", boxShadow: "none",
}

class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state =
      {currentUser: null, text: '', name: '', isPosting: false, comments: [], textAreaLineNum: TEXTAREA_MIN_LINE_NUM};

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.postComment = this.postComment.bind(this);
  }

  render() {
    return (<div>
      <h3 style={{marginTop: "1rem"}}>{this.state.comments.length} Comments</h3>
      <div style={{marginBottom: "1.5rem"}}>
        {this.state.comments.map(
          e => (<div key={e.comment.commentId} style={{fontSize: ".9rem", marginBottom: ".75rem", paddingLeft: ".5rem"}}>
            <h4 style={{marginTop: "1.5rem", marginBottom: "0", fontWeight: "600"}}>{e.commenter.name}</h4>
            <p style={{margin: "0", lineHeight: "1.6em", fontSize: ".85em", color: "#666"}}>{dateformat(
              new Date(e.comment.commentedAt), "yyyy-mm-dd HH:MM:ss")}</p>
            <p style={{margin: "0", lineHeight: "1.6em"}}>{nl2br(e.comment.text)}</p>
          </div>))}

        <div style={{
          marginTop: "1rem",
          backgroundColor: "#f5f5f5",
          borderRadius: ".25rem",
          padding: ".5rem",
        }}>
          <form onSubmit={this.postComment}>
            <input type="text" value={this.state.name} onChange={this.handleNameChange}
                   disabled={this.state.isPosting} placeholder="Name"
                   style={{
                     overflow: "auto",
                     background: "none",
                     outline: "none",
                     letterSpacing: "0.04em",
                     boxShadow: "none",
                     fontSize: "1rem",
                     height:"1.6rem",
                     width: "100%",
                     lineHeight: "0",
                     padding:"0",
                     boxSizing: "border-box",
                     color: "#0a0a0a",
                     border: "none",
                     fontKerning: "normal",
                     fontSmoothing: "antialiased",
                     fontWeight: "600",
                     fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Segoe UI", "ヒラギノ角ゴ ProN W3", Hiragino Kaku Gothic ProN, Arial, "メイリオ", Meiryo, sans-serif',
                   }}/>
            <textarea id="comment-text" placeholder="Comment" rows={this.state.textAreaLineNum}
                      style={{
                        padding:"0",
                        overflow: "auto",
                        outline: "none",
                        resize: "none",
                        color: "#0a0a0a",
                        background: "none",
                        boxShadow: "none",
                        lineHeight: "1.6em",
                        fontSize: ".9rem",
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        fontKerning: "normal",
                        fontSmoothing: "antialiased",
                        fontWeight: "lighter",
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Segoe UI", "ヒラギノ角ゴ ProN W3", Hiragino Kaku Gothic ProN, Arial, "メイリオ", Meiryo, sans-serif',
                      }}
                      value={this.state.text} onChange={this.handleTextChange} disabled={this.state.isPosting}/>
            <br/>
            <input style={{ cursor: "pointer", padding:".5rem .75rem",border:"none",marginTop:".5rem",background:"#eee", color:"#666", fontWeight:"bold", fontSize:".75rem" }} type="submit" value="SUBMIT" disabled={this.state.isPosting}/>
          </form>
        </div>

      </div>
      {/*<button onClick={this.login}/>*/}
      {/*<div id={`firebaseui-auth-container`}/>*/}
    </div>)
  }

  login() {
    let firebaseUI = new firebaseui.auth.AuthUI(firebase.auth());
    firebaseUI.start('#firebaseui-auth-container', {
      callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          return true;
        }, uiShown: function () {
          // The widget is rendered.
          // Hide the loader.
          // document.getElementById('loader').style.display = 'none';
        }
      }, // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: 'popup', signInOptions: [// Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID, firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID, firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID, firebase.auth.PhoneAuthProvider.PROVIDER_ID],
    });
  }

  postComment(event) {
    // todo user may be null
    let user = firebase.auth().currentUser;

    this.setState({isPosting: true});
    // todo move to repository
    (new Promise((resolve, reject) => {
      resolve("")
      // todo login
      // resolve(user != null ? user.getIdToken() : "")
    }))
      .then(idToken => {
        let body = {
          pageId: this.props.pageId, idToken: idToken, name: this.state.name, text: this.state.text,
        }
        return fetch(COMMENT_API_URL + `/comment`, {
          mode: 'cors', method: "POST", headers: {
            "Content-Type": "application/json; charset=utf-8",
          }, body: JSON.stringify(body),
        })
      })
      .then(res => res.json())
      .then((result) => {
        localStorage.setItem(this.props.pageId + ".text", "");
        this.setState({
                        text: "", comments: [...this.state.comments, result.data],
                      });
      }, (error) => {
        console.error(error)
      })
      .finally(() => {
        this.setState({isPosting: false});
      })

    event.preventDefault();
  }

  handleTextChange(event) {
    localStorage.setItem(this.props.pageId + ".text", event.target.value);
    let lineNum = event.target.value.split("\n").length
    this.setState({text: event.target.value, textAreaLineNum: lineNum < 5 ? 5 : lineNum});
  }

  handleNameChange(event) {
    localStorage.setItem('commenter.name', event.target.value)
    this.setState({name: event.target.value})
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        if (user.isAnonymous) {
          debugLog("logged in as anonymous user " + user.uid)
        }
        else {
          debugLog("logged in as user " + user.uid)
        }
      }
    })
    this.setState({
                    name: localStorage.getItem('commenter.name') || "",
                    text: localStorage.getItem(this.props.pageId + ".text") || ""
                  })

    let pageId = this.props.pageId;
    fetch(COMMENT_API_URL + `/comment?pageId=` + pageId, {mode: 'cors'})
      .then(res => res.json())
      .then((result) => {
        debugLog(result.data)
        this.setState({comments: result.data});
      }, (error) => {
        console.error(error)
      })
  }
}

export default Comments
