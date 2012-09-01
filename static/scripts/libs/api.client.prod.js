/**
 * almond 0.1.2 Copyright (c) 2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */

//     Underscore.js 1.3.3
//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore

(function(e,t){e.Remoats=t()})(this,function(){var e,t,n;return function(r){function c(e,t){var n=t&&t.split("/"),r=o.map,i=r&&r["*"]||{},s,u,a,f,l,c,h,p,d,v;if(e&&e.charAt(0)==="."&&t){n=n.slice(0,n.length-1),e=n.concat(e.split("/"));for(p=0;v=e[p];p++)if(v===".")e.splice(p,1),p-=1;else if(v===".."){if(p===1&&(e[2]===".."||e[0]===".."))return!0;p>0&&(e.splice(p-1,2),p-=2)}e=e.join("/")}if((n||i)&&r){s=e.split("/");for(p=s.length;p>0;p-=1){u=s.slice(0,p).join("/");if(n)for(d=n.length;d>0;d-=1){a=r[n.slice(0,d).join("/")];if(a){a=a[u];if(a){f=a,l=p;break}}}if(f)break;!c&&i&&i[u]&&(c=i[u],h=p)}!f&&c&&(f=c,l=h),f&&(s.splice(0,l,f),e=s.join("/"))}return e}function h(e,t){return function(){return l.apply(r,a.call(arguments,0).concat([e,t]))}}function p(e){return function(t){return c(t,e)}}function d(e){return function(t){i[e]=t}}function v(e){if(s.hasOwnProperty(e)){var t=s[e];delete s[e],u[e]=!0,f.apply(r,t)}if(!i.hasOwnProperty(e))throw new Error("No "+e);return i[e]}function m(e,t){var n,r,i=e.indexOf("!");return i!==-1?(n=c(e.slice(0,i),t),e=e.slice(i+1),r=v(n),r&&r.normalize?e=r.normalize(e,p(t)):e=c(e,t)):e=c(e,t),{f:n?n+"!"+e:e,n:e,p:r}}function g(e){return function(){return o&&o.config&&o.config[e]||{}}}var i={},s={},o={},u={},a=[].slice,f,l;f=function(e,t,n,o){var a=[],f,l,c,p,y,b;o=o||e;if(typeof n=="function"){t=!t.length&&n.length?["require","exports","module"]:t;for(b=0;b<t.length;b++){y=m(t[b],o),c=y.f;if(c==="require")a[b]=h(e);else if(c==="exports")a[b]=i[e]={},f=!0;else if(c==="module")l=a[b]={id:e,uri:"",exports:i[e],config:g(e)};else if(i.hasOwnProperty(c)||s.hasOwnProperty(c))a[b]=v(c);else if(y.p)y.p.load(y.n,h(o,!0),d(c),{}),a[b]=i[c];else if(!u[c])throw new Error(e+" missing "+c)}p=n.apply(i[e],a);if(e)if(l&&l.exports!==r&&l.exports!==i[e])i[e]=l.exports;else if(p!==r||!f)i[e]=p}else e&&(i[e]=n)},e=t=l=function(e,t,n,i){return typeof e=="string"?v(m(e,t).f):(e.splice||(o=e,t.splice?(e=t,t=n,n=null):e=r),t=t||function(){},i?f(r,e,t,n):setTimeout(function(){f(r,e,t,n)},15),l)},l.config=function(e){return o=e,l},n=function(e,t,n){t.splice||(n=t,t=[]),s[e]=[e,t,n]},n.amd={jQuery:!0}}(),n("libs/almond",function(){}),function(){function C(e,t,n){if(e===t)return e!==0||1/e==1/t;if(e==null||t==null)return e===t;e._chain&&(e=e._wrapped),t._chain&&(t=t._wrapped);if(e.isEqual&&S.isFunction(e.isEqual))return e.isEqual(t);if(t.isEqual&&S.isFunction(t.isEqual))return t.isEqual(e);var r=a.call(e);if(r!=a.call(t))return!1;switch(r){case"[object String]":return e==String(t);case"[object Number]":return e!=+e?t!=+t:e==0?1/e==1/t:e==+t;case"[object Date]":case"[object Boolean]":return+e==+t;case"[object RegExp]":return e.source==t.source&&e.global==t.global&&e.multiline==t.multiline&&e.ignoreCase==t.ignoreCase}if(typeof e!="object"||typeof t!="object")return!1;var i=n.length;while(i--)if(n[i]==e)return!0;n.push(e);var s=0,o=!0;if(r=="[object Array]"){s=e.length,o=s==t.length;if(o)while(s--)if(!(o=s in e==s in t&&C(e[s],t[s],n)))break}else{if("constructor"in e!="constructor"in t||e.constructor!=t.constructor)return!1;for(var u in e)if(S.has(e,u)){s++;if(!(o=S.has(t,u)&&C(e[u],t[u],n)))break}if(o){for(u in t)if(S.has(t,u)&&!(s--))break;o=!s}}return n.pop(),o}var e=this,t=e._,n={},r=Array.prototype,i=Object.prototype,s=Function.prototype,o=r.slice,u=r.unshift,a=i.toString,f=i.hasOwnProperty,l=r.forEach,c=r.map,h=r.reduce,p=r.reduceRight,d=r.filter,v=r.every,m=r.some,g=r.indexOf,y=r.lastIndexOf,b=Array.isArray,w=Object.keys,E=s.bind,S=function(e){return new P(e)};typeof exports!="undefined"?(typeof module!="undefined"&&module.exports&&(exports=module.exports=S),exports._=S):e._=S,S.VERSION="1.3.3";var x=S.each=S.forEach=function(e,t,r){if(e==null)return;if(l&&e.forEach===l)e.forEach(t,r);else if(e.length===+e.length){for(var i=0,s=e.length;i<s;i++)if(i in e&&t.call(r,e[i],i,e)===n)return}else for(var o in e)if(S.has(e,o)&&t.call(r,e[o],o,e)===n)return};S.map=S.collect=function(e,t,n){var r=[];return e==null?r:c&&e.map===c?e.map(t,n):(x(e,function(e,i,s){r[r.length]=t.call(n,e,i,s)}),e.length===+e.length&&(r.length=e.length),r)},S.reduce=S.foldl=S.inject=function(e,t,n,r){var i=arguments.length>2;e==null&&(e=[]);if(h&&e.reduce===h)return r&&(t=S.bind(t,r)),i?e.reduce(t,n):e.reduce(t);x(e,function(e,s,o){i?n=t.call(r,n,e,s,o):(n=e,i=!0)});if(!i)throw new TypeError("Reduce of empty array with no initial value");return n},S.reduceRight=S.foldr=function(e,t,n,r){var i=arguments.length>2;e==null&&(e=[]);if(p&&e.reduceRight===p)return r&&(t=S.bind(t,r)),i?e.reduceRight(t,n):e.reduceRight(t);var s=S.toArray(e).reverse();return r&&!i&&(t=S.bind(t,r)),i?S.reduce(s,t,n,r):S.reduce(s,t)},S.find=S.detect=function(e,t,n){var r;return T(e,function(e,i,s){if(t.call(n,e,i,s))return r=e,!0}),r},S.filter=S.select=function(e,t,n){var r=[];return e==null?r:d&&e.filter===d?e.filter(t,n):(x(e,function(e,i,s){t.call(n,e,i,s)&&(r[r.length]=e)}),r)},S.reject=function(e,t,n){var r=[];return e==null?r:(x(e,function(e,i,s){t.call(n,e,i,s)||(r[r.length]=e)}),r)},S.every=S.all=function(e,t,r){var i=!0;return e==null?i:v&&e.every===v?e.every(t,r):(x(e,function(e,s,o){if(!(i=i&&t.call(r,e,s,o)))return n}),!!i)};var T=S.some=S.any=function(e,t,r){t||(t=S.identity);var i=!1;return e==null?i:m&&e.some===m?e.some(t,r):(x(e,function(e,s,o){if(i||(i=t.call(r,e,s,o)))return n}),!!i)};S.include=S.contains=function(e,t){var n=!1;return e==null?n:g&&e.indexOf===g?e.indexOf(t)!=-1:(n=T(e,function(e){return e===t}),n)},S.invoke=function(e,t){var n=o.call(arguments,2);return S.map(e,function(e){return(S.isFunction(t)?t||e:e[t]).apply(e,n)})},S.pluck=function(e,t){return S.map(e,function(e){return e[t]})},S.max=function(e,t,n){if(!t&&S.isArray(e)&&e[0]===+e[0])return Math.max.apply(Math,e);if(!t&&S.isEmpty(e))return-Infinity;var r={computed:-Infinity};return x(e,function(e,i,s){var o=t?t.call(n,e,i,s):e;o>=r.computed&&(r={value:e,computed:o})}),r.value},S.min=function(e,t,n){if(!t&&S.isArray(e)&&e[0]===+e[0])return Math.min.apply(Math,e);if(!t&&S.isEmpty(e))return Infinity;var r={computed:Infinity};return x(e,function(e,i,s){var o=t?t.call(n,e,i,s):e;o<r.computed&&(r={value:e,computed:o})}),r.value},S.shuffle=function(e){var t=[],n;return x(e,function(e,r,i){n=Math.floor(Math.random()*(r+1)),t[r]=t[n],t[n]=e}),t},S.sortBy=function(e,t,n){var r=S.isFunction(t)?t:function(e){return e[t]};return S.pluck(S.map(e,function(e,t,i){return{value:e,criteria:r.call(n,e,t,i)}}).sort(function(e,t){var n=e.criteria,r=t.criteria;return n===void 0?1:r===void 0?-1:n<r?-1:n>r?1:0}),"value")},S.groupBy=function(e,t){var n={},r=S.isFunction(t)?t:function(e){return e[t]};return x(e,function(e,t){var i=r(e,t);(n[i]||(n[i]=[])).push(e)}),n},S.sortedIndex=function(e,t,n){n||(n=S.identity);var r=0,i=e.length;while(r<i){var s=r+i>>1;n(e[s])<n(t)?r=s+1:i=s}return r},S.toArray=function(e){return e?S.isArray(e)?o.call(e):S.isArguments(e)?o.call(e):e.toArray&&S.isFunction(e.toArray)?e.toArray():S.values(e):[]},S.size=function(e){return S.isArray(e)?e.length:S.keys(e).length},S.first=S.head=S.take=function(e,t,n){return t!=null&&!n?o.call(e,0,t):e[0]},S.initial=function(e,t,n){return o.call(e,0,e.length-(t==null||n?1:t))},S.last=function(e,t,n){return t!=null&&!n?o.call(e,Math.max(e.length-t,0)):e[e.length-1]},S.rest=S.tail=function(e,t,n){return o.call(e,t==null||n?1:t)},S.compact=function(e){return S.filter(e,function(e){return!!e})},S.flatten=function(e,t){return S.reduce(e,function(e,n){return S.isArray(n)?e.concat(t?n:S.flatten(n)):(e[e.length]=n,e)},[])},S.without=function(e){return S.difference(e,o.call(arguments,1))},S.uniq=S.unique=function(e,t,n){var r=n?S.map(e,n):e,i=[];return e.length<3&&(t=!0),S.reduce(r,function(n,r,s){if(t?S.last(n)!==r||!n.length:!S.include(n,r))n.push(r),i.push(e[s]);return n},[]),i},S.union=function(){return S.uniq(S.flatten(arguments,!0))},S.intersection=S.intersect=function(e){var t=o.call(arguments,1);return S.filter(S.uniq(e),function(e){return S.every(t,function(t){return S.indexOf(t,e)>=0})})},S.difference=function(e){var t=S.flatten(o.call(arguments,1),!0);return S.filter(e,function(e){return!S.include(t,e)})},S.zip=function(){var e=o.call(arguments),t=S.max(S.pluck(e,"length")),n=new Array(t);for(var r=0;r<t;r++)n[r]=S.pluck(e,""+r);return n},S.indexOf=function(e,t,n){if(e==null)return-1;var r,i;if(n)return r=S.sortedIndex(e,t),e[r]===t?r:-1;if(g&&e.indexOf===g)return e.indexOf(t);for(r=0,i=e.length;r<i;r++)if(r in e&&e[r]===t)return r;return-1},S.lastIndexOf=function(e,t){if(e==null)return-1;if(y&&e.lastIndexOf===y)return e.lastIndexOf(t);var n=e.length;while(n--)if(n in e&&e[n]===t)return n;return-1},S.range=function(e,t,n){arguments.length<=1&&(t=e||0,e=0),n=arguments[2]||1;var r=Math.max(Math.ceil((t-e)/n),0),i=0,s=new Array(r);while(i<r)s[i++]=e,e+=n;return s};var N=function(){};S.bind=function(t,n){var r,i;if(t.bind===E&&E)return E.apply(t,o.call(arguments,1));if(!S.isFunction(t))throw new TypeError;return i=o.call(arguments,2),r=function(){if(this instanceof r){N.prototype=t.prototype;var e=new N,s=t.apply(e,i.concat(o.call(arguments)));return Object(s)===s?s:e}return t.apply(n,i.concat(o.call(arguments)))}},S.bindAll=function(e){var t=o.call(arguments,1);return t.length==0&&(t=S.functions(e)),x(t,function(t){e[t]=S.bind(e[t],e)}),e},S.memoize=function(e,t){var n={};return t||(t=S.identity),function(){var r=t.apply(this,arguments);return S.has(n,r)?n[r]:n[r]=e.apply(this,arguments)}},S.delay=function(e,t){var n=o.call(arguments,2);return setTimeout(function(){return e.apply(null,n)},t)},S.defer=function(e){return S.delay.apply(S,[e,1].concat(o.call(arguments,1)))},S.throttle=function(e,t){var n,r,i,s,o,u,a=S.debounce(function(){o=s=!1},t);return function(){n=this,r=arguments;var f=function(){i=null,o&&e.apply(n,r),a()};return i||(i=setTimeout(f,t)),s?o=!0:u=e.apply(n,r),a(),s=!0,u}},S.debounce=function(e,t,n){var r;return function(){var i=this,s=arguments,o=function(){r=null,n||e.apply(i,s)};n&&!r&&e.apply(i,s),clearTimeout(r),r=setTimeout(o,t)}},S.once=function(e){var t=!1,n;return function(){return t?n:(t=!0,n=e.apply(this,arguments))}},S.wrap=function(e,t){return function(){var n=[e].concat(o.call(arguments,0));return t.apply(this,n)}},S.compose=function(){var e=arguments;return function(){var t=arguments;for(var n=e.length-1;n>=0;n--)t=[e[n].apply(this,t)];return t[0]}},S.after=function(e,t){return e<=0?t():function(){if(--e<1)return t.apply(this,arguments)}},S.keys=w||function(e){if(e!==Object(e))throw new TypeError("Invalid object");var t=[];for(var n in e)S.has(e,n)&&(t[t.length]=n);return t},S.values=function(e){return S.map(e,S.identity)},S.functions=S.methods=function(e){var t=[];for(var n in e)S.isFunction(e[n])&&t.push(n);return t.sort()},S.extend=function(e){return x(o.call(arguments,1),function(t){for(var n in t)e[n]=t[n]}),e},S.pick=function(e){var t={};return x(S.flatten(o.call(arguments,1)),function(n){n in e&&(t[n]=e[n])}),t},S.defaults=function(e){return x(o.call(arguments,1),function(t){for(var n in t)e[n]==null&&(e[n]=t[n])}),e},S.clone=function(e){return S.isObject(e)?S.isArray(e)?e.slice():S.extend({},e):e},S.tap=function(e,t){return t(e),e},S.isEqual=function(e,t){return C(e,t,[])},S.isEmpty=function(e){if(e==null)return!0;if(S.isArray(e)||S.isString(e))return e.length===0;for(var t in e)if(S.has(e,t))return!1;return!0},S.isElement=function(e){return!!e&&e.nodeType==1},S.isArray=b||function(e){return a.call(e)=="[object Array]"},S.isObject=function(e){return e===Object(e)},S.isArguments=function(e){return a.call(e)=="[object Arguments]"},S.isArguments(arguments)||(S.isArguments=function(e){return!!e&&!!S.has(e,"callee")}),S.isFunction=function(e){return a.call(e)=="[object Function]"},S.isString=function(e){return a.call(e)=="[object String]"},S.isNumber=function(e){return a.call(e)=="[object Number]"},S.isFinite=function(e){return S.isNumber(e)&&isFinite(e)},S.isNaN=function(e){return e!==e},S.isBoolean=function(e){return e===!0||e===!1||a.call(e)=="[object Boolean]"},S.isDate=function(e){return a.call(e)=="[object Date]"},S.isRegExp=function(e){return a.call(e)=="[object RegExp]"},S.isNull=function(e){return e===null},S.isUndefined=function(e){return e===void 0},S.has=function(e,t){return f.call(e,t)},S.noConflict=function(){return e._=t,this},S.identity=function(e){return e},S.times=function(e,t,n){for(var r=0;r<e;r++)t.call(n,r)},S.escape=function(e){return(""+e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;").replace(/\//g,"&#x2F;")},S.result=function(e,t){if(e==null)return null;var n=e[t];return S.isFunction(n)?n.call(e):n},S.mixin=function(e){x(S.functions(e),function(t){B(t,S[t]=e[t])})};var k=0;S.uniqueId=function(e){var t=k++;return e?e+t:t},S.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var L=/.^/,A={"\\":"\\","'":"'",r:"\r",n:"\n",t:"	",u2028:"\u2028",u2029:"\u2029"};for(var O in A)A[A[O]]=O;var M=/\\|'|\r|\n|\t|\u2028|\u2029/g,_=/\\(\\|'|r|n|t|u2028|u2029)/g,D=function(e){return e.replace(_,function(e,t){return A[t]})};S.template=function(e,t,n){n=S.defaults(n||{},S.templateSettings);var r="__p+='"+e.replace(M,function(e){return"\\"+A[e]}).replace(n.escape||L,function(e,t){return"'+\n_.escape("+D(t)+")+\n'"}).replace(n.interpolate||L,function(e,t){return"'+\n("+D(t)+")+\n'"}).replace(n.evaluate||L,function(e,t){return"';\n"+D(t)+"\n;__p+='"})+"';\n";n.variable||(r="with(obj||{}){\n"+r+"}\n"),r="var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n"+r+"return __p;\n";var i=new Function(n.variable||"obj","_",r);if(t)return i(t,S);var s=function(e){return i.call(this,e,S)};return s.source="function("+(n.variable||"obj")+"){\n"+r+"}",s},S.chain=function(e){return S(e).chain()};var P=function(e){this._wrapped=e};S.prototype=P.prototype;var H=function(e,t){return t?S(e).chain():e},B=function(e,t){P.prototype[e]=function(){var e=o.call(arguments);return u.call(e,this._wrapped),H(t.apply(S,e),this._chain)}};S.mixin(S),x(["pop","push","reverse","shift","sort","splice","unshift"],function(e){var t=r[e];P.prototype[e]=function(){var n=this._wrapped;t.apply(n,arguments);var r=n.length;return(e=="shift"||e=="splice")&&r===0&&delete n[0],H(n,this._chain)}}),x(["concat","join","slice"],function(e){var t=r[e];P.prototype[e]=function(){return H(t.apply(this._wrapped,arguments),this._chain)}}),P.prototype.chain=function(){return this._chain=!0,this},P.prototype.value=function(){return this._wrapped}}.call(this),n("underscore",function(e){return function(){return e._}}(this)),n("oats/Events",["underscore"],function(e){var t=/\s+/,n={on:function(e,n,r){var i,s,o;if(!n)return this;e=e.split(t),i=this._callbacks||(this._callbacks={});while(s=e.shift())o=i[s]||(i[s]=[]),o.push(n,r);return this},off:function(n,r,i){var s,o,u,a;if(!(o=this._callbacks))return this;if(!(n||r||i))return delete this._callbacks,this;n=n?n.split(t):e.keys(o);while(s=n.shift()){if(!(u=o[s])||!r&&!i){delete o[s];continue}for(a=u.length-2;a>=0;a-=2)r&&u[a]!==r||i&&u[a+1]!==i||u.splice(a,2)}return this},trigger:function(e){var n,r,i,s,o,u,a,f;if(!(r=this._callbacks))return this;f=[],e=e.split(t);for(s=1,o=arguments.length;s<o;s++)f[s-1]=arguments[s];while(n=e.shift()){if(a=r.all)a=a.slice();if(i=r[n])i=i.slice();if(i)for(s=0,o=i.length;s<o;s+=2)i[s].apply(i[s+1]||this,f);if(a){u=[n].concat(f);for(s=0,o=a.length;s<o;s+=2)a[s].apply(a[s+1]||this,u)}}return this}};return n}),n("oats/Channels/LocalReceiver",["underscore","oats/Events"],function(e,t){function r(){var t=this;window.addEventListener("message",e.bind(function(e){console.log("[LOCAL RECEIVER] got message",e);if(e.source!=window)return;n(e.data)&&this.trigger("Receive",e.data)},this),!1)}var n=function(e){return e.destination==="oats"};return e.extend(r.prototype,t,{}),r}),n("oats/ApiSpecification",[],function(){return{isValidAction:function(e){return this.actions.indexOf(e)!==-1},actions:["swipe-left","swipe-right","swipe-up","swipe-down","tap","drag-start","drag-end","dragging"],signals:{CLIENT_REGISTER:"oats.client.register",CLIENT_REGISTERED:"oats.client.registered",all:[this.CLIENT_REGISTER,this.CLIENT_REGISTERED]},isValidSignal:function(e){return[this.signals.CLIENT_REGISTER,this.signals.CLIENT_REGISTERED].indexOf(e)!==-1}}}),n("oats/ClientBootstrap",["oats/ApiSpecification"],function(e){function n(){return document.getElementById("remoats-plugin-installed")!=null}function r(){var e=document.getElementById("remoats-plugin-installed");return e!=null?e.getAttribute("data-extension-id"):null}function i(){this.promptStyleString="position: fixed;left: 20px;bottom: 20px;z-index: 10000;padding: 10px;background-color: #000000;color: #FFFFFF;opacity: 0.7;border: solid 2px #FDF6E6;border-radius: 6px;",this.promptContent='<p style="font-size: 12px;">You can use Remoats to control this site remotely from your phone</p><div style="font-size: 12px;padding: 5px;text-align: center;"> <a id="btn-install-extension" href="#" style="color: #F4B58A;font-weight: bold;">Enable Remoats</a>&nbsp;&nbsp;<a id="btn-install-extension" href="#" style="color: #F4B58A;">Learn more</a></div>'}function s(){}var t={extensionCheckTimeout:3e3};return i.prototype={render:function(){var e=document.createElement("div");e.setAttribute("style",this.promptStyleString),e.innerHTML=this.promptContent,document.body.insertBefore(e,document.body.firstChild),document.getElementById("btn-install-extension").addEventListener("click",function(){e.innerHTML='<p style="font-size: 12px;">Once extension is installed, please refresh your browser</p>',window.open("https://chrome.google.com/webstore/detail/lachagibcielinidmmnofikacabgppam")},!1)}},s.prototype={check:function(){var e=this;setTimeout(function(){n()?(e.registerClient(),e.onReady()):(new i).render()},t.extensionCheckTimeout)},registerClient:function(){window.postMessage({signal:e.signals.CLIENT_REGISTER},"*")},onReady:function(){}},s}),n("oats/Client",["underscore","oats/Events","oats/Channels/LocalReceiver","oats/ApiSpecification","oats/ClientBootstrap"],function(e,t,n,r,i){function s(e){var t=this,n=new i;n.onReady=function(){t.__setupClient()},n.check()}return e.extend(s.prototype,t,{__setupClient:function(){(new n).on("Receive",function(e){if(typeof e.action!="undefined"){if(!r.isValidAction(e.action))throw new Error("Invalid action: "+e.action);this.trigger(e.action)}if(typeof e.signal!="undefined"){if(!r.isValidSignal(e.signal))throw new Error("Invalid signal: "+e.signal);switch(e.signal){case r.signals.CLIENT_REGISTERED:this.trigger("Ready")}}},this)},onNotAuthenticated:function(){alert("please log in")}}),s}),t("oats/Client")})