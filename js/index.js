$(function () {
    $('.upload-content').on('click',function (e) {
       e.stopPropagation();
    });
    $('#fileupload').fileupload({
        dataType: 'json',
        done: function (e, data) {
            $.each(data.result.files, function (index, file) {
                $('<p/>').text(file.name).appendTo($('.upload-content'));
            });
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .bar').css(
                'width',
                progress + '%'
            );
        },
        add: function (e, data) {
            data.context = $('<button/>').text('上传')
                .appendTo($('.upload-content'))
                .click(function () {
                    data.context = $('<p/>').text('Uploading...').replaceAll($(this));
                    data.submit();
                });
        },
        done: function (e, data) {
            data.context.text('上传成功');
        }
    });
    $('.upload-box').on("click",function () {
        $(this).addClass('hide');
    })
    $('.a-pendant').on('click',function () {
        $('.upload-box').removeClass('hide');
    })
});