$(function () {

  var $helper = $("<div id='dict-helper'></div>");
  $helper.appendTo("body");

  var ETYMOLOGY_DOT_COM = "http://etymonline.com/";

  var URL = ETYMOLOGY_DOT_COM + "index.php?allowed_in_frame=0&searchmode=none&search=";
  var prevQuery = "";
  var reading = false;
  var timer = null;

  function onSuccess(data) {
    // Clear previous content
    $helper.empty();
    
    // Remove images
    var $data = $(data.replace(/<img[^>]*>/g, "")).find("dl");
    $data.find(".dictionary").remove();

    // Remove unmatch terms. Ex: remove "condescending" when query=="condescend"
    $data.find("dt a").each(function () {
      var $e = $(this);
      if ($e.text().replace(/ \(.*$/g, '') != prevQuery) {
	$e.parent().next().remove();
	$e.parent().remove();
      }
    });

    // Prepend Etymology.com to hyperlinks
    $data.find('a').each(function () {
      var $e = $(this);
      $e.attr('href', ETYMOLOGY_DOT_COM + $e.attr('href'));
      $e.attr('target', '_blank');
    });

    // Append crawled data to helper pop-up
    $helper.append($data);
    $helper.append("<a href='" + URL + prevQuery + "'  target='_blank'>more...</a>");

    // Fade in pop-up
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
