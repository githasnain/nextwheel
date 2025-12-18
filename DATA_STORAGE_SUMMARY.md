# Data Storage Summary

## 📊 Data Storage Analysis

### ✅ Backend Storage (Wheel_BE):
- **Excel Files** - Uploaded files stored in database
- **File Metadata** - filename, picture, active status
- **JSON Content** - Parsed Excel data (`json_content` field)
- **Password** - Admin password verification

### ✅ LocalStorage Storage (Frontend):
- **`names`** - All entries on wheel
- **`namesText`** - Textarea content
- **`spinModes`** - Per-spin mode (random/fixed) `{1: 'random', 2: 'fixed'}`
- **`selectedWinners`** - Fixed winners selection `[{spin: 1, winnerId: '...'}]`
- **`spinCount`** - Current spin number
- **`winnersList`** - All past winners with details
- **`removedEntries`** - Removed entries list
- **`centerImage`** - Center image (Base64)
- **`centerImageSize`** - Image size setting

## 🔄 Data Flow:

```
1. Upload Excel → Backend (parses) → Returns json_content → Frontend stores in localStorage
2. Select File → Backend returns json_content → Frontend processes → Updates localStorage
3. Spin Wheel → Uses localStorage data (names, spinModes, selectedWinners)
4. Winner Selected → Saved to localStorage (winnersList)
5. Remove Winner → Removed from localStorage (names, winnersList, removedEntries)
```

## ⚠️ Important:

**Backend IS Required** because:
- Excel parsing needs `pandas` library (Python backend)
- Browser cannot parse Excel files directly
- Backend handles file upload/management

**But all wheel functionality uses localStorage:**
- No backend calls during spinning
- All settings persist in browser
- Works offline after initial file load

## 🗑️ Can Remove Backend?

**NO** - Backend is needed for:
1. Excel file upload and parsing
2. File management (list, delete)
3. Password protection

**Alternative:** Use client-side Excel parser (`xlsx` npm package), but:
- Adds ~500KB to bundle size
- May have performance issues with large files
- More complex implementation

## 📝 Recommendation:

**Keep backend** - It's lightweight and only used for file management.
All wheel data is stored in localStorage for fast access.

