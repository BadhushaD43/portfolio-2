import React from 'react'
import { Hero } from '../components/Hero'
import { Skills } from '../components/Skills'
import { Projects } from '../components/Projects'
import { Contact } from '../components/Contact'

export const Home: React.FC = () => {
  return (
    <main className="w-full">
      {/* Session 1: Hero */}
      <Hero />

      {/* Session 2: Skills Overview */}
      <Skills />

      {/* Session 3: Featured Projects */}
      <Projects />

      {/* Session 4: Get In Touch */}
      <Contact />
    </main>
  )
}
export default Home
