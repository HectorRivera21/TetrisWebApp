import React ,{useState, useEffect}from "react"
import Tetris from "./components/Tetris";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import './App.css';


function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyCKijQTWkNq1vggj-gAekVfNU_Dthw2m2A",
    authDomain: "jojo-tetris-game.firebaseapp.com",
    projectId: "jojo-tetris-game",
    storageBucket: "jojo-tetris-game.appspot.com",
    messagingSenderId: "269431928711",
    appId: "1:269431928711:web:c082c93573a05e8e468522"
  };
  const [user, setUser] = useState(null);

  firebase.initializeApp(firebaseConfig);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        const user = result.user;
        setUser(user);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleLogout = () => {
    firebase.auth().signOut()
      .then(() => {
        setUser(null);
      })
      .catch(error => {
        console.error(error);
      });
  };


  return (
    <div className="App">
      {!user
      ?
      (
        <div>
          <button onClick={handleLogin}>google login</button>
        </div>
      ):
        <div id ="buttonboi">
          <button onClick={handleLogout}>LogOut</button>
          <Tetris user= {user} logOut ={handleLogout}/>
        </div>
      }
    </div>
  );
}

export default App;
