$(document).ready(function(){
    $(".back-button").click(function(){
        $.post("/posts", {back: "true"});
        window.location.href = "/posts";
    });
    $(".next-button").click(function(){
        $.post("/posts", {next: "true"});
        window.location.href = "/posts";
    });
    $(".page-button").click(function(){
        $.post("/posts", {page: $(this).val()});
        window.location.href = "/posts";
    });
});
