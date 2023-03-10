import React ,{useState, useEffect}from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import styled from 'styled-components';

const LeaderboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
`;

const LeaderboardTable = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

const LeaderboardRow = styled.tr`
  
  background-color: #f2f2f2;

`;

const LeaderboardHeader = styled.th`
  padding: 8px;
  text-align: left;
  background-color: #4caf50;
  color: white;
`;

const LeaderboardData = styled.td`
  padding: 8px;
  text-align: left;
`;


const Leaderboard = ({user,HighScore}) => {
    const [players, setPlayers] = useState([]);
    useEffect(() => {
        const db = firebase.firestore();
        const unsubscribe = db.collection('players').orderBy('Score','desc').onSnapshot(snapshot => {
            const newPlayers = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // console.log(newPlayers)
            setPlayers(newPlayers);
        });
        return () => unsubscribe();
    }, []);
    
    const handleAddPlayer = (newScore) => {
      const db = firebase.firestore();
      const userRef = db.collection('players').where('User', '==', user.uid);
      userRef.get()
      .then(querySnapshot => {
          if (querySnapshot.empty) {
            db.collection('players').add({
              Name: user.displayName,
              Score: newScore,
              User: user.uid   
            });
          } else {
              querySnapshot.forEach(doc => {
                doc.ref.update({ Score: newScore });
              });
          }
      })
      .catch(error => {
        console.error(error);
      });
    };
    
    return (
        <LeaderboardContainer>
      <h2>Leaderboard</h2>
      <LeaderboardTable>
        <tbody>
          <LeaderboardRow>
            <LeaderboardHeader>Rank</LeaderboardHeader>
            <LeaderboardHeader>Name</LeaderboardHeader>
            <LeaderboardHeader>Score</LeaderboardHeader>
          </LeaderboardRow>
          {players.map((player, index)=>(
                <LeaderboardRow key={player.id}>
                <LeaderboardData>{index + 1}</LeaderboardData>
                <LeaderboardData>{(index + 1) === 1 ?`TopG ${player.Name}`: player.Name}</LeaderboardData>
                <LeaderboardData>{player.Score}</LeaderboardData>
                </LeaderboardRow>
            ))} 
        </tbody>
      </LeaderboardTable>
      <button onClick={()=>handleAddPlayer(HighScore)}>SubmitScore</button> 
    </LeaderboardContainer>
  );
};

export default Leaderboard;