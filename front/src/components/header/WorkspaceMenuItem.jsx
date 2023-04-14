import React, { useContext } from 'react'
import { ChevronRight } from 'react-feather'
import clsx from 'clsx'
import PropTypes from 'prop-types'

import styles from './WorkspaceMenuItem.module.scss'
import { AppState } from '../../contexts/AppState.js'

export default function WorkspaceMenuItem ({ color, name, id  }) {

  const { activeWorkspaceId } = useContext(AppState)

  const setActiveWorkspace = (workspaceId) => {
    activeWorkspaceId.value = workspaceId
  }

  return (
    <>
      <li onClick={() => setActiveWorkspace(id)} className={activeWorkspaceId.value === id ? clsx(styles.item, styles.selected) : styles.item}>
        <span className={styles.chip} style={{ backgroundColor: color }}/>
        <span className={styles.name}>{name}</span>
        <ChevronRight className={styles.chevron}/>
      </li>
    </>
  )
}

WorkspaceMenuItem.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  id: PropTypes.string
}
