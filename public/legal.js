document.querySelectorAll("[data-biz]").forEach(el=>{
  const v=(window.BIZ||{})[el.dataset.biz];
  el.textContent=v||"[입력 필요]";
  if(!v) el.classList.add("todo");
});
