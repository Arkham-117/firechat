import React, { useRef, useState } from 'react';
import './App.css';

// Import Firebase modules
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

// Import Firebase Hooks for React
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// Import React Icons
import { AiOutlineSend } from 'react-icons/ai';
import { AiFillWechat } from 'react-icons/ai';
import { AiOutlineGoogle } from 'react-icons/ai';

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyBqxs5R6ygBmG2B75t7grSGA8MFPezH8yE",
  authDomain: "firechat-5e614.firebaseapp.com",
  projectId: "firechat-5e614",
  storageBucket: "firechat-5e614.appspot.com",
  messagingSenderId: "238405377967",
  appId: "1:238405377967:web:24f3ce495243fbfbc7995a"
})

// Create references to Firebase authentication and firestore
const auth = firebase.auth();
const firestore = firebase.firestore();


// Define the main App component
function App() {
  // Get the current user from Firebase authentication
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>React Firebase Chat App<AiFillWechat /></h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>


    </div>
  );
}



// Define the Sign In component
function SignIn() {
  // Sign in with Google using Firebase authentication
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
    
    <div className="intro">
      <h1>Welcome to Our App</h1>
      <p>Our app is a platform for connecting people and sharing information. Please be respectful of others and follow our community guidelines. Let's make this a positive and inclusive space for everyone.</p>
    </div>

    <button className="sign-in" onClick={signInWithGoogle}>
      <AiOutlineGoogle style={{ fontSize: '2rem', marginRight: '10px', verticalAlign: 'middle' }} />
      Sign in with Google
    </button>

    </>
  )

}

// Define the Sign Out component
function SignOut() {
  // Show the Sign Out button only if the user is logged in
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

// Define the Chat Room component
function ChatRoom() {
  // Create a reference to a dummy element to scroll to after sending a message
  const dummy = useRef();
  // Create a reference to the 'messages' collection in firestore
  const messagesRef = firestore.collection('messages');
  // Query the last 25 messages in the collection
  const query = messagesRef.orderBy('createdAt').limit(25);

  // Listen to changes in the 'messages' collection using the useCollectionData hook
  const [messages] = useCollectionData(query, { idField: 'id' });

  // Set up the form to send a message
  const [formValue, setFormValue] = useState('');

  // Function to send a message to firestore
  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    // Add the message to the 'messages' collection in firestore
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    // Clear the form after sending the message and scroll to the dummy element
    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>
      {/* Map over messages and create a ChatMessage component for each */}
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

       {/* Dummy span used for scrolling to the bottom of the chat */}
      <span ref={dummy}></span>
    </main>

    {/* Form for sending messages */}
    <form onSubmit={sendMessage}>
      {/* Input field for entering a message */}
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Type a message" />
      {/* Button for submitting the message */}
      <button type="submit" disabled={!formValue}><AiOutlineSend /></button>
    </form>
  </>)
}

function ChatMessage(props) {
  // Destructure message props
  const { text, uid, photoURL } = props.message;
  // Determine the class of the message based on the user ID
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  // Render the message
  return (<>
  {/* Use the messageClass to determine the styling of the message */}
    <div className={`message ${messageClass}`}>
      {/* Display the user's profile photo */}
      <img src={photoURL || 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'} />
      
      <p>{text}</p>
    </div>
  </>)
}


export default App;