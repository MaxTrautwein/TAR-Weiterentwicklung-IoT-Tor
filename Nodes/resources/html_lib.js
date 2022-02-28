/**
 * Converts Multiplicators to Time Units (base is ms)
 * 
 * @param {*} number Number string
 * @returns Unit Name or error
 */
 function timeUnitToStr(number){
    number = Number.parseInt(number,10);
    switch(number){
        case 1:
            return "ms";
        case 1000:
            return "s";
        case 60000:
            return "min";
        default:
            return " error: " + number;
    }
}