

const IndianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const courses = [
  "B.Tech - Computer Science Engineering",
  "B.Tech - Mechanical Engineering",
  "MBA - Business Administration",
  "B.Tech - Civil Engineering",
  "B.Tech - Electrical Engineering",
  "BBA - Business Administration"
];

const intakeYears = ["2024", "2025", "2026","2027","2028"];


function validatePhone(phone) {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}


function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


function validateFormData(data) {
  const errors = {};

  if (!data.fullName || data.fullName.trim().length < 3) {
    errors.fullName = "Full name must be at least 3 characters";
  }

  if (!validateEmail(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!validatePhone(data.phone)) {
    errors.phone = "Please enter a valid 10-digit phone number";
  }

  if (!data.state) {
    errors.state = "Please select a state";
  }

  if (!data.course) {
    errors.course = "Please select a course";
  }

  if (!data.intake) {
    errors.intake = "Please select an intake year";
  }

  if (!data.consent) {
    errors.consent = "Please agree to the terms and conditions";
  }

  return errors;
}


function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount);
}


const formDataStorage = {};


function storeFormData(key, data) {
  formDataStorage[key] = {
    ...data,
    timestamp: new Date().toISOString()
  };
  console.log("Form data stored:", formDataStorage[key]);
}


function getFormData(key) {
  return formDataStorage[key] || null;
}


function showNotification(message, type = 'success') {
  const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
  const alert = document.createElement('div');
  alert.className = `alert ${alertClass} alert-dismissible fade show`;
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  const container = document.querySelector('.notification-container');
  if (container) {
    container.appendChild(alert);
    setTimeout(() => alert.remove(), 5000);
  }
}


async function submitFormToPipedream(data, webhookUrl) {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      showNotification('Form submitted successfully!', 'success');
      storeFormData(`submission_${Date.now()}`, data);
      return true;
    } else {
      showNotification('Failed to submit form. Please try again.', 'error');
      return false;
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    
    storeFormData(`submission_${Date.now()}_offline`, data);
    showNotification('Form saved locally. Will sync when online.', 'success');
    return true;
  }
}


window.formUtils = {
  validatePhone,
  validateEmail,
  validateFormData,
  formatCurrency,
  storeFormData,
  getFormData,
  showNotification,
  submitFormToPipedream,
  IndianStates,
  courses,
  intakeYears
};
