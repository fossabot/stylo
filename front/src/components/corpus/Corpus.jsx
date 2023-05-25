import { Button, Modal as GeistModal, useModal } from '@geist-ui/core'
import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { shallowEqual, useSelector } from 'react-redux'
import { CurrentUserContext } from '../../contexts/CurrentUser'

import { useGraphQL } from '../../helpers/graphQL'
import { useActiveWorkspace } from '../../hooks/workspace.js'
import styles from './corpus.module.scss'
import CorpusCreate from './CorpusCreate.jsx'

import Loading from '../Loading'
import { useActiveUserId } from '../../hooks/user'
import WorkspaceLabel from '../workspace/WorkspaceLabel.jsx'

import { getWorkspaceCorpus, getUserCorpus } from './Corpus.graphql'
import CorpusItem from './CorpusItem.jsx'

export default function Corpus () {
  const { t } = useTranslation()
  const currentUser = useSelector(state => state.activeUser, shallowEqual)
  const latestCorpusCreated = useSelector(state => state.latestCorpusCreated, shallowEqual)
  const latestCorpusDeleted = useSelector(state => state.latestCorpusDeleted, shallowEqual)
  const [isLoading, setIsLoading] = useState(true)
  const [corpus, setCorpus] = useState([])
  const activeUserId = useActiveUserId()
  const activeWorkspace = useActiveWorkspace()
  const activeWorkspaceId = activeWorkspace?._id
  const {
    visible: createCorpusVisible,
    setVisible: setCreateCorpusVisible,
    bindings: createCorpusModalBinding
  } = useModal()

  const runQuery = useGraphQL()

  const handleCreateNewCorpus = useCallback(() => {
    setCreateCorpusVisible(false)
  }, [])

  useEffect(() => {
    //Self invoking async function
    (async () => {
      try {
        if (activeWorkspaceId) {
          const data = await runQuery({ query: getWorkspaceCorpus, variables: { workspaceId: activeWorkspaceId } })
          setCorpus(data.workspace.corpus)
          setIsLoading(false)
        } else {
          const data = await runQuery({ query: getUserCorpus })
          setCorpus(data.corpus)
          setIsLoading(false)
        }
      } catch (err) {
        alert(err)
      }
    })()
  }, [activeUserId, activeWorkspaceId, latestCorpusCreated, latestCorpusDeleted])

  useEffect(() => {
    //Self invoking async function
    (async () => {
      try {
        setIsLoading(true)
        //const data = await runQuery({ query, variables: { user: activeUserId } })
        setIsLoading(false)
      } catch (err) {
        alert(err)
      }
    })()
  }, [activeUserId, activeWorkspaceId])

  return (<CurrentUserContext.Provider value={currentUser}>
    <section className={styles.section}>
      <header className={styles.header}>
        <h1>Corpus</h1>
        {activeWorkspace && <WorkspaceLabel color={activeWorkspace.color} name={activeWorkspace.name}/>}
      </header>
      <p className={styles.introduction}>
        A corpus is a collection of articles that you can sort and export all at once.
      </p>

      <Button type="secondary" className={styles.button} onClick={() => setCreateCorpusVisible(true)}>{t('corpus.createAction.buttonText')}</Button>

      <GeistModal width="40rem" visible={createCorpusVisible} {...createCorpusModalBinding}>
        <h2>{t('corpus.createModal.title')}</h2>
        <GeistModal.Content>
          <CorpusCreate onSubmit={handleCreateNewCorpus}/>
        </GeistModal.Content>
        <GeistModal.Action passive onClick={() => setCreateCorpusVisible(false)}>{t('modal.close.text')}</GeistModal.Action>
      </GeistModal>

      {isLoading ? <Loading/> : (
        <ul className={styles.corpusList}>
          {corpus.map((c) => {
            return (
              <li key={c._id}><CorpusItem corpus={c}/></li>
            )
          })}
        </ul>
      )}
    </section>
  </CurrentUserContext.Provider>)
}
