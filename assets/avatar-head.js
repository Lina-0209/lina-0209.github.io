(() => {
  'use strict';

  // The mesh uses the original, unmodified portrait as its texture. At zero
  // rotation, its orthographic projection reproduces that texture pixel for pixel.
  const scriptURL = document.currentScript?.src || document.baseURI;
  const textureURL = new URL('nan-li-avatar-sprite.png', scriptURL).href;
  const VIEW_SIZE = 627;
  const MESH_HEIGHT = 370;
  const COLUMNS = 64;
  const ROWS = 38;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const smoothstep = (low, high, value) => {
    const progress = clamp((value - low) / (high - low), 0, 1);
    return progress * progress * (3 - 2 * progress);
  };

  const vertexSource = `
    attribute vec3 aPosition;
    uniform vec3 uAngles;
    varying vec2 vSource;
    void main() {
      vSource = aPosition.xy;
      vec3 p = aPosition - vec3(313.0, 328.0, 0.0);
      float cy = cos(uAngles.x), sy = sin(uAngles.x);
      float cp = cos(uAngles.y), sp = sin(uAngles.y);
      float cr = cos(uAngles.z), sr = sin(uAngles.z);
      // Positive yaw looks right; positive pitch looks down; roll is clockwise.
      float x = p.x * cy + p.z * sy;
      float z = -p.x * sy + p.z * cy;
      float y = p.y * cp + z * sp;
      z = -p.y * sp + z * cp;
      vec2 position = vec2(x * cr - y * sr, x * sr + y * cr);
      position += vec2(313.0, 328.0);
      gl_Position = vec4(position.x / 627.0 * 2.0 - 1.0,
                         1.0 - position.y / 627.0 * 2.0,
                         -z / 700.0, 1.0);
    }
  `;

  const fragmentSource = `
    precision mediump float;
    uniform sampler2D uTexture;
    uniform vec2 uEye;
    varying vec2 vSource;

    vec4 portrait(vec2 p) {
      return texture2D(uTexture, (p + vec2(37.5, 13.0)) / 1254.0);
    }

    vec3 eyeColor(vec3 original, vec2 center) {
      vec2 p = vSource - center;
      float windowDistance = length(p / vec2(18.0, 19.0));
      float eyeWindow = 1.0 - smoothstep(0.89, 1.0, windowDistance);
      vec2 displacement = uEye * vec2(9.0, 6.0);
      float movement = smoothstep(0.03, 0.65, length(displacement));
      if (eyeWindow < 0.001 || movement < 0.001) return original;

      // Keep the eyelid and the white-of-eye window fixed on the face. Only
      // the iris sampling moves, with slight foreshortening near its extremes.
      vec2 compression = vec2(1.0 - 0.09 * abs(uEye.x),
                              1.0 - 0.05 * abs(uEye.y));
      vec2 shifted = (p - displacement) / compression;
      float oldIris = 1.0 - smoothstep(0.91, 1.0,
        length(p / vec2(14.5, 15.0)));
      float newIris = 1.0 - smoothstep(0.91, 1.0,
        length(shifted / vec2(14.5, 15.0)));
      float rim = smoothstep(0.25, 1.0, windowDistance);
      float upperShade = (1.0 - smoothstep(-18.0, -4.0, p.y)) * 0.035;
      vec3 white = mix(vec3(0.972, 0.941, 0.899),
                       vec3(0.865, 0.809, 0.747), rim * 0.43);
      white -= vec3(upperShade);
      vec3 result = mix(original, white, oldIris);
      vec3 iris = portrait(center + shifted).rgb;
      result = mix(result, iris, newIris);
      return mix(original, result, eyeWindow * movement);
    }

    void main() {
      vec4 color = portrait(vSource);
      if (color.a < 0.01) discard;
      color.rgb = eyeColor(color.rgb, vec2(263.5, 222.0));
      color.rgb = eyeColor(color.rgb, vec2(364.5, 221.0));

      float lowerFade = 1.0 - smoothstep(295.0, 350.0, vSource.y);
      float neck = smoothstep(277.0, 282.0, vSource.x)
        * (1.0 - smoothstep(346.0, 351.0, vSource.x))
        * (1.0 - smoothstep(327.0, 332.0, vSource.y));
      color.a *= max(lowerFade, neck);
      if (color.a < 0.01) discard;
      gl_FragColor = color;
    }
  `;

  function headDepth(x, y) {
    const faceRadius = ((x - 313) / 121) ** 2 + ((y - 214) / 119) ** 2;
    const hairRadius = ((x - 313) / 177) ** 2 + ((y - 172) / 173) ** 2;
    const face = 118 * Math.sqrt(Math.max(0, 1 - faceRadius));
    const hair = 57 * Math.sqrt(Math.max(0, 1 - hairRadius));
    // A smooth maximum joins the cheek volume and the broader hair volume.
    const volume = (face + hair + Math.sqrt((face - hair) ** 2 + 100)) / 2;
    const nose = 24 * Math.exp(-(((x - 313) / 18) ** 2 + ((y - 255) / 24) ** 2));
    return (volume + nose) * (1 - smoothstep(300, 350, y));
  }

  function createMesh() {
    const vertices = [];
    const indices = [];
    for (let row = 0; row <= ROWS; row += 1) {
      const y = row / ROWS * MESH_HEIGHT;
      for (let column = 0; column <= COLUMNS; column += 1) {
        const x = column / COLUMNS * VIEW_SIZE;
        vertices.push(x, y, headDepth(x, y));
      }
    }
    for (let row = 0; row < ROWS; row += 1) {
      for (let column = 0; column < COLUMNS; column += 1) {
        const a = row * (COLUMNS + 1) + column;
        const b = a + 1;
        const c = a + COLUMNS + 1;
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }
    return { vertices: new Float32Array(vertices), indices: new Uint16Array(indices) };
  }

  function initializeHead() {
    const button = document.querySelector('button[data-avatar]');
    const head = button?.querySelector('.avatar-head');
    if (!head || head.querySelector('.avatar-head-canvas')) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'avatar-head-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(canvas.style, {
      position: 'absolute', inset: '0', width: '100%', height: '100%',
      pointerEvents: 'none'
    });
    canvas.hidden = true;
    head.append(canvas);

    const gl = canvas.getContext('webgl', {
      alpha: true, antialias: true, premultipliedAlpha: true,
      preserveDrawingBuffer: false
    });
    if (!gl) {
      canvas.remove();
      return;
    }

    const state = { yaw: 0, pitch: 0, roll: 0, eyeX: 0, eyeY: 0 };
    const mesh = createMesh();
    const image = new Image();
    let ready = false;
    let program;
    let angleLocation;
    let eyeLocation;
    let texture;
    let vertexBuffer;
    let indexBuffer;

    function fallback() {
      ready = false;
      canvas.hidden = true;
      button.classList.remove('has-volume-head');
    }

    function compile(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        throw new Error('Avatar head shader compilation failed.');
      }
      return shader;
    }

    function prepare() {
      const vertexShader = compile(gl.VERTEX_SHADER, vertexSource);
      const highPrecision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
      const fragmentShader = compile(gl.FRAGMENT_SHADER, highPrecision?.precision
        ? fragmentSource.replace('precision mediump float;', 'precision highp float;')
        : fragmentSource);
      program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error('Avatar head shader linking failed.');
      }
      gl.useProgram(program);
      vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);
      const positionLocation = gl.getAttribLocation(program, 'aPosition');
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
      indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);

      texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.uniform1i(gl.getUniformLocation(program, 'uTexture'), 0);
      angleLocation = gl.getUniformLocation(program, 'uAngles');
      eyeLocation = gl.getUniformLocation(program, 'uEye');
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.enable(gl.BLEND);
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA,
        gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
      ready = true;
      resize();
      if (gl.getError() !== gl.NO_ERROR) throw new Error('Avatar head drawing failed.');
      canvas.hidden = false;
      button.classList.add('has-volume-head');
    }

    function draw() {
      if (!ready || gl.isContextLost()) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(program);
      const radians = Math.PI / 180;
      gl.uniform3f(angleLocation, state.yaw * radians,
        state.pitch * radians, state.roll * radians);
      gl.uniform2f(eyeLocation, state.eyeX, state.eyeY);
      gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);
    }

    function resize() {
      const size = head.getBoundingClientRect().width || button.getBoundingClientRect().width;
      const ratio = Math.min(window.devicePixelRatio || 1, 2.5);
      const pixels = Math.max(1, Math.round(size * ratio));
      if (canvas.width !== pixels || canvas.height !== pixels) {
        canvas.width = pixels;
        canvas.height = pixels;
      }
      draw();
    }

    // Event contract: dispatch on the avatar button (or a bubbling descendant).
    // Angles are degrees; eyeX / eyeY are normalized to [-1, 1].
    button.addEventListener('avatar:gaze', event => {
      const detail = event.detail || {};
      for (const [key, limit] of [['yaw', 24], ['pitch', 14], ['roll', 3],
        ['eyeX', 1], ['eyeY', 1]]) {
        if (Number.isFinite(detail[key])) state[key] = clamp(detail[key], -limit, limit);
      }
      draw();
    });

    canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      fallback();
    });
    canvas.addEventListener('webglcontextrestored', () => {
      try { prepare(); } catch { fallback(); }
    });
    image.addEventListener('load', () => {
      try { prepare(); } catch { fallback(); }
    }, { once: true });
    image.addEventListener('error', fallback, { once: true });
    if (window.ResizeObserver) {
      new ResizeObserver(resize).observe(head);
    } else {
      window.addEventListener('resize', resize, { passive: true });
    }
    image.src = textureURL;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHead, { once: true });
  } else {
    initializeHead();
  }
})();
