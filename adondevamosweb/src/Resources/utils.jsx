const formatDate = (dateString) => {
    if( !dateString ) return "";
    const [year, month, day] = dateString.split('T')[0].split('-');
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }).format(date);
};

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}
const generateDateText = (initialDate, finalDate) => {
    if( !initialDate && !finalDate ) return "No dates added";
    if( initialDate && !finalDate ) {
        const formattedInitialDate = formatDate(initialDate);
        return `From ${formattedInitialDate}`;
    }
    if( !initialDate && finalDate ) {
        const formattedFinalDate = formatDate(finalDate);
        return `Until ${formattedFinalDate}`;
    }
    if( initialDate === finalDate ) {
        const formattedDate = formatDate(initialDate);
        return `${formattedDate}`;
    }
    const formattedInitialDate = formatDate(initialDate);
    const formattedFinalDate = formatDate(finalDate);
    return `${formattedInitialDate} to ${formattedFinalDate}`;
}


const utils = {
  formatDate : formatDate,
  validateEmail : validateEmail,
  generateDateText: generateDateText
};

export default utils;