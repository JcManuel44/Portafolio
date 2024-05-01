document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".sidebar");
    const navButtons = document.querySelectorAll(".nav-btn"); 
    const mainElement = document.querySelector("main"); // 

    function toggleMenu() {
        menu.classList.toggle("active");
        menuToggle.classList.toggle("active");

        if (menu.classList.contains("active")) {
            menu.style.left = "0";
        } else {
            menu.style.left = "-320px";
        }
    }

    function checkScreenWidth() {
        if (window.innerWidth > 770) {
            menu.classList.add("active");
            menuToggle.classList.add("active");
            menu.style.left = "0"; 
        } else {
            menu.classList.remove("active"); 
            menuToggle.classList.remove("active");
            menu.style.left = "-320px"; 
        }
    }

    function setActiveButton(clickedButton) {
        navButtons.forEach(button => {
            if (button === clickedButton) {
                button.classList.add("active");
            } else {
                button.classList.remove("active");
            }
        });
    }

    navButtons.forEach(button => {
        button.addEventListener("click", function () {
            setActiveButton(button);
        });
    });

    checkScreenWidth();

    window.addEventListener("resize", checkScreenWidth);

    menuToggle.addEventListener("click", function (event) {
        toggleMenu();
        event.stopPropagation();
    });

    mainElement.addEventListener("click", function (event) {
        if (!menu.contains(event.target) && !menuToggle.contains(event.target) && menu.classList.contains("active")) {
            if (window.innerWidth <= 770) {
                toggleMenu(); 
            }
        }
    });
});







document.addEventListener("DOMContentLoaded", function () {
    const customCursor = document.querySelector(".custom-cursor");

    document.addEventListener("mousemove", function (e) {
        customCursor.style.top = e.pageY + "px";
        customCursor.style.left = e.pageX + "px";
    });

    document.addEventListener("mouseover", function () {
        customCursor.style.transform = "scale(1)";
        customCursor.style.opacity = "0.5";
    });

    document.addEventListener("mouseleave", function () {
        customCursor.style.transform = "scale(0)";
        customCursor.style.opacity = "0";
    });

    document.addEventListener("click", function () {
        customCursor.style.backgroundColor = "#ff7f50";
        customCursor.style.width = "30px";
        customCursor.style.height = "30px";
        setTimeout(function () {
            customCursor.style.backgroundColor = "transparent";
            customCursor.style.width = "20px";
            customCursor.style.height = "20px";
        }, 300);
    });
});


const container = document.getElementById('container-skills');
const cards = container.querySelectorAll('.card-skills');

const cardArray = Array.from(cards);

let gameFinished = false;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const shuffledCards = shuffleArray(cardArray);

shuffledCards.forEach(card => {
    container.appendChild(card);
});

function dragStart(event) {
    if (!gameFinished) {
        dragged = event.target;
        event.dataTransfer.setData('text/plain', null);
    }
}

function dragOver(event) {
    event.preventDefault();
    if (!event.target.classList.contains('card-skills')) {
        return; 
    }

    if (!dragged) {
        event.target.classList.add('drop-target');
    }
}


function dragLeave(event) {
    if (event.target.classList.contains('card-skills')) {
        event.target.classList.remove('drop-target'); 
    }
}

function cargarFrases() {
    return fetch('https://jcmanuel44.github.io/Portafolio/Json/frases.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo JSON');
            }
            return response.json();
        })
        .then(data => data.frases)
        .catch(error => {
            console.error('Error al cargar el archivo JSON:', error);
            return [];
        });
}

function obtenerFraseAleatoria(frases) {
    const indiceAleatorio = Math.floor(Math.random() * frases.length);
    return frases[indiceAleatorio];
}

async function checkOrder() {
    try {
        const frases = await cargarFrases();
        const cards = container.querySelectorAll('.card-skills'); 
        const originalOrder = Array.from({ length: cards.length }, (_, index) => index);
        const currentOrder = Array.from(cards).map(card => parseInt(card.dataset.index));

        let correctOrder = JSON.stringify(originalOrder) === JSON.stringify(currentOrder);

        if (correctOrder) {
            cards.forEach(card => {
                card.classList.add('correct-position'); // 
            });
            finalizarRompecabezas(); 
        
            setTimeout(() => {
                cards.forEach(card => {
                    card.classList.remove('correct-position'); 
                });
        
                cards.forEach(card => {
                    card.style.cursor = "default";
                });
                gameFinished = true;
                const fraseAleatoria = obtenerFraseAleatoria(frases);
                alert(`¡Felicidades! Has completado el rompecabezas correctamente.\n<i>${fraseAleatoria}</i>`);
            }, 7000); 
        }               
    } catch (error) {
        console.error('Error en checkOrder:', error);
    }
}

function changeColorIfCorrect() {
    const cards = container.querySelectorAll('.card-skills'); 
    const originalOrder = Array.from({ length: cards.length }, (_, index) => index);
    const currentOrder = Array.from(cards).map(card => parseInt(card.dataset.index));

    let correctOrder = JSON.stringify(originalOrder) === JSON.stringify(currentOrder);

    if (correctOrder) {
        cards.forEach(card => {
            card.classList.add('correct-position'); 
        });
    } else {
        cards.forEach(card => {
            card.classList.remove('correct-position'); 
        });
    }
}

function dragDrop(event) {
    if (!gameFinished && event.target.classList.contains('card-skills') && !event.target.classList.contains('disabled')) {
        const rect = event.target.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const insertionPoint = mouseX / rect.width;
        if (insertionPoint > 0.5) {
            container.insertBefore(dragged, event.target.nextSibling);
        } else {
            container.insertBefore(dragged, event.target);
        }
        checkOrder();
        changeColorIfCorrect();
    }
}

function finalizarRompecabezas() {
   cards.forEach(card => {
    card.setAttribute('draggable', 'false'); 
    card.classList.add('disabled');
});
gameFinished = true;
}
