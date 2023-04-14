import React, { useContext } from 'react'
import { LifeBuoy } from 'react-feather'
import { Link, Route, Routes } from 'react-router-dom'

import logoContent from '../../public/images/logo.svg?inline'

import styles from './header.module.scss'
import UserMenu from './header/UserMenu.jsx'
import { AppState } from '../contexts/AppState.js'
import { computed } from '@preact/signals-react'

function Header () {
  const { activeUser } = useContext(AppState)
  const connected = computed(() => {
    return activeUser.value?._id !== undefined
  })
  const header = (<header className={styles.headerContainer}>
    <section className={styles.header}>
      <h1 className={styles.logo}>
        <Link to="/"><img src={logoContent} alt="Stylo" title="Stylo"/></Link>
      </h1>
      {connected.value && <>
        <nav>
          <ul className={styles.menuLinks}>
            <li><Link to="/articles">Articles</Link></li>
            <li><Link to="/books">Books</Link></li>
          </ul>
        </nav>
        <nav className={styles.secondaryNav}>
          <UserMenu/>
          <a className={styles.documentationLink}
             href="https://stylo-doc.ecrituresnumeriques.ca"
             target="_blank"
             rel="noopener noreferrer"
          >
            <LifeBuoy size={16}/>
            Documentation
          </a>
        </nav>
      </>}
      {!connected.value && <nav>
        <ul className={styles.menuLinks}>
          <li><Link to="/">Login</Link></li>
          <li><Link to="/register" className={styles.registerAction}>Register</Link></li>
        </ul>
      </nav>}
    </section>
  </header>)
  return (<Routes>
    <Route path="*/preview"/>
    <Route path="*" element={header}/>
  </Routes>)
}

export default Header
