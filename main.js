
var appTrivial = (function () {

    function getQuestions(callback) {
        var serverData = [
            {
                question:
                    {
                        id: 1, text: '¿Capital de Honduras?'
                    },
                answers: [
                    {
                        id: 1, text: 'Tegucigalpa'
                    },
                    {
                        id: 2, text: 'Lima'
                    },
                    {
                        id: 3, text: 'Buenos Aires'
                    }
                ],
                correctAnswerId: 1
            },
            {
                question:
                    {
                        id: 2, text: 'Rio que pasa por Toledo'
                    },
                answers: [
                    {
                        id: 4, text: 'Miño'
                    },
                    {
                        id: 5, text: 'Tajo'
                    },
                    {
                        id: 6, text: 'Duero'
                    }
                ],
                correctAnswerId: 5
            },
            {
                question:
                    {
                        id: 3, text: 'Color Bandera de Argentina'
                    },
                answers: [
                    {
                        id: 7, text: 'Rojo Blanco'
                    },
                    {
                        id: 8, text: 'Blanco y Verde'
                    },
                    {
                        id: 9, text: 'Azul Blanco Azul'
                    }
                ],
                correctAnswerId: 9
            },
            {
                question:
                    {
                        id: 3, text: '¿Quién pintó la capilla sixtina?'
                    },
                answers: [
                    {
                        id: 7, text: 'Picasso'
                    },
                    {
                        id: 8, text: 'Velazquez'
                    },
                    {
                        id: 9, text: 'Miguel Angel'
                    }
                ],
                correctAnswerId: 9
            },
        ];

        callback(serverData);
    }
    var questions = [];
    getQuestions(function (data) {
        questions = data;
    });

    var RESPUESTA = {
        ACERTADA: 1,
        FALLIDA: 2,
        VACIA: 0
    };
    var preguntaObtenida;
    var segundos = 0;
    var puntos = 0;
    var miRespuestaElegida;
    var ok = 0;
    var noOk = 0;
    var t;

    function getQuestionRamdon() {
        var posicionDeAleatorio = Math.floor(Math.random() * questions.length);
        var preguntaAdevolver = questions[posicionDeAleatorio];
        questions.splice(posicionDeAleatorio, 1);
        return preguntaAdevolver;
    }

    function pintarPregunta() {
        preguntaObtenida = getQuestionRamdon();
        var listaContenedora = '';
        var tituloDePreguntaObtenida = preguntaObtenida.question.text;
        var respuestasDePreguntaObtenida = preguntaObtenida.answers;
        document.getElementById('preguntas').innerHTML = tituloDePreguntaObtenida;
        for (var i = 0; i < respuestasDePreguntaObtenida.length; i++) {
            var estructuraRespuesta = '<li><input id= "item-' + i + '" name = "answers" type="radio" value = "'
                + respuestasDePreguntaObtenida[i].id + '">' + respuestasDePreguntaObtenida[i].text + ' </li>';
            listaContenedora += estructuraRespuesta;
        }
        document.getElementById('listaRespuestas').innerHTML = listaContenedora;
    }

    function mensajeRespuestas(mensaje) {
        document.getElementById('mensaje').innerHTML = mensaje;
    }

    function esRespuestaCorrecta() {
        miRespuestaElegida = document.miformulario.answers.value;
        var resultado;
        if (miRespuestaElegida === '') {
            resultado = RESPUESTA.VACIA;
            mensajeRespuestas('Contesta algo porfi');
        } else if (parseInt(miRespuestaElegida) === preguntaObtenida.correctAnswerId) {
            resultado = RESPUESTA.ACERTADA;
            mensajeRespuestas('Has acertado');
        } else if (parseInt(miRespuestaElegida) !== preguntaObtenida.correctAnswerId) {
            resultado = RESPUESTA.FALLIDA;
            mensajeRespuestas('Has fallado');
        }
        return resultado;
    }

    function reloj() {
        if (segundos > 9) {
            document.getElementById('displayReloj').innerHTML = segundos;
        } else {
            document.getElementById('displayReloj').innerHTML = '0' + segundos;
        }
        if (segundos === 20) {
            siguientePregunta();
        } else {
            clearTimeout(t);
            t = setTimeout(function () {
                reloj();
            }, 1000);
            segundos++;
        }
    }

    function siguientePregunta() {
        if (esRespuestaCorrecta() === RESPUESTA.ACERTADA) {
            recalcularMarcadorAcierto();
            document.getElementById('ok').innerHTML = ++ok;
        }
        if (esRespuestaCorrecta() === RESPUESTA.FALLIDA) {
            recalcularMarcadorFallo();
            document.getElementById('noOk').innerHTML = ++noOk;
        }
        if (esRespuestaCorrecta() === RESPUESTA.VACIA) {
            recalcularNoContesta();
        }
        if (questions.length > 0) {
            clearTimeout(t);
            pintarPregunta();
            segundos = 0;
            mensajeRespuestas('');
            reloj();
        } else {
            document.getElementById('puntos').innerHTML = puntos + ' puntos';
            document.getElementById('siguiente').style.display = 'none';
        }
    }

    function recalcularNoContesta() {
        if (segundos === '') {
            puntos += - 2;
            console.log(segundos + 'menos 2');
        }
        if (segundos >= 19) {
            puntos += - 3;
            console.log(segundos + 'menos 3');
        }
    }

    function recalcularMarcadorAcierto() {
        if (segundos <= 2) {
            puntos += + 2;
            console.log(segundos + 'mas dos')
        }
        if (segundos >= 2 && segundos < 10) {
            puntos += 1;
            console.log(segundos + 'mas uno')
        }
        if (segundos > 10) {
            puntos;
            console.log(segundos + '0 puntos')
        }
    }

    function recalcularMarcadorFallo() {
        if (segundos > 10) {
            puntos += - 2;
            console.log(segundos + 'menos dos puntos')
        }
        if (segundos <= 10) {
            puntos += - 1;
            console.log(segundos + 'menos 1 punto')
        }
    }

    function iniciar() {
        pintarPregunta();
        reloj();
        document.getElementById('enviar').addEventListener('click', esRespuestaCorrecta);
        document.getElementById('siguiente').addEventListener('click', siguientePregunta);
    }

    return {
        iniciar: iniciar
    };

})();

document.getElementById('iniciar').addEventListener('click', function(){
    document.getElementsByClassName('overlay')[0].style.display = 'none';
    appTrivial.iniciar();
});
