import Swal from 'sweetalert2'

// Success Alert
export const showSuccess = (message, title = 'Success!') => {
  return Swal.fire({
    icon: 'success',
    title: title,
    text: message,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  })
}

// Error Alert
export const showError = (message, title = 'Error!') => {
  return Swal.fire({
    icon: 'error',
    title: title,
    text: message,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
  })
}

// Warning Alert
export const showWarning = (message, title = 'Warning!') => {
  return Swal.fire({
    icon: 'warning',
    title: title,
    text: message,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  })
}

// Info Alert
export const showInfo = (message, title = 'Info') => {
  return Swal.fire({
    icon: 'info',
    title: title,
    text: message,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  })
}

// Coming Soon Alert
export const showComingSoon = (feature = 'This feature') => {
  return Swal.fire({
    icon: 'info',
    title: 'Coming Soon!',
    text: `${feature} is under development and will be available soon.`,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  })
}

// Confirmation Dialog
export const showConfirm = (message, title = 'Are you sure?') => {
  return Swal.fire({
    title: title,
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel'
  })
}

// Delete Confirmation
export const showDeleteConfirm = (itemName = 'this item') => {
  return Swal.fire({
    title: 'Are you sure?',
    text: `Do you want to delete ${itemName}? This action cannot be undone.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  })
}

// Loading Alert
export const showLoading = (message = 'Processing...') => {
  // Use a non-blocking toast for loading so it doesn't block the UI
  return Swal.fire({
    title: message,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading()
    }
  })
}

// Close Loading
export const closeLoading = () => {
  Swal.close()
}
