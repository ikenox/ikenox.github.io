import React from 'react'
import firebase from 'firebase/app';
import firebaseui from 'firebaseui';
import { debugLog } from '../util'

// todo move to repository
firebase.initializeApp({
                         apiKey: process.env.FIREBASE_API_KEY,
                         authDomain: process.env.FIREBASE_AUTH_DOMAIN,
                         projectId: process.env.FIREBASE_PROJECT_ID,
                       });

const COMMENT_API_URL = process.env.COMMENT_API_URL

class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {currentUser: null, text: '', name: '', isPosting: false, comments: []};

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.postComment = this.postComment.bind(this);
  }

  render() {
    return (<div>
      {this.state.comments.map(e => (<div key={e.comment.commentId}>
        <span>name: {e.commenter.name}</span>
        <p style={{ margin:"0" }}>text: {e.comment.text}</p>
      </div>))}
      <form onSubmit={this.postComment}>
        <label>
          Name:
          <input type="text" value={this.state.name} onChange={this.handleNameChange}
                 disabled={this.state.isPosting}/>
        </label>
        <br/>
        <label>
          Text:
          <textarea value={this.state.text} onChange={this.handleTextChange} disabled={this.state.isPosting}/>
        </label>
        <br/>
        <input type="submit" value="Submit" disabled={this.state.isPosting}/>
      </form>
      {/*<button onClick={this.login}/>*/}
      <div id={`firebaseui-auth-container`}/>
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
    this.setState({text: event.target.value});
  }

  handleNameChange(event) {
    localStorage.setItem('commenter.name', event.target.value);
    this.setState({name: event.target.value});
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
