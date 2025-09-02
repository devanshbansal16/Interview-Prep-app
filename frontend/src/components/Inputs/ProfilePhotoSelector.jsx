import React, { useRef, useState } from 'react'
import {LuUser, LuUpload, LuTrash} from 'react-icons/lu'

const ProfilePhotoSelector =({
  image,setImage, preview,setPreview
})=>{
   const inputRef = useRef(null);
   const [previewUrl, setPreviewUrl] = useState(null);

   const handleImageChange =(event)=>{
    const file= event.target.files[0];
      if(file)
      {
        //Update the image state 
        setImage(file);
        //Update the preview state
        const previewUrl = URL.createObjectURL(file);
        if(setPreview){
          setPreview(previewUrl)
        }
        setPreviewUrl(previewUrl);
      }
   };
   const handleRemoveImage =()=>{
    //Update the image state 
    setImage(null);
    //Update the preview state
    setPreviewUrl(null);

    if(setPreview)
    {
      setPreview(null);
    }
   };
    const onChooseFile  =()=>{
      inputRef.current.click();
    };
  return <div className='mb-4'>
    <input type="file" accept="image/*" ref={inputRef} onChange={handleImageChange} className='hidden' />
    {!image ?(
      <div className='flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors'>
        <LuUser className='w-12 h-12 text-gray-400 mb-3'/>
        <button type="button" className='flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors' onClick={onChooseFile}>
          <LuUpload className='w-4 h-4'/>
          <span>Upload Photo</span>
        </button>
      </div>
    ):(
      <div className="relative inline-block">
        <img src={preview || previewUrl} alt="profile photo" className="w-20 h-20 rounded-full object-cover border-2 border-gray-200" />
        <button type='button' className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors" onClick={handleRemoveImage}>
          <LuTrash className='w-3 h-3'/>
        </button>
      </div>
    )}
  </div>
}
export default ProfilePhotoSelector