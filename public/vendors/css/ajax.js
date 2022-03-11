
$("#p1").click(function(){
$(function(){
var $show=$('#ajax');
    $.ajax({
        type:'GET',
        url:"/api",
        success:function(data){
          
           $show.append('<p id="map">'+ data+'</p>')
        }
    });
  });
 
  });
  $(document).ready(function() {
    var $btnSets = $('#responsive'),
    $btnLinks = $btnSets.find('a');
 
    $btnLinks.click(function(e) {
        e.preventDefault();
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
        var index = $(this).index();
        $("div.user-menu>div.user-menu-content").removeClass("active");
        $("div.user-menu>div.user-menu-content").eq(index).addClass("active");
    });
});

$( document ).ready(function() {
    $("[rel='tooltip']").tooltip();    
 
    $('.view').hover(
        function(){
            $(this).find('.caption').slideDown(250); //.fadeIn(250)
        },
        function(){
            $(this).find('.caption').slideUp(250); //.fadeOut(205)
        }
    ); 
});
//------------------------------------------------------------
// function initMap1(x,y) {
//   // x=31.2561
//   // y=32.2841
//   // The location of Uluru
//   var uluru = {lat: parseFloat(x), lng: parseFloat(y)};
//   // The map, centered at Uluru
//   var map = new google.maps.Map(
//       document.getElementById('map'), {zoom:16, center: uluru});
//   // The marker, positioned at Uluru
//   var marker = new google.maps.Marker({position: uluru, map: map});
// }
//   $(document).ready(function(){
//     $("p").click(function(){
//       $(this).hide();
//     });
//   });
//-------------------------------------------------------------------
// function initMap(){ 
//     var locations = [
//  ['Bondi Beach', -33.890542, 151.274856, 4],
//  ['Coogee Beach', -33.923036, 151.259052, 5],
//  ['Cronulla Beach', -34.028249, 151.157507, 3],
//  ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
//  ['Maroubra Beach', -33.950198, 151.259302, 1]
// ];

// var map = new google.maps.Map(document.getElementById('map1'), {
//  zoom: 10,
//  center: new google.maps.LatLng(-33.92, 151.25),
//  mapTypeId: google.maps.MapTypeId.ROADMAP
// });

// var infowindow = new google.maps.InfoWindow();

// var marker, i;

// for (i = 0; i < locations.length; i++) {  
//  marker = new google.maps.Marker({
//    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
//    map: map
//  });

//  google.maps.event.addListener(marker, 'click', (function(marker, i) {
//    return function() {
//      infowindow.setContent(locations[i][0]);
//      infowindow.open(map, marker);
//    }
//  })(marker, i));
// }}