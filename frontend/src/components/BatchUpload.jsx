import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { parseCSV, CSV_TEMPLATE } from '@utils/batchRegister'

export default function BatchUpload({ onProductsParsed }) {
  const [fileName, setFileName] = useState(null)
  const [parseErrors, setParseErrors] = useState([])
  const fileInputRef = useRef(null)

  const handleFile = (file) => {
    if (!file) return
    if (!file.name.endsWith('.csv')) {
      setParseErrors([{ row: 0, errors: ['Only CSV files are supported'] }])
      return
    }

    setFileName(file.name)
    setParseErrors([])

    const reader = new FileReader()
    reader.onload = (e) => {
      const { products, errors } = parseCSV(e.target.result)
      setParseErrors(errors)
      onProductsParsed(products, errors)
    }
    reader.readAsText(file)
  }

  const handleInputChange = (e) => handleFile(e.target.files[0])

  const handleDrop = (e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  const handleDragOver = (e) => e.preventDefault()

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'aura-batch-template.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-fog/30 hover:border-signal/50 transition-colors rounded-lg p-10 text-center cursor-pointer"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleInputChange}
          className="hidden"
        />
        <div className="text-4xl mb-3">📂</div>
        {fileName ? (
          <p className="text-white font-medium">{fileName}</p>
        ) : (
          <>
            <p className="text-fog mb-1">Drop a CSV file here or click to browse</p>
            <p className="text-fog/50 text-sm">Only .csv files accepted</p>
          </>
        )}
      </div>

      {/* Validation errors */}
      {parseErrors.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-caution/10 border border-caution/30 rounded-lg p-4"
        >
          <p className="text-caution font-semibold mb-2">
            {parseErrors.length} row{parseErrors.length > 1 ? 's' : ''} with errors
          </p>
          <ul className="text-fog text-sm space-y-1 max-h-40 overflow-y-auto">
            {parseErrors.map((e, i) => (
              <li key={i}>
                <span className="text-caution/80">Row {e.row}:</span> {e.errors.join(', ')}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Template download */}
      <button
        type="button"
        onClick={downloadTemplate}
        className="text-signal text-sm underline underline-offset-2 hover:text-signal/80 transition-colors"
      >
        Download CSV template
      </button>
    </div>
  )
}
