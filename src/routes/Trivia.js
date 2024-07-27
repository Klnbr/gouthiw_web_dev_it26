import React from 'react'
import { useLocation } from 'react-router-dom';
import CreateTrivia from '../components/trivia-manage/CreateTrivia'
import EditTrivia from '../components/trivia-manage/EditTrivia'

function Trivia() {
     const location = useLocation();
     const { triviaData } = location.state || {};

     return (
          <>
               { triviaData ? (
                    <EditTrivia triviaData={triviaData} />
               ) : (
                    <CreateTrivia />
               )}   
          </>
     )
}

export default Trivia