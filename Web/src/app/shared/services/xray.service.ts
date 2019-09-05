// import { Injectable } from '@angular/core';

// @Injectable()
// export class XRay {
//     crypto: any = window.crypto;

//     constructor(){}

//     getHexId = function(length) {
//         var bytes = new Uint8Array(length);
//         crypto.getRandomValues(bytes);
//        let hex = "";
//         for (var i = 0; i < bytes.length; i++) {
//           hex += bytes[i].toString(16);
//         }
//         return hex.substring(0,length);
//       }
    
//       getHexTime = function() {
//         return Math.round(new Date().getTime() / 1000).toString(16);
//       }

//       getEpochTime = function() {
//         return new Date().getTime()/1000;
//       }

//       getTraceHeader = function(segment) {
//         return "Root=" + segment.trace_id + ";Parent=" + segment.id + ";Sampled=1";
//       }

//       beginSegment = function() {
//         let segment = {trace_id: null, id: null, start_time: null, name: null, in_progress: null, user: null, http: null};
//         var traceId = '1-' + this.getHexTime() + '-' + this.getHexId(24);
    
//         var id = this.getHexId(16);
//         var startTime = this.getEpochTime();
    
//         segment.trace_id = traceId;
//         segment.id = id;
//         segment.start_time = startTime;
//         segment.name = 'Scorekeep-client';
//         segment.in_progress = true;
//         segment.user =  sessionStorage['userid'];
//         segment.http = {
//           request: {
//             url: window.location.href
//           }
//         };
    
//         var documents = [];
//         documents[0] = JSON.stringify(segment);
//         this.putDocuments(documents);
//         return segment;
//       }

//       endSegment = function(segment) {
//         var endTime = this.getEpochTime();
//         segment.end_time = endTime;
//         segment.in_progress = false;
//         var documents = [];
//         documents[0] = JSON.stringify(segment);
//         this.putDocuments(documents);
//       }

//       putDocuments = function(documents) {
//         var xray = new AWS.XRay();
//         var params = {
//           TraceSegmentDocuments: documents
//         };
//         xray.putTraceSegments(params, function(err, data) {
//           if (err) {
//             console.log(err, err.stack);
//           } else {
//             console.log(data);
//           }
//         })
//       }

//       getServiceGraph = function() {
//         var xray = new AWS.XRay();
//         var params = {
//           EndTime: Date.now()/1000,
//           StartTime: Date.now()/1000 - 600
//         };
//         xray.getServiceGraph(params, function(err, data) {
//           if (err) {
//             console.log(err, err.stack);
//           } else {
//             console.log(data);
//             var servicegraph = JSON.stringify(data, null, 2);
//           }
//         })
//       }
// }