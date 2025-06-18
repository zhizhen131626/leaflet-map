export default {
  methods: {
    /**
     * 判断点是否在矩形内
     * @param {Point} point 点对象
     * @param {Bounds} bounds 矩形边界对象
     * @returns {Boolean} 点在矩形内返回true,否则返回false
     */
    isPointInRect(point, bounds) {
      const sw = bounds.getSouthWest() // 西南脚点
      const ne = bounds.getNorthEast() // 东北脚点
      return (
        point.lng >= sw.lng && point.lng <= ne.lng && point.lat >= sw.lat && point.lat <= ne.lat
      )
    },
    /**
     * 判断点是否多边形内
     * @param {Point} point 点对象
     * @param {Polyline} polygon 多边形对象
     * @returns {Boolean} 点在多边形内返回true,否则返回false
     */
    isPointInPolygon(point, polygon) {
      // 首先判断点是否在多边形的外包矩形内，如果在，则进一步判断，否则返回false
      const polygonBounds = polygon.getBounds()
      if (!this.isPointInRect(point, polygonBounds)) {
        return false
      }

      const pts = polygon.getLatLngs()[0] // 获取多边形点

      // 下述代码来源：http://paulbourke.net/geometry/insidepoly/，进行了部分修改
      // 基本思想是利用射线法，计算射线与多边形各边的交点，如果是偶数，则点在多边形外，否则
      // 在多边形内。还会考虑一些特殊情况，如点在多边形顶点上，点在多边形边上等特殊情况。
      const N = pts.length
      const boundOrVertex = true // 如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
      let intersectCount = 0 // cross points count of x
      const precision = 2e-10 // 浮点类型计算时候与0比较时候的容差
      let p1 = pts[0] // left vertex
      let p2 = null // neighbour bound vertices
      const p = point // 测试点

      for (let i = 1; i <= N; i += 1) {
        // check all rays
        if (p.equals(p1)) {
          return boundOrVertex // p is an vertex
        }

        p2 = pts[i % N] // right vertex
        if (p.lat < Math.min(p1.lat, p2.lat) || p.lat > Math.max(p1.lat, p2.lat)) {
          // ray is outside of our interests
          p1 = p2
        }

        if (p.lat > Math.min(p1.lat, p2.lat) && p.lat < Math.max(p1.lat, p2.lat)) {
          // ray is crossing over by the algorithm (common part of)
          if (p.lng <= Math.max(p1.lng, p2.lng)) {
            // x is before of ray
            if (p1.lat === p2.lat && p.lng >= Math.min(p1.lng, p2.lng)) {
              // overlies on a horizontal ray
              return boundOrVertex
            }

            if (p1.lng === p2.lng) {
              // ray is vertical
              if (p1.lng === p.lng) {
                // overlies on a vertical ray
                return boundOrVertex
              }
              intersectCount += 1
            } else {
              // cross point on the left side
              const xinters = ((p.lat - p1.lat) * (p2.lng - p1.lng)) / (p2.lat - p1.lat) + p1.lng // cross point of lng
              if (Math.abs(p.lng - xinters) < precision) {
                // overlies on a ray
                return boundOrVertex
              }

              if (p.lng < xinters) {
                // before ray
                intersectCount += 1
              }
            }
          }
        } else if (p.lat === p2.lat && p.lng <= p2.lng) {
          // special case when ray is crossing through the vertex
          //  {
          // p crossing over p2
          const p3 = pts[(i + 1) % N] // next vertex
          if (p.lat >= Math.min(p1.lat, p3.lat) && p.lat <= Math.max(p1.lat, p3.lat)) {
            // p.lat lies between p1.lat & p3.lat
            intersectCount += 1
          } else {
            intersectCount += 2
          }
          // }
        }
        p1 = p2 // next ray left point
      }

      if (intersectCount % 2 === 0) {
        // 偶数在多边形外
        return false
      }
      // 奇数在多边形内
      return true
    }
  }
}
