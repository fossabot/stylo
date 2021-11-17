import React, { useState } from 'react'
import { connect } from 'react-redux'

import menuStyles from './menu.module.scss'
import styles from './workingVersion.module.scss'
import Field from "../Field";
import Button from "../Button";
import { Edit, Edit2, Edit3, Save } from "react-feather";
import { Link } from "react-router-dom";
import buttonStyles from "../button.module.scss";
import Modal from "../Modal";
import Export from "../Export";
import formatTimeAgo from "../../helpers/formatTimeAgo";
import { generateArticleExportId } from "../../helpers/identifier"


const mapStateToProps = ({ applicationConfig }) => {
  return { applicationConfig }
}

const WorkingVersion = ({ articleTitle, articleOwners, articleId, articleVersionId, articleLastSavedAt, readOnly, sendVersion }) => {
  const [exporting, setExporting] = useState(false)
  const [message, setMessage] = useState('')
  const [expandSaveForm, setExpandSaveForm] = useState(false)
  const [savedAgo, setSavedAgo] = useState(
    formatTimeAgo(new Date(articleLastSavedAt))
  )

  const saveVersion = async (e, major = false) => {
    e.preventDefault()
    await sendVersion(false, major, message)
    setMessage('')
    setExpandSaveForm(false)
  }

  return (
    <section className={styles.section}>
      <header>
        <h1 className={styles.title}>{articleTitle}</h1>
        <div className={styles.meta}>
          <div className={styles.by}>by</div>
          <div className={styles.byLine}>
            <span className={styles.owners}>{articleOwners.join(', ')}</span>
            <span className={styles.lastSaved}>Last saved: <time>{savedAgo}</time></span>
          </div>
        </div>
      </header>
      {exporting && (
        <Modal cancel={() => setExporting(false)}>
          <Export
            exportId={generateArticleExportId(articleTitle)}
            articleVersionId={articleVersionId}/>
        </Modal>
      )}
      <ul className={styles.actions}>
        {readOnly && <li key={`edit-working-version`}>
          <Link className={[buttonStyles.button, buttonStyles.primary].join(' ')} to={`/article/${articleId}`}><Edit/> Edit</Link>
        </li>}
        {!readOnly && (
          <li>
            <Button primary={true} onClick={_ => setExpandSaveForm(true)}><Save/> Save</Button>
          </li>
        )}

        <li>
          <Link
            to={`/article/${articleId}/preview`}
            target="_blank"
            rel="noopener noreferrer"
            className={[buttonStyles.button, buttonStyles.secondary].join(' ')}
          >
            Preview
          </Link>
        </li>
        <li>
          <Button onClick={() => setExporting(true)}>Export</Button>
        </li>
      </ul>
      {expandSaveForm && (
        <form
          className={styles.saveForm}
          onSubmit={(e) => saveVersion(e, false)}
        >
          <Field
            className={styles.saveVersionInput}
            placeholder="Label of the version"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <ul className={styles.actions}>
            <li><Button icon={true} onClick={(e) => saveVersion(e, false)}>Close</Button></li>
            <li><Button onClick={(e) => saveVersion(e, false)}>Save Minor</Button></li>
            <li><Button onClick={(e) => saveVersion(e, true)}>Save Major</Button></li>
          </ul>
        </form>
      )}
    </section>
  )
}

export default connect(mapStateToProps)(WorkingVersion)