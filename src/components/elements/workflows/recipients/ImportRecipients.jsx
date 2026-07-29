import React, { useState } from 'react'
import FileUpload from '../../form/FileUpload'

const ImportRecipients = ({ onBeginImport }) => {
  const [uploadedFile, setUploadedFile] = useState(null)

  return (
    <div className="space-y-4">
      <FileUpload
        fieldLabel="Upload CSV file"
        acceptedFormats={['csv']}
        maxFileSize={10}
        returnFileDetails={({ file }) => setUploadedFile(file)}
      />

      {uploadedFile && (
        <div className="rounded-lg bg-stone-50 px-4 py-3 text-sm text-stone-700 dark:bg-stone-900/20 dark:text-stone-300">
          Selected file: <span className="font-semibold">{uploadedFile.name}</span>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onBeginImport(uploadedFile)}
          className="rounded-lg bg-emerald px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald/90"
        >
          Begin import
        </button>
      </div>
    </div>
  )
}

export default ImportRecipients