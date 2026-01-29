'use client'

import React from "react"

import { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface FileUploadAreaProps {
  onFilesSelected: (files: File[]) => void
  multiple?: boolean
  accept?: string
  label?: string
  description?: string
}

export function FileUploadArea({
  onFilesSelected,
  multiple = false,
  accept = '.pdf,.xlsx,.csv',
  label,
  description,
}: FileUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    const newFiles = multiple ? files : [files[0]]
    setSelectedFiles(newFiles)
    onFilesSelected(newFiles)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const removeFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(updated)
    onFilesSelected(updated)
  }

  const openFileDialog = () => {
    inputRef.current?.click()
  }

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          'relative rounded-lg border-2 border-dashed transition-all duration-200 p-8',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/30'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-4">
          <div
            className={cn(
              'rounded-full p-4 transition-colors',
              isDragging ? 'bg-primary/20' : 'bg-muted'
            )}
          >
            <Upload
              className={cn(
                'w-6 h-6 transition-colors',
                isDragging ? 'text-primary' : 'text-muted-foreground'
              )}
            />
          </div>

          <div className="text-center">
            <h3 className="font-semibold text-foreground mb-1">
              {label || (multiple ? 'Upload multiple files' : 'Upload a file')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {description || `Drag and drop or click to select ${multiple ? 'files' : 'a file'}`}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Accepted formats: {accept}
            </p>
          </div>

          <Button onClick={openFileDialog} variant="outline" size="sm">
            Choose {multiple ? 'Files' : 'File'}
          </Button>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-foreground">
            Selected {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}:
          </p>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between bg-muted p-3 rounded-md"
              >
                <span className="text-sm text-foreground truncate">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="ml-2 p-1 hover:bg-background rounded transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
