const ports = Array.from({length:11}, (_,i)=>3000+i);
(async ()=>{
  for(const p of ports){
    try{
      const res = await fetch(`http://localhost:${p}/`);
      console.log(p, '->', res.status);
    }catch(e){
      //console.log(p, 'down');
    }
  }
})();