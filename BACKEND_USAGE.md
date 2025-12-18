# Backend Usage Analysis

## ✅ Backend IS Needed For:

1. **Excel File Parsing** - Backend uses `pandas` library to parse Excel files (.xlsx, .xls)
   - Frontend cannot parse Excel files directly (requires backend)
   - Backend converts Excel to JSON (`json_content`)

2. **File Storage** - Backend stores uploaded files in database
   - File metadata (filename, picture, active status)
   - JSON content from Excel

3. **File Retrieval** - Backend provides API to get list of files
   - `getSpinFiles()` - Get active files for dropdown
   - `getAdminSpinFiles()` - Get all files with json_content for admin

4. **Password Protection** - Admin panel password checking
   - `checkPassword()` - Validates admin password

5. **Fixed Winner (Optional)** - Can set fixed winners in backend
   - `setFixedWinner()` - Sets fixed winner for a file (optional, also stored in localStorage)

## ❌ Backend NOT Needed For:

1. **Wheel Data** - All stored in `localStorage`:
   - `names` - Wheel entries
   - `spinModes` - Random/Fixed per spin
   - `selectedWinners` - Fixed winners selection
   - `spinCount` - Current spin number
   - `winnersList` - All past winners
   - `removedEntries` - Removed entries
   - `centerImage` - Center image (Base64)

2. **Wheel Functionality** - All frontend:
   - Spinning logic
   - Winner selection
   - UI state

## 📊 Data Flow:

```
Excel File Upload → Backend (parses Excel) → Returns json_content → Frontend (stores in localStorage)
```

**After upload, all data is in localStorage. Backend is only needed for:**
- Initial Excel parsing
- File management (list, delete)

## 🔄 Can We Remove Backend?

**NO** - Because:
- Excel parsing requires `pandas` library (Python backend)
- Browser cannot parse Excel files directly
- Need backend for file upload/management

**Alternative:** Use client-side Excel parser (like `xlsx` npm package), but requires:
- Large bundle size (~500KB)
- May have performance issues with large files
- More complex implementation

## 💾 Current Storage:

- **Backend:** Excel files, file metadata
- **localStorage:** All wheel data, settings, winners

## 🎯 Recommendation:

**Keep backend** - It's lightweight and only used for:
1. Excel file upload/parsing
2. File management

All wheel functionality works with localStorage.

