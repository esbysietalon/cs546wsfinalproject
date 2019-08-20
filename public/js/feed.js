$(document).ready(function(){
    $(".back-button").click(function(){
        alert("back");
        $.post("/posts", {back: "true"});
        window.location.href = "/posts";
    });
    $(".next-button").click(function(){
        alert("next");
        $.post("/posts", {next: "true"});
        window.location.href = "/posts";
    });
    $(".page-button").click(function(){
        alert($(this).val());
        $.post("/posts", {page: $(this).val()});
        window.location.href = "/posts";
    });
    $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
            //alert("near bottom!");
        }
     });
});
