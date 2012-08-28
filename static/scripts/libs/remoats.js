(function (root, factory) {
	root.Remoats = factory();
}(this, function () {
/**
 * almond 0.1.2 Copyright (c) 2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var defined = {},
        waiting = {},
        config = {},
        defining = {},
        aps = [].slice,
        main, req;

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {},
            nameParts, nameSegment, mapValue, foundMap,
            foundI, foundStarMap, starI, i, j, part;

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);

                name = baseParts.concat(name.split("/"));

                //start trimDots
                for (i = 0; (part = name[i]); i++) {
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            return true;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (waiting.hasOwnProperty(name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!defined.hasOwnProperty(name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    function makeMap(name, relName) {
        var prefix, plugin,
            index = name.indexOf('!');

        if (index !== -1) {
            prefix = normalize(name.slice(0, index), relName);
            name = name.slice(index + 1);
            plugin = callDep(prefix);

            //Normalize according
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            p: plugin
        };
    }

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    main = function (name, deps, callback, relName) {
        var args = [],
            usingExports,
            cjsModule, depName, ret, map, i;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (typeof callback === 'function') {

            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i++) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = makeRequire(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = defined[name] = {};
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = {
                        id: name,
                        uri: '',
                        exports: defined[name],
                        config: makeConfig(name)
                    };
                } else if (defined.hasOwnProperty(depName) || waiting.hasOwnProperty(depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else if (!defining[depName]) {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback.apply(defined[name], args);

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                    cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync) {
        if (typeof deps === "string") {
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 15);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        config = cfg;
        return req;
    };

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        waiting[name] = [name, deps, callback];
    };

    define.amd = {
        jQuery: true
    };
}());

define("libs/almond", function(){});

/*!
 * Pusher JavaScript Library v1.12.2
 * http://pusherapp.com/
 *
 * Copyright 2011, Pusher
 * Released under the MIT licence.
 */

(function(){if(Function.prototype.scopedTo===void 0)Function.prototype.scopedTo=function(a,b){var e=this;return function(){return e.apply(a,Array.prototype.slice.call(b||[]).concat(Array.prototype.slice.call(arguments)))}};var c=function(a,b){this.options=b||{};this.key=a;this.channels=new c.Channels;this.global_emitter=new c.EventsDispatcher;var e=this;this.checkAppKey();this.connection=new c.Connection(this.key,this.options);this.connection.bind("connected",function(){e.subscribeAll()}).bind("message",
function(b){var a=b.event.indexOf("pusher_internal:")===0;if(b.channel){var c;(c=e.channel(b.channel))&&c.emit(b.event,b.data)}a||e.global_emitter.emit(b.event,b.data)}).bind("disconnected",function(){e.channels.disconnect()}).bind("error",function(b){c.warn("Error",b)});c.instances.push(this);c.isReady&&e.connect()};c.instances=[];c.prototype={channel:function(a){return this.channels.find(a)},connect:function(){this.connection.connect()},disconnect:function(){this.connection.disconnect()},bind:function(a,
b){this.global_emitter.bind(a,b);return this},bind_all:function(a){this.global_emitter.bind_all(a);return this},subscribeAll:function(){for(channelName in this.channels.channels)this.channels.channels.hasOwnProperty(channelName)&&this.subscribe(channelName)},subscribe:function(a){var b=this,e=this.channels.add(a,this);this.connection.state==="connected"&&e.authorize(this.connection.socket_id,this.options,function(c,f){c?e.emit("pusher:subscription_error",f):b.send_event("pusher:subscribe",{channel:a,
auth:f.auth,channel_data:f.channel_data})});return e},unsubscribe:function(a){this.channels.remove(a);this.connection.state==="connected"&&this.send_event("pusher:unsubscribe",{channel:a})},send_event:function(a,b,e){return this.connection.send_event(a,b,e)},checkAppKey:function(){(this.key===null||this.key===void 0)&&c.warn("Warning","You must pass your app key when you instantiate Pusher.")}};c.Util={extend:function b(e,c){for(var f in c)e[f]=c[f]&&c[f].constructor&&c[f].constructor===Object?b(e[f]||
{},c[f]):c[f];return e},stringify:function(){for(var b=["Pusher"],e=0;e<arguments.length;e++)typeof arguments[e]==="string"?b.push(arguments[e]):window.JSON==void 0?b.push(arguments[e].toString()):b.push(JSON.stringify(arguments[e]));return b.join(" : ")},arrayIndexOf:function(b,e){var c=Array.prototype.indexOf;if(b==null)return-1;if(c&&b.indexOf===c)return b.indexOf(e);for(i=0,l=b.length;i<l;i++)if(b[i]===e)return i;return-1}};c.debug=function(){c.log&&c.log(c.Util.stringify.apply(this,arguments))};
c.warn=function(){window.console&&window.console.warn?window.console.warn(c.Util.stringify.apply(this,arguments)):c.log&&c.log(c.Util.stringify.apply(this,arguments))};c.VERSION="1.12.2";c.host="ws.pusherapp.com";c.ws_port=80;c.wss_port=443;c.channel_auth_endpoint="/pusher/auth";c.cdn_http="http://js.pusher.com/";c.cdn_https="https://d3dy5gmtp8yhk7.cloudfront.net/";c.dependency_suffix=".min";c.channel_auth_transport="ajax";c.activity_timeout=12E4;c.pong_timeout=3E4;c.isReady=!1;c.ready=function(){c.isReady=
!0;for(var b=0,e=c.instances.length;b<e;b++)c.instances[b].connect()};this.Pusher=c}).call(this);
(function(){function c(){this._callbacks={}}function a(b){this.callbacks=new c;this.global_callbacks=[];this.failThrough=b}c.prototype.get=function(b){return this._callbacks[this._prefix(b)]};c.prototype.add=function(b,a){var c=this._prefix(b);this._callbacks[c]=this._callbacks[c]||[];this._callbacks[c].push(a)};c.prototype.remove=function(b,a){if(this.get(b)){var c=Pusher.Util.arrayIndexOf(this.get(b),a);this._callbacks[this._prefix(b)].splice(c,1)}};c.prototype._prefix=function(b){return"_"+b};
a.prototype.bind=function(b,a){this.callbacks.add(b,a);return this};a.prototype.unbind=function(b,a){this.callbacks.remove(b,a);return this};a.prototype.emit=function(b,a){for(var c=0;c<this.global_callbacks.length;c++)this.global_callbacks[c](b,a);var f=this.callbacks.get(b);if(f)for(c=0;c<f.length;c++)f[c](a);else this.failThrough&&this.failThrough(b,a);return this};a.prototype.bind_all=function(b){this.global_callbacks.push(b);return this};this.Pusher.EventsDispatcher=a}).call(this);
(function(){function c(b,a,c){if(a[b]!==void 0)a[b](c)}function a(a,c,f){b.EventsDispatcher.call(this);this.state=void 0;this.errors=[];this.stateActions=f;this.transitions=c;this.transition(a)}var b=this.Pusher;a.prototype.transition=function(a,g){var f=this.state,h=this.stateActions;if(f&&b.Util.arrayIndexOf(this.transitions[f],a)==-1)throw this.emit("invalid_transition_attempt",{oldState:f,newState:a}),Error("Invalid transition ["+f+" to "+a+"]");c(f+"Exit",h,g);c(f+"To"+(a.substr(0,1).toUpperCase()+
a.substr(1)),h,g);c(a+"Pre",h,g);this.state=a;this.emit("state_change",{oldState:f,newState:a});c(a+"Post",h,g)};a.prototype.is=function(b){return this.state===b};a.prototype.isNot=function(b){return this.state!==b};b.Util.extend(a.prototype,b.EventsDispatcher.prototype);this.Pusher.Machine=a}).call(this);
(function(){var c=function(){var a=this;Pusher.EventsDispatcher.call(this);window.addEventListener!==void 0&&(window.addEventListener("online",function(){a.emit("online",null)},!1),window.addEventListener("offline",function(){a.emit("offline",null)},!1))};c.prototype.isOnLine=function(){return window.navigator.onLine===void 0?!0:window.navigator.onLine};Pusher.Util.extend(c.prototype,Pusher.EventsDispatcher.prototype);this.Pusher.NetInfo=c}).call(this);
(function(){function c(a){a.connectionWait=0;a.openTimeout=b.TransportType==="flash"?5E3:2E3;a.connectedTimeout=2E3;a.connectionSecure=a.compulsorySecure;a.connectionAttempts=0}function a(a,r){function k(){d.connectionWait<s&&(d.connectionWait+=g);d.openTimeout<t&&(d.openTimeout+=f);d.connectedTimeout<u&&(d.connectedTimeout+=h);if(d.compulsorySecure!==!0)d.connectionSecure=!d.connectionSecure;d.connectionAttempts++}function m(){d._machine.transition("impermanentlyClosing")}function p(){d._activityTimer&&
clearTimeout(d._activityTimer);d._activityTimer=setTimeout(function(){d.send_event("pusher:ping",{});d._activityTimer=setTimeout(function(){d.socket.close()},d.options.pong_timeout||b.pong_timeout)},d.options.activity_timeout||b.activity_timeout)}function v(){var b=d.connectionWait;if(b===0&&d.connectedAt){var a=(new Date).getTime()-d.connectedAt;a<1E3&&(b=1E3-a)}return b}function w(){d._machine.transition("open")}function x(b){b=q(b);if(b!==void 0)if(b.event==="pusher:connection_established")d._machine.transition("connected",
b.data.socket_id);else if(b.event==="pusher:error"){var a=b.data.code;d.emit("error",{type:"PusherError",data:{code:a,message:b.data.message}});a===4E3?(d.compulsorySecure=!0,d.connectionSecure=!0,d.options.encrypted=!0,m()):a<4100?d._machine.transition("permanentlyClosing"):a<4200?(d.connectionWait=1E3,d._machine.transition("waiting")):a<4300?m():d._machine.transition("permanentlyClosing")}}function y(a){p();a=q(a);if(a!==void 0){b.debug("Event recd",a);switch(a.event){case "pusher:error":d.emit("error",
{type:"PusherError",data:a.data});break;case "pusher:ping":d.send_event("pusher:pong",{})}d.emit("message",a)}}function q(b){try{var a=JSON.parse(b.data);if(typeof a.data==="string")try{a.data=JSON.parse(a.data)}catch(c){if(!(c instanceof SyntaxError))throw c;}return a}catch(e){d.emit("error",{type:"MessageParseError",error:e,data:b.data})}}function n(){d._machine.transition("waiting")}function o(b){d.emit("error",{type:"WebSocketError",error:b})}function j(a,c){var e=d.state;d.state=a;e!==a&&(b.debug("State changed",
e+" -> "+a),d.emit("state_change",{previous:e,current:a}),d.emit(a,c))}var d=this;b.EventsDispatcher.call(this);this.options=b.Util.extend({encrypted:!1},r);this.netInfo=new b.NetInfo;this.netInfo.bind("online",function(){d._machine.is("waiting")&&(d._machine.transition("connecting"),j("connecting"))});this.netInfo.bind("offline",function(){if(d._machine.is("connected"))d.socket.onclose=void 0,d.socket.onmessage=void 0,d.socket.onerror=void 0,d.socket.onopen=void 0,d.socket.close(),d.socket=void 0,
d._machine.transition("waiting")});this._machine=new b.Machine("initialized",e,{initializedPre:function(){d.compulsorySecure=d.options.encrypted;d.key=a;d.socket=null;d.socket_id=null;d.state="initialized"},waitingPre:function(){d.connectionWait>0&&d.emit("connecting_in",d.connectionWait);d.netInfo.isOnLine()&&d.connectionAttempts<=4?j("connecting"):j("unavailable");if(d.netInfo.isOnLine())d._waitingTimer=setTimeout(function(){d._machine.transition("connecting")},v())},waitingExit:function(){clearTimeout(d._waitingTimer)},
connectingPre:function(){if(d.netInfo.isOnLine()===!1)d._machine.transition("waiting"),j("unavailable");else{var a;a=b.ws_port;var c="ws://";if(d.connectionSecure||document.location.protocol==="https:")a=b.wss_port,c="wss://";a=c+b.host+":"+a+"/app/"+d.key+"?protocol=5&client=js&version="+b.VERSION+"&flash="+(b.TransportType==="flash"?"true":"false");b.debug("Connecting",a);d.socket=new b.Transport(a);d.socket.onopen=w;d.socket.onclose=n;d.socket.onerror=o;d._connectingTimer=setTimeout(m,d.openTimeout)}},
connectingExit:function(){clearTimeout(d._connectingTimer);d.socket.onopen=void 0},connectingToWaiting:function(){k()},connectingToImpermanentlyClosing:function(){k()},openPre:function(){d.socket.onmessage=x;d.socket.onerror=o;d.socket.onclose=n;d._openTimer=setTimeout(m,d.connectedTimeout)},openExit:function(){clearTimeout(d._openTimer);d.socket.onmessage=void 0},openToWaiting:function(){k()},openToImpermanentlyClosing:function(){k()},connectedPre:function(a){d.socket_id=a;d.socket.onmessage=y;d.socket.onerror=
o;d.socket.onclose=n;c(d);d.connectedAt=(new Date).getTime();p()},connectedPost:function(){j("connected")},connectedExit:function(){d._activityTimer&&clearTimeout(d._activityTimer);j("disconnected")},impermanentlyClosingPost:function(){if(d.socket)d.socket.onclose=n,d.socket.close()},permanentlyClosingPost:function(){d.socket?(d.socket.onclose=function(){c(d);d._machine.transition("permanentlyClosed")},d.socket.close()):(c(d),d._machine.transition("permanentlyClosed"))},failedPre:function(){j("failed");
b.debug("WebSockets are not available in this browser.")},permanentlyClosedPost:function(){j("disconnected")}})}var b=this.Pusher,e={initialized:["waiting","failed"],waiting:["connecting","permanentlyClosed"],connecting:["open","permanentlyClosing","impermanentlyClosing","waiting"],open:["connected","permanentlyClosing","impermanentlyClosing","waiting"],connected:["permanentlyClosing","waiting"],impermanentlyClosing:["waiting","permanentlyClosing"],permanentlyClosing:["permanentlyClosed"],permanentlyClosed:["waiting",
"failed"],failed:["permanentlyClosed"]},g=2E3,f=2E3,h=2E3,s=5*g,t=5*f,u=5*h;a.prototype.connect=function(){!this._machine.is("failed")&&!b.Transport?this._machine.transition("failed"):this._machine.is("initialized")?(c(this),this._machine.transition("waiting")):this._machine.is("waiting")&&this.netInfo.isOnLine()===!0?this._machine.transition("connecting"):this._machine.is("permanentlyClosed")&&(c(this),this._machine.transition("waiting"))};a.prototype.send=function(a){if(this._machine.is("connected")){var b=
this;setTimeout(function(){b.socket.send(a)},0);return!0}else return!1};a.prototype.send_event=function(a,c,e){a={event:a,data:c};e&&(a.channel=e);b.debug("Event sent",a);return this.send(JSON.stringify(a))};a.prototype.disconnect=function(){this._machine.is("permanentlyClosed")||(this._machine.is("waiting")||this._machine.is("failed")?this._machine.transition("permanentlyClosed"):this._machine.transition("permanentlyClosing"))};b.Util.extend(a.prototype,b.EventsDispatcher.prototype);this.Pusher.Connection=
a}).call(this);
(function(){Pusher.Channels=function(){this.channels={}};Pusher.Channels.prototype={add:function(a,b){var c=this.find(a);c||(c=Pusher.Channel.factory(a,b),this.channels[a]=c);return c},find:function(a){return this.channels[a]},remove:function(a){delete this.channels[a]},disconnect:function(){for(var a in this.channels)this.channels[a].disconnect()}};Pusher.Channel=function(a,b){var c=this;Pusher.EventsDispatcher.call(this,function(b){Pusher.debug("No callbacks on "+a+" for "+b)});this.pusher=b;this.name=
a;this.subscribed=!1;this.bind("pusher_internal:subscription_succeeded",function(a){c.onSubscriptionSucceeded(a)})};Pusher.Channel.prototype={init:function(){},disconnect:function(){this.subscribed=!1;this.emit("pusher_internal:disconnected")},onSubscriptionSucceeded:function(){this.subscribed=!0;this.emit("pusher:subscription_succeeded")},authorize:function(a,b,c){return c(!1,{})},trigger:function(a,b){return this.pusher.send_event(a,b,this.name)}};Pusher.Util.extend(Pusher.Channel.prototype,Pusher.EventsDispatcher.prototype);
Pusher.Channel.PrivateChannel={authorize:function(a,b,c){var g=this;return(new Pusher.Channel.Authorizer(this,Pusher.channel_auth_transport,b)).authorize(a,function(a,b){a||g.emit("pusher_internal:authorized",b);c(a,b)})}};Pusher.Channel.PresenceChannel={init:function(){this.members=new c(this)},onSubscriptionSucceeded:function(){this.subscribed=!0}};var c=function(a){var b=this,c=function(){this._members_map={};this.count=0;this.me=null};c.call(this);a.bind("pusher_internal:authorized",function(c){var e=
JSON.parse(c.channel_data);a.bind("pusher_internal:subscription_succeeded",function(c){b._members_map=c.presence.hash;b.count=c.presence.count;b.me=b.get(e.user_id);a.emit("pusher:subscription_succeeded",b)})});a.bind("pusher_internal:member_added",function(c){b.get(c.user_id)===null&&b.count++;b._members_map[c.user_id]=c.user_info;a.emit("pusher:member_added",b.get(c.user_id))});a.bind("pusher_internal:member_removed",function(c){var e=b.get(c.user_id);e&&(delete b._members_map[c.user_id],b.count--,
a.emit("pusher:member_removed",e))});a.bind("pusher_internal:disconnected",function(){c.call(b)})};c.prototype={each:function(a){for(var b in this._members_map)a(this.get(b))},get:function(a){return this._members_map.hasOwnProperty(a)?{id:a,info:this._members_map[a]}:null}};Pusher.Channel.factory=function(a,b){var c=new Pusher.Channel(a,b);a.indexOf("private-")===0?Pusher.Util.extend(c,Pusher.Channel.PrivateChannel):a.indexOf("presence-")===0&&(Pusher.Util.extend(c,Pusher.Channel.PrivateChannel),
Pusher.Util.extend(c,Pusher.Channel.PresenceChannel));c.init();return c}}).call(this);
(function(){Pusher.Channel.Authorizer=function(c,a,b){this.channel=c;this.type=a;this.authOptions=(b||{}).auth||{}};Pusher.Channel.Authorizer.prototype={composeQuery:function(c){var c="&socket_id="+encodeURIComponent(c)+"&channel_name="+encodeURIComponent(this.channel.name),a;for(a in this.authOptions.params)c+="&"+encodeURIComponent(a)+"="+encodeURIComponent(this.authOptions.params[a]);return c},authorize:function(c,a){return Pusher.authorizers[this.type].call(this,c,a)}};Pusher.auth_callbacks={};
Pusher.authorizers={ajax:function(c,a){var b;b=Pusher.XHR?new Pusher.XHR:window.XMLHttpRequest?new window.XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP");b.open("POST",Pusher.channel_auth_endpoint,!0);b.setRequestHeader("Content-Type","application/x-www-form-urlencoded");for(var e in this.authOptions.headers)b.setRequestHeader(e,this.authOptions.headers[e]);b.onreadystatechange=function(){if(b.readyState==4)if(b.status==200){var c,e=!1;try{c=JSON.parse(b.responseText),e=!0}catch(h){a(!0,"JSON returned from webapp was invalid, yet status code was 200. Data was: "+
b.responseText)}e&&a(!1,c)}else Pusher.warn("Couldn't get auth info from your webapp",b.status),a(!0,b.status)};b.send(this.composeQuery(c));return b},jsonp:function(c,a){this.authOptions.headers!==void 0&&Pusher.warn("Warn","To send headers with the auth request, you must use AJAX, rather than JSONP.");var b=document.createElement("script");Pusher.auth_callbacks[this.channel.name]=function(b){a(!1,b)};b.src=Pusher.channel_auth_endpoint+"?callback="+encodeURIComponent("Pusher.auth_callbacks['"+this.channel.name+
"']")+this.composeQuery(c);var e=document.getElementsByTagName("head")[0]||document.documentElement;e.insertBefore(b,e.firstChild)}}}).call(this);
var _require=function(){function c(a,c){document.addEventListener?a.addEventListener("load",c,!1):a.attachEvent("onreadystatechange",function(){(a.readyState=="loaded"||a.readyState=="complete")&&c()})}function a(a,e){var g=document.getElementsByTagName("head")[0],f=document.createElement("script");f.setAttribute("src",a);f.setAttribute("type","text/javascript");f.setAttribute("async",!0);c(f,function(){e()});g.appendChild(f)}return function(b,c){for(var g=0,f=0;f<b.length;f++)a(b[f],function(){b.length==
++g&&setTimeout(c,0)})}}();
(function(){!window.WebSocket&&window.MozWebSocket&&(window.WebSocket=window.MozWebSocket);if(window.WebSocket)Pusher.Transport=window.WebSocket,Pusher.TransportType="native";var c=(document.location.protocol=="http:"?Pusher.cdn_http:Pusher.cdn_https)+Pusher.VERSION,a=[];window.JSON||a.push(c+"/json2"+Pusher.dependency_suffix+".js");if(!window.WebSocket)window.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION=!0,a.push(c+"/flashfallback"+Pusher.dependency_suffix+".js");var b=function(){return window.WebSocket?function(){Pusher.ready()}:
function(){window.WebSocket?(Pusher.Transport=window.WebSocket,Pusher.TransportType="flash",window.WEB_SOCKET_SWF_LOCATION=c+"/WebSocketMain.swf",WebSocket.__addTask(function(){Pusher.ready()}),WebSocket.__initialize()):(Pusher.Transport=null,Pusher.TransportType="none",Pusher.ready())}}(),e=function(a){var b=function(){document.body?a():setTimeout(b,0)};b()},g=function(){e(b)};a.length>0?_require(a,g):g()})();

