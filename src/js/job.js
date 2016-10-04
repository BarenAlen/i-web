ymaps.ready(initMap);
var map;

$(document).ready(function(){

    RepositionNav();

    $(window).resize(function(){
        RepositionNav();
    });

    //.parallax(xPosition, adjuster, inertia, outerHeight) options:
    //xPosition - Horizontal position of the element
    //adjuster - y position to start from
    //inertia - speed to move relative to vertical scroll. Example: 0.1 is one tenth the speed of scrolling, 2 is twice the speed of scrolling
    //outerHeight (true/false) - Whether or not jQuery should use it's outerHeight option to determine when a section is in the viewport
     $('#header').parallax("50%", 0, 0.1, true);
    $('#vacancies').parallax("50%", 0, 0.1, true);
    $('#structure').parallax("50%", 0, 0.1, true);
    $('#work').parallax("50%", 0, 0.3, true);
    $('#how-work').parallax("50%", 0, 0.1, true);
    $('#workplace').parallax("50%", 0, 0.1, true);
    $('#team').parallax("50%", 0, 0.1, false);
    //$('#contacts').parallax("50%", 5692, 0.1, false);
    $('#contacts-bg').parallax("50%", 0, 0.1, false);

    var deck = new $.scrolldeck({
        slides: '.line',
        buttons: '.navigation a',
        easing: 'easeInOutExpo',
        offset: 5
    });

    $('.side-button').on(
        'click',
        function (e){
            e.preventDefault();
            var link = $(this).attr('target');
            var target = $('.navigation a[href=' + link + ']');
            target.click();
        }
    );
})

function initMap(){
    map = new ymaps.Map('map', {
        center: [56.844940,60.627954],
        zoom: 16
    });

    placemark = new ymaps.Placemark(
        [56.844215, 60.626103],
        {
            hintContent: 'ул. Бажова, 75А',
        },
        {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'default#image',
            // Своё изображение иконки метки.
            iconImageHref: '/assets/img/logo-map.png',
            // Размеры метки.
            iconImageSize: [73, 47],
            // Смещение левого верхнего угла иконки относительно
            // её "ножки" (точки привязки).
            iconImageOffset: [-5, -55]
        });

    map.geoObjects.add(placemark);
    map.behaviors.disable('scrollZoom');
}

function RepositionNav(){
    var windowHeight = $(window).height(); //get the height of the window
    var navHeight = $('.navigation').height() / 2;
    var windowCenter = (windowHeight / 2);
    var newtop = windowCenter - navHeight;
    $('.navigation').css({"top": newtop}); //set the new top position of the navigation list
}
