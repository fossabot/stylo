import React, { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSignal } from '@preact/signals-react'
import clsx from 'clsx'

import styles from './articles.module.scss'
import buttonStyles from './button.module.scss'
import fieldStyles from './field.module.scss'

import Modal from './Modal'
import Export from './Export'
import ArticleDelete from './ArticleDelete'
import ArticleTags from './ArticleTags'
import Share from './Share'

import formatTimeAgo from '../helpers/formatTimeAgo'

import Field from './Field'
import Button from './Button'
import { Check, ChevronDown, ChevronRight, Copy, Edit3, Eye, Printer, Share2, Trash } from 'react-feather'

import { duplicateArticle } from './Acquintances.graphql'
import { renameArticle, getArticleVersions } from './Article.graphql'
import { useGraphQL } from '../helpers/graphQL'
import { shallowEqual, useSelector } from 'react-redux'


export default function Article ({ article, tags: userTags, onTagsUpdated = () => {} }) {
  const articleId = article._id
  const articleTitle = useSignal(article.title)
  const articleVersions = useSignal(article.versions || [])

  // actions
  const [expanded, setExpanded] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [sharing, setSharing] = useState(false)

  const runQuery = useGraphQL()
  const activeUser = useSelector(state => state.activeUser, shallowEqual)

  const activeUserId = activeUser._id
  const isArticleOwner = activeUserId === article.owner._id
  const contributors = article.contributors.filter(c => c.user._id !== article.owner._id)

  useEffect(() => {
    (async () => {
      if (expanded) {
        try {
          const data = await runQuery({ query: getArticleVersions, variables: { articleId: articleId } })
          articleVersions.value = data.article.versions
        } catch (err) {
          alert(err)
        }
      }
    })()
  }, [expanded])

  const toggleExpansion = useCallback((event) => {
    if (!event.key || [' ', 'Enter'].includes(event.key)) {
      setExpanded(!expanded)
    }
  }, [expanded])

  const fork = useCallback(async () => {
    try {
      await runQuery({
        query: duplicateArticle,
        variables: { article: articleId, user: activeUserId, to: activeUserId }
      })
    } catch (err) {
      console.error(`Unable to duplicate article ${articleId} with myself (userId: ${activeUserId})`, err)
      alert(err)
    }
  }, [articleId])

  const handleRename = useCallback(async (e) => {
    e.preventDefault()
    const variables = {
      user: activeUserId,
      article: articleId,
      title: articleTitle.value,
    }
    await runQuery({ query: renameArticle, variables })
    article.title = articleTitle.value
    setRenaming(false)
  }, [articleTitle])

  const handleEditTitle = useCallback((event) => {
    event.stopPropagation()
    setRenaming(true)
  }, [])

  return (
    <article className={styles.article}>
      {exporting && (
        <Modal title="Export" cancel={() => setExporting(false)}>
          <Export articleId={articleId} bib={article.workingVersion.bibPreview} name={articleTitle.value}/>
        </Modal>
      )}

      {sharing && (
        <Modal title="Share with Stylo users" cancel={() => setSharing(false)}>
          <Share article={article} cancel={() => setSharing(false)}/>
        </Modal>
      )}

      {!renaming && (
        <h1 className={styles.title} onClick={toggleExpansion}>
          <span tabIndex={0} onKeyUp={toggleExpansion}>
            {expanded ? <ChevronDown/> : <ChevronRight/>}
          </span>

          {articleTitle}

          <Button title="Edit" icon={true} className={styles.editTitleButton} onClick={handleEditTitle}>
            <Edit3 size="20"/>
          </Button>
        </h1>
      )}
      {renaming && (
        <form className={clsx(styles.renamingForm, fieldStyles.inlineFields)} onSubmit={handleRename}>
          <Field autoFocus={true} type="text" value={articleTitle} onChange={(event) => articleTitle.value = event.target.value}
                 placeholder="Article Title"/>
          <Button title="Save" primary={true} onClick={handleRename}>
            <Check/> Save
          </Button>
          <Button title="Cancel" type="button" onClick={() => {
            setRenaming(false)
            articleTitle.value = article.title
          }}>
            Cancel
          </Button>
        </form>
      )}

      <aside className={styles.actionButtons}>
        {isArticleOwner &&
          <Button title={contributors.length ? 'Remove all contributors in order to delete this article' : 'Delete'}
                  disabled={contributors.length > 0} icon={true} onClick={() => setDeleting(true)}>
            <Trash/>
          </Button>}

        <Button title="Duplicate" icon={true} onClick={() => fork()}>
          <Copy/>
        </Button>

        {<Button title="Share with Stylo users" icon={true} onClick={() => setSharing(true)}>
          <Share2/>
        </Button>}

        <Button title="Download a printable version" icon={true} onClick={() => setExporting(true)}>
          <Printer/>
        </Button>

        <Link title="Edit article" className={buttonStyles.primary} to={`/article/${articleId}`}>
          <Edit3/>
        </Link>

        <Link title="Preview (open a new window)" target="_blank" className={buttonStyles.icon}
              to={`/article/${articleId}/preview`}>
          <Eye/>
        </Link>
      </aside>

      {deleting && (
        <div className={clsx(styles.alert, styles.deleteArticle)}>
          <p>
            You are trying to delete this article, double click on the
            &quot;delete button&quot; below to proceed
          </p>
          <Button className={styles.cancel} onClick={() => setDeleting(false)}>
            Cancel
          </Button>

          <ArticleDelete article={article}/>
        </div>
      )}

      <section className={styles.metadata}>
        <p className={styles.metadataAuthoring}>
          {article.tags.map((t) => (
            <span className={styles.tagChip} key={'tagColor-' + t._id} style={{ backgroundColor: t.color || 'grey' }}/>
          ))}
          by <span className={styles.author}>{article.owner.displayName}</span>
          {contributors.length > 0 && (<span className={styles.contributors}>
          , <span className={styles.author}>{contributors.map(c => c.user.displayName).join(', ')}</span>
          </span>)}

          <time dateTime={article.updatedAt} className={styles.momentsAgo}>
            ({formatTimeAgo(article.updatedAt)})
          </time>
        </p>

        {expanded && (
          <>
            <h4>Last versions</h4>
            <ul className={styles.versions}>
              {articleVersions.value.map((v) => (
                <li key={`version-${v._id}`}>
                  <Link to={`/article/${articleId}/version/${v._id}`}>{`${
                    v.message ? v.message : 'no label'
                  } (v${v.version}.${v.revision})`}</Link>
                </li>
              ))}
            </ul>

            <h4>Tags</h4>
            <div className={styles.editTags}>
              <ArticleTags articleId={articleId} tags={article.tags} userTags={userTags} onTagsUpdated={onTagsUpdated}/>
            </div>
          </>
        )}
      </section>
    </article>
  )
}
