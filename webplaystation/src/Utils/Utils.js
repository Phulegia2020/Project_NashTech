export function formatQuantity(quantity)
{
    return new Intl.NumberFormat().format(quantity);
}

export function formatCurrency(number) {
    var options = {style: 'currency', currency: 'VND'};
    var numberFormat = new Intl.NumberFormat('en-US', options);

    return numberFormat.format(number);
}

export function formatDate(date){
    let d = new Date(date);
    let res = d.getDate() + "-"+ parseInt(d.getMonth()+1) +"-"+d.getFullYear();
    return res;
}

export function checkPhoneNumber(phone) {
    var pattern = /^0[0-9\s]*$/;
    return phone.length > 0 && pattern.test(phone);
  }