function autoAdapt(){
  var documentWidth=window.innerWidth
  document.querySelector('html').style.fontSize=documentWidth+'px'
}
window.onresize=function(){
  var documentWidth=window.innerWidth
  document.querySelector('html').style.fontSize=documentWidth+'px'
}
autoAdapt();
