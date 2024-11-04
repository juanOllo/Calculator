//  TAREAS
//      Arreglar overflow del screen (clientWidth)
//      Agregar historial

const formula = document.querySelector(".screen");          // pantalla de la calculadora
const hist = document.querySelector(".historial");          // seccion del historial de la equacion
const errorMsj = document.getElementById("error-msj");      // mensaje de error

const allBtns = document.getElementsByTagName("button");

const version = document.getElementById("version");
version.innerText = "v0.8"

// sirve para que si abris un parentesis tengas q cerrarlo si o si
let contadoDeParesDePArentesis = 0;

// arreglo donde guardo todos los elementos de la ecuacion
let arrFormula = [];

// arreglo donde guardo todas las ecuaciones y sus resultados
let arrHistorial = [];

//REGEX que no permite q el resultado sea Infinity, -Infiniy o NaN
const regexNoPosibleResult = /I|N/;

// carga valores desde el teclado
window.addEventListener("keydown", ({key}) => {
    // console.log("entro un: ", key);
    isNaN(parseInt(key)) ? addInput(key) : addInput(parseInt(key));
});


function addInput(ch) {

    // if(formula.length > 13){
        // console.log(formula.innerText.clientWidth);
    // }
    
    for(let b of allBtns){
        // if (b.innerText === ch || parseInt(b.innerText)===ch){
        if (b.innerText === ch || parseInt(b.innerText)===ch || b.name === ch){
            anim(b, "click-anim 0.2s ease-in-out");
            break;
        }
    }

    if (hist.innerText!=="" && ch!=="="){
        anim(hist, "clean-hist-anim 0.3s ease-out");
        setTimeout(() => {
            hist.innerText="";
        }, 180);
    }

    switch(typeof(ch)) {
        case "number":
            // console.log("numero ingresado");
            anim(formula, "input-screen-anim 0.1s ease-in-out");

            if(hist.innerText !== ""){
                addInput("CE");
                setTimeout(() => { formula.innerText += ch;}, 55);
                arrFormula[arrFormula.length] = ch;
                break;
            }

            //si agregas un num desp de un ) entonces agrega un * antes
            if (arrFormula[arrFormula.length-1]===")"){
                arrFormula[arrFormula.length] = "*";
            }
            formula.innerText += ch;
            arrFormula[arrFormula.length] = ch;
            break;

        case "string":
            // console.log("char ingresado");

            switch(ch) {
                case "=":
                case "Enter":

                    //si la ecuacion no termina en un nro o un ) no puede operar
                    if (isNaN(arrFormula[arrFormula.length - 1]) && arrFormula[arrFormula.length - 1] !== ")") {
                        showErrMsj("Faltan numeros para operar");
                        break;
                            //si abriste un parentesis y aun no lo cerraste no puede operar
                    } else if(contadoDeParesDePArentesis!==0){

                        while(contadoDeParesDePArentesis>0){
                            arrFormula[arrFormula.length] = ")";
                            contadoDeParesDePArentesis--;
                        }

                        showErrMsj("Falta cerrar un parentesis");
                        // break;
                    }

                    anim(formula, "equal-screen-anim 0.2s ease");
                    anim(hist, "equal-hist-anim 0.2s ease");

                    //limpia la formula y la agrega al historial: remplaza los +- , -- y **
                    hist.innerText = arrFormula.toString().replaceAll(",", "").replaceAll("+-", "-").replaceAll("--", "+").replaceAll("**", "*");    
                    
                    //resuelve la ecuacion y la guarda en result
                    //  puedo usar hist.innerText porq ya quite los * consecutivos
                    const result = eval(hist.innerText);

                    //IF que checkea que el resultado no sea infinito
                    if (!(regexNoPosibleResult.test(result))){

                        //trata el resultado que va a mostrar en pantalla
                        //  si es float tambien muestra la parte decimal, si es int entonces no
                        (parseFloat(result) - parseInt(result))===0 ? formula.innerText = parseInt(result) : formula.innerText = parseFloat(result).toFixed(2);
                        
                        
                        arrHistorial.unshift([formula.innerText, hist.innerText]);
                        console.log("historial: ", arrHistorial);


                        //guarda el result char x char para volver a tratarlo de cualquier manera
                        arrFormula = [...formula.innerText];
                        
                    } else {
                        //  si el resultado es infinito se ejecuta todo esto
                        showErrMsj("Resultado infinito");
                        formula.innerText = ""
                        arrFormula = [];
                    }
                    break;

                case "(":
                    //no permite abrir desp de un punto
                    if (arrFormula.length>0 && arrFormula[arrFormula.length-1]==="."){
                        showErrMsj("No puedes abrir un parentesis ahora");
                    } else{
                        anim(formula, "input-screen-anim 0.1s ease-in-out");
                        formula.innerText += "(";
                        //si lo anterior en el arr esra un nro entonces agrega un * antes d agregar el (
                        if (arrFormula.length>0 && (!isNaN(arrFormula[arrFormula.length-1]) || arrFormula[arrFormula.length-1]===")" || arrFormula[arrFormula.length-1]==="*")){
                            arrFormula[arrFormula.length] = "*";
                        }
                        arrFormula[arrFormula.length] = "(";
                        contadoDeParesDePArentesis++;
                    }
                    break;

                case ")":
                    // agrega ) solo si lo ultimo en el arr es un nro o un )
                    if (contadoDeParesDePArentesis>0 && (!isNaN(arrFormula[arrFormula.length-1]) || arrFormula[arrFormula.length-1]===")")){
                        anim(formula, "input-screen-anim 0.1s ease-in-out");
                        formula.innerText += ")";
                        arrFormula[arrFormula.length] = ")";
                        contadoDeParesDePArentesis--;
                    } else{
                        showErrMsj("Pon algo mas en tu parentesis antes de cerrarlo");
                    }
                    break;

                case ".":
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
                        anim(formula, "input-screen-anim 0.1s ease-in-out");
                        arrFormula[arrFormula.length] = ".";
                        formula.innerText += ".";
                    } else{
                        showErrMsj("No puedes agregar un punto aun");
                    }
                    break;

                case "CE":
                case "Escape":
                    anim(formula, "ce-screen-anim 0.2s ease-in-out");
                    anim(hist, "ce-hist-anim 0.2s ease-in-out")
                    arrFormula = [];
                    contadoDeParesDePArentesis = 0;
                    setTimeout(() => {
                        formula.innerText = "";
                        hist.innerText = "";
                    }, 50);
                    break;

                case "<<":
                case "Backspace":
                    anim(formula, "del-screen-anim 0.25s ease-in-out")
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
                            
                    if ((pop==="(" && arrFormula[arrFormula.length-1]==="*" ) || (!isNaN(pop) && arrFormula[arrFormula.length-1]==="*" &&  arrFormula[arrFormula.length-2]===")")){
                        pop = arrFormula.pop();
                    }
                    let aux1 = formula.innerText.split("");
                    let aux2 = aux1.pop();

                    setTimeout(() => {
                        formula.innerText = aux1.toString().replaceAll(",", "");
                        // hist.innerText="";
                    }, 20)

                    break;

                case "*":
                case "/":
                case "+":
                case "-":
                    //este if no permite agregar un operador desp de un operador
                    //al menos q el segundo operador sea un - y se cumplan cietos requisitos
                    if (!(ch==="-" && arrFormula[arrFormula.length-1]!=="." && (arrFormula.length===0 || !isNaN(arrFormula[arrFormula.length-2]) || arrFormula[arrFormula.length-1]==="("))  
                        &&
                    (arrFormula.length===0 || (arrFormula.length!==0 && isNaN(arrFormula[arrFormula.length-1])))
                        &&
                    (arrFormula[arrFormula.length-1]!==")")
                    ) {
                        showErrMsj("Ingresa un numero");
                    } else {
                        anim(formula, "input-screen-anim 0.1s ease-in-out");
                        formula.innerText += ch;
                        arrFormula[arrFormula.length] = ch;
                    }
                    break;

                default:
                    showErrMsj("Tecla incorrecta");
                    break;
            }
            break;

        default:
            break;
    }

    // console.log("arrFormula desp de un input: " + arrFormula);
}

//actualiza errMsj y luego lo vacia
const showErrMsj = (str) => {
    errorMsj.style.backgroundColor = "#1E3E62";
    errorMsj.innerText = str;
    setTimeout(() => {
        errorMsj.innerText = "";
        errorMsj.style.backgroundColor = "transparent";
    }, 2500);
    anim(formula, "error-anim 0.6s ease")
}

//aplica animaciones
const anim = (btn, str) => {
    btn.style.animation = "none";
    btn.offsetHeight;
    btn.style.animation = str;
}


const histBtn = document.getElementById("historial-btn");
const btnsContainer = document.querySelector(".buttons");

histBtn.addEventListener("click", () => {
    console.log("className: ", histBtn.className);

    if(histBtn.className === "hist-hidden") {
        btnsContainer.style.display = "none";
        formula.style.height = "100%";
        histBtn.classList.remove("hist-hidden");
        return;
    } else {
        btnsContainer.style.display = "grid";
        formula.style.height = "90%";
        histBtn.classList.add("hist-hidden");
        return;
    }
})