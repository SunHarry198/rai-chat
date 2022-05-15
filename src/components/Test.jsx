import React, { useState } from 'react'

export default function Test() {
  const [img, setImg] = useState()

  const onImageChange = e => {
    const [file] = e.target.files
    setImg(URL.createObjectURL(file))
  }

  return (
    <div>
      <input type="file" onChange={onImageChange} />
      <img src={img} alt="" />
    </div>
  )
}
