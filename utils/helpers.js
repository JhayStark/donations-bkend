function formatCurrencyToGHS(amount) {
  if (isNaN(amount)) {
    return false;
  }

  // Format the amount with 2 decimal places
  const formattedAmount = amount.toFixed(2);

  // Add currency symbol and commas for thousands separator
  const parts = formattedAmount.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return `GHS ${parts.join('.')}`;
}

module.exports = { formatCurrencyToGHS };
