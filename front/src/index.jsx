import './wdyr.js'
import 'core-js/modules/web.structured-clone'
import React, { lazy, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'

import './styles/general.scss'
import App from './layouts/App'
import { getUserProfile } from './helpers/userProfile'
import { getApplicationConfig } from './helpers/applicationConfig'

import Header from './components/Header'
import Footer from './components/Footer'
import Register from './components/Register'
import NotFound from './components/404'
import Login from './components/Login.jsx'
import { computed, signal } from '@preact/signals-react'
import { AppState } from './contexts/AppState.js'

const { SNOWPACK_SESSION_STORAGE_ID: sessionTokenName = 'sessionToken' } = import.meta.env

// lazy loaded routes
const Books = lazy(() => import('./components/Books'))
const Articles = lazy(() => import('./components/Articles'))
const Workspaces = lazy(() => import('./pages/Workspaces'))

const applicationConfig = signal({
  backendEndpoint: import.meta.env.SNOWPACK_PUBLIC_BACKEND_ENDPOINT,
  graphqlEndpoint: import.meta.env.SNOWPACK_PUBLIC_GRAPHQL_ENDPOINT,
  exportEndpoint: import.meta.env.SNOWPACK_PUBLIC_EXPORT_ENDPOINT,
  processEndpoint: import.meta.env.SNOWPACK_PUBLIC_PROCESS_ENDPOINT,
  pandocExportEndpoint: import.meta.env.SNOWPACK_PUBLIC_PANDOC_EXPORT_ENDPOINT,
  humanIdRegisterEndpoint: import.meta.env.SNOWPACK_PUBLIC_HUMAN_ID_REGISTER_ENDPOINT,
})
const activeUser = signal(undefined)
const activeWorkspaceId = signal(undefined)
const applicationStarted = signal(false)
const sessionToken = signal(localStorage.getItem(sessionTokenName))

function createAppState () {
  const activeWorkspace = computed(() => activeUser.value.workspaces.find((workspace) => workspace._id === activeWorkspaceId.value))
  return { activeUser, applicationStarted, applicationConfig, sessionToken, activeWorkspaceId, activeWorkspace }
}

(async () => {
  // const authToken = new URLSearchParams(location.hash).get('#auth-token')
  // if (authToken) {
  //   store.dispatch({ type: 'UPDATE_SESSION_TOKEN', token: authToken })
  //   sessionToken = authToken
  //   window.history.replaceState({}, '', location.pathname)
  // }
  applicationConfig.value = await getApplicationConfig(applicationConfig.value)

  try {
    const { user } = await getUserProfile({
      applicationConfig: applicationConfig.value,
      sessionToken: sessionToken.value
    })
    activeUser.value = user
  } catch (error) {
    console.log('User seemingly not authenticated: %s', error.message)
  } finally {
    applicationStarted.value = true
  }
})()

const TrackPageViews = () => {
  const location = useLocation()

  useEffect(() => {
    const _paq = window._paq = window._paq || []

    //@todo do this dynamically, based on a subscription to the store
    //otherwise, we should use _paq.push(['forgetConsentGiven'])
    _paq.push(['setConsentGiven'])
    _paq.push(['setCustomUrl', location.pathname])
    //_paq.push(['setDocumentTitle', 'My New Title'])
    _paq.push(['trackPageView'])
  }, [location])

  return null
}

const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  if (activeUser.value._id === undefined) {
    return <Login from={location}/>
  }
  return children
}

const root = createRoot(document.getElementById('root'))
root.render(<React.StrictMode>
  <AppState.Provider value={createAppState()}>
    <Router>
      <TrackPageViews/>
      <Header/>
      <App>
        <Routes>
          <Route path="/register" exact element={<Register/>}/>
          {/* Articles index */}
          <Route path="/articles" exact element={<Articles/>}/>
          <Route path="/" exact element={<Articles/>}/>
          {/* Books index */}
          <Route path="/books" exact element={<ProtectedRoute><Books/></ProtectedRoute>}/>
          {/* Workspaces index */}
          <Route path="/workspaces" exact element={<ProtectedRoute> <Workspaces/></ProtectedRoute>}/>
          {/*<PrivateRoute path="/credentials" exact>*/}
          {/*  <Credentials/>*/}
          {/*</PrivateRoute>*/}
          {/*/!* Annotate a Book *!/*/}
          {/*<Route path={[`/books/:bookId/preview`]} exact>*/}
          {/*  <ArticlePreview/>*/}
          {/*</Route>*/}
          {/*/!* Annotate an article or its version *!/*/}
          {/*<Route path={[`/article/:id/version/:version/preview`, `/article/:id/preview`]} exact>*/}
          {/*  <ArticlePreview/>*/}
          {/*</Route>*/}
          {/*/!* Write and Compare *!/*/}
          {/*<PrivateRoute path={[`/article/:id/compare/:compareTo`, `/article/:id/version/:version/compare/:compareTo`]}*/}
          {/*              exact>*/}
          {/*  <Write/>*/}
          {/*</PrivateRoute>*/}
          {/*/!* Write with a given version *!/*/}
          {/*<PrivateRoute path={`/article/:id/version/:version`} exact>*/}
          {/*  <Write/>*/}
          {/*</PrivateRoute>*/}
          {/*/!* Write and/or Preview *!/*/}
          {/*<PrivateRoute path={[`/article/:id/preview`, `/article/:id`]} exact>*/}
          {/*  <Write/>*/}
          {/*</PrivateRoute>*/}
          {/*<Route exact path="/privacy">*/}
          {/*  <Privacy/>*/}
          {/*</Route>*/}
          {/*<Route exact path="/ux">*/}
          {/*  <h2>Buttons</h2>*/}
          {/*  <h4>Primary</h4>*/}
          {/*  <Button primary={true}>Create New Article</Button>*/}
          {/*  <h4>Secondary</h4>*/}
          {/*  <Button>Manage Tags</Button>*/}
          {/*  <h4>With Icon</h4>*/}
          {/*  <Button><Check/> Save</Button>*/}
          {/*  <h4>Icon Only</h4>*/}
          {/*  <Button icon={true}><Copy/></Button>*/}
          {/*  <h2>Fields</h2>*/}
          {/*  <h4>Search</h4>*/}
          {/*  <Field placeholder="Search" icon={Search}/>*/}
          {/*  <h4>Textarea</h4>*/}
          {/*  <div style={{ 'max-width': '50%' }}>*/}
          {/*    <textarea className={buttonStyles.textarea} rows="10">Du texte</textarea>*/}
          {/*  </div>*/}
          {/*  <h4>Select</h4>*/}
          {/*  <Select>*/}
          {/*    <option>Tome de Savoie</option>*/}
          {/*    <option>Reblochon</option>*/}
          {/*    <option>St Marcellin</option>*/}
          {/*  </Select>*/}
          {/*  <h4>Tabs</h4>*/}
          {/*  <h4>Form actions</h4>*/}
          {/*</Route>*/}
          {/*<Route exact path="/error">*/}
          {/*  <Error/>*/}
          {/*</Route>*/}
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </App>

      <Footer/>
    </Router>
  </AppState.Provider>
</React.StrictMode>)
