import React, { useState, useEffect } from 'react'
// import { useSignal } from '@preact/signals-react'
// FIXME: CANNOT USE useSignal with React PrivateRoute
/*
React has detected a change in the order of Hooks called by PrivateRoute. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://fb.me/rules-of-hooks

   Previous render            Next render
   ------------------------------------------------------
1. useContext                 useRef
   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    in PrivateRoute (at src/index.jsx:134)
    in Switch2 (at src/index.jsx:129)
    in Suspense (at App.jsx:11)
    in main (at App.jsx:10)
    in StyloApp (at src/index.jsx:128)
    in Router2 (created by BrowserRouter2)
    in BrowserRouter2 (at src/index.jsx:125)
    in Provider (at src/index.jsx:124)
    in StrictMode (at src/index.jsx:123)
 */
import { useGraphQL } from '../helpers/graphQL'
import { getUserArticles, getWorkspaceArticles } from './Articles.graphql'

import Article from './Article'
import Loading from './Loading'
import WorkspaceLabel from './header/WorkspaceLabel.jsx'
import { useActiveWorkspace } from '../hooks/workspace.js'
import { useActiveUserId } from '../hooks/user.js'

import styles from './articles.module.scss'

export default function Articles () {

  const activeWorkspace = useActiveWorkspace()
  const activeWorkspaceId = activeWorkspace?._id
  const activeUserId = useActiveUserId()

  const [isLoading, setIsLoading] = useState(true)
  const [articles, setArticles] = useState([])

  const runQuery = useGraphQL()

  useEffect(() => {
    //Self invoking async function
    (async () => {
      try {
        if (activeWorkspaceId) {
          const data = await runQuery({
            query: getWorkspaceArticles,
            variables: { userId: activeUserId, workspaceId: activeWorkspaceId }
          })
          setArticles(data.workspace.articles)
          setIsLoading(false)
        } else {
          const data = await runQuery({ query: getUserArticles, variables: { userId: activeUserId } })
          // Need to sort by updatedAt desc
          setArticles(data.articles)
          setIsLoading(false)
        }
      } catch (err) {
        alert(err)
      }
    })()
  })

  /*const tags = useSignal([])
  const articles = useSignal([])
  const selectedTagIds = useSignal([])
  const articlesCount = computed(() => articles.value.length)

  // actions
  const [creatingArticle, setCreatingArticle] = useState(false)

  /!*
  const articleTitleField = createRef()
  useEffect(() => {
    if (articleTitleField.current) {
      articleTitleField.current.focus() // give focus to the first form input
    }
  }, [articleTitleField])*!/

  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [needReload, setNeedReload] = useState(false)

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
          setIsLoading(false)
          setNeedReload(false)
        }
      } catch (err) {
        alert(err)
      }
    })()
  }, [tags, needReload, activeUserId, activeWorkspaceId])

  const onTagsUpdated = ({ articleId, tags }) => {
    articles.value = articles.value
      .map((a) => {
        if (a._id === articleId) {
          a.tags = tags
          return a
        }
        return a
      })
  }*/

  return (<section className={styles.section}>
    <header className={styles.articlesHeader}>
      <h1>Articles</h1>
      {activeWorkspace && <WorkspaceLabel color={activeWorkspace.color} name={activeWorkspace.name}/>}
    </header>
    {/*  <div className={styles.actions}>
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
      </div>*/}
    {/*{creatingArticle && (*/}
    {/*  <Modal title="New article" cancel={handleCloseCreatingArticle}>*/}
    {/*    <CreateArticle ref={articleTitleField}/>*/}
    {/*  </Modal>*/}
    {/*)}*/}
    <>
      {isLoading ? <Loading/> : articles.map(article => {
        return (
          <Article
            key={`article-${article._id}`}
            tags={[]}
            article={article}
          />
        )
      })}
    </>
  </section>)
}
