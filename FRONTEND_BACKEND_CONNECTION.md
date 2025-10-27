# 🔗 Frontend-Backend Connection Guide

## ✅ What Was Updated

I've successfully connected your frontend with the backend API! Here's what changed:

### 📝 Files Modified:

1. **`src/lib/api.js`** - Added 9 new API functions for scraped data
2. **`src/Component/ScrapedData.jsx`** - Replaced dummy data with real API calls
3. **`src/Component/Filters.jsx`** - Dynamic suppliers from API
4. **`src/Component/Stats.jsx`** - Real statistics from API
5. **`src/Component/TableActions.jsx`** - Functional export & delete buttons
6. **`src/Component/InvoicesTable.jsx`** - Added checkbox selection functionality

---

## 🚀 How to Test

### Step 1: Make Sure Backend is Running

```bash
# In Backend folder
cd Backend
npm start
```

Backend should be running on: `http://localhost:8080` or `http://localhost:5000`

### Step 2: Configure Frontend Environment

Create or update `.env` file in your frontend root:

```bash
# Mail-Invoice/.env
VITE_API_BASE_URL=http://localhost:8080
```

**Note:** Replace `8080` with your actual backend port if different.

### Step 3: Start Frontend

```bash
# In Mail-Invoice folder
cd Mail-Invoice
npm run dev
```

### Step 4: Test in Browser

1. Open `http://localhost:5173` (or your Vite dev server URL)
2. Navigate to the Scraped Data page
3. You should see:
   - ✅ Loading spinner while fetching data
   - ✅ Real invoices from your database
   - ✅ Real statistics
   - ✅ Dynamic supplier list in filters
   - ✅ Working export button
   - ✅ Working delete button (with selection)

---

## 🎯 New Features Available

### 1. **Real-Time Data Loading**
- Data fetches from your backend automatically
- Loading states while fetching
- Error handling with user-friendly messages

### 2. **Dynamic Filtering**
- Filter by supplier (populated from your database)
- Filter by status (Parsed, Error, Pending)
- Filters trigger automatic data refresh

### 3. **Statistics Dashboard**
- Total invoices count
- Parsed, Error, Pending counts
- Success rate calculation
- Real-time updates

### 4. **Row Selection**
- Checkbox for each row
- Select all functionality
- Visual feedback for selected rows

### 5. **Export to CSV**
- Click "Export" button
- Downloads CSV file with filtered data
- Respects current filters

### 6. **Delete Functionality**
- Select invoices with checkboxes
- Click "Delete" button
- Confirms before deleting
- Refreshes data after deletion

### 7. **Pagination**
- Shows 50 invoices per page
- Previous/Next buttons
- Shows current page info

---

## 🔧 API Functions Available

All these are now in `src/lib/api.js`:

```javascript
// Get filtered invoices
getScrapedInvoices({ supplier, status, format, limit, offset })

// Get statistics
getScrapedStats({ startDate, endDate })

// Get suppliers list
getSuppliersList()

// Get single invoice
getScrapedInvoiceById(id)

// Update invoice status
updateInvoiceStatus(id, status)

// Delete invoices
deleteScrapedInvoices([id1, id2, ...])

// Export to CSV
exportScrapedInvoicesCSV({ supplier, status, format })

// Bulk update
bulkUpdateScrapedInvoices(ids, updates)
```

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch data"

**Check:**
1. Backend is running: `curl http://localhost:8080/healthz`
2. CORS is configured in backend
3. `.env` file has correct `VITE_API_BASE_URL`

**Fix:**
```bash
# Restart both servers
cd Backend && npm start
cd Mail-Invoice && npm run dev
```

---

### Issue: "No invoices found"

**Check:**
1. Database has invoices
2. Run SQL migration (if not done yet)
3. Check browser console for errors

**Fix:**
```bash
# Test backend directly
curl http://localhost:8080/api/scraped-data

# Should return JSON with data
```

---

### Issue: Export button not working

**Check:**
1. Browser console for errors
2. Backend endpoint returns CSV

