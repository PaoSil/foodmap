function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: {lat: -34.397, lng: -150.644}
  });
}

var addFilters = (function(element) {
  var filtersArr = [];
  for (var i = 0; i < restaurants.length; i++) {
    for (var n = 0; n < restaurants[i].filters.length; n++) {
      filtersArr.push(restaurants[i].filters[n]);
    }
  }
  var uniqueFilters = [...new Set(filtersArr)];
  var filtersFinal = uniqueFilters.sort();
  for (var a = 0; a < filtersFinal.length; a++) {
    element.append("<option value='"+filtersFinal[a]+"'>"+filtersFinal[a]+"");
  };
  return filtersFinal;
});

$(document).ready(function() {
  addFilters($('#filter'));
  setTimeout(function() {
    $('#loader').fadeOut();
    $('#main-container').fadeIn();
  }, 1000);
  setTimeout(function() {
    initMap();
  }, 1000);
  /* Iniciando Modales */
  $('.modal').modal();
  $('#add-restaurants-btn').click(function() {
    $('#modal-add-restaurant').modal('open');
  });

  $('#restaurant-name, #restaurant-address, #restaurant-filters, #restaurant-photo, #restaurant-website').keyup(function() {
    var valueName = $('#restaurant-name').val().length;
    var valueAddress = $('#restaurant-address').val().length;
    var valueFilters = $('#restaurant-filters').val().length;
    var valuePhoto = $('#restaurant-photo').val().length;
    var valueWebsite = $('#restaurant-website').val().length;

    if (valueName > 0 && valueAddress > 0 && valueFilters > 0 && valuePhoto > 0 && valueWebsite > 0) {
      $('#send-data-btn').removeClass('disabled');
    } else {
      $('#send-data-btn').addClass('disabled');
    }
  });

  $('#send-data-btn').click(function() {
    var takeName = $('#restaurant-name').val();
    var takeAddress = [$('#restaurant-address').val()];
    var takeFilters = $('#restaurant-filters').val().split('');
    var takePhoto = $('#restaurant-photo').val();
    var takeWebsite = $('#restaurant-website').val();
    var checkUrl = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    var checkImg = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|png)/;
    if (checkImg.test(takePhoto) && checkUrl.test(takeWebsite)) {
      restaurants.push({name: takeName, address: takeAddress, filters: takeFilters, photo: "<img src='"+takePhoto+"' alt='"+takeName+"'' class='mouseover'>", website: takeWebsite});
      $('#modal-add-restaurant').modal('close');
    } else {
      alert('Input not Valid');
    }
  });

  $('#filter').change(function() {
    $('#restaurants-container').children().remove();
    var selection = $('select').val();
    for (var i = 0; i < restaurants.length; i++) {
      for (var n = 0; n < restaurants[i].filters.length; n++) {
        if (restaurants[i].filters[n] === selection) {
          var image = restaurants[i].photo;
          $("#restaurants-container").append("<div class='col s12 l6 xl6'><div class='container-img-p'><p class='overlay-text'>"+restaurants[i].name+"</p>"+image+"</div></div>");
        }
      }
    };

    /* Efecto mouseover*/

    $('.container-img-p').mouseover(function() {
      $(':nth-child(1)', this).css({'opacity': '1'});
    });

    $('.container-img-p').mouseout(function() {
      $(':nth-child(1)', this).css({'opacity': '0'});
    });

    /* Determinando el contenido del modal*/
    $('.container-img-p').click(function() {
      var place = $(this).children('img').attr('alt');
      for (var i = 0; i < restaurants.length; i++) {
        if (place === restaurants[i].name) {
          $('#title-modal').empty();
          $('#modal-data').empty();
          $('#title-modal').html(restaurants[i].name);
          $('#modal-map').empty();
          var newName = restaurants[i].name.replace(/ /g, '+');
          for (var n = 0; n < restaurants[i].address.length; n++) {
            var newAddress = restaurants[i].address[n].replace(/ /g, '+');
            var addressGoogle = newAddress.replace(/,/g, '');
            $('#modal-map').append("<iframe src='https://www.google.com/maps/embed/v1/place?key=AIzaSyAR26jcQ0wriBfIDM3j327c80TqkZjw8-A&q="+addressGoogle+"'allowfullscreen></iframe>");
            $('#modal-data').append('<p>' + restaurants[i].address[n] + '</p>');
          }
          $('#modal-data').append("<p><a href='"+restaurants[i].website+"'>"+restaurants[i].website+"</a></p>");
        }
      }
      $('#modal').modal('open');

      $('.modal-overlay').click(function() {
        $('#restaurants-container').children().remove();
        $('#filter').val(null);
      });
    });
  });
});
