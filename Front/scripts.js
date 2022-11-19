window.onload=function(){
    
    var menu3 = document.getElementById('menu3');
    var menu1 = document.getElementById('menu1');
    var cont = document.getElementById('cont');
    var card1 = document.getElementById('card1');
    var card2 = document.getElementById('card2');
    var card3 = document.getElementById('card3');
    

    menu1.addEventListener('click', function () {
        cont.classList.remove('vertical');
        cont.classList.add('horizontal');
        card1.classList.remove('vertical');
        card1.classList.add('horizontal');
        card2.classList.remove('vertical');
        card2.classList.add('horizontal');
        card3.classList.remove('vertical');
        card3.classList.add('horizontal');
    });
    menu3.addEventListener('click', function () {
        cont.classList.remove('horizontal');
        cont.classList.add('vertical');
        card1.classList.remove('horizontal');
        card1.classList.add('vertical');
        card2.classList.remove('horizontal');
        card2.classList.add('vertical');
        card3.classList.remove('horizontal');
        card3.classList.add('vertical');
    });
    
}
