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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        'relative rounded-md border transition-all duration-200 p-6 cursor-pointer',
        isDragging
          ? 'border-primary/50 bg-primary/5'
          : 'border-border bg-card hover:border-border/80'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex flex-col items-center justify-center space-y-3" onClick={() => inputRef.current?.click()}>
        <Upload className={cn(
          'w-5 h-5 transition-colors',
          isDragging ? 'text-primary' : 'text-muted-foreground'
        )} />

        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            {label || (multiple ? 'Drop files here' : 'Drop file here')}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {description || 'or click to select'}
          </p>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2 pt-4 border-t border-border">
          <div className="space-y-1">
            {selectedFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded p-2 hover:bg-muted/50 transition-colors group">
                <span className="text-xs text-foreground truncate">{file.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                  className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
