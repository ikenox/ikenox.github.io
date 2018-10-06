import React from 'react'
import firebase from 'firebase/app';
import 'firebase/auth';
import {debugLog} from '../util'
import dateformat from 'dateformat';

import nl2br from 'react-nl2br'

const COMMENT_API_URL = process.env.COMMENT_API_URL
const TEXTAREA_MIN_LINE_NUM = 5
const MAX_COMMENT_LENGTH = 1000

class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUserId: null,
      text: '',
      name: '',
      isPosting: false,
      comments: [],
      textAreaLineNum: TEXTAREA_MIN_LINE_NUM,
      error: ""
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.postComment = this.postComment.bind(this);
  }

  render() {
    return (<div>
      <h3 style={{marginTop: "1rem"}}>{this.state.comments.length} Comments</h3>
      <div style={{marginBottom: "1.5rem"}}>
        {this.state.comments.map(comment => (
          <div key={comment.commentId} style={{fontSize: ".9rem", marginBottom: ".75rem", paddingLeft: ".5rem"}}>
            <h4 style={{marginTop: "1.5rem", marginBottom: "0", fontWeight: "600"}}>{comment.name}</h4>
            <p style={{margin: "0", lineHeight: "1.6em", fontSize: ".85em", color: "#666"}}>
              {dateformat(new Date(comment.commentedAt), "yyyy-mm-dd HH:MM:ss")}
              {comment.commenter.userId === this.state.currentUserId ? <span
                style={{cursor: "pointer", textDecoration: "underline", marginLeft: "1em"}}
                onClick={() => this.deleteComment(comment.commentId)}>削除</span> : null}
            </p>
            <p style={{margin: "0", lineHeight: "1.6em"}}>{nl2br(comment.text)}</p>
          </div>))}

        <div style={{
          marginTop: "1rem", backgroundColor: "#f5f5f5", padding: ".5rem",
        }}>
          <input type="text" value={this.state.name} onChange={this.handleNameChange}
                 disabled={this.state.isPosting} placeholder="Name"
                 style={{
                   overflow: "auto",
                   background: "none",
                   outline: "none",
                   letterSpacing: "0.04em",
                   boxShadow: "none",
                   fontSize: "1rem",
                   height: "1.6rem",
                   width: "100%",
                   lineHeight: "normal",
                   padding: "0",
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
                      padding: "0",
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
                    value={this.state.text} onChange={this.handleTextChange}
                    disabled={this.state.isPosting}/>
          <br/>
          <button style={{
            appearance: "button",
            cursor: "pointer",
            padding: ".5rem .75rem",
            border: "none",
            marginTop: ".5rem",
            background: "#eee",
            color: "#666",
            fontWeight: "bold",
            fontSize: ".75rem"
          }} disabled={this.state.isPosting} onClick={this.postComment}>SUBMIT
          </button>
          <span style={{
            color: "#666", fontSize: ".75rem", marginLeft: "1em"
          }}>{this.state.text.length} / {MAX_COMMENT_LENGTH}</span>
        </div>
        <p style={{
          fontSize: ".75rem", height: "2.4em", lineHeight: "1.2em", margin: ".25rem .5rem", color: "red"
        }}>{this.state.error}</p>

      </div>
      {/*<button onClick={this.login}/>*/}
      {/*<div id={`firebaseui-auth-container`}/>*/}
    </div>)
  }

  login() {
    // let firebaseUI = new firebaseui.auth.AuthUI(firebase.auth());
    // firebaseUI.start('#firebaseui-auth-container', {
    //   callbacks: {
    //     signInSuccessWithAuthResult: function (authResult, redirectUrl) {
    //       // User successfully signed in.
    //       // Return type determines whether we continue the redirect automatically
    //       // or whether we leave that to developer to handle.
    //       return true;
    //     }, uiShown: function () {
    //       // The widget is rendered.
    //       // Hide the loader.
    //       // document.getElementById('loader').style.display = 'none';
    //     }
    //   }, // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    //   signInFlow: 'popup', signInOptions: [// Leave the lines as is for the providers you want to offer your users.
    //     firebase.auth.GoogleAuthProvider.PROVIDER_ID, firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    //     firebase.auth.TwitterAuthProvider.PROVIDER_ID, firebase.auth.GithubAuthProvider.PROVIDER_ID,
    //     firebase.auth.EmailAuthProvider.PROVIDER_ID, firebase.auth.PhoneAuthProvider.PROVIDER_ID],
    // });
  }

  deleteComment(commentId) {
    let ok = confirm("Are you sure you want to delete this comment?");
    if(!ok){
      return;
    }

    let user = firebase.auth().currentUser;

    (new Promise((resolve, reject) => {
      resolve(user != null ? user.getIdToken() : "")
    }))
      .then(idToken => {
        return fetch(COMMENT_API_URL + `/comment/` + commentId, {
          mode: 'cors', method: "DELETE", headers: {
            "Content-Type": "application/json; charset=utf-8", "IdToken": idToken,
          }, body: ""
        })
      })
      .then(res => {
        if (res.ok) {
          this.setState({
                          comments: this.state.comments.filter(comment => {
                            return comment.commentId !== commentId
                          }),
                        });
        }
      })
  }

  postComment(event) {
    // todo user may be null
    let user = firebase.auth().currentUser;

    this.setState({isPosting: true, error: ""});
    // todo move to repository
    (new Promise((resolve, reject) => {
      resolve(user != null ? user.getIdToken() : "")
    }))
      .then(idToken => {
        let body = {
          pageId: this.props.pageId, name: this.state.name, text: this.state.text,
        }
        return fetch(COMMENT_API_URL + `/comment`, {
          mode: 'cors', method: "POST", headers: {
            "Content-Type": "application/json; charset=utf-8", "IdToken": idToken,
          }, body: JSON.stringify(body),
        })
      })
      .then(res => Promise.all([res.ok, res.json()]))
      .then(([ok, json]) => {
        if (ok) {
          this.setComment("")
          this.setState({
                          comments: [...this.state.comments, json.data],
                        });
        }
        else {
          let err
          try {
            err = json.message
          }
          catch (e) {
            err = "sorry, an unexpected error occurred."
          }
          this.setState({
                          error: err,
                        });
        }
      })
      .catch((e) => {
        this.setState({
                        error: "sorry, an unexpected error occurred.",
                      });
      })
      .finally(() => {
        this.setState({isPosting: false});
      })

    event.preventDefault();
  }

  handleTextChange(event) {
    this.setComment(event.target.value)
  }

  handleNameChange(event) {
    this.setName(event.target.value)
  }

  setComment(comment) {
    localStorage.setItem(this.props.pageId + ".text", comment);
    let lineNum = comment.split("\n").length
    this.setState({text: comment, textAreaLineNum: lineNum < 5 ? 5 : lineNum});
  }

  setName(name) {
    localStorage.setItem('commenter.name', name)
    this.setState({name: name})
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({currentUserId: user.uid})
        if (user.isAnonymous) {
          debugLog("logged in as anonymous user " + user.uid)
        }
        else {
          debugLog("logged in as user " + user.uid)
        }
      }
      else {
        firebase.auth().signInAnonymously().catch(function (error) {
          console.error(error)
        });
      }
    })

    this.setName(localStorage.getItem('commenter.name') || "")
    this.setComment(localStorage.getItem(this.props.pageId + ".text") || "")

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
