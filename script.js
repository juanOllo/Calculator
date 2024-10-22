const formula = document.querySelector(".screen");          // pantalla de la calculadora
const hist = document.querySelector(".historial");          // seccion del historial de la equacion
const errorMsj = document.getElementById("error-msj");      // mensaje de error

const btnDel = document.querySelector(".button-delete");    // CE button
const btnEqual = document.querySelector(".button-equal");   // = button
const btnCl = document.getElementById("del");               // << button

const opButtons = document.querySelectorAll(".operator");   //operator buttons
const nButtons = document.querySelectorAll(".number");      //number buttons
const pBtn1 = document.querySelector(".parent1");           // ( button
const pBtn2 = document.querySelector(".parent2");           // ) button
const pointBtn = document.getElementById("point");          // . button

// sirve para que si abris un parentesis tengas q cerrarlo si o si
let contadoDeParesDePArentesis = 0;

// arreglo donde guardo todos los elementos de la ecuacion
var arrFormula = [];




///////////////////////////////////////////// EVENTOS //////////////////////////////////////////////////////

//num buttons event: agrega un tipo num a la ecuacion
for (let nBtn of nButtons){
    
    nBtn.addEventListener("click", () => {
        
        //si agregas un num desp de un ) entonces agrega un * antes
        if (arrFormula[arrFormula.length-1]===")"){
            arrFormula[arrFormula.length] = "*";
        }
        
        formula.innerText += nBtn.innerText;
        arrFormula[arrFormula.length] = nBtn.innerText;
    })
    
}

//operator buttons event: agrega un tipo operador a la ecuacion
for (let oBtn of opButtons){
    
    oBtn.addEventListener("click", () => {
        
        //IF original 
        // if ((oBtn.value!=="-" || (!isNaN(arrFormula[arrFormula.length-3]) && arrFormula[arrFormula.length-1]!=="(" )) && (isNaN(arrFormula[arrFormula.length - 1]) && arrFormula[arrFormula.length - 1] !== ")") || arrFormula[arrFormula.length - 1] === ".") {
            
        //este if no permite agregar un operador desp de un operador
        //al menos q el segundo operador sea un - y se cumplan cietos requisitos
        if (!(oBtn.value==="-" && (arrFormula.length===0 || !isNaN(arrFormula[arrFormula.length-2]) || arrFormula[arrFormula.length-1]==="("  || arrFormula[arrFormula.length-1]===")" )) && (isNaN(arrFormula[arrFormula.length - 1]) && arrFormula[arrFormula.length - 1] !== ")") || arrFormula[arrFormula.length - 1] === ".") {
            // console.log("doble ingreso de operador");
            showErrMsj("Ingresa un numero");
        } else {
            formula.innerText += oBtn.innerText;
            arrFormula[arrFormula.length] = oBtn.value;
        }
    })
}

// . button event: agrega un . a la ecuacion
pointBtn.addEventListener("click", () => {

    //FOR para q no pongas dos puntos en un mismo nro
    for (let a = arrFormula.length-1; a>0; a--){
        if (isNaN(arrFormula[a])){
            if (arrFormula[a] === "."){
                showErrMsj("No puedes volver a introducir un punto");
                return;
            }
            a = 0;
        }
    }

    //solo agrega un punto desp de un nro
    if (arrFormula.length > 0 && !isNaN(arrFormula[arrFormula.length-1])){
        arrFormula[arrFormula.length] = ".";
        formula.innerText += ".";
    } else{
        showErrMsj("No puedes agregar un punto aun");
    }
})

// ( button event: agrega un ( a la ecuacion
pBtn1.addEventListener("click", () => {

    //no permite abrir dos parentesis seguidos (probablemento lo cambie)
    if (arrFormula.length>0 && (arrFormula[arrFormula.length-1]==="(" || arrFormula[arrFormula.length-1]===".")){
        showErrMsj("Pon algo en tu parentesis antes de abrir otro");
    } else{
        formula.innerText += pBtn1.innerText;
        //si lo anterior en el arr esra un nro entonces agrega un * antes d agregar el (
        if (arrFormula.length>0 && (!isNaN(arrFormula[arrFormula.length-1]) || arrFormula[arrFormula.length-1]===")" || arrFormula[arrFormula.length-1]==="*")){
            arrFormula[arrFormula.length] = "*";
        }
        arrFormula[arrFormula.length] = "(";
        contadoDeParesDePArentesis++;
    }
})

// ) button event: agrega un ) a la ecuacion
pBtn2.addEventListener("click", () => {

    // agrega ) solo si lo ultimo en el arr es un nro o un )
    if (contadoDeParesDePArentesis>0 && (!isNaN(arrFormula[arrFormula.length-1]) || arrFormula[arrFormula.length-1]===")")){
        formula.innerText += pBtn2.innerText;
        arrFormula[arrFormula.length] = ")";
        contadoDeParesDePArentesis--;
    } else{
        showErrMsj("Pon algo mas en tu parentesis antes de cerrarlo");
    }
})

