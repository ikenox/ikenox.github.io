import React from 'react'
import firebase from 'firebase';
import firebaseui from 'firebaseui';

export const firebaseApp = firebase.initializeApp({
                                                    apiKey: "AIzaSyD7ZnEyTPtv8UXaJa1F4E_D9r9lFyamq5U",
                                                    authDomain: "comment-api-dev.firebaseapp.com",
                                                    databaseURL: "https://comment-api-dev.firebaseio.com",
                                                    projectId: "comment-api-dev",
                                                    storageBucket: "comment-api-dev.appspot.com",
                                                    messagingSenderId: "158688950686",
                                                  });

const COMMENT_API_URL = "http://localhost:8080"

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
        <p>name: {e.commenter.name}</p>
        <div>text: {e.comment.text}</div>
      </div>))}
      <form onSubmit={this.postComment}>
        <label>
          Name:
          <input type="textarea" value={this.state.name} onChange={this.handleNameChange}
                 disabled={this.state.isPosting}/>
        </label>
        <label>
          Text:
          <input type="text" value={this.state.text} onChange={this.handleTextChange} disabled={this.state.isPosting}/>
        </label>
        <input type="submit" value="Submit" disabled={this.state.isPosting}/>
      </form>
      <button onClick={this.login}/>
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
          console.log("logged in as anonymous user " + user.uid)
        }
        else {
          console.log("logged in as user " + user.uid)
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
        console.log(result.data)
        this.setState({comments: result.data});
      }, (error) => {
        console.error(error)
      })
  }
}

export default Comments
