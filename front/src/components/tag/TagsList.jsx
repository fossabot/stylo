import React, { createRef, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import styles from '../articles.module.scss'
import ArticleTag from '../Tag.jsx'
import Button from '../Button.jsx'
import Modal from '../Modal.jsx'
import CreateTag from '../CreateTag.jsx'

export default function TagsList ({ tags, selectedTagIds }) {
  const [creatingTag, setCreatingTag] = useState(false)
  const handleCloseCreatingTag = useCallback(() => setCreatingTag(false), [])
  const latestTagCreated = useSelector(state => state.latestTagCreated)

  useEffect(() => {
    setCreatingTag(false)
  }, [latestTagCreated])

  const tagNameField = createRef()
  useEffect(() => {
    if (tagNameField.current) {
      tagNameField.current.focus() // give focus to the first form input
    }
  }, [tagNameField])

  const handleTagSelected = (event) => {
    const { id } = event.target.dataset
    if (selectedTagIds.value.includes(id)) {
      selectedTagIds.value = selectedTagIds.value.filter((tagId) => tagId !== id)
    } else {
      selectedTagIds.value = [...selectedTagIds.value, id]
    }
  }

  return (<>
    <ul className={styles.filterByTags}>
      {tags.value.map((t) => (
        <li key={`filterTag-${t._id}`}>
          <ArticleTag
            tag={t}
            name={`filterTag-${t._id}`}
            onClick={handleTagSelected}
            disableAction={false}
          />
        </li>
      ))}
      <li>
        <Button className={styles.createTagButton} onClick={() => setCreatingTag(true)}>add more tags&hellip;</Button>
      </li>
    </ul>
    {creatingTag && (
      <Modal title="New tag" cancel={handleCloseCreatingTag}>
        <CreateTag tags={tags} ref={tagNameField}/>
      </Modal>
    )}
  </>)
}
