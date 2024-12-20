<template>
  <div id="map-container"></div>
</template>

<script>
import HeatmapOverlay from 'heatmap.js/plugins/leaflet-heatmap'
// import hunan from '@/common/hunan.json'
import changsha from '@/common/changsha.json'

export default {
  name: 'Home',
  components: {},
  data() {
    return {
      leafletMap: null,
      marker: null
    }
  },
  mounted() {
    this.initMap()
  },
  created() {},
  methods: {
    // 初始化地图
    initMap() {
      const layer = this.$leaflet.tileLayer(
        'http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
      )
      this.leafletMap = this.$leaflet.map('map-container', {
        center: [28.19854, 112.8347],
        zoom: 10,
        minZoom: 3,
        maxZoom: 14,
        // zoomSnap: 1,
        attributionControl: true, // 是否将 attribution 版权控件添加到地图中
        zoomControl: true, // 是否将 zoom 缩放控件添加到地图中
        crs: this.$leaflet.CRS.EPSG3857, // 该地图使用的坐标系。如果你不确定坐标系这是什么意思，请不要更改它。
        keyboard: true, // 地图是否获得焦点，并且允许用户通过键盘和 +/- 来进行浏览地图。
        keyboardPanDelta: 80, // 按下方向键时，平移的像素数量。
        scrollWheelZoom: 'center', // 地图是否允许通过使用鼠标滚轮进行缩放。如果通过'center'，不管鼠标在哪里，都将会放大到视图的中心。
        layers: [layer] // 图层
      })
      this.addMarker()
      this.addPolyline()
      this.addPolygon()
      this.addPopup()
      this.addAreaColor()
      this.addHeartLayer()
    },
    // 描点
    addMarker() {
      const myIcon = this.$leaflet.icon({
        iconUrl: 'http://pic.616pic.com/ys_img/00/08/06/TnCNKnPVDY.jpg',
        iconSize: [30, 30]
      })
      this.marker = this.$leaflet
        .marker([28.19854, 112.8347], {
          icon: myIcon
        })
        .addTo(this.leafletMap)
      console.log('marker===', this.marker)
    },
    // 画线
    addPolyline() {
      const points = [
        [28.19854, 112.8347],
        [28.29854, 112.4347],
        [28.39854, 112.6347]
      ]
      const polyline = this.$leaflet.polyline(points, { color: 'red' }).addTo(this.leafletMap)
      console.log('polyline===', polyline)
    },
    // 画多边形
    addPolygon() {
      const points = [
        [28.19854, 113.8347],
        [28.29854, 113.4347],
        [28.39854, 113.6347]
      ]
      const polygon = this.$leaflet
        .polygon(points, { color: '#aa0000', fillColor: '#ff15c9', weight: 1 })
        .addTo(this.leafletMap)
      console.log('polygon===', polygon)
    },
    // 绘制弹框
    addPopup() {
      const popup = this.$leaflet
        .popup()
        .setContent('<p style="color:green;">我是hzz!<br />我在长沙</p>')
      this.marker.bindPopup(popup)
    },
    // 绘制区域颜色
    addAreaColor() {
      // 区域样式
      const style = {
        color: '#55ff7f', // 边框颜色
        weight: 3, // 边框粗细
        opacity: 0.5, // 透明度
        fillColor: '#55ff7f', // 区域填充颜色
        fillOpacity: 0.2 // 区域填充颜色的透明
      }
      const s = this.$leaflet.geoJSON(changsha, { style }).addTo(this.leafletMap)
      console.log('addAreaColor===', s)
    },
    addHeartLayer() {
      const testData = {
        max: 8, // 最大值
        data: [
          {
            lat: 28.39854,
            lng: 113.3347,
            count: 5
          },
          {
            lat: 28.38854,
            lng: 113.3447,
            count: 8
          },
          {
            lat: 28.39654,
            lng: 113.3647,
            count: 2
          },
          {
            lat: 28.41854,
            lng: 113.3447,
            count: 7
          },
          {
            lat: 28.52554,
            lng: 113.4247,
            count: 8
          },
          {
            lat: 28.53554,
            lng: 114.4447,
            count: 8
          },
          {
            lat: 28.55554,
            lng: 114.4447,
            count: 8
          },
          {
            lat: 28.91554,
            lng: 113.4147,
            count: 8
          },
          {
            lat: 28.88654,
            lng: 113.3647,
            count: 3
          }
        ]
      }
      // 配置
      const config = {
        radius: 0.015, // 设置每一个热力点的半径
        maxOpacity: 0.8, // 设置最大的不透明度
        minOpacity: 0, // 设置最小的不透明度
        scaleRadius: true, // 设置热力点是否平滑过渡
        useLocalExtrema: false, // 使用局部极值
        latField: 'lat', // 纬度
        lngField: 'lng', // 经度
        valueField: 'count', // 热力点的值
        gradient: {
          // 热力点颜色的变化范围
          0.99: 'rgba(255,0,0,1)',
          0.9: 'rgba(255,255,0,1)',
          0.8: 'rgba(0,255,0,1)',
          0.5: 'rgba(0,255,255,1)',
          0: 'rgba(0,0,255,1)'
        }
      }
      const heatmapLayer = new HeatmapOverlay(config)
      heatmapLayer.setData(testData)
      this.leafletMap.addLayer(heatmapLayer)
    }
  }
}
</script>

<style lang="scss" scoped>
#map-container {
  width: 100%;
  height: 100vh;
}
</style>
