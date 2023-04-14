import React, { useContext } from 'react'

import WorkspaceLabel from './header/WorkspaceLabel.jsx'

import styles from './articles.module.scss'
import { AppState } from '../contexts/AppState.js'

export default function Articles () {

  const { activeWorkspace } = useContext(AppState)

  //const { data, error } = useArticles({ userId: activeUserId, workspaceId: activeWorkspaceId })
  //console.log({ data, error })

  /*
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
  })*/

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
      {activeWorkspace.value && <WorkspaceLabel color={activeWorkspace.value.color} name={activeWorkspace.value.name}/>}
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
    {/*    <>
      {isLoading ? <Loading/> : articles.map(article => {
        return (
          <Article
            key={`article-${article._id}`}
            tags={[]}
            article={article}
          />
        )
      })}
    </>*/}
  </section>)
}
