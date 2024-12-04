var mapOptions = {
    center: new naver.maps.LatLng(36.3695704, 128.105399),
    zoom: 7
};

var map = new naver.maps.Map('air-tab', mapOptions);


var markers = new naver.maps.Marker({
    position: new naver.maps.LatLng(37.3595704, 127.105399),
    map: map
});











// var htmlMarker1 = {
//     content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/example/images/cluster-marker-1.png);background-size:contain;"></div>',
//     size: N.Size(40, 40),
//     anchor: N.Point(20, 20)
// },
// htmlMarker2 = {
//     content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/example/images/cluster-marker-2.png);background-size:contain;"></div>',
//     size: N.Size(40, 40),
//     anchor: N.Point(20, 20)
// },
// htmlMarker3 = {
//     content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/example/images/cluster-marker-3.png);background-size:contain;"></div>',
//     size: N.Size(40, 40),
//     anchor: N.Point(20, 20)
// },
// htmlMarker4 = {
//     content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/example/images/cluster-marker-4.png);background-size:contain;"></div>',
//     size: N.Size(40, 40),
//     anchor: N.Point(20, 20)
// },
// htmlMarker5 = {
//     content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/example/images/cluster-marker-5.png);background-size:contain;"></div>',
//     size: N.Size(40, 40),
//     anchor: N.Point(20, 20)
// };

// var markerClustering = new MarkerClustering({
//     minClusterSize: 2,
//     maxZoom: 13,
//     map: map,
//     markers: markers,
//     disableClickZoom: false,
//     gridSize: 120,
//     icons: [htmlMarker1, htmlMarker2, htmlMarker3, htmlMarker4, htmlMarker5],
//     indexGenerator: [10, 100, 200, 500, 1000],
//     stylingFunction: function(clusterMarker, count) {
//         $(clusterMarker.getElement()).find('div:first-child').text(count);
//     }
// });
