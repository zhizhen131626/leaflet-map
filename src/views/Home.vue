<template>
  <div id="map-container"></div>
</template>

<script>
import hunan from '@/common/hunan.json'

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
      const s = this.$leaflet.geoJSON(hunan, { style }).addTo(this.leafletMap)
      console.log('addAreaColor===', s)
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