define("libs/pusher", function(){});

define('settings',[], function(){
	return {
		applicationKey : "1234567890",
		authenticationCheckUrl : "http://localhost:5000/auth/check/",
		channelResolutionUrl : "http://localhost:5000/auth/channel/resolve/",
		pusherAuthEndpoint : 'http://localhost:5000/pusher/auth/', 
		pusherApplicationKey : "0b6ee8539603f52808dd",
		actionEventName : "client-action",
		loginUrl : "http://localhost:5000/auth/login/"
	};
});
define('oats/Channel',["libs/pusher","settings"], function(Pusher, settings){

	var localMessageFilter = function(message){ return message.destination === "oats"; };
	var localMessageBuilder = function(message){ return { data : data, destination : "oats"}; };


	function LocalSender(){}

	LocalSender.prototype = {
		send : function(data){
			window.postMessage(localMessageBuilder(data), "*");
		}
	};


	function LocalReceiver(){
		var that = this;
		window.addEventListener("message", function(event) {
			console.log("[LOCAL RECEIVER] got message", event);

		    //alert("local receiver got a message");
		    if (event.source != window) return;
			//console.log("Background script received:", event);
		  	if(localMessageFilter(event.data)){
		  		that.onReceive(event.data);
		  	}
			
		}, false);
	}

	LocalReceiver.prototype = {
		onReceive : function(data){}
	};


	function __getPusher(){
		   	// Enable pusher logging - don't include this in production
		  	Pusher.log = function(message) {
		    	if (window.console && window.console.log) window.console.log(message);
		  	};

		  	Pusher.channel_auth_endpoint = settings.pusherAuthEndpoint;

  			// Flash fallback logging - don't include this in production
  			WEB_SOCKET_DEBUG = true;
			return new Pusher(settings.pusherApplicationKey);
    
	}

	function RemoteSender(channelName){
		var pusher = __getPusher();
		
		this.channel = pusher.subscribe("presence-" + channelName);

		this.channel.bind('pusher:subscription_succeeded', function() {
			console.log("pusher initiailized OK");
		});

		this.channel.bind('pusher:subscription_error', function(status) {
			console.error("pusher scubscription error", status);
		});
	}

	RemoteSender.prototype = {
		send : function(data){
			this.channel.trigger(settings.actionEventName, data);
		},

		onReady : function(){},
		onError : function(){}
		
	};

	function RemoteReceiver(channelName){
		var pusher = __getPusher();
		var that = this;

		this.channel = pusher.subscribe("presence-" + channelName); 
		
		this.channel.bind(settings.actionEventName, function(data) {
        	that.onReceive(data);
        });

        this.channel.bind('pusher:subscription_succeeded', function() {
			console.log("pusher initiailized OK");
			
			//trigger onSubscribersChanged with a list of subscribers on this channel
			if(typeof that.onSubscribersChanged !== 'undefined'){
				that.onSubscribersChanged(that.getSubscribers());
			}

			if(typeof that.onReady !== 'undefined'){
				that.onReady();
			}else{
				console.error("onReady is not defined");
			}
		});

		this.channel.bind('pusher:subscription_error', function(status) {
			console.error("pusher scubscription error", status);
			if(typeof that.onError !== 'undefined'){
				that.onError();
			}
		});

		this.channel.bind('pusher:member_added', function(member) {
			if(typeof that.onSubscribersChanged !== 'undefined'){
				that.onSubscribersChanged(that.getSubscribers());
			}
		});

		this.channel.bind('pusher:member_removed', function(member) {
			if(typeof that.onSubscribersChanged !== 'undefined'){
				that.onSubscribersChanged(that.getSubscribers());
			}
		});
	}

	RemoteReceiver.prototype = {
		onReady : function(){},
		onError : function(){},
		onReceive : function(data){},
		onSubscribersChanged : function(subscribers){},
		getSubscribers : function(){
			console.log("enumerating members", this.channel.members);

			var me = this.channel.members.me;
			var members = [];

			this.channel.members.each(function(member) {
			  
			  if(me){
			  	if(member.id != me.id){
			  		members.push(member);	
			  	}
			  } else {
			  	members.push(member);
			  }
			});

			return members;
		}
	};

	return {
		LocalSender : LocalSender,
		LocalReceiver : LocalReceiver,

		RemoteSender : RemoteSender,
		RemoteReceiver : RemoteReceiver
	};

});






	




	


