Number.prototype.countDecimals = function () {

    if (Math.floor(this.valueOf()) === this.valueOf()) return 0;

    var str = this.toString();
    if (str.indexOf(".") !== -1 && str.indexOf("-") !== -1) {
        return str.split("-")[1] || 0;
    } else if (str.indexOf(".") !== -1) {
        return str.split(".")[1].length || 0;
    }
    return str.split("-")[1] || 0;
}
function processPrettifyNumber(input, decimalPlaces = 0){
    if(!isNaN(parseFloat(input))){
        var temp = parseFloat(input)
        if(temp.countDecimals() > 0){
            temp = temp.toFixed(decimalPlaces)
        }
        //add commas
        temp = temp.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        return temp
    }
    else{
        return input
    }

}
export function prettifyNumber(input, decimalPlaces = 0){
    //truncate decimals
    if (Array.isArray(input)){
        var listStr = ""
        input.forEach(function (item) {
            listStr += (processPrettifyNumber(item, decimalPlaces) + ", ");
          });
        if(input.length === 1){
            listStr = listStr.replace(",","")
        }
        return listStr
    }
    else{
            return processPrettifyNumber(input, decimalPlaces) 
    }
}

