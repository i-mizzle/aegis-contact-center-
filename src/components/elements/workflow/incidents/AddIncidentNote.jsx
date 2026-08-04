import React, { useState } from 'react'
import TextareaField from '../../form/TextareaField';
import FormButton from '../../form/FormButton';
import FileUpload from '../../form/FileUpload';

const AddIncidentNote = ({doAddNote, close}) => {
        const [note, setNote] = useState('')
        const [attachment, setAttachment] = useState(null)
  return (
    <div>
        <p className="text-sm mb-4">Add a note on this incident below.</p>

        <TextareaField 
            inputLabel="Incident Note" 
            fieldId="incident-note" 
            returnFieldValue={(e)=>{setNote(e.target.value)}} 
            preloadValue="" 
            inputPlaceholder="Add a resolution note to resolve this incident"
            requiredField
        />

                <div className="mt-4">
                    <FileUpload
                        fieldLabel="Attachment"
                        returnFileDetails={(fileDetails)=>{setAttachment(fileDetails)}}
                        acceptedFormats={['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'mp3', 'wav', 'mp4', 'mov']}
                        maxFileSize={15}
                    />
                </div>

        <div className="w-full mt-8 flex items-center gap-x-4">
            <div className="w-max">
                <button 
                className='p-4 cursor-pointer bg-transparent rounded-lg text-sm text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-900 transition duration-200' onClick={()=>{close()}}
                >
                Cancel
                </button>
            </div>
            <FormButton buttonLabel={`Add Incident Note`} buttonAction={()=>{
                                doAddNote({
                                    text: note,
                                    attachment,
                                })
                close()
            }} />
        </div>
    </div>
  )
}

export default AddIncidentNote