parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"crkq":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Animation=d,exports.setImagePath=O,exports.setAudioPath=k,exports.setDataPath=I,exports.loadImage=M,exports.loadAudio=L,exports.loadData=D,exports.load=C,exports.init=a,exports.getCanvas=h,exports.getContext=r,exports.on=s,exports.off=n,exports.emit=o,exports.GameLoop=R,exports.initKeys=$,exports.bindKeys=q,exports.unbindKeys=F,exports.keyPressed=B,exports.registerPlugin=J,exports.unregisterPlugin=Q,exports.extendObject=V,exports.initPointer=pt,exports.track=ft,exports.untrack=gt,exports.pointerOver=mt,exports.onPointerDown=xt,exports.onPointerUp=_t,exports.pointerPressed=wt,exports.Pool=bt,exports.Quadtree=jt,exports.Sprite=Ot,exports.SpriteSheet=Mt,exports.setStoreItem=Lt,exports.getStoreItem=Dt,exports.TileEngine=Ct,exports.Vector=St,exports.default=exports.pointer=exports.keyMap=exports.dataAssets=exports.audioAssets=exports.imageAssets=void 0;let t,e,i={};function s(t,e){i[t]=i[t]||[],i[t].push(e)}function n(t,e){let s;!i[t]||(s=i[t].indexOf(e))<0||i[t].splice(s,1)}function o(t,...e){i[t]&&i[t].map(t=>t(...e))}function h(){return t}function r(){return e}function a(i){if(!(t=document.getElementById(i)||i||document.querySelector("canvas")))throw Error("You must provide a canvas element for the game");return(e=t.getContext("2d")).imageSmoothingEnabled=!1,o("init"),{canvas:t,context:e}}class c{constructor({spriteSheet:t,frames:e,frameRate:i,loop:s=!0}={}){this.spriteSheet=t,this.frames=e,this.frameRate=i,this.loop=s;let{width:n,height:o,margin:h=0}=t.frame;this.width=n,this.height=o,this.margin=h,this._f=0,this._a=0}clone(){return d(this)}reset(){this._f=0,this._a=0}update(t=1/60){if(this.loop||this._f!=this.frames.length-1)for(this._a+=t;this._a*this.frameRate>=1;)this._f=++this._f%this.frames.length,this._a-=1/this.frameRate}render({x:t,y:e,width:i=this.width,height:s=this.height,context:n=r()}={}){let o=this.frames[this._f]/this.spriteSheet._f|0,h=this.frames[this._f]%this.spriteSheet._f|0;n.drawImage(this.spriteSheet.image,h*this.width+(2*h+1)*this.margin,o*this.height+(2*o+1)*this.margin,this.width,this.height,t,e,i,s)}}function d(t){return new c(t)}d.prototype=c.prototype,d.class=c;let l=/(jpeg|jpg|gif|png)$/,u=/(wav|mp3|ogg|aac)$/,p=/^\//,f=/\/$/,g=new WeakMap,m="",x="",_="";function w(t,e){return new URL(t,e).href}function y(t,e){return[t.replace(f,""),t?e.replace(p,""):e].filter(t=>t).join("/")}function b(t){return t.split(".").pop()}function v(t){let e=t.replace("."+b(t),"");return 2==e.split("/").length?e.replace(p,""):e}function A(t){return{wav:"",mp3:t.canPlayType("audio/mpeg;"),ogg:t.canPlayType('audio/ogg; codecs="vorbis"'),aac:t.canPlayType("audio/aac;")}}let j={};exports.imageAssets=j;let P={};exports.audioAssets=P;let S={};function E(){window.__k||(window.__k={dm:g,u:w,d:S,i:j})}function O(t){m=t}function k(t){x=t}function I(t){_=t}function M(t){return E(),new Promise((e,i)=>{let s,n,h;if(s=y(m,t),j[s])return e(j[s]);(n=new Image).onload=function(){h=w(s,window.location.href),j[v(t)]=j[s]=j[h]=this,o("assetLoaded",this,t),e(this)},n.onerror=function(){i("Unable to load image "+s)},n.src=s})}function L(t){return new Promise((e,i)=>{let s,n,h,r;return s=new Audio,n=A(s),(t=[].concat(t).reduce((t,e)=>t||(n[b(e)]?e:null),0))?(h=y(x,t),P[h]?e(P[h]):(s.addEventListener("canplay",function(){r=w(h,window.location.href),P[v(t)]=P[h]=P[r]=this,o("assetLoaded",this,t),e(this)}),s.onerror=function(){i("Unable to load audio "+h)},s.src=h,void s.load())):i("cannot play any of the audio formats provided"+t)})}function D(t){let e,i;return E(),e=y(_,t),S[e]?Promise.resolve(S[e]):fetch(e).then(t=>{if(!t.ok)throw t;return t.clone().json().catch(()=>t.text())}).then(s=>(i=w(e,window.location.href),"object"==typeof s&&g.set(s,i),S[v(t)]=S[e]=S[i]=s,o("assetLoaded",s,t),s))}function C(...t){return E(),Promise.all(t.map(t=>{let e=b([].concat(t)[0]);return e.match(l)?M(t):e.match(u)?L(t):D(t)}))}exports.dataAssets=S;const Y=()=>{};function z(){let t=h();r().clearRect(0,0,t.width,t.height)}function R({fps:t=60,clearCanvas:e=!0,update:i,render:s}={}){if(!i||!s)throw Error("You must provide update() and render() functions");let n,h,r,a,c,d=0,l=1e3/t,u=1/t,p=e?z:Y;function f(){if(h=requestAnimationFrame(f),r=performance.now(),a=r-n,n=r,!(a>1e3)){for(o("tick"),d+=a;d>=l;)c.update(u),d-=l;p(),c.render()}}return c={update:i,render:s,isStopped:!0,start(){n=performance.now(),this.isStopped=!1,requestAnimationFrame(f)},stop(){this.isStopped=!0,cancelAnimationFrame(h)},_frame:f,set _last(t){n=t}}}let W={},T={},U={13:"enter",27:"esc",32:"space",37:"left",38:"up",39:"right",40:"down"};function K(t){let e=U[t.which];T[e]=!0,W[e]&&W[e](t)}function N(t){T[U[t.which]]=!1}function X(){T={}}function $(){let t;for(t=0;t<26;t++)U[65+t]=(10+t).toString(36);for(t=0;t<10;t++)U[48+t]=""+t;window.addEventListener("keydown",K),window.addEventListener("keyup",N),window.addEventListener("blur",X)}function q(t,e){[].concat(t).map(t=>W[t]=e)}function F(t){[].concat(t).map(t=>W[t]=0)}function B(t){return!!T[t]}function G(t){let e=t.substr(t.search(/[A-Z]/));return e[0].toLowerCase()+e.substr(1)}function H(t,e){let i=t.indexOf(e);-1!==i&&t.splice(i,1)}function J(t,e){let i=t.prototype;i&&(i._inc||(i._inc={},i._bInc=function(t,e,...i){return this._inc[e].before.reduce((e,i)=>{let s=i(t,...e);return s||e},i)},i._aInc=function(t,e,i,...s){return this._inc[e].after.reduce((e,i)=>{let n=i(t,e,...s);return n||e},i)}),Object.getOwnPropertyNames(e).forEach(t=>{let s=G(t);i[s]&&(i["_o"+s]||(i["_o"+s]=i[s],i[s]=function(...t){let e=this._bInc(this,s,...t),n=i["_o"+s].call(this,...e);return this._aInc(this,s,n,...t)}),i._inc[s]||(i._inc[s]={before:[],after:[]}),t.startsWith("before")?i._inc[s].before.push(e[t]):t.startsWith("after")&&i._inc[s].after.push(e[t]))}))}function Q(t,e){let i=t.prototype;i&&i._inc&&Object.getOwnPropertyNames(e).forEach(t=>{let s=G(t);t.startsWith("before")?H(i._inc[s].before,e[t]):t.startsWith("after")&&H(i._inc[s].after,e[t])})}function V(t,e){let i=t.prototype;i&&Object.getOwnPropertyNames(e).forEach(t=>{i[t]||(i[t]=e[t])})}exports.keyMap=U;let Z=[],tt=[],et={},it=[],st={},nt={0:"left",1:"middle",2:"right"},ot={x:0,y:0,radius:5};function ht(t){let e=t.x,i=t.y;t.anchor&&(e-=t.width*t.anchor.x,i-=t.height*t.anchor.y);let s=ot.x-Math.max(e,Math.min(ot.x,e+t.width)),n=ot.y-Math.max(i,Math.min(ot.y,i+t.height));return s*s+n*n<ot.radius*ot.radius}function rt(){let t,e,i=tt.length?tt:Z;for(let s=i.length-1;s>=0;s--)if(e=(t=i[s]).collidesWithPointer?t.collidesWithPointer(ot):ht(t))return t}function at(t){let e=void 0!==t.button?nt[t.button]:"left";st[e]=!0,ut(t,"onDown")}function ct(t){let e=void 0!==t.button?nt[t.button]:"left";st[e]=!1,ut(t,"onUp")}function dt(t){ut(t,"onOver")}function lt(){st={}}function ut(t,e){let i,s,n=h();if(!n)return;-1!==["touchstart","touchmove","touchend"].indexOf(t.type)?(i=(t.touches[0]||t.changedTouches[0]).clientX,s=(t.touches[0]||t.changedTouches[0]).clientY):(i=t.clientX,s=t.clientY);let o=n.height/n.offsetHeight,r=n.getBoundingClientRect(),a=(i-r.left)*o,c=(s-r.top)*o;ot.x=a,ot.y=c,t.preventDefault();let d=rt();d&&d[e]&&d[e](t),et[e]&&et[e](t,d)}function pt(){let t=h();t.addEventListener("mousedown",at),t.addEventListener("touchstart",at),t.addEventListener("mouseup",ct),t.addEventListener("touchend",ct),t.addEventListener("blur",lt),t.addEventListener("mousemove",dt),t.addEventListener("touchmove",dt),s("tick",()=>{tt.length=0,Z.map(t=>{tt.push(t)}),Z.length=0})}function ft(t){[].concat(t).map(t=>{t._r||(t._r=t.render,t.render=function(){Z.push(this),this._r()},it.push(t))})}function gt(t){[].concat(t).map(t=>{t.render=t._r,t._r=0;let e=it.indexOf(t);-1!==e&&it.splice(e,1)})}function mt(t){return!!it.includes(t)&&rt()===t}function xt(t){et.onDown=t}function _t(t){et.onUp=t}function wt(t){return!!st[t]}exports.pointer=ot;class yt{constructor({create:t,maxSize:e=1024}={}){let i;if(!t||!(i=t())||!(i.update&&i.init&&i.isAlive))throw Error("Must provide create() function which returns an object with init(), update(), and isAlive() functions");this._c=t,this._i=0,this.objects=[t()],this.size=1,this.maxSize=e}get(t={}){if(this.objects.length==this._i){if(this.size===this.maxSize)return;for(let t=0;t<this.size&&this.objects.length<this.maxSize;t++)this.objects.unshift(this._c());this.size=this.objects.length}let e=this.objects.shift();return e.init(t),this.objects.push(e),this._i++,e}getAliveObjects(){return this.objects.slice(this.objects.length-this._i)}clear(){this._i=this.objects.length=0,this.size=1,this.objects.push(this._c())}update(t){let e,i=this.size-1,s=Math.max(this.objects.length-this._i,0);for(;i>=s;)(e=this.objects[i]).update(t),e.isAlive()?i--:(this.objects=this.objects.splice(i,1).concat(this.objects),this._i--,s++)}render(){let t=Math.max(this.objects.length-this._i,0);for(let e=this.size-1;e>=t;e--)this.objects[e].render()}}function bt(t){return new yt(t)}function vt(t,e){let i=[],s=e.x+e.width/2,n=e.y+e.height/2,o=t.y<n&&t.y+t.height>=e.y,h=t.y+t.height>=n&&t.y<e.y+e.height;return t.x<s&&t.x+t.width>=e.x&&(o&&i.push(0),h&&i.push(2)),t.x+t.width>=s&&t.x<e.x+e.width&&(o&&i.push(1),h&&i.push(3)),i}bt.prototype=yt.prototype,bt.class=yt;class At{constructor({maxDepth:t=3,maxObjects:e=25,bounds:i}={}){this.maxDepth=t,this.maxObjects=e;let s=h();this.bounds=i||{x:0,y:0,width:s.width,height:s.height},this._b=!1,this._d=0,this._o=[],this._s=[],this._p=null}clear(){this._s.map(function(t){t.clear()}),this._b=!1,this._o.length=0}get(t){let e,i,s=new Set;for(;this._s.length&&this._b;){for(e=vt(t,this.bounds),i=0;i<e.length;i++)this._s[e[i]].get(t).forEach(t=>s.add(t));return Array.from(s)}return this._o.filter(e=>e!==t)}add(){let t,e,i,s;for(e=0;e<arguments.length;e++)if(i=arguments[e],Array.isArray(i))this.add.apply(this,i);else if(this._b)this._a(i);else if(this._o.push(i),this._o.length>this.maxObjects&&this._d<this.maxDepth){for(this._sp(),t=0;s=this._o[t];t++)this._a(s);this._o.length=0}}_a(t,e,i){for(e=vt(t,this.bounds),i=0;i<e.length;i++)this._s[e[i]].add(t)}_sp(t,e,i){if(this._b=!0,!this._s.length)for(t=this.bounds.width/2|0,e=this.bounds.height/2|0,i=0;i<4;i++)this._s[i]=jt({bounds:{x:this.bounds.x+(i%2==1?t:0),y:this.bounds.y+(i>=2?e:0),width:t,height:e},maxDepth:this.maxDepth,maxObjects:this.maxObjects}),this._s[i]._d=this._d+1,this._s[i]._p=this}}function jt(t){return new At(t)}jt.prototype=At.prototype,jt.class=At;class Pt{constructor(t=0,e=0){this._x=t,this._y=e}add(t,e=1){return St(this.x+(t.x||0)*e,this.y+(t.y||0)*e,this)}clamp(t,e,i,s){this._c=!0,this._a=t,this._b=e,this._d=i,this._e=s}get x(){return this._x}get y(){return this._y}set x(t){this._x=this._c?Math.min(Math.max(this._a,t),this._d):t}set y(t){this._y=this._c?Math.min(Math.max(this._b,t),this._e):t}}function St(t,e,i={}){let s=new Pt(t,e);return i._c&&(s.clamp(i._a,i._b,i._d,i._e),s.x=t,s.y=e),s}St.prototype=Pt.prototype,St.class=Pt;class Et{constructor(t){this.init(t)}init(t={}){let{x:e,y:i,dx:s,dy:n,ddx:o,ddy:h,width:a,height:c,image:d}=t;this.position=St(e,i),this.velocity=St(s,n),this.acceleration=St(o,h),this._fx=this._fy=1,this.width=this.height=this.rotation=0,this.ttl=1/0,this.anchor={x:0,y:0},this.context=r();for(let r in t)this[r]=t[r];d&&(this.width=void 0!==a?a:d.width,this.height=void 0!==c?c:d.height),this.sx=0,this.sy=0}get x(){return this.position.x}get y(){return this.position.y}get dx(){return this.velocity.x}get dy(){return this.velocity.y}get ddx(){return this.acceleration.x}get ddy(){return this.acceleration.y}get animations(){return this._a}get viewX(){return this.x-this.sx}get viewY(){return this.y-this.sy}get width(){return this._w}get height(){return this._h}set x(t){this.position.x=t}set y(t){this.position.y=t}set dx(t){this.velocity.x=t}set dy(t){this.velocity.y=t}set ddx(t){this.acceleration.x=t}set ddy(t){this.acceleration.y=t}set animations(t){let e,i;for(e in this._a={},t)this._a[e]=t[e].clone(),i=i||this._a[e];this.currentAnimation=i,this.width=this.width||i.width,this.height=this.height||i.height}set viewX(t){}set viewY(t){}set width(t){let e=t<0?-1:1;this._fx=e,this._w=t*e}set height(t){let e=t<0?-1:1;this._fy=e,this._h=t*e}isAlive(){return this.ttl>0}collidesWith(t){if(this.rotation||t.rotation)return null;let e=this.x-this.width*this.anchor.x,i=this.y-this.height*this.anchor.y,s=t.x,n=t.y;return t.anchor&&(s-=t.width*t.anchor.x,n-=t.height*t.anchor.y),e<s+t.width&&e+this.width>s&&i<n+t.height&&i+this.height>n}update(t){this.advance(t)}render(){this.draw()}playAnimation(t){this.currentAnimation=this.animations[t],this.currentAnimation.loop||this.currentAnimation.reset()}advance(t){this.velocity=this.velocity.add(this.acceleration,t),this.position=this.position.add(this.velocity,t),this.ttl--,this.currentAnimation&&this.currentAnimation.update(t)}draw(){let t=-this.width*this.anchor.x,e=-this.height*this.anchor.y;if(this.context.save(),this.context.translate(this.viewX,this.viewY),this.rotation&&this.context.rotate(this.rotation),-1==this._fx||-1==this._fy){let i=this.width/2+t,s=this.height/2+e;this.context.translate(i,s),this.context.scale(this._fx,this._fy),this.context.translate(-i,-s)}this.image?this.context.drawImage(this.image,0,0,this.image.width,this.image.height,t,e,this.width,this.height):this.currentAnimation?this.currentAnimation.render({x:t,y:e,width:this.width,height:this.height,context:this.context}):(this.context.fillStyle=this.color,this.context.fillRect(t,e,this.width,this.height)),this.context.restore()}}function Ot(t){return new Et(t)}function kt(t){if(+t===t)return t;let e=[],i=t.split(".."),s=+i[0],n=+i[1],o=s;if(s<n)for(;o<=n;o++)e.push(o);else for(;o>=n;o--)e.push(o);return e}Ot.prototype=Et.prototype,Ot.class=Et;class It{constructor({image:t,frameWidth:e,frameHeight:i,frameMargin:s,animations:n}={}){if(!t)throw Error("You must provide an Image for the SpriteSheet");this.animations={},this.image=t,this.frame={width:e,height:i,margin:s},this._f=t.width/e|0,this.createAnimations(n)}createAnimations(t){let e,i;for(i in t){let{frames:s,frameRate:n,loop:o}=t[i];if(e=[],void 0===s)throw Error("Animation "+i+" must provide a frames property");[].concat(s).map(t=>{e=e.concat(kt(t))}),this.animations[i]=d({spriteSheet:this,frames:e,frameRate:n,loop:o})}}}function Mt(t){return new It(t)}function Lt(t,e){void 0===e?localStorage.removeItem(t):localStorage.setItem(t,JSON.stringify(e))}function Dt(t){let e=localStorage.getItem(t);try{e=JSON.parse(e)}catch(i){}return e}function Ct(t={}){let{width:e,height:i,tilewidth:s,tileheight:n,context:o=r(),tilesets:a,layers:c}=t,d=e*s,l=i*n,u=document.createElement("canvas"),p=u.getContext("2d");u.width=d,u.height=l;let f={},g={},m=[],x=Object.assign({context:o,mapwidth:d,mapheight:l,_sx:0,_sy:0,_d:!1,get sx(){return this._sx},get sy(){return this._sy},set sx(t){this._sx=Math.min(Math.max(0,t),d-h().width),m.forEach(t=>t.sx=this._sx)},set sy(t){this._sy=Math.min(Math.max(0,t),l-h().height),m.forEach(t=>t.sy=this._sy)},render(){this._d&&(this._d=!1,this._p()),b(u)},renderLayer(t){let e=g[t],i=f[t];e||((e=document.createElement("canvas")).width=d,e.height=l,g[t]=e,x._r(i,e.getContext("2d"))),b(e)},layerCollidesWith(t,e){let i=e.x,s=e.y;e.anchor&&(i-=e.width*e.anchor.x,s-=e.height*e.anchor.y);let n=_(s),o=w(i),h=_(s+e.height),r=w(i+e.width),a=f[t];for(let c=n;c<=h;c++)for(let t=o;t<=r;t++)if(a.data[t+c*this.width])return!0;return!1},tileAtLayer(t,e){let i=e.row||_(e.y),s=e.col||w(e.x);return f[t]?f[t].data[s+i*x.width]:-1},setTileAtLayer(t,e,i){let s=e.row||_(e.y),n=e.col||w(e.x);f[t]&&(this._d=!0,f[t].data[n+s*x.width]=i)},setLayer(t,e){f[t]&&(this._d=!0,f[t].data=e)},addObject(t){m.push(t),t.sx=this._sx,t.sy=this._sy},removeObject(t){let e=m.indexOf(t);-1!==e&&(m.splice(e,1),t.sx=t.sy=0)},_r:function(t,e){e.save(),e.globalAlpha=t.opacity,t.data.map((t,i)=>{if(!t)return;let s;for(let e=x.tilesets.length-1;e>=0&&(s=x.tilesets[e],!(t/s.firstgid>=1));e--);let n=s.tilewidth||x.tilewidth,o=s.tileheight||x.tileheight,h=s.margin||0,r=s.image,a=t-s.firstgid,c=s.columns||r.width/(n+h)|0,d=i%x.width*n,l=(i/x.width|0)*o,u=a%c*(n+h),p=(a/c|0)*(o+h);e.drawImage(r,u,p,n,o,d,l,n,o)}),e.restore()},_p:y,layerCanvases:g},t);function _(t){return t/x.tileheight|0}function w(t){return t/x.tilewidth|0}function y(){x.layers&&x.layers.map(t=>{f[t.name]=t,!1!==t.visible&&x._r(t,p)})}function b(t){const{width:e,height:i}=h(),s=Math.min(t.width,e),n=Math.min(t.height,i);x.context.drawImage(t,x.sx,x.sy,s,n,0,0,s,n)}return x.tilesets.map(e=>{let i=(window.__k?window.__k.dm.get(t):"")||window.location.href;if(e.source){if(!window.__k)throw Error('You must use "load" or "loadData" to resolve tileset.source');let t=window.__k.d[window.__k.u(e.source,i)];if(!t)throw Error(`You must load the tileset source "${e.source}" before loading the tileset`);Object.keys(t).map(i=>{e[i]=t[i]})}if(""+e.image===e.image){if(!window.__k)throw Error('You must use "load" or "loadImage" to resolve tileset.image');let t=window.__k.i[window.__k.u(e.image,i)];if(!t)throw Error(`You must load the image "${e.image}" before loading the tileset`);e.image=t}}),y(),x}Mt.prototype=It.prototype,Mt.class=It;let Yt={Animation:d,imageAssets:j,audioAssets:P,dataAssets:S,setImagePath:O,setAudioPath:k,setDataPath:I,loadImage:M,loadAudio:L,loadData:D,load:C,init:a,getCanvas:h,getContext:r,on:s,off:n,emit:o,GameLoop:R,keyMap:U,initKeys:$,bindKeys:q,unbindKeys:F,keyPressed:B,registerPlugin:J,unregisterPlugin:Q,extendObject:V,initPointer:pt,pointer:ot,track:ft,untrack:gt,pointerOver:mt,onPointerDown:xt,onPointerUp:_t,pointerPressed:wt,Pool:bt,Quadtree:jt,Sprite:Ot,SpriteSheet:Mt,setStoreItem:Lt,getStoreItem:Dt,TileEngine:Ct,Vector:St};var zt=Yt;exports.default=zt;
},{}],"kzJ9":[function(require,module,exports) {
"use strict";function e(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),t.push.apply(t,n)}return t}function r(r){for(var n=1;n<arguments.length;n++){var u=null!=arguments[n]?arguments[n]:{};n%2?e(u,!0).forEach(function(e){t(r,e,u[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(u)):e(u).forEach(function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(u,e))})}return r}function t(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var n={create:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:(Number(String(Math.random()).slice(2))+Date.now()+Math.round(performance.now())).toString(36),n=[],u=function(){return n.map(function(e){return e})},o=function(){return n.map(function(e){return e.value})};return{id:e,items:u,keys:function(){return n.map(function(e){return e.key})},values:o,get:function(e){return function(e){return void 0!==e?r({},e):null}(n.filter(function(r){return r.key===e})[0])},query:function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:[]).map(function(e){return e(o())})},add:function(e,r){return!n.some(function(r){return r.key===e})&&n.push({key:e,value:r})},remove:function(e){return n=n.filter(function(r){var t=r.key;return e!==t})},flush:function(){return n.splice(0,n.length)},update:function(e,u,o){n=n.map(function(n){return n.key===e?r({},n,{value:r({},n.value,t({},u,o))}):r({},n)})},export:function(){return JSON.stringify(u())},import:function(e){return n=JSON.parse(e).map(function(e){return e})}}}};exports.default=n;
},{}],"s49y":[function(require,module,exports) {
"use strict";function t(r){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(r)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.circleCollision=exports.vmulti=exports.between=exports.useState=exports.uniqueId=void 0;var r=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return"".concat(t).concat(t.length?"_":"")+(Number(String(Math.random()).slice(2))+Date.now()+Math.round(performance.now())).toString(36)};exports.uniqueId=r;var o=function(t){return[function(){return t},function(r){return t=r}]};exports.useState=o;var e=function(t,r,o){return t>r&&t<o};exports.between=e;var n=function(r,o){var e=0,n=0;return"object"===t(o)?(e=r.x*o.x,n=r.y*o.y):(e=r.x*o,n=r.y*o),Vector(e,n)};exports.vmulti=n;var u=function(t,r){return t.radius||console.error("Cannot detect collisions without radious property."),r.filter(function(r){var o=r.x-t.x,e=r.y-t.y;if(Math.sqrt(o*o+e*e)<r.radius+t.width)return r.ttl=0,t.ttl=0,r})};exports.circleCollision=u;
},{}],"k4Dz":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=require("kontra"),i=require("./helpers"),r=function(r){var t=r.id,a=void 0===t?(0,i.uniqueId)("ent_"):t,s=r.x,o=r.y,d=r.sheet,l=r.name,n=r.controlledByUser,m=void 0!==n&&n,u=r.collidesWithTiles,f=void 0===u||u,c=(0,e.SpriteSheet)({image:e.imageAssets[d],frameWidth:16,frameHeight:16,animations:{idle:{frames:[0,1,2,3],frameRate:8},walk:{frames:[3,4,5,6,7],frameRate:16}}});return(0,e.Sprite)({id:a,name:l,x:s,y:o,radius:1,animations:c.animations,collidesWithTiles:f,controlledByUser:m})};exports.default=r;
},{"kontra":"crkq","./helpers":"s49y"}],"hldv":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t=function(t){var e=t.states,i=void 0===e?[]:e,n=t.startIndex,r=i[void 0===n?0:n];return{setState:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};r.id!==t&&(r=i.find(function(e){return e.id===t})).enter(e)},update:function(){r.update(),r.isComplete&&(r.exit(),r=i[0])}}};exports.default=t;
},{}],"H7cw":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t=function(t){var e=t.id,n=(t.cache,t.onEntry),o=void 0===n?function(){}:n,i=t.onExit,u=void 0===i?function(){}:i;return{id:e,isComplete:!1,enter:function(t){o()},update:function(){},exit:function(){u()}}};exports.default=t;
},{}],"lKej":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var n=require("./helpers");function e(n,e){return o(n)||r(n,e)||t()}function t(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function r(n,e){if(Symbol.iterator in Object(n)||"[object Arguments]"===Object.prototype.toString.call(n)){var t=[],r=!0,o=!1,i=void 0;try{for(var u,c=n[Symbol.iterator]();!(r=(u=c.next()).done)&&(t.push(u.value),!e||t.length!==e);r=!0);}catch(a){o=!0,i=a}finally{try{r||null==c.return||c.return()}finally{if(o)throw i}}return t}}function o(n){if(Array.isArray(n))return n}var i=function(t){var r=t.collection,o=t.onChatComplete,i=void 0===o?function(n){}:o,u=t.onChainProgress,c=void 0===u?function(n){}:u,a=e((0,n.useState)(0),2),l=a[0],s=a[1],f=e((0,n.useState)(r[l()]),2),d=f[0],v=f[1],h=function(n){if(n)return v(n),s(n.index),n;throw"No node match."},p=function(n){var e=r.length?r.filter(function(e,t){return n===e.id?{node:e,index:t}:null})[0]:null;return h(e)};return{currentIndex:function(){return l()},goToExact:function(n){var e=p(n);return s(e.index),v(e),h(e)},goToNext:function(){var n=d(),e=n.id,t=n.to,r=n.actions;if(r.some(function(n){return"endConversation"===n})||!t)return r.some(function(n){return"save"===n})&&(c(e),console.log("Saved chain position to:",e)),r.some(function(n){return"cancel"===n})&&console.log("Cancelled, nothing was saved."),i(e),void console.log("End reached, close the convo.");var o=p(t);return s(o.index),v(o),h(o)}}};exports.default=i;
},{"./helpers":"s49y"}],"vpnQ":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.mainFlow=void 0;var e=[{id:"m1",from:null,to:null,text:"This is the first message",choices:[{id:"m1a",from:"m1",to:"m2",text:"I will select A.",choices:[],actions:[]},{id:"m1b",from:"m1",to:"m3",text:"I will select B.",choices:[],actions:[]}],actions:[]},{id:"m2",from:"m1a",to:"m4",text:"This is if you select A.",choices:[],actions:[]},{id:"m3",from:"m1b",to:null,text:"This is if you select B.",choices:[],actions:["cancel"]},{id:"m4",from:"m2",to:null,text:"This should be the last in the chain for A.",choices:[],actions:["endConversation","save"]}];exports.mainFlow=e;
},{}],"t3K4":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=t(require("../conversationIterator")),o=require("../data");function t(e){return e&&e.__esModule?e:{default:e}}var n=function(t){var n=t.id,r=t.cache,i=t.onEntry,a=void 0===i?function(){}:i,s=t.onExit,c=void 0===s?function(){}:s;return{id:n,isComplete:!1,enter:function(t){console.log("Player entered a conversational state:"),console.log(t);var n=(0,e.default)({collection:o.mainFlow,onChatComplete:function(e){console.log("Exited:",e)},onChainProgress:function(e){r.set("progress",{storyProgress:e})}}).goToExact("m1");console.log(n),a(t)},update:function(){},exit:function(){c()}}};exports.default=n;
},{"../conversationIterator":"lKej","../data":"vpnQ"}],"H99C":[function(require,module,exports) {
"use strict";var e=require("kontra"),t=o(require("./cache")),r=require("./helpers"),i=o(require("./entity")),n=o(require("./fsm")),a=o(require("./states/blankState")),s=o(require("./states/startConvo"));function o(e){return e&&e.__esModule?e:{default:e}}function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,i)}return r}function d(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(r,!0).forEach(function(t){y(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(r).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}function y(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var c=t.default.create("gameCache");c.add("progress",{storyProgress:null});var u=(0,e.init)(),g=u.canvas,f=g.getContext("2d");f.imageSmoothingEnabled=!1,f.webkitImageSmoothingEnabled=!1,f.mozImageSmoothingEnabled=!1,f.msImageSmoothingEnabled=!1,f.oImageSmoothingEnabled=!1,f.scale(3,3);var p=function(){(0,e.initKeys)();var t=0,o=(0,n.default)({states:[(0,a.default)({id:"field",cache:c,onEntry:function(){return t=0}}),(0,s.default)({id:"conversation",cache:c,onEntry:function(){return t=1}})]}),l=e.dataAssets["assets/tiledata/test"],y=(0,e.TileEngine)(l),u=[(0,i.default)({x:120,y:120,sheet:"assets/entityimages/little_devil.png",name:"Player",id:"player",controlledByUser:!0}),(0,i.default)({x:120,y:160,name:"Daryl",id:"daryl",sheet:"assets/entityimages/little_orc.png"})];return(0,e.GameLoop)({update:function(){o.update(),1!==t?u.map(function(t){t.x<0?t.x=g.width:t.x>g.width&&(t.x=0),t.y<0?t.y=g.height:t.y>g.height&&(t.y=0);var i=t.controlledByUser?{x:(0,e.keyPressed)("a")?-1:(0,e.keyPressed)("d")?1:0,y:(0,e.keyPressed)("w")?-1:(0,e.keyPressed)("s")?1:0}:{x:0,y:0},n=Math.sqrt(i.x*i.x+i.y*i.y),a=0!==i.x?i.x/n:0,s=0!==i.y?i.y/n:0,l={x:t.x,y:t.y};t.x+=a;var c=y.layerCollidesWith("Collision",t);t.collidesWithTiles&&c&&(t.x=l.x,t.y=l.y),l={x:t.x,y:t.y},t.y+=s;var f=y.layerCollidesWith("Collision",t);if(t.collidesWithTiles&&f&&(t.x=l.x,t.y=l.y),t.controlledByUser&&(0,e.keyPressed)("e")){var p=(0,r.circleCollision)(t,u.filter(function(e){return e.id!==t.id}));t.isColliding=p.length>0,t.isColliding&&o.setState("conversation",d({},p[0]))}a<0?t.width=-t.width:a>0&&(t.width=t.width);var h=0!==a||0!==s;t.playAnimation(h?"walk":"idle"),t.update()}):u.map(function(e){e.playAnimation("idle"),e.update()})},render:function(){y.render(),u.map(function(e){return e.render()})}})};(0,e.load)("assets/tileimages/test.png","assets/tiledata/test.json","assets/entityimages/little_devil.png","assets/entityimages/little_orc.png").then(function(e){return p().start()});
},{"kontra":"crkq","./cache":"kzJ9","./helpers":"s49y","./entity":"k4Dz","./fsm":"hldv","./states/blankState":"H7cw","./states/startConvo":"t3K4"}]},{},["H99C"], null)
//# sourceMappingURL=/src.2baab5db.js.map