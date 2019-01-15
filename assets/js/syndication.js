$(function() {
    var blogUris = [
        'http://markshevchenko.pro/feed.xml',
        'https://xenidev.github.io/feed.xml',
        'https://medium.com/feed/wemake-services',
        'https://dev.to/feed/sobolevn',
    ];

    var posts = [];
    var blogRead = 1;

    for (var i = 0; i < blogUris.length; i++) {
        $.ajax({
            url: 'https://api.rss2json.com/v1/api.json?' + $.param({ rss_url: blogUris[i] }),
            type: 'GET',
            timeout: 1000,
            dataType: 'json',
            success: function (data) {
                $.merge(posts, data.items.map(makeHtmlPostFromEntry));
                blogRead++;
    
                if (blogRead == blogUris.length) {
                    posts.sort(function (a, b) {
                        var dateA = new Date(a[0].dataset.published);
                        var dateB = new Date(b[0].dataset.published);
        
                        return dateB - dateA;
                    });
        
                    for (var j = 0; j < posts.length; j++)
                        $('#syndication').append(posts[j]);
        
                    $('#waiting').hide();
                }
            },
            error: function () {
                blogRead++;
            }
        });
    }

    function makeHtmlPostFromEntry(entry) {
        var result = $('<div class="syndication-post clearfix" data-published="' + entry.pubDate + '"></div>');

        result.append('<h2 class="syndication-post-title"><a href="' + entry.link + '">' + entry.title + '</a></h2>');
        result.append('<p class="syndication-post-author">' + entry.author + '</p>');
        result.append('<p class="syndication-post-date"><span class="fa fa-calendar"></span>' + new Date(entry.pubDate).toLocaleDateString('ru-RU') + '</p>');

        if (entry.thumbnail)
            result.append('<img class="syndication-post-image" src="' + entry.thumbnail + '" alt="' + entry.title + '" />');

        if (entry.description)
            result.append('<p class="post-summary">' + entry.description + '</p>');

        return result;
    }
});
  