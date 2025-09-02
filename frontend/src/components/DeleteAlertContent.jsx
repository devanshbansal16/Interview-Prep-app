import React from 'react'
const DeleteAlertContent = (content, onDelete) => {
  return (
    <div className=''>
      <p className=''>{content}</p>
      <div className='flex justify-end'>
        <button type="button"
        className='btn-small'onClick={onDelete}>Delete</button>
      </div>
    </div>
  )
}

export default DeleteAlertContent