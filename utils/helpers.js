function formatCurrencyToGHS(amount) {
  // Check if the input is a valid number
  if (isNaN(amount)) {
    return '0';
  }

  // Use Intl.NumberFormat to format the number into Ghanaian Cedi currency
  const formatter = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
  });

  // Format the number into Ghanaian Cedi currency
  const formattedString = formatter.format(amount);

  // Manually remove the currency code prefix ("GH") if present
  const currencySymbol = '₵'; // Ghanaian Cedi symbol
  const currencyCodePrefix = 'GH';

  if (formattedString.startsWith(currencyCodePrefix)) {
    // Remove the currency code prefix and trim any leading whitespace
    return formattedString.substring(currencyCodePrefix.length).trim();
  }

  // If the prefix is not found, return the formatted string as is
  return formattedString;
}

module.exports = { formatCurrencyToGHS };
