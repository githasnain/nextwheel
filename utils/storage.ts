/**
 * Storage utilities - Now using API instead of localStorage
 * This provides a drop-in replacement for the old localStorage functions
 */

import { api } from '@/lib/api'

// Legacy compatibility - redirect to API
export const getStoredFiles = async () => {
  try {
    return await api.getFiles()
  } catch (error) {
    console.error('Failed to get files:', error)
    return []
  }
}

export const saveFile = async (fileData: any) => {
  try {
    const result = await api.uploadFile(fileData)
    return result.file || fileData
  } catch (error) {
    console.error('Failed to save file:', error)
    throw error
  }
}

export const deleteFile = async (fileId: string) => {
  try {
    await api.deleteFile(fileId)
    return true
  } catch (error) {
    console.error('Failed to delete file:', error)
    return false
  }
}

export const getFileById = async (fileId: string) => {
  try {
    return await api.getFile(fileId)
  } catch (error) {
    console.error('Failed to get file:', error)
    return null
  }
}

export const getActiveFiles = async () => {
  try {
    const files = await api.getFiles()
    return files.filter((f: any) => f.active !== false)
  } catch (error) {
    console.error('Failed to get active files:', error)
    return []
  }
}

export const toggleFileActive = async (fileId: string, active: boolean) => {
  try {
    await api.toggleFileActive(fileId, active)
    return true
  } catch (error) {
    console.error('Failed to toggle file active:', error)
    return false
  }
}

// Password functions - now use API
export const checkPassword = async (password: string) => {
  try {
    return await api.checkPassword(password)
  } catch (error) {
    console.error('Failed to check password:', error)
    return false
  }
}

export const setPassword = async (password: string) => {
  try {
    // For setting password, we need old password - this should be handled in AdminPanel
    // This is kept for compatibility but should use updatePassword with old password
    console.warn('setPassword called without old password - use updatePassword instead')
    return false
  } catch (error) {
    console.error('Failed to set password:', error)
    return false
  }
}

