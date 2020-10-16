const widgetDonationAmount = 300;
const projectEndDate = '2020/10/30';


 function dateDifference(date1, date2) {
    dt1 = new Date(date1);
    dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
}




function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
        textbox.addEventListener(event, function() {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    });
}

function updateProgressBar(amount){
    let percentageCompletness = Math.ceil((amount/widgetDonationAmount)*100);
    document.getElementById('progress-bar').style.width =percentageCompletness+ '%';
}

setInputFilter(document.getElementById("donateAmount-input"), function(value) {
    let amount = /^\d*$/.test(value);
    let donation = parseInt(value);

    if(donation>0 && donation<=widgetDonationAmount) updateProgressBar(donation);
    if(donation<=0) {
        document.getElementById("input-validation-error-message").innerText ='Donation cannot be zero';
       updateProgressBar(0);
    }
    else if(donation >widgetDonationAmount) {
        document.getElementById("input-validation-error-message").innerText ='Donation cannot be more than '+widgetDonationAmount;
       updateProgressBar(0);
    }
     else document.getElementById("input-validation-error-message").innerText ='';
   return amount;




});


$(function () {
    $('[data-toggle="tooltip"]').tooltip({title: "$<span  id='remaining-amount-tooltip'>"+widgetDonationAmount +"</span> still need for this project", html: true, placement: "top"});

})


$("[data-toggle='tooltip']").on('shown.bs.tooltip', function(){
    let amount= parseInt(document.getElementById("donateAmount-input").value);
        amount = isNaN(amount) ? 0 : amount;
       amount =( amount<0 || amount > widgetDonationAmount) ? 0 : amount
    document.getElementById('remaining-amount-tooltip').innerText=( widgetDonationAmount-amount )+ '';

});


$(document).ready(function (){
    setRemainigDays();
    setSavedValueToTextBox();




})


function setSavedValueToTextBox(){
    let amount = localStorage.getItem("saved-value-donation");
    amount = amount== '' ? 0 : amount;
    updateProgressBar(amount);
     $('#donateAmount-input').val(amount);


}


function setRemainigDays()
{
    let currentDate = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    let days = dateDifference(currentDate, projectEndDate);
    document.getElementById('font-color').innerText= 'Only '+days+' days left'

}


$('#save-for-later-btn').click(function(){
    let amount= parseInt(document.getElementById("donateAmount-input").value);
    amount = isNaN(amount) ? 0 : amount;
    amount =( amount<0 || amount > widgetDonationAmount) ? 0 : amount
    localStorage.setItem("saved-value-donation", amount);

});
