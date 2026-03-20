export const gymPrefab = {
  root: {
    id: "gym-scene",
    children: [
      // === LIGHTING ===
      {
        id: "ambient",
        components: {
          light: { type: "AmbientLight", properties: { color: "#ffeedd", intensity: 0.6 } },
        },
      },
      {
        id: "sun",
        components: {
          transform: { type: "Transform", properties: { position: [10, 20, 10] } },
          light: { type: "DirectionalLight", properties: { color: "#fff5e6", intensity: 1.5, castShadow: true } },
        },
      },
      {
        id: "spot-center",
        components: {
          transform: { type: "Transform", properties: { position: [0, 12, 0] } },
          light: { type: "SpotLight", properties: { color: "#ffffff", intensity: 100, angle: 1.2, penumbra: 0.5, castShadow: true } },
        },
      },

      // === FLOOR ===
      {
        id: "floor",
        components: {
          transform: { type: "Transform", properties: { position: [0, -0.25, 0] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [24, 0.5, 24] } },
          material: { type: "Material", properties: { color: "#3a3a3a", roughness: 0.9 } },
          physics: { type: "Physics", properties: { type: "fixed" } },
        },
      },
      // Rubber mat zones
      {
        id: "mat-barbell",
        components: {
          transform: { type: "Transform", properties: { position: [-6, 0.01, -4] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [4, 0.05, 3] } },
          material: { type: "Material", properties: { color: "#2d2d2d", roughness: 1 } },
        },
      },
      {
        id: "mat-dumbbell",
        components: {
          transform: { type: "Transform", properties: { position: [0, 0.01, -4] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [3, 0.05, 3] } },
          material: { type: "Material", properties: { color: "#2d2d2d", roughness: 1 } },
        },
      },
      {
        id: "mat-kettlebell",
        components: {
          transform: { type: "Transform", properties: { position: [6, 0.01, -4] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [3, 0.05, 3] } },
          material: { type: "Material", properties: { color: "#2d2d2d", roughness: 1 } },
        },
      },
      {
        id: "mat-jumprope",
        components: {
          transform: { type: "Transform", properties: { position: [-6, 0.01, 4] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [4, 0.05, 3] } },
          material: { type: "Material", properties: { color: "#1a3a1a", roughness: 1 } },
        },
      },

      // === WALLS ===
      {
        id: "wall-back",
        components: {
          transform: { type: "Transform", properties: { position: [0, 3, -12] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [24, 6, 0.5] } },
          material: { type: "Material", properties: { color: "#555555", roughness: 0.8 } },
          physics: { type: "Physics", properties: { type: "fixed" } },
        },
      },
      {
        id: "wall-left",
        components: {
          transform: { type: "Transform", properties: { position: [-12, 3, 0] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [0.5, 6, 24] } },
          material: { type: "Material", properties: { color: "#4a4a4a", roughness: 0.8 } },
          physics: { type: "Physics", properties: { type: "fixed" } },
        },
      },
      {
        id: "wall-right",
        components: {
          transform: { type: "Transform", properties: { position: [12, 3, 0] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [0.5, 6, 24] } },
          material: { type: "Material", properties: { color: "#4a4a4a", roughness: 0.8 } },
          physics: { type: "Physics", properties: { type: "fixed" } },
        },
      },

      // === BARBELL STATION (-6, 0, -4) ===
      // Bar - resting on floor via plates
      {
        id: "barbell-bar",
        components: {
          transform: { type: "Transform", properties: { position: [-6, 0.35, -4] } },
          geometry: { type: "Geometry", properties: { geometryType: "cylinder", args: [0.06, 0.06, 3, 8] } },
          material: { type: "Material", properties: { color: "#c0c0c0", metalness: 0.8, roughness: 0.2 } },
        },
      },
      // Plates left - resting on floor (y=0.35)
      {
        id: "barbell-plate-l1",
        components: {
          transform: { type: "Transform", properties: { position: [-7.3, 0.35, -4], rotation: [0, 0, 1.57] } },
          geometry: { type: "Geometry", properties: { geometryType: "cylinder", args: [0.35, 0.35, 0.1, 16] } },
          material: { type: "Material", properties: { color: "#cc2222" } },
        },
      },
      {
        id: "barbell-plate-l2",
        components: {
          transform: { type: "Transform", properties: { position: [-7.45, 0.35, -4], rotation: [0, 0, 1.57] } },
          geometry: { type: "Geometry", properties: { geometryType: "cylinder", args: [0.35, 0.35, 0.1, 16] } },
          material: { type: "Material", properties: { color: "#cc2222" } },
        },
      },
      // Plates right
      {
        id: "barbell-plate-r1",
        components: {
          transform: { type: "Transform", properties: { position: [-4.7, 0.35, -4], rotation: [0, 0, 1.57] } },
          geometry: { type: "Geometry", properties: { geometryType: "cylinder", args: [0.35, 0.35, 0.1, 16] } },
          material: { type: "Material", properties: { color: "#2222cc" } },
        },
      },
      {
        id: "barbell-plate-r2",
        components: {
          transform: { type: "Transform", properties: { position: [-4.55, 0.35, -4], rotation: [0, 0, 1.57] } },
          geometry: { type: "Geometry", properties: { geometryType: "cylinder", args: [0.35, 0.35, 0.1, 16] } },
          material: { type: "Material", properties: { color: "#2222cc" } },
        },
      },
      // Barbell sensor
      {
        id: "sensor-barbell",
        components: {
          transform: { type: "Transform", properties: { position: [-6, 1, -4] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [3.5, 2, 3] } },
          physics: { type: "Physics", properties: { type: "fixed", sensor: true, activeCollisionTypes: "all" } },
        },
      },

      // === DUMBBELL STATION (0, 0, -4) ===
      // Dumbbell rack
      {
        id: "dumbbell-rack",
        components: {
          transform: { type: "Transform", properties: { position: [0, 0.5, -5] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [2.5, 1, 0.5] } },
          material: { type: "Material", properties: { color: "#333333", metalness: 0.6 } },
        },
      },
      // Dumbbells on rack
      {
        id: "dumbbell-1",
        components: {
          transform: { type: "Transform", properties: { position: [-0.6, 1.1, -5] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [0.2, 0.2, 0.6] } },
          material: { type: "Material", properties: { color: "#ff6600" } },
        },
      },
      {
        id: "dumbbell-1-end-a",
        components: {
          transform: { type: "Transform", properties: { position: [-0.6, 1.1, -5.3] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [0.35, 0.35, 0.12] } },
          material: { type: "Material", properties: { color: "#444444" } },
        },
      },
      {
        id: "dumbbell-1-end-b",
        components: {
          transform: { type: "Transform", properties: { position: [-0.6, 1.1, -4.7] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [0.35, 0.35, 0.12] } },
          material: { type: "Material", properties: { color: "#444444" } },
        },
      },
      {
        id: "dumbbell-2",
        components: {
          transform: { type: "Transform", properties: { position: [0.6, 1.1, -5] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [0.2, 0.2, 0.6] } },
          material: { type: "Material", properties: { color: "#ff6600" } },
        },
      },
      {
        id: "dumbbell-2-end-a",
        components: {
          transform: { type: "Transform", properties: { position: [0.6, 1.1, -5.3] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [0.35, 0.35, 0.12] } },
          material: { type: "Material", properties: { color: "#444444" } },
        },
      },
      {
        id: "dumbbell-2-end-b",
        components: {
          transform: { type: "Transform", properties: { position: [0.6, 1.1, -4.7] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [0.35, 0.35, 0.12] } },
          material: { type: "Material", properties: { color: "#444444" } },
        },
      },
      // Dumbbell sensor
      {
        id: "sensor-dumbbell",
        components: {
          transform: { type: "Transform", properties: { position: [0, 1, -4] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [3, 2, 3] } },
          physics: { type: "Physics", properties: { type: "fixed", sensor: true, activeCollisionTypes: "all" } },
        },
      },

      // === KETTLEBELL STATION (6, 0, -4) ===
      {
        id: "kettlebell-body",
        components: {
          transform: { type: "Transform", properties: { position: [6, 0.3, -4] } },
          geometry: { type: "Geometry", properties: { geometryType: "sphere", args: [0.3, 6, 6] } },
          material: { type: "Material", properties: { color: "#1a1a1a" } },
        },
      },
      {
        id: "kettlebell-handle",
        components: {
          transform: { type: "Transform", properties: { position: [6, 0.75, -4] } },
          geometry: { type: "Geometry", properties: { geometryType: "cylinder", args: [0.18, 0.18, 0.08, 8] } },
          material: { type: "Material", properties: { color: "#1a1a1a" } },
        },
      },
      {
        id: "kettlebell-body-2",
        components: {
          transform: { type: "Transform", properties: { position: [6.8, 0.35, -4] } },
          geometry: { type: "Geometry", properties: { geometryType: "sphere", args: [0.35, 6, 6] } },
          material: { type: "Material", properties: { color: "#cc3300" } },
        },
      },
      {
        id: "kettlebell-handle-2",
        components: {
          transform: { type: "Transform", properties: { position: [6.8, 0.85, -4] } },
          geometry: { type: "Geometry", properties: { geometryType: "cylinder", args: [0.2, 0.2, 0.08, 8] } },
          material: { type: "Material", properties: { color: "#222222" } },
        },
      },
      // Kettlebell sensor
      {
        id: "sensor-kettlebell",
        components: {
          transform: { type: "Transform", properties: { position: [6, 1, -4] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [3, 2, 3] } },
          physics: { type: "Physics", properties: { type: "fixed", sensor: true, activeCollisionTypes: "all" } },
        },
      },

      // === JUMP ROPE STATION (-6, 0, 4) ===
      // Rope handles
      {
        id: "jumprope-handle-l",
        components: {
          transform: { type: "Transform", properties: { position: [-6.5, 0.2, 4] } },
          geometry: { type: "Geometry", properties: { geometryType: "cylinder", args: [0.06, 0.06, 0.4, 6] } },
          material: { type: "Material", properties: { color: "#ff4488" } },
        },
      },
      {
        id: "jumprope-handle-r",
        components: {
          transform: { type: "Transform", properties: { position: [-5.5, 0.2, 4] } },
          geometry: { type: "Geometry", properties: { geometryType: "cylinder", args: [0.06, 0.06, 0.4, 6] } },
          material: { type: "Material", properties: { color: "#ff4488" } },
        },
      },
      // Rope (coiled on floor)
      {
        id: "jumprope-rope",
        components: {
          transform: { type: "Transform", properties: { position: [-6, 0.05, 4], rotation: [1.57, 0, 0] } },
          geometry: { type: "Geometry", properties: { geometryType: "cylinder", args: [0.6, 0.6, 0.03, 12] } },
          material: { type: "Material", properties: { color: "#222222" } },
        },
      },
      // Jump rope sensor
      {
        id: "sensor-jumprope",
        components: {
          transform: { type: "Transform", properties: { position: [-6, 1, 4] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [4, 2, 3] } },
          physics: { type: "Physics", properties: { type: "fixed", sensor: true, activeCollisionTypes: "all" } },
        },
      },

      // === PULL-UP BAR (4, 0, 4) ===
      // Uprights
      {
        id: "pullup-post-l",
        components: {
          transform: { type: "Transform", properties: { position: [3, 2, 4] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [0.2, 4, 0.2] } },
          material: { type: "Material", properties: { color: "#222222", metalness: 0.7 } },
        },
      },
      {
        id: "pullup-post-r",
        components: {
          transform: { type: "Transform", properties: { position: [5, 2, 4] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [0.2, 4, 0.2] } },
          material: { type: "Material", properties: { color: "#222222", metalness: 0.7 } },
        },
      },
      // Bar
      {
        id: "pullup-bar",
        components: {
          transform: { type: "Transform", properties: { position: [4, 4, 4] } },
          geometry: { type: "Geometry", properties: { geometryType: "cylinder", args: [0.06, 0.06, 2.2, 8] } },
          material: { type: "Material", properties: { color: "#c0c0c0", metalness: 0.9, roughness: 0.1 } },
        },
      },
      // Pull-up sensor
      {
        id: "sensor-pullup",
        components: {
          transform: { type: "Transform", properties: { position: [4, 1, 4] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [3, 2, 2.5] } },
          physics: { type: "Physics", properties: { type: "fixed", sensor: true, activeCollisionTypes: "all" } },
        },
      },

      // === RINGS STATION (4, 0, 8) ===
      // Frame
      {
        id: "rings-frame-l",
        components: {
          transform: { type: "Transform", properties: { position: [3, 2.5, 8] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [0.2, 5, 0.2] } },
          material: { type: "Material", properties: { color: "#222222", metalness: 0.7 } },
        },
      },
      {
        id: "rings-frame-r",
        components: {
          transform: { type: "Transform", properties: { position: [5, 2.5, 8] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [0.2, 5, 0.2] } },
          material: { type: "Material", properties: { color: "#222222", metalness: 0.7 } },
        },
      },
      {
        id: "rings-frame-top",
        components: {
          transform: { type: "Transform", properties: { position: [4, 5, 8] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [2.4, 0.2, 0.2] } },
          material: { type: "Material", properties: { color: "#222222", metalness: 0.7 } },
        },
      },
      // Straps
      {
        id: "ring-strap-l",
        components: {
          transform: { type: "Transform", properties: { position: [3.6, 3.5, 8] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [0.05, 2.8, 0.05] } },
          material: { type: "Material", properties: { color: "#ffcc00" } },
        },
      },
      {
        id: "ring-strap-r",
        components: {
          transform: { type: "Transform", properties: { position: [4.4, 3.5, 8] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [0.05, 2.8, 0.05] } },
          material: { type: "Material", properties: { color: "#ffcc00" } },
        },
      },
      // Rings (approximated as cylinders) - hanging vertically
      {
        id: "ring-l",
        components: {
          transform: { type: "Transform", properties: { position: [3.6, 2.0, 8] } },
          geometry: { type: "Geometry", properties: { geometryType: "cylinder", args: [0.18, 0.18, 0.05, 12] } },
          material: { type: "Material", properties: { color: "#dddddd", metalness: 0.5 } },
        },
      },
      {
        id: "ring-r",
        components: {
          transform: { type: "Transform", properties: { position: [4.4, 2.0, 8] } },
          geometry: { type: "Geometry", properties: { geometryType: "cylinder", args: [0.18, 0.18, 0.05, 12] } },
          material: { type: "Material", properties: { color: "#dddddd", metalness: 0.5 } },
        },
      },
      // Rings sensor
      {
        id: "sensor-rings",
        components: {
          transform: { type: "Transform", properties: { position: [4, 1, 8] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [3, 2, 2.5] } },
          physics: { type: "Physics", properties: { type: "fixed", sensor: true, activeCollisionTypes: "all" } },
        },
      },

      // === DECORATIONS ===
      // Gym sign on back wall
      {
        id: "wall-stripe",
        components: {
          transform: { type: "Transform", properties: { position: [0, 4.5, -11.7] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [10, 0.3, 0.1] } },
          material: { type: "Material", properties: { color: "#ff4444" } },
        },
      },
      // Chalk bucket
      {
        id: "chalk-bucket",
        components: {
          transform: { type: "Transform", properties: { position: [-10, 0.4, -10] } },
          geometry: { type: "Geometry", properties: { geometryType: "cylinder", args: [0.3, 0.25, 0.7, 6] } },
          material: { type: "Material", properties: { color: "#eeeeee" } },
        },
      },
      // Timer board
      {
        id: "timer-board",
        components: {
          transform: { type: "Transform", properties: { position: [0, 4, -11.7] } },
          geometry: { type: "Geometry", properties: { geometryType: "box", args: [3, 1.5, 0.1] } },
          material: { type: "Material", properties: { color: "#111111" } },
        },
      },
      // Water bottle
      {
        id: "water-bottle",
        components: {
          transform: { type: "Transform", properties: { position: [10, 0.3, -10] } },
          geometry: { type: "Geometry", properties: { geometryType: "cylinder", args: [0.1, 0.1, 0.5, 6] } },
          material: { type: "Material", properties: { color: "#4488ff" } },
        },
      },
    ],
  },
};
