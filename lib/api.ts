// API utility functions for client-side calls

const API_BASE = '/api'

export const api = {
  // Files
  async getFiles() {
    const res = await fetch(`${API_BASE}/files`)
    if (!res.ok) throw new Error('Failed to fetch files')
    const data = await res.json()
    return data.files
  },

  async getFile(id: string) {
    const res = await fetch(`${API_BASE}/files/${id}`)
    if (!res.ok) throw new Error('Failed to fetch file')
    return await res.json()
  },

  async uploadFile(fileData: {
    id?: string
    filename: string
    json_content: any[]
    picture?: string | null
    active?: boolean
    ticket_number?: string
  }) {
    const res = await fetch(`${API_BASE}/files`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fileData),
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || 'Failed to upload file')
    }
    return await res.json()
  },

  async deleteFile(id: string) {
    const res = await fetch(`${API_BASE}/files/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete file')
    return await res.json()
  },

  async toggleFileActive(id: string, active: boolean) {
    const res = await fetch(`${API_BASE}/files/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active }),
    })
    if (!res.ok) throw new Error('Failed to update file')
    return await res.json()
  },

  // Entries
  async getEntries(fileId?: string, search?: string) {
    const params = new URLSearchParams()
    if (fileId) params.append('fileId', fileId)
    if (search) params.append('search', search)
    
    const res = await fetch(`${API_BASE}/entries?${params.toString()}`)
    if (!res.ok) throw new Error('Failed to fetch entries')
    const data = await res.json()
    return data.entries
  },

  // Winners
  async getWinners() {
    const res = await fetch(`${API_BASE}/winners`)
    if (!res.ok) throw new Error('Failed to fetch winners')
    const data = await res.json()
    return data.winners
  },

  async addWinner(winner: {
    entry_id?: string
    name: string
    ticket_number?: string
    spin_number: number
    color?: string
  }) {
    const res = await fetch(`${API_BASE}/winners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(winner),
    })
    if (!res.ok) throw new Error('Failed to add winner')
    return await res.json()
  },

  async removeWinner(name: string, ticket_number: string) {
    const res = await fetch(`${API_BASE}/winners`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, ticket_number }),
    })
    if (!res.ok) throw new Error('Failed to remove winner')
    return await res.json()
  },

  // Settings
  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`)
    if (!res.ok) throw new Error('Failed to fetch settings')
    const data = await res.json()
    return data.settings
  },

  async updateSetting(key: string, value: any) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    })
    if (!res.ok) throw new Error('Failed to update setting')
    return await res.json()
  },

  // Admin
  async checkPassword(password: string) {
    const res = await fetch(`${API_BASE}/admin/password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (!res.ok) throw new Error('Failed to check password')
    const data = await res.json()
    return data.valid
  },

  async updatePassword(oldPassword: string, newPassword: string) {
    const res = await fetch(`${API_BASE}/admin/password`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPassword, newPassword }),
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || 'Failed to update password')
    }
    return await res.json()
  },

  // Selected Winners (for fixed spins)
  async getSelectedWinners() {
    const res = await fetch(`${API_BASE}/selected-winners`)
    if (!res.ok) throw new Error('Failed to fetch selected winners')
    const data = await res.json()
    return data.selectedWinners
  },

  async setSelectedWinner(winner: {
    spin_number: number
    entry_id?: string
    name: string
    ticket_number?: string
  }) {
    const res = await fetch(`${API_BASE}/selected-winners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(winner),
    })
    if (!res.ok) throw new Error('Failed to set selected winner')
    return await res.json()
  },

  async removeSelectedWinner(spin_number: number) {
    const res = await fetch(`${API_BASE}/selected-winners`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spin_number }),
    })
    if (!res.ok) throw new Error('Failed to remove selected winner')
    return await res.json()
  },
}