define('oats/Catcher',["./Channel"], function(Channels){

	function Catcher(){
		var that = this;

		this.channel =  new Channels.LocalReceiver();

		this.channel.onReceive = function(data){
			console.log("got data", data);

			that.onEvent(data);

			switch(data.action){
				case "swipe-left":
					that.onSwipeLeft();
					break;

				case "swipe-right":
					that.onSwipeRight();
					break;

				case "swipe-up":
					that.onSwipeUp();
					break;

				case "swipe-down":
					that.onSwipeDown();
					break;

				case "tap":
					that.onTap();
					break;

				case "drag-start":
					if(typeof that.onDragStart !== 'undefined'){
						that.onDragStart(data.dx,data.dy);
					}
					break;

				case "drag-end":
					if(typeof that.onDragEnd !== 'undefined'){
						that.onDragEnd(data.dx,data.dy);
					}
					break;

				case "dragging":
					if(typeof that.onDragging !== 'undefined'){
						that.onDragging(data.dx,data.dy);
					}
					break;
			}
		};
	}


	Catcher.prototype = {
		onEvent : function(data){},
		onSwipeLeft : function(){},
		onSwipeRight : function(){},
		onSwipeUp : function(){},
		onSwipeDown : function(){},
		onDragStart : function(dx, dy){},
		onDragEnd : function(dx, dy){},
		onDragging : function(dx, dy){},
		onTap : function(){},
	};

	return Catcher;

});
define('oats/ClientBootstrap',[], function(){

	var settings = {
		extensionCheckTimeout : 3000 //3 sec
	};

	function isExtensionInstalled(){
		return document.getElementById("remoats-plugin-installed") != null;
	}


	function getExtensionId(){
		var el = document.getElementById("remoats-plugin-installed");
		return el != null ? el.getAttribute("data-extension-id") : null; 
	}
	
	function InstallExtensionPrompt(){
		this.promptStyleString = "position: fixed;left: 0;right: 0;bottom: 0;z-index: 10000;border-top: solid 1px #CCC;padding: 5px;";
		this.promptContent = '<p>You can use Remoats to control this site remotely from your phone. <a id="btn-install-extension" href="#">Enable Remoats</a></p>';
	}

	InstallExtensionPrompt.prototype = {

		render : function(){
			var prompt  = document.createElement("div");
			prompt.setAttribute("style", this.promptStyleString);
			prompt.innerHTML = this.promptContent;
			document.body.insertBefore(prompt, document.body.firstChild);

			document.getElementById("btn-install-extension").addEventListener("click", function(){
				prompt.innerHTML = "<p>once extension is installed, please refresh your browser</p>";
			}, false);

		}	

	};

	function Bootstrap(){ }

	Bootstrap.prototype = {

		check : function(){
			var that = this;
			setTimeout(function(){
				if(isExtensionInstalled()){
					that.registerClient();
					that.onReady();
				} else {
					new InstallExtensionPrompt().render();
				}
			}, settings.extensionCheckTimeout);
		},

		registerClient : function(){
			window.postMessage({message_type : "oats.register.client"}, "*");
		},

		onReady : function(){
          	//this.registerClient();
    	}

	};

	return Bootstrap;
});
define('oats/Client',["./Catcher", "./ClientBootstrap", "settings"], 
	function(Catcher,ClientBootstrap,settings){
		
		function Client(applicationKey){
			
			var that = this;
			var that = this;
			var bootstrap = new ClientBootstrap();
			bootstrap.onReady = function(){
				that.__setupCatcher();
			};
			bootstrap.check();
			
		}

		Client.prototype = {

			__setupCatcher : function(channelName){
				this.catcher = new Catcher(channelName, this.remote);
				this.catcher.onSwipeLeft = this.onSwipeLeft;
				this.catcher.onSwipeRight = this.onSwipeRight;
				this.catcher.onSwipeUp = this.onSwipeUp;
				this.catcher.onSwipeDown = this.onSwipeDown;
				this.catcher.onDragStart = this.onDragStart;
				this.catcher.onDragEnd = this.onDragEnd;
				this.catcher.onDragging = this.onDragging;
				this.catcher.onTap = this.onTap;
				this.catcher.onEvent = this.onEvent;
			},

			onNotAuthenticated : function(){ alert("please log in"); },
			onEvent : function(data){ },
			onSwipeLeft : function() { },
	        onSwipeRight : function(){ },
	        onSwipeUp : function(){ },
	        onSwipeDown : function(){ },
	        onDragStart : function(dx, dy){},
			onDragEnd : function(dx, dy){},
			onDragging : function(dx, dy){},
	        onTap : function() { },
		};
	
		return Client;

	}
);    return require("oats/Client");
}));