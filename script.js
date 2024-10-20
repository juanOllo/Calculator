const formula = document.querySelector(".screen");
const hist = document.querySelector(".historial");
const errorMsj = document.getElementById("error-msj");

const btnDel = document.querySelector(".button-delete");
const btnEqual = document.querySelector(".button-equal");
const btnCl = document.getElementById("del");

const opButtons = document.querySelectorAll(".operator");   //operator buttons
const nButtons = document.querySelectorAll(".number");      //number buttons
const pBtn1 = document.querySelector(".parent1");
const pBtn2 = document.querySelector(".parent2");
const pointBtn = document.getElementById("point");

let contadoDeParesDePArentesis = 0;

const opRegex = /\+|\-|\*|\//;

var arrFormula = [];

pointBtn.addEventListener("click", () => {

    //FOR para q no pongas dos puntos en un mismo nro
    for (let a = arrFormula.length-1; a>0; a--){
        if (isNaN(arrFormula[a])){
            if (arrFormula[a] === "."){
                errorMsj.innerText = "No puedes volver a introducir un punto"
                return;
            }
            a = 0;
        }
    }

    if (arrFormula.length > 0 && !isNaN(arrFormula[arrFormula.length-1])){
        arrFormula[arrFormula.length] = ".";
        formula.innerText += ".";
    } else{
        errorMsj.innerText = "No puedes agregar un punto aun";
    }
})

for (let nBtn of nButtons){

    nBtn.addEventListener("click", () => {

        if (arrFormula[arrFormula.length-1]===")"){
            arrFormula[arrFormula.length] = "*";
        }

        formula.innerText += nBtn.innerText;
        arrFormula[arrFormula.length] = nBtn.innerText;
        // console.log("arrForm por num: " + arrFormula);
    })

}

for (let oBtn of opButtons){
    oBtn.addEventListener("click", () => {

        //IF original 
        // if ((oBtn.value!=="-" || (!isNaN(arrFormula[arrFormula.length-3]) && arrFormula[arrFormula.length-1]!=="(" )) && (isNaN(arrFormula[arrFormula.length - 1]) && arrFormula[arrFormula.length - 1] !== ")") || arrFormula[arrFormula.length - 1] === ".") {
        if (!(oBtn.value==="-" && (!isNaN(arrFormula[arrFormula.length-2]) || arrFormula[arrFormula.length-1]==="(" )) && (isNaN(arrFormula[arrFormula.length - 1]) && arrFormula[arrFormula.length - 1] !== ")") || arrFormula[arrFormula.length - 1] === ".") {
            // console.log("doble ingreso de operador");
            errorMsj.innerText = "Ingresa un numero";
        } else {
            formula.innerText += oBtn.innerText;
            arrFormula[arrFormula.length] = oBtn.value;
        }
        // console.log("arrForm por op: " + arrFormula);
    })
}

pBtn1.addEventListener("click", () => {

    if (arrFormula.length>0 && (arrFormula[arrFormula.length-1]==="(" || arrFormula[arrFormula.length-1]===".")){
        errorMsj.innerText = "Pon algo en tu parentesis antes de abrir otro";
        // console.log("pon algo en tu parentesis antes d abrir otro");
    } else{
        formula.innerText += pBtn1.innerText;
        if (arrFormula.length>0 && (!isNaN(arrFormula[arrFormula.length-1]) || arrFormula[arrFormula.length-1]===")" || arrFormula[arrFormula.length-1]==="*")){
            arrFormula[arrFormula.length] = "*";
        }
        arrFormula[arrFormula.length] = "(";
        contadoDeParesDePArentesis++;
        // console.log(arrFormula);
    }
})

pBtn2.addEventListener("click", () => {

    if (contadoDeParesDePArentesis>0 && (!isNaN(arrFormula[arrFormula.length-1]) || arrFormula[arrFormula.length-1]===")")){
        formula.innerText += pBtn2.innerText;
        arrFormula[arrFormula.length] = ")";
        contadoDeParesDePArentesis--;
    } else{
        errorMsj.innerText = "Pon algo mas en tu parentesis poder cerrarlo";
        // console.log("pon algo en tu parentesis poder cerrarlo");
    }
})

btnEqual.addEventListener("click", () => {  
    
    if (isNaN(arrFormula[arrFormula.length - 1]) && arrFormula[arrFormula.length - 1] !== ")") {
        errorMsj.innerText = "Faltan numeros para operar";
        // console.log("falta otro numero para operar");

    } else if(contadoDeParesDePArentesis>0){
        errorMsj.innerText = "Falta cerrar un parentesis";
        // console.log("falta cerrar parentesis");
        
    } else {

        console.log("arrFormula antes de resolver: " + formulaFinal(arrFormula));

        arrFormula = formulaFinal(arrFormula);

        errorMsj.innerText = "";
        hist.innerText = arrFormula.toString().replaceAll(",", " ");

        const result = equal(arrFormula, 0);
        
        (parseFloat(result) - parseInt(result))===0 ? formula.innerText = parseInt(result) : formula.innerText = parseFloat(result).toFixed(2);
        
        // formula.innerText = parseFloat(result).toFixed(2);
        
        // arrFormula = [];    //aun no se por q no es necesario
        // arrFormula[0] = parseFloat(result);
        arrFormula = [...formula.innerText];

        console.log("arrFormula desp de = : " + arrFormula);
    }
})