// = button event: resuelve la ecuacion y la muestra en pantalla
btnEqual.addEventListener("click", () => {  
    
    //si la ecuacion no termina en un nro o un ) , no puede operar aun
    if (isNaN(arrFormula[arrFormula.length - 1]) && arrFormula[arrFormula.length - 1] !== ")") {
        showErrMsj("Faltan numeros para operar");

            //si abriste un parentesis y no lo cerraste aun no puede operar
    } else if(contadoDeParesDePArentesis>0){
        showErrMsj("Falta cerrar un parentesis");
        
    } else {
        // console.log("arrFormula antes de resolver: " + formulaFinal(arrFormula));

        contadoDeParesDePArentesis = 0;     //reinicia contador de parentesis
        
        arrFormula = formulaFinal(arrFormula);      //reorganiza la formula: agrupa los tipo num consecutivos y suprime los "*" consecutivos

        //limpia la formula y la agrega al historial: remplaza los +,- y -,-
        hist.innerText = cleanHistorial(arrFormula).toString().replaceAll(",", " ");

        const result = equal(arrFormula, 0);    //resuelve la ecuacion y la guarda en result
        
        //IF que checkea que el resultado no sea infinito
        if (!(regexNoPosibleResult.test(result))){
            //trata el resultado que va a mostrar en pantalla
            //  si es float tambien muestra la parte decimal, si es int entonces no
            (parseFloat(result) - parseInt(result))===0 ? formula.innerText = parseInt(result) : formula.innerText = parseFloat(result).toFixed(2);
            
            //guarda el result char x char para volverlo a tratar de cualquier manera
            arrFormula = [...formula.innerText];
            
        } else {
            //  si el resultado es infinito se ejecuta todo esto
            showErrMsj("Resultado infinito");
            formula.innerText = ""
            arrFormula = [];
        }

        // console.log("arrFormula desp de = : " + arrFormula);
    }
})

//REGEX que no permite q el resultado sea Infinity, -Infiniy o NaN
const regexNoPosibleResult = /I|N/;

// << button event: borra ultimo elemento de arrFormula
btnCl.addEventListener("click", () => {
    let pop = arrFormula.pop();
    
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
        }
        
    let aux1 = formula.innerText.split("");
    let aux2 = aux1.pop();
    formula.innerText = aux1.toString().replaceAll(",", "");
})

// CE button event: borra toda la ecuacion
btnDel.addEventListener("click", () => {
    formula.innerText = "";
    hist.innerText = "";
    arrFormula = [];
    contadoDeParesDePArentesis = 0;
})




///////////////////////////////////////////// FUNCIONES //////////////////////////////////////////////////////

//Prepara la formula antes solucionarla
//  agrupa los numeros consecutivos, suprime uno de los "*" consecutivos
//  y arma los numeros tipo float
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
    
    return arr;
}

//toma la ecuacion (arr), la resuelve y la devuelve
//(o) empieza en cero para primero resolver las multiplicaciones y divisiones
//  y luego resuelve sumas y restas, de izquierda a derecha 
const equal = (arr, o) => {
    
    //FOR para resolver primero lo q esta en parentesis
    for (let i = arr.length-1; i >= 0; i--){
        //si encuentra un parentecis va a resolver todo lo q este dentro,
        //  luego lo devuelve el resultado en la ubicacion del mismo primer parentesis
        //  y reorganiza el arr eliminando la ecuacion y los parentesis q ya resolvio 
        if (arr[i]==="("){
            let aux = [];
            let i2 = 0;
            for (let j = i+1; arr[j]!==")"; j++){
                aux[i2] = arr[j];
                i2++;
            }
            let rest = aux.length;
            arr[i]=equal(aux, 0);
            
            for(let a = i+i2+2; a <= arr.length; a++){
                arr[i+1] = arr[a];
                i++;
            }
            arr.length -= rest+1;
        }
    }
    
    //numeros q tengan un - adelante desp de un tipo no num los convierte en negativos
    //  y reorganiza la ecuacion 
    for (let d = 0; d<arr.length; d++){
        if (arr[d]==="-" && (d===0 || isNaN(arr[d-1]))){
            arr[d] = arr[d+1] * -1;
            d++;
            
            while (d<arr.length-1){
                arr[d] = arr[d+1];
                d++;
            }
            arr.length -=1;
            d = 0;
        }
    }
    
    //SWITCH q resuelve primero muls y divs, luego sums y minus
    switch (o){
        case 4:
            //cuando (o) es igual a 4 ya resolvio todo
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
//obj aux para equal()
const opFuns = [
    (x,y) => x * y,
    (x,y) => x / y,
    (x,y) =>  x + y,
    (x,y) =>  x - y,
];
//arr aux para equal()
const opChars = ["*", "/", "+", "-"];


//acomoda el historial si hay un +- o un --
const cleanHistorial = (arr) => {
    for (let i = arr.length-1; i>1; i--){
        if (arr[i]==="-" && (arr[i-1]==="+" || arr[i-1]==="-")){
            switch (arr[i-1]){
                case "-":
                    arr[i-1] = "+";
                    break;
                case "+":
                    arr[i-1] = "-";
                    break;
                default:
                    break;
            }

            while (i<arr.length-1){
                arr[i] = arr[i+1];
                i++;
            }

            arr.length -= 1;
            i = arr.length-1;
        }
    }
    return arr;
}
    
//actualiza errMsj y luego lo vacia
const showErrMsj = (str) => {
    errorMsj.style.backgroundColor = "#1E3E62";
    errorMsj.innerText = str;
    setTimeout(() => {
        errorMsj.innerText = "";
        errorMsj.style.backgroundColor = "transparent";
    }, 2500);
}