/* Hard Man Power FINAL site - shared systems (built on variant-1's working
   systems): mobile drawer, priced cart, FAQ accordion, gallery slider,
   blog category filter, honest demo forms. */
(function(){
'use strict';
document.documentElement.classList.add('js');
/* ---------- drawer ---------- */
var nav=document.querySelector('nav.mainnav');
if(nav){
  var close=document.createElement('button');close.className='nav-close';close.setAttribute('aria-label','Close menu');close.innerHTML='&times;';
  nav.insertBefore(close,nav.firstChild);
  var cartL=document.createElement('a');cartL.href='cart.html';cartL.textContent='Cart';nav.appendChild(cartL);
  var overlay=null;
  function openNav(){document.body.classList.add('nav-open');if(!overlay){overlay=document.createElement('div');overlay.className='nav-overlay';overlay.addEventListener('click',closeNav);document.body.appendChild(overlay);}}
  function closeNav(){document.body.classList.remove('nav-open');if(overlay){overlay.remove();overlay=null;}}
  var burger=document.querySelector('.burger');
  if(burger)burger.addEventListener('click',openNav);
  close.addEventListener('click',closeNav);
  nav.addEventListener('click',function(e){if(e.target.tagName==='A')closeNav();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeNav();});
}
/* ---------- cart ---------- */
var PROD={
  'black24':{name:'Royal Honey VIP',desc:'Box of 12 Sachets (20g each)',price:5,img:'assets/product-royal-box.jpg'},
  'yellow24':{name:'Black Bull Extreme',desc:'Spouted Pouch, 22g (15g)',price:5,img:'assets/product-pouch.jpg'}
};
var KEY='bh-final-cart';
var cart={};
try{var raw=localStorage.getItem(KEY);if(raw)cart=JSON.parse(raw)||{};}catch(e){cart={};}
if(!Object.keys(cart).length){
  try{var m=document.cookie.match(/(?:^|;\s*)bh-final-cart-c=([^;]*)/);if(m)cart=JSON.parse(decodeURIComponent(m[1]))||{};}catch(e){cart={};}
}
Object.keys(cart).forEach(function(id){if(!PROD[id])delete cart[id];});
function save(){
  try{localStorage.setItem(KEY,JSON.stringify(cart));}catch(e){}
  try{document.cookie='bh-final-cart-c='+encodeURIComponent(JSON.stringify(cart))+';path=/;max-age=86400;SameSite=Lax';}catch(e){}
}
function count(){var n=0;for(var id in cart)n+=cart[id];return n;}
function total(){var t=0;for(var id in cart)t+=cart[id]*PROD[id].price;return t;}
function money(n){return '$'+n;}
function badge(){
  var n=count();
  document.querySelectorAll('[data-cart-count]').forEach(function(b){b.textContent=n;b.style.display=n?'inline-flex':'none';});
}
function fly(fromEl){
  try{
    var target=document.querySelector('.cart-link');if(!fromEl||!target)return;
    var img=fromEl.closest('.rcard,.prod,.orow')||fromEl.parentElement;
    var pic=img?img.querySelector('img'):null;if(!pic)return;
    var r1=pic.getBoundingClientRect(),r2=target.getBoundingClientRect();
    var c=pic.cloneNode();c.style.cssText='position:fixed;z-index:999;pointer-events:none;border-radius:8px;left:'+r1.left+'px;top:'+r1.top+'px;width:'+r1.width+'px;height:'+r1.height+'px;object-fit:cover;transition:all .8s cubic-bezier(.5,-0.1,.3,1)';
    document.body.appendChild(c);
    requestAnimationFrame(function(){c.style.left=(r2.left+r2.width/2-14)+'px';c.style.top=(r2.top+r2.height/2-14)+'px';c.style.width='28px';c.style.height='28px';c.style.opacity='.25';});
    setTimeout(function(){c.remove();},850);
  }catch(e){}
}
function add(id,qty,fromEl){
  if(!PROD[id])return;
  cart[id]=(cart[id]||0)+(qty||1);
  if(cart[id]<=0)delete cart[id];
  save();badge();fly(fromEl);renderCart();renderCheckout();
}
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-add]');
  if(b){
    var id=b.getAttribute('data-add'),qty=1;
    var inp=document.querySelector('[data-qty-for="'+id+'"]');
    if(inp){qty=Math.max(1,parseInt(inp.value,10)||1);}
    add(id,qty,b);
  }
  var st=e.target.closest('[data-step]');
  if(st){
    var input=st.parentElement.querySelector('input');
    if(input){var v=(parseInt(input.value,10)||1)+parseInt(st.getAttribute('data-step'),10);input.value=Math.max(1,v);}
  }
  var cs=e.target.closest('[data-cstep]');
  if(cs){
    var cid=cs.getAttribute('data-cstep');
    cart[cid]=(cart[cid]||0)+parseInt(cs.getAttribute('data-d'),10);
    if(cart[cid]<=0)delete cart[cid];
    save();badge();renderCart();renderCheckout();
  }
  var rm=e.target.closest('[data-remove]');
  if(rm){delete cart[rm.getAttribute('data-remove')];save();badge();renderCart();renderCheckout();}
});
/* ---------- cart page ---------- */
function renderCart(){
  var host=document.getElementById('cart-items');if(!host)return;
  var ids=Object.keys(cart);
  var sumEl=document.getElementById('cart-summary');
  if(!ids.length){
    host.innerHTML='<div class="cart-empty"><p>Your cart is empty.</p></div>'+
    '<div class="range-grid">'+
    '<div class="rcard"><div class="rimg"><img src="assets/product-royal-box.jpg" alt="Royal Honey VIP, box of 12 sachets"></div><div class="rbody"><div class="pack">Royal Honey VIP</div><h3>Royal Honey VIP</h3><p class="desc">Box of 12 Sachets (20g each). The Ultimate Power Source.</p><div class="rrow"><span class="price">$5</span><button type="button" class="btn-gold" data-add="black24">ADD TO CART</button></div></div></div>'+
    '<div class="rcard"><div class="rimg"><img src="assets/product-pouch.jpg" alt="Black Bull Extreme, spouted pouch"></div><div class="rbody"><div class="pack">Black Bull Extreme</div><h3>Black Bull Extreme</h3><p class="desc">Spouted Pouch, 22g (15g). Don\'t Quit ...</p><div class="rrow"><span class="price">$5</span><button type="button" class="btn-gold" data-add="yellow24">ADD TO CART</button></div></div></div>'+
    '</div>';
    if(sumEl)sumEl.style.display='none';return;
  }
  if(sumEl)sumEl.style.display='';
  host.innerHTML=ids.map(function(id){
    var p=PROD[id];
    return '<div class="cart-row"><img src="'+p.img+'" alt="'+p.name+'"><div class="cinfo"><div class="cname">'+p.name+'</div><div class="cdesc">'+p.desc+' &bull; '+money(p.price)+' per box</div></div>'+
    '<span class="cqty"><button type="button" data-cstep="'+id+'" data-d="-1" aria-label="Less">&minus;</button><input value="'+cart[id]+'" readonly aria-label="Quantity"><button type="button" data-cstep="'+id+'" data-d="1" aria-label="More">+</button></span>'+
    '<span class="cline">'+money(p.price*cart[id])+'</span><button type="button" class="cart-remove" data-remove="'+id+'" aria-label="Remove">&times;</button></div>';
  }).join('');
  var st=document.getElementById('cart-subtotal');if(st)st.textContent=money(total());
  var tt=document.getElementById('cart-total');if(tt)tt.textContent=money(total());
}
/* ---------- checkout ---------- */
function renderCheckout(){
  var host=document.getElementById('co-items');if(!host)return;
  var ids=Object.keys(cart);
  host.innerHTML=ids.length?ids.map(function(id){
    var p=PROD[id];
    return '<div class="co-item"><span>'+p.name+' &times; '+cart[id]+'</span><span>'+money(p.price*cart[id])+'</span></div>';
  }).join(''):'<div class="co-item"><span>Your cart is empty.</span><span></span></div>';
  var tt=document.getElementById('co-total');if(tt)tt.textContent=money(total());
  var tm=document.getElementById('co-total-m');if(tm)tm.textContent=money(total());
}
var coForm=document.getElementById('co-form');
if(coForm){
  coForm.addEventListener('submit',function(e){
    e.preventDefault();
    if(!Object.keys(cart).length){window.location.href='index.html#range';return;}
    cart={};save();badge();
    window.location.href='thank-you.html';
  });
}
/* ---------- faq accordion (progressive: answers visible with JS off; smooth height animation) ---------- */
var fqItems=document.querySelectorAll('.fq-item');
if(fqItems.length){
  function openA(a){a.style.height=a.scrollHeight+'px';setTimeout(function(){if(a.parentElement.classList.contains('open'))a.style.height='auto';},340);}
  function closeA(a){if(a.style.height==='auto'||a.style.height===''){a.style.height=a.scrollHeight+'px';void a.offsetHeight;}a.style.height='0px';}
  fqItems.forEach(function(item,idx){
    var q=item.querySelector('.fq-q'),a=item.querySelector('.fq-a');
    if(!q||!a)return;
    a.style.height='0px';
    function setMark(){q.querySelector('.mark').textContent=item.classList.contains('open')?'\u2212':'+';}
    if(idx===0){item.classList.add('open');a.style.height='auto';}
    setMark();
    q.addEventListener('click',function(){
      var wasOpen=item.classList.contains('open');
      fqItems.forEach(function(o){if(o!==item&&o.classList.contains('open')){o.classList.remove('open');closeA(o.querySelector('.fq-a'));var om=o.querySelector('.mark');if(om)om.textContent='+';}});
      if(wasOpen){item.classList.remove('open');closeA(a);}
      else{item.classList.add('open');openA(a);}
      setMark();
    });
  });
  window.addEventListener('resize',function(){
    fqItems.forEach(function(item){var a=item.querySelector('.fq-a');if(item.classList.contains('open')&&a.style.height!=='auto')a.style.height=a.scrollHeight+'px';});
  });
}
/* ---------- gallery slider ---------- */
document.querySelectorAll('[data-gal]').forEach(function(gal){
  var track=gal.querySelector('.gal-track');if(!track)return;
  var slides=track.children.length,idx=0;
  var thumbs=gal.querySelectorAll('.gal-thumbs img');
  function go(n){
    idx=(n+slides)%slides;
    track.style.transform='translateX(-'+(idx*100)+'%)';
    thumbs.forEach(function(t,i){t.classList.toggle('on',i===idx);});
  }
  var prev=gal.querySelector('.gal-arrow.prev'),next=gal.querySelector('.gal-arrow.next');
  if(prev)prev.addEventListener('click',function(){go(idx-1);});
  if(next)next.addEventListener('click',function(){go(idx+1);});
  thumbs.forEach(function(t,i){t.addEventListener('click',function(){go(i);});});
  var sx=null;
  track.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;},{passive:true});
  track.addEventListener('touchend',function(e){
    if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;
    if(Math.abs(dx)>40)go(idx+(dx<0?1:-1));sx=null;
  },{passive:true});
  go(0);
});
/* ---------- blog filter ---------- */
var blogCards=document.querySelectorAll('.bcard[data-cat]');
if(blogCards.length){
  function applyFilter(cat){
    blogCards.forEach(function(c){c.style.display=(cat==='all'||c.getAttribute('data-cat')===cat)?'':'none';});
    document.querySelectorAll('.sidecats a').forEach(function(a){a.classList.toggle('active',a.getAttribute('data-filter')===cat);});
    var sel=document.getElementById('blog-cat-select');if(sel)sel.value=cat;
    var ddLabel=document.getElementById('cat-dd-label');
    if(ddLabel){var m=document.querySelector('.cat-dd-opt[data-cat="'+cat+'"]');if(m)ddLabel.textContent=m.textContent;}
    document.querySelectorAll('.cat-dd-opt').forEach(function(o){o.classList.toggle('active',o.getAttribute('data-cat')===cat);});
  }
  document.querySelectorAll('.sidecats a').forEach(function(a){
    a.addEventListener('click',function(e){e.preventDefault();applyFilter(a.getAttribute('data-filter'));});
  });
  var sel=document.getElementById('blog-cat-select');
  if(sel)sel.addEventListener('change',function(){applyFilter(sel.value);});
  var dd=document.getElementById('cat-dd');
  if(dd){
    var ddBtn=document.getElementById('cat-dd-btn');
    function closeDd(){dd.classList.remove('open');ddBtn.setAttribute('aria-expanded','false');}
    ddBtn.addEventListener('click',function(){var open=dd.classList.toggle('open');ddBtn.setAttribute('aria-expanded',open?'true':'false');});
    dd.querySelectorAll('.cat-dd-opt').forEach(function(o){o.addEventListener('click',function(){applyFilter(o.getAttribute('data-cat'));closeDd();});});
    document.addEventListener('click',function(e){if(!dd.contains(e.target))closeDd();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeDd();});
  }
}
/* ---------- whole-card links (product cards; the button inside still adds to cart) ---------- */
document.querySelectorAll('[data-card-link]').forEach(function(card){
  var url=card.getAttribute('data-card-link');
  card.addEventListener('click',function(e){if(e.target.closest('button,a'))return;window.location.href=url;});
  card.addEventListener('keydown',function(e){if(e.key==='Enter'&&document.activeElement===card)window.location.href=url;});
});
/* ---------- honest demo forms ---------- */
document.querySelectorAll('[data-demo-form]').forEach(function(f){
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var note=f.querySelector('.form-note');
    if(note)note.style.display='block';
    f.reset();
  });
});
badge();renderCart();renderCheckout();
})();
