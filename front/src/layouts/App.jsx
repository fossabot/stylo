import React, { Suspense, useContext } from 'react'

import Loading from '../components/Loading'
import { AppState } from '../contexts/AppState.js'

export default function StyloApp ({ children }) {
  const { applicationStarted } = useContext(AppState)

  return (
    <main>
      <Suspense fallback={<Loading/>}>
        {applicationStarted.value ? (children) : <Loading/>}
      </Suspense>
    </main>
  )
}
