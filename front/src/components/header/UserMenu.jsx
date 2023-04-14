import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layers, LogOut, User } from 'react-feather'

import useComponentVisible from '../../hooks/componentVisible'
import styles from './UserMenu.module.scss'
import Button from '../Button.jsx'
import WorkspaceMenuItem from './WorkspaceMenuItem.jsx'
import UserMenuLink from './UserMenuLink.jsx'
import { AppState } from '../../contexts/AppState.js'


export default function UserMenu () {
  const logout = () => {
    setIsComponentVisible(false)
    // FIXME: logout!
    activeUser.value = undefined
  }
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false)
  const { activeUser, activeWorkspace } = useContext(AppState)
  const username = activeUser.value.displayName
  const email = activeUser.value.email
  const workspaces = activeUser.value.workspaces

  useEffect(() => {
    setIsComponentVisible(false)
  }, [setIsComponentVisible, activeWorkspace.value])

  return (
    <div ref={ref} className={styles.container}>
      <div className={styles.userMenuLink} onClick={() => setIsComponentVisible(!isComponentVisible)}>
        <UserMenuLink username={username} activeWorkspace={activeWorkspace.value}/>
      </div>
      {isComponentVisible && <div className={styles.menu}>
        <div className={styles.workspaces}>
          <h4>Espaces de travail</h4>
          <ul>
            <WorkspaceMenuItem color="#D9D9D9" name="Mon espace"/>
            {workspaces.map((workspace) =>
              <WorkspaceMenuItem
                id={workspace._id}
                key={workspace._id}
                color={workspace.color}
                name={workspace.name}
              />
            )}
            <li className={styles.workspacesLink}>
              <Link to="/workspaces"
                    onClick={() => setIsComponentVisible(false)}>
                <Layers/>
                Tous les espaces
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.footer}>
          <div className={styles.userBlock}>
            <Link to="/credentials" onClick={() => setIsComponentVisible(false)} className={styles.userCard}>
              <div className={styles.persona}><User/></div>
              <div className={styles.userInfo}>
                <div className={styles.username}>{username}</div>
                <div className={styles.email}>{email}</div>
              </div>
            </Link>
            <Button className={styles.logoutButton} onClick={logout} link>
              <LogOut size={22}/>
            </Button>
          </div>
        </div>
      </div>}
    </div>
  )
}
