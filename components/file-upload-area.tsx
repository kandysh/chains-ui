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
        'relative rounded border-2 transition-all duration-200 p-8 cursor-pointer',
        isDragging
          ? 'border-primary bg-primary/8 shadow-md'
          : 'border-border/50 bg-card/50 hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm'
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

      <div className="flex flex-col items-center justify-center space-y-4" onClick={() => inputRef.current?.click()}>
        <div className={cn(
          'w-12 h-12 rounded flex items-center justify-center transition-colors duration-200',
          isDragging
            ? 'bg-primary text-primary-foreground'
            : 'bg-primary/10 text-primary'
        )}>
          <Upload className="w-6 h-6" />
        </div>

        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">
            {label || (multiple ? 'Drop files here' : 'Drop file here')}
          </p>
          <p className="text-xs text-muted-foreground mt-1.5">
            {description || 'or click to select'}
          </p>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-6 space-y-3 pt-6 border-t border-border/40">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Selected Files</div>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded p-3 bg-muted/30 hover:bg-muted/60 transition-colors group">
                <span className="text-sm text-foreground truncate font-medium">{file.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                  className="p-1 opacity-60 group-hover:opacity-100 transition-opacity hover:bg-white/20 rounded"
                >
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