**Test:**
```bash
curl http://localhost:8080/api/scraped-data/export/csv
```

---

### Issue: Filters not showing suppliers

**Check:**
1. Backend `/api/scraped-data/suppliers` endpoint
2. Database has vendor data

**Fix:**
```bash
# Test endpoint
curl http://localhost:8080/api/scraped-data/suppliers

# Should return: {"success": true, "suppliers": ["Company1", "Company2"]}
```

---

## 📊 Data Flow

```
User Action → Frontend Component → API Function → Backend Endpoint → Database
     ↓
Database Response → Backend Processing → API Response → Frontend Update → UI Refresh
```

### Example: Loading Invoices

1. User opens Scraped Data page
2. `ScrapedData.jsx` calls `getScrapedInvoices()`
3. `api.js` makes request to `/api/scraped-data`
4. Backend controller queries database
5. Backend returns formatted data
6. Frontend updates state
7. InvoicesTable renders with data

---

## 🎨 UI States

### Loading State
```jsx
{loading && (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    <span className="ml-3 text-gray-600">Loading invoices...</span>
  </div>
)}
```

### Error State
```jsx
{error && (
  <div className="mx-6 my-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
    <strong>Error:</strong> {error}
  </div>
)}
```

### Empty State
```jsx
{data.length === 0 && (
  <div className="text-center py-12 text-gray-500">
    <p className="text-lg">No invoices found.</p>
    <p className="text-sm mt-2">Try adjusting your filters.</p>
  </div>
)}
```

---

## 🔐 Environment Variables

### Frontend (.env)
```bash
# Required
VITE_API_BASE_URL=http://localhost:8080

# Optional (if using different ports)
# VITE_API_BASE_URL=http://localhost:5000
```

### Backend (.env)
Already configured - no changes needed!

---

## 📝 Testing Checklist

Before deploying, test these:

- [ ] Page loads without errors
- [ ] Invoices display from database
- [ ] Statistics show correct numbers
- [ ] Filters work (supplier, status)
- [ ] Suppliers dropdown is populated
- [ ] Checkbox selection works
- [ ] "Select All" works
- [ ] Export button downloads CSV
- [ ] Delete button removes selected invoices
- [ ] Pagination works (if > 50 invoices)
- [ ] Loading states appear
- [ ] Error messages display if backend is down
- [ ] Empty state shows when no data

---

## 🚢 Deployment Notes

### Before Deploying:

1. **Update Environment Variables**
   ```bash
   # Production frontend .env
   VITE_API_BASE_URL=https://your-backend-domain.com
   ```

2. **Verify CORS Settings**
   Backend `app.js` should allow your production domain:
   ```javascript
   const allowedOrigins = [
     'https://your-frontend-domain.com',
     'http://localhost:5173' // Keep for development
   ];
   ```

3. **Test with Production Database**
   - Ensure migration is run
   - Verify data exists
   - Test all endpoints

---

## 🎉 Success Indicators

You'll know it's working when:

✅ No console errors in browser  
✅ Loading spinner appears briefly  
✅ Real data from database displays  
✅ Statistics show actual numbers  
✅ Export downloads a real CSV file  
✅ Delete actually removes records  
✅ Filters update the displayed data  

---

## 📞 Next Steps

1. ✅ Test the connection
2. ✅ Verify all features work
3. ✅ Test error scenarios
4. ✅ Test with different filters
5. ✅ Test pagination (if you have > 50 invoices)
6. ✅ Test CSV export
7. ✅ Test delete functionality

---

## 💡 Pro Tips

1. **Open Browser DevTools** - Network tab shows all API requests
2. **Check Console** - Any errors will appear here
3. **Test Backend First** - Use curl or Postman to verify endpoints
4. **Reload Page** - After making changes, hard reload (Ctrl+Shift+R)
5. **Clear Cache** - If seeing old data, clear browser cache

---

**Everything is connected! Your frontend now talks to your backend! 🎊**

Need help? Check the browser console and network tab first!
