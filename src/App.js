import React, { useRef, useState } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyC4fbp-2oHaTeA5rfYW3eWlLUuydK4Qtls",
  authDomain: "react-chat-a9b28.firebaseapp.com",
  projectId: "react-chat-a9b28",
  storageBucket: "react-chat-a9b28.appspot.com",
  messagingSenderId: "62077204878",
  appId: "1:62077204878:web:907c9b80cb722388e34cdf",
  measurementId: "G-JSHQG7FS6J"
})

const auth = firebase.auth();
const firestore =  firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
      <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn/>}
      </section>
    </div>
  );
}

function SignIn(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <button onClick={signInWithGoogle} >sign in with Google</button>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom(){
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, { idField: 'id' });
  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e)=>{
    e.preventDefault();
    const {uid, photoURL } = auth.currentUser;
    await messagesRef.add({
      text:formValue,
      createdAt:firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth'});
  }

  return(<>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
      <span ref={dummy}></span>
    </main>
    <div>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e )=> setFormValue(e.target.value)} />
        <button type='submit'></button>
      </form>
    </div>
    </>)
}

function ChatMessage(props){
  const { text, uid , photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return(
    <div Classname= {`message ${messageClass}`}>
      <img src ={photoURL} />
      <p>{text}</p>
    </div>
  )
}

export default App;
