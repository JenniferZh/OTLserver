$(".nav a").on("click", function(){
    console.log('here');
    $(".nav").find(".active").removeClass("active");
    $(this).parent().addClass("active");
});