formatMoney = (value) => (!isNaN(value)) ? `R$ ${parseFloat(value || 0).toFixed(2).replace('.', ',')}` : value;

formatDate = (date) => date ? date.split('-').reverse().join('/') : date;