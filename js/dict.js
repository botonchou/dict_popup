$(function () {

  var $helper = $("<div id='dict-helper'></div>");
  $helper.appendTo("body");

  var URL = "http://etymonline.com/index.php?allowed_in_frame=0&searchmode=none&search=";
  var prevQuery = "";
  var reading = false;
  var timer = null;

  function onSuccess(data) {
    $helper.empty();
    
    // Remove images
    var $data = $(data.replace(/<img[^>]*>/g, "")).find("dl");

    var first  = $($data.find("dt")[0]).find("a").text().replace(/ \(.*$/g, '');
    var second = $($data.find("dt")[1]).find("a").text().replace(/ \(.*$/g, '');

    var N = (first == second) ? 1 : 0;
    $($data.find("dd")[N]).nextAll().remove();

    $helper.append($data);
    $helper.append("<a href='" + URL + prevQuery + "'  target='_blank'>more...</a>");

    $helper.fadeIn();
  }

  $(document)
  .on("mouseover", "h2", function(event) {

      var query = $(event.target).text();

      // If query contains non-english characters, do nothing...
      if (/[^\x00-\x7F]+/.test(query))
	return true;

      if (query == prevQuery) {
	$helper.fadeIn();
	return true;
      }

      prevQuery = query;

      $.ajax({
	url: 'http://140.112.21.18/urlget.php',
	data: {url: URL + prevQuery},
	success: onSuccess
      });

  })
  .on("mouseout", "h2", function (event) {
    clearTimeout(timer);

    timer = setTimeout(function () {
      $helper.fadeOut();
    }, 10000);

  });

});