const opFuns = [
    (x,y) => x * y,
    (x,y) => x / y,
    (x,y) =>  x + y,
    (x,y) =>  x - y,
]

const opChars = ["*", "/", "+", "-"]

const equal = (arr, o) => {

    //FOR para resolver primero lo q esta en parentesis
    for (let i = arr.length-1; i >= 0; i--){
        if (arr[i]==="("){
            let aux = [];
            let i2 = 0;
            for (let j = i+1; arr[j]!==")"; j++){
                aux[i2] = arr[j];
                i2++;
            }
            // console.log("aux: " + aux);

            let rest = aux.length;
            arr[i]=equal(aux, 0);
            // console.log("resultado de parentesis: " + arr[i])
            

            for(let a = i+i2+2; a <= arr.length; a++){
                arr[i+1] = arr[a];
                i++;
            }

            arr.length -= rest+1;
            
            // console.log("sin parentesis: " + arr);
        }
    }

    //Actualizar numeros negativos
    for (let d = 0; d<arr.length; d++){
        if (arr[d]==="-" && (d===0 || isNaN(arr[d-1]))){
            arr[d] = arr[d+1] * -1;
            d++;

            console.log("entro")

            while (d<arr.length-1){
                arr[d] = arr[d+1];
                d++;
            }
            arr.length -=1;
            d = 0;
        }
    }
    
    // console.log("arr con negativos:" + arr);
    // console.log("paso");

    //SWITCH q resuelve primero muls y divs, luego sums y minus
    switch (o){
        case 4:
            return arr;
            break;
        default:
            for (let i = 0; i < arr.length; i++){
                if (arr[i]===opChars[o]){
                    arr[i-1] = opFuns[o](parseFloat(arr[i-1]), parseFloat(arr[i+1]));
                    for(let j = i+2; j < arr.length; j++){
                        arr[j-2] = arr[j];
                    }
                    arr.length -= 2;
                    i--;
                }
                if (arr[i]===opChars[o+1]){
                    arr[i-1] = opFuns[o+1](parseFloat(arr[i-1]), parseFloat(arr[i+1]));
                    for(let j = i+2; j < arr.length; j++){
                        arr[j-2] = arr[j];
                    }
                    arr.length -= 2;
                    i--;
                }
            }
            return equal(arr, o+2);
            break;
    }
}

//Prepara la formula para solucionarla
//  agrupa los numeros y suprime los "*" repetidos
const formulaFinal = (arr) => {

    for (let i = 0; i<arrFormula.length; i++){
        //IF que une numeros seguidos
        if (!isNaN(arrFormula[i]) && !isNaN(arrFormula[i+1])){

            arrFormula[i] += arrFormula[i+1];

            for (let j = i+1; j<arrFormula.length; j++){
                arrFormula[j] = arrFormula[j+1];
            }

            arrFormula.length -= 1;
            i = -1;
        }

        //IF que elimina * repetidos
        if (arrFormula[i]==="*" && arrFormula[i+1]==="*"){

            for (let j = i+1; j<arrFormula.length; j++){
                arrFormula[j] = arrFormula[j+1];
            }

            arrFormula.length -= 1;
            i = -1;
        }
    }

    //FOR que arma los floats
    for (let i = 0; i<arrFormula.length; i++){
        if (arrFormula[i]==="."){
            arrFormula[i-1] = arrFormula[i-1] + "." + arrFormula[i+1];
            
            //FOR que suprime el . y el resto del float
            for (let j = i; j<arrFormula.length-1; j++){
                arrFormula[j] = arrFormula[j+2];
            }

            arrFormula.length -= 2;

            i = -1;
        }
    }

    console.log("como queda desp de los puntos: " + arrFormula);

    return arr;
}

btnDel.addEventListener("click", () => {
        errorMsj.innerText = "";
        formula.innerText = "";
    hist.innerText = "";
    arrFormula = [];
})

btnCl.addEventListener("click", () => {
    let pop = arrFormula.pop();
    // console.log(pop);
    // console.log("nuevo ultimo: " + arrFormula[arrFormula.length-1]);

    switch (pop){
        case "(":
            contadoDeParesDePArentesis--;
            break;
        case ")":
            contadoDeParesDePArentesis++;
            break;
        default:
            break;
    }

    if (    (pop==="(" && arrFormula[arrFormula.length-1]==="*" )  
            || (!isNaN(pop) && arrFormula[arrFormula.length-1]==="*")
    ){
        pop = arrFormula.pop();
        // console.log("entro")
    }


    let aux1 = formula.innerText.split("");
    let aux2 = aux1.pop();
    formula.innerText = aux1.toString().replaceAll(",", "");
    // console.log("arrFirmula: " + arrFormula);
})