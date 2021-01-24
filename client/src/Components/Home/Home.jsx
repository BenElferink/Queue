import React from 'react'
import Canvas from './HomeCanvas/Canvas'
import './Home.css'
import HomeFeatures from './HomeFeatures/HomeFeatures'
import Footer from './ContactFooter/Footer'

function Home() {
    return (
        <div className="home">
            <div className="home__canvas">
                <Canvas/>
            </div>
            
            <div className="home__whatQueue" id="aboutQueue">
                <h1>What is Queue?</h1>
                <p>In the modern scenario of teaching and education, due to the pandemic, teachers and mentors have been facing major issues of concern with respect to the productivity of their teaching sessions because of the irregular and poorly managed Questions (Doubts) and Answers (Solutions) asked in between the "online" sessions. Queue provides the host with various features that help them to manage and organize the session into various productive parts in a way that increases the amount of knowledge shared by the host as well as the number of doubts cleared. </p>
            </div>

            <div className="home__features">
                <HomeFeatures/>
            </div>
            <Footer/>
        </div>
    )
}

export default Home
