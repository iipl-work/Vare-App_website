
$(document).ready(function () {
    $('.price-format').each(function () {
        var val = parseInt($(this).html());
        $(this).html(val.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            style: 'currency',
            currency: 'INR'
        }));
    });
 });
