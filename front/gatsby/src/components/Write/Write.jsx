import React, { useCallback, useEffect, useRef, useState } from 'react'
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import 'codemirror/mode/markdown/markdown'
import { Controlled as CodeMirror } from 'react-codemirror2'
import throttle from 'lodash.throttle'
import debounce from 'lodash.debounce'
import 'codemirror/lib/codemirror.css'

import styles from './write.module.scss'

import askGraphQL from '../../helpers/graphQL'

import WriteLeft from './WriteLeft'
import WriteRight from './WriteRight'
import Compare from './Compare'
import CompareSelect from './CompareSelect'
import Loading from '../Loading'

function Write() {
  const { version: currentVersion, id: articleId, compareTo } = useParams()
  const userId = useSelector((state) => state.activeUser._id)
  const applicationConfig = useSelector(
    (state) => state.applicationConfig,
    shallowEqual
  )
  const [readOnly, setReadOnly] = useState(Boolean(currentVersion))
  const dispatch = useDispatch()
  const deriveArticleStructureAndStats = useCallback(
    throttle(
      ({ text }) => {
        dispatch({ type: 'UPDATE_ARTICLE_STATS', md: text })
        dispatch({ type: 'UPDATE_ARTICLE_STRUCTURE', md: text })
      },
      250,
      { leading: false, trailing: true }
    ),
    []
  )
  const updateWorkingArticleText = useCallback(
    debounce(
      async ({ text }) => {
        dispatch({ type: 'UPDATE_WORKING_ARTICLE_TEXT', articleId, text })
      },
      1000,
      { leading: false, trailing: true }
    ),
    []
  )
  const updateWorkingArticleMetadata = useCallback(
    debounce(
      ({ metadata }) => {
        dispatch({
          type: 'UPDATE_WORKING_ARTICLE_METADATA',
          articleId,
          metadata,
        })
      },
      1000,
      { leading: false, trailing: true }
    ),
    []
  )

  const fullQuery = `query($article:ID!, $hasVersion: Boolean!, $version:ID!) {
    article(article:$article) {
      _id
      title
      zoteroLink
      updatedAt

      owners {
        displayName
      }

      versions {
        _id
        version
        revision
        message
        updatedAt
        owner {
          displayName
        }
      }

      workingVersion @skip (if: $hasVersion) {
        md
        bib
        yaml
      }
    }

    version(version: $version) @include (if: $hasVersion) {
      _id
      md
      bib
      yaml
      message
      revision
      version
      owner{
        displayName
      }
    }
  }`

  const instanceCM = useRef(null)

  const handleUpdateCursorPosition = useCallback(
    (line) => {
      try {
        const editor = instanceCM.current.editor
        editor.focus()
        editor.setCursor(line, 0)
        editor.execCommand('goLineEnd')
      } catch (err) {
        console.error('Unable to update CodeMirror cursor position', err)
      }
    },
    [instanceCM]
  )

  const variables = {
    user: userId,
    article: articleId,
    version: currentVersion || '0123456789ab',
    hasVersion: typeof currentVersion === 'string',
  }

  const [graphqlError, setError] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [live, setLive] = useState({})
  const [articleInfos, setArticleInfos] = useState({
    title: '',
    owners: [],
    zoteroLink: '',
  })

  const codeMirrorOptions = {
    mode: 'markdown',
    lineWrapping: true,
    lineNumbers: false,
    autofocus: true,
    viewportMargin: Infinity,
    spellcheck: true,
    extraKeys: {
      'Shift-Ctrl-Space': function (cm) {
        cm.replaceSelection('\u00a0')
      },
    },
  }

<<<<<<< HEAD
  const handleMDCM = (___, __, text) => {
    deriveArticleStructureAndStats({ text })
    updateWorkingArticleText({ text })
    return setLive({ ...live, md: text })
=======
  const saveVersionQuery = `mutation($user: ID!, $article: ID!, $md: String!, $bib: String!, $yaml: String!, $autosave: Boolean!, $major: Boolean!, $message: String) {
  saveVersion(
    version: {
      article: $article,
      major: $major,
      auto: $autosave,
      md: $md,
      yaml: $yaml,
      bib: $bib,
      message: $message
    },
    user: $user
  ) {
    _id
    version
    revision
    message
    autosave
    updatedAt
    owner {
      displayName
    }
  }
}`

  const handleSaveVersion = useCallback(async (autosave = true, major = false, message = '') => {
    await sendVersion(autosave, major, message)
  }, [live, versions, activeUser, articleId, currentVersion])

  const sendVersion = async (autosave = true, major = false, message = '') => {
    try {
      const response = await askGraphQL(
        {
          query: saveVersionQuery,
          variables: { ...variables, ...live, autosave, major, message },
        },
        'saving new version',
        null,
        applicationConfig
      )
      if (versions[0]._id !== response.saveVersion._id) {
        setVersions([response.saveVersion, ...versions])
      } else {
        //Last version had same _id, we gucchi to update!
        const immutableV = [...versions]
        //shift the first item of the array
        const [_, ...rest] = immutableV
        setVersions([response.saveVersion, ...rest])
      }
      return response
    } catch (err) {
      console.error('Something went wrong while saving a new version', err)
      alert(err)
    }
>>>>>>> ae1bbac (Rewrite the router with `<PrivateRoute>` components)
  }

  const handleYaml = (metadata) => {
    updateWorkingArticleMetadata({ metadata })
    return setLive({ ...live, yaml: metadata })
  }

  // Reload when version switching
  useEffect(() => {
    setIsLoading(true)
    setReadOnly(Boolean(currentVersion))
    ;(async () => {
      const data = await askGraphQL(
        {
          query: fullQuery,
          variables,
        },
        'Fetching article',
        null,
        applicationConfig
      )
        .then(({ version, article }) => ({ version, article }))
        .catch((error) => {
          setError(error)
          return {}
        })

      if (data?.article) {
        const article = data.article
        let currentArticle
        if (currentVersion) {
          currentArticle = {
            bib: data.version.bib,
            md: data.version.md,
            yaml: data.version.yaml,
            version: {
              message: data.version.message,
              major: data.version.version,
              minor: data.version.revision,
            },
          }
        } else {
          currentArticle = article.workingVersion
        }
        setLive(currentArticle)
        setArticleInfos({
          _id: article._id,
          title: article.title,
          zoteroLink: article.zoteroLink,
          owners: article.owners.map((o) => o.displayName),
          updatedAt: article.updatedAt,
        })

        const { md, bib } = currentArticle

        batch(() => {
          dispatch({ type: 'SET_ARTICLE_VERSIONS', versions: article.versions })
          dispatch({ type: 'UPDATE_ARTICLE_STATS', md })
          dispatch({ type: 'UPDATE_ARTICLE_STRUCTURE', md })
          dispatch({ type: 'UPDATE_ARTICLE_BIB', bib })
          dispatch({
            type: 'SET_WORKING_ARTICLE_UPDATED_AT',
            updatedAt: article.updatedAt,
          })
        })
      }

      setIsLoading(false)
    })()
  }, [currentVersion])

  if (graphqlError) {
    return (
      <section className={styles.container}>
        <article className={styles.error}>
          <h2>Error</h2>
          <p>{graphqlError[0]?.message || 'Article not found.'}</p>
        </article>
      </section>
    )
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <section className={styles.container}>
      <WriteLeft
        article={articleInfos}
        compareTo={compareTo}
        selectedVersion={currentVersion}
        readOnly={readOnly}
        onTableOfContentClick={handleUpdateCursorPosition}
      />
      <WriteRight
        yaml={live.yaml}
        handleYaml={handleYaml}
        readOnly={readOnly}
      />
      {compareTo && (
        <CompareSelect
          articleId={articleInfos._id}
          selectedVersion={currentVersion}
          compareTo={compareTo}
          currentArticleVersion={live.version}
          readOnly={readOnly}
        />
      )}

      <article className={styles.article}>
        <>
          {readOnly && <pre>{live.md}</pre>}
          {!readOnly && (
            <CodeMirror
              value={live.md}
              cursor={{ line: 0, character: 0 }}
              editorDidMount={() => {
                window.scrollTo(0, 0)
                //editor.scrollIntoView({ line: 0, ch: 0 })
              }}
              onBeforeChange={handleMDCM}
              options={codeMirrorOptions}
              ref={instanceCM}
            />
          )}
          {compareTo && <Compare compareTo={compareTo} md={live.md} />}
        </>
      </article>
    </section>
  )
}

Write.propTypes = {
  version: PropTypes.string,
  id: PropTypes.string,
  compareTo: PropTypes.string
}

export default Write
