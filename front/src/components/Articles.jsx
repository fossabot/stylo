import React, { createRef, useCallback, useEffect, useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { CurrentUserContext } from '../contexts/CurrentUser'
import { Search } from 'react-feather'

import { useGraphQL } from '../helpers/graphQL'
import { getUserArticles, getWorkspaceArticles } from './Articles.graphql'
import etv from '../helpers/eventTargetValue'

import Article from './Article'
import CreateArticle from './CreateArticle'

import styles from './articles.module.scss'
import Button from './Button'
import Field from './Field'
import Loading from './Loading'
import { useActiveUserId } from '../hooks/user'
import WorkspaceLabel from './header/WorkspaceLabel.jsx'
import { useActiveWorkspace } from '../hooks/workspace.js'
import TagsList from './tag/TagsList.jsx'
import Modal from './Modal.jsx'

import { useSignal, computed } from '@preact/signals-react'

export default function Articles () {

  const tags = useSignal([])
  const articles = useSignal([])
  const selectedTagIds = useSignal([])
  const articlesCount = computed(() => articles.value.length)
  const activeUser = useSelector(state => state.activeUser, shallowEqual)

  // actions
  const [creatingArticle, setCreatingArticle] = useState(false)

  const articleTitleField = createRef()
  useEffect(() => {
    if (articleTitleField.current) {
      articleTitleField.current.focus() // give focus to the first form input
    }
  }, [articleTitleField])

  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [needReload, setNeedReload] = useState(false)

  const [currentUser, setCurrentUser] = useState(activeUser)

  const activeUserId = useActiveUserId()
  const activeWorkspace = useActiveWorkspace()
  const activeWorkspaceId = activeWorkspace?._id
  const runQuery = useGraphQL()

  const handleCloseCreatingArticle = useCallback(() => setCreatingArticle(false), [])

  const filterByTagsSelected = (article) => {
    if (selectedTagIds.value.length === 0) {
      return true
    }
    // if we find at least one matching tag in the selected list, we keep the article
    return selectedTagIds.value.some(tagId => {
      return article.tags.find(({ _id }) => _id === tagId)
    })
  }

  const selectedArticles = articles.value
    .filter(filterByTagsSelected)
    .filter(article => article.title.toLowerCase().indexOf(filter.toLowerCase()) > -1)

  useEffect(() => {
    //Self invoking async function
    (async () => {
      try {
        if (activeWorkspaceId) {
          const data = await runQuery({
            query: getWorkspaceArticles,
            variables: { userId: activeUserId, workspaceId: activeWorkspaceId }
          })
          tags.value = data.tags
          articles.value = data.workspace.articles
          setIsLoading(false)
          setNeedReload(false)
        } else {
          const data = await runQuery({ query: getUserArticles, variables: { userId: activeUserId } })
          // Need to sort by updatedAt desc
          tags.value = data.tags
          articles.value = data.articles
          setCurrentUser(data.user)
          setIsLoading(false)
          setNeedReload(false)
        }
      } catch (err) {
        alert(err)
      }
    })()
  }, [needReload, activeUserId, activeWorkspaceId])

  return (<CurrentUserContext.Provider value={currentUser}>
    <section className={styles.section}>
      <header className={styles.articlesHeader}>
        <h1>Articles</h1>
        {activeWorkspace && <WorkspaceLabel color={activeWorkspace.color} name={activeWorkspace.name}/>}
      </header>
      <div className={styles.actions}>
        <Field className={styles.searchField}
               type="text"
               icon={Search}
               value={filter}
               laceholder="Search"
               onChange={(e) => setFilter(etv(e))}
        />
      </div>

      <aside className={styles.filtersContainer}>
        <div className={styles.filtersTags}>
          <h4>Tags</h4>
          <TagsList tags={tags} selectedTagIds={selectedTagIds}/>
        </div>
      </aside>

      <div className={styles.articlesTableHeader}>
        <Button primary={true} onClick={() => setCreatingArticle(true)}>
          Create a new article
        </Button>
        <div className={styles.articleCounter}>{articlesCount} article{articlesCount > 1 ? 's' : ''}</div>
      </div>
      {creatingArticle && (
        <Modal title="New article" cancel={handleCloseCreatingArticle}>
          <CreateArticle ref={articleTitleField}/>
        </Modal>
      )}
      {isLoading ? <Loading/> : selectedArticles.map(article => (
        <Article
          key={`article-${article._id}`}
          tags={tags}
          article={article}
          onTagsUpdated={({ articleId, tags }) => {
            articles.value = articles.value
              .map((a) => {
                if (a._id === articleId) {
                  a.tags = tags
                  return a
                }
                return a
              })
          }}
        />
      ))}
    </section>
  </CurrentUserContext.Provider>)
}
