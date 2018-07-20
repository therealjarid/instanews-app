// function to open a url in new tab
function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}

// selectric settings
// opted to not do this, it mucked up all my margins and I didn't see the time ROI

// $(function() {
//   $('select').selectric({
//   });
// });

// main
$(document).ready(function () {
  $('.story-text').hide();
  // execute the following code when select menu is changed
  $('select').on('change', function() {
    // clear old stories 
    $('.story-cell').remove();
    $('.story-text').remove();
    // store selected value
    var selectedStory = $(this).val();
    // restore margins if default selected
    if ( selectedStory === 'default') {
      if (window.matchMedia("(max-width: 480px)").matches === true) {
        $('header').css({"height": "85vh"});
        $('.nyt-logo').css({"width":"70%"});
        $('.nyt-logo').css({"height":"70%"});
        $('.nyt-logo').css({"max-width":"14em"});
        $('.nyt-logo').css({"max-height":"14em"});
      } else if (window.matchMedia("(min-width: 1000px)").matches === true) {
        $('.nyt-logo').css({"width": "23.5%"});
        $('.nyt-logo').css({"height": "35%"});
        $('.nyt-logo').css({"max-width": "220px"});
        $('.nyt-logo').css({"max-height": "220px"});
        $('.nyt-logo').css({"margin-left": "2em"});
        $('header').css({"height": "90vh"});
        $('header').css({"width": "100%"});
      } else if (window.matchMedia("(min-width: 600px)").matches === true) {
        $('.nyt-logo').css({"width": "23.5%"});
        $('.nyt-logo').css({"height": "35%"});
        $('.nyt-logo').css({"max-width": "220px"});
        $('.nyt-logo').css({"max-height": "220px"});
        $('header').css({"height": "90vh"});
        $('header').css({"width": "100%"});
      } else if (window.matchMedia("(min-width: 480px)").matches === true) {
        $('.nyt-logo').css({"width":"220px"});
        $('.nyt-logo').css({"height":"220px"});
        $('.nyt-logo').css({"max-width":"220px"});
        $('header').css({"height": "85vh"}); 
      } else {
        console.log('Something went wrong.');
      }
    } 
    else {
      // if we didn't select default, we'll continue to 
      // check media queries to change display of certain views,
      // then fetch data
      if (window.matchMedia("(max-width: 480px)").matches === true) {
        $('header').css({"height":"38vh"});
        $('.nyt-logo').css({"width": "40%"});
        $('.nyt-logo').css({"height": "40%"});
        $('.nyt-logo').css({"max-width": "10em"});
        $('.nyt-logo').css({"max-height": "10em"});
      } else if (window.matchMedia("(min-width: 1000px)").matches === true) {
        $('.nyt-logo').css({"width": "67px"});
        $('.nyt-logo').css({"height": "67px"});
        $('.nyt-logo').css({"max-width": "67px"});
        $('.nyt-logo').css({"max-height": "67px"});
        $('.nyt-logo').css({"margin-left": "0"});
        $('header').css({"height": "15vh"});
        $('header').css({"width": "600px"});
      } else if (window.matchMedia("(min-width: 600px)").matches === true) {
        $('.nyt-logo').css({"width": "67px"});
        $('.nyt-logo').css({"height": "67px"});
        $('.nyt-logo').css({"max-width": "67px"});
        $('.nyt-logo').css({"max-height": "67px"});
        $('header').css({"height": "15vh"});
        $('header').css({"width": "600px"});
      } else if (window.matchMedia("(min-width: 480px)").matches === true) {
        $('.nyt-logo').css({"height": "150px"});
        $('.nyt-logo').css({"width": "150px"});
        $('.nyt-logo').css({"max-width": "150px"});
        $('header').css({"height": "33vh"});  
      } else {
        console.log('Something went wrong.');
      }
      // get correct API url for the selected story type
      var url = "https://api.nytimes.com/svc/topstories/v2/" + selectedStory + ".json";
      url += '?' + $.param({
        'api-key': "eb429d0d01c04f9a8c944a8366666c40"
      });
      // get NYT data
      $.ajax({
        url: url,
        method: 'GET',
        // show loading gif only while ajax request is in process
        beforeSend: function(){
          $(".loader").show();
          $(".stories").hide();
          $("footer").hide();
         },
        complete:function(data){
          $(".loader").hide();
          $(".stories").show();
          $("footer").show();
        }
      }).done(function(data) {
        // iterate over each 'results' object
        var count = 0;
        $.each(data.results, function(key, value) {
          var storyUrl = data.results[key].url;
          // check to see if the story has an image
          if (typeof data.results[key].multimedia[4] !== 'undefined') {
            // only print the first 12 stories with pictures
            // this logic is better than data.results.slice() IMO as we don't know how many results are lacking pictures, I'd rather ensure I get 12 results no matter what... even if it results in extra loops
            count += 1;
            if (count < 13) {
              $('.stories')
              .append('<div class="story-cell" onclick="openInNewTab(\''
              + storyUrl 
              + '\');" style="cursor: pointer;"><p class="story-text">' 
              + data.results[key].abstract 
              + '</p></div>');
              // set the background image of the new story
              var imageUrl = data.results[key].multimedia[4].url;
              $(".stories").children(":last-child").css('background-image', 'url(' + imageUrl + ')');
            }
          } 
        });
        // display abstract when you hover
        $('.story-text').hide();
        $('.story-cell').hover(function(){
          var index = $(this).index();
          $(this).children().show(500);
        }, function() {
          $(this).children().hide(500);
        });
      }).fail(function() {
        alert('Something went wrong, please refresh.');
      });
    }  
  });
});