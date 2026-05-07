// add bootstrap classes to tables
$(document).ready(function() {
  $('table').each(function() {
    if (document.documentElement.getAttribute("data-theme") == "dark") {
      $(this).addClass('table-dark');
    } else {
      $(this).removeClass('table-dark');
    }

    // skip tables inside news, cards, code blocks, or blog post body
    if($(this).parents('[class*="news"]').length==0 &&
        $(this).parents('[class*="card"]').length==0 &&
        $(this).parents('code').length == 0 &&
        $(this).parents('.post-content').length == 0) {
      $(this).attr('data-toggle','table');
      // add some classes to make the table look better
      // $(this).addClass('table-sm');
      $(this).addClass('table-hover');
    }
  })
});

