import React from 'react'
import { About as AboutComponent } from '../components/About'
import { Experience } from '../components/Experience'
import { Certifications } from '../components/Certifications'
import { Education } from '../components/Education'

export const AboutPage: React.FC = () => {
  return (
    <main className="w-full pt-20">
      {/* Session 1: About Me */}
      <AboutComponent />

      {/* Session 2: Work Experience */}
      <Experience />

      {/* Session 3: Certifications */}
      <Certifications />

      {/* Session 4: Education */}
      <Education />
    </main>
  )
}
export default AboutPage
