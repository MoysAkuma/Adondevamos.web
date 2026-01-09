const formatDate = (dateString) => {
        if( !dateString ) return "";
        const date = new Date(dateString);
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
    const formattedInitialDate = formatDate(initialDate);
    const formattedFinalDate = formatDate(finalDate);
    return `${formattedInitialDate} - ${formattedFinalDate}`;
}


const utils = {
  formatDate : formatDate,
  validateEmail : validateEmail,
  generateDateText: generateDateText
};

export default utils;