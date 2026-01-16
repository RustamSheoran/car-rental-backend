const validateAuthInput = (username, password) => {
  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    return { valid: false, error: 'Username is required' };
  }
  if (!password || typeof password !== 'string' || password.length === 0) {
    return { valid: false, error: 'Password is required' };
  }
  return { valid: true };
};

const validateBookingInput = (carName, days, rentPerDay) => {
  if (!carName || typeof carName !== 'string' || carName.trim().length === 0) {
    return { valid: false, error: 'Car name is required' };
  }
  if (!days || typeof days !== 'number' || days <= 0) {
    return { valid: false, error: 'Days must be a positive number' };
  }
  if (days >= 365) {
    return { valid: false, error: 'Days must be less than 365' };
  }
  if (!rentPerDay || typeof rentPerDay !== 'number' || rentPerDay <= 0) {
    return { valid: false, error: 'Rent per day must be a positive number' };
  }
  if (rentPerDay > 2000) {
    return { valid: false, error: 'Rent per day cannot exceed 2000' };
  }
  return { valid: true };
};

const validateBookingUpdate = (carName, days, rentPerDay, status) => {
  if (status !== undefined) {
    const validStatuses = ['booked', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return { valid: false, error: 'Invalid status value' };
    }
    return { valid: true };
  }

  if (carName !== undefined && (typeof carName !== 'string' || carName.trim().length === 0)) {
    return { valid: false, error: 'Car name is required' };
  }

  if (days !== undefined) {
    if (typeof days !== 'number' || days <= 0) {
      return { valid: false, error: 'Days must be a positive number' };
    }
    if (days >= 365) {
      return { valid: false, error: 'Days must be less than 365' };
    }
  }

  if (rentPerDay !== undefined) {
    if (typeof rentPerDay !== 'number' || rentPerDay <= 0) {
      return { valid: false, error: 'Rent per day must be a positive number' };
    }
    if (rentPerDay > 2000) {
      return { valid: false, error: 'Rent per day cannot exceed 2000' };
    }
  }

  if (carName === undefined && days === undefined && rentPerDay === undefined && status === undefined) {
    return { valid: false, error: 'At least one field must be provided' };
  }

  return { valid: true };
};

module.exports = {
  validateAuthInput,
  validateBookingInput,
  validateBookingUpdate
};
