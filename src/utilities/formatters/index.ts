export const formatPhoneNumber = (phoneNumber: string | number): string => {
  const cleaned = phoneNumber.toString().replace(/\D/g, ''); // Remove non-numeric characters
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber.toString(); // Return the original if it doesn't match the format
};
